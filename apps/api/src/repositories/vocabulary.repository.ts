import { prisma } from '../lib/prisma.js';

export interface UserWordStateEntity {
  id: string;
  userId: string;
  wordId: string;
  repetition: number;
  interval: number;
  efactor: number;
  dueDate: Date;
  lastQuality: number;
  updatedAt: Date;
}

export interface VocabularyFolderEntity {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  wordCount: number;
  wordIds: string[];
}

export class VocabularyRepository {
  private static instance: VocabularyRepository;

  public static getInstance(): VocabularyRepository {
    if (!VocabularyRepository.instance) {
      VocabularyRepository.instance = new VocabularyRepository();
    }
    return VocabularyRepository.instance;
  }

  public async getUserWordStates(userId: string): Promise<UserWordStateEntity[]> {
    try {
      const states = await prisma.userWordState.findMany({ where: { userId } });
      return states as UserWordStateEntity[];
    } catch {
      return [];
    }
  }

  public async saveWordState(data: {
    userId: string;
    wordId: string;
    repetition: number;
    interval: number;
    efactor: number;
    dueDate: Date;
    lastQuality: number;
  }): Promise<UserWordStateEntity> {
    try {
      // Ensure user and word exist to prevent FK issues
      const existingUser = await prisma.user.findUnique({ where: { id: data.userId } });
      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: data.userId,
            email: `${data.userId}@lingual.local`,
            displayName: 'Learner',
            role: 'STUDENT',
          },
        });
      }

      const existingWord = await prisma.vocabulary.findUnique({ where: { id: data.wordId } });
      if (!existingWord) {
        await prisma.vocabulary.create({
          data: {
            id: data.wordId,
            targetText: data.wordId.replace('vocab-', ''),
            translation: 'Dịch nghĩa',
            phonetic: '/.../',
            cefrLevel: 'A1',
            partOfSpeech: 'noun',
          },
        });
      }

      const updated = await prisma.userWordState.upsert({
        where: {
          userId_wordId: {
            userId: data.userId,
            wordId: data.wordId,
          },
        },
        update: {
          repetition: data.repetition,
          interval: data.interval,
          efactor: data.efactor,
          dueDate: data.dueDate,
          lastQuality: data.lastQuality,
        },
        create: {
          userId: data.userId,
          wordId: data.wordId,
          repetition: data.repetition,
          interval: data.interval,
          efactor: data.efactor,
          dueDate: data.dueDate,
          lastQuality: data.lastQuality,
        },
      });

      return updated as UserWordStateEntity;
    } catch {
      return {
        id: `state-${data.userId}-${data.wordId}`,
        userId: data.userId,
        wordId: data.wordId,
        repetition: data.repetition,
        interval: data.interval,
        efactor: data.efactor,
        dueDate: data.dueDate,
        lastQuality: data.lastQuality,
        updatedAt: new Date(),
      };
    }
  }

  public async getFolders(userId: string): Promise<VocabularyFolderEntity[]> {
    try {
      const folders = await prisma.vocabularyFolder.findMany({
        where: { userId },
        include: { items: true },
      });
      return folders.map((f) => ({
        id: f.id,
        userId: f.userId,
        name: f.name,
        color: f.color,
        icon: f.icon,
        createdAt: f.createdAt.toISOString(),
        wordCount: f.items.length,
        wordIds: f.items.map((i) => i.wordId),
      }));
    } catch {
      return [];
    }
  }

  public async createFolder(data: {
    userId: string;
    name: string;
    color?: string;
    icon?: string;
  }): Promise<VocabularyFolderEntity> {
    const folderId = `f-${Date.now()}`;
    try {
      const existingUser = await prisma.user.findUnique({ where: { id: data.userId } });
      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: data.userId,
            email: `${data.userId}@lingual.local`,
            displayName: 'Learner',
            role: 'STUDENT',
          },
        });
      }

      const folder = await prisma.vocabularyFolder.create({
        data: {
          id: folderId,
          userId: data.userId,
          name: data.name,
          color: data.color || 'blue',
          icon: data.icon || 'folder',
        },
      });

      return {
        id: folder.id,
        userId: folder.userId,
        name: folder.name,
        color: folder.color,
        icon: folder.icon,
        createdAt: folder.createdAt.toISOString(),
        wordCount: 0,
        wordIds: [],
      };
    } catch {
      return {
        id: folderId,
        userId: data.userId,
        name: data.name,
        color: data.color || 'blue',
        icon: data.icon || 'folder',
        createdAt: new Date().toISOString(),
        wordCount: 0,
        wordIds: [],
      };
    }
  }

  public async updateFolder(
    folderId: string,
    data: { name?: string; color?: string; icon?: string }
  ): Promise<any> {
    try {
      const updated = await prisma.vocabularyFolder.update({
        where: { id: folderId },
        data: {
          name: data.name,
          color: data.color,
          icon: data.icon,
        },
        include: { items: true },
      });
      return {
        id: updated.id,
        userId: updated.userId,
        name: updated.name,
        color: updated.color,
        icon: updated.icon,
        createdAt: updated.createdAt.toISOString(),
        wordCount: updated.items.length,
        wordIds: updated.items.map((i) => i.wordId),
      };
    } catch {
      return null;
    }
  }

  public async deleteFolder(folderId: string): Promise<boolean> {
    try {
      await prisma.vocabularyFolder.delete({ where: { id: folderId } });
      return true;
    } catch {
      return false;
    }
  }

  public async addWordToFolder(folderId: string, wordId: string): Promise<boolean> {
    try {
      // Ensure word exists
      const existingWord = await prisma.vocabulary.findUnique({ where: { id: wordId } });
      if (!existingWord) {
        await prisma.vocabulary.create({
          data: {
            id: wordId,
            targetText: wordId.replace('vocab-', ''),
            translation: 'Dịch nghĩa',
            phonetic: '/.../',
            cefrLevel: 'A1',
            partOfSpeech: 'noun',
          },
        });
      }

      await prisma.folderVocabulary.upsert({
        where: {
          folderId_wordId: {
            folderId,
            wordId,
          },
        },
        update: {},
        create: {
          folderId,
          wordId,
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  public async removeWordFromFolder(folderId: string, wordId: string): Promise<boolean> {
    try {
      await prisma.folderVocabulary.deleteMany({
        where: { folderId, wordId },
      });
      return true;
    } catch {
      return false;
    }
  }

  public async getBookmarks(userId: string): Promise<string[]> {
    try {
      const bookmarks = await prisma.userBookmark.findMany({
        where: { userId },
        select: { wordId: true },
      });
      return bookmarks.map((b) => b.wordId);
    } catch {
      return [];
    }
  }

  public async toggleBookmark(userId: string, wordId: string): Promise<boolean> {
    try {
      // Ensure user and word exist
      const existingUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: userId,
            email: `${userId}@lingual.local`,
            displayName: 'Learner',
            role: 'STUDENT',
          },
        });
      }

      const existingWord = await prisma.vocabulary.findUnique({ where: { id: wordId } });
      if (!existingWord) {
        await prisma.vocabulary.create({
          data: {
            id: wordId,
            targetText: wordId.replace('vocab-', ''),
            translation: 'Dịch nghĩa',
            phonetic: '/.../',
            cefrLevel: 'A1',
            partOfSpeech: 'noun',
          },
        });
      }

      const existing = await prisma.userBookmark.findUnique({
        where: {
          userId_wordId: { userId, wordId },
        },
      });

      if (existing) {
        await prisma.userBookmark.delete({
          where: { id: existing.id },
        });
        return false;
      } else {
        await prisma.userBookmark.create({
          data: { userId, wordId },
        });
        return true;
      }
    } catch {
      return false;
    }
  }

  public async saveSrsReviewLog(log: {
    userId: string;
    wordId: string;
    rating: number;
    scheduledDays: number;
    elapsedDays: number;
    lastInterval: number;
    newInterval: number;
    responseTimeMs?: number;
    reviewedAt?: string;
  }): Promise<void> {
    try {
      await prisma.srsReviewLog.create({
        data: {
          userId: log.userId,
          wordId: log.wordId,
          rating: log.rating,
          scheduledDays: log.scheduledDays,
          elapsedDays: log.elapsedDays,
          lastInterval: log.lastInterval,
          newInterval: log.newInterval,
          responseTimeMs: log.responseTimeMs || 0,
          reviewedAt: log.reviewedAt ? new Date(log.reviewedAt) : new Date(),
        },
      });
    } catch (err) {
      console.warn('Could not persist SRS review log to DB:', err);
    }
  }

  public async getMajorTopics(): Promise<any[]> {
    try {
      const topics = await prisma.majorTopic.findMany({
        include: {
          subTopics: { orderBy: { order: 'asc' } },
        },
        orderBy: { order: 'asc' },
      });
      return topics;
    } catch {
      return [];
    }
  }
}

export const vocabularyRepository = VocabularyRepository.getInstance();
