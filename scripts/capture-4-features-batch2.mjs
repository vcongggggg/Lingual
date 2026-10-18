import { chromium } from '../node_modules/.pnpm/playwright@1.62.1/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'docs/ui-screenshots/features-batch2');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Khởi chạy Chromium qua Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
  });
  const page = await context.newPage();

  // 1. TÍNH NĂNG 1: "BÁO TƯỜNG" (/reading/practice)
  console.log('\n--- 1. Chụp tính năng: Báo Tường (Reading Lab 2 cột EN-VI + Tra từ inline) ---');
  await page.goto('http://localhost:3000/reading/practice', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Chạm vào từ "caffeine" hoặc "challenges" để hiển thị popup tra từ inline
  try {
    const wordTarget = page.locator('span:text-is("challenges")').first();
    if (await wordTarget.isVisible()) {
      await wordTarget.click();
      await page.waitForTimeout(600);
    }
  } catch (err) {
    console.log('Lưu ý click từ inline:', err);
  }
  
  const p1Path = path.join(outDir, '01-bao-tuong-reading-lab-desktop.png');
  await page.screenshot({ path: p1Path });
  console.log(`Saved: ${p1Path}`);

  // 2. TÍNH NĂNG 2: "TRUYỆN SONG NGỮ" (/practice - Mode 3)
  console.log('\n--- 2. Chụp tính năng: Truyện Song Ngữ (Sách lật 3D + Bản dịch thu gọn) ---');
  await page.goto('http://localhost:3000/practice', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  
  // Chuyển sang Tab "3. Truyện song ngữ"
  const storyTab = page.locator('button:has-text("3. Truyện song ngữ")');
  if (await storyTab.isVisible()) {
    await storyTab.click();
    await page.waitForTimeout(600);
  }
  
  // Mở bản dịch tiếng Việt thu gọn để thấy cả song ngữ
  const toggleViBtn = page.locator('button:has-text("Mở bản dịch tiếng Việt")');
  if (await toggleViBtn.isVisible()) {
    await toggleViBtn.click();
    await page.waitForTimeout(400);
  }

  const p2Path = path.join(outDir, '02-truyen-song-ngu-desktop.png');
  await page.screenshot({ path: p2Path });
  console.log(`Saved: ${p2Path}`);

  // 3. TÍNH NĂNG 3: "XẾP CÂU" (/practice - Mode 4)
  console.log('\n--- 3. Chụp tính năng: Xếp Câu (Mẩu giấy từ + Dòng kẻ vở + Gợi ý + Đóng dấu) ---');
  // Chuyển sang Tab "4. Xếp câu"
  const scrambleTab = page.locator('button:has-text("4. Xếp câu")');
  if (await scrambleTab.isVisible()) {
    await scrambleTab.click();
    await page.waitForTimeout(600);
  }
  
  // Chạm vào 2-3 mẩu từ trong khay để chúng bay lên dòng kẻ vở
  try {
    const tile1 = page.locator('button[title="Chạm để đưa vào câu"]').first();
    if (await tile1.isVisible()) {
      await tile1.click();
      await page.waitForTimeout(300);
    }
    const tile2 = page.locator('button[title="Chạm để đưa vào câu"]').first();
    if (await tile2.isVisible()) {
      await tile2.click();
      await page.waitForTimeout(300);
    }
  } catch (err) {
    console.log('Lưu ý click mẩu từ:', err);
  }

  const p3Path = path.join(outDir, '03-xep-cau-dong-ke-desktop.png');
  await page.screenshot({ path: p3Path });
  console.log(`Saved: ${p3Path}`);

  // 4. TÍNH NĂNG 4: "QUIZ CÓ BẰNG CHỨNG" (/listening/practice - Mode quiz)
  console.log('\n--- 4. Chụp tính năng: Quiz có bằng chứng (Audio dẫn chứng + Trích transcript) ---');
  await page.goto('http://localhost:3000/listening/practice', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  
  // Chuyển sang chế độ "Quiz có bằng chứng"
  const quizModeBtn = page.locator('button:has-text("Quiz có bằng chứng")');
  if (await quizModeBtn.isVisible()) {
    await quizModeBtn.click();
    await page.waitForTimeout(600);
  }
  
  // Trả lời thử câu hỏi trắc nghiệm để hiện bằng chứng transcript & chấm điểm
  try {
    const quizOption = page.locator('button:has-text("B. Uống một cốc nước ấm và lên kế hoạch làm việc trong ngày")');
    if (await quizOption.isVisible()) {
      await quizOption.click();
      await page.waitForTimeout(500);
    }
    // Cuộn nhẹ để thấy trọn vẹn câu hỏi và bằng chứng
    await page.evaluate(() => window.scrollBy(0, 180));
    await page.waitForTimeout(400);
  } catch (err) {
    console.log('Lưu ý click đáp án quiz:', err);
  }

  const p4Path = path.join(outDir, '04-quiz-co-bang-chung-desktop.png');
  await page.screenshot({ path: p4Path });
  console.log(`Saved: ${p4Path}`);

  await browser.close();
  console.log('\nĐÃ CHỤP THÀNH CÔNG 4/4 ẢNH MÀN HÌNH DESKTOP CHO CẢ 4 TÍNH NĂNG NHÓM 2!');
}

run().catch((err) => {
  console.error('Lỗi chụp screenshot:', err);
  process.exit(1);
});
