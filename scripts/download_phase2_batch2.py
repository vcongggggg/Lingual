import urllib.request
import re
import os
import json

LINKS = {
    "grammar-questions-batch2.json": "https://tmpfiles.org/wZAicoOwEJw5/grammar-questions-batch2.json",
    "shadowing-sentences-batch2.json": "https://tmpfiles.org/w8AMcgOHETAv/shadowing-sentences-batch2.json",
    "dialogues-batch2.json": "https://tmpfiles.org/wLAwcNO9EolN/dialogues-batch2.json",
    "story-templates-batch2.json": "https://tmpfiles.org/wgAUcnObEJdB/story-templates-batch2.json"
}

OUTPUT_DIR = os.path.join("data", "phase2_batch2")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def download_tmpfile(name, page_url):
    print(f"Fetching page for {name}: {page_url}")
    req = urllib.request.Request(page_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode("utf-8", errors="ignore")

    m = re.search(r'class="download"\s+href="([^"]+)"', html) or re.search(r'href="([^"]+/dl/[^"]+)"', html)
    if not m:
        raise ValueError(f"Could not find download link on page for {name}")

    download_url = m.group(1)
    print(f"  Direct download link: {download_url}")

    req2 = urllib.request.Request(download_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    with urllib.request.urlopen(req2, timeout=30) as resp2:
        raw = resp2.read()

    # Validate JSON
    parsed = json.loads(raw.decode("utf-8"))
    out_path = os.path.join(OUTPUT_DIR, name)
    with open(out_path, "wb") as f:
        f.write(raw)

    print(f"  SUCCESS: Saved {name} ({len(raw)} bytes, {len(parsed)} items)")
    return parsed

def main():
    results = {}
    for name, url in LINKS.items():
        results[name] = download_tmpfile(name, url)
    print("\nAll 4 files downloaded and validated as JSON!")

if __name__ == "__main__":
    main()
