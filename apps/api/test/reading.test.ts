import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { readingRouter } from '../src/routes/reading.js';

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/reading', readingRouter);
  return app;
}

test('Reading API - GET /articles returns list of graded articles', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/articles`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.articles));
    assert.ok(body.total >= 10);
  } finally {
    server.close();
  }
});

test('Reading API - GET /articles?level=A1 filters articles accurately', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/articles?level=A1`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.articles.every((a: any) => a.level === 'A1'));
  } finally {
    server.close();
  }
});

test('Reading API - GET /articles/:id returns full article content', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/articles/a1-morning-coffee`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.article.id, 'a1-morning-coffee');
    assert.ok(body.article.paragraphs.length > 0);
  } finally {
    server.close();
  }
});

test('Reading API - GET /articles/:id with non-existent ID returns 404', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/articles/non-existent-article`);
    assert.equal(res.status, 404);
  } finally {
    server.close();
  }
});

test('Reading API - GET /articles/:id/questions returns questions without exposing answers', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/articles/a1-morning-coffee/questions`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.questions.length > 0);
    assert.equal(body.questions[0].correctAnswer, undefined); // Anti-cheat: never expose answer key
  } finally {
    server.close();
  }
});

test('Reading API - POST /attempts authoritatively evaluates score & XP', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: 'a1-morning-coffee',
        mode: 'standard',
        answers: [
          { questionId: 'q1-1', selectedOption: 'Different morning habits worldwide' },
          { questionId: 'q1-2', selectedOption: 'False' },
          { questionId: 'q1-3', selectedOption: 'The strength and vitality to be active' },
        ],
        elapsedSeconds: 60,
      }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(body.attempt.score >= 90);
    assert.equal(body.feedback.accuracy, 100);
    assert.ok(body.attempt.xpAwarded >= 30);
  } finally {
    server.close();
  }
});

test('Reading API - POST /attempts rejects invalid articleId with 404', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: 'unknown-art',
        answers: [],
      }),
    });

    assert.equal(res.status, 404);
  } finally {
    server.close();
  }
});

test('Reading API - POST /attempts rejects invalid mode with 400', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: 'a1-morning-coffee',
        mode: 'invalid-mode',
        answers: [],
      }),
    });

    assert.equal(res.status, 400);
  } finally {
    server.close();
  }
});

test('Reading API - GET /history returns past attempts', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/history`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.history));
  } finally {
    server.close();
  }
});

test('Reading API - GET /stats returns reading summary metrics', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/stats`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.stats.articlesCompleted >= 1);
    assert.ok(body.stats.readingMinutes >= 1);
    assert.ok(body.stats.avgComprehension > 0);
  } finally {
    server.close();
  }
});

test('Reading API - POST /progress records current reading scroll position', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: 'a1-morning-coffee',
        currentParagraph: 2,
        scrollProgress: 80,
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.progress.scrollProgress, 80);
  } finally {
    server.close();
  }
});

test('Reading API - POST /progress rejects missing articleId with 400', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    assert.equal(res.status, 400);
  } finally {
    server.close();
  }
});

test('Reading API - POST /vocabulary/save persists word into personal dictionary', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/reading/vocabulary/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        word: 'Espresso',
        meaning: 'Cà phê đậm đặc kiểu Ý',
        cefrLevel: 'A1',
        articleId: 'a1-morning-coffee',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.savedItem.word, 'Espresso');
  } finally {
    server.close();
  }
});
