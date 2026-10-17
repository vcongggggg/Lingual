import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { SEED_UNITS, SEED_ACHIEVEMENTS } from '../../../../prisma/seed';
import { prisma } from '../lib/prisma.js';
import { userRepository } from '../repositories/user.repository.js';
import { JWT_SECRET } from '../middleware/rbac.js';
import { resolveAuthUserId } from '../lib/authUtil.js';

export const userRouter = Router();

function getCallerUser(req: any): { userId: string; role: string } | null {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(auth.split(' ')[1], JWT_SECRET) as any;
      return { userId: payload.userId, role: payload.role };
    } catch {}
  }
  return null;
}

async function resolveUser(userId: string) {
  if (!userId) return null;
  return await userRepository.findById(userId);
}

userRouter.get('/profile', async (req, res) => {
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }
  const caller = getCallerUser(req);
  if (caller && caller.userId !== userId && caller.role !== 'ADMIN' && caller.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Truy cập bị từ chối: Bạn không có quyền truy cập dữ liệu của người dùng khác' });
  }

  const user = await resolveUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  return res.json({
    user: userWithoutPassword,
    achievements: SEED_ACHIEVEMENTS,
  });
});

userRouter.get('/progress', async (req, res) => {
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }
  const caller = getCallerUser(req);
  if (caller && caller.userId !== userId && caller.role !== 'ADMIN' && caller.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Truy cập bị từ chối: Bạn không có quyền truy cập dữ liệu của người dùng khác' });
  }

  const user = await resolveUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  }

  const userProgress = await prisma.userLessonProgress.findMany({
    where: { userId: user.id, completed: true },
  });

  const allWords = SEED_UNITS.flatMap((u) => u.lessons.flatMap((l) => l.words));

  const completedLessonIds = new Set(userProgress.map((p) => p.lessonId));
  let distinctWordsLearned = 0;
  SEED_UNITS.forEach((u) => {
    u.lessons.forEach((l) => {
      if (
        completedLessonIds.has((l as any).id) ||
        completedLessonIds.has(l.order.toString()) ||
        completedLessonIds.has(l.title)
      ) {
        distinctWordsLearned += l.words.length;
      }
    });
  });

  return res.json({
    completedLessons: userProgress,
    totalLessons: SEED_UNITS.flatMap((u) => u.lessons).length,
    totalWordsLearned: distinctWordsLearned,
    totalWords: allWords.length,
    totalXP: user.totalXP,
    currentStreak: user.currentStreak,
    streakFreezes: user.streakFreezes,
  });
});

userRouter.get('/stats', async (req, res) => {
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }
  const caller = getCallerUser(req);
  if (caller && caller.userId !== userId && caller.role !== 'ADMIN' && caller.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Truy cập bị từ chối: Bạn không có quyền truy cập dữ liệu của người dùng khác' });
  }
  const user = await resolveUser(userId);

  if (!user) {
    return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  }

  const userGames = await prisma.gameSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const userLessons = await prisma.userLessonProgress.findMany({
    where: { userId: user.id, completed: true },
    orderBy: { completedAt: 'desc' },
    take: 20,
  });

  return res.json({
    totalXP: user.totalXP,
    currentStreak: user.currentStreak,
    totalLessonsCompleted: userLessons.length,
    totalGamesPlayed: userGames.length,
    averageGameAccuracy:
      userGames.length > 0
        ? Number((userGames.reduce((acc, g) => acc + (g.accuracy || 0), 0) / userGames.length).toFixed(2))
        : 0,
    recentActivity: [
      ...userLessons.slice(0, 5).map((l) => ({ type: 'lesson', ...l })),
      ...userGames.slice(0, 5).map((g) => ({ type: 'game', ...g })),
    ].slice(0, 10),
  });
});

userRouter.get('/achievements', async (req, res) => {
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }
  const caller = getCallerUser(req);
  if (caller && caller.userId !== userId && caller.role !== 'ADMIN' && caller.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Truy cập bị từ chối: Bạn không có quyền truy cập dữ liệu của người dùng khác' });
  }
  const user = await resolveUser(userId);

  if (!user) {
    return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  }

  const lessonCount = await prisma.userLessonProgress.count({
    where: { userId: user.id, completed: true },
  });

  const unlocked: string[] = [];
  if (lessonCount >= 1) unlocked.push('FIRST_LESSON');
  if (user.currentStreak >= 3) unlocked.push('STREAK_3_DAYS');
  if (user.currentStreak >= 7) unlocked.push('STREAK_7_DAYS');

  return res.json({
    achievements: SEED_ACHIEVEMENTS.map((ach) => ({
      ...ach,
      unlocked: unlocked.includes(ach.code),
    })),
  });
});

userRouter.post('/profile/update', async (req, res) => {
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }
  const { displayName, timezone, interfaceLocale, dailyGoalMinutes } = req.body;
  const caller = getCallerUser(req);
  if (caller && caller.userId !== userId && caller.role !== 'ADMIN' && caller.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Truy cập bị từ chối: Bạn không có quyền sửa thông tin của người dùng khác' });
  }

  const user = await resolveUser(userId);
  if (!user) {
    return res.status(404).json({ error: 'Không tìm thấy người dùng' });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      displayName: displayName || user.displayName,
      timezone: timezone || user.timezone,
      interfaceLocale: interfaceLocale || user.interfaceLocale,
      dailyGoalMinutes: dailyGoalMinutes ? Number(dailyGoalMinutes) : user.dailyGoalMinutes,
    },
  });

  const { passwordHash: _, ...updatedUser } = updated;
  return res.json({ user: updatedUser, message: 'Cập nhật thông tin thành công!' });
});
