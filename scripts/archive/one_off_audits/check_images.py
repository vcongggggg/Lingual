import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor

def main():
    with open('prisma/seed.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    urls = re.findall(r'imageUrl:\s*\"(https?://[^\"]+)\"', content)
    unique_urls = list(set(urls))
    print(f'Total imageUrl in seed.ts: {len(urls)}, Unique: {len(unique_urls)}')

    def check_url(url):
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=8) as resp:
                return url, resp.status == 200
        except Exception:
            return url, False

    with ThreadPoolExecutor(max_workers=20) as ex:
        results = list(ex.map(check_url, unique_urls))

    alive = [u for u, ok in results if ok]
    dead = [u for u, ok in results if not ok]
    print(f'Alive URLs: {len(alive)}')
    print(f'Dead URLs: {len(dead)}')
    
    # Replace dead URLs with null in seed.ts
    new_content = content
    for dead_url in dead:
        pattern = f'imageUrl: "{dead_url}"'
        replacement = 'imageUrl: null'
        new_content = new_content.replace(pattern, replacement)
        print(f'Replaced dead URL with null: {dead_url}')

    if new_content != content:
        with open('prisma/seed.ts', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('Updated prisma/seed.ts successfully!')
    else:
        print('No changes needed in prisma/seed.ts')

if __name__ == '__main__':
    main()
