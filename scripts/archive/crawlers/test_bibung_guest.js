const https = require('https');

function requestPost(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      port: 443,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function testGuestAuth() {
  const endpoints = [
    'https://bibung.com/api/auth/guest',
    'https://bibung.com/api/auth/anonymous',
    'https://bibung.com/api/auth/session',
  ];
  for (const ep of endpoints) {
    try {
      console.log('Testing', ep);
      const res = await requestPost(ep, {});
      console.log(res.status, res.body.slice(0, 150));
    } catch (e) {
      console.log('Err', ep, e.message);
    }
  }
}

testGuestAuth();
