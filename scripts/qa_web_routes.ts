import http from 'http';

async function fetchRoute(path: string): Promise<{ statusCode: number; length: number }> {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode || 0, length: data.length });
      });
    });
    req.on('error', reject);
  });
}

async function run() {
  console.log('=== VERIFYING WEB ROUTE RENDERING ===\n');
  const routes = [
    '/vi/writing',
    '/en/writing',
    '/vi/writing/see-write',
    '/vi/writing/guided',
    '/vi/writing/free',
    '/vi/writing/result',
  ];

  for (const r of routes) {
    try {
      const res = await fetchRoute(r);
      console.log(`Route ${r} -> Status ${res.statusCode} (Payload: ${res.length} bytes)`);
      if (res.statusCode !== 200) {
        process.exit(1);
      }
    } catch (e: any) {
      console.error(`Route ${r} Error:`, e.message);
      process.exit(1);
    }
  }

  console.log('\nAll web routes returned 200 OK successfully!');
}

run();
