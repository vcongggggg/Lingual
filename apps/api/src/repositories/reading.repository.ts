import { prisma, isDatabaseConnected } from '../lib/prisma.js';

export interface ReadingAttemptEntity {
  id: string;
  userId: string;
  articleId: string;
  readingTimeSeconds: number;
  wpm: number;
  score: number;
  accuracy: number;
  xpAwarded: number;
  answers: Array<{ questionId: string; selectedAnswer: string; isCorrect: boolean }>;
  createdAt: string;
}

const MEM_READING_ATTEMPTS: ReadingAttemptEntity[] = [
  {
    id: 'att-read-seed-01',
    userId: 'demo-user-id-001',
    articleId: 'rd-tech-ai-2026',
    readingTimeSeconds: 120,
    wpm: 185,
    score: 100,
    accuracy: 100,
    xpAwarded: 30,
    answers: [
      { questionId: 'rd-tech-ai-q1', selectedAnswer: 'Artificial intelligence and productivity', isCorrect: true },
      { questionId: 'rd-tech-ai-q2', selectedAnswer: 'Language and cognitive tools', isCorrect: true },
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export class ReadingRepository {
  private static instance: ReadingRepository;

  public static getInstance(): ReadingRepository {
    if (!ReadingRepository.instance) {
      ReadingRepository.instance = new ReadingRepository();
    }
    return ReadingRepository.instance;
  }

  public async createAttempt(data: ReadingAttemptEntity): Promise<ReadingAttemptEntity> {
    if (isDatabaseConnected()) {
      try {
        await prisma.readingAttempt.create({
          data: {
            id: data.id,
            userId: data.userId,
            articleId: data.articleId,
            readingTimeSeconds: data.readingTimeSeconds,
            wpm: data.wpm,
            score: data.score,
            accuracy: data.accuracy,
            xpAwarded: data.xpAwarded,
            answersJson: JSON.stringify(data.answers),
            createdAt: new Date(data.createdAt),
          },
        });
      } catch {}
    }

    MEM_READING_ATTEMPTS.push(data);
    return data;
  }

  public async getUserAttempts(userId: string, limit: number = 20): Promise<ReadingAttemptEntity[]> {
    if (isDatabaseConnected()) {
      try {
        const attempts = await prisma.readingAttempt.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: limit,
        });
        if (attempts.length > 0) {
          return attempts.map((a) => ({
            ...a,
            answers: JSON.parse(a.answersJson || '[]'),
            createdAt: a.createdAt.toISOString(),
          }));
        }
      } catch {}
    }

    return MEM_READING_ATTEMPTS.filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const readingRepository = ReadingRepository.getInstance();
