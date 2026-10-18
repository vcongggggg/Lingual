import { Router, Request, Response } from 'express';
import { stampRepository } from '../repositories/stamp.repository.js';
import { resolveAuthUserId } from '../lib/authUtil.js';
import { getFormattedDateInTimezone } from '../../../../packages/domain/src/index.js';

export const stampRouter = Router();

/**
 * GET /api/v1/stamps
 * Lấy số dư sổ tem, lịch sử dán tem và trạng thái lượt chấm AI miễn phí trong ngày
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
 * POST /api/v1/stamps/award
 * Dán tem vào sổ khi hoàn thành nhiệm vụ:
 * - Hoàn thành mục tiêu ngày (+1)
 * - Bài học điểm tuyệt đối (+1)
 * - Streak 7 ngày (+2)
 * Chỉ cộng qua API, enforce cap 10
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
  const expectedDelta = validReasons[reasonKey] || (typeof delta === 'number' && delta > 0 ? delta : 1);

  const result = await stampRepository.awardStamps(userId, reasonKey, expectedDelta);

  return res.json({
    success: result.success,
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
