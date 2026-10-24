import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const DATA_DIR = 'C:\\Mod\\muse-data-exchange\\results';
const WRITING_FILE = 'ielts-writing-models-003.json';
const SPEAKING_FILE = 'ielts-speaking-models-003.json';

function slugify(text: string): string {
  return (text || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 30);
}

async function main() {
  console.log('====================================================');
  console.log(' IELTS 003 WRITING & SPEAKING MODELS IMPORT RUNNER');
  console.log('====================================================\n');

  // Đảm bảo các cột mới đã tồn tại trên DB
  await prisma.$executeRawUnsafe('ALTER TABLE "ielts_writing_models" ADD COLUMN IF NOT EXISTS "chart_type" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "ielts_writing_models" ADD COLUMN IF NOT EXISTS "chart_description" TEXT;');

  // STEP 1: Đọc và đếm độc lập từ 2 file JSON
  console.log('[1/5] Đọc và đếm dữ liệu độc lập từ 2 file JSON:');
  const writingPath = path.join(DATA_DIR, WRITING_FILE);
  const speakingPath = path.join(DATA_DIR, SPEAKING_FILE);

  if (!fs.existsSync(writingPath) || !fs.existsSync(speakingPath)) {
    throw new Error('Không tìm thấy file nguồn 003!');
  }

  const writingRaw = JSON.parse(fs.readFileSync(writingPath, 'utf-8'));
  const speakingRaw = JSON.parse(fs.readFileSync(speakingPath, 'utf-8'));

  const task1Count = writingRaw.filter((w: any) => w.task === 1).length;
  const task2Count = writingRaw.filter((w: any) => w.task === 2).length;

  console.log(`  - File ${WRITING_FILE}: ${writingRaw.length} bài (Task 1: ${task1Count}, Task 2: ${task2Count})`);
  console.log(`  - File ${SPEAKING_FILE}: ${speakingRaw.length} bộ Part 2+3`);
  console.log(`  => Tổng cộng đọc được: ${writingRaw.length + speakingRaw.length} records (Kỳ vọng: 120 records: 60 Writing + 60 Speaking)\n`);

  if (writingRaw.length !== 60 || speakingRaw.length !== 60 || task1Count !== 20 || task2Count !== 40) {
    throw new Error('Số lượng records đọc được không khớp kỳ vọng của task 003!');
  }

  // STEP 2: Kiểm tra Deduplication so với Database hiện tại
  console.log('[2/5] Kiểm tra Deduplication so với Database hiện tại:');
  const existingWTopics = await prisma.ieltsWritingTopic.findMany({ select: { prompt: true } });
  const existingSTopics = await prisma.ieltsSpeakingTopic.findMany({ select: { question: true, topicVi: true } });

  const existingWPromptSet = new Set<string>();
  existingWTopics.forEach((w) => existingWPromptSet.add(w.prompt.toLowerCase().trim()));

  const existingSTopicSet = new Set<string>();
  existingSTopics.forEach((s) => {
    if (s.topicVi) existingSTopicSet.add(s.topicVi.toLowerCase().trim());
    existingSTopicSet.add(s.question.toLowerCase().trim());
  });

  const writingDuplicates: string[] = [];
  const writingToImport: any[] = [];
  writingRaw.forEach((w: any) => {
    const key = w.prompt.toLowerCase().trim();
    if (existingWPromptSet.has(key)) {
      writingDuplicates.push(`[Task ${w.task}] ${w.topic || w.chart_type}: ${w.prompt.slice(0, 50)}...`);
    } else {
      existingWPromptSet.add(key);
      writingToImport.push(w);
    }
  });

  const speakingDuplicates: string[] = [];
  const speakingToImport: any[] = [];
  speakingRaw.forEach((s: any) => {
    const key = s.topic.toLowerCase().trim();
    if (existingSTopicSet.has(key)) {
      speakingDuplicates.push(s.topic);
    } else {
      existingSTopicSet.add(key);
      speakingToImport.push(s);
    }
  });

  console.log(`  - Writing duplicates: ${writingDuplicates.length}`);
  if (writingDuplicates.length > 0) {
    writingDuplicates.forEach((d) => console.log(`    * ${d}`));
  }
  console.log(`  - Speaking duplicates: ${speakingDuplicates.length}`);
  if (speakingDuplicates.length > 0) {
    speakingDuplicates.forEach((d) => console.log(`    * ${d}`));
  }
  console.log(`  => Số bài Writing sẵn sàng import: ${writingToImport.length} / ${writingRaw.length}`);
  console.log(`  => Số bộ Speaking sẵn sàng import: ${speakingToImport.length} / ${speakingRaw.length}`);

  // Xóa sạch các record cũ trong 2 bảng này (nếu có từ lần chạy dở)
  await prisma.ieltsWritingModel.deleteMany();
  await prisma.ieltsSpeakingModel.deleteMany();

  // STEP 3: Thực hiện Import vào Database
  console.log('\n[3/5] Thực hiện Import vào các bảng ielts_writing_models và ielts_speaking_models:');
  let writingImported = 0;
  let speakingImported = 0;
  let task1Imported = 0;
  let task2Imported = 0;

  // Import Writing
  for (let i = 0; i < writingToImport.length; i++) {
    const w = writingToImport[i];
    const isTask1 = w.task === 1;
    if (isTask1) task1Imported++;
    else task2Imported++;

    const taskNum = isTask1 ? task1Imported : task2Imported;
    const topicDisplay = w.topic || `Task 1: ${w.chart_type}`;
    const safeTopic = slugify(w.topic || w.chart_type || 'chart');
    const id = `ielts-wm-t${w.task}-${String(taskNum).padStart(2, '0')}-${safeTopic}`;

    await prisma.ieltsWritingModel.create({
      data: {
        id,
        task: w.task,
        topic: topicDisplay,
        chartType: w.chart_type || null,
        chartDescription: w.chart_description || null,
        prompt: w.prompt,
        modelAnswer: w.model_answer,
        keyVocabJson: JSON.stringify(w.key_vocab || []),
        examinerNotesVi: w.examiner_notes_vi || null,
        bandEstimate: parseFloat(String(w.band_estimate || 8.0)),
        source: w.source || 'authored',
        license: 'n/a (original)',
        verified: true,
      },
    });
    writingImported++;
    if (writingImported % 10 === 0 || writingImported === writingToImport.length) {
      console.log(`  [+] Writing progress: ${writingImported}/${writingToImport.length} imported`);
    }
  }

  // Import Speaking
  for (let i = 0; i < speakingToImport.length; i++) {
    const s = speakingToImport[i];
    const safeTopic = slugify(s.topic);
    const id = `ielts-sm-${String(i + 1).padStart(2, '0')}-${safeTopic}`;

    await prisma.ieltsSpeakingModel.create({
      data: {
        id,
        topic: s.topic,
        cueCard: s.cue_card,
        modelAnswerPart2: s.model_answer_part2,
        part3Json: JSON.stringify(s.part3 || []),
        keyVocabJson: JSON.stringify(s.key_vocab || []),
        notesVi: s.notes_vi || null,
        bandEstimate: parseFloat(String(s.band_estimate || 8.0)),
        source: s.source || 'authored',
        license: 'n/a (original)',
        verified: true,
      },
    });
    speakingImported++;
    if (speakingImported % 10 === 0 || speakingImported === speakingToImport.length) {
      console.log(`  [+] Speaking progress: ${speakingImported}/${speakingToImport.length} imported`);
    }
  }

  // STEP 4: Tổng kết đếm lại từ DB bằng SELECT COUNT thật
  console.log('\n[4/5] Xác minh số liệu sau import từ Database (Select Count thật):');
  const totalWInDB = await prisma.ieltsWritingModel.count();
  const totalSInDB = await prisma.ieltsSpeakingModel.count();
  const totalT1InDB = await prisma.ieltsWritingModel.count({ where: { task: 1 } });
  const totalT2InDB = await prisma.ieltsWritingModel.count({ where: { task: 2 } });

  console.log(`  - Tổng số IELTS Writing Models trong DB: ${totalWInDB} (Task 1: ${totalT1InDB}, Task 2: ${totalT2InDB})`);
  console.log(`  - Tổng số IELTS Speaking Models trong DB: ${totalSInDB}`);
  console.log(`  - Tổng số records mới import thành công: ${writingImported + speakingImported} (Kỳ vọng: 120)`);

  if (totalWInDB !== 60 || totalSInDB !== 60 || totalT1InDB !== 20 || totalT2InDB !== 40) {
    throw new Error('Số liệu DB sau import không đúng kỳ vọng 60 Writing + 60 Speaking!');
  }

  // STEP 5: Thực hiện 2 câu Query Mẫu theo đúng DoD
  console.log('\n[5/5] Thực hiện 2 câu Query Mẫu theo đúng DoD:\n');

  // Query Mẫu 1: 1 Essay Task 2
  console.log('--- QUERY MẪU 1: 1 Essay Task 2 (Writing Model Band 8.0) ---');
  const sampleW = await prisma.ieltsWritingModel.findFirst({
    where: { task: 2 },
  });
  if (sampleW) {
    const keyVocab = JSON.parse(sampleW.keyVocabJson);
    console.log(`ID: ${sampleW.id}`);
    console.log(`Task: ${sampleW.task} | Topic: ${sampleW.topic}`);
    console.log(`Prompt: ${sampleW.prompt}`);
    console.log(`Độ dài Model Answer: ${sampleW.modelAnswer.length} ký tự (~${sampleW.modelAnswer.split(/\s+/).length} từ)`);
    console.log(`Band Estimate: ${sampleW.bandEstimate}`);
    console.log(`Examiner Notes (VI): ${sampleW.examinerNotesVi?.slice(0, 120)}...`);
    console.log(`Key Vocab count: ${keyVocab.length} từ/cụm (Ví dụ: "${keyVocab[0]?.phrase}": ${keyVocab[0]?.meaning_vi})`);
  }

  // Query Mẫu 2: 1 Bộ Speaking
  console.log('\n--- QUERY MẪU 2: 1 Bộ Speaking Part 2+3 (Speaking Model Band 8.0) ---');
  const sampleS = await prisma.ieltsSpeakingModel.findFirst();
  if (sampleS) {
    const part3 = JSON.parse(sampleS.part3Json);
    const keyVocab = JSON.parse(sampleS.keyVocabJson);
    console.log(`ID: ${sampleS.id}`);
    console.log(`Topic: ${sampleS.topic}`);
    console.log(`Cue Card:\n${sampleS.cueCard}`);
    console.log(`Độ dài Model Answer Part 2: ${sampleS.modelAnswerPart2.length} ký tự (~${sampleS.modelAnswerPart2.split(/\s+/).length} từ)`);
    console.log(`Số câu Part 3: ${part3.length} câu`);
    console.log(`Part 3 câu hỏi #1: "${part3[0]?.question}"`);
    console.log(`Part 3 câu trả lời #1 độ dài: ${part3[0]?.answer?.length} ký tự`);
    console.log(`Band Estimate: ${sampleS.bandEstimate}`);
    console.log(`Notes (VI): ${sampleS.notesVi?.slice(0, 120)}...`);
    console.log(`Key Vocab count: ${keyVocab.length} từ/cụm (Ví dụ: "${keyVocab[0]?.phrase}": ${keyVocab[0]?.meaning_vi})`);
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
