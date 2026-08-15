import { Router, Request, Response } from 'express';
import { learningTutorService } from '../services/tutor';
import { adaptiveLearningService } from '../services/adaptiveLearning';
import { generateTutorResponse } from '@linguaflow/domain';

export const tutorRouter = Router();

// In-memory rate limiter per IP / user
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_MINUTE = 60;

function rateLimitMiddleware(req: Request, res: Response, next: () => void) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + 60000 });
    return next();
  }

  if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Tutor request rate limit exceeded. Please wait a minute before sending more queries.',
    });
  }

  entry.count++;
  next();
}

/**
 * GET /context
 * Retrieves the full structured TutorContext for the current learner.
 */
tutorRouter.get('/context', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'u-demo-1';
  const context = learningTutorService.getTutorContext(userId);
  res.json({ context });
});

/**
 * POST /chat
 * Sends a query to the AI Tutor engine.
 */
tutorRouter.post('/chat', rateLimitMiddleware, async (req: Request, res: Response) => {
  const { message, locale = 'vi', userId = 'u-demo-1', customContext } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Bad Request', message: 'Message content is required.' });
  }

  if (message.length > 2000) {
    return res.status(400).json({
      error: 'Payload Too Large',
      message: 'Tutor message length cannot exceed 2000 characters.',
    });
  }

  try {
    const result = await learningTutorService.chat(userId, message.trim(), locale, customContext);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

/**
 * POST /plan
 * Generates or regenerates an adaptive learning plan.
 */
tutorRouter.post('/plan', (req: Request, res: Response) => {
  const { userId = 'u-demo-1', days = 7, locale = 'vi' } = req.body;
  const numDays = Math.min(30, Math.max(1, Number(days) || 7));
  const plan = adaptiveLearningService.getOrCreatePlan(userId, numDays, locale);
  res.status(201).json({ plan });
});

/**
 * GET /plan
 * Retrieves the active adaptive plan.
 */
tutorRouter.get('/plan', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'u-demo-1';
  const locale = (req.query.locale as string) || 'vi';
  const plan = adaptiveLearningService.getOrCreatePlan(userId, 7, locale);
  res.json({ plan });
});

/**
 * POST /session
 * Generates a tailored mini practice session.
 */
tutorRouter.post('/session', (req: Request, res: Response) => {
  const { userId = 'u-demo-1', skill = 'vocabulary', locale = 'vi' } = req.body;
  const session = adaptiveLearningService.createPracticeSession(userId, skill, locale);
  res.status(201).json({ session });
});

/**
 * POST /session/:id/complete
 * Authoritatively grades and completes a practice session.
 */
tutorRouter.post('/session/:id/complete', (req: Request, res: Response) => {
  const sessionId = req.params.id;
  const { userId = 'u-demo-1', score, durationMinutes = 10, accuracy = 80 } = req.body;

  if (score === undefined || typeof score !== 'number' || score < 0 || score > 100) {
    return res.status(400).json({ error: 'Bad Request', message: 'Valid score (0-100) is required.' });
  }

  const result = adaptiveLearningService.completeSession(userId, sessionId, {
    score,
    durationMinutes: Number(durationMinutes) || 10,
    accuracy: Number(accuracy) || 80,
  });

  res.status(200).json(result);
});

/**
 * GET /history
 * Retrieves conversation history and completed sessions.
 */
tutorRouter.get('/history', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'u-demo-1';
  const conversation = learningTutorService.getHistory(userId);
  const sessionHistory = adaptiveLearningService.getSessionHistory(userId);

  res.json({
    conversation,
    sessions: sessionHistory,
  });
});

/**
 * GET /recommendations
 * Retrieves prioritized tutor recommendations.
 */
tutorRouter.get('/recommendations', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'u-demo-1';
  const locale = (req.query.locale as string) || 'vi';
  const context = learningTutorService.getTutorContext(userId);
  const tutorRes = generateTutorResponse('recommend', context, 'recommendation query', locale);

  res.json({
    recommendations: tutorRes.recommendations,
    actions: tutorRes.actions,
  });
});

/**
 * POST /actions/execute
 * Triggers a tutor action transition.
 */
tutorRouter.post('/actions/execute', (req: Request, res: Response) => {
  const { actionType, route, userId = 'u-demo-1' } = req.body;

  if (!actionType || !route) {
    return res.status(400).json({ error: 'Bad Request', message: 'actionType and route are required.' });
  }

  res.json({
    status: 'ok',
    actionExecuted: actionType,
    targetRoute: route,
    timestamp: new Date().toISOString(),
  });
});
