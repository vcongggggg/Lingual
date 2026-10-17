import { prisma } from '../lib/prisma.js';

export interface CommunityProfileEntity {
  id: string;
  userId: string;
  bio: string;
  avatar: string;
  targetLanguage: string;
  currentLevel: string;
  visibility: 'public' | 'friends_only' | 'private';
  badges: string[];
}

export interface StudyNoteEntity {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  tags: string[];
  likesCount: number;
  likedBy: string[];
  reactions: Record<string, number>;
  commentsCount: number;
  comments: Array<{
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: string;
  }>;
  isPublic: boolean;
  createdAt: string;
}

export class CommunityRepository {
  private static instance: CommunityRepository;

  public static getInstance(): CommunityRepository {
    if (!CommunityRepository.instance) {
      CommunityRepository.instance = new CommunityRepository();
    }
    return CommunityRepository.instance;
  }

  public async getProfile(userId: string): Promise<CommunityProfileEntity | null> {
    try {
      const p = await prisma.communityProfile.findUnique({ where: { userId } });
      if (p) {
        return {
          id: p.id,
          userId: p.userId,
          bio: p.bio,
          avatar: p.avatar,
          targetLanguage: p.targetLanguage,
          currentLevel: p.currentLevel,
          visibility: p.visibility as any,
          badges: JSON.parse(p.badgesJson || '[]'),
        };
      }
    } catch {}

    return null;
  }

  public async upsertProfile(data: CommunityProfileEntity): Promise<CommunityProfileEntity> {
    try {
      await prisma.communityProfile.upsert({
        where: { userId: data.userId },
        update: {
          bio: data.bio,
          avatar: data.avatar,
          targetLanguage: data.targetLanguage,
          currentLevel: data.currentLevel,
          visibility: data.visibility,
          badgesJson: JSON.stringify(data.badges),
        },
        create: {
          id: data.id,
          userId: data.userId,
          bio: data.bio,
          avatar: data.avatar,
          targetLanguage: data.targetLanguage,
          currentLevel: data.currentLevel,
          visibility: data.visibility,
          badgesJson: JSON.stringify(data.badges),
        },
      });
    } catch (err) {
      console.warn('Could not upsert community profile in DB:', err);
    }

    return data;
  }

  public async getNotes(limit: number = 20): Promise<StudyNoteEntity[]> {
    try {
      const notes = await prisma.studyNote.findMany({
        where: { isPublic: true },
        include: { author: true, comments: true, reactions: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return notes.map((n) => ({
        id: n.id,
        authorId: n.authorId,
        authorName: n.author.displayName,
        authorAvatar: 'mascot-scholar',
        title: n.title,
        content: n.content,
        tags: JSON.parse(n.tagsJson || '[]'),
        likesCount: n.likesCount,
        likedBy: [],
        reactions: n.reactions.reduce((acc: any, r) => {
          acc[r.type] = (acc[r.type] || 0) + 1;
          return acc;
        }, {}),
        commentsCount: n.comments.length,
        comments: n.comments.map((c) => ({
          id: c.id,
          authorId: c.authorId,
          authorName: 'Member',
          content: c.content,
          createdAt: c.createdAt.toISOString(),
        })),
        isPublic: n.isPublic,
        createdAt: n.createdAt.toISOString(),
      }));
    } catch {
      return [];
    }
  }

  public async createNote(data: StudyNoteEntity): Promise<StudyNoteEntity> {
    try {
      await prisma.studyNote.create({
        data: {
          id: data.id,
          authorId: data.authorId,
          title: data.title,
          content: data.content,
          tagsJson: JSON.stringify(data.tags),
          isPublic: data.isPublic,
          likesCount: data.likesCount,
          createdAt: new Date(data.createdAt),
        },
      });
    } catch (err) {
      console.warn('Could not create study note in DB:', err);
    }

    return data;
  }
}

export const communityRepository = CommunityRepository.getInstance();
