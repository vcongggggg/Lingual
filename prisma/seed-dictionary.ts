import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const dictPath = path.join(__dirname, '../apps/api/src/data/masterDictionary25k.json');
  if (!fs.existsSync(dictPath)) {
    console.log('Chưa tìm thấy file masterDictionary25k.json. Vui lòng chạy `node scripts/build_25k_dictionary.js` trước.');
    return;
  }

  console.log('Đang đọc file masterDictionary25k.json...');
  const words = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
  console.log(`Bắt đầu seed ${words.length} từ vựng vào PostgreSQL...`);

  // Batch insert theo khối 1000 từ để tối ưu hiệu năng và không tràn parameter limit của PostgreSQL
  const BATCH_SIZE = 1000;
  let totalInserted = 0;

  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE).map((w: any) => ({
      id: w.id,
      targetText: w.targetText,
      translation: w.translation,
      phonetic: w.phonetic || '',
      cefrLevel: w.cefrLevel || 'B1',
      category: w.category || 'General',
      exampleSentence: w.exampleSentence || '',
      exampleTranslation: w.exampleTranslation || '',
      status: 'published',
    }));

    await prisma.vocabulary.createMany({
      data: batch,
      skipDuplicates: true,
    });

    totalInserted += batch.length;
    console.log(`Đã nạp ${totalInserted}/${words.length} từ vựng vào Database...`);
  }

  console.log(`✅ Hoàn thành nạp ${totalInserted} từ vựng vào bảng Vocabulary!`);
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed từ điển:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
