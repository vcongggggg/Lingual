import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createExamAttempt,
  sanitizePublicExam,
  calculateQuestionScore,
  calculateExamAccuracy,
  calculateExamGrade,
  calculateExamXP,
  calculateScaledScore,
  calculateExamWeaknesses,
  evaluateExamAttempt,
  mapExamPerformanceToSRSQuality,
  Exam,
  ExamQuestion,
} from '../src/index.ts';

const SAMPLE_QUESTION_1: ExamQuestion = {
  id: 'q-toeic-1',
  sectionId: 'sec-reading-1',
  type: 'fill-blank',
  prompt: 'Ms. Henderson has requested that all department managers submit their reports _______ Friday afternoon.',
  options: ['by', 'until', 'at', 'during'],
  correctAnswer: 'by',
  explanation: '"By" indicates a deadline before or at Friday afternoon.',
  difficulty: 'B1',
  tags: ['grammar', 'prepositions'],
  vocabularyIds: ['vocab-deadline', 'vocab-submit'],
};

const SAMPLE_QUESTION_2: ExamQuestion = {
  id: 'q-toeic-2',
  sectionId: 'sec-reading-1',
  type: 'multiple-choice',
  prompt: 'The new software will significantly increase office _______.',
  options: ['productivity', 'product', 'produce', 'productive'],
  correctAnswer: 'productivity',
  explanation: 'Noun form "productivity" fits after adjective "office".',
  difficulty: 'B1',
  tags: ['vocabulary', 'word-form'],
  vocabularyIds: ['vocab-productivity'],
};

const SAMPLE_QUESTION_3: ExamQuestion = {
  id: 'q-toeic-3',
  sectionId: 'sec-listening-1',
  type: 'listening-comprehension',
  prompt: 'Where does the conversation most likely take place?',
  options: ['At a train station', 'In a restaurant', 'In a library', 'At a doctor office'],
  correctAnswer: 'At a train station',
  explanation: 'The speaker asks about ticket platforms and schedule departures.',
  difficulty: 'B1',
  tags: ['listening', 'inference'],
};

const SAMPLE_EXAM: Exam = {
  id: 'toeic-mini-1',
  title: 'TOEIC Mini Mock Test 01',
  subtitle: 'Listening & Reading Simulation',
  type: 'toeic',
  difficulty: 'B1',
  durationMinutes: 30,
  totalQuestions: 3,
  tags: ['toeic', 'mini-test', 'b1'],
  sections: [
    {
      id: 'sec-listening-1',
      title: 'Part 3: Short Conversations',
      type: 'listening',
      durationMinutes: 10,
      questions: [SAMPLE_QUESTION_3],
    },
    {
      id: 'sec-reading-1',
      title: 'Part 5: Incomplete Sentences',
      type: 'reading',
      durationMinutes: 20,
      questions: [SAMPLE_QUESTION_1, SAMPLE_QUESTION_2],
    },
  ],
};

test('Exam Domain - createExamAttempt initializes attempt with expiry grace period', () => {
  const attempt = createExamAttempt('toeic-mini-1', 'user-123', 30);
  assert.equal(attempt.examId, 'toeic-mini-1');
  assert.equal(attempt.userId, 'user-123');
  assert.equal(attempt.status, 'in-progress');
  assert.ok(new Date(attempt.expiresAt).getTime() > new Date(attempt.startedAt).getTime());
});

test('Exam Domain - sanitizePublicExam strips correctAnswer and explanation (Anti-cheat boundary)', () => {
  const publicExam = sanitizePublicExam(SAMPLE_EXAM);
  assert.equal(publicExam.id, SAMPLE_EXAM.id);
  const q1 = publicExam.sections[1].questions[0] as any;
  assert.equal(q1.correctAnswer, undefined);
  assert.equal(q1.explanation, undefined);
  assert.equal(q1.prompt, SAMPLE_QUESTION_1.prompt);
});

test('Exam Domain - calculateQuestionScore evaluates correct answer', () => {
  const res = calculateQuestionScore(SAMPLE_QUESTION_1, 'by');
  assert.equal(res.isCorrect, true);
  assert.equal(res.isUnanswered, false);
  assert.equal(res.points, 1);
});

test('Exam Domain - calculateQuestionScore evaluates case-insensitive answer', () => {
  const res = calculateQuestionScore(SAMPLE_QUESTION_1, 'BY');
  assert.equal(res.isCorrect, true);
});

test('Exam Domain - calculateQuestionScore evaluates wrong answer', () => {
  const res = calculateQuestionScore(SAMPLE_QUESTION_1, 'until');
  assert.equal(res.isCorrect, false);
  assert.equal(res.points, 0);
});

test('Exam Domain - calculateQuestionScore evaluates unanswered option', () => {
  const res = calculateQuestionScore(SAMPLE_QUESTION_1, '');
  assert.equal(res.isUnanswered, true);
  assert.equal(res.isCorrect, false);
});

test('Exam Domain - calculateExamAccuracy computes accurate percentage', () => {
  assert.equal(calculateExamAccuracy(8, 10), 80);
  assert.equal(calculateExamAccuracy(0, 5), 0);
  assert.equal(calculateExamAccuracy(5, 0), 0);
});

test('Exam Domain - calculateExamGrade maps to pedagogical grade', () => {
  assert.equal(calculateExamGrade(95), 'Excellent');
  assert.equal(calculateExamGrade(85), 'Very Good');
  assert.equal(calculateExamGrade(75), 'Good');
  assert.equal(calculateExamGrade(65), 'Needs Practice');
  assert.equal(calculateExamGrade(45), 'Keep Practicing');
});

test('Exam Domain - calculateExamXP calculates base and performance rewards', () => {
  const perfectXP = calculateExamXP('toeic', 'B1', 100, true);
  assert.ok(perfectXP >= 80); // 40 base + 10 B1 + 30 score + 15 first-attempt

  const lowXP = calculateExamXP('toeic', 'A1', 40, false);
  assert.equal(lowXP, 40); // 40 base + 0 A1 + 0 bonus
});

test('Exam Domain - calculateScaledScore maps TOEIC points (10 - 990)', () => {
  const perfect = calculateScaledScore('toeic', 100, 100);
  assert.equal(perfect.scaledScore, 990);

  const half = calculateScaledScore('toeic', 50, 100);
  assert.ok(half.scaledScore >= 450 && half.scaledScore <= 550);
});

test('Exam Domain - calculateScaledScore maps IELTS band (0 - 9.0)', () => {
  const perfect = calculateScaledScore('ielts', 40, 40);
  assert.equal(perfect.scaledScore, 8.5);

  const good = calculateScaledScore('ielts', 30, 40);
  assert.equal(good.scaledScore, 7.5);
});

test('Exam Domain - calculateScaledScore maps VSTEP scale (0 - 10.0)', () => {
  const result = calculateScaledScore('vstep', 8, 10);
  assert.equal(result.scaledScore, 8.0);
  assert.ok(result.label.includes('B2'));
});

test('Exam Domain - calculateScaledScore maps DSAT scale (400 - 1600)', () => {
  const result = calculateScaledScore('dsat', 50, 100);
  assert.equal(result.scaledScore, 1000);
});

test('Exam Domain - calculateExamWeaknesses derives error rates by question category', () => {
  const questionResults = [
    { questionId: '1', sectionId: 's1', type: 'fill-blank' as any, prompt: '', selectedOption: 'A', correctAnswer: 'B', isCorrect: false, isUnanswered: false, explanation: '', vocabularyIds: [], pointsAwarded: 0 },
    { questionId: '2', sectionId: 's1', type: 'fill-blank' as any, prompt: '', selectedOption: 'A', correctAnswer: 'A', isCorrect: true, isUnanswered: false, explanation: '', vocabularyIds: [], pointsAwarded: 1 },
    { questionId: '3', sectionId: 's2', type: 'listening-comprehension' as any, prompt: '', selectedOption: '', correctAnswer: 'C', isCorrect: false, isUnanswered: true, explanation: '', vocabularyIds: [], pointsAwarded: 0 },
  ];

  const weaknesses = calculateExamWeaknesses(questionResults);
  assert.equal(weaknesses.length, 2);
  assert.ok(weaknesses.some((w) => w.category === 'fill-blank'));
  assert.ok(weaknesses.some((w) => w.category === 'listening-comprehension'));
});

test('Exam Domain - evaluateExamAttempt performs complete authoritative evaluation', () => {
  const attempt = createExamAttempt('toeic-mini-1', 'user-123', 30);
  attempt.answers = [
    { questionId: 'q-toeic-1', selectedOption: 'by' },
    { questionId: 'q-toeic-2', selectedOption: 'productivity' },
    { questionId: 'q-toeic-3', selectedOption: 'At a train station' },
  ];

  const result = evaluateExamAttempt(SAMPLE_EXAM, attempt, 600);
  assert.equal(result.score, 3);
  assert.equal(result.maxScore, 3);
  assert.equal(result.accuracy, 100);
  assert.equal(result.grade, 'Excellent');
  assert.equal(result.sectionResults.length, 2);
  assert.equal(result.sectionResults[0].accuracy, 100);
  assert.equal(result.sectionResults[1].accuracy, 100);
  assert.ok(result.xpAwarded > 50);
});

test('Exam Domain - evaluateExamAttempt with partial answers captures weak vocabulary for SRS', () => {
  const attempt = createExamAttempt('toeic-mini-1', 'user-123', 30);
  attempt.answers = [
    { questionId: 'q-toeic-1', selectedOption: 'until' }, // WRONG -> vocabularyIds: ['vocab-deadline', 'vocab-submit']
    { questionId: 'q-toeic-2', selectedOption: 'productivity' }, // CORRECT
  ];

  const result = evaluateExamAttempt(SAMPLE_EXAM, attempt, 600);
  assert.equal(result.score, 1);
  assert.equal(result.accuracy, 33);
  assert.ok(result.weakVocabularyIds.includes('vocab-deadline'));
  assert.ok(result.weakVocabularyIds.includes('vocab-submit'));
});

test('Exam Domain - evaluateExamAttempt with zero answers returns zero score without throwing', () => {
  const attempt = createExamAttempt('toeic-mini-1', 'user-123', 30);
  const result = evaluateExamAttempt(SAMPLE_EXAM, attempt, 1800);
  assert.equal(result.score, 0);
  assert.equal(result.accuracy, 0);
  assert.equal(result.grade, 'Keep Practicing');
});

test('Exam Domain - mapExamPerformanceToSRSQuality maps performance to SM-2 quality', () => {
  assert.equal(mapExamPerformanceToSRSQuality(true, 2000), 5); // Fast correct -> 5
  assert.equal(mapExamPerformanceToSRSQuality(true, 6000), 4); // Normal correct -> 4
  assert.equal(mapExamPerformanceToSRSQuality(false), 1);      // Incorrect -> 1
});

test('Exam Domain - calculateScaledScore handles low score band for IELTS safely', () => {
  const low = calculateScaledScore('ielts', 5, 40);
  assert.equal(low.scaledScore, 4.0);
  assert.equal(low.label, 'Band 4.0');
});

test('Exam Domain - evaluateExamAttempt accurately calculates elapsed and remaining seconds', () => {
  const attempt = createExamAttempt('toeic-mini-1', 'user-123', 30);
  const result = evaluateExamAttempt(SAMPLE_EXAM, attempt, 1200); // 1200s used out of 1800s
  assert.equal(result.elapsedSeconds, 1200);
  assert.equal(result.remainingSeconds, 600);
});
