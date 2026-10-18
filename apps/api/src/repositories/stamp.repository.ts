import fs from 'fs';
import path from 'path';
import { prisma, isDatabaseAvailable } from '../lib/prisma.js';
import { getFormattedDateInTimezone } from '../../../../packages/domain/src/index.js';

export interface StampLedgerEntity {
  id: string;
  userId: string;
  delta: number;
  reason: string;
  createdAt: Date;
}

interface StampStoreData {
  dailyFreeWritingRecord: Record<string, boolean>;
  dailyAwardRecords: Record<string, boolean>;
  fallbackLedger: StampLedgerEntity[];
}

const DATA_DIR = typeof __dirname !== 'undefined'
  ? path.resolve(__dirname, '../../data')
  : path.resolve(process.cwd(), 'apps/api/data');
const STAMP_STORE_FILE = path.join(DATA_DIR, 'stamp-store.json');

export class StampRepository {
  private static instance: StampRepository;
  private inMemoryLedger: StampLedgerEntity[] = [];
  private dailyFreeWritingRecord: Record<string, boolean> = {};
  private dailyAwardRecords: Record<string, boolean> = {};

  constructor() {
    this.ensureDirectory();
    this.load();
  }

  public static getInstance(): StampRepository {
    if (!StampRepository.instance) {
      StampRepository.instance = new StampRepository();
    }
    return StampRepository.instance;
  }

  private ensureDirectory() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      console.error('[StampRepository] Failed to ensure data directory:', err);
    }
  }

  public load() {
    try {
      if (fs.existsSync(STAMP_STORE_FILE)) {
        const raw = fs.readFileSync(STAMP_STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as StampStoreData;
        this.dailyFreeWritingRecord = parsed.dailyFreeWritingRecord || {};
        this.dailyAwardRecords = parsed.dailyAwardRecords || {};
        if (Array.isArray(parsed.fallbackLedger)) {
          this.inMemoryLedger = parsed.fallbackLedger.map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt),
          }));
        }
      }
    } catch (err) {
      console.error('[StampRepository] Failed to load stamp-store.json:', err);
    }
  }

  public save() {
    try {
      this.ensureDirectory();
      const payload: StampStoreData = {
        dailyFreeWritingRecord: this.dailyFreeWritingRecord,
        dailyAwardRecords: this.dailyAwardRecords,
        fallbackLedger: this.inMemoryLedger,
      };
      fs.writeFileSync(STAMP_STORE_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('[StampRepository] Failed to save stamp-store.json:', err);
    }
  }

  /**
   * Tính số dư tem hiện tại = SUM(delta), áp dụng giới hạn [0, 10]
   */
  public async getBalance(userId: string): Promise<number> {
    if (await isDatabaseAvailable()) {
      try {
        const records = await prisma.stampLedger.findMany({
          where: { userId },
          select: { delta: true },
        });
        const sum = records.reduce((acc, r) => acc + r.delta, 0);
        return Math.min(10, Math.max(0, sum));
      } catch {}
    }
    const userRecords = this.inMemoryLedger.filter((r) => r.userId === userId);
    const sum = userRecords.reduce((acc, r) => acc + r.delta, 0);
    return Math.min(10, Math.max(0, sum));
  }

  /**
   * Lịch sử ledger tem (append-only)
   */
  public async getHistory(userId: string): Promise<StampLedgerEntity[]> {
    if (await isDatabaseAvailable()) {
      try {
        const records = await prisma.stampLedger.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 30,
        });
        return records;
      } catch {}
    }
    return this.inMemoryLedger
      .filter((r) => r.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Cộng tem vào sổ với:
   * - Enforce cap tối đa 10 tem
   * - Idempotency & chống farm: mỗi (userId, reason, ngày Asia/Ho_Chi_Minh) chỉ được award 1 lần
   */
  public async awardStamps(
    userId: string,
    reason: 'DAILY_GOAL' | 'PERFECT_SCORE' | 'STREAK_7_DAYS' | string,
    delta: number
  ): Promise<{ success: boolean; deltaAwarded: number; newBalance: number; message: string }> {
    const todayStr = getFormattedDateInTimezone(new Date(), 'Asia/Ho_Chi_Minh');
    const idempotencyKey = `${userId}_${reason}_${todayStr}`;

    const currentBalance = await this.getBalance(userId);

    // Chặn trùng lặp / farm trong cùng ngày
    if (this.dailyAwardRecords[idempotencyKey]) {
      return {
        success: false,
        deltaAwarded: 0,
        newBalance: currentBalance,
        message: 'Nhiệm vụ này đã nhận tem hôm nay rồi. Mỗi ngày chỉ được nhận 1 lần!',
      };
    }

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

    if (await isDatabaseAvailable()) {
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
    } else {
      this.inMemoryLedger.push(newEntry);
    }

    // Đánh dấu đã nhận thành công và lưu file persistent
    this.dailyAwardRecords[idempotencyKey] = true;
    this.save();

    const newBalance = currentBalance + actualDelta;
    return {
      success: true,
      deltaAwarded: actualDelta,
      newBalance,
      message: `Đã dán thêm +${actualDelta} tem vào sổ!`,
    };
  }

  /**
   * Kiểm tra xem hôm nay user đã dùng lượt chấm AI miễn phí chưa (theo Asia/Ho_Chi_Minh)
   */
  public async hasUsedFreeWritingToday(userId: string, todayDateStr: string): Promise<boolean> {
    const key = `${userId}_${todayDateStr}`;
    return this.dailyFreeWritingRecord[key] === true;
  }

  /**
   * Đổi lượt chấm AI writing:
   * - Mỗi ngày 1 lượt free
   * - Từ lượt 2: tốn 1 tem/lượt
   * - Hết tem: báo "Hết tem, mai quay lại"
   * Trạng thái free writing được lưu bền vững (persist), restart server không bị reset
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
      this.dailyFreeWritingRecord[`${userId}_${todayDateStr}`] = true;
      this.save();

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

    if (await isDatabaseAvailable()) {
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
    } else {
      this.inMemoryLedger.push(newEntry);
    }

    this.save();
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
