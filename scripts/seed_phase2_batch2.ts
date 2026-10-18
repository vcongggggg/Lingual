import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, '../data/phase2_batch2');

async function main() {
  console.log('🚀 Seeding Phase 2 Batch 2 to PostgreSQL...');

  // 1. Grammar questions (400)
  const grammarRaw = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'grammar-questions-batch2.json'), 'utf-8')
  );
  console.log(`Processing ${grammarRaw.length} grammar questions...`);
  const existingGQ = new Set(
    (await prisma.grammarQuestion.findMany({ select: { id: true } })).map((g) => g.id)
  );
  const newGQ = grammarRaw
    .filter((g: any) => !existingGQ.has(g.id))
    .map((g: any) => ({
      id: g.id,
      question: g.question,
      optionsJson: JSON.stringify(g.options || []),
      correctAnswer: g.correctAnswer,
      explanationVi: g.explanation || g.explanationVi || null,
      cefrLevel: g.cefrLevel || 'A2',
      topic: g.topic || null,
      topicVi: g.topicVi || null,
      skillFocus: 'grammar',
      source: g.source || 'ai-generated',
      verified: Boolean(g.verified),
    }));

  if (newGQ.length > 0) {
    await prisma.grammarQuestion.createMany({ data: newGQ, skipDuplicates: true });
  }
  console.log(`✅ Inserted ${newGQ.length} new grammar questions (Dedupe: ${grammarRaw.length - newGQ.length} skipped)`);

  // 2. Shadowing sentences (150)
  const shadowingRaw = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'shadowing-sentences-batch2.json'), 'utf-8')
  );
  console.log(`Processing ${shadowingRaw.length} shadowing sentences...`);
  const existingShadowing = new Set(
    (await prisma.shadowingSentence.findMany({ select: { id: true } })).map((s) => s.id)
  );
  const newShadowing = shadowingRaw
    .filter((s: any) => !existingShadowing.has(s.id))
    .map((s: any) => ({
      id: s.id,
      textEn: s.textEn,
      textVi: s.textVi,
      phonetic: s.phonetic || null,
      audioUrl: s.audioUrl || `/audio/shadowing/${s.id}.mp3`,
      cefrLevel: s.cefrLevel || 'A2',
      topic: s.topic || null,
      focusWords: JSON.stringify(s.focusWords || []),
      skillFocus: 'speaking',
      source: s.source || 'ai-generated',
      verified: Boolean(s.verified),
    }));

  if (newShadowing.length > 0) {
    await prisma.shadowingSentence.createMany({ data: newShadowing, skipDuplicates: true });
  }
  console.log(`✅ Inserted ${newShadowing.length} new shadowing sentences (Dedupe: ${shadowingRaw.length - newShadowing.length} skipped)`);

  // 3. Dialogue scenarios (18)
  const dialoguesRaw = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'dialogues-batch2.json'), 'utf-8')
  );
  console.log(`Processing ${dialoguesRaw.length} dialogues...`);
  const existingDlg = new Set(
    (await prisma.dialogueScenario.findMany({ select: { id: true } })).map((d) => d.id)
  );
  const newDlg = dialoguesRaw
    .filter((d: any) => !existingDlg.has(d.id))
    .map((d: any) => ({
      id: d.id,
      title: d.title,
      titleVi: d.titleVi || null,
      topic: d.topic || null,
      topicVi: d.topicVi || null,
      location: d.location || null,
      locationVi: d.locationVi || null,
      characters: d.characters
        ? typeof d.characters === 'string'
          ? d.characters
          : JSON.stringify(d.characters)
        : null,
      contextDesc: d.contextDesc || null,
      linesJson: JSON.stringify(d.lines || []),
      questionsJson: JSON.stringify(d.questions || []),
      cefrLevel: d.cefrLevel || 'B1',
      skillFocus: 'listening',
      source: d.source || 'ai-generated',
      verified: Boolean(d.verified),
    }));

  if (newDlg.length > 0) {
    await prisma.dialogueScenario.createMany({ data: newDlg, skipDuplicates: true });
  }
  console.log(`✅ Inserted ${newDlg.length} new dialogues (Dedupe: ${dialoguesRaw.length - newDlg.length} skipped)`);

  // 4. Story templates (15)
  const storiesRaw = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'story-templates-batch2.json'), 'utf-8')
  );
  console.log(`Processing ${storiesRaw.length} story templates...`);
  const existingStory = new Set(
    (await prisma.storyTemplate.findMany({ select: { id: true } })).map((s) => s.id)
  );
  const newStories = storiesRaw
    .filter((s: any) => !existingStory.has(s.id))
    .map((s: any) => ({
      id: s.id,
      title: s.title,
      titleVi: s.titleVi || null,
      mascotReaction: s.mascotReaction || 'storyteller',
      paragraphsJson: JSON.stringify(s.paragraphs || s.templateParagraphs || []),
      slotsJson: JSON.stringify(s.slots || []),
      slotHintsJson: JSON.stringify(s.slotHints || []),
      quizQuestionsJson: JSON.stringify(s.questions || []),
      cefrLevel: s.cefrLevel || 'B1',
      topic: s.topic || null,
      skillFocus: 'reading',
      source: s.source || 'ai-generated',
      verified: Boolean(s.verified),
    }));

  if (newStories.length > 0) {
    await prisma.storyTemplate.createMany({ data: newStories, skipDuplicates: true });
  }
  console.log(`✅ Inserted ${newStories.length} new story templates (Dedupe: ${storiesRaw.length - newStories.length} skipped)`);

  // Verification counts
  const totalGQ = await prisma.grammarQuestion.count();
  const totalShadowing = await prisma.shadowingSentence.count();
  const totalDlg = await prisma.dialogueScenario.count();
  const totalStory = await prisma.storyTemplate.count();

  console.log('====================================');
  console.log('PHASE 2 BATCH 2 SEED SUMMARY:');
  console.log(`Grammar Questions in DB: ${totalGQ}`);
  console.log(`Shadowing Sentences in DB: ${totalShadowing}`);
  console.log(`Dialogue Scenarios in DB: ${totalDlg}`);
  console.log(`Story Templates in DB: ${totalStory}`);
  console.log('====================================');
}

main()
  .catch((e) => {
    console.error('Error seeding phase 2 batch 2:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
