/**
 * Automated Route Verification Script for Phase 16: Community & Social Learning Lab
 */

const WEB_BASE = 'http://localhost:3000';

const ROUTES_TO_TEST = [
  '/vi/community',
  '/en/community',
  '/vi/community/profile/demo-user-id-001',
  '/en/community/profile/demo-user-id-001',
  '/vi/community/notes',
  '/en/community/notes',
  '/vi/community/notes/note-001',
  '/vi/community/leaderboard',
  '/en/community/leaderboard',
  '/vi/community/groups',
  '/en/community/groups',
  '/vi/community/groups/group-toeic-900',
  '/vi/community/achievements',
  '/en/community/achievements',
  '/vi/community/friends',
  '/en/community/friends',
];

async function verifyCommunityRoutes() {
  console.log('🌐 Verifying Web Routes for Community & Social Learning Lab...\n');
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
  console.log(`Community Route Verification: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`========================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

verifyCommunityRoutes();
