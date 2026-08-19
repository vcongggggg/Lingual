import { Router } from 'express';
import { MOCK_USERS } from './auth.js';
import { MASTER_EXAMS } from './examData.js';
import { examRepository, userRepository } from '../repositories/index.js';
import {
  createExamAttempt,
  sanitizePublicExam,
  evaluateExamAttempt,
  updateStreakWithTimezone,
  ExamAttempt,
} from '../../../../packages/domain/src/index.js';

export const examsRouter = Router();

// In-memory Exam Attempts store
const MOCK_EXAM_ATTEMPTS: ExamAttempt[] = [];

// Seed an initial demo attempt
(() => {
  const initialAttempt: ExamAttempt = {
    id: 'att-demo-toeic-01',
    examId: 'exam-toeic-01',
    userId: 'demo-user-id-001',
    status: 'completed',
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() - 86400000 + 46 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 86400000 + 1200 * 1000).toISOString(),
    elapsedSeconds: 1200,
    answers: [
      { questionId: 't-l1-q1', selectedOption: 'A man is adjusting his necktie.' },
      { questionId: 't-l1-q2', selectedOption: 'On Ms. Lee’s reception desk.' },
      { questionId: 't-r1-q1', selectedOption: 'prior to' },
      { questionId: 't-r1-q2', selectedOption: 'remarkably' },
      { questionId: 't-r1-q3', selectedOption: 'unless' },
      { questionId: 't-r2-q1', selectedOption: 'To announce the rollout of a new inventory tracking system' },
      { questionId: 't-r2-q2', selectedOption: 'Attend a 30-minute orientation session' },
    ],
  };

  const exam = MASTER_EXAMS.find((e) => e.id === 'exam-toeic-01')!;
  initialAttempt.result = evaluateExamAttempt(exam, initialAttempt, 1200);
  MOCK_EXAM_ATTEMPTS.push(initialAttempt);
})();

/**
 * GET /api/v1/exams
 * List available exams with optional query filters
 */
examsRouter.get('/', (req, res) => {
  const { type, level, section } = req.query;

  let filtered = MASTER_EXAMS;
  if (type && type !== 'all') {
    filtered = filtered.filter((e) => e.type.toLowerCase() === (type as string).toLowerCase());
  }
  if (level && level !== 'all') {
    filtered = filtered.filter((e) => e.difficulty.toLowerCase() === (level as string).toLowerCase());
  }
  if (section && section !== 'all') {
    filtered = filtered.filter((e) => e.sections.some((s) => s.type.toLowerCase() === (section as string).toLowerCase()));
  }

  // Return public sanitized exam cards
  const sanitized = filtered.map(sanitizePublicExam);
  return res.json({ exams: sanitized, total: sanitized.length });
});

/**
 * GET /api/v1/exams/:examId
 * Get public exam details (Sanitized without answers/explanations)
 */
examsRouter.get('/:examId', (req, res) => {
  const exam = MASTER_EXAMS.find((e) => e.id === req.params.examId);
  if (!exam) {
    return res.status(404).json({ error: 'Không tìm thấy đề thi.' });
  }

  return res.json({ exam: sanitizePublicExam(exam) });
});

/**
 * POST /api/v1/exams/:examId/start
 * Create or initialize an exam attempt with authoritative timer
 */
examsRouter.post('/:examId/start', async (req, res) => {
  const { userId = 'demo-user-id-001' } = req.body;
  const exam = MASTER_EXAMS.find((e) => e.id === req.params.examId);

  if (!exam) {
    return res.status(404).json({ error: 'Không tìm thấy đề thi.' });
  }

  const attempt = createExamAttempt(exam.id, userId, exam.durationMinutes);
  MOCK_EXAM_ATTEMPTS.push(attempt);
  await examRepository.createAttempt(attempt as any);

  return res.status(201).json({
    attemptId: attempt.id,
    startedAt: attempt.startedAt,
    expiresAt: attempt.expiresAt,
    exam: sanitizePublicExam(exam),
  });
});

/**
 * GET /api/v1/exams/attempts/:attemptId
 * Retrieve current attempt state
 */
examsRouter.get('/attempts/:attemptId', async (req, res) => {
  const attempt = (await examRepository.getAttemptById(req.params.attemptId)) || MOCK_EXAM_ATTEMPTS.find((a) => a.id === req.params.attemptId);
  if (!attempt) {
    return res.status(404).json({ error: 'Không tìm thấy phiên làm bài.' });
  }

  const exam = MASTER_EXAMS.find((e) => e.id === attempt.examId);
  return res.json({
    attempt,
    exam: exam ? sanitizePublicExam(exam) : null,
  });
});

/**
 * POST /api/v1/exams/attempts/:attemptId/answer
 * Save answer for a question in active attempt
 */
examsRouter.post('/attempts/:attemptId/answer', (req, res) => {
  const { questionId, selectedOption, flagged } = req.body;
  const attempt = MOCK_EXAM_ATTEMPTS.find((a) => a.id === req.params.attemptId);

  if (!attempt) {
    return res.status(404).json({ error: 'Không tìm thấy phiên làm bài.' });
  }

  if (attempt.status === 'completed' || attempt.status === 'submitted') {
    return res.status(400).json({ error: 'Bài thi đã nộp, không thể sửa câu trả lời.' });
  }

  // Check attempt expiration
  if (new Date() > new Date(attempt.expiresAt)) {
    attempt.status = 'expired';
    return res.status(403).json({ error: 'Thời gian làm bài đã hết.' });
  }

  if (!questionId) {
    return res.status(400).json({ error: 'Thiếu mã câu hỏi (questionId).' });
  }

  const existingIdx = attempt.answers.findIndex((a) => a.questionId === questionId);
  const updatedAnswer = {
    questionId,
    selectedOption: selectedOption || '',
    flagged: Boolean(flagged),
    answeredAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    attempt.answers[existingIdx] = updatedAnswer;
  } else {
    attempt.answers.push(updatedAnswer);
  }

  return res.json({ success: true, answer: updatedAnswer });
});

/**
 * POST /api/v1/exams/attempts/:attemptId/submit
 * Authoritative Server Evaluation (Anti-cheat boundary)
 */
examsRouter.post('/attempts/:attemptId/submit', async (req, res) => {
  const { elapsedSeconds = 60, answers } = req.body;
  const attempt = MOCK_EXAM_ATTEMPTS.find((a) => a.id === req.params.attemptId);

  if (!attempt) {
    return res.status(404).json({ error: 'Không tìm thấy phiên làm bài.' });
  }

  const exam = MASTER_EXAMS.find((e) => e.id === attempt.examId);
  if (!exam) {
    return res.status(404).json({ error: 'Không tìm thấy dữ liệu đề thi gốc.' });
  }

  // Idempotency: If already submitted within last 5 seconds, return existing result
  if (attempt.status === 'completed' && attempt.result) {
    const defaultUser = {
      id: attempt.userId,
      timezone: 'Asia/Ho_Chi_Minh',
      totalXP: 150,
      currentStreak: 3,
      streakFreezes: 1,
      lastActiveDate: new Date().toISOString(),
    };
    const user = MOCK_USERS.find((u) => u.id === attempt.userId) || MOCK_USERS[0] || defaultUser;

    return res.status(200).json({
      attempt,
      result: attempt.result,
      currentStreak: user.currentStreak,
      totalXP: user.totalXP,
      isDuplicate: true,
      message: 'Bài thi đã được ghi nhận trước đó.',
    });
  }

  // Sync client-provided final answers array if present
  if (Array.isArray(answers) && answers.length > 0) {
    answers.forEach((ans) => {
      if (ans.questionId) {
        const idx = attempt.answers.findIndex((a) => a.questionId === ans.questionId);
        if (idx >= 0) {
          attempt.answers[idx].selectedOption = ans.selectedOption;
        } else {
          attempt.answers.push({
            questionId: ans.questionId,
            selectedOption: ans.selectedOption,
            answeredAt: new Date().toISOString(),
          });
        }
      }
    });
  }

  // Authoritative server-side grading
  const safeElapsed = Math.max(5, Number(elapsedSeconds) || 60);
  const evaluationResult = evaluateExamAttempt(exam, attempt, safeElapsed);

  attempt.status = 'completed';
  attempt.submittedAt = new Date().toISOString();
  attempt.elapsedSeconds = safeElapsed;
  attempt.result = evaluationResult;

  await examRepository.completeAttempt(attempt.id, evaluationResult, safeElapsed);

  // Authoritatively update user XP & Streak via UserRepository
  const user = (await userRepository.findById(attempt.userId)) || (await userRepository.findById('demo-user-id-001'));
  const streakResult = updateStreakWithTimezone(
    {
      currentStreak: user?.currentStreak || 0,
      streakFreezes: user?.streakFreezes || 1,
      lastActiveDate: user?.lastActiveDate || null,
    },
    new Date(),
    user?.timezone || 'Asia/Ho_Chi_Minh'
  );

  const updatedUser = await userRepository.updateStreakAndXP(
    attempt.userId,
    streakResult.currentStreak,
    streakResult.streakFreezes,
    new Date().toISOString().split('T')[0],
    evaluationResult.xpAwarded
  );

  return res.status(200).json({
    attempt,
    result: evaluationResult,
    currentStreak: updatedUser.currentStreak,
    totalXP: updatedUser.totalXP,
    message: 'Nộp bài thi thành công!',
  });
});

/**
 * GET /api/v1/exams/attempts/:attemptId/result
 * Retrieve completed exam result
 */
examsRouter.get('/attempts/:attemptId/result', (req, res) => {
  const attempt = MOCK_EXAM_ATTEMPTS.find((a) => a.id === req.params.attemptId);
  if (!attempt || !attempt.result) {
    return res.status(404).json({ error: 'Không tìm thấy kết quả bài thi.' });
  }

  const exam = MASTER_EXAMS.find((e) => e.id === attempt.examId);
  return res.json({
    result: attempt.result,
    exam: exam || null,
  });
});

/**
 * GET /api/v1/exams/history
 * List user past exam attempts
 */
examsRouter.get('/history/all', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const history = MOCK_EXAM_ATTEMPTS.filter((a) => a.userId === userId && a.status === 'completed').map((a) => {
    const exam = MASTER_EXAMS.find((e) => e.id === a.examId);
    return {
      attemptId: a.id,
      examId: a.examId,
      examTitle: exam?.title || a.examId,
      examType: exam?.type || 'toeic',
      difficulty: exam?.difficulty || 'B1',
      score: a.result?.score || 0,
      maxScore: a.result?.maxScore || 10,
      scaledScoreLabel: a.result?.scaledScoreLabel || '',
      accuracy: a.result?.accuracy || 0,
      grade: a.result?.grade || 'Good',
      elapsedSeconds: a.elapsedSeconds,
      xpAwarded: a.result?.xpAwarded || 0,
      submittedAt: a.submittedAt || a.startedAt,
    };
  });

  return res.json({ history, total: history.length });
});

/**
 * GET /api/v1/exams/stats
 * Aggregate user exam performance analytics
 */
examsRouter.get('/stats/summary', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const completedAttempts = MOCK_EXAM_ATTEMPTS.filter((a) => a.userId === userId && a.status === 'completed');

  const totalAttempts = completedAttempts.length || 1;
  const avgScore =
    completedAttempts.length > 0
      ? Math.round(completedAttempts.reduce((acc, a) => acc + (a.result?.score || 0), 0) / completedAttempts.length)
      : 7;
  const bestScore =
    completedAttempts.length > 0
      ? Math.max(...completedAttempts.map((a) => a.result?.score || 0))
      : 7;
  const avgAccuracy =
    completedAttempts.length > 0
      ? Math.round(completedAttempts.reduce((acc, a) => acc + (a.result?.accuracy || 0), 0) / completedAttempts.length)
      : 100;
  const totalStudyMinutes = Math.round(
    completedAttempts.reduce((acc, a) => acc + a.elapsedSeconds, 0) / 60
  ) || 20;

  return res.json({
    stats: {
      totalAttempts,
      avgScore,
      bestScore,
      avgAccuracy,
      totalStudyMinutes,
      strongestSection: 'Reading Comprehension (Part 5 & 7)',
      weakestSection: 'Listening Comprehension (Part 1 & 2)',
      scoreHistory: completedAttempts.map((a) => {
        const exam = MASTER_EXAMS.find((e) => e.id === a.examId);
        return {
          date: a.submittedAt ? a.submittedAt.split('T')[0] : '2026-08-15',
          score: a.result?.score || 0,
          examTitle: exam?.title || a.examId,
        };
      }),
    },
  });
});
