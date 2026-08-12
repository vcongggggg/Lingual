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

async function apiFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
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

  const res = await fetch(url, {
    ...rest,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Lỗi kết nối server' }));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }

  return res.json();
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

export { API_BASE_URL };
export default apiFetch;


