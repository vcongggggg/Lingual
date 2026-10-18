import { chromium } from '../node_modules/.pnpm/playwright@1.62.1/node_modules/playwright/index.mjs';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/ui-screenshots/scrollytelling-roadmap');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log('Khởi chạy Chromium qua Playwright để chụp Scrollytelling Roadmap...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  console.log('Truy cập http://localhost:3000/roadmap...');
  await page.goto('http://localhost:3000/roadmap', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 1. Screenshot Đầu Trang (Top - Vị trí ban đầu)
  console.log('--- 1. Chụp vị trí ĐẦU TRANG ---');
  await page.evaluate(() => window.scrollTo({ top: 150, behavior: 'instant' }));
  await page.waitForTimeout(1000);
  const topPath = path.join(SCREENSHOT_DIR, '01-roadmap-top.png');
  await page.screenshot({ path: topPath });
  console.log('Saved:', topPath);

  // 2. Screenshot Giữa Trang (Middle - Cuộn xuống giữa chặng 2 và 3)
  console.log('--- 2. Chụp vị trí GIỮA TRANG ---');
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
  await page.waitForTimeout(1000);
  const midPath = path.join(SCREENSHOT_DIR, '02-roadmap-middle.png');
  await page.screenshot({ path: midPath });
  console.log('Saved:', midPath);

  // 3. Screenshot Cuối Trang (Bottom - Đích đến & chúc mừng)
  console.log('--- 3. Chụp vị trí CUỐI TRANG ---');
  await page.evaluate(() => {
    const el = document.getElementById('destination-anchor');
    if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' });
    else window.scrollTo({ top: document.body.scrollHeight - 400, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  const bottomPath = path.join(SCREENSHOT_DIR, '03-roadmap-bottom.png');
  await page.screenshot({ path: bottomPath });
  console.log('Saved:', bottomPath);

  await browser.close();
  console.log('Hoàn thành chụp 3 vị trí Scrollytelling Roadmap!');
}

capture().catch((err) => {
  console.error('Lỗi khi chụp screenshot:', err);
  process.exit(1);
});
