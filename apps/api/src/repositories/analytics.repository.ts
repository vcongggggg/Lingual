import { prisma } from '../lib/prisma.js';

export interface LearningGoalEntity {
  id: string;
  userId: string;
  targetDailyMinutes: number;
  targetWeeklyXP: number;
  targetSkill: string;
  updatedAt: string;
}

export interface DailyActivityLogEntity {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  activeMinutes: number;
  xpEarned: number;
  lessonsCompleted: number;
  reviewsCompleted: number;
}

export class AnalyticsRepository {
  private static instance: AnalyticsRepository;

  public static getInstance(): AnalyticsRepository {
    if (!AnalyticsRepository.instance) {
      AnalyticsRepository.instance = new AnalyticsRepository();
    }
    return AnalyticsRepository.instance;
  }

  public async getGoal(userId: string): Promise<LearningGoalEntity> {
    try {
      const g = await prisma.learningGoal.findFirst({ where: { userId } });
      if (g) {
        return {
          id: g.id,
          userId: g.userId,
          targetDailyMinutes: g.targetDailyMinutes,
          targetWeeklyXP: g.targetWeeklyXP,
          targetSkill: g.targetSkill,
          updatedAt: g.updatedAt.toISOString(),
        };
      }
    } catch {}

    return {
      id: `goal-${userId}`,
      userId,
      targetDailyMinutes: 20,
      targetWeeklyXP: 350,
      targetSkill: 'all',
      updatedAt: new Date().toISOString(),
    };
  }

  public async setGoal(
    userId: string,
    data: { targetDailyMinutes: number; targetWeeklyXP: number; targetSkill: string }
  ): Promise<LearningGoalEntity> {
    try {
      const existing = await prisma.learningGoal.findFirst({ where: { userId } });
      if (existing) {
        const updated = await prisma.learningGoal.update({
          where: { id: existing.id },
          data: {
            targetDailyMinutes: data.targetDailyMinutes,
            targetWeeklyXP: data.targetWeeklyXP,
            targetSkill: data.targetSkill,
          },
        });
        return {
          id: updated.id,
          userId: updated.userId,
          targetDailyMinutes: updated.targetDailyMinutes,
          targetWeeklyXP: updated.targetWeeklyXP,
          targetSkill: updated.targetSkill,
          updatedAt: updated.updatedAt.toISOString(),
        };
      } else {
        const created = await prisma.learningGoal.create({
          data: {
            userId,
            targetDailyMinutes: data.targetDailyMinutes,
            targetWeeklyXP: data.targetWeeklyXP,
            targetSkill: data.targetSkill,
          },
        });
        return {
          id: created.id,
          userId: created.userId,
          targetDailyMinutes: created.targetDailyMinutes,
          targetWeeklyXP: created.targetWeeklyXP,
          targetSkill: created.targetSkill,
          updatedAt: created.updatedAt.toISOString(),
        };
      }
    } catch {
      return {
        id: `goal-${userId}`,
        userId,
        targetDailyMinutes: data.targetDailyMinutes,
        targetWeeklyXP: data.targetWeeklyXP,
        targetSkill: data.targetSkill,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  public async logActivity(data: {
    userId: string;
    date: string;
    activeMinutes: number;
    xpEarned: number;
    lessonsCompleted?: number;
    reviewsCompleted?: number;
  }): Promise<void> {
    try {
      await prisma.dailyActivityLog.upsert({
        where: {
          userId_date: {
            userId: data.userId,
            date: data.date,
          },
        },
        update: {
          activeMinutes: { increment: data.activeMinutes },
          xpEarned: { increment: data.xpEarned },
          lessonsCompleted: { increment: data.lessonsCompleted || 0 },
          reviewsCompleted: { increment: data.reviewsCompleted || 0 },
        },
        create: {
          userId: data.userId,
          date: data.date,
          activeMinutes: data.activeMinutes,
          xpEarned: data.xpEarned,
          lessonsCompleted: data.lessonsCompleted || 0,
          reviewsCompleted: data.reviewsCompleted || 0,
        },
      });
    } catch (err) {
      console.warn('Could not upsert dailyActivityLog in DB:', err);
    }
  }

  public async getActivityLogs(userId: string, limit: number = 30): Promise<DailyActivityLogEntity[]> {
    try {
      const logs = await prisma.dailyActivityLog.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: limit,
      });
      return logs;
    } catch {
      return [];
    }
  }
}

export const analyticsRepository = AnalyticsRepository.getInstance();
