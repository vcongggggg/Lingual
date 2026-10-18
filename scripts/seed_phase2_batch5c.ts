import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, '../data/phase2_all');

async function main() {
  console.log('🚀 Seeding Phase 2 Batch 5C to PostgreSQL...');

  // 1. IELTS Reading Passages Batch 3 (12)
  const rRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'ielts-reading-batch3.json'), 'utf-8'));
  const existingR = new Set((await prisma.ieltsReadingPassage.findMany({ select: { id: true } })).map((r) => r.id));
  const newR = rRaw
    .filter((r: any) => !existingR.has(r.id))
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
  if (newR.length > 0) {
    await prisma.ieltsReadingPassage.createMany({ data: newR, skipDuplicates: true });
  }
  console.log(`✅ IELTS Reading: Inserted ${newR.length} new passages (Dedupe: ${rRaw.length - newR.length} skipped)`);

  // 2. IELTS Listening Sections Batch 3 (12)
  const lRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'ielts-listening-batch3.json'), 'utf-8'));
  const existingL = new Set((await prisma.ieltsListeningSection.findMany({ select: { id: true } })).map((l) => l.id));
  const newL = lRaw
    .filter((l: any) => !existingL.has(l.id))
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
  if (newL.length > 0) {
    await prisma.ieltsListeningSection.createMany({ data: newL, skipDuplicates: true });
  }
  console.log(`✅ IELTS Listening: Inserted ${newL.length} new sections (Dedupe: ${lRaw.length - newL.length} skipped)`);

  // 3. IELTS Speaking Topics (150)
  const spkRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'ielts-speaking.json'), 'utf-8'));
  const existingSpk = new Set((await prisma.ieltsSpeakingTopic.findMany({ select: { id: true } })).map((s) => s.id));
  const newSpk = spkRaw
    .filter((s: any) => !existingSpk.has(s.id))
    .map((s: any) => ({
      id: s.id,
      part: s.part || 1,
      question: s.question,
      topicVi: s.topicVi || null,
      ideasJson: JSON.stringify(s.ideasVi || []),
      source: s.source || 'ai-generated',
      verified: Boolean(s.verified),
    }));
  if (newSpk.length > 0) {
    await prisma.ieltsSpeakingTopic.createMany({ data: newSpk, skipDuplicates: true });
  }
  console.log(`✅ IELTS Speaking: Inserted ${newSpk.length} topics`);

  // 4. IELTS Writing Topics (60)
  const wrtRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'ielts-writing.json'), 'utf-8'));
  const existingWrt = new Set((await prisma.ieltsWritingTopic.findMany({ select: { id: true } })).map((w) => w.id));
  const newWrt = wrtRaw
    .filter((w: any) => !existingWrt.has(w.id))
    .map((w: any) => ({
      id: w.id,
      prompt: w.prompt,
      type: w.type || 'opinion',
      typeVi: w.typeVi || null,
      outlineJson: JSON.stringify(w.outlineVi || {}),
      keyVocabJson: JSON.stringify(w.keyVocab || []),
      source: w.source || 'ai-generated',
      verified: Boolean(w.verified),
    }));
  if (newWrt.length > 0) {
    await prisma.ieltsWritingTopic.createMany({ data: newWrt, skipDuplicates: true });
  }
  console.log(`✅ IELTS Writing: Inserted ${newWrt.length} prompts`);

  // 5. Bilingual Articles Batch 4 & 5 (25 + 25 = 50)
  const art4 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'bilingual-articles-batch4.json'), 'utf-8'));
  const art5 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'bilingual-articles-batch5.json'), 'utf-8'));
  const allArt = [...art4, ...art5];
  const existingArt = new Set((await prisma.bilingualArticle.findMany({ select: { id: true } })).map((a) => a.id));
  const newArt = allArt
    .filter((a: any) => !existingArt.has(a.id))
    .map((a: any) => ({
      id: a.id,
      title: a.title,
      titleVi: a.titleVi || null,
      cefrLevel: a.cefrLevel || 'A2',
      topic: a.topic || null,
      topicVi: a.topicVi || null,
      paragraphsJson: JSON.stringify(a.paragraphs || []),
      quizJson: JSON.stringify(a.quiz || []),
      source: a.source || 'ai-generated',
      verified: Boolean(a.verified),
    }));
  if (newArt.length > 0) {
    await prisma.bilingualArticle.createMany({ data: newArt, skipDuplicates: true });
  }
  console.log(`✅ Bilingual Articles: Inserted ${newArt.length} new articles (Dedupe: ${allArt.length - newArt.length} skipped)`);

  // 6. Bilingual Stories Batch 2 (9)
  const st2 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'bilingual-stories-batch2.json'), 'utf-8'));
  const existingSt = new Set((await prisma.bilingualStory.findMany({ select: { id: true } })).map((s) => s.id));
  const newSt = st2
    .filter((s: any) => !existingSt.has(s.id))
    .map((s: any) => ({
      id: s.id,
      title: s.title,
      titleVi: s.titleVi || null,
      cefrLevel: s.cefrLevel || 'A2',
      topic: s.topic || null,
      topicVi: s.topicVi || null,
      pagesJson: JSON.stringify(s.pages || []),
      quizJson: JSON.stringify(s.quiz || []),
      source: s.source || 'ai-generated',
      verified: Boolean(s.verified),
    }));
  if (newSt.length > 0) {
    await prisma.bilingualStory.createMany({ data: newSt, skipDuplicates: true });
  }
  console.log(`✅ Bilingual Stories: Inserted ${newSt.length} new stories (Dedupe: ${st2.length - newSt.length} skipped)`);

  // 7. Story Templates Batch 3 (25)
  const tmplRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'story-templates-batch3.json'), 'utf-8'));
  const existingTmpl = new Set((await prisma.storyTemplate.findMany({ select: { id: true } })).map((t) => t.id));
  const newTmpl = tmplRaw
    .filter((t: any) => !existingTmpl.has(t.id))
    .map((t: any) => ({
      id: t.id,
      title: t.title,
      titleVi: t.titleVi || null,
      mascotReaction: t.mascotReaction || 'storyteller',
      paragraphsJson: JSON.stringify(t.paragraphs || []),
      slotsJson: JSON.stringify(t.slots || []),
      slotHintsJson: JSON.stringify(t.slotHints || []),
      quizQuestionsJson: JSON.stringify(t.questions || []),
      cefrLevel: t.cefrLevel || 'B1',
      topic: t.topic || null,
      skillFocus: 'reading',
      source: t.source || 'ai-generated',
      verified: Boolean(t.verified),
    }));
  if (newTmpl.length > 0) {
    await prisma.storyTemplate.createMany({ data: newTmpl, skipDuplicates: true });
  }
  console.log(`✅ Story Templates: Inserted ${newTmpl.length} new templates (Dedupe: ${tmplRaw.length - newTmpl.length} skipped)`);

  // 8. Curriculum Units Batch 3 (30 units, 810 words dedupe)
  const unitsRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'curriculum-units-batch3.json'), 'utf-8'));
  const allDbVocab = await prisma.vocabulary.findMany({ select: { targetText: true } });
  const dbVocabLower = new Set(allDbVocab.map((v) => v.targetText.toLowerCase().trim()));

  let totalBatch3Words = 0;
  let duplicateWordsCount = 0;
  for (const u of unitsRaw) {
    for (const l of u.lessons || []) {
      for (const w of l.words || []) {
        totalBatch3Words++;
        const wordText = (w.targetText || w.word || '').toLowerCase().trim();
        if (dbVocabLower.has(wordText)) {
          duplicateWordsCount++;
        }
      }
    }
  }
  console.log(`=== BATCH 3 UNITS VOCAB DEDUPE: Total words: ${totalBatch3Words}, Already in DB: ${duplicateWordsCount}, Unique: ${totalBatch3Words - duplicateWordsCount} ===`);

  const existingUnits = new Set((await prisma.curriculumUnit.findMany({ select: { id: true } })).map((u) => u.id));
  const newUnits = unitsRaw
    .filter((u: any) => !existingUnits.has(u.id))
    .map((u: any) => ({
      id: u.id,
      order: u.order,
      cefrLevel: u.cefrLevel || 'C1',
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
  console.log(`✅ Curriculum Units: Inserted ${newUnits.length} new units (Dedupe: ${unitsRaw.length - newUnits.length} skipped)`);

  // 9. Diary Prompts Batch 3 (180)
  const diaryRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'diary-prompts-batch3.json'), 'utf-8'));
  const existingDiary = new Set((await prisma.diaryPrompt.findMany({ select: { id: true } })).map((d) => d.id));
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
  console.log(`✅ Diary Prompts: Inserted ${newDiary.length} new prompts (Dedupe: ${diaryRaw.length - newDiary.length} skipped)`);

  console.log('====================================');
  console.log('PHASE 2 BATCH 5C SEED VERIFICATION:');
  console.log(`Total IELTS Reading Passages: ${await prisma.ieltsReadingPassage.count()} (Passages 1..24)`);
  console.log(`Total IELTS Listening Sections: ${await prisma.ieltsListeningSection.count()} (Sections 1..24)`);
  console.log(`Total IELTS Speaking Topics: ${await prisma.ieltsSpeakingTopic.count()} (150 topics)`);
  console.log(`Total IELTS Writing Topics: ${await prisma.ieltsWritingTopic.count()} (60 topics)`);
  console.log(`Total Bilingual Articles: ${await prisma.bilingualArticle.count()} (90 articles)`);
  console.log(`Total Bilingual Stories: ${await prisma.bilingualStory.count()} (18 stories)`);
  console.log(`Total Story Templates: ${await prisma.storyTemplate.count()} (40 templates)`);
  console.log(`Total Curriculum Units: ${await prisma.curriculumUnit.count()} (60 units roadmap)`);
  console.log(`Total Diary Prompts: ${await prisma.diaryPrompt.count()} (300 prompts)`);
  console.log('====================================');
}

main()
  .catch((e) => {
    console.error('Error seeding phase 2 batch 5c:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
