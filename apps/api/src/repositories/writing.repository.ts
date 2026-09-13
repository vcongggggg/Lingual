import { prisma, isDatabaseConnected } from '../lib/prisma.js';
import { MASTER_WRITING_PROMPTS } from '../data/writingExpandedData.js';

export interface WritingAttemptEntity {
  id: string;
  userId: string;
  promptId: string;
  mode: string;
  content: string;
  wordCount: number;
  score: number;
  xpAwarded: number;
  durationMs: number;
  createdAt: string;
}

export interface WritingFeedbackReportEntity {
  id?: string;
  attemptId: string;
  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  naturalnessScore: number;
  relevanceScore: number;
  completenessScore: number;
  grade: string;
  correctionsJson?: string;
  strengthsJson?: string;
  suggestionsJson?: string;
  vocabularySuggestionsJson?: string;
  createdAt?: string;
}

const MEM_WRITING_ATTEMPTS: WritingAttemptEntity[] = [
  {
    id: 'att-w-1',
    userId: 'demo-user-id-001',
    promptId: 'see-write-a1-morning',
    mode: 'see-write',
    content: 'Every morning I wake up and drink hot coffee.',
    wordCount: 9,
    score: 92,
    xpAwarded: 25,
    durationMs: 45000,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const MEM_FEEDBACK_REPORTS: Record<string, WritingFeedbackReportEntity> = {};

const FALLBACK_PROMPTS = MASTER_WRITING_PROMPTS;


export class WritingRepository {
  private static instance: WritingRepository;

  public static getInstance(): WritingRepository {
    if (!WritingRepository.instance) {
      WritingRepository.instance = new WritingRepository();
    }
    return WritingRepository.instance;
  }

  public async getPrompts(filter?: { mode?: string; difficulty?: string; category?: string }): Promise<any[]> {
    if (isDatabaseConnected()) {
      try {
        const whereClause: any = { status: 'published' };
        if (filter?.mode && filter.mode !== 'all') {
          whereClause.mode = filter.mode;
        }
        if (filter?.difficulty && filter.difficulty !== 'all') {
          whereClause.difficulty = filter.difficulty;
        }
        if (filter?.category && filter.category !== 'all') {
          whereClause.category = { equals: filter.category, mode: 'insensitive' };
        }

        const dbPrompts = await prisma.writingPrompt.findMany({
          where: whereClause,
          include: {
            guidedSteps: { orderBy: { stepNumber: 'asc' } },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (dbPrompts.length > 0) {
          return dbPrompts.map((p) => ({
            id: p.id,
            mode: p.mode,
            difficulty: p.difficulty,
            title: p.title,
            instruction: p.instruction,
            imageHint: p.imageHint,
            scenario: p.scenario,
            targetWords: JSON.parse(p.targetWords || '[]'),
            targetGrammar: p.targetGrammar,
            sampleAnswer: p.sampleAnswer,
            category: p.category,
            minWords: p.minWords,
            maxWords: p.maxWords,
            guidedSteps: p.guidedSteps.map((s) => ({
              stepNumber: s.stepNumber,
              question: s.question,
              hint: s.hint,
              samplePhrase: s.samplePhrase,
            })),
          }));
        }
      } catch (err) {
        console.warn('Falling back to static writing prompts due to DB query failure:', err);
      }
    }

    let filtered = FALLBACK_PROMPTS;
    if (filter?.mode && filter.mode !== 'all') {
      filtered = filtered.filter((p) => p.mode === filter.mode);
    }
    if (filter?.difficulty && filter.difficulty !== 'all') {
      filtered = filtered.filter((p) => p.difficulty === filter.difficulty);
    }
    if (filter?.category && filter.category !== 'all') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === filter.category!.toLowerCase());
    }
    return filtered;
  }

  public async getPromptById(id: string): Promise<any | null> {
    if (isDatabaseConnected()) {
      try {
        const p = await prisma.writingPrompt.findUnique({
          where: { id },
          include: {
            guidedSteps: { orderBy: { stepNumber: 'asc' } },
          },
        });

        if (p) {
          return {
            id: p.id,
            mode: p.mode,
            difficulty: p.difficulty,
            title: p.title,
            instruction: p.instruction,
            imageHint: p.imageHint,
            scenario: p.scenario,
            targetWords: JSON.parse(p.targetWords || '[]'),
            targetGrammar: p.targetGrammar,
            sampleAnswer: p.sampleAnswer,
            category: p.category,
            minWords: p.minWords,
            maxWords: p.maxWords,
            guidedSteps: p.guidedSteps.map((s) => ({
              stepNumber: s.stepNumber,
              question: s.question,
              hint: s.hint,
              samplePhrase: s.samplePhrase,
            })),
          };
        }
      } catch (err) {
        console.warn('Falling back to static writing prompt by id due to DB query failure:', err);
      }
    }

    return FALLBACK_PROMPTS.find((p) => p.id === id) || null;
  }

  public async saveFeedbackReport(report: WritingFeedbackReportEntity): Promise<void> {
    MEM_FEEDBACK_REPORTS[report.attemptId] = report;

    if (isDatabaseConnected()) {
      try {
        await prisma.writingFeedbackReport.upsert({
          where: { attemptId: report.attemptId },
          update: {
            overallScore: report.overallScore,
            grammarScore: report.grammarScore,
            vocabularyScore: report.vocabularyScore,
            naturalnessScore: report.naturalnessScore,
            relevanceScore: report.relevanceScore,
            completenessScore: report.completenessScore,
            grade: report.grade,
            correctionsJson: report.correctionsJson || '[]',
            strengthsJson: report.strengthsJson || '[]',
            suggestionsJson: report.suggestionsJson || '[]',
            vocabularySuggestionsJson: report.vocabularySuggestionsJson || '[]',
          },
          create: {
            attemptId: report.attemptId,
            overallScore: report.overallScore,
            grammarScore: report.grammarScore,
            vocabularyScore: report.vocabularyScore,
            naturalnessScore: report.naturalnessScore,
            relevanceScore: report.relevanceScore,
            completenessScore: report.completenessScore,
            grade: report.grade,
            correctionsJson: report.correctionsJson || '[]',
            strengthsJson: report.strengthsJson || '[]',
            suggestionsJson: report.suggestionsJson || '[]',
            vocabularySuggestionsJson: report.vocabularySuggestionsJson || '[]',
          },
        });
      } catch (err) {
        console.warn('Could not persist writing feedback report to DB:', err);
      }
    }
  }

  public async getFeedbackReport(attemptId: string): Promise<WritingFeedbackReportEntity | null> {
    if (isDatabaseConnected()) {
      try {
        const rep = await prisma.writingFeedbackReport.findUnique({
          where: { attemptId },
        });
        if (rep) {
          return {
            ...rep,
            createdAt: rep.createdAt.toISOString(),
          };
        }
      } catch (err) {}
    }

    return MEM_FEEDBACK_REPORTS[attemptId] || null;
  }

  public async createAttempt(data: WritingAttemptEntity): Promise<WritingAttemptEntity> {
    if (isDatabaseConnected()) {
      try {
        await prisma.writingAttempt.create({
          data: {
            id: data.id,
            userId: data.userId,
            promptId: data.promptId,
            mode: data.mode,
            content: data.content,
            wordCount: data.wordCount,
            score: data.score,
            xpAwarded: data.xpAwarded,
            durationMs: data.durationMs,
            createdAt: new Date(data.createdAt),
          },
        });
      } catch {}
    }

    MEM_WRITING_ATTEMPTS.push(data);
    return data;
  }

  public async getUserAttempts(userId: string, limit: number = 20): Promise<WritingAttemptEntity[]> {
    if (isDatabaseConnected()) {
      try {
        const attempts = await prisma.writingAttempt.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: limit,
        });
        if (attempts.length > 0) {
          return attempts.map((a) => ({
            ...a,
            createdAt: a.createdAt.toISOString(),
          }));
        }
      } catch {}
    }

    return MEM_WRITING_ATTEMPTS.filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  public async findRecentDuplicate(
    userId: string,
    promptId: string,
    content: string,
    windowMs: number = 5000
  ): Promise<WritingAttemptEntity | null> {
    const attempts = await this.getUserAttempts(userId, 5);
    const now = Date.now();
    return (
      attempts.find(
        (a) =>
          a.promptId === promptId &&
          a.content.trim() === content.trim() &&
          now - new Date(a.createdAt).getTime() < windowMs
      ) || null
    );
  }
}

export const writingRepository = WritingRepository.getInstance();
