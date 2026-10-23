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

    // --- Profile 1: Khá (B2 level, 5/5 Listening correct) ---
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
    assert.equal(subKha.level, 'B2', 'Profile Khá level must be B2');
    assert.equal(subKha.bandEstimate, '6.0 - 6.5', 'B2 with strong listening gets 6.0 - 6.5');
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
