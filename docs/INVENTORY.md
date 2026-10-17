# Lingual Codebase Inventory & Scope Freeze (Phase D0)
**Tài liệu kiểm kê hiện trạng codebase nhánh develop (commit `a5267cd`) - Ngày 17/10/2026**

---

## 1. Executive Summary & Verification Metrics

Các số liệu được trích xuất trực tiếp từ terminal và công cụ phân tích tĩnh:

| Metric | Giá trị thực tế | Ghi chú / Lệnh kiểm chứng |
|---|---|---|
| **Base Commit** | `a5267cd` (`develop`) | `git branch --show-current` |
| **Tổng số files theo dõi trong Git** | **640** | `git ls-files | wc -l` |
| **Tổng số dòng code TypeScript/TSX** | **47.908** dòng | `find apps packages prisma -name '*.ts' -o -name '*.tsx' | xargs wc -l` |
| **Số lần xuất hiện `MOCK_` trong `apps/api/src`** | **207** lần | `grep -rn 'MOCK_' apps/api/src --include='*.ts' | wc -l` |
| **Số lần xuất hiện `MEM_` fallback trong `repositories/`** | **73** lần | `grep -rn 'MEM_' apps/api/src/repositories/ --include='*.ts' | wc -l` |
| **Số test suites Domain (`packages/domain/test`)** | **167/167 PASS** (0 fail) | `pnpm --filter @linguaflow/api exec tsx --test "../../packages/domain/test/*.test.ts"` |
| **Số test suites API (`apps/api/test`)** | **48 PASS, 7 FAIL** | `pnpm --filter @linguaflow/api exec tsx --test "test/*.test.ts"` (7 fail do `@prisma/client` chưa init) |
| **Root test script (`pnpm test`)** | **Vacuous Pass (Exit 0)** | `pnpm --recursive test` không chạy test nào do các workspace con chưa khai báo script |
| **Next.js Web Build (`apps/web`)** | **PASS (71 routes)** | `pnpm --filter web build` biên dịch thành công 71 dynamic/static routes |

---

## 2. Thống kê & Danh sách chi tiết In-Memory Mock (`apps/api/src`)

### 2.1. Bảng phân bố 207 vị trí `MOCK_` theo từng file:

| STT | File Path | Số lần xuất hiện | Các thực thể / biến Mock chính |
|---|---|:---:|---|
| 1 | `apps/api/src/routes/community.ts` | **65** | `MOCK_COMMUNITY_POSTS`, `MOCK_STUDY_GROUPS`, `MOCK_STUDY_NOTES`, `MOCK_USERS` |
| 2 | `apps/api/src/routes/vocabulary.ts` | **27** | `MOCK_FOLDERS`, `MOCK_USER_VOCABULARY`, `MOCK_WORD_STATES`, `MOCK_USERS` |
| 3 | `apps/api/src/routes/ielts.ts` | **19** | `MOCK_QUESTIONS_FALLBACK`, `MOCK_IELTS_ATTEMPTS`, `MOCK_IELTS_QUESTIONS_STORE` |
| 4 | `apps/api/src/routes/dictionary.ts` | **12** | `MOCK_WORD_STATES`, bookmark in-memory |
| 5 | `apps/api/src/routes/exams.ts` | **11** | `MOCK_EXAM_ATTEMPTS`, `MOCK_USERS` |
| 6 | `apps/api/src/routes/curriculum.ts` | **11** | `MOCK_ATTEMPTS`, `MOCK_LESSON_PROGRESS`, `MOCK_USERS` |
| 7 | `apps/api/src/routes/user.ts` | **10** | `MOCK_USERS`, `MOCK_LESSON_PROGRESS`, `MOCK_GAME_SESSIONS` |
| 8 | `apps/api/src/routes/admin.ts` | **9** | `MOCK_USERS`, `MOCK_AUDIT_LOGS` |
| 9 | `apps/api/src/routes/srs.ts` | **8** | `MOCK_WORD_STATES`, `MOCK_USERS` |
| 10 | `apps/api/src/routes/reading.ts` | **8** | `MOCK_READING_ATTEMPTS`, `MOCK_READING_PROGRESS`, `MOCK_USERS` |
| 11 | `apps/api/src/repositories/user.repository.ts` | **7** | `MOCK_USERS` (đọc/ghi fallback trực tiếp) |
| 12 | `apps/api/src/routes/games.ts` | **6** | `MOCK_GAME_SESSIONS`, `MOCK_ATTEMPTS`, `MOCK_USERS` |
| 13 | `apps/api/src/routes/auth.ts` | **6** | Định nghĩa gốc: `MOCK_USERS`, `MOCK_ATTEMPTS`, `MOCK_WORD_STATES`, v.v. |
| 14 | `apps/api/src/routes/writing.ts` | **4** | `MOCK_WRITING_ATTEMPTS`, `MOCK_PROMPTS`, `MOCK_USERS` |
| 15 | `apps/api/src/middleware/rbac.ts` | **2** | Đọc role user từ `MOCK_USERS` |
| 16 | `apps/api/src/middleware/auditLog.ts` | **2** | Định nghĩa và ghi vào `MOCK_AUDIT_LOGS` |
| | **TỔNG CỘNG** | **207** | |

### 2.2. Danh sách toàn bộ 207 dòng chứa `MOCK_` trong code:

```text
apps/api/src/middleware/auditLog.ts:15:export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [];
apps/api/src/middleware/auditLog.ts:45:          MOCK_AUDIT_LOGS.unshift(logEntry);
apps/api/src/middleware/rbac.ts:5:import { MOCK_USERS } from '../routes/auth.js';
apps/api/src/middleware/rbac.ts:57:      const dbUser = MOCK_USERS.find((u) => u.id === userId);
apps/api/src/repositories/user.repository.ts:2:import { MOCK_USERS } from '../routes/auth.js';
apps/api/src/repositories/user.repository.ts:44:    const memUser = MOCK_USERS.find((u) => u.id === id);
apps/api/src/repositories/user.repository.ts:62:    const memUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
apps/api/src/repositories/user.repository.ts:130:    MOCK_USERS.push({
apps/api/src/repositories/user.repository.ts:173:    const memUser = MOCK_USERS.find((u) => u.id === userId);
apps/api/src/repositories/user.repository.ts:195:    const memUser = MOCK_USERS.find((u) => u.id === userId);
apps/api/src/repositories/user.repository.ts:210:    return MOCK_USERS.map(({ passwordHash, ...u }) => ({
apps/api/src/routes/admin.ts:3:import { auditLogInterceptor, MOCK_AUDIT_LOGS } from '../middleware/auditLog.js';
apps/api/src/routes/admin.ts:4:import { MOCK_USERS } from './auth.js';
apps/api/src/routes/admin.ts:20:        totalUsers: MOCK_USERS.length,
apps/api/src/routes/admin.ts:21:        totalAuditLogs: MOCK_AUDIT_LOGS.length,
apps/api/src/routes/admin.ts:22:        activeEditors: MOCK_USERS.filter((u) => u.role === 'CONTENT_EDITOR').length,
apps/api/src/routes/admin.ts:38:    const safeUsers = MOCK_USERS.map(({ passwordHash, ...u }) => u);
apps/api/src/routes/admin.ts:61:    const user = MOCK_USERS.find((u) => u.id === userId);
apps/api/src/routes/admin.ts:92:    const user = MOCK_USERS.find((u) => u.id === userId);
apps/api/src/routes/admin.ts:122:    return res.json({ auditLogs: MOCK_AUDIT_LOGS });
apps/api/src/routes/auth.ts:13:export const MOCK_USERS: any[] = [];
apps/api/src/routes/auth.ts:14:export const MOCK_ATTEMPTS: any[] = [];
apps/api/src/routes/auth.ts:15:export const MOCK_WORD_STATES: any[] = [];
apps/api/src/routes/auth.ts:16:export const MOCK_LESSON_PROGRESS: any[] = [];
apps/api/src/routes/auth.ts:17:export const MOCK_GAME_SESSIONS: any[] = [];
apps/api/src/routes/auth.ts:35:  MOCK_USERS.push(seedUser);
apps/api/src/routes/community.ts:39:export const MOCK_PROFILES: SocialProfile[] = [
apps/api/src/routes/community.ts:146:export const MOCK_FRIENDSHIPS: Friendship[] = [
apps/api/src/routes/community.ts:173:export const MOCK_FOLLOWS: Follow[] = [
apps/api/src/routes/community.ts:179:export const MOCK_ACTIVITIES: LearningActivity[] = [
apps/api/src/routes/community.ts:225:export const MOCK_STUDY_NOTES: StudyNote[] = [
apps/api/src/routes/community.ts:258:export const MOCK_NOTE_COMMENTS: StudyNoteComment[] = [
apps/api/src/routes/community.ts:279:export const MOCK_NOTE_REACTIONS: StudyNoteReaction[] = [
apps/api/src/routes/community.ts:284:export const MOCK_STUDY_GROUPS: StudyGroup[] = [
apps/api/src/routes/community.ts:315:export const MOCK_GROUP_MEMBERS: StudyGroupMember[] = [
apps/api/src/routes/community.ts:345:export const MOCK_GROUP_POSTS: GroupPost[] = [
apps/api/src/routes/community.ts:431:export const MOCK_NOTIFICATIONS: CommunityNotification[] = [
apps/api/src/routes/community.ts:466:  const profile = MOCK_PROFILES.find((p) => p.userId === req.params.userId);
apps/api/src/routes/community.ts:497:  const friendIds = MOCK_FRIENDSHIPS.filter(
apps/api/src/routes/community.ts:501:  const friends = MOCK_PROFILES.filter((p) => friendIds.includes(p.userId));
apps/api/src/routes/community.ts:504:  const followingIds = MOCK_FOLLOWS.filter((f) => f.followerId === userId).map((f) => f.followingId);
apps/api/src/routes/community.ts:505:  const followings = MOCK_PROFILES.filter((p) => followingIds.includes(p.userId));
apps/api/src/routes/community.ts:516:  const pendingFriendships = MOCK_FRIENDSHIPS.filter(
apps/api/src/routes/community.ts:521:    const requester = MOCK_PROFILES.find((p) => p.userId === f.requesterId);
apps/api/src/routes/community.ts:546:  const existing = MOCK_FRIENDSHIPS.find(
apps/api/src/routes/community.ts:564:  MOCK_FRIENDSHIPS.push(newFriendship);
apps/api/src/routes/community.ts:577:  const friendship = MOCK_FRIENDSHIPS.find(
apps/api/src/routes/community.ts:599:  const idx = MOCK_FRIENDSHIPS.findIndex(
apps/api/src/routes/community.ts:604:    MOCK_FRIENDSHIPS.splice(idx, 1);
apps/api/src/routes/community.ts:622:  const existing = MOCK_FOLLOWS.find((f) => f.followerId === currentUserId && f.followingId === targetId);
apps/api/src/routes/community.ts:627:  MOCK_FOLLOWS.push({ followerId: currentUserId, followingId: targetId, createdAt: new Date().toISOString() });
apps/api/src/routes/community.ts:639:  const idx = MOCK_FOLLOWS.findIndex((f) => f.followerId === currentUserId && f.followingId === targetId);
apps/api/src/routes/community.ts:641:    MOCK_FOLLOWS.splice(idx, 1);
apps/api/src/routes/community.ts:654:  const visible = MOCK_ACTIVITIES.filter((act) => {
apps/api/src/routes/community.ts:655:    const friendship = MOCK_FRIENDSHIPS.find(
apps/api/src/routes/community.ts:676:  let notes = [...MOCK_STUDY_NOTES];
apps/api/src/routes/community.ts:695:  const note = MOCK_STUDY_NOTES.find((n) => n.id === req.params.noteId);
apps/api/src/routes/community.ts:700:  const comments = MOCK_NOTE_COMMENTS.filter((c) => c.noteId === note.id);
apps/api/src/routes/community.ts:717:  const user = MOCK_PROFILES.find((p) => p.userId === userId) || MOCK_PROFILES[0];
apps/api/src/routes/community.ts:735:  MOCK_STUDY_NOTES.unshift(newNote);
apps/api/src/routes/community.ts:741:  MOCK_ACTIVITIES.unshift(
apps/api/src/routes/community.ts:754:  const note = MOCK_STUDY_NOTES.find((n) => n.id === req.params.noteId);
apps/api/src/routes/community.ts:760:  const existingIdx = MOCK_NOTE_REACTIONS.findIndex((r) => r.noteId === note.id && r.userId === userId);
apps/api/src/routes/community.ts:763:    const prevType = MOCK_NOTE_REACTIONS[existingIdx].reactionType;
apps/api/src/routes/community.ts:765:      MOCK_NOTE_REACTIONS.splice(existingIdx, 1);
apps/api/src/routes/community.ts:770:      MOCK_NOTE_REACTIONS[existingIdx].reactionType = reactionType;
apps/api/src/routes/community.ts:777:  MOCK_NOTE_REACTIONS.push({ noteId: note.id, userId, reactionType, createdAt: new Date().toISOString() });
apps/api/src/routes/community.ts:790:  const note = MOCK_STUDY_NOTES.find((n) => n.id === req.params.noteId);
apps/api/src/routes/community.ts:799:  const user = MOCK_PROFILES.find((p) => p.userId === userId) || MOCK_PROFILES[0];
apps/api/src/routes/community.ts:810:  MOCK_NOTE_COMMENTS.push(newComment);
apps/api/src/routes/community.ts:826:  const unrankedEntries = MOCK_PROFILES.map((p) => {
apps/api/src/routes/community.ts:858:  return res.json({ groups: MOCK_STUDY_GROUPS, total: MOCK_STUDY_GROUPS.length });
apps/api/src/routes/community.ts:866:  const group = MOCK_STUDY_GROUPS.find((g) => g.id === req.params.groupId);
apps/api/src/routes/community.ts:871:  const members = MOCK_GROUP_MEMBERS.filter((m) => m.groupId === group.id);
apps/api/src/routes/community.ts:872:  const posts = MOCK_GROUP_POSTS.filter((p) => p.groupId === group.id);
apps/api/src/routes/community.ts:883:  const group = MOCK_STUDY_GROUPS.find((g) => g.id === req.params.groupId);
apps/api/src/routes/community.ts:889:  const currentMembers = MOCK_GROUP_MEMBERS.filter((m) => m.groupId === group.id).map((m) => m.userId);
apps/api/src/routes/community.ts:896:  const user = MOCK_PROFILES.find((p) => p.userId === userId) || MOCK_PROFILES[0];
apps/api/src/routes/community.ts:907:  MOCK_GROUP_MEMBERS.push(newMember);
apps/api/src/routes/community.ts:919:  const group = MOCK_STUDY_GROUPS.find((g) => g.id === req.params.groupId);
apps/api/src/routes/community.ts:928:  const user = MOCK_PROFILES.find((p) => p.userId === userId) || MOCK_PROFILES[0];
apps/api/src/routes/community.ts:940:  MOCK_GROUP_POSTS.unshift(newPost);
apps/api/src/routes/community.ts:950:  const user = MOCK_PROFILES.find((p) => p.userId === userId) || MOCK_PROFILES[0];
apps/api/src/routes/community.ts:953:    notesCount: MOCK_STUDY_NOTES.filter((n) => n.userId === user.userId).length,
apps/api/src/routes/community.ts:954:    friendsCount: MOCK_FRIENDSHIPS.filter(
apps/api/src/routes/community.ts:957:    groupsCount: MOCK_GROUP_MEMBERS.filter((m) => m.userId === user.userId).length,
apps/api/src/routes/community.ts:985:  const notifs = MOCK_NOTIFICATIONS.filter((n) => n.userId === userId);
apps/api/src/routes/community.ts:996:  const notif = MOCK_NOTIFICATIONS.find((n) => n.id === req.params.id);
apps/api/src/routes/community.ts:1013:  const users = MOCK_PROFILES.filter(
apps/api/src/routes/community.ts:1017:  const notes = MOCK_STUDY_NOTES.filter(
apps/api/src/routes/community.ts:1021:  const groups = MOCK_STUDY_GROUPS.filter(
apps/api/src/routes/curriculum.ts:3:import { MOCK_USERS, MOCK_ATTEMPTS, MOCK_LESSON_PROGRESS } from './auth.js';
apps/api/src/routes/curriculum.ts:25:  MOCK_ATTEMPTS.push(attemptSession);
apps/api/src/routes/curriculum.ts:52:  const attempt = MOCK_ATTEMPTS.find((a) => a.attemptId === attemptId);
apps/api/src/routes/curriculum.ts:89:  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
apps/api/src/routes/curriculum.ts:108:  MOCK_LESSON_PROGRESS.push({
apps/api/src/routes/curriculum.ts:137:export const MOCK_LESSONS_STORE: any[] = [];
apps/api/src/routes/curriculum.ts:162:    MOCK_LESSONS_STORE.push(lesson);
apps/api/src/routes/curriculum.ts:186:    const lesson = MOCK_LESSONS_STORE.find((l) => l.id === lessonId);
apps/api/src/routes/curriculum.ts:224:    const lesson = MOCK_LESSONS_STORE.find((l) => l.id === lessonId);
apps/api/src/routes/curriculum.ts:255:    const index = MOCK_LESSONS_STORE.findIndex((l) => l.id === lessonId);
apps/api/src/routes/curriculum.ts:261:    const [deleted] = MOCK_LESSONS_STORE.splice(index, 1);
apps/api/src/routes/dictionary.ts:5:import { MOCK_WORD_STATES } from './auth.js';
apps/api/src/routes/dictionary.ts:85:const MOCK_BOOKMARKS = new Set<string>();
apps/api/src/routes/dictionary.ts:102:        isBookmarked: MOCK_BOOKMARKS.has(w.id),
apps/api/src/routes/dictionary.ts:103:        inSrsDeck: MOCK_WORD_STATES.some((ws) => ws.wordId === w.id),
apps/api/src/routes/dictionary.ts:180:    isBookmarked: MOCK_BOOKMARKS.has(w.id),
apps/api/src/routes/dictionary.ts:181:    inSrsDeck: MOCK_WORD_STATES.some((ws) => ws.wordId === w.id),
apps/api/src/routes/dictionary.ts:226:      bookmarked: localMatch ? MOCK_BOOKMARKS.has(localMatch.id) : false,
apps/api/src/routes/dictionary.ts:243:  const isBookmarked = MOCK_BOOKMARKS.has(wordId);
apps/api/src/routes/dictionary.ts:245:    MOCK_BOOKMARKS.delete(wordId);
apps/api/src/routes/dictionary.ts:247:    MOCK_BOOKMARKS.add(wordId);
apps/api/src/routes/dictionary.ts:253:    totalBookmarks: MOCK_BOOKMARKS.size,
apps/api/src/routes/dictionary.ts:262:  const bookmarkedWords = ALL_VOCABULARY_WORDS.filter((w) => MOCK_BOOKMARKS.has(w.id));
apps/api/src/routes/exams.ts:2:import { MOCK_USERS } from './auth.js';
apps/api/src/routes/exams.ts:17:const MOCK_EXAM_ATTEMPTS: ExamAttempt[] = [];
apps/api/src/routes/exams.ts:43:  MOCK_EXAM_ATTEMPTS.push(initialAttempt);
apps/api/src/routes/exams.ts:90:  MOCK_EXAM_ATTEMPTS.push(attempt);
apps/api/src/routes/exams.ts:106:  const attempt = (await examRepository.getAttemptById(req.params.attemptId)) || MOCK_EXAM_ATTEMPTS.find((a) => a.id === req.params.attemptId);
apps/api/src/routes/exams.ts:124:  const attempt = MOCK_EXAM_ATTEMPTS.find((a) => a.id === req.params.attemptId);
apps/api/src/routes/exams.ts:167:  const attempt = MOCK_EXAM_ATTEMPTS.find((a) => a.id === req.params.attemptId);
apps/api/src/routes/exams.ts:188:    const user = MOCK_USERS.find((u) => u.id === attempt.userId) || MOCK_USERS[0] || defaultUser;
apps/api/src/routes/exams.ts:263:  const attempt = MOCK_EXAM_ATTEMPTS.find((a) => a.id === req.params.attemptId);
apps/api/src/routes/exams.ts:281:  const history = MOCK_EXAM_ATTEMPTS.filter((a) => a.userId === userId && a.status === 'completed').map((a) => {
apps/api/src/routes/exams.ts:309:  const completedAttempts = MOCK_EXAM_ATTEMPTS.filter((a) => a.userId === userId && a.status === 'completed');
apps/api/src/routes/games.ts:5:import { MOCK_USERS, MOCK_ATTEMPTS, MOCK_GAME_SESSIONS } from './auth.js';
apps/api/src/routes/games.ts:191:  let attempt = MOCK_ATTEMPTS.find((a) => a.attemptId === attemptId);
apps/api/src/routes/games.ts:200:    MOCK_ATTEMPTS.push(attempt);
apps/api/src/routes/games.ts:224:  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
apps/api/src/routes/games.ts:254:  // Keep MOCK_GAME_SESSIONS synced for legacy routes
apps/api/src/routes/games.ts:255:  MOCK_GAME_SESSIONS.unshift(savedSession as any);
apps/api/src/routes/ielts.ts:13:const MOCK_QUESTIONS_FALLBACK = SEED_IELTS_QUESTIONS.map((q, idx) => ({
apps/api/src/routes/ielts.ts:96:      questions = MOCK_QUESTIONS_FALLBACK.filter((q) => q.skill === targetSkill);
apps/api/src/routes/ielts.ts:105:    const fallbackList = MOCK_QUESTIONS_FALLBACK.filter((q) => q.skill === targetSkill);
apps/api/src/routes/ielts.ts:145:  const mockQ = MOCK_QUESTIONS_FALLBACK.find((q) => q.id === id) || MOCK_QUESTIONS_FALLBACK[0];
apps/api/src/routes/ielts.ts:153:export const MOCK_IELTS_ATTEMPTS: any[] = [];
apps/api/src/routes/ielts.ts:156:const MOCK_TEST_ANSWER_KEYS: Record<string, { skill: 'reading' | 'listening'; correctAnswer: string }> = {
apps/api/src/routes/ielts.ts:171:          MOCK_TEST_ANSWER_KEYS[item.id] = {
apps/api/src/routes/ielts.ts:189:  for (const q of MOCK_QUESTIONS_FALLBACK) {
apps/api/src/routes/ielts.ts:216:    readingPassages: MOCK_QUESTIONS_FALLBACK.filter((q) => q.skill === 'reading'),
apps/api/src/routes/ielts.ts:217:    listeningSections: MOCK_QUESTIONS_FALLBACK.filter((q) => q.skill === 'listening'),
apps/api/src/routes/ielts.ts:234:    Object.entries(MOCK_TEST_ANSWER_KEYS).forEach(([qId, qInfo]) => {
apps/api/src/routes/ielts.ts:254:      Object.entries(MOCK_TEST_ANSWER_KEYS).forEach(([qId, qInfo]) => {
apps/api/src/routes/ielts.ts:302:    MOCK_IELTS_ATTEMPTS.push(attempt);
apps/api/src/routes/ielts.ts:391:export const MOCK_IELTS_QUESTIONS_STORE: any[] = [...MOCK_QUESTIONS_FALLBACK];
apps/api/src/routes/ielts.ts:418:    MOCK_IELTS_QUESTIONS_STORE.push(question);
apps/api/src/routes/ielts.ts:442:    const question = MOCK_IELTS_QUESTIONS_STORE.find((q) => q.id === questionId);
apps/api/src/routes/ielts.ts:479:    const question = MOCK_IELTS_QUESTIONS_STORE.find((q) => q.id === questionId);
apps/api/src/routes/ielts.ts:510:    const index = MOCK_IELTS_QUESTIONS_STORE.findIndex((q) => q.id === questionId);
apps/api/src/routes/ielts.ts:516:    const [deleted] = MOCK_IELTS_QUESTIONS_STORE.splice(index, 1);
apps/api/src/routes/reading.ts:2:import { MOCK_USERS } from './auth.js';
apps/api/src/routes/reading.ts:15:const MOCK_READING_ATTEMPTS: ReadingAttempt[] = [
apps/api/src/routes/reading.ts:38:const MOCK_READING_PROGRESS: Record<string, { currentParagraph: number; scrollProgress: number; updatedAt: string }> = {};
apps/api/src/routes/reading.ts:120:  const recentDuplicate = MOCK_READING_ATTEMPTS.find(
apps/api/src/routes/reading.ts:128:    const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
apps/api/src/routes/reading.ts:179:  MOCK_READING_ATTEMPTS.push(newAttempt);
apps/api/src/routes/reading.ts:216:  const history = MOCK_READING_ATTEMPTS.filter((a) => a.userId === userId).sort(
apps/api/src/routes/reading.ts:228:  const userAttempts = MOCK_READING_ATTEMPTS.filter((a) => a.userId === userId);
apps/api/src/routes/srs.ts:3:import { MOCK_USERS, MOCK_WORD_STATES } from './auth.js';
apps/api/src/routes/srs.ts:58:    const existingState = MOCK_WORD_STATES.find((ws) => ws.wordId === w.wordId);
apps/api/src/routes/srs.ts:104:  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
apps/api/src/routes/srs.ts:105:  const currentState = MOCK_WORD_STATES.find((ws) => ws.wordId === wordId) || {
apps/api/src/routes/srs.ts:114:  const existingIdx = MOCK_WORD_STATES.findIndex((ws) => ws.wordId === wordId);
apps/api/src/routes/srs.ts:123:    MOCK_WORD_STATES[existingIdx] = updatedState;
apps/api/src/routes/srs.ts:125:    MOCK_WORD_STATES.push(updatedState);
apps/api/src/routes/srs.ts:186:  MOCK_WORD_STATES.push({
apps/api/src/routes/user.ts:2:import { MOCK_USERS, MOCK_LESSON_PROGRESS, MOCK_GAME_SESSIONS } from './auth.js';
apps/api/src/routes/user.ts:9:  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
apps/api/src/routes/user.ts:20:  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
apps/api/src/routes/user.ts:22:  const userProgress = MOCK_LESSON_PROGRESS.filter((p) => p.userId === userId && p.completed);
apps/api/src/routes/user.ts:53:  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
apps/api/src/routes/user.ts:55:  const userGames = MOCK_GAME_SESSIONS.filter((g) => g.userId === userId);
apps/api/src/routes/user.ts:56:  const userLessons = MOCK_LESSON_PROGRESS.filter((p) => p.userId === userId);
apps/api/src/routes/user.ts:75:  const userLessons = MOCK_LESSON_PROGRESS.filter((p) => p.userId === userId);
apps/api/src/routes/user.ts:76:  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
apps/api/src/routes/user.ts:93:  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
apps/api/src/routes/vocabulary.ts:3:import { MOCK_USERS, MOCK_WORD_STATES } from './auth.js';
apps/api/src/routes/vocabulary.ts:116:const MOCK_FOLDERS: VocabularyFolder[] = [
apps/api/src/routes/vocabulary.ts:153:const MOCK_USER_VOCABULARY: UserVocabularyItem[] = [
apps/api/src/routes/vocabulary.ts:203:    const userItem = MOCK_USER_VOCABULARY.find((uv) => uv.wordId === w.id && uv.userId === 'demo-user-id-001');
apps/api/src/routes/vocabulary.ts:204:    const wordState = MOCK_WORD_STATES.find((ws) => ws.wordId === w.id);
apps/api/src/routes/vocabulary.ts:235:  const userItem = MOCK_USER_VOCABULARY.find((uv) => uv.wordId === word.id);
apps/api/src/routes/vocabulary.ts:236:  const wordState = MOCK_WORD_STATES.find((ws) => ws.wordId === word.id);
apps/api/src/routes/vocabulary.ts:254:  const folders = MOCK_FOLDERS.filter((f) => f.userId === userId).map((folder) => {
apps/api/src/routes/vocabulary.ts:255:    const wordCount = MOCK_USER_VOCABULARY.filter(
apps/api/src/routes/vocabulary.ts:285:  MOCK_FOLDERS.push(newFolder);
apps/api/src/routes/vocabulary.ts:296:  const folder = MOCK_FOLDERS.find((f) => f.id === folderId);
apps/api/src/routes/vocabulary.ts:315:  const index = MOCK_FOLDERS.findIndex((f) => f.id === folderId);
apps/api/src/routes/vocabulary.ts:320:  MOCK_FOLDERS.splice(index, 1);
apps/api/src/routes/vocabulary.ts:323:  MOCK_USER_VOCABULARY.forEach((uv) => {
apps/api/src/routes/vocabulary.ts:341:  let userItem = MOCK_USER_VOCABULARY.find((uv) => uv.userId === userId && uv.wordId === wordId);
apps/api/src/routes/vocabulary.ts:353:    MOCK_USER_VOCABULARY.push(userItem);
apps/api/src/routes/vocabulary.ts:369:  const userItem = MOCK_USER_VOCABULARY.find((uv) => uv.wordId === wordId);
apps/api/src/routes/vocabulary.ts:385:  let items = MOCK_USER_VOCABULARY.filter((uv) => uv.userId === userId && uv.isSaved);
apps/api/src/routes/vocabulary.ts:392:    const wordState = MOCK_WORD_STATES.find((ws) => ws.wordId === item.wordId);
apps/api/src/routes/vocabulary.ts:418:  let existing = MOCK_USER_VOCABULARY.find((uv) => uv.wordId === resolvedWordId && uv.userId === userId);
apps/api/src/routes/vocabulary.ts:451:    MOCK_USER_VOCABULARY.push(newItem);
apps/api/src/routes/vocabulary.ts:466:    const folderWords = MOCK_USER_VOCABULARY.filter(
apps/api/src/routes/vocabulary.ts:573:  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];
apps/api/src/routes/vocabulary.ts:591:    const existingIdx = MOCK_WORD_STATES.findIndex((ws) => ws.wordId === eq.wordId);
apps/api/src/routes/vocabulary.ts:592:    const currentState = existingIdx >= 0 ? MOCK_WORD_STATES[existingIdx] : { repetition: 0, interval: 1, efactor: 2.5 };
apps/api/src/routes/vocabulary.ts:604:      MOCK_WORD_STATES[existingIdx] = updated;
apps/api/src/routes/vocabulary.ts:606:      MOCK_WORD_STATES.push(updated);
apps/api/src/routes/writing.ts:2:import { MOCK_USERS } from './auth.js';
apps/api/src/routes/writing.ts:16:const MOCK_PROMPTS: WritingPrompt[] = MASTER_WRITING_PROMPTS;
apps/api/src/routes/writing.ts:20:const MOCK_WRITING_ATTEMPTS: Array<{
apps/api/src/routes/writing.ts:227:  const userAttempts = MOCK_WRITING_ATTEMPTS.filter((a) => a.userId === userId);
```

---

## 3. Phân loại Architecture: Repositories, Middleware, Routes

### 3.1. Phân loại Repositories (`apps/api/src/repositories/`)

Toàn bộ 11 repositories hiện tại đều được thiết kế theo mô hình **Dual-Mode**: cố gắng gọi Prisma, nhưng do biến cờ `isDatabaseConnected()` luôn là `false` (hoặc catch lỗi khi chưa init), mọi repository đều âm thầm đọc/ghi vào biến bộ nhớ in-memory (`MEM_*` hoặc `MOCK_*`). Dữ liệu biến mất 100% khi restart server.

| File Repository | Biến In-Memory Fallback (`MEM_*`) | Đánh giá hiện trạng | Mục tiêu chuyển đổi Phase D2 |
|---|---|---|---|
| `user.repository.ts` | `MOCK_USERS` (7 ref) | **MOCK SOURCE OF TRUTH**: Mọi auth, profile, role đều rơi về mảng này | Xóa `MOCK_USERS`, chuyển 100% sang `prisma.user` |
| `analytics.repository.ts` | `MEM_GOALS`, `MEM_ACTIVITY_LOGS` (6 ref) | Dual-mode ngụy trang: chưa persist vào PostgreSQL | Map sang model `UserGoal`, `DailyActivityLog` trong Prisma |
| `community.repository.ts` | `MEM_PROFILES`, `MEM_NOTES` (8 ref) | Dual-mode: ghi note và profile vào memory | Map sang model `CommunityProfile`, `StudyNote` |
| `exam.repository.ts` | `MEM_EXAM_ATTEMPTS` (5 ref) | Dual-mode: nộp bài thi lưu vào mảng tạm | Map sang model `ExamAttempt`, `StandardExam` |
| `game.repository.ts` | `MEM_GAME_SESSIONS`, `MEM_USER_GAME_STATS` (8 ref) | Dual-mode: điểm game, session biến mất khi restart | Map sang model `GameSession`, `UserGameStat` |
| `gamification.repository.ts`| `MEM_DAILY_QUESTS`, `MEM_USER_QUEST_PROGRESS` (9 ref) | Dual-mode: tiến độ nhiệm vụ hàng ngày lưu in-memory | Map sang model `DailyQuest`, `UserQuestProgress` |
| `reading.repository.ts` | `MEM_READING_ATTEMPTS`, `MEM_USER_PROGRESS` (6 ref) | Dual-mode: tiến độ đọc và bài quiz lưu in-memory | Map sang model `ReadingArticle`, `ReadingAttempt` |
| `speaking.repository.ts` | `MEM_SPEAKING_ATTEMPTS`, `MEM_PHONEME_FEEDBACKS` (6 ref) | Dual-mode: audio scoring & phoneme lưu in-memory | Map sang model `SpeakingPrompt`, `SpeakingAttempt` |
| `tutor.repository.ts` | `MEM_SNAPSHOTS`, `MEM_PLANS`, `MEM_RECOMMENDATIONS` (11 ref) | Dual-mode: adaptive plan 7 ngày lưu in-memory | Map sang model `TutorSnapshot`, `AdaptivePlan` |
| `vocabulary.repository.ts` | `MEM_WORD_STATES`, `MEM_FOLDERS` (8 ref) | Dual-mode: thư mục từ vựng và SM-2 lưu in-memory | Map sang model `VocabularyFolder`, `UserWordState` |
| `writing.repository.ts` | `MEM_WRITING_ATTEMPTS`, `MEM_FEEDBACK_REPORTS` (6 ref) | Dual-mode: bài luận và feedback lưu in-memory | Map sang model `WritingPrompt`, `WritingAttempt` |
| `index.ts` | *Không có* | Re-export singleton instances | Giữ nguyên interface, export repository chuẩn DB |

### 3.2. Phân loại Middleware (`apps/api/src/middleware/`)

| File Middleware | Hiện trạng | Nhận định & Rủi ro | Kế hoạch sửa đổi (D1 - D2) |
|---|---|---|---|
| `auditLog.ts` | **MOCK 100%** | Lưu audit logs vào mảng memory `MOCK_AUDIT_LOGS`. Restart server mất toàn bộ dấu vết truy vết bảo mật | Chuyển sang ghi DB qua model `AuditLog` |
| `rbac.ts` | **MOCK 100%** | Dòng 57: `const dbUser = MOCK_USERS.find(u => u.id === userId)`. Kiểm tra quyền hoàn toàn dựa vào in-memory user | Đọc role trực tiếp từ database qua `userRepository` |
| `rateLimiter.ts` | Real (Memory Store) | Dùng `express-rate-limit` in-memory. Đạt yêu cầu dev/single-instance | Giữ nguyên, tinh chỉnh threshold ở Phase D4 |
| `envValidator.ts` | Real | Kiểm tra `PORT`, `DATABASE_URL`, `JWT_SECRET` | Bắt buộc throw error khi thiếu `JWT_SECRET` ở prod |

### 3.3. Phân loại Routes (`apps/api/src/routes/`)

| File Route | Nhóm nghiệp vụ | Tình trạng nguồn dữ liệu | Đánh giá |
|---|---|---|---|
| `auth.ts` | Xác thực, Đăng ký, Đăng nhập | **MOCK SOURCE OF TRUTH** (`MOCK_USERS`, `MOCK_ATTEMPTS`) | **Trọng tâm phẫu thuật D2**: Chuyển toàn bộ sang `userRepository` |
| `admin.ts` | Quản trị viên, Thống kê, Phân quyền | **MOCK** (`MOCK_USERS`, `MOCK_AUDIT_LOGS`) | Đọc số liệu từ DB thật |
| `curriculum.ts` | Lộ trình CEFR, Bài học tương tác | **MOCK** (`MOCK_ATTEMPTS`, `MOCK_LESSON_PROGRESS` + `seed.js`) | Chuyển sang Prisma: `Unit`, `Lesson`, `AttemptSession` |
| `srs.ts` | Thẻ ghi nhớ Spaced Repetition (SM-2) | **MOCK** (`MOCK_WORD_STATES` global, không gắn userId!) | **Bug rò rỉ dữ liệu chéo**: Scope theo `req.user.id` vào DB |
| `games.ts` | Minigames Arcade (Wordle, Reflex, v.v.) | **MOCK** (`MOCK_GAME_SESSIONS`, `MOCK_ATTEMPTS`) | Persist session và XP vào DB qua `gameRepository` |
| `ielts.ts` | Luyện thi IELTS, Chấm Mock Test | **MOCK** (`MOCK_QUESTIONS_FALLBACK`, `Math.random` điểm) | Chấm đáp án thật, lưu attempt vào DB |
| `dictionary.ts` | Tra cứu từ điển, Bookmark, Add SRS | **MOCK** (`MOCK_WORD_STATES`, Set global) | Chuyển bookmark và flashcard vào DB |
| `vocabulary.ts` | Smart Vocabulary Lab, Thư mục từ | **MOCK** (`MOCK_FOLDERS`, `MOCK_USER_VOCABULARY`) | Chuyển sang `vocabularyRepository` |
| `reading.ts` | Reading Lab, Bài đọc phân cấp, Quiz | **Dual-mode** (`readingRepository` + in-memory attempts) | Nối thẳng `readingRepository` DB |
| `writing.ts` | Writing Lab, Chấm rubric bài viết | **Dual-mode** (`writingRepository` + in-memory attempts) | Nối thẳng `writingRepository` DB |
| `speaking.ts` | Speaking Lab, Luyện phát âm, Shadowing | **Dual-mode** (`speakingRepository` + in-memory attempts) | Nối thẳng `speakingRepository` DB |
| `exams.ts` | Đề thi chuẩn hóa (TOEIC, IELTS, VSTEP) | **Dual-mode** (`examRepository` + in-memory attempts) | Nối thẳng `examRepository` DB |
| `community.ts` | Diễn đàn học tập, Ghi chú, Nhóm học | **MOCK** (65 lần gọi mock: posts, notes, groups) | Chuyển sang `communityRepository` DB |
| `analytics.ts` | Thống kê radar kỹ năng, Heatmap | **Dual-mode** (`analyticsRepository`) | Nối thẳng `analyticsRepository` DB |
| `tutor.ts` | Gia sư AI thích ứng, Kế hoạch 7 ngày | **Dual-mode** (`tutorRepository`) | Nối thẳng `tutorRepository` DB |
| `chatbot.ts` | Chatbot LingLing (Trò chuyện AI) | **Prisma** (`ChatSession`, `ChatMessage`) | Route duy nhất đã gọi Prisma chuẩn; cần thêm auth middleware |
| `examData.ts` | Dữ liệu tĩnh đề thi mẫu | Static Dataset | Giữ nguyên dữ liệu đề thi |
| `speakingData.ts`| Dữ liệu tĩnh bài tập nói mẫu | Static Dataset | Giữ nguyên dữ liệu bài tập |

---

## 4. Kiểm kê Test Suites & Hiện trạng thực thi

### 4.1. Domain Unit Tests (`packages/domain/test/*.test.ts`)
- **Trạng thái:** **167/167 PASS (100%)**
- **Thời gian chạy:** 1.67s
- **Công cụ:** `node --test` via `tsx`
- **Phạm vi kiểm thử:** SM-2, Streak Timezone, Anti-cheat timing/evaluation, Tokenization, Phonetics, Reading WPM, Adaptive AI Intent.

### 4.2. API Integration Tests (`apps/api/test/*.test.ts`)
- **Trạng thái:** **48 PASS, 7 FAIL** (Tổng 55 tests)
- **Danh sách 7 test suites bị FAIL:**
  1. `test/exams.test.ts`
  2. `test/persistence.test.ts`
  3. `test/rbac-integration.test.ts`
  4. `test/reading.test.ts`
  5. `test/route-scan.test.ts`
  6. `test/security-audit.test.ts`
  7. `test/speaking.test.ts`
- **Nguyên nhân thất bại gốc:** Toàn bộ 7 suites trên gọi vào code có import `PrismaClient` từ `@prisma/client`. Do chưa từng chạy `prisma generate`, package ném lỗi:
  `Error: @prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.`
  Sau khi Phase D1 chạy `prisma generate`, các suite này sẽ có thể khởi tạo client bình thường.

### 4.3. Root Package Test Script (`pnpm test`)
- **Trạng thái:** **Vacuous Pass (Rỗng)**
- **Nguyên nhân:** File `package.json` ở root định nghĩa `"test": "pnpm --recursive test"`, nhưng trong `apps/api/package.json` và `packages/domain/package.json` hoàn toàn không có thuộc tính `"scripts": { "test": ... }`. Kết quả là lệnh chạy qua 6 workspace con và thoát với code 0 mà không thực thi test nào.
- **Biện pháp khắc phục (Phase D3):** Thêm script `test` thật sự vào từng workspace.

### 4.4. Frontend E2E Suites (`apps/web/e2e/`)
- Tồn tại các file kịch bản Playwright: `smoke.spec.ts` và `release-candidate.spec.ts`.

---

## 5. Danh sách các tài liệu sai lệch đã bị loại bỏ

Nhằm tuân thủ **Quy tắc 2** ("Mọi con số trong code/comment/docs phải đúng sự thật") và giải quyết dứt điểm các báo cáo mang tính thổi phồng, các file sau đây được lập biên bản loại bỏ khỏi git tracking:

1. `FULL_PROJECT_AUDIT_REPORT.md` (Xóa: Tuyên bố sai "Phases 1-21 100% production ready, zero mock, strict RBAC").
2. `FULL_PROJECT_REVIEW_REPORT.md` (Xóa: Báo cáo đánh giá không phản ánh đúng hiện trạng in-memory).
3. `PENTEST_REPORT.md` (Xóa: Tuyên bố vượt qua kiểm thử bảo mật thâm nhập khi RBAC vẫn chạy trên `MOCK_USERS`).
4. `PHASE_20_FINAL_PRODUCTION_AUDIT.md` (Xóa: Khẳng định hoàn tất hardening cấp độ production).
5. `PHASE_21_PRODUCTION_REMEDIATION_REPORT.md` (Xóa: Khẳng định loại bỏ sạch mock).
6. `PHASE_21_OPENSPEC_BASELINE.md` (Xóa: Bản nghiệm thu giả định của phase remediation cũ).

---

## 6. Cam kết Đóng băng Phạm vi (Scope Freeze Contract - Quy tắc 9)

**Kể từ thời điểm hoàn thành Phase D0 cho đến khi kết thúc Phase D4:**
- **Tuyệt đối không:** Thêm bất kỳ trang mới, Lab mới, tính năng mới, hoặc route mới nào.
- **Tập trung 100% tài nguyên:** Vào đại phẫu tầng cơ sở dữ liệu (Prisma migration thật, repository pattern thật, xóa bỏ in-memory mock, sửa CI và kiểm chứng bảo mật).