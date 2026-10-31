import { Router, Request, Response } from 'express';
import { achievementService } from '../services/achievementService.js';
import { resolveAuthUserId } from '../lib/authUtil.js';

export const achievementsRouter = Router();

// Middleware xác thực người dùng cho toàn bộ /api/v1/achievements/*
achievementsRouter.use((req: Request, res: Response, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.access_token;
  if (!authHeader && !cookieToken) {
    return res.status(401).json({
      error: 'Yêu cầu xác thực: Vui lòng cung cấp token hoặc cookie đăng nhập.',
    });
  }

  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({
      error: 'Token đăng nhập không hợp lệ hoặc đã hết hạn.',
    });
  }

  (req as any).authUserId = userId;
  next();
});

/**
 * GET /api/v1/achievements/summary
 * Tóm tắt số lượng huy hiệu đã mở, tổng số huy hiệu, và tổng bonus XP đã nhận
 */
achievementsRouter.get('/summary', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const summary = await achievementService.getSummary(userId);
    return res.json(summary);
  } catch (err: any) {
    console.error('[AchievementsRouter] GET /summary error:', err);
    return res.status(500).json({ error: 'Không thể lấy thông tin tóm tắt huy hiệu.' });
  }
});

/**
 * GET /api/v1/achievements
 * Danh sách toàn bộ catalog huy hiệu kèm trạng thái unlocked, unlockedAt, progress current/target
 */
achievementsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const achievements = await achievementService.getUserAchievements(userId);
    return res.json({ achievements });
  } catch (err: any) {
    console.error('[AchievementsRouter] GET / error:', err);
    return res.status(500).json({ error: 'Không thể lấy danh sách huy hiệu.' });
  }
});

/**
 * POST /api/v1/achievements/evaluate
 * Cho phép kích hoạt thủ công việc đánh giá lại toàn bộ huy hiệu (Backfill / Trigger)
 */
achievementsRouter.post('/evaluate', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const newlyUnlocked = await achievementService.evaluate(userId);
    return res.json({
      success: true,
      newlyUnlockedCount: newlyUnlocked.length,
      newlyUnlocked,
    });
  } catch (err: any) {
    console.error('[AchievementsRouter] POST /evaluate error:', err);
    return res.status(500).json({ error: 'Không thể đánh giá huy hiệu.' });
  }
});
