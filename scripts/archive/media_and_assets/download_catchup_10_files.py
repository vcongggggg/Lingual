# -*- coding: utf-8 -*-
import urllib.request
import re
import os
import json
import time

links = {
    'grammar-questions.json': 'https://tmpfiles.org/wBAWcVGp43O7/grammar-questions.json',
    'dialogues.json': 'https://tmpfiles.org/wyA6c4G144DF/dialogues.json',
    'story-templates.json': 'https://tmpfiles.org/wmAvcOGP4Brn/story-templates.json',
    'content-packages.json': 'https://tmpfiles.org/wxADcoG44XGR/content-packages.json',
    'bilingual-articles.json': 'https://tmpfiles.org/wvA8c4Gj4rBA/bilingual-articles.json',
    'ielts-reading.json': 'https://tmpfiles.org/wAAucJGx4Uhb/ielts-reading.json',
    'ielts-listening.json': 'https://tmpfiles.org/w9AJczGy4R4O/ielts-listening.json',
    'curriculum-units.json': 'https://tmpfiles.org/woAzcHGt4nPE/curriculum-units.json',
    'diary-prompts.json': 'https://tmpfiles.org/wNAmcQG74KqQ/diary-prompts.json',
    'shadowing-sentences.json': 'https://tmpfiles.org/wMA8c8G14xxu/shadowing-sentences.json'
}

dest_dir = 'data/phase2_all'
os.makedirs(dest_dir, exist_ok=True)

results = {"success": [], "failed": []}

for name, page_url in links.items():
    print(f"Fetching page {name} from {page_url}...")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    try:
        req = urllib.request.Request(page_url, headers=headers)
        html = urllib.request.urlopen(req, timeout=30).read().decode('utf-8')
        m = re.search(r'class=[\'"]download[\'"]\s+href=[\'"]([^\'"]+)[\'"]', html)
        if not m:
            m = re.search(r'href=[\'"](https?://tmpfiles\.org/dl/[^\'"]+)[\'"]', html)
        if not m:
            raise ValueError("Direct download link not found in HTML page")
        dl_url = m.group(1)
        print(f"  Found direct download URL: {dl_url}")
        req2 = urllib.request.Request(dl_url, headers=headers)
        content = urllib.request.urlopen(req2, timeout=30).read()
        dest = os.path.join(dest_dir, name)
        with open(dest, 'wb') as f:
            f.write(content)
        parsed = json.loads(content.decode('utf-8'))
        count = len(parsed) if isinstance(parsed, (list, dict)) else 1
        print(f"  SUCCESS: {name} ({len(content):,} bytes, {count} records)")
        results["success"].append(name)
    except Exception as e:
        print(f"  ERROR for {name}: {e}")
        results["failed"].append({"name": name, "error": str(e)})
    time.sleep(0.3)

print("\n" + "="*50)
print(f"DOWNLOAD RESULT: {len(results['success'])}/{len(links)} succeeded, {len(results['failed'])} failed.")
if results["failed"]:
    print("FAILED:", results["failed"])
