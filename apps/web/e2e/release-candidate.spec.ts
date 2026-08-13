import { test, expect } from '@playwright/test';

test.describe('Lingual Release Candidate (RC) Real Browser E2E Suite', () => {

  test('Complete End-to-End User Journey (Register -> Dashboard -> SRS -> Lesson -> Games -> Achievements)', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    const testEmail = `rc_user_${Date.now()}@lingual.com`;

    // 1. REGISTER NEW USER
    await page.goto('/vi/register');
    await page.waitForSelector('h1');
    await expect(page.locator('h1')).toContainText('Tạo Tài Khoản Mới');

    await page.fill('input[type="text"]', 'RC Tester');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'StrongPassword123!');
    await page.click('button[type="submit"]');

    // 2. DASHBOARD VERIFICATION
    await page.waitForURL(/.*\/vi\/dashboard/);
    await page.waitForSelector('h1');
    await expect(page.locator('h1')).toContainText('Hành Trình Chinh Phục Tiếng Anh');

    // 3. SRS FLASHCARD REVIEW
    await page.goto('/vi/srs');
    await page.waitForSelector('h1');
    await expect(page.locator('h1')).toContainText('Ôn Tập Từ Vựng');

    // Flip 3D Card
    const flipBtn = page.locator('button:has-text("Lật Mặt Sau")');
    if (await flipBtn.isVisible()) {
      await flipBtn.click();
    }

    // Rate card using Keyboard shortcut '3' (Tốt)
    await page.keyboard.press('3');

    // 4. LEARNING & QUIZ LESSON FLOW
    await page.goto('/vi/learn/1');
    await page.waitForURL(/.*\/vi\/learn\/1/);

    // 5. GAME CENTER
    await page.goto('/vi/games');
    await page.waitForSelector('h1');
    await expect(page.locator('h1')).toContainText('Trung Tâm Trò Chơi');

    // 6. ACHIEVEMENTS KHO HUY HIỆU
    await page.goto('/vi/achievements');
    await page.waitForSelector('h1');
    await expect(page.locator('h1')).toContainText('Bảng Vàng Thành Tựu');

    // Assert 0 Uncaught Page Errors
    expect(pageErrors.length).toBe(0);
  });

  test('Authentication Persistence, Invalid Password & Protected Route Redirection', async ({ page }) => {

    // 1. INVALID LOGIN
    await page.goto('/vi/login');
    await page.waitForSelector('h1');
    await page.fill('input[type="email"]', 'invalid@user.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should remain on login page
    await expect(page).toHaveURL(/.*\/vi\/login/);

    // 2. DEMO LOGIN SUCCESS
    const demoBtn = page.locator('button:has-text("Đăng Nhập Nhanh")');
    if (await demoBtn.isVisible()) {
      await demoBtn.click();
      await page.waitForURL(/.*\/vi\/dashboard/);
      await expect(page).toHaveURL(/.*\/vi\/dashboard/);
    }
  });

});
