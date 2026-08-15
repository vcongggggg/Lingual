/**
 * Automated Live QA Test Script for Phase 17: Learning Analytics & Personal Intelligence Lab
 */

const API_BASE = 'http://localhost:4000/api/v1';

async function runLiveAnalyticsQA() {
  console.log('🚀 Starting Phase 17 Learning Analytics Live QA Suite...\n');
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

    // 2. Fetch Analytics Overview
    console.log('\n2. Fetching Analytics Overview...');
    const ovRes = await fetch(`${API_BASE}/analytics/overview`);
    const ovData = await ovRes.json();
    assert(ovRes.status === 200, 'Retrieved analytics overview');
    assert(ovData.overallScore > 0, `Overall learning score: ${ovData.overallScore}/100`);
    assert(Boolean(ovData.estimatedCEFR), `Estimated CEFR: ${ovData.estimatedCEFR}`);
    assert(ovData.totalStudyMinutes > 0, `Total study minutes: ${ovData.totalStudyMinutes}`);
    assert(ovData.totalXP > 0, `Total XP: ${ovData.totalXP}`);
    assert(ovData.currentStreak >= 0, `Streak: ${ovData.currentStreak}`);
    assert(Array.isArray(ovData.skills) && ovData.skills.length >= 5, 'Comprehensive multi-skill performance array verified');
    assert(Array.isArray(ovData.weaknesses), 'Weakness detection array verified');
    assert(Array.isArray(ovData.strengths), 'Strength detection array verified');
    assert(Array.isArray(ovData.recommendations), 'Personalized recommendations verified');
    assert(Array.isArray(ovData.goals), 'Active goals array verified');

    // 3. Fetch Skill Performance
    console.log('\n3. Testing Skill Performance Breakdown...');
    const skillRes = await fetch(`${API_BASE}/analytics/skills`);
    const skillData = await skillRes.json();
    assert(skillRes.status === 200 && Array.isArray(skillData.skills), 'Retrieved skills performance');
    const vocabSkill = skillData.skills.find((s: any) => s.skill === 'vocabulary');
    assert(vocabSkill && vocabSkill.score > 0, 'Vocabulary skill metrics verified');

    // 4. Time-series Trends
    console.log('\n4. Testing Time-Series Performance Trends (7d, 30d, 90d)...');
    const t7Res = await fetch(`${API_BASE}/analytics/trends?period=7d`);
    const t7Data = await t7Res.json();
    assert(t7Res.status === 200 && t7Data.points.length === 7, '7-day trend series verified');

    const t30Res = await fetch(`${API_BASE}/analytics/trends?period=30d`);
    const t30Data = await t30Res.json();
    assert(t30Res.status === 200 && t30Data.points.length === 30, '30-day trend series verified');

    const t90Res = await fetch(`${API_BASE}/analytics/trends?period=90d`);
    const t90Data = await t90Res.json();
    assert(t90Res.status === 200 && t90Data.points.length === 90, '90-day trend series verified');

    const badTrendRes = await fetch(`${API_BASE}/analytics/trends?period=invalid`);
    assert(badTrendRes.status === 400, 'Security: Invalid trend period rejected with 400');

    // 5. Activity Heatmap
    console.log('\n5. Testing 365-Day Study Heatmap...');
    const heatRes = await fetch(`${API_BASE}/analytics/heatmap`);
    const heatData = await heatRes.json();
    assert(heatRes.status === 200 && Array.isArray(heatData.heatmap), 'Heatmap retrieved');
    assert(heatData.heatmap.length === 365, 'Exact 365 days generated');

    // 6. Weakness Detection
    console.log('\n6. Testing Weakness Detection...');
    const weakRes = await fetch(`${API_BASE}/analytics/weaknesses`);
    const weakData = await weakRes.json();
    assert(weakRes.status === 200 && Array.isArray(weakData.weaknesses), 'Weakness analysis retrieved');

    // 7. Personalized Recommendations
    console.log('\n7. Testing Personalized Recommendations with Localization...');
    const recViRes = await fetch(`${API_BASE}/analytics/recommendations?locale=vi`);
    const recViData = await recViRes.json();
    assert(recViRes.status === 200 && recViData.recommendations.length > 0, 'Vietnamese recommendations verified');

    const recEnRes = await fetch(`${API_BASE}/analytics/recommendations?locale=en`);
    const recEnData = await recEnRes.json();
    assert(recEnRes.status === 200 && recEnData.recommendations.length > 0, 'English recommendations verified');

    // 8. Learning Goals Lifecycle
    console.log('\n8. Testing Learning Goals Lifecycle (CRUD)...');
    const postGoalRes = await fetch(`${API_BASE}/analytics/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'daily_minutes',
        target: 60,
      }),
    });
    const postGoalData = await postGoalRes.json();
    assert(postGoalRes.status === 201 && Boolean(postGoalData.goal?.id), 'Created learning goal successfully');

    const goalId = postGoalData.goal.id;

    const putGoalRes = await fetch(`${API_BASE}/analytics/goals/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: 60 }),
    });
    const putGoalData = await putGoalRes.json();
    assert(putGoalRes.status === 200 && putGoalData.goal.completed === true, 'Updated goal progress to completed');

    const delGoalRes = await fetch(`${API_BASE}/analytics/goals/${goalId}`, {
      method: 'DELETE',
    });
    assert(delGoalRes.status === 200, 'Deleted learning goal successfully');

    // 9. Weekly Intelligence Report
    console.log('\n9. Testing Weekly Intelligence Report...');
    const repRes = await fetch(`${API_BASE}/analytics/report/weekly`);
    const repData = await repRes.json();
    assert(repRes.status === 200 && repData.report.minutesStudied > 0, 'Weekly report retrieved with comparative analytics');

    // 10. Security Boundary
    console.log('\n10. Testing Security Rejection of Malformed Payloads...');
    const badGoalType = await fetch(`${API_BASE}/analytics/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'fake_type', target: 50 }),
    });
    assert(badGoalType.status === 400, 'Rejects invalid goal type with 400');

    const badGoalTarget = await fetch(`${API_BASE}/analytics/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'daily_minutes', target: -5 }),
    });
    assert(badGoalTarget.status === 400, 'Rejects negative target with 400');

    const missingGoal = await fetch(`${API_BASE}/analytics/goals/non-existent-goal`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: 10 }),
    });
    assert(missingGoal.status === 404, 'Rejects missing goal update with 404');

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

runLiveAnalyticsQA();
