import { Router } from 'express';
import { SEED_UNITS } from '../../../../prisma/seed.js';
import { MOCK_USERS, MOCK_WORD_STATES } from './auth.js';
import {
  calculateSM2,
  updateStreakWithTimezone,
  getFormattedDateInTimezone,
} from '../../../../packages/domain/src/index.js';

export const srsRouter = Router();

export interface CustomSrsWord {
  id: string;
  wordId: string;
  targetText: string;
  translation: string;
  phonetic?: string;
  imageUrl?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  cefrLevel: string;
  userId?: string;
}

export const CUSTOM_SRS_WORDS: CustomSrsWord[] = [];

srsRouter.get('/queue', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';

  const userCustomWords = CUSTOM_SRS_WORDS.filter((cw) => !cw.userId || cw.userId === userId).map((cw) => ({
    id: cw.id,
    wordId: cw.wordId,
    targetText: cw.targetText,
    translation: cw.translation,
    phonetic: cw.phonetic,
    imageUrl: cw.imageUrl,
    exampleSentence: cw.exampleSentence,
    exampleTranslation: cw.exampleTranslation,
    cefrLevel: cw.cefrLevel || 'B2',
  }));

  const seedWords = SEED_UNITS.flatMap((u) => u.lessons.flatMap((l) => l.words)).map((w, idx) => ({
    id: `srs-${idx + 1}`,
    wordId: `w-${idx + 1}`,
    targetText: w.targetText,
    translation: w.translation,
    phonetic: w.phonetic,
    imageUrl: (w as any).imageUrl,
    exampleSentence: w.exampleSentence,
    exampleTranslation: w.exampleTranslation,
    cefrLevel: w.cefrLevel || 'A1',
  }));

  const allWords = [...userCustomWords, ...seedWords];

  // Check existing SM-2 states for each word
  const queue = allWords.map((w) => {
    const existingState = MOCK_WORD_STATES.find((ws) => ws.wordId === w.wordId);

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
      dueDate: existingState?.dueDate || new Date().toISOString(),
    };
  });

  // Filter to only show due words (due today or earlier)
  const now = new Date();
  const dueQueue = queue.filter((item) => new Date(item.dueDate) <= now);

  // Stats
  const mastered = queue.filter((item) => item.repetition >= 3).length;
  const learning = queue.filter((item) => item.repetition > 0 && item.repetition < 3).length;
  const newWords = queue.filter((item) => item.repetition === 0).length;

  // Return due queue (limit to 20 per session), or all if none due
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
});

srsRouter.post('/review', (req, res) => {
  const { wordId, quality, userId = 'demo-user-id-001' } = req.body;

  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
  const currentState = MOCK_WORD_STATES.find((ws) => ws.wordId === wordId) || {
    repetition: 0,
    interval: 1,
    efactor: 2.5,
  };

  const sm2Result = calculateSM2(currentState, quality);

  // Persist updated SM-2 state
  const existingIdx = MOCK_WORD_STATES.findIndex((ws) => ws.wordId === wordId);
  const updatedState = {
    wordId,
    repetition: sm2Result.repetition,
    interval: sm2Result.interval,
    efactor: sm2Result.efactor,
    dueDate: sm2Result.dueDate.toISOString(),
  };
  if (existingIdx >= 0) {
    MOCK_WORD_STATES[existingIdx] = updatedState;
  } else {
    MOCK_WORD_STATES.push(updatedState);
  }

  const streakResult = updateStreakWithTimezone(
    {
      currentStreak: user.currentStreak,
      streakFreezes: user.streakFreezes,
      lastActiveDate: user.lastActiveDate,
    },
    new Date(),
    user.timezone
  );

  user.currentStreak = streakResult.currentStreak;
  user.lastActiveDate = getFormattedDateInTimezone(new Date(), user.timezone);

  const xpEarned = quality >= 3 ? 10 : 2;
  user.totalXP += xpEarned;

  return res.json({
    wordId,
    quality,
    nextInterval: sm2Result.interval,
    nextRepetition: sm2Result.repetition,
    nextEFactor: sm2Result.efactor,
    dueDate: sm2Result.dueDate.toISOString(),
    xpEarned,
    totalXP: user.totalXP,
  });
});

srsRouter.post('/add', (req, res) => {
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

  const wordId = `custom-w-${Date.now()}`;
  CUSTOM_SRS_WORDS.push({
    id: `srs-${Date.now()}`,
    wordId,
    targetText,
    translation: translation || targetText,
    phonetic: phonetic || '',
    imageUrl,
    exampleSentence,
    exampleTranslation,
    cefrLevel,
    userId,
  });

  MOCK_WORD_STATES.push({
    wordId,
    repetition: 0,
    interval: 1,
    efactor: 2.5,
    dueDate: new Date().toISOString(),
  });

  return res.json({
    success: true,
    message: `Đã thêm từ "${targetText}" vào bộ thẻ SRS Flashcard`,
    word: { wordId, targetText, translation, phonetic, exampleSentence, cefrLevel },
  });
});
