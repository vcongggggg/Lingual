/**
 * Automated Route Verification Script for Phase 18: Speaking Lab
 */

const WEB_BASE = 'http://localhost:3000';

const ROUTES_TO_TEST = [
  '/vi/speaking',
  '/en/speaking',
  '/vi/speaking/pronunciation',
  '/en/speaking/pronunciation',
  '/vi/speaking/repetition',
  '/en/speaking/repetition',
  '/vi/speaking/shadowing',
  '/en/speaking/shadowing',
  '/vi/speaking/guided',
  '/en/speaking/guided',
  '/vi/speaking/picture',
  '/en/speaking/picture',
  '/vi/speaking/situation',
  '/en/speaking/situation',
  '/vi/speaking/free',
  '/en/speaking/free',
  '/vi/speaking/result',
  '/en/speaking/result',
  '/vi/speaking/history',
  '/en/speaking/history',
  '/vi/speaking/stats',
  '/en/speaking/stats',
];

async function verifySpeakingRoutes() {
  console.log('🎙️ Verifying Web Routes for Speaking Lab...\n');
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
  console.log(`Speaking Route Verification: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`========================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

verifySpeakingRoutes();
