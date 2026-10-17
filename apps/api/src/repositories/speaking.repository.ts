import { prisma } from '../lib/prisma.js';
import { MASTER_SPEAKING_PROMPTS } from '../routes/speakingData.js';

export interface SpeakingAttemptEntity {
  id: string;
  userId: string;
  promptId: string;
  mode: string;
  transcript: string;
  durationMs: number;
  score: number;
  pronunciationScore: number;
  fluencyScore: number;
  xpAwarded: number;
  createdAt: string;
}

export interface SpeakingPhonemeFeedbackEntity {
  id?: string;
  attemptId: string;
  phonemesJson?: string;
  pronunciationScore: number;
  fluencyScore: number;
  grammarScore: number;
  vocabularyScore: number;
  coherenceScore: number;
  audioRecordingUrl?: string | null;
  suggestionsJson?: string;
  createdAt?: string;
}

export class SpeakingRepository {
  private static instance: SpeakingRepository;

  public static getInstance(): SpeakingRepository {
    if (!SpeakingRepository.instance) {
      SpeakingRepository.instance = new SpeakingRepository();
    }
    return SpeakingRepository.instance;
  }

  public async getPrompts(filter?: {
    mode?: string;
    difficulty?: string;
    cefr?: string;
    topic?: string;
  }): Promise<any[]> {
    try {
      const whereClause: any = { status: 'published' };
      if (filter?.mode && filter.mode !== 'all') {
        whereClause.mode = filter.mode.toLowerCase();
      }
      if (filter?.difficulty && filter.difficulty !== 'all') {
        whereClause.difficulty = { equals: filter.difficulty, mode: 'insensitive' };
      }
      if (filter?.cefr && filter.cefr !== 'all') {
        whereClause.cefr = filter.cefr;
      }
      if (filter?.topic && filter.topic !== 'all') {
        whereClause.topic = { equals: filter.topic, mode: 'insensitive' };
      }

      const dbPrompts = await prisma.speakingPrompt.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });

      if (dbPrompts.length > 0) {
        return dbPrompts.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          mode: p.mode,
          difficulty: p.difficulty,
          cefr: p.cefr,
          topic: p.topic,
          targetWords: JSON.parse(p.targetWords || '[]'),
          targetPhrases: JSON.parse(p.targetPhrases || '[]'),
          sampleAnswer: p.sampleAnswer,
          audioSampleUrl: p.audioSampleUrl,
          durationSeconds: p.durationSeconds,
          minWords: p.minWords,
          maxWords: p.maxWords,
          tags: JSON.parse(p.tags || '[]'),
          imagePrompt: p.imagePrompt,
          scenario: p.scenario,
          steps: p.stepsJson ? JSON.parse(p.stepsJson) : undefined,
        }));
      }
    } catch (err) {
      console.warn('Falling back to static speaking prompts due to DB query failure:', err);
    }

    let filtered = [...MASTER_SPEAKING_PROMPTS];
    if (filter?.mode && filter.mode !== 'all') {
      filtered = filtered.filter((p) => p.mode.toLowerCase() === filter.mode!.toLowerCase());
    }
    if (filter?.difficulty && filter.difficulty !== 'all') {
      filtered = filtered.filter((p) => p.difficulty.toLowerCase() === filter.difficulty!.toLowerCase());
    }
    if (filter?.cefr && filter.cefr !== 'all') {
      filtered = filtered.filter((p) => (p.cefr || '').toLowerCase() === filter.cefr!.toLowerCase());
    }
    if (filter?.topic && filter.topic !== 'all') {
      filtered = filtered.filter((p) => (p.topic || '').toLowerCase() === filter.topic!.toLowerCase());
    }
    return filtered;
  }

  public async getPromptById(id: string): Promise<any | null> {
    try {
      const p = await prisma.speakingPrompt.findUnique({ where: { id } });
      if (p) {
        return {
          id: p.id,
          title: p.title,
          description: p.description,
          mode: p.mode,
          difficulty: p.difficulty,
          cefr: p.cefr,
          topic: p.topic,
          targetWords: JSON.parse(p.targetWords || '[]'),
          targetPhrases: JSON.parse(p.targetPhrases || '[]'),
          sampleAnswer: p.sampleAnswer,
          audioSampleUrl: p.audioSampleUrl,
          durationSeconds: p.durationSeconds,
          minWords: p.minWords,
          maxWords: p.maxWords,
          tags: JSON.parse(p.tags || '[]'),
          imagePrompt: p.imagePrompt,
          scenario: p.scenario,
          steps: p.stepsJson ? JSON.parse(p.stepsJson) : undefined,
        };
      }
    } catch (err) {
      console.warn('Falling back to static speaking prompt by id due to DB query failure:', err);
    }

    return MASTER_SPEAKING_PROMPTS.find((p) => p.id === id) || null;
  }

  public async savePhonemeFeedback(feedback: SpeakingPhonemeFeedbackEntity): Promise<void> {
    try {
      await prisma.speakingPhonemeFeedback.upsert({
        where: { attemptId: feedback.attemptId },
        update: {
          phonemesJson: feedback.phonemesJson || '[]',
          pronunciationScore: feedback.pronunciationScore,
          fluencyScore: feedback.fluencyScore,
          grammarScore: feedback.grammarScore,
          vocabularyScore: feedback.vocabularyScore,
          coherenceScore: feedback.coherenceScore,
          audioRecordingUrl: feedback.audioRecordingUrl || null,
          suggestionsJson: feedback.suggestionsJson || '[]',
        },
        create: {
          attemptId: feedback.attemptId,
          phonemesJson: feedback.phonemesJson || '[]',
          pronunciationScore: feedback.pronunciationScore,
          fluencyScore: feedback.fluencyScore,
          grammarScore: feedback.grammarScore,
          vocabularyScore: feedback.vocabularyScore,
          coherenceScore: feedback.coherenceScore,
          audioRecordingUrl: feedback.audioRecordingUrl || null,
          suggestionsJson: feedback.suggestionsJson || '[]',
        },
      });
    } catch (err) {
      console.warn('Could not persist speaking phoneme feedback to DB:', err);
    }
  }

  public async getPhonemeFeedback(attemptId: string): Promise<SpeakingPhonemeFeedbackEntity | null> {
    try {
      const f = await prisma.speakingPhonemeFeedback.findUnique({
        where: { attemptId },
      });
      if (f) {
        return {
          ...f,
          createdAt: f.createdAt.toISOString(),
        };
      }
    } catch (err) {}

    return null;
  }

  public async createAttempt(data: SpeakingAttemptEntity): Promise<SpeakingAttemptEntity> {
    try {
      await prisma.speakingAttempt.create({
        data: {
          id: data.id,
          userId: data.userId,
          promptId: data.promptId,
          mode: data.mode,
          transcript: data.transcript,
          durationMs: data.durationMs,
          score: data.score,
          pronunciationScore: data.pronunciationScore,
          fluencyScore: data.fluencyScore,
          xpAwarded: data.xpAwarded,
          createdAt: new Date(data.createdAt),
        },
      });
    } catch (err) {
      console.warn('Could not persist speakingAttempt in DB:', err);
    }

    return data;
  }

  public async getUserAttempts(userId: string, limit: number = 20): Promise<SpeakingAttemptEntity[]> {
    try {
      const attempts = await prisma.speakingAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return attempts.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      }));
    } catch {
      return [];
    }
  }
}

export const speakingRepository = SpeakingRepository.getInstance();
