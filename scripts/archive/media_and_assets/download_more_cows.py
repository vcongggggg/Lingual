import os
import ssl
import urllib.request
import urllib.parse
import re

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

output_dir = r"c:\Study\HocKy6\LinguaFlow\asssets"
os.makedirs(output_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
}

# Bing Image search query for cow meme series
search_queries = [
    "qiubiaoqing 691b555c073c9CnB",
    "qiubiaoqing 奶牛 爆笑",
    "Meme Meadow Catole cow",
    "奶牛 表情包 愤怒",
]

more_urls = []

for q in search_queries:
    bing_url = f"https://www.bing.com/images/search?q={urllib.parse.quote(q)}&form=HDRSC2"
    try:
        req = urllib.request.Request(bing_url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_ctx, timeout=8) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            murls = re.findall(r'murl&quot;:&quot;(https?://[^&]+)&quot;', html)
            more_urls.extend(murls[:10])
    except Exception as e:
        print(f"Bing search fail for {q}: {e}")

# Download unique images
for idx, img_url in enumerate(more_urls, 6):
    file_name = f"cow_mascot_{idx:02d}.jpg"
    file_path = os.path.join(output_dir, file_name)
    if os.path.exists(file_path):
        continue
    try:
        req = urllib.request.Request(img_url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_ctx, timeout=8) as resp:
            data = resp.read()
            if len(data) > 3000:
                with open(file_path, 'wb') as f:
                    f.write(data)
                print(f"Saved {file_name} from {img_url}")
    except Exception:
        pass
