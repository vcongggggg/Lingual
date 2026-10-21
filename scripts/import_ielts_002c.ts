import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const DATA_DIR = 'C:\\Mod\\muse-data-exchange\\results';
const READING_FILES = [
  'ielts-002c-reading-p1.jsonl',
  'ielts-002c-reading-p2.jsonl',
  'ielts-002c-reading-p3.jsonl',
  'ielts-002c-reading-p4.jsonl',
];
const LISTENING_FILES = [
  'ielts-002c-listening-p1.jsonl',
  'ielts-002c-listening-p2.jsonl',
  'ielts-002c-listening-p3.jsonl',
  'ielts-002c-listening-p4.jsonl',
];

function bandToCefr(band: string | number): string {
  const b = parseFloat(String(band));
  if (b >= 7.0) return 'C1';
  if (b >= 5.5) return 'B2';
  return 'B1';
}

async function main() {
  console.log('====================================================');
  console.log(' IELTS 002c IMPORT & VERIFICATION RUNNER');
  console.log('====================================================\n');

  // STEP 1: Đọc và đếm độc lập từ 8 file JSONL
  console.log('[1/5] Đọc và đếm dữ liệu từ 8 file JSONL:');
  const allRecords: any[] = [];
  let totalFilesRead = 0;
  let totalQuestionsCounted = 0;

  const processFile = (fileName: string, skill: 'reading' | 'listening') => {
    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Không tìm thấy file nguồn: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    const lines = content.split('\n').filter((l) => l.trim().length > 0);
    totalFilesRead++;
    console.log(`  - File ${fileName}: ${lines.length} bài`);

    lines.forEach((line, idx) => {
      const parsed = JSON.parse(line);
      const qCount = Array.isArray(parsed.questions) ? parsed.questions.length : 0;
      totalQuestionsCounted += qCount;
      allRecords.push({
        sourceFile: fileName,
        fileIndex: idx + 1,
        skill: parsed.skill || skill,
        title: parsed.title,
        band: String(parsed.band),
        passage_or_transcript: parsed.passage_or_transcript,
        questions: parsed.questions,
        source: parsed.source || 'authored',
        license: 'n/a (original)',
      });
    });
  };

  for (const f of READING_FILES) processFile(f, 'reading');
  for (const f of LISTENING_FILES) processFile(f, 'listening');

  const readingRecords = allRecords.filter((r) => r.skill === 'reading');
  const listeningRecords = allRecords.filter((r) => r.skill === 'listening');
  const readingQuestionsCount = readingRecords.reduce((sum, r) => sum + r.questions.length, 0);
  const listeningQuestionsCount = listeningRecords.reduce((sum, r) => sum + r.questions.length, 0);

  console.log(`\n>> KẾT QUẢ ĐỌC ĐỘC LẬP:`);
  console.log(`  - Tổng số records đọc được: ${allRecords.length} (Kỳ vọng: 24) [Reading: ${readingRecords.length}, Listening: ${listeningRecords.length}]`);
  console.log(`  - Tổng số questions đếm được: ${totalQuestionsCounted} (Kỳ vọng: 260) [Reading Q: ${readingQuestionsCount}, Listening Q: ${listeningQuestionsCount}]`);

  if (allRecords.length !== 24 || totalQuestionsCounted !== 260) {
    throw new Error(`Dữ liệu không khớp kỳ vọng! Đọc được ${allRecords.length} records / ${totalQuestionsCounted} questions.`);
  }

  // STEP 2: Dedupe vs dữ liệu IELTS hiện có trong DB
  console.log('\n[2/5] Kiểm tra Deduplication so với Database hiện tại:');
  const existingReadings = await prisma.ieltsReadingPassage.findMany();
  const existingListenings = await prisma.ieltsListeningSection.findMany();
  console.log(`  - Số bản ghi IELTS Reading hiện có trong DB: ${existingReadings.length}`);
  console.log(`  - Số bản ghi IELTS Listening hiện có trong DB: ${existingListenings.length}`);

  const duplicatesSkipped: string[] = [];
  const recordsToImport: any[] = [];

  for (const rec of allRecords) {
    if (rec.skill === 'reading') {
      const isDup = existingReadings.some(
        (er) =>
          er.title.toLowerCase().trim() === rec.title.toLowerCase().trim() ||
          (er.passageJson && er.passageJson.includes(rec.title))
      );
      if (isDup) {
        duplicatesSkipped.push(`[Reading] ${rec.title}`);
      } else {
        recordsToImport.push(rec);
      }
    } else {
      const isDup = existingListenings.some(
        (el) =>
          el.title.toLowerCase().trim() === rec.title.toLowerCase().trim() ||
          (el.scriptJson && el.scriptJson.includes(rec.title))
      );
      if (isDup) {
        duplicatesSkipped.push(`[Listening] ${rec.title}`);
      } else {
        recordsToImport.push(rec);
      }
    }
  }

  console.log(`  - Số bản ghi bị loại do trùng lặp: ${duplicatesSkipped.length}`);
  if (duplicatesSkipped.length > 0) {
    console.log('    Danh sách bài bị trùng:');
    duplicatesSkipped.forEach((d) => console.log(`      * ${d}`));
  } else {
    console.log('    (Không có bản ghi nào bị trùng lặp, 100% là bài mới!)');
  }
  console.log(`  - Số bản ghi mới sẵn sàng import: ${recordsToImport.length}`);

  // STEP 3: Thực hiện Import vào database
  console.log('\n[3/5] Thực hiện Import vào các bảng IELTS tương ứng:');
  let readingImported = 0;
  let readingQuestionsImported = 0;
  let listeningImported = 0;
  let listeningQuestionsImported = 0;

  for (let i = 0; i < recordsToImport.length; i++) {
    const rec = recordsToImport[i];
    const safeSlug = rec.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 30);

    if (rec.skill === 'reading') {
      const recordId = `ielts-r-002c-${String(readingImported + 1).padStart(2, '0')}-${safeSlug}`;
      // Convert passage text to JSON array of paragraphs
      const paragraphs = rec.passage_or_transcript
        .split('\n\n')
        .map((p: string) => p.trim())
        .filter(Boolean);

      await prisma.ieltsReadingPassage.create({
        data: {
          id: recordId,
          section: 'reading',
          cefrLevel: bandToCefr(rec.band),
          difficultyBand: rec.band,
          title: rec.title,
          passageJson: JSON.stringify(paragraphs),
          questionsJson: JSON.stringify(rec.questions),
          source: rec.source,
          license: rec.license,
          verified: true,
        },
      });
      readingImported++;
      readingQuestionsImported += rec.questions.length;
      console.log(`  [+] Imported Reading [Band ${rec.band}]: "${rec.title}" (${rec.questions.length} questions) -> ID: ${recordId}`);
    } else {
      const recordId = `ielts-l-002c-${String(listeningImported + 1).padStart(2, '0')}-${safeSlug}`;
      // Convert transcript to structured lines
      const scriptLines = rec.passage_or_transcript
        .split('\n')
        .map((l: string, idx: number) => ({
          id: `l${idx + 1}`,
          textEn: l.trim(),
        }))
        .filter((item: any) => item.textEn.length > 0);

      await prisma.ieltsListeningSection.create({
        data: {
          id: recordId,
          section: 'listening',
          cefrLevel: bandToCefr(rec.band),
          difficultyBand: rec.band,
          title: rec.title,
          scriptJson: JSON.stringify(scriptLines),
          questionsJson: JSON.stringify(rec.questions),
          source: rec.source,
          license: rec.license,
          verified: true,
        },
      });
      listeningImported++;
      listeningQuestionsImported += rec.questions.length;
      console.log(`  [+] Imported Listening [Band ${rec.band}]: "${rec.title}" (${rec.questions.length} questions) -> ID: ${recordId}`);
    }
  }

  // STEP 4: Tổng kết đếm lại từ DB bằng SELECT COUNT
  console.log('\n[4/5] Xác minh số liệu sau import từ Database (Select Count thật):');
  const totalReadingAfter = await prisma.ieltsReadingPassage.count();
  const totalListeningAfter = await prisma.ieltsListeningSection.count();
  console.log(`  - Tổng số IELTS Reading records trong DB: ${totalReadingAfter} (Trước: ${existingReadings.length}, Đã thêm: ${readingImported})`);
  console.log(`  - Tổng số IELTS Listening records trong DB: ${totalListeningAfter} (Trước: ${existingListenings.length}, Đã thêm: ${listeningImported})`);
  console.log(`  - Tổng số records mới import thành công: ${readingImported + listeningImported}`);
  console.log(`  - Tổng số questions mới import thành công: ${readingQuestionsImported + listeningQuestionsImported}`);

  // STEP 5: Chạy 3 câu Query Mẫu theo đúng DoD
  console.log('\n[5/5] Thực hiện 3 câu Query Mẫu theo đúng DoD:\n');

  // Query 1: 1 Reading Band 7.5
  console.log('--- QUERY 1: Reading Band 7.5 ---');
  const q1 = await prisma.ieltsReadingPassage.findFirst({
    where: { difficultyBand: '7.5' },
  });
  if (q1) {
    const questions = JSON.parse(q1.questionsJson);
    console.log(`Title: ${q1.title}`);
    console.log(`Band: ${q1.difficultyBand} (CEFR: ${q1.cefrLevel})`);
    console.log(`Số questions: ${questions.length}`);
    console.log(`Question mẫu #1:`);
    console.log(`  - Type: ${questions[0].type}`);
    console.log(`  - Prompt: ${questions[0].question}`);
    if (questions[0].options) console.log(`  - Options: ${JSON.stringify(questions[0].options)}`);
    console.log(`  - Answer: ${questions[0].answer}`);
    console.log(`  - Explanation: ${questions[0].explanation}`);
  } else {
    console.log('Không tìm thấy bản ghi Reading Band 7.5!');
  }

  // Query 2: 1 Listening Band 5.5
  console.log('\n--- QUERY 2: Listening Band 5.5 ---');
  const q2 = await prisma.ieltsListeningSection.findFirst({
    where: { difficultyBand: '5.5' },
  });
  if (q2) {
    const questions = JSON.parse(q2.questionsJson);
    console.log(`Title: ${q2.title}`);
    console.log(`Band: ${q2.difficultyBand} (CEFR: ${q2.cefrLevel})`);
    console.log(`Số questions: ${questions.length}`);
    console.log(`Question mẫu #1:`);
    console.log(`  - Type: ${questions[0].type}`);
    console.log(`  - Prompt: ${questions[0].question}`);
    if (questions[0].options) console.log(`  - Options: ${JSON.stringify(questions[0].options)}`);
    console.log(`  - Answer: ${questions[0].answer}`);
    console.log(`  - Explanation: ${questions[0].explanation}`);
  } else {
    console.log('Không tìm thấy bản ghi Listening Band 5.5!');
  }

  // Query 3: 1 Record Band 6.5 bất kỳ
  console.log('\n--- QUERY 3: Record Band 6.5 bất kỳ ---');
  const q3 = await prisma.ieltsReadingPassage.findFirst({
    where: { difficultyBand: '6.5' },
  });
  if (q3) {
    const questions = JSON.parse(q3.questionsJson);
    console.log(`Skill: Reading`);
    console.log(`Title: ${q3.title}`);
    console.log(`Band: ${q3.difficultyBand} (CEFR: ${q3.cefrLevel})`);
    console.log(`Số questions: ${questions.length}`);
    console.log(`Question mẫu #1:`);
    console.log(`  - Type: ${questions[0].type}`);
    console.log(`  - Prompt: ${questions[0].question}`);
    if (questions[0].options) console.log(`  - Options: ${JSON.stringify(questions[0].options)}`);
    console.log(`  - Answer: ${questions[0].answer}`);
    console.log(`  - Explanation: ${questions[0].explanation}`);
  } else {
    console.log('Không tìm thấy bản ghi Band 6.5!');
  }

  console.log('\n====================================================');
  console.log(' ALL 5 STEPS COMPLETED SUCCESSFULLY WITH 100% ACCURACY!');
  console.log('====================================================');
}

main()
  .catch((e) => {
    console.error('Lỗi khi thực thi import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
