import { prisma } from '../lib/prisma.js';
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

export class ReadingRepository {
  private static instance: ReadingRepository;

  public static getInstance(): ReadingRepository {
    if (!ReadingRepository.instance) {
      ReadingRepository.instance = new ReadingRepository();
    }
    return ReadingRepository.instance;
  }

  public async getArticles(filter?: { level?: string; topic?: string }): Promise<ReadingArticleListItem[]> {
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

    let filtered = MASTER_READING_ARTICLES;
    if (filter?.level && filter.level !== 'all') {
      filtered = filtered.filter((a) => a.level.toLowerCase() === filter.level!.toLowerCase());
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
      vocabularyCount: (a as any).vocabularyHighlights?.length || 5,
      questionCount: a.questions.length,
    }));
  }

  public async getArticleById(id: string): Promise<any | null> {
    try {
      const a = await prisma.readingArticle.findUnique({
        where: { id },
        include: {
          paragraphs: { orderBy: { order: 'asc' } },
          questions: { orderBy: { order: 'asc' } },
        },
      });

      if (a) {
        return {
          id: a.id,
          title: a.title,
          subtitle: a.subtitle,
          level: a.level,
          topic: a.topic,
          author: a.author,
          estimatedMinutes: a.estimatedMinutes,
          wordCount: a.wordCount,
          coverImage: a.coverImage,
          paragraphs: a.paragraphs.map((p) => ({
            id: p.id,
            order: p.order,
            textEn: p.english,
            textVi: p.vietnamese,
          })),
          vocabularyHighlights: [],
          questions: a.questions.map((q) => ({
            id: q.id,
            type: q.type,
            prompt: q.question,
            options: JSON.parse(q.optionsJson || '[]'),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          })),
        };
      }
    } catch (err) {
      console.warn('Falling back to static reading article by id:', err);
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

  public async getUserProgress(
    userId: string,
    articleId: string
  ): Promise<{ currentParagraph: number; scrollProgress: number; completed: boolean; updatedAt: string } | null> {
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

    return null;
  }

  public async createAttempt(data: ReadingAttemptEntity): Promise<ReadingAttemptEntity> {
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
    } catch (err) {
      console.warn('Could not persist readingAttempt in DB:', err);
    }

    return data;
  }

  public async getUserAttempts(userId: string, limit: number = 20): Promise<ReadingAttemptEntity[]> {
    try {
      const attempts = await prisma.readingAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return attempts.map((a) => ({
        ...a,
        answers: JSON.parse(a.answersJson || '[]'),
        createdAt: a.createdAt.toISOString(),
      }));
    } catch {
      return [];
    }
  }
}

export const readingRepository = ReadingRepository.getInstance();
