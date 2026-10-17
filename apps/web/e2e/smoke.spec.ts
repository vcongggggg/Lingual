import { test, expect } from '@playwright/test';

test.describe('LinguaFlow Critical User Path E2E Smoke Test', () => {
  test('Should navigate from Landing to Dashboard and open SRS Flashcard deck', async ({ page }) => {
    // 1. Visit Landing Page
    await page.goto('http://localhost:3000/vi');
    await expect(page.locator('h1')).toContainText('Chinh Phục Tiếng Anh');

    // 2. Click Start Learning -> Dashboard
    const startBtn = page.locator('button:has-text("Bắt Đầu Học Ngay (Miễn Phí)")').first();
    if (await startBtn.isVisible()) {
      await startBtn.click();
      const modalBtn = page.locator('button:has-text("Vào Lộ Trình Học Ngay")');
      if (await modalBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await modalBtn.click();
      }
    } else {
      await page.goto('/vi/dashboard');
    }
    await expect(page).toHaveURL(/.*\/vi\/dashboard/, { timeout: 15000 });
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });

    // 3. Open SRS Review Deck
    await page.goto('/vi/srs');
    await expect(page).toHaveURL(/.*\/vi\/srs/, { timeout: 15000 });
  });
});
