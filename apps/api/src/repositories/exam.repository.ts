import { prisma } from '../lib/prisma.js';
import { MASTER_EXAMS } from '../routes/examData.js';

export interface ExamAttemptEntity {
  id: string;
  examId: string;
  userId: string;
  status: 'active' | 'completed' | 'expired';
  startedAt: string;
  expiresAt: string;
  submittedAt?: string;
  elapsedSeconds: number;
  answers: Array<{ questionId: string; selectedOption: string; flagged?: boolean }>;
  result?: any;
}

export class ExamRepository {
  private static instance: ExamRepository;

  public static getInstance(): ExamRepository {
    if (!ExamRepository.instance) {
      ExamRepository.instance = new ExamRepository();
    }
    return ExamRepository.instance;
  }

  public async getExams(filter?: { type?: string; level?: string; section?: string }): Promise<any[]> {
    try {
      const whereClause: any = { status: 'published' };
      if (filter?.type && filter.type !== 'all') {
        whereClause.type = filter.type.toLowerCase();
      }
      if (filter?.level && filter.level !== 'all') {
        whereClause.difficulty = { equals: filter.level, mode: 'insensitive' };
      }

      const dbExams = await prisma.standardizedExam.findMany({
        where: whereClause,
        include: {
          sections: {
            orderBy: { order: 'asc' },
            include: {
              questions: { orderBy: { order: 'asc' } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (dbExams.length > 0) {
        return dbExams.map((e) => ({
          id: e.id,
          title: e.title,
          subtitle: e.instructions || '',
          type: e.type,
          difficulty: e.difficulty,
          durationMinutes: e.durationMinutes,
          totalQuestions: e.totalQuestions,
          maxScore: e.passingScore ? Math.round(e.passingScore / 0.6) : 990,
          tags: [e.type, 'practice'],
          isOfficialMock: true,
          coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&auto=format&fit=crop&q=80',
          sections: e.sections.map((s) => ({
            id: s.id,
            title: s.title,
            type: s.sectionType,
            durationMinutes: Math.round(e.durationMinutes / (e.sections.length || 1)),
            audioUrl: s.audioUrl,
            passageText: s.passageText,
            questions: s.questions.map((q) => ({
              id: q.id,
              sectionId: s.id,
              type: 'multiple-choice',
              prompt: q.questionText || '',
              passageText: q.passageText,
              audioUrl: q.audioUrl,
              imageUrl: q.imageUrl,
              options: JSON.parse(q.optionsJson || '[]'),
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              difficulty: e.difficulty,
              tags: [],
            })),
          })),
        }));
      }
    } catch (err) {
      console.warn('Could not query standardizedExam from DB:', err);
    }

    let filtered = MASTER_EXAMS;
    if (filter?.type && filter.type !== 'all') {
      filtered = filtered.filter((e) => e.type.toLowerCase() === filter.type!.toLowerCase());
    }
    if (filter?.level && filter.level !== 'all') {
      filtered = filtered.filter((e) => e.difficulty.toLowerCase() === filter.level!.toLowerCase());
    }
    if (filter?.section && filter.section !== 'all') {
      filtered = filtered.filter((e) =>
        e.sections.some((s) => s.type.toLowerCase() === filter.section!.toLowerCase())
      );
    }
    return filtered;
  }

  public async getExamById(id: string): Promise<any | null> {
    try {
      const e = await prisma.standardizedExam.findUnique({
        where: { id },
        include: {
          sections: {
            orderBy: { order: 'asc' },
            include: {
              questions: { orderBy: { order: 'asc' } },
            },
          },
        },
      });

      if (e) {
        return {
          id: e.id,
          title: e.title,
          subtitle: e.instructions || '',
          type: e.type,
          difficulty: e.difficulty,
          durationMinutes: e.durationMinutes,
          totalQuestions: e.totalQuestions,
          maxScore: e.passingScore ? Math.round(e.passingScore / 0.6) : 990,
          tags: [e.type, 'practice'],
          isOfficialMock: true,
          coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&auto=format&fit=crop&q=80',
          sections: e.sections.map((s) => ({
            id: s.id,
            title: s.title,
            type: s.sectionType,
            durationMinutes: Math.round(e.durationMinutes / (e.sections.length || 1)),
            audioUrl: s.audioUrl,
            passageText: s.passageText,
            questions: s.questions.map((q) => ({
              id: q.id,
              sectionId: s.id,
              type: 'multiple-choice',
              prompt: q.questionText || '',
              passageText: q.passageText,
              audioUrl: q.audioUrl,
              imageUrl: q.imageUrl,
              options: JSON.parse(q.optionsJson || '[]'),
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              difficulty: e.difficulty,
              tags: [],
            })),
          })),
        };
      }
    } catch {}

    return MASTER_EXAMS.find((e) => e.id === id) || null;
  }

  public async createAttempt(data: ExamAttemptEntity): Promise<ExamAttemptEntity> {
    try {
      await prisma.examAttempt.create({
        data: {
          id: data.id,
          userId: data.userId,
          examId: data.examId,
          status: data.status,
          startedAt: new Date(data.startedAt),
          expiresAt: new Date(data.expiresAt),
          elapsedSeconds: data.elapsedSeconds,
          answersJson: JSON.stringify(data.answers),
          resultJson: data.result ? JSON.stringify(data.result) : null,
        },
      });
    } catch (err) {
      console.warn('Could not persist examAttempt in DB:', err);
    }

    return data;
  }

  public async getAttemptById(id: string): Promise<ExamAttemptEntity | null> {
    try {
      const a = await prisma.examAttempt.findUnique({ where: { id } });
      if (a) {
        return {
          id: a.id,
          userId: a.userId,
          examId: a.examId,
          status: a.status as any,
          startedAt: a.startedAt.toISOString(),
          expiresAt: a.expiresAt.toISOString(),
          submittedAt: a.submittedAt ? a.submittedAt.toISOString() : undefined,
          elapsedSeconds: a.elapsedSeconds,
          answers: JSON.parse(a.answersJson || '[]'),
          result: a.resultJson ? JSON.parse(a.resultJson) : undefined,
        };
      }
    } catch {}

    return null;
  }

  public async saveAnswer(
    attemptId: string,
    questionId: string,
    selectedOption: string,
    flagged?: boolean
  ): Promise<ExamAttemptEntity | null> {
    const attempt = await this.getAttemptById(attemptId);
    if (!attempt || attempt.status !== 'active') return null;

    const existingIdx = attempt.answers.findIndex((a) => a.questionId === questionId);
    if (existingIdx >= 0) {
      attempt.answers[existingIdx] = { questionId, selectedOption, flagged };
    } else {
      attempt.answers.push({ questionId, selectedOption, flagged });
    }

    try {
      await prisma.examAttempt.update({
        where: { id: attemptId },
        data: {
          answersJson: JSON.stringify(attempt.answers),
        },
      });
    } catch {}

    return attempt;
  }

  public async completeAttempt(
    attemptId: string,
    result: any,
    elapsedSeconds: number
  ): Promise<ExamAttemptEntity | null> {
    const attempt = await this.getAttemptById(attemptId);
    if (!attempt) return null;

    attempt.status = 'completed';
    attempt.submittedAt = new Date().toISOString();
    attempt.elapsedSeconds = elapsedSeconds;
    attempt.result = result;

    try {
      await prisma.examAttempt.update({
        where: { id: attemptId },
        data: {
          status: 'completed',
          submittedAt: new Date(attempt.submittedAt),
          elapsedSeconds,
          resultJson: JSON.stringify(result),
        },
      });
    } catch {}

    return attempt;
  }

  public async getUserAttempts(userId: string, limit: number = 20): Promise<ExamAttemptEntity[]> {
    try {
      const attempts = await prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { startedAt: 'desc' },
        take: limit,
      });
      return attempts.map((a) => ({
        id: a.id,
        userId: a.userId,
        examId: a.examId,
        status: a.status as any,
        startedAt: a.startedAt.toISOString(),
        expiresAt: a.expiresAt.toISOString(),
        submittedAt: a.submittedAt ? a.submittedAt.toISOString() : undefined,
        elapsedSeconds: a.elapsedSeconds,
        answers: JSON.parse(a.answersJson || '[]'),
        result: a.resultJson ? JSON.parse(a.resultJson) : undefined,
      }));
    } catch {
      return [];
    }
  }
}

export const examRepository = ExamRepository.getInstance();
