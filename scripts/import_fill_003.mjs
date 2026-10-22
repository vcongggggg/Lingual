import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RESULTS_DIR = 'C:/Mod/muse-data-exchange/results';
const DLG_FILE = path.join(RESULTS_DIR, 'fill-003-dialogues.jsonl');
const IDM_FILE = path.join(RESULTS_DIR, 'fill-003-idioms.jsonl');

function normalize(str) {
  return (str || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

async function main() {
  console.log('=== [LINGUAFLOW FILL-003 IMPORT RUNNER] ===\n');

  // HARD GATE 1: Đọc và kiểm tra số lượng bản ghi
  if (!fs.existsSync(DLG_FILE)) throw new Error(`Missing dialogues file: ${DLG_FILE}`);
  if (!fs.existsSync(IDM_FILE)) throw new Error(`Missing idioms file: ${IDM_FILE}`);

  const rawDlgLines = fs.readFileSync(DLG_FILE, 'utf-8').trim().split('\n').filter(Boolean);
  const rawIdmLines = fs.readFileSync(IDM_FILE, 'utf-8').trim().split('\n').filter(Boolean);

  console.log(`[HARD GATE CHECK]`);
  console.log(`- Dialogues read from file: ${rawDlgLines.length} (Expected: 3)`);
  console.log(`- Idioms read from file:    ${rawIdmLines.length} (Expected: 6)`);

  if (rawDlgLines.length !== 3) {
    throw new Error(`HARD GATE FAILED: dialogues count is ${rawDlgLines.length}, expected exactly 3.`);
  }
  if (rawIdmLines.length !== 6) {
    throw new Error(`HARD GATE FAILED: idioms count is ${rawIdmLines.length}, expected exactly 6.`);
  }
  console.log(`✅ HARD GATE PASSED: File inputs exactly match 3 dialogues and 6 idioms.\n`);

  const dlgRecords = rawDlgLines.map(l => JSON.parse(l));
  const idmRecords = rawIdmLines.map(l => JSON.parse(l));

  // STEP 2: GUARD CHỐNG CHẠY LẠI (Early-exit if already imported)
  const existingDialogues = await prisma.dialogueScenario.findMany({ select: { id: true, title: true } });
  const dbDlgMap = new Map();
  existingDialogues.forEach(d => dbDlgMap.set(normalize(d.title), d.id));

  const allDlgExist = dlgRecords.every(d => dbDlgMap.has(normalize(d.title)));
  if (allDlgExist) {
    const dCount = await prisma.dialogueScenario.count();
    const iCount = await prisma.idiom.count();
    console.log(`[GUARD EARLY-EXIT] All 3 fill-003 dialogues already exist in DB. Early-exit: already imported.`);
    console.log(`Current DB Counts: Dialogues=${dCount}, Idioms=${iCount}`);
    await prisma.$disconnect();
    return {
      status: 'already_imported',
      dialoguesInserted: 0,
      idiomsInserted: 0,
      totalDialogues: dCount,
      totalIdioms: iCount,
    };
  }

  // STEP 3: DEDUPE & IMPORT DIALOGUES
  console.log('[STEP 1/2] Processing Dialogues Import...');
  const initialDlgCount = existingDialogues.length;
  console.log(`- DB Dialogues before import: ${initialDlgCount}`);

  let dlgSeq = 360; // Next seq after dlg-002-360
  const dlgToInsert = [];
  const dlgDuplicates = [];

  for (const item of dlgRecords) {
    const norm = normalize(item.title);
    if (dbDlgMap.has(norm)) {
      dlgDuplicates.push({ title: item.title, matchedId: dbDlgMap.get(norm) });
    } else {
      dlgSeq++;
      const id = `dlg-002-${dlgSeq.toString().padStart(3, '0')}`;
      const formattedLines = (item.lines || []).map((l, lIdx) => ({
        id: `line-${lIdx + 1}`,
        speaker: l.speaker,
        en: l.en,
        textEn: l.en,
        textVi: '',
      }));

      dlgToInsert.push({
        id,
        title: item.title.trim(),
        titleVi: item.vi_summary || null,
        topic: 'general_conversation',
        topicVi: 'Hội thoại đời sống',
        characters: JSON.stringify(item.speakers || []),
        contextDesc: item.vi_summary || null,
        linesJson: JSON.stringify(formattedLines),
        questionsJson: '[]',
        cefrLevel: (item.level || 'B1').toUpperCase(),
        skillFocus: 'listening',
        source: item.source || 'authored',
        verified: true,
        _speakers: JSON.stringify(item.speakers || []),
        _viSummary: item.vi_summary || null,
        _level: item.level || null,
      });
    }
  }

  console.log(`- Dialogues to insert: ${dlgToInsert.length}`);
  console.log(`- Dialogues duplicates skipped: ${dlgDuplicates.length}`);

  for (const item of dlgToInsert) {
    const { _speakers, _viSummary, _level, ...coreFields } = item;
    await prisma.dialogueScenario.create({ data: coreFields });
    await prisma.$executeRawUnsafe(
      'UPDATE "dialogue_scenarios" SET "speakers" = $1, "vi_summary" = $2, "level" = $3 WHERE "id" = $4',
      _speakers,
      _viSummary,
      _level,
      item.id
    );
    console.log(`  + [INSERTED] ${item.id} | Level: ${item.cefrLevel} | Title: "${item.title}"`);
  }

  const finalDlgCount = await prisma.dialogueScenario.count();
  console.log(`✅ Final Dialogues count in DB: ${finalDlgCount} (Initial: ${initialDlgCount}, +${dlgToInsert.length})\n`);

  // STEP 4: DEDUPE & IMPORT IDIOMS
  console.log('[STEP 2/2] Processing Idioms Import...');
  const existingIdioms = await prisma.idiom.findMany({ select: { id: true, idiom: true } });
  const initialIdmCount = existingIdioms.length;
  console.log(`- DB Idioms before import: ${initialIdmCount}`);

  const dbIdmMap = new Map();
  existingIdioms.forEach(i => dbIdmMap.set(normalize(i.idiom), i.id));

  let idmSeq = initialIdmCount;
  const idmToInsert = [];
  const idmDuplicates = [];

  for (const item of idmRecords) {
    const norm = normalize(item.idiom);
    if (dbIdmMap.has(norm)) {
      const existingId = dbIdmMap.get(norm);
      idmDuplicates.push({ idiom: item.idiom, matchedId: existingId });
      // Enrich existing record meaningEn if null
      await prisma.$executeRawUnsafe(
        'UPDATE "idioms" SET "meaningEn" = COALESCE("meaningEn", $1), "license" = COALESCE("license", $2) WHERE "id" = $3',
        item.meaning_en,
        item.license || 'CC BY-SA',
        existingId
      );
    } else {
      idmSeq++;
      const id = `idm-${idmSeq.toString().padStart(3, '0')}`;
      idmToInsert.push({
        id,
        idiom: item.idiom.trim(),
        meaningVi: item.meaning_vi.trim(),
        meaningEn: item.meaning_en?.trim() || null,
        exampleEn: item.example_en?.trim() || null,
        exampleVi: item.example_vi?.trim() || null,
        cefrLevel: (item.level || 'B2').toUpperCase(),
        source: item.source || 'wiktionary',
        license: item.license || 'CC BY-SA',
        verified: true,
      });
    }
  }

  console.log(`- Idioms to insert: ${idmToInsert.length}`);
  console.log(`- Idioms duplicates in stock (enriched meaningEn): ${idmDuplicates.length}`);
  for (const d of idmDuplicates) {
    console.log(`  * Stock match: "${d.idiom}" -> existing ID: ${d.matchedId}`);
  }

  for (const item of idmToInsert) {
    await prisma.idiom.create({ data: item });
    console.log(`  + [INSERTED] ${item.id} | Level: ${item.cefrLevel} | Idiom: "${item.idiom}"`);
  }

  const finalIdmCount = await prisma.idiom.count();
  console.log(`✅ Final Idioms count in DB: ${finalIdmCount} (Initial: ${initialIdmCount}, +${idmToInsert.length})\n`);

  console.log('=== SUMMARY OF IMPORT ===');
  console.log(`Dialogues: ${initialDlgCount} -> ${finalDlgCount} (+${dlgToInsert.length})`);
  console.log(`Idioms:    ${initialIdmCount} -> ${finalIdmCount} (+${idmToInsert.length}, ${idmDuplicates.length} stock matched)`);

  await prisma.$disconnect();
  return {
    status: 'success',
    dialoguesInserted: dlgToInsert.length,
    idiomsInserted: idmToInsert.length,
    idiomsEnrichedStock: idmDuplicates.length,
    totalDialogues: finalDlgCount,
    totalIdioms: finalIdmCount,
  };
}

main().catch(err => {
  console.error('Import failed with error:', err);
  process.exit(1);
});
