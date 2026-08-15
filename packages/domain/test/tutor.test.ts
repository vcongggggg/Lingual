import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyTutorIntent,
  buildTutorContext,
  selectAdaptiveDifficulty,
  calculateTutorConfidence,
  sanitizeTutorResponse,
  calculateAdaptiveXP,
  mapTutorPerformanceToSRSQuality,
  generateAdaptivePlan,
  generatePracticeSession,
  generateTutorResponse,
  TutorContext,
  TutorResponse,
} from '../src/index.js';

test('AI Tutor Domain - classifyTutorIntent detects grammar explanation in English and Vietnamese', () => {
  const i1 = classifyTutorIntent('Explain why I use went instead of go');
  assert.ok(i1 === 'explain' || i1 === 'grammar');
  const i2 = classifyTutorIntent('Tại sao câu này lại dùng went?');
  assert.ok(i2 === 'explain' || i2 === 'grammar');
  assert.equal(classifyTutorIntent('Giải thích lỗi sai trong bài viết này'), 'writing');
});

test('AI Tutor Domain - classifyTutorIntent detects planning intent', () => {
  assert.equal(classifyTutorIntent('Make me a 7-day study plan'), 'plan');
  assert.equal(classifyTutorIntent('Lên cho tôi lộ trình học tiếng Anh tuần này'), 'plan');
});

test('AI Tutor Domain - classifyTutorIntent detects recommendation intent', () => {
  assert.equal(classifyTutorIntent('What should I study today?'), 'recommend');
  assert.equal(classifyTutorIntent('Hôm nay tôi nên học gì tiếp theo?'), 'recommend');
});

test('AI Tutor Domain - classifyTutorIntent detects practice intent', () => {
  assert.equal(classifyTutorIntent('Give me something to practice right now'), 'practice');
  assert.equal(classifyTutorIntent('Tôi muốn làm bài tập luyện tập phản xạ'), 'practice');
});

test('AI Tutor Domain - classifyTutorIntent detects review and SRS intent', () => {
  assert.equal(classifyTutorIntent('I want to review my due flashcards in SRS'), 'review');
  assert.equal(classifyTutorIntent('Ôn tập thẻ từ vựng đến hạn'), 'review');
});

test('AI Tutor Domain - classifyTutorIntent detects motivation intent', () => {
  assert.equal(classifyTutorIntent('I feel tired and want to give up'), 'motivation');
  assert.equal(classifyTutorIntent('Dạo này học nản và mất động lực quá'), 'motivation');
});

test('AI Tutor Domain - classifyTutorIntent detects exam preparation intent', () => {
  assert.equal(classifyTutorIntent('How can I boost my IELTS band score?'), 'exam');
  assert.equal(classifyTutorIntent('Chuẩn bị thi thử TOEIC như thế nào?'), 'exam');
});

test('AI Tutor Domain - classifyTutorIntent fallback on empty or malformed inputs', () => {
  assert.equal(classifyTutorIntent(''), 'general');
  assert.equal(classifyTutorIntent('   '), 'general');
  assert.equal(classifyTutorIntent(null as any), 'general');
  assert.equal(classifyTutorIntent(undefined as any), 'general');
});

test('AI Tutor Domain - buildTutorContext handles empty learner data with robust defaults', () => {
  const ctx = buildTutorContext({});
  assert.equal(ctx.user.userId, 'guest-user');
  assert.equal(ctx.user.cefrEstimate, 'B1');
  assert.equal(ctx.user.totalXP, 0);
  assert.ok(ctx.skills.length >= 6);
  assert.ok(ctx.overallScore > 0);
});

test('AI Tutor Domain - buildTutorContext builds complete context with strengths and weaknesses', () => {
  const ctx = buildTutorContext({
    userId: 'u-123',
    name: 'Alex',
    cefrEstimate: 'B2',
    totalMinutes: 120,
    totalXP: 850,
    currentStreak: 7,
    skills: [
      { skill: 'vocabulary', score: 85, trend: 'improving', attemptsCount: 20, recentAccuracy: 90 },
      { skill: 'writing', score: 55, trend: 'declining', attemptsCount: 8, recentAccuracy: 50 },
      { skill: 'speaking', score: 60, trend: 'declining', attemptsCount: 5, recentAccuracy: 58 },
    ],
  });

  assert.equal(ctx.user.name, 'Alex');
  assert.ok(ctx.strengths.includes('vocabulary'));
  assert.ok(ctx.weaknesses.includes('writing'));
  assert.ok(ctx.weaknesses.includes('speaking'));
});

test('AI Tutor Domain - selectAdaptiveDifficulty adapts to low accuracy', () => {
  assert.equal(selectAdaptiveDifficulty(45, 'declining'), 'easier');
  assert.equal(selectAdaptiveDifficulty(50, 'stable', 3), 'easier');
});

test('AI Tutor Domain - selectAdaptiveDifficulty adapts to average accuracy', () => {
  assert.equal(selectAdaptiveDifficulty(70, 'stable'), 'current');
  assert.equal(selectAdaptiveDifficulty(78, 'improving'), 'current');
});

test('AI Tutor Domain - selectAdaptiveDifficulty adapts to high accuracy with improving trend', () => {
  assert.equal(selectAdaptiveDifficulty(92, 'improving', 0, 0.95), 'harder');
  assert.equal(selectAdaptiveDifficulty(85, 'improving', 0, 0.9), 'harder');
});

test('AI Tutor Domain - calculateTutorConfidence computes confidence based on history fullness', () => {
  const emptyCtx = buildTutorContext({});
  const richCtx = buildTutorContext({
    totalMinutes: 150,
    totalXP: 500,
    skills: [{ skill: 'vocabulary', score: 80, attemptsCount: 10, recentAccuracy: 85 }],
    recentWriting: { score: 80 },
  });

  const lowConf = calculateTutorConfidence(emptyCtx);
  const highConf = calculateTutorConfidence(richCtx);

  assert.ok(lowConf >= 30 && lowConf <= 60);
  assert.ok(highConf >= 70 && highConf <= 100);
});

test('AI Tutor Domain - sanitizeTutorResponse redacts tokens, passwords, and emails', () => {
  const raw: TutorResponse = {
    messageId: 'm-1',
    content: 'Contact me at admin@test.com with token Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 and password: secret_password',
    intent: 'general',
    confidence: 80,
    recommendations: [
      {
        id: 'r-1',
        title: 'Call dev at support@lingual.com',
        description: 'Send api_key: 123456 to fix issue',
        priority: 'medium',
        reason: 'weakness',
        action: { type: 'start_srs', label: 'Start', route: '/srs' },
      },
    ],
    actions: [],
    citations: [],
  };

  const sanitized = sanitizeTutorResponse(raw);
  assert.ok(!sanitized.content.includes('admin@test.com'));
  assert.ok(sanitized.content.includes('[REDACTED_EMAIL]'));
  assert.ok(!sanitized.content.includes('secret_password'));
  assert.ok(!sanitized.content.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'));
  assert.ok(!sanitized.recommendations[0].title.includes('support@lingual.com'));
  assert.ok(!sanitized.recommendations[0].description.includes('123456'));
});

test('AI Tutor Domain - calculateAdaptiveXP adheres to bounds and multipliers', () => {
  const easyXP = calculateAdaptiveXP(10, 80, 'easier');
  const standardXP = calculateAdaptiveXP(10, 80, 'current');
  const hardXP = calculateAdaptiveXP(10, 80, 'harder');

  assert.ok(easyXP < standardXP);
  assert.ok(standardXP <= hardXP);
  assert.ok(hardXP <= 50, 'Strictly capped at 50 XP');
});

test('AI Tutor Domain - mapTutorPerformanceToSRSQuality maps intervals to SM-2 scale 0 to 5', () => {
  assert.equal(mapTutorPerformanceToSRSQuality(98, 3), 5);
  assert.equal(mapTutorPerformanceToSRSQuality(88, 5), 4);
  assert.equal(mapTutorPerformanceToSRSQuality(75, 5), 3);
  assert.equal(mapTutorPerformanceToSRSQuality(55, 6), 2);
  assert.equal(mapTutorPerformanceToSRSQuality(30, 8), 1);
  assert.equal(mapTutorPerformanceToSRSQuality(10, 10), 0);
});

test('AI Tutor Domain - generateAdaptivePlan generates prioritized daily and 7-day items', () => {
  const ctx = buildTutorContext({
    srsDueCount: 18,
    skills: [
      { skill: 'speaking', score: 55, trend: 'declining', attemptsCount: 3, recentAccuracy: 50 },
      { skill: 'vocabulary', score: 80, trend: 'improving', attemptsCount: 12, recentAccuracy: 85 },
    ],
  });

  const plan = generateAdaptivePlan(ctx, 7, 'vi');
  assert.ok(plan.todayItems.length >= 2);
  assert.equal(plan.todayItems[0].skill, 'vocabulary');
  assert.equal(plan.todayItems[0].priority, 'critical');
  assert.equal(plan.todayItems[1].skill, 'speaking');
  assert.equal(plan.sevenDayPlan?.length, 7);
});

test('AI Tutor Domain - generatePracticeSession is deterministic based on skill and seed', () => {
  const ctx = buildTutorContext({});
  const s1 = generatePracticeSession(ctx, 'vocabulary', 101, 'vi');
  const s2 = generatePracticeSession(ctx, 'speaking', 102, 'vi');

  assert.equal(s1.items[0].type, 'vocabulary');
  assert.equal(s2.items[0].type, 'speaking');
  assert.ok(s1.estimatedMinutes > 0);
});

test('AI Tutor Domain - generateTutorResponse generates grammar explanation with rule and example', () => {
  const ctx = buildTutorContext({});
  const res = generateTutorResponse('explain', ctx, 'Why do I say went instead of go?', 'vi');

  assert.ok(res.explanation !== undefined);
  assert.equal(res.explanation?.original, 'I go to school yesterday.');
  assert.ok(res.explanation?.rule.length > 10);
  assert.ok(res.actions.length > 0);
});

test('AI Tutor Domain - generateTutorResponse generates personalized recommendation with actions', () => {
  const ctx = buildTutorContext({
    srsDueCount: 12,
    skills: [{ skill: 'writing', score: 58, trend: 'declining', attemptsCount: 4, recentAccuracy: 55 }],
  });

  const res = generateTutorResponse('recommend', ctx, 'What should I study today?', 'vi');
  assert.ok(res.actions.some((a) => a.type === 'start_srs'));
  assert.ok(res.citations.length > 0);
});

test('AI Tutor Domain - generateTutorResponse handles motivation intent with streak citation', () => {
  const ctx = buildTutorContext({ currentStreak: 10, totalXP: 1200 });
  const res = generateTutorResponse('motivation', ctx, 'Hôm nay mệt quá', 'vi');

  assert.ok(res.content.includes('10'));
  assert.ok(res.actions.length > 0);
});

test('AI Tutor Domain - generateTutorResponse handles exam intent with exam practice action', () => {
  const ctx = buildTutorContext({});
  const res = generateTutorResponse('exam', ctx, 'Luyện thi IELTS', 'vi');

  assert.ok(res.actions.some((a) => a.type === 'start_exam'));
});

test('AI Tutor Domain - generateTutorResponse safely handles extremely long input and unicode characters', () => {
  const ctx = buildTutorContext({});
  const longPrompt = 'Luyện tập '.repeat(200) + ' 🌟 ✨ 🚀 Bạn có thể giúp tôi giải thích không?';
  const res = generateTutorResponse('explain', ctx, longPrompt, 'vi');

  assert.ok(res.messageId.startsWith('tut-msg-'));
  assert.ok(res.content.length > 0);
});

test('AI Tutor Domain - generateTutorResponse English localization', () => {
  const ctx = buildTutorContext({ user: { name: 'Sarah', cefrEstimate: 'B2', totalMinutes: 60, totalXP: 200, currentStreak: 3, userId: 'u1' } });
  const res = generateTutorResponse('general', ctx, 'Hello tutor', 'en');

  assert.ok(res.content.includes('Hello Sarah!'));
  assert.ok(res.actions.some((a) => a.label.includes('Review SRS') || a.label.includes('View Analytics')));
});
