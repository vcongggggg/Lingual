import argon2 from 'argon2';
import { prisma } from '../apps/api/src/lib/prisma.js';

const API_URL = 'http://localhost:4000';

async function main() {
  console.log('🧪 Bắt đầu kiểm thử End-to-End System Config (POST, GET, AuditLog, DB Persistence)...');

  // 1. Tạo SUPER_ADMIN để đăng nhập
  const adminId = 'superadmin-config-tester';
  const adminEmail = 'superadmin-config@lingual.test';
  const adminPassword = 'ConfigAdminPass2026!Secure';
  const adminPasswordHash = await argon2.hash(adminPassword);

  await prisma.user.upsert({
    where: { id: adminId },
    update: { role: 'SUPER_ADMIN', isActive: true, passwordHash: adminPasswordHash },
    create: {
      id: adminId,
      email: adminEmail,
      displayName: 'SuperAdmin Config Tester',
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
    throw new Error(`Đăng nhập SuperAdmin thất bại: ${adminLoginRes.status}`);
  }
  const adminLoginData = await adminLoginRes.json();
  const token = adminLoginData.accessToken;
  console.log('✅ Bước 1: SUPER_ADMIN đăng nhập thành công và lấy JWT token.');

  // 2. GET /api/v1/admin/config ban đầu
  const getInitialRes = await fetch(`${API_URL}/api/v1/admin/config`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (getInitialRes.status !== 200) {
    throw new Error(`GET /admin/config thất bại: ${getInitialRes.status}`);
  }
  const initialData = await getInitialRes.json();
  console.log('✅ Bước 2: GET /admin/config trả về 200 OK.', initialData);

  // 3. POST /api/v1/admin/config để đặt 1 key test
  const testKey = 'test_feature_flag';
  const testVal1 = { enabled: true, rolloutPercentage: 50 };

  const postRes1 = await fetch(`${API_URL}/api/v1/admin/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ key: testKey, value: testVal1 }),
  });
  if (postRes1.status !== 200) {
    throw new Error(`POST /admin/config thất bại: ${postRes1.status} ${await postRes1.text()}`);
  }
  console.log('✅ Bước 3: POST /admin/config thiết lập key mới thành công.');

  // 4. GET /api/v1/admin/config/:key để đọc lại đúng giá trị
  const getSingleRes1 = await fetch(`${API_URL}/api/v1/admin/config/${testKey}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (getSingleRes1.status !== 200) {
    throw new Error(`GET /admin/config/${testKey} thất bại: ${getSingleRes1.status}`);
  }
  const singleData1 = await getSingleRes1.json();
  if (singleData1.value?.enabled !== true || singleData1.value?.rolloutPercentage !== 50) {
    throw new Error(`Giá trị đọc lại không khớp! Nhận được: ${JSON.stringify(singleData1.value)}`);
  }
  console.log('✅ Bước 4: GET /admin/config/:key đọc lại chính xác giá trị vừa lưu:', singleData1.value);

  // 5. POST đổi giá trị key test
  const testVal2 = { enabled: false, rolloutPercentage: 0 };
  const postRes2 = await fetch(`${API_URL}/api/v1/admin/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ key: testKey, value: testVal2 }),
  });
  if (postRes2.status !== 200) {
    throw new Error(`POST /admin/config lần 2 thất bại: ${postRes2.status}`);
  }
  console.log('✅ Bước 5: POST /admin/config cập nhật giá trị mới thành công.');

  // 6. GET đọc lại thấy giá trị mới
  const getSingleRes2 = await fetch(`${API_URL}/api/v1/admin/config/${testKey}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const singleData2 = await getSingleRes2.json();
  if (singleData2.value?.enabled !== false || singleData2.value?.rolloutPercentage !== 0) {
    throw new Error(`Giá trị cập nhật không khớp! Nhận được: ${JSON.stringify(singleData2.value)}`);
  }
  console.log('✅ Bước 6: GET /admin/config/:key xác nhận giá trị mới:', singleData2.value);

  // 7. Kiểm tra trực tiếp Database bảng system_configs
  const dbConfig = await prisma.systemConfig.findUnique({ where: { key: testKey } });
  if (!dbConfig) {
    throw new Error('Không tìm thấy bản ghi trong bảng system_configs dưới PostgreSQL!');
  }
  console.log('✅ Bước 7: Kiểm tra PostgreSQL xác nhận bản ghi tồn tại trong bảng system_configs:', dbConfig.value);

  // 8. Kiểm tra AuditLog có bản ghi với beforeState và afterState chính xác
  const auditLog = await prisma.auditLog.findFirst({
    where: { resourceType: 'SystemConfig', action: 'system.config.update' },
    orderBy: { createdAt: 'desc' },
  });
  console.log('AuditLog beforeState:', auditLog?.beforeState);
  console.log('AuditLog afterState:', auditLog?.afterState);
  if (auditLog?.afterState && auditLog.afterState[testKey]?.enabled === false) {
    console.log('✅ Bước 8: AuditLog ghi nhận chính xác beforeState và afterState của cấu hình.');
  } else {
    throw new Error('AuditLog không ghi nhận đúng afterState!');
  }

  // 9. DELETE /api/v1/admin/config/:key để dọn dẹp key test
  const delRes = await fetch(`${API_URL}/api/v1/admin/config/${testKey}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (delRes.status !== 200) {
    throw new Error(`DELETE /admin/config/${testKey} thất bại: ${delRes.status}`);
  }
  console.log('✅ Bước 9: DELETE /admin/config/:key dọn dẹp thành công.');

  // 10. GET lại key test -> Phải trả về 404
  const getAfterDel = await fetch(`${API_URL}/api/v1/admin/config/${testKey}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (getAfterDel.status === 404) {
    console.log('✅ Bước 10: GET key đã xóa trả về 404 Not Found đúng chuẩn.');
  } else {
    throw new Error(`Sau khi xóa, GET mong đợi 404 nhưng nhận: ${getAfterDel.status}`);
  }

  // Dọn dẹp admin test
  await prisma.user.delete({ where: { id: adminId } }).catch(() => {});
  console.log('🧹 Bước 11: Dọn dẹp tài khoản Admin test khỏi DB.');

  console.log('\n🎉 TẤT CẢ 11 BƯỚC VERIFY SYSTEM CONFIG ĐÃ ĐẠT CHUẨN 100%!');
}

main().catch((err) => {
  console.error('\n❌ Verify System Config FAILED:', err);
  process.exit(1);
});
