/**
 * Learning Analytics & Personal Intelligence API Client
 */

import { apiFetch } from '../api';

export const analyticsApi = {
  getOverview: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/analytics/overview${query}`);
  },

  getSkills: (period?: string, userId?: string) => {
    const params = new URLSearchParams();
    if (period) params.set('period', period);
    if (userId) params.set('userId', userId);
    return apiFetch(`/analytics/skills?${params.toString()}`);
  },

  getTrends: (period: string = '7d', userId?: string) => {
    const params = new URLSearchParams({ period });
    if (userId) params.set('userId', userId);
    return apiFetch(`/analytics/trends?${params.toString()}`);
  },

  getHeatmap: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/analytics/heatmap${query}`);
  },

  getWeaknesses: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/analytics/weaknesses${query}`);
  },

  getRecommendations: (locale: string = 'vi', userId?: string) => {
    const params = new URLSearchParams({ locale });
    if (userId) params.set('userId', userId);
    return apiFetch(`/analytics/recommendations?${params.toString()}`);
  },

  getGoals: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/analytics/goals${query}`);
  },

  createGoal: (data: { type: string; target: number; endDate?: string }, userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/analytics/goals${query}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateGoal: (
    goalId: string,
    data: { current?: number; target?: number; completed?: boolean },
    userId?: string
  ) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/analytics/goals/${goalId}${query}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteGoal: (goalId: string, userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/analytics/goals/${goalId}${query}`, {
      method: 'DELETE',
    });
  },

  getWeeklyReport: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/analytics/report/weekly${query}`);
  },
};
