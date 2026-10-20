// API Client for Lingual Web App connecting to Lingual Production API
export function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== '') {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  return 'http://localhost:4000/api/v1';
}

const API_BASE = getApiBase();

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  // Priority 1: Read token from cookie
  const cookieMatch = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/);
  if (cookieMatch && cookieMatch[1]) {
    return decodeURIComponent(cookieMatch[1]);
  }
  // Fallback if legacy token exists
  return localStorage.getItem('lingual_token');
}

export function setAuthToken(_token?: string): void {
  if (typeof window === 'undefined') return;
  // Strictly prevent storing token in localStorage to mitigate XSS
  localStorage.removeItem('lingual_token');
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lingual_token');
  document.cookie = 'access_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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

  const base = getApiBase();
  const url = `${base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    credentials: 'include',
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

function toQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      searchParams.append(key, String(val));
    }
  }
  const str = searchParams.toString();
  return str ? `?${str}` : '';
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

  logout: async () => {
    try {
      return await fetchApi<{ message: string }>('/auth/logout', { method: 'POST' });
    } finally {
      removeAuthToken();
    }
  },

  // Google OAuth 2.0
  getGoogleAuthStatus: () =>
    fetchApi<{ configured: boolean; isConfigured?: boolean; clientId: string | null; redirectUri?: string; message?: string }>(
      '/auth/google/status'
    ),
  getGoogleAuthUrl: (locale?: string) =>
    fetchApi<{ configured: boolean; isConfigured?: boolean; url?: string; redirectUri?: string }>(
      `/auth/google/url${toQueryString({ locale })}`
    ),
  verifyGoogleIdToken: (idToken: string) =>
    fetchApi<{ user: any; accessToken: string }>('/auth/google/verify-token', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }),
  loginWithGoogleDev: (payload: { email: string; name?: string; avatarUrl?: string; googleId?: string }) =>
    fetchApi<{ user: any; accessToken: string }>('/auth/google/dev-login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

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

  // 9. Tutor LingLing R2.0 (Gemini LLM)
  sendTutorMessage: (message: string, history?: { role: 'user' | 'assistant'; text: string }[]) =>
    fetchApi<{
      reply: string;
      mood?: string;
      usedRag?: boolean;
      grounding?: any;
      aiConnected?: boolean;
      suggestedActions?: any[];
      error?: string;
    }>('/tutor/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),
  getTutorStatus: () => fetchApi<{ aiConnected: boolean; model: string; message: string }>('/tutor/status'),
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

  // Phase 2: Dynamic Content Endpoints
  getGrammarQuestions: (params?: { cefrLevel?: string; topic?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/grammar-questions${toQueryString(params)}`),
  getGrammarQuestionById: (id: string) =>
    fetchApi<{ item: any }>(`/content/grammar-questions/${id}`),

  getDialogues: (params?: { cefrLevel?: string; topic?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/dialogues${toQueryString(params)}`),
  getDialogueById: (id: string) =>
    fetchApi<{ item: any }>(`/content/dialogues/${id}`),

  getStoryTemplates: (params?: { cefrLevel?: string; topic?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/story-templates${toQueryString(params)}`),
  getStoryTemplateById: (id: string) =>
    fetchApi<{ item: any }>(`/content/story-templates/${id}`),

  getContentPackages: (params?: { cefrLevel?: string; topic?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/packages${toQueryString(params)}`),
  getContentPackageById: (id: string) =>
    fetchApi<{ item: any }>(`/content/packages/${id}`),

  getArticles: (params?: { cefrLevel?: string; topic?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/articles${toQueryString(params)}`),
  getArticleById: (id: string) =>
    fetchApi<{ item: any }>(`/content/articles/${id}`),

  getStories: (params?: { cefrLevel?: string; topic?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/stories${toQueryString(params)}`),
  getStoryById: (id: string) =>
    fetchApi<{ item: any }>(`/content/stories/${id}`),

  getIeltsReading: (params?: { cefrLevel?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/ielts-reading${toQueryString(params)}`),
  getIeltsReadingById: (id: string) =>
    fetchApi<{ item: any }>(`/content/ielts-reading/${id}`),

  getIeltsListening: (params?: { cefrLevel?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/ielts-listening${toQueryString(params)}`),
  getIeltsListeningById: (id: string) =>
    fetchApi<{ item: any }>(`/content/ielts-listening/${id}`),

  getIeltsSpeaking: (params?: { limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/ielts-speaking${toQueryString(params)}`),
  getIeltsSpeakingById: (id: string) =>
    fetchApi<{ item: any }>(`/content/ielts-speaking/${id}`),

  getIeltsWriting: (params?: { limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/ielts-writing${toQueryString(params)}`),
  getIeltsWritingById: (id: string) =>
    fetchApi<{ item: any }>(`/content/ielts-writing/${id}`),

  getContentUnits: (params?: { cefrLevel?: string; limit?: number }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/units${toQueryString(params)}`),
  getContentUnitById: (id: string) =>
    fetchApi<{ item: any }>(`/content/units/${id}`),

  getDiaryPrompts: (params?: { cefrLevel?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/diary-prompts${toQueryString(params)}`),
  getDiaryPromptById: (id: string) =>
    fetchApi<{ item: any }>(`/content/diary-prompts/${id}`),

  getShadowingSentences: (params?: { cefrLevel?: string; topic?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/shadowing${toQueryString(params)}`),
  getShadowingSentenceById: (id: string) =>
    fetchApi<{ item: any }>(`/content/shadowing/${id}`),

  getDictationSentences: (params?: { cefrLevel?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/dictation${toQueryString(params)}`),
  getDictationSentenceById: (id: string) =>
    fetchApi<{ item: any }>(`/content/dictation/${id}`),

  getListeningMonologues: (params?: { cefrLevel?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/monologues${toQueryString(params)}`),
  getListeningMonologueById: (id: string) =>
    fetchApi<{ item: any }>(`/content/monologues/${id}`),

  getIdioms: (params?: { cefrLevel?: string; search?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/idioms${toQueryString(params)}`),
  getIdiomById: (id: string) =>
    fetchApi<{ item: any }>(`/content/idioms/${id}`),

  getPhrasalVerbs: (params?: { cefrLevel?: string; search?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/phrasal-verbs${toQueryString(params)}`),
  getPhrasalVerbById: (id: string) =>
    fetchApi<{ item: any }>(`/content/phrasal-verbs/${id}`),

  getCollocations: (params?: { cefrLevel?: string; search?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/collocations${toQueryString(params)}`),
  getCollocationById: (id: string) =>
    fetchApi<{ item: any }>(`/content/collocations/${id}`),

  getSynonyms: (params?: { cefrLevel?: string; search?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/synonyms${toQueryString(params)}`),
  getSynonymById: (id: string) =>
    fetchApi<{ item: any }>(`/content/synonyms/${id}`),

  getMinimalPairs: (params?: { limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/minimal-pairs${toQueryString(params)}`),
  getMinimalPairById: (id: string) =>
    fetchApi<{ item: any }>(`/content/minimal-pairs/${id}`),

  getTongueTwisters: (params?: { limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/tongue-twisters${toQueryString(params)}`),
  getTongueTwisterById: (id: string) =>
    fetchApi<{ item: any }>(`/content/tongue-twisters/${id}`),

  getProverbs: (params?: { limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/proverbs${toQueryString(params)}`),
  getProverbById: (id: string) =>
    fetchApi<{ item: any }>(`/content/proverbs/${id}`),

  getGamePools: (params?: { cefrLevel?: string; topic?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/game-pools${toQueryString(params)}`),
  getGameWordPools: (params?: { cefrLevel?: string; topic?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/game-pools${toQueryString(params)}`),
  getGameWordPoolById: (id: string) =>
    fetchApi<{ item: any }>(`/content/game-pools/${id}`),

  getGrammarExplanations: (params?: { cefrLevel?: string; topic?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/grammar-explanations${toQueryString(params)}`),
  getGrammarExplanationById: (id: string) =>
    fetchApi<{ item: any }>(`/content/grammar-explanations/${id}`),

  getDailyVocabQuestions: (params?: { cefrLevel?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number }>(`/content/vocab-questions${toQueryString(params)}`),
  getDailyVocabQuestionById: (id: string) =>
    fetchApi<{ item: any }>(`/content/vocab-questions/${id}`),

  getPhrases: (params?: { category?: 'situational' | 'business' | 'travel'; cefrLevel?: string; limit?: number; random?: boolean }) =>
    fetchApi<{ items: any[]; total: number; category?: string }>(`/content/phrases${toQueryString(params)}`),

  // 12. AI Learning Insights (Rule-based V1)
  getInsightsSummary: () => fetchApi<any>('/insights/summary'),
  getGoldenHours: () => fetchApi<any>('/insights/golden-hours'),
  getWeaknessRadar: () => fetchApi<any>('/insights/weakness-radar'),
  getForgottenWords: (limit?: number) =>
    fetchApi<{ enabled: boolean; items: any[]; total: number }>(`/insights/forgotten-words${toQueryString({ limit })}`),
  getDropoffWarning: () => fetchApi<any>('/insights/dropoff-warning'),
  getCurriculumAdaptation: () => fetchApi<any>('/insights/curriculum-adaptation'),
  getInsightsPreferences: () => fetchApi<{ enabled: boolean; userId: string }>('/insights/preferences'),
  setInsightsPreferences: (enabled: boolean) =>
    fetchApi<{ success: boolean; enabled: boolean; userId: string }>('/insights/preferences', {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    }),

  // 13. AI Learning Insights V2 (Gemini LLM)
  getWeeklyReportLatest: () => fetchApi<{ enabled: boolean; status?: string; report: any }>('/insights/v2/weekly-report/latest'),
  getWeeklyReportHistory: (limit?: number) => fetchApi<{ enabled: boolean; status?: string; reports: any[] }>(`/insights/v2/weekly-report/history${toQueryString({ limit })}`),
  generateWeeklyReport: (forceNew?: boolean) => fetchApi<{ success: boolean; enabled: boolean; report: any; error?: string; aiConnected?: boolean }>('/insights/v2/weekly-report/generate', {
    method: 'POST',
    body: JSON.stringify({ forceNew }),
  }),
  explainAnomaly: (metricKey: string, metricValue?: number) => fetchApi<{ success: boolean; enabled: boolean; explanation: any; error?: string; aiConnected?: boolean }>('/insights/v2/anomaly/explain', {
    method: 'POST',
    body: JSON.stringify({ metricKey, metricValue }),
  }),
  getStudyPlan: () => fetchApi<{ enabled: boolean; status?: string; plan: any }>('/insights/v2/study-plan'),
  generateStudyPlan: (goal: string, forceNew?: boolean) => fetchApi<{ success: boolean; enabled: boolean; plan: any; error?: string; aiConnected?: boolean }>('/insights/v2/study-plan/generate', {
    method: 'POST',
    body: JSON.stringify({ goal, forceNew }),
  }),
  toggleStudyPlanTask: (taskId: string, completed: boolean) => fetchApi<{ success: boolean; plan: any }>('/insights/v2/study-plan/toggle-task', {
    method: 'PATCH',
    body: JSON.stringify({ taskId, completed }),
  }),

  // 14. Notifications System (Phase 1)
  getNotifications: (params?: { unreadOnly?: boolean; limit?: number; cursor?: string }) =>
    fetchApi<{ notifications: any[]; nextCursor: string | null; total: number }>(`/notifications${toQueryString(params)}`),
  getNotificationUnreadCount: () => fetchApi<{ count: number }>('/notifications/unread-count'),
  markNotificationAsRead: (id: string) => fetchApi<{ success: boolean; notification: any }>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsAsRead: () => fetchApi<{ success: boolean; count: number }>('/notifications/read-all', { method: 'POST' }),
  deleteNotification: (id: string) => fetchApi<{ success: boolean }>(`/notifications/${id}`, { method: 'DELETE' }),
  getNotificationPreferences: () => fetchApi<{ preferences: any }>('/notifications/preferences'),
  updateNotificationPreferences: (data: any) =>
    fetchApi<{ success: boolean; preferences: any }>('/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  triggerDevNotification: (data: any) =>
    fetchApi<{ success: boolean; notification: any; message?: string }>('/notifications/_trigger', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 15. Web Push (Phase 3)
  getVapidPublicKey: () => fetchApi<{ publicKey: string }>('/push/public-key'),
  subscribePush: (data: { endpoint: string; keys: { p256dh: string; auth: string }; userAgent?: string }) =>
    fetchApi<{ success: boolean; subscription: any }>('/push/subscribe', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  unsubscribePush: (endpoint: string) =>
    fetchApi<{ success: boolean; result: any }>('/push/unsubscribe', {
      method: 'DELETE',
      body: JSON.stringify({ endpoint }),
    }),
  getPushStatus: () => fetchApi<{ success: boolean; count: number; hasSubscriptions: boolean }>('/push/status'),
  sendTestPush: () => fetchApi<{ success: boolean; result: any }>('/push/test', { method: 'POST' }),
};

