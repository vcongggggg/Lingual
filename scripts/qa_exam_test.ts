/**
 * Automated Live QA Test Script for Phase 15: Exam Practice Lab
 */

const API_BASE = 'http://localhost:4000/api/v1';

async function runLiveExamQA() {
  console.log('🚀 Starting Phase 15 Exam Practice Lab Live QA Suite...\n');
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
    // 1. Health check
    console.log('1. Verifying API Health...');
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'API is online and healthy');

    // 2. Fetch Exam Catalog
    console.log('\n2. Fetching Exams Catalog...');
    const examsRes = await fetch(`${API_BASE}/exams`);
    const examsData = await examsRes.json();
    assert(examsRes.status === 200 && Array.isArray(examsData.exams), 'Fetched exams list successfully');
    assert(examsData.exams.length >= 5, `Exams catalog contains ${examsData.exams.length} international exams`);

    // 3. Filter by Exam Type
    console.log('\n3. Testing Filters by Exam Type & Level...');
    const toeicRes = await fetch(`${API_BASE}/exams?type=toeic`);
    const toeicData = await toeicRes.json();
    assert(toeicData.exams.every((e: any) => e.type === 'toeic'), 'Type filter strictly returns TOEIC exams');

    const ieltsRes = await fetch(`${API_BASE}/exams?type=ielts`);
    const ieltsData = await ieltsRes.json();
    assert(ieltsData.exams.every((e: any) => e.type === 'ielts'), 'Type filter strictly returns IELTS exams');

    // 4. Fetch Public Exam Detail (Anti-cheat verification)
    console.log('\n4. Fetching Public Exam Detail & Verifying Anti-Cheat Boundary...');
    const detailRes = await fetch(`${API_BASE}/exams/exam-toeic-01`);
    const detailData = await detailRes.json();
    assert(detailRes.status === 200 && detailData.exam.id === 'exam-toeic-01', 'Retrieved exam details');
    const firstQ = detailData.exam.sections[0].questions[0];
    assert(firstQ.correctAnswer === undefined, 'Anti-cheat: Correct answer is stripped from public output');
    assert(firstQ.explanation === undefined, 'Anti-cheat: Explanation is stripped from public output');

    // 5. Start Exam Attempt
    console.log('\n5. Starting Exam Attempt...');
    const startRes = await fetch(`${API_BASE}/exams/exam-toeic-01/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo-user-id-001' }),
    });
    const startData = await startRes.json();
    assert(startRes.status === 201 && Boolean(startData.attemptId), 'Created exam attempt with 201 status');
    assert(new Date(startData.expiresAt).getTime() > new Date(startData.startedAt).getTime(), 'Server-side expiration window configured');

    const attemptId = startData.attemptId;

    // 6. Submit Individual Answers
    console.log('\n6. Saving Individual Question Answers...');
    const ansRes = await fetch(`${API_BASE}/exams/attempts/${attemptId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: 't-l1-q1',
        selectedOption: 'A man is adjusting his necktie.',
        flagged: true,
      }),
    });
    const ansData = await ansRes.json();
    assert(ansRes.status === 200 && ansData.success === true, 'Answer saved successfully with flag status');

    // 7. Authoritative Server Evaluation
    console.log('\n7. Submitting Exam & Testing Authoritative Evaluation...');
    const submitRes = await fetch(`${API_BASE}/exams/attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        elapsedSeconds: 900,
        answers: [
          { questionId: 't-l1-q1', selectedOption: 'A man is adjusting his necktie.' },
          { questionId: 't-l1-q2', selectedOption: 'On Ms. Lee’s reception desk.' },
          { questionId: 't-r1-q1', selectedOption: 'prior to' },
          { questionId: 't-r1-q2', selectedOption: 'remarkably' },
          { questionId: 't-r1-q3', selectedOption: 'unless' },
          { questionId: 't-r2-q1', selectedOption: 'To announce the rollout of a new inventory tracking system' },
          { questionId: 't-r2-q2', selectedOption: 'Attend a 30-minute orientation session' },
        ],
      }),
    });
    const submitData = await submitRes.json();
    assert(submitRes.status === 200, 'Exam submitted with status 200');
    assert(submitData.result.score === 7, `Score evaluated authoritatively: ${submitData.result.score}/7`);
    assert(submitData.result.accuracy === 100, 'Accuracy matches (100%)');
    assert(submitData.result.scaledScoreLabel === '990 / 990', 'TOEIC scaled score mapped: 990 / 990');
    assert(submitData.result.xpAwarded >= 50, `XP awarded: +${submitData.result.xpAwarded} XP`);
    assert(submitData.result.sectionResults.length === 3, 'All 3 section breakdowns generated');

    // 8. Test Idempotency Window
    console.log('\n8. Testing Idempotent Resubmission...');
    const dupRes = await fetch(`${API_BASE}/exams/attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ elapsedSeconds: 900 }),
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 200 && dupData.isDuplicate === true, 'Rapid resubmission handled idempotently without inflating streak or XP');

    // 9. Fetch Result Details
    console.log('\n9. Fetching Result Details...');
    const resRes = await fetch(`${API_BASE}/exams/attempts/${attemptId}/result`);
    const resData = await resRes.json();
    assert(resRes.status === 200 && resData.result.attemptId === attemptId, 'Retrieved complete result details');

    // 10. Fetch History & Stats
    console.log('\n10. Verifying History and Performance Stats...');
    const histRes = await fetch(`${API_BASE}/exams/history/all?userId=demo-user-id-001`);
    const histData = await histRes.json();
    assert(histRes.status === 200 && histData.history.length > 0, 'User exam history retrieved');

    const statsRes = await fetch(`${API_BASE}/exams/stats/summary?userId=demo-user-id-001`);
    const statsData = await statsRes.json();
    assert(statsRes.status === 200 && statsData.stats.totalAttempts >= 1, 'Aggregated stats metrics computed');

    // 11. Security Tests: Non-existent IDs
    console.log('\n11. Testing Security Rejection of Invalid IDs...');
    const badExamRes = await fetch(`${API_BASE}/exams/non-existent-exam/start`, { method: 'POST' });
    assert(badExamRes.status === 404, 'Rejects start for non-existent exam with 404');

    const badAttemptRes = await fetch(`${API_BASE}/exams/attempts/bad-attempt-id`);
    assert(badAttemptRes.status === 404, 'Rejects non-existent attempt with 404');

    console.log(`\n========================================`);
    console.log(`🎉 LIVE QA SUITE FINISHED: ${passCount} PASSED, ${failCount} FAILED`);
    console.log(`========================================\n`);

    if (failCount > 0) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('Fatal QA error:', err);
    process.exit(1);
  }
}

runLiveExamQA();
