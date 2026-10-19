import {
  generateAdaptivePlan,
  generatePracticeSession,
  calculateAdaptiveXP,
  updateStreakWithTimezone,
  AdaptiveLearningPlan,
  LearningSession,
  TutorContext,
} from '@linguaflow/domain';
import { learningTutorService } from './tutor';

export class AdaptiveLearningService {
  private static instance: AdaptiveLearningService;
  private activePlans: Map<string, AdaptiveLearningPlan> = new Map();
  private completedSessions: Map<string, any> = new Map();
  private idempotencyCache: Map<string, { timestamp: number; result: any }> = new Map();

  private constructor() {}

  public static getInstance(): AdaptiveLearningService {
    if (!AdaptiveLearningService.instance) {
      AdaptiveLearningService.instance = new AdaptiveLearningService();
    }
    return AdaptiveLearningService.instance;
  }

  public getOrCreatePlan(userId: string, days: number = 7, locale: string = 'vi'): AdaptiveLearningPlan {
    let plan = this.activePlans.get(userId);
    if (!plan) {
      const context = learningTutorService.getTutorContext(userId);
      plan = generateAdaptivePlan(context, days, locale);
      this.activePlans.set(userId, plan);
    }
    return plan;
  }

  public createPracticeSession(userId: string, skill: string = 'vocabulary', locale: string = 'vi'): LearningSession {
    const context = learningTutorService.getTutorContext(userId);
    return generatePracticeSession(context, skill, Math.floor(Math.random() * 1000), locale);
  }

  public completeSession(
    userId: string,
    sessionId: string,
    payload: { score: number; durationMinutes: number; accuracy: number }
  ): {
    completionId: string;
    xpAwarded: number;
    streakUpdated: boolean;
    idempotentDuplicate?: boolean;
  } {
    // 5s idempotency check
    const idKey = `${userId}-${sessionId}-${Math.round(payload.score)}`;
    const cached = this.idempotencyCache.get(idKey);
    if (cached && Date.now() - cached.timestamp < 5000) {
      return { ...cached.result, idempotentDuplicate: true };
    }

    // Authoritative XP calculation
    const context = learningTutorService.getTutorContext(userId);
    const xpAwarded = calculateAdaptiveXP(payload.durationMinutes || 10, payload.score || 80, 'current');

    // Authoritative Streak update
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const streakUpdate = updateStreakWithTimezone({
      currentStreak: context.user.currentStreak || 5,
      streakFreezes: 2,
      lastActiveDate: yesterday.toISOString().split('T')[0],
    });

    const completionId = `sess-comp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const result = {
      completionId,
      xpAwarded,
      streakUpdated: streakUpdate.streakMaintained,
    };

    this.idempotencyCache.set(idKey, { timestamp: Date.now(), result });
    this.completedSessions.set(completionId, {
      userId,
      sessionId,
      ...payload,
      xpAwarded,
      completedAt: new Date().toISOString(),
    });

    return result;
  }

  public getSessionHistory(userId: string): any[] {
    const list: any[] = [];
    for (const [id, item] of this.completedSessions.entries()) {
      if (item.userId === userId) {
        list.push({ id, ...item });
      }
    }
    return list.reverse();
  }
}

export const adaptiveLearningService = AdaptiveLearningService.getInstance();
