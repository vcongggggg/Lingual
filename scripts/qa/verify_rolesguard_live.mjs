async function run() {
  const API_URL = 'http://localhost:4000';
  console.log('1. Đang đăng nhập tài khoản test@linguaflow.com...');
  
  const loginRes = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@linguaflow.com',
      password: 'TourTestPass2026!Safe',
    }),
  });

  if (!loginRes.ok) {
    console.error('Đăng nhập thất bại:', loginRes.status, await loginRes.text());
    process.exit(1);
  }

  const setCookieHeader = loginRes.headers.get('set-cookie');
  const loginData = await loginRes.json();
  let cookieToken = '';
  if (setCookieHeader) {
    const match = setCookieHeader.match(/access_token=([^;]+)/);
    if (match) {
      cookieToken = match[1];
    }
  }
  const token = loginData.accessToken || cookieToken;
  console.log('Đăng nhập thành công!');
  console.log('User Role:', loginData.user?.role);
  console.log('Set-Cookie:', setCookieHeader ? 'Có Set-Cookie' : 'Không có Set-Cookie');

  console.log('\n--- BƯỚC 1: Gọi /admin/users CHỈ BẰNG COOKIE ---');
  const adminCookieRes = await fetch(`${API_URL}/api/v1/admin/users`, {
    headers: {
      Cookie: `access_token=${cookieToken}`,
    },
  });
  console.log('Status code:', adminCookieRes.status);
  const adminCookieJson = await adminCookieRes.json();
  console.log('Response body:', adminCookieJson);

  if (adminCookieRes.status === 403) {
    console.log('✅ PASS: /admin/users trả về 403 Forbidden đúng mong đợi (STUDENT qua cookie bị chặn theo RBAC, không bị 401)!');
  } else {
    console.error(`❌ FAIL: Mong đợi 403, nhận được ${adminCookieRes.status}`);
  }

  console.log('\n--- BƯỚC 2: Gọi /user/profile CHỈ BẰNG COOKIE ---');
  const profileCookieRes = await fetch(`${API_URL}/api/v1/user/profile`, {
    headers: {
      Cookie: `access_token=${cookieToken}`,
    },
  });
  console.log('Status code:', profileCookieRes.status);
  const profileCookieJson = await profileCookieRes.json();
  console.log('Profile user email:', profileCookieJson.user?.email);

  if (profileCookieRes.status === 200) {
    console.log('✅ PASS: /user/profile trả về 200 OK với thông tin profile hợp lệ qua cookie!');
  } else {
    console.error(`❌ FAIL: Mong đợi 200, nhận được ${profileCookieRes.status}`);
  }

  console.log('\n--- BƯỚC 3: Gọi /admin/users BẰNG BEARER TOKEN CỦA STUDENT ---');
  const adminBearerRes = await fetch(`${API_URL}/api/v1/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('Status code:', adminBearerRes.status);
  const adminBearerJson = await adminBearerRes.json();
  console.log('Response body:', adminBearerJson);

  if (adminBearerRes.status === 403) {
    console.log('✅ PASS: /admin/users qua Bearer token vẫn trả về 403 Forbidden (không có hồi quy)!');
  } else {
    console.error(`❌ FAIL: Mong đợi 403, nhận được ${adminBearerRes.status}`);
  }

  if (adminCookieRes.status === 403 && profileCookieRes.status === 200 && adminBearerRes.status === 403) {
    console.log('\n🎉 TẤT CẢ 3 BÀI KIỂM THỬ LIVE ĐỀU ĐẠT CHUẨN 100%!');
  } else {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
