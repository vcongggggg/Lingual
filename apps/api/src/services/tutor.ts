import {
  buildTutorContext,
  classifyTutorIntent,
  generateTutorResponse,
  sanitizeTutorResponse,
  TutorContext,
  TutorIntent,
  TutorResponse,
  TutorConversation,
  TutorMessage,
} from '@linguaflow/domain';

export class LearningTutorService {
  private static instance: LearningTutorService;
  private conversations: Map<string, TutorConversation> = new Map();

  private constructor() {}

  public static getInstance(): LearningTutorService {
    if (!LearningTutorService.instance) {
      LearningTutorService.instance = new LearningTutorService();
    }
    return LearningTutorService.instance;
  }

  public getTutorContext(userId: string, customData?: any): TutorContext {
    const baseData = {
      userId,
      name: 'Nguyễn Văn A',
      cefrEstimate: 'B2',
      totalMinutes: 1240,
      totalXP: 5010,
      currentStreak: 5,
      overallScore: 78,
      srsDueCount: 14,
      skills: [
        { skill: 'vocabulary', score: 85, trend: 'improving', attemptsCount: 32, recentAccuracy: 88 },
        { skill: 'listening', score: 72, trend: 'stable', attemptsCount: 18, recentAccuracy: 75 },
        { skill: 'reading', score: 78, trend: 'improving', attemptsCount: 14, recentAccuracy: 82 },
        { skill: 'writing', score: 68, trend: 'declining', attemptsCount: 9, recentAccuracy: 65 },
        { skill: 'speaking', score: 64, trend: 'declining', attemptsCount: 8, recentAccuracy: 62 },
        { skill: 'exam', score: 70, trend: 'stable', attemptsCount: 5, recentAccuracy: 70 },
      ],
      weaknesses: ['speaking', 'writing'],
      strengths: ['vocabulary', 'reading'],
      recentWriting: { score: 70, topic: 'Urban Transportation', date: '2026-08-14' },
      recentSpeaking: { score: 65, topic: 'Workplace Introduction', date: '2026-08-14' },
      recentReading: { score: 80, wpm: 155, date: '2026-08-13' },
      recentExam: { examType: 'toeic', score: 720, accuracy: 82, date: '2026-08-10' },
      ...customData,
    };

    return buildTutorContext(baseData);
  }

  public async chat(
    userId: string,
    message: string,
    locale: string = 'vi',
    customContext?: any
  ): Promise<{ response: TutorResponse; conversation: TutorConversation }> {
    const context = this.getTutorContext(userId, customContext);
    const intent = classifyTutorIntent(message, context);
    const tutorResponse = generateTutorResponse(intent, context, message, locale);

    // Get or create conversation history
    let conv = this.conversations.get(userId);
    if (!conv) {
      conv = {
        id: `conv-${userId}-${Date.now()}`,
        userId,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.conversations.set(userId, conv);
    }

    const userMsg: TutorMessage = {
      id: `msg-u-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      intent,
    };

    const tutorMsg: TutorMessage = {
      id: tutorResponse.messageId,
      role: 'tutor',
      content: tutorResponse.content,
      timestamp: new Date().toISOString(),
      intent: tutorResponse.intent,
      actions: tutorResponse.actions,
      citations: tutorResponse.citations,
      recommendations: tutorResponse.recommendations,
      explanation: tutorResponse.explanation,
    };

    conv.messages.push(userMsg, tutorMsg);
    conv.updatedAt = new Date().toISOString();

    return {
      response: tutorResponse,
      conversation: conv,
    };
  }

  public getHistory(userId: string): TutorConversation | null {
    return this.conversations.get(userId) || null;
  }
}

export const learningTutorService = LearningTutorService.getInstance();
