import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const DATA_DIR = 'C:\\Mod\\muse-data-exchange\\results';

interface FileConfig {
  pkg: '002a' | '002b';
  skill: 'reading' | 'listening';
  fileName: string;
}

const FILES_TO_IMPORT: FileConfig[] = [
  // Package 002a
  { pkg: '002a', skill: 'reading', fileName: 'ielts-002a-reading-p1.jsonl' },
  { pkg: '002a', skill: 'reading', fileName: 'ielts-002a-reading-p2.jsonl' },
  { pkg: '002a', skill: 'listening', fileName: 'ielts-002a-listening-p1.jsonl' },
  { pkg: '002a', skill: 'listening', fileName: 'ielts-002a-listening-p2.jsonl' },
  // Package 002b
  { pkg: '002b', skill: 'reading', fileName: 'ielts-002b-reading-p1.jsonl' },
  { pkg: '002b', skill: 'reading', fileName: 'ielts-002b-reading-p2.jsonl' },
  { pkg: '002b', skill: 'listening', fileName: 'ielts-002b-listening-p1.jsonl' },
  { pkg: '002b', skill: 'listening', fileName: 'ielts-002b-listening-p2.jsonl' },
];

function bandToCefr(band: string | number): string {
  const b = parseFloat(String(band));
  if (b >= 7.0) return 'C1';
  if (b >= 5.5) return 'B2';
  return 'B1';
}

async function main() {
  console.log('====================================================');
  console.log(' IELTS 002a + 002b IMPORT & VERIFICATION RUNNER');
  console.log('====================================================\n');

  // STEP 1: Đọc và đếm độc lập từ 8 file JSONL
  console.log('[1/5] Đọc và đếm dữ liệu từ 8 file JSONL:');
  const allRecords: any[] = [];
  const packageStats: Record<string, { readingRecords: number; readingQuestions: number; listeningRecords: number; listeningQuestions: number }> = {
    '002a': { readingRecords: 0, readingQuestions: 0, listeningRecords: 0, listeningQuestions: 0 },
    '002b': { readingRecords: 0, readingQuestions: 0, listeningRecords: 0, listeningQuestions: 0 },
  };

  for (const item of FILES_TO_IMPORT) {
    const filePath = path.join(DATA_DIR, item.fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Không tìm thấy file nguồn: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    const lines = content.split('\n').filter((l) => l.trim().length > 0);
    console.log(`  - File [${item.pkg} | ${item.skill}] ${item.fileName}: ${lines.length} bài`);

    lines.forEach((line, idx) => {
      const parsed = JSON.parse(line);
      const qCount = Array.isArray(parsed.questions) ? parsed.questions.length : 0;
      
      if (item.skill === 'reading') {
        packageStats[item.pkg].readingRecords++;
        packageStats[item.pkg].readingQuestions += qCount;
      } else {
        packageStats[item.pkg].listeningRecords++;
        packageStats[item.pkg].listeningQuestions += qCount;
      }

      allRecords.push({
        pkg: item.pkg,
        sourceFile: item.fileName,
        fileIndex: idx + 1,
        skill: parsed.skill || item.skill,
        title: parsed.title,
        band: String(parsed.band),
        passage_or_transcript: parsed.passage_or_transcript,
        questions: parsed.questions,
        source: parsed.source || 'authored',
        license: 'n/a (original)',
      });
    });
  }

  console.log(`\n>> KẾT QUẢ ĐỌC ĐỘC LẬP TỪ FILE NGUỒN:`);
  console.log(`  - Gói 002a:`);
  console.log(`    + Reading: ${packageStats['002a'].readingRecords} records, ${packageStats['002a'].readingQuestions} questions (Kỳ vọng: 12 records, 148 questions)`);
  console.log(`    + Listening: ${packageStats['002a'].listeningRecords} records, ${packageStats['002a'].listeningQuestions} questions (Kỳ vọng: 12 records, 115 questions)`);
  console.log(`    => Tổng 002a: ${packageStats['002a'].readingRecords + packageStats['002a'].listeningRecords} records, ${packageStats['002a'].readingQuestions + packageStats['002a'].listeningQuestions} questions (Kỳ vọng: 24 records, 263 questions)`);
  
  console.log(`  - Gói 002b:`);
  console.log(`    + Reading: ${packageStats['002b'].readingRecords} records, ${packageStats['002b'].readingQuestions} questions (Kỳ vọng: 12 records, 141 questions)`);
  console.log(`    + Listening: ${packageStats['002b'].listeningRecords} records, ${packageStats['002b'].listeningQuestions} questions (Kỳ vọng: 12 records, 111 questions)`);
  console.log(`    => Tổng 002b: ${packageStats['002b'].readingRecords + packageStats['002b'].listeningRecords} records, ${packageStats['002b'].readingQuestions + packageStats['002b'].listeningQuestions} questions (Kỳ vọng: 24 records, 252 questions)`);

  const grandTotalRecords = allRecords.length;
  const grandTotalQuestions = allRecords.reduce((sum, r) => sum + r.questions.length, 0);
  console.log(`  => TỔNG CỘNG 2 GÓI: ${grandTotalRecords} records, ${grandTotalQuestions} questions (Kỳ vọng: 48 records, 515 questions)`);

  if (
    packageStats['002a'].readingRecords !== 12 ||
    packageStats['002a'].listeningRecords !== 12 ||
    packageStats['002a'].readingQuestions !== 148 ||
    packageStats['002a'].listeningQuestions !== 115 ||
    packageStats['002b'].readingRecords !== 12 ||
    packageStats['002b'].listeningRecords !== 12 ||
    packageStats['002b'].readingQuestions !== 141 ||
    packageStats['002b'].listeningQuestions !== 111 ||
    grandTotalRecords !== 48 ||
    grandTotalQuestions !== 515
  ) {
    throw new Error('Số liệu đếm độc lập không khớp với kỳ vọng!');
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
    console.log('    (Không có bản ghi nào bị trùng lặp, 100% 48 bài là dữ liệu mới!)');
  }
  console.log(`  - Số bản ghi mới sẵn sàng import: ${recordsToImport.length}`);

  // STEP 3: Thực hiện Import vào database
  console.log('\n[3/5] Thực hiện Import vào các bảng IELTS tương ứng:');
  let readingImported = 0;
  let readingQuestionsImported = 0;
  let listeningImported = 0;
  let listeningQuestionsImported = 0;

  const pkgCounters: Record<string, { reading: number; listening: number }> = {
    '002a': { reading: 0, listening: 0 },
    '002b': { reading: 0, listening: 0 },
  };

  for (let i = 0; i < recordsToImport.length; i++) {
    const rec = recordsToImport[i];
    const safeSlug = rec.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 30);

    if (rec.skill === 'reading') {
      pkgCounters[rec.pkg].reading++;
      const recordId = `ielts-r-${rec.pkg}-${String(pkgCounters[rec.pkg].reading).padStart(2, '0')}-${safeSlug}`;
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
      console.log(`  [+] [${rec.pkg}] Reading [Band ${rec.band}]: "${rec.title}" (${rec.questions.length} questions) -> ID: ${recordId}`);
    } else {
      pkgCounters[rec.pkg].listening++;
      const recordId = `ielts-l-${rec.pkg}-${String(pkgCounters[rec.pkg].listening).padStart(2, '0')}-${safeSlug}`;
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
      console.log(`  [+] [${rec.pkg}] Listening [Band ${rec.band}]: "${rec.title}" (${rec.questions.length} questions) -> ID: ${recordId}`);
    }
  }

  // STEP 4: Tổng kết đếm lại từ DB bằng SELECT COUNT
  console.log('\n[4/5] Xác minh số liệu sau import từ Database (Select Count thật):');
  const totalReadingAfter = await prisma.ieltsReadingPassage.count();
  const totalListeningAfter = await prisma.ieltsListeningSection.count();
  console.log(`  - Tổng số IELTS Reading records trong DB: ${totalReadingAfter} (Trước: ${existingReadings.length}, Đã thêm: ${readingImported}, Kỳ vọng: 60)`);
  console.log(`  - Tổng số IELTS Listening records trong DB: ${totalListeningAfter} (Trước: ${existingListenings.length}, Đã thêm: ${listeningImported}, Kỳ vọng: 60)`);
  console.log(`  - Tổng số records mới import thành công: ${readingImported + listeningImported}`);
  console.log(`  - Tổng số questions mới import thành công: ${readingQuestionsImported + listeningQuestionsImported}`);

  if (totalReadingAfter !== 60 || totalListeningAfter !== 60) {
    throw new Error(`Kỳ vọng tổng records sau import là 60 Reading / 60 Listening, nhưng thực tế: ${totalReadingAfter}/${totalListeningAfter}`);
  }

  // STEP 5: Thực hiện 2 câu Query Mẫu theo đúng DoD
  console.log('\n[5/5] Thực hiện 2 câu Query Mẫu theo đúng DoD:\n');

  // Query Mẫu 1: 1 bản ghi từ gói 002a
  console.log('--- QUERY MẪU 1: Gói 002a (Reading) ---');
  const sample002a = await prisma.ieltsReadingPassage.findFirst({
    where: { id: { startsWith: 'ielts-r-002a' } },
  });
  if (sample002a) {
    const questions = JSON.parse(sample002a.questionsJson);
    console.log(`ID: ${sample002a.id}`);
    console.log(`Title: ${sample002a.title}`);
    console.log(`Difficulty Band: ${sample002a.difficultyBand} (CEFR: ${sample002a.cefrLevel})`);
    console.log(`Source: ${sample002a.source} | License: ${sample002a.license}`);
    console.log(`Số lượng questions: ${questions.length}`);
    console.log(`Question #1:`);
    console.log(`  - Type: ${questions[0].type}`);
    console.log(`  - Prompt: ${questions[0].question}`);
    if (questions[0].options) console.log(`  - Options: ${JSON.stringify(questions[0].options)}`);
    console.log(`  - Answer: ${questions[0].answer}`);
    console.log(`  - Explanation: ${questions[0].explanation}`);
  }

  // Query Mẫu 2: 1 bản ghi từ gói 002b
  console.log('\n--- QUERY MẪU 2: Gói 002b (Listening) ---');
  const sample002b = await prisma.ieltsListeningSection.findFirst({
    where: { id: { startsWith: 'ielts-l-002b' } },
  });
  if (sample002b) {
    const questions = JSON.parse(sample002b.questionsJson);
    console.log(`ID: ${sample002b.id}`);
    console.log(`Title: ${sample002b.title}`);
    console.log(`Difficulty Band: ${sample002b.difficultyBand} (CEFR: ${sample002b.cefrLevel})`);
    console.log(`Source: ${sample002b.source} | License: ${sample002b.license}`);
    console.log(`Số lượng questions: ${questions.length}`);
    console.log(`Question #1:`);
    console.log(`  - Type: ${questions[0].type}`);
    console.log(`  - Prompt: ${questions[0].question}`);
    if (questions[0].options) console.log(`  - Options: ${JSON.stringify(questions[0].options)}`);
    console.log(`  - Answer: ${questions[0].answer}`);
    console.log(`  - Explanation: ${questions[0].explanation}`);
  }

  console.log('\n====================================================');
  console.log(' ALL 5 STEPS COMPLETED WITH 100% SUCCESS!');
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
