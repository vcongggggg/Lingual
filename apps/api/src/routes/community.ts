import { Router } from 'express';
import {
  SocialProfile,
  LearningActivity,
  StudyNote,
  StudyNoteReaction,
  StudyNoteComment,
  StudyGroup,
  StudyGroupMember,
  GroupPost,
  LeaderboardEntry,
  Achievement,
  UserAchievement,
  CommunityNotification,
  Friendship,
  Follow,
  SocialPrivacySettings,
  createLearningActivity,
  canViewActivity,
  canCommentOnNote,
  canReactToNote,
  validateStudyNoteContent,
  normalizeStudyNote,
  canJoinGroup,
  canManageGroup,
  calculateSocialXP,
  calculateLeaderboardScore,
  rankLeaderboardEntries,
  calculateAchievementProgress,
  evaluateAchievementUnlock,
} from '../../../../packages/domain/src/index.js';

export const communityRouter = Router();

// ============================================================================
// MASTER SEED DATA & IN-MEMORY REPOSITORY
// ============================================================================

export const MOCK_PROFILES: SocialProfile[] = [
  {
    userId: 'demo-user-id-001',
    username: 'minhtran',
    displayName: 'Minh Trần (Bạn)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Đang chinh phục IELTS 7.5 & TOEIC 900+ cùng LinguaFlow 🚀',
    targetLanguage: 'English',
    level: 'B2',
    totalXP: 1450,
    currentStreak: 5,
    totalLearningDays: 24,
    vocabularyLearned: 380,
    listeningSessions: 18,
    writingSubmissions: 9,
    readingCompleted: 12,
    examsCompleted: 4,
    privacy: {
      profileVisibility: 'public',
      activityVisibility: 'public',
      allowFriendRequests: true,
      allowGroupInvites: true,
      showOnLeaderboard: true,
      showAchievements: true,
    },
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    userId: 'user-alice-002',
    username: 'alicenguyen',
    displayName: 'Alice Nguyễn',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    bio: 'IELTS Tutor & Chuyên viên ngôn ngữ học. Chia sẻ kinh nghiệm luyện viết mỗi ngày.',
    targetLanguage: 'English',
    level: 'C1',
    totalXP: 3200,
    currentStreak: 19,
    totalLearningDays: 62,
    vocabularyLearned: 850,
    listeningSessions: 42,
    writingSubmissions: 35,
    readingCompleted: 40,
    examsCompleted: 12,
    privacy: {
      profileVisibility: 'public',
      activityVisibility: 'public',
      allowFriendRequests: true,
      allowGroupInvites: true,
      showOnLeaderboard: true,
      showAchievements: true,
    },
    createdAt: '2026-01-01T08:00:00.000Z',
  },
  {
    userId: 'user-kenji-003',
    username: 'kenjisato',
    displayName: 'Kenji Sato',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'JLPT N2 & English Enthusiast. Let us study together!',
    targetLanguage: 'Japanese',
    level: 'B1',
    totalXP: 2100,
    currentStreak: 12,
    totalLearningDays: 45,
    vocabularyLearned: 520,
    listeningSessions: 30,
    writingSubmissions: 14,
    readingCompleted: 22,
    examsCompleted: 8,
    privacy: {
      profileVisibility: 'public',
      activityVisibility: 'public',
      allowFriendRequests: true,
      allowGroupInvites: true,
      showOnLeaderboard: true,
      showAchievements: true,
    },
    createdAt: '2026-02-01T08:00:00.000Z',
  },
  {
    userId: 'user-linhdan-004',
    username: 'linhdan',
    displayName: 'Linh Đan',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    bio: 'Học sinh chuyên Anh. Mục tiêu VSTEP C1 trước tháng 12.',
    targetLanguage: 'English',
    level: 'B2',
    totalXP: 1850,
    currentStreak: 8,
    totalLearningDays: 31,
    vocabularyLearned: 440,
    listeningSessions: 22,
    writingSubmissions: 18,
    readingCompleted: 19,
    examsCompleted: 6,
    privacy: {
      profileVisibility: 'public',
      activityVisibility: 'public',
      allowFriendRequests: true,
      allowGroupInvites: true,
      showOnLeaderboard: true,
      showAchievements: true,
    },
    createdAt: '2026-02-10T08:00:00.000Z',
  },
];

export const MOCK_FRIENDSHIPS: Friendship[] = [
  {
    id: 'f-1',
    requesterId: 'demo-user-id-001',
    addresseeId: 'user-alice-002',
    status: 'accepted',
    createdAt: '2026-02-10T08:00:00.000Z',
    updatedAt: '2026-02-10T09:00:00.000Z',
  },
  {
    id: 'f-2',
    requesterId: 'user-kenji-003',
    addresseeId: 'demo-user-id-001',
    status: 'accepted',
    createdAt: '2026-02-12T08:00:00.000Z',
    updatedAt: '2026-02-12T10:00:00.000Z',
  },
  {
    id: 'f-3',
    requesterId: 'user-linhdan-004',
    addresseeId: 'demo-user-id-001',
    status: 'pending',
    createdAt: '2026-02-14T08:00:00.000Z',
    updatedAt: '2026-02-14T08:00:00.000Z',
  },
];

export const MOCK_FOLLOWS: Follow[] = [
  { followerId: 'demo-user-id-001', followingId: 'user-alice-002', createdAt: '2026-02-10T08:00:00.000Z' },
  { followerId: 'demo-user-id-001', followingId: 'user-kenji-003', createdAt: '2026-02-12T08:00:00.000Z' },
  { followerId: 'user-alice-002', followingId: 'demo-user-id-001', createdAt: '2026-02-11T08:00:00.000Z' },
];

export const MOCK_ACTIVITIES: LearningActivity[] = [
  {
    id: 'act-001',
    userId: 'user-alice-002',
    userName: 'Alice Nguyễn',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    type: 'exam_completed',
    title: 'TOEIC Official Format Mock Test 01 (990/990)',
    description: 'Đạt điểm tuyệt đối 990/990 với độ chính xác 100%!',
    visibility: 'public',
    timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'act-002',
    userId: 'demo-user-id-001',
    userName: 'Minh Trần (Bạn)',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    type: 'reading_completed',
    title: 'The Ecology of Urban Pollinators (IELTS Academic)',
    description: 'Đọc hiểu 285 WPM, trả lời đúng 100% câu hỏi.',
    visibility: 'public',
    timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  },
  {
    id: 'act-003',
    userId: 'user-kenji-003',
    userName: 'Kenji Sato',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    type: 'streak_milestone',
    title: 'Đạt chuỗi học tập 12 ngày liên tiếp! 🔥',
    visibility: 'public',
    timestamp: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
  },
  {
    id: 'act-004',
    userId: 'user-linhdan-004',
    userName: 'Linh Đan',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    type: 'writing_completed',
    title: 'See & Write: Environmental Protection & Green Economy',
    description: 'Đạt điểm 94/100, mở rộng 8 cụm từ vựng học thuật C1.',
    visibility: 'public',
    timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
  },
];

export const MOCK_STUDY_NOTES: StudyNote[] = [
  {
    id: 'note-001',
    userId: 'user-alice-002',
    authorName: 'Alice Nguyễn',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    title: 'Cách dùng In / On / At trong mốc thời gian không bao giờ nhầm',
    content: `1. IN: Dùng cho khoảng thời gian lớn (Năm, Tháng, Mùa, Thế kỷ)\n- In 2026, in December, in summer, in the 21st century.\n\n2. ON: Dùng cho ngày cụ thể và thứ trong tuần\n- On Monday, on my birthday, on Christmas Day, on July 14th.\n\n3. AT: Dùng cho thời điểm chính xác và các dịp lễ chung\n- At 3:00 PM, at noon, at midnight, at weekend, at Christmas.`,
    tags: ['grammar', 'prepositions', 'ielts', 'toeic'],
    visibility: 'public',
    reactionCount: 14,
    reactions: { helpful: 8, inspiring: 4, useful: 2 },
    commentCount: 3,
    createdAt: '2026-02-12T10:00:00.000Z',
    updatedAt: '2026-02-12T10:00:00.000Z',
  },
  {
    id: 'note-002',
    userId: 'demo-user-id-001',
    authorName: 'Minh Trần',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    title: 'Top 5 Collocations điểm cao cho bài thi Writing Task 2',
    content: `1. Pose a severe threat to (Gây mối đe dọa nghiêm trọng tới)\n2. Mitigate the adverse effects of (Giảm thiểu tác động tiêu cực của)\n3. Foster sustainable economic development (Thúc đẩy phát triển kinh tế bền vững)\n4. Bridge the socioeconomic gap (Thu hẹp khoảng cách kinh tế - xã hội)\n5. Allocate financial resources into (Phân bổ nguồn lực tài chính vào)`,
    tags: ['writing', 'collocations', 'c1-vocab'],
    visibility: 'public',
    reactionCount: 9,
    reactions: { helpful: 6, inspiring: 2, useful: 1 },
    commentCount: 2,
    createdAt: '2026-02-13T14:00:00.000Z',
    updatedAt: '2026-02-13T14:00:00.000Z',
  },
];

export const MOCK_NOTE_COMMENTS: StudyNoteComment[] = [
  {
    id: 'c-001',
    noteId: 'note-001',
    userId: 'demo-user-id-001',
    authorName: 'Minh Trần',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    content: 'Cảm ơn bạn Alice! Quy tắc hình tam giác ngược giúp mình nhớ rất nhanh.',
    createdAt: '2026-02-12T11:00:00.000Z',
  },
  {
    id: 'c-002',
    noteId: 'note-001',
    userId: 'user-kenji-003',
    authorName: 'Kenji Sato',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    content: 'Very clear explanation! Bookmarked.',
    createdAt: '2026-02-12T12:30:00.000Z',
  },
];

export const MOCK_NOTE_REACTIONS: StudyNoteReaction[] = [
  { noteId: 'note-001', userId: 'demo-user-id-001', reactionType: 'helpful', createdAt: '2026-02-12T11:00:00.000Z' },
  { noteId: 'note-002', userId: 'user-alice-002', reactionType: 'inspiring', createdAt: '2026-02-13T15:00:00.000Z' },
];

export const MOCK_STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'group-toeic-900',
    name: 'Chiến Binh TOEIC 900+ ETS',
    description: 'Cùng giải đề thi thử TOEIC mỗi ngày, chữa lỗi sai Part 5 & 7 và nâng cao phản xạ nghe Part 1-4.',
    topic: 'TOEIC Prep',
    level: 'B2',
    ownerId: 'user-alice-002',
    memberCount: 4,
    maxMembers: 50,
    visibility: 'public',
    totalGroupXP: 5800,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80',
    createdAt: '2026-01-20T08:00:00.000Z',
  },
  {
    id: 'group-ielts-75',
    name: 'IELTS Academic Writing & Reading Master',
    description: 'Thảo luận dàn ý Task 2, phân tích từ vựng Band 8+ và luyện đọc các bài báo học thuật quốc tế.',
    topic: 'IELTS Academic',
    level: 'C1',
    ownerId: 'demo-user-id-001',
    memberCount: 3,
    maxMembers: 30,
    visibility: 'public',
    totalGroupXP: 4200,
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80',
    createdAt: '2026-02-01T08:00:00.000Z',
  },
];

export const MOCK_GROUP_MEMBERS: StudyGroupMember[] = [
  {
    groupId: 'group-toeic-900',
    userId: 'user-alice-002',
    userName: 'Alice Nguyễn',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    role: 'owner',
    joinedAt: '2026-01-20T08:00:00.000Z',
    contributedXP: 2400,
  },
  {
    groupId: 'group-toeic-900',
    userId: 'demo-user-id-001',
    userName: 'Minh Trần',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'member',
    joinedAt: '2026-01-22T08:00:00.000Z',
    contributedXP: 1450,
  },
  {
    groupId: 'group-ielts-75',
    userId: 'demo-user-id-001',
    userName: 'Minh Trần',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'owner',
    joinedAt: '2026-02-01T08:00:00.000Z',
    contributedXP: 1450,
  },
];

export const MOCK_GROUP_POSTS: GroupPost[] = [
  {
    id: 'post-001',
    groupId: 'group-toeic-900',
    authorId: 'user-alice-002',
    authorName: 'Alice Nguyễn',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    content: 'Chào cả nhóm! Hôm nay mọi người cùng làm Mock Test 01 trong Exam Practice Lab và thảo luận câu sai Part 5 nhé.',
    commentCount: 2,
    createdAt: '2026-02-14T09:00:00.000Z',
  },
];

export const MASTER_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-note',
    code: 'FIRST_NOTE',
    title: 'Nhà Tri Thức Trẻ',
    description: 'Tạo và chia sẻ ghi chú học tập đầu tiên cho cộng đồng.',
    icon: 'BookOpen',
    category: 'social',
    xpReward: 30,
    maxProgress: 1,
  },
  {
    id: 'ach-first-friend',
    code: 'FIRST_FRIEND',
    title: 'Đôi Bạn Cùng Tiến',
    description: 'Kết nối bạn học tập đầu tiên trên LinguaFlow.',
    icon: 'Users',
    category: 'social',
    xpReward: 25,
    maxProgress: 1,
  },
  {
    id: 'ach-first-group',
    code: 'FIRST_GROUP',
    title: 'Gia Nhập Biệt Đội',
    description: 'Tham gia một nhóm học tập và thảo luận kiến thức.',
    icon: 'Shield',
    category: 'social',
    xpReward: 30,
    maxProgress: 1,
  },
  {
    id: 'ach-helpful-learner',
    code: 'HELPFUL_LEARNER',
    title: 'Người Truyền Cảm Hứng',
    description: 'Nhận được 10 lượt thả cảm xúc hữu ích từ bạn bè.',
    icon: 'Sparkles',
    category: 'mastery',
    xpReward: 50,
    maxProgress: 10,
  },
  {
    id: 'ach-study-buddy',
    code: 'STUDY_BUDDY',
    title: 'Mạng Lưới Học Tập',
    description: 'Kết bạn với từ 5 người cùng chí hướng học tập.',
    icon: 'UserPlus',
    category: 'social',
    xpReward: 40,
    maxProgress: 5,
  },
  {
    id: 'ach-community-streak',
    code: 'COMMUNITY_STREAK',
    title: 'Chiến Binh Bất Bại',
    description: 'Duy trì chuỗi học tập 7 ngày liên tiếp.',
    icon: 'Flame',
    category: 'streak',
    xpReward: 50,
    maxProgress: 7,
  },
  {
    id: 'ach-top-learner',
    code: 'TOP_LEARNER',
    title: 'Học Thần LinguaFlow',
    description: 'Tích lũy 1,000 XP học tập trên toàn hệ thống.',
    icon: 'Trophy',
    category: 'mastery',
    xpReward: 100,
    maxProgress: 1000,
  },
];

export const MOCK_NOTIFICATIONS: CommunityNotification[] = [
  {
    id: 'notif-1',
    userId: 'demo-user-id-001',
    type: 'friend_request',
    actorId: 'user-linhdan-004',
    actorName: 'Linh Đan',
    actorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    message: 'đã gửi cho bạn lời mời kết bạn.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'demo-user-id-001',
    type: 'note_reaction',
    actorId: 'user-alice-002',
    actorName: 'Alice Nguyễn',
    actorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    targetId: 'note-002',
    message: 'đã thả cảm xúc truyền cảm hứng vào ghi chú của bạn.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
  },
];

// ============================================================================
// API ROUTES
// ============================================================================

/**
 * GET /api/v1/community/profile/:userId
 * Retrieve public social profile
 */
communityRouter.get('/profile/:userId', (req, res) => {
  const profile = MOCK_PROFILES.find((p) => p.userId === req.params.userId);
  if (!profile) {
    return res.status(404).json({ error: 'Không tìm thấy hồ sơ người dùng.' });
  }

  // Enforce privacy: if private and not owner, return minimal placeholder
  const requesterId = (req.query.viewerId as string) || 'demo-user-id-001';
  if (profile.privacy.profileVisibility === 'private' && requesterId !== profile.userId) {
    return res.json({
      profile: {
        userId: profile.userId,
        username: profile.username,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        isPrivate: true,
        privacy: profile.privacy,
      },
    });
  }

  return res.json({ profile });
});

/**
 * GET /api/v1/community/friends
 * List friends and followings
 */
communityRouter.get('/friends', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';

  // Get accepted friends
  const friendIds = MOCK_FRIENDSHIPS.filter(
    (f) => (f.requesterId === userId || f.addresseeId === userId) && f.status === 'accepted'
  ).map((f) => (f.requesterId === userId ? f.addresseeId : f.requesterId));

  const friends = MOCK_PROFILES.filter((p) => friendIds.includes(p.userId));

  // Get following profiles
  const followingIds = MOCK_FOLLOWS.filter((f) => f.followerId === userId).map((f) => f.followingId);
  const followings = MOCK_PROFILES.filter((p) => followingIds.includes(p.userId));

  return res.json({ friends, followings, totalFriends: friends.length, totalFollowing: followings.length });
});

/**
 * GET /api/v1/community/friend-requests
 * List pending friend requests
 */
communityRouter.get('/friend-requests', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const pendingFriendships = MOCK_FRIENDSHIPS.filter(
    (f) => f.addresseeId === userId && f.status === 'pending'
  );

  const requests = pendingFriendships.map((f) => {
    const requester = MOCK_PROFILES.find((p) => p.userId === f.requesterId);
    return {
      friendshipId: f.id,
      requesterId: f.requesterId,
      requesterName: requester?.displayName || 'Người dùng',
      requesterAvatar: requester?.avatarUrl,
      createdAt: f.createdAt,
    };
  });

  return res.json({ requests, total: requests.length });
});

/**
 * POST /api/v1/community/friends/:targetUserId
 * Send friend request
 */
communityRouter.post('/friends/:targetUserId', (req, res) => {
  const currentUserId = (req.body.userId as string) || 'demo-user-id-001';
  const targetId = req.params.targetUserId;

  if (currentUserId === targetId) {
    return res.status(400).json({ error: 'Không thể tự kết bạn với chính mình.' });
  }

  const existing = MOCK_FRIENDSHIPS.find(
    (f) =>
      (f.requesterId === currentUserId && f.addresseeId === targetId) ||
      (f.requesterId === targetId && f.addresseeId === currentUserId)
  );

  if (existing) {
    return res.json({ success: true, friendship: existing, message: 'Yêu cầu kết bạn đã tồn tại.' });
  }

  const newFriendship: Friendship = {
    id: `f-${Date.now()}`,
    requesterId: currentUserId,
    addresseeId: targetId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_FRIENDSHIPS.push(newFriendship);

  return res.status(201).json({ success: true, friendship: newFriendship, message: 'Đã gửi lời mời kết bạn.' });
});

/**
 * POST /api/v1/community/friends/:targetUserId/accept
 * Accept friend request
 */
communityRouter.post('/friends/:targetUserId/accept', (req, res) => {
  const currentUserId = (req.body.userId as string) || 'demo-user-id-001';
  const targetId = req.params.targetUserId;

  const friendship = MOCK_FRIENDSHIPS.find(
    (f) => f.requesterId === targetId && f.addresseeId === currentUserId && f.status === 'pending'
  );

  if (!friendship) {
    return res.status(404).json({ error: 'Không tìm thấy lời mời kết bạn cần chấp nhận.' });
  }

  friendship.status = 'accepted';
  friendship.updatedAt = new Date().toISOString();

  return res.json({ success: true, friendship, message: 'Đã đồng ý kết bạn.' });
});

/**
 * POST /api/v1/community/friends/:targetUserId/reject
 * Reject friend request
 */
communityRouter.post('/friends/:targetUserId/reject', (req, res) => {
  const currentUserId = (req.body.userId as string) || 'demo-user-id-001';
  const targetId = req.params.targetUserId;

  const idx = MOCK_FRIENDSHIPS.findIndex(
    (f) => f.requesterId === targetId && f.addresseeId === currentUserId && f.status === 'pending'
  );

  if (idx >= 0) {
    MOCK_FRIENDSHIPS.splice(idx, 1);
  }

  return res.json({ success: true, message: 'Đã từ chối lời mời kết bạn.' });
});

/**
 * POST /api/v1/community/users/:targetUserId/follow
 * Follow a user
 */
communityRouter.post('/users/:targetUserId/follow', (req, res) => {
  const currentUserId = (req.body.userId as string) || 'demo-user-id-001';
  const targetId = req.params.targetUserId;

  if (currentUserId === targetId) {
    return res.status(400).json({ error: 'Không thể tự theo dõi chính mình.' });
  }

  const existing = MOCK_FOLLOWS.find((f) => f.followerId === currentUserId && f.followingId === targetId);
  if (existing) {
    return res.json({ success: true, message: 'Đang theo dõi người dùng này.' });
  }

  MOCK_FOLLOWS.push({ followerId: currentUserId, followingId: targetId, createdAt: new Date().toISOString() });
  return res.status(201).json({ success: true, message: 'Đã theo dõi người dùng thành công.' });
});

/**
 * DELETE /api/v1/community/users/:targetUserId/follow
 * Unfollow a user
 */
communityRouter.delete('/users/:targetUserId/follow', (req, res) => {
  const currentUserId = (req.body.userId as string) || 'demo-user-id-001';
  const targetId = req.params.targetUserId;

  const idx = MOCK_FOLLOWS.findIndex((f) => f.followerId === currentUserId && f.followingId === targetId);
  if (idx >= 0) {
    MOCK_FOLLOWS.splice(idx, 1);
  }
  return res.json({ success: true, message: 'Đã hủy theo dõi.' });
});

/**
 * GET /api/v1/community/feed
 * Activity feed (sanitized and newest first)
 */
communityRouter.get('/feed', (req, res) => {
  const viewerId = (req.query.viewerId as string) || 'demo-user-id-001';

  // Filter activities visible to viewer
  const visible = MOCK_ACTIVITIES.filter((act) => {
    const friendship = MOCK_FRIENDSHIPS.find(
      (f) =>
        ((f.requesterId === viewerId && f.addresseeId === act.userId) ||
          (f.requesterId === act.userId && f.addresseeId === viewerId)) &&
        f.status === 'accepted'
    );
    return canViewActivity(act, viewerId, friendship ? 'accepted' : undefined);
  });

  // Sort newest first
  visible.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return res.json({ activities: visible, total: visible.length });
});

/**
 * GET /api/v1/community/notes
 * List study notes
 */
communityRouter.get('/notes', (req, res) => {
  const { tag, q } = req.query;
  let notes = [...MOCK_STUDY_NOTES];

  if (tag) {
    notes = notes.filter((n) => n.tags.includes(String(tag).toLowerCase()));
  }
  if (q) {
    const query = String(q).toLowerCase();
    notes = notes.filter((n) => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query));
  }

  notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json({ notes, total: notes.length });
});

/**
 * GET /api/v1/community/notes/:noteId
 * Get single study note with comments
 */
communityRouter.get('/notes/:noteId', (req, res) => {
  const note = MOCK_STUDY_NOTES.find((n) => n.id === req.params.noteId);
  if (!note) {
    return res.status(404).json({ error: 'Không tìm thấy ghi chú học tập.' });
  }

  const comments = MOCK_NOTE_COMMENTS.filter((c) => c.noteId === note.id);
  return res.json({ note, comments });
});

/**
 * POST /api/v1/community/notes
 * Create study note
 */
communityRouter.post('/notes', (req, res) => {
  const { title, content, tags = [], visibility = 'public', userId = 'demo-user-id-001' } = req.body;

  const validation = validateStudyNoteContent(title, content, tags);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const normalized = normalizeStudyNote(title, content, tags, visibility);
  const user = MOCK_PROFILES.find((p) => p.userId === userId) || MOCK_PROFILES[0];

  const newNote: StudyNote = {
    id: `note-${Date.now()}`,
    userId: user.userId,
    authorName: user.displayName,
    authorAvatar: user.avatarUrl,
    title: normalized.title,
    content: normalized.content,
    tags: normalized.tags,
    visibility: normalized.visibility,
    reactionCount: 0,
    reactions: { helpful: 0, inspiring: 0, useful: 0 },
    commentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  MOCK_STUDY_NOTES.unshift(newNote);

  // Authoritatively broadcast activity & award XP
  const xpEarned = calculateSocialXP('NOTE_CREATED');
  user.totalXP += xpEarned;

  MOCK_ACTIVITIES.unshift(
    createLearningActivity(user.userId, user.displayName, 'note_created', newNote.title, {}, normalized.visibility, user.avatarUrl)
  );

  return res.status(201).json({ note: newNote, xpEarned, message: 'Đã tạo ghi chú thành công!' });
});

/**
 * POST /api/v1/community/notes/:noteId/reactions
 * Toggle reaction on a study note
 */
communityRouter.post('/notes/:noteId/reactions', (req, res) => {
  const { reactionType = 'helpful', userId = 'demo-user-id-001' } = req.body;
  const note = MOCK_STUDY_NOTES.find((n) => n.id === req.params.noteId);

  if (!note) {
    return res.status(404).json({ error: 'Không tìm thấy ghi chú.' });
  }

  const existingIdx = MOCK_NOTE_REACTIONS.findIndex((r) => r.noteId === note.id && r.userId === userId);

  if (existingIdx >= 0) {
    const prevType = MOCK_NOTE_REACTIONS[existingIdx].reactionType;
    MOCK_NOTE_REACTIONS.splice(existingIdx, 1);
    note.reactions[prevType] = Math.max(0, (note.reactions[prevType] || 1) - 1);
    note.reactionCount = Math.max(0, note.reactionCount - 1);
    return res.json({ success: true, activeReaction: null, reactions: note.reactions, reactionCount: note.reactionCount });
  }

  MOCK_NOTE_REACTIONS.push({ noteId: note.id, userId, reactionType, createdAt: new Date().toISOString() });
  note.reactions[reactionType] = (note.reactions[reactionType] || 0) + 1;
  note.reactionCount += 1;

  return res.json({ success: true, activeReaction: reactionType, reactions: note.reactions, reactionCount: note.reactionCount });
});

/**
 * POST /api/v1/community/notes/:noteId/comments
 * Add comment to a study note
 */
communityRouter.post('/notes/:noteId/comments', (req, res) => {
  const { content, userId = 'demo-user-id-001' } = req.body;
  const note = MOCK_STUDY_NOTES.find((n) => n.id === req.params.noteId);

  if (!note) {
    return res.status(404).json({ error: 'Không tìm thấy ghi chú.' });
  }
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Nội dung bình luận không được để trống.' });
  }

  const user = MOCK_PROFILES.find((p) => p.userId === userId) || MOCK_PROFILES[0];
  const newComment: StudyNoteComment = {
    id: `c-${Date.now()}`,
    noteId: note.id,
    userId: user.userId,
    authorName: user.displayName,
    authorAvatar: user.avatarUrl,
    content: content.trim().substring(0, 1000),
    createdAt: new Date().toISOString(),
  };

  MOCK_NOTE_COMMENTS.push(newComment);
  note.commentCount += 1;

  return res.status(201).json({ comment: newComment });
});

/**
 * GET /api/v1/community/leaderboard
 * Authoritative leaderboard rankings
 */
communityRouter.get('/leaderboard', (req, res) => {
  const period = ((req.query.period as string) || 'weekly') as 'weekly' | 'monthly' | 'all_time';
  const category = ((req.query.category as string) || 'xp') as 'xp' | 'vocabulary' | 'reading' | 'writing' | 'listening' | 'exams';

  const unrankedEntries = MOCK_PROFILES.map((p) => {
    const metrics = {
      xp: p.totalXP,
      vocabCount: p.vocabularyLearned,
      readingCount: p.readingCompleted,
      writingCount: p.writingSubmissions,
      listeningCount: p.listeningSessions,
      examsScore: p.examsCompleted * 100,
    };
    const score = calculateLeaderboardScore(category, metrics);

    return {
      userId: p.userId,
      username: p.username,
      displayName: p.displayName,
      avatarUrl: p.avatarUrl,
      score,
      period,
      category,
      currentStreak: p.currentStreak,
    };
  });

  const leaderboard = rankLeaderboardEntries(unrankedEntries);
  return res.json({ leaderboard, period, category });
});

/**
 * GET /api/v1/community/groups
 * List study groups
 */
communityRouter.get('/groups', (req, res) => {
  return res.json({ groups: MOCK_STUDY_GROUPS, total: MOCK_STUDY_GROUPS.length });
});

/**
 * GET /api/v1/community/groups/:groupId
 * Get single study group with members and posts
 */
communityRouter.get('/groups/:groupId', (req, res) => {
  const group = MOCK_STUDY_GROUPS.find((g) => g.id === req.params.groupId);
  if (!group) {
    return res.status(404).json({ error: 'Không tìm thấy nhóm học tập.' });
  }

  const members = MOCK_GROUP_MEMBERS.filter((m) => m.groupId === group.id);
  const posts = MOCK_GROUP_POSTS.filter((p) => p.groupId === group.id);

  return res.json({ group, members, posts });
});

/**
 * POST /api/v1/community/groups/:groupId/join
 * Join a study group
 */
communityRouter.post('/groups/:groupId/join', (req, res) => {
  const userId = (req.body.userId as string) || 'demo-user-id-001';
  const group = MOCK_STUDY_GROUPS.find((g) => g.id === req.params.groupId);

  if (!group) {
    return res.status(404).json({ error: 'Không tìm thấy nhóm học tập.' });
  }

  const currentMembers = MOCK_GROUP_MEMBERS.filter((m) => m.groupId === group.id).map((m) => m.userId);
  const canJoin = canJoinGroup(group, userId, currentMembers);

  if (!canJoin.allowed) {
    return res.status(400).json({ error: canJoin.reason });
  }

  const user = MOCK_PROFILES.find((p) => p.userId === userId) || MOCK_PROFILES[0];
  const newMember: StudyGroupMember = {
    groupId: group.id,
    userId: user.userId,
    userName: user.displayName,
    userAvatar: user.avatarUrl,
    role: 'member',
    joinedAt: new Date().toISOString(),
    contributedXP: 0,
  };

  MOCK_GROUP_MEMBERS.push(newMember);
  group.memberCount += 1;

  return res.status(201).json({ success: true, member: newMember, message: 'Gia nhập nhóm học tập thành công!' });
});

/**
 * POST /api/v1/community/groups/:groupId/posts
 * Post to study group
 */
communityRouter.post('/groups/:groupId/posts', (req, res) => {
  const { content, userId = 'demo-user-id-001' } = req.body;
  const group = MOCK_STUDY_GROUPS.find((g) => g.id === req.params.groupId);

  if (!group) {
    return res.status(404).json({ error: 'Không tìm thấy nhóm.' });
  }
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Nội dung thảo luận không được để trống.' });
  }

  const user = MOCK_PROFILES.find((p) => p.userId === userId) || MOCK_PROFILES[0];
  const newPost: GroupPost = {
    id: `post-${Date.now()}`,
    groupId: group.id,
    authorId: user.userId,
    authorName: user.displayName,
    authorAvatar: user.avatarUrl,
    content: content.trim().substring(0, 2000),
    commentCount: 0,
    createdAt: new Date().toISOString(),
  };

  MOCK_GROUP_POSTS.unshift(newPost);
  return res.status(201).json({ post: newPost, message: 'Đã đăng bài thảo luận thành công.' });
});

/**
 * GET /api/v1/community/achievements
 * List all achievements with current user progress
 */
communityRouter.get('/achievements', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const user = MOCK_PROFILES.find((p) => p.userId === userId) || MOCK_PROFILES[0];

  const userStats = {
    notesCount: MOCK_STUDY_NOTES.filter((n) => n.userId === user.userId).length,
    friendsCount: MOCK_FRIENDSHIPS.filter(
      (f) => (f.requesterId === user.userId || f.addresseeId === user.userId) && f.status === 'accepted'
    ).length,
    groupsCount: MOCK_GROUP_MEMBERS.filter((m) => m.userId === user.userId).length,
    helpfulReactions: 12,
    streak: user.currentStreak,
    totalXP: user.totalXP,
  };

  const achievementsWithProgress = MASTER_ACHIEVEMENTS.map((ach) => {
    const { current, max } = calculateAchievementProgress(ach.code, userStats);
    const isUnlocked = current >= max;

    return {
      ...ach,
      currentProgress: current,
      maxProgress: max,
      isUnlocked,
      unlockedAt: isUnlocked ? '2026-02-14T08:00:00.000Z' : undefined,
    };
  });

  return res.json({ achievements: achievementsWithProgress });
});

/**
 * GET /api/v1/community/notifications
 * List notifications
 */
communityRouter.get('/notifications', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const notifs = MOCK_NOTIFICATIONS.filter((n) => n.userId === userId);
  const unreadCount = notifs.filter((n) => !n.isRead).length;

  return res.json({ notifications: notifs, unreadCount });
});

/**
 * POST /api/v1/community/notifications/:id/read
 * Mark notification as read
 */
communityRouter.post('/notifications/:id/read', (req, res) => {
  const notif = MOCK_NOTIFICATIONS.find((n) => n.id === req.params.id);
  if (notif) {
    notif.isRead = true;
  }
  return res.json({ success: true });
});

/**
 * GET /api/v1/community/search
 * Search users, notes, and study groups
 */
communityRouter.get('/search', (req, res) => {
  const q = String(req.query.q || '').toLowerCase().trim();
  if (!q) {
    return res.json({ users: [], notes: [], groups: [] });
  }

  const users = MOCK_PROFILES.filter(
    (p) => p.displayName.toLowerCase().includes(q) || p.username.toLowerCase().includes(q)
  );

  const notes = MOCK_STUDY_NOTES.filter(
    (n) => n.title.toLowerCase().includes(q) || n.tags.some((t) => t.includes(q))
  );

  const groups = MOCK_STUDY_GROUPS.filter(
    (g) => g.name.toLowerCase().includes(q) || g.topic.toLowerCase().includes(q)
  );

  return res.json({ users, notes, groups });
});
