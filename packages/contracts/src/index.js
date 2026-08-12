"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitGameScoreSchema = exports.SubmitSRSReviewSchema = exports.SubmitLessonQuizSchema = exports.SubmitQuizAnswerSchema = exports.StartAttemptSchema = exports.UpdateProfileSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
// ============================================================================
// AUTH & USER CONTRACTS
// ============================================================================
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email không hợp lệ'),
    password: zod_1.z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
    displayName: zod_1.z.string().min(2, 'Tên hiển thị quá ngắn'),
    interfaceLocale: zod_1.z.string().default('vi'),
    timezone: zod_1.z.string().default('Asia/Ho_Chi_Minh'),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email không hợp lệ'),
    password: zod_1.z.string().min(1, 'Vui lòng nhập mật khẩu'),
});
exports.UpdateProfileSchema = zod_1.z.object({
    displayName: zod_1.z.string().optional(),
    timezone: zod_1.z.string().optional(),
    interfaceLocale: zod_1.z.string().optional(),
    dailyGoalMinutes: zod_1.z.number().min(5).max(120).optional(),
});
// ============================================================================
// CURRICULUM & ATTEMPT (ANTI-CHEAT) CONTRACTS
// ============================================================================
exports.StartAttemptSchema = zod_1.z.object({
    sourceType: zod_1.z.enum(['lesson', 'game', 'srs']),
    sourceId: zod_1.z.string(),
});
exports.SubmitQuizAnswerSchema = zod_1.z.object({
    exerciseId: zod_1.z.string(),
    userAnswer: zod_1.z.string(),
});
exports.SubmitLessonQuizSchema = zod_1.z.object({
    attemptId: zod_1.z.string(),
    lessonId: zod_1.z.string(),
    answers: zod_1.z.array(exports.SubmitQuizAnswerSchema),
});
// ============================================================================
// SRS (SPACED REPETITION SYSTEM) CONTRACTS
// ============================================================================
exports.SubmitSRSReviewSchema = zod_1.z.object({
    wordId: zod_1.z.string(),
    quality: zod_1.z.number().min(0).max(5), // 0: Again, 2: Hard, 3: Good, 5: Easy
});
// ============================================================================
// GAME CENTER & ANTI-CHEAT CONTRACTS
// ============================================================================
exports.SubmitGameScoreSchema = zod_1.z.object({
    attemptId: zod_1.z.string(),
    gameType: zod_1.z.enum(['word_match', 'sentence_scramble', 'typing_race', 'fill_blitz']),
    userAnswers: zod_1.z.array(zod_1.z.object({
        itemId: zod_1.z.string(),
        answer: zod_1.z.string(),
    })),
    durationSeconds: zod_1.z.number().min(1),
});
