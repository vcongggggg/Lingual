import { Router } from 'express';
import { SEED_UNITS } from '../../../../prisma/seed';
import { vocabularyRepository, userRepository } from '../repositories/index.js';
import { resolveAuthUserId } from '../lib/authUtil.js';
import {
  calculateLessonXP,
  updateStreakWithTimezone,
  getFormattedDateInTimezone,
  calculateSM2,
  VocabularyWord,
  VocabularyFolder,
  UserVocabularyItem,
  VocabularyPracticeQuestion,
  evaluateVocabularyPractice,
  searchVocabularyWords,
} from '../../../../packages/domain/src/index.js';

export const vocabularyRouter = Router();

const BASE_SEED_VOCABULARY: VocabularyWord[] = [
  {
    id: 'vocab-travel',
    targetText: 'Travel',
    normalizedText: 'travel',
    translation: 'Đi du lịch / Di chuyển',
    phoneticUs: '/ˈtrævl/',
    phoneticUk: '/ˈtrævl/',
    partOfSpeech: 'verb',
    cefrLevel: 'A2',
    category: 'Travel & Leisure',
    definitionEn: 'To make a journey, typically of some length.',
    examples: [
      { sentence: 'They love to travel around Southeast Asia.', translation: 'Họ thích đi du lịch quanh khu vực Đông Nam Á.' },
    ],
    tags: ['journey', 'vacation', 'trip'],
  },
  {
    id: 'vocab-collaborate',
    targetText: 'Collaborate',
    normalizedText: 'collaborate',
    translation: 'Cộng tác / Hợp tác',
    phoneticUs: '/kəˈlæbəreɪt/',
    phoneticUk: '/kəˈlæbəreɪt/',
    partOfSpeech: 'verb',
    cefrLevel: 'B1',
    category: 'Technology',
    definitionEn: 'To work jointly on an activity or project to produce something.',
    examples: [
      { sentence: 'Engineers collaborate across global teams to build innovative software.', translation: 'Các kỹ sư cộng tác qua các đội ngũ toàn cầu để xây dựng phần mềm đổi mới.' },
    ],
    tags: ['teamwork', 'tech', 'workplace'],
  },
  {
    id: 'vocab-ecosystem',
    targetText: 'Ecosystem',
    normalizedText: 'ecosystem',
    translation: 'Hệ sinh thái',
    phoneticUs: '/ˈiːkoʊsɪstəm/',
    phoneticUk: '/ˈiːkəʊsɪstəm/',
    partOfSpeech: 'noun',
    cefrLevel: 'B1',
    category: 'Environment',
    definitionEn: 'A biological community of interacting organisms and their physical environment.',
    examples: [
      { sentence: 'Reducing plastic waste is crucial to protect the coral reef ecosystem.', translation: 'Giảm rác thải nhựa là điều cốt yếu để bảo vệ hệ sinh thái rạn san hô.' },
    ],
    tags: ['marine', 'conservation', 'nature'],
  },
  {
    id: 'vocab-sustainable',
    targetText: 'Sustainable',
    normalizedText: 'sustainable',
    translation: 'Bền vững / Thân thiện môi trường',
    phoneticUs: '/səˈsteɪnəbl/',
    phoneticUk: '/səˈsteɪnəbl/',
    partOfSpeech: 'adjective',
    cefrLevel: 'B2',
    category: 'Environment',
    definitionEn: 'Able to be maintained at a certain rate or level without depleting natural resources.',
    examples: [
      { sentence: 'We must adopt sustainable energy solutions for our cities.', translation: 'Chúng ta phải áp dụng các giải pháp năng lượng bền vững cho các thành phố.' },
    ],
    tags: ['green', 'energy', 'future'],
  },
];

// Master vocabulary list constructed from seed units + base rich vocabulary
const MASTER_VOCABULARY: VocabularyWord[] = [
  ...BASE_SEED_VOCABULARY,
  ...SEED_UNITS.flatMap((unit) =>
    unit.lessons.flatMap((lesson) =>
      lesson.words.map((w) => ({
        id: `vocab-${w.targetText.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        targetText: w.targetText,
        normalizedText: w.targetText.toLowerCase().trim(),
        translation: w.translation,
        phoneticUs: w.phonetic || '/.../',
        phoneticUk: w.phonetic || '/.../',
        partOfSpeech: w.partOfSpeech || 'noun',
        cefrLevel: w.cefrLevel || 'A1',
        category: unit.title.replace(/^Unit \d+:\s*/, ''),
        definitionEn: (w as any).definitionEn || `The word "${w.targetText}" in English.`,
        examples: [
          {
            sentence: w.exampleSentence || `This is an example for ${w.targetText}.`,
            translation: w.exampleTranslation || `Đây là ví dụ cho ${w.translation}.`,
          },
        ],
        imageUrl: (w as any).imageUrl,
        source: 'curriculum' as const,
        tags: [unit.title.toLowerCase(), w.cefrLevel.toLowerCase()],
      }))
    )
  ),
];

/**
 * GET /api/v1/vocabulary/search
 */
vocabularyRouter.get('/search', async (req, res) => {
  const { q = '', cefr = 'all', category = 'all', partOfSpeech = 'all', page = '1', limit = '24' } = req.query;

  const filtered = searchVocabularyWords(MASTER_VOCABULARY, q as string, {
    cefrLevel: cefr as string,
    category: category as string,
    partOfSpeech: partOfSpeech as string,
  });

  const p = Math.max(1, parseInt(page as string, 10) || 1);
  const l = Math.max(1, parseInt(limit as string, 10) || 24);
  const total = filtered.length;
  const totalPages = Math.ceil(total / l);

  const userId = resolveAuthUserId(req);
  const bookmarks = userId ? await vocabularyRepository.getBookmarks(userId) : [];
  const wordStates = userId ? await vocabularyRepository.getUserWordStates(userId) : [];

  const paginated = filtered.slice((p - 1) * l, p * l).map((w) => {
    const isSaved = bookmarks.includes(w.id);
    const wordState = wordStates.find((ws) => ws.wordId === w.id);

    return {
      ...w,
      isSaved,
      folderIds: [],
      inSrs: Boolean(wordState),
      repetition: wordState?.repetition ?? 0,
      dueDate: wordState?.dueDate ? wordState.dueDate.toISOString() : undefined,
    };
  });

  return res.json({
    words: paginated,
    pagination: { page: p, limit: l, total, totalPages },
  });
});

/**
 * GET /api/v1/vocabulary/word/:wordId
 */
vocabularyRouter.get('/word/:wordId', async (req, res) => {
  const { wordId } = req.params;
  const word = MASTER_VOCABULARY.find(
    (w) => w.id === wordId || w.normalizedText === wordId.toLowerCase()
  );

  if (!word) {
    return res.status(404).json({ error: 'Không tìm thấy từ vựng' });
  }

  const userId = resolveAuthUserId(req);
  const bookmarks = userId ? await vocabularyRepository.getBookmarks(userId) : [];
  const wordStates = userId ? await vocabularyRepository.getUserWordStates(userId) : [];
  const isSaved = bookmarks.includes(word.id);
  const wordState = wordStates.find((ws) => ws.wordId === word.id);

  return res.json({
    word: {
      ...word,
      isSaved,
      folderIds: [],
      inSrs: Boolean(wordState),
      srsState: wordState,
    },
  });
});

/**
 * GET /api/v1/vocabulary/folders
 */
vocabularyRouter.get('/folders', async (req, res) => {
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }
  const folders = await vocabularyRepository.getFolders(userId);
  return res.json({ folders });
});

/**
 * POST /api/v1/vocabulary/folders
 */
vocabularyRouter.post('/folders', async (req, res) => {
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }
  const { name, color = 'teal', icon = 'folder' } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Tên thư mục không được để trống' });
  }

  const folder = await vocabularyRepository.createFolder({
    userId,
    name: name.trim(),
    color,
    icon,
  });

  return res.status(201).json({ folder, message: 'Tạo thư mục thành công!' });
});

/**
 * PUT /api/v1/vocabulary/folders/:folderId
 */
vocabularyRouter.put('/folders/:folderId', async (req, res) => {
  const { folderId } = req.params;
  const { name, color, icon } = req.body;

  const folder = await vocabularyRepository.updateFolder(folderId, {
    name: name?.trim(),
    color,
    icon,
  });

  if (!folder) {
    return res.status(404).json({ error: 'Không tìm thấy thư mục' });
  }

  return res.json({ folder, message: 'Cập nhật thư mục thành công!' });
});

/**
 * DELETE /api/v1/vocabulary/folders/:folderId
 */
vocabularyRouter.delete('/folders/:folderId', async (req, res) => {
  const { folderId } = req.params;
  const ok = await vocabularyRepository.deleteFolder(folderId);
  if (!ok) {
    return res.status(404).json({ error: 'Không tìm thấy thư mục' });
  }

  return res.json({ success: true, message: 'Đã xóa thư mục thành công' });
});

/**
 * POST /api/v1/vocabulary/folders/:folderId/words
 */
vocabularyRouter.post('/folders/:folderId/words', async (req, res) => {
  const { folderId } = req.params;
  const { wordId } = req.body;

  if (!wordId) {
    return res.status(400).json({ error: 'wordId là bắt buộc' });
  }

  await vocabularyRepository.addWordToFolder(folderId, wordId);
  return res.json({ success: true, message: 'Đã thêm từ vào thư mục' });
});

/**
 * DELETE /api/v1/vocabulary/folders/:folderId/words/:wordId
 */
vocabularyRouter.delete('/folders/:folderId/words/:wordId', async (req, res) => {
  const { folderId, wordId } = req.params;
  await vocabularyRepository.removeWordFromFolder(folderId, wordId);
  return res.json({ success: true, message: 'Đã xóa từ khỏi thư mục' });
});

/**
 * GET /api/v1/vocabulary/saved
 */
vocabularyRouter.get('/saved', async (req, res) => {
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }
  const bookmarks = await vocabularyRepository.getBookmarks(userId);
  const wordStates = await vocabularyRepository.getUserWordStates(userId);

  const enriched = bookmarks.map((wordId) => {
    const word = MASTER_VOCABULARY.find((w) => w.id === wordId);
    const wordState = wordStates.find((ws) => ws.wordId === wordId);
    return {
      id: `uv-${wordId}`,
      userId,
      wordId,
      isSaved: true,
      folderIds: [],
      word: word || {
        id: wordId,
        targetText: wordId.replace('vocab-', ''),
        translation: 'Từ tùy chỉnh',
        cefrLevel: 'A1',
        partOfSpeech: 'noun',
        category: 'Custom',
        examples: [],
      },
      srsState: wordState,
    };
  });

  return res.json({ savedWords: enriched, total: enriched.length });
});

/**
 * POST /api/v1/vocabulary/save
 */
vocabularyRouter.post('/save', async (req, res) => {
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }
  const { wordId, targetText } = req.body;
  const resolvedWordId = wordId || `vocab-${(targetText || 'custom').toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const isSaved = await vocabularyRepository.toggleBookmark(userId, resolvedWordId);
  return res.json({
    isSaved,
    message: isSaved ? 'Đã lưu từ vựng vào danh sách cá nhân!' : 'Đã bỏ lưu từ vựng',
  });
});

/**
 * GET /api/v1/vocabulary/practice
 * Generates multi-modal practice questions
 */
vocabularyRouter.get('/practice', async (req, res) => {
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }
  const { folderId, limit = '10' } = req.query;
  const numQuestions = Math.min(20, Math.max(3, parseInt(limit as string, 10) || 10));

  let pool = MASTER_VOCABULARY;
  if (folderId && folderId !== 'all') {
    const folders = await vocabularyRepository.getFolders(userId as string);
    const targetFolder = folders.find((f) => f.id === folderId);
    if (targetFolder && targetFolder.wordIds.length > 0) {
      pool = MASTER_VOCABULARY.filter((w) => targetFolder.wordIds.includes(w.id));
    }
  }

  // Shuffle and pick
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selectedWords = shuffled.slice(0, numQuestions);

  const modes: ('meaning_choice' | 'cloze' | 'listening_spelling' | 'recognition')[] = [
    'meaning_choice',
    'cloze',
    'listening_spelling',
    'recognition',
  ];

  const questions: VocabularyPracticeQuestion[] = selectedWords.map((word, idx) => {
    const mode = modes[idx % modes.length];
    const otherWords = MASTER_VOCABULARY.filter((w) => w.id !== word.id);
    const randomDistractors = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);

    if (mode === 'meaning_choice') {
      const options = [word.translation, ...randomDistractors.map((d) => d.translation)].sort(
        () => 0.5 - Math.random()
      );
      return {
        id: `q-mc-${idx + 1}`,
        wordId: word.id,
        mode: 'meaning_choice',
        prompt: `Nghĩa tiếng Việt của từ "${word.targetText}" là gì?`,
        subPrompt: word.phoneticUs,
        targetWord: word.targetText,
        options,
        correctAnswer: word.translation,
        explanation: `"${word.targetText}" có nghĩa là "${word.translation}".`,
        cefrLevel: word.cefrLevel,
      };
    }

    if (mode === 'cloze') {
      const example = word.examples[0] || { sentence: `I like this ${word.targetText}.`, translation: '' };
      const clozeSentence = example.sentence.replace(new RegExp(`\\b${word.targetText}\\b`, 'gi'), '_____');
      const options = [word.targetText, ...randomDistractors.map((d) => d.targetText)].sort(
        () => 0.5 - Math.random()
      );
      return {
        id: `q-cl-${idx + 1}`,
        wordId: word.id,
        mode: 'cloze',
        prompt: 'Chọn từ thích hợp điền vào chỗ trống:',
        clozeSentence,
        targetWord: word.targetText,
        options,
        correctAnswer: word.targetText,
        explanation: `Câu hoàn chỉnh: "${example.sentence}" (${example.translation})`,
        cefrLevel: word.cefrLevel,
      };
    }

    if (mode === 'listening_spelling') {
      return {
        id: `q-ls-${idx + 1}`,
        wordId: word.id,
        mode: 'listening_spelling',
        prompt: 'Nghe phát âm và gõ lại từ vựng:',
        subPrompt: `Gợi ý nghĩa: ${word.translation}`,
        audioText: word.targetText,
        targetWord: word.targetText,
        correctAnswer: word.targetText,
        explanation: `Đáp án đúng là "${word.targetText}" (${word.phoneticUs}).`,
        cefrLevel: word.cefrLevel,
      };
    }

    // recognition
    const options = [word.targetText, ...randomDistractors.map((d) => d.targetText)].sort(
      () => 0.5 - Math.random()
    );
    return {
      id: `q-rec-${idx + 1}`,
      wordId: word.id,
      mode: 'recognition',
      prompt: `Từ tiếng Anh tương ứng với "${word.translation}" là:`,
      targetWord: word.targetText,
      options,
      correctAnswer: word.targetText,
      explanation: `"${word.translation}" trong tiếng Anh là "${word.targetText}".`,
      cefrLevel: word.cefrLevel,
    };
  });

  return res.json({ questions, total: questions.length });
});

/**
 * POST /api/v1/vocabulary/practice/submit
 */
vocabularyRouter.post('/practice/submit', async (req, res) => {
  const userId = resolveAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
  }
  const { questions, answers } = req.body;
  if (!Array.isArray(questions) || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Dữ liệu nộp bài không hợp lệ' });
  }

  const result = evaluateVocabularyPractice(questions, answers);
  const user = await userRepository.findById(userId);

  // Update streak
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
    getFormattedDateInTimezone(new Date(), user?.timezone || 'Asia/Ho_Chi_Minh'),
    result.xpEarned
  );

  // Sync SM-2 states for each practiced word
  const wordStates = await vocabularyRepository.getUserWordStates(userId);
  for (const eq of result.evaluatedQuestions) {
    const existing = wordStates.find((ws) => ws.wordId === eq.wordId);
    const currentState = existing
      ? { repetition: existing.repetition, interval: existing.interval, efactor: existing.efactor }
      : { repetition: 0, interval: 1, efactor: 2.5 };
    const sm2 = calculateSM2(currentState, eq.sm2Quality);

    await vocabularyRepository.saveWordState({
      userId,
      wordId: eq.wordId,
      repetition: sm2.repetition,
      interval: sm2.interval,
      efactor: sm2.efactor,
      dueDate: sm2.dueDate,
      lastQuality: eq.sm2Quality,
    });
  }

  return res.json({
    result,
    totalXP: updatedUser.totalXP,
    currentStreak: updatedUser.currentStreak,
    message: 'Hoàn thành bài luyện tập từ vựng!',
  });
});
