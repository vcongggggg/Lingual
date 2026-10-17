import { prisma } from '../lib/prisma.js';
import { Role } from '../../../../packages/domain/src/index.js';

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
  googleId?: string | null;
  avatarUrl?: string | null;
  authProvider?: string;
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
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return user as unknown as UserEntity;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) return null;
    return user as unknown as UserEntity;
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
    const user = await prisma.user.create({
      data: {
        id: data.id,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash || null,
        displayName: data.displayName,
        role: (data.role as any) || 'STUDENT',
        interfaceLocale: data.interfaceLocale || 'vi',
        timezone: data.timezone || 'Asia/Ho_Chi_Minh',
        dailyGoalMinutes: 15,
        totalXP: 0,
        currentStreak: 0,
        streakFreezes: 1,
        lastActiveDate: null,
        googleId: data.googleId || null,
        avatarUrl: data.avatarUrl || null,
        authProvider: data.authProvider || 'local',
      },
    });
    return user as unknown as UserEntity;
  }

  public async updateStreakAndXP(
    userId: string,
    currentStreak: number,
    streakFreezes: number,
    lastActiveDate: string,
    xpIncrement: number
  ): Promise<{ currentStreak: number; totalXP: number }> {
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
    } catch {
      return { currentStreak, totalXP: 0 };
    }
  }

  public async updateRole(userId: string, newRole: Role): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { role: newRole as any },
      });
      return true;
    } catch {
      return false;
    }
  }

  public async getAllUsers(): Promise<Omit<UserEntity, 'passwordHash'>[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map(({ passwordHash, ...u }) => u as unknown as Omit<UserEntity, 'passwordHash'>);
  }
}

export const userRepository = UserRepository.getInstance();
