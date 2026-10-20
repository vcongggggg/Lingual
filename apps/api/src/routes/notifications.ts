import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { notificationService } from '../services/notificationService.js';
import { notificationTriggerEngine } from '../services/notificationTriggerEngine.js';
import { resolveAuthUserId } from '../lib/authUtil.js';
import { NotificationType } from '@prisma/client';

export const notificationsRouter = Router();

// Middleware: Bắt buộc xác thực người dùng cho toàn bộ /api/v1/notifications/*
notificationsRouter.use((req: Request, res: Response, next) => {
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

const UpdatePreferencesSchema = z.object({
  enabled: z.boolean().optional(),
  srsDue: z.boolean().optional(),
  streakRisk: z.boolean().optional(),
  goldenHour: z.boolean().optional(),
  weakSkill: z.boolean().optional(),
  forgetfulWords: z.boolean().optional(),
  weekly: z.boolean().optional(),
  achievement: z.boolean().optional(),
  quietStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Định dạng giờ không hợp lệ (HH:mm)').optional(),
  quietEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Định dạng giờ không hợp lệ (HH:mm)').optional(),
});

/**
 * GET /api/v1/notifications
 * Lấy danh sách thông báo của người dùng có phân trang
 */
notificationsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const unreadOnly = req.query.unreadOnly === 'true';
    const limit = Number(req.query.limit) || 20;
    const cursor = (req.query.cursor as string) || undefined;

    const result = await notificationService.list(userId, { unreadOnly, limit, cursor });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi tải danh sách thông báo' });
  }
});

/**
 * GET /api/v1/notifications/unread-count
 * Lấy số lượng thông báo chưa đọc
 */
notificationsRouter.get('/unread-count', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const count = await notificationService.getUnreadCount(userId);
    res.json({ count });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi đếm thông báo chưa đọc' });
  }
});

/**
 * PATCH /api/v1/notifications/:id/read
 * Đánh dấu 1 thông báo là đã đọc
 */
notificationsRouter.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const notification = await notificationService.markAsRead(userId, req.params.id);
    res.json({ success: true, notification });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi đánh dấu đã đọc' });
  }
});

/**
 * POST /api/v1/notifications/read-all
 * Đánh dấu tất cả thông báo của người dùng là đã đọc
 */
notificationsRouter.post('/read-all', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const result = await notificationService.markAllAsRead(userId);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi đánh dấu đọc tất cả' });
  }
});

/**
 * DELETE /api/v1/notifications/:id
 * Xóa 1 thông báo
 */
notificationsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const result = await notificationService.delete(userId, req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi xóa thông báo' });
  }
});

/**
 * GET /api/v1/notifications/preferences
 * Lấy cấu hình thông báo của người dùng
 */
notificationsRouter.get('/preferences', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const preferences = await notificationService.getOrCreatePreferences(userId);
    res.json({ preferences });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi tải cài đặt thông báo' });
  }
});

/**
 * PUT /api/v1/notifications/preferences
 * Cập nhật cấu hình thông báo của người dùng
 */
notificationsRouter.put('/preferences', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const parsed = UpdatePreferencesSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Dữ liệu cấu hình không hợp lệ',
        details: parsed.error.format(),
      });
    }

    const preferences = await notificationService.updatePreferences(userId, parsed.data);
    res.json({ success: true, preferences });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi cập nhật cài đặt thông báo' });
  }
});

/**
 * POST /api/v1/notifications/_trigger
 * DEV ONLY: Tạo thông báo thử nghiệm (Tắt ở production)
 */
notificationsRouter.post('/_trigger', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Endpoint này chỉ khả dụng trong môi trường phát triển (DEV).' });
  }

  try {
    const userId = (req as any).authUserId;
    const { type, title, body, deepLink, dedupeKey, metadata, force } = req.body;

    if (!type || !title || !body) {
      return res.status(400).json({ error: 'Thiếu trường bắt buộc: type, title, body.' });
    }

    const notification = await notificationService.create({
      userId,
      type: type as NotificationType,
      title,
      body,
      deepLink,
      dedupeKey,
      metadata,
      force: Boolean(force),
    });

    if (!notification) {
      return res.json({
        success: false,
        message: 'Thông báo bị chặn bởi Kill switch, Toggle loại hoặc Quiet hours (hoặc trùng dedupeKey).',
        notification: null,
      });
    }

    res.status(201).json({ success: true, notification });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi kích hoạt thông báo thử nghiệm' });
  }
});

/**
 * POST /api/v1/notifications/_trigger-engine
 * DEV ONLY: Kích hoạt Trigger Engine cho từng loại thông báo:
 * SRS_DUE, STREAK_AT_RISK, GOLDEN_HOUR, WEAK_SKILL, WEEKLY_REPORT, ACHIEVEMENT
 */
notificationsRouter.post('/_trigger-engine', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Endpoint này chỉ khả dụng trong môi trường phát triển (DEV).' });
  }

  try {
    const authUserId = (req as any).authUserId;
    const { trigger, userId, force, ignoreHourCheck, achievement, weekNumber, title } = req.body;
    const targetUserId = userId || authUserId;

    let result: any = null;

    switch (trigger) {
      case 'SRS_DUE':
        result = await notificationTriggerEngine.triggerSrsDue(targetUserId, { force: Boolean(force) });
        break;
      case 'STREAK_AT_RISK':
        result = await notificationTriggerEngine.triggerStreakAtRisk(targetUserId, { force: Boolean(force) });
        break;
      case 'GOLDEN_HOUR':
        result = await notificationTriggerEngine.triggerGoldenHour(targetUserId, {
          force: Boolean(force),
          ignoreHourCheck: ignoreHourCheck !== false,
        });
        break;
      case 'WEAK_SKILL':
        result = await notificationTriggerEngine.triggerWeakSkill(targetUserId, { force: Boolean(force) });
        break;
      case 'WEEKLY_REPORT':
        result = await notificationTriggerEngine.triggerWeeklyReport(targetUserId, {
          force: Boolean(force),
          weekNumber,
          title,
        });
        break;
      case 'ACHIEVEMENT':
        result = await notificationTriggerEngine.triggerAchievement(
          targetUserId,
          achievement || { id: 'achieve-test', name: 'Chiến Binh Kiên Trì' },
          { force: Boolean(force) }
        );
        break;
      default:
        return res.status(400).json({
          error: `Loại trigger không hợp lệ: ${trigger}. Chọn: SRS_DUE, STREAK_AT_RISK, GOLDEN_HOUR, WEAK_SKILL, WEEKLY_REPORT, ACHIEVEMENT.`,
        });
    }

    res.json({ success: true, trigger, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi kích hoạt Trigger Engine' });
  }
});
