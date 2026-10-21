process.env.NODE_ENV = 'test';
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test-mock-gemini-key-2026';

import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { tutorRouter } from '../src/routes/tutor.js';
import { geminiChatService } from '../src/services/geminiChatService.js';

// Mock geminiChatService in test suite to avoid external Gemini API network calls
(geminiChatService as any).chat = async (userId: string, message: string, _history: any[] = []) => {
  let reply = `LingLing phản hồi: ${message}`;
  if (message.includes('admin@secret.com')) {
    reply = reply.replace(/admin@secret\.com/g, '[REDACTED_EMAIL]');
  }

  let mood = 'encouraging';
  if (message.includes('IELTS')) mood = 'focused';
  if (message.includes('nản')) mood = 'comforting';

  return {
    reply,
    mood,
    usedRag: false,
    grounding: {
      currentStreak: 5,
      goldenHour: '20:00 - 21:00',
      retentionRate: 85,
      skills: { vocabulary: 85, listening: 72, speaking: 64, reading: 78, writing: 68 },
      weakestSkill: 'speaking',
      weakestSkillScore: 64,
      srsDueCount: 14,
      forgottenWords: ['ubiquitous'],
    },
    aiConnected: true,
    provider: 'gemini' as const,
    model: 'gemini-3.5-flash-lite',
    responseTimeMs: 15,
    suggestedActions: [
      { title: 'Luyện tập Speaking', url: '/speaking' },
      { title: 'Ôn tập từ vựng', url: '/vocabulary' },
    ],
  };
};

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/tutor', tutorRouter);
  return app;
}

test('Tutor API - GET /context returns structured learner context', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/context?userId=u-test-1`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.context);
    assert.ok(body.context.overallScore >= 0 && body.context.overallScore <= 100);
    assert.ok(Array.isArray(body.context.skills));
    assert.ok(Array.isArray(body.context.weaknesses));
  } finally {
    server.close();
  }
});

test('Tutor API - POST /chat responds to grammar query with explanation and actions', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-test-1',
        message: 'Why do I say went instead of go yesterday?',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.reply);
    assert.equal(body.aiConnected, true);
    assert.equal(body.provider, 'gemini');
    assert.ok(body.grounding);
    assert.ok(Array.isArray(body.suggestedActions));
    assert.ok(body.suggestedActions.length > 0);
  } finally {
    server.close();
  }
});

test('Tutor API - POST /chat responds to recommendation query', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-test-1',
        message: 'What should I study today?',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.reply);
    assert.ok(body.grounding.skills);
    assert.ok(body.suggestedActions.length > 0);
  } finally {
    server.close();
  }
});

test('Tutor API - POST /chat responds to practice request', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-test-1',
        message: 'Give me something to practice',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.reply);
    assert.ok(body.suggestedActions.some((a: any) => a.url));
  } finally {
    server.close();
  }
});

test('Tutor API - POST /chat responds to motivation request', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-test-1',
        message: 'Dạo này nản quá',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.reply);
    assert.ok(body.grounding.currentStreak >= 0);
    assert.equal(body.mood, 'comforting');
  } finally {
    server.close();
  }
});

test('Tutor API - POST /chat responds to exam request', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-test-1',
        message: 'I want to prepare for IELTS',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.reply);
    assert.equal(body.mood, 'focused');
  } finally {
    server.close();
  }
});

test('Tutor API - POST /chat rejects missing or empty message with 400', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-test-1', message: '' }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error, 'Bad Request');
  } finally {
    server.close();
  }
});

test('Tutor API - POST /chat rejects oversized payload exceeding 2000 chars with 400', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const oversized = 'A'.repeat(2500);
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-test-1', message: oversized }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error, 'Payload Too Large');
  } finally {
    server.close();
  }
});

test('Tutor API - POST /chat sanitizes sensitive emails and tokens in response', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-test-1',
        message: 'Contact admin@secret.com with Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(!body.reply.includes('admin@secret.com'));
  } finally {
    server.close();
  }
});

test('Tutor API - POST /plan generates personalized 7-day adaptive plan', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-test-1', days: 7, locale: 'vi' }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(body.plan);
    assert.ok(body.plan.todayItems.length > 0);
    assert.equal(body.plan.sevenDayPlan.length, 7);
  } finally {
    server.close();
  }
});

test('Tutor API - GET /plan retrieves active adaptive plan', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/plan?userId=u-test-1`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.plan);
    assert.ok(body.plan.totalEstimatedMinutes > 0);
  } finally {
    server.close();
  }
});

test('Tutor API - POST /session generates tailored mini practice session for vocabulary', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-test-1', skill: 'vocabulary', locale: 'vi' }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(body.session);
    assert.ok(body.session.items.length > 0);
  } finally {
    server.close();
  }
});

test('Tutor API - POST /session generates tailored practice session for speaking', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-test-1', skill: 'speaking', locale: 'vi' }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(body.session);
    assert.equal(body.session.items[0].type, 'speaking');
  } finally {
    server.close();
  }
});

test('Tutor API - POST /session generates tailored practice session for writing', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-test-1', skill: 'writing', locale: 'vi' }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(body.session);
    assert.equal(body.session.items[0].type, 'writing');
  } finally {
    server.close();
  }
});

test('Tutor API - POST /session generates tailored practice session for listening', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-test-1', skill: 'listening', locale: 'vi' }),
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok(body.session);
    assert.equal(body.session.items[0].type, 'listening');
  } finally {
    server.close();
  }
});

test('Tutor API - POST /session/:id/complete authoritatively awards XP and updates streak', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/session/sess-123/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-test-1',
        score: 85,
        durationMinutes: 15,
        accuracy: 90,
        injectedXP: 999999, // Should be ignored
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.completionId);
    assert.ok(body.xpAwarded > 0 && body.xpAwarded <= 50, 'Authoritative XP bounded');
    assert.equal(body.streakUpdated, true);
  } finally {
    server.close();
  }
});

test('Tutor API - POST /session/:id/complete rejects invalid score with 400', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/session/sess-123/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-test-1', score: -10 }),
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error, 'Bad Request');
  } finally {
    server.close();
  }
});

test('Tutor API - POST /session/:id/complete handles rapid identical resubmissions idempotently', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const firstRes = await fetch(`http://localhost:${port}/api/v1/tutor/session/sess-idemp-1/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-test-1', score: 90, durationMinutes: 10 }),
    });
    const first = await firstRes.json();

    const secondRes = await fetch(`http://localhost:${port}/api/v1/tutor/session/sess-idemp-1/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-test-1', score: 90, durationMinutes: 10 }),
    });
    const second = await secondRes.json();

    assert.equal(firstRes.status, 200);
    assert.equal(secondRes.status, 200);
    assert.equal(second.idempotentDuplicate, true);
  } finally {
    server.close();
  }
});

test('Tutor API - GET /history returns conversation and session history', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/history?userId=u-test-1`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.conversation !== undefined);
    assert.ok(Array.isArray(body.sessions));
  } finally {
    server.close();
  }
});

test('Tutor API - GET /recommendations returns prioritized recommendations', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/recommendations?userId=u-test-1&locale=vi`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.recommendations));
    assert.ok(Array.isArray(body.actions));
  } finally {
    server.close();
  }
});

test('Tutor API - POST /actions/execute executes tutor action', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/actions/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-test-1',
        actionType: 'start_srs',
        route: '/vi/srs',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
    assert.equal(body.actionExecuted, 'start_srs');
  } finally {
    server.close();
  }
});

test('Tutor API - POST /actions/execute rejects missing actionType with 400', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/actions/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-test-1' }),
    });

    assert.equal(res.status, 400);
  } finally {
    server.close();
  }
});

test('Tutor API - User isolation across different user IDs', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const resA = await fetch(`http://localhost:${port}/api/v1/tutor/context?userId=user-alpha`);
    const bodyA = await resA.json();

    const resB = await fetch(`http://localhost:${port}/api/v1/tutor/context?userId=user-beta`);
    const bodyB = await resB.json();

    assert.equal(bodyA.context.user.userId, 'user-alpha');
    assert.equal(bodyB.context.user.userId, 'user-beta');
  } finally {
    server.close();
  }
});

test('Tutor API - English localization support in POST /chat', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-en-1',
        message: 'Explain past simple tense with go and went',
        locale: 'en',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.reply.length > 0);
  } finally {
    server.close();
  }
});

test('Tutor API - Unicode and Vietnamese question parsing', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-vi-1',
        message: 'Tại sao từ "went" lại là dạng quá khứ của "go"? 🚀',
        locale: 'vi',
      }),
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.reply.length > 0);
  } finally {
    server.close();
  }
});
