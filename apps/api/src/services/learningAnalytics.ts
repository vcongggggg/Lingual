/**
 * Server-Authoritative Learning Analytics & Personal Intelligence Aggregator Service
 */

import {
  SkillPerformance,
  WeaknessArea,
  StrengthArea,
  LearningRecommendation,
  LearningGoal,
  LearningHeatmapEntry,
  WeeklyLearningReport,
  CEFRProgress,
  LearningAnalytics,
  calculateSkillScore,
  calculateSkillTrend,
  detectWeaknesses,
  detectStrengths,
  calculateOverallLearningScore,
  calculateLearningStreakConsistency,
  calculateStudyHeatmap,
  calculateCEFRProgress,
  calculateGoalProgress,
  generateLearningRecommendations,
} from '@linguaflow/domain';

export class LearningAnalyticsService {
  // In-memory master goals repository keyed by userId
  private goalsStore: Map<string, LearningGoal[]> = new Map();

  // In-memory user activities log
  private activityStore: Map<string, { timestamp: string; minutes: number; xp: number; skill: string }[]> = new Map();

  constructor() {
    this.seedDemoUser();
  }

  private seedDemoUser() {
    const demoId = 'demo-user-id-001';

    // Seed Goals
    this.goalsStore.set(demoId, [
      {
        id: 'goal-1',
        userId: demoId,
        type: 'weekly_minutes',
        target: 300,
        current: 185,
        startDate: '2026-02-09T00:00:00.000Z',
        endDate: '2026-02-15T23:59:59.000Z',
        completed: false,
        xpReward: 100,
      },
      {
        id: 'goal-2',
        userId: demoId,
        type: 'vocabulary',
        target: 50,
        current: 42,
        startDate: '2026-02-09T00:00:00.000Z',
        endDate: '2026-02-15T23:59:59.000Z',
        completed: false,
        xpReward: 50,
      },
      {
        id: 'goal-3',
        userId: demoId,
        type: 'exam',
        target: 2,
        current: 2,
        startDate: '2026-02-01T00:00:00.000Z',
        endDate: '2026-02-28T23:59:59.000Z',
        completed: true,
        xpReward: 150,
      },
    ]);

    // Seed Activities for Heatmap (Simulating 60 days of active study)
    const activities: { timestamp: string; minutes: number; xp: number; skill: string }[] = [];
    const now = new Date('2026-02-15T08:00:00.000Z');

    for (let i = 60; i >= 0; i--) {
      // 75% probability of activity
      if (i % 4 !== 0) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const mins = 15 + ((i * 7) % 35);
        const xp = mins * 5;
        activities.push({
          timestamp: d.toISOString(),
          minutes: mins,
          xp,
          skill: i % 2 === 0 ? 'vocabulary' : 'reading',
        });
      }
    }

    this.activityStore.set(demoId, activities);
  }

  public getSkillsPerformance(userId: string): SkillPerformance[] {
    // In production, aggregate from actual attempt tables. Here seeded with realistic performance:
    return [
      {
        skill: 'vocabulary',
        score: 84,
        accuracy: 88,
        attempts: 24,
        completed: 24,
        studyMinutes: 380,
        xpEarned: 1450,
        trend: 'stable',
      },
      {
        skill: 'reading',
        score: 81,
        accuracy: 85,
        attempts: 12,
        completed: 12,
        studyMinutes: 240,
        xpEarned: 890,
        trend: 'up',
      },
      {
        skill: 'writing',
        score: 68,
        accuracy: 72,
        attempts: 9,
        completed: 8,
        studyMinutes: 180,
        xpEarned: 620,
        trend: 'up',
      },
      {
        skill: 'listening',
        score: 62,
        accuracy: 64,
        attempts: 18,
        completed: 16,
        studyMinutes: 210,
        xpEarned: 740,
        trend: 'down',
      },
      {
        skill: 'speaking',
        score: 61,
        accuracy: 65,
        attempts: 8,
        completed: 7,
        studyMinutes: 90,
        xpEarned: 320,
        trend: 'up',
      },
      {
        skill: 'exam',
        score: 74,
        accuracy: 78,
        attempts: 4,
        completed: 4,
        studyMinutes: 140,
        xpEarned: 990,
        trend: 'down',
      },
    ];
  }

  public getOverview(userId: string): LearningAnalytics {
    const skills = this.getSkillsPerformance(userId);
    const weaknesses = detectWeaknesses(skills);
    const strengths = detectStrengths(skills);
    const consistency = calculateLearningStreakConsistency(5, 7);
    const overallScore = calculateOverallLearningScore(skills, consistency.score);
    const cefr = calculateCEFRProgress(overallScore, 380, 4);
    const recommendations = generateLearningRecommendations({
      skills,
      weaknesses,
      srsDueCount: 14,
      examAttemptsCount: 4,
      locale: 'vi',
    });
    const goals = this.getGoals(userId);

    return {
      overallScore,
      estimatedCEFR: cefr.currentLevel,
      totalStudyMinutes: 1240,
      totalXP: 5010,
      currentStreak: 5,
      weeklyMinutes: 185,
      skills,
      weaknesses,
      strengths,
      recommendations,
      goals,
      consistency,
    };
  }

  public getTrends(userId: string, period: string = '7d') {
    const days = period === '90d' ? 90 : period === '30d' ? 30 : 7;
    const points: { date: string; minutes: number; xp: number; score: number }[] = [];
    const now = new Date('2026-02-15T08:00:00.000Z');

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayKey = d.toISOString().split('T')[0];
      const mins = 15 + ((i * 9) % 30);
      points.push({
        date: dayKey,
        minutes: mins,
        xp: mins * 6,
        score: Math.min(95, 70 + ((i * 3) % 15)),
      });
    }

    return {
      period,
      points,
    };
  }

  public getHeatmap(userId: string): LearningHeatmapEntry[] {
    const userActivities = this.activityStore.get(userId) || [];
    return calculateStudyHeatmap(userActivities, 365, new Date('2026-02-15T00:00:00.000Z'));
  }

  public getWeaknesses(userId: string): WeaknessArea[] {
    const skills = this.getSkillsPerformance(userId);
    return detectWeaknesses(skills);
  }

  public getRecommendations(userId: string, locale: string = 'vi'): LearningRecommendation[] {
    const skills = this.getSkillsPerformance(userId);
    const weaknesses = detectWeaknesses(skills);
    return generateLearningRecommendations({
      skills,
      weaknesses,
      srsDueCount: 14,
      examAttemptsCount: 4,
      locale,
    });
  }

  public getGoals(userId: string): LearningGoal[] {
    return this.goalsStore.get(userId) || [];
  }

  public createGoal(userId: string, data: { type: any; target: number; endDate?: string }): LearningGoal {
    const userGoals = this.getGoals(userId);
    const newGoal: LearningGoal = {
      id: `goal-${Date.now()}`,
      userId,
      type: data.type,
      target: Number(data.target) || 10,
      current: 0,
      startDate: new Date().toISOString(),
      endDate: data.endDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      completed: false,
      xpReward: Math.round(Number(data.target) * 2),
    };

    userGoals.push(newGoal);
    this.goalsStore.set(userId, userGoals);
    return newGoal;
  }

  public updateGoal(
    userId: string,
    goalId: string,
    updates: { current?: number; target?: number; completed?: boolean }
  ): LearningGoal | null {
    const userGoals = this.getGoals(userId);
    const goalIndex = userGoals.findIndex((g) => g.id === goalId);
    if (goalIndex === -1) return null;

    const goal = userGoals[goalIndex];
    if (updates.current !== undefined) goal.current = Number(updates.current);
    if (updates.target !== undefined) goal.target = Number(updates.target);
    if (updates.completed !== undefined) {
      goal.completed = Boolean(updates.completed);
    } else if (goal.current >= goal.target) {
      goal.completed = true;
    }

    userGoals[goalIndex] = goal;
    this.goalsStore.set(userId, userGoals);
    return goal;
  }

  public deleteGoal(userId: string, goalId: string): boolean {
    const userGoals = this.getGoals(userId);
    const filtered = userGoals.filter((g) => g.id !== goalId);
    if (filtered.length === userGoals.length) return false;

    this.goalsStore.set(userId, filtered);
    return true;
  }

  public getWeeklyReport(userId: string): WeeklyLearningReport {
    return {
      weekNumber: 7,
      year: 2026,
      minutesStudied: 185,
      minutesChangePercent: 12,
      vocabularyCount: 42,
      vocabularyChangePercent: 18,
      averageAccuracy: 78,
      accuracyChangePercent: 6,
      strongestSkill: 'vocabulary',
      focusNextWeek: 'listening',
      summary: 'Tuần này bạn đã duy trì thói quen học tập rất tốt, đặc biệt là từ vựng (+18%). Tuần tới hãy tập trung cải thiện kỹ năng Nghe Chính Tả.',
    };
  }
}

export const learningAnalyticsService = new LearningAnalyticsService();
