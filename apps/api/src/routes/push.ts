/**
 * Web Push Notification Routes (Phase 3)
 * Endpoints for VAPID public key, subscribing, unsubscribing, and sending test push notifications.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { pushNotificationService, PushSubscriptionData } from '../services/pushNotificationService.js';
import { resolveAuthUserId } from '../lib/authUtil.js';

export const pushRouter = Router();

/**
 * GET /api/v1/push/public-key
 * Trả về VAPID Public Key để frontend dùng khi gọi pushManager.subscribe()
 */
pushRouter.get('/public-key', (req: Request, res: Response) => {
  const publicKey = pushNotificationService.getPublicKey();
  if (!publicKey) {
    return res.status(500).json({ error: 'VAPID public key chưa được thiết lập trên server.' });
  }
  res.json({ publicKey });
});

// Middleware xác thực cho các thao tác đăng ký / hủy đăng ký / test push
const requireAuth = (req: Request, res: Response, next: Function) => {
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Yêu cầu xác thực người dùng.' });
  }
  (req as any).authUserId = userId;
  next();
};

const SubscribeSchema = z.object({
  endpoint: z.string().url('Endpoint phải là một URL hợp lệ'),
  keys: z.object({
    p256dh: z.string().min(1, 'p256dh không được để trống'),
    auth: z.string().min(1, 'auth không được để trống'),
  }),
  userAgent: z.string().optional(),
});

/**
 * POST /api/v1/push/subscribe
 * Lưu thông tin đăng ký Push Subscription của trình duyệt
 */
pushRouter.post('/subscribe', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const parsed = SubscribeSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: 'Dữ liệu đăng ký không hợp lệ',
        details: parsed.error.format(),
      });
    }

    const subscription = await pushNotificationService.subscribe(userId, parsed.data as PushSubscriptionData);
    res.status(201).json({ success: true, subscription });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi đăng ký nhận thông báo đẩy' });
  }
});

/**
 * DELETE /api/v1/push/unsubscribe
 * Hủy đăng ký Push Subscription
 */
pushRouter.delete('/unsubscribe', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ error: 'Thiếu endpoint cần hủy.' });
    }

    const result = await pushNotificationService.unsubscribe(userId, endpoint);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi hủy đăng ký thông báo đẩy' });
  }
});

/**
 * GET /api/v1/push/status
 * Kiểm tra xem user hiện tại đã có bao nhiêu thiết bị đăng ký push
 */
pushRouter.get('/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const subscriptions = await pushNotificationService.getUserSubscriptions(userId);
    res.json({
      success: true,
      count: subscriptions.length,
      hasSubscriptions: subscriptions.length > 0,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi kiểm tra trạng thái push' });
  }
});

/**
 * POST /api/v1/push/test
 * DEV ONLY: Gửi thông báo đẩy thử nghiệm đến các thiết bị của user
 */
pushRouter.post('/test', requireAuth, async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Chức năng này chỉ khả dụng ở môi trường phát triển (DEV).' });
  }

  try {
    const userId = (req as any).authUserId;
    const result = await pushNotificationService.sendTestPush(userId);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi gửi thông báo đẩy thử nghiệm' });
  }
});
