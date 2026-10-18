import { Router, Request, Response } from 'express';
import { stampRepository } from '../repositories/stamp.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { resolveAuthUserId } from '../lib/authUtil.js';
import { getFormattedDateInTimezone } from '../../../../packages/domain/src/index.js';

export const stampRouter = Router();

/**
 * GET /api/v1/stamps
 * Lấy số dư sổ tem, lịch sử dán tem và trạng thái lượt chấm AI miễn phí trong ngày (theo Asia/Ho_Chi_Minh)
 */
stampRouter.get('/', async (req: Request, res: Response) => {
  const userId = resolveAuthUserId(req) || 'demo-user-id-001';
  const todayStr = getFormattedDateInTimezone(new Date(), 'Asia/Ho_Chi_Minh');

  const [balance, history, freeUsed] = await Promise.all([
    stampRepository.getBalance(userId),
    stampRepository.getHistory(userId),
    stampRepository.hasUsedFreeWritingToday(userId, todayStr),
  ]);

  return res.json({
    balance,
    maxCap: 10,
    history,
    freeWritingUsedToday: freeUsed,
    freeWritingRemainingToday: freeUsed ? 0 : 1,
    canEvaluateWriting: !freeUsed || balance > 0,
  });
});

/**
 * POST /api/v1/stamps/claim-daily-goal
 * Server tự xác minh điều kiện hoàn thành mục tiêu ngày trước khi trao tem
 */
stampRouter.post('/claim-daily-goal', async (req: Request, res: Response) => {
  const userId = resolveAuthUserId(req) || 'demo-user-id-001';
  const todayStr = getFormattedDateInTimezone(new Date(), 'Asia/Ho_Chi_Minh');

  const user = await userRepository.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy người dùng' });
  }

  // Xác minh điều kiện: user đã có hoạt động trong ngày hôm nay
  const hasStudiedToday = user.lastActiveDate === todayStr || user.currentStreak > 0;
  if (!hasStudiedToday) {
    return res.status(400).json({
      success: false,
      error: 'Chưa đạt mục tiêu học tập ngày hôm nay để nhận tem.',
    });
  }

  const result = await stampRepository.awardStamps(userId, 'DAILY_GOAL', 1);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.message,
      newBalance: result.newBalance,
    });
  }

  return res.json({
    success: true,
    deltaAwarded: result.deltaAwarded,
    newBalance: result.newBalance,
    message: result.message,
    maxCap: 10,
  });
});

/**
 * POST /api/v1/stamps/award
 * Dán tem vào sổ (có xác minh & chống farm):
 * - Mỗi (userId, reason, ngày Asia/Ho_Chi_Minh) chỉ award 1 lần
 * - Enforce cap tối đa 10 tem
 */
stampRouter.post('/award', async (req: Request, res: Response) => {
  const userId = resolveAuthUserId(req) || 'demo-user-id-001';
  const { reason, delta = 1 } = req.body;

  const validReasons: Record<string, number> = {
    DAILY_GOAL: 1,
    PERFECT_SCORE: 1,
    STREAK_7_DAYS: 2,
  };

  const reasonKey = reason || 'DAILY_GOAL';
  if (!validReasons[reasonKey]) {
    return res.status(400).json({
      success: false,
      error: `Lý do dán tem không hợp lệ: ${reason}. Chỉ chấp nhận: DAILY_GOAL, PERFECT_SCORE, STREAK_7_DAYS`,
    });
  }

  const expectedDelta = validReasons[reasonKey];
  const result = await stampRepository.awardStamps(userId, reasonKey, expectedDelta);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.message,
      deltaAwarded: 0,
      newBalance: result.newBalance,
      maxCap: 10,
    });
  }

  return res.json({
    success: true,
    deltaAwarded: result.deltaAwarded,
    newBalance: result.newBalance,
    message: result.message,
    maxCap: 10,
  });
});

/**
 * POST /api/v1/stamps/redeem-writing
 * Đổi lượt chấm AI writing:
 * - Mỗi ngày 1 lượt free
 * - Từ lượt 2: tốn 1 tem/lượt
 * - Hết tem: báo "Hết tem, mai quay lại" (HTTP 400)
 */
stampRouter.post('/redeem-writing', async (req: Request, res: Response) => {
  const userId = resolveAuthUserId(req) || 'demo-user-id-001';
  const todayStr = getFormattedDateInTimezone(new Date(), 'Asia/Ho_Chi_Minh');

  const result = await stampRepository.redeemWritingEvaluation(userId, todayStr);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.message, // "Hết tem, mai quay lại"
      newBalance: result.newBalance,
    });
  }

  return res.json({
    success: true,
    isFree: result.isFree,
    stampDeducted: result.stampDeducted,
    newBalance: result.newBalance,
    message: result.message,
  });
});
