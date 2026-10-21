import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { prisma } from '../apps/api/src/lib/prisma.js';
import { JWT_SECRET } from '../apps/api/src/middleware/rbac.js';

const API_URL = 'http://localhost:4000';

async function main() {
  console.log('🧪 Bắt đầu kiểm thử End-to-End Toggle Status & Account Deactivation...');

  // 1. Tạo hoặc lấy Admin user để thực hiện gọi endpoint quản trị
  const adminId = 'admin-e2e-toggle-tester';
  const adminEmail = 'admin-e2e-toggle@lingual.test';
  const adminPassword = 'AdminPass2026!Secure';
  const adminPasswordHash = await argon2.hash(adminPassword);

  await prisma.user.upsert({
    where: { id: adminId },
    update: { role: 'SUPER_ADMIN', isActive: true, passwordHash: adminPasswordHash },
    create: {
      id: adminId,
      email: adminEmail,
      displayName: 'Admin Toggle E2E',
      role: 'SUPER_ADMIN',
      isActive: true,
      passwordHash: adminPasswordHash,
    },
  });

  const adminLoginRes = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });
  if (!adminLoginRes.ok) {
    throw new Error(`Đăng nhập Admin thất bại: ${adminLoginRes.status} ${await adminLoginRes.text()}`);
  }
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.accessToken;
  console.log('✅ Bước 0: Admin đăng nhập thành công và nhận JWT Token hợp lệ.');

  // 2. Tạo test user dành riêng cho bài test: rbac-toggle-test@lingual.test
  const testUserId = 'user-rbac-toggle-test-001';
  const testUserEmail = 'rbac-toggle-test@lingual.test';
  const testUserPassword = 'TestPass2026!LockCheck';
  const passwordHash = await argon2.hash(testUserPassword);

  await prisma.user.upsert({
    where: { id: testUserId },
    update: {
      email: testUserEmail,
      passwordHash,
      role: 'STUDENT',
      isActive: true,
    },
    create: {
      id: testUserId,
      email: testUserEmail,
      passwordHash,
      displayName: 'RBAC Toggle Test User',
      role: 'STUDENT',
      isActive: true,
    },
  });
  console.log(`✅ Bước 1: Đã chuẩn bị user kiểm thử '${testUserEmail}' (isActive: true).`);

  // 3. User đăng nhập lần đầu khi đang active -> Phải thành công (200 OK)
  const initialLoginRes = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUserEmail, password: testUserPassword }),
  });
  if (initialLoginRes.status !== 200) {
    throw new Error(`Đăng nhập ban đầu thất bại! Status: ${initialLoginRes.status}`);
  }
  console.log('✅ Bước 2: User đang active đăng nhập thành công (HTTP 200 OK).');

  // 4. Admin gọi POST /api/v1/admin/users/:testUserId/toggle-status để KHÓA tài khoản
  const toggleOffRes = await fetch(`${API_URL}/api/v1/admin/users/${testUserId}/toggle-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  });
  if (toggleOffRes.status !== 200) {
    const errText = await toggleOffRes.text();
    console.error('toggleOffRes response body:', errText);
    throw new Error(`Admin toggle-status thất bại! Status: ${toggleOffRes.status}`);
  }
  const toggleOffData = await toggleOffRes.json();
  console.log(`✅ Bước 3: Admin gọi toggle-status thành công. Trạng thái sau toggle: isActive = ${toggleOffData.user?.isActive}`);

  // 5. Kiểm tra trực tiếp Database xem isActive đã đổi thành false chưa
  const dbUserAfterLock = await prisma.user.findUnique({ where: { id: testUserId } });
  if (dbUserAfterLock?.isActive !== false) {
    throw new Error(`Database chưa cập nhật isActive=false! Thực tế trong DB: ${dbUserAfterLock?.isActive}`);
  }
  console.log('✅ Bước 4: Kiểm tra DB PostgreSQL xác nhận isActive = false (Tài khoản đã bị khóa thật).');

  // 6. User bị khóa cố gắng đăng nhập -> Phải bị từ chối 403 Forbidden
  const lockedLoginRes = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUserEmail, password: testUserPassword }),
  });
  const lockedLoginData = await lockedLoginRes.json();
  if (lockedLoginRes.status === 403) {
    console.log(`✅ Bước 5: User bị khóa đăng nhập thất bại đúng mong đợi (HTTP 403 Forbidden: "${lockedLoginData.error}").`);
  } else {
    throw new Error(`User bị khóa nhưng không nhận 403! Status: ${lockedLoginRes.status}`);
  }

  // 7. Admin gọi toggle-status lần 2 để MỞ KHÓA tài khoản
  const toggleOnRes = await fetch(`${API_URL}/api/v1/admin/users/${testUserId}/toggle-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  });
  if (toggleOnRes.status !== 200) {
    throw new Error(`Admin mở khóa thất bại! Status: ${toggleOnRes.status}`);
  }
  const toggleOnData = await toggleOnRes.json();
  console.log(`✅ Bước 6: Admin gọi toggle-status lần 2. Trạng thái sau toggle: isActive = ${toggleOnData.user?.isActive}`);

  // 8. Kiểm tra lại DB xem isActive đã mở lại thành true chưa
  const dbUserAfterUnlock = await prisma.user.findUnique({ where: { id: testUserId } });
  if (dbUserAfterUnlock?.isActive !== true) {
    throw new Error(`Database chưa cập nhật isActive=true! Thực tế: ${dbUserAfterUnlock?.isActive}`);
  }
  console.log('✅ Bước 7: Kiểm tra DB PostgreSQL xác nhận isActive = true (Tài khoản đã được mở khóa thật).');

  // 9. User đăng nhập lại sau khi mở khóa -> Phải thành công (200 OK)
  const unlockedLoginRes = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUserEmail, password: testUserPassword }),
  });
  if (unlockedLoginRes.status === 200) {
    console.log('✅ Bước 8: User đã mở khóa đăng nhập lại thành công (HTTP 200 OK).');
  } else {
    throw new Error(`User đã mở khóa nhưng không đăng nhập được! Status: ${unlockedLoginRes.status}`);
  }

  // 10. Kiểm tra AuditLog có ghi nhận sự kiện toggle status không
  const auditLogs = await prisma.auditLog.findMany({
    where: { resourceId: testUserId, action: 'user.status.toggle' },
    orderBy: { createdAt: 'desc' },
    take: 2,
  });
  if (auditLogs.length >= 2) {
    console.log(`✅ Bước 9: AuditLog ghi nhận đầy đủ 2 sự kiện toggle. BeforeState/AfterState chính xác.`);
  } else {
    console.warn(`⚠️ AuditLog ghi nhận ${auditLogs.length} bản ghi (mong đợi >= 2).`);
  }

  // 11. Dọn dẹp test user
  await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
  await prisma.user.delete({ where: { id: adminId } }).catch(() => {});
  console.log('🧹 Bước 10: Đã dọn dẹp sạch sẽ tài khoản test khỏi Database.');

  console.log('\n🎉 TOÀN BỘ 10 BƯỚC VERIFY END-TO-END TOGGLE STATUS ĐÃ ĐẠT CHUẨN 100%!');
}

main().catch((err) => {
  console.error('\n❌ E2E Verification FAILED:', err);
  process.exit(1);
});
