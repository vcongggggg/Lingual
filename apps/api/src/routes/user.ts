import { Router } from 'express';
import { MOCK_USERS, MOCK_LESSON_PROGRESS, MOCK_GAME_SESSIONS } from './auth.js';
import { SEED_UNITS, SEED_ACHIEVEMENTS } from '../../../../prisma/seed.js';

export const userRouter = Router();

userRouter.get('/profile', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

  const { passwordHash: _, ...userWithoutPassword } = user;
  return res.json({
    user: userWithoutPassword,
    achievements: SEED_ACHIEVEMENTS,
  });
});

userRouter.get('/progress', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

  const userProgress = MOCK_LESSON_PROGRESS.filter((p) => p.userId === userId);
  const allWords = SEED_UNITS.flatMap((u) => u.lessons.flatMap((l) => l.words));

  return res.json({
    completedLessons: userProgress,
    totalLessons: SEED_UNITS.flatMap((u) => u.lessons).length,
    totalWordsLearned: userProgress.length * 5, // Approximate
    totalWords: allWords.length,
    totalXP: user.totalXP,
    currentStreak: user.currentStreak,
    streakFreezes: user.streakFreezes,
  });
});

userRouter.get('/stats', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

  const userGames = MOCK_GAME_SESSIONS.filter((g) => g.userId === userId);
  const userLessons = MOCK_LESSON_PROGRESS.filter((p) => p.userId === userId);

  return res.json({
    totalXP: user.totalXP,
    currentStreak: user.currentStreak,
    totalLessonsCompleted: userLessons.length,
    totalGamesPlayed: userGames.length,
    averageGameAccuracy: userGames.length > 0
      ? Number((userGames.reduce((acc, g) => acc + (g.accuracy || 0), 0) / userGames.length).toFixed(2))
      : 0,
    recentActivity: [
      ...userLessons.slice(-5).map((l) => ({ type: 'lesson', ...l })),
      ...userGames.slice(-5).map((g) => ({ type: 'game', ...g })),
    ].sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime()).slice(0, 10),
  });
});

userRouter.get('/achievements', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const userLessons = MOCK_LESSON_PROGRESS.filter((p) => p.userId === userId);
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

  const unlocked: string[] = [];
  if (userLessons.length >= 1) unlocked.push('FIRST_LESSON');
  if (user.currentStreak >= 3) unlocked.push('STREAK_3_DAYS');
  if (user.currentStreak >= 7) unlocked.push('STREAK_7_DAYS');

  return res.json({
    achievements: SEED_ACHIEVEMENTS.map((ach) => ({
      ...ach,
      unlocked: unlocked.includes(ach.code),
    })),
  });
});

userRouter.post('/profile/update', (req, res) => {
  const { displayName, timezone, interfaceLocale, dailyGoalMinutes, userId = 'demo-user-id-001' } = req.body;
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

  if (displayName) user.displayName = displayName;
  if (timezone) user.timezone = timezone;
  if (interfaceLocale) user.interfaceLocale = interfaceLocale;
  if (dailyGoalMinutes) user.dailyGoalMinutes = dailyGoalMinutes;

  const { passwordHash: _, ...updatedUser } = user;
  return res.json({ user: updatedUser, message: 'Cập nhật thông tin thành công!' });
});
