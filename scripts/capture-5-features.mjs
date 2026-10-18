import { chromium } from '../node_modules/.pnpm/playwright@1.62.1/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'docs/ui-screenshots/features-batch1');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Khởi chạy Chromium qua Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // 1. TÍNH NĂNG 1: "CHÍNH TẢ DÒNG KẺ" (/listening/practice)
  console.log('\n--- 1. Chụp tính năng: Chính tả dòng kẻ ---');
  await page.goto('http://localhost:3000/listening/practice', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const p1Path = path.join(outDir, '01-chinh-ta-dong-ke-desktop.png');
  await page.screenshot({ path: p1Path });
  console.log(`Saved: ${p1Path}`);

  // 2. TÍNH NĂNG 2: "DÁN CỤM LÊN BẢNG" (/practice - Mode Collocation)
  console.log('\n--- 2. Chụp tính năng: Dán cụm lên bảng ---');
  await page.goto('http://localhost:3000/practice', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const p2Path = path.join(outDir, '02-dan-cum-len-bang-desktop.png');
  await page.screenshot({ path: p2Path });
  console.log(`Saved: ${p2Path}`);

  // 3. TÍNH NĂNG 3: "CÔ GIÁO CHỮA BÀI" (/ielts/practice/reading - Bấm nộp bài để xem 4 bước)
  console.log('\n--- 3. Chụp tính năng: Cô giáo chữa bài (4 bước lề vở mực đỏ) ---');
  await page.goto('http://localhost:3000/ielts/practice/reading', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  try {
    const optBtn = await page.locator('button:has-text("Over 80 percent")').first();
    if (await optBtn.isVisible()) {
      await optBtn.click();
      await page.waitForTimeout(400);
    }
    const submitBtn = await page.locator('button:has-text("Nộp bài chấm điểm")');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
    }
    await page.evaluate(() => window.scrollBy(0, 350));
    await page.waitForTimeout(600);
  } catch (err) {
    console.log('Note interacting with submit button:', err);
  }
  const p3Path = path.join(outDir, '03-co-giao-chua-bai-desktop.png');
  await page.screenshot({ path: p3Path });
  console.log(`Saved: ${p3Path}`);

  // 4. TÍNH NĂNG 4: "KHOANH LỖI SAI" (/practice - Mode Khoanh lỗi sai)
  console.log('\n--- 4. Chụp tính năng: Khoanh lỗi sai (Chạm để khoanh tròn + 3 mẩu giấy) ---');
  await page.goto('http://localhost:3000/practice', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const errorModeTab = await page.locator('button:has-text("2. Khoanh lỗi sai")');
  if (await errorModeTab.isVisible()) {
    await errorModeTab.click();
    await page.waitForTimeout(600);
  }
  const segmentBtn = await page.locator('button:has-text("Despite of")');
  if (await segmentBtn.isVisible()) {
    await segmentBtn.click();
    await page.waitForTimeout(600);
  }
  const p4Path = path.join(outDir, '04-khoanh-loi-sai-desktop.png');
  await page.screenshot({ path: p4Path });
  console.log(`Saved: ${p4Path}`);

  // 5. TÍNH NĂNG 5: "PHIẾU THƯ VIỆN" (/dictionary - 4 Tab + Audio US/UK + Bài đã học)
  console.log('\n--- 5. Chụp tính năng: Phiếu thư viện (4 Tab + Audio US/UK + Trích bài học) ---');
  await page.goto('http://localhost:3000/dictionary', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  try {
    const exampleTab = await page.locator('button:has-text("4. Ví dụ bài học")').first();
    if (await exampleTab.isVisible()) {
      await exampleTab.click();
      await page.waitForTimeout(500);
    }
  } catch (err) {
    console.log('Note clicking tab:', err);
  }
  const p5Path = path.join(outDir, '05-phieu-thu-vien-desktop.png');
  await page.screenshot({ path: p5Path });
  console.log(`Saved: ${p5Path}`);

  await browser.close();
  console.log('\nĐÃ CHỤP THÀNH CÔNG 5/5 ẢNH MÀN HÌNH DESKTOP CHO CẢ 5 TÍNH NĂNG!');
}

run().catch((err) => {
  console.error('Lỗi chụp screenshot:', err);
  process.exit(1);
});
