import { Router, Request, Response } from 'express';
import { aiInsightsService } from '../services/aiInsightsService.js';
import { geminiInsightsService } from '../services/geminiInsightsService.js';
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

// ==========================================
// V2 ENDPOINTS (GEMINI LLM INSIGHTS)
// ==========================================

/**
 * GET /api/v1/insights/v2/weekly-report/latest
 * Lấy báo cáo Bò mới nhất của user
 */
insightsRouter.get('/v2/weekly-report/latest', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    if (!aiInsightsService.getUserPreference(userId)) {
      return res.json({ enabled: false, status: 'disabled', report: null });
    }
    const report = await geminiInsightsService.getLatestWeeklyReport(userId);
    res.json({ enabled: true, report });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi lấy báo cáo tuần mới nhất' });
  }
});

/**
 * GET /api/v1/insights/v2/weekly-report/history
 * Lấy lịch sử các báo cáo Bò đã tạo
 */
insightsRouter.get('/v2/weekly-report/history', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    if (!aiInsightsService.getUserPreference(userId)) {
      return res.json({ enabled: false, status: 'disabled', reports: [] });
    }
    const limit = Number(req.query.limit) || 10;
    const reports = await geminiInsightsService.getWeeklyReportHistory(userId, limit);
    res.json({ enabled: true, reports });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi lấy lịch sử báo cáo tuần' });
  }
});

/**
 * POST /api/v1/insights/v2/weekly-report/generate
 * Kích hoạt Gemini sinh Báo cáo Bò hàng tuần mới
 */
insightsRouter.post('/v2/weekly-report/generate', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    if (!aiInsightsService.getUserPreference(userId)) {
      return res.status(403).json({
        enabled: false,
        error: 'Tính năng phân tích đang bị tắt theo cài đặt quyền riêng tư của bạn.',
      });
    }
    const forceNew = Boolean(req.body?.forceNew);
    const report = await geminiInsightsService.generateWeeklyReport(userId, forceNew);
    res.json({ success: true, enabled: true, report });
  } catch (err: any) {
    const isAiConfigError = err.message?.includes('Chưa kết nối AI') || err.message?.includes('GEMINI_API_KEY');
    res.status(isAiConfigError ? 503 : 500).json({
      error: err.message || 'Lỗi khi sinh Báo cáo Bò hàng tuần',
      aiConnected: !isAiConfigError,
    });
  }
});

/**
 * POST /api/v1/insights/v2/anomaly/explain
 * Yêu cầu AI giải thích nguyên nhân chỉ số sụt giảm & đề xuất khắc phục
 */
insightsRouter.post('/v2/anomaly/explain', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    if (!aiInsightsService.getUserPreference(userId)) {
      return res.status(403).json({
        enabled: false,
        error: 'Tính năng phân tích đang bị tắt theo cài đặt quyền riêng tư của bạn.',
      });
    }
    const { metricKey, metricValue } = req.body;
    if (!metricKey) {
      return res.status(400).json({ error: 'Thiếu trường "metricKey" cần giải thích.' });
    }
    const explanation = await geminiInsightsService.explainAnomaly(userId, metricKey, metricValue);
    res.json({ success: true, enabled: true, explanation });
  } catch (err: any) {
    const isAiConfigError = err.message?.includes('Chưa kết nối AI') || err.message?.includes('GEMINI_API_KEY');
    res.status(isAiConfigError ? 503 : 500).json({
      error: err.message || 'Lỗi khi phân tích giải thích chỉ số',
      aiConnected: !isAiConfigError,
    });
  }
});

/**
 * GET /api/v1/insights/v2/study-plan
 * Lấy kế hoạch học 7 ngày hiện tại của user
 */
insightsRouter.get('/v2/study-plan', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    if (!aiInsightsService.getUserPreference(userId)) {
      return res.json({ enabled: false, status: 'disabled', plan: null });
    }
    const plan = await geminiInsightsService.getStudyPlan(userId);
    res.json({ enabled: true, plan });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi tải kế hoạch học tập' });
  }
});

/**
 * POST /api/v1/insights/v2/study-plan/generate
 * Sinh kế hoạch học 7 ngày cá nhân hóa bằng Gemini
 */
insightsRouter.post('/v2/study-plan/generate', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    if (!aiInsightsService.getUserPreference(userId)) {
      return res.status(403).json({
        enabled: false,
        error: 'Tính năng phân tích đang bị tắt theo cài đặt quyền riêng tư của bạn.',
      });
    }
    const goal = req.body?.goal || 'general';
    const forceNew = Boolean(req.body?.forceNew);
    const plan = await geminiInsightsService.generateStudyPlan(userId, goal, forceNew);
    res.json({ success: true, enabled: true, plan });
  } catch (err: any) {
    const isAiConfigError = err.message?.includes('Chưa kết nối AI') || err.message?.includes('GEMINI_API_KEY');
    res.status(isAiConfigError ? 503 : 500).json({
      error: err.message || 'Lỗi khi sinh kế hoạch học 7 ngày',
      aiConnected: !isAiConfigError,
    });
  }
});

/**
 * PATCH /api/v1/insights/v2/study-plan/toggle-task
 * Đánh dấu hoàn thành / chưa hoàn thành 1 nhiệm vụ trong checklist 7 ngày
 */
insightsRouter.patch('/v2/study-plan/toggle-task', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).authUserId;
    const { taskId, completed } = req.body;
    if (!taskId || typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Trường "taskId" và "completed" (boolean) là bắt buộc.' });
    }
    const plan = await geminiInsightsService.toggleStudyPlanTask(userId, taskId, completed);
    res.json({ success: true, plan });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lỗi khi cập nhật tiến độ nhiệm vụ' });
  }
});

