import { prisma, isDatabaseConnected } from '../lib/prisma.js';

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

const MEM_SPEAKING_ATTEMPTS: SpeakingAttemptEntity[] = [
  {
    id: 'att-spk-seed-01',
    userId: 'demo-user-id-001',
    promptId: 'spk-rep-01',
    mode: 'repetition',
    transcript: 'Good morning everyone, welcome to our annual company meeting.',
    durationMs: 4200,
    score: 95,
    pronunciationScore: 94,
    fluencyScore: 96,
    xpAwarded: 25,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export class SpeakingRepository {
  private static instance: SpeakingRepository;

  public static getInstance(): SpeakingRepository {
    if (!SpeakingRepository.instance) {
      SpeakingRepository.instance = new SpeakingRepository();
    }
    return SpeakingRepository.instance;
  }

  public async createAttempt(data: SpeakingAttemptEntity): Promise<SpeakingAttemptEntity> {
    if (isDatabaseConnected()) {
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
      } catch {}
    }

    MEM_SPEAKING_ATTEMPTS.push(data);
    return data;
  }

  public async getUserAttempts(userId: string, limit: number = 20): Promise<SpeakingAttemptEntity[]> {
    if (isDatabaseConnected()) {
      try {
        const attempts = await prisma.speakingAttempt.findMany({
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

    return MEM_SPEAKING_ATTEMPTS.filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const speakingRepository = SpeakingRepository.getInstance();
