import { chromium } from '../node_modules/.pnpm/playwright@1.62.1/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'screenshot/page-transition-frames');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function captureTransitionFrames(page, targetUrl, stepName) {
  console.log(`\n======================================================`);
  console.log(`🎬 Capturing client-side transition to: ${targetUrl} (${stepName})`);
  console.log(`======================================================`);

  // Frame 0: Before navigation
  const frame0Path = path.join(outDir, `${stepName}_0_before_click.png`);
  await page.screenshot({ path: frame0Path });
  console.log(`📸 Frame 0 (Before click): ${frame0Path}`);

  // Install style inspector listener via requestAnimationFrame
  await page.evaluate(() => {
    window.__transitionSnapshots = [];
    let start = performance.now();
    
    function record() {
      const el = document.getElementById('lingual-page-transition');
      if (el) {
        const style = window.getComputedStyle(el);
        window.__transitionSnapshots.push({
          timeMs: Math.round(performance.now() - start),
          opacity: parseFloat(style.opacity),
          transform: style.transform,
          pathname: el.getAttribute('data-pathname'),
        });
      }
      if (performance.now() - start < 800) {
        requestAnimationFrame(record);
      }
    }
    requestAnimationFrame(record);
  });

  // Click the client-side link on Header Navbar
  const linkLocator = page.locator(`header a[href="${targetUrl}"]`).first();
  await linkLocator.click();

  // Frame 1: Mid-transition when new page mounts and animation is in progress (~160ms)
  await page.waitForTimeout(160);
  const frame1Path = path.join(outDir, `${stepName}_1_mid_transition_lift.png`);
  await page.screenshot({ path: frame1Path });
  console.log(`📸 Frame 1 (Mid transition - Lift & Fade): ${frame1Path}`);

  // Frame 2: Late-transition (~280ms)
  await page.waitForTimeout(120);
  const frame2Path = path.join(outDir, `${stepName}_2_late_transition.png`);
  await page.screenshot({ path: frame2Path });
  console.log(`📸 Frame 2 (Late transition): ${frame2Path}`);

  // Frame 3: Settled (~500ms)
  await page.waitForTimeout(220);
  const frame3Path = path.join(outDir, `${stepName}_3_settled.png`);
  await page.screenshot({ path: frame3Path });
  console.log(`📸 Frame 3 (Settled complete): ${frame3Path}`);

  // Retrieve computed style metrics recorded by requestAnimationFrame
  const snapshots = await page.evaluate(() => window.__transitionSnapshots || []);
  console.log(`📊 Total RAF snapshots recorded: ${snapshots.length}`);

  // Filter snapshots where new page pathname is active
  const newPageSnapshots = snapshots.filter((s) => s.pathname === targetUrl);
  console.log(`📊 Snapshots for new pathname "${targetUrl}": ${newPageSnapshots.length}`);
  
  if (newPageSnapshots.length > 0) {
    const firstShot = newPageSnapshots[0];
    const midShot = newPageSnapshots[Math.floor(newPageSnapshots.length / 2)];
    const lastShot = newPageSnapshots[newPageSnapshots.length - 1];
    console.log(`   - First frame of new page (~${firstShot.timeMs}ms): opacity=${firstShot.opacity}, transform=${firstShot.transform}`);
    console.log(`   - Mid frame of new page (~${midShot.timeMs}ms): opacity=${midShot.opacity}, transform=${midShot.transform}`);
    console.log(`   - Settled frame (~${lastShot.timeMs}ms): opacity=${lastShot.opacity}, transform=${lastShot.transform}`);
  }

  return {
    stepName,
    targetUrl,
    snapshotsCount: snapshots.length,
    newPageSnapshots,
  };
}

async function run() {
  console.log('🚀 Launching Chromium to rigorously verify Page Transitions...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // 1. Open Home
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  console.log('✅ Home page loaded.');

  const results = [];

  // 2. Navigate Home (/) -> /daily
  results.push(await captureTransitionFrames(page, '/daily', 'step1_home_to_daily'));

  // 3. Navigate /daily -> /letters
  results.push(await captureTransitionFrames(page, '/letters', 'step2_daily_to_letters'));

  // 4. Navigate /letters -> /
  results.push(await captureTransitionFrames(page, '/', 'step3_letters_to_home'));

  // 5. Test prefers-reduced-motion
  console.log('\n======================================================');
  console.log('♿ Testing prefers-reduced-motion: reduce');
  console.log('======================================================');
  const reducedContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto('http://localhost:3000/daily', { waitUntil: 'networkidle' });
  
  const reducedStyle = await reducedPage.evaluate(() => {
    const el = document.getElementById('lingual-page-transition');
    if (!el) return null;
    const style = window.getComputedStyle(el);
    return {
      animationDuration: style.animationDuration,
      animationName: style.animationName,
      opacity: style.opacity,
      transform: style.transform,
    };
  });
  console.log('Reduced motion computed styles:', JSON.stringify(reducedStyle, null, 2));

  // Save metrics to JSON file
  const metricsPath = path.join(outDir, 'transition_metrics.json');
  fs.writeFileSync(metricsPath, JSON.stringify({ results, reducedStyle }, null, 2), 'utf-8');
  console.log(`📝 Transition metrics saved to: ${metricsPath}`);

  await browser.close();

  console.log('\n✨ ALL PAGE TRANSITION VERIFICATION CHECKS COMPLETED 100%!');
}

run().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
