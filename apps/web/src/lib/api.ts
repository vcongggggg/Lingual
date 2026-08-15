/**
 * Centralized API client for LinguaFlow frontend
 * Handles base URL, auth headers, error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('linguaflow_token');
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('linguaflow_token', token);
  }
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('linguaflow_token');
  }
}

export async function apiFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...rest,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Lỗi kết nối server' }));
      throw new Error(errorData.error || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    if (err instanceof TypeError || (err?.message && String(err.message).includes('fetch'))) {
      throw new Error('Không thể kết nối tới server API (http://localhost:4000). Vui lòng kiểm tra dịch vụ backend.');
    }
    throw err;
  }
}

// ============================================================================
// CURRICULUM API
// ============================================================================

export const curriculumApi = {
  getUnits: () => apiFetch('/curriculum/units'),
  getLesson: (lessonId: string) => apiFetch(`/curriculum/lessons/${lessonId}`),
  startAttempt: (sourceType: string, sourceId: string) =>
    apiFetch('/curriculum/attempts/start', {
      method: 'POST',
      body: JSON.stringify({ sourceType, sourceId }),
    }),
  submitLesson: (lessonId: string, data: { attemptId: string; answers: any[] }) =>
    apiFetch(`/curriculum/lessons/${lessonId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ ...data, lessonId }),
    }),
};

// ============================================================================
// SRS API
// ============================================================================

export const srsApi = {
  getQueue: () => apiFetch('/srs/queue'),
  getStats: () => apiFetch('/srs/stats'),
  submitReview: (wordId: string, quality: number) =>
    apiFetch('/srs/review', {
      method: 'POST',
      body: JSON.stringify({ wordId, quality }),
    }),
  addWord: (data: { targetText: string; translation?: string; phonetic?: string; exampleSentence?: string; cefrLevel?: string }) =>
    apiFetch('/srs/add', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// GAMES API
// ============================================================================

export const gamesApi = {
  getData: (gameType: string) => apiFetch(`/games/data/${gameType}`),
  startAttempt: (gameType: string) =>
    apiFetch('/curriculum/attempts/start', {
      method: 'POST',
      body: JSON.stringify({ sourceType: 'game', sourceId: gameType }),
    }),
  submitScore: (data: { attemptId: string; gameType: string; userAnswers: any[]; durationSeconds: number }) =>
    apiFetch('/games/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getHistory: () => apiFetch('/games/history'),
  getLeaderboard: () => apiFetch('/games/leaderboard'),
};

// ============================================================================
// DICTIONARY API
// ============================================================================

export const dictionaryApi = {
  search: (params: { q?: string; cefr?: string; partOfSpeech?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.set('q', params.q);
    if (params.cefr) queryParams.set('cefr', params.cefr);
    if (params.partOfSpeech) queryParams.set('partOfSpeech', params.partOfSpeech);
    if (params.limit) queryParams.set('limit', params.limit.toString());
    return apiFetch(`/dictionary/search?${queryParams.toString()}`);
  },
  bookmark: (wordId: string) =>
    apiFetch('/dictionary/bookmark', {
      method: 'POST',
      body: JSON.stringify({ wordId }),
    }),
  addToSrs: (wordId: string) =>
    apiFetch('/dictionary/add-to-srs', {
      method: 'POST',
      body: JSON.stringify({ wordId }),
    }),
};

// ============================================================================
// VOCABULARY API
// ============================================================================

export const vocabularyApi = {
  search: (params: { q?: string; cefr?: string; category?: string; partOfSpeech?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.set('q', params.q);
    if (params.cefr) queryParams.set('cefr', params.cefr);
    if (params.category) queryParams.set('category', params.category);
    if (params.partOfSpeech) queryParams.set('partOfSpeech', params.partOfSpeech);
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    return apiFetch(`/vocabulary/search?${queryParams.toString()}`);
  },
  getWord: (wordId: string) => apiFetch(`/vocabulary/word/${wordId}`),
  getFolders: () => apiFetch('/vocabulary/folders'),
  createFolder: (data: { name: string; description?: string; icon?: string; color?: string }) =>
    apiFetch('/vocabulary/folders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFolder: (folderId: string, data: { name?: string; description?: string; color?: string; icon?: string }) =>
    apiFetch(`/vocabulary/folders/${folderId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteFolder: (folderId: string) =>
    apiFetch(`/vocabulary/folders/${folderId}`, {
      method: 'DELETE',
    }),
  addWordToFolder: (folderId: string, wordId: string) =>
    apiFetch(`/vocabulary/folders/${folderId}/words`, {
      method: 'POST',
      body: JSON.stringify({ wordId }),
    }),
  removeWordFromFolder: (folderId: string, wordId: string) =>
    apiFetch(`/vocabulary/folders/${folderId}/words/${wordId}`, {
      method: 'DELETE',
    }),
  getSavedWords: (folderId?: string) => {
    const query = folderId ? `?folderId=${folderId}` : '';
    return apiFetch(`/vocabulary/saved${query}`);
  },
  saveWord: (data: { wordId?: string; targetText?: string; translation?: string; phonetic?: string; cefrLevel?: string }) =>
    apiFetch('/vocabulary/save', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getPractice: (params: { folderId?: string; limit?: number } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.folderId) queryParams.set('folderId', params.folderId);
    if (params.limit) queryParams.set('limit', params.limit.toString());
    return apiFetch(`/vocabulary/practice?${queryParams.toString()}`);
  },
  submitPractice: (data: { questions: any[]; answers: any[] }) =>
    apiFetch('/vocabulary/practice/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// WRITING API
// ============================================================================

export const writingApi = {
  getPrompts: (params: { mode?: string; difficulty?: string; category?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.mode) queryParams.set('mode', params.mode);
    if (params.difficulty) queryParams.set('difficulty', params.difficulty);
    if (params.category) queryParams.set('category', params.category);
    return apiFetch(`/writing/prompts?${queryParams.toString()}`);
  },
  analyze: (data: { promptId?: string; mode?: string; content: string; usedHint?: boolean; durationMs?: number }) =>
    apiFetch('/writing/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  submitAttempt: (data: {
    promptId?: string;
    mode?: string;
    content: string;
    score: number;
    xpAwarded: number;
    durationMs?: number;
  }) =>
    apiFetch('/writing/attempts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getHistory: () => apiFetch('/writing/history'),
  getStats: () => apiFetch('/writing/stats'),
};

// ============================================================================
// READING API
// ============================================================================

export const readingApi = {
  getArticles: (params: { level?: string; topic?: string; mode?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.level) queryParams.set('level', params.level);
    if (params.topic) queryParams.set('topic', params.topic);
    if (params.mode) queryParams.set('mode', params.mode);
    return apiFetch(`/reading/articles?${queryParams.toString()}`);
  },
  getArticle: (id: string) => apiFetch(`/reading/articles/${id}`),
  getQuestions: (id: string) => apiFetch(`/reading/articles/${id}/questions`),
  submitAttempt: (data: {
    articleId: string;
    mode?: string;
    answers: { questionId: string; selectedOption: string }[];
    elapsedSeconds: number;
  }) =>
    apiFetch('/reading/attempts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getHistory: () => apiFetch('/reading/history'),
  getStats: () => apiFetch('/reading/stats'),
  saveProgress: (data: { articleId: string; currentParagraph: number; scrollProgress: number }) =>
    apiFetch('/reading/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  saveVocabulary: (data: { word: string; meaning?: string; cefrLevel?: string; articleId?: string }) =>
    apiFetch('/reading/vocabulary/save', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// USER API
// ============================================================================

export const userApi = {
  getMe: () => apiFetch('/auth/me'),
  getProgress: () => apiFetch('/user/progress'),
  getStats: () => apiFetch('/user/stats'),
  getAchievements: () => apiFetch('/user/achievements'),
  login: (email: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),
  register: (data: { email: string; password: string; displayName: string; timezone?: string; interfaceLocale?: string }) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      skipAuth: true,
    }),
};

// ============================================================================
// IELTS API
// ============================================================================

export const ieltsApi = {
  getRoadmap: () => apiFetch('/ielts/roadmap'),
  getPracticeQuestions: (skill: string) => apiFetch(`/ielts/practice/${skill}`),
  getQuestionDetail: (id: string) => apiFetch(`/ielts/practice/question/${id}`),
  submitMockTest: (data: { userId?: string; type?: string; durationSec?: number; answers: Record<string, string> }) =>
    apiFetch('/ielts/mock-test/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  evaluateWriting: (data: { userId?: string; taskType?: string; prompt: string; essayText: string }) =>
    apiFetch('/ielts/writing/evaluate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// CHATBOT LINGLING API
// ============================================================================

export const chatbotApi = {
  sendMessage: (data: { message: string; history?: any[]; contextPage?: string }) =>
    apiFetch('/chatbot/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  streamMessage: async (
    data: { message: string; history?: any[]; contextPage?: string },
    callbacks: {
      onMetadata?: (meta: { usedOllama?: boolean; ragApplied?: boolean; ragRefs?: any[] }) => void;
      onToken?: (token: string) => void;
      onDone?: () => void;
      onError?: (err: any) => void;
    }
  ) => {
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/chatbot/stream`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          const eventMatch = block.match(/event:\s*(\w+)/);
          const dataMatch = block.match(/data:\s*(.+)/);

          if (eventMatch && dataMatch) {
            const eventName = eventMatch[1];
            try {
              const payload = JSON.parse(dataMatch[1]);
              if (eventName === 'metadata' && callbacks.onMetadata) {
                callbacks.onMetadata(payload);
              } else if (eventName === 'token' && callbacks.onToken && payload.token) {
                callbacks.onToken(payload.token);
              } else if (eventName === 'done' && callbacks.onDone) {
                callbacks.onDone();
              }
            } catch (pErr) {}
          }
        }
      }
      callbacks.onDone?.();
    } catch (err) {
      callbacks.onError?.(err);
    }
  },
};

// ============================================================================
// ADMIN MODULE API
// ============================================================================
export const adminApi = {
  getDashboard: () => apiFetch('/admin/dashboard'),
  getUsers: () => apiFetch('/admin/users'),
  updateUserRole: (userId: string, newRole: string) =>
    apiFetch(`/admin/users/${userId}/role`, { method: 'POST', body: JSON.stringify({ newRole }) }),
  toggleUserStatus: (userId: string) =>
    apiFetch(`/admin/users/${userId}/toggle-status`, { method: 'POST' }),
  getAuditLogs: () => apiFetch('/admin/audit-logs'),
  updateConfig: (configData: any) =>
    apiFetch('/admin/config', { method: 'POST', body: JSON.stringify(configData) }),
};

export { examsApi } from './exams/api';
export { communityApi } from './community/api';
export { analyticsApi } from './analytics/analyticsApi';
export { speakingApi } from './speaking/api';
export { tutorApi } from './tutor/tutorApi';

export { API_BASE_URL };
export default apiFetch;


