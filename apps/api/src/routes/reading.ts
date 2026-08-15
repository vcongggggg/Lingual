import { Router } from 'express';
import { MOCK_USERS } from './auth.js';
import { MASTER_READING_ARTICLES } from '../data/reading.js';
import { readingRepository, userRepository } from '../repositories/index.js';
import {
  evaluateReadingAttempt,
  updateStreakWithTimezone,
  ReadingAttempt,
} from '../../../../packages/domain/src/index.js';

export const readingRouter = Router();

// In-memory reading attempts store
const MOCK_READING_ATTEMPTS: ReadingAttempt[] = [
  {
    id: 'att-r-1',
    userId: 'demo-user-id-001',
    articleId: 'a1-morning-coffee',
    mode: 'standard',
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86340000).toISOString(),
    elapsedSeconds: 60,
    answers: [
      { questionId: 'q1-1', selectedOption: 'Different morning habits worldwide', isCorrect: true },
      { questionId: 'q1-2', selectedOption: 'False', isCorrect: true },
      { questionId: 'q1-3', selectedOption: 'The strength and vitality to be active', isCorrect: true },
    ],
    score: 96,
    wpm: 165,
    xpAwarded: 35,
    vocabularyLearned: ['vocab-coffee', 'vocab-morning'],
    accuracy: 100,
  },
];

// In-memory reading progress tracking
const MOCK_READING_PROGRESS: Record<string, { currentParagraph: number; scrollProgress: number; updatedAt: string }> = {};

/**
 * GET /api/v1/reading/articles
 */
readingRouter.get('/articles', (req, res) => {
  const { level, topic, mode } = req.query;

  let filtered = MASTER_READING_ARTICLES;
  if (level && level !== 'all') {
    filtered = filtered.filter((a) => a.level === level);
  }
  if (topic && topic !== 'all') {
    filtered = filtered.filter((a) => a.topic.toLowerCase() === (topic as string).toLowerCase());
  }

  // Map to list view metadata (avoid returning full questions on list query)
  const list = filtered.map((a) => ({
    id: a.id,
    title: a.title,
    subtitle: a.subtitle,
    level: a.level,
    topic: a.topic,
    author: a.author,
    estimatedMinutes: a.estimatedMinutes,
    wordCount: a.wordCount,
    coverImage: a.coverImage,
    paragraphCount: a.paragraphs.length,
    vocabularyCount: a.vocabularyIds.length,
    questionCount: a.questions.length,
  }));

  return res.json({ articles: list, total: list.length });
});

/**
 * GET /api/v1/reading/articles/:id
 */
readingRouter.get('/articles/:id', (req, res) => {
  const article = MASTER_READING_ARTICLES.find((a) => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ error: 'Không tìm thấy bài đọc.' });
  }

  return res.json({ article });
});

/**
 * GET /api/v1/reading/articles/:id/questions
 */
readingRouter.get('/articles/:id/questions', (req, res) => {
  const article = MASTER_READING_ARTICLES.find((a) => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ error: 'Không tìm thấy bài đọc.' });
  }

  // Return questions without revealing correct answer prematurely
  const sanitizedQuestions = article.questions.map((q) => ({
    id: q.id,
    type: q.type,
    question: q.question,
    options: q.options,
    relatedParagraph: q.relatedParagraph,
    difficulty: q.difficulty,
  }));

  return res.json({ questions: sanitizedQuestions, total: sanitizedQuestions.length });
});

/**
 * POST /api/v1/reading/attempts
 * Server-side Authoritative Evaluation (Anti-cheat & Trust Boundary Protection)
 */
readingRouter.post('/attempts', async (req, res) => {
  const {
    articleId,
    mode = 'standard',
    answers = [],
    elapsedSeconds = 60,
    userId = 'demo-user-id-001',
  } = req.body;

  if (!articleId || typeof articleId !== 'string') {
    return res.status(400).json({ error: 'Thiếu mã bài đọc (articleId).' });
  }

  const article = MASTER_READING_ARTICLES.find((a) => a.id === articleId);
  if (!article) {
    return res.status(404).json({ error: 'Không tìm thấy bài đọc hợp lệ.' });
  }

  const validModes = ['guided', 'standard', 'challenge'];
  if (!validModes.includes(mode)) {
    return res.status(400).json({ error: 'Chế độ luyện đọc không hợp lệ.' });
  }

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'Danh sách câu trả lời không hợp lệ.' });
  }

  // Idempotency check: check if identical submission within 5 seconds for same user
  const recentDuplicate = MOCK_READING_ATTEMPTS.find(
    (a) =>
      a.userId === userId &&
      a.articleId === articleId &&
      Date.now() - new Date(a.completedAt).getTime() < 5000
  );

  if (recentDuplicate) {
    const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
    return res.status(200).json({
      attempt: recentDuplicate,
      currentStreak: user.currentStreak,
      totalXP: user.totalXP,
      isDuplicate: true,
      message: 'Kết quả bài đọc đã được ghi nhận trước đó.',
    });
  }

  // Authoritative Server Evaluation
  const safeElapsed = Math.max(5, Number(elapsedSeconds) || 30);
  const evaluation = evaluateReadingAttempt(article, answers, safeElapsed, mode);

  const newAttempt: ReadingAttempt = {
    id: `att-r-${Date.now()}`,
    userId,
    articleId,
    mode,
    startedAt: new Date(Date.now() - safeElapsed * 1000).toISOString(),
    completedAt: new Date().toISOString(),
    elapsedSeconds: safeElapsed,
    answers: evaluation.answersFeedback.map((fb) => ({
      questionId: fb.questionId,
      selectedOption: fb.selectedOption,
      isCorrect: fb.isCorrect,
    })),
    score: evaluation.score,
    wpm: evaluation.wpm,
    xpAwarded: evaluation.xpAwarded,
    vocabularyLearned: evaluation.vocabularyLearned,
    accuracy: evaluation.accuracy,
  };

  await readingRepository.createAttempt({
    id: newAttempt.id,
    userId,
    articleId,
    readingTimeSeconds: safeElapsed,
    wpm: evaluation.wpm,
    score: evaluation.score,
    accuracy: evaluation.accuracy,
    xpAwarded: evaluation.xpAwarded,
    answers: newAttempt.answers.map((a) => ({
      questionId: a.questionId,
      selectedAnswer: a.selectedOption,
      isCorrect: a.isCorrect,
    })),
    createdAt: newAttempt.completedAt,
  });

  MOCK_READING_ATTEMPTS.push(newAttempt);

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
    streakResult.lastActiveDate || new Date().toISOString().split('T')[0],
    evaluation.xpAwarded
  );

  return res.status(201).json({
    attempt: newAttempt,
    evaluation,
    feedback: evaluation,
    currentStreak: updatedUser.currentStreak,
    totalXP: updatedUser.totalXP,
    message: 'Lưu kết quả bài đọc thành công!',
  });
});

/**
 * GET /api/v1/reading/history
 */
readingRouter.get('/history', async (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const history = MOCK_READING_ATTEMPTS.filter((a) => a.userId === userId).sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return res.json({ history, total: history.length });
});

/**
 * GET /api/v1/reading/stats
 */
readingRouter.get('/stats', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const userAttempts = MOCK_READING_ATTEMPTS.filter((a) => a.userId === userId);

  const articlesCompleted = new Set(userAttempts.map((a) => a.articleId)).size;
  const readingMinutes = Math.round(userAttempts.reduce((acc, a) => acc + a.elapsedSeconds, 0) / 60);
  const avgComprehension =
    userAttempts.length > 0
      ? Math.round(userAttempts.reduce((acc, a) => acc + a.score, 0) / userAttempts.length)
      : 0;
  const wordsLearned = new Set(userAttempts.flatMap((a) => a.vocabularyLearned)).size;

  return res.json({
    stats: {
      articlesCompleted: articlesCompleted || 1,
      readingMinutes: readingMinutes || 2,
      avgComprehension: avgComprehension || 96,
      wordsLearned: wordsLearned || 5,
      readingStreakDays: 3,
    },
  });
});

/**
 * POST /api/v1/reading/progress
 */
readingRouter.post('/progress', (req, res) => {
  const { articleId, currentParagraph = 1, scrollProgress = 0, userId = 'demo-user-id-001' } = req.body;

  if (!articleId) {
    return res.status(400).json({ error: 'Thiếu articleId.' });
  }

  const key = `${userId}:${articleId}`;
  MOCK_READING_PROGRESS[key] = {
    currentParagraph: Number(currentParagraph),
    scrollProgress: Number(scrollProgress),
    updatedAt: new Date().toISOString(),
  };

  return res.json({ success: true, progress: MOCK_READING_PROGRESS[key] });
});

/**
 * POST /api/v1/reading/vocabulary/save
 */
readingRouter.post('/vocabulary/save', (req, res) => {
  const { word, meaning, cefrLevel = 'A1', articleId } = req.body;

  if (!word || typeof word !== 'string') {
    return res.status(400).json({ error: 'Từ vựng không hợp lệ.' });
  }

  return res.json({
    success: true,
    savedItem: {
      id: `vocab-${word.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      word,
      meaning: meaning || 'Từ vựng đã lưu từ bài đọc',
      cefrLevel,
      articleId,
      savedAt: new Date().toISOString(),
    },
    message: `Đã lưu từ "${word}" vào sổ từ vựng cá nhân!`,
  });
});
