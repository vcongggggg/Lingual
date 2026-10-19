import { spawn } from 'child_process';
import http from 'http';

const BASE_URL = 'http://localhost:4000';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function request(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch {
          json = body;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await request(`${BASE_URL}/api/v1/health`);
      if (res.status === 200 && res.data?.database === 'connected') {
        return true;
      }
    } catch {}
    await wait(1000);
  }
  throw new Error('Server failed to start and connect to PostgreSQL within timeout');
}

function startServer() {
  console.log('🔄 Spawning API server instance (pnpm --filter api exec tsx src/server.ts)...');
  const proc = spawn('pnpm', ['--filter', 'api', 'exec', 'tsx', 'src/server.ts'], {
    shell: true,
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  proc.stdout.on('data', (chunk) => {
    const text = chunk.toString();
    if (text.includes('running on') || text.includes('PostgreSQL Database connected')) {
      process.stdout.write(`   [server log]: ${text.trim()}\n`);
    }
  });

  proc.stderr.on('data', (chunk) => {
    process.stderr.write(`   [server err]: ${chunk.toString().trim()}\n`);
  });

  return proc;
}

function killProcess(proc) {
  return new Promise((resolve) => {
    if (!proc || proc.killed) {
      resolve();
      return;
    }
    console.log('🛑 Terminating API server process (PID:', proc.pid, ')...');
    // On Windows, kill process tree
    spawn('taskkill', ['/pid', proc.pid.toString(), '/f', '/t'], { shell: true })
      .on('close', () => {
        resolve();
      });
  });
}

async function runDoDTests() {
  console.log('=================================================================');
  console.log('🚀 PHẦN THỬ NGHIỆM ĐẠI PHẪU D2: DEFINITION OF DONE 3 BÀI TEST THẬT');
  console.log('=================================================================\n');

  let serverProcess = null;

  try {
    // --------------------------------------------------------------------------
    // BƯỚC 0: KHỞI ĐỘNG SERVER API LẦN ĐẦU (INSTANCE 1)
    // --------------------------------------------------------------------------
    console.log('▶️ [BƯỚC 0] Khởi động API Server Instance 1...');
    serverProcess = startServer();
    await waitForServer();
    console.log('✅ API Server Instance 1 đã sẵn sàng, PostgreSQL connected!\n');

    // --------------------------------------------------------------------------
    // BÀI TEST 1: RESTART TEST (PERSIST USER CREDENTIAL)
    // --------------------------------------------------------------------------
    console.log('-----------------------------------------------------------------');
    console.log('📋 [BÀI TEST 1] Register User A -> Login -> Restart Server -> Login lại credential cũ');
    console.log('-----------------------------------------------------------------');
    const timestamp = Date.now();
    const userAEmail = `user_a_${timestamp}@lingual.test`;
    const userAPassword = `PasswordA_${timestamp}!`;

    console.log(`1.1. Đăng ký User A: email=${userAEmail}...`);
    const regRes = await request(`${BASE_URL}/api/v1/auth/register`, { method: 'POST' }, {
      email: userAEmail,
      password: userAPassword,
      displayName: `User A Test ${timestamp}`,
    });
    console.log(`     Output status: ${regRes.status}`);
    console.log(`     Output body:`, JSON.stringify(regRes.data));
    if (regRes.status !== 200 && regRes.status !== 201) throw new Error(`Đăng ký User A thất bại, status=${regRes.status}`);
    const userAId = regRes.data.user.id;

    console.log('\n1.2. Login User A lần 1 trên Server Instance 1...');
    const login1Res = await request(`${BASE_URL}/api/v1/auth/login`, { method: 'POST' }, {
      email: userAEmail,
      password: userAPassword,
    });
    console.log(`     Output status: ${login1Res.status}`);
    console.log(`     Output body:`, JSON.stringify(login1Res.data));
    if (login1Res.status !== 200 || !login1Res.data.accessToken) {
      throw new Error(`Login User A lần 1 thất bại`);
    }
    const userAToken = login1Res.data.accessToken;

    console.log('\n1.3. 🔄 RESTART API SERVER: Kill Server Instance 1 và khởi động lại Server Instance 2...');
    await killProcess(serverProcess);
    await wait(2500); // Đợi port 4000 giải phóng

    serverProcess = startServer();
    await waitForServer();
    console.log('✅ Server Instance 2 đã khởi động lại hoàn tất.');

    console.log('\n1.4. Login lại bằng credential của User A trên Server Instance 2...');
    const login2Res = await request(`${BASE_URL}/api/v1/auth/login`, { method: 'POST' }, {
      email: userAEmail,
      password: userAPassword,
    });
    console.log(`     Output status: ${login2Res.status}`);
    console.log(`     Output body:`, JSON.stringify(login2Res.data));

    if (login2Res.status === 200 && login2Res.data.user?.email === userAEmail) {
      console.log('\n🎯 [BÀI TEST 1 KẾT QUẢ]: >>> PASS <<< (User A đăng nhập thành công 200 sau khi restart server, xác nhận lưu DB thật)');
    } else {
      throw new Error(`[BÀI TEST 1 THẤT BẠI]: Login lại sau restart không thành công, status=${login2Res.status}`);
    }

    // --------------------------------------------------------------------------
    // BÀI TEST 2: RBAC 403 FORBIDDEN TEST (NON-ADMIN THỬ ĐỔI ROLE)
    // --------------------------------------------------------------------------
    console.log('\n-----------------------------------------------------------------');
    console.log('📋 [BÀI TEST 2] User A (STUDENT) đổi role User B qua API với token của A -> Phải bị 403');
    console.log('-----------------------------------------------------------------');
    const userBEmail = `user_b_${timestamp}@lingual.test`;
    const userBPassword = `PasswordB_${timestamp}!`;

    console.log(`2.1. Đăng ký User B (vai trò mặc định STUDENT): email=${userBEmail}...`);
    const regBRes = await request(`${BASE_URL}/api/v1/auth/register`, { method: 'POST' }, {
      email: userBEmail,
      password: userBPassword,
      displayName: `User B Target ${timestamp}`,
    });
    console.log(`     Output status: ${regBRes.status}`);
    console.log(`     Output body:`, JSON.stringify(regBRes.data));
    if (regBRes.status !== 200 && regBRes.status !== 201) throw new Error('Đăng ký User B thất bại');
    const userBId = regBRes.data.user.id;

    console.log(`\n2.2. User A (STUDENT) gửi request đổi role của User B thành ADMIN:`);
    console.log(`     POST /api/v1/admin/users/${userBId}/role`);
    console.log(`     Headers: Authorization: Bearer <token của User A>`);
    console.log(`     Body: { "role": "ADMIN" }`);

    const rbacRes = await request(
      `${BASE_URL}/api/v1/admin/users/${userBId}/role`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userAToken}`,
        },
      },
      { role: 'ADMIN' }
    );
    console.log(`     Output status: ${rbacRes.status}`);
    console.log(`     Output body:`, JSON.stringify(rbacRes.data));

    if (rbacRes.status === 403) {
      console.log('\n🎯 [BÀI TEST 2 KẾT QUẢ]: >>> PASS <<< (Server trả về chính xác 403 Forbidden do RBAC middleware xác thực role STUDENT từ DB)');
    } else {
      throw new Error(`[BÀI TEST 2 THẤT BẠI]: Kỳ vọng 403 nhưng server trả về ${rbacRes.status}`);
    }

    // --------------------------------------------------------------------------
    // BÀI TEST 3: AUDIT LOG PERSISTENCE ACROSS RESTARTS
    // --------------------------------------------------------------------------
    console.log('\n-----------------------------------------------------------------');
    console.log('📋 [BÀI TEST 3] Tạo Audit Log (SuperAdmin thao tác) -> Restart Server -> GET /admin/audit-logs -> Log còn đó');
    console.log('-----------------------------------------------------------------');

    console.log('3.1. Đăng nhập bằng tài khoản SUPER_ADMIN (superadmin@lingual.com)...');
    const superAdminLoginRes = await request(`${BASE_URL}/api/v1/auth/login`, { method: 'POST' }, {
      email: 'superadmin@lingual.com',
      password: 'Admin@123456',
    });
    console.log(`     Output status: ${superAdminLoginRes.status}`);
    if (superAdminLoginRes.status !== 200 || !superAdminLoginRes.data.accessToken) {
      throw new Error('Đăng nhập Super Admin thất bại');
    }
    const superAdminToken = superAdminLoginRes.data.accessToken;

    console.log(`\n3.2. SuperAdmin thực hiện thay đổi role của User B thành CONTENT_EDITOR để kích hoạt audit log...`);
    const updateRoleRes = await request(
      `${BASE_URL}/api/v1/admin/users/${userBId}/role`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
        },
      },
      { role: 'CONTENT_EDITOR' }
    );
    console.log(`     Output status: ${updateRoleRes.status}`);
    console.log(`     Output body:`, JSON.stringify(updateRoleRes.data));
    if (updateRoleRes.status !== 200) throw new Error('SuperAdmin đổi role thất bại');

    console.log('\n3.3. Kiểm tra audit log trước khi restart server:');
    const logsBeforeRes = await request(`${BASE_URL}/api/v1/admin/audit-logs`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    console.log(`     Output status: ${logsBeforeRes.status}`);
    const logsBeforeList = logsBeforeRes.data?.auditLogs || logsBeforeRes.data?.logs || [];
    const foundLogBefore = logsBeforeList.find((l) => l.resourceId === userBId);
    console.log(`     Audit log tìm thấy cho User B:`, JSON.stringify(foundLogBefore));
    if (!foundLogBefore) throw new Error('Không tìm thấy audit log vừa tạo');

    console.log('\n3.4. 🔄 RESTART API SERVER LẦN 2: Kill Server Instance 2 và khởi động lại Server Instance 3...');
    await killProcess(serverProcess);
    await wait(2500); // Đợi port 4000 giải phóng

    serverProcess = startServer();
    await waitForServer();
    console.log('✅ Server Instance 3 đã khởi động lại hoàn tất.');

    console.log('\n3.5. Gọi lại GET /api/v1/admin/audit-logs trên Server Instance 3 để kiểm chứng log còn trong DB:');
    const logsAfterRes = await request(`${BASE_URL}/api/v1/admin/audit-logs`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    console.log(`     Output status: ${logsAfterRes.status}`);
    const logsAfterList = logsAfterRes.data?.auditLogs || logsAfterRes.data?.logs || [];
    console.log(`     Tổng số logs: ${logsAfterList.length}`);
    const foundLogAfter = logsAfterList.find((l) => l.resourceId === userBId);
    console.log(`     Audit log của User B sau restart:`, JSON.stringify(foundLogAfter));

    if (logsAfterRes.status === 200 && foundLogAfter && foundLogAfter.resourceId === userBId) {
      console.log('\n🎯 [BÀI TEST 3 KẾT QUẢ]: >>> PASS <<< (Audit log vẫn tồn tại nguyên vẹn trong DB sau khi server khởi động lại)');
    } else {
      throw new Error(`[BÀI TEST 3 THẤT BẠI]: Không tìm thấy audit log sau khi restart server`);
    }

    console.log('\n=================================================================');
    console.log('🏆 TOÀN BỘ 3 BÀI TEST DEFINITION OF DONE CỦA PHASE D2 ĐỀU ĐẠT 100%!');
    console.log('=================================================================');
  } catch (err) {
    console.error('\n❌ TEST THẤT BẠI VỚI LỖI:', err.message);
    process.exitCode = 1;
  } finally {
    if (serverProcess) {
      await killProcess(serverProcess);
    }
  }
}

runDoDTests();
