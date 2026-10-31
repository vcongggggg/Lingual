import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { studyTemplateRouter } from '../src/routes/studyTemplates.js';

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/study-templates', studyTemplateRouter);
  return app;
}

test('Study Templates API - GET / returns list and total >= 30', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/study-templates`);
    assert.equal(res.status, 200);
    const body = (await res.json()) as any;
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.total >= 30);
    assert.equal(body.data.length, 30);
  } finally {
    server.close();
  }
});

test('Study Templates API - GET / with filter type=flashcard returns 1 item', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/study-templates?type=flashcard`);
    assert.equal(res.status, 200);
    const body = (await res.json()) as any;
    assert.equal(body.success, true);
    assert.equal(body.data.length, 1);
    assert.equal(body.data[0].type, 'flashcard');
    assert.equal(body.data[0].titleEn, 'Flashcards');
  } finally {
    server.close();
  }
});

test('Study Templates API - GET /:id returns template by ID', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/study-templates/tpl-003-001`);
    assert.equal(res.status, 200);
    const body = (await res.json()) as any;
    assert.equal(body.success, true);
    assert.equal(body.data.id, 'tpl-003-001');
    assert.equal(body.data.type, 'flashcard');
    assert.ok(body.data.structure);
    assert.ok(Array.isArray(body.data.structure.steps));
  } finally {
    server.close();
  }
});

test('Study Templates API - GET /:id resolves by unique type', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/study-templates/multiple_choice`);
    assert.equal(res.status, 200);
    const body = (await res.json()) as any;
    assert.equal(body.success, true);
    assert.equal(body.data.id, 'tpl-003-002');
    assert.equal(body.data.type, 'multiple_choice');
  } finally {
    server.close();
  }
});

test('Study Templates API - GET /:id with unknown id returns 404', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/study-templates/non-existent-template-id`);
    assert.equal(res.status, 404);
    const body = (await res.json()) as any;
    assert.equal(body.success, false);
    assert.ok(body.error);
  } finally {
    server.close();
  }
});

test('Study Templates API - POST / validates schema on invalid input', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/study-templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titleVi: 'Thieu cac field khac' }),
    });
    assert.equal(res.status, 400);
    const body = (await res.json()) as any;
    assert.equal(body.success, false);
  } finally {
    server.close();
  }
});
