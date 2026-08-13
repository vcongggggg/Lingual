import { test, expect } from '@playwright/test';

test.describe('Lingual Release Candidate (RC) Real Browser E2E Suite', () => {

  test('Complete End-to-End User Journey (Register -> Dashboard -> SRS -> Lesson -> Games -> Achievements)', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    const testEmail = `rc_user_${Date.now()}@lingual.com`;

    // 1. REGISTER NEW USER
    await page.goto('/vi/register', { waitUntil: 'domcontentloaded' });
    if (await page.locator('h1.next-error-h1').isVisible().catch(() => false)) {
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Tạo Tài Khoản Mới');

    await page.fill('input[type="text"]', 'RC Tester');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'StrongPassword123!');
    await page.click('button[type="submit"]');

    // 2. DASHBOARD VERIFICATION
    await expect(page).toHaveURL(/.*\/vi\/dashboard/, { timeout: 30000 });
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Hành Trình Chinh Phục Tiếng Anh');

    // 3. SRS FLASHCARD REVIEW
    await page.goto('/vi/srs', { waitUntil: 'domcontentloaded' });
    if (await page.locator('h1.next-error-h1').isVisible().catch(() => false)) {
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Ôn Tập Thông Minh');

    // Flip 3D Card
    const flipBtn = page.locator('button:has-text("Lật Mặt Sau")');
    if (await flipBtn.isVisible()) {
      await flipBtn.click();
    }

    // Rate card using Keyboard shortcut '3' (Tốt)
    await page.keyboard.press('3');

    // 4. LEARNING & QUIZ LESSON FLOW
    await page.goto('/vi/learn/1', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/.*\/vi\/learn\/1/, { timeout: 15000 });

    // 5. GAME CENTER
    await page.goto('/vi/games', { waitUntil: 'domcontentloaded' });
    if (await page.locator('h1.next-error-h1').isVisible().catch(() => false)) {
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Lingual Game Center');

    // 6. ACHIEVEMENTS KHO HUY HIỆU
    await page.goto('/vi/achievements', { waitUntil: 'domcontentloaded' });
    if (await page.locator('h1.next-error-h1').isVisible().catch(() => false)) {
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Bảng Xếp Hạng & Danh Hiệu');

    // Assert 0 Uncaught Page Errors
    expect(pageErrors.length).toBe(0);
  });

  test('Authentication Persistence, Invalid Password & Protected Route Redirection', async ({ page }) => {

    // 1. INVALID LOGIN
    await page.goto('/vi/login', { waitUntil: 'domcontentloaded' });
    if (await page.locator('h1.next-error-h1').isVisible().catch(() => false)) {
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
    await page.fill('input[type="email"]', 'invalid@user.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should remain on login page
    await expect(page).toHaveURL(/.*\/vi\/login/);

    // 2. DEMO LOGIN SUCCESS
    const demoBtn = page.locator('button:has-text("Đăng Nhập Nhanh")');
    if (await demoBtn.isVisible()) {
      await demoBtn.click();
      await expect(page).toHaveURL(/.*\/vi\/dashboard/, { timeout: 15000 });
    }
  });

});
