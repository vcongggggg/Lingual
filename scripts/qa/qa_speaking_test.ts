/**
 * Automated Live QA Test Script for Phase 18: Speaking Lab
 */

const API_BASE = 'http://localhost:4000/api/v1';

async function runLiveSpeakingQA() {
  console.log('🎙️ Starting Phase 18 Speaking Lab Live QA Suite...\n');
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

    // 2. Fetch Speaking Prompts Catalog
    console.log('\n2. Fetching Speaking Prompts Catalog...');
    const pRes = await fetch(`${API_BASE}/speaking/prompts`);
    const pData = await pRes.json();
    assert(pRes.status === 200, 'Retrieved prompts list');
    assert(Array.isArray(pData.prompts) && pData.prompts.length >= 7, `Prompts catalog contains ${pData.prompts?.length} prompts`);

    // 3. Test Filters (Mode, Difficulty, CEFR, Topic)
    console.log('\n3. Testing Prompt Filters (Mode, Difficulty, CEFR, Topic)...');
    const pronFilter = await fetch(`${API_BASE}/speaking/prompts?mode=pronunciation`);
    const pronData = await pronFilter.json();
    assert(pronFilter.status === 200 && pronData.prompts.every((p: any) => p.mode === 'pronunciation'), 'Pronunciation filter strictly verified');

    const repFilter = await fetch(`${API_BASE}/speaking/prompts?mode=repetition`);
    const repData = await repFilter.json();
    assert(repFilter.status === 200 && repData.prompts.every((p: any) => p.mode === 'repetition'), 'Repetition filter strictly verified');

    const shadFilter = await fetch(`${API_BASE}/speaking/prompts?mode=shadowing`);
    const shadData = await shadFilter.json();
    assert(shadFilter.status === 200 && shadData.prompts.every((p: any) => p.mode === 'shadowing'), 'Shadowing filter strictly verified');

    const guiFilter = await fetch(`${API_BASE}/speaking/prompts?mode=guided`);
    const guiData = await guiFilter.json();
    assert(guiFilter.status === 200 && guiData.prompts.every((p: any) => p.mode === 'guided'), 'Guided Speaking filter strictly verified');

    const picFilter = await fetch(`${API_BASE}/speaking/prompts?mode=picture`);
    const picData = await picFilter.json();
    assert(picFilter.status === 200 && picData.prompts.every((p: any) => p.mode === 'picture'), 'Picture Speaking filter strictly verified');

    const sitFilter = await fetch(`${API_BASE}/speaking/prompts?mode=situation`);
    const sitData = await sitFilter.json();
    assert(sitFilter.status === 200 && sitData.prompts.every((p: any) => p.mode === 'situation'), 'Situation Speaking filter strictly verified');

    const freeFilter = await fetch(`${API_BASE}/speaking/prompts?mode=free-speaking`);
    const freeData = await freeFilter.json();
    assert(freeFilter.status === 200 && freeData.prompts.every((p: any) => p.mode === 'free-speaking'), 'Free Speaking filter strictly verified');

    // 4. Fetch Prompt Details
    console.log('\n4. Testing Prompt Details Fetching...');
    const detailRes = await fetch(`${API_BASE}/speaking/prompts/sp-pron-01`);
    const detailData = await detailRes.json();
    assert(detailRes.status === 200 && detailData.prompt.id === 'sp-pron-01', 'Retrieved single prompt details');

    // 5. Test Deterministic Local Analysis Endpoint
    console.log('\n5. Testing /analyze Evaluation Endpoint...');
    const anaRes = await fetch(`${API_BASE}/speaking/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        promptId: 'sp-pron-01',
        transcript: 'The sheep is on the ship.',
        durationMs: 4000,
      }),
    });
    const anaData = await anaRes.json();
    assert(anaRes.status === 200, 'Analyzed speech transcript');
    assert(anaData.feedback.overallScore >= 80, `Overall score evaluated: ${anaData.feedback.overallScore}/100`);
    assert(anaData.feedback.pronunciationScore >= 80, `Pronunciation score: ${anaData.feedback.pronunciationScore}%`);
    assert(Boolean(anaData.feedback.grade), `Grade assigned: ${anaData.feedback.grade}`);

    // 6. Test Grammar Analysis & Corrections Detection
    console.log('\n6. Testing Grammar Feedback & Heuristic Corrections...');
    const badGrammarRes = await fetch(`${API_BASE}/speaking/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        promptId: 'sp-gui-01',
        transcript: 'Yesterday I go to town and he want a apple.',
        durationMs: 8000,
      }),
    });
    const badGrammarData = await badGrammarRes.json();
    assert(badGrammarRes.status === 200 && badGrammarData.feedback.corrections.length >= 2, 'Grammar heuristics detected past tense and article errors');

    // 7. Test Submitting Speaking Attempt
    console.log('\n7. Testing Authoritative Attempt Submission...');
    const attRes = await fetch(`${API_BASE}/speaking/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        promptId: 'sp-rep-01',
        transcript: 'Hello, my name is Alex and I am a software engineer.',
        durationMs: 8000,
        score: 100, // Injected
        xpAwarded: 999999, // Injected
      }),
    });
    const attData = await attRes.json();
    assert(attRes.status === 201, 'Created attempt with 201 status');
    assert(Boolean(attData.submissionId), `Submission ID: ${attData.submissionId}`);
    assert(attData.xpAwarded > 0 && attData.xpAwarded <= 50, `Authoritative XP awarded: +${attData.xpAwarded} XP (injected XP blocked)`);
    assert(attData.streakUpdated === true, 'Authoritative streak updated');

    // 8. Test Idempotent Duplicate Submission
    console.log('\n8. Testing Idempotent Rapid Resubmission...');
    const dupRes = await fetch(`${API_BASE}/speaking/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        promptId: 'sp-rep-01',
        transcript: 'Hello, my name is Alex and I am a software engineer.',
        durationMs: 8000,
      }),
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 200 && dupData.idempotentDuplicate === true, 'Rapid identical submission handled idempotently without duplicate XP');

    // 9. Test History and Stats
    console.log('\n9. Testing Speaking History and Performance Statistics...');
    const histRes = await fetch(`${API_BASE}/speaking/history`);
    const histData = await histRes.json();
    assert(histRes.status === 200 && Array.isArray(histData.attempts), 'Retrieved speaking history');

    const statRes = await fetch(`${API_BASE}/speaking/stats`);
    const statData = await statRes.json();
    assert(statRes.status === 200 && statData.stats.totalAttempts > 0, 'Aggregated stats computed accurately');

    // 10. Test Targeted Recommendations
    console.log('\n10. Testing Targeted Speaking Recommendations...');
    const recRes = await fetch(`${API_BASE}/speaking/recommendations?locale=vi`);
    const recData = await recRes.json();
    assert(recRes.status === 200 && Array.isArray(recData.recommendations) && recData.recommendations.length > 0, 'Retrieved personalized speaking recommendations');

    // 11. Test SRS Vocabulary Bridge
    console.log('\n11. Testing SRS Vocabulary Deck Integration...');
    const srsRes = await fetch(`${API_BASE}/speaking/attempts/${attData.submissionId}/srs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words: ['beneficial', 'collaboration'] }),
    });
    const srsData = await srsRes.json();
    assert(srsRes.status === 200 && srsData.status === 'ok', 'Words saved into personal SRS vocabulary deck');

    // 12. Security Boundary & Input Rejection
    console.log('\n12. Testing Security Boundary & Input Rejection...');
    const badPrompt = await fetch(`${API_BASE}/speaking/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId: 'non-existent-prompt', transcript: 'test' }),
    });
    assert(badPrompt.status === 404, 'Rejects non-existent prompt with 404');

    const badDuration = await fetch(`${API_BASE}/speaking/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId: 'sp-pron-01', transcript: 'test', durationMs: -500 }),
    });
    assert(badDuration.status === 400, 'Rejects negative duration with 400');

    const emptySrs = await fetch(`${API_BASE}/speaking/attempts/test-id/srs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ words: [] }),
    });
    assert(emptySrs.status === 400, 'Rejects empty SRS words payload with 400');

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

runLiveSpeakingQA();
