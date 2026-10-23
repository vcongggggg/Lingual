import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { contentRouter } from '../src/routes/content.js';

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/content', contentRouter);
  return app;
}

test('Content API - GET /lexis-questions returns empty list when no data', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/content/lexis-questions`);
    assert.equal(res.status, 200);
    const body = await res.json() as any;
    assert.ok(Array.isArray(body.items));
    assert.equal(body.items.length, 0);
    assert.equal(body.total, 0);
  } finally {
    server.close();
  }
});

test('Content API - GET /lexis-questions with filters returns 200', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/content/lexis-questions?contentType=collocation&cefrLevel=B2&limit=10`);
    assert.equal(res.status, 200);
    const body = await res.json() as any;
    assert.ok(Array.isArray(body.items));
    assert.equal(body.items.length, 0);
    assert.equal(body.total, 0);
  } finally {
    server.close();
  }
});

test('Content API - GET /lexis-questions/:id with non-existent id returns 404', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/content/lexis-questions/lex-non-existent-12345`);
    assert.equal(res.status, 404);
    const body = await res.json() as any;
    assert.ok(body.error);
  } finally {
    server.close();
  }
});

test('Content API - GET /study-guides returns empty list when no data', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/content/study-guides`);
    assert.equal(res.status, 200);
    const body = await res.json() as any;
    assert.ok(Array.isArray(body.items));
    assert.equal(body.items.length, 0);
    assert.equal(body.total, 0);
  } finally {
    server.close();
  }
});

test('Content API - GET /study-guides with category filter returns 200', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/content/study-guides?category=band-descriptor`);
    assert.equal(res.status, 200);
    const body = await res.json() as any;
    assert.ok(Array.isArray(body.items));
    assert.equal(body.items.length, 0);
    assert.equal(body.total, 0);
  } finally {
    server.close();
  }
});

test('Content API - GET /study-guides/:id with non-existent id returns 404', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/content/study-guides/guide-non-existent-12345`);
    assert.equal(res.status, 404);
    const body = await res.json() as any;
    assert.ok(body.error);
  } finally {
    server.close();
  }
});
