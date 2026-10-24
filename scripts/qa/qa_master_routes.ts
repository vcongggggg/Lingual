/**
 * Master Web Routes Verification Script for Phase 20 Release Gate
 */

const WEB_BASE = 'http://localhost:3000';

const MASTER_ROUTES = [
  // Core & Hubs
  '/vi/dashboard',
  '/en/dashboard',
  '/vi/srs',
  '/en/srs',
  '/vi/games',
  '/en/games',
  '/vi/dictionary',
  '/en/dictionary',
  '/vi/profile',
  '/en/profile',
  '/vi/achievements',
  '/en/achievements',

  // Phase 11: Listening
  '/vi/listening',
  '/en/listening',
  '/vi/listening/dictation',
  '/en/listening/dictation',
  '/vi/listening/shadowing',
  '/en/listening/shadowing',

  // Phase 12: Vocabulary
  '/vi/vocabulary',
  '/en/vocabulary',
  '/vi/vocabulary/practice',
  '/en/vocabulary/practice',
  '/vi/vocabulary/test',
  '/en/vocabulary/test',

  // Phase 13: Writing
  '/vi/writing',
  '/en/writing',
  '/vi/writing/see-write',
  '/en/writing/see-write',
  '/vi/writing/guided',
  '/en/writing/guided',
  '/vi/writing/free',
  '/en/writing/free',

  // Phase 14: Reading
  '/vi/reading',
  '/en/reading',
  '/vi/reading/history',
  '/en/reading/history',

  // Phase 15: Exams
  '/vi/exam-practice',
  '/en/exam-practice',
  '/vi/exam-practice/history',
  '/en/exam-practice/history',
  '/vi/exam-practice/stats',
  '/en/exam-practice/stats',

  // Phase 16: Community
  '/vi/community',
  '/en/community',
  '/vi/community/friends',
  '/en/community/friends',
  '/vi/community/groups',
  '/en/community/groups',
  '/vi/community/leaderboard',
  '/en/community/leaderboard',
  '/vi/community/notes',
  '/en/community/notes',
  '/vi/community/achievements',
  '/en/community/achievements',

  // Phase 17: Analytics
  '/vi/analytics',
  '/en/analytics',

  // Phase 18: Speaking
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
  '/vi/speaking/history',
  '/en/speaking/history',
  '/vi/speaking/stats',
  '/en/speaking/stats',

  // Phase 19: AI Tutor & Adaptive Learning
  '/vi/tutor',
  '/en/tutor',
  '/vi/tutor/dashboard',
  '/en/tutor/dashboard',
  '/vi/tutor/plan',
  '/en/tutor/plan',
  '/vi/tutor/history',
  '/en/tutor/history',

  // Admin & Monitoring
  '/vi/admin',
  '/en/admin',
  '/vi/admin/audit-log',
  '/en/admin/audit-log',
];

async function runMasterRouteAudit() {
  console.log('🌐 Starting Comprehensive Web Routes Verification Suite (Phase 20)...\n');
  let passCount = 0;
  let failCount = 0;

  for (const route of MASTER_ROUTES) {
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
  console.log(`Master Web Routes Audit: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`========================================\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runMasterRouteAudit();
