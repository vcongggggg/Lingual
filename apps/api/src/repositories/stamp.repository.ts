import { prisma } from '../lib/prisma.js';

export interface StampLedgerEntity {
  id: string;
  userId: string;
  delta: number;
  reason: string;
  createdAt: Date;
}

export class StampRepository {
  private static instance: StampRepository;
  // In-memory fallback ledger when database is unavailable
  private inMemoryLedger: StampLedgerEntity[] = [
    {
      id: 'stamp-init-1',
      userId: 'demo-user-id-001',
      delta: 1,
      reason: 'DAILY_GOAL',
      createdAt: new Date(Date.now() - 3600000 * 24),
    },
    {
      id: 'stamp-init-2',
      userId: 'demo-user-id-001',
      delta: 1,
      reason: 'PERFECT_SCORE',
      createdAt: new Date(Date.now() - 3600000 * 12),
    },
    {
      id: 'stamp-init-3',
      userId: 'demo-user-id-001',
      delta: 1,
      reason: 'DAILY_GOAL',
      createdAt: new Date(Date.now() - 3600000 * 2),
    },
  ];

  // Map of userId_YYYY-MM-DD -> boolean indicating if free writing evaluation was used
  private dailyFreeWritingRecord: Map<string, boolean> = new Map();

  public static getInstance(): StampRepository {
    if (!StampRepository.instance) {
      StampRepository.instance = new StampRepository();
    }
    return StampRepository.instance;
  }

  /**
   * Tính số dư tem hiện tại = SUM(delta), áp dụng giới hạn [0, 10]
   */
  public async getBalance(userId: string): Promise<number> {
    try {
      const records = await prisma.stampLedger.findMany({
        where: { userId },
        select: { delta: true },
      });
      const sum = records.reduce((acc, r) => acc + r.delta, 0);
      return Math.min(10, Math.max(0, sum));
    } catch {
      const userRecords = this.inMemoryLedger.filter((r) => r.userId === userId || userId === 'demo-user-id-001');
      const sum = userRecords.reduce((acc, r) => acc + r.delta, 0);
      return Math.min(10, Math.max(0, sum));
    }
  }

  /**
   * Lịch sử ledger tem (append-only)
   */
  public async getHistory(userId: string): Promise<StampLedgerEntity[]> {
    try {
      const records = await prisma.stampLedger.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      });
      return records;
    } catch {
      return this.inMemoryLedger
        .filter((r) => r.userId === userId || userId === 'demo-user-id-001')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }

  /**
   * Cộng tem vào sổ với enforce cap tối đa 10 tem
   */
  public async awardStamps(
    userId: string,
    reason: 'DAILY_GOAL' | 'PERFECT_SCORE' | 'STREAK_7_DAYS' | string,
    delta: number
  ): Promise<{ success: boolean; deltaAwarded: number; newBalance: number; message: string }> {
    const currentBalance = await this.getBalance(userId);
    const room = 10 - currentBalance;

    if (room <= 0) {
      return {
        success: false,
        deltaAwarded: 0,
        newBalance: currentBalance,
        message: 'Sổ tem đã đầy (tối đa 10 tem). Hãy dùng bớt tem để nhận thêm!',
      };
    }

    const actualDelta = Math.min(delta, room);
    const newEntry: StampLedgerEntity = {
      id: `stamp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      delta: actualDelta,
      reason,
      createdAt: new Date(),
    };

    try {
      await prisma.stampLedger.create({
        data: {
          id: newEntry.id,
          userId,
          delta: actualDelta,
          reason,
          createdAt: newEntry.createdAt,
        },
      });
    } catch {
      this.inMemoryLedger.push(newEntry);
    }

    const newBalance = currentBalance + actualDelta;
    return {
      success: true,
      deltaAwarded: actualDelta,
      newBalance,
      message: `Đã dán thêm +${actualDelta} tem vào sổ!`,
    };
  }

  /**
   * Kiểm tra xem hôm nay user đã dùng lượt chấm AI miễn phí chưa
   */
  public async hasUsedFreeWritingToday(userId: string, todayDateStr: string): Promise<boolean> {
    const key = `${userId}_${todayDateStr}`;
    return this.dailyFreeWritingRecord.get(key) === true;
  }

  /**
   * Đổi lượt chấm AI writing:
   * - Mỗi ngày 1 lượt free
   * - Từ lượt 2: tốn 1 tem/lượt
   * - Hết tem: báo "Hết tem, mai quay lại"
   */
  public async redeemWritingEvaluation(
    userId: string,
    todayDateStr: string
  ): Promise<{
    success: boolean;
    isFree: boolean;
    stampDeducted: number;
    newBalance: number;
    message: string;
  }> {
    const freeUsed = await this.hasUsedFreeWritingToday(userId, todayDateStr);

    if (!freeUsed) {
      // Lượt đầu tiên trong ngày hoàn toàn MIỄN PHÍ
      this.dailyFreeWritingRecord.set(`${userId}_${todayDateStr}`, true);
      const balance = await this.getBalance(userId);
      return {
        success: true,
        isFree: true,
        stampDeducted: 0,
        newBalance: balance,
        message: 'Đã sử dụng lượt chấm AI miễn phí của ngày hôm nay!',
      };
    }

    // Từ lượt thứ 2: kiểm tra số dư tem
    const currentBalance = await this.getBalance(userId);
    if (currentBalance < 1) {
      return {
        success: false,
        isFree: false,
        stampDeducted: 0,
        newBalance: currentBalance,
        message: 'Hết tem, mai quay lại',
      };
    }

    // Trừ 1 tem qua ledger append-only
    const newEntry: StampLedgerEntity = {
      id: `stamp-redeem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      delta: -1,
      reason: 'AI_WRITING_EVALUATION',
      createdAt: new Date(),
    };

    try {
      await prisma.stampLedger.create({
        data: {
          id: newEntry.id,
          userId,
          delta: -1,
          reason: 'AI_WRITING_EVALUATION',
          createdAt: newEntry.createdAt,
        },
      });
    } catch {
      this.inMemoryLedger.push(newEntry);
    }

    const newBalance = currentBalance - 1;
    return {
      success: true,
      isFree: false,
      stampDeducted: 1,
      newBalance,
      message: 'Đã đổi 1 tem cho lượt chấm AI Writing thành công!',
    };
  }
}

export const stampRepository = StampRepository.getInstance();
