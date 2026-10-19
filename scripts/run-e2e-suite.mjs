import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ping(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForHttp(url, maxAttempts = 40) {
  for (let i = 0; i < maxAttempts; i++) {
    const ok = await ping(url);
    if (ok) return true;
    await wait(1000);
  }
  return false;
}

function killProcess(proc) {
  return new Promise((resolve) => {
    if (!proc || proc.killed) return resolve();
    spawn('taskkill', ['/pid', proc.pid.toString(), '/f', '/t'], { shell: true })
      .on('close', () => resolve());
  });
}

async function main() {
  const isApiUp = await ping('http://localhost:4000/api/v1/health');
  let apiProc = null;
  if (!isApiUp) {
    console.log('🔄 Đang khởi động API server (port 4000)...');
    apiProc = spawn('pnpm', ['--filter', 'api', 'exec', 'tsx', 'src/server.ts'], {
      shell: true,
      cwd: REPO_ROOT,
      stdio: 'pipe',
    });
  } else {
    console.log('✅ API server đã đang chạy sẵn trên port 4000.');
  }

  const isWebUp = await ping('http://localhost:3000/vi');
  let webProc = null;
  if (!isWebUp) {
    console.log('🔄 Đang khởi động Web dev server (port 3000)...');
    webProc = spawn('pnpm', ['--filter', 'web', 'dev'], {
      shell: true,
      cwd: REPO_ROOT,
      stdio: 'pipe',
    });
  } else {
    console.log('✅ Web server đã đang chạy sẵn trên port 3000.');
  }

  try {
    if (!isApiUp) {
      console.log('⏳ Chờ API server sẵn sàng tại http://localhost:4000/api/v1/health...');
      const apiReady = await waitForHttp('http://localhost:4000/api/v1/health', 30);
      if (!apiReady) throw new Error('API server không phản hồi sau 30s');
      console.log('✅ API server đã sẵn sàng!');
    }

    if (!isWebUp) {
      console.log('⏳ Chờ Web server sẵn sàng tại http://localhost:3000/vi...');
      const webReady = await waitForHttp('http://localhost:3000/vi', 60);
      if (!webReady) throw new Error('Web server không phản hồi sau 60s');
      console.log('✅ Web server đã sẵn sàng!');
    }

    console.log('\n🎭 ĐANG CHẠY PLAYWRIGHT E2E SUITE (apps/web/e2e)...');
    console.log('Lệnh: pnpm --filter web exec playwright test --project="Desktop 1440"\n');

    const exitCode = await new Promise((resolve) => {
      const pw = spawn('pnpm --filter web exec playwright test --project="Desktop 1440"', {
        shell: true,
        cwd: REPO_ROOT,
        stdio: 'inherit',
      });
      pw.on('close', (code) => {
        console.log(`\n🏁 Playwright kết thúc với exit code: ${code}`);
        resolve(code);
      });
    });

    if (exitCode !== 0) {
      process.exitCode = exitCode;
    }
  } catch (err) {
    console.error('❌ Lỗi khi khởi động hoặc chạy test:', err);
    process.exitCode = 1;
  } finally {
    if (apiProc || webProc) {
      console.log('🛑 Đang dọn dẹp các tiến trình máy chủ được khởi tạo bởi test runner...');
      if (apiProc) await killProcess(apiProc);
      if (webProc) await killProcess(webProc);
      console.log('✅ Đã dọn dẹp xong.');
    }
  }
}

main();
