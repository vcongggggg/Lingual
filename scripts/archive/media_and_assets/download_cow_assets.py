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
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Referer': 'https://www.qiubiaoqing.com/',
}

# Known images from Bing search & Qiubiaoqing cow meme album
candidate_urls = [
    "https://imgs.qiubiaoqing.com/qiubiaoqing/album_cover/691b555c073c9CnB.jpg",
    "https://th.bing.com/th/id/R.5e30f8a99ba23063df574477856b7158?rik=3zkMr7V53ovV4A&pid=ImgRaw&r=0",
    "https://imgs.qiubiaoqing.com/qiubiaoqing/biaoqing/829399223190424818.gif",
    "https://imgs.qiubiaoqing.com/qiubiaoqing/biaoqing/829399223190424818.jpg",
]

crawl_pages = [
    "https://www.qiubiaoqing.com/img_detail/829399223190424818.html",
    "https://www.qiubiaoqing.com/search?keyword=" + urllib.parse.quote("奶牛"),
    "https://www.qiubiaoqing.com/search?keyword=" + urllib.parse.quote("牛"),
]

for url in crawl_pages:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_ctx, timeout=8) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            found_srcs = re.findall(r'https?://[^\s\'"<>\)]+\.(?:jpg|png|gif|jpeg|webp)', html, re.IGNORECASE)
            for src in found_srcs:
                if 'qiubiaoqing' in src or 'sinaimg' in src or 'biaoqing' in src:
                    candidate_urls.append(src)
    except Exception as e:
        print(f"Notice: Could not crawl {url}: {e}")

unique_urls = []
for u in candidate_urls:
    if u not in unique_urls:
        unique_urls.append(u)

print(f"Total candidate images to process: {len(unique_urls)}")

success_count = 0
for idx, img_url in enumerate(unique_urls, 1):
    ext = '.jpg'
    if '.gif' in img_url.lower():
        ext = '.gif'
    elif '.png' in img_url.lower():
        ext = '.png'
    elif '.webp' in img_url.lower():
        ext = '.webp'
    
    file_name = f"cow_mascot_meme_{idx:02d}{ext}"
    file_path = os.path.join(output_dir, file_name)
    
    try:
        req = urllib.request.Request(img_url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_ctx, timeout=10) as resp:
            data = resp.read()
            if len(data) > 1000:
                with open(file_path, 'wb') as f:
                    f.write(data)
                print(f"SUCCESS: Saved {file_name} ({len(data)} bytes) from {img_url}")
                success_count += 1
    except Exception as e:
        print(f"FAIL [{idx}]: {img_url} -> {e}")

print(f"\nDownload finished! Saved {success_count} images in {output_dir}")
