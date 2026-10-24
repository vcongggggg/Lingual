import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, '../data/phase2_all');

async function main() {
  console.log('🚀 Seeding Phase 2 Batch 4C to PostgreSQL...');

  // 1. IELTS Reading Passages (7)
  const readingRaw = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'ielts-reading-batch2.json'), 'utf-8')
  );
  console.log(`Processing ${readingRaw.length} IELTS reading passages...`);
  const existingReading = new Set(
    (await prisma.ieltsReadingPassage.findMany({ select: { id: true } })).map((r) => r.id)
  );
  const newReading = readingRaw
    .filter((r: any) => !existingReading.has(r.id))
    .map((r: any) => ({
      id: r.id,
      section: r.section || 'reading',
      cefrLevel: r.cefrLevel || 'B1',
      title: r.title,
      passageJson: JSON.stringify(r.passage || []),
      questionsJson: JSON.stringify(r.questions || []),
      source: r.source || 'ai-generated',
      verified: Boolean(r.verified),
    }));

  if (newReading.length > 0) {
    await prisma.ieltsReadingPassage.createMany({ data: newReading, skipDuplicates: true });
  }
  console.log(`✅ IELTS Reading: Inserted ${newReading.length} passages (Dedupe: ${readingRaw.length - newReading.length} skipped)`);

  // 2. IELTS Listening Sections (7)
  const listeningRaw = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'ielts-listening-batch2.json'), 'utf-8')
  );
  console.log(`Processing ${listeningRaw.length} IELTS listening sections...`);
  const existingListening = new Set(
    (await prisma.ieltsListeningSection.findMany({ select: { id: true } })).map((l) => l.id)
  );
  const newListening = listeningRaw
    .filter((l: any) => !existingListening.has(l.id))
    .map((l: any) => ({
      id: l.id,
      section: l.section || 'listening',
      cefrLevel: l.cefrLevel || 'B1',
      title: l.title,
      titleVi: l.titleVi || null,
      scriptJson: JSON.stringify(l.script || []),
      questionsJson: JSON.stringify(l.questions || []),
      source: l.source || 'ai-generated',
      verified: Boolean(l.verified),
    }));

  if (newListening.length > 0) {
    await prisma.ieltsListeningSection.createMany({ data: newListening, skipDuplicates: true });
  }
  console.log(`✅ IELTS Listening: Inserted ${newListening.length} sections (Dedupe: ${listeningRaw.length - newListening.length} skipped)`);

  // 3. Curriculum Units & Vocabulary Deduplication (10 units, 270 words)
  const unitsRaw = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'curriculum-units-batch2.json'), 'utf-8')
  );
  console.log(`Processing ${unitsRaw.length} curriculum units...`);

  // Deduplication check of 270 words against vocabularies table
  const allDbVocab = await prisma.vocabulary.findMany({ select: { targetText: true } });
  const dbVocabLower = new Set(allDbVocab.map((v) => v.targetText.toLowerCase().trim()));

  let totalUnitWords = 0;
  let duplicateWordsCount = 0;
  const duplicateList: string[] = [];
  const uniqueWordsList: string[] = [];

  for (const u of unitsRaw) {
    for (const l of u.lessons || []) {
      for (const w of l.words || []) {
        totalUnitWords++;
        const wordText = (w.targetText || w.word || '').toLowerCase().trim();
        if (dbVocabLower.has(wordText)) {
          duplicateWordsCount++;
          duplicateList.push(wordText);
        } else {
          uniqueWordsList.push(wordText);
        }
      }
    }
  }

  console.log('=== VOCABULARY DEDUPLICATION REPORT ===');
  console.log(`Total words in 10 units: ${totalUnitWords}`);
  console.log(`Already in Vocabulary DB: ${duplicateWordsCount} words`);
  console.log(`New unique words: ${uniqueWordsList.length} words`);
  if (duplicateList.length > 0) {
    console.log(`Sample duplicated words: ${duplicateList.slice(0, 10).join(', ')}...`);
  }
  console.log('=======================================');

  const existingUnits = new Set(
    (await prisma.curriculumUnit.findMany({ select: { id: true } })).map((u) => u.id)
  );
  const newUnits = unitsRaw
    .filter((u: any) => !existingUnits.has(u.id))
    .map((u: any) => ({
      id: u.id,
      order: u.order,
      cefrLevel: u.cefrLevel || 'B1',
      title: u.title,
      titleVi: u.titleVi || null,
      description: u.description || '',
      descriptionVi: u.descriptionVi || null,
      lessonsJson: JSON.stringify(u.lessons || []),
      source: u.source || 'ai-generated',
      verified: Boolean(u.verified),
    }));

  if (newUnits.length > 0) {
    await prisma.curriculumUnit.createMany({ data: newUnits, skipDuplicates: true });
  }
  console.log(`✅ Curriculum Units: Inserted ${newUnits.length} units (Dedupe: ${unitsRaw.length - newUnits.length} skipped)`);

  // 4. Diary Prompts (120 prompts)
  const diaryRaw = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'diary-prompts-batch2.json'), 'utf-8')
  );
  console.log(`Processing ${diaryRaw.length} diary prompts...`);
  const existingDiary = new Set(
    (await prisma.diaryPrompt.findMany({ select: { id: true } })).map((d) => d.id)
  );
  const newDiary = diaryRaw
    .filter((d: any) => !existingDiary.has(d.id))
    .map((d: any) => ({
      id: d.id,
      cefrLevel: d.cefrLevel || 'A2',
      prompt: d.prompt,
      promptVi: d.promptVi || null,
      keywordsJson: JSON.stringify(d.keywords || []),
      minSentences: d.minSentences || 3,
      source: d.source || 'ai-generated',
      verified: Boolean(d.verified),
    }));

  if (newDiary.length > 0) {
    await prisma.diaryPrompt.createMany({ data: newDiary, skipDuplicates: true });
  }
  console.log(`✅ Diary Prompts: Inserted ${newDiary.length} prompts (Dedupe: ${diaryRaw.length - newDiary.length} skipped)`);

  // 5. Verification counts
  const totalR = await prisma.ieltsReadingPassage.count();
  const totalL = await prisma.ieltsListeningSection.count();
  const totalU = await prisma.curriculumUnit.count();
  const totalD = await prisma.diaryPrompt.count();

  console.log('====================================');
  console.log('PHASE 2 BATCH 4C SEED VERIFICATION:');
  console.log(`IELTS Reading Passages in DB: ${totalR}`);
  console.log(`IELTS Listening Sections in DB: ${totalL}`);
  console.log(`Curriculum Units in DB: ${totalU}`);
  console.log(`Diary Prompts in DB: ${totalD}`);
  console.log('====================================');
}

main()
  .catch((e) => {
    console.error('Error seeding phase 2 batch 4c:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
