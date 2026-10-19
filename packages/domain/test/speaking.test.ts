import test from 'node:test';
import assert from 'node:assert/strict';
import {
  tokenizeSpeakingTranscript,
  calculateSpeakingWordCount,
  calculateSpeakingDuration,
  calculateTranscriptSimilarity,
  calculatePronunciationScore,
  calculateFluencyScore,
  calculateSpeakingVocabularyScore,
  calculateSpeakingGrammarScore,
  calculateSpeakingCoherenceScore,
  calculateSpeakingScore,
  getSpeakingGrade,
  calculateSpeakingXP,
  mapSpeakingPerformanceToSRSQuality,
  detectSpeakingWeaknesses,
  generateSpeakingRecommendations,
  evaluateSpeakingSubmission,
  SpeakingPrompt,
  SpeakingSubmission,
} from '../src/index.js';

test('Speaking Domain - tokenizeSpeakingTranscript handles empty and whitespace-only text', () => {
  assert.deepEqual(tokenizeSpeakingTranscript(''), []);
  assert.deepEqual(tokenizeSpeakingTranscript('   \n\t  '), []);
  assert.deepEqual(tokenizeSpeakingTranscript(null as any), []);
});

test('Speaking Domain - tokenizeSpeakingTranscript normalizes punctuation and preserves apostrophes', () => {
  const tokens = tokenizeSpeakingTranscript("Hello, world! I don't think that's right... is it?");
  assert.ok(tokens.includes('hello'));
  assert.ok(tokens.includes('world'));
  assert.ok(tokens.includes("don't"));
  assert.ok(tokens.includes("that's"));
});

test('Speaking Domain - tokenizeSpeakingTranscript handles Unicode and Vietnamese mixed characters safely', () => {
  const tokens = tokenizeSpeakingTranscript('Xin chào, I am practicing English pronunciation in Hà Nội.');
  assert.ok(tokens.length >= 8);
  assert.ok(tokens.includes('practicing'));
  assert.ok(tokens.includes('english'));
});

test('Speaking Domain - calculateSpeakingWordCount and calculateSpeakingDuration', () => {
  assert.equal(calculateSpeakingWordCount('The quick brown fox jumps over the lazy dog'), 9);
  assert.equal(calculateSpeakingDuration(15400), 15);
  assert.equal(calculateSpeakingDuration(0), 0);
  assert.equal(calculateSpeakingDuration(-500), 0);
});

test('Speaking Domain - calculateTranscriptSimilarity handles exact, partial and divergent text', () => {
  const exact = calculateTranscriptSimilarity('I like learning languages', 'I like learning languages');
  assert.equal(exact, 100);

  const partial = calculateTranscriptSimilarity('I like learning languages', 'I like learning');
  assert.ok(partial >= 70 && partial < 100);

  const divergent = calculateTranscriptSimilarity('I like learning languages', 'The rocket launched into space');
  assert.ok(divergent <= 20);

  assert.equal(calculateTranscriptSimilarity('', ''), 100);
  assert.equal(calculateTranscriptSimilarity('hello', ''), 0);
});

test('Speaking Domain - calculatePronunciationScore matches transcript and handles boundaries', () => {
  const score = calculatePronunciationScore('hospitalization', 'hospitalization');
  assert.equal(score, 100);

  const emptyScore = calculatePronunciationScore('hospitalization', '');
  assert.equal(emptyScore, 0);
});

test('Speaking Domain - calculateFluencyScore calculates natural rate and applies hesitation penalties', () => {
  // 120 WPM (60 words in 30 seconds) -> High score
  const natural = calculateFluencyScore(60, 30, 0, 0);
  assert.ok(natural >= 90);

  // Excessive hesitation ("uh", "um" 4 times) -> Penalized
  const hesitant = calculateFluencyScore(60, 30, 4, 0);
  assert.ok(hesitant < natural);

  // Zero duration/words safety
  assert.equal(calculateFluencyScore(0, 30), 0);
  assert.equal(calculateFluencyScore(30, 0), 0);
});

test('Speaking Domain - calculateSpeakingVocabularyScore measures diversity and target hits', () => {
  const rich = calculateSpeakingVocabularyScore('The innovation introduces exceptional efficiency and capability', ['innovation', 'efficiency']);
  const repetitive = calculateSpeakingVocabularyScore('very very very good good good');
  assert.ok(rich > repetitive);
});

test('Speaking Domain - calculateSpeakingGrammarScore detects subject-verb and tense mistakes', () => {
  const { score: cleanScore, corrections: cleanCorr } = calculateSpeakingGrammarScore('She speaks fluent English.');
  assert.equal(cleanCorr.length, 0);
  assert.ok(cleanScore >= 90);

  const { score: badScore, corrections: badCorr } = calculateSpeakingGrammarScore('Yesterday I go to school and he want to play with a apple.');
  assert.ok(badCorr.length >= 2);
  assert.ok(badScore < cleanScore);
});

test('Speaking Domain - calculateSpeakingCoherenceScore evaluates structure and discourse connectors', () => {
  const coherent = calculateSpeakingCoherenceScore('Firstly, learning English is essential because it opens career opportunities. Furthermore, it expands your worldview.', 15);
  const brief = calculateSpeakingCoherenceScore('Yes I like it.', 15);
  assert.ok(coherent > brief);
});

test('Speaking Domain - calculateSpeakingScore adheres to 30/25/20/15/10 weighting', () => {
  // Pronunciation: 100 (30), Fluency: 100 (25), Grammar: 100 (20), Vocab: 100 (15), Coherence: 100 (10) = 100
  assert.equal(calculateSpeakingScore(100, 100, 100, 100, 100), 100);
  assert.equal(calculateSpeakingScore(0, 0, 0, 0, 0), 0);
});

test('Speaking Domain - getSpeakingGrade maps accurately to intervals', () => {
  assert.equal(getSpeakingGrade(95), 'Excellent');
  assert.equal(getSpeakingGrade(85), 'Very Good');
  assert.equal(getSpeakingGrade(75), 'Good');
  assert.equal(getSpeakingGrade(65), 'Needs Practice');
  assert.equal(getSpeakingGrade(45), 'Keep Practicing');
});

test('Speaking Domain - calculateSpeakingXP awards proportional XP with strict upper cap', () => {
  const advXP = calculateSpeakingXP('advanced', 60, 95, true);
  assert.ok(advXP >= 30 && advXP <= 50);

  const beginnerXP = calculateSpeakingXP('beginner', 10, 70, true);
  assert.ok(beginnerXP >= 15 && beginnerXP < advXP);

  const failedXP = calculateSpeakingXP('beginner', 1, 10, false);
  assert.equal(failedXP, 5);
});

test('Speaking Domain - mapSpeakingPerformanceToSRSQuality maps to SM-2 quality 0-5', () => {
  assert.equal(mapSpeakingPerformanceToSRSQuality(95, 95), 5);
  assert.equal(mapSpeakingPerformanceToSRSQuality(82, 85), 4);
  assert.equal(mapSpeakingPerformanceToSRSQuality(72, 70), 3);
  assert.equal(mapSpeakingPerformanceToSRSQuality(55, 55), 2);
  assert.equal(mapSpeakingPerformanceToSRSQuality(40, 40), 1);
  assert.equal(mapSpeakingPerformanceToSRSQuality(20, 20), 0);
});

test('Speaking Domain - detectSpeakingWeaknesses and generateSpeakingRecommendations', () => {
  const weakFeedback = {
    pronunciationScore: 50,
    fluencyScore: 55,
    grammarScore: 60,
    vocabularyScore: 58,
    coherenceScore: 50,
    overallScore: 54,
    grade: 'Keep Practicing' as const,
    corrections: [],
    pronunciationIssues: [],
    vocabularySuggestions: [],
    advice: '',
  };

  const weaknesses = detectSpeakingWeaknesses(weakFeedback);
  assert.ok(weaknesses.includes('low pronunciation match'));
  assert.ok(weaknesses.includes('low fluency / hesitation'));

  const recsVi = generateSpeakingRecommendations(weakFeedback, 'vi');
  assert.ok(recsVi.length >= 3);
  assert.ok(recsVi.some((r) => r.includes('Pronunciation')));
});

test('Speaking Domain - evaluateSpeakingSubmission performs complete end-to-end evaluation', () => {
  const mockPrompt: SpeakingPrompt = {
    id: 'sp-test-1',
    title: 'Describe your favorite hobby',
    description: 'Talk about what you enjoy doing in your free time.',
    mode: 'free-speaking',
    difficulty: 'intermediate',
    topic: 'Hobbies',
    targetWords: ['relaxation', 'creativity'],
    targetPhrases: ['in my spare time'],
    sampleAnswer: 'In my spare time, I enjoy painting for relaxation and creativity.',
    durationSeconds: 45,
    minWords: 15,
    maxWords: 80,
    cefr: 'B1',
    tags: ['lifestyle', 'hobbies'],
  };

  const mockSubmission: SpeakingSubmission = {
    promptId: 'sp-test-1',
    transcript: 'In my spare time, I enjoy painting because it brings me relaxation and creativity. Furthermore, it helps my focus.',
    durationMs: 30000,
    wordsSpoken: 20,
  };

  const feedback = evaluateSpeakingSubmission(mockPrompt, mockSubmission, 'vi');
  assert.ok(feedback.overallScore >= 75);
  assert.ok(feedback.grade === 'Very Good' || feedback.grade === 'Good' || feedback.grade === 'Excellent');
  assert.ok(feedback.fluencyScore > 0);
  assert.ok(feedback.grammarScore > 0);
  assert.ok(feedback.vocabularyScore > 0);
  assert.ok(feedback.coherenceScore > 0);
  assert.ok(Boolean(feedback.advice));
});
