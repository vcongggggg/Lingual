import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createLearningActivity,
  canViewActivity,
  sanitizeActivityForViewer,
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
  mapActivityToFeedItem,
  detectActivityDuplicate,
  StudyNote,
  StudyGroup,
  LearningActivity,
} from '../src/index.ts';

const SAMPLE_NOTE: StudyNote = {
  id: 'note-1',
  userId: 'user-alice',
  authorName: 'Alice Nguyen',
  title: 'Mẹo phân biệt In, On, At trong chỉ thời gian',
  content: 'Dùng IN cho năm/tháng/mùa, ON cho thứ trong tuần/ngày cụ thể, AT cho giờ chính xác.',
  tags: ['grammar', 'prepositions'],
  visibility: 'public',
  reactionCount: 5,
  reactions: { helpful: 3, useful: 2 },
  commentCount: 2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const SAMPLE_GROUP: StudyGroup = {
  id: 'group-toeic-900',
  name: 'Chiến Binh TOEIC 900+ Target',
  description: 'Nhóm cùng luyện đề và thảo luận ngữ pháp hàng ngày.',
  topic: 'TOEIC Prep',
  level: 'B2',
  ownerId: 'user-alice',
  memberCount: 3,
  maxMembers: 50,
  visibility: 'public',
  totalGroupXP: 1450,
  createdAt: new Date().toISOString(),
};

test('Community Domain - createLearningActivity initializes activity with valid structure', () => {
  const act = createLearningActivity('u-1', 'Minh Tran', 'reading_completed', 'Đã đọc bài Ecotourism in Mekong', { score: 95 });
  assert.equal(act.userId, 'u-1');
  assert.equal(act.userName, 'Minh Tran');
  assert.equal(act.type, 'reading_completed');
  assert.equal(act.visibility, 'public');
  assert.ok(act.id.startsWith('act-'));
});

test('Community Domain - canViewActivity allows public activity to all viewers', () => {
  const act: LearningActivity = {
    id: 'a1',
    userId: 'u-1',
    userName: 'User 1',
    type: 'streak_milestone',
    title: 'Đạt chuỗi 7 ngày',
    visibility: 'public',
    timestamp: new Date().toISOString(),
  };

  assert.equal(canViewActivity(act), true);
  assert.equal(canViewActivity(act, 'u-anonymous'), true);
});

test('Community Domain - canViewActivity restricts private activity strictly to owner', () => {
  const act: LearningActivity = {
    id: 'a2',
    userId: 'u-owner',
    userName: 'Owner',
    type: 'note_created',
    title: 'Ghi chú riêng tư',
    visibility: 'private',
    timestamp: new Date().toISOString(),
  };

  assert.equal(canViewActivity(act, 'u-owner'), true);
  assert.equal(canViewActivity(act, 'u-stranger'), false);
  assert.equal(canViewActivity(act, undefined), false);
});

test('Community Domain - canViewActivity allows accepted friends for friends-only activity', () => {
  const act: LearningActivity = {
    id: 'a3',
    userId: 'u-alice',
    userName: 'Alice',
    type: 'writing_completed',
    title: 'Bài viết Task 2',
    visibility: 'friends',
    timestamp: new Date().toISOString(),
  };

  assert.equal(canViewActivity(act, 'u-bob', 'accepted'), true);
  assert.equal(canViewActivity(act, 'u-charlie', 'pending'), false);
  assert.equal(canViewActivity(act, 'u-stranger', undefined), false);
});

test('Community Domain - sanitizeActivityForViewer preserves owner content and obscures for non-friend', () => {
  const act: LearningActivity = {
    id: 'a4',
    userId: 'u-alice',
    userName: 'Alice',
    type: 'writing_completed',
    title: 'Điểm số Writing Essay: 92/100',
    metadata: { sensitiveScore: 92 },
    visibility: 'friends',
    timestamp: new Date().toISOString(),
  };

  const forOwner = sanitizeActivityForViewer(act, 'u-alice');
  assert.equal(forOwner.metadata?.sensitiveScore, 92);

  const forStranger = sanitizeActivityForViewer(act, 'u-stranger', false);
  assert.equal(forStranger.metadata, undefined);
  assert.equal(forStranger.title, 'Hoạt động chia sẻ với bạn bè');
});

test('Community Domain - canCommentOnNote enforces visibility permissions', () => {
  assert.equal(canCommentOnNote(SAMPLE_NOTE, 'u-bob').allowed, true);

  const privateNote: StudyNote = { ...SAMPLE_NOTE, visibility: 'private' };
  assert.equal(canCommentOnNote(privateNote, 'u-stranger').allowed, false);
  assert.equal(canCommentOnNote(privateNote, 'user-alice').allowed, true);

  const friendsNote: StudyNote = { ...SAMPLE_NOTE, visibility: 'friends' };
  assert.equal(canCommentOnNote(friendsNote, 'u-bob', false).allowed, false);
  assert.equal(canCommentOnNote(friendsNote, 'u-bob', true).allowed, true);
});

test('Community Domain - canReactToNote enforces permissions', () => {
  assert.equal(canReactToNote(SAMPLE_NOTE, 'u-bob').allowed, true);
  assert.equal(canReactToNote(SAMPLE_NOTE, '').allowed, false);

  const privateNote: StudyNote = { ...SAMPLE_NOTE, visibility: 'private' };
  assert.equal(canReactToNote(privateNote, 'u-stranger').allowed, false);
});

test('Community Domain - validateStudyNoteContent validates inputs correctly', () => {
  assert.equal(validateStudyNoteContent('Học từ vựng', 'Nội dung chi tiết').valid, true);
  assert.equal(validateStudyNoteContent('', 'Nội dung').valid, false);
  assert.equal(validateStudyNoteContent('A'.repeat(125), 'Nội dung').valid, false);
  assert.equal(validateStudyNoteContent('Tiêu đề', '').valid, false);
  assert.equal(validateStudyNoteContent('Tiêu đề', 'Nội dung', new Array(12).fill('tag')).valid, false);
});

test('Community Domain - normalizeStudyNote cleans tags and trims text', () => {
  const norm = normalizeStudyNote('   Tiêu đề hay   ', '  Nội dung ghi chú  ', ['#Grammar', ' VOCAB ', '#IELTS#']);
  assert.equal(norm.title, 'Tiêu đề hay');
  assert.equal(norm.content, 'Nội dung ghi chú');
  assert.deepEqual(norm.tags, ['grammar', 'vocab', 'ielts#']);
});

test('Community Domain - canJoinGroup checks member limits and duplicates', () => {
  assert.equal(canJoinGroup(SAMPLE_GROUP, 'u-new', ['u-1', 'u-2']).allowed, true);
  assert.equal(canJoinGroup(SAMPLE_GROUP, 'u-1', ['u-1', 'u-2']).allowed, false);

  const fullGroup: StudyGroup = { ...SAMPLE_GROUP, memberCount: 50, maxMembers: 50 };
  assert.equal(canJoinGroup(fullGroup, 'u-new', []).allowed, false);
});

test('Community Domain - canManageGroup verifies owner and moderator roles', () => {
  assert.equal(canManageGroup('owner'), true);
  assert.equal(canManageGroup('moderator'), true);
  assert.equal(canManageGroup('member'), false);
});

test('Community Domain - calculateSocialXP respects daily reward cap', () => {
  const normalXP = calculateSocialXP('NOTE_CREATED', 0, 50);
  assert.equal(normalXP, 15);

  const cappedXP = calculateSocialXP('NOTE_CREATED', 45, 50);
  assert.equal(cappedXP, 5); // 50 - 45 = 5

  const exceededXP = calculateSocialXP('NOTE_CREATED', 50, 50);
  assert.equal(exceededXP, 0);
});

test('Community Domain - calculateLeaderboardScore returns category scores', () => {
  const metrics = { xp: 1200, vocabCount: 85, readingCount: 14, writingCount: 9, listeningCount: 22, examsScore: 890 };
  assert.equal(calculateLeaderboardScore('xp', metrics), 1200);
  assert.equal(calculateLeaderboardScore('vocabulary', metrics), 85);
  assert.equal(calculateLeaderboardScore('exams', metrics), 890);
});

test('Community Domain - rankLeaderboardEntries orders entries deterministically', () => {
  const unranked = [
    { userId: 'u-1', username: 'alex', displayName: 'Alex', score: 500, period: 'weekly' as const, category: 'xp' as const, currentStreak: 3 },
    { userId: 'u-2', username: 'bob', displayName: 'Bob', score: 950, period: 'weekly' as const, category: 'xp' as const, currentStreak: 5 },
    { userId: 'u-3', username: 'clara', displayName: 'Clara', score: 720, period: 'weekly' as const, category: 'xp' as const, currentStreak: 4 },
  ];

  const ranked = rankLeaderboardEntries(unranked);
  assert.equal(ranked[0].userId, 'u-2');
  assert.equal(ranked[0].rank, 1);
  assert.equal(ranked[1].userId, 'u-3');
  assert.equal(ranked[1].rank, 2);
  assert.equal(ranked[2].userId, 'u-1');
  assert.equal(ranked[2].rank, 3);
});

test('Community Domain - calculateAchievementProgress tracks user stats', () => {
  const stats = { notesCount: 3, friendsCount: 2, groupsCount: 1, helpfulReactions: 6, streak: 5, totalXP: 600 };
  const p1 = calculateAchievementProgress('FIRST_NOTE', stats);
  assert.equal(p1.current, 1);
  assert.equal(p1.max, 1);

  const p2 = calculateAchievementProgress('HELPFUL_LEARNER', stats);
  assert.equal(p2.current, 6);
  assert.equal(p2.max, 10);
});

test('Community Domain - evaluateAchievementUnlock accurately detects unlock condition', () => {
  const stats = { notesCount: 5, friendsCount: 5, groupsCount: 1, helpfulReactions: 10, streak: 7, totalXP: 1200 };
  assert.equal(evaluateAchievementUnlock('FIRST_NOTE', stats), true);
  assert.equal(evaluateAchievementUnlock('HELPFUL_LEARNER', stats), true);
  assert.equal(evaluateAchievementUnlock('COMMUNITY_STREAK', stats), true);
  assert.equal(evaluateAchievementUnlock('TOP_LEARNER', stats), true);
});

test('Community Domain - mapActivityToFeedItem formats localized activity text', () => {
  const act = createLearningActivity('u-1', 'Minh', 'exam_completed', 'TOEIC Mock 01');
  const vi = mapActivityToFeedItem(act, 'vi');
  assert.ok(vi.actionText.includes('thi thử'));

  const en = mapActivityToFeedItem(act, 'en');
  assert.ok(en.actionText.includes('completed an exam'));
});

test('Community Domain - detectActivityDuplicate catches repeated actions within time window', () => {
  const recent: LearningActivity[] = [
    {
      id: 'a1',
      userId: 'u-1',
      userName: 'Minh',
      type: 'note_created',
      title: 'Mẹo phát âm',
      visibility: 'public',
      timestamp: new Date().toISOString(),
    },
  ];

  assert.equal(detectActivityDuplicate(recent, 'note_created', 'u-1', 'Mẹo phát âm', 60), true);
  assert.equal(detectActivityDuplicate(recent, 'note_created', 'u-1', 'Bài tập khác', 60), false);
  assert.equal(detectActivityDuplicate(recent, 'note_created', 'u-2', 'Mẹo phát âm', 60), false);
});
