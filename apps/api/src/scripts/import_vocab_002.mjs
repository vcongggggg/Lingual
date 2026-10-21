import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import readline from 'readline';

const prisma = new PrismaClient();

const files = [
  'C:\\Mod\\muse-data-exchange\\results\\vocab-002-p1.jsonl',
  'C:\\Mod\\muse-data-exchange\\results\\vocab-002-p2.jsonl',
  'C:\\Mod\\muse-data-exchange\\results\\vocab-002-p3.jsonl',
];

function makeKey(word, pos) {
  const w = (word || '').toLowerCase().trim();
  const p = (pos || '').toLowerCase().trim();
  return `${w}||${p}`;
}

async function runImport() {
  console.log('=== BẮT ĐẦU QUY TRÌNH IMPORT 5.890 TỪ VOCAB-002 ===');

  // 1. Đọc và đếm độc lập 3 file
  let totalRead = 0;
  const allRecords = [];
  const levelCounts = {};
  const viSourceCounts = {};
  const sourceCounts = {};
  const licenseCounts = {};

  for (const file of files) {
    if (!fs.existsSync(file)) {
      throw new Error(`File không tồn tại: ${file}`);
    }
    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let countInFile = 0;
    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      countInFile++;
      totalRead++;

      const rec = JSON.parse(trimmed);
      allRecords.push(rec);

      const lvl = rec.level || 'UNKNOWN';
      levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;

      const mvs = rec.meaning_vi_source || 'UNKNOWN';
      viSourceCounts[mvs] = (viSourceCounts[mvs] || 0) + 1;

      const src = rec.source || 'UNKNOWN';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;

      const lic = rec.license || 'UNKNOWN';
      licenseCounts[lic] = (licenseCounts[lic] || 0) + 1;
    }
    console.log(`Đã đọc ${file}: ${countInFile} records`);
  }

  console.log(`\nTổng số records đọc từ 3 file: ${totalRead}`);
  if (totalRead !== 5890) {
    throw new Error(`Số lượng records không khớp kỳ vọng 5.890 (thực tế: ${totalRead})`);
  }

  // 2. Load DB hiện có để Dedupe
  console.log('\nĐang tải danh sách từ hiện có trong DB...');
  const initialCount = await prisma.vocabulary.count();
  console.log(`Số từ hiện có trong bảng vocabularies: ${initialCount}`);

  const existingList = await prisma.vocabulary.findMany({
    select: { id: true, targetText: true, partOfSpeech: true },
  });

  const existingMap = new Map();
  for (const item of existingList) {
    existingMap.set(makeKey(item.targetText, item.partOfSpeech), item);
  }

  const duplicates = [];
  const toInsert = [];

  for (const rec of allRecords) {
    const k = makeKey(rec.word, rec.part_of_speech);
    if (existingMap.has(k)) {
      duplicates.push({
        incoming: rec,
        existing: existingMap.get(k),
      });
    } else {
      toInsert.push(rec);
    }
  }

  console.log(`\n--- KẾT QUẢ DEDUPE ---`);
  console.log(`Số từ bị loại do trùng DB: ${duplicates.length}`);
  console.log(`Số từ mới hợp lệ để import: ${toInsert.length}`);
  console.log(`Dự kiến tổng số từ sau import: ${initialCount + toInsert.length}`);

  // 3. Chuẩn bị batch insert
  console.log('\nĐang chuẩn bị payload insert...');
  const batchSize = 500;
  let insertedCount = 0;

  for (let i = 0; i < toInsert.length; i += batchSize) {
    const chunk = toInsert.slice(i, i + batchSize);
    const data = chunk.map((rec, idx) => {
      const globalIdx = i + idx + 1;
      return {
        id: `vcb-002-${String(globalIdx).padStart(5, '0')}`,
        targetText: rec.word.trim(),
        translation: rec.meaning_vi.trim(),
        phonetic: rec.pronunciation ? rec.pronunciation.trim() : null,
        partOfSpeech: rec.part_of_speech ? rec.part_of_speech.trim().toLowerCase() : null,
        cefrLevel: rec.level ? rec.level.trim().toUpperCase() : 'B2',
        meaningEn: rec.meaning_en ? rec.meaning_en.trim() : null,
        meaningViSource: rec.meaning_vi_source ? rec.meaning_vi_source.trim() : 'authored',
        source: rec.source ? rec.source.trim() : 'bnc_coca',
        license: rec.license ? rec.license.trim() : 'CC BY-SA 3.0',
        exampleSentence: rec.example_en ? rec.example_en.trim() : null,
        exampleTranslation: rec.example_vi ? rec.example_vi.trim() : null,
        frequencyRank: typeof rec.frequency_rank === 'number' ? rec.frequency_rank : null,
        wordFamilyJson: JSON.stringify(rec.word_family || []),
        category: 'general',
        status: 'published',
        collocationsJson: '[]',
        synonymsJson: '[]',
        antonymsJson: '[]',
      };
    });

    const res = await prisma.vocabulary.createMany({
      data,
      skipDuplicates: true,
    });
    insertedCount += res.count;
    console.log(`Đã insert batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(toInsert.length / batchSize)}: +${res.count} records (Tổng: ${insertedCount})`);
  }

  // 4. Xác minh tổng số sau import
  const finalCount = await prisma.vocabulary.count();
  console.log(`\n=== KẾT QUẢ SAU IMPORT ===`);
  console.log(`Tổng số từ trong bảng vocabularies hiện tại: ${finalCount}`);

  // 5. Thống kê 3 query mẫu theo DOD
  console.log('\n--- 3 QUERY MẪU THEO DOD ---');

  // Query 1: 1 từ C2
  const c2Sample = await prisma.vocabulary.findFirst({
    where: { cefrLevel: 'C2', id: { startsWith: 'vcb-002-' } },
    select: {
      targetText: true,
      phonetic: true,
      translation: true,
      cefrLevel: true,
      partOfSpeech: true,
      meaningViSource: true,
    },
  });
  console.log('1. Mẫu từ C2:');
  console.log(JSON.stringify(c2Sample, null, 2));

  // Query 2: 1 từ B2
  const b2Sample = await prisma.vocabulary.findFirst({
    where: { cefrLevel: 'B2', id: { startsWith: 'vcb-002-' } },
    select: {
      targetText: true,
      phonetic: true,
      translation: true,
      cefrLevel: true,
      partOfSpeech: true,
      meaningViSource: true,
    },
  });
  console.log('2. Mẫu từ B2:');
  console.log(JSON.stringify(b2Sample, null, 2));

  // Query 3: 1 từ có meaning_vi_source = 'authored'
  const authoredSample = await prisma.vocabulary.findFirst({
    where: { meaningViSource: 'authored', id: { startsWith: 'vcb-002-' } },
    select: {
      targetText: true,
      phonetic: true,
      translation: true,
      cefrLevel: true,
      partOfSpeech: true,
      meaningViSource: true,
    },
  });
  console.log('3. Mẫu từ có meaning_vi_source = "authored":');
  console.log(JSON.stringify(authoredSample, null, 2));

  // 6. Xuất danh sách 10 ví dụ trùng
  console.log('\n--- 10 VÍ DỤ TRÙNG VỚI DB BỊ LOẠI ---');
  duplicates.slice(0, 10).forEach((d, i) => {
    console.log(`${i + 1}. Từ: "${d.incoming.word}" (${d.incoming.part_of_speech}) - Nghĩa mới: "${d.incoming.meaning_vi}" - Trùng DB ID: "${d.existing.id}"`);
  });

  return {
    totalRead,
    levelCounts,
    viSourceCounts,
    sourceCounts,
    licenseCounts,
    initialCount,
    duplicatesCount: duplicates.length,
    duplicates10: duplicates.slice(0, 10),
    insertedCount,
    finalCount,
    c2Sample,
    b2Sample,
    authoredSample,
  };
}

runImport()
  .then((res) => {
    fs.writeFileSync('C:\\Study\\HocKy6\\LinguaFlow\\import_summary.json', JSON.stringify(res, null, 2));
    console.log('\nĐã lưu kết quả chi tiết vào import_summary.json');
  })
  .catch((err) => {
    console.error('Import error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
