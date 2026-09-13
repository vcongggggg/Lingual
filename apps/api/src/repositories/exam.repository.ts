import { prisma, isDatabaseConnected } from '../lib/prisma.js';
import { MASTER_EXAMS } from '../routes/examData.js';
import { evaluateExamAttempt } from '../../../../packages/domain/src/index.js';

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

const MEM_EXAM_ATTEMPTS: ExamAttemptEntity[] = [
  {
    id: 'att-demo-toeic-01',
    examId: 'exam-toeic-01',
    userId: 'demo-user-id-001',
    status: 'completed',
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() - 86400000 + 46 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 86400000 + 1200 * 1000).toISOString(),
    elapsedSeconds: 1200,
    answers: [
      { questionId: 't-l1-q1', selectedOption: 'A man is adjusting his necktie.' },
      { questionId: 't-l1-q2', selectedOption: 'On Ms. Lee’s reception desk.' },
      { questionId: 't-r1-q1', selectedOption: 'prior to' },
      { questionId: 't-r1-q2', selectedOption: 'remarkably' },
      { questionId: 't-r1-q3', selectedOption: 'unless' },
      { questionId: 't-r2-q1', selectedOption: 'To announce the rollout of a new inventory tracking system' },
      { questionId: 't-r2-q2', selectedOption: 'Attend a 30-minute orientation session' },
    ],
  },
];

// Initialize evaluation for seed attempt
(() => {
  const seed = MEM_EXAM_ATTEMPTS[0];
  const exam = MASTER_EXAMS.find((e) => e.id === 'exam-toeic-01');
  if (exam && seed) {
    seed.result = evaluateExamAttempt(exam as any, seed as any, 1200);
  }
})();

export class ExamRepository {
  private static instance: ExamRepository;

  public static getInstance(): ExamRepository {
    if (!ExamRepository.instance) {
      ExamRepository.instance = new ExamRepository();
    }
    return ExamRepository.instance;
  }

  public async getExams(filter?: { type?: string; level?: string; section?: string }): Promise<any[]> {
    if (isDatabaseConnected()) {
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
        console.warn('Falling back to static master exams due to DB query failure:', err);
      }
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
    if (isDatabaseConnected()) {
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
      } catch (err) {
        console.warn('Falling back to static master exam by id due to DB query failure:', err);
      }
    }

    return MASTER_EXAMS.find((e) => e.id === id) || null;
  }

  public async createAttempt(data: ExamAttemptEntity): Promise<ExamAttemptEntity> {
    if (isDatabaseConnected()) {
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
      } catch {}
    }

    MEM_EXAM_ATTEMPTS.push(data);
    return data;
  }

  public async getAttemptById(id: string): Promise<ExamAttemptEntity | null> {
    if (isDatabaseConnected()) {
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
    }

    return MEM_EXAM_ATTEMPTS.find((a) => a.id === id) || null;
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

    if (isDatabaseConnected()) {
      try {
        await prisma.examAttempt.update({
          where: { id: attemptId },
          data: {
            answersJson: JSON.stringify(attempt.answers),
          },
        });
      } catch {}
    }

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

    if (isDatabaseConnected()) {
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
    }

    return attempt;
  }

  public async getUserAttempts(userId: string, limit: number = 20): Promise<ExamAttemptEntity[]> {
    if (isDatabaseConnected()) {
      try {
        const attempts = await prisma.examAttempt.findMany({
          where: { userId },
          orderBy: { startedAt: 'desc' },
          take: limit,
        });
        if (attempts.length > 0) {
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
        }
      } catch {}
    }

    return MEM_EXAM_ATTEMPTS.filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit);
  }
}

export const examRepository = ExamRepository.getInstance();
