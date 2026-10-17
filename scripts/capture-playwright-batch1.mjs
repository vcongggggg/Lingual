import pkg from '../apps/web/node_modules/@playwright/test/index.js';
const { chromium } = pkg;
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'docs/ui-screenshots/r1-batch1');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const pages = [
  { name: 'home', url: 'http://localhost:3001/' },
  { name: 'dashboard', url: 'http://localhost:3001/dashboard' },
  { name: 'login', url: 'http://localhost:3001/login' },
  { name: 'register', url: 'http://localhost:3001/register' }
];

async function run() {
  console.log('Launching browser via Playwright...');
  const browser = await chromium.launch({ headless: true });

  for (const p of pages) {
    console.log(`\n--- Capturing ${p.name} ---`);
    
    // 1. Desktop: 1440x900
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(p.url, { waitUntil: 'networkidle' });
    const desktopPath = path.join(outDir, `${p.name}-desktop.png`);
    await desktopPage.screenshot({ path: desktopPath });
    console.log(`Saved Desktop: ${desktopPath} (${fs.statSync(desktopPath).size} bytes)`);
    await desktopContext.close();

    // 2. Mobile: 390x844
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(p.url, { waitUntil: 'networkidle' });
    const mobilePath = path.join(outDir, `${p.name}-mobile.png`);
    await mobilePage.screenshot({ path: mobilePath });
    console.log(`Saved Mobile: ${mobilePath} (${fs.statSync(mobilePath).size} bytes)`);
    await mobileContext.close();
  }

  await browser.close();
  console.log('\nAll Batch 1 screenshots captured successfully via Playwright!');
}

run().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
