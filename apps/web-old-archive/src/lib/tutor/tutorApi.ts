import {
  TutorContext,
  TutorResponse,
  TutorConversation,
  AdaptiveLearningPlan,
  LearningSession,
  TutorRecommendation,
  TutorAction,
} from '@linguaflow/domain';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const tutorApi = {
  async getContext(userId?: string): Promise<{ context: TutorContext }> {
    const url = new URL(`${API_BASE}/tutor/context`);
    if (userId) url.searchParams.append('userId', userId);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch tutor context: ${res.statusText}`);
    return res.json();
  },

  async chat(payload: {
    message: string;
    locale?: string;
    userId?: string;
    customContext?: any;
  }): Promise<{ response: TutorResponse; conversation: TutorConversation }> {
    const res = await fetch(`${API_BASE}/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Chat query failed: ${res.statusText}`);
    return res.json();
  },

  async getPlan(userId?: string, locale: string = 'vi'): Promise<{ plan: AdaptiveLearningPlan }> {
    const url = new URL(`${API_BASE}/tutor/plan`);
    if (userId) url.searchParams.append('userId', userId);
    url.searchParams.append('locale', locale);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch plan: ${res.statusText}`);
    return res.json();
  },

  async generatePlan(payload: {
    userId?: string;
    days?: number;
    locale?: string;
  }): Promise<{ plan: AdaptiveLearningPlan }> {
    const res = await fetch(`${API_BASE}/tutor/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Plan generation failed: ${res.statusText}`);
    return res.json();
  },

  async getSession(payload: {
    userId?: string;
    skill?: string;
    locale?: string;
  }): Promise<{ session: LearningSession }> {
    const res = await fetch(`${API_BASE}/tutor/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Session creation failed: ${res.statusText}`);
    return res.json();
  },

  async completeSession(
    sessionId: string,
    payload: {
      userId?: string;
      score: number;
      durationMinutes?: number;
      accuracy?: number;
    }
  ): Promise<{
    completionId: string;
    xpAwarded: number;
    streakUpdated: boolean;
    idempotentDuplicate?: boolean;
  }> {
    const res = await fetch(`${API_BASE}/tutor/session/${sessionId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Session completion failed: ${res.statusText}`);
    return res.json();
  },

  async getHistory(userId?: string): Promise<{
    conversation: TutorConversation | null;
    sessions: any[];
  }> {
    const url = new URL(`${API_BASE}/tutor/history`);
    if (userId) url.searchParams.append('userId', userId);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch history: ${res.statusText}`);
    return res.json();
  },

  async getRecommendations(
    userId?: string,
    locale: string = 'vi'
  ): Promise<{
    recommendations: TutorRecommendation[];
    actions: TutorAction[];
  }> {
    const url = new URL(`${API_BASE}/tutor/recommendations`);
    if (userId) url.searchParams.append('userId', userId);
    url.searchParams.append('locale', locale);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Failed to fetch recommendations: ${res.statusText}`);
    return res.json();
  },

  async executeAction(payload: {
    actionType: string;
    route: string;
    userId?: string;
  }): Promise<{ status: string; actionExecuted: string }> {
    const res = await fetch(`${API_BASE}/tutor/actions/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Action execution failed: ${res.statusText}`);
    return res.json();
  },
};
