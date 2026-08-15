import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateWritingSubmission,
  calculateWritingScore,
  calculateWritingXP,
  mapWritingPerformanceToSRSQuality,
  getWritingGrade,
  WritingPrompt,
  WritingSubmission,
} from '../src/index.ts';

const SAMPLE_PROMPT: WritingPrompt = {
  id: 'prompt-see-write-1',
  mode: 'see-write',
  difficulty: 'A1',
  title: 'Morning Routine',
  instruction: 'Describe what you do in the morning.',
  targetWords: ['coffee', 'morning', 'breakfast'],
  category: 'Daily Life',
  minWords: 8,
  maxWords: 40,
};

test('Writing Domain - Empty submission returns zero score and helpful guidance', () => {
  const submission: WritingSubmission = {
    promptId: 'prompt-see-write-1',
    mode: 'see-write',
    content: '   ',
  };
  const result = evaluateWritingSubmission(submission, SAMPLE_PROMPT);
  assert.equal(result.wordCount, 0);
  assert.equal(result.score, 0);
  assert.equal(result.xpAwarded, 0);
  assert.equal(result.feedback.grade, 'Keep Practicing');
});

test('Writing Domain - Word counting and length evaluation', () => {
  const submission: WritingSubmission = {
    promptId: 'prompt-see-write-1',
    mode: 'see-write',
    content: 'Every morning I drink hot coffee and eat bread.',
  };
  const result = evaluateWritingSubmission(submission, SAMPLE_PROMPT);
  assert.equal(result.wordCount, 9);
  assert.ok(result.score > 70);
});

test('Writing Domain - Weighted score calculation satisfies standard weights', () => {
  const score = calculateWritingScore({
    grammar: 100, // 30
    vocabulary: 80, // 20
    naturalness: 90, // 18
    relevance: 100, // 15
    completeness: 100, // 10 -> total: 93
  });
  assert.equal(score, 93);
});

test('Writing Domain - Detects capitalization and punctuation mistakes', () => {
  const submission: WritingSubmission = {
    promptId: 'prompt-see-write-1',
    mode: 'see-write',
    content: 'i drink coffee in the morning', // lower i, missing period
  };
  const result = evaluateWritingSubmission(submission, SAMPLE_PROMPT);
  assert.ok(result.corrections.some((c) => c.category === 'punctuation'));
  assert.ok(result.feedback.grammarScore < 90);
});

test('Writing Domain - Detects common subject-verb agreement errors', () => {
  const submission: WritingSubmission = {
    promptId: 'prompt-see-write-1',
    mode: 'see-write',
    content: 'He go to school by bus every day.',
  };
  const result = evaluateWritingSubmission(submission, SAMPLE_PROMPT);
  assert.ok(result.corrections.some((c) => c.category === 'grammar' && c.explanation.includes('ngôi thứ 3')));
});

test('Writing Domain - Detects indefinite article mistakes (a/an)', () => {
  const submission: WritingSubmission = {
    promptId: 'prompt-see-write-1',
    mode: 'see-write',
    content: 'I eat a apple every day.',
  };
  const result = evaluateWritingSubmission(submission, SAMPLE_PROMPT);
  assert.ok(result.corrections.some((c) => c.category === 'grammar' && c.explanation.includes('an')));
});

test('Writing Domain - Generates vocabulary upgrade suggestions', () => {
  const submission: WritingSubmission = {
    promptId: 'prompt-see-write-1',
    mode: 'see-write',
    content: 'Drinking warm water in the morning is very good and important.',
  };
  const result = evaluateWritingSubmission(submission, SAMPLE_PROMPT);
  assert.ok(result.vocabularySuggestions.some((s) => s.word === 'beneficial' || s.word === 'crucial'));
});

test('Writing Domain - Grade mapping adheres to pedagogical intervals', () => {
  assert.equal(getWritingGrade(95), 'Excellent');
  assert.equal(getWritingGrade(82), 'Very Good');
  assert.equal(getWritingGrade(68), 'Good');
  assert.equal(getWritingGrade(50), 'Needs Practice');
  assert.equal(getWritingGrade(20), 'Keep Practicing');
});

test('Writing Domain - XP reward calculation awards base and quality bonuses', () => {
  const highXP = calculateWritingXP(92, 25, false);
  assert.equal(highXP, 25); // 10 base + 15 high score

  const hintedXP = calculateWritingXP(85, 20, true);
  assert.equal(hintedXP, 17); // (10 + 10) - 3 = 17
});

test('Writing Domain - SM-2 SRS Quality mapping', () => {
  assert.equal(mapWritingPerformanceToSRSQuality(95), 5);
  assert.equal(mapWritingPerformanceToSRSQuality(80), 4);
  assert.equal(mapWritingPerformanceToSRSQuality(65), 3);
  assert.equal(mapWritingPerformanceToSRSQuality(45), 2);
  assert.equal(mapWritingPerformanceToSRSQuality(25), 1);
  assert.equal(mapWritingPerformanceToSRSQuality(10), 0);
});

test('Writing Domain Edge Case - Very short submission awards minimal XP without crash', () => {
  const submission: WritingSubmission = {
    promptId: 'prompt-see-write-1',
    mode: 'see-write',
    content: 'Hi there',
  };
  const result = evaluateWritingSubmission(submission, SAMPLE_PROMPT);
  assert.equal(result.wordCount, 2);
  assert.equal(result.xpAwarded, 2);
});

test('Writing Domain Edge Case - Whitespace, tabs, and newlines are normalized', () => {
  const submission: WritingSubmission = {
    promptId: 'prompt-see-write-1',
    mode: 'see-write',
    content: "   Every   morning\n\n\tI   drink   coffee.   ",
  };
  const result = evaluateWritingSubmission(submission, SAMPLE_PROMPT);
  assert.equal(result.wordCount, 5);
  assert.ok(result.score > 0);
});

test('Writing Domain Edge Case - Repeated words degrade vocabulary richness score', () => {
  const submission: WritingSubmission = {
    promptId: 'prompt-see-write-1',
    mode: 'see-write',
    content: 'Coffee coffee coffee coffee coffee coffee coffee coffee.',
  };
  const result = evaluateWritingSubmission(submission, SAMPLE_PROMPT);
  assert.equal(result.wordCount, 8);
  assert.ok(result.feedback.vocabularyScore <= 55);
});

test('Writing Domain Edge Case - Unicode and Vietnamese characters parse safely', () => {
  const submission: WritingSubmission = {
    promptId: 'prompt-see-write-1',
    mode: 'see-write',
    content: 'Mỗi buổi sáng I drink coffee with phở gà.',
  };
  const result = evaluateWritingSubmission(submission, SAMPLE_PROMPT);
  assert.equal(result.wordCount, 9);
  assert.ok(result.score > 0);
});

test('Writing Domain Edge Case - Punctuation-heavy text does not throw errors', () => {
  const submission: WritingSubmission = {
    promptId: 'prompt-see-write-1',
    mode: 'see-write',
    content: '!!!??? *** Hello world *** ???!!!',
  };
  const result = evaluateWritingSubmission(submission, SAMPLE_PROMPT);
  assert.ok(result.wordCount > 0);
});
