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
  console.log('Launching browser with Playwright to capture leftover evidence via tunnel:', TUNNEL_BASE);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    extraHTTPHeaders: {
      'ngrok-skip-browser-warning': 'true',
    },
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  async function saveScreenshot(filename, clipOrOptions = {}) {
    const p1 = path.join(targetDir, filename);
    const p2 = path.join(brainDir, filename);
    await page.screenshot({ path: p1, ...clipOrOptions });
    fs.copyFileSync(p1, p2);
    console.log(`Saved screenshot: ${filename} (${fs.statSync(p1).size} bytes)`);
  }

  try {
    // 1. Item 1: /analytics - Nút "Lập kế hoạch mới" hiển thị rõ chữ, nền teal, cạnh dropdown
    console.log('\n--- 1. Capturing Item 1: /analytics visible "Lập kế hoạch mới" button ---');
    await page.goto(`${TUNNEL_BASE}/analytics`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Kế Hoạch Học 7 Ngày'));
      if (heading) {
        heading.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });
    await page.waitForTimeout(1000);
    await saveScreenshot('leftover_1_analytics_plan_button_visible.png');

    // 2. Item 2 & 3: /practice - Tiêu đề bảng không còn "(NOTICE BOARD)" và nhãn "Luyện IELTS Writing (Task 2)"
    console.log('\n--- 2. Capturing Items 2 & 3: /practice notice board title and topic badge ---');
    await page.goto(`${TUNNEL_BASE}/practice`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      const boardHeader = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('BẢNG TỔNG HỢP CỤM TỪ'));
      if (boardHeader) {
        boardHeader.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });
    await page.waitForTimeout(1000);
    await saveScreenshot('leftover_2_practice_board_title_and_topic.png');

    console.log('\nAll leftover evidence screenshots captured successfully!');
  } catch (err) {
    console.error('Error during evidence capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
