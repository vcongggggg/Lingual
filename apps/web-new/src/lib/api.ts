// API Client for apps/web-new connecting to Lingual Production API
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lingual_token');
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lingual_token', token);
  document.cookie = `access_token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lingual_token');
  document.cookie = 'access_token=; path=/; max-age=0';
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMessage = data?.error || data?.message || `HTTP ${res.status}: Lỗi kết nối máy chủ`;
    throw new Error(errorMessage);
  }

  return data as T;
}

export const api = {
  // 1. Health check
  getHealth: () => fetchApi<{ status: string; version: string; database: string }>('/health'),

  // 2. Auth
  register: (payload: { email: string; password: string; displayName: string; interfaceLocale?: string; timezone?: string }) =>
    fetchApi<{ user: any; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    fetchApi<{ user: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => fetchApi<{ user: any }>('/auth/me'),

  logout: () => fetchApi<{ message: string }>('/auth/logout', { method: 'POST' }),

  // 3. SRS
  getSrsQueue: () => fetchApi<{ queue: any[]; stats: { dueToday: number; learning: number; mastered: number; newWords: number; totalWords: number } }>('/srs/queue'),

  reviewSrsWord: (wordId: string, quality: number) =>
    fetchApi<{ wordId: string; quality: number; nextInterval: number; nextRepetition: number; nextEFactor: number; dueDate: string; xpEarned: number; totalXP: number }>('/srs/review', {
      method: 'POST',
      body: JSON.stringify({ wordId, quality }),
    }),

  addSrsWord: (payload: { targetText: string; translation: string; phonetic?: string; exampleSentence?: string; cefrLevel?: string }) =>
    fetchApi<{ success: boolean; message: string; word: any }>('/srs/add', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // 4. Vocabulary
  getVocabularies: (limit = 100) => fetchApi<{ vocabularies: any[] }>(`/vocabulary?limit=${limit}`),

  // 5. IELTS
  getIeltsQuestions: () => fetchApi<{ tracks: any[]; questions: any[] }>('/ielts/practice/questions'),

  // 6. Games
  getGamesList: () =>
    Promise.resolve([
      { id: 'word-match', title: 'Nối Từ Siêu Tốc', desc: 'Ghép cặp từ vựng và nghĩa tiếng Việt trong 60 giây', badge: 'Từ vựng', icon: 'zap' },
      { id: 'scramble', title: 'Xếp Câu Trật Tự', desc: 'Sắp xếp các khối từ đảo lộn thành câu hoàn chỉnh', badge: 'Ngữ pháp', icon: 'shuffle' },
      { id: 'fast-typing', title: 'Gõ Phím Thần Tốc', desc: 'Gõ đúng chính tả từ vựng đang rơi để tăng tốc độ phản xạ', badge: 'Chính tả', icon: 'keyboard' },
      { id: 'word-fill', title: 'Điền Khuyết Thử Thách', desc: 'Chọn từ còn thiếu phù hợp nhất với ngữ cảnh câu', badge: 'Ngữ cảnh', icon: 'check-circle' },
    ]),
};
