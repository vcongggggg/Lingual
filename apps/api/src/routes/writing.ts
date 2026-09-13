import { Router } from 'express';
import { MOCK_USERS } from './auth.js';
import { writingRepository, userRepository } from '../repositories/index.js';
import {
  evaluateWritingSubmission,
  updateStreakWithTimezone,
  WritingPrompt,
  WritingSubmission,
  WritingResult,
} from '../../../../packages/domain/src/index.js';
import { MASTER_WRITING_PROMPTS } from '../data/writingExpandedData.js';

export const writingRouter = Router();

// In-memory master writing prompts
const MOCK_PROMPTS: WritingPrompt[] = MASTER_WRITING_PROMPTS;


// In-memory writing attempts store
const MOCK_WRITING_ATTEMPTS: Array<{
  id: string;
  userId: string;
  promptId: string;
  mode: string;
  content: string;
  wordCount: number;
  score: number;
  xpAwarded: number;
  durationMs: number;
  createdAt: string;
}> = [
  {
    id: 'att-w-1',
    userId: 'demo-user-id-001',
    promptId: 'see-write-a1-morning',
    mode: 'see-write',
    content: 'Every morning I wake up and drink hot coffee.',
    wordCount: 9,
    score: 92,
    xpAwarded: 25,
    durationMs: 45000,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

/**
 * GET /api/v1/writing/prompts
 */
writingRouter.get('/prompts', async (req, res) => {
  const { mode, difficulty, category } = req.query;

  const prompts = await writingRepository.getPrompts({
    mode: mode as string,
    difficulty: difficulty as string,
    category: category as string,
  });

  return res.json({ prompts, total: prompts.length });
});

/**
 * POST /api/v1/writing/analyze
 */
writingRouter.post('/analyze', async (req, res) => {
  const { promptId, mode = 'see-write', content = '', usedHint = false, durationMs = 0 } = req.body;

  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'Nội dung bài viết không hợp lệ.' });
  }

  if (content.length > 5000) {
    return res.status(400).json({ error: 'Nội dung bài viết vượt quá giới hạn 5000 ký tự.' });
  }

  const validModes = ['see-write', 'guided', 'free'];
  if (mode && !validModes.includes(mode)) {
    return res.status(400).json({ error: 'Chế độ luyện viết không hợp lệ.' });
  }

  const prompt = promptId ? await writingRepository.getPromptById(promptId) : null;
  const submission: WritingSubmission = {
    promptId: promptId || 'custom',
    mode,
    content: content.trim(),
    usedHint,
    durationMs,
  };

  const result: WritingResult = evaluateWritingSubmission(submission, prompt);
  return res.json({ result });
});

/**
 * POST /api/v1/writing/attempts
 * Hardened with Server-side Authoritative Evaluation (Anti-cheat & Trust Boundary Protection)
 */
writingRouter.post('/attempts', async (req, res) => {
  const {
    promptId,
    mode = 'see-write',
    content = '',
    usedHint = false,
    durationMs = 0,
    userId = 'demo-user-id-001',
  } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Nội dung bài viết không được để trống.' });
  }

  if (content.length > 5000) {
    return res.status(400).json({ error: 'Nội dung bài viết vượt quá giới hạn cho phép.' });
  }

  const validModes = ['see-write', 'guided', 'free'];
  if (!validModes.includes(mode)) {
    return res.status(400).json({ error: 'Chế độ luyện viết không hợp lệ.' });
  }

  // Server-side Authoritative Evaluation: Derives score & XP reliably
  const prompt = promptId ? await writingRepository.getPromptById(promptId) : null;
  const evaluation = evaluateWritingSubmission(
    {
      promptId: promptId || 'custom',
      mode,
      content: content.trim(),
      usedHint,
      durationMs,
    },
    prompt
  );

  const wordCount = evaluation.wordCount;
  const authoritativeScore = evaluation.score;
  const authoritativeXP = evaluation.xpAwarded;

  // Idempotency check: prevent duplicate rapid double submits from inflating XP/streak
  const recentDuplicate = await writingRepository.findRecentDuplicate(
    userId,
    promptId || 'custom',
    content
  );

  if (recentDuplicate) {
    const user = (await userRepository.findById(userId)) || (await userRepository.findById('demo-user-id-001'));
    return res.status(200).json({
      attempt: recentDuplicate,
      currentStreak: user?.currentStreak || 0,
      totalXP: user?.totalXP || 0,
      isDuplicate: true,
      message: 'Bài viết đã được ghi nhận trước đó.',
    });
  }

  const newAttempt = await writingRepository.createAttempt({
    id: `att-w-${Date.now()}`,
    userId,
    promptId: promptId || 'custom',
    mode,
    content: content.trim(),
    wordCount,
    score: authoritativeScore,
    xpAwarded: authoritativeXP,
    durationMs,
    createdAt: new Date().toISOString(),
  });

  // Persist detailed criteria feedback report
  await writingRepository.saveFeedbackReport({
    attemptId: newAttempt.id,
    overallScore: authoritativeScore,
    grammarScore: evaluation.feedback?.grammarScore || authoritativeScore,
    vocabularyScore: evaluation.feedback?.vocabularyScore || authoritativeScore,
    naturalnessScore: evaluation.feedback?.naturalnessScore || authoritativeScore,
    relevanceScore: evaluation.feedback?.relevanceScore || authoritativeScore,
    completenessScore: evaluation.feedback?.completenessScore || authoritativeScore,
    grade: evaluation.feedback?.grade || 'B',
    correctionsJson: JSON.stringify(evaluation.corrections || []),
    strengthsJson: JSON.stringify(evaluation.feedback?.strengths || []),
    suggestionsJson: JSON.stringify(evaluation.feedback?.suggestions || []),
    vocabularySuggestionsJson: JSON.stringify(evaluation.vocabularySuggestions || []),
  });

  // Authoritatively update user XP & Streak via UserRepository
  const user = (await userRepository.findById(userId)) || (await userRepository.findById('demo-user-id-001'));
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
    userId,
    streakResult.currentStreak,
    streakResult.streakFreezes,
    new Date().toISOString().split('T')[0],
    authoritativeXP
  );

  return res.status(201).json({
    attempt: newAttempt,
    currentStreak: updatedUser.currentStreak,
    totalXP: updatedUser.totalXP,
    message: 'Lưu kết quả bài viết thành công!',
  });
});

/**
 * GET /api/v1/writing/history
 */
writingRouter.get('/history', async (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const history = await writingRepository.getUserAttempts(userId);

  return res.json({ history, total: history.length });
});

/**
 * GET /api/v1/writing/stats
 */
writingRouter.get('/stats', async (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const userAttempts = MOCK_WRITING_ATTEMPTS.filter((a) => a.userId === userId);

  const totalAttempts = userAttempts.length;
  const totalWords = userAttempts.reduce((acc, a) => acc + a.wordCount, 0);
  const avgScore =
    totalAttempts > 0
      ? Math.round(userAttempts.reduce((acc, a) => acc + a.score, 0) / totalAttempts)
      : 0;

  return res.json({
    stats: {
      totalAttempts,
      totalWords,
      avgScore,
      writingStreakDays: 3,
    },
  });
});
