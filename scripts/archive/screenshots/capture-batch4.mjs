import pkg from '../apps/web/node_modules/@playwright/test/index.js';
const { chromium } = pkg;
import sharp from '../apps/web/node_modules/sharp/lib/index.js';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'docs/ui-screenshots/r1-batch4');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const pages = [
  { name: 'dictionary', url: 'http://localhost:3001/dictionary' },
  { name: 'tutor', url: 'http://localhost:3001/tutor' },
  { name: 'tutor-history', url: 'http://localhost:3001/tutor/history' },
  { name: 'tutor-plan', url: 'http://localhost:3001/tutor/plan' },
  { name: 'analytics', url: 'http://localhost:3001/analytics' },
  { name: 'analytics-reading', url: 'http://localhost:3001/analytics/reading' },
  { name: 'analytics-listening', url: 'http://localhost:3001/analytics/listening' },
  { name: 'admin', url: 'http://localhost:3001/admin' },
  { name: 'admin-audit-log', url: 'http://localhost:3001/admin/audit-log' },
];

async function compressAndSave(buffer, targetPath) {
  const optimized = await sharp(buffer)
    .png({
      compressionLevel: 9,
      palette: true,
      quality: 80,
    })
    .toBuffer();
  fs.writeFileSync(targetPath, optimized);
  const sizeKb = Math.round(optimized.length / 1024);
  return sizeKb;
}

async function run() {
  console.log('Launching browser via Playwright for Batch 4...');
  const browser = await chromium.launch({ headless: true });

  for (const p of pages) {
    console.log(`\n========================================`);
    console.log(`Capturing: ${p.name} (${p.url})`);
    console.log(`========================================`);

    // 1. Desktop: 1440x900
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const desktopPage = await desktopContext.newPage();
    try {
      await desktopPage.goto(p.url, { waitUntil: 'networkidle', timeout: 15000 });
    } catch {
      await desktopPage.waitForTimeout(2000);
    }
    await desktopPage.waitForTimeout(1000);
    const desktopBuf = await desktopPage.screenshot();
    const desktopPath = path.join(outDir, `${p.name}-desktop.png`);
    const dKb = await compressAndSave(desktopBuf, desktopPath);
    console.log(`[DESKTOP] Saved: ${p.name}-desktop.png (${dKb} KB)`);
    await desktopContext.close();

    // 2. Mobile: 390x844
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      deviceScaleFactor: 1,
    });
    const mobilePage = await mobileContext.newPage();
    try {
      await mobilePage.goto(p.url, { waitUntil: 'networkidle', timeout: 15000 });
    } catch {
      await mobilePage.waitForTimeout(2000);
    }
    await mobilePage.waitForTimeout(1000);
    const mobileBuf = await mobilePage.screenshot();
    const mobilePath = path.join(outDir, `${p.name}-mobile.png`);
    const mKb = await compressAndSave(mobileBuf, mobilePath);
    console.log(`[MOBILE]  Saved: ${p.name}-mobile.png (${mKb} KB)`);
    await mobileContext.close();
  }

  await browser.close();
  console.log('\nAll 18 screenshots for Batch 4 captured and compressed successfully!');
}

run().catch((err) => {
  console.error('Error during Batch 4 capture:', err);
  process.exit(1);
});
