import { prisma, isDatabaseConnected } from '../lib/prisma.js';
import { MOCK_USERS } from '../routes/auth.js';
import { Role } from '../../../../packages/domain/src/index.js';

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: Role;
  interfaceLocale: string;
  timezone: string;
  dailyGoalMinutes: number;
  totalXP: number;
  currentStreak: number;
  streakFreezes: number;
  lastActiveDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository {
  private static instance: UserRepository;

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  public async findById(id: string): Promise<UserEntity | null> {
    if (isDatabaseConnected()) {
      try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (user) return user as UserEntity;
      } catch {}
    }
    const memUser = MOCK_USERS.find((u) => u.id === id);
    if (!memUser) return null;
    return {
      ...memUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserEntity;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    if (isDatabaseConnected()) {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) return user as UserEntity;
      } catch {}
    }
    const memUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!memUser) return null;
    return {
      ...memUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserEntity;
  }

  public async createUser(data: {
    id: string;
    email: string;
    passwordHash: string;
    displayName: string;
    role: Role;
    interfaceLocale?: string;
    timezone?: string;
  }): Promise<UserEntity> {
    const newUser: UserEntity = {
      id: data.id,
      email: data.email,
      passwordHash: data.passwordHash,
      displayName: data.displayName,
      role: data.role,
      interfaceLocale: data.interfaceLocale || 'vi',
      timezone: data.timezone || 'Asia/Ho_Chi_Minh',
      dailyGoalMinutes: 15,
      totalXP: 0,
      currentStreak: 0,
      streakFreezes: 1,
      lastActiveDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isDatabaseConnected()) {
      try {
        await prisma.user.create({
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
          },
        });
      } catch {}
    }

    // Keep memory store synced for local dev mode
    MOCK_USERS.push({
      id: newUser.id,
      email: newUser.email,
      passwordHash: newUser.passwordHash,
      displayName: newUser.displayName,
      role: newUser.role,
      interfaceLocale: newUser.interfaceLocale,
      timezone: newUser.timezone,
      dailyGoalMinutes: newUser.dailyGoalMinutes,
      totalXP: newUser.totalXP,
      currentStreak: newUser.currentStreak,
      streakFreezes: newUser.streakFreezes,
      lastActiveDate: newUser.lastActiveDate,
    });

    return newUser;
  }

  public async updateStreakAndXP(
    userId: string,
    currentStreak: number,
    streakFreezes: number,
    lastActiveDate: string,
    xpIncrement: number
  ): Promise<{ currentStreak: number; totalXP: number }> {
    if (isDatabaseConnected()) {
      try {
        const updated = await prisma.user.update({
          where: { id: userId },
          data: {
            currentStreak,
            streakFreezes,
            lastActiveDate,
            totalXP: { increment: xpIncrement },
          },
        });
        return { currentStreak: updated.currentStreak, totalXP: updated.totalXP };
      } catch {}
    }

    const memUser = MOCK_USERS.find((u) => u.id === userId);
    if (memUser) {
      memUser.currentStreak = currentStreak;
      memUser.streakFreezes = streakFreezes;
      memUser.lastActiveDate = lastActiveDate;
      memUser.totalXP += xpIncrement;
      return { currentStreak: memUser.currentStreak, totalXP: memUser.totalXP };
    }

    return { currentStreak, totalXP: xpIncrement };
  }

  public async updateRole(userId: string, newRole: Role): Promise<boolean> {
    if (isDatabaseConnected()) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { role: newRole as any },
        });
      } catch {}
    }

    const memUser = MOCK_USERS.find((u) => u.id === userId);
    if (memUser) {
      memUser.role = newRole;
      return true;
    }
    return false;
  }

  public async getAllUsers(): Promise<Omit<UserEntity, 'passwordHash'>[]> {
    if (isDatabaseConnected()) {
      try {
        const users = await prisma.user.findMany();
        return users.map(({ passwordHash, ...u }) => u as any);
      } catch {}
    }
    return MOCK_USERS.map(({ passwordHash, ...u }) => ({
      ...u,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }
}

export const userRepository = UserRepository.getInstance();
