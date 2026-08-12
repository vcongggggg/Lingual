import { z } from 'zod';

// ============================================================================
// AUTH & USER CONTRACTS
// ============================================================================

export const RegisterSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
  displayName: z.string().min(2, 'Tên hiển thị quá ngắn'),
  interfaceLocale: z.string().default('vi'),
  timezone: z.string().default('Asia/Ho_Chi_Minh'),
});

export const LoginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export const UpdateProfileSchema = z.object({
  displayName: z.string().optional(),
  timezone: z.string().optional(),
  interfaceLocale: z.string().optional(),
  dailyGoalMinutes: z.number().min(5).max(120).optional(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  interfaceLocale: string;
  timezone: string;
  dailyGoalMinutes: number;
  totalXP: number;
  currentStreak: number;
  streakFreezes: number;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

// ============================================================================
// CURRICULUM & ATTEMPT (ANTI-CHEAT) CONTRACTS
// ============================================================================

export const StartAttemptSchema = z.object({
  sourceType: z.enum(['lesson', 'game', 'srs']),
  sourceId: z.string(),
});

export type StartAttemptDto = z.infer<typeof StartAttemptSchema>;

export interface StartAttemptResponse {
  attemptId: string;
  startedAt: string;
}

export const SubmitQuizAnswerSchema = z.object({
  exerciseId: z.string(),
  userAnswer: z.string(),
});

export const SubmitLessonQuizSchema = z.object({
  attemptId: z.string(),
  lessonId: z.string(),
  answers: z.array(SubmitQuizAnswerSchema),
});

export type SubmitLessonQuizDto = z.infer<typeof SubmitLessonQuizSchema>;

export interface QuizResult {
  lessonId: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  streakDays: number;
  unlockedNextLesson: boolean;
}

// ============================================================================
// SRS (SPACED REPETITION SYSTEM) CONTRACTS
// ============================================================================

export const SubmitSRSReviewSchema = z.object({
  wordId: z.string(),
  quality: z.number().min(0).max(5), // 0: Again, 2: Hard, 3: Good, 5: Easy
});

export type SubmitSRSReviewDto = z.infer<typeof SubmitSRSReviewSchema>;

export interface SRSItem {
  id: string;
  wordId: string;
  targetText: string;
  translation: string;
  phonetic?: string;
  audioUrl?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  cefrLevel: string;
  interval: number;
  repetition: number;
  efactor: number;
  dueDate: string;
}

// ============================================================================
// GAME CENTER & ANTI-CHEAT CONTRACTS
// ============================================================================

export const SubmitGameScoreSchema = z.object({
  attemptId: z.string(),
  gameType: z.enum(['word_match', 'sentence_scramble', 'typing_race', 'fill_blitz']),
  userAnswers: z.array(
    z.object({
      itemId: z.string(),
      answer: z.string(),
    })
  ),
  durationSeconds: z.number().min(1),
});

export type SubmitGameScoreDto = z.infer<typeof SubmitGameScoreSchema>;

export interface GameScoreResult {
  attemptId: string;
  gameType: string;
  correctAnswers: number;
  totalQuestions: number;
  finalScore: number;
  xpEarned: number;
  newStreakDays: number;
  totalUserXP: number;
}
