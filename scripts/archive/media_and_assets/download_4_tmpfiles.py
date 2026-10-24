# -*- coding: utf-8 -*-
import urllib.request
import re
import os
import json

links = {
    'bilingual-articles-batch2.json': 'https://tmpfiles.org/wWAbc7GgdNOw/bilingual-articles-batch2.json',
    'daily-vocab-questions.json': 'https://tmpfiles.org/wyAWcgGyoHNG/daily-vocab-questions.json',
    'dictation-sentences.json': 'https://tmpfiles.org/wHAocLGJJ5Mg/dictation-sentences.json',
    'ielts-reading-batch3.json': 'https://tmpfiles.org/wMAPc3GIoIcu/ielts-reading-batch3.json'
}

dest_dir = 'data/phase2_all'
os.makedirs(dest_dir, exist_ok=True)

for name, page_url in links.items():
    print(f"Fetching page {name} from {page_url}...")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    req = urllib.request.Request(page_url, headers=headers)
    html = urllib.request.urlopen(req, timeout=30).read().decode('utf-8')
    m = re.search(r'class=[\'"]download[\'"]\s+href=[\'"]([^\'"]+)[\'"]', html)
    if not m:
        m = re.search(r'href=[\'"](https?://tmpfiles\.org/dl/[^\'"]+)[\'"]', html)
    if not m:
        print(f"  FAILED to find download link in page for {name}")
        continue
    dl_url = m.group(1)
    print(f"  Found direct download URL: {dl_url}")
    req2 = urllib.request.Request(dl_url, headers=headers)
    content = urllib.request.urlopen(req2, timeout=30).read()
    dest = os.path.join(dest_dir, name)
    with open(dest, 'wb') as f:
        f.write(content)
    parsed = json.loads(content.decode('utf-8'))
    print(f"  SUCCESS: {name} ({len(content)} bytes, {len(parsed)} records)")
