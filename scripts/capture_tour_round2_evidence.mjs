import { chromium } from '../node_modules/.pnpm/playwright@1.62.1/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const TUNNEL_BASE = 'https://pebble-implosion-art.ngrok-free.dev';
const targetDir = 'C:\\Mod\\muse-mailbox\\inbox';
const brainDir = 'C:\\Users\\ADMIN\\.gemini\\antigravity-ide\\brain\\0bd9d617-5304-423d-b1ed-51e8b88707d0';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function capture() {
  console.log('Launching browser with Playwright to capture evidence via tunnel:', TUNNEL_BASE);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    extraHTTPHeaders: {
      'ngrok-skip-browser-warning': 'true',
    },
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  // Helper to save screenshot to both dirs
  async function saveScreenshot(filename, clipOrOptions = {}) {
    const p1 = path.join(targetDir, filename);
    const p2 = path.join(brainDir, filename);
    await page.screenshot({ path: p1, ...clipOrOptions });
    fs.copyFileSync(p1, p2);
    console.log(`Saved screenshot: ${filename} (${fs.statSync(p1).size} bytes)`);
  }

  try {
    // 1. P2.1: /admin redirects to /login when unauthenticated
    console.log('\n--- 1. Capturing P2.1: /admin redirect to /login ---');
    await page.goto(`${TUNNEL_BASE}/admin`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    console.log('Current URL after /admin navigation:', page.url());
    await saveScreenshot('p2_1_admin_redirect_to_login.png');

    // 2. P2.2: /analytics with baseline insights & 7-day study plan
    console.log('\n--- 2. Capturing P2.2: /analytics baseline insights & 7-day study plan ---');
    await page.goto(`${TUNNEL_BASE}/analytics`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500);
    // Scroll down to Cow Insights and Study Plan
    await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Kế Hoạch Học 7 Ngày'));
      if (heading) {
        heading.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else {
        window.scrollBy(0, 750);
      }
    });
    await page.waitForTimeout(1000);
    await saveScreenshot('p2_2_analytics_plan_fallback.png');

    // 3. P2.3: Homepage flashcard deck with 5 thẻ còn & cow sticker clear
    console.log('\n--- 3. Capturing P2.3: Homepage card counter & cow sticker ---');
    await page.goto(`${TUNNEL_BASE}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await saveScreenshot('p2_3_homepage_card_counter_clear.png');

    // 4. P2.4: /practice with subtitle 9 activities
    console.log('\n--- 4. Capturing P2.4: /practice subtitle 9 methods ---');
    await page.goto(`${TUNNEL_BASE}/practice`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await saveScreenshot('p2_4_practice_subtitle_9_methods.png');

    // 5. P2.5: /roadmap with aspirational motivation banner
    console.log('\n--- 5. Capturing P2.5: /roadmap aspirational motivation banner ---');
    await page.goto(`${TUNNEL_BASE}/roadmap`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500);
    // Scroll down to destination anchor
    await page.evaluate(() => {
      const anchor = document.getElementById('destination-anchor');
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else {
        window.scrollTo(0, document.body.scrollHeight);
      }
    });
    await page.waitForTimeout(1200);
    await saveScreenshot('p2_5_roadmap_aspirational_banner.png');

    console.log('\nAll P2 evidence screenshots captured successfully!');
  } catch (err) {
    console.error('Error during evidence capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
