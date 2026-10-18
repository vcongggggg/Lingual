import fs from 'fs';
import path from 'path';
import { prisma, isDatabaseAvailable } from '../lib/prisma.js';
import { Role } from '../../../../packages/domain/src/index.js';
import {
  getFormattedDateInTimezone,
  getFormattedWeekInTimezone,
  getYesterdayDateString,
  getDayDifference,
} from '../../../../packages/domain/src/index.js';
import { stampRepository } from './stamp.repository.js';

export interface UserEntity {
  id: string;
  email: string;
  passwordHash?: string | null;
  displayName: string;
  role: Role;
  interfaceLocale: string;
  timezone: string;
  dailyGoalMinutes: number;
  totalXP: number;
  currentStreak: number;
  streakFreezes: number;
  lastActiveDate: string | null;
  leavePasses: number;
  leave_passes?: number;
  lastLeavePassGrantWeek: string | null;
  lastLeavePassUsedDate?: string | null;
  googleId?: string | null;
  avatarUrl?: string | null;
  authProvider?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DATA_DIR = typeof __dirname !== 'undefined'
  ? path.resolve(__dirname, '../../data')
  : path.resolve(process.cwd(), 'apps/api/data');
const USERS_STORE_FILE = path.join(DATA_DIR, 'users-store.json');

export class UserRepository {
  private static instance: UserRepository;
  private inMemoryUsers: Record<string, UserEntity> = {};

  constructor() {
    this.ensureDirectory();
    this.load();
  }

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  private ensureDirectory() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      console.error('[UserRepository] Failed to ensure data directory:', err);
    }
  }

  public load() {
    try {
      if (fs.existsSync(USERS_STORE_FILE)) {
        const raw = fs.readFileSync(USERS_STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        for (const [id, u] of Object.entries(parsed as Record<string, any>)) {
          this.inMemoryUsers[id] = {
            ...u,
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt),
          };
        }
      }
    } catch (err) {
      console.error('[UserRepository] Failed to load users-store.json:', err);
    }
  }

  public save() {
    try {
      this.ensureDirectory();
      fs.writeFileSync(USERS_STORE_FILE, JSON.stringify(this.inMemoryUsers, null, 2), 'utf-8');
    } catch (err) {
      console.error('[UserRepository] Failed to save users-store.json:', err);
    }
  }

  private normalizeUser(user: any): UserEntity {
    return {
      ...user,
      leavePasses: user.leavePasses ?? user.leave_passes ?? 0,
      leave_passes: user.leavePasses ?? user.leave_passes ?? 0,
      lastLeavePassGrantWeek: user.lastLeavePassGrantWeek ?? null,
      lastLeavePassUsedDate: user.lastLeavePassUsedDate ?? null,
    };
  }

  /**
   * Cấp phiếu lười (lazy-grant) phía server:
   * Mỗi lần đọc, nếu lastLeavePassGrantWeek < tuần hiện tại (Asia/Ho_Chi_Minh) thì set = 1, cập nhật tuần.
   * Tối đa 1 phiếu.
   */
  public async ensureLeavePassesGranted(user: UserEntity, now: Date = new Date()): Promise<UserEntity> {
    const currentWeek = getFormattedWeekInTimezone(now, 'Asia/Ho_Chi_Minh');
    if (!user.lastLeavePassGrantWeek || user.lastLeavePassGrantWeek < currentWeek) {
      user.leavePasses = 1;
      user.leave_passes = 1;
      user.lastLeavePassGrantWeek = currentWeek;

      if (await isDatabaseAvailable()) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              leavePasses: 1,
              lastLeavePassGrantWeek: currentWeek,
            },
          });
        } catch {}
      }
      this.inMemoryUsers[user.id] = { ...user, updatedAt: new Date() };
      this.save();
    }
    return user;
  }

  public async findById(id: string): Promise<UserEntity | null> {
    let user: UserEntity | null = null;
    if (await isDatabaseAvailable()) {
      try {
        const dbUser = await prisma.user.findUnique({ where: { id } });
        if (dbUser) user = this.normalizeUser(dbUser);
      } catch {}
    }

    if (!user && this.inMemoryUsers[id]) {
      user = this.normalizeUser(this.inMemoryUsers[id]);
    }

    if (!user) return null;

    // Tự động lazy-grant phiếu nghỉ phép khi đọc
    return await this.ensureLeavePassesGranted(user);
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const normalizedEmail = email.toLowerCase();
    let user: UserEntity | null = null;
    if (await isDatabaseAvailable()) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });
        if (dbUser) user = this.normalizeUser(dbUser);
      } catch {}
    }

    if (!user) {
      const found = Object.values(this.inMemoryUsers).find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );
      if (found) user = this.normalizeUser(found);
    }

    if (!user) return null;
    return await this.ensureLeavePassesGranted(user);
  }

  public async createUser(data: {
    id: string;
    email: string;
    passwordHash?: string | null;
    displayName: string;
    role?: Role;
    interfaceLocale?: string;
    timezone?: string;
    googleId?: string | null;
    avatarUrl?: string | null;
    authProvider?: string;
  }): Promise<UserEntity> {
    const currentWeek = getFormattedWeekInTimezone(new Date(), 'Asia/Ho_Chi_Minh');
    const newUser: UserEntity = {
      id: data.id,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash || null,
      displayName: data.displayName,
      role: data.role || ('STUDENT' as Role),
      interfaceLocale: data.interfaceLocale || 'vi',
      timezone: data.timezone || 'Asia/Ho_Chi_Minh',
      dailyGoalMinutes: 15,
      totalXP: 0,
      currentStreak: 0,
      streakFreezes: 1,
      lastActiveDate: null,
      leavePasses: 1, // Tuần đầu tiên được cấp 1 phiếu
      leave_passes: 1,
      lastLeavePassGrantWeek: currentWeek,
      lastLeavePassUsedDate: null,
      googleId: data.googleId || null,
      avatarUrl: data.avatarUrl || null,
      authProvider: data.authProvider || 'local',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (await isDatabaseAvailable()) {
      try {
        const dbUser = await prisma.user.create({
          data: {
            id: newUser.id,
            email: newUser.email,
            passwordHash: newUser.passwordHash,
            displayName: newUser.displayName,
            role: newUser.role as any,
            interfaceLocale: newUser.interfaceLocale,
            timezone: newUser.timezone,
            dailyGoalMinutes: newUser.dailyGoalMinutes,
            totalXP: newUser.totalXP,
            currentStreak: newUser.currentStreak,
            streakFreezes: newUser.streakFreezes,
            lastActiveDate: newUser.lastActiveDate,
            leavePasses: newUser.leavePasses,
            lastLeavePassGrantWeek: newUser.lastLeavePassGrantWeek,
            lastLeavePassUsedDate: newUser.lastLeavePassUsedDate,
            googleId: newUser.googleId,
            avatarUrl: newUser.avatarUrl,
            authProvider: newUser.authProvider,
          },
        });
        const normalized = this.normalizeUser(dbUser);
        this.inMemoryUsers[newUser.id] = normalized;
        this.save();
        return normalized;
      } catch {}
    }
    this.inMemoryUsers[newUser.id] = newUser;
    this.save();
    return newUser;
  }

  /**
   * Đánh giá và cập nhật streak + phiếu nghỉ phép hoàn toàn phía SERVER:
   * - Miss đúng 1 ngày + còn phiếu > 0 -> trừ 1 phiếu, giữ streak, leavePassUsed: true
   * - Hết phiếu mà miss -> streak reset về 0 (hoặc 1 nếu hoàn thành bài hôm nay)
   * - Timezone luôn là Asia/Ho_Chi_Minh
   */
  public async evaluateStreakAndLeavePasses(
    userId: string,
    options?: { isCompletingActivityToday?: boolean; currentDate?: Date }
  ): Promise<{
    user: UserEntity;
    currentStreak: number;
    leavePasses: number;
    leavePassUsed: boolean;
    streakBroken: boolean;
    streakMaintained: boolean;
  }> {
    let user = await this.findById(userId);
    if (!user) {
      // Tự động tạo người dùng demo nếu chưa tồn tại
      user = await this.createUser({
        id: userId,
        email: `${userId}@lingual.local`,
        displayName: 'Học viên',
        role: 'STUDENT' as Role,
      });
    }

    const now = options?.currentDate || new Date();
    const todayStr = getFormattedDateInTimezone(now, 'Asia/Ho_Chi_Minh');
    const isCompleting = options?.isCompletingActivityToday ?? false;

    // Đảm bảo lazy-grant phiếu tuần
    user = await this.ensureLeavePassesGranted(user, now);

    // Chưa từng hoạt động
    if (!user.lastActiveDate) {
      if (isCompleting) {
        user.currentStreak = 1;
        user.lastActiveDate = todayStr;
        await this.persistUser(user);
      }
      return {
        user,
        currentStreak: user.currentStreak,
        leavePasses: user.leavePasses,
        leavePassUsed: false,
        streakBroken: false,
        streakMaintained: true,
      };
    }

    // Đã hoạt động hôm nay rồi
    if (user.lastActiveDate === todayStr) {
      const leavePassUsed = user.lastLeavePassUsedDate === todayStr;
      return {
        user,
        currentStreak: user.currentStreak,
        leavePasses: user.leavePasses,
        leavePassUsed,
        streakBroken: false,
        streakMaintained: true,
      };
    }

    const diffDays = getDayDifference(user.lastActiveDate, todayStr);

    if (diffDays === 1) {
      // Ngày liên tiếp
      if (isCompleting) {
        user.currentStreak += 1;
        user.lastActiveDate = todayStr;
        // Kiểm tra mốc 7 ngày để tự động tặng tem
        if (user.currentStreak === 7) {
          await stampRepository.awardStamps(user.id, 'STREAK_7_DAYS', 2);
        }
        await this.persistUser(user);
      }
      return {
        user,
        currentStreak: user.currentStreak,
        leavePasses: user.leavePasses,
        leavePassUsed: false,
        streakBroken: false,
        streakMaintained: true,
      };
    } else if (diffDays === 2) {
      // Quên học ĐÚNG 1 ngày (hôm qua)!
      if (user.lastLeavePassUsedDate === todayStr) {
        // Đã áp dụng phiếu cho ngày hôm nay rồi
        if (isCompleting) {
          user.currentStreak += 1;
          user.lastActiveDate = todayStr;
          if (user.currentStreak === 7) {
            await stampRepository.awardStamps(user.id, 'STREAK_7_DAYS', 2);
          }
          await this.persistUser(user);
        }
        return {
          user,
          currentStreak: user.currentStreak,
          leavePasses: user.leavePasses,
          leavePassUsed: true,
          streakBroken: false,
          streakMaintained: true,
        };
      }

      if (user.leavePasses > 0) {
        // CÒN PHIẾU > 0: TRỪ 1 PHIẾU, GIỮ STREAK!
        user.leavePasses -= 1;
        user.leave_passes = user.leavePasses;
        user.lastLeavePassUsedDate = todayStr;
        user.lastActiveDate = getYesterdayDateString(todayStr); // Hôm qua đã được bảo vệ

        if (isCompleting) {
          user.currentStreak += 1;
          user.lastActiveDate = todayStr;
          if (user.currentStreak === 7) {
            await stampRepository.awardStamps(user.id, 'STREAK_7_DAYS', 2);
          }
        }

        await this.persistUser(user);
        return {
          user,
          currentStreak: user.currentStreak,
          leavePasses: user.leavePasses,
          leavePassUsed: true,
          streakBroken: false,
          streakMaintained: true,
        };
      } else {
        // HẾT PHIẾU MÀ MISS: STREAK ĐỨT NHƯ CŨ!
        user.currentStreak = isCompleting ? 1 : 0;
        if (isCompleting) {
          user.lastActiveDate = todayStr;
        }
        await this.persistUser(user);
        return {
          user,
          currentStreak: user.currentStreak,
          leavePasses: 0,
          leavePassUsed: false,
          streakBroken: true,
          streakMaintained: false,
        };
      }
    } else {
      // Quên học từ 2 ngày trở lên -> streak đứt
      user.currentStreak = isCompleting ? 1 : 0;
      if (isCompleting) {
        user.lastActiveDate = todayStr;
      }
      await this.persistUser(user);
      return {
        user,
        currentStreak: user.currentStreak,
        leavePasses: user.leavePasses,
        leavePassUsed: false,
        streakBroken: true,
        streakMaintained: false,
      };
    }
  }

  public async persistUser(user: UserEntity): Promise<void> {
    user.updatedAt = new Date();
    if (await isDatabaseAvailable()) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            currentStreak: user.currentStreak,
            leavePasses: user.leavePasses,
            lastLeavePassGrantWeek: user.lastLeavePassGrantWeek,
            lastLeavePassUsedDate: user.lastLeavePassUsedDate,
            lastActiveDate: user.lastActiveDate,
            totalXP: user.totalXP,
          },
        });
      } catch {}
    }
    this.inMemoryUsers[user.id] = { ...user };
    this.save();
  }

  public async updateStreakAndXP(
    userId: string,
    currentStreak: number,
    streakFreezes: number,
    lastActiveDate: string,
    xpIncrement: number,
    leavePasses?: number
  ): Promise<{ currentStreak: number; totalXP: number; leavePasses: number }> {
    if (await isDatabaseAvailable()) {
      try {
        const updateData: any = {
          currentStreak,
          streakFreezes,
          lastActiveDate,
          totalXP: { increment: xpIncrement },
        };
        if (typeof leavePasses === 'number') {
          updateData.leavePasses = leavePasses;
        }
        const updated = await prisma.user.update({
          where: { id: userId },
          data: updateData,
        });
        const norm = this.normalizeUser(updated);
        this.inMemoryUsers[userId] = norm;
        this.save();
        return {
          currentStreak: norm.currentStreak,
          totalXP: norm.totalXP,
          leavePasses: norm.leavePasses,
        };
      } catch {}
    }
    const user = this.inMemoryUsers[userId];
    if (user) {
      user.currentStreak = currentStreak;
      user.streakFreezes = streakFreezes;
      user.lastActiveDate = lastActiveDate;
      user.totalXP += xpIncrement;
      if (typeof leavePasses === 'number') {
        user.leavePasses = leavePasses;
        user.leave_passes = leavePasses;
      }
      this.save();
      return {
        currentStreak: user.currentStreak,
        totalXP: user.totalXP,
        leavePasses: user.leavePasses,
      };
    }
    return { currentStreak, totalXP: 0, leavePasses: leavePasses ?? 0 };
  }

  public async updateRole(userId: string, newRole: Role): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { role: newRole as any },
      });
      return true;
    } catch {
      if (this.inMemoryUsers[userId]) {
        this.inMemoryUsers[userId].role = newRole;
        this.save();
        return true;
      }
      return false;
    }
  }

  public async getAllUsers(): Promise<Omit<UserEntity, 'passwordHash'>[]> {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return users.map(({ passwordHash, ...u }) => this.normalizeUser(u));
    } catch {
      return Object.values(this.inMemoryUsers).map(({ passwordHash, ...u }) => this.normalizeUser(u));
    }
  }
}

export const userRepository = UserRepository.getInstance();
