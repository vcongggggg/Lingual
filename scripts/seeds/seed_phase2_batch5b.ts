import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, '../data/phase2_all');

async function main() {
  console.log('🚀 Seeding Phase 2 Batch 5B to PostgreSQL...');

  // 1. Dialogues batch 3 (28 dialogues)
  const dlgRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'dialogues-batch3.json'), 'utf-8'));
  const existingDlg = new Set((await prisma.dialogueScenario.findMany({ select: { id: true } })).map((d) => d.id));
  const newDlg = dlgRaw
    .filter((d: any) => !existingDlg.has(d.id))
    .map((d: any) => ({
      id: d.id,
      title: d.title,
      titleVi: d.titleVi || null,
      topic: d.topic || null,
      topicVi: d.topicVi || null,
      location: d.location || null,
      locationVi: d.locationVi || null,
      characters: d.characters ? (typeof d.characters === 'string' ? d.characters : JSON.stringify(d.characters)) : null,
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
  console.log(`✅ Dialogues: Inserted ${newDlg.length} new records (Dedupe: ${dlgRaw.length - newDlg.length} skipped)`);

  // 2. Content Packages batch 4 & 5 (30 + 30 = 60 packages)
  const pkg4 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'content-packages-batch4.json'), 'utf-8'));
  const pkg5 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'content-packages-batch5.json'), 'utf-8'));
  const allPkgs = [...pkg4, ...pkg5];
  const existingPkg = new Set((await prisma.contentPackage.findMany({ select: { id: true } })).map((p) => p.id));
  const newPkgs = allPkgs
    .filter((p: any) => !existingPkg.has(p.id))
    .map((p: any) => ({
      id: p.id,
      topic: p.topic || null,
      topicVi: p.topicVi || null,
      cefrLevel: p.cefrLevel || 'A2',
      dialogueJson: JSON.stringify(p.dialogue || {}),
      dictationJson: JSON.stringify(p.dictation || {}),
      shadowingJson: JSON.stringify(p.shadowing || {}),
      wordOrderJson: JSON.stringify(p.wordOrder || []),
      quizJson: JSON.stringify(p.quiz || []),
      source: p.source || 'ai-generated',
      verified: Boolean(p.verified),
    }));
  if (newPkgs.length > 0) {
    await prisma.contentPackage.createMany({ data: newPkgs, skipDuplicates: true });
  }
  console.log(`✅ Content Packages: Inserted ${newPkgs.length} new records (Dedupe: ${allPkgs.length - newPkgs.length} skipped)`);

  // 3. Listening Monologues (10)
  const mnlRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'listening-monologues.json'), 'utf-8'));
  const existingMnl = new Set((await prisma.listeningMonologue.findMany({ select: { id: true } })).map((m) => m.id));
  const newMnl = mnlRaw
    .filter((m: any) => !existingMnl.has(m.id))
    .map((m: any) => ({
      id: m.id,
      title: m.title,
      titleVi: m.titleVi || null,
      cefrLevel: m.cefrLevel || 'A2',
      scriptJson: JSON.stringify(m.script || []),
      questionsJson: JSON.stringify(m.questions || []),
      source: m.source || 'ai-generated',
      verified: Boolean(m.verified),
    }));
  if (newMnl.length > 0) {
    await prisma.listeningMonologue.createMany({ data: newMnl, skipDuplicates: true });
  }
  console.log(`✅ Listening Monologues: Inserted ${newMnl.length} records`);

  // 4. Shadowing Sentences batch 3 (200)
  const shdwRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'shadowing-sentences-batch3.json'), 'utf-8'));
  const existingShdw = new Set((await prisma.shadowingSentence.findMany({ select: { id: true } })).map((s) => s.id));
  const newShdw = shdwRaw
    .filter((s: any) => !existingShdw.has(s.id))
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
  if (newShdw.length > 0) {
    await prisma.shadowingSentence.createMany({ data: newShdw, skipDuplicates: true });
  }
  console.log(`✅ Shadowing Sentences: Inserted ${newShdw.length} new records (Dedupe: ${shdwRaw.length - newShdw.length} skipped)`);

  // 5. Dictation Sentences (50)
  const dctRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'dictation-sentences.json'), 'utf-8'));
  const existingDct = new Set((await prisma.dictationSentence.findMany({ select: { id: true } })).map((d) => d.id));
  const newDct = dctRaw
    .filter((d: any) => !existingDct.has(d.id))
    .map((d: any) => ({
      id: d.id,
      textEn: d.textEn,
      textVi: d.textVi,
      trickyWordsJson: JSON.stringify(d.trickyWords || []),
      audioUrl: d.audioUrl || `/audio/listening/dictation/${d.id}.mp3`,
      cefrLevel: d.cefrLevel || 'A2',
      source: d.source || 'ai-generated',
      verified: Boolean(d.verified),
    }));
  if (newDct.length > 0) {
    await prisma.dictationSentence.createMany({ data: newDct, skipDuplicates: true });
  }
  console.log(`✅ Dictation Sentences: Inserted ${newDct.length} records`);

  // 6. Situational Phrases (200)
  const sitRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'situational-phrases.json'), 'utf-8'));
  const existingSit = new Set((await prisma.situationalPhrase.findMany({ select: { id: true } })).map((s) => s.id));
  const newSit = sitRaw
    .filter((s: any) => !existingSit.has(s.id))
    .map((s: any) => ({
      id: s.id,
      situation: s.situation,
      situationVi: s.situationVi || null,
      en: s.en,
      vi: s.vi,
      audioUrl: s.audioUrl || `/audio/listening/situational/${s.id}.mp3`,
      cefrLevel: s.cefrLevel || 'A2',
      source: s.source || 'ai-generated',
      verified: Boolean(s.verified),
    }));
  if (newSit.length > 0) {
    await prisma.situationalPhrase.createMany({ data: newSit, skipDuplicates: true });
  }
  console.log(`✅ Situational Phrases: Inserted ${newSit.length} records`);

  // 7. Business Phrases (150)
  const bizRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'business-phrases.json'), 'utf-8'));
  const existingBiz = new Set((await prisma.businessPhrase.findMany({ select: { id: true } })).map((b) => b.id));
  const newBiz = bizRaw
    .filter((b: any) => !existingBiz.has(b.id))
    .map((b: any) => ({
      id: b.id,
      category: b.category,
      categoryVi: b.categoryVi || null,
      en: b.en,
      vi: b.vi,
      exampleEn: b.exampleEn || null,
      audioUrl: b.audioUrl || `/audio/listening/business/${b.id}.mp3`,
      cefrLevel: b.cefrLevel || 'B2',
      source: b.source || 'ai-generated',
      verified: Boolean(b.verified),
    }));
  if (newBiz.length > 0) {
    await prisma.businessPhrase.createMany({ data: newBiz, skipDuplicates: true });
  }
  console.log(`✅ Business Phrases: Inserted ${newBiz.length} records`);

  // 8. Travel Phrases (150)
  const trvRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'travel-phrases.json'), 'utf-8'));
  const existingTrv = new Set((await prisma.travelPhrase.findMany({ select: { id: true } })).map((t) => t.id));
  const newTrv = trvRaw
    .filter((t: any) => !existingTrv.has(t.id))
    .map((t: any) => ({
      id: t.id,
      category: t.category,
      categoryVi: t.categoryVi || null,
      en: t.en,
      vi: t.vi,
      exampleEn: t.exampleEn || null,
      audioUrl: t.audioUrl || `/audio/listening/travel/${t.id}.mp3`,
      cefrLevel: t.cefrLevel || 'A2',
      source: t.source || 'ai-generated',
      verified: Boolean(t.verified),
    }));
  if (newTrv.length > 0) {
    await prisma.travelPhrase.createMany({ data: newTrv, skipDuplicates: true });
  }
  console.log(`✅ Travel Phrases: Inserted ${newTrv.length} records`);

  console.log('====================================');
  console.log('PHASE 2 BATCH 5B SEED VERIFICATION:');
  console.log(`Total Dialogue Scenarios: ${await prisma.dialogueScenario.count()}`);
  console.log(`Total Content Packages: ${await prisma.contentPackage.count()}`);
  console.log(`Total Listening Monologues: ${await prisma.listeningMonologue.count()}`);
  console.log(`Total Shadowing Sentences: ${await prisma.shadowingSentence.count()}`);
  console.log(`Total Dictation Sentences: ${await prisma.dictationSentence.count()}`);
  console.log(`Total Situational Phrases: ${await prisma.situationalPhrase.count()}`);
  console.log(`Total Business Phrases: ${await prisma.businessPhrase.count()}`);
  console.log(`Total Travel Phrases: ${await prisma.travelPhrase.count()}`);
  console.log('====================================');
}

main()
  .catch((e) => {
    console.error('Error seeding phase 2 batch 5b:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
