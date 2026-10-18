import urllib.request
import re
import os
import json

links = {
    'grammar-questions.json': 'https://tmpfiles.org/dl/wIAAcsOgVuVK/grammar-questions.json',
    'dialogues.json': 'https://tmpfiles.org/dl/wPAncKO5VsLI/dialogues.json',
    'story-templates.json': 'https://tmpfiles.org/dl/wUARcIOSVDHR/story-templates.json'
}

os.makedirs('data/phase2', exist_ok=True)

def download_file(name, url):
    print(f"Attempting download for {name} from {url}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            content = resp.read()
            if content.startswith(b'<!DOCTYPE') or content.startswith(b'<html'):
                html = content.decode('utf-8', errors='ignore')
                m = re.search(r'href=["\'](https?://tmpfiles\.org/dl/[^"\']+)["\']', html)
                if not m:
                    m = re.search(r'"(https?://[^"]+/dl/[^"]+)"', html)
                if m:
                    actual_url = m.group(1)
                    print(f"  Found redirected download URL: {actual_url}")
                    req2 = urllib.request.Request(actual_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req2, timeout=20) as resp2:
                        content = resp2.read()
            
            dest = os.path.join('data/phase2', name)
            with open(dest, 'wb') as f:
                f.write(content)
            
            # Verify JSON parse
            try:
                parsed = json.loads(content.decode('utf-8'))
                print(f"  SUCCESS: {name} ({len(content)} bytes, {len(parsed)} items)")
            except Exception as je:
                print(f"  Saved {name} ({len(content)} bytes), but JSON parse warning: {je}")
    except Exception as e:
        print(f"  Failed {name}: {e}")

if __name__ == '__main__':
    for name, url in links.items():
        download_file(name, url)
