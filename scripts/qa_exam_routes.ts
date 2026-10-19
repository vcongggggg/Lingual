/**
 * Automated Route Verification Script for Phase 15: Exam Practice Lab
 */

const WEB_BASE = 'http://localhost:3000';

const ROUTES_TO_TEST = [
  '/vi/exam-practice',
  '/en/exam-practice',
  '/vi/exam-practice/exam-toeic-01',
  '/en/exam-practice/exam-toeic-01',
  '/vi/exam-practice/exam-toeic-01/attempt/att-demo-toeic-01',
  '/vi/exam-practice/result/att-demo-toeic-01',
  '/vi/exam-practice/history',
  '/en/exam-practice/history',
  '/vi/exam-practice/stats',
  '/en/exam-practice/stats',
];

async function verifyExamRoutes() {
  console.log('🌐 Verifying Web Routes for Exam Practice Lab...\n');
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
  console.log(`Exam Route Verification: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`========================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

verifyExamRoutes();
