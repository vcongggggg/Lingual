import http from 'http';

const BASE_URL = 'http://localhost:3000';

const ROUTES = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/roadmap',
  '/curriculum',
  '/profile',
  '/achievements',
  '/srs',
  '/games',
  '/dictionary',
  '/tutor',
  '/tutor/dashboard',
  '/tutor/plan',
  '/tutor/history',
  '/ielts',
  '/ielts/roadmap',
  '/ielts/mock-test',
  '/ielts/practice/reading',
  '/ielts/practice/listening',
  '/ielts/practice/writing',
  '/vocabulary',
  '/vocabulary/practice',
  '/vocabulary/test',
  '/listening',
  '/listening/practice',
  '/listening/dictation',
  '/listening/shadowing',
  '/reading',
  '/reading/practice',
  '/reading/history',
  '/speaking',
  '/speaking/practice',
  '/speaking/pronunciation',
  '/speaking/repetition',
  '/speaking/shadowing',
  '/speaking/guided',
  '/speaking/picture',
  '/speaking/situation',
  '/speaking/free',
  '/speaking/history',
  '/speaking/stats',
  '/speaking/result',
  '/writing',
  '/writing/practice',
  '/writing/guided',
  '/writing/free',
  '/writing/see-write',
  '/writing/result',
  '/exam-practice',
  '/exam-practice/history',
  '/exam-practice/stats',
  '/exam-practice/toeic',
  '/exam-practice/toeic/simulation',
  '/analytics',
  '/analytics/reading',
  '/analytics/listening',
  '/community',
  '/community/friends',
  '/community/groups',
  '/community/leaderboard',
  '/community/notes',
  '/community/achievements',
  '/admin',
  '/admin/audit-log',
];

async function checkRoute(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        resolve({ path, statusCode: res.statusCode, length: data.length });
      });
    }).on('error', (err) => reject(err));
  });
}

async function main() {
  console.log(`\n🔍 BẮT ĐẦU CRAWL ${ROUTES.length} ROUTES TRÊN GIAO DIỆN MỚI (${BASE_URL})...\n`);
  let passed = 0;
  let failed = 0;

  for (const r of ROUTES) {
    try {
      const res = await checkRoute(r);
      if (res.statusCode === 200) {
        console.log(`  ✅ [200 OK] ${r.padEnd(35)} (${res.length} bytes)`);
        passed++;
      } else {
        console.error(`  ❌ [${res.statusCode}] ${r.padEnd(35)} FAILED`);
        failed++;
      }
    } catch (e) {
      console.error(`  ❌ [ERROR] ${r.padEnd(35)} -> ${e.message}`);
      failed++;
    }
  }

  console.log(`\n======================================================`);
  console.log(`KẾT QUẢ CRAWL: ${passed}/${ROUTES.length} ROUTES 200 OK — ${failed} THẤT BẠI`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

main();
