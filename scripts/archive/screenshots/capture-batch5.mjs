import pkg from '../apps/web/node_modules/@playwright/test/index.js';
const { chromium } = pkg;
import sharp from '../apps/web/node_modules/sharp/lib/index.js';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'docs/ui-screenshots/r1-batch5');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const pages = [
  { name: 'profile', url: 'http://localhost:3001/profile' },
  { name: 'roadmap', url: 'http://localhost:3001/roadmap' },
  { name: 'listening-shadowing', url: 'http://localhost:3001/listening/shadowing' },
  { name: 'speaking-repetition', url: 'http://localhost:3001/speaking/repetition' },
  { name: 'speaking-picture', url: 'http://localhost:3001/speaking/picture' },
  { name: 'speaking-history', url: 'http://localhost:3001/speaking/history' },
  { name: 'writing-see-write', url: 'http://localhost:3001/writing/see-write' },
  { name: 'writing-free', url: 'http://localhost:3001/writing/free' },
  { name: 'reading-history', url: 'http://localhost:3001/reading/history' },
  { name: 'vocabulary-detail', url: 'http://localhost:3001/vocabulary/resilience' },
  { name: 'exam-practice', url: 'http://localhost:3001/exam-practice' },
  { name: 'exam-toeic', url: 'http://localhost:3001/exam-practice/toeic' },
  { name: 'exam-history', url: 'http://localhost:3001/exam-practice/history' },
  { name: 'community', url: 'http://localhost:3001/community' },
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
  console.log('Launching browser via Playwright for Batch 5...');
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
  console.log('\nAll Batch 5 screenshots captured and compressed successfully!');
}

run().catch((err) => {
  console.error('Error during Batch 5 capture:', err);
  process.exit(1);
});
