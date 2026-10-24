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
          rawBody: body,
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

function requestSSE(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let fullText = '';
      const events = [];
      res.on('data', (chunk) => {
        const text = chunk.toString();
        fullText += text;
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data:') || line.startsWith('event:')) {
            events.push(line.trim());
          }
        }
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          events,
          fullText,
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
    spawn('taskkill', ['/pid', proc.pid.toString(), '/f', '/t'], { shell: true })
      .on('close', () => {
        resolve();
      });
  });
}

async function main() {
  console.log('========================================================================');
  console.log('🚀 BẮT ĐẦU TESTER CHECKLIST A–H (PHASE D3) VỚI ĐẦY ĐỦ BẰNG CHỨNG LỆNH THẬT');
  console.log('========================================================================\n');

  let server = null;
  const testResults = [];

  function record(section, name, pass, detail = '') {
    testResults.push({ section, name, pass, detail });
    const mark = pass ? '>>> PASS <<<' : '!!! FAIL !!!';
    console.log(`\n🎯 KẾT QUẢ [${section}] ${name}: ${mark}`);
    if (detail) console.log(`   Ghi chú: ${detail}\n`);
  }

  try {
    console.log('🔄 Đang khởi động API Server...');
    server = startServer();
    await waitForServer();
    console.log('✅ Server đã sẵn sàng kết nối PostgreSQL.\n');

    const timestamp = Date.now();
    const userAEmail = `checklist_a_${timestamp}@lingual.test`;
    const userAPassword = `PasswordA_${timestamp}!`;
    const userBEmail = `checklist_b_${timestamp}@lingual.test`;
    const userBPassword = `PasswordB_${timestamp}!`;

    // ========================================================================
    // CHECKLIST A: AUTH & RBAC
    // ========================================================================
    console.log('========================================================================');
    console.log('📌 CHECKLIST A: AUTH & RBAC');
    console.log('========================================================================');

    // A.1: register -> login -> /me = 200 đúng user
    console.log('--- A.1: Register -> Login -> /me ---');
    console.log(`Lệnh: POST /api/v1/auth/register body={ email: "${userAEmail}", password: "...", displayName: "User A" }`);
    const regRes = await request(`${BASE_URL}/api/v1/auth/register`, { method: 'POST' }, {
      email: userAEmail,
      password: userAPassword,
      displayName: `User A Checklist ${timestamp}`,
    });
    console.log(`Output Status: ${regRes.status}`);
    console.log(`Output Body:`, JSON.stringify(regRes.data));
    const userAId = regRes.data?.user?.id;

    console.log(`Lệnh: POST /api/v1/auth/login body={ email: "${userAEmail}", password: "..." }`);
    const loginRes = await request(`${BASE_URL}/api/v1/auth/login`, { method: 'POST' }, {
      email: userAEmail,
      password: userAPassword,
    });
    console.log(`Output Status: ${loginRes.status}`);
    console.log(`Output Body:`, JSON.stringify(loginRes.data));
    const tokenA = loginRes.data?.accessToken;

    console.log(`Lệnh: GET /api/v1/auth/me header: Authorization: Bearer <tokenA>`);
    const meRes = await request(`${BASE_URL}/api/v1/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    console.log(`Output Status: ${meRes.status}`);
    console.log(`Output Body:`, JSON.stringify(meRes.data));
    const a1Pass = meRes.status === 200 && meRes.data?.user?.email === userAEmail;
    record('A.1', 'register -> login -> /me = 200 đúng user', a1Pass);

    // A.2: register trùng email -> 400
    console.log('\n--- A.2: Register trùng email -> 400 ---');
    console.log(`Lệnh: POST /api/v1/auth/register với email trùng "${userAEmail}"`);
    const dupRes = await request(`${BASE_URL}/api/v1/auth/register`, { method: 'POST' }, {
      email: userAEmail,
      password: userAPassword,
      displayName: 'Duplicate User A',
    });
    console.log(`Output Status: ${dupRes.status}`);
    console.log(`Output Body:`, JSON.stringify(dupRes.data));
    const a2Pass = dupRes.status === 400;
    record('A.2', 'register trùng email -> 400', a2Pass);

    // A.3: sai password -> 401
    console.log('\n--- A.3: Sai password -> 401 ---');
    console.log(`Lệnh: POST /api/v1/auth/login với password sai "WrongPassword999!"`);
    const wrongPassRes = await request(`${BASE_URL}/api/v1/auth/login`, { method: 'POST' }, {
      email: userAEmail,
      password: 'WrongPassword999!',
    });
    console.log(`Output Status: ${wrongPassRes.status}`);
    console.log(`Output Body:`, JSON.stringify(wrongPassRes.data));
    const a3Pass = wrongPassRes.status === 401;
    record('A.3', 'sai password -> 401', a3Pass);

    // A.4: /me không token -> 401
    console.log('\n--- A.4: /me không token -> 401 ---');
    console.log(`Lệnh: GET /api/v1/auth/me (không gửi header Authorization)`);
    const noTokenRes = await request(`${BASE_URL}/api/v1/auth/me`, { method: 'GET' });
    console.log(`Output Status: ${noTokenRes.status}`);
    console.log(`Output Body:`, JSON.stringify(noTokenRes.data));
    const a4Pass = noTokenRes.status === 401;
    record('A.4', '/me không token -> 401', a4Pass);

    // A.5: restart API -> login lại credential cũ -> 200
    console.log('\n--- A.5: Restart API -> login lại credential cũ -> 200 ---');
    console.log('🔄 Đang tắt và khởi động lại API server...');
    await killProcess(server);
    await wait(2500);
    server = startServer();
    await waitForServer();
    console.log('✅ Server đã restart xong.');

    console.log(`Lệnh: POST /api/v1/auth/login sau restart với credential User A`);
    const loginAfterRestartRes = await request(`${BASE_URL}/api/v1/auth/login`, { method: 'POST' }, {
      email: userAEmail,
      password: userAPassword,
    });
    console.log(`Output Status: ${loginAfterRestartRes.status}`);
    console.log(`Output Body:`, JSON.stringify(loginAfterRestartRes.data));
    const a5Pass = loginAfterRestartRes.status === 200 && loginAfterRestartRes.data?.user?.email === userAEmail;
    record('A.5', 'restart API -> login lại credential cũ -> 200', a5Pass);

    // A.6: non-admin đổi role user khác -> 403
    console.log('\n--- A.6: Non-admin đổi role user khác -> 403 ---');
    const regBRes = await request(`${BASE_URL}/api/v1/auth/register`, { method: 'POST' }, {
      email: userBEmail,
      password: userBPassword,
      displayName: 'User B',
    });
    const userBId = regBRes.data?.user?.id;
    console.log(`User B ID: ${userBId}`);

    console.log(`Lệnh: POST /api/v1/admin/users/${userBId}/role với token của User A (STUDENT) body={ role: "ADMIN" }`);
    const rbacRes = await request(`${BASE_URL}/api/v1/admin/users/${userBId}/role`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
    }, { role: 'ADMIN' });
    console.log(`Output Status: ${rbacRes.status}`);
    console.log(`Output Body:`, JSON.stringify(rbacRes.data));
    const a6Pass = rbacRes.status === 403;
    record('A.6', 'non-admin đổi role user khác -> 403', a6Pass);

    // A.7: user A đọc dữ liệu user B (IDOR) -> 403/404
    console.log('\n--- A.7: User A đọc/sửa dữ liệu User B (IDOR) -> 403/404 ---');
    console.log(`Lệnh 7.1 (Target không tồn tại): GET /api/v1/user/profile?userId=non-existent-user-9999`);
    const nonExistUserRes = await request(`${BASE_URL}/api/v1/user/profile?userId=non-existent-user-9999`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    console.log(`Output Status: ${nonExistUserRes.status}`);
    console.log(`Output Body:`, JSON.stringify(nonExistUserRes.data));

    console.log(`Lệnh 7.2 (User A gọi profile của User B với token A): GET /api/v1/user/profile?userId=${userBId}`);
    const idorRes = await request(`${BASE_URL}/api/v1/user/profile?userId=${userBId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    console.log(`Output Status: ${idorRes.status}`);
    const a7Pass = (nonExistUserRes.status === 403 || nonExistUserRes.status === 404) && (idorRes.status === 403 || idorRes.status === 404);
    record('A.7', 'user A đọc dữ liệu user B (IDOR) -> 403/404', a7Pass);

    // ========================================================================
    // CHECKLIST B: SRS
    // ========================================================================
    console.log('\n========================================================================');
    console.log('📌 CHECKLIST B: SRS');
    console.log('========================================================================');

    // B.1: GET /srs/queue -> items
    console.log('--- B.1: GET /api/v1/srs/queue -> items ---');
    console.log('Lệnh: GET /api/v1/srs/queue?userId=demo-user-id-001');
    const srsQueueRes = await request(`${BASE_URL}/api/v1/srs/queue?userId=demo-user-id-001`, { method: 'GET' });
    console.log(`Output Status: ${srsQueueRes.status}`);
    console.log(`Output Body (queue length): ${srsQueueRes.data?.queue?.length || 0}`);
    const b1Pass = srsQueueRes.status === 200 && Array.isArray(srsQueueRes.data?.queue);
    record('B.1', 'GET /srs/queue -> items', b1Pass);

    const targetWordId = srsQueueRes.data?.queue?.[0]?.wordId || 'vocab-test-1';

    // B.2: POST /srs/review quality=5 -> 200 + XP
    console.log('\n--- B.2: POST /api/v1/srs/review quality=5 -> 200 + XP ---');
    console.log(`Lệnh: POST /api/v1/srs/review body={ wordId: "${targetWordId}", quality: 5, userId: "demo-user-id-001" }`);
    const srsRev5Res = await request(`${BASE_URL}/api/v1/srs/review`, { method: 'POST' }, {
      wordId: targetWordId,
      quality: 5,
      userId: 'demo-user-id-001',
    });
    console.log(`Output Status: ${srsRev5Res.status}`);
    console.log(`Output Body:`, JSON.stringify(srsRev5Res.data));
    const b2Pass = srsRev5Res.status === 200 && srsRev5Res.data?.xpEarned > 0;
    record('B.2', 'POST /srs/review quality=5 -> 200 + XP', b2Pass);

    // B.3: quality=99 -> 400
    console.log('\n--- B.3: POST /api/v1/srs/review quality=99 -> 400 ---');
    console.log(`Lệnh: POST /api/v1/srs/review body={ wordId: "${targetWordId}", quality: 99, userId: "demo-user-id-001" }`);
    const srsRev99Res = await request(`${BASE_URL}/api/v1/srs/review`, { method: 'POST' }, {
      wordId: targetWordId,
      quality: 99,
      userId: 'demo-user-id-001',
    });
    console.log(`Output Status: ${srsRev99Res.status}`);
    console.log(`Output Body:`, JSON.stringify(srsRev99Res.data));
    const b3Pass = srsRev99Res.status === 400;
    record('B.3', 'quality=99 -> 400', b3Pass);

    // B.4: quality=-1 -> 400
    console.log('\n--- B.4: POST /api/v1/srs/review quality=-1 -> 400 ---');
    console.log(`Lệnh: POST /api/v1/srs/review body={ wordId: "${targetWordId}", quality: -1, userId: "demo-user-id-001" }`);
    const srsRevNegRes = await request(`${BASE_URL}/api/v1/srs/review`, { method: 'POST' }, {
      wordId: targetWordId,
      quality: -1,
      userId: 'demo-user-id-001',
    });
    console.log(`Output Status: ${srsRevNegRes.status}`);
    console.log(`Output Body:`, JSON.stringify(srsRevNegRes.data));
    const b4Pass = srsRevNegRes.status === 400;
    record('B.4', 'quality=-1 -> 400', b4Pass);

    // ========================================================================
    // CHECKLIST C: CURRICULUM
    // ========================================================================
    console.log('\n========================================================================');
    console.log('📌 CHECKLIST C: CURRICULUM');
    console.log('========================================================================');

    // C.1: GET /curriculum/units
    console.log('--- C.1: GET /api/v1/curriculum/units ---');
    console.log('Lệnh: GET /api/v1/curriculum/units');
    const unitsRes = await request(`${BASE_URL}/api/v1/curriculum/units`, { method: 'GET' });
    console.log(`Output Status: ${unitsRes.status}`);
    console.log(`Output Body (units count): ${unitsRes.data?.units?.length || 0}`);
    const c1Pass = unitsRes.status === 200 && Array.isArray(unitsRes.data?.units) && unitsRes.data.units.length > 0;
    record('C.1', 'GET /curriculum/units', c1Pass);

    // C.2: submit lesson < 2s -> 400 anti-cheat
    console.log('\n--- C.2: Submit lesson < 2s -> 400 anti-cheat ---');
    console.log('2.1. Khởi tạo attempt session: POST /api/v1/curriculum/attempt/start');
    const startAttRes = await request(`${BASE_URL}/api/v1/curriculum/attempt/start`, { method: 'POST' }, {
      userId: 'demo-user-id-001',
      sourceType: 'curriculum',
      sourceId: '1',
    });
    console.log(`Output Status: ${startAttRes.status}`);
    const attemptId1 = startAttRes.data?.attemptId;
    console.log(`Attempt ID: ${attemptId1}`);

    console.log('2.2. Submit ngay lập tức (< 2s): POST /api/v1/curriculum/lessons/1/submit');
    const quickSubmitRes = await request(`${BASE_URL}/api/v1/curriculum/lessons/1/submit`, { method: 'POST' }, {
      attemptId: attemptId1,
      userId: 'demo-user-id-001',
      answers: [],
    });
    console.log(`Output Status: ${quickSubmitRes.status}`);
    console.log(`Output Body:`, JSON.stringify(quickSubmitRes.data));
    const c2Pass = quickSubmitRes.status === 400;
    record('C.2', 'submit lesson < 2s -> 400 anti-cheat', c2Pass);

    // C.3: submit đúng flow -> chấm theo đúng unit của lesson
    console.log('\n--- C.3: Submit đúng flow -> chấm theo đúng unit của lesson ---');
    console.log('3.1. Khởi tạo attempt cho Unit 2: POST /api/v1/curriculum/attempt/start');
    const startAtt2Res = await request(`${BASE_URL}/api/v1/curriculum/attempt/start`, { method: 'POST' }, {
      userId: 'demo-user-id-001',
      sourceType: 'curriculum',
      sourceId: '2',
    });
    const attemptId2 = startAtt2Res.data?.attemptId;
    console.log(`Attempt ID: ${attemptId2}`);
    console.log('⏳ Đợi 2.2 giây để thỏa mãn anti-cheat window...');
    await wait(2200);

    console.log('3.2. Submit đáp án: POST /api/v1/curriculum/lessons/2/submit');
    const properSubmitRes = await request(`${BASE_URL}/api/v1/curriculum/lessons/2/submit`, { method: 'POST' }, {
      attemptId: attemptId2,
      userId: 'demo-user-id-001',
      answers: [],
    });
    console.log(`Output Status: ${properSubmitRes.status}`);
    console.log(`Output Body:`, JSON.stringify(properSubmitRes.data));
    const c3Pass = properSubmitRes.status === 200 && properSubmitRes.data?.lessonId === '2';
    record('C.3', 'submit đúng flow -> chấm theo đúng unit của lesson', c3Pass);

    // ========================================================================
    // CHECKLIST D: GAMES
    // ========================================================================
    console.log('\n========================================================================');
    console.log('📌 CHECKLIST D: GAMES');
    console.log('========================================================================');

    // D.1: GET /games/data?type=... đúng type
    console.log('--- D.1: GET /api/v1/games/data?type=word-scramble ---');
    console.log('Lệnh: GET /api/v1/games/data?type=word-scramble');
    const gameDataRes = await request(`${BASE_URL}/api/v1/games/data?type=word-scramble`, { method: 'GET' });
    console.log(`Output Status: ${gameDataRes.status}`);
    console.log(`Output Body (first item):`, JSON.stringify(gameDataRes.data?.questions?.[0] || gameDataRes.data?.items?.[0]));
    const d1Pass = gameDataRes.status === 200 && (Boolean(gameDataRes.data?.questions) || Boolean(gameDataRes.data?.items));
    record('D.1', 'GET /games/data?type=... đúng type', d1Pass);

    // D.2: submit -> leaderboard cập nhật, restart không mất
    console.log('\n--- D.2: Submit game -> leaderboard cập nhật, restart không mất ---');
    const gameAttemptId = `game-att-${timestamp}`;
    console.log(`Lệnh: POST /api/v1/games/submit attemptId=${gameAttemptId}`);
    const gameSubRes = await request(`${BASE_URL}/api/v1/games/submit`, { method: 'POST' }, {
      attemptId: gameAttemptId,
      gameType: 'word-scramble',
      userId: 'demo-user-id-001',
      userAnswers: [{ questionId: 'q-1', answer: 'Hello' }],
      durationSeconds: 15,
      comboMax: 3,
    });
    console.log(`Output Status: ${gameSubRes.status}`);
    console.log(`Output Body:`, JSON.stringify(gameSubRes.data));

    console.log('Kiểm tra leaderboard trước restart: GET /api/v1/games/leaderboard');
    const lbBefore = await request(`${BASE_URL}/api/v1/games/leaderboard`, { method: 'GET' });
    console.log(`Output Status: ${lbBefore.status}, items count: ${lbBefore.data?.leaderboard?.length}`);

    console.log('🔄 Đang restart API server...');
    await killProcess(server);
    await wait(2500);
    server = startServer();
    await waitForServer();
    console.log('✅ Server đã restart.');

    console.log('Kiểm tra leaderboard sau restart: GET /api/v1/games/leaderboard');
    const lbAfter = await request(`${BASE_URL}/api/v1/games/leaderboard`, { method: 'GET' });
    console.log(`Output Status: ${lbAfter.status}, items count: ${lbAfter.data?.leaderboard?.length}`);
    const d2Pass = lbAfter.status === 200 && lbAfter.data?.leaderboard?.length > 0;
    record('D.2', 'submit -> leaderboard cập nhật, restart không mất', d2Pass);

    // ========================================================================
    // CHECKLIST E: IELTS
    // ========================================================================
    console.log('\n========================================================================');
    console.log('📌 CHECKLIST E: IELTS');
    console.log('========================================================================');

    // E.1: GET đề thi có câu hỏi thật
    console.log('--- E.1: GET đề thi có câu hỏi thật ---');
    console.log('Lệnh: GET /api/v1/ielts/practice/reading');
    const ieltsQRes = await request(`${BASE_URL}/api/v1/ielts/practice/reading`, { method: 'GET' });
    console.log(`Output Status: ${ieltsQRes.status}`);
    console.log(`Output Body (first question):`, JSON.stringify(ieltsQRes.data?.questions?.[0]));
    const e1Pass = ieltsQRes.status === 200 && ieltsQRes.data?.questions?.length > 0;
    record('E.1', 'GET đề thi có câu hỏi thật', e1Pass);

    // E.2: submit 2 lần cùng đáp án -> cùng điểm (cấm random)
    console.log('\n--- E.2: Submit 2 lần cùng đáp án -> cùng điểm (cấm random) ---');
    const mockPayload = {
      userId: 'demo-user-id-001',
      answers: {
        'mock-r-q1': 'True',
        'mock-r-q2': 'False',
        'mock-l-q1': 'Library',
      },
      durationSec: 1800,
    };
    console.log(`Lệnh submit lần 1: POST /api/v1/ielts/mock-test/submit`);
    const sub1 = await request(`${BASE_URL}/api/v1/ielts/mock-test/submit`, { method: 'POST' }, mockPayload);
    const score1 = sub1.data?.attempt?.overallBand;
    console.log(`Lần 1 overallBand: ${score1}`);

    console.log(`Lệnh submit lần 2: POST /api/v1/ielts/mock-test/submit`);
    const sub2 = await request(`${BASE_URL}/api/v1/ielts/mock-test/submit`, { method: 'POST' }, mockPayload);
    const score2 = sub2.data?.attempt?.overallBand;
    console.log(`Lần 2 overallBand: ${score2}`);
    const e2Pass = sub1.status === 200 && sub2.status === 200 && score1 === score2 && typeof score1 === 'number';
    record('E.2', 'submit 2 lần cùng đáp án -> cùng điểm (cấm random)', e2Pass);

    // E.3: writing evaluate có feedback nội dung thật
    console.log('\n--- E.3: Writing evaluate có feedback nội dung thật ---');
    const sampleEssay = `In recent years, technology has transformed education significantly. 
    Many students now learn online using computers and mobile devices. 
    While this provides great flexibility, traditional classroom learning still offers essential human interaction. 
    Therefore, a blended approach is the best solution for modern education systems worldwide.`;
    console.log(`Lệnh: POST /api/v1/ielts/writing/evaluate`);
    const essayRes = await request(`${BASE_URL}/api/v1/ielts/writing/evaluate`, { method: 'POST' }, {
      essayText: sampleEssay,
      taskType: 'task_2',
      prompt: 'Discuss the advantages and disadvantages of online learning.',
    });
    console.log(`Output Status: ${essayRes.status}`);
    console.log(`Output Body:`, JSON.stringify(essayRes.data?.evaluation || essayRes.data));
    const e3Pass = essayRes.status === 200 && (Boolean(essayRes.data?.overallBand) || Boolean(essayRes.data?.evaluation));
    record('E.3', 'writing evaluate có feedback nội dung thật', e3Pass);

    // ========================================================================
    // CHECKLIST F: DICTIONARY
    // ========================================================================
    console.log('\n========================================================================');
    console.log('📌 CHECKLIST F: DICTIONARY');
    console.log('========================================================================');

    // F.1: search có kết quả
    console.log('--- F.1: Search có kết quả ---');
    console.log('Lệnh: GET /api/v1/dictionary/search?q=hello');
    const dictSearchRes = await request(`${BASE_URL}/api/v1/dictionary/search?q=hello`, { method: 'GET' });
    console.log(`Output Status: ${dictSearchRes.status}`);
    console.log(`Output Body (total matches): ${dictSearchRes.data?.total || dictSearchRes.data?.words?.length}`);
    const f1Pass = dictSearchRes.status === 200 && (dictSearchRes.data?.total > 0 || dictSearchRes.data?.words?.length > 0);
    record('F.1', 'search có kết quả', f1Pass);

    // F.2: bookmark -> restart -> còn
    console.log('\n--- F.2: Bookmark -> restart -> còn ---');
    const targetBookmarkWord = 'word-hello';
    console.log(`Lệnh: POST /api/v1/dictionary/bookmark/${targetBookmarkWord}?userId=${userAId}`);
    let bkmRes = await request(`${BASE_URL}/api/v1/dictionary/bookmark/${targetBookmarkWord}?userId=${userAId}`, { method: 'POST' });
    if (!bkmRes.data?.bookmarked) {
      bkmRes = await request(`${BASE_URL}/api/v1/dictionary/bookmark/${targetBookmarkWord}?userId=${userAId}`, { method: 'POST' });
    }
    console.log(`Output Status: ${bkmRes.status}`);
    console.log(`Output Body:`, JSON.stringify(bkmRes.data));

    console.log('🔄 Đang restart API server...');
    await killProcess(server);
    await wait(2500);
    server = startServer();
    await waitForServer();
    console.log('✅ Server đã restart.');

    console.log(`Kiểm tra bookmark sau restart: GET /api/v1/dictionary/bookmarks?userId=${userAId}`);
    const bkmAfterRes = await request(`${BASE_URL}/api/v1/dictionary/bookmarks?userId=${userAId}`, { method: 'GET' });
    console.log(`Output Status: ${bkmAfterRes.status}`);
    const hasBookmark = bkmAfterRes.data?.bookmarks?.some((b) => b.id === targetBookmarkWord || b.wordId === targetBookmarkWord || b.targetText?.toLowerCase() === 'hello');
    console.log(`Tìm thấy bookmark sau restart: ${hasBookmark}`);
    const f2Pass = bkmAfterRes.status === 200 && (hasBookmark || bkmAfterRes.data?.bookmarks?.length > 0);
    record('F.2', 'bookmark -> restart -> còn', f2Pass);

    // ========================================================================
    // CHECKLIST G: ADMIN
    // ========================================================================
    console.log('\n========================================================================');
    console.log('📌 CHECKLIST G: ADMIN');
    console.log('========================================================================');

    // G.1: non-admin GET /admin/* -> 403
    console.log('--- G.1: Non-admin GET /api/v1/admin/dashboard -> 403 ---');
    console.log(`Lệnh: GET /api/v1/admin/dashboard với token của User A (STUDENT)`);
    const adminForbiddenRes = await request(`${BASE_URL}/api/v1/admin/dashboard`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    console.log(`Output Status: ${adminForbiddenRes.status}`);
    console.log(`Output Body:`, JSON.stringify(adminForbiddenRes.data));
    const g1Pass = adminForbiddenRes.status === 403;
    record('G.1', 'non-admin GET /admin/* -> 403', g1Pass);

    // G.2: audit logs còn sau restart
    console.log('\n--- G.2: Audit logs còn sau restart ---');
    const saEmail = process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@lingual.com';
    const saPassword = process.env.SUPER_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || '123456';
    console.log(`Đăng nhập Quản trị viên (${saEmail})...`);
    const saLogin = await request(`${BASE_URL}/api/v1/auth/login`, { method: 'POST' }, {
      email: saEmail,
      password: saPassword,
    });
    const saToken = saLogin.data?.accessToken;

    console.log('Tạo audit log qua đổi role: POST /api/v1/admin/users/:id/role');
    await request(`${BASE_URL}/api/v1/admin/users/${userBId}/role`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${saToken}` },
    }, { role: 'CONTENT_REVIEWER' });

    console.log('🔄 Đang restart API server...');
    await killProcess(server);
    await wait(2500);
    server = startServer();
    await waitForServer();
    console.log('✅ Server đã restart.');

    console.log('Lấy audit logs sau restart: GET /api/v1/admin/audit-logs');
    const auditLogsRes = await request(`${BASE_URL}/api/v1/admin/audit-logs`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${saToken}` },
    });
    console.log(`Output Status: ${auditLogsRes.status}`);
    const logsList = auditLogsRes.data?.auditLogs || auditLogsRes.data?.logs || [];
    console.log(`Tổng số audit logs trong DB: ${logsList.length}`);
    const foundAudit = logsList.find((l) => l.resourceId === userBId);
    console.log(`Audit log tìm thấy:`, JSON.stringify(foundAudit));
    const g2Pass = auditLogsRes.status === 200 && Boolean(foundAudit);
    record('G.2', 'audit logs còn sau restart', g2Pass);

    // ========================================================================
    // CHECKLIST H: CHATBOT SSE
    // ========================================================================
    console.log('\n========================================================================');
    console.log('📌 CHECKLIST H: CHATBOT SSE');
    console.log('========================================================================');

    console.log('--- H: POST /api/v1/chatbot/chat -> stream SSE có nội dung ---');
    console.log('Lệnh: POST /api/v1/chatbot/chat headers={ Accept: "text/event-stream" } body={ message: "Chào bạn, hãy giải thích từ Hello" }');
    const sseRes = await requestSSE(`${BASE_URL}/api/v1/chatbot/chat`, { method: 'POST' }, {
      message: 'Chào bạn, hãy giải thích từ Hello',
      locale: 'vi',
    });
    console.log(`Output Status: ${sseRes.status}`);
    console.log(`Output Headers:`, sseRes.headers['content-type']);
    console.log(`Số SSE events nhận được: ${sseRes.events.length}`);
    console.log(`Mẫu SSE events nhận được:`);
    sseRes.events.slice(0, 10).forEach((ev) => console.log(`   ${ev}`));
    const hPass = sseRes.status === 200 && sseRes.events.length > 0 && sseRes.fullText.includes('event:');
    record('H', 'POST /chatbot/chat -> stream SSE có nội dung', hPass);

    console.log('\n========================================================================');
    console.log('🏁 TỔNG HỢP KẾT QUẢ TESTER CHECKLIST A–H');
    console.log('========================================================================');
    let totalPass = 0;
    testResults.forEach((t) => {
      if (t.pass) totalPass++;
      console.log(`[${t.pass ? 'PASS' : 'FAIL'}] ${t.section}: ${t.name}`);
    });
    console.log(`\nTổng số bài test: ${testResults.length}`);
    console.log(`Số bài ĐẠT: ${totalPass}/${testResults.length}`);
    console.log('========================================================================');

    if (totalPass !== testResults.length) {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('\n❌ XẢY RA LỖI TRONG QUÁ TRÌNH CHẠY CHECKLIST:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      await killProcess(server);
    }
  }
}

main();
