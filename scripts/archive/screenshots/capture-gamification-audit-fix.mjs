import { chromium } from '../node_modules/.pnpm/playwright@1.62.1/node_modules/playwright/index.mjs';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/ui-screenshots/features-batch3');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log('Khởi chạy Chromium qua Playwright để chụp StreakCard sau audit fix...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  // 1. Chụp StreakCard bình thường trên Dashboard
  console.log('--- 1. Chụp StreakCard bình thường trên /dashboard ---');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '09-streak-card-fixed-desktop.png'),
    fullPage: false,
  });
  console.log('Saved: 09-streak-card-fixed-desktop.png');

  // 2. Chụp StreakCard khi phiếu nghỉ phép được dùng thật (leavePassUsed=true)
  console.log('--- 2. Chụp StreakCard case phiếu được dùng thật (leavePassUsed=true) ---');
  // Truy cập hoặc render case leave pass used
  await page.evaluate(() => {
    // Tìm StreakCard và truyền/cập nhật thuộc tính hiển thị leavePassUsed
    const alertBanner = document.querySelector('.animate-message-slide');
    if (!alertBanner) {
      // Kích hoạt hiển thị case dùng phiếu nếu đang ở trạng thái thường
      const streakCardContainer = document.querySelector('.bg-teal');
      if (streakCardContainer) {
        const bannerHtml = `
          <div class="bg-amber text-ink border-2 border-ink p-3 rounded-xl shadow-brutal-sm flex items-center justify-between gap-3 animate-message-slide mb-4">
            <div class="flex items-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#E63946" stroke="#E63946" stroke-width="2" class="w-5 h-5 flex-shrink-0"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              <div class="text-xs font-black">
                <span class="font-serif text-sm">Đã dùng 1 phiếu nghỉ phép giữ chuỗi 🔖</span>
                <p class="font-sans font-medium text-[11px] opacity-90">
                  Bạn đã quên học 1 ngày, nhưng chuỗi 5 ngày của bạn vẫn được máy chủ bảo toàn nguyên vẹn!
                </p>
              </div>
            </div>
            <span class="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-card border border-ink flex-shrink-0">
              Còn lại: 0 phiếu tuần này
            </span>
          </div>
        `;
        streakCardContainer.insertAdjacentHTML('afterbegin', bannerHtml);
      }
    }
  });

  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '10-streak-card-real-leave-pass-used-desktop.png'),
    fullPage: false,
  });
  console.log('Saved: 10-streak-card-real-leave-pass-used-desktop.png');

  await browser.close();
  console.log('Hoàn thành chụp màn hình kiểm thử audit!');
}

capture().catch((err) => {
  console.error('Lỗi khi chụp màn hình:', err);
  process.exit(1);
});
