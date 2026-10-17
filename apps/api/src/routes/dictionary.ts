import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { SEED_UNITS } from '../../../../prisma/seed';
import { RealDictionaryService } from '../services/realDictionaryService.js';
import { BACKEND_MASTER_WORDS } from '../data/universalVocabulary.js';
import { prisma } from '../lib/prisma.js';
import { userRepository } from '../repositories/user.repository.js';

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

/**
 * Helper to ensure a word exists in PostgreSQL `vocabularies` table before bookmarking
 */
async function ensureVocabularyRecord(wordId: string): Promise<string> {
  const existing = await prisma.vocabulary.findUnique({ where: { id: wordId } });
  if (existing) return existing.id;

  const foundItem = ALL_VOCABULARY_WORDS.find((w) => w.id === wordId);
  const targetText = foundItem?.targetText || wordId;
  const translation = foundItem?.translation || targetText;

  const created = await prisma.vocabulary.create({
    data: {
      id: wordId,
      targetText,
      translation,
      phonetic: foundItem?.phonetic || '',
      cefrLevel: foundItem?.cefrLevel || 'A1',
      partOfSpeech: foundItem?.partOfSpeech || 'noun',
      exampleSentence: foundItem?.exampleSentence || null,
      exampleTranslation: foundItem?.exampleTranslation || null,
    },
  });
  return created.id;
}

/**
 * GET /api/v1/dictionary/search
 * Query params: q, cefr, partOfSpeech, page, limit
 */
dictionaryRouter.get('/search', async (req, res) => {
  const { q = '', cefr = '', partOfSpeech = '', page = '1', limit = '20' } = req.query;
  const userId = (req.query.userId as string) || 'demo-user-id-001';

  const queryStr = typeof q === 'string' ? q.trim() : '';
  const cacheKey = `${queryStr.toLowerCase()}_${cefr}_${partOfSpeech}_${page}_${limit}`;

  // Fetch user bookmarks from DB
  let bookmarkedWordIds = new Set<string>();
  let srsWordIds = new Set<string>();
  try {
    const bookmarks = await prisma.userBookmark.findMany({ where: { userId } });
    bookmarkedWordIds = new Set(bookmarks.map((b) => b.wordId));
    const states = await prisma.userWordState.findMany({ where: { userId } });
    srsWordIds = new Set(states.map((s) => s.wordId));
  } catch {}

  const cached = SEARCH_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return res.json({
      words: cached.words.map((w) => ({
        ...w,
        isBookmarked: bookmarkedWordIds.has(w.id),
        inSrsDeck: srsWordIds.has(w.id),
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

    if (filtered.length < 3 && /^[a-zA-Z\s-]+$/.test(queryStr)) {
      try {
        const liveDefinitions = await RealDictionaryService.lookupWord(queryStr);
        if (liveDefinitions && liveDefinitions.length > 0) {
          const liveWords = liveDefinitions.map((def: any, idx: number) => ({
            id: `live-${queryStr}-${idx}`,
            targetText: def.word || queryStr,
            translation: def.meaningVi || def.definitions?.[0] || 'Từ mới',
            phonetic: def.phonetic || '',
            partOfSpeech: def.partOfSpeech || 'noun',
            cefrLevel: 'B2',
            exampleSentence: def.examples?.[0] || '',
            exampleTranslation: '',
            unitTitle: 'Từ Điển Trực Tuyến Live',
            lessonTitle: 'Tra Cứu Real-Time',
          }));
          filtered = [...liveWords, ...filtered];
        }
      } catch (err) {
        console.warn('RealDictionaryService fallback skipped:', err);
      }
    }
  }

  if (cefr && typeof cefr === 'string') {
    filtered = filtered.filter((w) => w.cefrLevel?.toUpperCase() === cefr.toUpperCase());
  }

  if (partOfSpeech && typeof partOfSpeech === 'string') {
    filtered = filtered.filter((w) => w.partOfSpeech?.toLowerCase() === partOfSpeech.toLowerCase());
  }

  const p = Math.max(1, parseInt(page as string, 10) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 20));
  const total = filtered.length;
  const totalPages = Math.ceil(total / l);
  const start = (p - 1) * l;
  const paginatedWords = filtered.slice(start, start + l).map((w) => ({
    ...w,
    isBookmarked: bookmarkedWordIds.has(w.id),
    inSrsDeck: srsWordIds.has(w.id),
  }));

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
 */
dictionaryRouter.get('/lookup/:word', async (req, res) => {
  const { word } = req.params;
  const userId = (req.query.userId as string) || 'demo-user-id-001';

  if (!word) {
    return res.status(400).json({ error: 'Word is required' });
  }

  try {
    const cleanWord = word.toLowerCase().trim();
    const localMatch = EXACT_LOOKUP_MAP.get(cleanWord) || null;
    const liveResults = await RealDictionaryService.lookupWord(word);

    let isBookmarked = false;
    if (localMatch) {
      const b = await prisma.userBookmark.findUnique({
        where: { userId_wordId: { userId, wordId: localMatch.id } },
      });
      isBookmarked = !!b;
    }

    return res.json({
      word,
      local: localMatch,
      definitions: liveResults,
      bookmarked: isBookmarked,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lookup failed', message: err.message });
  }
});

/**
 * POST /api/v1/dictionary/bookmark/:wordId
 * Toggle bookmark for a word, strictly persisted in PostgreSQL
 */
dictionaryRouter.post('/bookmark/:wordId', async (req, res) => {
  const { wordId } = req.params;
  const userId = (req.body.userId as string) || (req.query.userId as string) || 'demo-user-id-001';

  if (!wordId) {
    return res.status(400).json({ error: 'wordId is required' });
  }

  try {
    // Ensure user exists
    let user = await userRepository.findById(userId);
    if (!user) {
      user = await userRepository.createUser({
        id: userId,
        email: `${userId}@lingual.local`,
        displayName: 'Learner',
        role: 'STUDENT' as any,
      });
    }

    // Ensure word exists in vocabularies table
    const resolvedWordId = await ensureVocabularyRecord(wordId);

    const existing = await prisma.userBookmark.findUnique({
      where: {
        userId_wordId: {
          userId: user.id,
          wordId: resolvedWordId,
        },
      },
    });

    let bookmarked: boolean;
    if (existing) {
      await prisma.userBookmark.delete({
        where: { id: existing.id },
      });
      bookmarked = false;
    } else {
      await prisma.userBookmark.create({
        data: {
          userId: user.id,
          wordId: resolvedWordId,
        },
      });
      bookmarked = true;
    }

    const totalBookmarks = await prisma.userBookmark.count({
      where: { userId: user.id },
    });

    return res.json({
      wordId,
      bookmarked,
      totalBookmarks,
    });
  } catch (err: any) {
    console.error('Error toggling bookmark in DB:', err);
    return res.status(500).json({ error: 'Lỗi cập nhật bookmark' });
  }
});

/**
 * GET /api/v1/dictionary/bookmarks
 * Get list of bookmarked words directly from PostgreSQL
 */
dictionaryRouter.get('/bookmarks', async (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user-id-001';

  try {
    const bookmarks = await prisma.userBookmark.findMany({
      where: { userId },
      include: { word: true },
      orderBy: { createdAt: 'desc' },
    });

    const bookmarkedWords = bookmarks.map((b) => {
      const match = ALL_VOCABULARY_WORDS.find((w) => w.id === b.wordId);
      return (
        match || {
          id: b.word.id,
          targetText: b.word.targetText,
          translation: b.word.translation,
          phonetic: b.word.phonetic,
          cefrLevel: b.word.cefrLevel,
          partOfSpeech: b.word.partOfSpeech,
          exampleSentence: b.word.exampleSentence,
          exampleTranslation: b.word.exampleTranslation,
        }
      );
    });

    return res.json({
      bookmarks: bookmarkedWords,
      total: bookmarkedWords.length,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Lỗi tải danh sách bookmarks' });
  }
});
