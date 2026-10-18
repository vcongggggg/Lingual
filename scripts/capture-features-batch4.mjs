import { chromium } from '../node_modules/.pnpm/playwright@1.62.1/node_modules/playwright/index.mjs';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/ui-screenshots/features-batch4');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log('Khởi chạy Chromium qua Playwright để chụp 4 tính năng Nhóm 4...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 950 },
  });
  const page = await context.newPage();

  // 1. Screenshot 1: 'Thử thách mỗi ngày' (Daily Challenge)
  console.log('--- 1. Chụp Thử thách mỗi ngày (/daily) ---');
  await page.goto('http://localhost:3000/daily', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const openEnvelopeBtn = await page.$('text=Bóc Mở Phong Bì');
  if (openEnvelopeBtn) {
    await openEnvelopeBtn.click();
    await page.waitForTimeout(600);
  }

  const optionBtn = await page.$('button:has-text("Sự kiên trì, bền bỉ")');
  if (optionBtn) {
    await optionBtn.click();
    await page.waitForTimeout(300);
  }

  const p1 = path.join(SCREENSHOT_DIR, '01-daily-challenge-desktop.png');
  await page.screenshot({ path: p1 });
  console.log('Saved:', p1);

  // 2. Screenshot 2: 'Lá thư từ bò' (Letters from LingLing)
  console.log('--- 2. Chụp Lá thư từ bò (/letters) ---');
  await page.goto('http://localhost:3000/letters', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const chip1 = await page.$('button:has-text("perseverance")');
  if (chip1) await chip1.click();
  await page.waitForTimeout(200);

  const chip2 = await page.$('button:has-text("fascinating")');
  if (chip2) await chip2.click();
  await page.waitForTimeout(200);

  const checkLetterBtn = await page.$('button:has-text("Chấm mực thư tay")');
  if (checkLetterBtn) {
    await checkLetterBtn.click();
    await page.waitForTimeout(500);
  }

  // Cuộn nhẹ để thấy vừa trọn vẹn cả con dấu bưu phẩm + dấu sáp và chữ ký Bò
  await page.evaluate(() => window.scrollTo({ top: 180, behavior: 'instant' }));
  await page.waitForTimeout(400);

  const p2 = path.join(SCREENSHOT_DIR, '02-letters-from-cow-desktop.png');
  await page.screenshot({ path: p2 });
  console.log('Saved:', p2);

  // 3. Screenshot 3: 'Bò nhại tiếng' (Shadowing Lab)
  console.log('--- 3. Chụp Bò nhại tiếng (/listening/shadowing) ---');
  await page.goto('http://localhost:3000/listening/shadowing', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const manualModeBtn = await page.$('button:has-text("Chế độ gõ phím")');
  if (manualModeBtn) {
    await manualModeBtn.click();
    await page.waitForTimeout(300);
    const input = await page.$('input[placeholder*="Gõ lại câu tiếng Anh"]');
    if (input) {
      await input.fill('Every morning I drink a cup of warm water and plan my work for the day');
      const submitBtn = await page.$('button:has-text("Chấm bài")');
      if (submitBtn) await submitBtn.click();
      await page.waitForTimeout(600);
    }
  }

  // Cuộn để thấy trọn vẹn bảng chấm bài cô giáo + con dấu StampSlam 100% + các từ khoanh mực đỏ
  await page.evaluate(() => window.scrollTo({ top: 520, behavior: 'instant' }));
  await page.waitForTimeout(400);

  const p3 = path.join(SCREENSHOT_DIR, '03-shadowing-teacher-grading-desktop.png');
  await page.screenshot({ path: p3 });
  console.log('Saved:', p3);

  // 4. Screenshot 4: 'Đài phát thanh bò' (Retro Paper Radio)
  console.log('--- 4. Chụp Đài phát thanh bò (/listening) ---');
  await page.goto('http://localhost:3000/listening', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const channel2Btn = await page.$('button:has-text("Truyện Kể")');
  if (channel2Btn) {
    await channel2Btn.click();
    await page.waitForTimeout(600);
  }

  await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'instant' }));
  await page.waitForTimeout(400);

  const p4 = path.join(SCREENSHOT_DIR, '04-retro-paper-radio-desktop.png');
  await page.screenshot({ path: p4 });
  console.log('Saved:', p4);

  await browser.close();
  console.log('Đã hoàn thành chụp đủ 4 ảnh màn hình desktop chuẩn xác cho nhóm 4!');
}

capture().catch((err) => {
  console.error('Lỗi chụp screenshot:', err);
  process.exit(1);
});
