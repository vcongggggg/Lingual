/**
 * Pure Domain Logic for LinguaFlow
 * Language-agnostic, zero side-effects algorithms:
 * - SM-2 Spaced Repetition Algorithm
 * - Timezone-aware Streak & Streak Freeze Manager
 * - XP Calculator
 * - Server-side Anti-cheat Game & Quiz Evaluator
 */

export * from './rbac';

// ============================================================================
// 1. SM-2 SPACED REPETITION ALGORITHM
// ============================================================================

export interface SM2State {
  repetition: number;
  interval: number;
  efactor: number;
}

export interface SM2Result extends SM2State {
  dueDate: Date;
  quality: number;
}

export function calculateSM2(
  currentState: SM2State = { repetition: 0, interval: 1, efactor: 2.5 },
  quality: number
): SM2Result {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  let { repetition, interval, efactor } = currentState;

  if (q >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * efactor);
    }
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }

  efactor = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (efactor < 1.3) {
    efactor = 1.3;
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    repetition,
    interval,
    efactor: Number(efactor.toFixed(2)),
    dueDate,
    quality: q,
  };
}

// ============================================================================
// 2. TIMEZONE-AWARE STREAK & STREAK FREEZE ENGINE
// ============================================================================

export interface StreakState {
  currentStreak: number;
  streakFreezes: number;
  lastActiveDate: string | null; // Format: YYYY-MM-DD in user's timezone
}

/**
 * Gets date string formatted as YYYY-MM-DD in given timezone
 */
export function getFormattedDateInTimezone(date: Date = new Date(), timezone: string = 'Asia/Ho_Chi_Minh'): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: timezone });
    return formatter.format(date); // Output format: YYYY-MM-DD
  } catch {
    return date.toISOString().split('T')[0];
  }
}

/**
 * Updates user's streak considering timezone and streak freezes.
 */
export function updateStreakWithTimezone(
  state: StreakState,
  currentDate: Date = new Date(),
  timezone: string = 'Asia/Ho_Chi_Minh'
): { currentStreak: number; streakFreezes: number; streakMaintained: boolean; freezeUsed: boolean } {
  const todayStr = getFormattedDateInTimezone(currentDate, timezone);

  if (!state.lastActiveDate) {
    return {
      currentStreak: 1,
      streakFreezes: state.streakFreezes,
      streakMaintained: true,
      freezeUsed: false,
    };
  }

  if (state.lastActiveDate === todayStr) {
    return {
      currentStreak: state.currentStreak,
      streakFreezes: state.streakFreezes,
      streakMaintained: true,
      freezeUsed: false,
    };
  }

  const lastDate = new Date(state.lastActiveDate);
  const todayDate = new Date(todayStr);
  const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) {
    // Consecutive day activity!
    return {
      currentStreak: state.currentStreak + 1,
      streakFreezes: state.streakFreezes,
      streakMaintained: true,
      freezeUsed: false,
    };
  } else if (diffDays === 2 && state.streakFreezes > 0) {
    // Missed exactly 1 day, but user has Streak Freeze!
    return {
      currentStreak: state.currentStreak + 1,
      streakFreezes: state.streakFreezes - 1,
      streakMaintained: true,
      freezeUsed: true,
    };
  } else {
    // Streak broken, reset to 1
    return {
      currentStreak: 1,
      streakFreezes: state.streakFreezes,
      streakMaintained: false,
      freezeUsed: false,
    };
  }
}

// ============================================================================
// 3. XP CALCULATOR
// ============================================================================

export function calculateLessonXP(
  score: number,
  totalQuestions: number,
  streakDays: number
): number {
  if (totalQuestions <= 0) return 0;
  const accuracy = score / totalQuestions;
  const baseXP = Math.round(accuracy * 50);
  const streakBonus = Math.min(25, Math.floor(streakDays * 2));
  const perfectBonus = accuracy === 1.0 ? 10 : 0;
  return baseXP + streakBonus + perfectBonus;
}

// ============================================================================
// 4. GAME SCORE CALCULATOR
// ============================================================================

export interface GameScoreInput {
  correctCount: number;
  totalQuestions: number;
  timeRemainingSeconds: number;
  consecutiveCorrect: number;
  mistakes: number;
}

export interface GameScoreOutput {
  finalScore: number;
  xpEarned: number;
  accuracy: number;
  comboMultiplier: number;
  timeBonus: number;
  streakBonus: number;
}

export function calculateGameScore(input: GameScoreInput): GameScoreOutput {
  const { correctCount, totalQuestions, timeRemainingSeconds, consecutiveCorrect, mistakes } = input;

  const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;

  // Base score: 20 points per correct answer
  const baseScore = correctCount * 20;

  // Combo multiplier: increases with consecutive correct answers (max 5x)
  const comboMultiplier = Math.min(5, 1 + Math.floor(consecutiveCorrect / 2) * 0.5);

  // Time bonus: reward finishing quickly (max 50 bonus points)
  const timeBonus = Math.min(50, Math.floor(timeRemainingSeconds * 0.8));

  // Streak bonus for perfect accuracy
  const streakBonus = accuracy === 1.0 ? 25 : 0;

  // Penalty for mistakes
  const mistakePenalty = mistakes * 5;

  const finalScore = Math.max(0, Math.round((baseScore * comboMultiplier) + timeBonus + streakBonus - mistakePenalty));

  // XP earned: roughly 1/4 of score, minimum 5 if any correct
  const xpEarned = correctCount > 0 ? Math.max(5, Math.round(finalScore / 4)) : 0;

  return {
    finalScore,
    xpEarned,
    accuracy: Number(accuracy.toFixed(2)),
    comboMultiplier,
    timeBonus,
    streakBonus,
  };
}

// ============================================================================
// 5. ANTI-CHEAT GAME & QUIZ EVALUATION ENGINE
// ============================================================================

export interface AttemptSession {
  attemptId: string;
  userId: string;
  sourceType: 'lesson' | 'game' | 'srs';
  sourceId: string;
  startedAt: Date;
}

export function validateAttemptTiming(
  session: AttemptSession,
  minDurationSeconds: number = 2,
  currentTime: Date = new Date()
): { valid: boolean; durationSeconds: number; error?: string } {
  const durationMs = currentTime.getTime() - session.startedAt.getTime();
  const durationSeconds = Math.max(1, Math.floor(durationMs / 1000));

  if (durationSeconds < minDurationSeconds) {
    return {
      valid: false,
      durationSeconds,
      error: 'Hành động quá nhanh so với giới hạn vật lý (nghi vấn gian lận)',
    };
  }

  return { valid: true, durationSeconds };
}

export function evaluateGameAnswers(
  items: Array<{ id: string; targetText: string; translation: string }>,
  userAnswers: Array<{ itemId: string; answer: string }>
): { correctCount: number; totalCount: number; accuracy: number } {
  let correctCount = 0;
  const totalCount = items.length;

  userAnswers.forEach((ua) => {
    const item = items.find((i) => i.id === ua.itemId);
    if (item && ua.answer && ua.answer.trim().toLowerCase() === item.translation.trim().toLowerCase()) {
      correctCount++;
    }
  });

  const accuracy = totalCount > 0 ? Number((correctCount / totalCount).toFixed(2)) : 0;
  return { correctCount, totalCount, accuracy };
}

// ============================================================================
// 6. IELTS BAND SCORE CALCULATORS
// ============================================================================

export function calculateIeltsListeningBand(rawScore: number): number {
  const score = Math.max(0, Math.min(40, Math.round(rawScore)));
  if (score >= 39) return 9.0;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 32) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 26) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 18) return 5.5;
  if (score >= 16) return 5.0;
  if (score >= 13) return 4.5;
  if (score >= 10) return 4.0;
  if (score >= 6) return 3.5;
  if (score >= 4) return 3.0;
  if (score >= 2) return 2.5;
  if (score >= 1) return 2.0;
  return 0.0;
}

export function calculateIeltsReadingBand(rawScore: number, type: 'academic' | 'general' = 'academic'): number {
  const score = Math.max(0, Math.min(40, Math.round(rawScore)));
  if (type === 'academic') {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 33) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 27) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 19) return 5.5;
    if (score >= 15) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    if (score >= 8) return 3.5;
    if (score >= 6) return 3.0;
    if (score >= 4) return 2.5;
    if (score >= 2) return 2.0;
    return 0.0;
  } else {
    // General Training
    if (score >= 40) return 9.0;
    if (score >= 39) return 8.5;
    if (score >= 37) return 8.0;
    if (score >= 36) return 7.5;
    if (score >= 34) return 7.0;
    if (score >= 32) return 6.5;
    if (score >= 30) return 6.0;
    if (score >= 27) return 5.5;
    if (score >= 23) return 5.0;
    if (score >= 19) return 4.5;
    if (score >= 15) return 4.0;
    if (score >= 12) return 3.5;
    if (score >= 9) return 3.0;
    if (score >= 6) return 2.5;
    if (score >= 3) return 2.0;
    return 0.0;
  }
}

export function calculateIeltsOverallBand(scores: {
  listening?: number;
  reading?: number;
  writing?: number;
  speaking?: number;
}): number {
  const validScores: number[] = [];
  if (scores.listening !== undefined && scores.listening >= 0) validScores.push(scores.listening);
  if (scores.reading !== undefined && scores.reading >= 0) validScores.push(scores.reading);
  if (scores.writing !== undefined && scores.writing >= 0) validScores.push(scores.writing);
  if (scores.speaking !== undefined && scores.speaking >= 0) validScores.push(scores.speaking);

  if (validScores.length === 0) return 0.0;

  const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
  // IELTS rounding rule:
  // decimal < 0.25 -> round down to .0
  // 0.25 <= decimal < 0.75 -> round to .5
  // decimal >= 0.75 -> round up to .0 of next integer
  const floorVal = Math.floor(avg);
  const remainder = avg - floorVal;

  if (remainder < 0.25) {
    return floorVal;
  } else if (remainder < 0.75) {
    return floorVal + 0.5;
  } else {
    return floorVal + 1.0;
  }
}

// ============================================================================
// 7. LISTENING LAB (DICTATION & SHADOWING) DOMAIN MODELS & ALGORITHMS
// ============================================================================

export type ListeningDifficulty = 'A1' | 'A2' | 'B1' | 'B2';
export type ListeningMode = 'dictation' | 'shadowing';

export interface ListeningVocabulary {
  targetText: string;
  translation: string;
  phonetic?: string;
  exampleSentence?: string;
}

export interface ListeningExercise {
  id: string;
  title: string;
  difficulty: ListeningDifficulty;
  category: string;
  transcript: string;
  translation: string;
  audioUrl?: string;
  durationSeconds: number;
  vocabulary: ListeningVocabulary[];
  modes: ListeningMode[];
  tags?: string[];
}

export type WordDiffStatus = 'correct' | 'incorrect' | 'missing' | 'extra';

export interface WordComparisonToken {
  word: string;
  status: WordDiffStatus;
  expectedWord?: string;
  submittedWord?: string;
}

export interface DictationResult {
  expectedText: string;
  submittedText: string;
  normalizedExpected: string;
  normalizedSubmitted: string;
  accuracy: number; // 0 to 100 percentage
  mistakes: number;
  tokens: WordComparisonToken[];
  correctWords: string[];
  incorrectWords: string[];
  missingWords: string[];
  extraWords: string[];
  completed: boolean;
  xpEarned: number;
}

export interface ShadowingResult {
  transcript: string;
  recognizedText: string;
  similarity: number; // 0 to 100 percentage
  matchRating: 'excellent' | 'good' | 'fair' | 'poor';
  completed: boolean;
  xpEarned: number;
}

/**
 * Normalizes text for dictation and speech comparison:
 * - Converts to lowercase
 * - Strips common punctuation (.,!?;:'"“”()[]{})
 * - Normalizes multiple spaces into a single space
 */
export function normalizeListeningText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'“”]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Deterministic Dictation Text Evaluator
 * Compares expected transcript vs submitted text using token alignment.
 */
export function evaluateDictation(expectedText: string, submittedText: string): DictationResult {
  const normExpected = normalizeListeningText(expectedText);
  const normSubmitted = normalizeListeningText(submittedText);

  const expWords = normExpected.length > 0 ? normExpected.split(' ') : [];
  const subWords = normSubmitted.length > 0 ? normSubmitted.split(' ') : [];

  const tokens: WordComparisonToken[] = [];
  const correctWords: string[] = [];
  const incorrectWords: string[] = [];
  const missingWords: string[] = [];
  const extraWords: string[] = [];

  let expIdx = 0;
  let subIdx = 0;

  while (expIdx < expWords.length || subIdx < subWords.length) {
    const currentExp = expWords[expIdx];
    const currentSub = subWords[subIdx];

    if (currentExp !== undefined && currentSub !== undefined) {
      if (currentExp === currentSub) {
        // Direct match
        tokens.push({ word: currentExp, status: 'correct', expectedWord: currentExp, submittedWord: currentSub });
        correctWords.push(currentExp);
        expIdx++;
        subIdx++;
      } else {
        // Check if the expected word appears slightly later in submission (extra word typed)
        const nextSubMatch = subWords.indexOf(currentExp, subIdx + 1);
        // Check if the submitted word appears later in expected (missing word in submission)
        const nextExpMatch = expWords.indexOf(currentSub, expIdx + 1);

        if (nextSubMatch !== -1 && (nextExpMatch === -1 || (nextSubMatch - subIdx) <= (nextExpMatch - expIdx))) {
          // Extra word in submission
          tokens.push({ word: currentSub, status: 'extra', submittedWord: currentSub });
          extraWords.push(currentSub);
          subIdx++;
        } else if (nextExpMatch !== -1) {
          // Missing word in submission
          tokens.push({ word: currentExp, status: 'missing', expectedWord: currentExp });
          missingWords.push(currentExp);
          expIdx++;
        } else {
          // Substituted / incorrect word
          tokens.push({ word: currentSub, status: 'incorrect', expectedWord: currentExp, submittedWord: currentSub });
          incorrectWords.push(currentSub);
          expIdx++;
          subIdx++;
        }
      }
    } else if (expIdx < expWords.length) {
      // Remaining expected words are missing
      const word = expWords[expIdx];
      tokens.push({ word, status: 'missing', expectedWord: word });
      missingWords.push(word);
      expIdx++;
    } else if (subIdx < subWords.length) {
      // Remaining submitted words are extra
      const word = subWords[subIdx];
      tokens.push({ word, status: 'extra', submittedWord: word });
      extraWords.push(word);
      subIdx++;
    }
  }

  const totalExpected = expWords.length;
  const accuracy = totalExpected > 0
    ? Math.max(0, Math.min(100, Math.round(((correctWords.length - extraWords.length * 0.5) / totalExpected) * 100)))
    : 0;

  const mistakes = incorrectWords.length + missingWords.length + extraWords.length;
  const completed = accuracy >= 70;
  // Base XP: 15 for >=90%, 10 for >=70%, 5 for attempts
  const xpEarned = accuracy >= 90 ? 15 : accuracy >= 70 ? 10 : 5;

  return {
    expectedText,
    submittedText,
    normalizedExpected: normExpected,
    normalizedSubmitted: normSubmitted,
    accuracy,
    mistakes,
    tokens,
    correctWords,
    incorrectWords,
    missingWords,
    extraWords,
    completed,
    xpEarned,
  };
}

/**
 * Calculates Levenshtein distance between two strings
 */
export function calculateLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Deterministic Speech Similarity Matcher for Shadowing
 * Computes a transparent "Transcript Match" score based on normalized Levenshtein distance.
 */
export function calculateSpeechSimilarity(transcript: string, recognizedText: string): ShadowingResult {
  const normTarget = normalizeListeningText(transcript);
  const normRecognized = normalizeListeningText(recognizedText);

  if (!normTarget || !normRecognized) {
    return {
      transcript,
      recognizedText,
      similarity: 0,
      matchRating: 'poor',
      completed: false,
      xpEarned: 0,
    };
  }

  const maxLen = Math.max(normTarget.length, normRecognized.length);
  const distance = calculateLevenshteinDistance(normTarget, normRecognized);
  const similarity = maxLen > 0 ? Math.max(0, Math.round((1 - distance / maxLen) * 100)) : 0;

  let matchRating: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
  if (similarity >= 90) matchRating = 'excellent';
  else if (similarity >= 75) matchRating = 'good';
  else if (similarity >= 50) matchRating = 'fair';

  const completed = similarity >= 60;
  const xpEarned = similarity >= 90 ? 20 : similarity >= 75 ? 15 : similarity >= 50 ? 8 : 3;

  return {
    transcript,
    recognizedText,
    similarity,
    matchRating,
    completed,
    xpEarned,
  };
}

// ============================================================================
// 8. SMART VOCABULARY LAB DOMAIN MODELS & ALGORITHMS
// ============================================================================

export type VocabularyPartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'preposition'
  | 'conjunction'
  | 'interjection'
  | 'idiom';

export interface VocabularyExample {
  sentence: string;
  translation: string;
  context?: string;
}

export interface VocabularyWord {
  id: string;
  targetText: string;
  normalizedText: string;
  translation: string;
  phoneticUs?: string;
  phoneticUk?: string;
  partOfSpeech: VocabularyPartOfSpeech | string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | string;
  category: string;
  definitionEn?: string;
  examples: VocabularyExample[];
  synonyms?: string[];
  antonyms?: string[];
  imageUrl?: string;
  audioUrlUs?: string;
  audioUrlUk?: string;
  source?: 'curriculum' | 'listening' | 'custom' | 'dictionary';
  tags?: string[];
}

export interface VocabularyFolder {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserVocabularyItem {
  id: string;
  userId: string;
  wordId: string;
  folderIds: string[];
  isSaved: boolean;
  savedAt: string;
  lastReviewedAt?: string;
  reviewCount: number;
  masteryLevel: number; // 0 to 100
  notes?: string;
  word?: VocabularyWord;
}

export type VocabularyReviewMode =
  | 'meaning_choice'
  | 'cloze'
  | 'listening_spelling'
  | 'recognition';

export interface VocabularyPracticeQuestion {
  id: string;
  wordId: string;
  mode: VocabularyReviewMode;
  prompt: string;
  subPrompt?: string;
  targetWord: string;
  options?: string[];
  correctAnswer: string;
  clozeSentence?: string;
  audioText?: string;
  explanation?: string;
  cefrLevel?: string;
}

export interface VocabularyPracticeAnswer {
  questionId: string;
  wordId: string;
  userAnswer: string;
  isCorrect?: boolean;
  responseTimeSeconds?: number;
  hintUsed?: boolean;
}

export interface EvaluatedQuestionResult {
  questionId: string;
  wordId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  targetWord: string;
  mode: VocabularyReviewMode;
  sm2Quality: number; // 0 - 5 rating for SM-2
}

export interface VocabularyPracticeResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number; // 0 - 100
  score: number;
  xpEarned: number;
  evaluatedQuestions: EvaluatedQuestionResult[];
  missedWords: string[];
  masteredWords: string[];
}

/**
 * Searches vocabulary words with exact, partial, translation, and tag matching.
 * Deterministic and case-insensitive.
 */
export function searchVocabularyWords(
  words: VocabularyWord[],
  query: string = '',
  filters?: {
    cefrLevel?: string;
    category?: string;
    partOfSpeech?: string;
  }
): VocabularyWord[] {
  const normQuery = query.trim().toLowerCase();

  return words.filter((w) => {
    // 1. CEFR Level filter
    if (filters?.cefrLevel && filters.cefrLevel !== 'all') {
      if (w.cefrLevel.toLowerCase() !== filters.cefrLevel.toLowerCase()) {
        return false;
      }
    }

    // 2. Category filter
    if (filters?.category && filters.category !== 'all') {
      if (w.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    // 3. Part of Speech filter
    if (filters?.partOfSpeech && filters.partOfSpeech !== 'all') {
      if (w.partOfSpeech.toLowerCase() !== filters.partOfSpeech.toLowerCase()) {
        return false;
      }
    }

    // 4. Search Query matching
    if (!normQuery) return true;

    const normTarget = w.targetText.toLowerCase();
    const normTrans = w.translation.toLowerCase();
    const matchesTarget = normTarget.includes(normQuery);
    const matchesTrans = normTrans.includes(normQuery);
    const matchesTags = w.tags?.some((t) => t.toLowerCase().includes(normQuery)) ?? false;
    const matchesExample = w.examples.some(
      (ex) =>
        ex.sentence.toLowerCase().includes(normQuery) ||
        ex.translation.toLowerCase().includes(normQuery)
    );

    return matchesTarget || matchesTrans || matchesTags || matchesExample;
  });
}

/**
 * Maps practice answer correctness, response time, and hint status into an SM-2 Quality rating (0 to 5)
 */
export function mapPracticeQualityToSM2(
  isCorrect: boolean,
  responseTimeSeconds: number = 5,
  hintUsed: boolean = false
): number {
  if (!isCorrect) {
    return 1; // Incorrect response
  }
  if (hintUsed) {
    return 3; // Correct with difficulty / hint
  }
  if (responseTimeSeconds <= 3) {
    return 5; // Perfect response, instant recall
  }
  if (responseTimeSeconds <= 8) {
    return 4; // Correct response after a hesitation
  }
  return 3; // Correct response with serious difficulty
}

/**
 * Pure evaluator for Vocabulary Practice session
 */
export function evaluateVocabularyPractice(
  questions: VocabularyPracticeQuestion[],
  answers: VocabularyPracticeAnswer[]
): VocabularyPracticeResult {
  const evaluatedQuestions: EvaluatedQuestionResult[] = [];
  const missedWords: string[] = [];
  const masteredWords: string[] = [];

  let correctCount = 0;

  questions.forEach((q) => {
    const userAns = answers.find((a) => a.questionId === q.id);
    const submitted = (userAns?.userAnswer || '').trim().toLowerCase();
    const expected = q.correctAnswer.trim().toLowerCase();

    const isCorrect = submitted === expected;
    if (isCorrect) {
      correctCount++;
      masteredWords.push(q.targetWord);
    } else {
      missedWords.push(q.targetWord);
    }

    const sm2Quality = mapPracticeQualityToSM2(
      isCorrect,
      userAns?.responseTimeSeconds || 5,
      userAns?.hintUsed || false
    );

    evaluatedQuestions.push({
      questionId: q.id,
      wordId: q.wordId,
      userAnswer: userAns?.userAnswer || '',
      correctAnswer: q.correctAnswer,
      isCorrect,
      targetWord: q.targetWord,
      mode: q.mode,
      sm2Quality,
    });
  });

  const totalQuestions = questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const score = correctCount * 20;
  const xpEarned = Math.max(5, Math.round(correctCount * 5 + (accuracy === 100 ? 15 : 0)));

  return {
    totalQuestions,
    correctCount,
    incorrectCount: totalQuestions - correctCount,
    accuracy,
    score,
    xpEarned,
    evaluatedQuestions,
    missedWords: [...new Set(missedWords)],
    masteredWords: [...new Set(masteredWords)],
  };
}

// ============================================================================
// 9. WRITING LAB DOMAIN MODELS & ALGORITHMS
// ============================================================================

export type WritingDifficulty = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type WritingMode = 'see-write' | 'guided' | 'free';
export type CorrectionCategory = 'grammar' | 'spelling' | 'vocabulary' | 'punctuation' | 'naturalness';

export interface GuidedWritingStep {
  stepNumber: number;
  question: string;
  hint?: string;
  samplePhrase?: string;
}

export interface WritingPrompt {
  id: string;
  mode: WritingMode;
  difficulty: WritingDifficulty;
  title: string;
  instruction: string;
  imageHint?: string;
  scenario?: string;
  targetWords?: string[];
  targetGrammar?: string;
  sampleAnswer?: string;
  vocabularyIds?: string[];
  category: string;
  guidedSteps?: GuidedWritingStep[];
  minWords?: number;
  maxWords?: number;
}

export interface WritingSubmission {
  promptId: string;
  mode: WritingMode;
  content: string;
  durationMs?: number;
  usedHint?: boolean;
  targetWordCount?: number;
  submittedAt?: string;
}

export interface WritingCorrection {
  original: string;
  corrected: string;
  explanation: string;
  category: CorrectionCategory;
}

export interface WritingVocabularySuggestion {
  word: string;
  meaning: string;
  reason: string;
  difficulty: WritingDifficulty;
  vocabularyId?: string;
}

export type WritingGrade =
  | 'Excellent'
  | 'Very Good'
  | 'Good'
  | 'Needs Practice'
  | 'Keep Practicing';

export interface WritingFeedback {
  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  naturalnessScore: number;
  relevanceScore: number;
  completenessScore: number;
  grade: WritingGrade;
  corrections: WritingCorrection[];
  strengths: string[];
  suggestions: string[];
  vocabularySuggestions: WritingVocabularySuggestion[];
}

export interface WritingResult {
  promptId: string;
  mode: WritingMode;
  content: string;
  wordCount: number;
  score: number;
  xpAwarded: number;
  feedback: WritingFeedback;
  corrections: WritingCorrection[];
  vocabularySuggestions: WritingVocabularySuggestion[];
}

/**
 * Calculates weighted writing score:
 * Grammar: 30%, Vocabulary: 25%, Naturalness: 20%, Relevance: 15%, Completeness: 10%
 */
export function calculateWritingScore(scores: {
  grammar: number;
  vocabulary: number;
  naturalness: number;
  relevance: number;
  completeness: number;
}): number {
  const weighted =
    scores.grammar * 0.3 +
    scores.vocabulary * 0.25 +
    scores.naturalness * 0.2 +
    scores.relevance * 0.15 +
    scores.completeness * 0.1;

  return Math.min(100, Math.max(0, Math.round(weighted)));
}

/**
 * Maps numeric score to standard pedagogical grade
 */
export function getWritingGrade(score: number): WritingGrade {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Practice';
  return 'Keep Practicing';
}

/**
 * Calculates XP reward for a writing submission:
 * Base: 10 XP, +5 for score >= 60, +10 for score >= 80, +15 for score >= 90
 */
export function calculateWritingXP(score: number, wordCount: number, usedHint: boolean = false): number {
  if (wordCount < 3) return 2; // Minimal attempt

  let xp = 10;
  if (score >= 90) xp += 15;
  else if (score >= 80) xp += 10;
  else if (score >= 60) xp += 5;

  if (wordCount >= 50) xp += 5; // Long form bonus
  if (usedHint) xp = Math.max(5, xp - 3);

  return xp;
}

/**
 * Maps writing performance score into an SM-2 Quality rating (0 to 5)
 */
export function mapWritingPerformanceToSRSQuality(score: number): number {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  if (score >= 20) return 1;
  return 0;
}

/**
 * Deterministic domain evaluator for writing submissions
 */
export function evaluateWritingSubmission(
  submission: WritingSubmission,
  prompt?: WritingPrompt
): WritingResult {
  const content = (submission.content || '').trim();
  const words = content.length > 0 ? content.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  if (wordCount === 0) {
    return {
      promptId: submission.promptId,
      mode: submission.mode,
      content: '',
      wordCount: 0,
      score: 0,
      xpAwarded: 0,
      feedback: {
        overallScore: 0,
        grammarScore: 0,
        vocabularyScore: 0,
        naturalnessScore: 0,
        relevanceScore: 0,
        completenessScore: 0,
        grade: 'Keep Practicing',
        corrections: [],
        strengths: [],
        suggestions: ['Hãy viết ít nhất một câu hoàn chỉnh để nhận phản hồi chi tiết.'],
        vocabularySuggestions: [],
      },
      corrections: [],
      vocabularySuggestions: [],
    };
  }

  // 1. Grammar & Punctuation heuristics
  const corrections: WritingCorrection[] = [];
  let grammarScore = 90;

  // Capitalization check on first character
  if (content.length > 0 && content[0] !== content[0].toUpperCase() && /^[a-z]/.test(content)) {
    corrections.push({
      original: content.substring(0, 10) + '...',
      corrected: content[0].toUpperCase() + content.substring(1, 10) + '...',
      explanation: 'Câu tiếng Anh luôn bắt đầu bằng chữ cái viết hoa.',
      category: 'punctuation',
    });
    grammarScore -= 10;
  }

  // End punctuation check
  if (!/[.!?]$/.test(content)) {
    corrections.push({
      original: content.slice(-10),
      corrected: content.slice(-10) + '.',
      explanation: 'Hãy thêm dấu chấm câu (. ! ?) ở cuối câu để hoàn thiện ngữ pháp.',
      category: 'punctuation',
    });
    grammarScore -= 8;
  }

  // Common grammar patterns: "I goes", "he go", "they is", "a apple", "an car"
  const grammarRules: { pattern: RegExp; correction: string; explanation: string; category: CorrectionCategory }[] = [
    { pattern: /\b(i|you|we|they)\s+goes\b/i, correction: '$1 go', explanation: 'Chủ ngữ I/You/We/They đi với động từ nguyên mẫu "go".', category: 'grammar' },
    { pattern: /\b(he|she|it)\s+go\b/i, correction: '$1 goes', explanation: 'Chủ ngữ ngôi thứ 3 số ít (He/She/It) chia động từ "goes".', category: 'grammar' },
    { pattern: /\b(they|we|you)\s+is\b/i, correction: '$1 are', explanation: 'Chủ ngữ số nhiều đi với to-be "are".', category: 'grammar' },
    { pattern: /\b(he|she|it)\s+are\b/i, correction: '$1 is', explanation: 'Chủ ngữ ngôi thứ 3 số ít đi với to-be "is".', category: 'grammar' },
    { pattern: /\ba\s+([aeiou]\w+)/i, correction: 'an $1', explanation: 'Dùng mạo từ "an" trước danh từ bắt đầu bằng nguyên âm.', category: 'grammar' },
    { pattern: /\ban\s+([^aeiou\s]\w+)/i, correction: 'a $1', explanation: 'Dùng mạo từ "a" trước danh từ bắt đầu bằng phụ âm.', category: 'grammar' },
    { pattern: /\byesterday\s+i\s+(\w+ed)?(\s+\w+)*\s+go\b/i, correction: 'went', explanation: 'Hành động xảy ra trong quá khứ (yesterday) cần dùng thì quá khứ đơn "went".', category: 'grammar' },
  ];

  grammarRules.forEach((rule) => {
    const match = content.match(rule.pattern);
    if (match) {
      corrections.push({
        original: match[0],
        corrected: match[0].replace(rule.pattern, rule.correction),
        explanation: rule.explanation,
        category: rule.category,
      });
      grammarScore -= 12;
    }
  });

  grammarScore = Math.max(30, Math.min(100, grammarScore));

  // 2. Vocabulary Richness (Type-Token Ratio)
  const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const uniqueWords = new Set(lowerWords);
  const ttr = wordCount > 0 ? uniqueWords.size / wordCount : 1;
  let vocabularyScore = Math.round(Math.min(100, Math.max(40, ttr * 110)));

  // 3. Completeness & Length
  const minTarget = prompt?.minWords || (submission.mode === 'see-write' ? 8 : submission.mode === 'guided' ? 20 : 30);
  const completenessScore = Math.min(100, Math.round((wordCount / minTarget) * 100));

  // 4. Relevance & Target Words check
  let relevanceScore = 85;
  if (prompt?.targetWords && prompt.targetWords.length > 0) {
    const usedCount = prompt.targetWords.filter((tw) =>
      lowerWords.includes(tw.toLowerCase())
    ).length;
    const targetUsageRatio = usedCount / prompt.targetWords.length;
    relevanceScore = Math.round(60 + targetUsageRatio * 40);
  }

  // 5. Naturalness
  const naturalnessScore = Math.round((grammarScore * 0.5 + vocabularyScore * 0.5));

  // Overall Score & Grade
  const overallScore = calculateWritingScore({
    grammar: grammarScore,
    vocabulary: vocabularyScore,
    naturalness: naturalnessScore,
    relevance: relevanceScore,
    completeness: completenessScore,
  });

  const grade = getWritingGrade(overallScore);
  const xpAwarded = calculateWritingXP(overallScore, wordCount, submission.usedHint);

  // Vocabulary Suggestions for Enhancement
  const vocabularySuggestions: WritingVocabularySuggestion[] = [];
  const upgradeMap: Record<string, { upgrade: string; meaning: string; reason: string; difficulty: WritingDifficulty }> = {
    good: { upgrade: 'beneficial', meaning: 'Có lợi, mang lại giá trị', reason: 'Nâng cao tính học thuật thay cho từ thông dụng "good".', difficulty: 'B1' },
    bad: { upgrade: 'detrimental', meaning: 'Gây hại, bất lợi', reason: 'Diễn đạt chính xác mức độ tác động tiêu cực.', difficulty: 'B2' },
    nice: { upgrade: 'delightful', meaning: 'Thú vị, làm say mê', reason: 'Tạo cảm xúc sinh động và giàu hình ảnh hơn.', difficulty: 'B1' },
    very: { upgrade: 'extremely', meaning: 'Vô cùng, cực kỳ', reason: 'Tránh lặp từ "very" và tăng tính tự nhiên cho câu.', difficulty: 'A2' },
    happy: { upgrade: 'thrilled', meaning: 'Vô cùng phấn khích, hạnh phúc', reason: 'Mô tả trạng thái cảm xúc mạnh mẽ và bản ngữ hơn.', difficulty: 'B1' },
    important: { upgrade: 'crucial', meaning: 'Cốt yếu, mang tính quyết định', reason: 'Nhấn mạnh tầm quan trọng một cách chuyên nghiệp.', difficulty: 'B2' },
  };

  lowerWords.forEach((w) => {
    if (upgradeMap[w] && !vocabularySuggestions.some((s) => s.word === upgradeMap[w].upgrade)) {
      vocabularySuggestions.push({
        word: upgradeMap[w].upgrade,
        meaning: upgradeMap[w].meaning,
        reason: upgradeMap[w].reason,
        difficulty: upgradeMap[w].difficulty,
        vocabularyId: `vocab-${upgradeMap[w].upgrade.toLowerCase()}`,
      });
    }
  });

  // Strengths & Suggestions
  const strengths: string[] = [];
  const suggestions: string[] = [];

  if (grammarScore >= 80) strengths.push('Cấu trúc câu rõ ràng, ngữ pháp chuẩn mực.');
  if (vocabularyScore >= 75) strengths.push('Sử dụng vốn từ vựng phong phú, ít lặp từ.');
  if (relevanceScore >= 85) strengths.push('Bám sát chủ đề và vận dụng tốt các từ khóa trọng tâm.');

  if (corrections.length > 0) {
    suggestions.push(`Cần chú ý ${corrections.length} điểm ngữ pháp / dấu câu được gợi ý bên dưới.`);
  }
  if (wordCount < minTarget) {
    suggestions.push(`Hãy mở rộng thêm chi tiết để đạt mục tiêu ${minTarget} từ.`);
  }
  if (vocabularySuggestions.length > 0) {
    suggestions.push('Tham khảo các từ vựng nâng cao bên dưới để bài viết tự nhiên hơn.');
  }

  return {
    promptId: submission.promptId,
    mode: submission.mode,
    content,
    wordCount,
    score: overallScore,
    xpAwarded,
    feedback: {
      overallScore,
      grammarScore,
      vocabularyScore,
      naturalnessScore,
      relevanceScore,
      completenessScore,
      grade,
      corrections,
      strengths: strengths.length > 0 ? strengths : ['Đã hoàn thành bài viết với nỗ lực tích cực!'],
      suggestions: suggestions.length > 0 ? suggestions : ['Bài viết rất tốt! Tiếp tục phát huy.'],
      vocabularySuggestions,
    },
    corrections,
    vocabularySuggestions,
  };
}

// ============================================================================
// 10. READING LAB DOMAIN MODELS & ALGORITHMS
// ============================================================================

export type ReadingDifficulty = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type ReadingMode = 'guided' | 'standard' | 'challenge';
export type ReadingQuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'main-idea'
  | 'detail'
  | 'vocabulary-context'
  | 'inference';

export interface ReadingParagraph {
  id: string;
  order: number;
  english: string;
  vietnamese: string;
  audioUrl?: string;
  vocabularyIds?: string[];
}

export interface ReadingQuestion {
  id: string;
  type: ReadingQuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  relatedParagraph?: number;
  difficulty: ReadingDifficulty;
}

export interface ReadingArticle {
  id: string;
  title: string;
  subtitle: string;
  level: ReadingDifficulty;
  topic: string;
  author: string;
  estimatedMinutes: number;
  wordCount: number;
  coverImage?: string;
  paragraphs: ReadingParagraph[];
  vocabularyIds: string[];
  questions: ReadingQuestion[];
}

export interface ReadingAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect?: boolean;
}

export interface ReadingAttempt {
  id: string;
  userId: string;
  articleId: string;
  mode: ReadingMode;
  startedAt: string;
  completedAt: string;
  elapsedSeconds: number;
  answers: ReadingAnswer[];
  score: number;
  wpm: number;
  xpAwarded: number;
  vocabularyLearned: string[];
  accuracy: number;
}

export interface ReadingAnswerFeedback {
  questionId: string;
  type: ReadingQuestionType;
  question: string;
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  relatedParagraph?: number;
}

export interface ReadingFeedback {
  score: number;
  grade: string;
  wpm: number;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  xpAwarded: number;
  answersFeedback: ReadingAnswerFeedback[];
  vocabularyLearned: string[];
}

export interface ReadingStats {
  articlesCompleted: number;
  readingMinutes: number;
  avgComprehension: number;
  wordsLearned: number;
  readingStreakDays: number;
}

/**
 * Tokenizes reading text into clickable words and punctuation tokens.
 * Handles apostrophes (e.g. isn't, don't, learner's), hyphens (e.g. state-of-the-art), and Unicode characters.
 */
export function tokenizeReadingText(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  // Unicode-aware regex matching all international/Vietnamese letters, apostrophes, hyphens, and punctuation
  const tokenRegex = /[\p{L}\p{N}'’]+(?:-[\p{L}\p{N}'’]+)*|[^\s\p{L}\p{N}'’-]+/gu;
  const tokens: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    tokens.push(match[0]);
  }

  return tokens;
}

/**
 * Calculates Reading Speed in Words Per Minute (WPM)
 */
export function calculateReadingWPM(wordCount: number, elapsedSeconds: number): number {
  if (wordCount <= 0 || elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(wordCount / minutes);
}

/**
 * Calculates Reading Score based on comprehension accuracy (70%), engagement/completion (20%), and vocabulary (10%)
 */
export function calculateReadingScore(
  correctCount: number,
  totalQuestions: number,
  wordCount: number = 100,
  completionRatio: number = 1.0
): number {
  if (totalQuestions <= 0) return 0;

  const accuracy = correctCount / totalQuestions;
  const accuracyScore = accuracy * 70;
  const completionScore = Math.min(1.0, Math.max(0, completionRatio)) * 20;
  const vocabBonus = Math.min(10, Math.round((wordCount / 50) * 2));

  return Math.min(100, Math.max(0, Math.round(accuracyScore + completionScore + vocabBonus)));
}

/**
 * Maps numeric score to standard pedagogical grade
 */
export function getReadingGrade(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Needs Practice';
  return 'Keep Practicing';
}

/**
 * Calculates XP reward for a reading session based on level, score, mode, and vocabulary
 */
export function calculateReadingXP(
  level: ReadingDifficulty,
  score: number,
  mode: ReadingMode = 'standard',
  wordsLearnedCount: number = 0
): number {
  const baseXPMap: Record<ReadingDifficulty, number> = {
    A1: 15,
    A2: 20,
    B1: 25,
    B2: 30,
    C1: 40,
  };

  let xp = baseXPMap[level] || 20;

  // Score bonuses
  if (score >= 90) xp += 15;
  else if (score >= 80) xp += 10;
  else if (score >= 70) xp += 5;

  // Mode bonus
  if (mode === 'challenge') xp += 10;

  // Words learned bonus (2 XP per new word, max 10 XP)
  xp += Math.min(10, wordsLearnedCount * 2);

  return xp;
}

/**
 * Evaluates a single reading question answer
 */
export function evaluateReadingAnswer(question: ReadingQuestion, selectedOption: string): boolean {
  if (!question || !selectedOption) return false;
  return question.correctAnswer.trim().toLowerCase() === selectedOption.trim().toLowerCase();
}

/**
 * Evaluates a full reading attempt and generates detailed answer feedback
 */
export function evaluateReadingAttempt(
  article: ReadingArticle,
  answers: { questionId: string; selectedOption: string }[],
  elapsedSeconds: number,
  mode: ReadingMode = 'standard'
): ReadingFeedback {
  const totalQuestions = article.questions.length;
  let correctCount = 0;
  const answersFeedback: ReadingAnswerFeedback[] = [];

  article.questions.forEach((q) => {
    const userAnswer = answers.find((a) => a.questionId === q.id);
    const selectedOption = userAnswer ? userAnswer.selectedOption : '';
    const isCorrect = evaluateReadingAnswer(q, selectedOption);

    if (isCorrect) {
      correctCount++;
    }

    answersFeedback.push({
      questionId: q.id,
      type: q.type,
      question: q.question,
      selectedOption,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      relatedParagraph: q.relatedParagraph,
    });
  });

  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const wpm = calculateReadingWPM(article.wordCount, elapsedSeconds);
  const score = calculateReadingScore(correctCount, totalQuestions, article.wordCount, 1.0);
  const grade = getReadingGrade(score);
  const vocabularyLearned = article.vocabularyIds || [];
  const xpAwarded = calculateReadingXP(article.level, score, mode, vocabularyLearned.length);

  return {
    score,
    grade,
    wpm,
    correctCount,
    totalQuestions,
    accuracy,
    xpAwarded,
    answersFeedback,
    vocabularyLearned,
  };
}

/**
 * Maps reading practice performance to an SM-2 Quality rating (0 to 5)
 */
export function mapReadingPerformanceToSRSQuality(
  isCorrect: boolean,
  responseTimeMs: number = 3000,
  usedHint: boolean = false
): number {
  if (!isCorrect) return 1;
  if (usedHint) return 3;
  if (responseTimeMs < 4000) return 5;
  return 4;
}

// ============================================================================
// 11. EXAM PRACTICE LAB DOMAIN MODELS & ALGORITHMS
// ============================================================================

export type ExamType = 'toeic' | 'ielts' | 'vstep' | 'hsk' | 'jlpt' | 'topik' | 'dsat';
export type ExamDifficulty = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type ExamSectionType = 'listening' | 'reading' | 'speaking' | 'writing' | 'language' | 'math';
export type ExamQuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'matching'
  | 'fill-blank'
  | 'reading-comprehension'
  | 'listening-comprehension';

export type ExamStatus = 'not-started' | 'in-progress' | 'submitted' | 'expired' | 'completed';

export interface ExamQuestion {
  id: string;
  sectionId: string;
  type: ExamQuestionType;
  prompt: string;
  passage?: string;
  audioUrl?: string;
  audioText?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: ExamDifficulty;
  tags?: string[];
  vocabularyIds?: string[];
  points?: number;
}

export type PublicExamQuestion = Omit<ExamQuestion, 'correctAnswer' | 'explanation'>;

export interface ExamSection {
  id: string;
  title: string;
  type: ExamSectionType;
  durationMinutes: number;
  questions: ExamQuestion[];
  passage?: string;
  audioUrl?: string;
  audioText?: string;
}

export interface PublicExamSection {
  id: string;
  title: string;
  type: ExamSectionType;
  durationMinutes: number;
  questions: PublicExamQuestion[];
  passage?: string;
  audioUrl?: string;
  audioText?: string;
}

export interface Exam {
  id: string;
  title: string;
  subtitle: string;
  type: ExamType;
  difficulty: ExamDifficulty;
  durationMinutes: number;
  sections: ExamSection[];
  totalQuestions: number;
  maxScore?: number;
  tags: string[];
  isOfficialMock?: boolean;
  coverImage?: string;
}

export interface PublicExam {
  id: string;
  title: string;
  subtitle: string;
  type: ExamType;
  difficulty: ExamDifficulty;
  durationMinutes: number;
  sections: PublicExamSection[];
  totalQuestions: number;
  maxScore?: number;
  tags: string[];
  isOfficialMock?: boolean;
  coverImage?: string;
}

export interface ExamAnswer {
  questionId: string;
  selectedOption: string;
  flagged?: boolean;
  answeredAt?: string;
}

export interface ExamQuestionResult {
  questionId: string;
  sectionId: string;
  type: ExamQuestionType;
  prompt: string;
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
  isUnanswered: boolean;
  explanation: string;
  vocabularyIds: string[];
  pointsAwarded: number;
}

export interface ExamSectionResult {
  sectionId: string;
  title: string;
  type: ExamSectionType;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  score: number;
  accuracy: number;
}

export interface ExamWeakness {
  category: string;
  errorCount: number;
  totalCount: number;
  accuracy: number;
  recommendation: string;
}

export interface ExamResult {
  attemptId: string;
  examId: string;
  userId: string;
  score: number;
  maxScore: number;
  scaledScore?: number;
  scaledScoreLabel?: string;
  accuracy: number;
  completionRate: number;
  grade: string;
  elapsedSeconds: number;
  remainingSeconds: number;
  sectionResults: ExamSectionResult[];
  questionResults: ExamQuestionResult[];
  weaknesses: ExamWeakness[];
  weakVocabularyIds: string[];
  xpAwarded: number;
  submittedAt: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  status: ExamStatus;
  startedAt: string;
  expiresAt: string;
  submittedAt?: string;
  elapsedSeconds: number;
  answers: ExamAnswer[];
  result?: ExamResult;
}

export interface ExamAnalytics {
  totalAttempts: number;
  avgScore: number;
  bestScore: number;
  avgAccuracy: number;
  totalStudyMinutes: number;
  strongestSection: string;
  weakestSection: string;
  scoreHistory: { date: string; score: number; examTitle: string }[];
}

/**
 * Creates a brand new Exam Attempt instance with authoritative expiry window
 */
export function createExamAttempt(
  examId: string,
  userId: string,
  durationMinutes: number
): ExamAttempt {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (durationMinutes + 1) * 60 * 1000); // 1-minute grace period

  return {
    id: `att-exam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    examId,
    userId,
    status: 'in-progress',
    startedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    elapsedSeconds: 0,
    answers: [],
  };
}

/**
 * Sanitizes an authoritative Exam by stripping correctAnswer & explanation (Anti-cheat boundary)
 */
export function sanitizePublicExam(exam: Exam): PublicExam {
  return {
    id: exam.id,
    title: exam.title,
    subtitle: exam.subtitle,
    type: exam.type,
    difficulty: exam.difficulty,
    durationMinutes: exam.durationMinutes,
    totalQuestions: exam.totalQuestions,
    maxScore: exam.maxScore,
    tags: exam.tags,
    isOfficialMock: exam.isOfficialMock,
    coverImage: exam.coverImage,
    sections: exam.sections.map((sec) => ({
      id: sec.id,
      title: sec.title,
      type: sec.type,
      durationMinutes: sec.durationMinutes,
      passage: sec.passage,
      audioUrl: sec.audioUrl,
      questions: sec.questions.map((q) => ({
        id: q.id,
        sectionId: q.sectionId,
        type: q.type,
        prompt: q.prompt,
        passage: q.passage,
        audioUrl: q.audioUrl,
        audioText: q.audioText,
        options: q.options,
        difficulty: q.difficulty,
        tags: q.tags,
        vocabularyIds: q.vocabularyIds,
        points: q.points,
      })),
    })),
  };
}

/**
 * Evaluates individual question answer
 */
export function calculateQuestionScore(
  question: ExamQuestion,
  selectedOption?: string
): { isCorrect: boolean; isUnanswered: boolean; points: number } {
  if (!selectedOption || selectedOption.trim() === '') {
    return { isCorrect: false, isUnanswered: true, points: 0 };
  }

  const isCorrect = question.correctAnswer.trim().toLowerCase() === selectedOption.trim().toLowerCase();
  const maxPoints = question.points || 1;

  return {
    isCorrect,
    isUnanswered: false,
    points: isCorrect ? maxPoints : 0,
  };
}

/**
 * Calculates Accuracy Percentage (0 - 100)
 */
export function calculateExamAccuracy(correctCount: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0;
  return Math.round((correctCount / totalQuestions) * 100);
}

/**
 * Maps numeric score to standard pedagogical grade
 */
export function calculateExamGrade(scorePercentage: number): string {
  if (scorePercentage >= 90) return 'Excellent';
  if (scorePercentage >= 80) return 'Very Good';
  if (scorePercentage >= 70) return 'Good';
  if (scorePercentage >= 60) return 'Needs Practice';
  return 'Keep Practicing';
}

/**
 * Calculates XP reward for exam attempt based on exam type, level, accuracy, and first-attempt bonus
 */
export function calculateExamXP(
  type: ExamType,
  difficulty: ExamDifficulty,
  scorePercentage: number,
  isFirstAttempt: boolean = true
): number {
  const baseXPMap: Record<ExamType, number> = {
    toeic: 40,
    ielts: 50,
    vstep: 45,
    hsk: 40,
    jlpt: 40,
    topik: 40,
    dsat: 50,
  };

  let xp = baseXPMap[type] || 40;

  // Difficulty bonus
  const diffBonusMap: Record<ExamDifficulty, number> = {
    A1: 0,
    A2: 5,
    B1: 10,
    B2: 15,
    C1: 25,
    C2: 35,
  };
  xp += diffBonusMap[difficulty] !== undefined ? diffBonusMap[difficulty] : 10;

  // Performance score bonus
  if (scorePercentage >= 90) xp += 30;
  else if (scorePercentage >= 80) xp += 20;
  else if (scorePercentage >= 70) xp += 10;

  // First-attempt completion bonus
  if (isFirstAttempt) xp += 15;

  return xp;
}

/**
 * Calculates scaled score approximations according to international exam standards
 */
export function calculateScaledScore(
  type: ExamType,
  correctCount: number,
  totalQuestions: number
): { scaledScore: number; label: string } {
  if (totalQuestions <= 0) return { scaledScore: 0, label: '0' };
  const ratio = Math.min(1, Math.max(0, correctCount / totalQuestions));

  switch (type) {
    case 'toeic': {
      // TOEIC scale 10 - 990 points (approximate linear mapping with rounded increments of 5)
      const score = Math.round((ratio * 980 + 10) / 5) * 5;
      return { scaledScore: score, label: `${score} / 990` };
    }
    case 'ielts': {
      // IELTS Band 0 - 9.0 (0.5 increments)
      let band = 0;
      if (ratio >= 0.9) band = 8.5;
      else if (ratio >= 0.82) band = 8.0;
      else if (ratio >= 0.75) band = 7.5;
      else if (ratio >= 0.67) band = 7.0;
      else if (ratio >= 0.58) band = 6.5;
      else if (ratio >= 0.5) band = 6.0;
      else if (ratio >= 0.42) band = 5.5;
      else if (ratio >= 0.33) band = 5.0;
      else if (ratio >= 0.25) band = 4.5;
      else band = 4.0;
      return { scaledScore: band, label: `Band ${band.toFixed(1)}` };
    }
    case 'vstep': {
      // VSTEP scale 0 - 10.0 (B1: 4.0-5.5, B2: 6.0-8.0, C1: 8.5-10.0)
      const vstep = Math.round(ratio * 100) / 10;
      let level = 'A2/Dưới B1';
      if (vstep >= 8.5) level = 'C1';
      else if (vstep >= 6.0) level = 'B2';
      else if (vstep >= 4.0) level = 'B1';
      return { scaledScore: vstep, label: `${vstep.toFixed(1)}/10 (${level})` };
    }
    case 'dsat': {
      // DSAT scale 400 - 1600
      const sat = Math.round((ratio * 1200 + 400) / 10) * 10;
      return { scaledScore: sat, label: `${sat} / 1600` };
    }
    default: {
      const percentage = Math.round(ratio * 100);
      return { scaledScore: percentage, label: `${percentage}%` };
    }
  }
}

/**
 * Derives weakness categories from question evaluations
 */
export function calculateExamWeaknesses(questionResults: ExamQuestionResult[]): ExamWeakness[] {
  const categoryMap: Record<string, { errors: number; total: number }> = {};

  questionResults.forEach((q) => {
    const category = q.type || 'general';
    if (!categoryMap[category]) {
      categoryMap[category] = { errors: 0, total: 0 };
    }
    categoryMap[category].total++;
    if (!q.isCorrect) {
      categoryMap[category].errors++;
    }
  });

  const weaknesses: ExamWeakness[] = [];

  Object.entries(categoryMap).forEach(([category, data]) => {
    const accuracy = Math.round(((data.total - data.errors) / data.total) * 100);
    if (data.errors > 0) {
      let recommendation = `Cần luyện tập thêm các câu hỏi dạng ${category}.`;
      if (category.includes('listening')) recommendation = 'Nên nghe lại audio kết hợp dictation để nhận diện từ nối.';
      else if (category.includes('reading')) recommendation = 'Tập trung đọc lướt (skimming) và quét từ khóa (scanning).';
      else if (category.includes('fill-blank')) recommendation = 'Củng cố ngữ pháp cấu trúc câu và collocation.';

      weaknesses.push({
        category,
        errorCount: data.errors,
        totalCount: data.total,
        accuracy,
        recommendation,
      });
    }
  });

  // Sort weaknesses by highest error count
  return weaknesses.sort((a, b) => b.errorCount - a.errorCount);
}

/**
 * Authoritative Exam Evaluation (Zero Client Trust)
 */
export function evaluateExamAttempt(
  exam: Exam,
  attempt: ExamAttempt,
  elapsedSeconds: number
): ExamResult {
  const answerMap = new Map<string, string>();
  (attempt.answers || []).forEach((a) => {
    if (a.questionId) {
      answerMap.set(a.questionId, a.selectedOption || '');
    }
  });

  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalScore = 0;
  let maxPossibleScore = 0;

  const sectionResults: ExamSectionResult[] = [];
  const questionResults: ExamQuestionResult[] = [];
  const weakVocabularyIds = new Set<string>();

  exam.sections.forEach((section) => {
    let secCorrect = 0;
    let secAnswered = 0;
    let secScore = 0;

    section.questions.forEach((q) => {
      totalQuestions++;
      maxPossibleScore += q.points || 1;

      const userSelected = answerMap.get(q.id) || '';
      const evalResult = calculateQuestionScore(q, userSelected);

      if (!evalResult.isUnanswered) {
        secAnswered++;
      }

      if (evalResult.isCorrect) {
        secCorrect++;
        totalCorrect++;
        secScore += evalResult.points;
        totalScore += evalResult.points;
      } else {
        // Collect vocabulary IDs from missed questions for SRS review
        (q.vocabularyIds || []).forEach((vid) => weakVocabularyIds.add(vid));
      }

      questionResults.push({
        questionId: q.id,
        sectionId: section.id,
        type: q.type,
        prompt: q.prompt,
        selectedOption: userSelected,
        correctAnswer: q.correctAnswer,
        isCorrect: evalResult.isCorrect,
        isUnanswered: evalResult.isUnanswered,
        explanation: q.explanation,
        vocabularyIds: q.vocabularyIds || [],
        pointsAwarded: evalResult.points,
      });
    });

    const secAccuracy = section.questions.length > 0 ? Math.round((secCorrect / section.questions.length) * 100) : 0;

    sectionResults.push({
      sectionId: section.id,
      title: section.title,
      type: section.type,
      totalQuestions: section.questions.length,
      answeredQuestions: secAnswered,
      correctAnswers: secCorrect,
      score: secScore,
      accuracy: secAccuracy,
    });
  });

  const accuracy = calculateExamAccuracy(totalCorrect, totalQuestions);
  const scorePercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  const grade = calculateExamGrade(scorePercentage);
  const completionRate = totalQuestions > 0 ? Math.round((answerMap.size / totalQuestions) * 100) : 0;
  const scaled = calculateScaledScore(exam.type, totalCorrect, totalQuestions);
  const weaknesses = calculateExamWeaknesses(questionResults);
  const xpAwarded = calculateExamXP(exam.type, exam.difficulty, scorePercentage, true);

  const durationSec = exam.durationMinutes * 60;
  const remainingSeconds = Math.max(0, durationSec - elapsedSeconds);

  return {
    attemptId: attempt.id,
    examId: exam.id,
    userId: attempt.userId,
    score: totalScore,
    maxScore: maxPossibleScore,
    scaledScore: scaled.scaledScore,
    scaledScoreLabel: scaled.label,
    accuracy,
    completionRate,
    grade,
    elapsedSeconds,
    remainingSeconds,
    sectionResults,
    questionResults,
    weaknesses,
    weakVocabularyIds: Array.from(weakVocabularyIds),
    xpAwarded,
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Maps exam question performance to SM-2 spaced repetition quality (0 to 5)
 */
export function mapExamPerformanceToSRSQuality(isCorrect: boolean, responseTimeMs?: number): number {
  if (!isCorrect) return 1;
  if (responseTimeMs && responseTimeMs < 4000) return 5;
  return 4;
}

// ============================================================================
// 12. COMMUNITY & SOCIAL LEARNING LAB DOMAIN MODELS & ALGORITHMS
// ============================================================================

export type ActivityType =
  | 'lesson_completed'
  | 'vocabulary_learned'
  | 'vocabulary_reviewed'
  | 'listening_completed'
  | 'writing_completed'
  | 'reading_completed'
  | 'exam_completed'
  | 'streak_milestone'
  | 'achievement_unlocked'
  | 'level_up'
  | 'group_joined'
  | 'note_created';

export type Visibility = 'public' | 'friends' | 'private';
export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';
export type StudyGroupRole = 'owner' | 'moderator' | 'member';
export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all_time';

export interface SocialPrivacySettings {
  profileVisibility: Visibility;
  activityVisibility: Visibility;
  allowFriendRequests: boolean;
  allowGroupInvites: boolean;
  showOnLeaderboard: boolean;
  showAchievements: boolean;
}

export interface SocialProfile {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  targetLanguage: string;
  level: string;
  totalXP: number;
  currentStreak: number;
  totalLearningDays: number;
  vocabularyLearned: number;
  listeningSessions: number;
  writingSubmissions: number;
  readingCompleted: number;
  examsCompleted: number;
  privacy: SocialPrivacySettings;
  createdAt: string;
}

export interface Friendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface LearningActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  visibility: Visibility;
  timestamp: string;
}

export interface StudyNote {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  tags: string[];
  visibility: Visibility;
  reactionCount: number;
  reactions: Record<string, number>; // { 'helpful': 3, 'inspiring': 1, 'useful': 2 }
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudyNoteReaction {
  noteId: string;
  userId: string;
  reactionType: 'helpful' | 'inspiring' | 'useful';
  createdAt: string;
}

export interface StudyNoteComment {
  id: string;
  noteId: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  topic: string;
  level: string;
  ownerId: string;
  memberCount: number;
  maxMembers: number;
  visibility: 'public' | 'private';
  totalGroupXP: number;
  coverImage?: string;
  createdAt: string;
}

export interface StudyGroupMember {
  groupId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role: StudyGroupRole;
  joinedAt: string;
  contributedXP: number;
}

export interface GroupPost {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  attachments?: string[];
  commentCount: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  rank: number;
  score: number;
  period: LeaderboardPeriod;
  category: 'xp' | 'vocabulary' | 'reading' | 'writing' | 'listening' | 'exams';
  currentStreak: number;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: 'social' | 'study' | 'streak' | 'mastery';
  xpReward: number;
  maxProgress: number;
}

export interface UserAchievement {
  achievementId: string;
  userId: string;
  code: string;
  currentProgress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface SocialStats {
  friendCount: number;
  followingCount: number;
  followersCount: number;
  notesCount: number;
  groupsCount: number;
  totalReactionsReceived: number;
  weeklySocialXP: number;
}

export interface CommunityNotification {
  id: string;
  userId: string;
  type:
    | 'friend_request'
    | 'friend_accepted'
    | 'note_reaction'
    | 'note_comment'
    | 'group_join'
    | 'achievement_unlock'
    | 'leaderboard_change';
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  targetId?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// Pure Deterministic Community & Social Algorithms
// ----------------------------------------------------------------------------

/**
 * Creates a validated learning activity record
 */
export function createLearningActivity(
  userId: string,
  userName: string,
  type: ActivityType,
  title: string,
  metadata: Record<string, any> = {},
  visibility: Visibility = 'public',
  userAvatar?: string
): LearningActivity {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    userName,
    userAvatar,
    type,
    title: title.trim().substring(0, 150),
    metadata,
    visibility,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Checks if a viewer can access a target activity based on privacy settings and social relationship
 */
export function canViewActivity(
  activity: LearningActivity,
  viewerId?: string,
  friendshipStatus?: FriendshipStatus,
  isFollowing?: boolean
): boolean {
  if (activity.visibility === 'public') return true;
  if (!viewerId) return false;
  if (activity.userId === viewerId) return true;
  if (activity.visibility === 'friends' && friendshipStatus === 'accepted') return true;
  return false;
}

/**
 * Sanitizes activity content for viewer (strips internal metadata if viewer is not owner)
 */
export function sanitizeActivityForViewer(
  activity: LearningActivity,
  viewerId?: string,
  isFriend: boolean = false
): LearningActivity {
  const isOwner = viewerId === activity.userId;
  if (isOwner) return { ...activity };

  const sanitized = { ...activity };
  if (!isFriend && activity.visibility === 'friends') {
    sanitized.title = 'Hoạt động chia sẻ với bạn bè';
    sanitized.metadata = undefined;
  }
  return sanitized;
}

/**
 * Checks if a user can comment on a study note
 */
export function canCommentOnNote(
  note: StudyNote,
  viewerId: string,
  isFriend: boolean = false
): { allowed: boolean; reason?: string } {
  if (!viewerId) return { allowed: false, reason: 'Yêu cầu đăng nhập để bình luận.' };
  if (note.visibility === 'private' && note.userId !== viewerId) {
    return { allowed: false, reason: 'Ghi chú này ở chế độ riêng tư.' };
  }
  if (note.visibility === 'friends' && note.userId !== viewerId && !isFriend) {
    return { allowed: false, reason: 'Chỉ bạn bè mới có thể bình luận ghi chú này.' };
  }
  return { allowed: true };
}

/**
 * Checks if a user can react to a study note
 */
export function canReactToNote(
  note: StudyNote,
  viewerId: string,
  isFriend: boolean = false
): { allowed: boolean; reason?: string } {
  if (!viewerId) return { allowed: false, reason: 'Yêu cầu đăng nhập để thả cảm xúc.' };
  if (note.visibility === 'private' && note.userId !== viewerId) {
    return { allowed: false, reason: 'Ghi chú ở chế độ riêng tư.' };
  }
  if (note.visibility === 'friends' && note.userId !== viewerId && !isFriend) {
    return { allowed: false, reason: 'Chỉ bạn bè mới có thể thả cảm xúc.' };
  }
  return { allowed: true };
}

/**
 * Validates study note input parameters
 */
export function validateStudyNoteContent(
  title: string,
  content: string,
  tags: string[] = []
): { valid: boolean; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Tiêu đề ghi chú không được để trống.' };
  }
  if (title.trim().length > 120) {
    return { valid: false, error: 'Tiêu đề không được vượt quá 120 ký tự.' };
  }
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Nội dung ghi chú không được để trống.' };
  }
  if (content.length > 5000) {
    return { valid: false, error: 'Nội dung ghi chú không được vượt quá 5000 ký tự.' };
  }
  if (tags.length > 10) {
    return { valid: false, error: 'Tối đa 10 thẻ gắn cho mỗi ghi chú.' };
  }
  if (tags.some((t) => t.length > 30)) {
    return { valid: false, error: 'Mỗi thẻ không được vượt quá 30 ký tự.' };
  }
  return { valid: true };
}

/**
 * Normalizes study note fields
 */
export function normalizeStudyNote(
  title: string,
  content: string,
  tags: string[] = [],
  visibility: Visibility = 'public'
): { title: string; content: string; tags: string[]; visibility: Visibility } {
  return {
    title: title.trim().substring(0, 120),
    content: content.trim().substring(0, 5000),
    tags: tags.map((t) => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean).slice(0, 10),
    visibility,
  };
}

/**
 * Validates whether a user can join a study group
 */
export function canJoinGroup(
  group: StudyGroup,
  userId: string,
  currentMemberIds: string[]
): { allowed: boolean; reason?: string } {
  if (!userId) return { allowed: false, reason: 'Yêu cầu đăng nhập.' };
  if (currentMemberIds.includes(userId)) {
    return { allowed: false, reason: 'Bạn đã là thành viên của nhóm này.' };
  }
  if (group.memberCount >= group.maxMembers) {
    return { allowed: false, reason: 'Nhóm học tập đã đủ số lượng thành viên tối đa.' };
  }
  return { allowed: true };
}

/**
 * Checks if a member has group moderation rights
 */
export function canManageGroup(role: StudyGroupRole): boolean {
  return role === 'owner' || role === 'moderator';
}

/**
 * Calculates Social XP reward respecting the daily social XP cap (Anti-abuse)
 */
export function calculateSocialXP(
  eventType: 'NOTE_CREATED' | 'HELPFUL_REACTION_RECEIVED' | 'GROUP_JOINED' | 'GROUP_POST_CREATED' | 'FRIEND_CONNECTION',
  dailySocialXpAccrued: number = 0,
  dailyCap: number = 50
): number {
  const baseRewardMap: Record<string, number> = {
    NOTE_CREATED: 15,
    HELPFUL_REACTION_RECEIVED: 5,
    GROUP_JOINED: 10,
    GROUP_POST_CREATED: 10,
    FRIEND_CONNECTION: 10,
  };

  const reward = baseRewardMap[eventType] || 5;
  const remainingAllowance = Math.max(0, dailyCap - dailySocialXpAccrued);
  return Math.min(reward, remainingAllowance);
}

/**
 * Calculates Leaderboard Score across periods and categories
 */
export function calculateLeaderboardScore(
  category: 'xp' | 'vocabulary' | 'reading' | 'writing' | 'listening' | 'exams',
  metrics: { xp: number; vocabCount: number; readingCount: number; writingCount: number; listeningCount: number; examsScore: number }
): number {
  switch (category) {
    case 'vocabulary':
      return metrics.vocabCount || 0;
    case 'reading':
      return metrics.readingCount || 0;
    case 'writing':
      return metrics.writingCount || 0;
    case 'listening':
      return metrics.listeningCount || 0;
    case 'exams':
      return metrics.examsScore || 0;
    case 'xp':
    default:
      return metrics.xp || 0;
  }
}

/**
 * Sorts and assigns authoritative ranks to leaderboard entries
 */
export function rankLeaderboardEntries(entries: Omit<LeaderboardEntry, 'rank'>[]): LeaderboardEntry[] {
  const sorted = [...entries].sort((a, b) => b.score - a.score || b.currentStreak - a.currentStreak);
  return sorted.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

/**
 * Calculates current progress for a given achievement
 */
export function calculateAchievementProgress(
  code: string,
  userStats: { notesCount: number; friendsCount: number; groupsCount: number; helpfulReactions: number; streak: number; totalXP: number }
): { current: number; max: number } {
  switch (code) {
    case 'FIRST_NOTE':
      return { current: Math.min(1, userStats.notesCount || 0), max: 1 };
    case 'FIRST_FRIEND':
      return { current: Math.min(1, userStats.friendsCount || 0), max: 1 };
    case 'FIRST_GROUP':
      return { current: Math.min(1, userStats.groupsCount || 0), max: 1 };
    case 'HELPFUL_LEARNER':
      return { current: Math.min(10, userStats.helpfulReactions || 0), max: 10 };
    case 'STUDY_BUDDY':
      return { current: Math.min(5, userStats.friendsCount || 0), max: 5 };
    case 'KNOWLEDGE_SHARER':
      return { current: Math.min(5, userStats.notesCount || 0), max: 5 };
    case 'COMMUNITY_STREAK':
      return { current: Math.min(7, userStats.streak || 0), max: 7 };
    case 'TOP_LEARNER':
      return { current: Math.min(1000, userStats.totalXP || 0), max: 1000 };
    default:
      return { current: 0, max: 1 };
  }
}

/**
 * Evaluates whether an achievement is unlocked
 */
export function evaluateAchievementUnlock(
  code: string,
  userStats: { notesCount: number; friendsCount: number; groupsCount: number; helpfulReactions: number; streak: number; totalXP: number }
): boolean {
  const { current, max } = calculateAchievementProgress(code, userStats);
  return current >= max;
}

/**
 * Maps raw learning activity into formatted feed UI text
 */
export function mapActivityToFeedItem(
  activity: LearningActivity,
  locale: string = 'vi'
): { actionText: string; highlight: string } {
  const isVi = locale === 'vi';
  switch (activity.type) {
    case 'lesson_completed':
      return {
        actionText: isVi ? 'đã hoàn thành bài học' : 'completed lesson',
        highlight: activity.title,
      };
    case 'vocabulary_learned':
      return {
        actionText: isVi ? 'đã học thêm từ mới' : 'learned new words',
        highlight: activity.title,
      };
    case 'vocabulary_reviewed':
      return {
        actionText: isVi ? 'đã hoàn thành phiên ôn tập SRS' : 'completed SRS review session',
        highlight: activity.title,
      };
    case 'listening_completed':
      return {
        actionText: isVi ? 'đã luyện nghe Dictation/Shadowing' : 'practiced listening lab',
        highlight: activity.title,
      };
    case 'writing_completed':
      return {
        actionText: isVi ? 'đã hoàn thành bài viết Writing Lab' : 'completed a writing submission',
        highlight: activity.title,
      };
    case 'reading_completed':
      return {
        actionText: isVi ? 'đã đọc xong bài đọc Reading Lab' : 'completed a bilingual reading',
        highlight: activity.title,
      };
    case 'exam_completed':
      return {
        actionText: isVi ? 'đã thi thử thành công' : 'completed an exam mock test',
        highlight: activity.title,
      };
    case 'streak_milestone':
      return {
        actionText: isVi ? 'đã đạt chuỗi ngày học liên tiếp' : 'reached a streak milestone',
        highlight: activity.title,
      };
    case 'achievement_unlocked':
      return {
        actionText: isVi ? 'đã mở khóa thành tích mới' : 'unlocked an achievement',
        highlight: activity.title,
      };
    case 'group_joined':
      return {
        actionText: isVi ? 'đã tham gia nhóm học tập' : 'joined a study group',
        highlight: activity.title,
      };
    case 'note_created':
      return {
        actionText: isVi ? 'đã chia sẻ một ghi chú học tập' : 'shared a study note',
        highlight: activity.title,
      };
    default:
      return {
        actionText: isVi ? 'có hoạt động học tập mới' : 'has a new learning activity',
        highlight: activity.title,
      };
  }
}

/**
 * Detects duplicate activities within a timeframe to prevent feed spam
 */
export function detectActivityDuplicate(
  recentActivities: LearningActivity[],
  newType: ActivityType,
  newUserId: string,
  newTitle: string,
  windowSeconds: number = 60
): boolean {
  const now = Date.now();
  return recentActivities.some((act) => {
    if (act.userId !== newUserId || act.type !== newType) return false;
    const diffSec = (now - new Date(act.timestamp).getTime()) / 1000;
    return diffSec >= 0 && diffSec <= windowSeconds && act.title === newTitle;
  });
}

// ============================================================================
// SECTION 13: LEARNING ANALYTICS & PERSONAL INTELLIGENCE LAB (PHASE 17)
// ============================================================================

export type LearningSkill =
  | 'listening'
  | 'speaking'
  | 'vocabulary'
  | 'writing'
  | 'reading'
  | 'grammar'
  | 'exam'
  | 'community';

export type SkillTrend = 'up' | 'down' | 'stable';

export type ConsistencyLevel =
  | 'inconsistent'
  | 'developing'
  | 'consistent'
  | 'highly_consistent';

export interface SkillPerformance {
  skill: LearningSkill;
  score: number;
  accuracy: number;
  attempts: number;
  completed: number;
  studyMinutes: number;
  xpEarned: number;
  trend: SkillTrend;
}

export interface LearningSnapshot {
  userId: string;
  date: string;
  totalMinutes: number;
  totalXP: number;
  listeningScore: number;
  speakingScore: number;
  vocabularyScore: number;
  writingScore: number;
  readingScore: number;
  examScore: number;
  vocabularyLearned: number;
  vocabularyReviewed: number;
  streak: number;
  cefrEstimate: string;
}

export interface WeaknessArea {
  skill: LearningSkill;
  severity: 'low' | 'medium' | 'high';
  score: number;
  evidence: string[];
}

export interface StrengthArea {
  skill: LearningSkill;
  score: number;
  evidence: string[];
}

export interface LearningRecommendation {
  id: string;
  skill: LearningSkill;
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  actionLabel: string;
  actionRoute: string;
  estimatedMinutes: number;
}

export type GoalType =
  | 'daily_minutes'
  | 'weekly_minutes'
  | 'weekly_xp'
  | 'vocabulary'
  | 'reading'
  | 'writing'
  | 'listening'
  | 'exam';

export interface LearningGoal {
  id: string;
  userId: string;
  type: GoalType;
  target: number;
  current: number;
  startDate: string;
  endDate: string;
  completed: boolean;
  xpReward?: number;
}

export interface LearningGoalProgress {
  goalId: string;
  percentage: number;
  remaining: number;
  isCompleted: boolean;
}

export interface LearningHeatmapEntry {
  date: string;
  minutes: number;
  xp: number;
  activityCount: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface CEFRProgress {
  currentLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  confidence: number;
  scoreToNextLevel: number;
  nextMilestone: 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  estimatedHoursNeeded: number;
  disclaimer: string;
}

export interface LearningAnalytics {
  overallScore: number;
  estimatedCEFR: string;
  totalStudyMinutes: number;
  totalXP: number;
  currentStreak: number;
  weeklyMinutes: number;
  skills: SkillPerformance[];
  weaknesses: WeaknessArea[];
  strengths: StrengthArea[];
  recommendations: LearningRecommendation[];
  goals: LearningGoal[];
  consistency: {
    score: number;
    level: ConsistencyLevel;
  };
}

export interface WeeklyLearningReport {
  weekNumber: number;
  year: number;
  minutesStudied: number;
  minutesChangePercent: number;
  vocabularyCount: number;
  vocabularyChangePercent: number;
  averageAccuracy: number;
  accuracyChangePercent: number;
  strongestSkill: LearningSkill;
  focusNextWeek: LearningSkill;
  summary: string;
}

export interface DailyLearningSummary {
  date: string;
  minutes: number;
  xp: number;
  activitiesCount: number;
  skillsPracticed: LearningSkill[];
}

/**
 * Pure Deterministic: Calculate skill score out of 100 based on weighted metrics
 */
export function calculateSkillScore(params: {
  accuracy: number;
  completionRate?: number;
  attempts?: number;
  recentAccuracy?: number;
}): number {
  const { accuracy, completionRate = 100, attempts = 1, recentAccuracy = accuracy } = params;
  if (attempts <= 0) return 0;

  // Weights: 60% overall accuracy, 20% completion rate, 10% recent accuracy, 10% experience bonus (capped)
  const experienceBonus = Math.min(10, attempts * 2);
  const weighted =
    accuracy * 0.6 +
    Math.min(100, completionRate) * 0.2 +
    recentAccuracy * 0.1 +
    experienceBonus;

  return Math.round(Math.min(100, Math.max(0, weighted)));
}

/**
 * Pure Deterministic: Compare current period vs previous period score with threshold
 */
export function calculateSkillTrend(
  currentScore: number,
  previousScore: number,
  threshold: number = 3
): SkillTrend {
  const diff = currentScore - previousScore;
  if (diff > threshold) return 'up';
  if (diff < -threshold) return 'down';
  return 'stable';
}

/**
 * Pure Deterministic: Detect weakness areas based on scores, accuracy, and attempts
 */
export function detectWeaknesses(
  skills: SkillPerformance[],
  minAttempts: number = 2
): WeaknessArea[] {
  const weaknesses: WeaknessArea[] = [];

  for (const s of skills) {
    if (s.attempts < minAttempts) continue;

    if (s.score < 50) {
      weaknesses.push({
        skill: s.skill,
        severity: 'high',
        score: s.score,
        evidence: [
          `Độ chính xác hiện tại ${s.accuracy}% dưới mức tiêu chuẩn.`,
          `Điểm đánh giá tổng hợp ${s.score}/100 cần cải thiện ngay.`,
        ],
      });
    } else if (s.score >= 50 && s.score < 70) {
      weaknesses.push({
        skill: s.skill,
        severity: 'medium',
        score: s.score,
        evidence: [
          `Độ chính xác ${s.accuracy}% ở mức trung bình.`,
          `Xu hướng kỹ năng đang ${s.trend === 'down' ? 'giảm sút' : 'cần luyện tập thêm'}.`,
        ],
      });
    } else if (s.score >= 70 && s.score < 75 && s.trend === 'down') {
      weaknesses.push({
        skill: s.skill,
        severity: 'low',
        score: s.score,
        evidence: [`Điểm số ${s.score}/100 có dấu hiệu chững lại gần đây.`],
      });
    }
  }

  return weaknesses.sort((a, b) => a.score - b.score);
}

/**
 * Pure Deterministic: Detect strength areas
 */
export function detectStrengths(
  skills: SkillPerformance[],
  minAttempts: number = 2
): StrengthArea[] {
  const strengths: StrengthArea[] = [];

  for (const s of skills) {
    if (s.attempts >= minAttempts && s.score >= 80) {
      strengths.push({
        skill: s.skill,
        score: s.score,
        evidence: [
          `Độ chính xác ấn tượng ${s.accuracy}% qua ${s.attempts} lượt học.`,
          `Hoàn thành xuất sắc ${s.completed} bài luyện tập.`,
        ],
      });
    }
  }

  return strengths.sort((a, b) => b.score - a.score);
}

/**
 * Pure Deterministic: Calculate overall learning score from active skills
 * Prevents beginners with missing data from getting a false 0 overall score
 */
export function calculateOverallLearningScore(
  skills: SkillPerformance[],
  consistencyScore: number = 70
): number {
  const activeSkills = skills.filter((s) => s.attempts > 0);
  if (activeSkills.length === 0) return 0;

  const totalSkillScore = activeSkills.reduce((sum, s) => sum + s.score, 0);
  const avgSkillScore = totalSkillScore / activeSkills.length;

  // 85% average skill performance + 15% study consistency
  const overall = avgSkillScore * 0.85 + Math.min(100, Math.max(0, consistencyScore)) * 0.15;
  return Math.round(Math.min(100, Math.max(0, overall)));
}

/**
 * Pure Deterministic: Evaluate learning streak consistency level
 */
export function calculateLearningStreakConsistency(
  activeDaysInPeriod: number,
  totalDaysInPeriod: number
): { score: number; level: ConsistencyLevel } {
  if (totalDaysInPeriod <= 0) return { score: 0, level: 'inconsistent' };

  const ratio = Math.min(1, Math.max(0, activeDaysInPeriod / totalDaysInPeriod));
  const score = Math.round(ratio * 100);

  let level: ConsistencyLevel = 'inconsistent';
  if (score >= 76) level = 'highly_consistent';
  else if (score >= 51) level = 'consistent';
  else if (score >= 21) level = 'developing';
  else level = 'inconsistent';

  return { score, level };
}

/**
 * Pure Deterministic: Calculate GitHub-style 365-day study heatmap
 */
export function calculateStudyHeatmap(
  activities: { timestamp: string; minutes?: number; xp?: number }[],
  daysCount: number = 365,
  baseDate: Date = new Date()
): LearningHeatmapEntry[] {
  const map = new Map<string, { minutes: number; xp: number; count: number }>();

  // Aggregate incoming activity data
  for (const act of activities) {
    if (!act.timestamp) continue;
    const dayKey = act.timestamp.split('T')[0];
    const existing = map.get(dayKey) || { minutes: 0, xp: 0, count: 0 };
    existing.minutes += act.minutes || 10;
    existing.xp += act.xp || 15;
    existing.count += 1;
    map.set(dayKey, existing);
  }

  const result: LearningHeatmapEntry[] = [];
  const start = new Date(baseDate);
  start.setDate(start.getDate() - (daysCount - 1));

  for (let i = 0; i < daysCount; i++) {
    const cur = new Date(start);
    cur.setDate(cur.getDate() + i);
    const key = cur.toISOString().split('T')[0];
    const data = map.get(key) || { minutes: 0, xp: 0, count: 0 };

    let intensity: 0 | 1 | 2 | 3 | 4 = 0;
    if (data.minutes >= 45 || data.xp >= 100) intensity = 4;
    else if (data.minutes >= 30 || data.xp >= 60) intensity = 3;
    else if (data.minutes >= 15 || data.xp >= 30) intensity = 2;
    else if (data.minutes > 0 || data.xp > 0) intensity = 1;

    result.push({
      date: key,
      minutes: data.minutes,
      xp: data.xp,
      activityCount: data.count,
      intensity,
    });
  }

  return result;
}

/**
 * Pure Deterministic: Estimate CEFR learning progress
 */
export function calculateCEFRProgress(
  overallScore: number,
  vocabularyCount: number = 0,
  completedExams: number = 0
): CEFRProgress {
  // Composite metric
  const masteryIndex = overallScore * 0.6 + Math.min(100, (vocabularyCount / 600) * 100) * 0.25 + Math.min(100, completedExams * 20) * 0.15;

  let currentLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' = 'A1';
  let nextMilestone: 'A2' | 'B1' | 'B2' | 'C1' | 'C2' = 'A2';
  let scoreToNextLevel = 0;
  let estimatedHoursNeeded = 40;

  if (masteryIndex >= 85) {
    currentLevel = 'C1';
    nextMilestone = 'C2';
    scoreToNextLevel = Math.max(0, 100 - masteryIndex);
    estimatedHoursNeeded = 80;
  } else if (masteryIndex >= 70) {
    currentLevel = 'B2';
    nextMilestone = 'C1';
    scoreToNextLevel = Math.max(0, 85 - masteryIndex);
    estimatedHoursNeeded = 60;
  } else if (masteryIndex >= 55) {
    currentLevel = 'B1';
    nextMilestone = 'B2';
    scoreToNextLevel = Math.max(0, 70 - masteryIndex);
    estimatedHoursNeeded = 45;
  } else if (masteryIndex >= 35) {
    currentLevel = 'A2';
    nextMilestone = 'B1';
    scoreToNextLevel = Math.max(0, 55 - masteryIndex);
    estimatedHoursNeeded = 30;
  } else {
    currentLevel = 'A1';
    nextMilestone = 'A2';
    scoreToNextLevel = Math.max(0, 35 - masteryIndex);
    estimatedHoursNeeded = 20;
  }

  return {
    currentLevel,
    confidence: Math.round(Math.min(98, 65 + (vocabularyCount > 100 ? 20 : 10) + (completedExams > 2 ? 10 : 5))),
    scoreToNextLevel: Math.round(scoreToNextLevel),
    nextMilestone,
    estimatedHoursNeeded,
    disclaimer: 'Đây là ước tính trình độ học tập cá nhân dựa trên tiến độ học và kết quả bài tập trên hệ thống. Không thay thế chứng chỉ khảo thí quốc tế chính thức.',
  };
}

/**
 * Pure Deterministic: Calculate learning goal progress clamped 0-100%
 */
export function calculateGoalProgress(
  current: number,
  target: number
): LearningGoalProgress {
  const safeTarget = target > 0 ? target : 1;
  const percentage = Math.min(100, Math.max(0, Math.round((current / safeTarget) * 100)));
  const remaining = Math.max(0, target - current);
  const isCompleted = current >= target;

  return {
    goalId: '',
    percentage,
    remaining,
    isCompleted,
  };
}

/**
 * Pure Deterministic: Generate personalized learning recommendations
 */
export function generateLearningRecommendations(params: {
  skills: SkillPerformance[];
  weaknesses: WeaknessArea[];
  srsDueCount?: number;
  examAttemptsCount?: number;
  locale?: string;
}): LearningRecommendation[] {
  const { skills, weaknesses, srsDueCount = 0, examAttemptsCount = 0, locale = 'vi' } = params;
  const recommendations: LearningRecommendation[] = [];
  const isVi = locale === 'vi';

  // 1. Check SRS Due Cards (High priority if >= 10 due)
  if (srsDueCount >= 10) {
    recommendations.push({
      id: 'rec-srs-due',
      skill: 'vocabulary',
      priority: 'high',
      title: isVi ? `Ôn tập ${srsDueCount} thẻ từ vựng đến hạn` : `Review ${srsDueCount} Due Vocabulary Cards`,
      description: isVi
        ? 'Thuật toán SM-2 nhắc bạn cần ôn từ vựng hôm nay để củng cố trí nhớ dài hạn.'
        : 'SM-2 spaced repetition suggests reviewing today to reinforce long-term memory.',
      actionLabel: isVi ? 'Ôn từ vựng ngay' : 'Review SRS Cards',
      actionRoute: `/${locale}/srs`,
      estimatedMinutes: 10,
    });
  }

  // 2. Process High and Medium Weaknesses
  for (const w of weaknesses) {
    if (w.skill === 'listening' && w.severity === 'high') {
      recommendations.push({
        id: 'rec-weak-listening',
        skill: 'listening',
        priority: 'high',
        title: isVi ? 'Cải thiện phản xạ Nghe Chính Tả (Dictation)' : 'Strengthen Listening Dictation',
        description: isVi
          ? 'Độ chính xác phần nghe gần đây đang thấp. Hãy luyện Dictation để bắt âm chuẩn hơn.'
          : 'Your listening accuracy is below average. Practice dictation to improve phonetics comprehension.',
        actionLabel: isVi ? 'Luyện nghe chính tả' : 'Practice Dictation',
        actionRoute: `/${locale}/listening/dictation`,
        estimatedMinutes: 12,
      });
    } else if (w.skill === 'writing' && (w.severity === 'high' || w.severity === 'medium')) {
      recommendations.push({
        id: 'rec-weak-writing',
        skill: 'writing',
        priority: w.severity,
        title: isVi ? 'Luyện viết câu hoàn chỉnh (Guided Writing)' : 'Practice Guided Writing',
        description: isVi
          ? 'Tăng độ phong phú từ vựng và ngữ pháp thông qua bài viết có gợi ý cấu trúc.'
          : 'Enhance sentence variety and grammar through structured guided writing prompts.',
        actionLabel: isVi ? 'Luyện viết ngay' : 'Start Guided Writing',
        actionRoute: `/${locale}/writing/guided`,
        estimatedMinutes: 15,
      });
    } else if (w.skill === 'reading' && w.severity === 'medium') {
      recommendations.push({
        id: 'rec-weak-reading',
        skill: 'reading',
        priority: 'medium',
        title: isVi ? 'Đọc hiểu văn bản song ngữ A2/B1' : 'Bilingual Reading Practice',
        description: isVi
          ? 'Đọc bài viết ngắn song ngữ để trau dồi tốc độ WPM và khả năng nhận diện ngữ cảnh.'
          : 'Read short bilingual articles to improve reading speed and contextual vocabulary.',
        actionLabel: isVi ? 'Đọc bài ngay' : 'Start Reading',
        actionRoute: `/${locale}/reading`,
        estimatedMinutes: 10,
      });
    }
  }

  // 3. Exam Practice Recommendation if few attempts
  if (examAttemptsCount < 2) {
    recommendations.push({
      id: 'rec-exam-mock',
      skill: 'exam',
      priority: 'medium',
      title: isVi ? 'Thi thử đề chuẩn TOEIC / IELTS Mock Test' : 'Take a Diagnostic Exam Mock Test',
      description: isVi
        ? 'Làm bài thi thử có tính giờ để hệ thống đánh giá chính xác năng lực thực chiến của bạn.'
        : 'Complete a timed mock test to benchmark your real exam performance accurately.',
      actionLabel: isVi ? 'Vào phòng thi thử' : 'Take Mock Exam',
      actionRoute: `/${locale}/exam-practice`,
      estimatedMinutes: 25,
    });
  }

  // 4. Default fallback recommendation if user has no major weaknesses
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-daily-vocab',
      skill: 'vocabulary',
      priority: 'low',
      title: isVi ? 'Học thêm 10 từ vựng chủ đề mới' : 'Learn 10 New Topic Words',
      description: isVi
        ? 'Bạn đang giữ phong độ rất tốt! Tiếp tục mở rộng vốn từ vựng học thuật.'
        : 'You are performing great! Expand your academic vocabulary repertoire.',
      actionLabel: isVi ? 'Khám phá từ vựng' : 'Explore Vocab',
      actionRoute: `/${locale}/vocabulary`,
      estimatedMinutes: 8,
    });
  }

  return recommendations;
}

// ============================================================================
// 14. SPEAKING LAB DOMAIN MODELS & DETERMINISTIC ALGORITHMS
// ============================================================================

export type SpeakingDifficulty = 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced';

export type SpeakingMode =
  | 'pronunciation'
  | 'repetition'
  | 'shadowing'
  | 'guided'
  | 'picture'
  | 'situation'
  | 'free-speaking';

export interface SpeakingPrompt {
  id: string;
  title: string;
  description: string;
  mode: SpeakingMode;
  difficulty: SpeakingDifficulty;
  topic: string;
  targetWords: string[];
  targetPhrases: string[];
  sampleAnswer?: string;
  durationSeconds: number;
  minWords: number;
  maxWords: number;
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  tags: string[];
  imagePrompt?: string;
  steps?: string[];
  scenario?: string;
}

export interface SpeakingSubmission {
  promptId: string;
  transcript: string;
  durationMs: number;
  wordsSpoken?: number;
  clientMetadata?: Record<string, any>;
  submittedAt?: string;
}

export interface SpeakingPronunciationIssue {
  word: string;
  expected: string;
  observed: string;
  category: 'mispronunciation' | 'omitted' | 'repeated' | 'hesitation' | 'unclear';
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface SpeakingCorrection {
  original: string;
  corrected: string;
  explanation: string;
  category: string;
}

export interface SpeakingVocabularySuggestion {
  word: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  meaning: string;
  reason: string;
  example: string;
  sourceWord?: string;
}

export interface SpeakingFeedback {
  pronunciationScore: number;
  fluencyScore: number;
  grammarScore: number;
  vocabularyScore: number;
  coherenceScore: number;
  overallScore: number;
  grade: 'Excellent' | 'Very Good' | 'Good' | 'Needs Practice' | 'Keep Practicing';
  corrections: SpeakingCorrection[];
  pronunciationIssues: SpeakingPronunciationIssue[];
  vocabularySuggestions: SpeakingVocabularySuggestion[];
  advice: string;
}

export interface SpeakingResult {
  submissionId: string;
  feedback: SpeakingFeedback;
  xpAwarded: number;
  streakUpdated: boolean;
  srsSuggestions: string[];
  duration: number;
  wordCount: number;
}

/**
 * 1. Tokenizes spoken transcript safely handling Unicode, apostrophes, and punctuation.
 */
export function tokenizeSpeakingTranscript(transcript: string): string[] {
  if (!transcript || typeof transcript !== 'string') return [];
  const normalized = transcript
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\_`~()?"“”]/g, ' ')
    .replace(/\s+/g, ' ');
  if (!normalized) return [];
  return normalized
    .split(' ')
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 0);
}

/**
 * 2. Counts valid spoken words.
 */
export function calculateSpeakingWordCount(transcript: string): number {
  return tokenizeSpeakingTranscript(transcript).length;
}

/**
 * 3. Calculates duration in whole seconds.
 */
export function calculateSpeakingDuration(durationMs: number): number {
  if (!durationMs || durationMs < 0) return 0;
  return Math.max(0, Math.round(durationMs / 1000));
}

/**
 * 4. Deterministic Levenshtein String Similarity (0 to 100%).
 */
export function calculateTranscriptSimilarity(expected: string, observed: string): number {
  const normExpected = expected.toLowerCase().replace(/[^\w\s']/g, '').trim();
  const normObserved = observed.toLowerCase().replace(/[^\w\s']/g, '').trim();

  if (!normExpected && !normObserved) return 100;
  if (!normExpected || !normObserved) return 0;
  if (normExpected === normObserved) return 100;

  const expTokens = normExpected.split(/\s+/).filter(Boolean);
  const obsTokens = normObserved.split(/\s+/).filter(Boolean);

  let matchCount = 0;
  const usedIndices = new Set<number>();

  for (const expToken of expTokens) {
    for (let j = 0; j < obsTokens.length; j++) {
      if (!usedIndices.has(j) && (obsTokens[j] === expToken || levenshteinDistance(expToken, obsTokens[j]) <= 1)) {
        matchCount++;
        usedIndices.add(j);
        break;
      }
    }
  }

  const tokenRatio = (2 * matchCount) / (expTokens.length + obsTokens.length);
  return Math.round(Math.min(100, Math.max(0, tokenRatio * 100)));
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

/**
 * 5. Calculates transcript match score for pronunciation exercises (0 to 100).
 */
export function calculatePronunciationScore(expected: string, transcript: string): number {
  if (!expected) return 80;
  if (!transcript || !transcript.trim()) return 0;
  return calculateTranscriptSimilarity(expected, transcript);
}

/**
 * 6. Calculates speaking fluency score based on WPM, hesitation words, and repetition.
 */
export function calculateFluencyScore(
  wordCount: number,
  durationSeconds: number,
  hesitationCount: number = 0,
  repetitionsCount: number = 0
): number {
  if (wordCount <= 0 || durationSeconds <= 0) return 0;

  const wpm = (wordCount / durationSeconds) * 60;
  let baseScore = 70;

  // Optimal natural speaking rate: 100 - 150 WPM
  if (wpm >= 90 && wpm <= 160) {
    baseScore = 95;
  } else if (wpm >= 60 && wpm < 90) {
    baseScore = 80;
  } else if (wpm > 160 && wpm <= 200) {
    baseScore = 85;
  } else if (wpm >= 30 && wpm < 60) {
    baseScore = 65;
  } else {
    baseScore = 50;
  }

  // Deduct for excessive hesitation markers ("uh", "um", "er")
  const hesitationPenalty = Math.min(25, hesitationCount * 4);
  // Deduct for repeated word stuttering
  const repetitionPenalty = Math.min(20, repetitionsCount * 3);

  const finalScore = Math.max(10, Math.min(100, baseScore - hesitationPenalty - repetitionPenalty));
  return Math.round(finalScore);
}

/**
 * 7. Calculates speaking vocabulary richness score.
 */
export function calculateSpeakingVocabularyScore(
  transcript: string,
  targetWords: string[] = [],
  cefr: string = 'B1'
): number {
  const tokens = tokenizeSpeakingTranscript(transcript);
  if (tokens.length === 0) return 0;

  const uniqueTokens = new Set(tokens);
  const typeTokenRatio = uniqueTokens.size / tokens.length; // Diversity

  let baseScore = Math.round(typeTokenRatio * 75);

  // Bonus for hitting target vocabulary
  if (targetWords.length > 0) {
    const hits = targetWords.filter((tw) => tokens.includes(tw.toLowerCase())).length;
    const targetBonus = Math.round((hits / targetWords.length) * 25);
    baseScore += targetBonus;
  } else {
    baseScore += 15;
  }

  return Math.min(100, Math.max(20, baseScore));
}

/**
 * 8. Evaluates deterministic grammar heuristics on spoken transcript.
 */
export function calculateSpeakingGrammarScore(transcript: string): {
  score: number;
  corrections: SpeakingCorrection[];
} {
  const tokens = tokenizeSpeakingTranscript(transcript);
  if (tokens.length === 0) return { score: 0, corrections: [] };

  const text = transcript.toLowerCase();
  const corrections: SpeakingCorrection[] = [];

  // 1. Subject-verb agreement
  if (/\b(he|she|it)\s+(go|do|have|want|need|like|play|work)\b/i.test(text)) {
    corrections.push({
      original: 'he/she/it + base verb',
      corrected: 'he/she/it + verb-s/es',
      explanation: 'Chủ ngữ ngôi thứ 3 số ít cần chia động từ thêm -s hoặc -es (ví dụ: "he goes", "she likes").',
      category: 'subject-verb-agreement',
    });
  }

  // 2. Past time marker with present verb
  if (/\b(yesterday|last\s+(week|month|year)|ago)\b/i.test(text) && /\b(go|see|buy|eat|take|make)\b/i.test(text)) {
    corrections.push({
      original: 'yesterday / last week + present verb',
      corrected: 'Sử dụng động từ ở quá khứ đơn (went, saw, bought, ate...)',
      explanation: 'Các trạng từ chỉ thời gian quá khứ yêu cầu động từ ở dạng Past Simple.',
      category: 'tense-consistency',
    });
  }

  // 3. Indefinite article a vs an
  if (/\ba\s+(apple|orange|egg|idea|hour|elephant|engineer|animal)\b/i.test(text)) {
    corrections.push({
      original: 'a + vowel sound',
      corrected: 'an + vowel sound',
      explanation: 'Dùng mạo từ "an" trước danh từ bắt đầu bằng nguyên âm (ví dụ: an apple, an hour).',
      category: 'articles',
    });
  }

  let score = 90 - corrections.length * 15;
  score = Math.max(30, Math.min(100, score));

  return { score, corrections };
}

/**
 * 9. Evaluates coherence and structure of spoken response.
 */
export function calculateSpeakingCoherenceScore(transcript: string, minWords: number = 20): number {
  const tokens = tokenizeSpeakingTranscript(transcript);
  if (tokens.length === 0) return 0;

  let score = 60;
  if (tokens.length >= minWords) score += 20;

  // Discourse connectors
  const connectors = [
    'because', 'however', 'therefore', 'furthermore', 'also',
    'for example', 'in addition', 'firstly', 'secondly', 'finally',
    'although', 'besides', 'on the other hand', 'especially', 'as a result'
  ];

  const text = transcript.toLowerCase();
  let foundConnectors = 0;
  for (const conn of connectors) {
    if (text.includes(conn)) foundConnectors++;
  }

  score += Math.min(20, foundConnectors * 7);
  return Math.min(100, Math.max(25, score));
}

/**
 * 10. Computes authoritative weighted composite speaking score.
 * Pronunciation: 30% | Fluency: 25% | Grammar: 20% | Vocabulary: 15% | Coherence: 10%
 */
export function calculateSpeakingScore(
  pronunciation: number,
  fluency: number,
  grammar: number,
  vocabulary: number,
  coherence: number
): number {
  const weighted =
    pronunciation * 0.30 +
    fluency * 0.25 +
    grammar * 0.20 +
    vocabulary * 0.15 +
    coherence * 0.10;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

/**
 * 11. Maps overall speaking score to pedagogical grade.
 */
export function getSpeakingGrade(score: number): 'Excellent' | 'Very Good' | 'Good' | 'Needs Practice' | 'Keep Practicing' {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Needs Practice';
  return 'Keep Practicing';
}

/**
 * 12. Calculates authoritative XP award for speaking exercise.
 */
export function calculateSpeakingXP(
  difficulty: SpeakingDifficulty = 'intermediate',
  durationSeconds: number = 30,
  overallScore: number = 75,
  isCompleted: boolean = true
): number {
  if (!isCompleted || durationSeconds < 3 || overallScore < 20) return 5;

  let baseXP = 15;
  switch (difficulty) {
    case 'beginner':
      baseXP = 10;
      break;
    case 'elementary':
      baseXP = 12;
      break;
    case 'intermediate':
      baseXP = 16;
      break;
    case 'upper-intermediate':
      baseXP = 20;
      break;
    case 'advanced':
      baseXP = 25;
      break;
  }

  const scoreBonus = Math.round((overallScore / 100) * 15);
  const durationBonus = Math.min(10, Math.round(durationSeconds / 15));

  const totalXP = baseXP + scoreBonus + durationBonus;
  return Math.min(50, Math.max(5, totalXP));
}

/**
 * 13. Maps speaking score to SM-2 SRS Quality (0 to 5).
 */
export function mapSpeakingPerformanceToSRSQuality(score: number, accuracy: number): number {
  const composite = score * 0.6 + accuracy * 0.4;
  if (composite >= 90) return 5;
  if (composite >= 80) return 4;
  if (composite >= 70) return 3;
  if (composite >= 55) return 2;
  if (composite >= 40) return 1;
  return 0;
}

/**
 * 14. Detects speaking weakness areas.
 */
export function detectSpeakingWeaknesses(feedback: SpeakingFeedback): string[] {
  const weaknesses: string[] = [];
  if (feedback.pronunciationScore < 65) weaknesses.push('low pronunciation match');
  if (feedback.fluencyScore < 65) weaknesses.push('low fluency / hesitation');
  if (feedback.grammarScore < 65) weaknesses.push('grammar inaccuracies');
  if (feedback.vocabularyScore < 65) weaknesses.push('limited vocabulary diversity');
  if (feedback.coherenceScore < 65) weaknesses.push('low coherence / missing transitions');
  return weaknesses;
}

/**
 * 15. Generates targeted actionable speaking recommendations.
 */
export function generateSpeakingRecommendations(feedback: SpeakingFeedback, locale: string = 'vi'): string[] {
  const isVi = locale === 'vi';
  const recs: string[] = [];

  if (feedback.pronunciationScore < 70) {
    recs.push(isVi ? 'Luyện tập phát âm từng âm tiết và từ vựng chuẩn (Pronunciation Mode).' : 'Practice targeted word pronunciation drills.');
  }
  if (feedback.fluencyScore < 70) {
    recs.push(isVi ? 'Luyện tập lặp lại câu (Repetition) và nói đuổi (Shadowing) để cải thiện nhịp điệu.' : 'Practice Sentence Repetition and Shadowing to build natural cadence.');
  }
  if (feedback.vocabularyScore < 70) {
    recs.push(isVi ? 'Nạp thêm các từ vựng học thuật theo chủ đề vào kho thẻ SRS.' : 'Save suggested academic vocabulary to your SRS decks.');
  }
  if (feedback.grammarScore < 70) {
    recs.push(isVi ? 'Chú ý chia thì quá khứ và hòa hợp chủ vị khi trả lời câu hỏi mở.' : 'Pay attention to past tense verbs and subject-verb agreements.');
  }
  if (feedback.coherenceScore < 70) {
    recs.push(isVi ? 'Sử dụng thêm các liên từ (because, however, furthermore, for example) để câu nói mạch lạc.' : 'Use transitional connectors (however, because, furthermore) to link ideas.');
  }

  if (recs.length === 0) {
    recs.push(isVi ? 'Phong độ nói tuyệt vời! Hãy thử thách với các chủ đề Free Speaking nâng cao.' : 'Outstanding speaking performance! Challenge yourself with advanced Free Speaking topics.');
  }

  return recs;
}

/**
 * 16. Comprehensive authoritative evaluation of a speaking submission.
 */
export function evaluateSpeakingSubmission(
  prompt: SpeakingPrompt,
  submission: SpeakingSubmission,
  locale: string = 'vi'
): SpeakingFeedback {
  const transcript = submission.transcript || '';
  const durationSeconds = calculateSpeakingDuration(submission.durationMs || 0);
  const wordCount = calculateSpeakingWordCount(transcript);

  // Hesitation markers check
  const hesitationMatches = transcript.match(/\b(uh|um|er|ah|like|eh)\b/gi);
  const hesitationCount = hesitationMatches ? hesitationMatches.length : 0;

  // Repetition check (consecutive duplicate words)
  const tokens = tokenizeSpeakingTranscript(transcript);
  let repetitionsCount = 0;
  for (let i = 1; i < tokens.length; i++) {
    if (tokens[i] === tokens[i - 1]) repetitionsCount++;
  }

  // Calculate component scores
  const expectedSample = prompt.sampleAnswer || prompt.title;
  const pronunciationScore = prompt.mode === 'pronunciation' || prompt.mode === 'repetition' || prompt.mode === 'shadowing'
    ? calculatePronunciationScore(expectedSample, transcript)
    : Math.min(100, Math.max(50, calculatePronunciationScore(expectedSample, transcript) + 20));

  const fluencyScore = calculateFluencyScore(wordCount, durationSeconds, hesitationCount, repetitionsCount);
  const { score: grammarScore, corrections } = calculateSpeakingGrammarScore(transcript);
  const vocabularyScore = calculateSpeakingVocabularyScore(transcript, prompt.targetWords, prompt.cefr);
  const coherenceScore = calculateSpeakingCoherenceScore(transcript, prompt.minWords || 15);

  const overallScore = calculateSpeakingScore(
    pronunciationScore,
    fluencyScore,
    grammarScore,
    vocabularyScore,
    coherenceScore
  );

  const grade = getSpeakingGrade(overallScore);

  // Pronunciation issues detection
  const pronunciationIssues: SpeakingPronunciationIssue[] = [];
  if (prompt.targetWords && prompt.targetWords.length > 0) {
    for (const tw of prompt.targetWords) {
      if (!tokens.includes(tw.toLowerCase())) {
        pronunciationIssues.push({
          word: tw,
          expected: tw,
          observed: '(chưa nhận diện rõ)',
          category: 'unclear',
          severity: 'medium',
          suggestion: `Luyện phát âm rõ ràng từ "${tw}" trong câu nói.`,
        });
      }
    }
  }

  // Vocabulary suggestions
  const vocabularySuggestions: SpeakingVocabularySuggestion[] = [];
  if (tokens.includes('good')) {
    vocabularySuggestions.push({
      word: 'beneficial',
      level: 'B2',
      meaning: 'Có lợi, mang lại kết quả tốt',
      reason: 'Nâng cấp từ "good" để tăng tính học thuật khi nói.',
      example: 'Regular exercise is highly beneficial for health.',
      sourceWord: 'good',
    });
  }
  if (tokens.includes('bad')) {
    vocabularySuggestions.push({
      word: 'detrimental',
      level: 'C1',
      meaning: 'Gây hại, bất lợi',
      reason: 'Từ vựng C1 diễn tả tác hại thay cho từ "bad".',
      example: 'Pollution has a detrimental effect on the ecosystem.',
      sourceWord: 'bad',
    });
  }

  const adviceList = generateSpeakingRecommendations({
    pronunciationScore,
    fluencyScore,
    grammarScore,
    vocabularyScore,
    coherenceScore,
    overallScore,
    grade,
    corrections,
    pronunciationIssues,
    vocabularySuggestions,
    advice: '',
  }, locale);

  return {
    pronunciationScore,
    fluencyScore,
    grammarScore,
    vocabularyScore,
    coherenceScore,
    overallScore,
    grade,
    corrections,
    pronunciationIssues,
    vocabularySuggestions,
    advice: adviceList[0] || 'Tiếp tục luyện nói đều đặn mỗi ngày!',
  };
}

// ============================================================================
// SECTION 15: AI TUTOR & ADAPTIVE LEARNING LAB
// ============================================================================

export type TutorRole = 'user' | 'tutor' | 'system';

export type TutorIntent =
  | 'explain'
  | 'correct'
  | 'recommend'
  | 'practice'
  | 'review'
  | 'plan'
  | 'motivation'
  | 'vocabulary'
  | 'grammar'
  | 'pronunciation'
  | 'writing'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'exam'
  | 'general';

export type AdaptiveDifficulty = 'easier' | 'current' | 'harder';

export type TutorActionType =
  | 'open_vocabulary'
  | 'start_srs'
  | 'start_listening'
  | 'start_writing'
  | 'start_reading'
  | 'start_speaking'
  | 'start_exam'
  | 'review_weakness'
  | 'review_goal';

export interface TutorAction {
  type: TutorActionType;
  label: string;
  route: string;
  payload?: any;
  priority?: 'critical' | 'high' | 'medium' | 'low';
}

export interface TutorCitation {
  source: 'analytics' | 'srs' | 'writing' | 'speaking' | 'reading' | 'listening' | 'exam' | 'grammar';
  referenceId?: string;
  snippet: string;
}

export interface TutorRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: 'weakness' | 'overdue_srs' | 'goal' | 'declining_trend' | 'exam_remediation' | 'consistency' | 'balanced_growth';
  action: TutorAction;
}

export interface TutorMessage {
  id: string;
  role: TutorRole;
  content: string;
  timestamp: string;
  intent?: TutorIntent;
  actions?: TutorAction[];
  citations?: TutorCitation[];
  recommendations?: TutorRecommendation[];
  explanation?: {
    original?: string;
    corrected?: string;
    rule: string;
    example: string;
  };
}

export interface TutorConversation {
  id: string;
  userId: string;
  messages: TutorMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface TutorSkillContext {
  skill: string;
  score: number;
  trend: 'improving' | 'stable' | 'declining';
  attemptsCount: number;
  recentAccuracy: number;
  lastPracticed?: string;
}

export interface TutorUserProfile {
  userId: string;
  name: string;
  cefrEstimate: string;
  totalMinutes: number;
  totalXP: number;
  currentStreak: number;
}

export interface TutorContext {
  user: TutorUserProfile;
  overallScore: number;
  skills: TutorSkillContext[];
  weaknesses: string[];
  strengths: string[];
  srsDueCount: number;
  recentWriting?: { score: number; topic?: string; date?: string };
  recentSpeaking?: { score: number; topic?: string; date?: string };
  recentReading?: { score: number; wpm?: number; date?: string };
  recentListening?: { accuracy: number; date?: string };
  recentExam?: { examType: string; score: number; accuracy: number; date?: string };
  currentGoals?: { title: string; target: number; current: number; completed: boolean }[];
  recentActivities?: { type: string; title: string; timestamp: string }[];
}

export interface AdaptiveLearningPlanItem {
  id: string;
  skill: 'vocabulary' | 'listening' | 'reading' | 'writing' | 'speaking' | 'exam' | 'grammar';
  activity: string;
  difficulty: AdaptiveDifficulty;
  estimatedMinutes: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  target: string;
  route: string;
  completed?: boolean;
  periodOfDay?: 'morning' | 'afternoon' | 'evening';
}

export interface AdaptiveLearningPlan {
  id: string;
  userId: string;
  generatedAt: string;
  targetCefr: string;
  totalEstimatedMinutes: number;
  todayItems: AdaptiveLearningPlanItem[];
  sevenDayPlan?: { day: number; label: string; items: AdaptiveLearningPlanItem[] }[];
}

export interface LearningSessionItem {
  id: string;
  type: 'vocabulary' | 'listening' | 'reading' | 'writing' | 'speaking' | 'exam';
  title: string;
  instructions: string;
  route: string;
  targetWords?: string[];
}

export interface LearningSession {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: AdaptiveDifficulty;
  items: LearningSessionItem[];
  xpReward: number;
}

export interface TutorResponse {
  messageId: string;
  content: string;
  intent: TutorIntent;
  confidence: number;
  explanation?: {
    original?: string;
    corrected?: string;
    rule: string;
    example: string;
  };
  recommendations: TutorRecommendation[];
  actions: TutorAction[];
  citations: TutorCitation[];
  adaptivePlan?: AdaptiveLearningPlan;
  suggestedSession?: LearningSession;
}

// ----------------------------------------------------------------------------
// PURE DETERMINISTIC AI TUTOR ALGORITHMS
// ----------------------------------------------------------------------------

/**
 * Classifies user message intent deterministically based on keyword and semantic pattern matching.
 */
export function classifyTutorIntent(
  userMessage: string,
  context?: Partial<TutorContext>
): TutorIntent {
  if (!userMessage || typeof userMessage !== 'string') return 'general';
  const text = userMessage.toLowerCase().trim();

  if (!text) return 'general';

  // 1. Error explanations and corrections
  if (
    text.includes('why') ||
    text.includes('explain') ||
    text.includes('tại sao') ||
    text.includes('giải thích') ||
    text.includes('sao lại dùng') ||
    text.includes('tại sao sai') ||
    text.includes('lỗi sai') ||
    text.includes('sửa câu') ||
    text.includes('correct this') ||
    text.includes('fix this') ||
    text.includes('difference between') ||
    text.includes('phân biệt')
  ) {
    if (text.includes('pronun') || text.includes('phát âm') || text.includes('sound')) return 'pronunciation';
    if (text.includes('write') || text.includes('viết') || text.includes('essay')) return 'writing';
    if (text.includes('grammar') || text.includes('tense') || text.includes('went') || text.includes('ngữ pháp')) return 'grammar';
    return 'explain';
  }

  // 2. Planning & Schedule
  if (
    text.includes('plan') ||
    text.includes('kế hoạch') ||
    text.includes('lộ trình') ||
    text.includes('lịch học') ||
    text.includes('schedule') ||
    text.includes('7-day') ||
    text.includes('7 ngày')
  ) {
    return 'plan';
  }

  // 3. Recommendation ("What should I study today?")
  if (
    text.includes('what should i') ||
    text.includes('what to study') ||
    text.includes('what should i study') ||
    text.includes('hôm nay nên học gì') ||
    text.includes('nên học gì') ||
    text.includes('học gì') ||
    text.includes('đề xuất') ||
    text.includes('gợi ý') ||
    text.includes('recommend') ||
    text.includes('what to do next') ||
    text.includes('nên làm gì')
  ) {
    return 'recommend';
  }

  // 4. Exam Prep (IELTS, TOEIC, VSTEP)
  if (
    text.includes('ielts') ||
    text.includes('toeic') ||
    text.includes('vstep') ||
    text.includes('exam') ||
    text.includes('thi thử') ||
    text.includes('luyện thi') ||
    text.includes('điểm thi')
  ) {
    return 'exam';
  }

  // 5. Practice requests
  if (
    text.includes('practice') ||
    text.includes('luyện tập') ||
    text.includes('bài tập') ||
    text.includes('làm bài') ||
    text.includes('test me') ||
    text.includes('mini test')
  ) {
    return 'practice';
  }

  // 6. Review requests / SRS
  if (
    text.includes('review') ||
    text.includes('ôn tập') ||
    text.includes('srs') ||
    text.includes('flashcard') ||
    text.includes('thẻ từ') ||
    text.includes('từ vựng cần ôn')
  ) {
    return 'review';
  }

  // 7. Motivation & Encouragement
  if (
    text.includes('motivation') ||
    text.includes('chán học') ||
    text.includes('nản') ||
    text.includes('mệt mỏi') ||
    text.includes('động lực') ||
    text.includes('khó quá') ||
    text.includes('give up') ||
    text.includes('encourage')
  ) {
    return 'motivation';
  }

  // 8. Specific Skill Keywords
  if (text.includes('vocab') || text.includes('từ vựng') || text.includes('word') || text.includes('nghĩa của từ')) {
    return 'vocabulary';
  }
  if (text.includes('grammar') || text.includes('ngữ pháp') || text.includes('cấu trúc') || text.includes('tenses') || text.includes('thì')) {
    return 'grammar';
  }
  if (text.includes('speak') || text.includes('nói') || text.includes('shadowing') || text.includes('pronun') || text.includes('phát âm')) {
    return 'speaking';
  }
  if (text.includes('listen') || text.includes('nghe') || text.includes('dictation') || text.includes('chính tả')) {
    return 'listening';
  }
  if (text.includes('read') || text.includes('đọc') || text.includes('bài đọc') || text.includes('comprehension')) {
    return 'reading';
  }
  if (text.includes('writ') || text.includes('viết') || text.includes('bài viết') || text.includes('essay')) {
    return 'writing';
  }

  return 'general';
}

/**
 * Builds a structured, privacy-safe TutorContext from user learning analytics and history.
 */
export function buildTutorContext(data: any): TutorContext {
  const user: TutorUserProfile = {
    userId: data?.userId || data?.user?.userId || 'guest-user',
    name: data?.name || data?.user?.name || 'Learner',
    cefrEstimate: data?.cefrEstimate || data?.user?.cefrEstimate || 'B1',
    totalMinutes: Math.max(0, Number(data?.totalMinutes || data?.user?.totalMinutes) || 0),
    totalXP: Math.max(0, Number(data?.totalXP || data?.user?.totalXP) || 0),
    currentStreak: Math.max(0, Number(data?.currentStreak || data?.user?.currentStreak) || 0),
  };

  const defaultSkills: TutorSkillContext[] = [
    { skill: 'vocabulary', score: 75, trend: 'stable', attemptsCount: 15, recentAccuracy: 78 },
    { skill: 'listening', score: 70, trend: 'stable', attemptsCount: 10, recentAccuracy: 72 },
    { skill: 'reading', score: 72, trend: 'stable', attemptsCount: 8, recentAccuracy: 74 },
    { skill: 'writing', score: 68, trend: 'declining', attemptsCount: 6, recentAccuracy: 65 },
    { skill: 'speaking', score: 65, trend: 'declining', attemptsCount: 5, recentAccuracy: 62 },
    { skill: 'exam', score: 70, trend: 'stable', attemptsCount: 4, recentAccuracy: 70 },
  ];

  const skills: TutorSkillContext[] = Array.isArray(data?.skills) && data.skills.length > 0
    ? data.skills.map((s: any) => ({
        skill: String(s.skill || 'general'),
        score: Math.min(100, Math.max(0, Number(s.score) || 0)),
        trend: s.trend === 'improving' || s.trend === 'declining' ? s.trend : 'stable',
        attemptsCount: Math.max(0, Number(s.attemptsCount) || 0),
        recentAccuracy: Math.min(100, Math.max(0, Number(s.recentAccuracy) || 0)),
        lastPracticed: s.lastPracticed ? String(s.lastPracticed) : undefined,
      }))
    : defaultSkills;

  const weaknesses: string[] = Array.isArray(data?.weaknesses)
    ? data.weaknesses.map(String)
    : skills.filter((s) => s.score < 70).map((s) => s.skill);

  const strengths: string[] = Array.isArray(data?.strengths)
    ? data.strengths.map(String)
    : skills.filter((s) => s.score >= 75).map((s) => s.skill);

  const overallScore = Math.min(
    100,
    Math.max(
      0,
      data?.overallScore !== undefined
        ? Number(data.overallScore)
        : Math.round(skills.reduce((acc, s) => acc + s.score, 0) / Math.max(1, skills.length))
    )
  );

  const srsDueCount = Math.max(0, Number(data?.srsDueCount) || 0);

  return {
    user,
    overallScore,
    skills,
    weaknesses,
    strengths,
    srsDueCount,
    recentWriting: data?.recentWriting,
    recentSpeaking: data?.recentSpeaking,
    recentReading: data?.recentReading,
    recentListening: data?.recentListening,
    recentExam: data?.recentExam,
    currentGoals: Array.isArray(data?.currentGoals) ? data.currentGoals : [],
    recentActivities: Array.isArray(data?.recentActivities) ? data.recentActivities : [],
  };
}

/**
 * Determines the adaptive difficulty based on recent performance, trend, and completion rate.
 */
export function selectAdaptiveDifficulty(
  recentAccuracy: number,
  trend: 'improving' | 'stable' | 'declining',
  weaknessSeverity: number = 0,
  completionRate: number = 1.0
): AdaptiveDifficulty {
  if (recentAccuracy < 55 || weaknessSeverity >= 3 || completionRate < 0.5) {
    return 'easier';
  }
  if (recentAccuracy > 80 && trend === 'improving' && completionRate >= 0.8) {
    return 'harder';
  }
  return 'current';
}

/**
 * Calculates tutor confidence based on data completeness (0 to 100).
 */
export function calculateTutorConfidence(context: TutorContext): number {
  let confidence = 40; // Base baseline

  if (context.user.totalMinutes > 30) confidence += 15;
  if (context.user.totalXP > 100) confidence += 15;
  if (context.skills.some((s) => s.attemptsCount >= 3)) confidence += 15;
  if (context.recentWriting || context.recentSpeaking || context.recentReading) confidence += 15;

  return Math.min(100, Math.max(30, confidence));
}

/**
 * Strips PII, sensitive auth tokens, internal IDs and private community data from response.
 */
export function sanitizeTutorResponse(response: TutorResponse): TutorResponse {
  if (!response) return response;

  const sanitizeText = (txt: string) => {
    if (!txt) return txt;
    return txt
      .replace(/Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*/gi, '[REDACTED_TOKEN]')
      .replace(/password\s*[:=]\s*\S+/gi, 'password: [REDACTED]')
      .replace(/api[_-]?key\s*[:=]\s*\S+/gi, 'api_key: [REDACTED]')
      .replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/gi, '[REDACTED_EMAIL]');
  };

  return {
    ...response,
    content: sanitizeText(response.content),
    explanation: response.explanation
      ? {
          ...response.explanation,
          rule: sanitizeText(response.explanation.rule),
          example: sanitizeText(response.explanation.example),
        }
      : undefined,
    recommendations: (response.recommendations || []).map((rec) => ({
      ...rec,
      title: sanitizeText(rec.title),
      description: sanitizeText(rec.description),
    })),
  };
}

/**
 * Authoritative XP calculation for tutor and adaptive learning sessions.
 */
export function calculateAdaptiveXP(
  sessionLengthMinutes: number,
  score: number,
  difficulty: AdaptiveDifficulty
): number {
  const baseMinutesXP = Math.min(30, Math.max(5, sessionLengthMinutes * 2));
  const scoreBonus = Math.round((Math.min(100, Math.max(0, score)) / 100) * 15);
  const diffMultiplier = difficulty === 'harder' ? 1.3 : difficulty === 'easier' ? 0.9 : 1.0;

  const total = Math.round((baseMinutesXP + scoreBonus) * diffMultiplier);
  return Math.min(50, Math.max(5, total)); // strictly capped at 50 XP per session
}

/**
 * Maps performance on a practice session or tutor drill to SM-2 Quality (0 to 5).
 */
export function mapTutorPerformanceToSRSQuality(
  accuracy: number,
  timePerItemSec: number = 5
): number {
  if (accuracy >= 95 && timePerItemSec <= 4) return 5;
  if (accuracy >= 85) return 4;
  if (accuracy >= 70) return 3;
  if (accuracy >= 50) return 2;
  if (accuracy >= 25) return 1;
  return 0;
}

/**
 * Generates an adaptive 1-day or 7-day personalized learning plan.
 */
export function generateAdaptivePlan(
  context: TutorContext,
  days: number = 7,
  locale: string = 'vi'
): AdaptiveLearningPlan {
  const isVi = locale === 'vi';
  const todayItems: AdaptiveLearningPlanItem[] = [];

  // 1. High priority: Overdue SRS flashcards
  if (context.srsDueCount > 0) {
    todayItems.push({
      id: `plan-srs-${Date.now()}-1`,
      skill: 'vocabulary',
      activity: isVi ? `Ôn tập ${context.srsDueCount} thẻ SRS đến hạn` : `Review ${context.srsDueCount} due SRS flashcards`,
      difficulty: 'current',
      estimatedMinutes: Math.min(15, Math.max(5, Math.ceil(context.srsDueCount * 0.5))),
      priority: context.srsDueCount > 15 ? 'critical' : 'high',
      reason: isVi ? 'Củng cố trí nhớ dài hạn trước khi từ vựng bị quên' : 'Consolidate long-term retention before forgetting',
      target: isVi ? 'Đạt độ chính xác >= 85%' : 'Reach accuracy >= 85%',
      route: `/${locale}/srs`,
      periodOfDay: 'morning',
    });
  }

  // 2. High priority: Weakest skill remediation
  const sortedSkills = [...context.skills].sort((a, b) => a.score - b.score);
  const weakest: TutorSkillContext = sortedSkills[0] || { skill: 'speaking', score: 65, trend: 'declining', attemptsCount: 5, recentAccuracy: 60 };

  const skillRouteMap: Record<string, string> = {
    vocabulary: `/${locale}/vocabulary/practice`,
    listening: `/${locale}/listening/dictation`,
    reading: `/${locale}/reading`,
    writing: `/${locale}/writing/guided`,
    speaking: `/${locale}/speaking/repetition`,
    exam: `/${locale}/exam-practice`,
  };

  const skillNameVi: Record<string, string> = {
    vocabulary: 'Kho Từ Vựng',
    listening: 'Luyện Nghe (Dictation)',
    reading: 'Luyện Đọc Hiểu',
    writing: 'Luyện Viết Định Hướng',
    speaking: 'Luyện Nói & Phản Xạ',
    exam: 'Thi Thử & Giải Đề',
  };

  todayItems.push({
    id: `plan-weak-${Date.now()}-2`,
    skill: weakest.skill as any,
    activity: isVi ? `Khắc phục kỹ năng: ${skillNameVi[weakest.skill] || weakest.skill}` : `Remediate weak skill: ${weakest.skill}`,
    difficulty: selectAdaptiveDifficulty(weakest.recentAccuracy, weakest.trend),
    estimatedMinutes: 15,
    priority: 'high',
    reason: isVi ? `Điểm kỹ năng hiện tại (${weakest.score}%) cần được củng cố` : `Current skill score (${weakest.score}%) needs reinforcement`,
    target: isVi ? 'Hoàn thành 1 bài luyện với phản hồi từ AI' : 'Complete 1 practice session with AI feedback',
    route: skillRouteMap[weakest.skill] || `/${locale}/dashboard`,
    periodOfDay: 'afternoon',
  });

  // 3. Balanced skill reinforcement (Speaking / Writing / Listening)
  const secondarySkill: TutorSkillContext = sortedSkills[1] || { skill: 'listening', score: 70, trend: 'stable', attemptsCount: 5, recentAccuracy: 70 };
  todayItems.push({
    id: `plan-sec-${Date.now()}-3`,
    skill: secondarySkill.skill as any,
    activity: isVi ? `Luyện tập: ${skillNameVi[secondarySkill.skill] || secondarySkill.skill}` : `Practice: ${secondarySkill.skill}`,
    difficulty: 'current',
    estimatedMinutes: 15,
    priority: 'medium',
    reason: isVi ? 'Phát triển cân bằng các kỹ năng tiếp thu và sản sinh' : 'Balanced receptive and productive language practice',
    target: isVi ? 'Đạt điểm >= 75%' : 'Score >= 75%',
    route: skillRouteMap[secondarySkill.skill] || `/${locale}/dashboard`,
    periodOfDay: 'evening',
  });

  const totalEstimatedMinutes = todayItems.reduce((acc, it) => acc + it.estimatedMinutes, 0);

  // Generate 7-day schedule
  const dayLabelsVi = ['Hôm nay', 'Ngày 2', 'Ngày 3', 'Ngày 4', 'Ngày 5', 'Ngày 6', 'Ngày 7'];
  const dayLabelsEn = ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

  const sevenDayPlan = Array.from({ length: Math.min(7, Math.max(1, days)) }, (_, idx) => {
    const daySkill = sortedSkills[idx % sortedSkills.length] || weakest;
    return {
      day: idx + 1,
      label: isVi ? dayLabelsVi[idx] : dayLabelsEn[idx],
      items: idx === 0 ? todayItems : [
        {
          id: `plan-day-${idx + 1}-1`,
          skill: 'vocabulary' as const,
          activity: isVi ? 'Ôn tập SRS định kỳ' : 'Daily SRS Flashcard Review',
          difficulty: 'current' as const,
          estimatedMinutes: 10,
          priority: 'high' as const,
          reason: isVi ? 'Duy trì trí nhớ ngắn hạn sang dài hạn' : 'Spaced repetition maintenance',
          target: isVi ? 'Đạt độ chính xác >= 80%' : 'Accuracy >= 80%',
          route: `/${locale}/srs`,
        },
        {
          id: `plan-day-${idx + 1}-2`,
          skill: daySkill.skill as any,
          activity: isVi ? `Trọng tâm: ${skillNameVi[daySkill.skill] || daySkill.skill}` : `Focus: ${daySkill.skill}`,
          difficulty: 'current' as const,
          estimatedMinutes: 20,
          priority: 'medium' as const,
          reason: isVi ? 'Nâng cao cấp độ CEFR' : 'Advance CEFR benchmark',
          target: isVi ? 'Hoàn thành bài tập ngày' : 'Complete daily lesson',
          route: skillRouteMap[daySkill.skill] || `/${locale}/dashboard`,
        },
      ],
    };
  });

  return {
    id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: context.user.userId,
    generatedAt: new Date().toISOString(),
    targetCefr: context.user.cefrEstimate === 'A1' ? 'A2' : context.user.cefrEstimate === 'A2' ? 'B1' : context.user.cefrEstimate === 'B1' ? 'B2' : 'C1',
    totalEstimatedMinutes,
    todayItems,
    sevenDayPlan,
  };
}

/**
 * Generates a tailored mini practice session deterministic to seed and skill.
 */
export function generatePracticeSession(
  context: TutorContext,
  targetSkill: string = 'vocabulary',
  seed: number = 1,
  locale: string = 'vi'
): LearningSession {
  const isVi = locale === 'vi';
  const difficulty = selectAdaptiveDifficulty(
    context.skills.find((s) => s.skill === targetSkill)?.recentAccuracy || 70,
    context.skills.find((s) => s.skill === targetSkill)?.trend || 'stable'
  );

  const sessionMap: Record<string, { title: string; desc: string; route: string; items: LearningSessionItem[] }> = {
    vocabulary: {
      title: isVi ? 'Mini Session: Từ Vựng Học Thuật B1-B2' : 'Mini Session: Academic Vocabulary B1-B2',
      desc: isVi ? 'Luyện nhận diện và sử dụng 5 từ vựng trọng tâm trong ngữ cảnh thực tế.' : 'Master 5 target vocabulary words in realistic contexts.',
      route: `/${locale}/vocabulary/practice`,
      items: [
        { id: 'sess-v-1', type: 'vocabulary', title: 'Significance', instructions: 'Nêu nghĩa và ghép câu hoàn chỉnh với "significance"', route: `/${locale}/vocabulary/practice`, targetWords: ['significance'] },
        { id: 'sess-v-2', type: 'vocabulary', title: 'Substantial', instructions: 'Chọn từ đồng nghĩa với "substantial"', route: `/${locale}/vocabulary/practice`, targetWords: ['substantial'] },
        { id: 'sess-v-3', type: 'vocabulary', title: 'Collaborate', instructions: 'Điền từ vào chỗ trống trong đoạn văn về teamwork', route: `/${locale}/vocabulary/practice`, targetWords: ['collaborate'] },
      ],
    },
    speaking: {
      title: isVi ? 'Mini Session: Luyện Phát Âm & Phản Xạ Nói' : 'Mini Session: Speaking Rhythm & Shadowing',
      desc: isVi ? 'Thực hành lặp lại câu ngắn và ngữ điệu tự nhiên.' : 'Practice sentence repetition and natural rhythm cadence.',
      route: `/${locale}/speaking/repetition`,
      items: [
        { id: 'sess-s-1', type: 'speaking', title: 'Workplace Introduction', instructions: 'Nghe mẫu và nói lặp lại trong vòng 10 giây.', route: `/${locale}/speaking/repetition` },
        { id: 'sess-s-2', type: 'speaking', title: 'Expressing Opinions', instructions: 'Nói câu biểu đạt ý kiến cá nhân với liên từ "In my opinion".', route: `/${locale}/speaking/guided` },
      ],
    },
    writing: {
      title: isVi ? 'Mini Session: Cấu Trúc Câu & Viết Định Hướng' : 'Mini Session: Sentence Structure & Guided Writing',
      desc: isVi ? 'Sửa lỗi ngữ pháp thường gặp và viết 3 câu hoàn chỉnh.' : 'Correct common errors and draft 3 cohesive sentences.',
      route: `/${locale}/writing/guided`,
      items: [
        { id: 'sess-w-1', type: 'writing', title: 'Cause & Effect', instructions: 'Viết câu sử dụng "Due to" và "Consequently".', route: `/${locale}/writing/guided` },
      ],
    },
    listening: {
      title: isVi ? 'Mini Session: Nghe Chính Tả (Dictation)' : 'Mini Session: Dictation Accuracy',
      desc: isVi ? 'Nghe đoạn hội thoại ngắn và điền đúng 100% từ khóa.' : 'Listen to a short dialogue and transcribe keywords accurately.',
      route: `/${locale}/listening/dictation`,
      items: [
        { id: 'sess-l-1', type: 'listening', title: 'Travel Booking Dialogue', instructions: 'Nghe và gõ lại chính xác các thông tin vé máy bay.', route: `/${locale}/listening/dictation` },
      ],
    },
  };

  const selected = sessionMap[targetSkill] || sessionMap.vocabulary;

  return {
    id: `sess-${Date.now()}-${seed}`,
    title: selected.title,
    description: selected.desc,
    estimatedMinutes: 12,
    difficulty,
    items: selected.items,
    xpReward: 25,
  };
}

/**
 * Local Deterministic AI Tutor Engine: Generates pedagogical responses, explanations, actions, and recommendations.
 */
export function generateTutorResponse(
  intent: TutorIntent,
  context: TutorContext,
  userMessage: string,
  locale: string = 'vi'
): TutorResponse {
  const isVi = locale === 'vi';
  const messageId = `tut-msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const confidence = calculateTutorConfidence(context);

  const actions: TutorAction[] = [];
  const recommendations: TutorRecommendation[] = [];
  const citations: TutorCitation[] = [];

  let content = '';
  let explanation: TutorResponse['explanation'];

  // Add default analytics citations
  citations.push({
    source: 'analytics',
    snippet: isVi
      ? `Điểm tổng thể: ${context.overallScore}/100, Trình độ ước tính: ${context.user.cefrEstimate}, Streak: ${context.user.currentStreak} ngày.`
      : `Overall score: ${context.overallScore}/100, Estimated CEFR: ${context.user.cefrEstimate}, Streak: ${context.user.currentStreak} days.`,
  });

  const weakestSkill = [...context.skills].sort((a, b) => a.score - b.score)[0] || { skill: 'speaking', score: 65 };

  switch (intent) {
    case 'explain':
    case 'grammar': {
      // Deterministic grammatical explanations for common questions
      const lower = userMessage.toLowerCase();
      if (lower.includes('went') || lower.includes('go') || lower.includes('quá khứ')) {
        explanation = {
          original: 'I go to school yesterday.',
          corrected: 'I went to school yesterday.',
          rule: isVi
            ? 'Khi nói về hành động đã xảy ra và kết thúc trong quá khứ (có mốc thời gian như "yesterday", "last week"), động từ bất quy tắc "go" phải chuyển thành "went" ở thì Quá khứ đơn.'
            : 'When referring to a completed action in the past with a specific time marker (like "yesterday"), the irregular verb "go" changes to "went" (Past Simple).',
          example: 'She went to Paris last summer.',
        };
        content = isVi
          ? `Chào bạn! Về câu hỏi ngữ pháp của bạn:\n\nTrong tiếng Anh, thì **Quá khứ đơn (Past Simple)** được dùng cho sự việc đã hoàn tất trong quá khứ. Động từ "go" là bất quy tắc nên dạng V2 của nó là **"went"** (không phải "goed").`
          : `Hello! Regarding your grammar question:\n\nIn English, the **Past Simple** tense is used for finished events in the past. "Go" is an irregular verb, so its past form is **"went"**.`;
      } else if (lower.includes('a') || lower.includes('an') || lower.includes('mạo từ')) {
        explanation = {
          original: 'a apple / an book',
          corrected: 'an apple / a book',
          rule: isVi
            ? 'Dùng mạo từ "an" trước danh từ bắt đầu bằng nguyên âm phát âm (/a/, /e/, /i/, /o/, /u/) như "an apple", "an hour". Dùng "a" trước phụ âm phát âm.'
            : 'Use "an" before words starting with a vowel sound (/a/, /e/, /i/, /o/, /u/), e.g., "an apple", "an hour". Use "a" before consonant sounds.',
          example: 'He gave me an apple and a sandwich.',
        };
        content = isVi
          ? `Quy tắc chọn mạo từ **"a" vs "an"**:\n\nChúng ta dùng **"an"** trước các từ phát âm bắt đầu bằng nguyên âm (vowel sound), ví dụ *an umbrella*, *an apple*, *an hour*. Ngược lại dùng **"a"** trước phụ âm.`
          : `Rule for **"a" vs "an"**:\n\nUse **"an"** before words starting with a vowel sound (*an apple*, *an hour*), and **"a"** before consonant sounds.`;
      } else {
        content = isVi
          ? `Tôi đã phân tích thắc mắc ngữ pháp của bạn dựa trên quy tắc chuẩn CEFR. Để tránh lỗi sai tương tự, bạn nên chú ý đến sự hòa hợp giữa chủ ngữ và thì của câu.`
          : `I have analyzed your grammar question based on CEFR benchmarks. Ensure correct subject-verb agreement and appropriate tense usage.`;
      }

      actions.push({
        type: 'start_writing',
        label: isVi ? 'Luyện Viết Áp Dụng Ngữ Pháp' : 'Practice Grammar Writing',
        route: `/${locale}/writing/guided`,
        priority: 'high',
      });
      break;
    }

    case 'recommend':
    case 'plan': {
      const plan = generateAdaptivePlan(context, 7, locale);
      content = isVi
        ? `Dựa trên phân tích năng lực hiện tại (Điểm tổng quan: **${context.overallScore}/100**, Trình độ: **${context.user.cefrEstimate}**):\n\nKỹ năng cần tập trung nhất của bạn là **${weakestSkill.skill.toUpperCase()}** (${weakestSkill.score}%). Hôm nay bạn nên dành khoảng **${plan.totalEstimatedMinutes} phút** để thực hiện lộ trình dưới đây.`
        : `Based on your performance analytics (Overall Score: **${context.overallScore}/100**, Level: **${context.user.cefrEstimate}**):\n\nYour highest priority focus is **${weakestSkill.skill.toUpperCase()}** (${weakestSkill.score}%). Today's recommended target is **${plan.totalEstimatedMinutes} minutes**.`;

      if (context.srsDueCount > 0) {
        actions.push({
          type: 'start_srs',
          label: isVi ? `Ôn tập ${context.srsDueCount} thẻ SRS` : `Review ${context.srsDueCount} due SRS cards`,
          route: `/${locale}/srs`,
          priority: 'critical',
        });
      }

      actions.push({
        type: 'start_speaking',
        label: isVi ? 'Luyện Nói & Phản Xạ' : 'Practice Speaking',
        route: `/${locale}/speaking/repetition`,
        priority: 'high',
      });

      recommendations.push({
        id: 'rec-plan-1',
        title: isVi ? 'Kế hoạch học tập thích ứng 7 ngày' : '7-Day Adaptive Learning Plan',
        description: isVi ? 'Lộ trình tối ưu hóa giúp nâng điểm kỹ năng còn yếu.' : 'Optimized trajectory designed to reinforce your lowest-scoring skills.',
        priority: 'high',
        reason: 'declining_trend',
        action: {
          type: 'review_goal',
          label: isVi ? 'Xem Toàn Bộ Lộ Trình' : 'View Full Plan',
          route: `/${locale}/tutor/plan`,
        },
      });
      break;
    }

    case 'practice': {
      const session = generatePracticeSession(context, weakestSkill.skill, 1, locale);
      content = isVi
        ? `Tôi đã tạo một **Mini Practice Session** (~${session.estimatedMinutes} phút) tập trung vào **${session.title}** để bạn luyện tập ngay bây giờ!`
        : `I have generated a **Mini Practice Session** (~${session.estimatedMinutes} min) targeting **${session.title}** for immediate practice!`;

      actions.push({
        type: 'start_writing',
        label: isVi ? 'Bắt Đầu Bài Luyện' : 'Start Practice Session',
        route: session.items[0]?.route || `/${locale}/dashboard`,
        priority: 'critical',
      });
      break;
    }

    case 'review':
    case 'vocabulary': {
      content = isVi
        ? `Hiện tại bạn có **${context.srsDueCount} thẻ từ vựng** đến lịch ôn tập lặp lại ngắt quãng (SRS). Việc ôn từ đúng hạn sẽ giúp kích hoạt trí nhớ dài hạn và cải thiện điểm từ vựng.`
        : `You currently have **${context.srsDueCount} vocabulary flashcards** due for spaced repetition (SRS). Timely reviews convert short-term memory to long-term fluency.`;

      actions.push({
        type: 'start_srs',
        label: isVi ? 'Vào Thẻ SRS Ngay' : 'Open SRS Flashcards',
        route: `/${locale}/srs`,
        priority: 'critical',
      });

      actions.push({
        type: 'open_vocabulary',
        label: isVi ? 'Tra Cứu Kho Từ Vựng' : 'Vocabulary Hub',
        route: `/${locale}/vocabulary`,
        priority: 'medium',
      });
      break;
    }

    case 'motivation': {
      content = isVi
        ? `Bạn đang làm rất tốt! Bạn đã duy trì chuỗi **${context.user.currentStreak} ngày liên tiếp** và tích lũy được **${context.user.totalXP} XP**. Hãy dành chỉ 10 phút hôm nay để giữ vững phong độ nhé!`
        : `You are doing great! You have maintained a **${context.user.currentStreak}-day streak** and earned **${context.user.totalXP} XP**. Dedicate just 10 minutes today to keep your momentum alive!`;

      actions.push({
        type: 'start_speaking',
        label: isVi ? 'Bài Luyện 5 Phút Nhanh' : 'Quick 5-Min Drill',
        route: `/${locale}/speaking/pronunciation`,
        priority: 'high',
      });
      break;
    }

    case 'exam': {
      content = isVi
        ? `Đối với mục tiêu luyện thi (IELTS / TOEIC / VSTEP), chìa khóa là nắm vững cấu trúc đề và từ vựng học thuật. Hãy làm một bài thi thử ngắn để đo lường band điểm hiện tại.`
        : `For international exams (IELTS / TOEIC / VSTEP), mastering exam structure and high-frequency academic vocabulary is key. Try a full mock test to benchmark your scaled score.`;

      actions.push({
        type: 'start_exam',
        label: isVi ? 'Vào Phòng Thi Thử (Exam Lab)' : 'Enter Exam Practice Lab',
        route: `/${locale}/exam-practice`,
        priority: 'high',
      });
      break;
    }

    default: {
      content = isVi
        ? `Xin chào ${context.user.name}! Tôi là **AI Tutor Cá Nhân** của bạn tại LinguaFlow. Tôi có thể giúp bạn giải thích ngữ pháp, sửa lỗi bài viết/bài nói, sinh bài luyện tập mini hoặc đề xuất kế hoạch học tập tối ưu hôm nay. Bạn muốn bắt đầu từ đâu?`
        : `Hello ${context.user.name}! I am your **Personal AI Tutor** on LinguaFlow. I can explain grammar concepts, diagnose speaking/writing errors, generate mini practice sessions, or build an adaptive study plan for you today. How can I help?`;

      actions.push({
        type: 'start_srs',
        label: isVi ? 'Ôn Thẻ SRS' : 'Review SRS',
        route: `/${locale}/srs`,
        priority: 'medium',
      });

      actions.push({
        type: 'review_weakness',
        label: isVi ? 'Xem Phân Tích Kỹ Năng' : 'View Analytics',
        route: `/${locale}/analytics`,
        priority: 'medium',
      });
      break;
    }
  }

  const rawResponse: TutorResponse = {
    messageId,
    content,
    intent,
    confidence,
    explanation,
    recommendations,
    actions,
    citations,
  };

  return sanitizeTutorResponse(rawResponse);
}

