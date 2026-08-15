import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { analyticsRouter } from '../src/routes/analytics.js';

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/analytics', analyticsRouter);
  return app;
}

test('Analytics API - GET /overview returns comprehensive metrics', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/analytics/overview`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.overallScore > 0);
    assert.ok(body.estimatedCEFR);
    assert.ok(Array.isArray(body.skills));
    assert.ok(Array.isArray(body.weaknesses));
    assert.ok(Array.isArray(body.strengths));
    assert.ok(Array.isArray(body.recommendations));
    assert.ok(body.consistency);
  } finally {
    server.close();
  }
});

test('Analytics API - GET /skills returns skill performance list', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/analytics/skills`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.skills));
    assert.ok(body.skills.length >= 5);
    assert.ok(body.skills.some((s: any) => s.skill === 'vocabulary'));
  } finally {
    server.close();
  }
});

test('Analytics API - GET /trends returns 7d, 30d, 90d points and rejects invalid period', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    // 7d
    const res7 = await fetch(`http://localhost:${port}/api/v1/analytics/trends?period=7d`);
    assert.equal(res7.status, 200);
    const body7 = await res7.json();
    assert.equal(body7.points.length, 7);

    // 30d
    const res30 = await fetch(`http://localhost:${port}/api/v1/analytics/trends?period=30d`);
    assert.equal(res30.status, 200);
    const body30 = await res30.json();
    assert.equal(body30.points.length, 30);

    // 90d
    const res90 = await fetch(`http://localhost:${port}/api/v1/analytics/trends?period=90d`);
    assert.equal(res90.status, 200);
    const body90 = await res90.json();
    assert.equal(body90.points.length, 90);

    // Invalid period
    const resInvalid = await fetch(`http://localhost:${port}/api/v1/analytics/trends?period=year`);
    assert.equal(resInvalid.status, 400);
  } finally {
    server.close();
  }
});

test('Analytics API - GET /heatmap returns 365 days entries', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/analytics/heatmap`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.heatmap));
    assert.equal(body.heatmap.length, 365);
  } finally {
    server.close();
  }
});

test('Analytics API - GET /weaknesses returns detected weaknesses', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/analytics/weaknesses`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.weaknesses));
  } finally {
    server.close();
  }
});

test('Analytics API - GET /recommendations returns prioritized suggestions', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const resVi = await fetch(`http://localhost:${port}/api/v1/analytics/recommendations?locale=vi`);
    assert.equal(resVi.status, 200);
    const bodyVi = await resVi.json();
    assert.ok(Array.isArray(bodyVi.recommendations));
    assert.ok(bodyVi.recommendations.length > 0);

    const resEn = await fetch(`http://localhost:${port}/api/v1/analytics/recommendations?locale=en`);
    assert.equal(resEn.status, 200);
    const bodyEn = await resEn.json();
    assert.ok(bodyEn.recommendations.length > 0);
  } finally {
    server.close();
  }
});

test('Analytics API - Learning Goal Lifecycle (GET, POST, PUT, DELETE)', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    // 1. GET goals
    const getRes = await fetch(`http://localhost:${port}/api/v1/analytics/goals`);
    assert.equal(getRes.status, 200);
    const getBody = await getRes.json();
    assert.ok(Array.isArray(getBody.goals));

    // 2. POST goal (valid)
    const postRes = await fetch(`http://localhost:${port}/api/v1/analytics/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'daily_minutes',
        target: 45,
      }),
    });
    assert.equal(postRes.status, 201);
    const postBody = await postRes.json();
    assert.equal(postBody.goal.type, 'daily_minutes');
    assert.equal(postBody.goal.target, 45);

    const createdId = postBody.goal.id;

    // 3. POST goal (invalid type rejection)
    const badTypeRes = await fetch(`http://localhost:${port}/api/v1/analytics/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'invalid_type', target: 20 }),
    });
    assert.equal(badTypeRes.status, 400);

    // 4. POST goal (invalid target rejection)
    const badTargetRes = await fetch(`http://localhost:${port}/api/v1/analytics/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'daily_minutes', target: -10 }),
    });
    assert.equal(badTargetRes.status, 400);

    // 5. PUT goal update
    const putRes = await fetch(`http://localhost:${port}/api/v1/analytics/goals/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: 45 }),
    });
    assert.equal(putRes.status, 200);
    const putBody = await putRes.json();
    assert.equal(putBody.goal.current, 45);
    assert.equal(putBody.goal.completed, true);

    // 6. PUT goal 404 for non-existent id
    const put404 = await fetch(`http://localhost:${port}/api/v1/analytics/goals/non-existent-goal`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: 10 }),
    });
    assert.equal(put404.status, 404);

    // 7. DELETE goal
    const delRes = await fetch(`http://localhost:${port}/api/v1/analytics/goals/${createdId}`, {
      method: 'DELETE',
    });
    assert.equal(delRes.status, 200);

    // 8. DELETE goal 404 for non-existent id
    const del404 = await fetch(`http://localhost:${port}/api/v1/analytics/goals/non-existent-goal`, {
      method: 'DELETE',
    });
    assert.equal(del404.status, 404);
  } finally {
    server.close();
  }
});

test('Analytics API - GET /report/weekly returns structured weekly summary', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/analytics/report/weekly`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.report.minutesStudied > 0);
    assert.ok(body.report.strongestSkill);
    assert.ok(body.report.focusNextWeek);
  } finally {
    server.close();
  }
});
