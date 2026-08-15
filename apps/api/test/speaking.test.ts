import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { speakingRouter } from '../src/routes/speaking.js';

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/speaking', speakingRouter);
  return app;
}

test('Speaking API - GET /prompts returns list of speaking prompts', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/speaking/prompts`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.prompts));
    assert.ok(body.prompts.length >= 7);
  } finally {
    server.close();
  }
});

test('Speaking API - GET /prompts with mode and difficulty filters', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    // Filter mode=pronunciation
    const resMode = await fetch(`http://localhost:${port}/api/v1/speaking/prompts?mode=pronunciation`);
    assert.equal(resMode.status, 200);
    const bodyMode = await resMode.json();
    assert.ok(bodyMode.prompts.every((p: any) => p.mode === 'pronunciation'));

    // Filter difficulty=beginner
    const resDiff = await fetch(`http://localhost:${port}/api/v1/speaking/prompts?difficulty=beginner`);
    assert.equal(resDiff.status, 200);
    const bodyDiff = await resDiff.json();
    assert.ok(bodyDiff.prompts.every((p: any) => p.difficulty === 'beginner'));

    // Filter cefr=A1
    const resCefr = await fetch(`http://localhost:${port}/api/v1/speaking/prompts?cefr=A1`);
    assert.equal(resCefr.status, 200);
    const bodyCefr = await resCefr.json();
    assert.ok(bodyCefr.prompts.every((p: any) => p.cefr === 'A1'));

    // Filter topic=travel
    const resTopic = await fetch(`http://localhost:${port}/api/v1/speaking/prompts?topic=travel`);
    assert.equal(resTopic.status, 200);
    const bodyTopic = await resTopic.json();
    assert.ok(bodyTopic.prompts.length > 0);
  } finally {
    server.close();
  }
});

test('Speaking API - GET /prompts/:id returns prompt and 404 for invalid ID', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const resValid = await fetch(`http://localhost:${port}/api/v1/speaking/prompts/sp-pron-01`);
    assert.equal(resValid.status, 200);
    const bodyValid = await resValid.json();
    assert.equal(bodyValid.prompt.id, 'sp-pron-01');

    const resInvalid = await fetch(`http://localhost:${port}/api/v1/speaking/prompts/non-existent-prompt`);
    assert.equal(resInvalid.status, 404);
  } finally {
    server.close();
  }
});

test('Speaking API - POST /analyze evaluates spoken input deterministically', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/speaking/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        promptId: 'sp-pron-01',
        transcript: 'The sheep is on the ship.',
        durationMs: 5000,
      }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.feedback.overallScore >= 80);
    assert.ok(body.feedback.pronunciationScore >= 80);
    assert.ok(body.feedback.grade);
  } finally {
    server.close();
  }
});

test('Speaking API - POST /analyze input validations (missing, non-existent, negative duration)', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    // Missing promptId
    const res1 = await fetch(`http://localhost:${port}/api/v1/speaking/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: 'Hello' }),
    });
    assert.equal(res1.status, 400);

    // Non-existent promptId
    const res2 = await fetch(`http://localhost:${port}/api/v1/speaking/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId: 'fake-id', transcript: 'Hello' }),
    });
    assert.equal(res2.status, 404);

    // Negative duration
    const res3 = await fetch(`http://localhost:${port}/api/v1/speaking/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId: 'sp-pron-01', transcript: 'Hello', durationMs: -100 }),
    });
    assert.equal(res3.status, 400);
  } finally {
    server.close();
  }
});

test('Speaking API - POST /attempts authoritatively scores and protects against client score/XP injection', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/speaking/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        promptId: 'sp-rep-01',
        transcript: 'Hello, my name is Alex and I am a software engineer.',
        durationMs: 8000,
        score: 100, // Injected score by malicious client
        xpAwarded: 999999, // Injected XP by malicious client
      }),
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(body.submissionId);
    assert.ok(body.xpAwarded > 0 && body.xpAwarded <= 50, 'Authoritative XP must be calculated server-side');
    assert.ok(body.feedback.overallScore > 0);
  } finally {
    server.close();
  }
});

test('Speaking API - POST /attempts idempotency on rapid identical submissions', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const payload = {
      promptId: 'sp-shad-01',
      transcript: 'Every morning, I wake up early, do some stretching, and drink a cup of warm water to start my day.',
      durationMs: 15000,
    };

    const res1 = await fetch(`http://localhost:${port}/api/v1/speaking/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(res1.status, 201);

    const res2 = await fetch(`http://localhost:${port}/api/v1/speaking/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(res2.status, 200);
    const body2 = await res2.json();
    assert.equal(body2.idempotentDuplicate, true);
  } finally {
    server.close();
  }
});

test('Speaking API - GET /history and GET /stats retrieves user performance metrics', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const resHist = await fetch(`http://localhost:${port}/api/v1/speaking/history`);
    assert.equal(resHist.status, 200);
    const bodyHist = await resHist.json();
    assert.ok(Array.isArray(bodyHist.attempts));

    const resStats = await fetch(`http://localhost:${port}/api/v1/speaking/stats`);
    assert.equal(resStats.status, 200);
    const bodyStats = await resStats.json();
    assert.ok(bodyStats.stats.totalAttempts >= 0);
    assert.ok(bodyStats.stats.averageScore > 0);
    assert.ok(bodyStats.stats.averagePronunciation > 0);
    assert.ok(bodyStats.stats.averageFluency > 0);
  } finally {
    server.close();
  }
});

test('Speaking API - GET /recommendations returns localized targeted suggestions', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const resVi = await fetch(`http://localhost:${port}/api/v1/speaking/recommendations?locale=vi`);
    assert.equal(resVi.status, 200);
    const bodyVi = await resVi.json();
    assert.ok(Array.isArray(bodyVi.recommendations));
    assert.ok(bodyVi.recommendations.length > 0);

    const resEn = await fetch(`http://localhost:${port}/api/v1/speaking/recommendations?locale=en`);
    assert.equal(resEn.status, 200);
    const bodyEn = await resEn.json();
    assert.ok(Array.isArray(bodyEn.recommendations));
  } finally {
    server.close();
  }
});

test('Speaking API - POST /attempts/:id/srs bridges words to SRS deck', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    // Valid SRS save
    const resValid = await fetch(`http://localhost:${port}/api/v1/speaking/attempts/sp-att-1/srs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words: ['beneficial', 'detrimental'] }),
    });
    assert.equal(resValid.status, 200);
    const bodyValid = await resValid.json();
    assert.equal(bodyValid.status, 'ok');
    assert.equal(bodyValid.savedWords.length, 2);

    // Invalid empty words
    const resInvalid = await fetch(`http://localhost:${port}/api/v1/speaking/attempts/sp-att-1/srs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words: [] }),
    });
    assert.equal(resInvalid.status, 400);
  } finally {
    server.close();
  }
});
