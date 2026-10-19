// API Client for Lingual Web App connecting to Lingual Production API
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
  getIeltsRoadmap: () => fetchApi<{ success: boolean; tracks: any[] }>('/ielts/roadmap'),
  getIeltsPracticeQuestions: (skill: string) => fetchApi<{ success: boolean; skill: string; questions: any[] }>(`/ielts/practice/${skill}`),
  getIeltsQuestionDetail: (id: string) => fetchApi<{ success: boolean; question: any }>(`/ielts/practice/question/${id}`),
  getIeltsMockTestQuestions: () => fetchApi<{ success: boolean; readingTotal: number; listeningTotal: number; questions: any[]; readingPassages: any[]; listeningSections: any[] }>('/ielts/mock-test/questions'),
  submitIeltsMockTest: (data: { userId?: string; type?: string; durationSec?: number; answers: Record<string, string> }) =>
    fetchApi<{ success: boolean; attempt: any }>('/ielts/mock-test/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  evaluateIeltsWriting: (data: { userId?: string; taskType?: string; prompt: string; essayText: string }) =>
    fetchApi<{ success: boolean; evaluation: any }>('/ielts/writing/evaluate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 6. Analytics
  getAnalyticsOverview: () => fetchApi<{
    overallScore: number;
    estimatedCEFR: string;
    totalStudyMinutes: number;
    totalXP: number;
    currentStreak: number;
    weeklyMinutes: number;
    skills: any[];
    weaknesses: any[];
    strengths: any[];
    goals: any[];
  }>('/analytics/overview'),

  // 7. Games
  getGamesList: () =>
    Promise.resolve([
      { id: 'word-match', title: 'Nối từ siêu tốc', englishTitle: 'Speed Word Match', desc: 'Ghép cặp từ vựng và nghĩa tiếng Việt trong 60 giây', badge: 'Từ vựng', xp: '+25 XP', icon: 'zap' },
      { id: 'scramble', title: 'Xếp câu trật tự', englishTitle: 'Sentence Scramble', desc: 'Sắp xếp các khối từ đảo lộn thành câu hoàn chỉnh', badge: 'Ngữ pháp', xp: '+30 XP', icon: 'shuffle' },
      { id: 'fast-typing', title: 'Gõ phím thần tốc', englishTitle: 'Spelling Rain', desc: 'Gõ đúng chính tả từ vựng đang rơi để tăng tốc độ phản xạ', badge: 'Chính tả', xp: '+40 XP', icon: 'keyboard' },
      { id: 'word-fill', title: 'Điền khuyết ngữ cảnh', englishTitle: 'Context Cloze', desc: 'Chọn từ còn thiếu phù hợp nhất với ngữ cảnh câu văn bản xứ', badge: 'Ngữ cảnh', xp: '+20 XP', icon: 'check-circle' },
    ]),
  getGamesLeaderboard: (gameType?: string) => fetchApi<{ leaderboard: any[] }>(`/games/leaderboard${gameType ? `?gameType=${gameType}` : ''}`),
  getGameData: (type: string, difficulty?: string) => fetchApi<any>(`/games/data?type=${type}&difficulty=${difficulty || 'all'}`),
  submitGameScore: (data: any) => fetchApi<any>('/games/submit', { method: 'POST', body: JSON.stringify(data) }),

  // 8. Dictionary
  searchDictionary: (params?: { q?: string; cefr?: string; partOfSpeech?: string; page?: number; limit?: number }) => {
    const qp = new URLSearchParams();
    if (params?.q) qp.append('q', params.q);
    if (params?.cefr && params.cefr !== 'all') qp.append('cefr', params.cefr);
    if (params?.partOfSpeech && params.partOfSpeech !== 'all') qp.append('partOfSpeech', params.partOfSpeech);
    if (params?.page) qp.append('page', params.page.toString());
    if (params?.limit) qp.append('limit', params.limit.toString());
    return fetchApi<{ words: any[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(`/dictionary/search?${qp.toString()}`);
  },
  lookupDictionaryWord: (word: string) => fetchApi<any>(`/dictionary/lookup/${encodeURIComponent(word)}`),
  toggleDictionaryBookmark: (wordId: string) => fetchApi<any>(`/dictionary/bookmark/${wordId}`, { method: 'POST' }),

  // 9. Tutor LingLing
  sendTutorMessage: (message: string, context?: any) =>
    fetchApi<{ reply: string; usedRag?: boolean; refs?: any[]; suggestedActions?: any[] }>('/tutor/chat', {
      method: 'POST',
      body: JSON.stringify({ message, locale: 'vi', customContext: context }),
    }),
  getTutorContext: () => fetchApi<{ context: any }>('/tutor/context'),
  getTutorPlan: () => fetchApi<{ plan: any }>('/tutor/plan'),

  // 10. Admin CMS & Audit Log
  getCurriculumUnits: () => fetchApi<{ units: any[] }>('/curriculum/units'),
  getAuditLogs: () => fetchApi<{ auditLogs: any[] }>('/admin/audit-logs'),

  // 11. Gamification: Sổ Tem & Đổi Lượt Chấm AI Writing
  getStamps: () =>
    fetchApi<{
      balance: number;
      maxCap: number;
      history: any[];
      freeWritingUsedToday: boolean;
      freeWritingRemainingToday: number;
      canEvaluateWriting: boolean;
    }>('/stamps'),
  awardStamp: (reason: 'DAILY_GOAL' | 'PERFECT_SCORE' | 'STREAK_7_DAYS' | string, delta?: number) =>
    fetchApi<{
      success: boolean;
      deltaAwarded: number;
      newBalance: number;
      message: string;
      maxCap: number;
    }>('/stamps/award', {
      method: 'POST',
      body: JSON.stringify({ reason, delta }),
    }),
  redeemWritingEvaluation: () =>
    fetchApi<{
      success: boolean;
      isFree: boolean;
      stampDeducted: number;
      newBalance: number;
      message: string;
      error?: string;
    }>('/stamps/redeem-writing', {
      method: 'POST',
    }),
  claimDailyGoal: () =>
    fetchApi<{
      success: boolean;
      deltaAwarded: number;
      newBalance: number;
      message: string;
      maxCap: number;
      error?: string;
    }>('/stamps/claim-daily-goal', {
      method: 'POST',
    }),
  getUserStreak: () =>
    fetchApi<{
      currentStreak: number;
      leavePasses: number;
      leave_passes: number;
      leavePassUsed: boolean;
      streakBroken: boolean;
      streakMaintained: boolean;
      lastActiveDate: string | null;
      lastLeavePassGrantWeek: string | null;
      streakFreezes: number;
    }>('/user/streak'),
};

