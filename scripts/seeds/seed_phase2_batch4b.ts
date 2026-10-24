import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, '../data/phase2_all');

async function main() {
  console.log('🚀 Seeding Phase 2 Batch 4B to PostgreSQL...');

  // 1. Content Packages (Batch 2 & 3: 25 + 25 = 50 packages)
  const pkgsBatch2 = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'content-packages-batch2.json'), 'utf-8')
  );
  const pkgsBatch3 = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'content-packages-batch3.json'), 'utf-8')
  );
  const allPkgsRaw = [...pkgsBatch2, ...pkgsBatch3];
  console.log(`Processing ${allPkgsRaw.length} content packages (25 from batch2 + 25 from batch3)...`);

  const existingPkgs = new Set(
    (await prisma.contentPackage.findMany({ select: { id: true } })).map((p) => p.id)
  );

  const newPkgs = allPkgsRaw
    .filter((p: any) => !existingPkgs.has(p.id))
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
  console.log(`✅ Content Packages: Inserted ${newPkgs.length} new records (Dedupe: ${allPkgsRaw.length - newPkgs.length} skipped)`);

  // 2. Bilingual Articles (Batch 2 & 3: 20 + 20 = 40 articles)
  const articlesBatch2 = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'bilingual-articles-batch2.json'), 'utf-8')
  );
  const articlesBatch3 = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'bilingual-articles-batch3.json'), 'utf-8')
  );
  const allArticlesRaw = [...articlesBatch2, ...articlesBatch3];
  console.log(`Processing ${allArticlesRaw.length} bilingual articles (20 from batch2 + 20 from batch3)...`);

  const existingArticles = new Set(
    (await prisma.bilingualArticle.findMany({ select: { id: true } })).map((a) => a.id)
  );

  const newArticles = allArticlesRaw
    .filter((a: any) => !existingArticles.has(a.id))
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

  if (newArticles.length > 0) {
    await prisma.bilingualArticle.createMany({ data: newArticles, skipDuplicates: true });
  }
  console.log(`✅ Bilingual Articles: Inserted ${newArticles.length} new records (Dedupe: ${allArticlesRaw.length - newArticles.length} skipped)`);

  // 3. Bilingual Stories (9 stories)
  const storiesRaw = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'bilingual-stories.json'), 'utf-8')
  );
  console.log(`Processing ${storiesRaw.length} bilingual stories...`);

  const existingStories = new Set(
    (await prisma.bilingualStory.findMany({ select: { id: true } })).map((s) => s.id)
  );

  const newStories = storiesRaw
    .filter((s: any) => !existingStories.has(s.id))
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

  if (newStories.length > 0) {
    await prisma.bilingualStory.createMany({ data: newStories, skipDuplicates: true });
  }
  console.log(`✅ Bilingual Stories: Inserted ${newStories.length} new records (Dedupe: ${storiesRaw.length - newStories.length} skipped)`);

  // 4. Verification counts
  const totalPkgs = await prisma.contentPackage.count();
  const totalArticles = await prisma.bilingualArticle.count();
  const totalStories = await prisma.bilingualStory.count();

  console.log('====================================');
  console.log('PHASE 2 BATCH 4B SEED VERIFICATION:');
  console.log(`Content Packages in DB: ${totalPkgs}`);
  console.log(`Bilingual Articles in DB: ${totalArticles}`);
  console.log(`Bilingual Stories in DB: ${totalStories}`);
  console.log('====================================');
}

main()
  .catch((e) => {
    console.error('Error seeding phase 2 batch 4b:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
