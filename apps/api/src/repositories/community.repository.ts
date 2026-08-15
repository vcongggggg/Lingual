import { prisma, isDatabaseConnected } from '../lib/prisma.js';

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

const MEM_PROFILES: CommunityProfileEntity[] = [
  {
    id: 'prof-demo-01',
    userId: 'demo-user-id-001',
    bio: 'Passionate about mastering English and preparing for IELTS 7.5.',
    avatar: 'mascot-scholar',
    targetLanguage: 'en',
    currentLevel: 'B2 Upper Intermediate',
    visibility: 'public',
    badges: ['streak_7', 'vocab_master', 'speed_reader'],
  },
];

const MEM_NOTES: StudyNoteEntity[] = [
  {
    id: 'note-seed-01',
    authorId: 'demo-user-id-001',
    authorName: 'Nguyễn Văn A',
    authorAvatar: 'mascot-scholar',
    title: 'Cách phân biệt In time vs On time cực dễ nhớ',
    content:
      'On time = Đúng giờ theo lịch trình (The train arrived on time).\nIn time = Kịp giờ trước khi quá muộn (We arrived in time to catch the train).',
    tags: ['Grammar', 'English Tips', 'Prepositions'],
    likesCount: 14,
    likedBy: ['user-02', 'user-03'],
    reactions: { like: 10, celebrate: 4 },
    commentsCount: 2,
    comments: [
      {
        id: 'comm-1',
        authorId: 'user-02',
        authorName: 'Trần Thị B',
        content: 'Ví dụ rất ngắn gọn dễ hiểu, cảm ơn bạn nhiều!',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    isPublic: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export class CommunityRepository {
  private static instance: CommunityRepository;

  public static getInstance(): CommunityRepository {
    if (!CommunityRepository.instance) {
      CommunityRepository.instance = new CommunityRepository();
    }
    return CommunityRepository.instance;
  }

  public async getProfile(userId: string): Promise<CommunityProfileEntity | null> {
    if (isDatabaseConnected()) {
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
    }

    return MEM_PROFILES.find((p) => p.userId === userId) || null;
  }

  public async upsertProfile(data: CommunityProfileEntity): Promise<CommunityProfileEntity> {
    if (isDatabaseConnected()) {
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
      } catch {}
    }

    const idx = MEM_PROFILES.findIndex((p) => p.userId === data.userId);
    if (idx >= 0) {
      MEM_PROFILES[idx] = data;
    } else {
      MEM_PROFILES.push(data);
    }
    return data;
  }

  public async getNotes(limit: number = 20): Promise<StudyNoteEntity[]> {
    if (isDatabaseConnected()) {
      try {
        const notes = await prisma.studyNote.findMany({
          where: { isPublic: true },
          include: { author: true, comments: true, reactions: true },
          orderBy: { createdAt: 'desc' },
          take: limit,
        });
        if (notes.length > 0) {
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
        }
      } catch {}
    }

    return MEM_NOTES.filter((n) => n.isPublic).slice(0, limit);
  }

  public async createNote(data: StudyNoteEntity): Promise<StudyNoteEntity> {
    if (isDatabaseConnected()) {
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
      } catch {}
    }

    MEM_NOTES.unshift(data);
    return data;
  }
}

export const communityRepository = CommunityRepository.getInstance();
