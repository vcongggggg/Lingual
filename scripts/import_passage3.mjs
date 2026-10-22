import fs from 'fs';
import readline from 'readline';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const jsonlPath = 'C:\\Mod\\muse-data-exchange\\results\\ielts-passage3-001.jsonl';

function normalize(text) {
  return (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

async function main() {
  console.log('=== STARTING IMPORT PASSAGE 3 ===');
  const countBefore = await prisma.ieltsReadingPassage.count();
  console.log(`Initial DB reading passages count: ${countBefore}`);

  // Fetch existing titles for deduplication
  const existing = await prisma.ieltsReadingPassage.findMany({
    select: { id: true, title: true }
  });
  const existingTitles = new Set(existing.map(x => normalize(x.title)));

  const fileStream = fs.createReadStream(jsonlPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const tests = [];
  for await (const line of rl) {
    if (!line.trim()) continue;
    const data = JSON.parse(line);
    tests.push(data);
  }

  console.log(`Read ${tests.length} tests from JSONL.`);
  let totalQuestions = 0;
  let ynngCount = 0;
  let tfngCount = 0;

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const qs = test.questions || [];
    totalQuestions += qs.length;
    for (const q of qs) {
      if (q.type === 'yes_no_not_given') ynngCount++;
      if (q.type === 'true_false_not_given') tfngCount++;
    }
  }

  console.log(`Total questions in source: ${totalQuestions}`);
  console.log(`YNNG count: ${ynngCount}, TFNG count: ${tfngCount}`);

  let importedCount = 0;
  let skippedCount = 0;
  const importedIds = [];

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const normalizedTitle = normalize(test.title);
    if (existingTitles.has(normalizedTitle)) {
      console.warn(`[SKIP DUPLICATE] Title already exists: "${test.title}"`);
      skippedCount++;
      continue;
    }

    const padIndex = String(i + 1).padStart(3, '0');
    const id = `ielts-r-p3-${padIndex}`;
    const difficultyBand = String(test.difficulty_band || test.difficultyBand || '7.5');
    const cefrLevel = test.cefr_level || test.cefrLevel || 'C1';

    // Core fields supported by client
    await prisma.ieltsReadingPassage.create({
      data: {
        id,
        section: 'reading',
        cefrLevel,
        difficultyBand,
        title: test.title.trim(),
        passageJson: JSON.stringify(test.passage),
        questionsJson: JSON.stringify(test.questions),
        source: 'authored',
        license: 'MuseGen original authorship',
        verified: true,
      }
    });

    // Update extended fields
    await prisma.$executeRawUnsafe(
      'UPDATE "ielts_reading_passages" SET "module" = $1, "notes" = $2 WHERE "id" = $3',
      'Academic',
      `IELTS Reading Passage 3 authored test with ${test.questions.length} questions (MuseGen original authorship)`,
      id
    );

    existingTitles.add(normalizedTitle);
    importedCount++;
    importedIds.push(id);
    console.log(`[IMPORTED] ${id} | Title: "${test.title}" | Band: ${difficultyBand} | Qs: ${test.questions.length}`);
  }

  const countAfter = await prisma.ieltsReadingPassage.count();
  console.log('\n=== IMPORT SUMMARY ===');
  console.log(`Read from file: ${tests.length} tests, ${totalQuestions} questions`);
  console.log(`Imported: ${importedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`DB Count Before: ${countBefore}`);
  console.log(`DB Count After: ${countAfter} (Expected: ${countBefore + importedCount})`);
  console.log(`Imported IDs: ${importedIds.join(', ')}`);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Import failed with error:', err);
  process.exit(1);
});
