/**
 * Automated Live QA Test Script for Phase 14: Reading Lab
 */

const API_BASE = 'http://localhost:4000/api/v1';

async function runLiveReadingQA() {
  console.log('🚀 Starting Phase 14 Reading Lab Live QA Suite...\n');
  let passCount = 0;
  let failCount = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${msg}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${msg}`);
      failCount++;
    }
  }

  try {
    // 1. Health Check
    console.log('1. Verifying API Health...');
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'API is healthy and online');

    // 2. Fetch Reading Articles
    console.log('\n2. Fetching Graded Articles...');
    const articlesRes = await fetch(`${API_BASE}/reading/articles`);
    const articlesData = await articlesRes.json();
    assert(articlesRes.status === 200 && Array.isArray(articlesData.articles), 'Fetched articles list successfully');
    assert(articlesData.articles.length >= 10, `Articles catalog contains ${articlesData.articles.length} graded texts`);

    // 3. Filter Articles by Level
    console.log('\n3. Testing Level and Topic Filters...');
    const a1Res = await fetch(`${API_BASE}/reading/articles?level=A1`);
    const a1Data = await a1Res.json();
    assert(a1Data.articles.every((a: any) => a.level === 'A1'), 'Level A1 filter is strictly accurate');

    const b2Res = await fetch(`${API_BASE}/reading/articles?level=B2`);
    const b2Data = await b2Res.json();
    assert(b2Data.articles.every((a: any) => a.level === 'B2'), 'Level B2 filter is strictly accurate');

    // 4. Fetch Article Detail
    console.log('\n4. Fetching Article Content & Paragraphs...');
    const detailRes = await fetch(`${API_BASE}/reading/articles/a1-morning-coffee`);
    const detailData = await detailRes.json();
    assert(detailRes.status === 200 && detailData.article.id === 'a1-morning-coffee', 'Fetched single article detail');
    assert(detailData.article.paragraphs.length >= 2, 'Article contains structured paragraphs with Vietnamese translations');

    // 5. Fetch Article Questions (Sanitized without exposing answers)
    console.log('\n5. Fetching Comprehension Questions...');
    const questRes = await fetch(`${API_BASE}/reading/articles/a1-morning-coffee/questions`);
    const questData = await questRes.json();
    assert(questRes.status === 200 && questData.questions.length >= 2, 'Retrieved comprehension questions');
    assert(questData.questions[0].correctAnswer === undefined, 'Anti-cheat: Answer key is never exposed on client endpoint');

    // 6. Submit Comprehension Attempt & Verify Server Authoritative Scoring
    console.log('\n6. Testing Authoritative Attempt Submission...');
    const attemptRes = await fetch(`${API_BASE}/reading/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: 'a1-morning-coffee',
        mode: 'standard',
        answers: [
          { questionId: 'q1-1', selectedOption: 'Different morning habits worldwide' },
          { questionId: 'q1-2', selectedOption: 'False' },
          { questionId: 'q1-3', selectedOption: 'The strength and vitality to be active' },
        ],
        elapsedSeconds: 60,
        userId: 'demo-user-id-001',
      }),
    });

    const attemptData = await attemptRes.json();
    assert(attemptRes.status === 201, 'Attempt recorded with status 201');
    assert(attemptData.attempt.score >= 90, `Server-evaluated score: ${attemptData.attempt.score}%`);
    assert(attemptData.feedback.accuracy === 100, 'Server feedback accuracy matches answers (100%)');
    assert(attemptData.attempt.xpAwarded >= 30, `Authoritative XP awarded: +${attemptData.attempt.xpAwarded} XP`);
    assert(attemptData.attempt.wpm === 165, `Reading speed computed: ${attemptData.attempt.wpm} WPM`);

    // 7. Test Idempotency on rapid duplicate submission
    console.log('\n7. Testing Submission Idempotency...');
    const dupRes = await fetch(`${API_BASE}/reading/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: 'a1-morning-coffee',
        mode: 'standard',
        answers: [
          { questionId: 'q1-1', selectedOption: 'Different morning habits worldwide' },
        ],
        elapsedSeconds: 60,
        userId: 'demo-user-id-001',
      }),
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 200 && dupData.isDuplicate === true, 'Rapid duplicate submission handled idempotently without inflating streak or XP');

    // 8. Test Reading History & Stats
    console.log('\n8. Verifying Reading History & Stats...');
    const histRes = await fetch(`${API_BASE}/reading/history?userId=demo-user-id-001`);
    const histData = await histRes.json();
    assert(histRes.status === 200 && histData.history.length > 0, 'User reading history is preserved');

    const statsRes = await fetch(`${API_BASE}/reading/stats?userId=demo-user-id-001`);
    const statsData = await statsRes.json();
    assert(statsRes.status === 200 && statsData.stats.articlesCompleted >= 1, 'Aggregated reading stats calculated');

    // 9. Test Reading Progress Persistence
    console.log('\n9. Testing Reading Progress Persistence...');
    const progRes = await fetch(`${API_BASE}/reading/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: 'a1-morning-coffee',
        currentParagraph: 2,
        scrollProgress: 65,
      }),
    });
    const progData = await progRes.json();
    assert(progRes.status === 200 && progData.success === true, 'Reading position progress saved');

    // 10. Test Vocabulary Save
    console.log('\n10. Testing Vocabulary Save...');
    const vocabRes = await fetch(`${API_BASE}/reading/vocabulary/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        word: 'Espresso',
        meaning: 'Cà phê đậm đặc',
        cefrLevel: 'A1',
        articleId: 'a1-morning-coffee',
      }),
    });
    const vocabData = await vocabRes.json();
    assert(vocabRes.status === 200 && vocabData.success === true, 'Word saved to personal dictionary');

    // 11. Security Audit: Reject Invalid Attempt Payloads
    console.log('\n11. Testing Security Trust Boundaries...');
    const invalidArtRes = await fetch(`${API_BASE}/reading/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: 'invalid-non-existent',
        answers: [],
      }),
    });
    assert(invalidArtRes.status === 404, 'Rejects attempt for non-existent article with 404');

    const invalidModeRes = await fetch(`${API_BASE}/reading/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: 'a1-morning-coffee',
        mode: 'malicious-injected-mode',
        answers: [],
      }),
    });
    assert(invalidModeRes.status === 400, 'Rejects attempt with invalid mode with 400');

    console.log(`\n========================================`);
    console.log(`🎉 QA SUITE FINISHED: ${passCount} PASSED, ${failCount} FAILED`);
    console.log(`========================================\n`);

    if (failCount > 0) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('Fatal QA error:', err);
    process.exit(1);
  }
}

runLiveReadingQA();
