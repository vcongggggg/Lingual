import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import { authRouter } from '../apps/api/src/routes/auth.js';
import { stampRouter } from '../apps/api/src/routes/stamp.js';
import { prisma } from '../apps/api/src/lib/prisma.js';

async function runTests() {
  console.log('🧪 Starting Pre-deploy P0 Verification Suite...\n');

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/stamps', stampRouter);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Test Mục 1 DoD: API login thành công (200) với DB mới
    console.log('--- TEST MỤC 1: API Register & Login (200) ---');
    const testEmail = `predeploy_${Date.now()}@example.com`;
    const testPassword = 'Password123!';

    const regRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        displayName: 'Predeploy Tester',
        interfaceLocale: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
      }),
    });

    const regData = await regRes.json();
    console.log(`Register HTTP Status: ${regRes.status}`);
    if (regRes.status !== 200) {
      console.error('Register failed:', regData);
      process.exit(1);
    }

    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const loginData = await loginRes.json();
    console.log(`Login HTTP Status: ${loginRes.status}`);
    if (loginRes.status !== 200 || !loginData.accessToken) {
      console.error('Login failed:', loginData);
      process.exit(1);
    }
    console.log('✅ Mục 1 PASS: Login thành công 200 với database PostgreSQL mới!\n');

    const token = loginData.accessToken;

    // 2. Test Mục 4 DoD: stamp.ts production vs development
    console.log('--- TEST MỤC 4: stamp.ts Authentication Enforce ---');

    // Test 4a: NODE_ENV = production -> No token must return 401
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const stampNoTokenProd = await fetch(`${baseUrl}/api/v1/stamps`);
    console.log(`[production] GET /api/v1/stamps without token: ${stampNoTokenProd.status} (Expected: 401)`);
    if (stampNoTokenProd.status !== 401) {
      console.error('Failed: Expected 401 in production without token, got:', stampNoTokenProd.status);
      process.exit(1);
    }

    // Test 4b: NODE_ENV = production -> With Bearer token must return 200
    const stampWithTokenProd = await fetch(`${baseUrl}/api/v1/stamps`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`[production] GET /api/v1/stamps with Bearer token: ${stampWithTokenProd.status} (Expected: 200)`);
    if (stampWithTokenProd.status !== 200) {
      console.error('Failed: Expected 200 with Bearer token, got:', stampWithTokenProd.status);
      process.exit(1);
    }

    // Test 4c: NODE_ENV = development -> No token falls back to demo-user (200)
    process.env.NODE_ENV = 'development';
    const stampNoTokenDev = await fetch(`${baseUrl}/api/v1/stamps`);
    console.log(`[development] GET /api/v1/stamps without token: ${stampNoTokenDev.status} (Expected: 200 demo fallback)`);
    if (stampNoTokenDev.status !== 200) {
      console.error('Failed: Expected 200 demo fallback in dev, got:', stampNoTokenDev.status);
      process.exit(1);
    }
    process.env.NODE_ENV = origEnv;
    console.log('✅ Mục 4 PASS: stamp.ts bảo mật 401 chuẩn production và tương thích dev!\n');

    // Clean up test user
    await prisma.user.delete({ where: { email: testEmail } }).catch(() => {});
    console.log('🎉 ALL AUTOMATED INTEGRATION TESTS PASSED (Mục 1 & 4 DoD satisfied)!');
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
