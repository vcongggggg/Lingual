import { Router } from 'express';
import { SEED_UNITS, SEED_ACHIEVEMENTS } from '../../../../prisma/seed.js';
import { MOCK_USERS, MOCK_ATTEMPTS, MOCK_LESSON_PROGRESS } from './auth.js';
import {
  calculateLessonXP,
  updateStreakWithTimezone,
  validateAttemptTiming,
} from '../../../../packages/domain/src/index.js';

export const curriculumRouter = Router();

curriculumRouter.post('/attempts/start', (req, res) => {
  const { sourceType, sourceId, userId = 'demo-user-id-001' } = req.body;
  const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const attemptSession = {
    attemptId,
    userId,
    sourceType,
    sourceId,
    startedAt: new Date(),
  };

  MOCK_ATTEMPTS.push(attemptSession);

  return res.json({
    attemptId,
    startedAt: attemptSession.startedAt.toISOString(),
  });
});

curriculumRouter.get('/units', (req, res) => {
  res.json({ units: SEED_UNITS });
});

curriculumRouter.get('/lessons/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  for (const unit of SEED_UNITS) {
    const lesson = unit.lessons.find((l) => l.order.toString() === lessonId || l.title.includes(lessonId));
    if (lesson) {
      return res.json({ lesson });
    }
  }
  return res.json({ lesson: SEED_UNITS[0].lessons[0] });
});

curriculumRouter.post('/lessons/:lessonId/submit', (req, res) => {
  const { lessonId } = req.params;
  const { attemptId, answers, userId = 'demo-user-id-001' } = req.body;

  const attempt = MOCK_ATTEMPTS.find((a) => a.attemptId === attemptId);
  if (!attempt) {
    return res.status(400).json({ error: 'Attempt token không hợp lệ hoặc đã hết hạn.' });
  }

  const timing = validateAttemptTiming(attempt, 2);
  if (!timing.valid) {
    return res.status(400).json({ error: timing.error });
  }

  let totalQuestions = 0;
  let correctCount = 0;

  for (const unit of SEED_UNITS) {
    const lesson = unit.lessons.find((l) => l.order.toString() === lessonId || l.title.includes(lessonId)) || unit.lessons[0];
    totalQuestions = lesson.exercises.length;

    if (Array.isArray(answers)) {
      answers.forEach((ans: any, idx: number) => {
        const ex = lesson.exercises[idx];
        if (ex && ans.userAnswer && ans.userAnswer.trim().toLowerCase() === ex.correctAnswer.trim().toLowerCase()) {
          correctCount++;
        }
      });
    }
    break;
  }

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
  user.lastActiveDate = new Date().toISOString().split('T')[0];

  const xpEarned = calculateLessonXP(correctCount, totalQuestions, user.currentStreak);
  user.totalXP += xpEarned;

  MOCK_LESSON_PROGRESS.push({
    userId,
    lessonId,
    completed: true,
    bestScore: correctCount,
    completedAt: new Date().toISOString(),
  });

  return res.json({
    attemptId,
    lessonId,
    score: correctCount,
    totalQuestions,
    xpEarned,
    streakDays: user.currentStreak,
    streakFreezes: user.streakFreezes,
    freezeUsed: streakResult.freezeUsed,
    totalXP: user.totalXP,
    unlockedNextLesson: true,
  });
});
