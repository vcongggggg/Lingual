import { chromium } from '../node_modules/.pnpm/playwright@1.62.1/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'docs/ui-screenshots/features-batch3');
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

  // 1. SỔ TEM (/profile)
  console.log('\n--- 1. Chụp Sổ Tem trong /profile ---');
  await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  try {
    const stampSec = page.locator('#so-tem');
    if (await stampSec.isVisible()) {
      await stampSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }
  } catch (err) {
    console.log('Lưu ý scroll sổ tem:', err);
  }
  const p1Path = path.join(outDir, '01-so-tem-profile-desktop.png');
  await page.screenshot({ path: p1Path });
  console.log(`Saved: ${p1Path}`);

  // 2. DASHBOARD WIDGET + STREAK CARD
  console.log('\n--- 2. Chụp Dashboard Widget Sổ Tem + StreakCard ---');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const p2Path = path.join(outDir, '02-dashboard-widget-streak-card-desktop.png');
  await page.screenshot({ path: p2Path });
  console.log(`Saved: ${p2Path}`);

  // 3. STREAK CARD KHI DÙNG PHIẾU NGHỈ PHÉP (BÒ SLEEPING + BANNER)
  console.log('\n--- 3. Chụp StreakCard khi dùng phiếu nghỉ phép ---');
  try {
    const testMissedBtn = page.locator('button:has-text("Thử quên 1 ngày")').first();
    if (await testMissedBtn.isVisible()) {
      await testMissedBtn.click();
      await page.waitForTimeout(600);
    }
  } catch (err) {
    console.log('Lưu ý click test quên ngày:', err);
  }
  const p3Path = path.join(outDir, '03-streak-card-leave-pass-used-desktop.png');
  await page.screenshot({ path: p3Path });
  console.log(`Saved: ${p3Path}`);

  // 4. FIX 1: CÔ GIÁO CHỮA BÀI (THU GỌN MẶC ĐỊNH + FONT VIẾT TAY)
  console.log('\n--- 4. Chụp Fix 1: Cô giáo chữa bài thu gọn & font viết tay ---');
  await page.goto('http://localhost:3000/ielts/practice/reading', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  try {
    const optBtn = page.locator('button:has-text("Over 80 percent")').first();
    if (await optBtn.isVisible()) {
      await optBtn.click();
      await page.waitForTimeout(300);
    }
    const submitBtn = page.locator('button:has-text("Nộp bài chấm điểm")');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(800);
    }
    // Bấm nút "Xem cô chữa" để mở rộng
    const openTeacherBtn = page.locator('button:has-text("Xem cô chữa")').first();
    if (await openTeacherBtn.isVisible()) {
      await openTeacherBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await openTeacherBtn.click();
      await page.waitForTimeout(600);
    }
  } catch (err) {
    console.log('Lưu ý click cô giáo chữa bài:', err);
  }
  const p4Path = path.join(outDir, '04-fix1-co-giao-chua-bai-handwriting-desktop.png');
  await page.screenshot({ path: p4Path });
  console.log(`Saved: ${p4Path}`);

  // 5. FIX 2: PHIẾU THƯ VIỆN (AUDIO US/UK TRÊN HEADER DÙNG CHUNG)
  console.log('\n--- 5. Chụp Fix 2: Phiếu thư viện header audio ---');
  await page.goto('http://localhost:3000/dictionary', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const p5Path = path.join(outDir, '05-fix2-phieu-thu-vien-header-audio-desktop.png');
  await page.screenshot({ path: p5Path });
  console.log(`Saved: ${p5Path}`);

  // 6. FIX 3: BÁO TƯỜNG (POPUP TRA TỪ INLINE TỰ ĐÓNG KHI TAP RA NGOÀI)
  console.log('\n--- 6. Chụp Fix 3: Báo tường tra từ inline ---');
  await page.goto('http://localhost:3000/reading/practice', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  try {
    const wordTarget = page.locator('span:text-is("challenges")').first();
    if (await wordTarget.isVisible()) {
      await wordTarget.click();
      await page.waitForTimeout(600);
    }
  } catch (err) {
    console.log('Lưu ý click popup từ:', err);
  }
  const p6Path = path.join(outDir, '06-fix3-bao-tuong-reading-desktop.png');
  await page.screenshot({ path: p6Path });
  console.log(`Saved: ${p6Path}`);

  // 7. FIX 4: TRUYỆN SONG NGỮ (PRELOAD TRANG KẾ BÊN)
  console.log('\n--- 7. Chụp Fix 4: Truyện song ngữ lật trang mượt ---');
  await page.goto('http://localhost:3000/practice', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  try {
    const storyTab = page.locator('button:has-text("3. Truyện song ngữ")');
    if (await storyTab.isVisible()) {
      await storyTab.click();
      await page.waitForTimeout(600);
    }
    const openVi = page.locator('button:has-text("Xem bản dịch tiếng Việt")');
    if (await openVi.isVisible()) {
      await openVi.click();
      await page.waitForTimeout(400);
    }
  } catch (err) {
    console.log('Lưu ý click truyện song ngữ:', err);
  }
  const p7Path = path.join(outDir, '07-fix4-truyen-song-ngu-desktop.png');
  await page.screenshot({ path: p7Path });
  console.log(`Saved: ${p7Path}`);

  // 8. FIX 5: QUIZ CÓ BẰNG CHỨNG (SINH ĐỘNG TỪ TRANSCRIPT)
  console.log('\n--- 8. Chụp Fix 5: Quiz có bằng chứng sinh động từ transcript ---');
  await page.goto('http://localhost:3000/listening/practice', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  try {
    const quizMode = page.locator('button:has-text("Quiz có bằng chứng")');
    if (await quizMode.isVisible()) {
      await quizMode.click();
      await page.waitForTimeout(600);
    }
    // Trả lời thử câu hỏi trắc nghiệm động để thấy bằng chứng & giải thích
    const optDyn = page.locator('button:has-text("B. Sự đều đặn và lòng kiên trì")');
    if (await optDyn.isVisible()) {
      await optDyn.click();
      await page.waitForTimeout(500);
    }
    await page.evaluate(() => window.scrollBy(0, 180));
    await page.waitForTimeout(400);
  } catch (err) {
    console.log('Lưu ý click quiz option:', err);
  }
  const p8Path = path.join(outDir, '08-fix5-quiz-co-bang-chung-dynamic-desktop.png');
  await page.screenshot({ path: p8Path });
  console.log(`Saved: ${p8Path}`);

  await browser.close();
  console.log('\nĐÃ HOÀN TẤT CHỤP TẤT CẢ 8/8 ẢNH MÀN HÌNH THEO YÊU CẦU!');
}

run().catch((err) => {
  console.error('Lỗi khi chụp screenshots:', err);
  process.exit(1);
});
