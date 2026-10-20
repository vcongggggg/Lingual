import { Router, Request, Response } from 'express';
import { aiInsightsService } from '../services/aiInsightsService.js';
import { resolveAuthUserId } from '../lib/authUtil.js';

export const insightsRouter = Router();

// Middleware: Bắt buộc xác thực người dùng cho toàn bộ phân hệ /api/v1/insights/*
insightsRouter.use((req: Request, res: Response, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.access_token;
  if (!authHeader && !cookieToken) {
    return res.status(401).json({
      error: 'Yêu cầu xác thực: Vui lòng cung cấp Bearer token hoặc cookie đăng nhập để truy cập phân tích hành vi học tập.',
    });
  }
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({
      error: 'Token đăng nhập không hợp lệ hoặc đã hết hạn.',
    });
  }
  // Attach resolved userId to request
  (req as any).authUserId = userId;
  next();
});

/**
 * GET /api/v1/insights/preferences
 * Lấy trạng thái cài đặt quyền riêng tư phân tích hành vi (mặc định: bật/true)
 */
insightsRouter.get('/preferences', (req: Request, res: Response) => {
  const userId = (req as any).authUserId;
  const enabled = aiInsightsService.getUserPreference(userId);
  res.json({ enabled, userId });
});

/**
 * POST /api/v1/insights/preferences
 * Cập nhật trạng thái bật/tắt quyền riêng tư phân tích hành vi
 */
insightsRouter.post('/preferences', (req: Request, res: Response) => {
  const userId = (req as any).authUserId;
  const { enabled } = req.body;
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ error: 'Trường "enabled" phải là kiểu boolean (true/false).' });
  }
  const updated = aiInsightsService.setUserPreference(userId, enabled);
  res.json({ success: true, enabled: updated, userId });
});

/**
 * GET /api/v1/insights/summary
 * Tổng hợp toàn bộ 5 góc nhìn phân tích hành vi (hoặc trả về disabled nếu tắt)
 */
insightsRouter.get('/summary', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const summary = await aiInsightsService.getFullInsightsSummary(userId);
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi tải tổng hợp phân tích hành vi' });
  }
});

/**
 * GET /api/v1/insights/golden-hours
 * 1. Giờ vàng học tập (Optimal Study Hours)
 */
insightsRouter.get('/golden-hours', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    if (!aiInsightsService.getUserPreference(userId)) {
      return res.json({ enabled: false, status: 'disabled', message: 'Tính năng phân tích đang bị tắt.' });
    }
    const result = await aiInsightsService.getGoldenStudyHours(userId);
    res.json({ enabled: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi phân tích giờ vàng học tập' });
  }
});

/**
 * GET /api/v1/insights/weakness-radar
 * 2. Radar điểm yếu & đề xuất bài luyện 5 kỹ năng
 */
insightsRouter.get('/weakness-radar', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    if (!aiInsightsService.getUserPreference(userId)) {
      return res.json({ enabled: false, status: 'disabled', message: 'Tính năng phân tích đang bị tắt.' });
    }
    const result = await aiInsightsService.getWeaknessRadar(userId);
    res.json({ enabled: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi phân tích radar điểm yếu' });
  }
});

/**
 * GET /api/v1/insights/forgotten-words
 * 3. Danh sách từ hay quên (SM-2 rating < 3 lặp lại >= 2 lần)
 */
insightsRouter.get('/forgotten-words', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    if (!aiInsightsService.getUserPreference(userId)) {
      return res.json({ enabled: false, status: 'disabled', items: [] });
    }
    const limit = Number(req.query.limit) || 10;
    const items = await aiInsightsService.getFrequentlyForgottenWords(userId, limit);
    res.json({ enabled: true, items, total: items.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi lấy danh sách từ hay quên' });
  }
});

/**
 * GET /api/v1/insights/dropoff-warning
 * 4. Cảnh báo bỏ cuộc & Lời nhắn Bò LingLing
 */
insightsRouter.get('/dropoff-warning', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    if (!aiInsightsService.getUserPreference(userId)) {
      return res.json({ enabled: false, status: 'disabled', hasWarning: false });
    }
    const result = await aiInsightsService.getDropoffWarning(userId);
    res.json({ enabled: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi kiểm tra cảnh báo bỏ cuộc' });
  }
});

/**
 * GET /api/v1/insights/curriculum-adaptation
 * 5. Lộ trình thích ứng: Unit nên học tiếp
 */
insightsRouter.get('/curriculum-adaptation', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    if (!aiInsightsService.getUserPreference(userId)) {
      return res.json({ enabled: false, status: 'disabled' });
    }
    const result = await aiInsightsService.getCurriculumAdaptation(userId);
    res.json({ enabled: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi phân tích lộ trình thích ứng' });
  }
});
