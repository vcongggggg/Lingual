import pkg from '../apps/web/node_modules/@playwright/test/index.js';
const { chromium } = pkg;
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'docs/ui-screenshots/r1-old-reference');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const items = [
  { name: 'lab-listening-desktop.png', url: 'http://localhost:3000/vi/listening' },
  { name: 'lab-listening-practice-desktop.png', url: 'http://localhost:3000/vi/listening/dictation' },
  { name: 'lab-speaking-desktop.png', url: 'http://localhost:3000/vi/speaking' },
  { name: 'lab-speaking-practice-desktop.png', url: 'http://localhost:3000/vi/speaking/pronunciation' },
  { name: 'lab-reading-desktop.png', url: 'http://localhost:3000/vi/reading' },
  { name: 'lab-reading-practice-desktop.png', url: 'http://localhost:3000/vi/reading/a1-morning-coffee' },
  { name: 'lab-writing-desktop.png', url: 'http://localhost:3000/vi/writing' },
  { name: 'lab-writing-practice-desktop.png', url: 'http://localhost:3000/vi/writing/guided' },
  { name: 'lab-vocabulary-desktop.png', url: 'http://localhost:3000/vi/vocabulary' },
  { name: 'lab-vocabulary-practice-desktop.png', url: 'http://localhost:3000/vi/vocabulary/practice' },
];

async function run() {
  console.log('Launching browser via Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  for (const item of items) {
    console.log(`Navigating to ${item.url}...`);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle', timeout: 15000 });
    } catch (e) {
      console.log(`Network idle timed out for ${item.url}, waiting 2s...`);
      await page.waitForTimeout(2000);
    }
    await page.waitForTimeout(1000);
    const filePath = path.join(outDir, item.name);
    await page.screenshot({ path: filePath });
    const sizeKb = Math.round(fs.statSync(filePath).size / 1024);
    console.log(`Captured: ${item.name} (${sizeKb} KB)`);
  }

  await browser.close();
  console.log('\nAll 10 old reference screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Error capturing old reference screenshots:', err);
  process.exit(1);
});
