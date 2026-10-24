/**
 * Automated Route Verification Script for Phase 17: Learning Analytics & Personal Intelligence Lab
 */

const WEB_BASE = 'http://localhost:3000';

const ROUTES_TO_TEST = [
  '/vi/analytics',
  '/en/analytics',
  '/vi/analytics/listening',
  '/en/analytics/listening',
  '/vi/analytics/vocabulary',
  '/en/analytics/vocabulary',
  '/vi/analytics/writing',
  '/en/analytics/writing',
  '/vi/analytics/reading',
  '/en/analytics/reading',
  '/vi/analytics/exam',
  '/en/analytics/exam',
];

async function verifyAnalyticsRoutes() {
  console.log('🌐 Verifying Web Routes for Learning Analytics Lab...\n');
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
  console.log(`Analytics Route Verification: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`========================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

verifyAnalyticsRoutes();
