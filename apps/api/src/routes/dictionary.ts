import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { SEED_UNITS } from '../../../../prisma/seed.js';
import { MOCK_WORD_STATES } from './auth.js';
import { RealDictionaryService } from '../services/realDictionaryService.js';
import { BACKEND_MASTER_WORDS } from '../data/universalVocabulary.js';

const currentDir = typeof __dirname !== 'undefined' ? __dirname : path.resolve();

export const dictionaryRouter = Router();

// Load master 25k dictionary
let MASTER_25K_DICTIONARY: any[] = [];
try {
  const candidatePaths = [
    path.join(currentDir, '../data/masterDictionary25k.json'),
    path.join(currentDir, '../../src/data/masterDictionary25k.json'),
    path.join(process.cwd(), 'apps/api/src/data/masterDictionary25k.json'),
    path.join(process.cwd(), 'src/data/masterDictionary25k.json'),
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      MASTER_25K_DICTIONARY = JSON.parse(fs.readFileSync(p, 'utf8'));
      break;
    }
  }
} catch (e) {
  console.warn('Could not load masterDictionary25k.json:', e);
}

// Flatten all words across all units, master words, and 26,500 comprehensive dictionary words
const ALL_VOCABULARY_WORDS = [
  ...SEED_UNITS.flatMap((unit) =>
    unit.lessons.flatMap((lesson) =>
      lesson.words.map((w) => ({
        ...w,
        unitTitle: unit.title,
        lessonTitle: lesson.title,
        id: `word-${w.targetText.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      }))
    )
  ),
  ...BACKEND_MASTER_WORDS.map((bw) => ({
    targetText: bw.targetText,
    translation: bw.translation,
    phonetic: bw.phonetic,
    partOfSpeech: bw.pos,
    cefrLevel: bw.cefrLevel,
    exampleSentence: bw.exampleSentence,
    exampleTranslation: bw.exampleTranslation,
    unitTitle: `Chủ đề: ${bw.category}`,
    lessonTitle: 'Từ Vựng Nâng Cao',
    id: `bw-${bw.targetText.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
  })),
  ...MASTER_25K_DICTIONARY.map((dw) => ({
    targetText: dw.targetText,
    translation: dw.translation,
    phonetic: dw.phonetic,
    partOfSpeech: dw.partOfSpeech,
    cefrLevel: dw.cefrLevel,
    exampleSentence: dw.exampleSentence,
    exampleTranslation: dw.exampleTranslation,
    unitTitle: `Chủ đề: ${dw.category}`,
    lessonTitle: 'Từ Điển Toàn Diện',
    id: dw.id,
  })),
];

// O(1) Exact lookup map for 26,500+ master dictionary
const EXACT_LOOKUP_MAP = new Map<string, any>();
for (let i = 0; i < ALL_VOCABULARY_WORDS.length; i++) {
  const item = ALL_VOCABULARY_WORDS[i];
  const key = item.targetText.toLowerCase().trim();
  if (!EXACT_LOOKUP_MAP.has(key)) {
    EXACT_LOOKUP_MAP.set(key, item);
  }
}

// In-Memory Search Query Cache
const SEARCH_CACHE = new Map<string, { words: any[]; total: number; totalPages: number; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 60s

// In-memory bookmarks store for demo mode
const MOCK_BOOKMARKS = new Set<string>();

/**
 * GET /api/v1/dictionary/search
 * Query params: q, cefr, partOfSpeech, page, limit
 */
dictionaryRouter.get('/search', async (req, res) => {
  const { q = '', cefr = '', partOfSpeech = '', page = '1', limit = '20' } = req.query;

  const queryStr = typeof q === 'string' ? q.trim() : '';
  const cacheKey = `${queryStr.toLowerCase()}_${cefr}_${partOfSpeech}_${page}_${limit}`;

  const cached = SEARCH_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return res.json({
      words: cached.words.map((w) => ({
        ...w,
        isBookmarked: MOCK_BOOKMARKS.has(w.id),
        inSrsDeck: MOCK_WORD_STATES.some((ws) => ws.wordId === w.id),
      })),
      pagination: {
        page: parseInt(page as string, 10) || 1,
        limit: parseInt(limit as string, 10) || 20,
        total: cached.total,
        totalPages: cached.totalPages,
      },
    });
  }

  let filtered = ALL_VOCABULARY_WORDS;

  if (queryStr) {
    const searchTerm = queryStr.toLowerCase();
    const exactMatches: any[] = [];
    const prefixMatches: any[] = [];
    const includeMatches: any[] = [];
    const meaningMatches: any[] = [];

    for (let i = 0; i < filtered.length; i++) {
      const w = filtered[i];
      const lower = w.targetText.toLowerCase();
      if (lower === searchTerm) {
        exactMatches.push(w);
      } else if (lower.startsWith(searchTerm)) {
        prefixMatches.push(w);
      } else if (lower.includes(searchTerm)) {
        includeMatches.push(w);
      } else if (w.translation && w.translation.toLowerCase().includes(searchTerm)) {
        meaningMatches.push(w);
      }
    }

    filtered = [...exactMatches, ...prefixMatches, ...includeMatches, ...meaningMatches];

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

  // Save to in-memory search cache (up to 500 entries)
  if (SEARCH_CACHE.size > 500) {
    const firstKey = SEARCH_CACHE.keys().next().value;
    if (firstKey) SEARCH_CACHE.delete(firstKey);
  }
  SEARCH_CACHE.set(cacheKey, {
    words: paginatedWords,
    total,
    totalPages,
    timestamp: Date.now(),
  });

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
    const cleanWord = word.toLowerCase().trim();
    const localMatch = EXACT_LOOKUP_MAP.get(cleanWord) || null;
    const liveResults = await RealDictionaryService.lookupWord(word);

    return res.json({
      word,
      local: localMatch,
      definitions: liveResults,
      bookmarked: localMatch ? MOCK_BOOKMARKS.has(localMatch.id) : false,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lookup failed', message: err.message });
  }
});

/**
 * POST /api/v1/dictionary/bookmark/:wordId
 * Toggle bookmark for a word
 */
dictionaryRouter.post('/bookmark/:wordId', (req, res) => {
  const { wordId } = req.params;
  if (!wordId) {
    return res.status(400).json({ error: 'wordId is required' });
  }

  const isBookmarked = MOCK_BOOKMARKS.has(wordId);
  if (isBookmarked) {
    MOCK_BOOKMARKS.delete(wordId);
  } else {
    MOCK_BOOKMARKS.add(wordId);
  }

  return res.json({
    wordId,
    bookmarked: !isBookmarked,
    totalBookmarks: MOCK_BOOKMARKS.size,
  });
});

/**
 * GET /api/v1/dictionary/bookmarks
 * Get list of bookmarked words
 */
dictionaryRouter.get('/bookmarks', (req, res) => {
  const bookmarkedWords = ALL_VOCABULARY_WORDS.filter((w) => MOCK_BOOKMARKS.has(w.id));
  return res.json({
    bookmarks: bookmarkedWords,
    total: bookmarkedWords.length,
  });
});
