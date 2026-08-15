/**
 * Learning Analytics & Personal Intelligence API Router
 */

import { Router, Request, Response } from 'express';
import { learningAnalyticsService } from '../services/learningAnalytics.js';

export const analyticsRouter = Router();

// Helper to resolve authenticated user securely
function resolveUserId(req: Request): string {
  // @ts-ignore
  if (req.user?.id) return req.user.id;
  // @ts-ignore
  if (req.user?.userId) return req.user.userId;
  const headerUser = req.headers['x-user-id'] as string;
  if (headerUser && typeof headerUser === 'string') return headerUser;
  const queryUser = req.query.userId as string;
  if (queryUser && typeof queryUser === 'string') return queryUser;
  return 'demo-user-id-001';
}

/**
 * GET /api/v1/analytics/overview
 * Returns comprehensive learning intelligence dashboard metrics
 */
analyticsRouter.get('/overview', (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    const overview = learningAnalyticsService.getOverview(userId);
    res.json(overview);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal analytics error' });
  }
});

/**
 * GET /api/v1/analytics/skills
 * Returns skill breakdown and historical accuracy
 */
analyticsRouter.get('/skills', (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    const skills = learningAnalyticsService.getSkillsPerformance(userId);
    res.json({ skills });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/v1/analytics/trends
 * Returns time-series performance data
 */
analyticsRouter.get('/trends', (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    const period = (req.query.period as string) || '7d';
    if (!['7d', '30d', '90d'].includes(period)) {
      return res.status(400).json({ error: 'Invalid period. Supported: 7d, 30d, 90d' });
    }
    const trends = learningAnalyticsService.getTrends(userId, period);
    res.json(trends);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/v1/analytics/heatmap
 * Returns 365-day study heatmap
 */
analyticsRouter.get('/heatmap', (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    const heatmap = learningAnalyticsService.getHeatmap(userId);
    res.json({ heatmap });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/v1/analytics/weaknesses
 * Returns detected skill weaknesses
 */
analyticsRouter.get('/weaknesses', (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    const weaknesses = learningAnalyticsService.getWeaknesses(userId);
    res.json({ weaknesses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/v1/analytics/recommendations
 * Returns personalized prioritized recommendations
 */
analyticsRouter.get('/recommendations', (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    const locale = (req.query.locale as string) || 'vi';
    const recommendations = learningAnalyticsService.getRecommendations(userId, locale);
    res.json({ recommendations });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/v1/analytics/goals
 * Returns active learning goals
 */
analyticsRouter.get('/goals', (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    const goals = learningAnalyticsService.getGoals(userId);
    res.json({ goals });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/v1/analytics/goals
 * Creates a new learning goal
 */
analyticsRouter.post('/goals', (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    const { type, target, endDate } = req.body;

    const validTypes = [
      'daily_minutes',
      'weekly_minutes',
      'weekly_xp',
      'vocabulary',
      'reading',
      'writing',
      'listening',
      'exam',
    ];

    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ error: `Invalid goal type. Must be one of: ${validTypes.join(', ')}` });
    }

    if (!target || typeof target !== 'number' || target <= 0) {
      return res.status(400).json({ error: 'Target must be a positive number' });
    }

    const newGoal = learningAnalyticsService.createGoal(userId, { type, target, endDate });
    res.status(201).json({ goal: newGoal });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/v1/analytics/goals/:id
 * Updates goal progress or completion status
 */
analyticsRouter.put('/goals/:id', (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    const goalId = req.params.id;
    const { current, target, completed } = req.body;

    const updated = learningAnalyticsService.updateGoal(userId, goalId, { current, target, completed });
    if (!updated) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ goal: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/v1/analytics/goals/:id
 * Deletes a goal
 */
analyticsRouter.delete('/goals/:id', (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    const goalId = req.params.id;

    const success = learningAnalyticsService.deleteGoal(userId, goalId);
    if (!success) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/v1/analytics/report/weekly
 * Returns structured weekly learning intelligence report
 */
analyticsRouter.get('/report/weekly', (req: Request, res: Response) => {
  try {
    const userId = resolveUserId(req);
    const report = learningAnalyticsService.getWeeklyReport(userId);
    res.json({ report });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
