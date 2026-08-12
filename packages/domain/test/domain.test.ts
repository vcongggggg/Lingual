import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSM2,
  updateStreakWithTimezone,
  calculateLessonXP,
  validateAttemptTiming,
  evaluateGameAnswers,
} from '../src/index.ts';

test('SM-2 Algorithm - Quality 5 review increases repetition and E-Factor', () => {
  const initial = { repetition: 0, interval: 1, efactor: 2.5 };
  const result = calculateSM2(initial, 5);
  assert.equal(result.repetition, 1);
  assert.equal(result.interval, 1);
  assert.ok(result.efactor > 2.5);
});

test('SM-2 Algorithm - Consecutive successful review sets interval to 6 days', () => {
  const state = { repetition: 1, interval: 1, efactor: 2.5 };
  const result = calculateSM2(state, 4);
  assert.equal(result.repetition, 2);
  assert.equal(result.interval, 6);
});

test('Timezone Streak - Active consecutive day increments streak in Asia/Ho_Chi_Minh', () => {
  const state = { currentStreak: 5, streakFreezes: 1, lastActiveDate: '2026-08-09' };
  const today = new Date('2026-08-10T10:00:00+07:00');
  const result = updateStreakWithTimezone(state, today, 'Asia/Ho_Chi_Minh');
  assert.equal(result.currentStreak, 6);
  assert.equal(result.streakMaintained, true);
  assert.equal(result.freezeUsed, false);
});

test('Timezone Streak - Missed 1 day uses Streak Freeze to maintain streak', () => {
  const state = { currentStreak: 10, streakFreezes: 2, lastActiveDate: '2026-08-08' };
  const today = new Date('2026-08-10T10:00:00+07:00'); // 2 days difference
  const result = updateStreakWithTimezone(state, today, 'Asia/Ho_Chi_Minh');
  assert.equal(result.currentStreak, 11);
  assert.equal(result.streakFreezes, 1);
  assert.equal(result.streakMaintained, true);
  assert.equal(result.freezeUsed, true);
});

test('Anti-cheat Attempt Validation - Rejects completion faster than physical limit', () => {
  const session = {
    attemptId: 'att-123',
    userId: 'usr-456',
    sourceType: 'game' as const,
    sourceId: 'typing-race',
    startedAt: new Date(Date.now() - 500), // 0.5s ago
  };
  const validation = validateAttemptTiming(session, 3);
  assert.equal(validation.valid, false);
  assert.ok(validation.error?.includes('quá nhanh'));
});

test('Anti-cheat Game Evaluation - Correctly calculates accuracy from server data', () => {
  const items = [
    { id: 'w1', targetText: 'Hello', translation: 'Xin chào' },
    { id: 'w2', targetText: 'Goodbye', translation: 'Tạm biệt' },
  ];
  const userAnswers = [
    { itemId: 'w1', answer: 'Xin chào' },
    { itemId: 'w2', answer: 'Sai rồi' },
  ];
  const result = evaluateGameAnswers(items, userAnswers);
  assert.equal(result.correctCount, 1);
  assert.equal(result.totalCount, 2);
  assert.equal(result.accuracy, 0.5);
});
