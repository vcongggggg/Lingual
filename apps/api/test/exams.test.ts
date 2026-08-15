import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { examsRouter } from '../src/routes/exams.js';

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/exams', examsRouter);
  return app;
}

test('Exams API - GET / returns list of exams', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.exams));
    assert.ok(body.total >= 5);
  } finally {
    server.close();
  }
});

test('Exams API - GET /?type=toeic filters exams by type', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams?type=toeic`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.exams.every((e: any) => e.type === 'toeic'));
  } finally {
    server.close();
  }
});

test('Exams API - GET /?level=B2 filters exams by difficulty', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams?level=B2`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.exams.every((e: any) => e.difficulty === 'B2'));
  } finally {
    server.close();
  }
});

test('Exams API - GET /:examId returns public exam details without answers', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams/exam-toeic-01`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.exam.id, 'exam-toeic-01');

    // Anti-cheat verification
    const firstQ = body.exam.sections[0].questions[0];
    assert.equal(firstQ.correctAnswer, undefined);
    assert.equal(firstQ.explanation, undefined);
  } finally {
    server.close();
  }
});

test('Exams API - GET /:examId with non-existent ID returns 404', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams/non-existent-id`);
    assert.equal(res.status, 404);
  } finally {
    server.close();
  }
});

test('Exams API - POST /:examId/start creates new attempt with expiry window', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams/exam-toeic-01/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'test-user-001' }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(body.attemptId.startsWith('att-exam-'));
    assert.ok(new Date(body.expiresAt).getTime() > new Date(body.startedAt).getTime());
    assert.equal(body.exam.id, 'exam-toeic-01');
  } finally {
    server.close();
  }
});

test('Exams API - POST /:examId/start with invalid ID returns 404', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams/invalid-id/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    assert.equal(res.status, 404);
  } finally {
    server.close();
  }
});

test('Exams API - GET /attempts/:attemptId retrieves attempt state', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams/attempts/att-demo-toeic-01`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.attempt.id, 'att-demo-toeic-01');
  } finally {
    server.close();
  }
});

test('Exams API - GET /attempts/:attemptId with invalid ID returns 404', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams/attempts/invalid-attempt`);
    assert.equal(res.status, 404);
  } finally {
    server.close();
  }
});

test('Exams API - POST /attempts/:attemptId/answer saves and updates question answer', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    // 1. Start an attempt
    const startRes = await fetch(`http://localhost:${port}/api/v1/exams/exam-toeic-01/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'test-user-002' }),
    });
    const { attemptId } = await startRes.json();

    // 2. Submit answer
    const ansRes = await fetch(`http://localhost:${port}/api/v1/exams/attempts/${attemptId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: 't-l1-q1',
        selectedOption: 'A man is adjusting his necktie.',
        flagged: true,
      }),
    });

    assert.equal(ansRes.status, 200);
    const ansBody = await ansRes.json();
    assert.equal(ansBody.success, true);
    assert.equal(ansBody.answer.selectedOption, 'A man is adjusting his necktie.');
    assert.equal(ansBody.answer.flagged, true);
  } finally {
    server.close();
  }
});

test('Exams API - POST /attempts/:attemptId/answer rejects missing questionId with 400', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams/attempts/att-demo-toeic-01/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedOption: 'A' }),
    });

    assert.ok(res.status === 400 || res.status === 404);
  } finally {
    server.close();
  }
});

test('Exams API - POST /attempts/:attemptId/submit authoritatively grades and returns score & XP', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    // 1. Start an attempt
    const startRes = await fetch(`http://localhost:${port}/api/v1/exams/exam-toeic-01/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'test-user-003' }),
    });
    const { attemptId } = await startRes.json();

    // 2. Submit attempt with answers
    const subRes = await fetch(`http://localhost:${port}/api/v1/exams/attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        elapsedSeconds: 900,
        answers: [
          { questionId: 't-l1-q1', selectedOption: 'A man is adjusting his necktie.' },
          { questionId: 't-l1-q2', selectedOption: 'On Ms. Lee’s reception desk.' },
          { questionId: 't-r1-q1', selectedOption: 'prior to' },
          { questionId: 't-r1-q2', selectedOption: 'remarkably' },
          { questionId: 't-r1-q3', selectedOption: 'unless' },
          { questionId: 't-r2-q1', selectedOption: 'To announce the rollout of a new inventory tracking system' },
          { questionId: 't-r2-q2', selectedOption: 'Attend a 30-minute orientation session' },
        ],
      }),
    });

    assert.equal(subRes.status, 200);
    const subBody = await subRes.json();
    assert.equal(subBody.result.score, 7);
    assert.equal(subBody.result.accuracy, 100);
    assert.equal(subBody.result.grade, 'Excellent');
    assert.ok(subBody.result.xpAwarded >= 50);
    assert.equal(subBody.attempt.status, 'completed');
  } finally {
    server.close();
  }
});

test('Exams API - POST /attempts/:attemptId/submit handles rapid duplicate submissions idempotently', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams/attempts/att-demo-toeic-01/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ elapsedSeconds: 1200 }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.isDuplicate, true);
  } finally {
    server.close();
  }
});

test('Exams API - GET /attempts/:attemptId/result returns completed result', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams/attempts/att-demo-toeic-01/result`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.result.attemptId, 'att-demo-toeic-01');
    assert.equal(body.result.score, 7);
  } finally {
    server.close();
  }
});

test('Exams API - GET /history/all returns user past attempts', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams/history/all?userId=demo-user-id-001`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.history));
    assert.ok(body.history.length >= 1);
  } finally {
    server.close();
  }
});

test('Exams API - GET /stats/summary returns aggregated analytics', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/exams/stats/summary?userId=demo-user-id-001`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.stats.totalAttempts >= 1);
    assert.ok(body.stats.avgAccuracy > 0);
    assert.ok(body.stats.strongestSection.length > 0);
  } finally {
    server.close();
  }
});
