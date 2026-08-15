import { prisma, isDatabaseConnected } from '../lib/prisma.js';

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

const MEM_WORD_STATES: UserWordStateEntity[] = [];
const MEM_FOLDERS: VocabularyFolderEntity[] = [
  {
    id: 'f-tech',
    userId: 'demo-user-id-001',
    name: 'Technology & AI',
    color: 'emerald',
    icon: 'cpu',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    wordCount: 3,
    wordIds: ['v-1', 'v-2', 'v-3'],
  },
];

export class VocabularyRepository {
  private static instance: VocabularyRepository;

  public static getInstance(): VocabularyRepository {
    if (!VocabularyRepository.instance) {
      VocabularyRepository.instance = new VocabularyRepository();
    }
    return VocabularyRepository.instance;
  }

  public async getUserWordStates(userId: string): Promise<UserWordStateEntity[]> {
    if (isDatabaseConnected()) {
      try {
        const states = await prisma.userWordState.findMany({ where: { userId } });
        if (states.length > 0) return states as UserWordStateEntity[];
      } catch {}
    }
    return MEM_WORD_STATES.filter((s) => s.userId === userId);
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
    const record: UserWordStateEntity = {
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

    if (isDatabaseConnected()) {
      try {
        await prisma.userWordState.upsert({
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
      } catch {}
    }

    const idx = MEM_WORD_STATES.findIndex((s) => s.userId === data.userId && s.wordId === data.wordId);
    if (idx >= 0) {
      MEM_WORD_STATES[idx] = record;
    } else {
      MEM_WORD_STATES.push(record);
    }
    return record;
  }

  public async getFolders(userId: string): Promise<VocabularyFolderEntity[]> {
    if (isDatabaseConnected()) {
      try {
        const folders = await prisma.vocabularyFolder.findMany({
          where: { userId },
          include: { items: true },
        });
        if (folders.length > 0) {
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
        }
      } catch {}
    }
    return MEM_FOLDERS.filter((f) => f.userId === userId);
  }

  public async createFolder(data: {
    userId: string;
    name: string;
    color?: string;
    icon?: string;
  }): Promise<VocabularyFolderEntity> {
    const newFolder: VocabularyFolderEntity = {
      id: `f-${Date.now()}`,
      userId: data.userId,
      name: data.name,
      color: data.color || 'blue',
      icon: data.icon || 'folder',
      createdAt: new Date().toISOString(),
      wordCount: 0,
      wordIds: [],
    };

    if (isDatabaseConnected()) {
      try {
        await prisma.vocabularyFolder.create({
          data: {
            id: newFolder.id,
            userId: newFolder.userId,
            name: newFolder.name,
            color: newFolder.color,
            icon: newFolder.icon,
          },
        });
      } catch {}
    }

    MEM_FOLDERS.push(newFolder);
    return newFolder;
  }
}

export const vocabularyRepository = VocabularyRepository.getInstance();
