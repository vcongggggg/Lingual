import { test, expect } from '@playwright/test';

test.describe('LinguaFlow Critical User Path E2E Smoke Test', () => {
  test('Should navigate from Landing to Dashboard and open SRS Flashcard deck', async ({ page }) => {
    // 1. Visit Landing Page
    await page.goto('http://localhost:3000/vi');
    await expect(page.locator('h1')).toContainText('Chinh Phục Tiếng Anh');

    // 2. Click Start Learning -> Dashboard
    await page.click('button:has-text("Khám Phá Lộ Trình Bài Học")');
    await expect(page).toHaveURL(/.*\/vi\/dashboard/);
    await expect(page.locator('h1')).toContainText('Hành Trình Chinh Phục Tiếng Anh');

    // 3. Open SRS Review Deck
    await page.click('button:has-text("Ôn Từ Vựng SRS")');
    await expect(page).toHaveURL(/.*\/vi\/srs/);
  });
});
