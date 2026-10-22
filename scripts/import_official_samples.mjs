import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();
const SAMPLES_DIR = 'C:/Mod/muse-data-exchange/results/official-samples';

function normalize(text) {
  return (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function makeId(filename) {
  const base = filename.replace(/\.json$/, '');
  const clean = base
    .replace(/^bc-academic-reading-/, 'bc-')
    .replace(/^cambridge-academic-reading-/, 'cambridge-acad-')
    .replace(/^cambridge-gt-reading-/, 'cambridge-gt-');
  return `ielts-r-off-${clean}`;
}

async function main() {
  console.log('================================================================');
  console.log(' OFFICIAL SAMPLES IMPORT RUNNER (18 files, 77 questions)');
  console.log('================================================================\n');

  // STEP 0: Thêm các cột mở rộng an toàn vào DB nếu chưa có
  console.log('[0/4] Chuẩn bị DB schema: Thêm các cột mở rộng an toàn...');
  await prisma.$executeRawUnsafe('ALTER TABLE "ielts_reading_passages" ADD COLUMN IF NOT EXISTS "module" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "ielts_reading_passages" ADD COLUMN IF NOT EXISTS "notes" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "ielts_reading_passages" ADD COLUMN IF NOT EXISTS "source_url" TEXT;');
  console.log('✅ DB schema đã sẵn sàng.\n');

  // STEP 1: Đọc và đếm 18 file
  console.log('[1/4] Đọc dữ liệu độc lập từ 18 file JSON:');
  const files = fs.readdirSync(SAMPLES_DIR).filter((f) => f.endsWith('.json')).sort();
  console.log(`Tìm thấy ${files.length} file JSON.`);

  let totalQuestionsRead = 0;
  const mappedTypeCounts = { flow_chart_mapped_to_note_completion: 0 };
  const allRecords = [];

  for (const f of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(SAMPLES_DIR, f), 'utf-8'));
    const qCount = raw.questions?.length || 0;
    totalQuestionsRead += qCount;

    // Mapping type flow_chart_completion -> note_completion theo yêu cầu spec
    const mappedQuestions = (raw.questions || []).map((q) => {
      let finalType = q.type;
      if (q.type === 'flow_chart_completion') {
        finalType = 'note_completion';
        mappedTypeCounts.flow_chart_mapped_to_note_completion++;
      }
      return {
        ...q,
        type: finalType,
        original_type: q.type !== finalType ? q.type : undefined,
      };
    });

    // Xử lý title và module
    let title = raw.title;
    if (raw.module === 'General Training' && !title.includes('General Training')) {
      title = `[General Training] ${title}`;
    }

    const id = makeId(f);

    allRecords.push({
      file: f,
      id,
      section: raw.section || 'reading',
      cefrLevel: raw.module === 'General Training' ? 'B1' : 'B2',
      difficultyBand: null, // Bắt buộc để NULL theo spec
      title,
      passageJson: JSON.stringify(raw.passage_paragraphs || []),
      questionsJson: JSON.stringify(mappedQuestions),
      source: 'official-free-sample',
      license: raw.license_note || 'official free sample',
      verified: true,
      // Extra fields
      _module: raw.module || 'Academic',
      _notes: raw.notes || null,
      _sourceUrl: raw.source_url || null,
      qCount,
    });
  }

  console.log(`- Đã đọc: ${allRecords.length} files (Kỳ vọng: 18)`);
  console.log(`- Tổng câu hỏi: ${totalQuestionsRead} câu (Kỳ vọng: 77)`);
  console.log(`- Type mapping: 'flow_chart_completion' -> 'note_completion': ${mappedTypeCounts.flow_chart_mapped_to_note_completion} câu\n`);

  if (allRecords.length !== 18 || totalQuestionsRead !== 77) {
    throw new Error(`Số lượng không khớp: files=${allRecords.length}/18, questions=${totalQuestionsRead}/77`);
  }

  // STEP 2: Dedupe với kho 60 đề hiện có trong DB
  console.log('[2/4] Thực hiện Deduplication với kho hiện có:');
  const existingRows = await prisma.ieltsReadingPassage.findMany({ select: { id: true, title: true } });
  console.log(`- DB hiện có trước import: ${existingRows.length} bài đọc (Kỳ vọng: 60)`);

  const existingTitles = new Set(existingRows.map((r) => normalize(r.title)));
  const toInsert = [];
  const dropped = [];

  for (const item of allRecords) {
    const norm = normalize(item.title);
    if (existingTitles.has(norm)) {
      dropped.push({ file: item.file, title: item.title, reason: 'db_existing_title' });
    } else {
      toInsert.push(item);
    }
  }

  console.log(`- Đã đọc:    ${allRecords.length}`);
  console.log(`- Bỏ qua:    ${dropped.length} (Trùng lặp kho cũ)`);
  console.log(`- Sẽ import: ${toInsert.length}\n`);

  // STEP 3: Nạp dữ liệu vào PostgreSQL
  console.log('[3/4] Thực hiện nạp 18 bản ghi vào bảng ielts_reading_passages...');
  const prismaRecords = toInsert.map(({ file, _module, _notes, _sourceUrl, qCount, ...fields }) => fields);

  await prisma.ieltsReadingPassage.createMany({
    data: prismaRecords,
    skipDuplicates: true,
  });

  // Cập nhật các trường mở rộng
  for (const item of toInsert) {
    await prisma.$executeRawUnsafe(
      'UPDATE "ielts_reading_passages" SET "module" = $1, "notes" = $2, "source_url" = $3 WHERE "id" = $4',
      item._module,
      item._notes,
      item._sourceUrl,
      item.id
    );
  }
  console.log(`✅ Đã nạp thành công ${toInsert.length} bản ghi vào ielts_reading_passages.\n`);

  // STEP 4: Kiểm tra và xác minh sau import
  console.log('[4/4] Kiểm tra số lượng trong DB sau Import:');
  const finalCount = await prisma.ieltsReadingPassage.count();
  console.log(`- Tổng số IELTS Reading Passages: ${finalCount} (Trước: ${existingRows.length}, +${toInsert.length}, Kỳ vọng: 78)\n`);

  // Spot-check 2 bản ghi official:
  // 1. BC matching-headings: bc-matching-headings-traffic-behavior
  // 2. Cambridge matching-information: cambridge-acad-type4-matching-information
  console.log('--- SPOT CHECK 2 BẢN GHI OFFICIAL TỪ DB ---');
  const spotBc = await prisma.ieltsReadingPassage.findFirst({
    where: { id: { contains: 'matching-headings-traffic' } },
  });
  console.log(`1. Spot check British Council (${spotBc?.id}):`);
  console.log(`   Title: "${spotBc?.title}"`);
  console.log(`   difficultyBand: ${spotBc?.difficultyBand} (Phải là null)`);
  const bcPassage = JSON.parse(spotBc?.passageJson || '[]');
  const bcQuestions = JSON.parse(spotBc?.questionsJson || '[]');
  console.log(`   Passage paragraphs: ${bcPassage.length}`);
  console.log(`   Questions: ${bcQuestions.length} câu (Type: ${bcQuestions[0]?.type})`);
  console.log(`   Question #1 answer: ${bcQuestions[0]?.answer}\n`);

  const spotCamb = await prisma.ieltsReadingPassage.findFirst({
    where: { id: { contains: 'type4-matching-information' } },
  });
  console.log(`2. Spot check Cambridge (${spotCamb?.id}):`);
  console.log(`   Title: "${spotCamb?.title}"`);
  console.log(`   difficultyBand: ${spotCamb?.difficultyBand} (Phải là null)`);
  const cambPassage = JSON.parse(spotCamb?.passageJson || '[]');
  const cambQuestions = JSON.parse(spotCamb?.questionsJson || '[]');
  console.log(`   Passage paragraphs: ${cambPassage.length}`);
  console.log(`   Questions: ${cambQuestions.length} câu (Type: ${cambQuestions[0]?.type})`);
  console.log(`   Question #1 answer: ${cambQuestions[0]?.answer}\n`);

  console.log('🎉 IMPORT OFFICIAL SAMPLES HOÀN TẤT THÀNH CÔNG RỰC RỠ!');

  return {
    filesCount: allRecords.length,
    questionsCount: totalQuestionsRead,
    mappedTypeCounts,
    droppedCount: dropped.length,
    importedCount: toInsert.length,
    initialCount: existingRows.length,
    finalCount,
    spotChecks: {
      bc: {
        id: spotBc?.id,
        title: spotBc?.title,
        difficultyBand: spotBc?.difficultyBand,
        paragraphsCount: bcPassage.length,
        questionsCount: bcQuestions.length,
        q1Answer: bcQuestions[0]?.answer,
      },
      cambridge: {
        id: spotCamb?.id,
        title: spotCamb?.title,
        difficultyBand: spotCamb?.difficultyBand,
        paragraphsCount: cambPassage.length,
        questionsCount: cambQuestions.length,
        q1Answer: cambQuestions[0]?.answer,
      },
    },
  };
}

main()
  .then((report) => {
    fs.writeFileSync('scratch/import_official_samples_report.json', JSON.stringify(report, null, 2), 'utf-8');
  })
  .catch((err) => {
    console.error('Lỗi import official samples:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
