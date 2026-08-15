/**
 * Speaking API Client
 */

import { apiFetch } from '../api';
import { SpeakingPrompt, SpeakingResult, SpeakingFeedback } from '@linguaflow/domain';

export interface SpeakingPromptsFilter {
  mode?: string;
  difficulty?: string;
  cefr?: string;
  topic?: string;
  limit?: number;
}

export const speakingApi = {
  getPrompts: (filters?: SpeakingPromptsFilter) => {
    const params = new URLSearchParams();
    if (filters?.mode) params.set('mode', filters.mode);
    if (filters?.difficulty) params.set('difficulty', filters.difficulty);
    if (filters?.cefr) params.set('cefr', filters.cefr);
    if (filters?.topic) params.set('topic', filters.topic);
    if (filters?.limit) params.set('limit', filters.limit.toString());

    return apiFetch<{ prompts: SpeakingPrompt[] }>(`/speaking/prompts?${params.toString()}`);
  },

  getPromptById: (id: string) => {
    return apiFetch<{ prompt: SpeakingPrompt }>(`/speaking/prompts/${id}`);
  },

  analyze: (data: { promptId: string; transcript: string; durationMs: number }) => {
    return apiFetch<{ feedback: SpeakingFeedback }>('/speaking/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  submitAttempt: (data: { promptId: string; transcript: string; durationMs: number }) => {
    return apiFetch<SpeakingResult>('/speaking/attempts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getHistory: () => {
    return apiFetch<{ attempts: any[] }>('/speaking/history');
  },

  getStats: () => {
    return apiFetch<{ stats: any }>('/speaking/stats');
  },

  getRecommendations: (locale: string = 'vi') => {
    return apiFetch<{ recommendations: any[] }>(`/speaking/recommendations?locale=${locale}`);
  },
};
