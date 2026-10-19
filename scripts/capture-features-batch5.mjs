import { chromium } from '../node_modules/.pnpm/playwright@1.62.1/node_modules/playwright/index.mjs';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/ui-screenshots/features-batch5');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log('Khởi chạy Chromium qua Playwright để chụp 2 tính năng Nhóm 5...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 950 },
  });
  const page = await context.newPage();

  // 1. Screenshot 1: 'Chuyện bò kể' (Cows Tale / Story Generator)
  console.log('--- 1. Chụp Chuyện bò kể (/story) ---');
  await page.goto('http://localhost:3000/story', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Nhấp chọn 5 từ ngẫu nhiên
  const randomBtn = await page.$('button:has-text("Ngẫu nhiên 5 từ")');
  if (randomBtn) {
    await randomBtn.click();
    await page.waitForTimeout(400);
  }

  // Nhấp Bò dệt truyện ngay
  const generateBtn = await page.$('button:has-text("Bò Dệt Truyện Ngay")');
  if (generateBtn) {
    await generateBtn.click();
    await page.waitForTimeout(800);
  }

  // Chạm vào 1 từ highlight để hiện popup tra nghĩa từ vựng
  const highlightWord = await page.$('span:has-text("✨")');
  if (highlightWord) {
    await highlightWord.click();
    await page.waitForTimeout(400);
  }

  // Cuộn nhẹ để thấy vừa trọn vẹn cả tiêu đề chương, minh họa Bò LingLing, đoạn văn highlight và popup tra nghĩa
  await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'instant' }));
  await page.waitForTimeout(500);

  const p1 = path.join(SCREENSHOT_DIR, '01-chuyen-bo-ke-desktop.png');
  await page.screenshot({ path: p1 });
  console.log('Saved:', p1);

  // 2. Screenshot 2: 'Bò đọc trộm' (Cow Eavesdrop)
  console.log('--- 2. Chụp Bò đọc trộm (/eavesdrop) ---');
  await page.goto('http://localhost:3000/eavesdrop', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Mở transcript
  const transcriptBtn = await page.$('button:has-text("Xem lời thoại")');
  if (transcriptBtn) {
    await transcriptBtn.click();
    await page.waitForTimeout(400);
  }

  // Chọn 1 đáp án câu hỏi để kích hoạt trích dẫn chứng cứ transcript
  const optionBtn = await page.$('button:has-text("sustainable urban transport")');
  if (optionBtn) {
    await optionBtn.click();
    await page.waitForTimeout(400);
  }

  // Cuộn để thấy rõ câu hỏi trắc nghiệm với nút 'Nghe lại đoạn chứng cứ' và trích dẫn transcript
  await page.evaluate(() => window.scrollTo({ top: 620, behavior: 'instant' }));
  await page.waitForTimeout(500);

  const p2 = path.join(SCREENSHOT_DIR, '02-bo-doc-trom-desktop.png');
  await page.screenshot({ path: p2 });
  console.log('Saved:', p2);

  await browser.close();
  console.log('Đã hoàn thành chụp đủ 2 ảnh màn hình desktop cho nhóm 5!');
}

capture().catch((err) => {
  console.error('Lỗi chụp screenshot:', err);
  process.exit(1);
});
