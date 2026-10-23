import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { placementRouter, BAND_ESTIMATES, PLACEMENT_DISCLAIMER } from '../src/routes/placement.js';
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

test('Placement API - GET /questions returns 25 questions with ladder and no answers revealed', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/placement/questions`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.totalQuestions, 25);
    assert.equal(data.questions.length, 25);

    const grammarQs = data.questions.filter((q: any) => q.section === 'grammar');
    const vocabQs = data.questions.filter((q: any) => q.section === 'vocab');
    const readingQs = data.questions.filter((q: any) => q.section === 'reading');

    assert.equal(grammarQs.length, 12, 'Must have 12 grammar questions');
    assert.equal(vocabQs.length, 8, 'Must have 8 vocab & collocation questions');
    assert.equal(readingQs.length, 5, 'Must have 5 reading questions');

    // Verify no answer revealed and each question has 4 options
    for (const q of data.questions) {
      assert.ok(q.id, 'Question missing id');
      assert.ok(q.question, 'Question missing stem text');
      assert.equal((q as any).correctAnswer, undefined, 'Must NOT reveal correctAnswer');
      assert.equal(q.options.length, 4, `Question ${q.id} must have exactly 4 options`);
    }

    // Verify ladder presence
    const gLevels = grammarQs.map((q: any) => q.cefrLevel);
    assert.ok(gLevels.includes('A1'), 'Grammar must include A1');
    assert.ok(gLevels.includes('A2'), 'Grammar must include A2');
    assert.ok(gLevels.includes('B1'), 'Grammar must include B1');
    assert.ok(gLevels.includes('B2'), 'Grammar must include B2');
  } finally {
    server.close();
  }
});

test('Placement API - POST /submit grades accurately for 3 profiles (Kha -> B2, Trung Binh -> B1, Yeu -> A2)', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    // 1. Fetch 25 questions
    const qRes = await fetch(`http://localhost:${port}/api/v1/placement/questions`);
    const qData = await qRes.json();
    const questions: any[] = qData.questions;

    // Helper to fetch actual correct answers from DB
    const correctAnswersMap: Record<string, string> = {};
    for (const q of questions) {
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

    // --- Profile 1: Khá (B2 accuracy >= 60%) ---
    const answersKha: Record<string, string> = {};
    for (const q of questions) {
      // 100% correct across all questions
      answersKha[q.id] = correctAnswersMap[q.id];
    }
    const subKhaRes = await fetch(`http://localhost:${port}/api/v1/placement/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answersKha, questionIds: questions.map((q) => q.id) }),
    });
    assert.equal(subKhaRes.status, 200);
    const subKha = await subKhaRes.json();
    assert.equal(subKha.level, 'B2', 'Profile Khá must achieve B2');
    assert.equal(subKha.bandEstimate, '5.5 - 6.5', 'B2 must map to band 5.5 - 6.5');
    assert.equal(subKha.disclaimer, PLACEMENT_DISCLAIMER);
    assert.ok(subKha.weakTopics.length > 0, 'Must return weakest topics');

    // --- Profile 2: Trung bình (B2 fails < 60%, B1 accuracy >= 60%) ---
    const answersTB: Record<string, string> = {};
    for (const q of questions) {
      if (q.cefrLevel === 'B2') {
        // Intentionally answer wrong for B2
        answersTB[q.id] = 'INCORRECT_CHOICE_XYZ';
      } else {
        answersTB[q.id] = correctAnswersMap[q.id];
      }
    }
    const subTBRes = await fetch(`http://localhost:${port}/api/v1/placement/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answersTB, questionIds: questions.map((q) => q.id) }),
    });
    assert.equal(subTBRes.status, 200);
    const subTB = await subTBRes.json();
    assert.equal(subTB.level, 'B1', 'Profile Trung bình must achieve B1');
    assert.equal(subTB.bandEstimate, '4.5 - 5.0', 'B1 must map to band 4.5 - 5.0');

    // --- Profile 3: Yếu (B2 & B1 fail < 60%, A2 accuracy >= 60%) ---
    const answersYeu: Record<string, string> = {};
    for (const q of questions) {
      if (q.cefrLevel === 'B2' || q.cefrLevel === 'B1') {
        answersYeu[q.id] = 'INCORRECT_CHOICE_XYZ';
      } else {
        answersYeu[q.id] = correctAnswersMap[q.id];
      }
    }
    const subYeuRes = await fetch(`http://localhost:${port}/api/v1/placement/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answersYeu, questionIds: questions.map((q) => q.id) }),
    });
    assert.equal(subYeuRes.status, 200);
    const subYeu = await subYeuRes.json();
    assert.equal(subYeu.level, 'A2', 'Profile Yếu must achieve A2');
    assert.equal(subYeu.bandEstimate, '3.5 - 4.0', 'A2 must map to band 3.5 - 4.0');

    // Verify DB persistence of PlacementAttempt & User.cefrLevel
    const latestAttempt = await prisma.placementAttempt.findFirst({
      where: { userId: 'demo-user-id-001' },
      orderBy: { takenAt: 'desc' },
    });
    assert.ok(latestAttempt, 'PlacementAttempt must be persisted in DB');
    assert.equal(latestAttempt.level, 'A2');
    assert.equal(latestAttempt.bandEstimate, '3.5 - 4.0');
    assert.ok(JSON.parse(latestAttempt.sectionScoresJson).total.total === 25);

    const user = await prisma.user.findUnique({ where: { id: 'demo-user-id-001' } });
    assert.equal(user?.cefrLevel, 'A2', 'User.cefrLevel must be updated');
  } finally {
    server.close();
  }
});

test('Placement API - GET /latest returns persisted attempt', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/placement/latest`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.attempt, 'Latest attempt must exist');
    assert.ok(data.attempt.level, 'Attempt must have level');
    assert.ok(data.attempt.bandEstimate, 'Attempt must have bandEstimate');
    assert.equal(data.attempt.disclaimer, PLACEMENT_DISCLAIMER);
  } finally {
    server.close();
  }
});
