import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Load standardized JSON data
const dataPath = path.join(__dirname, '../data/standardized/vocab-bulk.json');

export interface BulkVocabItem {
  targetText: string;
  translation: string;
  phonetic?: string | null;
  partOfSpeech?: string | null;
  cefrLevel: string;
  exampleSentence?: string | null;
  exampleTranslation?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  exampleAudioUrl?: string | null;
  source: string;
  verified: boolean;
}

export const SEED_VOCAB_BULK: BulkVocabItem[] = fs.existsSync(dataPath)
  ? JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  : [];

export async function seedVocabBulk(prismaClient?: PrismaClient) {
  const prisma = prismaClient || new PrismaClient();
  const shouldDisconnect = !prismaClient;

  try {
    console.log(`🚀 Starting Bulk Vocabulary Seeding (${SEED_VOCAB_BULK.length} records available)...`);
    
    // 1. Fetch existing vocabularies to dedupe
    const existingWords = await prisma.vocabulary.findMany({
      select: { targetText: true },
    });
    const existingSet = new Set(existingWords.map((w) => w.targetText.toLowerCase().trim()));
    console.log(`Found ${existingSet.size} existing vocabularies in DB.`);

    // 2. Filter new unique records
    const newRecords = SEED_VOCAB_BULK.filter(
      (r) => !existingSet.has(r.targetText.toLowerCase().trim())
    );
    console.log(`Filtered ${newRecords.length} new unique vocabularies to insert.`);

    // 3. Insert in batches using createMany
    const BATCH_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < newRecords.length; i += BATCH_SIZE) {
      const batch = newRecords.slice(i, i + BATCH_SIZE);
      const dataToInsert = batch.map((item) => ({
        targetText: item.targetText,
        translation: item.translation,
        phonetic: item.phonetic || null,
        phoneticUs: item.phonetic || null,
        partOfSpeech: item.partOfSpeech || 'noun',
        cefrLevel: item.cefrLevel || 'B1',
        audioUrl: item.audioUrl || null,
        exampleAudioUrl: item.exampleAudioUrl || null,
        exampleSentence: item.exampleSentence || null,
        exampleTranslation: item.exampleTranslation || null,
        category: 'oxford5000',
        status: 'published',
      }));

      await prisma.vocabulary.createMany({
        data: dataToInsert,
        skipDuplicates: true,
      });

      inserted += batch.length;
      console.log(`  Inserted [${inserted}/${newRecords.length}] vocabularies...`);
    }

    const totalCount = await prisma.vocabulary.count();
    console.log(`✅ Bulk Seeding Complete! Total vocabularies now in DB: ${totalCount}`);
    return totalCount;
  } finally {
    if (shouldDisconnect) {
      await prisma.$disconnect();
    }
  }
}

if (process.argv[1]?.endsWith('seed-vocab-bulk.ts') || process.argv[1]?.endsWith('seed-vocab-bulk.js')) {
  seedVocabBulk()
    .catch((e) => {
      console.error('❌ Failed to seed vocab bulk:', e);
      process.exit(1);
    });
}
