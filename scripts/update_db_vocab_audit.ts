import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const DATA_PATH = path.join(__dirname, '../data/standardized/vocab-bulk.json');

async function main() {
  console.log('🚀 Updating PostgreSQL vocabularies from standardized JSON...');
  const records = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  console.log(`Loaded ${records.length} records from vocab-bulk.json.`);

  let updatedCount = 0;
  const BATCH_SIZE = 200;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    await prisma.$transaction(
      batch.map((item: any) =>
        prisma.vocabulary.updateMany({
          where: { targetText: item.targetText },
          data: {
            translation: item.translation,
            exampleSentence: item.exampleSentence || null,
            exampleTranslation: item.exampleTranslation || null,
            exampleAudioUrl: item.exampleAudioUrl || null,
          },
        })
      )
    );
    updatedCount += batch.length;
    if (updatedCount % 1000 === 0 || updatedCount === records.length) {
      console.log(`  Updated [${updatedCount}/${records.length}] vocabularies...`);
    }
  }

  // Verification
  const underwear = await prisma.vocabulary.findFirst({
    where: { targetText: { equals: 'underwear', mode: 'insensitive' } },
  });
  console.log('Verification - underwear:', {
    exampleSentence: underwear?.exampleSentence,
    exampleTranslation: underwear?.exampleTranslation,
    exampleAudioUrl: underwear?.exampleAudioUrl,
  });

  const evolution = await prisma.vocabulary.findFirst({
    where: { targetText: { equals: 'evolution', mode: 'insensitive' } },
  });
  console.log('Verification - evolution:', {
    exampleSentence: evolution?.exampleSentence,
    exampleTranslation: evolution?.exampleTranslation,
    exampleAudioUrl: evolution?.exampleAudioUrl,
  });

  const totalWithExAudio = await prisma.vocabulary.count({
    where: { exampleAudioUrl: { not: null } },
  });
  console.log(`Total words with exampleAudioUrl in DB: ${totalWithExAudio}`);

  console.log('✅ PostgreSQL vocabularies successfully updated!');
}

main()
  .catch((e) => {
    console.error('Error updating vocabularies:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
