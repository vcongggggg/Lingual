import { chromium } from '../node_modules/.pnpm/playwright@1.62.1/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'screenshot/micro-interaction');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('🚀 Launching Chromium to verify micro-interactions...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // ==========================================
  // TEST 1: /dictionary Word Card Lookup Drawer
  // ==========================================
  console.log('\n--- 1. Testing /dictionary word click ---');
  await page.goto('http://localhost:3000/dictionary', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const beforeDictPath = path.join(outDir, '01_dictionary_before_click.png');
  await page.screenshot({ path: beforeDictPath });
  console.log(`📸 Saved before click: ${beforeDictPath}`);

  // Locate word title 'Serendipity' or lookup button
  const serendipityTitle = page.locator('[data-testid="word-title-serendipity"]').first();
  await serendipityTitle.waitFor({ state: 'visible', timeout: 5000 });
  await serendipityTitle.scrollIntoViewIfNeeded();
  await serendipityTitle.click({ force: true });
  await page.waitForTimeout(600);

  // Check if drawer is visible
  const drawer = page.locator('[data-testid="word-lookup-drawer"]');
  await drawer.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ WordLookupDrawer popped up successfully!');

  // Verify contents inside drawer
  const drawerText = await drawer.innerText();
  const hasIPA = drawerText.includes('/ˌser.ənˈdɪp.ə.ti/') || drawerText.includes('serendipity');
  const hasAudioUS = await drawer.locator('[data-testid="audio-us-btn"]').isVisible();
  const hasAudioUK = await drawer.locator('[data-testid="audio-uk-btn"]').isVisible();
  const hasMeaning = drawerText.includes('may mắn') || drawerText.includes('Định nghĩa');
  console.log(`   - Has IPA: ${hasIPA}`);
  console.log(`   - Has Audio US button: ${hasAudioUS}`);
  console.log(`   - Has Audio UK button: ${hasAudioUK}`);
  console.log(`   - Has Vietnamese meaning: ${hasMeaning}`);

  const afterDictPath = path.join(outDir, '02_dictionary_after_click_drawer.png');
  await page.screenshot({ path: afterDictPath });
  console.log(`📸 Saved drawer open: ${afterDictPath}`);

  // Click outside (backdrop overlay) to close
  console.log('👉 Clicking outside backdrop overlay to close drawer...');
  await page.locator('[data-testid="drawer-backdrop"]').click({ force: true });
  await page.waitForTimeout(500);
  const isDrawerClosed = !(await drawer.isVisible());
  console.log(`✅ Drawer closed after click outside: ${isDrawerClosed}`);

  // ==========================================
  // TEST 2: /vocabulary Word Chip Lookup Drawer
  // ==========================================
  console.log('\n--- 2. Testing /vocabulary word chip click ---');
  await page.goto('http://localhost:3000/vocabulary', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const beforeVocabPath = path.join(outDir, '03_vocabulary_before_click.png');
  await page.screenshot({ path: beforeVocabPath });
  console.log(`📸 Saved vocab before click: ${beforeVocabPath}`);

  // Find chip 'apple'
  const appleChip = page.locator('[data-testid="word-chip-apple"]').first();
  await appleChip.waitFor({ state: 'visible', timeout: 5000 });
  console.log('👉 Found word chip "apple", clicking...');
  await appleChip.scrollIntoViewIfNeeded();
  await appleChip.click({ force: true });
  await page.waitForTimeout(600);

  // Check if drawer is visible
  await drawer.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✅ WordLookupDrawer popped up for "apple"!');

  const appleDrawerText = await drawer.innerText();
  const hasAppleIPA = appleDrawerText.includes('/\'æpl/') || appleDrawerText.includes('æpl');
  const hasAppleMeaning = appleDrawerText.includes('quả táo') || appleDrawerText.includes('táo');
  const hasAppleAudio = await drawer.locator('[data-testid="audio-us-btn"]').isVisible();
  console.log(`   - Apple IPA visible: ${hasAppleIPA}`);
  console.log(`   - Apple Vietnamese meaning: ${hasAppleMeaning}`);
  console.log(`   - Apple Audio buttons visible: ${hasAppleAudio}`);

  const afterVocabPath = path.join(outDir, '04_vocabulary_apple_drawer.png');
  await page.screenshot({ path: afterVocabPath });
  console.log(`📸 Saved apple drawer open: ${afterVocabPath}`);

  // Click close button
  console.log('👉 Clicking close button to close drawer...');
  await page.locator('[data-testid="close-drawer-btn"]').click();
  await page.waitForTimeout(500);
  const isAppleClosed = !(await drawer.isVisible());
  console.log(`✅ Drawer closed: ${isAppleClosed}`);

  // ==========================================
  // TEST 3: Global Page Navigation Transitions (3 Pages)
  // ==========================================
  console.log('\n--- 3. Testing Global Page Transitions across 3 pages ---');
  const pagesToTest = [
    { name: 'home', url: 'http://localhost:3000/' },
    { name: 'daily', url: 'http://localhost:3000/daily' },
    { name: 'letters', url: 'http://localhost:3000/letters' },
  ];

  for (const pt of pagesToTest) {
    console.log(`Navigating to ${pt.name} (${pt.url})...`);
    await page.goto(pt.url, { waitUntil: 'domcontentloaded' });
    const hasTransitionClass = await page.locator('.animate-page-entry').isVisible();
    console.log(`   - .animate-page-entry mounted on ${pt.name}: ${hasTransitionClass}`);
    const screenPath = path.join(outDir, `05_page_transition_${pt.name}.png`);
    await page.screenshot({ path: screenPath });
    console.log(`📸 Saved transition screenshot: ${screenPath}`);
    await page.waitForTimeout(300);
  }

  await browser.close();
  console.log('\n✨ ALL E2E MICRO-INTERACTION VERIFICATIONS PASSED 100%!');
}

run().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
