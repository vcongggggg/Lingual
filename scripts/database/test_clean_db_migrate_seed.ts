import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// 1. Read POSTGRES_PASSWORD from .env
const envPath = path.resolve(__dirname, '../../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const passMatch = envContent.match(/^POSTGRES_PASSWORD=(.*)$/m);
if (!passMatch) {
  console.error('❌ Could not find POSTGRES_PASSWORD in .env');
  process.exit(1);
}
const postgresPassword = passMatch[1].trim().replace(/^["']|["']$/g, '');

const psqlPath = 'C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe';
const testDbName = 'linguaflow_clean_test';
const testDatabaseUrl = `postgresql://postgres:${postgresPassword}@localhost:5432/${testDbName}?schema=public`;

console.log('================================================================');
console.log('🧪 PRE-DEPLOY P1: CLEAN DATABASE MIGRATE & SEED VERIFICATION');
console.log('================================================================\n');

async function main() {
  // Step 1: Drop and recreate clean database
  console.log(`[1/4] Preparing fresh, empty database "${testDbName}"...`);
  const envForPsql = { ...process.env, PGPASSWORD: postgresPassword };

  try {
    execSync(`"${psqlPath}" -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS ${testDbName};"`, {
      env: envForPsql,
      stdio: 'pipe',
    });
    execSync(`"${psqlPath}" -U postgres -h localhost -p 5432 -c "CREATE DATABASE ${testDbName};"`, {
      env: envForPsql,
      stdio: 'pipe',
    });
    console.log(`✅ Fresh database "${testDbName}" created successfully.\n`);
  } catch (err: any) {
    console.error(`❌ Failed to recreate database "${testDbName}":`, err.message);
    process.exit(1);
  }

  const envWithTestDb = {
    ...process.env,
    DATABASE_URL: testDatabaseUrl,
  };

  // Step 2: Run migrate deploy and measure time
  console.log('[2/4] Executing "prisma migrate deploy" on clean DB...');
  const migrateStart = Date.now();
  try {
    const migrateOutput = execSync('pnpm exec prisma migrate deploy', {
      env: envWithTestDb,
      stdio: 'pipe',
      encoding: 'utf-8',
    });
    console.log(migrateOutput.trim());
  } catch (err: any) {
    console.error('❌ Migration failed:', err.stdout || err.message);
    process.exit(1);
  }
  const migrateEnd = Date.now();
  const migrateDurationMs = migrateEnd - migrateStart;
  const migrateDurationSec = (migrateDurationMs / 1000).toFixed(2);
  console.log(`⏱️ Total Migration Time: ${migrateDurationSec}s (${migrateDurationMs} ms)\n`);

  // Step 3: Run seed scripts and measure time
  console.log('[3/4] Executing Full Seeding Pipeline (Phase 1 + Phase 2)...');
  const seedScripts = [
    { name: 'Phase 1 Master Seed (Vocab Bulk 5113, Units, IELTS Tracks)', file: 'prisma/seed.ts' },
    { name: 'Phase 2 Catch-up (Grammar, Dialogues, Stories, etc.)', file: 'scripts/seeds/seed_catchup.ts' },
    { name: 'Phase 2 Batch 2 (Grammar, Shadowing, Idioms, Diary)', file: 'scripts/seeds/seed_phase2_batch2.ts' },
    { name: 'Phase 2 Batch 4B (Content Packages, Articles, Idioms)', file: 'scripts/seeds/seed_phase2_batch4b.ts' },
    { name: 'Phase 2 Batch 4C (IELTS Reading/Listening, Diary, Shadowing)', file: 'scripts/seeds/seed_phase2_batch4c.ts' },
    { name: 'Phase 2 Batch 5A (Grammar Batch 3, Vocab C1/C2, Dialogues)', file: 'scripts/seeds/seed_phase2_batch5a.ts' },
    { name: 'Phase 2 Batch 5B (Dialogues, Content Packages, Articles)', file: 'scripts/seeds/seed_phase2_batch5b.ts' },
    { name: 'Phase 2 Batch 5C (IELTS Speaking/Writing, Stories, Articles)', file: 'scripts/seeds/seed_phase2_batch5c.ts' },
  ];

  const seedStart = Date.now();
  for (const [idx, item] of seedScripts.entries()) {
    console.log(`  -> Running [${idx + 1}/${seedScripts.length}]: ${item.name}...`);
    const scriptStart = Date.now();
    try {
      execSync(`pnpm exec tsx ${item.file}`, {
        env: envWithTestDb,
        stdio: 'pipe',
      });
      const scriptDuration = ((Date.now() - scriptStart) / 1000).toFixed(2);
      console.log(`     ✅ Completed in ${scriptDuration}s`);
    } catch (err: any) {
      console.error(`❌ Seeding failed at ${item.file}:`, err.stdout || err.message);
      process.exit(1);
    }
  }
  const seedEnd = Date.now();
  const seedDurationMs = seedEnd - seedStart;
  const seedDurationSec = (seedDurationMs / 1000).toFixed(2);
  console.log(`\n⏱️ Total Seeding Time: ${seedDurationSec}s (${seedDurationMs} ms)\n`);

  // Step 4: Verify and log row counts
  console.log('[4/4] Verifying Row Counts across Major Tables...');
  const testPrisma = new PrismaClient({
    datasources: {
      db: {
        url: testDatabaseUrl,
      },
    },
  });

  const tableQueries: { model: string; label: string; minExpected: number }[] = [
    { model: 'vocabulary', label: 'Vocabulary Items', minExpected: 5113 },
    { model: 'grammarQuestion', label: 'Grammar Questions', minExpected: 100 },
    { model: 'dialogueScenario', label: 'Dialogue Scenarios', minExpected: 10 },
    { model: 'ieltsReadingPassage', label: 'IELTS Reading Passages', minExpected: 5 },
    { model: 'ieltsListeningSection', label: 'IELTS Listening Sections', minExpected: 5 },
    { model: 'contentPackage', label: 'Content Packages', minExpected: 10 },
    { model: 'bilingualArticle', label: 'Bilingual Articles', minExpected: 10 },
    { model: 'shadowingSentence', label: 'Shadowing Sentences', minExpected: 50 },
    { model: 'idiom', label: 'Idioms & Phrases', minExpected: 30 },
    { model: 'diaryPrompt', label: 'Diary Prompts', minExpected: 60 },
    { model: 'curriculumUnit', label: 'Curriculum Units', minExpected: 10 },
    { model: 'storyTemplate', label: 'Story Templates', minExpected: 5 },
    { model: 'bilingualStory', label: 'Bilingual Stories', minExpected: 5 },
    { model: 'ieltsSpeakingTopic', label: 'IELTS Speaking Topics', minExpected: 10 },
    { model: 'ieltsWritingTopic', label: 'IELTS Writing Topics', minExpected: 10 },
    { model: 'user', label: 'Users', minExpected: 1 },
    { model: 'unit', label: 'Units', minExpected: 1 },
    { model: 'lesson', label: 'Lessons', minExpected: 1 },
    { model: 'ieltsTrack', label: 'IELTS Tracks', minExpected: 1 },
    { model: 'ieltsQuestion', label: 'IELTS Questions', minExpected: 1 },
  ];

  const results: Record<string, number> = {};
  let allPass = true;

  console.log('----------------------------------------------------------------');
  console.log(String('Table Name').padEnd(28) + String('Row Count').padStart(12) + String('Min Expected').padStart(16) + '   Status');
  console.log('----------------------------------------------------------------');

  for (const item of tableQueries) {
    try {
      const count = await (testPrisma as any)[item.model].count();
      results[item.model] = count;
      const isOk = count >= item.minExpected;
      if (!isOk) allPass = false;
      const statusStr = isOk ? '✅ PASS' : '❌ FAIL';
      console.log(
        item.label.padEnd(28) +
        String(count).padStart(12) +
        String(item.minExpected).padStart(16) +
        `   ${statusStr}`
      );
    } catch (err: any) {
      console.error(`Error querying ${item.model}:`, err.message);
      allPass = false;
    }
  }
  console.log('----------------------------------------------------------------\n');

  await testPrisma.$disconnect();

  // Save report artifact
  const report = {
    timestamp: new Date().toISOString(),
    database: testDbName,
    migrateDurationSec: parseFloat(migrateDurationSec),
    migrateDurationMs,
    seedDurationSec: parseFloat(seedDurationSec),
    seedDurationMs,
    tableCounts: results,
    allPassed: allPass,
  };

  fs.writeFileSync(
    path.resolve(__dirname, '../test_clean_db_report.json'),
    JSON.stringify(report, null, 2),
    'utf-8'
  );

  // Clean up database
  console.log(`Cleaning up temporary database "${testDbName}"...`);
  try {
    execSync(`"${psqlPath}" -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS ${testDbName};"`, {
      env: envForPsql,
      stdio: 'pipe',
    });
    console.log(`✅ Temporary test database dropped successfully.\n`);
  } catch (err: any) {
    console.warn('Warning: Could not drop test database:', err.message);
  }

  if (allPass) {
    console.log('🎉 ALL CLEAN DATABASE MIGRATE & SEED TESTS PASSED 100%!');
  } else {
    console.error('❌ Some table counts did not meet minimum expectations.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
