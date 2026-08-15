import { prisma, isDatabaseConnected } from '../lib/prisma.js';

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

export class WritingRepository {
  private static instance: WritingRepository;

  public static getInstance(): WritingRepository {
    if (!WritingRepository.instance) {
      WritingRepository.instance = new WritingRepository();
    }
    return WritingRepository.instance;
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
