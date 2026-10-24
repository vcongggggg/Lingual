import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, '../data/phase2_all');

async function main() {
  console.log('🚀 Seeding Phase 2 Batch 5A to PostgreSQL...');

  // 1. Grammar questions batch 3 (500: gq-501 -> gq-1000)
  const gqRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'grammar-questions-batch3.json'), 'utf-8'));
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
  console.log(`✅ Grammar Questions: Inserted ${newGq.length} new records (Dedupe: ${gqRaw.length - newGq.length} skipped)`);

  // 2. Vocab C1/C2 (300) into vocabularies
  const c1c2Raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'vocab-c1c2.json'), 'utf-8'));
  const allDbVocab = await prisma.vocabulary.findMany({ select: { targetText: true } });
  const dbVocabLower = new Set(allDbVocab.map((v) => v.targetText.toLowerCase().trim()));

  const newVocab = c1c2Raw
    .filter((v: any) => !dbVocabLower.has((v.targetText || '').toLowerCase().trim()))
    .map((v: any) => ({
      id: v.id,
      cefrLevel: v.cefrLevel || 'C1',
      targetText: v.targetText,
      translation: v.translation,
      phonetic: v.phonetic || null,
      partOfSpeech: v.partOfSpeech || 'noun',
      exampleSentence: v.exampleSentence || null,
      exampleTranslation: v.exampleTranslation || null,
      audioUrl: v.audioUrl || `/audio/vocab/${v.slug}.mp3`,
      exampleAudioUrl: v.exampleAudioUrl || (v.exampleSentence ? `/audio/vocab/${v.slug}-ex.mp3` : null),
    }));
  if (newVocab.length > 0) {
    await prisma.vocabulary.createMany({ data: newVocab, skipDuplicates: true });
  }
  console.log(`✅ Vocab C1/C2: Inserted ${newVocab.length} new words into Vocabulary (Dedupe: ${c1c2Raw.length - newVocab.length} skipped)`);

  // 3. Daily Vocab Questions (300)
  const dvqRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'daily-vocab-questions.json'), 'utf-8'));
  const existingDvq = new Set((await prisma.dailyVocabQuestion.findMany({ select: { id: true } })).map((d) => d.id));
  const newDvq = dvqRaw
    .filter((d: any) => !existingDvq.has(d.id))
    .map((d: any) => ({
      id: d.id,
      type: d.type || 'en_to_vi',
      cefrLevel: d.cefrLevel || 'A2',
      question: d.question,
      optionsJson: JSON.stringify(d.options || []),
      correctAnswer: d.correctAnswer,
      explanation: d.explanation || null,
      source: d.source || 'ai-generated',
      verified: Boolean(d.verified),
    }));
  if (newDvq.length > 0) {
    await prisma.dailyVocabQuestion.createMany({ data: newDvq, skipDuplicates: true });
  }
  console.log(`✅ Daily Vocab Questions: Inserted ${newDvq.length} records`);

  // 4. Idioms (200)
  const idiomsRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'idioms.json'), 'utf-8'));
  const existingIdioms = new Set((await prisma.idiom.findMany({ select: { id: true } })).map((i) => i.id));
  const newIdioms = idiomsRaw
    .filter((i: any) => !existingIdioms.has(i.id))
    .map((i: any) => ({
      id: i.id,
      idiom: i.idiom,
      meaningVi: i.meaningVi,
      exampleEn: i.exampleEn || null,
      exampleVi: i.exampleVi || null,
      cefrLevel: i.cefrLevel || 'B2',
      source: i.source || 'ai-generated',
      verified: Boolean(i.verified),
    }));
  if (newIdioms.length > 0) {
    await prisma.idiom.createMany({ data: newIdioms, skipDuplicates: true });
  }
  console.log(`✅ Idioms: Inserted ${newIdioms.length} records`);

  // 5. Phrasal Verbs (200)
  const pvRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'phrasal-verbs.json'), 'utf-8'));
  const existingPv = new Set((await prisma.phrasalVerb.findMany({ select: { id: true } })).map((p) => p.id));
  const newPv = pvRaw
    .filter((p: any) => !existingPv.has(p.id))
    .map((p: any) => ({
      id: p.id,
      verb: p.verb,
      meaningVi: p.meaningVi,
      exampleEn: p.exampleEn || null,
      exampleVi: p.exampleVi || null,
      separable: Boolean(p.separable),
      cefrLevel: p.cefrLevel || 'B1',
      source: p.source || 'ai-generated',
      verified: Boolean(p.verified),
    }));
  if (newPv.length > 0) {
    await prisma.phrasalVerb.createMany({ data: newPv, skipDuplicates: true });
  }
  console.log(`✅ Phrasal Verbs: Inserted ${newPv.length} records`);

  // 6. Collocations (200)
  const colRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'collocations.json'), 'utf-8'));
  const existingCol = new Set((await prisma.collocation.findMany({ select: { id: true } })).map((c) => c.id));
  const newCol = colRaw
    .filter((c: any) => !existingCol.has(c.id))
    .map((c: any) => ({
      id: c.id,
      collocation: c.collocation,
      type: c.type || 'verb+noun',
      meaningVi: c.meaningVi,
      exampleEn: c.exampleEn || null,
      exampleVi: c.exampleVi || null,
      cefrLevel: c.cefrLevel || 'B1',
      source: c.source || 'ai-generated',
      verified: Boolean(c.verified),
    }));
  if (newCol.length > 0) {
    await prisma.collocation.createMany({ data: newCol, skipDuplicates: true });
  }
  console.log(`✅ Collocations: Inserted ${newCol.length} records`);

  // 7. Synonyms & Antonyms (200)
  const synRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'synonyms-antonyms.json'), 'utf-8'));
  const existingSyn = new Set((await prisma.synonymAntonym.findMany({ select: { id: true } })).map((s) => s.id));
  const newSyn = synRaw
    .filter((s: any) => !existingSyn.has(s.id))
    .map((s: any) => ({
      id: s.id,
      word: s.word,
      meaningVi: s.meaningVi,
      synonymsJson: JSON.stringify(s.synonyms || []),
      antonymsJson: JSON.stringify(s.antonyms || []),
      exampleEn: s.exampleEn || null,
      exampleVi: s.exampleVi || null,
      cefrLevel: s.cefrLevel || 'B1',
      source: s.source || 'ai-generated',
      verified: Boolean(s.verified),
    }));
  if (newSyn.length > 0) {
    await prisma.synonymAntonym.createMany({ data: newSyn, skipDuplicates: true });
  }
  console.log(`✅ Synonyms & Antonyms: Inserted ${newSyn.length} records`);

  // 8. Minimal Pairs (100)
  const mpRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'minimal-pairs.json'), 'utf-8'));
  const existingMp = new Set((await prisma.minimalPair.findMany({ select: { id: true } })).map((m) => m.id));
  const newMp = mpRaw
    .filter((m: any) => !existingMp.has(m.id))
    .map((m: any) => ({
      id: m.id,
      word1: m.word1,
      word2: m.word2,
      phonetic1: m.phonetic1 || null,
      phonetic2: m.phonetic2 || null,
      differenceVi: m.differenceVi || null,
      exampleEn: m.exampleEn || null,
      exampleVi: m.exampleVi || null,
      audioUrl1: m.audioUrl1 || `/audio/pronunciation/${m.id}-1.mp3`,
      audioUrl2: m.audioUrl2 || `/audio/pronunciation/${m.id}-2.mp3`,
      source: m.source || 'ai-generated',
      verified: Boolean(m.verified),
    }));
  if (newMp.length > 0) {
    await prisma.minimalPair.createMany({ data: newMp, skipDuplicates: true });
  }
  console.log(`✅ Minimal Pairs: Inserted ${newMp.length} records`);

  // 9. Tongue Twisters (50)
  const twRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'tongue-twisters.json'), 'utf-8'));
  const existingTw = new Set((await prisma.tongueTwister.findMany({ select: { id: true } })).map((t) => t.id));
  const newTw = twRaw
    .filter((t: any) => !existingTw.has(t.id))
    .map((t: any) => ({
      id: t.id,
      text: t.text,
      difficulty: t.difficulty || 'easy',
      focusSounds: t.focusSounds || null,
      guideVi: t.guideVi || null,
      audioUrl: t.audioUrl || `/audio/pronunciation/${t.id}.mp3`,
      source: t.source || 'ai-generated',
      verified: Boolean(t.verified),
    }));
  if (newTw.length > 0) {
    await prisma.tongueTwister.createMany({ data: newTw, skipDuplicates: true });
  }
  console.log(`✅ Tongue Twisters: Inserted ${newTw.length} records`);

  // 10. Proverbs (100)
  const prvRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'proverbs.json'), 'utf-8'));
  const existingPrv = new Set((await prisma.proverb.findMany({ select: { id: true } })).map((p) => p.id));
  const newPrv = prvRaw
    .filter((p: any) => !existingPrv.has(p.id))
    .map((p: any) => ({
      id: p.id,
      proverb: p.proverb,
      meaningVi: p.meaningVi,
      vietnameseEquivalent: p.vietnameseEquivalent || null,
      exampleEn: p.exampleEn || null,
      exampleVi: p.exampleVi || null,
      source: p.source || 'ai-generated',
      verified: Boolean(p.verified),
    }));
  if (newPrv.length > 0) {
    await prisma.proverb.createMany({ data: newPrv, skipDuplicates: true });
  }
  console.log(`✅ Proverbs: Inserted ${newPrv.length} records`);

  // 11. Game Word Pools (500)
  const gwpRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'game-word-pools.json'), 'utf-8'));
  const existingGwp = new Set((await prisma.gameWordPool.findMany({ select: { id: true } })).map((g) => g.id));
  const newGwp = gwpRaw
    .filter((g: any) => !existingGwp.has(g.id))
    .map((g: any) => ({
      id: g.id,
      targetText: g.targetText,
      translation: g.translation,
      phonetic: g.phonetic || null,
      topic: g.topic,
      topicVi: g.topicVi || null,
      cefrLevel: g.cefrLevel || 'A1',
      exampleSentence: g.exampleSentence || null,
      exampleTranslation: g.exampleTranslation || null,
      source: g.source || 'ai-generated',
      verified: Boolean(g.verified),
    }));
  if (newGwp.length > 0) {
    await prisma.gameWordPool.createMany({ data: newGwp, skipDuplicates: true });
  }
  console.log(`✅ Game Word Pools: Inserted ${newGwp.length} records`);

  // 12. Grammar Explanations (50)
  const geRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'grammar-explanations.json'), 'utf-8'));
  const existingGe = new Set((await prisma.grammarExplanation.findMany({ select: { id: true } })).map((g) => g.id));
  const newGe = geRaw
    .filter((g: any) => !existingGe.has(g.id))
    .map((g: any) => ({
      id: g.id,
      topic: g.topic,
      topicVi: g.topicVi || null,
      cefrLevel: g.cefrLevel || 'A2',
      ruleVi: g.ruleVi,
      examplesJson: JSON.stringify(g.examples || []),
      commonMistakesJson: JSON.stringify(g.commonMistakes || []),
      source: g.source || 'ai-generated',
      verified: Boolean(g.verified),
    }));
  if (newGe.length > 0) {
    await prisma.grammarExplanation.createMany({ data: newGe, skipDuplicates: true });
  }
  console.log(`✅ Grammar Explanations: Inserted ${newGe.length} records`);

  console.log('====================================');
  console.log('PHASE 2 BATCH 5A SEED VERIFICATION:');
  console.log(`Total Grammar Questions: ${await prisma.grammarQuestion.count()}`);
  console.log(`Total Vocabulary Words: ${await prisma.vocabulary.count()}`);
  console.log(`Total Daily Vocab Questions: ${await prisma.dailyVocabQuestion.count()}`);
  console.log(`Total Idioms: ${await prisma.idiom.count()}`);
  console.log(`Total Phrasal Verbs: ${await prisma.phrasalVerb.count()}`);
  console.log(`Total Collocations: ${await prisma.collocation.count()}`);
  console.log(`Total Synonyms & Antonyms: ${await prisma.synonymAntonym.count()}`);
  console.log(`Total Minimal Pairs: ${await prisma.minimalPair.count()}`);
  console.log(`Total Tongue Twisters: ${await prisma.tongueTwister.count()}`);
  console.log(`Total Proverbs: ${await prisma.proverb.count()}`);
  console.log(`Total Game Word Pools: ${await prisma.gameWordPool.count()}`);
  console.log(`Total Grammar Explanations: ${await prisma.grammarExplanation.count()}`);
  console.log('====================================');
}

main()
  .catch((e) => {
    console.error('Error seeding phase 2 batch 5a:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
