import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, '../data/phase2_all');

async function main() {
  console.log('🚀 Seeding Catch-up Batch (Đợt 1/2/3) to PostgreSQL...');

  // 1. Grammar Questions (100)
  const gqRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'grammar-questions.json'), 'utf-8'));
  const existingGq = new Set((await prisma.grammarQuestion.findMany({ select: { id: true } })).map((g) => g.id));
  const newGq = gqRaw
    .filter((g: any) => !existingGq.has(g.id))
    .map((g: any) => ({
      id: g.id,
      question: g.question,
      optionsJson: JSON.stringify(g.options || []),
      correctAnswer: g.correctAnswer,
      explanationVi: g.explanation || null,
      cefrLevel: g.cefrLevel || 'A2',
      topic: g.topic || null,
      topicVi: g.topicVi || null,
      skillFocus: 'grammar',
      source: g.source || 'ai-generated',
      verified: Boolean(g.verified),
    }));
  if (newGq.length > 0) {
    await prisma.grammarQuestion.createMany({ data: newGq, skipDuplicates: true });
  }
  console.log(`✅ Grammar Questions: Inserted ${newGq.length} catch-up records`);

  // 2. Dialogues (10)
  const dlgRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'dialogues.json'), 'utf-8'));
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
      cefrLevel: d.cefrLevel || 'A2',
      skillFocus: 'listening',
      source: d.source || 'ai-generated',
      verified: Boolean(d.verified),
    }));
  if (newDlg.length > 0) {
    await prisma.dialogueScenario.createMany({ data: newDlg, skipDuplicates: true });
  }
  console.log(`✅ Dialogues: Inserted ${newDlg.length} catch-up records`);

  // 3. Story Templates (10)
  const tmplRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'story-templates.json'), 'utf-8'));
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
      cefrLevel: t.cefrLevel || 'A2',
      topic: t.topic || null,
      skillFocus: 'reading',
      source: t.source || 'ai-generated',
      verified: Boolean(t.verified),
    }));
  if (newTmpl.length > 0) {
    await prisma.storyTemplate.createMany({ data: newTmpl, skipDuplicates: true });
  }
  console.log(`✅ Story Templates: Inserted ${newTmpl.length} catch-up records`);

  // 4. Content Packages (10)
  const pkgRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'content-packages.json'), 'utf-8'));
  const existingPkg = new Set((await prisma.contentPackage.findMany({ select: { id: true } })).map((p) => p.id));
  const newPkg = pkgRaw
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
  if (newPkg.length > 0) {
    await prisma.contentPackage.createMany({ data: newPkg, skipDuplicates: true });
  }
  console.log(`✅ Content Packages: Inserted ${newPkg.length} catch-up records`);

  // 5. Bilingual Articles (10)
  const artRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'bilingual-articles.json'), 'utf-8'));
  const existingArt = new Set((await prisma.bilingualArticle.findMany({ select: { id: true } })).map((a) => a.id));
  const newArt = artRaw
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
  console.log(`✅ Bilingual Articles: Inserted ${newArt.length} catch-up records`);

  // 6. IELTS Reading (5)
  const rRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'ielts-reading.json'), 'utf-8'));
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
  console.log(`✅ IELTS Reading: Inserted ${newR.length} catch-up records`);

  // 7. IELTS Listening (5)
  const lRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'ielts-listening.json'), 'utf-8'));
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
  console.log(`✅ IELTS Listening: Inserted ${newL.length} catch-up records`);

  // 8. Curriculum Units (10: unit-11 -> unit-20)
  const uRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'curriculum-units.json'), 'utf-8'));
  const existingU = new Set((await prisma.curriculumUnit.findMany({ select: { id: true } })).map((u) => u.id));
  const newU = uRaw
    .filter((u: any) => !existingU.has(u.id))
    .map((u: any) => ({
      id: u.id,
      order: u.order,
      cefrLevel: u.cefrLevel || 'A2',
      title: u.title,
      titleVi: u.titleVi || null,
      description: u.description || '',
      descriptionVi: u.descriptionVi || null,
      lessonsJson: JSON.stringify(u.lessons || []),
      source: u.source || 'ai-generated',
      verified: Boolean(u.verified),
    }));
  if (newU.length > 0) {
    await prisma.curriculumUnit.createMany({ data: newU, skipDuplicates: true });
  }
  console.log(`✅ Curriculum Units: Inserted ${newU.length} catch-up records`);

  // 9. Diary Prompts (60: diary-001 -> diary-060)
  const dRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'diary-prompts.json'), 'utf-8'));
  const existingD = new Set((await prisma.diaryPrompt.findMany({ select: { id: true } })).map((d) => d.id));
  const newD = dRaw
    .filter((d: any) => !existingD.has(d.id))
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
  if (newD.length > 0) {
    await prisma.diaryPrompt.createMany({ data: newD, skipDuplicates: true });
  }
  console.log(`✅ Diary Prompts: Inserted ${newD.length} catch-up records`);

  // 10. Shadowing Sentences (50: shdw-a2-001 -> shdw-a2-050)
  const sRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'shadowing-sentences.json'), 'utf-8'));
  const existingS = new Set((await prisma.shadowingSentence.findMany({ select: { id: true } })).map((s) => s.id));
  const newS = sRaw
    .filter((s: any) => !existingS.has(s.id))
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
  if (newS.length > 0) {
    await prisma.shadowingSentence.createMany({ data: newS, skipDuplicates: true });
  }
  console.log(`✅ Shadowing Sentences: Inserted ${newS.length} catch-up records`);

  console.log('====================================');
  console.log('FINAL CATCH-UP VERIFICATION:');
  console.log(`Total Grammar Questions: ${await prisma.grammarQuestion.count()}`);
  console.log(`Total Dialogue Scenarios: ${await prisma.dialogueScenario.count()}`);
  console.log(`Total Story Templates: ${await prisma.storyTemplate.count()}`);
  console.log(`Total Content Packages: ${await prisma.contentPackage.count()}`);
  console.log(`Total Bilingual Articles: ${await prisma.bilingualArticle.count()}`);
  console.log(`Total IELTS Reading Passages: ${await prisma.ieltsReadingPassage.count()}`);
  console.log(`Total IELTS Listening Sections: ${await prisma.ieltsListeningSection.count()}`);
  console.log(`Total Curriculum Units: ${await prisma.curriculumUnit.count()} (Full 60 units roadmap!)`);
  console.log(`Total Diary Prompts: ${await prisma.diaryPrompt.count()} (Full 360 diary prompts!)`);
  console.log(`Total Shadowing Sentences: ${await prisma.shadowingSentence.count()}`);
  console.log('====================================');
}

main()
  .catch((e) => {
    console.error('Error seeding catch-up batch:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
