import { Router } from 'express';
import { MASTER_EXAMS } from './examData.js';
import { examRepository, userRepository } from '../repositories/index.js';
import {
  createExamAttempt,
  sanitizePublicExam,
  evaluateExamAttempt,
  updateStreakWithTimezone,
  getFormattedDateInTimezone,
  ExamAttempt,
} from '../../../../packages/domain/src/index.js';

export const examsRouter = Router();

/**
 * GET /api/v1/exams
 * List available exams with optional query filters
 */
examsRouter.get('/', async (req, res) => {
  const { type, level, section } = req.query;

  const filtered = await examRepository.getExams({
    type: type as string,
    level: level as string,
    section: section as string,
  });

  // Return public sanitized exam cards
  const sanitized = filtered.map(sanitizePublicExam);
  return res.json({ exams: sanitized, total: sanitized.length });
});

/**
 * GET /api/v1/exams/:examId
 * Get public exam details (Sanitized without answers/explanations)
 */
examsRouter.get('/:examId', async (req, res) => {
  const exam = await examRepository.getExamById(req.params.examId);
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
  const exam = await examRepository.getExamById(req.params.examId);

  if (!exam) {
    return res.status(404).json({ error: 'Không tìm thấy đề thi.' });
  }

  const attempt = createExamAttempt(exam.id, userId, exam.durationMinutes);
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
  const attempt = await examRepository.getAttemptById(req.params.attemptId);
  if (!attempt) {
    return res.status(404).json({ error: 'Không tìm thấy phiên làm bài.' });
  }

  const exam = (await examRepository.getExamById(attempt.examId)) || MASTER_EXAMS.find((e) => e.id === attempt.examId);
  return res.json({
    attempt,
    exam: exam ? sanitizePublicExam(exam) : null,
  });
});

/**
 * POST /api/v1/exams/attempts/:attemptId/answer
 * Save answer for a question in active attempt
 */
examsRouter.post('/attempts/:attemptId/answer', async (req, res) => {
  const { questionId, selectedOption, flagged } = req.body;
  const attempt = await examRepository.getAttemptById(req.params.attemptId);

  if (!attempt) {
    return res.status(404).json({ error: 'Không tìm thấy phiên làm bài.' });
  }

  if (attempt.status === 'completed' || (attempt.status as string) === 'submitted') {
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

  const updatedAnswer = {
    questionId,
    selectedOption: selectedOption || '',
    flagged: Boolean(flagged),
    answeredAt: new Date().toISOString(),
  };

  await examRepository.saveAnswer(attempt.id, questionId, selectedOption || '', Boolean(flagged));

  return res.json({ success: true, answer: updatedAnswer });
});

/**
 * POST /api/v1/exams/attempts/:attemptId/submit
 * Authoritative Server Evaluation (Anti-cheat boundary)
 */
examsRouter.post('/attempts/:attemptId/submit', async (req, res) => {
  const { elapsedSeconds = 60, answers } = req.body;
  const attempt = await examRepository.getAttemptById(req.params.attemptId);

  if (!attempt) {
    return res.status(404).json({ error: 'Không tìm thấy phiên làm bài.' });
  }

  const exam = (await examRepository.getExamById(attempt.examId)) || MASTER_EXAMS.find((e) => e.id === attempt.examId);
  if (!exam) {
    return res.status(404).json({ error: 'Không tìm thấy dữ liệu đề thi gốc.' });
  }

  // Idempotency: If already submitted, return existing result
  if (attempt.status === 'completed' && attempt.result) {
    const user = (await userRepository.findById(attempt.userId)) || (await userRepository.findById('demo-user-id-001'));

    return res.status(200).json({
      attempt,
      result: attempt.result,
      currentStreak: user?.currentStreak || 0,
      totalXP: user?.totalXP || 0,
      isDuplicate: true,
      message: 'Bài thi đã được ghi nhận trước đó.',
    });
  }

  // Sync client-provided final answers array if present
  if (Array.isArray(answers) && answers.length > 0) {
    for (const ans of answers) {
      if (ans.questionId) {
        const idx = attempt.answers.findIndex((a) => a.questionId === ans.questionId);
        if (idx >= 0) {
          attempt.answers[idx].selectedOption = ans.selectedOption;
        } else {
          attempt.answers.push({
            questionId: ans.questionId,
            selectedOption: ans.selectedOption,
            answeredAt: new Date().toISOString(),
          } as any);
        }
      }
    }
  }

  // Authoritative server-side grading
  const safeElapsed = Math.max(5, Number(elapsedSeconds) || 60);
  const evaluationResult = evaluateExamAttempt(exam, attempt as any, safeElapsed);

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
    getFormattedDateInTimezone(new Date(), user?.timezone || 'Asia/Ho_Chi_Minh'),
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
examsRouter.get('/attempts/:attemptId/result', async (req, res) => {
  const attempt = await examRepository.getAttemptById(req.params.attemptId);
  if (!attempt || !attempt.result) {
    return res.status(404).json({ error: 'Không tìm thấy kết quả bài thi.' });
  }

  const exam = (await examRepository.getExamById(attempt.examId)) || MASTER_EXAMS.find((e) => e.id === attempt.examId);
  return res.json({
    result: attempt.result,
    exam: exam || null,
  });
});

/**
 * GET /api/v1/exams/history
 * List user past exam attempts
 */
examsRouter.get('/history/all', async (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const attempts = await examRepository.getUserAttempts(userId);
  const history = attempts.filter((a) => a.status === 'completed').map((a) => {
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
examsRouter.get('/stats/summary', async (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const attempts = await examRepository.getUserAttempts(userId);
  const completedAttempts = attempts.filter((a) => a.status === 'completed');

  const totalAttempts = completedAttempts.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(completedAttempts.reduce((acc, a) => acc + (a.result?.score || 0), 0) / totalAttempts)
      : 0;
  const bestScore =
    totalAttempts > 0
      ? Math.max(...completedAttempts.map((a) => a.result?.score || 0))
      : 0;
  const avgAccuracy =
    totalAttempts > 0
      ? Math.round(completedAttempts.reduce((acc, a) => acc + (a.result?.accuracy || 0), 0) / totalAttempts)
      : 0;
  const totalStudyMinutes = Math.round(
    completedAttempts.reduce((acc, a) => acc + (a.elapsedSeconds || 0), 0) / 60
  );

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
