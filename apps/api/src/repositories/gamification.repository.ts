import { prisma, isDatabaseConnected } from '../lib/prisma.js';

export interface DailyQuestEntity {
  id: string;
  date: string;
  questType: string;
  title: string;
  targetCount: number;
  xpReward: number;
}

export interface UserQuestProgressEntity {
  id?: string;
  userId: string;
  questId: string;
  currentCount: number;
  isClaimed: boolean;
  claimedAt?: string | null;
}

export interface WeeklyLeagueEntity {
  id?: string;
  tier: string;
  weekNumber: number;
  year: number;
  userId: string;
  weeklyXP: number;
  rank: number;
}

const MEM_DAILY_QUESTS: DailyQuestEntity[] = [
  { id: 'dq-vocab-15', date: 'default', questType: 'vocabulary', title: 'Ôn tập 15 từ vựng với Spaced Repetition', targetCount: 15, xpReward: 30 },
  { id: 'dq-read-1', date: 'default', questType: 'reading', title: 'Đọc và hoàn thành 1 bài đọc hiểu', targetCount: 1, xpReward: 35 },
  { id: 'dq-write-1', date: 'default', questType: 'writing', title: 'Hoàn thành 1 bài viết ở Writing Lab', targetCount: 1, xpReward: 40 },
  { id: 'dq-speak-2', date: 'default', questType: 'speaking', title: 'Luyện phát âm chuẩn 2 câu trong Speaking Lab', targetCount: 2, xpReward: 40 },
  { id: 'dq-exam-1', date: 'default', questType: 'exam', title: 'Làm 1 bài luyện thi trắc nghiệm TOEIC / VSTEP', targetCount: 1, xpReward: 50 },
  { id: 'dq-xp-100', date: 'default', questType: 'xp', title: 'Tích lũy 100 XP trong ngày', targetCount: 100, xpReward: 45 },
];

const MEM_USER_QUEST_PROGRESS: Record<string, UserQuestProgressEntity> = {};

export class GamificationRepository {
  private static instance: GamificationRepository;

  public static getInstance(): GamificationRepository {
    if (!GamificationRepository.instance) {
      GamificationRepository.instance = new GamificationRepository();
    }
    return GamificationRepository.instance;
  }

  public async getDailyQuests(date?: string): Promise<DailyQuestEntity[]> {
    if (isDatabaseConnected()) {
      try {
        const quests = await prisma.dailyQuest.findMany({
          where: {
            OR: [
              { date: date || 'default' },
              { date: 'default' },
            ],
          },
        });
        if (quests.length > 0) return quests;
      } catch (err) {}
    }

    return MEM_DAILY_QUESTS;
  }

  public async getUserQuestProgress(userId: string): Promise<UserQuestProgressEntity[]> {
    if (isDatabaseConnected()) {
      try {
        const progressList = await prisma.userQuestProgress.findMany({
          where: { userId },
        });
        if (progressList.length > 0) {
          return progressList.map((p) => ({
            id: p.id,
            userId: p.userId,
            questId: p.questId,
            currentCount: p.currentCount,
            isClaimed: p.isClaimed,
            claimedAt: p.claimedAt ? p.claimedAt.toISOString() : null,
          }));
        }
      } catch (err) {}
    }

    return Object.values(MEM_USER_QUEST_PROGRESS).filter((p) => p.userId === userId);
  }

  public async updateQuestProgress(
    userId: string,
    questId: string,
    incrementCount: number
  ): Promise<UserQuestProgressEntity> {
    const key = `${userId}-${questId}`;
    let record = MEM_USER_QUEST_PROGRESS[key] || {
      userId,
      questId,
      currentCount: 0,
      isClaimed: false,
    };
    record.currentCount += incrementCount;
    MEM_USER_QUEST_PROGRESS[key] = record;

    if (isDatabaseConnected()) {
      try {
        const updated = await prisma.userQuestProgress.upsert({
          where: {
            userId_questId: { userId, questId },
          },
          update: {
            currentCount: { increment: incrementCount },
          },
          create: {
            userId,
            questId,
            currentCount: incrementCount,
            isClaimed: false,
          },
        });

        return {
          id: updated.id,
          userId: updated.userId,
          questId: updated.questId,
          currentCount: updated.currentCount,
          isClaimed: updated.isClaimed,
          claimedAt: updated.claimedAt ? updated.claimedAt.toISOString() : null,
        };
      } catch (err) {}
    }

    return record;
  }

  public async claimQuestReward(userId: string, questId: string): Promise<boolean> {
    const key = `${userId}-${questId}`;
    if (MEM_USER_QUEST_PROGRESS[key]) {
      MEM_USER_QUEST_PROGRESS[key].isClaimed = true;
      MEM_USER_QUEST_PROGRESS[key].claimedAt = new Date().toISOString();
    }

    if (isDatabaseConnected()) {
      try {
        await prisma.userQuestProgress.update({
          where: {
            userId_questId: { userId, questId },
          },
          data: {
            isClaimed: true,
            claimedAt: new Date(),
          },
        });
        return true;
      } catch (err) {}
    }

    return true;
  }

  public async getWeeklyLeaderboard(tier: string = 'Bronze', weekNumber: number = 37, year: number = 2026): Promise<WeeklyLeagueEntity[]> {
    if (isDatabaseConnected()) {
      try {
        const list = await prisma.weeklyLeague.findMany({
          where: { tier, weekNumber, year },
          orderBy: { rank: 'asc' },
          take: 50,
        });
        if (list.length > 0) return list;
      } catch (err) {}
    }

    return [
      { tier, weekNumber, year, userId: 'demo-user-id-001', weeklyXP: 1450, rank: 1 },
      { tier, weekNumber, year, userId: 'user-top-2', weeklyXP: 1320, rank: 2 },
      { tier, weekNumber, year, userId: 'user-top-3', weeklyXP: 1180, rank: 3 },
    ];
  }
}

export const gamificationRepository = GamificationRepository.getInstance();
