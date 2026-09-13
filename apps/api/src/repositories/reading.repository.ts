import { prisma, isDatabaseConnected } from '../lib/prisma.js';
import { MASTER_READING_ARTICLES } from '../data/reading.js';

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

export interface ReadingArticleListItem {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  topic: string;
  author: string;
  estimatedMinutes: number;
  wordCount: number;
  coverImage?: string | null;
  paragraphCount: number;
  vocabularyCount: number;
  questionCount: number;
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

const MEM_USER_PROGRESS: Record<string, { currentParagraph: number; scrollProgress: number; completed: boolean; updatedAt: string }> = {};

export class ReadingRepository {
  private static instance: ReadingRepository;

  public static getInstance(): ReadingRepository {
    if (!ReadingRepository.instance) {
      ReadingRepository.instance = new ReadingRepository();
    }
    return ReadingRepository.instance;
  }

  public async getArticles(filter?: { level?: string; topic?: string }): Promise<ReadingArticleListItem[]> {
    if (isDatabaseConnected()) {
      try {
        const whereClause: any = { status: 'published' };
        if (filter?.level && filter.level !== 'all') {
          whereClause.level = filter.level;
        }
        if (filter?.topic && filter.topic !== 'all') {
          whereClause.topic = { equals: filter.topic, mode: 'insensitive' };
        }

        const dbArticles = await prisma.readingArticle.findMany({
          where: whereClause,
          include: {
            paragraphs: { select: { id: true } },
            questions: { select: { id: true } },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (dbArticles.length > 0) {
          return dbArticles.map((a) => ({
            id: a.id,
            title: a.title,
            subtitle: a.subtitle,
            level: a.level,
            topic: a.topic,
            author: a.author,
            estimatedMinutes: a.estimatedMinutes,
            wordCount: a.wordCount,
            coverImage: a.coverImage,
            paragraphCount: a.paragraphs.length,
            vocabularyCount: 5,
            questionCount: a.questions.length,
          }));
        }
      } catch (err) {
        console.warn('Falling back to static reading articles due to DB query failure:', err);
      }
    }

    let filtered = MASTER_READING_ARTICLES;
    if (filter?.level && filter.level !== 'all') {
      filtered = filtered.filter((a) => a.level === filter.level);
    }
    if (filter?.topic && filter.topic !== 'all') {
      filtered = filtered.filter((a) => a.topic.toLowerCase() === filter.topic!.toLowerCase());
    }

    return filtered.map((a) => ({
      id: a.id,
      title: a.title,
      subtitle: a.subtitle,
      level: a.level,
      topic: a.topic,
      author: a.author,
      estimatedMinutes: a.estimatedMinutes,
      wordCount: a.wordCount,
      coverImage: a.coverImage,
      paragraphCount: a.paragraphs.length,
      vocabularyCount: a.vocabularyIds?.length || 0,
      questionCount: a.questions.length,
    }));
  }

  public async getArticleById(id: string): Promise<any | null> {
    if (isDatabaseConnected()) {
      try {
        const dbArticle = await prisma.readingArticle.findUnique({
          where: { id },
          include: {
            paragraphs: { orderBy: { order: 'asc' } },
            questions: { orderBy: { order: 'asc' } },
          },
        });

        if (dbArticle) {
          return {
            id: dbArticle.id,
            title: dbArticle.title,
            subtitle: dbArticle.subtitle,
            level: dbArticle.level,
            topic: dbArticle.topic,
            author: dbArticle.author,
            estimatedMinutes: dbArticle.estimatedMinutes,
            wordCount: dbArticle.wordCount,
            coverImage: dbArticle.coverImage,
            vocabularyIds: [],
            paragraphs: dbArticle.paragraphs.map((p) => ({
              id: p.id,
              order: p.order,
              english: p.english,
              vietnamese: p.vietnamese,
              audioUrl: p.audioUrl,
            })),
            questions: dbArticle.questions.map((q) => ({
              id: q.id,
              order: q.order,
              type: q.type,
              question: q.question,
              options: JSON.parse(q.optionsJson || '[]'),
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              difficulty: q.difficulty,
              relatedParagraph: q.relatedParagraph,
            })),
          };
        }
      } catch (err) {
        console.warn('Falling back to static reading article due to DB query failure:', err);
      }
    }

    return MASTER_READING_ARTICLES.find((a) => a.id === id) || null;
  }

  public async saveUserProgress(
    userId: string,
    articleId: string,
    currentParagraph: number,
    scrollProgress: number,
    completed: boolean = false
  ): Promise<void> {
    const key = `${userId}-${articleId}`;
    MEM_USER_PROGRESS[key] = {
      currentParagraph,
      scrollProgress,
      completed,
      updatedAt: new Date().toISOString(),
    };

    if (isDatabaseConnected()) {
      try {
        await prisma.readingUserProgress.upsert({
          where: {
            userId_articleId: { userId, articleId },
          },
          update: {
            currentParagraph,
            scrollProgress,
            completed,
          },
          create: {
            userId,
            articleId,
            currentParagraph,
            scrollProgress,
            completed,
          },
        });
      } catch (err) {
        console.warn('Could not persist reading user progress to DB:', err);
      }
    }
  }

  public async getUserProgress(
    userId: string,
    articleId: string
  ): Promise<{ currentParagraph: number; scrollProgress: number; completed: boolean; updatedAt: string } | null> {
    if (isDatabaseConnected()) {
      try {
        const prog = await prisma.readingUserProgress.findUnique({
          where: {
            userId_articleId: { userId, articleId },
          },
        });
        if (prog) {
          return {
            currentParagraph: prog.currentParagraph,
            scrollProgress: prog.scrollProgress,
            completed: prog.completed,
            updatedAt: prog.updatedAt.toISOString(),
          };
        }
      } catch (err) {}
    }

    const key = `${userId}-${articleId}`;
    return MEM_USER_PROGRESS[key] || null;
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
