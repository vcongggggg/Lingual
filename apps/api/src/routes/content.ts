import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const contentRouter = Router();

// Zod Schema for Query Parameters
const contentQuerySchema = z.object({
  cefrLevel: z.string().optional(),
  topic: z.string().optional(),
  limit: z.preprocess((v) => (v !== undefined ? Number(v) : 20), z.number().int().min(1).max(100).default(20)),
  random: z.preprocess((v) => v === 'true' || v === true || v === '1', z.boolean().default(false)),
  category: z.string().optional(),
  search: z.string().optional(),
});

function safeParseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function fetchWithFilter<T>(
  modelDelegate: any,
  where: Record<string, any>,
  limit: number,
  random: boolean,
  orderBy?: any
): Promise<{ items: T[]; total: number }> {
  const total = await modelDelegate.count({ where });
  if (total === 0) return { items: [], total: 0 };

  if (random && total > limit) {
    const idRecords = await modelDelegate.findMany({
      where,
      select: { id: true },
    });
    const shuffled = idRecords.sort(() => 0.5 - Math.random());
    const pickedIds = shuffled.slice(0, limit).map((r: { id: any }) => r.id);
    const items = await modelDelegate.findMany({
      where: { id: { in: pickedIds } },
    });
    return { items, total };
  }

  const items = await modelDelegate.findMany({
    where,
    take: limit,
    ...(orderBy ? { orderBy } : {}),
  });
  return { items, total };
}

// 1. /grammar-questions
contentRouter.get('/grammar-questions', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.topic) where.topic = { contains: q.topic, mode: 'insensitive' };

    const { items, total } = await fetchWithFilter<any>(prisma.grammarQuestion, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      options: safeParseJson(item.optionsJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải câu hỏi ngữ pháp' });
  }
});

contentRouter.get('/grammar-questions/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.grammarQuestion.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy câu hỏi' });
    res.json({ item: { ...item, options: safeParseJson(item.optionsJson, []) } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. /dialogues
contentRouter.get('/dialogues', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.topic) where.topic = { contains: q.topic, mode: 'insensitive' };

    const { items, total } = await fetchWithFilter<any>(prisma.dialogueScenario, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      lines: safeParseJson(item.linesJson, []),
      questions: safeParseJson(item.questionsJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải hội thoại' });
  }
});

contentRouter.get('/dialogues/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.dialogueScenario.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy kịch bản hội thoại' });
    res.json({
      item: {
        ...item,
        lines: safeParseJson(item.linesJson, []),
        questions: safeParseJson(item.questionsJson, []),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. /story-templates
contentRouter.get('/story-templates', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.topic) where.topic = { contains: q.topic, mode: 'insensitive' };

    const { items, total } = await fetchWithFilter<any>(prisma.storyTemplate, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      paragraphs: safeParseJson(item.paragraphsJson, []),
      slots: safeParseJson(item.slotsJson, []),
      slotHints: safeParseJson(item.slotHintsJson, {}),
      quizQuestions: safeParseJson(item.quizQuestionsJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải mẫu truyện' });
  }
});

contentRouter.get('/story-templates/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.storyTemplate.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy mẫu truyện' });
    res.json({
      item: {
        ...item,
        paragraphs: safeParseJson(item.paragraphsJson, []),
        slots: safeParseJson(item.slotsJson, []),
        slotHints: safeParseJson(item.slotHintsJson, {}),
        quizQuestions: safeParseJson(item.quizQuestionsJson, []),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. /packages
contentRouter.get('/packages', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.topic) where.topic = { contains: q.topic, mode: 'insensitive' };

    const { items, total } = await fetchWithFilter<any>(prisma.contentPackage, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      dialogue: safeParseJson(item.dialogueJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải gói nội dung' });
  }
});

contentRouter.get('/packages/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.contentPackage.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy gói nội dung' });
    res.json({ item: { ...item, dialogue: safeParseJson(item.dialogueJson, []) } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. /articles
contentRouter.get('/articles', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.topic) where.topic = { contains: q.topic, mode: 'insensitive' };

    const { items, total } = await fetchWithFilter<any>(prisma.bilingualArticle, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      paragraphs: safeParseJson(item.paragraphsJson, []),
      quiz: safeParseJson(item.quizJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải bài báo song ngữ' });
  }
});

contentRouter.get('/articles/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.bilingualArticle.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    res.json({
      item: {
        ...item,
        paragraphs: safeParseJson(item.paragraphsJson, []),
        quiz: safeParseJson(item.quizJson, []),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. /stories
contentRouter.get('/stories', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.topic) where.topic = { contains: q.topic, mode: 'insensitive' };

    const { items, total } = await fetchWithFilter<any>(prisma.bilingualStory, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      pages: safeParseJson(item.pagesJson, []),
      quiz: safeParseJson(item.quizJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải truyện song ngữ' });
  }
});

contentRouter.get('/stories/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.bilingualStory.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy truyện' });
    res.json({
      item: {
        ...item,
        pages: safeParseJson(item.pagesJson, []),
        quiz: safeParseJson(item.quizJson, []),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. /ielts-reading
contentRouter.get('/ielts-reading', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();

    const { items, total } = await fetchWithFilter<any>(prisma.ieltsReadingPassage, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      passage: safeParseJson(item.passageJson, {}),
      questions: safeParseJson(item.questionsJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải bài đọc IELTS' });
  }
});

contentRouter.get('/ielts-reading/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.ieltsReadingPassage.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy bài đọc' });
    res.json({
      item: {
        ...item,
        passage: safeParseJson(item.passageJson, {}),
        questions: safeParseJson(item.questionsJson, []),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. /ielts-listening
contentRouter.get('/ielts-listening', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();

    const { items, total } = await fetchWithFilter<any>(prisma.ieltsListeningSection, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      script: safeParseJson(item.scriptJson, []),
      questions: safeParseJson(item.questionsJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải bài nghe IELTS' });
  }
});

contentRouter.get('/ielts-listening/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.ieltsListeningSection.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy phần thi nghe' });
    res.json({
      item: {
        ...item,
        script: safeParseJson(item.scriptJson, []),
        questions: safeParseJson(item.questionsJson, []),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. /ielts-speaking
contentRouter.get('/ielts-speaking', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};

    const { items, total } = await fetchWithFilter<any>(prisma.ieltsSpeakingTopic, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      ideas: safeParseJson(item.ideasJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải chủ đề nói IELTS' });
  }
});

contentRouter.get('/ielts-speaking/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.ieltsSpeakingTopic.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy chủ đề nói' });
    res.json({ item: { ...item, ideas: safeParseJson(item.ideasJson, []) } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 10. /ielts-writing
contentRouter.get('/ielts-writing', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};

    const { items, total } = await fetchWithFilter<any>(prisma.ieltsWritingTopic, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      outline: safeParseJson(item.outlineJson, {}),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải chủ đề viết IELTS' });
  }
});

contentRouter.get('/ielts-writing/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.ieltsWritingTopic.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy đề bài viết' });
    res.json({ item: { ...item, outline: safeParseJson(item.outlineJson, {}) } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 11. /units (Merge: curriculumUnit 11..60 + unit 1..10 = 60 units total)
contentRouter.get('/units', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);

    // Fetch both datasets
    const [curriculumUnits, legacyUnits] = await Promise.all([
      prisma.curriculumUnit.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.unit.findMany({
        orderBy: { order: 'asc' },
        include: { lessons: true },
      }),
    ]);

    // Map legacy units (order 1..10)
    const formattedLegacy = legacyUnits.map((u) => ({
      id: u.id,
      order: u.order,
      title: u.title,
      titleVi: u.title,
      description: u.description || '',
      descriptionVi: u.description || '',
      cefrLevel: u.order <= 3 ? 'A1' : u.order <= 6 ? 'A2' : 'B1',
      lessons: u.lessons || [],
      lessonsJson: JSON.stringify(u.lessons || []),
      source: 'legacy_unit',
      iconName: u.iconName || 'book',
    }));

    // Map curriculum units (order 11..60)
    const formattedCurriculum = curriculumUnits.map((u) => ({
      id: u.id,
      order: u.order,
      title: u.title,
      titleVi: u.titleVi || u.title,
      description: u.description || '',
      descriptionVi: u.descriptionVi || u.description || '',
      cefrLevel: u.cefrLevel,
      lessons: safeParseJson(u.lessonsJson, []),
      lessonsJson: u.lessonsJson,
      source: 'curriculum_unit',
      iconName: 'book',
    }));

    // Return combined 60 units sorted by order
    const allUnits = [...formattedLegacy, ...formattedCurriculum].sort((a, b) => a.order - b.order);

    let filtered = allUnits;
    if (q.cefrLevel) {
      filtered = filtered.filter((u) => u.cefrLevel.toLowerCase() === q.cefrLevel?.toLowerCase());
    }

    const total = filtered.length;
    const finalItems = q.limit ? filtered.slice(0, q.limit) : filtered;

    res.json({ items: finalItems, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải danh sách bài học' });
  }
});

contentRouter.get('/units/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // Check curriculumUnit first
    const cUnit = await prisma.curriculumUnit.findUnique({ where: { id } });
    if (cUnit) {
      return res.json({
        item: {
          ...cUnit,
          lessons: safeParseJson(cUnit.lessonsJson, []),
          source: 'curriculum_unit',
        },
      });
    }

    // Check legacy unit
    const lUnit = await prisma.unit.findUnique({ where: { id }, include: { lessons: true } });
    if (lUnit) {
      return res.json({
        item: {
          ...lUnit,
          source: 'legacy_unit',
        },
      });
    }

    return res.status(404).json({ error: 'Không tìm thấy unit' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 12. /diary-prompts
contentRouter.get('/diary-prompts', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();

    const { items, total } = await fetchWithFilter<any>(prisma.diaryPrompt, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      keywords: safeParseJson(item.keywordsJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải gợi ý nhật ký' });
  }
});

contentRouter.get('/diary-prompts/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.diaryPrompt.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy chủ đề nhật ký' });
    res.json({ item: { ...item, keywords: safeParseJson(item.keywordsJson, []) } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 13. /shadowing
contentRouter.get('/shadowing', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.topic) where.topic = { contains: q.topic, mode: 'insensitive' };

    const { items, total } = await fetchWithFilter<any>(prisma.shadowingSentence, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải câu nhại tiếng' });
  }
});

contentRouter.get('/shadowing/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.shadowingSentence.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy câu luyện nói' });
    res.json({ item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 14. /dictation
contentRouter.get('/dictation', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();

    const { items, total } = await fetchWithFilter<any>(prisma.dictationSentence, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      trickyWords: safeParseJson(item.trickyWordsJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải bài chính tả' });
  }
});

contentRouter.get('/dictation/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.dictationSentence.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy câu chính tả' });
    res.json({ item: { ...item, trickyWords: safeParseJson(item.trickyWordsJson, []) } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 15. /monologues
contentRouter.get('/monologues', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();

    const { items, total } = await fetchWithFilter<any>(prisma.listeningMonologue, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      script: safeParseJson(item.scriptJson, []),
      questions: safeParseJson(item.questionsJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải bài độc thoại' });
  }
});

contentRouter.get('/monologues/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.listeningMonologue.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy bài nghe độc thoại' });
    res.json({
      item: {
        ...item,
        script: safeParseJson(item.scriptJson, []),
        questions: safeParseJson(item.questionsJson, []),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 16. /idioms
contentRouter.get('/idioms', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.search) {
      where.OR = [
        { idiom: { contains: q.search, mode: 'insensitive' } },
        { meaningVi: { contains: q.search, mode: 'insensitive' } },
      ];
    }

    const { items, total } = await fetchWithFilter<any>(prisma.idiom, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải thành ngữ' });
  }
});

contentRouter.get('/idioms/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.idiom.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy thành ngữ' });
    res.json({ item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 17. /phrasal-verbs
contentRouter.get('/phrasal-verbs', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.search) {
      where.OR = [
        { verb: { contains: q.search, mode: 'insensitive' } },
        { meaningVi: { contains: q.search, mode: 'insensitive' } },
      ];
    }

    const { items, total } = await fetchWithFilter<any>(prisma.phrasalVerb, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải cụm động từ' });
  }
});

contentRouter.get('/phrasal-verbs/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.phrasalVerb.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy cụm động từ' });
    res.json({ item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 18. /collocations
contentRouter.get('/collocations', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.search) {
      where.OR = [
        { collocation: { contains: q.search, mode: 'insensitive' } },
        { meaningVi: { contains: q.search, mode: 'insensitive' } },
      ];
    }

    const { items, total } = await fetchWithFilter<any>(prisma.collocation, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải cụm từ cố định' });
  }
});

contentRouter.get('/collocations/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.collocation.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy cụm từ kết hợp' });
    res.json({ item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 19. /synonyms
contentRouter.get('/synonyms', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.search) {
      where.OR = [
        { word: { contains: q.search, mode: 'insensitive' } },
        { meaningVi: { contains: q.search, mode: 'insensitive' } },
      ];
    }

    const { items, total } = await fetchWithFilter<any>(prisma.synonymAntonym, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      synonyms: safeParseJson(item.synonymsJson, []),
      antonyms: safeParseJson(item.antonymsJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải từ đồng nghĩa/trái nghĩa' });
  }
});

contentRouter.get('/synonyms/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.synonymAntonym.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy từ đồng nghĩa' });
    res.json({
      item: {
        ...item,
        synonyms: safeParseJson(item.synonymsJson, []),
        antonyms: safeParseJson(item.antonymsJson, []),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 20. /minimal-pairs
contentRouter.get('/minimal-pairs', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};

    const { items, total } = await fetchWithFilter<any>(prisma.minimalPair, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải cặp từ tối thiểu' });
  }
});

contentRouter.get('/minimal-pairs/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.minimalPair.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy cặp từ' });
    res.json({ item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 21. /tongue-twisters
contentRouter.get('/tongue-twisters', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};

    const { items, total } = await fetchWithFilter<any>(prisma.tongueTwister, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải câu luyện líu lưỡi' });
  }
});

contentRouter.get('/tongue-twisters/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.tongueTwister.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy câu luyện âm' });
    res.json({ item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 22. /proverbs
contentRouter.get('/proverbs', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};

    const { items, total } = await fetchWithFilter<any>(prisma.proverb, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải tục ngữ' });
  }
});

contentRouter.get('/proverbs/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.proverb.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy tục ngữ' });
    res.json({ item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 23. /game-pools
contentRouter.get('/game-pools', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.topic) where.topic = { contains: q.topic, mode: 'insensitive' };

    const { items, total } = await fetchWithFilter<any>(prisma.gameWordPool, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải kho từ game' });
  }
});

contentRouter.get('/game-pools/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.gameWordPool.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy từ vựng game' });
    res.json({ item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 24. /grammar-explanations
contentRouter.get('/grammar-explanations', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    if (q.topic) where.topic = { contains: q.topic, mode: 'insensitive' };

    const { items, total } = await fetchWithFilter<any>(prisma.grammarExplanation, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      examples: safeParseJson(item.examplesJson, []),
      commonMistakes: safeParseJson(item.commonMistakesJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải giải thích ngữ pháp' });
  }
});

contentRouter.get('/grammar-explanations/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.grammarExplanation.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy giải thích' });
    res.json({
      item: {
        ...item,
        examples: safeParseJson(item.examplesJson, []),
        commonMistakes: safeParseJson(item.commonMistakesJson, []),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 25. /vocab-questions
contentRouter.get('/vocab-questions', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();

    const { items, total } = await fetchWithFilter<any>(prisma.dailyVocabQuestion, where, q.limit, q.random);
    const formatted = items.map((item: any) => ({
      ...item,
      options: safeParseJson(item.optionsJson, []),
    }));
    res.json({ items: formatted, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải câu hỏi từ vựng' });
  }
});

contentRouter.get('/vocab-questions/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.dailyVocabQuestion.findUnique({ where: { id: req.params.id } });
    if (!item) return res.status(404).json({ error: 'Không tìm thấy câu hỏi từ vựng' });
    res.json({ item: { ...item, options: safeParseJson(item.optionsJson, []) } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 26. /phrases (param category: situational / business / travel)
contentRouter.get('/phrases', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const category = q.category?.toLowerCase() || 'situational';

    if (category === 'business') {
      const where: any = {};
      if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
      const { items, total } = await fetchWithFilter<any>(prisma.businessPhrase, where, q.limit, q.random);
      return res.json({ items, total, category: 'business' });
    } else if (category === 'travel') {
      const where: any = {};
      if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
      const { items, total } = await fetchWithFilter<any>(prisma.travelPhrase, where, q.limit, q.random);
      return res.json({ items, total, category: 'travel' });
    } else {
      const where: any = {};
      if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
      const { items, total } = await fetchWithFilter<any>(prisma.situationalPhrase, where, q.limit, q.random);
      return res.json({ items, total, category: 'situational' });
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải cụm từ' });
  }
});

contentRouter.get('/phrases/situational', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    const { items, total } = await fetchWithFilter<any>(prisma.situationalPhrase, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

contentRouter.get('/phrases/business', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    const { items, total } = await fetchWithFilter<any>(prisma.businessPhrase, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

contentRouter.get('/phrases/travel', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.cefrLevel) where.cefrLevel = q.cefrLevel.toUpperCase();
    const { items, total } = await fetchWithFilter<any>(prisma.travelPhrase, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 27. /sentence-bank
contentRouter.get('/sentence-bank', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.search) {
      where.OR = [
        { en: { contains: q.search, mode: 'insensitive' } },
        { vi: { contains: q.search, mode: 'insensitive' } },
      ];
    }
    const { items, total } = await fetchWithFilter<any>(prisma.sentenceBank, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải sentence bank' });
  }
});

// Alias: /sentences
contentRouter.get('/sentences', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    if (q.search) {
      where.OR = [
        { en: { contains: q.search, mode: 'insensitive' } },
        { vi: { contains: q.search, mode: 'insensitive' } },
      ];
    }
    const { items, total } = await fetchWithFilter<any>(prisma.sentenceBank, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải sentences' });
  }
});

// 28. /word-sentence-links
contentRouter.get('/word-sentence-links', async (req: Request, res: Response) => {
  try {
    const q = contentQuerySchema.parse(req.query);
    const where: any = {};
    const { items, total } = await fetchWithFilter<any>(prisma.wordSentenceLink, where, q.limit, q.random);
    res.json({ items, total });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Lỗi khi tải word sentence links' });
  }
});

