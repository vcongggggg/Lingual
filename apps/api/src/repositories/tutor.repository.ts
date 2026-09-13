import { prisma, isDatabaseConnected } from '../lib/prisma.js';

export interface TutorSnapshotEntity {
  id?: string;
  userId: string;
  cefrEstimate: string;
  overallScore: number;
  weaknesses: string[];
  skillScoresJson: string;
  updatedAt?: string;
}

export interface AdaptivePlanEntity {
  id: string;
  userId: string;
  planName: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  status: string;
  items: Array<{
    id?: string;
    dayNumber: number;
    order: number;
    skill: string;
    title: string;
    focusTopic: string;
    estimatedMinutes: number;
    targetDrillUrl: string;
    completed: boolean;
    score?: number | null;
  }>;
}

export interface RecommendationEntity {
  id?: string;
  userId: string;
  skill: string;
  title: string;
  description: string;
  priority: string;
  actionUrl: string;
  reason: string;
  isDismissed?: boolean;
}

const MEM_SNAPSHOTS: Record<string, TutorSnapshotEntity> = {};
const MEM_PLANS: Record<string, AdaptivePlanEntity> = {};
const MEM_RECOMMENDATIONS: Record<string, RecommendationEntity[]> = {};

export class TutorRepository {
  private static instance: TutorRepository;

  public static getInstance(): TutorRepository {
    if (!TutorRepository.instance) {
      TutorRepository.instance = new TutorRepository();
    }
    return TutorRepository.instance;
  }

  public async saveSnapshot(data: TutorSnapshotEntity): Promise<void> {
    MEM_SNAPSHOTS[data.userId] = data;

    if (isDatabaseConnected()) {
      try {
        await prisma.tutorContextSnapshot.create({
          data: {
            userId: data.userId,
            cefrEstimate: data.cefrEstimate,
            overallScore: data.overallScore,
            weaknesses: JSON.stringify(data.weaknesses),
            skillScoresJson: data.skillScoresJson,
          },
        });
      } catch (err) {
        console.warn('Could not persist tutor context snapshot to DB:', err);
      }
    }
  }

  public async getLatestSnapshot(userId: string): Promise<TutorSnapshotEntity | null> {
    if (isDatabaseConnected()) {
      try {
        const snap = await prisma.tutorContextSnapshot.findFirst({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
        });
        if (snap) {
          return {
            id: snap.id,
            userId: snap.userId,
            cefrEstimate: snap.cefrEstimate,
            overallScore: snap.overallScore,
            weaknesses: JSON.parse(snap.weaknesses || '[]'),
            skillScoresJson: snap.skillScoresJson,
            updatedAt: snap.updatedAt.toISOString(),
          };
        }
      } catch (err) {}
    }

    return MEM_SNAPSHOTS[userId] || null;
  }

  public async saveAdaptivePlan(plan: AdaptivePlanEntity): Promise<void> {
    MEM_PLANS[plan.userId] = plan;

    if (isDatabaseConnected()) {
      try {
        const savedPlan = await prisma.adaptiveLearningPlan.create({
          data: {
            id: plan.id,
            userId: plan.userId,
            planName: plan.planName,
            startDate: new Date(plan.startDate),
            endDate: new Date(plan.endDate),
            daysCount: plan.daysCount,
            status: plan.status,
            items: {
              create: plan.items.map((item) => ({
                dayNumber: item.dayNumber,
                order: item.order,
                skill: item.skill,
                title: item.title,
                focusTopic: item.focusTopic,
                estimatedMinutes: item.estimatedMinutes,
                targetDrillUrl: item.targetDrillUrl,
                completed: item.completed,
                score: item.score ?? null,
              })),
            },
          },
        });
      } catch (err) {
        console.warn('Could not persist adaptive plan to DB:', err);
      }
    }
  }

  public async getActivePlan(userId: string): Promise<AdaptivePlanEntity | null> {
    if (isDatabaseConnected()) {
      try {
        const plan = await prisma.adaptiveLearningPlan.findFirst({
          where: { userId, status: 'active' },
          include: {
            items: { orderBy: [{ dayNumber: 'asc' }, { order: 'asc' }] },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (plan) {
          return {
            id: plan.id,
            userId: plan.userId,
            planName: plan.planName,
            startDate: plan.startDate.toISOString(),
            endDate: plan.endDate.toISOString(),
            daysCount: plan.daysCount,
            status: plan.status,
            items: plan.items.map((it) => ({
              id: it.id,
              dayNumber: it.dayNumber,
              order: it.order,
              skill: it.skill,
              title: it.title,
              focusTopic: it.focusTopic,
              estimatedMinutes: it.estimatedMinutes,
              targetDrillUrl: it.targetDrillUrl,
              completed: it.completed,
              score: it.score,
            })),
          };
        }
      } catch (err) {}
    }

    return MEM_PLANS[userId] || null;
  }

  public async saveRecommendation(rec: RecommendationEntity): Promise<void> {
    if (!MEM_RECOMMENDATIONS[rec.userId]) {
      MEM_RECOMMENDATIONS[rec.userId] = [];
    }
    MEM_RECOMMENDATIONS[rec.userId].push(rec);

    if (isDatabaseConnected()) {
      try {
        await prisma.tutorRecommendation.create({
          data: {
            userId: rec.userId,
            skill: rec.skill,
            title: rec.title,
            description: rec.description,
            priority: rec.priority,
            actionUrl: rec.actionUrl,
            reason: rec.reason,
            isDismissed: rec.isDismissed || false,
          },
        });
      } catch (err) {}
    }
  }

  public async getRecommendations(userId: string): Promise<RecommendationEntity[]> {
    if (isDatabaseConnected()) {
      try {
        const recs = await prisma.tutorRecommendation.findMany({
          where: { userId, isDismissed: false },
          orderBy: { createdAt: 'desc' },
          take: 5,
        });
        if (recs.length > 0) {
          return recs.map((r) => ({
            id: r.id,
            userId: r.userId,
            skill: r.skill,
            title: r.title,
            description: r.description,
            priority: r.priority,
            actionUrl: r.actionUrl,
            reason: r.reason,
            isDismissed: r.isDismissed,
          }));
        }
      } catch (err) {}
    }

    return MEM_RECOMMENDATIONS[userId] || [];
  }
}

export const tutorRepository = TutorRepository.getInstance();
