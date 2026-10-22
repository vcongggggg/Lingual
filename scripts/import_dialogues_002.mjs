import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import readline from 'node:readline';

const prisma = new PrismaClient();

const DATA_DIR = 'C:/Mod/muse-data-exchange/results';
const FILES = [
  `${DATA_DIR}/dialogues-002-p1.jsonl`,
  `${DATA_DIR}/dialogues-002-p2.jsonl`,
  `${DATA_DIR}/dialogues-002-p3.jsonl`,
  `${DATA_DIR}/dialogues-002-p4.jsonl`,
];

function normalize(text) {
  return (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

async function readJsonl(filePath) {
  const records = [];
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    records.push(JSON.parse(trimmed));
  }
  return records;
}

async function main() {
  console.log('====================================================');
  console.log(' DIALOGUES-002 IMPORT RUNNER (4 files x 91 = 364)');
  console.log('====================================================\n');

  // STEP 0: Thêm các cột mở rộng an toàn vào DB
  console.log('[0/4] Chuẩn bị DB schema: Thêm các cột mở rộng an toàn...');
  await prisma.$executeRawUnsafe('ALTER TABLE "dialogue_scenarios" ADD COLUMN IF NOT EXISTS "speakers" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "dialogue_scenarios" ADD COLUMN IF NOT EXISTS "vi_summary" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "dialogue_scenarios" ADD COLUMN IF NOT EXISTS "level" TEXT;');
  console.log('✅ DB schema đã sẵn sàng.\n');

  // STEP 1: Đọc và đếm độc lập từ 4 file JSONL
  console.log('[1/4] Đọc dữ liệu độc lập từ 4 file JSONL:');
  const allRaw = [];
  const byLevel = { A2: 0, B1: 0, B2: 0, C1: 0 };

  for (let i = 0; i < FILES.length; i++) {
    const records = await readJsonl(FILES[i]);
    console.log(`- File p${i + 1} (${FILES[i]}): ${records.length} records`);
    for (const r of records) {
      allRaw.push(r);
      const lvl = r.level?.toUpperCase();
      if (byLevel[lvl] !== undefined) byLevel[lvl]++;
    }
  }

  console.log(`- Tổng cộng đã đọc: ${allRaw.length} records (Kỳ vọng: 364)`);
  console.log(`- Phân bổ theo Level: A2=${byLevel.A2}, B1=${byLevel.B1}, B2=${byLevel.B2}, C1=${byLevel.C1}\n`);

  if (allRaw.length !== 364) {
    throw new Error(`Số lượng bản ghi không khớp kỳ vọng! Đọc được: ${allRaw.length}`);
  }

  // STEP 2: Deduplication 2 lớp
  console.log('[2/4] Thực hiện Deduplication 2 lớp:');
  const dbDialogues = await prisma.dialogueScenario.findMany({ select: { id: true, title: true } });
  console.log(`- DB hiện có trước import: ${dbDialogues.length} dialogues`);

  const dbTitlesSet = new Set(dbDialogues.map((d) => normalize(d.title)));
  const internalTitlesSet = new Set();

  const toInsert = [];
  const dropped = [];

  let seq = 0;
  for (const item of allRaw) {
    const norm = normalize(item.title);
    if (internalTitlesSet.has(norm)) {
      dropped.push({ reason: 'internal_duplicate', level: item.level, title: item.title });
      continue;
    }
    internalTitlesSet.add(norm);

    if (dbTitlesSet.has(norm)) {
      dropped.push({ reason: 'db_existing_duplicate', level: item.level, title: item.title });
      continue;
    }

    seq++;
    const id = `dlg-002-${seq.toString().padStart(3, '0')}`;

    // Format lines: bảo toàn nguyên vẹn { speaker, en }, đồng thời bổ sung textEn & id để tương thích ngược 100%
    const formattedLines = (item.lines || []).map((l, lIdx) => ({
      id: `line-${lIdx + 1}`,
      speaker: l.speaker,
      en: l.en,
      textEn: l.en,
      textVi: '',
    }));

    toInsert.push({
      id,
      title: item.title,
      titleVi: item.vi_summary || null,
      topic: 'general_conversation',
      topicVi: 'Hội thoại đời sống',
      location: null,
      locationVi: null,
      characters: JSON.stringify(item.speakers || []),
      contextDesc: item.vi_summary || null,
      linesJson: JSON.stringify(formattedLines),
      questionsJson: '[]',
      cefrLevel: (item.level || 'B1').toUpperCase(),
      skillFocus: 'listening',
      source: item.source || 'authored',
      verified: true,
      // Extra fields
      _speakers: JSON.stringify(item.speakers || []),
      _viSummary: item.vi_summary || null,
      _level: item.level || null,
    });
  }

  console.log(`- Đã đọc:      ${allRaw.length}`);
  console.log(`- Bỏ qua:      ${dropped.length} (Trùng lặp kho cũ)`);
  console.log(`- Sẽ import:   ${toInsert.length}\n`);

  if (dropped.length > 0) {
    console.log('Chi tiết các bài trùng lặp kho cũ đã bỏ qua:');
    dropped.forEach((d, i) => console.log(`  ${i + 1}. [${d.level}] ${d.title} (${d.reason})`));
    console.log('');
  }

  // STEP 3: Nạp dữ liệu vào PostgreSQL
  console.log('[3/4] Thực hiện nạp dữ liệu vào PostgreSQL...');

  const prismaRecords = toInsert.map(({ _speakers, _viSummary, _level, ...fields }) => fields);

  // Insert theo batch 100 records
  for (let i = 0; i < prismaRecords.length; i += 100) {
    const chunk = prismaRecords.slice(i, i + 100);
    await prisma.dialogueScenario.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  // Cập nhật các trường mở rộng
  for (const item of toInsert) {
    await prisma.$executeRawUnsafe(
      'UPDATE "dialogue_scenarios" SET "speakers" = $1, "vi_summary" = $2, "level" = $3 WHERE "id" = $4',
      item._speakers,
      item._viSummary,
      item._level,
      item.id
    );
  }
  console.log(`✅ Đã nạp thành công ${toInsert.length} bản ghi vào dialogue_scenarios.\n`);

  // STEP 4: Kiểm tra và xác minh sau import
  console.log('[4/4] Kiểm tra số lượng trong DB sau Import:');
  const finalCount = await prisma.dialogueScenario.count();
  console.log(`- Total Dialogue Scenarios: ${finalCount} (Trước: ${dbDialogues.length}, +${toInsert.length})\n`);

  // Spot-check 2 mẫu (1 A2, 1 C1)
  console.log('--- SPOT CHECK 2 MẪU TỪ DB (1 A2, 1 C1) ---');
  const sampleA2 = toInsert.find((d) => d.cefrLevel === 'A2');
  const sampleC1 = toInsert.find((d) => d.cefrLevel === 'C1');

  const spotA2 = await prisma.$queryRawUnsafe(
    'SELECT id, title, "titleVi", "cefrLevel", level, speakers, "linesJson", vi_summary FROM "dialogue_scenarios" WHERE id = $1',
    sampleA2?.id || 'dlg-002-001'
  );
  const parsedA2Lines = JSON.parse(spotA2[0].linesJson);
  console.log(`1. Sample A2 (${spotA2[0].id} - "${spotA2[0].title}"):`);
  console.log(`   Level: ${spotA2[0].cefrLevel} | Speakers: ${spotA2[0].speakers}`);
  console.log(`   Turns: ${parsedA2Lines.length} turns (Kỳ vọng: 8-20 turns)`);
  console.log(`   Summary: ${spotA2[0].vi_summary}`);
  console.log(`   First turn: [${parsedA2Lines[0]?.speaker}] "${parsedA2Lines[0]?.en}"\n`);

  const spotC1 = await prisma.$queryRawUnsafe(
    'SELECT id, title, "titleVi", "cefrLevel", level, speakers, "linesJson", vi_summary FROM "dialogue_scenarios" WHERE id = $1',
    sampleC1?.id
  );
  const parsedC1Lines = JSON.parse(spotC1[0].linesJson);
  console.log(`2. Sample C1 (${spotC1[0].id} - "${spotC1[0].title}"):`);
  console.log(`   Level: ${spotC1[0].cefrLevel} | Speakers: ${spotC1[0].speakers}`);
  console.log(`   Turns: ${parsedC1Lines.length} turns (Kỳ vọng: 8-20 turns)`);
  console.log(`   Summary: ${spotC1[0].vi_summary}`);
  console.log(`   First turn: [${parsedC1Lines[0]?.speaker}] "${parsedC1Lines[0]?.en}"\n`);

  console.log('🎉 IMPORT DIALOGUES-002 HOÀN TẤT THÀNH CÔNG RỰC RỠ!');

  return {
    read: allRaw.length,
    byLevel,
    droppedCount: dropped.length,
    dropped,
    importedCount: toInsert.length,
    finalDbCount: finalCount,
    spotA2: {
      id: spotA2[0].id,
      title: spotA2[0].title,
      level: spotA2[0].cefrLevel,
      turns: parsedA2Lines.length,
      summary: spotA2[0].vi_summary,
    },
    spotC1: {
      id: spotC1[0].id,
      title: spotC1[0].title,
      level: spotC1[0].cefrLevel,
      turns: parsedC1Lines.length,
      summary: spotC1[0].vi_summary,
    },
  };
}

main()
  .then((report) => {
    fs.writeFileSync('scratch/import_dialogues_002_report.json', JSON.stringify(report, null, 2), 'utf-8');
  })
  .catch((err) => {
    console.error('Lỗi quy trình import dialogues:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
