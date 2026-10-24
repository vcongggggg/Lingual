import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import readline from 'node:readline';

const prisma = new PrismaClient();

const DATA_DIR = 'C:/Mod/muse-data-exchange/results';
const FILES = {
  speaking: `${DATA_DIR}/prompts-002-speaking.jsonl`,
  writing: `${DATA_DIR}/prompts-002-writing.jsonl`,
  diary: `${DATA_DIR}/prompts-002-diary.jsonl`,
};

function normalize(text) {
  return (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

const TYPE_VI_MAP = {
  'task1-chart': 'IELTS Writing Task 1: Biểu đồ',
  'task1-map': 'IELTS Writing Task 1: Bản đồ',
  'task1-process': 'IELTS Writing Task 1: Quy trình',
  'task1-letter': 'IELTS Writing Task 1: Thư (General)',
  'task2-essay': 'IELTS Writing Task 2: Bài luận',
};

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
  console.log(' PROMPTS-002 IMPORT RUNNER (Speaking, Writing, Diary)');
  console.log('====================================================\n');

  // STEP 0: Đảm bảo các cột mở rộng tồn tại an toàn trên DB PostgreSQL
  console.log('[0/4] Chuẩn bị DB schema: Thêm các cột mở rộng an toàn...');
  await prisma.$executeRawUnsafe('ALTER TABLE "ielts_speaking_topics" ADD COLUMN IF NOT EXISTS "follow_up_questions" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "ielts_speaking_topics" ADD COLUMN IF NOT EXISTS "topic" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "ielts_writing_topics" ADD COLUMN IF NOT EXISTS "band_range" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "diary_prompts" ADD COLUMN IF NOT EXISTS "theme" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "diary_prompts" ADD COLUMN IF NOT EXISTS "hint_vi" TEXT;');
  console.log('✅ DB schema đã sẵn sàng.\n');

  // STEP 1: Đọc và đếm độc lập từ 3 file JSONL
  console.log('[1/4] Đọc dữ liệu độc lập từ 3 file JSONL:');
  const rawSpeaking = await readJsonl(FILES.speaking);
  const rawWriting = await readJsonl(FILES.writing);
  const rawDiary = await readJsonl(FILES.diary);

  console.log(`- Speaking file read: ${rawSpeaking.length} records`);
  console.log(`- Writing file read:  ${rawWriting.length} records`);
  console.log(`- Diary file read:    ${rawDiary.length} records`);
  const totalRead = rawSpeaking.length + rawWriting.length + rawDiary.length;
  console.log(`- Tổng cộng đã đọc:   ${totalRead} records (Kỳ vọng: 1.330)\n`);

  if (rawSpeaking.length !== 450 || rawWriting.length !== 240 || rawDiary.length !== 640) {
    throw new Error(`Số lượng bản ghi không khớp kỳ vọng! Speaking=${rawSpeaking.length}, Writing=${rawWriting.length}, Diary=${rawDiary.length}`);
  }

  // STEP 2: Deduplication 2 lớp
  console.log('[2/4] Thực hiện Deduplication 2 lớp:');

  // Lấy dữ liệu hiện có trong DB
  const dbSpeaking = await prisma.ieltsSpeakingTopic.findMany({ select: { id: true, question: true } });
  const dbWriting = await prisma.ieltsWritingTopic.findMany({ select: { id: true, prompt: true } });
  const dbDiary = await prisma.diaryPrompt.findMany({ select: { id: true, prompt: true } });

  console.log(`- DB hiện có trước import: Speaking=${dbSpeaking.length}, Writing=${dbWriting.length}, Diary=${dbDiary.length}`);

  const dbSpeakingSet = new Set(dbSpeaking.map((s) => normalize(s.question)));
  const dbWritingSet = new Set(dbWriting.map((w) => normalize(w.prompt)));
  const dbDiarySet = new Set(dbDiary.map((d) => normalize(d.prompt)));

  // Dedupe Speaking
  const internalSpeakingSet = new Set();
  const speakingToInsert = [];
  const droppedSpeaking = [];

  let seqSpk = { 1: 0, 2: 0, 3: 0 };
  for (const s of rawSpeaking) {
    const norm = normalize(s.prompt);
    if (internalSpeakingSet.has(norm)) {
      droppedSpeaking.push({ reason: 'internal_duplicate', prompt: s.prompt });
      continue;
    }
    internalSpeakingSet.add(norm);

    if (dbSpeakingSet.has(norm)) {
      droppedSpeaking.push({ reason: 'db_existing_duplicate', prompt: s.prompt });
      continue;
    }

    const partNum = s.part === 'part2' ? 2 : s.part === 'part3' ? 3 : 1;
    seqSpk[partNum]++;
    const id = `spk-002-p${partNum}-${seqSpk[partNum].toString().padStart(3, '0')}`;

    speakingToInsert.push({
      id,
      part: partNum,
      question: s.prompt,
      topicVi: s.topic,
      ideasJson: JSON.stringify(s.follow_up_questions || []),
      source: s.source || 'authored',
      verified: true,
      // Extra fields
      _topic: s.topic,
      _followUp: JSON.stringify(s.follow_up_questions || []),
    });
  }

  // Dedupe Writing
  const internalWritingSet = new Set();
  const writingToInsert = [];
  const droppedWriting = [];

  let seqWrt = 0;
  for (const w of rawWriting) {
    const norm = normalize(w.prompt);
    if (internalWritingSet.has(norm)) {
      droppedWriting.push({ reason: 'internal_duplicate', prompt: w.prompt });
      continue;
    }
    internalWritingSet.add(norm);

    if (dbWritingSet.has(norm)) {
      droppedWriting.push({ reason: 'db_existing_duplicate', prompt: w.prompt });
      continue;
    }

    seqWrt++;
    const id = `wrt-002-${seqWrt.toString().padStart(3, '0')}`;

    writingToInsert.push({
      id,
      prompt: w.prompt,
      type: w.task_type || 'task2-essay',
      typeVi: TYPE_VI_MAP[w.task_type] || 'IELTS Writing Prompt',
      outlineJson: '{}',
      keyVocabJson: '[]',
      source: w.source || 'authored',
      verified: true,
      // Extra field
      _bandRange: w.band_range || '5.0-9.0',
    });
  }

  // Dedupe Diary
  const internalDiarySet = new Set();
  const diaryToInsert = [];
  const droppedDiary = [];

  let seqDiary = 0;
  for (const d of rawDiary) {
    const norm = normalize(d.prompt_en);
    if (internalDiarySet.has(norm)) {
      droppedDiary.push({ reason: 'internal_duplicate', prompt: d.prompt_en });
      continue;
    }
    internalDiarySet.add(norm);

    if (dbDiarySet.has(norm)) {
      droppedDiary.push({ reason: 'db_existing_duplicate', prompt: d.prompt_en });
      continue;
    }

    seqDiary++;
    const id = `diary-002-${seqDiary.toString().padStart(3, '0')}`;

    diaryToInsert.push({
      id,
      cefrLevel: 'A2',
      prompt: d.prompt_en,
      promptVi: d.hint_vi,
      keywordsJson: '[]',
      minSentences: 3,
      source: d.source || 'authored',
      verified: true,
      // Extra fields
      _theme: d.theme,
      _hintVi: d.hint_vi,
    });
  }

  console.log(`- Speaking: Đã đọc ${rawSpeaking.length}, Bỏ qua (Dedupe kho cũ) ${droppedSpeaking.length}, Sẽ import: ${speakingToInsert.length}`);
  console.log(`- Writing:  Đã đọc ${rawWriting.length}, Bỏ qua (Dedupe kho cũ) ${droppedWriting.length}, Sẽ import: ${writingToInsert.length}`);
  console.log(`- Diary:    Đã đọc ${rawDiary.length}, Bỏ qua (Dedupe kho cũ) ${droppedDiary.length}, Sẽ import: ${diaryToInsert.length}\n`);

  if (droppedSpeaking.length > 0) {
    console.log('Chi tiết các đề Speaking trùng lặp với kho cũ đã bỏ qua:');
    droppedSpeaking.forEach((d, i) => console.log(`  ${i + 1}. [${d.reason}] ${d.prompt}`));
    console.log('');
  }

  // STEP 3: Nạp dữ liệu vào Database
  console.log('[3/4] Thực hiện nạp dữ liệu vào PostgreSQL...');

  // 1. Insert Speaking
  const speakingPrismaRecords = speakingToInsert.map(({ _topic, _followUp, ...fields }) => fields);
  await prisma.ieltsSpeakingTopic.createMany({
    data: speakingPrismaRecords,
    skipDuplicates: true,
  });

  // Cập nhật các trường mở rộng
  for (const item of speakingToInsert) {
    await prisma.$executeRawUnsafe(
      'UPDATE "ielts_speaking_topics" SET "topic" = $1, "follow_up_questions" = $2 WHERE "id" = $3',
      item._topic,
      item._followUp,
      item.id
    );
  }
  console.log(`✅ Đã nạp thành công ${speakingToInsert.length} bản ghi Speaking vào ielts_speaking_topics.`);

  // 2. Insert Writing
  const writingPrismaRecords = writingToInsert.map(({ _bandRange, ...fields }) => fields);
  await prisma.ieltsWritingTopic.createMany({
    data: writingPrismaRecords,
    skipDuplicates: true,
  });

  for (const item of writingToInsert) {
    await prisma.$executeRawUnsafe(
      'UPDATE "ielts_writing_topics" SET "band_range" = $1 WHERE "id" = $2',
      item._bandRange,
      item.id
    );
  }
  console.log(`✅ Đã nạp thành công ${writingToInsert.length} bản ghi Writing vào ielts_writing_topics.`);

  // 3. Insert Diary
  const diaryPrismaRecords = diaryToInsert.map(({ _theme, _hintVi, ...fields }) => fields);
  // Chunk diary inserts in batches of 200 for safety
  for (let i = 0; i < diaryPrismaRecords.length; i += 200) {
    const chunk = diaryPrismaRecords.slice(i, i + 200);
    await prisma.diaryPrompt.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  for (const item of diaryToInsert) {
    await prisma.$executeRawUnsafe(
      'UPDATE "diary_prompts" SET "theme" = $1, "hint_vi" = $2 WHERE "id" = $3',
      item._theme,
      item._hintVi,
      item.id
    );
  }
  console.log(`✅ Đã nạp thành công ${diaryToInsert.length} bản ghi Diary vào diary_prompts.\n`);

  // STEP 4: Kiểm tra và xác minh sau import
  console.log('[4/4] Kiểm tra tổng số lượng trong DB sau Import:');
  const finalSpeakingCount = await prisma.ieltsSpeakingTopic.count();
  const finalWritingCount = await prisma.ieltsWritingTopic.count();
  const finalDiaryCount = await prisma.diaryPrompt.count();

  console.log(`- Total IELTS Speaking Topics: ${finalSpeakingCount} (Trước: ${dbSpeaking.length}, +${speakingToInsert.length})`);
  console.log(`- Total IELTS Writing Topics:  ${finalWritingCount} (Trước: ${dbWriting.length}, +${writingToInsert.length})`);
  console.log(`- Total Diary Prompts:         ${finalDiaryCount} (Trước: ${dbDiary.length}, +${diaryToInsert.length})`);

  // Spot-check mẫu
  console.log('\n--- SPOT CHECK MẪU MỚI TỪ DB ---');
  const spotSpeaking = await prisma.$queryRawUnsafe('SELECT id, part, question, topic, follow_up_questions FROM "ielts_speaking_topics" WHERE id = $1', 'spk-002-p1-001');
  console.log('1. Spot check Speaking mới (spk-002-p1-001):', JSON.stringify(spotSpeaking, null, 2));

  const spotWriting = await prisma.$queryRawUnsafe('SELECT id, prompt, type, band_range FROM "ielts_writing_topics" WHERE id = $1', 'wrt-002-001');
  console.log('2. Spot check Writing mới (wrt-002-001):', JSON.stringify(spotWriting, null, 2));

  const spotDiary = await prisma.$queryRawUnsafe('SELECT id, prompt, "promptVi", theme, hint_vi FROM "diary_prompts" WHERE id = $1', 'diary-002-001');
  console.log('3. Spot check Diary mới (diary-002-001):', JSON.stringify(spotDiary, null, 2));

  console.log('\n🎉 IMPORT PROMPTS-002 HOÀN TẤT THÀNH CÔNG RỰC RỠ!');

  return {
    read: { speaking: rawSpeaking.length, writing: rawWriting.length, diary: rawDiary.length, total: totalRead },
    dropped: {
      speaking: droppedSpeaking.length,
      writing: droppedWriting.length,
      diary: droppedDiary.length,
      details: droppedSpeaking,
    },
    imported: { speaking: speakingToInsert.length, writing: writingToInsert.length, diary: diaryToInsert.length },
    finalDb: { speaking: finalSpeakingCount, writing: finalWritingCount, diary: finalDiaryCount },
    spotChecks: {
      speaking: spotSpeaking[0],
      writing: spotWriting[0],
      diary: spotDiary[0],
    },
  };
}

main()
  .then((report) => {
    fs.writeFileSync('scratch/import_prompts_002_report.json', JSON.stringify(report, null, 2), 'utf-8');
  })
  .catch((err) => {
    console.error('Lỗi quy trình import:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
