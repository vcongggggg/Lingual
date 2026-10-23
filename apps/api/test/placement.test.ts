import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { placementRouter, BAND_ESTIMATES, PLACEMENT_DISCLAIMER, LISTENING_NOTE } from '../src/routes/placement.js';
import { prisma } from '../src/lib/prisma.js';

function createTestApp(userId: string = 'demo-user-id-001') {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    (req as any).user = { id: userId, role: 'STUDENT' };
    next();
  });
  app.use('/api/v1/placement', placementRouter);
  return app;
}

before(async () => {
  // 1. User fixture
  await prisma.user.upsert({
    where: { id: 'demo-user-id-001' },
    update: {},
    create: {
      id: 'demo-user-id-001',
      email: 'placement-test@linguaflow.com',
      displayName: 'Placement Learner',
      role: 'STUDENT',
    },
  });

  // 2. Grammar Question fixtures (12 required: 3 A1, 3 A2, 3 B1, 3 B2)
  const grammarFixtures = [
    { id: 'gq-fix-a1-1', cefrLevel: 'A1', question: 'I ___ a student.', options: ['am', 'is', 'are', 'be'], correct: 'am', topic: 'Present Simple' },
    { id: 'gq-fix-a1-2', cefrLevel: 'A1', question: 'She ___ two cats.', options: ['has', 'have', 'having', 'is'], correct: 'has', topic: 'Present Simple' },
    { id: 'gq-fix-a1-3', cefrLevel: 'A1', question: 'They ___ in London.', options: ['live', 'lives', 'living', 'are live'], correct: 'live', topic: 'Present Simple' },
    { id: 'gq-fix-a2-1', cefrLevel: 'A2', question: 'Yesterday, I ___ to school.', options: ['went', 'go', 'goes', 'going'], correct: 'went', topic: 'Past Simple' },
    { id: 'gq-fix-a2-2', cefrLevel: 'A2', question: 'She ___ TV last night.', options: ['watched', 'watch', 'watches', 'watching'], correct: 'watched', topic: 'Past Simple' },
    { id: 'gq-fix-a2-3', cefrLevel: 'A2', question: 'We ___ dinner at 7 PM yesterday.', options: ['ate', 'eat', 'eats', 'eating'], correct: 'ate', topic: 'Past Simple' },
    { id: 'gq-fix-b1-1', cefrLevel: 'B1', question: 'If it rains tomorrow, we ___ at home.', options: ['will stay', 'stay', 'stayed', 'would stay'], correct: 'will stay', topic: 'First Conditional' },
    { id: 'gq-fix-b1-2', cefrLevel: 'B1', question: 'I have lived here ___ 2010.', options: ['since', 'for', 'in', 'at'], correct: 'since', topic: 'Present Perfect' },
    { id: 'gq-fix-b1-3', cefrLevel: 'B1', question: 'He is interested ___ learning languages.', options: ['in', 'at', 'on', 'with'], correct: 'in', topic: 'Prepositions' },
    { id: 'gq-fix-b2-1', cefrLevel: 'B2', question: 'Had I known, I ___ differently.', options: ['would have acted', 'will act', 'acted', 'had acted'], correct: 'would have acted', topic: 'conditional inversion' },
    { id: 'gq-fix-b2-2', cefrLevel: 'B2', question: 'Seldom ___ such dedication.', options: ['have I seen', 'I have seen', 'I saw', 'did I saw'], correct: 'have I seen', topic: 'negative inversion' },
    { id: 'gq-fix-b2-3', cefrLevel: 'B2', question: 'It is essential that he ___ on time.', options: ['be', 'is', 'was', 'being'], correct: 'be', topic: 'subjunctive mood' },
  ];

  for (const g of grammarFixtures) {
    await prisma.grammarQuestion.upsert({
      where: { id: g.id },
      update: {},
      create: {
        id: g.id,
        question: g.question,
        optionsJson: JSON.stringify(g.options),
        correctAnswer: g.correct,
        cefrLevel: g.cefrLevel,
        topic: g.topic,
        topicVi: g.topic,
      },
    });
  }

  // 3. Collocation fixtures (at least 4 for each of A2, B1, B2 to supply distractors)
  const collocFixtures = [
    { id: 'col-fix-a2-1', colloc: 'make a decision', meaningVi: 'đưa ra quyết định', lvl: 'A2' },
    { id: 'col-fix-a2-2', colloc: 'take a photo', meaningVi: 'chụp ảnh', lvl: 'A2' },
    { id: 'col-fix-a2-3', colloc: 'do homework', meaningVi: 'làm bài tập', lvl: 'A2' },
    { id: 'col-fix-a2-4', colloc: 'have breakfast', meaningVi: 'ăn sáng', lvl: 'A2' },
    { id: 'col-fix-b1-1', colloc: 'catch attention', meaningVi: 'thu hút sự chú ý', lvl: 'B1' },
    { id: 'col-fix-b1-2', colloc: 'keep in touch', meaningVi: 'giữ liên lạc', lvl: 'B1' },
    { id: 'col-fix-b1-3', colloc: 'pay attention', meaningVi: 'chú ý', lvl: 'B1' },
    { id: 'col-fix-b1-4', colloc: 'break a promise', meaningVi: 'thất hứa', lvl: 'B1' },
    { id: 'col-fix-b2-1', colloc: 'cast doubt on', meaningVi: 'gieo rắc nghi ngờ', lvl: 'B2' },
    { id: 'col-fix-b2-2', colloc: 'pose a threat', meaningVi: 'gây ra mối đe dọa', lvl: 'B2' },
    { id: 'col-fix-b2-3', colloc: 'shed light on', meaningVi: 'làm sáng tỏ', lvl: 'B2' },
    { id: 'col-fix-b2-4', colloc: 'pave the way', meaningVi: 'mở đường cho', lvl: 'B2' },
  ];

  for (const c of collocFixtures) {
    await prisma.collocation.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        collocation: c.colloc,
        meaningVi: c.meaningVi,
        cefrLevel: c.lvl,
      },
    });
  }

  // 4. Idiom fixtures (at least 4 B2 with valid meaningEn to supply distractors)
  const idiomFixtures = [
    { id: 'idm-fix-b2-1', idiom: 'bite the bullet', meaningVi: 'cắn răng chịu đựng', meaningEn: 'face a difficult situation with courage' },
    { id: 'idm-fix-b2-2', idiom: 'break the ice', meaningVi: 'phá vỡ sự ngại ngùng', meaningEn: 'make people feel more comfortable' },
    { id: 'idm-fix-b2-3', idiom: 'burn the midnight oil', meaningVi: 'thức khuya học/làm việc', meaningEn: 'work late into the night' },
    { id: 'idm-fix-b2-4', idiom: 'hit the nail on the head', meaningVi: 'nói trúng phóc', meaningEn: 'describe exactly what is causing a situation' },
  ];

  for (const i of idiomFixtures) {
    await prisma.idiom.upsert({
      where: { id: i.id },
      update: {},
      create: {
        id: i.id,
        idiom: i.idiom,
        meaningVi: i.meaningVi,
        meaningEn: i.meaningEn,
        cefrLevel: 'B2',
      },
    });
  }

  // 5. Bilingual Story fixtures (2 stories: story 1 with 3 questions, story 2 with 2 questions)
  const storyFixtures = [
    {
      id: 'story-fix-1',
      title: 'The Forest Journey',
      cefrLevel: 'A2',
      pages: [{ order: 1, en: 'Once upon a time, a young traveler entered a magical green forest.' }],
      quiz: [
        { question: 'Where did the traveler go?', options: ['Forest', 'Desert', 'City', 'Ocean'], correctAnswer: 'Forest' },
        { question: 'What color was the forest?', options: ['Green', 'Red', 'Blue', 'Yellow'], correctAnswer: 'Green' },
        { question: 'Who was the traveler?', options: ['Young traveler', 'Old king', 'Merchant', 'Sailor'], correctAnswer: 'Young traveler' },
      ],
    },
    {
      id: 'story-fix-2',
      title: 'The Mountain Echo',
      cefrLevel: 'B1',
      pages: [{ order: 1, en: 'High up in the mountains, the wind whispered ancient secrets.' }],
      quiz: [
        { question: 'Where did the story take place?', options: ['In the mountains', 'On the beach', 'Underground', 'In space'], correctAnswer: 'In the mountains' },
        { question: 'What whispered secrets?', options: ['The wind', 'The trees', 'The birds', 'The stones'], correctAnswer: 'The wind' },
        { question: 'What kind of secrets were they?', options: ['Ancient secrets', 'Modern news', 'Future plans', 'Funny jokes'], correctAnswer: 'Ancient secrets' },
      ],
    },
  ];

  for (const s of storyFixtures) {
    await prisma.bilingualStory.upsert({
      where: { id: s.id },
      update: {
        pagesJson: JSON.stringify(s.pages),
        quizJson: JSON.stringify(s.quiz),
      },
      create: {
        id: s.id,
        title: s.title,
        cefrLevel: s.cefrLevel,
        pagesJson: JSON.stringify(s.pages),
        quizJson: JSON.stringify(s.quiz),
      },
    });
  }

  // 6. IELTS Listening Section fixture (cam11-academic-t1-l4 with 5 questions)
  const listeningQuestions = [
    { questionNumber: 31, question: 'Biodiversity hotspots: important for locating targets for 31 ....................', options: [], correctAnswer: 'conservation', sourceRef: 'Cambridge IELTS 11, Test 1, Listening Question 31' },
    { questionNumber: 32, question: 'found that ocean hotspots: were not always rich in 32 ....................', options: [], correctAnswer: 'food', sourceRef: 'Cambridge IELTS 11, Test 1, Listening Question 32' },
    { questionNumber: 33, question: 'had higher temperatures at the 33 ....................', options: [], correctAnswer: 'surface', sourceRef: 'Cambridge IELTS 11, Test 1, Listening Question 33' },
    { questionNumber: 34, question: 'had sufficient 34 .................... in the water', options: [], correctAnswer: 'oxygen', sourceRef: 'Cambridge IELTS 11, Test 1, Listening Question 34' },
    { questionNumber: 35, question: 'Lisa Ballance, 2007: looked for hotspots for marine 35 ....................', options: [], correctAnswer: 'mammals', sourceRef: 'Cambridge IELTS 11, Test 1, Listening Question 35' },
  ];

  await prisma.ieltsListeningSection.upsert({
    where: { id: 'cam11-academic-t1-l4' },
    update: {},
    create: {
      id: 'cam11-academic-t1-l4',
      section: 'listening',
      cefrLevel: 'B2',
      difficultyBand: '6.5',
      title: 'Ocean Biodiversity',
      questionsJson: JSON.stringify(listeningQuestions),
    },
  });
});

test('Placement API P0.5 - GET /questions returns 30 questions with 4 sections including Listening', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/placement/questions`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.totalQuestions, 30);
    assert.equal(data.questions.length, 30);
    assert.equal(data.listeningNote, LISTENING_NOTE);

    const grammarQs = data.questions.filter((q: any) => q.section === 'grammar');
    const vocabQs = data.questions.filter((q: any) => q.section === 'vocab');
    const readingQs = data.questions.filter((q: any) => q.section === 'reading');
    const listeningQs = data.questions.filter((q: any) => q.section === 'listening');

    assert.equal(grammarQs.length, 12, 'Must have 12 grammar questions');
    assert.equal(vocabQs.length, 8, 'Must have 8 vocab & collocation questions');
    assert.equal(readingQs.length, 5, 'Must have 5 reading questions');
    assert.equal(listeningQs.length, 5, 'Must have 5 listening questions');

    // Verify 5/5 Listening questions trace back to cam11-academic-t1-l4
    for (let i = 0; i < 5; i++) {
      const lq = listeningQs[i];
      assert.equal(lq.id, `list-cam11-t1-l4-q${i + 1}`);
      assert.equal(lq.audioUrl, '/audio/placement/cam11_t1_s4_ocean_biodiversity.mp3');
      assert.ok(lq.sourceRef.includes('Cambridge IELTS 11'), 'Must reference Cambridge IELTS 11');
      assert.equal(lq.options.length, 4, 'Must have 4 options');
    }

    // Verify no answer revealed across all 30 questions
    for (const q of data.questions) {
      assert.ok(q.id, 'Question missing id');
      assert.ok(q.question, 'Question missing stem text');
      assert.equal((q as any).correctAnswer, undefined, 'Must NOT reveal correctAnswer');
      assert.equal(q.options.length, 4, `Question ${q.id} must have exactly 4 options`);
    }
  } finally {
    server.close();
  }
});

test('Placement API P0.5 - POST /submit grades 30 questions for 3 profiles with Listening factored', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const qRes = await fetch(`http://localhost:${port}/api/v1/placement/questions`);
    const qData = await qRes.json();
    const questions: any[] = qData.questions;
    assert.equal(questions.length, 30);

    const correctAnswersMap: Record<string, string> = {
      'list-cam11-t1-l4-q1': 'conservation',
      'list-cam11-t1-l4-q2': 'food',
      'list-cam11-t1-l4-q3': 'surface',
      'list-cam11-t1-l4-q4': 'oxygen',
      'list-cam11-t1-l4-q5': 'mammals',
    };

    for (const q of questions) {
      if (q.id.startsWith('list-')) continue;
      if (q.id.startsWith('colloc-')) {
        const item = await prisma.collocation.findUnique({ where: { id: q.id.replace('colloc-', '') } });
        correctAnswersMap[q.id] = item?.meaningVi || '';
      } else if (q.id.startsWith('idiom-')) {
        const item = await prisma.idiom.findUnique({ where: { id: q.id.replace('idiom-', '') } });
        correctAnswersMap[q.id] = item?.meaningEn || '';
      } else if (q.id.startsWith('story-')) {
        const parts = q.id.split('-');
        const storyId = parts.slice(1, -1).join('-');
        const qIdx = parseInt(parts[parts.length - 1].replace('q', ''), 10) - 1;
        const item = await prisma.bilingualStory.findUnique({ where: { id: storyId } });
        const quiz = JSON.parse(item?.quizJson || '[]');
        correctAnswersMap[q.id] = quiz[qIdx]?.correctAnswer || '';
      } else {
        const item = await prisma.grammarQuestion.findUnique({ where: { id: q.id } });
        correctAnswersMap[q.id] = item?.correctAnswer || '';
      }
    }

    // --- Profile 1: Khá (B2 level, 5/5 Listening correct -> tier B2+) ---
    const answersKha: Record<string, string> = {};
    for (const q of questions) {
      answersKha[q.id] = correctAnswersMap[q.id];
    }
    const subKhaRes = await fetch(`http://localhost:${port}/api/v1/placement/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answersKha, questionIds: questions.map((q) => q.id), audioPlayCount: 2 }),
    });
    assert.equal(subKhaRes.status, 200);
    const subKha = await subKhaRes.json();
    assert.equal(subKha.level, 'B2+', 'Profile Khá with strong listening achieves tier B2+');
    assert.equal(subKha.bandEstimate, '~7.0', 'B2 with strong listening gets ~7.0');
    assert.equal(subKha.sectionScores.listening.correct, 5);
    assert.equal(subKha.sectionScores.listening.total, 5);
    assert.equal(subKha.sectionScores.listening.audioPlayCount, 2);
    assert.equal(subKha.sectionScores.total.total, 30);
    assert.equal(subKha.listeningNote, LISTENING_NOTE);
    assert.equal(subKha.disclaimer, PLACEMENT_DISCLAIMER);

    // --- Profile 2: Trung bình (B1 level, 3/5 Listening correct) ---
    const answersTB: Record<string, string> = {};
    for (const q of questions) {
      if (q.id.startsWith('list-')) {
        answersTB[q.id] = (q.id === 'list-cam11-t1-l4-q4' || q.id === 'list-cam11-t1-l4-q5')
          ? 'WRONG_SELECTION'
          : correctAnswersMap[q.id];
      } else if (q.cefrLevel === 'B2') {
        answersTB[q.id] = 'WRONG_SELECTION';
      } else {
        answersTB[q.id] = correctAnswersMap[q.id];
      }
    }
    const subTBRes = await fetch(`http://localhost:${port}/api/v1/placement/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answersTB, questionIds: questions.map((q) => q.id), audioPlayCount: 1 }),
    });
    assert.equal(subTBRes.status, 200);
    const subTB = await subTBRes.json();
    assert.equal(subTB.level, 'B1', 'Profile Trung bình level must be B1');
    assert.equal(subTB.bandEstimate, '5.0 - 5.5', 'B1 must map to band 5.0 - 5.5');
    assert.equal(subTB.sectionScores.listening.correct, 3);
    assert.equal(subTB.sectionScores.listening.total, 5);

    // --- Profile 3: Yếu (A2 level, 1/5 Listening correct) ---
    const answersYeu: Record<string, string> = {};
    for (const q of questions) {
      if (q.id === 'list-cam11-t1-l4-q1') {
        answersYeu[q.id] = correctAnswersMap[q.id];
      } else if (q.id.startsWith('list-')) {
        answersYeu[q.id] = 'WRONG_SELECTION';
      } else if (q.cefrLevel === 'B2' || q.cefrLevel === 'B1') {
        answersYeu[q.id] = 'WRONG_SELECTION';
      } else {
        answersYeu[q.id] = correctAnswersMap[q.id];
      }
    }
    const subYeuRes = await fetch(`http://localhost:${port}/api/v1/placement/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answersYeu, questionIds: questions.map((q) => q.id), audioPlayCount: 3 }),
    });
    assert.equal(subYeuRes.status, 200);
    const subYeu = await subYeuRes.json();
    assert.equal(subYeu.level, 'A2', 'Profile Yếu level must be A2');
    assert.equal(subYeu.bandEstimate, '3.5 - 4.0', 'A2 must map to band 3.5 - 4.0');
    assert.equal(subYeu.sectionScores.listening.correct, 1);
    assert.equal(subYeu.sectionScores.listening.total, 5);
    assert.equal(subYeu.sectionScores.listening.audioPlayCount, 3);

    // Verify DB record
    const latest = await prisma.placementAttempt.findFirst({
      where: { userId: 'demo-user-id-001' },
      orderBy: { takenAt: 'desc' },
    });
    assert.ok(latest);
    const savedScores = JSON.parse(latest.sectionScoresJson);
    assert.ok(savedScores.listening, 'sectionScoresJson must include listening');
    assert.equal(savedScores.total.total, 30);
  } finally {
    server.close();
  }
});

test('Placement API - band table conforms strictly to spec (B1 5.0 - 5.5, B2 6.0 - 6.5, B2+ ~7.0)', () => {
  assert.equal(BAND_ESTIMATES.A1, '2.0 - 3.0');
  assert.equal(BAND_ESTIMATES.A2, '3.5 - 4.0');
  assert.equal(BAND_ESTIMATES.B1, '5.0 - 5.5');
  assert.equal(BAND_ESTIMATES.B2, '6.0 - 6.5');
  assert.equal(BAND_ESTIMATES['B2+'], '~7.0');
});

test('Placement API - Reading questions do not affect CEFR level determination', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const qRes = await fetch(`http://localhost:${port}/api/v1/placement/questions`);
    const qData = await qRes.json();
    const questions: any[] = qData.questions;

    const correctMap: Record<string, string> = {
      'list-cam11-t1-l4-q1': 'conservation',
      'list-cam11-t1-l4-q2': 'food',
      'list-cam11-t1-l4-q3': 'surface',
      'list-cam11-t1-l4-q4': 'oxygen',
      'list-cam11-t1-l4-q5': 'mammals',
    };
    for (const q of questions) {
      if (q.id.startsWith('list-')) continue;
      if (q.id.startsWith('colloc-')) {
        const item = await prisma.collocation.findUnique({ where: { id: q.id.replace('colloc-', '') } });
        correctMap[q.id] = item?.meaningVi || '';
      } else if (q.id.startsWith('idiom-')) {
        const item = await prisma.idiom.findUnique({ where: { id: q.id.replace('idiom-', '') } });
        correctMap[q.id] = item?.meaningEn || '';
      } else if (q.id.startsWith('story-')) {
        const parts = q.id.split('-');
        const storyId = parts.slice(1, -1).join('-');
        const qIdx = parseInt(parts[parts.length - 1].replace('q', ''), 10) - 1;
        const item = await prisma.bilingualStory.findUnique({ where: { id: storyId } });
        const quiz = JSON.parse(item?.quizJson || '[]');
        correctMap[q.id] = quiz[qIdx]?.correctAnswer || '';
      } else {
        const item = await prisma.grammarQuestion.findUnique({ where: { id: q.id } });
        correctMap[q.id] = item?.correctAnswer || '';
      }
    }

    // Run A: Answer 100% reading correctly, B1 for grammar/vocab
    const ansAllReading: Record<string, string> = {};
    for (const q of questions) {
      if (q.section === 'reading') {
        ansAllReading[q.id] = correctMap[q.id];
      } else if (q.cefrLevel === 'B2') {
        ansAllReading[q.id] = 'WRONG';
      } else {
        ansAllReading[q.id] = correctMap[q.id];
      }
    }
    const resA = await fetch(`http://localhost:${port}/api/v1/placement/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: ansAllReading, questionIds: questions.map((q) => q.id), audioPlayCount: 1 }),
    });
    const dataA = await resA.json();

    // Run B: Answer 0% reading correctly, same B1 for grammar/vocab
    const ansNoReading: Record<string, string> = { ...ansAllReading };
    for (const q of questions) {
      if (q.section === 'reading') {
        ansNoReading[q.id] = 'DEFINITELY_WRONG_ANSWER';
      }
    }
    const resB = await fetch(`http://localhost:${port}/api/v1/placement/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: ansNoReading, questionIds: questions.map((q) => q.id), audioPlayCount: 1 }),
    });
    const dataB = await resB.json();

    // Both MUST result in CEFR level B1 (reading accuracy 100% vs 0% has ZERO effect on CEFR level)
    assert.equal(dataA.level, 'B1');
    assert.equal(dataB.level, 'B1');
    assert.equal(dataA.sectionScores.reading.correct, 5);
    assert.equal(dataB.sectionScores.reading.correct, 0);
  } finally {
    server.close();
  }
});

test('Placement API - returns 401 Unauthorized when missing authentication', async () => {
  const unauthApp = express();
  unauthApp.use(express.json());
  unauthApp.use('/api/v1/placement', placementRouter);

  const server = unauthApp.listen(0);
  const port = (server.address() as any).port;

  const originalEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';

    // 1. GET /questions without auth header -> 401
    const qRes = await fetch(`http://localhost:${port}/api/v1/placement/questions`);
    assert.equal(qRes.status, 401);

    // 2. POST /submit without auth header -> 401
    const sRes = await fetch(`http://localhost:${port}/api/v1/placement/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: {} }),
    });
    assert.equal(sRes.status, 401);

    // 3. GET /latest without auth header -> 401
    const lRes = await fetch(`http://localhost:${port}/api/v1/placement/latest`);
    assert.equal(lRes.status, 401);
  } finally {
    process.env.NODE_ENV = originalEnv;
    server.close();
  }
});

