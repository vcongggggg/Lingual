import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { SEED_UNITS } from '../../../../prisma/seed';
import {
  calculateGameScore,
  evaluateGameAnswers,
  updateStreakWithTimezone,
  validateAttemptTiming,
  getFormattedDateInTimezone,
} from '../../../../packages/domain/src/index.js';
import {
  BACKEND_MASTER_WORDS,
  BACKEND_SCRAMBLES,
  BACKEND_WORDLE_LIST,
} from '../data/universalVocabulary.js';
import { gameRepository } from '../repositories/game.repository.js';
import { userRepository } from '../repositories/user.repository.js';

export const gamesRouter = Router();

const currentDir = typeof __dirname !== 'undefined' ? __dirname : path.resolve();

// Load master 25k dictionary safely
let MASTER_25K_DICTIONARY: any[] = [];
try {
  const candidatePaths = [
    path.join(currentDir, '../data/masterDictionary25k.json'),
    path.join(currentDir, '../../src/data/masterDictionary25k.json'),
    path.join(process.cwd(), 'apps/api/src/data/masterDictionary25k.json'),
    path.join(process.cwd(), 'src/data/masterDictionary25k.json'),
    path.join(process.cwd(), 'data/masterDictionary25k.json'),
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      MASTER_25K_DICTIONARY = JSON.parse(fs.readFileSync(p, 'utf8'));
      break;
    }
  }
} catch (e) {
  console.warn('[GamesRouter] Note: Could not load masterDictionary25k.json, falling back to seed words:', e);
}

// Flatten all words across seed units + backend master words + 25k dictionary
const ALL_WORDS_POOL = [
  ...BACKEND_MASTER_WORDS,
  ...SEED_UNITS.flatMap((u) =>
    u.lessons.flatMap((l) =>
      l.words.map((w, idx) => ({
        id: `seed-${w.targetText.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx}`,
        targetText: w.targetText,
        translation: w.translation,
        phonetic: w.phonetic,
        pos: w.partOfSpeech || 'noun',
        cefrLevel: w.cefrLevel || 'A1',
        category: u.title.replace(/^Unit \d+:\s*/, ''),
        definitionEn: `The English word "${w.targetText}"`,
        exampleSentence: w.exampleSentence || '',
        exampleTranslation: w.exampleTranslation || '',
      }))
    )
  ),
  ...MASTER_25K_DICTIONARY.map((dw) => ({
    id: dw.id,
    targetText: dw.targetText,
    translation: dw.translation,
    phonetic: dw.phonetic,
    pos: dw.partOfSpeech,
    cefrLevel: dw.cefrLevel,
    category: dw.category,
    definitionEn: `Meaning: ${dw.translation}`,
    exampleSentence: dw.exampleSentence || '',
    exampleTranslation: dw.exampleTranslation || '',
  })),
];

// In-Memory Attempt Store for Game Timing Checks
const GAME_ATTEMPTS: Record<string, { attemptId: string; userId: string; sourceType: string; sourceId: string; startedAt: Date }> = {};

// GET /data - Fetch structured questions tailored for each arcade mini-game mode
gamesRouter.get('/data', (req, res) => {
  const { type = 'word-scramble', difficulty = 'all' } = req.query as {
    type?: string;
    difficulty?: string;
  };

  let pool = ALL_WORDS_POOL;
  if (difficulty && difficulty !== 'all') {
    pool = pool.filter((w) => w.cefrLevel.toLowerCase() === difficulty.toLowerCase());
  }

  if (type === 'word-scramble') {
    const rawItems = BACKEND_SCRAMBLES.length > 0 ? BACKEND_SCRAMBLES : pool.slice(0, 10);
    const questions = rawItems.slice(0, 10).map((item, idx) => {
      const word = (item as any).word || (item as any).targetText;
      const scrambled =
        (item as any).scrambled ||
        word
          .split('')
          .sort(() => Math.random() - 0.5)
          .join('');
      return {
        id: `scramble-${idx + 1}`,
        scrambled: scrambled.toLowerCase(),
        correctWord: word.toLowerCase(),
        hint: (item as any).hint || (item as any).translation || 'Sắp xếp chữ cái thành từ đúng',
        category: (item as any).category || 'Vocabulary',
        xpReward: 25,
      };
    });
    return res.json({ questions });
  }

  if (type === 'wordle') {
    const rawWords = BACKEND_WORDLE_LIST.length > 0 ? BACKEND_WORDLE_LIST : ['APPLE', 'BRAIN', 'CHAIR', 'DREAM', 'EARTH', 'FLAME', 'GRAPE', 'HEART', 'LIGHT', 'MUSIC', 'PLANT', 'RIVER', 'SMILE', 'TRAIN', 'WATER'];
    const chosenItem = rawWords[Math.floor(Math.random() * rawWords.length)];
    const chosen = typeof chosenItem === 'string' ? chosenItem : (chosenItem as any).word;
    const matchingWordObj = pool.find((w) => w.targetText.toUpperCase() === chosen.toUpperCase());

    return res.json({
      targetWord: chosen.toUpperCase(),
      wordLength: chosen.length,
      maxAttempts: 6,
      hint: matchingWordObj ? `${matchingWordObj.translation} (${matchingWordObj.pos})` : 'Đoán từ tiếng Anh 5 chữ cái',
      allowedWords: rawWords.map((item) => (typeof item === 'string' ? item : (item as any).word)),
    });
  }

  if (type === 'speed-match') {
    const sampleWords = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    const pairs = sampleWords.flatMap((w) => [
      { id: `en-${w.id}`, text: w.targetText, matchKey: w.id, lang: 'en' },
      { id: `vi-${w.id}`, text: w.translation, matchKey: w.id, lang: 'vi' },
    ]).sort(() => Math.random() - 0.5);

    return res.json({
      pairs,
      totalPairs: sampleWords.length,
      timeLimitSeconds: 45,
    });
  }

  if (type === 'listening-challenge') {
    const audioWords = pool.slice(0, 8);
    const questions = audioWords.map((w, idx) => {
      const distractors = pool
        .filter((dw) => dw.id !== w.id)
        .slice(0, 3)
        .map((dw) => dw.translation);
      const options = [w.translation, ...distractors].sort(() => Math.random() - 0.5);

      return {
        id: `audio-${idx + 1}`,
        targetText: w.targetText,
        phonetic: w.phonetic,
        options,
        correctAnswer: w.translation,
        audioSnippetUrl: `https://api.dictionaryapi.dev/media/pronunciations/en/${w.targetText.toLowerCase()}-us.mp3`,
      };
    });
    return res.json({ questions });
  }

  return res.json({ items: pool.slice(0, 8) });
});

// POST /submit - Validate attempt, calculate scores, persist session & update user stats
gamesRouter.post('/submit', async (req, res) => {
  const { attemptId, gameType, userAnswers, durationSeconds, userId = 'demo-user-id-001', comboMax = 1 } = req.body;

  let attempt = GAME_ATTEMPTS[attemptId];
  if (!attempt) {
    attempt = {
      attemptId: attemptId || `att-${Date.now()}`,
      userId,
      sourceType: 'game' as const,
      sourceId: gameType,
      startedAt: new Date(Date.now() - Math.max(2, durationSeconds || 10) * 1000),
    };
    GAME_ATTEMPTS[attempt.attemptId] = attempt;
  }

  const timing = validateAttemptTiming(attempt as any, 1);
  const validDuration = timing.valid ? timing.durationSeconds : Math.max(1, durationSeconds || 10);

  const gameItems = ALL_WORDS_POOL.slice(0, 20).map((w, idx) => ({
    id: `q-${idx + 1}`,
    targetText: w.targetText,
    translation: w.translation,
  }));

  const evaluation = evaluateGameAnswers(gameItems, Array.isArray(userAnswers) ? userAnswers : []);

  const scoring = calculateGameScore({
    correctCount: evaluation.correctCount,
    totalQuestions: evaluation.totalCount > 0 ? evaluation.totalCount : 5,
    timeRemainingSeconds: Math.max(0, 60 - (durationSeconds || 10)),
    consecutiveCorrect: evaluation.correctCount,
    mistakes: Math.max(0, evaluation.totalCount - evaluation.correctCount),
  });

  let user = await userRepository.findById(userId);
  if (!user) {
    user = await userRepository.createUser({
      id: userId,
      email: `${userId}@lingual.local`,
      displayName: 'Học Viên Game',
      role: 'STUDENT' as any,
    });
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

  const updatedUser = await userRepository.updateStreakAndXP(
    user.id,
    streakResult.currentStreak,
    streakResult.streakFreezes,
    getFormattedDateInTimezone(new Date(), user.timezone),
    scoring.xpEarned
  );

  // Authoritatively persist session to PostgreSQL through GameRepository
  const savedSession = await gameRepository.saveSession({
    attemptId: attempt.attemptId,
    userId: user.id,
    gameType,
    score: scoring.finalScore,
    accuracy: evaluation.accuracy,
    xpEarned: scoring.xpEarned,
    durationSeconds: validDuration,
    comboMax: Number(comboMax) || 1,
  });

  return res.json({
    attemptId: attempt.attemptId,
    gameType,
    sessionId: savedSession.id,
    correctAnswers: evaluation.correctCount,
    totalQuestions: evaluation.totalCount,
    finalScore: scoring.finalScore,
    xpEarned: scoring.xpEarned,
    newStreakDays: updatedUser.currentStreak,
    totalUserXP: updatedUser.totalXP,
  });
});

// GET /leaderboard - Dynamic ranked leaderboard from PostgreSQL
gamesRouter.get('/leaderboard', async (req, res) => {
  const { gameType } = req.query as { gameType?: string };
  const leaderboard = await gameRepository.getLeaderboard(gameType);
  return res.json({ leaderboard });
});

// GET /stats/:userId - User game statistics across all arcade modes
gamesRouter.get('/stats/:userId', async (req, res) => {
  const { userId } = req.params;
  const stats = await gameRepository.getUserStats(userId);
  return res.json({ stats });
});
