const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function testEndpoints() {
  const setId = '6a0da1699b04896bf6f6a195';
  const urls = [
    `https://bibung.com/api/vocabulary/set/${setId}`,
    `https://bibung.com/api/vocabulary/sets`,
    `https://bibung.com/api/v1/vocabulary/set/${setId}`,
    `https://api.bibung.com/vocabulary/set/${setId}`,
    `https://api.bibung.com/api/vocabulary/set/${setId}`,
  ];

  for (const u of urls) {
    try {
      console.log(`Checking ${u}...`);
      const res = await fetchJson(u);
      console.log(`Status ${res.status}:`, typeof res.data === 'object' ? Object.keys(res.data) : res.raw.slice(0, 100));
    } catch (err) {
      console.log(`Error on ${u}:`, err.message);
    }
  }
}

testEndpoints();
