import { Router } from 'express';
import { SEED_UNITS } from '../../../../prisma/seed.js';
import { MOCK_USERS, MOCK_ATTEMPTS, MOCK_GAME_SESSIONS } from './auth.js';
import {
  calculateGameScore,
  evaluateGameAnswers,
  updateStreakWithTimezone,
  validateAttemptTiming,
} from '../../../../packages/domain/src/index.js';

export const gamesRouter = Router();

gamesRouter.get('/data/:gameType', (req, res) => {
  const { gameType } = req.params;
  const allWords = SEED_UNITS.flatMap((u) => u.lessons.flatMap((l) => l.words));

  if (gameType === 'word_match') {
    const pairs = allWords.slice(0, 6).map((w, idx) => ({
      id: `pair-${idx + 1}`,
      targetText: w.targetText,
      translation: w.translation,
    }));
    return res.json({ pairs });
  }

  if (gameType === 'sentence_scramble') {
    const sentences = [
      { id: 'sc-1', sentence: 'Nice to meet you', fullSentence: 'Nice to meet you', tokens: ['to', 'Nice', 'you', 'meet'], translation: 'Rất vui được gặp bạn' },
      { id: 'sc-2', sentence: 'My name is Nam', fullSentence: 'My name is Nam', tokens: ['name', 'is', 'My', 'Nam'], translation: 'Tên tôi là Nam' },
      { id: 'sc-3', sentence: 'Good morning teacher', fullSentence: 'Good morning teacher', tokens: ['morning', 'Good', 'teacher'], translation: 'Chào buổi sáng thầy giáo' },
    ];
    return res.json({ sentences });
  }

  if (gameType === 'typing_race' || gameType === 'fill_blitz') {
    const questions = allWords.slice(0, 10).map((w, idx) => ({
      id: `q-${idx + 1}`,
      targetText: w.targetText,
      translation: w.translation,
      phonetic: w.phonetic,
    }));
    return res.json({ questions });
  }

  return res.json({ items: allWords.slice(0, 5) });
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

  const allWords = SEED_UNITS.flatMap((u) => u.lessons.flatMap((l) => l.words));
  const gameItems = allWords.map((w, idx) => ({
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
  const mockLeaderboard = [
    { rank: 1, displayName: 'Thắng Trí Việt', xp: 2450, accuracy: 98, streak: 15, avatar: '👑' },
    { rank: 2, displayName: 'Học Viên Lingual', xp: 1890, accuracy: 94, streak: 10, avatar: '🥇' },
    { rank: 3, displayName: 'Minh Anh IELTS', xp: 1650, accuracy: 91, streak: 8, avatar: '🥈' },
    { rank: 4, displayName: 'Hoàng Long Code', xp: 1420, accuracy: 88, streak: 6, avatar: '🥉' },
    { rank: 5, displayName: 'Khánh Linh', xp: 1200, accuracy: 85, streak: 5, avatar: '⭐' },
  ];

  return res.json({ leaderboard: mockLeaderboard });
});
