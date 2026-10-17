/**
 * Exam Practice Lab API Client
 */

import { apiFetch } from '../api';

export const examsApi = {
  getExams: (params: { type?: string; level?: string; section?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.type) queryParams.set('type', params.type);
    if (params.level) queryParams.set('level', params.level);
    if (params.section) queryParams.set('section', params.section);
    return apiFetch(`/exams?${queryParams.toString()}`);
  },

  getExam: (examId: string) => apiFetch(`/exams/${examId}`),

  startExam: (examId: string, userId?: string) =>
    apiFetch(`/exams/${examId}/start`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  getAttempt: (attemptId: string) => apiFetch(`/exams/attempts/${attemptId}`),

  submitAnswer: (
    attemptId: string,
    data: { questionId: string; selectedOption: string; flagged?: boolean }
  ) =>
    apiFetch(`/exams/attempts/${attemptId}/answer`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  submitExam: (
    attemptId: string,
    data: { elapsedSeconds: number; answers?: { questionId: string; selectedOption: string }[] }
  ) =>
    apiFetch(`/exams/attempts/${attemptId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getExamResult: (attemptId: string) => apiFetch(`/exams/attempts/${attemptId}/result`),

  getExamHistory: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/exams/history/all${query}`);
  },

  getExamStats: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/exams/stats/summary${query}`);
  },
};
