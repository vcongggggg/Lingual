import test from 'node:test';
import assert from 'node:assert/strict';
import {
  tokenizeReadingText,
  calculateReadingWPM,
  calculateReadingScore,
  getReadingGrade,
  calculateReadingXP,
  evaluateReadingAnswer,
  evaluateReadingAttempt,
  mapReadingPerformanceToSRSQuality,
  ReadingArticle,
  ReadingQuestion,
} from '../src/index.ts';

const SAMPLE_QUESTION_1: ReadingQuestion = {
  id: 'q1',
  type: 'multiple-choice',
  question: 'What is the main topic of the article?',
  options: ['Coffee culture', 'Tea ceremony', 'Fast food', 'Music'],
  correctAnswer: 'Coffee culture',
  explanation: 'The entire article talks about morning coffee habits.',
  difficulty: 'A1',
};

const SAMPLE_QUESTION_2: ReadingQuestion = {
  id: 'q2',
  type: 'true-false',
  question: 'Is drinking coffee in the morning popular worldwide?',
  options: ['True', 'False'],
  correctAnswer: 'True',
  explanation: 'Paragraph 1 states it is a global daily routine.',
  difficulty: 'A1',
};

const SAMPLE_ARTICLE: ReadingArticle = {
  id: 'art-coffee-1',
  title: 'Morning Coffee Culture',
  subtitle: 'How people start their day around the world',
  level: 'A1',
  topic: 'Daily Life',
  author: 'LinguaFlow Editorial',
  estimatedMinutes: 3,
  wordCount: 150,
  paragraphs: [
    {
      id: 'p1',
      order: 1,
      english: "Learning English isn't difficult with daily practice. Many people enjoy state-of-the-art apps.",
      vietnamese: 'Học tiếng Anh không hề khó khi luyện tập mỗi ngày. Nhiều người thích các ứng dụng hiện đại.',
    },
  ],
  vocabularyIds: ['vocab-coffee', 'vocab-morning', 'vocab-practice'],
  questions: [SAMPLE_QUESTION_1, SAMPLE_QUESTION_2],
};

test('Reading Domain - Tokenizes basic sentence cleanly', () => {
  const tokens = tokenizeReadingText('Coffee is popular around the world.');
  assert.deepEqual(tokens, ['Coffee', 'is', 'popular', 'around', 'the', 'world', '.']);
});

test('Reading Domain - Preserves apostrophes in words (isn\'t, don\'t, learner\'s)', () => {
  const tokens = tokenizeReadingText("Learning English isn't hard and don't give up on learner's goals.");
  assert.ok(tokens.includes("isn't"));
  assert.ok(tokens.includes("don't"));
  assert.ok(tokens.includes("learner's"));
});

test('Reading Domain - Preserves hyphenated words (state-of-the-art, eco-friendly)', () => {
  const tokens = tokenizeReadingText('We use state-of-the-art and eco-friendly technology.');
  assert.ok(tokens.includes('state-of-the-art'));
  assert.ok(tokens.includes('eco-friendly'));
});

test('Reading Domain - Handles Unicode and Vietnamese characters safely', () => {
  const tokens = tokenizeReadingText('Thưởng thức một tách cà phê phở ngon tại Hà Nội!');
  assert.ok(tokens.includes('Thưởng'));
  assert.ok(tokens.includes('phở'));
  assert.ok(tokens.includes('!'));
});

test('Reading Domain - Preserves punctuation as separate tokens', () => {
  const tokens = tokenizeReadingText('Hello, world! How are you? "Great!"');
  assert.ok(tokens.includes(','));
  assert.ok(tokens.includes('!'));
  assert.ok(tokens.includes('?'));
});

test('Reading Domain - Empty or invalid text returns empty array', () => {
  assert.deepEqual(tokenizeReadingText(''), []);
  assert.deepEqual(tokenizeReadingText('   '), []);
});

test('Reading Domain - Calculates accurate WPM reading speed', () => {
  const wpm = calculateReadingWPM(300, 120); // 300 words in 2 minutes = 150 WPM
  assert.equal(wpm, 150);
});

test('Reading Domain - Zero elapsed time handles safely without division by zero', () => {
  const wpm = calculateReadingWPM(200, 0);
  assert.equal(wpm, 0);
});

test('Reading Domain - Calculates weighted reading score properly', () => {
  const score = calculateReadingScore(2, 2, 150, 1.0); // 70 (accuracy) + 20 (completion) + 6 (vocab) = 96
  assert.ok(score >= 90);
});

test('Reading Domain - Zero correct answers produces low score', () => {
  const score = calculateReadingScore(0, 5, 100, 1.0);
  assert.ok(score <= 30);
});

test('Reading Domain - Grade mapping adheres to pedagogical intervals', () => {
  assert.equal(getReadingGrade(95), 'Excellent');
  assert.equal(getReadingGrade(85), 'Very Good');
  assert.equal(getReadingGrade(75), 'Good');
  assert.equal(getReadingGrade(65), 'Needs Practice');
  assert.equal(getReadingGrade(40), 'Keep Practicing');
});

test('Reading Domain - Calculates base XP per CEFR difficulty', () => {
  assert.equal(calculateReadingXP('A1', 60), 15);
  assert.equal(calculateReadingXP('A2', 60), 20);
  assert.equal(calculateReadingXP('B1', 60), 25);
  assert.equal(calculateReadingXP('B2', 60), 30);
  assert.equal(calculateReadingXP('C1', 60), 40);
});

test('Reading Domain - High comprehension score awards bonus XP', () => {
  const highXP = calculateReadingXP('B1', 95);
  assert.equal(highXP, 40); // 25 base + 15 bonus
});

test('Reading Domain - Challenge mode awards additional bonus XP', () => {
  const challengeXP = calculateReadingXP('B1', 95, 'challenge');
  assert.equal(challengeXP, 50); // 25 base + 15 score + 10 challenge
});

test('Reading Domain - Words learned awards incremental XP', () => {
  const vocabXP = calculateReadingXP('A1', 60, 'standard', 3);
  assert.equal(vocabXP, 21); // 15 base + 6 (3 words * 2)
});

test('Reading Domain - Evaluates reading question with exact match', () => {
  assert.equal(evaluateReadingAnswer(SAMPLE_QUESTION_1, 'Coffee culture'), true);
  assert.equal(evaluateReadingAnswer(SAMPLE_QUESTION_1, 'coffee culture'), true); // case-insensitive
  assert.equal(evaluateReadingAnswer(SAMPLE_QUESTION_1, 'Fast food'), false);
});

test('Reading Domain - Evaluates complete reading attempt', () => {
  const feedback = evaluateReadingAttempt(
    SAMPLE_ARTICLE,
    [
      { questionId: 'q1', selectedOption: 'Coffee culture' },
      { questionId: 'q2', selectedOption: 'True' },
    ],
    60,
    'standard'
  );

  assert.equal(feedback.correctCount, 2);
  assert.equal(feedback.accuracy, 100);
  assert.equal(feedback.grade, 'Excellent');
  assert.equal(feedback.wpm, 150);
  assert.ok(feedback.xpAwarded > 30);
  assert.equal(feedback.answersFeedback.length, 2);
});

test('Reading Domain - Empty answers evaluated as incorrect', () => {
  const feedback = evaluateReadingAttempt(SAMPLE_ARTICLE, [], 60);
  assert.equal(feedback.correctCount, 0);
  assert.equal(feedback.accuracy, 0);
  assert.equal(feedback.answersFeedback[0].isCorrect, false);
});

test('Reading Domain - Maps reading performance to SM-2 Quality ratings', () => {
  assert.equal(mapReadingPerformanceToSRSQuality(true, 2500, false), 5); // Fast correct -> 5
  assert.equal(mapReadingPerformanceToSRSQuality(true, 6000, false), 4); // Normal correct -> 4
  assert.equal(mapReadingPerformanceToSRSQuality(true, 2000, true), 3);  // Hint used -> 3
  assert.equal(mapReadingPerformanceToSRSQuality(false), 1);              // Incorrect -> 1
});

test('Reading Domain - Evaluates multiple-choice and true-false question types', () => {
  const mcqCorrect = evaluateReadingAnswer(SAMPLE_QUESTION_1, 'Coffee culture');
  const tfCorrect = evaluateReadingAnswer(SAMPLE_QUESTION_2, 'True');
  const tfWrong = evaluateReadingAnswer(SAMPLE_QUESTION_2, 'False');

  assert.equal(mcqCorrect, true);
  assert.equal(tfCorrect, true);
  assert.equal(tfWrong, false);
});

test('Reading Domain - Attempt with challenge mode properly reflects XP', () => {
  const result = evaluateReadingAttempt(
    SAMPLE_ARTICLE,
    [
      { questionId: 'q1', selectedOption: 'Coffee culture' },
      { questionId: 'q2', selectedOption: 'True' },
    ],
    45,
    'challenge'
  );
  assert.ok(result.xpAwarded >= 40);
  assert.equal(result.grade, 'Excellent');
});
