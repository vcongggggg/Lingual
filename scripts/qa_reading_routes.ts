/**
 * Automated Route Verification Script for Phase 14: Reading Lab
 */

const WEB_BASE = 'http://localhost:3000';

const ROUTES_TO_TEST = [
  '/vi/reading',
  '/en/reading',
  '/vi/reading/a1-morning-coffee',
  '/en/reading/a1-morning-coffee',
  '/vi/reading/a1-morning-coffee/practice',
  '/vi/reading/a1-morning-coffee/result',
  '/vi/reading/history',
  '/en/reading/history',
];

async function verifyReadingRoutes() {
  console.log('🌐 Verifying Web Routes for Reading Lab...\n');
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
  console.log(`Route Verification: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`========================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

verifyReadingRoutes();
