/**
 * Automated Route Verification Script for Phase 19: AI Tutor & Adaptive Learning Lab
 */

const WEB_BASE = 'http://localhost:3000';

const ROUTES_TO_TEST = [
  '/vi/tutor',
  '/en/tutor',
  '/vi/tutor/dashboard',
  '/en/tutor/dashboard',
  '/vi/tutor/plan',
  '/en/tutor/plan',
  '/vi/tutor/history',
  '/en/tutor/history',
];

async function verifyTutorRoutes() {
  console.log('🤖 Verifying Web Routes for AI Tutor Lab...\n');
  let passCount = 0;
  let failCount = 0;

  for (const route of ROUTES_TO_TEST) {
    try {
      const res = await fetch(`${WEB_BASE}${route}`);
      if (res.status === 200) {
        console.log(`  ✅ 200 OK: ${route}`);
        passCount++;
      } else {
        console.error(`  ❌ HTTP ${res.status}: ${route}`);
        failCount++;
      }
    } catch (err: any) {
      console.error(`  ❌ Connection Error for ${route}: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`AI Tutor Route Verification: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`========================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

verifyTutorRoutes();
