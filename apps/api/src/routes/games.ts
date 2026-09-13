import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { SEED_UNITS } from '../../../../prisma/seed.js';
import { MOCK_USERS, MOCK_ATTEMPTS, MOCK_GAME_SESSIONS } from './auth.js';
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
import { GameRepository } from '../repositories/game.repository.js';

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
  ...MASTER_25K_DICTIONARY.map((dw, idx) => ({
    id: dw.id || `dict-${idx}`,
    targetText: dw.targetText,
    translation: dw.translation,
    phonetic: dw.phonetic || '',
    pos: dw.partOfSpeech || 'noun',
    cefrLevel: dw.cefrLevel || 'B1',
    category: dw.category || 'Daily Life',
    definitionEn: dw.definitionEn || `The English word "${dw.targetText}"`,
    exampleSentence: dw.exampleSentence || '',
    exampleTranslation: dw.exampleTranslation || '',
  })),
];

// Helper to generate context-aware smart distractors
function getSmartDistractors(targetMeaning: string, pool: typeof ALL_WORDS_POOL, count = 3): string[] {
  const others = pool
    .filter((w) => w.translation && w.translation.toLowerCase() !== targetMeaning.toLowerCase())
    .map((w) => w.translation);
  const unique = Array.from(new Set(others)).sort(() => Math.random() - 0.5);
  return unique.slice(0, count);
}

// GET /data/:gameType - Load game pool filtered by topic and CEFR level
gamesRouter.get('/data/:gameType', (req, res) => {
  const { gameType } = req.params;
  const { topic = 'all', cefr = 'all' } = req.query as { topic?: string; cefr?: string };

  let pool = [...ALL_WORDS_POOL];

  if (topic && topic !== 'all') {
    const topicFiltered = pool.filter((w) => w.category && w.category.toLowerCase().includes(topic.toLowerCase()));
    if (topicFiltered.length >= 8) pool = topicFiltered;
  }

  if (cefr && cefr !== 'all') {
    const cefrMatch = pool.filter((w) => w.cefrLevel && w.cefrLevel.toLowerCase() === cefr.toLowerCase());
    if (cefrMatch.length >= 8) pool = cefrMatch;
  }

  // Shuffle pool
  pool.sort(() => Math.random() - 0.5);

  // GAME 1: 3D WORD MATCH
  if (gameType === 'word_match') {
    const pairs = pool.slice(0, 8).map((w, idx) => ({
      id: `pair-${idx + 1}`,
      targetText: w.targetText,
      translation: w.translation,
      category: w.category,
      cefr: w.cefrLevel,
    }));
    return res.json({ pairs });
  }

  // GAME 2: SENTENCE SCRAMBLE (Rich bank with full translations)
  if (gameType === 'sentence_scramble') {
    const sentences = [...BACKEND_SCRAMBLES].sort(() => Math.random() - 0.5).slice(0, 5);
    return res.json({ sentences });
  }

  // GAME 3: SPEED TYPING SPRINT
  if (gameType === 'typing_race') {
    const questions = pool.slice(0, 10).map((w, idx) => ({
      id: `q-${idx + 1}`,
      targetText: w.targetText,
      translation: w.translation,
      phonetic: w.phonetic,
      category: w.category,
      cefr: w.cefrLevel,
      exampleSentence: w.exampleSentence,
    }));
    return res.json({ questions });
  }

  // GAME 4: RAPID FILL BLITZ (Context-aware smart distractors)
  if (gameType === 'fill_blitz') {
    const questions = pool.slice(0, 10).map((w, idx) => {
      const distractors = getSmartDistractors(w.translation, pool, 3);
      const options = [w.translation, ...distractors].sort(() => Math.random() - 0.5);
      return {
        id: `blitz-${idx + 1}`,
        q: `Chọn nghĩa tiếng Việt chính xác của từ "${w.targetText}":`,
        targetText: w.targetText,
        correct: w.translation,
        options,
        phonetic: w.phonetic,
        category: w.category,
      };
    });
    return res.json({ questions });
  }

  // GAME 5: LINGO WORDLE (5-letter curated target word)
  if (gameType === 'lingo_wordle') {
    const target = BACKEND_WORDLE_LIST[Math.floor(Math.random() * BACKEND_WORDLE_LIST.length)];
    return res.json({ target });
  }

  // GAME 6: SOUND REFLEX (Audio pronunciation listening speed match)
  if (gameType === 'sound_reflex') {
    const questions = pool.slice(0, 10).map((w, idx) => {
      const distractors = pool
        .filter((o) => o.targetText.toLowerCase() !== w.targetText.toLowerCase())
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((o) => o.targetText);

      const options = [w.targetText, ...distractors].sort(() => Math.random() - 0.5);
      return {
        id: `sound-${idx + 1}`,
        audioWord: w.targetText,
        phonetic: w.phonetic,
        translation: w.translation,
        correct: w.targetText,
        options,
      };
    });
    return res.json({ questions });
  }

  return res.json({ items: pool.slice(0, 8) });
});

// POST /submit - Validate attempt, calculate scores, persist session & update user stats
gamesRouter.post('/submit', async (req, res) => {
  const { attemptId, gameType, userAnswers, durationSeconds, userId = 'demo-user-id-001', comboMax = 1 } = req.body;

  let attempt = MOCK_ATTEMPTS.find((a) => a.attemptId === attemptId);
  if (!attempt) {
    attempt = {
      attemptId: attemptId || `att-${Date.now()}`,
      userId,
      sourceType: 'game',
      sourceId: gameType,
      startedAt: new Date(Date.now() - Math.max(2, durationSeconds || 10) * 1000),
    };
    MOCK_ATTEMPTS.push(attempt);
  } else if (!(attempt.startedAt instanceof Date)) {
    attempt.startedAt = new Date(attempt.startedAt);
  }

  const timing = validateAttemptTiming(attempt, 1);
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

  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

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
  user.streakFreezes = streakResult.streakFreezes;
  user.lastActiveDate = getFormattedDateInTimezone(new Date(), user.timezone);
  user.totalXP += scoring.xpEarned;

  // Persist session to PostgreSQL through GameRepository with memory fallback
  const gameRepo = GameRepository.getInstance();
  const savedSession = await gameRepo.saveSession({
    attemptId,
    userId,
    gameType,
    score: scoring.finalScore,
    accuracy: evaluation.accuracy,
    xpEarned: scoring.xpEarned,
    durationSeconds: validDuration,
    comboMax: Number(comboMax) || 1,
  });

  // Keep MOCK_GAME_SESSIONS synced for legacy routes
  MOCK_GAME_SESSIONS.unshift(savedSession as any);

  return res.json({
    attemptId,
    gameType,
    sessionId: savedSession.id,
    correctAnswers: evaluation.correctCount,
    totalQuestions: evaluation.totalCount,
    finalScore: scoring.finalScore,
    xpEarned: scoring.xpEarned,
    newStreakDays: user.currentStreak,
    totalUserXP: user.totalXP,
  });
});

// GET /leaderboard - Dynamic ranked leaderboard
gamesRouter.get('/leaderboard', async (req, res) => {
  const { gameType, userId } = req.query as { gameType?: string; userId?: string };
  const gameRepo = GameRepository.getInstance();
  const leaderboard = await gameRepo.getLeaderboard(gameType, userId);
  return res.json({ leaderboard });
});

// GET /stats/:userId - User game statistics across all arcade modes
gamesRouter.get('/stats/:userId', async (req, res) => {
  const { userId } = req.params;
  const gameRepo = GameRepository.getInstance();
  const stats = await gameRepo.getUserStats(userId);
  return res.json({ stats });
});
