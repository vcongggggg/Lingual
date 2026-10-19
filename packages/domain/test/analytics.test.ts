import test from 'node:test';
import assert from 'node:assert/strict';
import {
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
  SkillPerformance,
  WeaknessArea,
} from '../src/index';

test('Analytics Domain - calculateSkillScore with zero attempts returns 0', () => {
  const score = calculateSkillScore({ accuracy: 90, attempts: 0 });
  assert.equal(score, 0);
});

test('Analytics Domain - calculateSkillScore computes deterministic weighted score', () => {
  const score = calculateSkillScore({
    accuracy: 80,
    completionRate: 100,
    attempts: 5,
    recentAccuracy: 85,
  });
  // 80*0.6 = 48, 100*0.2 = 20, 85*0.1 = 8.5, attempts*2 = 10 -> sum = 86.5 -> 87
  assert.equal(score, 87);
});

test('Analytics Domain - calculateSkillTrend detects up, down, and stable correctly', () => {
  assert.equal(calculateSkillTrend(85, 75, 3), 'up');
  assert.equal(calculateSkillTrend(70, 80, 3), 'down');
  assert.equal(calculateSkillTrend(75, 76, 3), 'stable');
  assert.equal(calculateSkillTrend(75, 72, 3), 'stable');
});

test('Analytics Domain - detectWeaknesses catches high severity weakness (<50)', () => {
  const skills: SkillPerformance[] = [
    { skill: 'listening', score: 45, accuracy: 40, attempts: 4, completed: 2, studyMinutes: 30, xpEarned: 50, trend: 'down' },
    { skill: 'reading', score: 85, accuracy: 90, attempts: 5, completed: 5, studyMinutes: 40, xpEarned: 120, trend: 'up' },
  ];

  const weaknesses = detectWeaknesses(skills);
  assert.equal(weaknesses.length, 1);
  assert.equal(weaknesses[0].skill, 'listening');
  assert.equal(weaknesses[0].severity, 'high');
});

test('Analytics Domain - detectWeaknesses catches medium severity weakness (50-69)', () => {
  const skills: SkillPerformance[] = [
    { skill: 'writing', score: 62, accuracy: 65, attempts: 3, completed: 2, studyMinutes: 25, xpEarned: 60, trend: 'stable' },
  ];

  const weaknesses = detectWeaknesses(skills);
  assert.equal(weaknesses.length, 1);
  assert.equal(weaknesses[0].skill, 'writing');
  assert.equal(weaknesses[0].severity, 'medium');
});

test('Analytics Domain - detectWeaknesses ignores skills with insufficient attempts (<2)', () => {
  const skills: SkillPerformance[] = [
    { skill: 'speaking', score: 40, accuracy: 35, attempts: 1, completed: 1, studyMinutes: 10, xpEarned: 20, trend: 'stable' },
  ];

  const weaknesses = detectWeaknesses(skills, 2);
  assert.equal(weaknesses.length, 0);
});

test('Analytics Domain - detectStrengths identifies high-performing skills (>=80)', () => {
  const skills: SkillPerformance[] = [
    { skill: 'vocabulary', score: 88, accuracy: 92, attempts: 10, completed: 10, studyMinutes: 60, xpEarned: 200, trend: 'up' },
    { skill: 'reading', score: 82, accuracy: 85, attempts: 6, completed: 6, studyMinutes: 45, xpEarned: 150, trend: 'stable' },
    { skill: 'listening', score: 65, accuracy: 70, attempts: 4, completed: 3, studyMinutes: 30, xpEarned: 70, trend: 'down' },
  ];

  const strengths = detectStrengths(skills);
  assert.equal(strengths.length, 2);
  assert.equal(strengths[0].skill, 'vocabulary');
  assert.equal(strengths[1].skill, 'reading');
});

test('Analytics Domain - calculateOverallLearningScore handles empty active skills safely', () => {
  const skills: SkillPerformance[] = [
    { skill: 'listening', score: 0, accuracy: 0, attempts: 0, completed: 0, studyMinutes: 0, xpEarned: 0, trend: 'stable' },
  ];
  assert.equal(calculateOverallLearningScore(skills), 0);
});

test('Analytics Domain - calculateOverallLearningScore blends active skills and consistency', () => {
  const skills: SkillPerformance[] = [
    { skill: 'listening', score: 80, accuracy: 80, attempts: 3, completed: 3, studyMinutes: 30, xpEarned: 60, trend: 'up' },
    { skill: 'reading', score: 90, accuracy: 90, attempts: 4, completed: 4, studyMinutes: 40, xpEarned: 80, trend: 'up' },
  ];
  // avg = 85 -> 85*0.85 + 70*0.15 = 72.25 + 10.5 = 82.75 -> 83
  const overall = calculateOverallLearningScore(skills, 70);
  assert.equal(overall, 83);
});

test('Analytics Domain - calculateLearningStreakConsistency evaluates all 4 consistency bands', () => {
  assert.equal(calculateLearningStreakConsistency(6, 7).level, 'highly_consistent'); // ~86%
  assert.equal(calculateLearningStreakConsistency(4, 7).level, 'consistent');        // ~57%
  assert.equal(calculateLearningStreakConsistency(2, 7).level, 'developing');        // ~29%
  assert.equal(calculateLearningStreakConsistency(1, 7).level, 'inconsistent');      // ~14%
});

test('Analytics Domain - calculateLearningStreakConsistency handles zero total days gracefully', () => {
  const res = calculateLearningStreakConsistency(0, 0);
  assert.equal(res.score, 0);
  assert.equal(res.level, 'inconsistent');
});

test('Analytics Domain - calculateStudyHeatmap generates exact 365 days entries', () => {
  const activities = [
    { timestamp: '2026-02-14T08:00:00.000Z', minutes: 45, xp: 120 },
    { timestamp: '2026-02-13T10:00:00.000Z', minutes: 20, xp: 35 },
  ];

  const heatmap = calculateStudyHeatmap(activities, 365, new Date('2026-02-15T00:00:00.000Z'));
  assert.equal(heatmap.length, 365);
  const feb14 = heatmap.find((h) => h.date === '2026-02-14');
  assert.ok(feb14);
  assert.equal(feb14.intensity, 4);
});

test('Analytics Domain - calculateStudyHeatmap maps intensities 0 through 4 deterministically', () => {
  const activities = [
    { timestamp: '2026-02-10T00:00:00.000Z', minutes: 5, xp: 10 },   // intensity 1
    { timestamp: '2026-02-11T00:00:00.000Z', minutes: 18, xp: 30 },  // intensity 2
    { timestamp: '2026-02-12T00:00:00.000Z', minutes: 35, xp: 70 },  // intensity 3
    { timestamp: '2026-02-13T00:00:00.000Z', minutes: 50, xp: 150 }, // intensity 4
  ];

  const heatmap = calculateStudyHeatmap(activities, 10, new Date('2026-02-15T00:00:00.000Z'));
  assert.equal(heatmap.find((h) => h.date === '2026-02-10')?.intensity, 1);
  assert.equal(heatmap.find((h) => h.date === '2026-02-11')?.intensity, 2);
  assert.equal(heatmap.find((h) => h.date === '2026-02-12')?.intensity, 3);
  assert.equal(heatmap.find((h) => h.date === '2026-02-13')?.intensity, 4);
});

test('Analytics Domain - calculateCEFRProgress estimates A1 level for beginners', () => {
  const cefr = calculateCEFRProgress(30, 40, 0);
  assert.equal(cefr.currentLevel, 'A1');
  assert.equal(cefr.nextMilestone, 'A2');
  assert.ok(cefr.disclaimer.length > 0);
});

test('Analytics Domain - calculateCEFRProgress estimates B1 level for intermediate learners', () => {
  const cefr = calculateCEFRProgress(68, 320, 2);
  assert.equal(cefr.currentLevel, 'B1');
  assert.equal(cefr.nextMilestone, 'B2');
});

test('Analytics Domain - calculateCEFRProgress estimates C1 level for advanced learners', () => {
  const cefr = calculateCEFRProgress(92, 700, 6);
  assert.equal(cefr.currentLevel, 'C1');
  assert.equal(cefr.nextMilestone, 'C2');
});

test('Analytics Domain - calculateGoalProgress clamps percentage to 100% maximum', () => {
  const prog = calculateGoalProgress(150, 100);
  assert.equal(prog.percentage, 100);
  assert.equal(prog.remaining, 0);
  assert.equal(prog.isCompleted, true);
});

test('Analytics Domain - calculateGoalProgress computes partial progress accurately', () => {
  const prog = calculateGoalProgress(45, 100);
  assert.equal(prog.percentage, 45);
  assert.equal(prog.remaining, 55);
  assert.equal(prog.isCompleted, false);
});

test('Analytics Domain - calculateGoalProgress handles zero target safely', () => {
  const prog = calculateGoalProgress(0, 0);
  assert.equal(prog.percentage, 0);
  assert.equal(prog.remaining, 0);
});

test('Analytics Domain - generateLearningRecommendations prioritizes SRS due cards when due >= 10', () => {
  const recs = generateLearningRecommendations({
    skills: [],
    weaknesses: [],
    srsDueCount: 18,
    locale: 'vi',
  });

  assert.ok(recs.some((r) => r.id === 'rec-srs-due' && r.priority === 'high'));
});

test('Analytics Domain - generateLearningRecommendations prioritizes high-severity listening weakness', () => {
  const weaknesses: WeaknessArea[] = [
    { skill: 'listening', severity: 'high', score: 42, evidence: [] },
  ];

  const recs = generateLearningRecommendations({
    skills: [],
    weaknesses,
    srsDueCount: 0,
    locale: 'vi',
  });

  assert.ok(recs.some((r) => r.id === 'rec-weak-listening' && r.actionRoute.includes('dictation')));
});

test('Analytics Domain - generateLearningRecommendations provides writing recommendation for writing weakness', () => {
  const weaknesses: WeaknessArea[] = [
    { skill: 'writing', severity: 'medium', score: 62, evidence: [] },
  ];

  const recs = generateLearningRecommendations({
    skills: [],
    weaknesses,
    srsDueCount: 0,
    locale: 'vi',
  });

  assert.ok(recs.some((r) => r.id === 'rec-weak-writing' && r.actionRoute.includes('writing')));
});

test('Analytics Domain - generateLearningRecommendations provides exam practice recommendation for new learners', () => {
  const recs = generateLearningRecommendations({
    skills: [],
    weaknesses: [],
    srsDueCount: 0,
    examAttemptsCount: 0,
    locale: 'vi',
  });

  assert.ok(recs.some((r) => r.id === 'rec-exam-mock'));
});

test('Analytics Domain - generateLearningRecommendations returns fallback vocab recommendation if no weaknesses', () => {
  const recs = generateLearningRecommendations({
    skills: [],
    weaknesses: [],
    srsDueCount: 0,
    examAttemptsCount: 5,
    locale: 'vi',
  });

  assert.equal(recs.length, 1);
  assert.equal(recs[0].id, 'rec-daily-vocab');
});

test('Analytics Domain - generateLearningRecommendations produces localized text for english locale', () => {
  const recs = generateLearningRecommendations({
    skills: [],
    weaknesses: [{ skill: 'listening', severity: 'high', score: 40, evidence: [] }],
    locale: 'en',
  });

  assert.equal(recs[0].title, 'Strengthen Listening Dictation');
  assert.equal(recs[0].actionLabel, 'Practice Dictation');
});

test('Analytics Domain - Pure Deterministic: Repeated calculation yields identical results', () => {
  const res1 = calculateCEFRProgress(75, 400, 3);
  const res2 = calculateCEFRProgress(75, 400, 3);
  assert.deepEqual(res1, res2);
});
