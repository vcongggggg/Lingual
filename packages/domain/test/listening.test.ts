import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateDictation,
  calculateSpeechSimilarity,
  normalizeListeningText,
  calculateLevenshteinDistance,
} from '../src/index.ts';

test('Dictation Evaluation - Exact match with different casing yields 100% accuracy', () => {
  const result = evaluateDictation('Hello World', 'hello world');
  assert.equal(result.accuracy, 100);
  assert.equal(result.mistakes, 0);
  assert.equal(result.completed, true);
  assert.equal(result.correctWords.length, 2);
  assert.equal(result.missingWords.length, 0);
  assert.equal(result.extraWords.length, 0);
  assert.equal(result.incorrectWords.length, 0);
});

test('Dictation Evaluation - Punctuation differences are normalized', () => {
  const result = evaluateDictation('Hello, world!', 'hello world');
  assert.equal(result.accuracy, 100);
  assert.equal(result.mistakes, 0);
  assert.equal(result.completed, true);
});

test('Dictation Evaluation - Detects missing words accurately', () => {
  const result = evaluateDictation('The student is learning English', 'The student learning English');
  assert.equal(result.missingWords.includes('is'), true);
  assert.equal(result.correctWords.includes('student'), true);
  assert.equal(result.correctWords.includes('learning'), true);
  assert.equal(result.correctWords.includes('english'), true);
  assert.ok(result.accuracy >= 70);
});

test('Dictation Evaluation - Detects extra words in submission', () => {
  const result = evaluateDictation('I like coffee', 'I really like coffee');
  assert.equal(result.extraWords.includes('really'), true);
  assert.equal(result.correctWords.includes('like'), true);
  assert.equal(result.correctWords.includes('coffee'), true);
});

test('Dictation Evaluation - Detects incorrect / substituted words', () => {
  const result = evaluateDictation('She works at a hospital', 'She works at a school');
  assert.equal(result.incorrectWords.includes('school'), true);
  assert.equal(result.correctWords.includes('hospital'), false);
  assert.equal(result.correctWords.includes('works'), true);
});

test('Speech Similarity - Identical transcripts return 100% match rating', () => {
  const result = calculateSpeechSimilarity(
    'I would like a cup of coffee',
    'I would like a cup of coffee'
  );
  assert.equal(result.similarity, 100);
  assert.equal(result.matchRating, 'excellent');
  assert.equal(result.completed, true);
  assert.equal(result.xpEarned, 20);
});

test('Speech Similarity - Minor contraction differences return high match score', () => {
  const result = calculateSpeechSimilarity(
    'I would like a cup of coffee',
    'I like a cup of coffee'
  );
  assert.ok(result.similarity >= 75);
  assert.ok(['excellent', 'good'].includes(result.matchRating));
  assert.equal(result.completed, true);
});

test('Speech Similarity - Completely divergent text returns poor match score', () => {
  const result = calculateSpeechSimilarity(
    'What time is the morning meeting',
    'Completely different sentence'
  );
  assert.ok(result.similarity < 50);
  assert.equal(result.matchRating, 'poor');
  assert.equal(result.completed, false);
});

test('Text Normalization - Strips complex punctuation and collapses spaces', () => {
  const text = ' "Hello,   world!" -- (How are you?) ';
  const normalized = normalizeListeningText(text);
  assert.equal(normalized, 'hello world how are you');
});
