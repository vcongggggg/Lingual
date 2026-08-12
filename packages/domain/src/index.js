"use strict";
/**
 * Pure Domain Logic for LinguaFlow
 * Language-agnostic, zero side-effects algorithms:
 * - SM-2 Spaced Repetition Algorithm
 * - Timezone-aware Streak & Streak Freeze Manager
 * - XP Calculator
 * - Server-side Anti-cheat Game & Quiz Evaluator
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSM2 = calculateSM2;
exports.getFormattedDateInTimezone = getFormattedDateInTimezone;
exports.updateStreakWithTimezone = updateStreakWithTimezone;
exports.calculateLessonXP = calculateLessonXP;
exports.calculateGameScore = calculateGameScore;
exports.validateAttemptTiming = validateAttemptTiming;
exports.evaluateGameAnswers = evaluateGameAnswers;
exports.calculateIeltsListeningBand = calculateIeltsListeningBand;
exports.calculateIeltsReadingBand = calculateIeltsReadingBand;
exports.calculateIeltsOverallBand = calculateIeltsOverallBand;
function calculateSM2(currentState = { repetition: 0, interval: 1, efactor: 2.5 }, quality) {
    const q = Math.max(0, Math.min(5, Math.round(quality)));
    let { repetition, interval, efactor } = currentState;
    if (q >= 3) {
        if (repetition === 0) {
            interval = 1;
        }
        else if (repetition === 1) {
            interval = 6;
        }
        else {
            interval = Math.round(interval * efactor);
        }
        repetition += 1;
    }
    else {
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
/**
 * Gets date string formatted as YYYY-MM-DD in given timezone
 */
function getFormattedDateInTimezone(date = new Date(), timezone = 'Asia/Ho_Chi_Minh') {
    try {
        const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: timezone });
        return formatter.format(date); // Output format: YYYY-MM-DD
    }
    catch {
        return date.toISOString().split('T')[0];
    }
}
/**
 * Updates user's streak considering timezone and streak freezes.
 */
function updateStreakWithTimezone(state, currentDate = new Date(), timezone = 'Asia/Ho_Chi_Minh') {
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
    }
    else if (diffDays === 2 && state.streakFreezes > 0) {
        // Missed exactly 1 day, but user has Streak Freeze!
        return {
            currentStreak: state.currentStreak + 1,
            streakFreezes: state.streakFreezes - 1,
            streakMaintained: true,
            freezeUsed: true,
        };
    }
    else {
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
function calculateLessonXP(score, totalQuestions, streakDays) {
    if (totalQuestions <= 0)
        return 0;
    const accuracy = score / totalQuestions;
    const baseXP = Math.round(accuracy * 50);
    const streakBonus = Math.min(25, Math.floor(streakDays * 2));
    const perfectBonus = accuracy === 1.0 ? 10 : 0;
    return baseXP + streakBonus + perfectBonus;
}
function calculateGameScore(input) {
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
function validateAttemptTiming(session, minDurationSeconds = 2, currentTime = new Date()) {
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
function evaluateGameAnswers(items, userAnswers) {
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
function calculateIeltsListeningBand(rawScore) {
    const score = Math.max(0, Math.min(40, Math.round(rawScore)));
    if (score >= 39)
        return 9.0;
    if (score >= 37)
        return 8.5;
    if (score >= 35)
        return 8.0;
    if (score >= 32)
        return 7.5;
    if (score >= 30)
        return 7.0;
    if (score >= 26)
        return 6.5;
    if (score >= 23)
        return 6.0;
    if (score >= 18)
        return 5.5;
    if (score >= 16)
        return 5.0;
    if (score >= 13)
        return 4.5;
    if (score >= 10)
        return 4.0;
    if (score >= 6)
        return 3.5;
    if (score >= 4)
        return 3.0;
    if (score >= 2)
        return 2.5;
    if (score >= 1)
        return 2.0;
    return 0.0;
}
function calculateIeltsReadingBand(rawScore, type = 'academic') {
    const score = Math.max(0, Math.min(40, Math.round(rawScore)));
    if (type === 'academic') {
        if (score >= 39)
            return 9.0;
        if (score >= 37)
            return 8.5;
        if (score >= 35)
            return 8.0;
        if (score >= 33)
            return 7.5;
        if (score >= 30)
            return 7.0;
        if (score >= 27)
            return 6.5;
        if (score >= 23)
            return 6.0;
        if (score >= 19)
            return 5.5;
        if (score >= 15)
            return 5.0;
        if (score >= 13)
            return 4.5;
        if (score >= 10)
            return 4.0;
        if (score >= 8)
            return 3.5;
        if (score >= 6)
            return 3.0;
        if (score >= 4)
            return 2.5;
        if (score >= 2)
            return 2.0;
        return 0.0;
    }
    else {
        // General Training
        if (score >= 40)
            return 9.0;
        if (score >= 39)
            return 8.5;
        if (score >= 37)
            return 8.0;
        if (score >= 36)
            return 7.5;
        if (score >= 34)
            return 7.0;
        if (score >= 32)
            return 6.5;
        if (score >= 30)
            return 6.0;
        if (score >= 27)
            return 5.5;
        if (score >= 23)
            return 5.0;
        if (score >= 19)
            return 4.5;
        if (score >= 15)
            return 4.0;
        if (score >= 12)
            return 3.5;
        if (score >= 9)
            return 3.0;
        if (score >= 6)
            return 2.5;
        if (score >= 3)
            return 2.0;
        return 0.0;
    }
}
function calculateIeltsOverallBand(scores) {
    const validScores = [];
    if (scores.listening !== undefined && scores.listening >= 0)
        validScores.push(scores.listening);
    if (scores.reading !== undefined && scores.reading >= 0)
        validScores.push(scores.reading);
    if (scores.writing !== undefined && scores.writing >= 0)
        validScores.push(scores.writing);
    if (scores.speaking !== undefined && scores.speaking >= 0)
        validScores.push(scores.speaking);
    if (validScores.length === 0)
        return 0.0;
    const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
    // IELTS rounding rule:
    // decimal < 0.25 -> round down to .0
    // 0.25 <= decimal < 0.75 -> round to .5
    // decimal >= 0.75 -> round up to .0 of next integer
    const floorVal = Math.floor(avg);
    const remainder = avg - floorVal;
    if (remainder < 0.25) {
        return floorVal;
    }
    else if (remainder < 0.75) {
        return floorVal + 0.5;
    }
    else {
        return floorVal + 1.0;
    }
}
