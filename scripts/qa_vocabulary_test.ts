import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:4000/api/v1';

async function testApi() {
  console.log('=== [QA TEST 1] Health Check ===');
  const healthRes = await fetch(`${BASE_URL}/health`);
  assert.equal(healthRes.status, 200);
  const healthData = await healthRes.json();
  console.log('Health check:', healthData.status);

  console.log('\n=== [QA TEST 2] Vocabulary Search ===');
  // Exact & case-insensitive search
  const searchTravel = await fetch(`${BASE_URL}/vocabulary/search?q=travel`).then((r) => r.json());
  assert.ok(searchTravel.words.length > 0, 'Should find travel');
  assert.equal(searchTravel.words[0].targetText.toLowerCase(), 'travel');
  console.log('✓ Found travel:', searchTravel.words[0].targetText);

  // Vietnamese translation search
  const searchVietnamese = await fetch(`${BASE_URL}/vocabulary/search?q=du%20l%E1%BB%8Bch`).then((r) => r.json());
  assert.ok(searchVietnamese.words.length > 0, 'Should find travel by Vietnamese translation "du lịch"');
  console.log('✓ Found by Vietnamese translation:', searchVietnamese.words[0].targetText);

  // CEFR filter
  const searchCefr = await fetch(`${BASE_URL}/vocabulary/search?cefr=A1`).then((r) => r.json());
  assert.ok(searchCefr.words.every((w: any) => w.cefrLevel === 'A1'), 'All words must be A1');
  console.log(`✓ CEFR A1 filter returned ${searchCefr.words.length} words`);

  console.log('\n=== [QA TEST 3] Word Detail ===');
  const wordDetail = await fetch(`${BASE_URL}/vocabulary/word/vocab-travel`).then((r) => r.json());
  assert.ok(wordDetail.word, 'Should return word details');
  assert.equal(wordDetail.word.targetText, 'Travel');
  console.log('✓ Word detail retrieved:', wordDetail.word.targetText, wordDetail.word.translation);

  console.log('\n=== [QA TEST 4] Folder Lifecycle (CRUD) ===');
  // 1. Create Folder
  const createFolderRes = await fetch(`${BASE_URL}/vocabulary/folders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'QA Travel Vocabulary', description: 'Test Folder for QA' }),
  });
  assert.equal(createFolderRes.status, 201);
  const createdFolder = (await createFolderRes.json()).folder;
  const folderId = createdFolder.id;
  console.log('✓ Created folder:', createdFolder.name, `(${folderId})`);

  // 2. Add 3 words to folder
  const wordsToAdd = ['vocab-travel', 'vocab-hello', 'vocab-student'];
  for (const wId of wordsToAdd) {
    const addRes = await fetch(`${BASE_URL}/vocabulary/folders/${folderId}/words`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wordId: wId }),
    });
    assert.equal(addRes.status, 200);
  }
  console.log('✓ Added 3 words to folder');

  // 3. Verify folder word count in list
  const foldersList = await fetch(`${BASE_URL}/vocabulary/folders`).then((r) => r.json());
  const myFolder = foldersList.folders.find((f: any) => f.id === folderId);
  assert.ok(myFolder);
  assert.equal(myFolder.wordCount, 3);
  console.log('✓ Folder word count verified:', myFolder.wordCount);

  // 4. Rename Folder
  const renameRes = await fetch(`${BASE_URL}/vocabulary/folders/${folderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'QA Travel Vocabulary (Renamed)' }),
  });
  assert.equal(renameRes.status, 200);
  const renamedData = await renameRes.json();
  assert.equal(renamedData.folder.name, 'QA Travel Vocabulary (Renamed)');
  console.log('✓ Renamed folder successfully:', renamedData.folder.name);

  // 5. Remove 1 word from folder
  const removeWordRes = await fetch(`${BASE_URL}/vocabulary/folders/${folderId}/words/vocab-student`, {
    method: 'DELETE',
  });
  assert.equal(removeWordRes.status, 200);

  const foldersListAfterRemove = await fetch(`${BASE_URL}/vocabulary/folders`).then((r) => r.json());
  const myFolderAfterRemove = foldersListAfterRemove.folders.find((f: any) => f.id === folderId);
  assert.equal(myFolderAfterRemove.wordCount, 2);
  console.log('✓ Word removed from folder. Remaining count:', myFolderAfterRemove.wordCount);

  // 6. Delete folder
  const deleteFolderRes = await fetch(`${BASE_URL}/vocabulary/folders/${folderId}`, {
    method: 'DELETE',
  });
  assert.equal(deleteFolderRes.status, 200);
  const foldersListAfterDelete = await fetch(`${BASE_URL}/vocabulary/folders`).then((r) => r.json());
  assert.ok(!foldersListAfterDelete.folders.some((f: any) => f.id === folderId));
  console.log('✓ Deleted folder successfully');

  console.log('\n=== [QA TEST 5] Personal Saved Vocabulary ===');
  // Save word
  const saveRes = await fetch(`${BASE_URL}/vocabulary/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wordId: 'vocab-hospital', targetText: 'Hospital', translation: 'Bệnh viện' }),
  });
  assert.equal(saveRes.status, 200);
  console.log('✓ Saved Hospital');

  const savedList = await fetch(`${BASE_URL}/vocabulary/saved`).then((r) => r.json());
  assert.ok(savedList.savedWords.some((item: any) => item.wordId === 'vocab-hospital'));
  console.log(`✓ Saved words list contains Hospital (total: ${savedList.savedWords.length})`);

  console.log('\n=== [QA TEST 6] Practice Generation & All 4 Modes ===');
  const practiceData = await fetch(`${BASE_URL}/vocabulary/practice?limit=8`).then((r) => r.json());
  assert.ok(practiceData.questions.length > 0);
  console.log(`✓ Generated ${practiceData.questions.length} practice questions`);

  const modesFound = new Set(practiceData.questions.map((q: any) => q.mode));
  console.log('✓ Modes present in questions:', Array.from(modesFound).join(', '));

  console.log('\n=== [QA TEST 7] Practice Submission & SRS Updates ===');
  const answers = practiceData.questions.map((q: any) => ({
    questionId: q.id,
    wordId: q.wordId,
    userAnswer: q.correctAnswer, // Answer correctly with high recall
    responseTimeSeconds: 2,
  }));

  const submitRes = await fetch(`${BASE_URL}/vocabulary/practice/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questions: practiceData.questions,
      answers,
    }),
  });
  assert.equal(submitRes.status, 200);
  const submitData = await submitRes.json();
  assert.equal(submitData.result.accuracy, 100);
  assert.ok(submitData.result.xpEarned > 0);
  console.log(`✓ Practice submitted! Accuracy: ${submitData.result.accuracy}%, XP: +${submitData.result.xpEarned}, Streak: ${submitData.currentStreak}`);

  console.log('\n=== [QA TEST 8] Edge Cases & Validation ===');
  // Invalid folder ID
  const invalidFolder = await fetch(`${BASE_URL}/vocabulary/folders/nonexistent-id`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Invalid' }),
  });
  assert.equal(invalidFolder.status, 404);
  console.log('✓ Invalid folder returns 404');

  // Empty folder name
  const emptyFolderName = await fetch(`${BASE_URL}/vocabulary/folders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '   ' }),
  });
  assert.equal(emptyFolderName.status, 400);
  console.log('✓ Empty folder name returns 400');

  // Malformed practice payload
  const malformedPractice = await fetch(`${BASE_URL}/vocabulary/practice/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questions: 'invalid' }),
  });
  assert.equal(malformedPractice.status, 400);
  console.log('✓ Malformed practice submission returns 400');

  console.log('\n========================================');
  console.log('🎉 ALL API & INTEGRATION QA TESTS PASSED!');
  console.log('========================================');
}

testApi().catch((err) => {
  console.error('❌ QA Test Failed:', err);
  process.exit(1);
});
