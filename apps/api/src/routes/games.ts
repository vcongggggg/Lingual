import { Router } from 'express';
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

export const gamesRouter = Router();

// Flatten all words across seed units + backend master words for a huge pool
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
];

// Helper to generate context-aware smart distractors
function getSmartDistractors(targetMeaning: string, pool: typeof ALL_WORDS_POOL, count = 3): string[] {
  const others = pool
    .filter((w) => w.translation.toLowerCase() !== targetMeaning.toLowerCase())
    .map((w) => w.translation);
  const unique = Array.from(new Set(others)).sort(() => Math.random() - 0.5);
  return unique.slice(0, count);
}

gamesRouter.get('/data/:gameType', (req, res) => {
  const { gameType } = req.params;
  const { topic = 'all', cefr = 'all' } = req.query as { topic?: string; cefr?: string };

  let pool = [...ALL_WORDS_POOL];

  if (topic && topic !== 'all') {
    pool = pool.filter((w) => w.category.toLowerCase().includes(topic.toLowerCase()));
    if (pool.length < 6) pool = [...ALL_WORDS_POOL]; // Fallback if too few
  }

  if (cefr && cefr !== 'all') {
    const cefrMatch = pool.filter((w) => w.cefrLevel.toLowerCase() === cefr.toLowerCase());
    if (cefrMatch.length >= 6) pool = cefrMatch;
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

  // GAME 4: RAPID FILL BLITZ (Context-aware smart distractors, NEVER static dummy choices)
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

gamesRouter.post('/submit', (req, res) => {
  const { attemptId, gameType, userAnswers, durationSeconds, userId = 'demo-user-id-001' } = req.body;

  const attempt = MOCK_ATTEMPTS.find((a) => a.attemptId === attemptId);
  if (!attempt) {
    return res.status(400).json({ error: 'Attempt token không hợp lệ hoặc đã hết hạn.' });
  }

  const timing = validateAttemptTiming(attempt, 3);
  if (!timing.valid) {
    return res.status(400).json({ error: timing.error });
  }

  const gameItems = ALL_WORDS_POOL.map((w, idx) => ({
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

  const gameSession = {
    id: `gs-${Date.now()}`,
    attemptId,
    userId,
    gameType,
    score: scoring.finalScore,
    accuracy: evaluation.accuracy,
    xpEarned: scoring.xpEarned,
    durationSeconds: timing.durationSeconds,
    createdAt: new Date().toISOString(),
  };
  MOCK_GAME_SESSIONS.push(gameSession);

  return res.json({
    attemptId,
    gameType,
    correctAnswers: evaluation.correctCount,
    totalQuestions: evaluation.totalCount,
    finalScore: scoring.finalScore,
    xpEarned: scoring.xpEarned,
    newStreakDays: user.currentStreak,
    totalUserXP: user.totalXP,
  });
});

gamesRouter.get('/leaderboard', (req, res) => {
  // Sort real sessions if any, or combine with hall of fame
  const mockLeaderboard = [
    { rank: 1, displayName: 'Thắng Trí Việt', xp: 2450, accuracy: 98, streak: 15, avatar: '👑' },
    { rank: 2, displayName: 'Học Viên Lingual', xp: 1890, accuracy: 94, streak: 10, avatar: '🥇' },
    { rank: 3, displayName: 'Minh Anh IELTS', xp: 1650, accuracy: 91, streak: 8, avatar: '🥈' },
    { rank: 4, displayName: 'Hoàng Long Code', xp: 1420, accuracy: 88, streak: 6, avatar: '🥉' },
    { rank: 5, displayName: 'Khánh Linh', xp: 1200, accuracy: 85, streak: 5, avatar: '⭐' },
  ];

  return res.json({ leaderboard: mockLeaderboard });
});
