import { Router } from 'express';
import { SEED_UNITS } from '../../../../prisma/seed.js';
import { MOCK_USERS, MOCK_WORD_STATES } from './auth.js';
import {
  calculateLessonXP,
  updateStreakWithTimezone,
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

// In-memory personal folders store (per user)
const MOCK_FOLDERS: VocabularyFolder[] = [
  {
    id: 'folder-my-words',
    userId: 'demo-user-id-001',
    name: 'Từ vựng của tôi',
    description: 'Bộ sưu tập các từ vựng thường ngày',
    icon: 'bookmark',
    color: 'teal',
    wordCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'folder-travel',
    userId: 'demo-user-id-001',
    name: 'Du lịch & Giao tiếp',
    description: 'Từ vựng đặt phòng, sân bay, chỉ đường',
    icon: 'plane',
    color: 'amber',
    wordCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'folder-ielts',
    userId: 'demo-user-id-001',
    name: 'IELTS Academic & Speaking',
    description: 'Từ vựng học thuật B1 - B2 nâng cao',
    icon: 'graduation-cap',
    color: 'coral',
    wordCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// In-memory user saved words map
const MOCK_USER_VOCABULARY: UserVocabularyItem[] = [
  {
    id: 'uv-1',
    userId: 'demo-user-id-001',
    wordId: 'vocab-hello',
    folderIds: ['folder-my-words'],
    isSaved: true,
    savedAt: new Date().toISOString(),
    reviewCount: 3,
    masteryLevel: 80,
  },
  {
    id: 'uv-2',
    userId: 'demo-user-id-001',
    wordId: 'vocab-student',
    folderIds: ['folder-my-words'],
    isSaved: true,
    savedAt: new Date().toISOString(),
    reviewCount: 2,
    masteryLevel: 70,
  },
  {
    id: 'uv-3',
    userId: 'demo-user-id-001',
    wordId: 'vocab-country',
    folderIds: ['folder-travel', 'folder-my-words'],
    isSaved: true,
    savedAt: new Date().toISOString(),
    reviewCount: 1,
    masteryLevel: 50,
  },
];

/**
 * GET /api/v1/vocabulary/search
 */
vocabularyRouter.get('/search', (req, res) => {
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
  const paginated = filtered.slice((p - 1) * l, p * l).map((w) => {
    const userItem = MOCK_USER_VOCABULARY.find((uv) => uv.wordId === w.id && uv.userId === 'demo-user-id-001');
    const wordState = MOCK_WORD_STATES.find((ws) => ws.wordId === w.id);

    return {
      ...w,
      isSaved: userItem?.isSaved ?? false,
      folderIds: userItem?.folderIds ?? [],
      inSrs: Boolean(wordState),
      repetition: wordState?.repetition ?? 0,
      dueDate: wordState?.dueDate,
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
vocabularyRouter.get('/word/:wordId', (req, res) => {
  const { wordId } = req.params;
  const word = MASTER_VOCABULARY.find(
    (w) => w.id === wordId || w.normalizedText === wordId.toLowerCase()
  );

  if (!word) {
    return res.status(404).json({ error: 'Không tìm thấy từ vựng' });
  }

  const userItem = MOCK_USER_VOCABULARY.find((uv) => uv.wordId === word.id);
  const wordState = MOCK_WORD_STATES.find((ws) => ws.wordId === word.id);

  return res.json({
    word: {
      ...word,
      isSaved: userItem?.isSaved ?? false,
      folderIds: userItem?.folderIds ?? [],
      inSrs: Boolean(wordState),
      srsState: wordState,
    },
  });
});

/**
 * GET /api/v1/vocabulary/folders
 */
vocabularyRouter.get('/folders', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const folders = MOCK_FOLDERS.filter((f) => f.userId === userId).map((folder) => {
    const wordCount = MOCK_USER_VOCABULARY.filter(
      (uv) => uv.userId === userId && uv.folderIds.includes(folder.id) && uv.isSaved
    ).length;
    return { ...folder, wordCount };
  });

  return res.json({ folders });
});

/**
 * POST /api/v1/vocabulary/folders
 */
vocabularyRouter.post('/folders', (req, res) => {
  const { name, description, icon = 'folder', color = 'teal', userId = 'demo-user-id-001' } = req.body;
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Tên thư mục không được để trống' });
  }

  const newFolder: VocabularyFolder = {
    id: `folder-${Date.now()}`,
    userId,
    name: name.trim(),
    description: description?.trim() || '',
    icon,
    color,
    wordCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  MOCK_FOLDERS.push(newFolder);
  return res.status(201).json({ folder: newFolder, message: 'Tạo thư mục thành công!' });
});

/**
 * PUT /api/v1/vocabulary/folders/:folderId
 */
vocabularyRouter.put('/folders/:folderId', (req, res) => {
  const { folderId } = req.params;
  const { name, description, color, icon } = req.body;

  const folder = MOCK_FOLDERS.find((f) => f.id === folderId);
  if (!folder) {
    return res.status(404).json({ error: 'Không tìm thấy thư mục' });
  }

  if (name) folder.name = name.trim();
  if (description !== undefined) folder.description = description.trim();
  if (color) folder.color = color;
  if (icon) folder.icon = icon;
  folder.updatedAt = new Date().toISOString();

  return res.json({ folder, message: 'Cập nhật thư mục thành công!' });
});

/**
 * DELETE /api/v1/vocabulary/folders/:folderId
 */
vocabularyRouter.delete('/folders/:folderId', (req, res) => {
  const { folderId } = req.params;
  const index = MOCK_FOLDERS.findIndex((f) => f.id === folderId);
  if (index === -1) {
    return res.status(404).json({ error: 'Không tìm thấy thư mục' });
  }

  MOCK_FOLDERS.splice(index, 1);

  // Remove folder reference from user vocabulary without deleting the words themselves
  MOCK_USER_VOCABULARY.forEach((uv) => {
    uv.folderIds = uv.folderIds.filter((fId) => fId !== folderId);
  });

  return res.json({ success: true, message: 'Đã xóa thư mục thành công' });
});

/**
 * POST /api/v1/vocabulary/folders/:folderId/words
 */
vocabularyRouter.post('/folders/:folderId/words', (req, res) => {
  const { folderId } = req.params;
  const { wordId, userId = 'demo-user-id-001' } = req.body;

  if (!wordId) {
    return res.status(400).json({ error: 'wordId là bắt buộc' });
  }

  let userItem = MOCK_USER_VOCABULARY.find((uv) => uv.userId === userId && uv.wordId === wordId);
  if (!userItem) {
    userItem = {
      id: `uv-${Date.now()}`,
      userId,
      wordId,
      folderIds: [folderId],
      isSaved: true,
      savedAt: new Date().toISOString(),
      reviewCount: 0,
      masteryLevel: 0,
    };
    MOCK_USER_VOCABULARY.push(userItem);
  } else {
    if (!userItem.folderIds.includes(folderId)) {
      userItem.folderIds.push(folderId);
    }
    userItem.isSaved = true;
  }

  return res.json({ success: true, message: 'Đã thêm từ vào thư mục', item: userItem });
});

/**
 * DELETE /api/v1/vocabulary/folders/:folderId/words/:wordId
 */
vocabularyRouter.delete('/folders/:folderId/words/:wordId', (req, res) => {
  const { folderId, wordId } = req.params;
  const userItem = MOCK_USER_VOCABULARY.find((uv) => uv.wordId === wordId);

  if (userItem) {
    userItem.folderIds = userItem.folderIds.filter((fId) => fId !== folderId);
  }

  return res.json({ success: true, message: 'Đã xóa từ khỏi thư mục' });
});

/**
 * GET /api/v1/vocabulary/saved
 */
vocabularyRouter.get('/saved', (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';
  const { folderId } = req.query;

  let items = MOCK_USER_VOCABULARY.filter((uv) => uv.userId === userId && uv.isSaved);
  if (folderId && typeof folderId === 'string' && folderId !== 'all') {
    items = items.filter((uv) => uv.folderIds.includes(folderId));
  }

  const enriched = items.map((item) => {
    const word = MASTER_VOCABULARY.find((w) => w.id === item.wordId);
    const wordState = MOCK_WORD_STATES.find((ws) => ws.wordId === item.wordId);
    return {
      ...item,
      word: word || {
        id: item.wordId,
        targetText: 'Custom Word',
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
vocabularyRouter.post('/save', (req, res) => {
  const { wordId, targetText, translation, phonetic, cefrLevel, userId = 'demo-user-id-001' } = req.body;
  const resolvedWordId = wordId || `vocab-${(targetText || 'custom').toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  let existing = MOCK_USER_VOCABULARY.find((uv) => uv.wordId === resolvedWordId && uv.userId === userId);

  if (existing) {
    existing.isSaved = !existing.isSaved;
    return res.json({ isSaved: existing.isSaved, message: existing.isSaved ? 'Đã lưu từ vựng!' : 'Đã bỏ lưu từ vựng' });
  } else {
    // If it's a new word from Listening Lab or Custom Dictionary
    if (targetText && !MASTER_VOCABULARY.some((w) => w.id === resolvedWordId)) {
      MASTER_VOCABULARY.push({
        id: resolvedWordId,
        targetText,
        normalizedText: targetText.toLowerCase().trim(),
        translation: translation || 'Chưa cập nhật',
        phoneticUs: phonetic || '/.../',
        phoneticUk: phonetic || '/.../',
        partOfSpeech: 'noun',
        cefrLevel: cefrLevel || 'A1',
        category: 'Personal Vocabulary',
        examples: [],
        source: 'listening',
      });
    }

    const newItem: UserVocabularyItem = {
      id: `uv-${Date.now()}`,
      userId,
      wordId: resolvedWordId,
      folderIds: ['folder-my-words'],
      isSaved: true,
      savedAt: new Date().toISOString(),
      reviewCount: 0,
      masteryLevel: 0,
    };
    MOCK_USER_VOCABULARY.push(newItem);
    return res.json({ isSaved: true, message: 'Đã lưu từ vựng vào danh sách cá nhân!' });
  }
});

/**
 * GET /api/v1/vocabulary/practice
 * Generates multi-modal practice questions
 */
vocabularyRouter.get('/practice', (req, res) => {
  const { folderId, limit = '10' } = req.query;
  const numQuestions = Math.min(20, Math.max(3, parseInt(limit as string, 10) || 10));

  let pool = MASTER_VOCABULARY;
  if (folderId && folderId !== 'all') {
    const folderWords = MOCK_USER_VOCABULARY.filter(
      (uv) => uv.folderIds.includes(folderId as string) && uv.isSaved
    ).map((uv) => uv.wordId);
    if (folderWords.length > 0) {
      pool = MASTER_VOCABULARY.filter((w) => folderWords.includes(w.id));
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
vocabularyRouter.post('/practice/submit', (req, res) => {
  const { questions, answers, userId = 'demo-user-id-001' } = req.body;
  if (!Array.isArray(questions) || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Dữ liệu nộp bài không hợp lệ' });
  }

  const result = evaluateVocabularyPractice(questions, answers);
  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

  // Update streak
  const streakResult = updateStreakWithTimezone(
    {
      currentStreak: user.currentStreak,
      streakFreezes: user.streakFreezes,
      lastActiveDate: user.lastActiveDate,
    },
    new Date(),
    user.timezone
  );

  user.currentStreak = streakResult.currentStreak;
  user.totalXP += result.xpEarned;

  // Sync SM-2 states for each practiced word
  result.evaluatedQuestions.forEach((eq) => {
    const existingIdx = MOCK_WORD_STATES.findIndex((ws) => ws.wordId === eq.wordId);
    const currentState = existingIdx >= 0 ? MOCK_WORD_STATES[existingIdx] : { repetition: 0, interval: 1, efactor: 2.5 };
    const sm2 = calculateSM2(currentState, eq.sm2Quality);

    const updated = {
      wordId: eq.wordId,
      repetition: sm2.repetition,
      interval: sm2.interval,
      efactor: sm2.efactor,
      dueDate: sm2.dueDate.toISOString(),
    };

    if (existingIdx >= 0) {
      MOCK_WORD_STATES[existingIdx] = updated;
    } else {
      MOCK_WORD_STATES.push(updated);
    }
  });

  return res.json({
    result,
    totalXP: user.totalXP,
    currentStreak: user.currentStreak,
    message: 'Hoàn thành bài luyện tập từ vựng!',
  });
});
