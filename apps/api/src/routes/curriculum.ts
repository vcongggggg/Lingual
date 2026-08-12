import { Router } from 'express';
import { SEED_UNITS, SEED_ACHIEVEMENTS } from '../../../../prisma/seed.js';
import { MOCK_USERS, MOCK_ATTEMPTS, MOCK_LESSON_PROGRESS } from './auth.js';
import {
  calculateLessonXP,
  updateStreakWithTimezone,
  validateAttemptTiming,
} from '../../../../packages/domain/src/index.js';

export const curriculumRouter = Router();

curriculumRouter.post('/attempts/start', (req, res) => {
  const { sourceType, sourceId, userId = 'demo-user-id-001' } = req.body;
  const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const attemptSession = {
    attemptId,
    userId,
    sourceType,
    sourceId,
    startedAt: new Date(),
  };

  MOCK_ATTEMPTS.push(attemptSession);

  return res.json({
    attemptId,
    startedAt: attemptSession.startedAt.toISOString(),
  });
});

curriculumRouter.get('/units', (req, res) => {
  res.json({ units: SEED_UNITS });
});

curriculumRouter.get('/lessons/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  for (const unit of SEED_UNITS) {
    const lesson = unit.lessons.find((l) => l.order.toString() === lessonId || l.title.includes(lessonId));
    if (lesson) {
      return res.json({ lesson });
    }
  }
  return res.json({ lesson: SEED_UNITS[0].lessons[0] });
});

curriculumRouter.post('/lessons/:lessonId/submit', (req, res) => {
  const { lessonId } = req.params;
  const { attemptId, answers, userId = 'demo-user-id-001' } = req.body;

  const attempt = MOCK_ATTEMPTS.find((a) => a.attemptId === attemptId);
  if (!attempt) {
    return res.status(400).json({ error: 'Attempt token không hợp lệ hoặc đã hết hạn.' });
  }

  const timing = validateAttemptTiming(attempt, 2);
  if (!timing.valid) {
    return res.status(400).json({ error: timing.error });
  }

  let totalQuestions = 0;
  let correctCount = 0;

  for (const unit of SEED_UNITS) {
    const lesson = unit.lessons.find((l) => l.order.toString() === lessonId || l.title.includes(lessonId)) || unit.lessons[0];
    totalQuestions = lesson.exercises.length;

    if (Array.isArray(answers)) {
      answers.forEach((ans: any, idx: number) => {
        const ex = lesson.exercises[idx];
        if (ex && ans.userAnswer && ans.userAnswer.trim().toLowerCase() === ex.correctAnswer.trim().toLowerCase()) {
          correctCount++;
        }
      });
    }
    break;
  }

  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

  const streakResult = updateStreakWithTimezone(
    {
      currentStreak: user.currentStreak,
      streakFreezes: user.streakFreezes,
      lastActiveDate: user.lastActiveDate,
    },
    new Date(),
    user.timezone
  );

  user.currentStreak = streakResult.currentStreak;
  user.streakFreezes = streakResult.streakFreezes;
  user.lastActiveDate = new Date().toISOString().split('T')[0];

  const xpEarned = calculateLessonXP(correctCount, totalQuestions, user.currentStreak);
  user.totalXP += xpEarned;

  MOCK_LESSON_PROGRESS.push({
    userId,
    lessonId,
    completed: true,
    bestScore: correctCount,
    completedAt: new Date().toISOString(),
  });

  return res.json({
    attemptId,
    lessonId,
    score: correctCount,
    totalQuestions,
    xpEarned,
    streakDays: user.currentStreak,
    streakFreezes: user.streakFreezes,
    freezeUsed: streakResult.freezeUsed,
    totalXP: user.totalXP,
    unlockedNextLesson: true,
  });
});

// ============================================================================
// CONTENT MANAGEMENT ROUTES (Curriculum Content Mutations & RBAC)
// ============================================================================
import { Roles, rolesGuard, AuthenticatedRequest } from '../middleware/rbac.js';
import { auditLogInterceptor } from '../middleware/auditLog.js';
import { canModifyContent } from '../../../../packages/domain/src/index.js';

export const MOCK_LESSONS_STORE: any[] = [];

/**
 * POST /api/v1/curriculum/lessons
 * Create lesson draft
 * Access: CONTENT_EDITOR, ADMIN, SUPER_ADMIN
 */
curriculumRouter.post(
  '/lessons',
  Roles('CONTENT_EDITOR', 'ADMIN', 'SUPER_ADMIN'),
  rolesGuard(['CONTENT_EDITOR', 'ADMIN', 'SUPER_ADMIN']),
  auditLogInterceptor('lesson.create_draft', 'Lesson'),
  (req: AuthenticatedRequest, res) => {
    const { title, description, unitId = 'unit-1', xpReward = 20 } = req.body;
    const lesson = {
      id: `lesson-${Date.now()}`,
      title,
      description,
      unitId,
      xpReward,
      status: 'draft',
      createdBy: req.user?.id || 'editor-id',
      createdAt: new Date(),
    };

    MOCK_LESSONS_STORE.push(lesson);
    req.auditMeta = {
      action: 'lesson.create_draft',
      resourceType: 'Lesson',
      resourceId: lesson.id,
      afterState: lesson,
    };

    return res.status(201).json({ message: 'Tạo bản nháp bài học thành công', lesson });
  }
);

/**
 * PUT /api/v1/curriculum/lessons/:lessonId
 * Edit lesson draft
 * Access: CONTENT_EDITOR (own only), CONTENT_REVIEWER, ADMIN, SUPER_ADMIN
 */
curriculumRouter.put(
  '/lessons/:lessonId',
  Roles('CONTENT_EDITOR', 'CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'),
  rolesGuard(['CONTENT_EDITOR', 'CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN']),
  auditLogInterceptor('lesson.update', 'Lesson'),
  (req: AuthenticatedRequest, res) => {
    const { lessonId } = req.params;
    const lesson = MOCK_LESSONS_STORE.find((l) => l.id === lessonId);

    if (!lesson) {
      return res.status(404).json({ error: 'Không tìm thấy bài học' });
    }

    // Ownership Check for CONTENT_EDITOR
    if (!canModifyContent(req.user!, lesson)) {
      return res.status(403).json({
        error: 'Truy cập bị từ chối: Ban biên tập (CONTENT_EDITOR) chỉ được phép chỉnh sửa bài do chính mình tạo',
      });
    }

    req.auditMeta = {
      action: 'lesson.update',
      resourceType: 'Lesson',
      resourceId: lesson.id,
      beforeState: { ...lesson },
      afterState: { ...lesson, ...req.body },
    };

    Object.assign(lesson, req.body);
    return res.json({ message: 'Cập nhật bài học thành công', lesson });
  }
);

/**
 * POST /api/v1/curriculum/lessons/:lessonId/publish
 * Publish lesson (draft -> review -> published)
 * Access: CONTENT_REVIEWER, ADMIN, SUPER_ADMIN
 */
curriculumRouter.post(
  '/lessons/:lessonId/publish',
  Roles('CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN'),
  rolesGuard(['CONTENT_REVIEWER', 'ADMIN', 'SUPER_ADMIN']),
  auditLogInterceptor('lesson.publish', 'Lesson'),
  (req: AuthenticatedRequest, res) => {
    const { lessonId } = req.params;
    const lesson = MOCK_LESSONS_STORE.find((l) => l.id === lessonId);

    if (!lesson) {
      return res.status(404).json({ error: 'Không tìm thấy bài học' });
    }

    req.auditMeta = {
      action: 'lesson.publish',
      resourceType: 'Lesson',
      resourceId: lesson.id,
      beforeState: { status: lesson.status },
      afterState: { status: 'published' },
    };

    lesson.status = 'published';
    return res.json({ message: 'Xuất bản bài học thành công', lesson });
  }
);

/**
 * DELETE /api/v1/curriculum/lessons/:lessonId
 * Delete published lesson
 * Access: ADMIN, SUPER_ADMIN ONLY
 */
curriculumRouter.delete(
  '/lessons/:lessonId',
  Roles('ADMIN', 'SUPER_ADMIN'),
  rolesGuard(['ADMIN', 'SUPER_ADMIN']),
  auditLogInterceptor('lesson.delete', 'Lesson'),
  (req: AuthenticatedRequest, res) => {
    const { lessonId } = req.params;
    const index = MOCK_LESSONS_STORE.findIndex((l) => l.id === lessonId);

    if (index === -1) {
      return res.status(404).json({ error: 'Không tìm thấy bài học' });
    }

    const [deleted] = MOCK_LESSONS_STORE.splice(index, 1);
    req.auditMeta = {
      action: 'lesson.delete',
      resourceType: 'Lesson',
      resourceId: lessonId,
      beforeState: deleted,
    };

    return res.json({ message: 'Xóa bài học thành công', lessonId });
  }
);

