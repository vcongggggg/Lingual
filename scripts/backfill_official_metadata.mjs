import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SAMPLES_DIR = 'C:/Mod/muse-data-exchange/results/official-samples';

function makeId(filename) {
  const base = filename.replace(/\.json$/, '');
  const clean = base
    .replace(/^bc-academic-reading-/, 'bc-')
    .replace(/^cambridge-academic-reading-/, 'cambridge-acad-')
    .replace(/^cambridge-gt-reading-/, 'cambridge-gt-');
  return `ielts-r-off-${clean}`;
}

async function main() {
  console.log('=== STARTING BACKFILL OFFICIAL SAMPLES METADATA ===\n');

  const files = fs.readdirSync(SAMPLES_DIR).filter(f => f.endsWith('.json')).sort();
  console.log(`Found ${files.length} official sample files.\n`);

  let updatedCount = 0;

  for (const f of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(SAMPLES_DIR, f), 'utf-8'));
    const id = makeId(f);
    const moduleType = raw.module || 'Academic';
    const notes = raw.notes || null;
    const sourceUrl = raw.source_url || null;

    const res = await prisma.$executeRawUnsafe(
      'UPDATE "ielts_reading_passages" SET "module" = $1, "notes" = $2, "source_url" = $3 WHERE "id" = $4',
      moduleType,
      notes,
      sourceUrl,
      id
    );

    if (res > 0) {
      updatedCount += res;
      console.log(`[UPDATED] ${id} | Module: ${moduleType} | Notes: ${notes ? 'YES' : 'NULL'} | SourceUrl: ${sourceUrl ? 'YES' : 'NULL'}`);
    } else {
      console.warn(`[NOT FOUND] ID ${id} not found in DB`);
    }
  }

  console.log(`\n=== BACKFILL STATS ===`);
  console.log(`Total files read: ${files.length}`);
  console.log(`Total rows updated: ${updatedCount}`);

  // Verification step
  console.log('\n=== VERIFICATION (SELECT COUNT) ===');
  const counts = await prisma.$queryRawUnsafe(`
    SELECT 
      count(*) as total_official,
      count(module) as has_module,
      count(notes) as has_notes,
      count(source_url) as has_source_url
    FROM ielts_reading_passages
    WHERE id LIKE 'ielts-r-off-%';
  `);
  console.log('Verification counts:', counts);

  // Spot-check 3 records:
  // 1. Anti-aging (diagram / flow-chart)
  // 2. BC traffic (matching-headings)
  // 3. Cambridge type4 (matching-information)
  console.log('\n=== SPOT CHECK 3 RECORDS ===');
  const spotIds = [
    'ielts-r-off-bc-flow-chart-completion-anti-aging',
    'ielts-r-off-bc-matching-headings-traffic-behavior',
    'ielts-r-off-cambridge-acad-type4-matching-information'
  ];

  for (const sId of spotIds) {
    const row = await prisma.$queryRawUnsafe(
      'SELECT id, title, module, notes, source_url FROM ielts_reading_passages WHERE id = $1',
      sId
    );
    console.log(`\n--- Spot: ${sId} ---`);
    if (row && row[0]) {
      console.log('Title:', row[0].title);
      console.log('Module:', row[0].module);
      console.log('Notes:', row[0].notes?.slice(0, 120) + '...');
      console.log('Source URL:', row[0].source_url);
    } else {
      console.error('NOT FOUND:', sId);
    }
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
