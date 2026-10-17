import { Router } from 'express';
import { SEED_UNITS } from '../../../../prisma/seed';
import {
  calculateSM2,
  updateStreakWithTimezone,
  getFormattedDateInTimezone,
} from '../../../../packages/domain/src/index.js';
import { prisma } from '../lib/prisma.js';
import { userRepository } from '../repositories/user.repository.js';
import { vocabularyRepository } from '../repositories/vocabulary.repository.js';

export const srsRouter = Router();

srsRouter.get('/queue', async (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';

  try {
    // 1. Fetch user states from PostgreSQL
    const userStates = await vocabularyRepository.getUserWordStates(userId);
    const stateMap = new Map(userStates.map((s) => [s.wordId, s]));

    // 2. Fetch vocabulary from DB or SEED_UNITS
    let allWords: any[] = [];
    const dbVocabs = await prisma.vocabulary.findMany({ take: 100 });
    if (dbVocabs.length > 0) {
      allWords = dbVocabs.map((v) => ({
        id: v.id,
        wordId: v.id,
        targetText: v.targetText,
        translation: v.translation,
        phonetic: v.phonetic,
        imageUrl: null,
        exampleSentence: v.exampleSentence,
        exampleTranslation: v.exampleTranslation,
        cefrLevel: v.cefrLevel || 'A1',
      }));
    } else {
      allWords = SEED_UNITS.flatMap((u) => u.lessons.flatMap((l) => l.words)).map((w, idx) => ({
        id: `vocab-${idx + 1}`,
        wordId: `vocab-${idx + 1}`,
        targetText: w.targetText,
        translation: w.translation,
        phonetic: w.phonetic,
        imageUrl: (w as any).imageUrl,
        exampleSentence: w.exampleSentence,
        exampleTranslation: w.exampleTranslation,
        cefrLevel: w.cefrLevel || 'A1',
      }));
    }

    // 3. Build queue with SM-2 states
    const queue = allWords.map((w) => {
      const existingState = stateMap.get(w.wordId);
      return {
        id: w.id,
        wordId: w.wordId,
        targetText: w.targetText,
        translation: w.translation,
        phonetic: w.phonetic,
        imageUrl: w.imageUrl,
        exampleSentence: w.exampleSentence,
        exampleTranslation: w.exampleTranslation,
        cefrLevel: w.cefrLevel,
        interval: existingState?.interval || 1,
        repetition: existingState?.repetition || 0,
        efactor: existingState?.efactor || 2.5,
        dueDate: existingState?.dueDate ? new Date(existingState.dueDate).toISOString() : new Date().toISOString(),
      };
    });

    const now = new Date();
    const dueQueue = queue.filter((item) => new Date(item.dueDate) <= now);

    const mastered = queue.filter((item) => item.repetition >= 3).length;
    const learning = queue.filter((item) => item.repetition > 0 && item.repetition < 3).length;
    const newWords = queue.filter((item) => item.repetition === 0).length;

    const sessionQueue = dueQueue.length > 0 ? dueQueue.slice(0, 20) : queue.slice(0, 10);

    return res.json({
      queue: sessionQueue,
      stats: {
        dueToday: dueQueue.length,
        learning,
        mastered,
        newWords,
        totalWords: queue.length,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi tải danh sách ôn tập SRS' });
  }
});

srsRouter.post('/review', async (req, res) => {
  const { wordId, quality, userId = 'demo-user-id-001' } = req.body;

  // Validation: Quality score must be an integer between 0 and 5
  if (typeof quality !== 'number' || quality < 0 || quality > 5 || !Number.isInteger(quality)) {
    return res.status(400).json({ error: 'Chỉ số quality phải là số nguyên từ 0 đến 5' });
  }

  let user = await userRepository.findById(userId);
  if (!user) {
    user = await userRepository.createUser({
      id: userId,
      email: `${userId}@lingual.local`,
      displayName: 'Learner',
      role: 'STUDENT' as any,
    });
  }

  // Load current word state from PostgreSQL
  const userStates = await vocabularyRepository.getUserWordStates(user.id);
  const foundState = userStates.find((ws) => ws.wordId === wordId);

  const currentState = foundState
    ? {
        repetition: foundState.repetition,
        interval: foundState.interval,
        efactor: foundState.efactor,
      }
    : {
        repetition: 0,
        interval: 1,
        efactor: 2.5,
      };

  const sm2Result = calculateSM2(currentState, quality);

  // Authoritatively save updated SM-2 state in PostgreSQL
  await vocabularyRepository.saveWordState({
    userId: user.id,
    wordId,
    repetition: sm2Result.repetition,
    interval: sm2Result.interval,
    efactor: sm2Result.efactor,
    dueDate: sm2Result.dueDate,
    lastQuality: quality,
  });

  // Log review in PostgreSQL
  await vocabularyRepository.saveSrsReviewLog({
    userId: user.id,
    wordId,
    rating: quality,
    scheduledDays: currentState.interval,
    elapsedDays: 1,
    lastInterval: currentState.interval,
    newInterval: sm2Result.interval,
  });

  const streakResult = updateStreakWithTimezone(
    {
      currentStreak: user.currentStreak,
      streakFreezes: user.streakFreezes,
      lastActiveDate: user.lastActiveDate,
    },
    new Date(),
    user.timezone
  );

  const xpEarned = quality >= 3 ? 10 : 2;
  const updatedUser = await userRepository.updateStreakAndXP(
    user.id,
    streakResult.currentStreak,
    streakResult.streakFreezes,
    getFormattedDateInTimezone(new Date(), user.timezone),
    xpEarned
  );

  return res.json({
    wordId,
    quality,
    nextInterval: sm2Result.interval,
    nextRepetition: sm2Result.repetition,
    nextEFactor: sm2Result.efactor,
    dueDate: sm2Result.dueDate.toISOString(),
    xpEarned,
    totalXP: updatedUser.totalXP,
  });
});

srsRouter.post('/add', async (req, res) => {
  const {
    targetText,
    translation,
    phonetic,
    exampleSentence,
    exampleTranslation,
    imageUrl,
    cefrLevel = 'B2',
    userId = 'demo-user-id-001',
  } = req.body;

  if (!targetText) {
    return res.status(400).json({ success: false, message: 'targetText is required' });
  }

  const wordId = `vocab-custom-${Date.now()}`;
  try {
    await prisma.vocabulary.create({
      data: {
        id: wordId,
        targetText,
        translation: translation || targetText,
        phonetic: phonetic || '',
        exampleSentence: exampleSentence || null,
        exampleTranslation: exampleTranslation || null,
        cefrLevel,
        partOfSpeech: 'phrase',
      },
    });

    await vocabularyRepository.saveWordState({
      userId,
      wordId,
      repetition: 0,
      interval: 1,
      efactor: 2.5,
      dueDate: new Date(),
      lastQuality: 0,
    });

    return res.json({
      success: true,
      message: `Đã thêm từ "${targetText}" vào bộ thẻ SRS Flashcard`,
      word: { wordId, targetText, translation, phonetic, exampleSentence, cefrLevel },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi thêm từ vựng vào SRS' });
  }
});
