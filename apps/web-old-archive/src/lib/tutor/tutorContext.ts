import { TutorContext, buildTutorContext } from '@linguaflow/domain';

export function createInitialTutorContext(): TutorContext {
  return buildTutorContext({
    userId: 'guest-user',
    name: 'Learner',
    cefrEstimate: 'B1',
    totalMinutes: 120,
    totalXP: 500,
    currentStreak: 5,
    srsDueCount: 12,
    skills: [
      { skill: 'vocabulary', score: 80, trend: 'improving', attemptsCount: 20, recentAccuracy: 85 },
      { skill: 'listening', score: 72, trend: 'stable', attemptsCount: 15, recentAccuracy: 75 },
      { skill: 'reading', score: 75, trend: 'improving', attemptsCount: 10, recentAccuracy: 78 },
      { skill: 'writing', score: 65, trend: 'declining', attemptsCount: 8, recentAccuracy: 62 },
      { skill: 'speaking', score: 62, trend: 'declining', attemptsCount: 6, recentAccuracy: 60 },
      { skill: 'exam', score: 70, trend: 'stable', attemptsCount: 4, recentAccuracy: 70 },
    ],
    weaknesses: ['speaking', 'writing'],
    strengths: ['vocabulary'],
  });
}
