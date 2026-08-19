import { Router } from 'express';
import { SEED_UNITS } from '../../../../prisma/seed.js';
import { MOCK_WORD_STATES } from './auth.js';
import { RealDictionaryService } from '../services/realDictionaryService.js';

export const dictionaryRouter = Router();

// Flatten all words across all units & lessons into a master dictionary list
const ALL_VOCABULARY_WORDS = SEED_UNITS.flatMap((unit) =>
  unit.lessons.flatMap((lesson) =>
    lesson.words.map((w) => ({
      ...w,
      unitTitle: unit.title,
      lessonTitle: lesson.title,
      id: `word-${w.targetText.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    }))
  )
);

// In-memory bookmarks store for demo mode
const MOCK_BOOKMARKS = new Set<string>();

/**
 * GET /api/v1/dictionary/search
 * Query params: q, cefr, partOfSpeech, page, limit
 */
dictionaryRouter.get('/search', async (req, res) => {
  const { q = '', cefr = '', partOfSpeech = '', page = '1', limit = '20' } = req.query;

  let filtered = [...ALL_VOCABULARY_WORDS];
  const queryStr = typeof q === 'string' ? q.trim() : '';

  if (queryStr) {
    const searchTerm = queryStr.toLowerCase();
    filtered = filtered.filter(
      (w) =>
        w.targetText.toLowerCase().includes(searchTerm) ||
        w.translation.toLowerCase().includes(searchTerm) ||
        (w.exampleSentence && w.exampleSentence.toLowerCase().includes(searchTerm))
    );

    // If local matches are few and query is a valid English word, fetch from live external dictionary
    if (filtered.length < 3 && /^[a-zA-Z\s-]+$/.test(queryStr)) {
      try {
        const liveDefs = await RealDictionaryService.lookupWord(queryStr);
        if (liveDefs && liveDefs.length > 0) {
          liveDefs.forEach((def, idx) => {
            const externalWordId = `ext-${def.word}-${idx}`;
            if (!filtered.some((f) => f.targetText.toLowerCase() === def.word.toLowerCase())) {
              filtered.push({
                id: externalWordId,
                targetText: def.word.charAt(0).toUpperCase() + def.word.slice(1),
                translation: def.definitionEn,
                phonetic: def.phonetic || '',
                partOfSpeech: def.partOfSpeech,
                cefrLevel: 'B2',
                exampleSentence: def.exampleSentence || `The word "${def.word}" is commonly used in modern English.`,
                audioUrl: def.audioUrl,
                unitTitle: 'Từ Điển Mở Rộng (Live API)',
                lessonTitle: 'Tra Cứu Trực Tuyến',
              } as any);
            }
          });
        }
      } catch {}
    }
  }

  if (cefr && typeof cefr === 'string' && cefr !== 'all') {
    filtered = filtered.filter((w) => w.cefrLevel.toUpperCase() === cefr.toUpperCase());
  }

  if (partOfSpeech && typeof partOfSpeech === 'string' && partOfSpeech !== 'all') {
    filtered = filtered.filter((w) => w.partOfSpeech.toLowerCase() === partOfSpeech.toLowerCase());
  }

  const p = Math.max(1, parseInt(page as string, 10) || 1);
  const l = Math.max(1, parseInt(limit as string, 10) || 20);
  const total = filtered.length;
  const totalPages = Math.ceil(total / l);
  const paginatedWords = filtered.slice((p - 1) * l, p * l).map((w) => ({
    ...w,
    isBookmarked: MOCK_BOOKMARKS.has(w.id),
    inSrsDeck: MOCK_WORD_STATES.some((ws) => ws.wordId === w.id),
  }));

  return res.json({
    words: paginatedWords,
    pagination: {
      page: p,
      limit: l,
      total,
      totalPages,
    },
  });
});

/**
 * GET /api/v1/dictionary/lookup/:word
 * Direct Live Definition Lookup with Phonetics & Audio
 */
dictionaryRouter.get('/lookup/:word', async (req, res) => {
  const { word } = req.params;
  if (!word) {
    return res.status(400).json({ error: 'Word is required' });
  }

  try {
    const liveResults = await RealDictionaryService.lookupWord(word);
    const localMatch = ALL_VOCABULARY_WORDS.find(
      (w) => w.targetText.toLowerCase() === word.toLowerCase()
    );

    return res.json({
      word,
      local: localMatch || null,
      definitions: liveResults,
      bookmarked: localMatch ? MOCK_BOOKMARKS.has(localMatch.id) : false,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lookup failed', message: err.message });
  }
});

/**
 * POST /api/v1/dictionary/bookmark
 * Body: { wordId: string }
 */
dictionaryRouter.post('/bookmark', (req, res) => {
  const { wordId } = req.body;
  if (!wordId) {
    return res.status(400).json({ error: 'wordId là bắt buộc' });
  }

  if (MOCK_BOOKMARKS.has(wordId)) {
    MOCK_BOOKMARKS.delete(wordId);
    return res.json({ bookmarked: false, message: 'Đã bỏ lưu từ vựng' });
  } else {
    MOCK_BOOKMARKS.add(wordId);
    return res.json({ bookmarked: true, message: 'Đã lưu từ vựng vào danh sách yêu thích' });
  }
});

/**
 * POST /api/v1/dictionary/add-to-srs
 * Body: { wordId: string, userId?: string }
 */
dictionaryRouter.post('/add-to-srs', (req, res) => {
  const { wordId, userId = 'demo-user-id-001' } = req.body;
  if (!wordId) {
    return res.status(400).json({ error: 'wordId là bắt buộc' });
  }

  let wordObj = ALL_VOCABULARY_WORDS.find((w) => w.id === wordId);

  // If dynamic ext- word
  if (!wordObj && wordId.startsWith('ext-')) {
    wordObj = {
      id: wordId,
      targetText: wordId.replace('ext-', '').split('-')[0],
      translation: 'Từ tra cứu trực tuyến',
      phonetic: '',
      partOfSpeech: 'noun',
      cefrLevel: 'B2',
      exampleSentence: 'Tra cứu từ điển mở rộng.',
      unitTitle: 'Từ Điển Mở Rộng',
      lessonTitle: 'Tra Cứu',
    } as any;
  }

  if (!wordObj) {
    return res.status(404).json({ error: 'Không tìm thấy từ vựng' });
  }

  const existingStateIndex = MOCK_WORD_STATES.findIndex((ws) => ws.wordId === wordId && ws.userId === userId);

  if (existingStateIndex >= 0) {
    return res.json({ message: 'Từ vựng này đã có trong bộ thẻ SRS của bạn', added: false });
  }

  const newWordState = {
    id: `ws-custom-${Date.now()}`,
    userId,
    wordId,
    repetition: 0,
    interval: 1,
    efactor: 2.5,
    dueDate: new Date().toISOString(),
    quality: 0,
    updatedAt: new Date().toISOString(),
    word: wordObj,
  };

  MOCK_WORD_STATES.push(newWordState);

  return res.json({ message: 'Đã thêm từ vựng vào bộ thẻ ôn tập SRS thành công!', added: true });
});
