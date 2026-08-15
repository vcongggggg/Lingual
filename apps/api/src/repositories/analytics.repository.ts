import { prisma, isDatabaseConnected } from '../lib/prisma.js';

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

const MEM_GOALS: Record<string, LearningGoalEntity> = {
  'demo-user-id-001': {
    id: 'goal-demo-01',
    userId: 'demo-user-id-001',
    targetDailyMinutes: 25,
    targetWeeklyXP: 500,
    targetSkill: 'speaking',
    updatedAt: new Date().toISOString(),
  },
};

const MEM_ACTIVITY_LOGS: DailyActivityLogEntity[] = [];

export class AnalyticsRepository {
  private static instance: AnalyticsRepository;

  public static getInstance(): AnalyticsRepository {
    if (!AnalyticsRepository.instance) {
      AnalyticsRepository.instance = new AnalyticsRepository();
    }
    return AnalyticsRepository.instance;
  }

  public async getGoal(userId: string): Promise<LearningGoalEntity> {
    if (isDatabaseConnected()) {
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
    }

    return (
      MEM_GOALS[userId] || {
        id: `goal-${userId}`,
        userId,
        targetDailyMinutes: 20,
        targetWeeklyXP: 350,
        targetSkill: 'all',
        updatedAt: new Date().toISOString(),
      }
    );
  }

  public async setGoal(
    userId: string,
    data: { targetDailyMinutes: number; targetWeeklyXP: number; targetSkill: string }
  ): Promise<LearningGoalEntity> {
    const updated: LearningGoalEntity = {
      id: `goal-${userId}`,
      userId,
      targetDailyMinutes: data.targetDailyMinutes,
      targetWeeklyXP: data.targetWeeklyXP,
      targetSkill: data.targetSkill,
      updatedAt: new Date().toISOString(),
    };

    if (isDatabaseConnected()) {
      try {
        const existing = await prisma.learningGoal.findFirst({ where: { userId } });
        if (existing) {
          await prisma.learningGoal.update({
            where: { id: existing.id },
            data: {
              targetDailyMinutes: data.targetDailyMinutes,
              targetWeeklyXP: data.targetWeeklyXP,
              targetSkill: data.targetSkill,
            },
          });
        } else {
          await prisma.learningGoal.create({
            data: {
              userId,
              targetDailyMinutes: data.targetDailyMinutes,
              targetWeeklyXP: data.targetWeeklyXP,
              targetSkill: data.targetSkill,
            },
          });
        }
      } catch {}
    }

    MEM_GOALS[userId] = updated;
    return updated;
  }

  public async logActivity(data: {
    userId: string;
    date: string;
    activeMinutes: number;
    xpEarned: number;
    lessonsCompleted?: number;
    reviewsCompleted?: number;
  }): Promise<void> {
    if (isDatabaseConnected()) {
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
      } catch {}
    }

    const existing = MEM_ACTIVITY_LOGS.find((l) => l.userId === data.userId && l.date === data.date);
    if (existing) {
      existing.activeMinutes += data.activeMinutes;
      existing.xpEarned += data.xpEarned;
      existing.lessonsCompleted += data.lessonsCompleted || 0;
      existing.reviewsCompleted += data.reviewsCompleted || 0;
    } else {
      MEM_ACTIVITY_LOGS.push({
        id: `act-${Date.now()}`,
        userId: data.userId,
        date: data.date,
        activeMinutes: data.activeMinutes,
        xpEarned: data.xpEarned,
        lessonsCompleted: data.lessonsCompleted || 0,
        reviewsCompleted: data.reviewsCompleted || 0,
      });
    }
  }
}

export const analyticsRepository = AnalyticsRepository.getInstance();
