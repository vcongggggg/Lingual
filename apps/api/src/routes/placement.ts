import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { resolveAuthUserId } from '../lib/authUtil.js';
import { userRepository } from '../repositories/user.repository.js';

export const placementRouter = Router();

export const BAND_ESTIMATES: Record<string, string> = {
  A1: '2.0 - 3.0',
  A2: '3.5 - 4.0',
  B1: '5.0 - 5.5',
  B2: '6.0 - 6.5',
  'B2+': '~7.0',
};

export const PLACEMENT_DISCLAIMER =
  'Kết quả bài kiểm tra chỉ mang tính chất ước lượng trình độ đầu vào trên hệ thống LinguaFlow.';

export const LISTENING_NOTE =
  'Phần Nghe dùng giọng máy tạm thời, sẽ thay bằng audio thật khi có';

export interface PlacementQuestionClient {
  id: string;
  section: 'grammar' | 'vocab' | 'reading' | 'listening';
  cefrLevel: string;
  question: string;
  options: string[];
  passage?: string;
  passageTitle?: string;
  topic?: string;
  audioUrl?: string;
  sourceRef?: string;
}

/**
 * GET /api/v1/placement/latest
 * Return latest placement attempt for current user
 */
placementRouter.get('/latest', async (req: Request, res: Response) => {
  try {
    const userId = resolveAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Yêu cầu đăng nhập.' });
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Người dùng không tồn tại hoặc chưa đăng nhập hợp lệ.' });
    }

    const attempt = await prisma.placementAttempt.findFirst({
      where: { userId },
      orderBy: { takenAt: 'desc' },
    });

    if (!attempt) {
      return res.json({ attempt: null });
    }

    let sectionScores = {};
    try {
      sectionScores = JSON.parse(attempt.sectionScoresJson);
    } catch {}

    return res.json({
      attempt: {
        id: attempt.id,
        takenAt: attempt.takenAt,
        level: attempt.level,
        bandEstimate: attempt.bandEstimate,
        sectionScores,
        listeningNote: LISTENING_NOTE,
        disclaimer: PLACEMENT_DISCLAIMER,
      },
    });
  } catch (error: any) {
    console.error('Error fetching latest placement attempt:', error);
    return res.status(500).json({ error: 'Không thể tải kết quả kiểm tra gần nhất.' });
  }
});

/**
 * GET /api/v1/placement/questions
 * Draw 30 placement questions (P0.5 with Listening):
 * - 12 Grammar: 3 A1, 3 A2, 3 B1, 3 B2 (khó)
 * - 8 Vocab & Collocations: 2 A2, 2 B1, 2 B2, 2 B2 Idioms
 * - 5 Reading mini: 2 passages (3 from passage 1, 2 from passage 2)
 * - 5 Listening: Cambridge 11 Test 1 Section 4 (Ocean Biodiversity monologue)
 */
placementRouter.get('/questions', async (req: Request, res: Response) => {
  try {
    const userId = resolveAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Yêu cầu đăng nhập để truy cập bài kiểm tra.' });
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Người dùng không tồn tại hoặc chưa đăng nhập hợp lệ.' });
    }

    const questions: PlacementQuestionClient[] = [];

    // 1. GRAMMAR (12 questions)
    // 3 A1
    const gA1: any[] = await prisma.$queryRaw`
      SELECT id, question, "optionsJson", topic, "cefrLevel"
      FROM grammar_questions
      WHERE "cefrLevel" = 'A1'
        AND "correctAnswer" IS NOT NULL
        AND jsonb_array_length("optionsJson"::jsonb) = 4
      ORDER BY RANDOM() LIMIT 3;
    `;
    // 3 A2
    const gA2: any[] = await prisma.$queryRaw`
      SELECT id, question, "optionsJson", topic, "cefrLevel"
      FROM grammar_questions
      WHERE "cefrLevel" = 'A2'
        AND "correctAnswer" IS NOT NULL
        AND jsonb_array_length("optionsJson"::jsonb) = 4
      ORDER BY RANDOM() LIMIT 3;
    `;
    // 3 B1
    const gB1: any[] = await prisma.$queryRaw`
      SELECT id, question, "optionsJson", topic, "cefrLevel"
      FROM grammar_questions
      WHERE "cefrLevel" = 'B1'
        AND "correctAnswer" IS NOT NULL
        AND jsonb_array_length("optionsJson"::jsonb) = 4
      ORDER BY RANDOM() LIMIT 3;
    `;
    // 3 B2 kho
    let gB2: any[] = await prisma.$queryRaw`
      SELECT id, question, "optionsJson", topic, "cefrLevel"
      FROM grammar_questions
      WHERE "cefrLevel" = 'B2'
        AND "correctAnswer" IS NOT NULL
        AND jsonb_array_length("optionsJson"::jsonb) = 4
        AND (
          topic ILIKE '%inversion%' OR topic ILIKE '%cleft%' OR topic ILIKE '%subjunctive%' 
          OR topic ILIKE '%conditional%' OR topic ILIKE '%participle%' OR topic ILIKE '%emphasis%'
        )
      ORDER BY RANDOM() LIMIT 3;
    `;
    if (gB2.length < 3) {
      gB2 = await prisma.$queryRaw`
        SELECT id, question, "optionsJson", topic, "cefrLevel"
        FROM grammar_questions
        WHERE "cefrLevel" = 'B2'
          AND "correctAnswer" IS NOT NULL
          AND jsonb_array_length("optionsJson"::jsonb) = 4
        ORDER BY RANDOM() LIMIT 3;
      `;
    }

    for (const g of [...gA1, ...gA2, ...gB1, ...gB2]) {
      let options: string[] = [];
      try {
        options = JSON.parse(g.optionsJson);
      } catch {}
      questions.push({
        id: g.id,
        section: 'grammar',
        cefrLevel: g.cefrLevel,
        question: g.question,
        options,
        topic: g.topic || undefined,
      });
    }

    // 2. VOCABULARY & COLLOCATIONS (8 questions: 2 A2, 2 B1, 2 B2, 2 B2 Idioms)
    const fetchCollocQuestions = async (lvl: string, count: number) => {
      const items: any[] = await prisma.$queryRaw`
        SELECT id, collocation, "meaningVi", "cefrLevel"
        FROM collocations
        WHERE "cefrLevel" = ${lvl}
        ORDER BY RANDOM() LIMIT ${count};
      `;
      for (const item of items) {
        const distractors: any[] = await prisma.$queryRaw`
          SELECT "meaningVi"
          FROM collocations
          WHERE id != ${item.id} AND "cefrLevel" = ${lvl}
          ORDER BY RANDOM() LIMIT 3;
        `;
        const opts = [item.meaningVi, ...distractors.map((d: any) => d.meaningVi)];
        opts.sort(() => Math.random() - 0.5);
        questions.push({
          id: `colloc-${item.id}`,
          section: 'vocab',
          cefrLevel: lvl,
          question: `Cụm từ "${item.collocation}" có nghĩa là gì?`,
          options: opts,
        });
      }
    };

    await fetchCollocQuestions('A2', 2);
    await fetchCollocQuestions('B1', 2);
    await fetchCollocQuestions('B2', 2);

    // 2 B2 Idioms (with valid meaningEn)
    const idioms: any[] = await prisma.$queryRaw`
      SELECT id, idiom, "meaningEn", "cefrLevel"
      FROM idioms
      WHERE "cefrLevel" = 'B2' AND "meaningEn" IS NOT NULL AND trim("meaningEn") != ''
      ORDER BY RANDOM() LIMIT 2;
    `;
    for (const item of idioms) {
      const distractors: any[] = await prisma.$queryRaw`
        SELECT "meaningEn"
        FROM idioms
        WHERE id != ${item.id} AND "cefrLevel" = 'B2' AND "meaningEn" IS NOT NULL AND trim("meaningEn") != ''
        ORDER BY RANDOM() LIMIT 3;
      `;
      const opts = [item.meaningEn, ...distractors.map((d: any) => d.meaningEn)];
      opts.sort(() => Math.random() - 0.5);
      questions.push({
        id: `idiom-${item.id}`,
        section: 'vocab',
        cefrLevel: 'B2',
        question: `What is the meaning of the idiom "${item.idiom}"?`,
        options: opts,
      });
    }

    // 3. READING MINI (5 questions: 2 passages from bilingual stories)
    const stories: any[] = await prisma.$queryRaw`
      SELECT id, title, "cefrLevel", "pagesJson", "quizJson"
      FROM bilingual_stories
      WHERE "quizJson" IS NOT NULL AND "quizJson" != '[]'
      ORDER BY RANDOM() LIMIT 2;
    `;

    if (stories.length >= 2) {
      // Passage 1: 3 questions
      const s1 = stories[0];
      let p1Pages: any[] = [];
      let p1Quiz: any[] = [];
      try {
        p1Pages = JSON.parse(s1.pagesJson);
        p1Quiz = JSON.parse(s1.quizJson);
      } catch {}
      const passage1Text = p1Pages.map((p: any) => p.en || p.textEn || '').join(' ');

      for (let i = 0; i < Math.min(3, p1Quiz.length); i++) {
        const q = p1Quiz[i];
        questions.push({
          id: `story-${s1.id}-q${i + 1}`,
          section: 'reading',
          cefrLevel: s1.cefrLevel,
          passageTitle: s1.title,
          passage: passage1Text,
          question: q.question,
          options: q.options || [],
        });
      }

      // Passage 2: 2 questions
      const s2 = stories[1];
      let p2Pages: any[] = [];
      let p2Quiz: any[] = [];
      try {
        p2Pages = JSON.parse(s2.pagesJson);
        p2Quiz = JSON.parse(s2.quizJson);
      } catch {}
      const passage2Text = p2Pages.map((p: any) => p.en || p.textEn || '').join(' ');

      for (let i = 0; i < Math.min(2, p2Quiz.length); i++) {
        const q = p2Quiz[i];
        questions.push({
          id: `story-${s2.id}-q${i + 1}`,
          section: 'reading',
          cefrLevel: s2.cefrLevel,
          passageTitle: s2.title,
          passage: passage2Text,
          question: q.question,
          options: q.options || [],
        });
      }
    }

    // 4. LISTENING (5 questions from Cambridge 11 Test 1 Section 4 monologue)
    const listeningSection = await prisma.ieltsListeningSection.findUnique({
      where: { id: 'cam11-academic-t1-l4' },
    });
    if (listeningSection && listeningSection.questionsJson) {
      let lQuestions: any[] = [];
      try {
        lQuestions = JSON.parse(listeningSection.questionsJson);
      } catch {}

      const listeningDistractors = [
        ['conservation', 'tourism', 'commercial fishing', 'industrialization'],
        ['food', 'minerals', 'coral species', 'deep trenches'],
        ['surface', 'seabed', 'coastal shore', 'ocean trenches'],
        ['oxygen', 'carbon dioxide', 'salt minerals', 'nitrogen'],
        ['mammals', 'birds', 'microorganisms', 'reptiles'],
      ];

      for (let i = 0; i < Math.min(5, lQuestions.length); i++) {
        const lq = lQuestions[i];
        const opts = [...listeningDistractors[i]];
        opts.sort(() => Math.random() - 0.5);
        questions.push({
          id: `list-cam11-t1-l4-q${i + 1}`,
          section: 'listening',
          cefrLevel: 'B2',
          question: `[Nghe bài giảng] ${lq.question}`,
          options: opts,
          audioUrl: '/audio/placement/cam11_t1_s4_ocean_biodiversity.mp3',
          sourceRef: lq.sourceRef || 'Cambridge IELTS 11, Test 1, Listening Section 4',
        });
      }
    }

    return res.json({
      totalQuestions: questions.length,
      estimatedMinutes: 20,
      listeningNote: LISTENING_NOTE,
      questions,
    });
  } catch (error: any) {
    console.error('Error drawing placement questions:', error);
    return res.status(500).json({ error: 'Không thể tạo bộ đề bài kiểm tra.' });
  }
});

/**
 * POST /api/v1/placement/submit
 * Server-side grading of placement test:
 * - 100% server verified against DB records
 * - Rule: level = highest level with accuracy >= 60% and >= 5 questions taken (determined by Grammar + Vocab)
 * - Listening score tracked and factored into bandEstimate
 * - 3 weakest grammar topics (from the 50 theory topics)
 * - Save PlacementAttempt and update User.cefrLevel
 */
placementRouter.post('/submit', async (req: Request, res: Response) => {
  try {
    const userId = resolveAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Yêu cầu đăng nhập để nộp bài kiểm tra.' });
    }

    const { answers, questionIds, audioPlayCount } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Dữ liệu câu trả lời không hợp lệ.' });
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Người dùng không tồn tại hoặc chưa đăng nhập hợp lệ.' });
    }

    // Track statistics
    const levelStats: Record<string, { correct: number; total: number }> = {
      A1: { correct: 0, total: 0 },
      A2: { correct: 0, total: 0 },
      B1: { correct: 0, total: 0 },
      B2: { correct: 0, total: 0 },
    };

    const sectionStats: Record<string, { correct: number; total: number; audioPlayCount?: number }> = {
      grammar: { correct: 0, total: 0 },
      vocab: { correct: 0, total: 0 },
      reading: { correct: 0, total: 0 },
      listening: { correct: 0, total: 0, audioPlayCount: Number(audioPlayCount) || 1 },
    };

    const grammarMistakesByTopic: Record<string, number> = {};
    const questionList: string[] = Array.isArray(questionIds) && questionIds.length > 0
      ? questionIds
      : Object.keys(answers);

    // Read listening answers from DB (ielts_listening_sections cam11-academic-t1-l4)
    let dbListeningQuestions: any[] = [];
    const listeningRecord = await prisma.ieltsListeningSection.findUnique({
      where: { id: 'cam11-academic-t1-l4' },
    });
    if (listeningRecord && listeningRecord.questionsJson) {
      try {
        dbListeningQuestions = JSON.parse(listeningRecord.questionsJson);
      } catch (err) {
        console.error('Failed to parse listening questionsJson:', err);
      }
    }

    // Grade each question from DB
    for (const qId of questionList) {
      const userAns = (answers[qId] || '').trim().toLowerCase();

      if (qId.startsWith('list-cam11-t1-l4-q')) {
        const qIndex = parseInt(qId.replace('list-cam11-t1-l4-q', ''), 10) - 1;
        const targetQ = dbListeningQuestions[qIndex];
        const rawExpected = (targetQ && targetQ.correctAnswer) ? String(targetQ.correctAnswer) : '';
        const acceptableAnswers = rawExpected
          .split('/')
          .map((a: string) => a.trim().toLowerCase())
          .filter(Boolean);
        const isCorrect = acceptableAnswers.includes(userAns) ||
          (acceptableAnswers.includes('food') && userAns === 'foods') ||
          (acceptableAnswers.includes('oxygen') && userAns === 'o2');
        sectionStats.listening.total += 1;
        if (isCorrect) sectionStats.listening.correct += 1;
      } else if (qId.startsWith('colloc-')) {
        const rawId = qId.replace('colloc-', '');
        const record = await prisma.collocation.findUnique({ where: { id: rawId } });
        if (record) {
          const isCorrect = userAns === record.meaningVi.trim().toLowerCase();
          const lvl = record.cefrLevel || 'A2';
          if (levelStats[lvl]) {
            levelStats[lvl].total += 1;
            if (isCorrect) levelStats[lvl].correct += 1;
          }
          sectionStats.vocab.total += 1;
          if (isCorrect) sectionStats.vocab.correct += 1;
        }
      } else if (qId.startsWith('idiom-')) {
        const rawId = qId.replace('idiom-', '');
        const record = await prisma.idiom.findUnique({ where: { id: rawId } });
        if (record && record.meaningEn) {
          const isCorrect = userAns === record.meaningEn.trim().toLowerCase();
          const lvl = record.cefrLevel || 'B2';
          if (levelStats[lvl]) {
            levelStats[lvl].total += 1;
            if (isCorrect) levelStats[lvl].correct += 1;
          }
          sectionStats.vocab.total += 1;
          if (isCorrect) sectionStats.vocab.correct += 1;
        }
      } else if (qId.startsWith('story-')) {
        const parts = qId.split('-');
        const storyId = parts.slice(1, -1).join('-');
        const qIdxStr = parts[parts.length - 1].replace('q', '');
        const qIdx = parseInt(qIdxStr, 10) - 1;

        const record = await prisma.bilingualStory.findUnique({ where: { id: storyId } });
        if (record && record.quizJson) {
          let quiz: any[] = [];
          try {
            quiz = JSON.parse(record.quizJson);
          } catch {}
          if (quiz[qIdx]) {
            const isCorrect = userAns === (quiz[qIdx].correctAnswer || '').trim().toLowerCase();
            // Reading questions do NOT factor into CEFR level determination (levelStats)
            sectionStats.reading.total += 1;
            if (isCorrect) sectionStats.reading.correct += 1;
          }
        }
      } else {
        // GrammarQuestion by ID
        const record = await prisma.grammarQuestion.findUnique({ where: { id: qId } });
        if (record) {
          const isCorrect = userAns === (record.correctAnswer ? record.correctAnswer.trim().toLowerCase() : '');
          const lvl = record.cefrLevel || 'A2';
          if (levelStats[lvl]) {
            levelStats[lvl].total += 1;
            if (isCorrect) levelStats[lvl].correct += 1;
          }
          sectionStats.grammar.total += 1;
          if (isCorrect) {
            sectionStats.grammar.correct += 1;
          } else if (record.topic) {
            grammarMistakesByTopic[record.topic] = (grammarMistakesByTopic[record.topic] || 0) + 1;
          }
        }
      }
    }

    // Determine level: highest level with accuracy >= 60% and total questions >= 5 (based on Grammar + Vocab)
    let determinedLevel = 'A1';
    for (const lvl of ['B2', 'B1', 'A2']) {
      const stat = levelStats[lvl];
      if (stat && stat.total >= 5) {
        const accuracy = (stat.correct / stat.total) * 100;
        if (accuracy >= 60.0) {
          determinedLevel = lvl;
          break;
        }
      }
    }

    let bandEstimate = BAND_ESTIMATES[determinedLevel] || '2.0 - 3.0';
    // Incorporate listening into band estimate precision if listening completed
    if (sectionStats.listening.total > 0) {
      const listenAcc = (sectionStats.listening.correct / sectionStats.listening.total) * 100;
      if (determinedLevel === 'B2') {
        if (listenAcc >= 80) {
          determinedLevel = 'B2+';
          bandEstimate = BAND_ESTIMATES['B2+'] || '~7.0';
        } else if (listenAcc < 40) {
          bandEstimate = '5.5 - 6.0';
        } else {
          bandEstimate = '6.0 - 6.5';
        }
      } else if (determinedLevel === 'B1') {
        if (listenAcc >= 80) {
          bandEstimate = '5.5';
        } else if (listenAcc < 40) {
          bandEstimate = '5.0';
        } else {
          bandEstimate = '5.0 - 5.5';
        }
      }
    }

    // Identify 3 weakest grammar topics (filter against the 50 theory topics in grammar_explanations)
    const validTheoryTopics = await prisma.grammarExplanation.findMany({
      select: { topic: true },
      distinct: ['topic'],
    });
    const validTopicSet = new Set(validTheoryTopics.map((t) => t.topic));

    const sortedMistakes = Object.entries(grammarMistakesByTopic)
      .filter(([topic]) => validTopicSet.has(topic))
      .sort((a, b) => b[1] - a[1]);

    let weakTopics = sortedMistakes.slice(0, 3).map(([topic]) => topic);
    if (weakTopics.length < 3) {
      const fallbackTopics = validTheoryTopics
        .map((t) => t.topic)
        .filter((t) => !weakTopics.includes(t));
      weakTopics = [...weakTopics, ...fallbackTopics.slice(0, 3 - weakTopics.length)];
    }

    const totalQuestionsCount =
      sectionStats.grammar.total +
      sectionStats.vocab.total +
      sectionStats.reading.total +
      sectionStats.listening.total;
    const totalCorrectCount =
      sectionStats.grammar.correct +
      sectionStats.vocab.correct +
      sectionStats.reading.correct +
      sectionStats.listening.correct;

    const overallScores = {
      ...sectionStats,
      total: {
        correct: totalCorrectCount,
        total: totalQuestionsCount,
        percentage: totalQuestionsCount > 0 ? Math.round((totalCorrectCount / totalQuestionsCount) * 100) : 0,
      },
      levelStats,
    };

    // Save PlacementAttempt
    const attempt = await prisma.placementAttempt.create({
      data: {
        userId,
        level: determinedLevel,
        bandEstimate,
        sectionScoresJson: JSON.stringify(overallScores),
        answersJson: JSON.stringify(answers),
        questionIdsJson: JSON.stringify(questionList),
      },
    });

    // Update User.cefrLevel
    await prisma.user.update({
      where: { id: userId },
      data: { cefrLevel: determinedLevel },
    });

    return res.json({
      attemptId: attempt.id,
      takenAt: attempt.takenAt,
      level: determinedLevel,
      bandEstimate,
      sectionScores: overallScores,
      weakTopics,
      listeningNote: LISTENING_NOTE,
      disclaimer: PLACEMENT_DISCLAIMER,
    });
  } catch (error: any) {
    console.error('Error submitting placement test:', error);
    return res.status(500).json({ error: 'Không thể chấm điểm và lưu kết quả bài kiểm tra.' });
  }
});
