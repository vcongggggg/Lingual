const tunnelBase = 'https://pebble-implosion-art.ngrok-free.dev';
const localBase = 'http://localhost:4000';

async function check(baseUrl, id) {
  const url = `${baseUrl}/api/v1/content/ielts-reading/${id}`;
  console.log(`Checking: ${url}`);
  const res = await fetch(url, {
    headers: { 'ngrok-skip-browser-warning': '1' }
  });
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}: ${await res.text()}`);
  }
  const body = await res.json();
  const item = body.item;
  const questions = item.questions || [];
  const ynngQuestions = questions.filter(q => q.type === 'yes_no_not_given');

  return {
    status: res.status,
    id: item.id,
    title: item.title,
    difficultyBand: item.difficultyBand,
    source: item.source,
    license: item.license,
    passageParagraphs: Array.isArray(item.passage) ? item.passage.length : typeof item.passage,
    totalQuestions: questions.length,
    ynngCount: ynngQuestions.length,
    sampleQ: questions[0] ? {
      type: questions[0].type,
      question: questions[0].question,
      optionsCount: questions[0].options?.length,
      answer: questions[0].answer,
      hasExplanation: Boolean(questions[0].explanation),
    } : null,
    sampleYNNG: ynngQuestions[0] ? {
      type: ynngQuestions[0].type,
      question: ynngQuestions[0].question,
      options: ynngQuestions[0].options,
      answer: ynngQuestions[0].answer,
      hasExplanation: Boolean(ynngQuestions[0].explanation),
    } : null,
  };
}

async function main() {
  console.log('=== SPOT CHECK API TEST ===\n');

  console.log('--- 1. Testing ielts-r-p3-002 (with YNNG) on Local ---');
  const localR2 = await check(localBase, 'ielts-r-p3-002');
  console.log(JSON.stringify(localR2, null, 2));

  console.log('\n--- 2. Testing ielts-r-p3-008 (Band 7.0) on Local ---');
  const localR8 = await check(localBase, 'ielts-r-p3-008');
  console.log(JSON.stringify(localR8, null, 2));

  console.log('\n--- 3. Testing ielts-r-p3-002 on Ngrok Tunnel ---');
  const tunnelR2 = await check(tunnelBase, 'ielts-r-p3-002');
  console.log(JSON.stringify(tunnelR2, null, 2));

  console.log('\n--- 4. Testing ielts-r-p3-008 on Ngrok Tunnel ---');
  const tunnelR8 = await check(tunnelBase, 'ielts-r-p3-008');
  console.log(JSON.stringify(tunnelR8, null, 2));
}

main().catch(err => {
  console.error('Spot check failed:', err);
  process.exit(1);
});
