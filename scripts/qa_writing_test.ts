/**
 * Automated Phase 13 Writing Lab Comprehensive QA & Regression Test Suite
 */

import http from 'http';

async function request(options: http.RequestOptions, body?: any): Promise<{ statusCode: number; data: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 4000,
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const data = rawData ? JSON.parse(rawData) : null;
            resolve({ statusCode: res.statusCode || 0, data });
          } catch (e) {
            resolve({ statusCode: res.statusCode || 0, data: rawData });
          }
        });
      }
    );

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== RUNNING PHASE 13 WRITING LAB COMPREHENSIVE QA SUITE ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✔ PASS: ${message}`);
      passed++;
    } else {
      console.error(`✖ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request({ path: '/api/v1/health', method: 'GET' });
    assert(health.statusCode === 200, 'API server health check is 200 OK');

    // 2. GET /prompts & Filters
    const allPrompts = await request({ path: '/api/v1/writing/prompts', method: 'GET' });
    assert(allPrompts.statusCode === 200, 'GET /writing/prompts returns 200');
    assert(Array.isArray(allPrompts.data?.prompts) && allPrompts.data.prompts.length >= 5, 'Returns master writing prompts list');

    const seeWritePrompts = await request({ path: '/api/v1/writing/prompts?mode=see-write', method: 'GET' });
    assert(seeWritePrompts.statusCode === 200, 'GET /writing/prompts?mode=see-write returns 200');
    assert(seeWritePrompts.data.prompts.every((p: any) => p.mode === 'see-write'), 'Filters prompts correctly by mode');

    // 3. POST /analyze (Valid Submission)
    const analyzeValid = await request(
      { path: '/api/v1/writing/analyze', method: 'POST' },
      {
        promptId: 'see-write-a1-morning',
        mode: 'see-write',
        content: 'Every morning I wake up early, drink hot coffee, and eat delicious breakfast.',
        usedHint: false,
        durationMs: 30000,
      }
    );
    assert(analyzeValid.statusCode === 200, 'POST /writing/analyze valid text returns 200');
    assert(analyzeValid.data?.result?.score >= 80, 'Evaluates score >= 80 for accurate submission');
    assert(analyzeValid.data?.result?.wordCount === 13, 'Accurate word count calculated');

    // 4. POST /analyze (Grammar mistakes detection)
    const analyzeErrors = await request(
      { path: '/api/v1/writing/analyze', method: 'POST' },
      {
        promptId: 'see-write-a1-morning',
        mode: 'see-write',
        content: 'i drink coffee in the morning', // lower i, missing period
      }
    );
    assert(analyzeErrors.statusCode === 200, 'POST /writing/analyze with mistakes returns 200');
    assert(analyzeErrors.data?.result?.corrections?.length > 0, 'Detects corrections and generates feedback');

    // 5. POST /analyze (Edge cases: Vietnamese, Unicode, newlines, multiple spaces, repeated words)
    const edgeCaseAnalyze = await request(
      { path: '/api/v1/writing/analyze', method: 'POST' },
      {
        promptId: 'free-b1-favorite-city',
        mode: 'free',
        content: "  Hà Nội is   a beautiful   city with rich history.\n\nI love eating phở and drinking cà phê trứng every weekend!  ",
      }
    );
    assert(edgeCaseAnalyze.statusCode === 200, 'POST /writing/analyze handles Unicode/Vietnamese/newlines without crashing');
    assert(edgeCaseAnalyze.data?.result?.wordCount > 0, 'Calculates word count properly with whitespace trimming');

    // 6. Security: Rejection of Empty/Whitespace Content
    const emptyAnalyze = await request(
      { path: '/api/v1/writing/analyze', method: 'POST' },
      { promptId: 'see-write-a1-morning', mode: 'see-write', content: '   ' }
    );
    assert(emptyAnalyze.data?.result?.score === 0, 'Empty content evaluation safely yields score 0');

    // 7. Security: Rejection of Oversized Content (> 5000 chars)
    const oversized = 'a '.repeat(3000);
    const oversizedRes = await request(
      { path: '/api/v1/writing/analyze', method: 'POST' },
      { promptId: 'see-write-a1-morning', mode: 'see-write', content: oversized }
    );
    assert(oversizedRes.statusCode === 400, 'POST /writing/analyze rejects oversized payloads with 400');

    // 8. Security: Rejection of Invalid Mode
    const invalidModeRes = await request(
      { path: '/api/v1/writing/analyze', method: 'POST' },
      { promptId: 'see-write-a1-morning', mode: 'sql-injection-mode', content: 'Hello world.' }
    );
    assert(invalidModeRes.statusCode === 400, 'POST /writing/analyze rejects invalid mode with 400');

    // 9. Anti-Cheat: Attempting to Inject Arbitrary Score & XP
    const userPre = await request({ path: '/api/v1/writing/stats?userId=demo-user-id-001', method: 'GET' });
    const attemptCheat = await request(
      { path: '/api/v1/writing/attempts', method: 'POST' },
      {
        promptId: 'see-write-a1-morning',
        mode: 'see-write',
        content: 'I like coffee.',
        score: 100, // Client tries to claim 100
        xpAwarded: 999999, // Client tries to inject 999,999 XP!
        durationMs: 5000,
        userId: 'demo-user-id-001',
      }
    );
    assert(attemptCheat.statusCode === 201, 'POST /writing/attempts returns 201');
    assert(attemptCheat.data?.attempt?.xpAwarded !== 999999, 'ANTI-CHEAT: Server ignored client-injected 999,999 XP');
    assert(attemptCheat.data?.attempt?.xpAwarded <= 30, 'ANTI-CHEAT: Authoritative server XP awarded (<= 30)');

    // 10. Idempotency: Rapid Double Submit does not duplicate XP
    const doubleSubmit = await request(
      { path: '/api/v1/writing/attempts', method: 'POST' },
      {
        promptId: 'see-write-a1-morning',
        mode: 'see-write',
        content: 'I like coffee.',
        userId: 'demo-user-id-001',
      }
    );
    assert(doubleSubmit.statusCode === 200, 'IDEMPOTENCY: Rapid duplicate submit returns 200 OK without creating duplicate');
    assert(doubleSubmit.data?.isDuplicate === true, 'IDEMPOTENCY: Duplicate flag is true');

    // 11. GET /history
    const historyRes = await request({ path: '/api/v1/writing/history?userId=demo-user-id-001', method: 'GET' });
    assert(historyRes.statusCode === 200, 'GET /writing/history returns 200');
    assert(Array.isArray(historyRes.data?.history) && historyRes.data.history.length >= 1, 'Returns writing history');

    // 12. GET /stats
    const statsRes = await request({ path: '/api/v1/writing/stats?userId=demo-user-id-001', method: 'GET' });
    assert(statsRes.statusCode === 200, 'GET /writing/stats returns 200');
    assert(statsRes.data?.stats?.totalAttempts >= 1, 'Returns valid totalAttempts count');

    console.log(`\n========================================`);
    console.log(`PHASE 13 QA TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test run error:', err);
    process.exit(1);
  }
}

runTests();
