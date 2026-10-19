/**
 * Automated Live QA Test Suite for Phase 19: Personalized AI Tutor & Adaptive Learning Lab
 */

const API_BASE = 'http://localhost:4000/api/v1';

async function runLiveTutorQA() {
  console.log('🤖 Starting Phase 19 AI Tutor & Adaptive Learning Live QA Suite...\n');
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

    // 2. Tutor Context
    console.log('\n2. Fetching Structured Tutor Context...');
    const ctxRes = await fetch(`${API_BASE}/tutor/context?userId=u-qa-1`);
    const ctxData = await ctxRes.json();
    assert(ctxRes.status === 200, 'Retrieved tutor context');
    assert(ctxData.context.user.userId === 'u-qa-1', 'Context user ID matches');
    assert(ctxData.context.overallScore >= 0 && ctxData.context.overallScore <= 100, `Overall learning score: ${ctxData.context.overallScore}`);
    assert(Array.isArray(ctxData.context.skills) && ctxData.context.skills.length >= 6, 'All 6 skill domains represented');
    assert(Array.isArray(ctxData.context.weaknesses), 'Weaknesses array generated');
    assert(Array.isArray(ctxData.context.strengths), 'Strengths array generated');

    // 3. Grammar Explanation Query
    console.log('\n3. Testing Grammar Explanation Intent...');
    const gramRes = await fetch(`${API_BASE}/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-qa-1',
        message: 'Tại sao lại dùng went thay vì go trong quá khứ?',
        locale: 'vi',
      }),
    });
    const gramData = await gramRes.json();
    assert(gramRes.status === 200, 'Chat endpoint processed grammar query');
    assert(gramData.response.intent === 'explain' || gramData.response.intent === 'grammar', 'Intent accurately classified as grammar/explain');
    assert(Boolean(gramData.response.explanation), 'Grammar rule breakdown and example attached');
    assert(gramData.response.actions.length > 0, 'Targeted writing practice action provided');

    // 4. Recommendation Query
    console.log('\n4. Testing Recommendation Intent ("What should I study today?")...');
    const recRes = await fetch(`${API_BASE}/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-qa-1',
        message: 'What should I study today?',
        locale: 'vi',
      }),
    });
    const recData = await recRes.json();
    assert(recRes.status === 200, 'Processed recommendation query');
    assert(recData.response.intent === 'recommend', 'Intent classified as recommend');
    assert(recData.response.actions.length > 0, 'Actions include immediate practice routes');

    // 5. Practice Drill Query
    console.log('\n5. Testing Practice Drill Intent...');
    const pracRes = await fetch(`${API_BASE}/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-qa-1',
        message: 'Cho tôi một bài luyện tập mini',
        locale: 'vi',
      }),
    });
    const pracData = await pracRes.json();
    assert(pracRes.status === 200, 'Processed practice query');
    assert(pracData.response.intent === 'practice', 'Intent classified as practice');

    // 6. Motivation Query
    console.log('\n6. Testing Motivation & Encouragement Intent...');
    const motRes = await fetch(`${API_BASE}/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-qa-1',
        message: 'Học tiếng Anh nản quá',
        locale: 'vi',
      }),
    });
    const motData = await motRes.json();
    assert(motRes.status === 200, 'Processed motivation query');
    assert(motData.response.intent === 'motivation', 'Intent classified as motivation');

    // 7. Exam Preparation Query
    console.log('\n7. Testing Exam Prep Intent...');
    const examRes = await fetch(`${API_BASE}/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-qa-1',
        message: 'Luyện thi IELTS band 7.0',
        locale: 'vi',
      }),
    });
    const examData = await examRes.json();
    assert(examRes.status === 200, 'Processed exam query');
    assert(examData.response.intent === 'exam', 'Intent classified as exam');

    // 8. Adaptive 7-Day Plan Generation
    console.log('\n8. Testing Adaptive Plan Generation (POST /plan)...');
    const planGenRes = await fetch(`${API_BASE}/tutor/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-qa-1', days: 7, locale: 'vi' }),
    });
    const planGenData = await planGenRes.json();
    assert(planGenRes.status === 201, 'Created adaptive plan with 201 status');
    assert(Array.isArray(planGenData.plan.todayItems) && planGenData.plan.todayItems.length > 0, 'Today agenda generated');
    assert(planGenData.plan.sevenDayPlan.length === 7, '7-day structured trajectory created');

    // 9. Fetch Active Adaptive Plan
    console.log('\n9. Testing Active Plan Retrieval (GET /plan)...');
    const planGetRes = await fetch(`${API_BASE}/tutor/plan?userId=u-qa-1&locale=vi`);
    const planGetData = await planGetRes.json();
    assert(planGetRes.status === 200, 'Retrieved active plan');
    assert(planGetData.plan.totalEstimatedMinutes > 0, `Total estimated time: ${planGetData.plan.totalEstimatedMinutes} mins`);

    // 10. Mini Practice Session Generation (Vocabulary, Speaking, Writing, Listening)
    console.log('\n10. Testing Mini Practice Session Generation for all skills...');
    const vSess = await fetch(`${API_BASE}/tutor/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-qa-1', skill: 'vocabulary', locale: 'vi' }),
    });
    const vData = await vSess.json();
    assert(vSess.status === 201 && vData.session.items[0].type === 'vocabulary', 'Vocabulary mini session created');

    const sSess = await fetch(`${API_BASE}/tutor/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-qa-1', skill: 'speaking', locale: 'vi' }),
    });
    const sData = await sSess.json();
    assert(sSess.status === 201 && sData.session.items[0].type === 'speaking', 'Speaking mini session created');

    // 11. Authoritative Session Completion & XP Protection
    console.log('\n11. Testing Authoritative Session Completion & XP Awarding...');
    const compRes = await fetch(`${API_BASE}/tutor/session/${vData.session.id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-qa-1',
        score: 85,
        durationMinutes: 12,
        accuracy: 90,
        injectedXP: 999999, // Should be ignored
      }),
    });
    const compData = await compRes.json();
    assert(compRes.status === 200, 'Completed session successfully');
    assert(compData.xpAwarded > 0 && compData.xpAwarded <= 50, `Authoritative XP awarded: +${compData.xpAwarded} XP`);
    assert(compData.streakUpdated === true, 'Authoritative streak updated');

    // 12. Idempotency on Rapid Duplicate Resubmission
    console.log('\n12. Testing Idempotency on Rapid Duplicate Completion...');
    const dupRes = await fetch(`${API_BASE}/tutor/session/${vData.session.id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-qa-1',
        score: 85,
        durationMinutes: 12,
        accuracy: 90,
      }),
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 200 && dupData.idempotentDuplicate === true, 'Duplicate completion handled idempotently without inflating XP');

    // 13. Tutor History & Conversation Logs
    console.log('\n13. Testing Tutor History & Conversation Logs (GET /history)...');
    const histRes = await fetch(`${API_BASE}/tutor/history?userId=u-qa-1`);
    const histData = await histRes.json();
    assert(histRes.status === 200, 'Retrieved history');
    assert(Boolean(histData.conversation), 'Conversation messages logged');
    assert(Array.isArray(histData.sessions) && histData.sessions.length > 0, 'Completed session records logged');

    // 14. Targeted Recommendations
    console.log('\n14. Testing Prioritized Recommendations (GET /recommendations)...');
    const recListRes = await fetch(`${API_BASE}/tutor/recommendations?userId=u-qa-1&locale=vi`);
    const recListData = await recListRes.json();
    assert(recListRes.status === 200, 'Retrieved recommendations');
    assert(Array.isArray(recListData.recommendations) && recListData.recommendations.length > 0, 'Recommendations populated');

    // 15. Tutor Action Execution
    console.log('\n15. Testing Action Execution (POST /actions/execute)...');
    const actRes = await fetch(`${API_BASE}/tutor/actions/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'u-qa-1',
        actionType: 'start_srs',
        route: '/vi/srs',
      }),
    });
    const actData = await actRes.json();
    assert(actRes.status === 200 && actData.status === 'ok', 'Tutor action executed cleanly');

    // 16. Security & Privacy Validations
    console.log('\n16. Testing Security, Input Limits & Privacy Boundaries...');
    const emptyMsg = await fetch(`${API_BASE}/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-qa-1', message: '' }),
    });
    assert(emptyMsg.status === 400, 'Rejects empty message with 400');

    const oversized = await fetch(`${API_BASE}/tutor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-qa-1', message: 'A'.repeat(2500) }),
    });
    assert(oversized.status === 400, 'Rejects oversized message with 400');

    const invalidScore = await fetch(`${API_BASE}/tutor/session/s-test/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-qa-1', score: -5 }),
    });
    assert(invalidScore.status === 400, 'Rejects negative score with 400');

    const missingAction = await fetch(`${API_BASE}/tutor/actions/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u-qa-1' }),
    });
    assert(missingAction.status === 400, 'Rejects missing actionType with 400');

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

runLiveTutorQA();
