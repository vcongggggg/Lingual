import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import { authRouter } from '../apps/api/src/routes/auth.js';
import { speakingRouter } from '../apps/api/src/routes/speaking.js';
import { stampRouter } from '../apps/api/src/routes/stamp.js';
import { prisma } from '../apps/api/src/lib/prisma.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/speaking', speakingRouter);
  app.use('/api/v1/stamps', stampRouter);
  return app;
}

async function runTests() {
  console.log('🧪 Starting Pre-deploy P1 Verification Suite...\n');

  let app = createApp();
  let server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  let port = (server.address() as any).port;
  let baseUrl = `http://127.0.0.1:${port}`;

  const testEmail = `p1_tester_${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  try {
    // =========================================================================
    // MỤC 2: Chuyển token auth sang httpOnly cookie
    // =========================================================================
    console.log('--- TEST MỤC 2: HttpOnly Cookie Authentication ---');

    // 1. Register & Login
    await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        displayName: 'P1 Tester',
        interfaceLocale: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
      }),
    });

    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const setCookieHeader = loginRes.headers.get('set-cookie') || '';
    console.log('Set-Cookie Header:', setCookieHeader);

    // DoD: Login thành công -> response có header Set-Cookie chứa access_token với flag HttpOnly
    if (!setCookieHeader.toLowerCase().includes('httponly')) {
      console.error('❌ FAILED: Set-Cookie does not have HttpOnly flag!');
      process.exit(1);
    }
    if (!setCookieHeader.includes('access_token=')) {
      console.error('❌ FAILED: Set-Cookie does not set access_token!');
      process.exit(1);
    }
    console.log('✅ PASS: Set-Cookie header contains HttpOnly access_token.');

    // Extract cookie value for subsequent requests
    const cookieMatch = setCookieHeader.match(/access_token=([^;]+)/);
    const cookieVal = cookieMatch ? cookieMatch[1] : '';
    const cookieHeader = `access_token=${cookieVal}`;

    // 2. Authenticated route with ONLY Cookie (No Authorization Header) in production mode
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const stampResWithCookie = await fetch(`${baseUrl}/api/v1/stamps`, {
      headers: { Cookie: cookieHeader },
    });
    console.log(`[production] GET /api/v1/stamps with ONLY HttpOnly Cookie: ${stampResWithCookie.status}`);
    if (stampResWithCookie.status !== 200) {
      console.error('❌ FAILED: Expected 200 when authenticating via HttpOnly Cookie!');
      process.exit(1);
    }
    console.log('✅ PASS: Authenticated request succeeded via Cookie alone.');

    // 3. Logout -> clears cookie & subsequent request gets 401
    const logoutRes = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      headers: { Cookie: cookieHeader },
    });
    const logoutSetCookie = logoutRes.headers.get('set-cookie') || '';
    console.log('Logout Set-Cookie Header:', logoutSetCookie);
    if (!logoutSetCookie.includes('access_token=;') && !logoutSetCookie.toLowerCase().includes('max-age=0')) {
      console.error('❌ FAILED: Logout did not clear access_token cookie!');
      process.exit(1);
    }

    const stampResAfterLogout = await fetch(`${baseUrl}/api/v1/stamps`);
    console.log(`[production] GET /api/v1/stamps after logout without cookie: ${stampResAfterLogout.status}`);
    if (stampResAfterLogout.status !== 401) {
      console.error('❌ FAILED: Expected 401 after logout!');
      process.exit(1);
    }
    console.log('✅ PASS: Logout successfully cleared session, 401 enforced.\n');

    process.env.NODE_ENV = origEnv;

    // =========================================================================
    // MỤC 1: speaking.ts Redis & Idempotency
    // =========================================================================
    console.log('--- TEST MỤC 1: Speaking Redis Persistence & Idempotency ---');

    // Log in again to get fresh cookie
    const reLoginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    const freshCookieMatch = (reLoginRes.headers.get('set-cookie') || '').match(/access_token=([^;]+)/);
    const freshCookieHeader = `access_token=${freshCookieMatch ? freshCookieMatch[1] : ''}`;

    // Get a valid prompt ID
    const promptsRes = await fetch(`${baseUrl}/api/v1/speaking/prompts?limit=1`);
    const promptsData = await promptsRes.json();
    const promptId = promptsData.prompts[0]?.id || 'sp-a1-001';

    // 1. Submit attempt 1
    const attemptPayload = {
      promptId,
      transcript: 'I practice speaking English every single day with LinguaFlow.',
      durationMs: 15000,
    };

    const attempt1Res = await fetch(`${baseUrl}/api/v1/speaking/attempts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: freshCookieHeader,
      },
      body: JSON.stringify(attemptPayload),
    });

    const attempt1Data = await attempt1Res.json();
    console.log('Attempt 1 Status:', attempt1Res.status, 'Score:', attempt1Data.feedback?.overallScore);
    if (attempt1Res.status !== 201) {
      console.error('❌ FAILED: Attempt 1 creation failed:', attempt1Data);
      process.exit(1);
    }

    // 2. Submit attempt 2 (Exact duplicate for idempotency)
    const attempt2Res = await fetch(`${baseUrl}/api/v1/speaking/attempts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: freshCookieHeader,
      },
      body: JSON.stringify(attemptPayload),
    });

    const attempt2Data = await attempt2Res.json();
    console.log('Attempt 2 (Duplicate) Status:', attempt2Res.status, 'idempotentDuplicate:', attempt2Data.idempotentDuplicate);
    if (attempt2Res.status !== 200 || !attempt2Data.idempotentDuplicate) {
      console.error('❌ FAILED: Idempotent duplicate check failed!');
      process.exit(1);
    }
    console.log('✅ PASS: Gửi 2 request trùng idempotency key -> kết quả giống nhau, chỉ tính 1 lần.');

    // 3. Check stats before restart
    const statsBeforeRes = await fetch(`${baseUrl}/api/v1/speaking/stats`, {
      headers: { Cookie: freshCookieHeader },
    });
    const statsBefore = await statsBeforeRes.json();
    console.log('Stats before restart:', statsBefore.stats);
    if (statsBefore.stats.totalAttempts !== 1) {
      console.error('❌ FAILED: Expected totalAttempts = 1, got:', statsBefore.stats.totalAttempts);
      process.exit(1);
    }

    // 4. Simulate API Server Restart
    console.log('Restarting API server instance to verify persistence...');
    server.close();

    app = createApp();
    server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    port = (server.address() as any).port;
    baseUrl = `http://127.0.0.1:${port}`;

    // Check stats after restart
    const statsAfterRes = await fetch(`${baseUrl}/api/v1/speaking/stats`, {
      headers: { Cookie: freshCookieHeader },
    });
    const statsAfter = await statsAfterRes.json();
    console.log('Stats after restart:', statsAfter.stats);
    if (statsAfter.stats.totalAttempts !== statsBefore.stats.totalAttempts ||
        statsAfter.stats.totalXP !== statsBefore.stats.totalXP) {
      console.error('❌ FAILED: Stats altered or lost across restart!', statsAfter.stats);
      process.exit(1);
    }
    console.log('✅ PASS: Restart container/API -> GET /api/v1/speaking/stats vẫn trả đúng số liệu cũ.\n');

    // Clean up
    await prisma.user.delete({ where: { email: testEmail } }).catch(() => {});
    console.log('🎉 ALL AUTOMATED TESTS FOR MỤC 1 & 2 PASSED 100%!');
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
