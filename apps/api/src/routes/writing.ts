import { Router } from 'express';
import { MOCK_USERS } from './auth.js';
import { writingRepository, userRepository } from '../repositories/index.js';
import {
  evaluateWritingSubmission,
  updateStreakWithTimezone,
  WritingPrompt,
  WritingSubmission,
  WritingResult,
} from '../../../../packages/domain/src/index.js';

export const writingRouter = Router();

// In-memory master writing prompts
const MOCK_PROMPTS: WritingPrompt[] = [
  {
    id: 'see-write-a1-morning',
    mode: 'see-write',
    difficulty: 'A1',
    title: 'Morning Routine',
    instruction: 'Hãy quan sát bức tranh và viết ít nhất 1-2 câu mô tả hoạt động buổi sáng của bạn.',
    imageHint: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&auto=format&fit=crop&q=80',
    scenario: 'Một tách cà phê nóng và bữa sáng thơm ngon trên bàn ăn vào buổi sáng sớm.',
    targetWords: ['coffee', 'morning', 'breakfast', 'drink'],
    targetGrammar: 'Present Simple: I drink / I eat',
    sampleAnswer: 'Every morning I wake up early, drink hot coffee, and eat delicious breakfast.',
    category: 'Daily Life',
    minWords: 8,
    maxWords: 40,
  },
  {
    id: 'see-write-a2-travel',
    mode: 'see-write',
    difficulty: 'A2',
    title: 'Weekend Vacation Trip',
    instruction: 'Mô tả chuyến đi du lịch cuối tuần hoặc kỳ nghỉ bên bãi biển trong bức ảnh.',
    imageHint: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=700&auto=format&fit=crop&q=80',
    scenario: 'Một vali du lịch, kính râm và phong cảnh bờ biển nhiệt đới ngập tràn ánh nắng.',
    targetWords: ['travel', 'vacation', 'beach', 'relax', 'beautiful'],
    targetGrammar: 'Past Simple / Present Continuous',
    sampleAnswer: 'Last weekend my family travelled to the beach. We relaxed under the sun and enjoyed fresh seafood.',
    category: 'Travel & Leisure',
    minWords: 15,
    maxWords: 60,
  },
  {
    id: 'see-write-b1-tech',
    mode: 'see-write',
    difficulty: 'B1',
    title: 'Modern Workplace Collaboration',
    instruction: 'Mô tả cảnh các kỹ sư và đồng nghiệp đang làm việc nhóm và cộng tác xây dựng phần mềm.',
    imageHint: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&auto=format&fit=crop&q=80',
    scenario: 'Nhóm làm việc đa quốc gia đang thảo luận ý tưởng trước màn hình máy tính hiện đại.',
    targetWords: ['collaborate', 'team', 'project', 'technology', 'creative'],
    targetGrammar: 'Present Perfect / Modals of ability',
    sampleAnswer: 'Our engineering team collaborates closely to develop innovative software that solves real-world challenges.',
    category: 'Technology',
    minWords: 20,
    maxWords: 80,
  },
  {
    id: 'guided-a1-room',
    mode: 'guided',
    difficulty: 'A1',
    title: 'My Study Room',
    instruction: 'Trả lời từng câu hỏi gợi ý để tạo thành một đoạn văn hoàn chỉnh về góc học tập của bạn.',
    category: 'Daily Life',
    minWords: 15,
    guidedSteps: [
      { stepNumber: 1, question: 'Where is your study room located?', hint: 'In my house / in my apartment', samplePhrase: 'My study room is on the second floor.' },
      { stepNumber: 2, question: 'What is on your study desk?', hint: 'A laptop, books, a lamp', samplePhrase: 'There is a laptop and several English books on my desk.' },
      { stepNumber: 3, question: 'How do you feel when studying there?', hint: 'Comfortable / quiet / peaceful', samplePhrase: 'I feel very comfortable and focused when studying here.' },
    ],
    sampleAnswer: 'My study room is on the second floor. There is a laptop and several English books on my desk. I feel very comfortable and focused when studying here.',
  },
  {
    id: 'free-b1-favorite-city',
    mode: 'free',
    difficulty: 'B1',
    title: 'Your Favorite City in the World',
    instruction: 'Viết tự do về một thành phố bạn yêu thích hoặc mơ ước được đặt chân đến. Đặt mục tiêu từ 40 - 100 từ.',
    category: 'Travel & Leisure',
    minWords: 40,
    maxWords: 150,
    targetWords: ['city', 'culture', 'explore', 'atmosphere', 'memorable'],
    sampleAnswer: 'Da Nang is my favorite city in Vietnam because of its breathtaking beaches and friendly people. The vibrant night market and delicious street food always leave a lasting impression.',
  },
];

// In-memory writing attempts store
const MOCK_WRITING_ATTEMPTS: Array<{
  id: string;
  userId: string;
  promptId: string;
  mode: string;
  content: string;
  wordCount: number;
  score: number;
  xpAwarded: number;
  durationMs: number;
  createdAt: string;
}> = [
  {
    id: 'att-w-1',
    userId: 'demo-user-id-001',
    promptId: 'see-write-a1-morning',
    mode: 'see-write',
    content: 'Every morning I wake up and drink hot coffee.',
    wordCount: 9,
    score: 92,
    xpAwarded: 25,
    durationMs: 45000,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

/**
 * GET /api/v1/writing/prompts
 */
writingRouter.get('/prompts', (req, res) => {
  const { mode, difficulty, category } = req.query;

  let filtered = MOCK_PROMPTS;
  if (mode && mode !== 'all') {
    filtered = filtered.filter((p) => p.mode === mode);
  }
  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter((p) => p.difficulty === difficulty);
  }
  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  return res.json({ prompts: filtered, total: filtered.length });
});

/**
 * POST /api/v1/writing/analyze
 */
writingRouter.post('/analyze', (req, res) => {
  const { promptId, mode = 'see-write', content = '', usedHint = false, durationMs = 0 } = req.body;

  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'Nội dung bài viết không hợp lệ.' });
  }

  if (content.length > 5000) {
    return res.status(400).json({ error: 'Nội dung bài viết vượt quá giới hạn 5000 ký tự.' });
  }

  const validModes = ['see-write', 'guided', 'free'];
  if (mode && !validModes.includes(mode)) {
    return res.status(400).json({ error: 'Chế độ luyện viết không hợp lệ.' });
  }

  const prompt = MOCK_PROMPTS.find((p) => p.id === promptId);
  const submission: WritingSubmission = {
    promptId: promptId || 'custom',
    mode,
    content: content.trim(),
    usedHint,
    durationMs,
  };

  const result: WritingResult = evaluateWritingSubmission(submission, prompt);
  return res.json({ result });
});

/**
 * POST /api/v1/writing/attempts
 * Hardened with Server-side Authoritative Evaluation (Anti-cheat & Trust Boundary Protection)
 */
writingRouter.post('/attempts', async (req, res) => {
  const {
    promptId,
    mode = 'see-write',
    content = '',
    usedHint = false,
    durationMs = 0,
    userId = 'demo-user-id-001',
  } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Nội dung bài viết không được để trống.' });
  }

  if (content.length > 5000) {
    return res.status(400).json({ error: 'Nội dung bài viết vượt quá giới hạn cho phép.' });
  }

  const validModes = ['see-write', 'guided', 'free'];
  if (!validModes.includes(mode)) {
    return res.status(400).json({ error: 'Chế độ luyện viết không hợp lệ.' });
  }

  // Server-side Authoritative Evaluation: Derives score & XP reliably
  const prompt = MOCK_PROMPTS.find((p) => p.id === promptId);
  const evaluation = evaluateWritingSubmission(
    {
      promptId: promptId || 'custom',
      mode,
      content: content.trim(),
      usedHint,
      durationMs,
    },
    prompt
  );

  const wordCount = evaluation.wordCount;
  const authoritativeScore = evaluation.score;
  const authoritativeXP = evaluation.xpAwarded;

  // Idempotency check: prevent duplicate rapid double submits from inflating XP/streak
  const recentDuplicate = await writingRepository.findRecentDuplicate(
    userId,
    promptId || 'custom',
    content
  );

  if (recentDuplicate) {
    const user = (await userRepository.findById(userId)) || (await userRepository.findById('demo-user-id-001'));
    return res.status(200).json({
      attempt: recentDuplicate,
      currentStreak: user?.currentStreak || 0,
      totalXP: user?.totalXP || 0,
      isDuplicate: true,
      message: 'Bài viết đã được ghi nhận trước đó.',
    });
  }

  const newAttempt = await writingRepository.createAttempt({
    id: `att-w-${Date.now()}`,
    userId,
    promptId: promptId || 'custom',
    mode,
    content: content.trim(),
    wordCount,
    score: authoritativeScore,
    xpAwarded: authoritativeXP,
    durationMs,
    createdAt: new Date().toISOString(),
  });

  // Authoritatively update user XP & Streak via UserRepository
  const user = (await userRepository.findById(userId)) || (await userRepository.findById('demo-user-id-001'));
  const streakResult = updateStreakWithTimezone(
    {
      currentStreak: user?.currentStreak || 0,
      streakFreezes: user?.streakFreezes || 1,
      lastActiveDate: user?.lastActiveDate || null,
    },
    new Date(),
    user?.timezone || 'Asia/Ho_Chi_Minh'
  );

  const updatedUser = await userRepository.updateStreakAndXP(
    userId,
    streakResult.currentStreak,
    streakResult.streakFreezes,
    new Date().toISOString().split('T')[0],
    authoritativeXP
  );

  return res.status(201).json({
    attempt: newAttempt,
    currentStreak: updatedUser.currentStreak,
    totalXP: updatedUser.totalXP,
    message: 'Lưu kết quả bài viết thành công!',
  });
});

/**
 * GET /api/v1/writing/history
 */
writingRouter.get('/history', async (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const history = await writingRepository.getUserAttempts(userId);

  return res.json({ history, total: history.length });
});

/**
 * GET /api/v1/writing/stats
 */
writingRouter.get('/stats', async (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const userAttempts = MOCK_WRITING_ATTEMPTS.filter((a) => a.userId === userId);

  const totalAttempts = userAttempts.length;
  const totalWords = userAttempts.reduce((acc, a) => acc + a.wordCount, 0);
  const avgScore =
    totalAttempts > 0
      ? Math.round(userAttempts.reduce((acc, a) => acc + a.score, 0) / totalAttempts)
      : 0;

  return res.json({
    stats: {
      totalAttempts,
      totalWords,
      avgScore,
      writingStreakDays: 3,
    },
  });
});
