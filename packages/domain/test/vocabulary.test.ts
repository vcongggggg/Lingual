import test from 'node:test';
import assert from 'node:assert/strict';
import {
  searchVocabularyWords,
  evaluateVocabularyPractice,
  mapPracticeQualityToSM2,
  VocabularyWord,
  VocabularyPracticeQuestion,
} from '../src/index.ts';

const SAMPLE_WORDS: VocabularyWord[] = [
  {
    id: 'w-1',
    targetText: 'Travel',
    normalizedText: 'travel',
    translation: 'Du lịch',
    partOfSpeech: 'verb',
    cefrLevel: 'A2',
    category: 'Travel & Leisure',
    examples: [
      { sentence: 'I love to travel during summer.', translation: 'Tôi thích đi du lịch vào mùa hè.' },
    ],
    tags: ['journey', 'trip', 'vacation'],
  },
  {
    id: 'w-2',
    targetText: 'Journey',
    normalizedText: 'journey',
    translation: 'Hành trình',
    partOfSpeech: 'noun',
    cefrLevel: 'B1',
    category: 'Travel & Leisure',
    examples: [
      { sentence: 'It was a long journey across the mountains.', translation: 'Đó là một hành trình dài qua những ngọn núi.' },
    ],
    tags: ['trip', 'adventure'],
  },
  {
    id: 'w-3',
    targetText: 'Ecosystem',
    normalizedText: 'ecosystem',
    translation: 'Hệ sinh thái',
    partOfSpeech: 'noun',
    cefrLevel: 'B2',
    category: 'Environment',
    examples: [
      { sentence: 'Plastic waste threatens the marine ecosystem.', translation: 'Rác thải nhựa đe dọa hệ sinh thái biển.' },
    ],
    tags: ['nature', 'marine'],
  },
];

test('Vocabulary Search - Exact search finds target word', () => {
  const results = searchVocabularyWords(SAMPLE_WORDS, 'Travel');
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'w-1');
});

test('Vocabulary Search - Partial search matches prefix and substrings', () => {
  const results = searchVocabularyWords(SAMPLE_WORDS, 'trav');
  assert.equal(results.length, 1);
  assert.equal(results[0].targetText, 'Travel');
});

test('Vocabulary Search - Searches translation in Vietnamese', () => {
  const results = searchVocabularyWords(SAMPLE_WORDS, 'du lịch');
  assert.equal(results.length, 1);
  assert.equal(results[0].targetText, 'Travel');
});

test('Vocabulary Search - Searches tags and example sentence substrings', () => {
  const results = searchVocabularyWords(SAMPLE_WORDS, 'trip');
  assert.equal(results.length, 2);
});

test('Vocabulary Search - Filters by CEFR level', () => {
  const results = searchVocabularyWords(SAMPLE_WORDS, '', { cefrLevel: 'B2' });
  assert.equal(results.length, 1);
  assert.equal(results[0].targetText, 'Ecosystem');
});

test('Vocabulary Search - Empty query returns all words', () => {
  const results = searchVocabularyWords(SAMPLE_WORDS, '');
  assert.equal(results.length, 3);
});

test('Vocabulary Search - Non-existent query returns empty array', () => {
  const results = searchVocabularyWords(SAMPLE_WORDS, 'nonexistentquery123');
  assert.equal(results.length, 0);
});

test('SM-2 Mapping - Correct fast recall maps to quality 5', () => {
  const quality = mapPracticeQualityToSM2(true, 2, false);
  assert.equal(quality, 5);
});

test('SM-2 Mapping - Correct with hint maps to quality 3', () => {
  const quality = mapPracticeQualityToSM2(true, 4, true);
  assert.equal(quality, 3);
});

test('SM-2 Mapping - Incorrect answer maps to quality 1', () => {
  const quality = mapPracticeQualityToSM2(false, 3, false);
  assert.equal(quality, 1);
});

test('Vocabulary Practice Evaluation - Calculates accuracy and maps questions to SM-2 qualities', () => {
  const questions: VocabularyPracticeQuestion[] = [
    {
      id: 'q-1',
      wordId: 'w-1',
      mode: 'meaning_choice',
      prompt: 'Travel',
      targetWord: 'Travel',
      correctAnswer: 'Du lịch',
    },
    {
      id: 'q-2',
      wordId: 'w-2',
      mode: 'cloze',
      prompt: 'It was a long ___ across the mountains.',
      targetWord: 'Journey',
      correctAnswer: 'Journey',
    },
  ];

  const answers = [
    { questionId: 'q-1', wordId: 'w-1', userAnswer: 'Du lịch', responseTimeSeconds: 2 },
    { questionId: 'q-2', wordId: 'w-2', userAnswer: 'Trip', responseTimeSeconds: 4 },
  ];

  const result = evaluateVocabularyPractice(questions, answers);
  assert.equal(result.totalQuestions, 2);
  assert.equal(result.correctCount, 1);
  assert.equal(result.incorrectCount, 1);
  assert.equal(result.accuracy, 50);
  assert.equal(result.masteredWords.includes('Travel'), true);
  assert.equal(result.missedWords.includes('Journey'), true);
  assert.equal(result.evaluatedQuestions[0].sm2Quality, 5);
  assert.equal(result.evaluatedQuestions[1].sm2Quality, 1);
});
