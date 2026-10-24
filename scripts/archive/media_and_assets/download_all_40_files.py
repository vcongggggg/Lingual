# -*- coding: utf-8 -*-
import urllib.request
import os
import json
import time

FILES = [
    # 4 tmpfiles FIRST (critical to download before expiry)
    {"batch": "4B", "task": "lingual-data-phase2-005", "name": "bilingual-articles-batch2.json", "url": "https://tmpfiles.org/dl/wWAbc7GgdNOw/bilingual-articles-batch2.json"},
    {"batch": "5A", "task": "lingual-data-phase2-007", "name": "daily-vocab-questions.json", "url": "https://tmpfiles.org/dl/wyAWcgGyoHNG/daily-vocab-questions.json"},
    {"batch": "5B", "task": "lingual-data-phase2-008", "name": "dictation-sentences.json", "url": "https://tmpfiles.org/dl/wHAocLGJJ5Mg/dictation-sentences.json"},
    {"batch": "5C", "task": "lingual-data-phase2-009", "name": "ielts-reading-batch3.json", "url": "https://tmpfiles.org/dl/wMAPc3GIoIcu/ielts-reading-batch3.json"},

    # Batch 4B (catbox)
    {"batch": "4B", "task": "lingual-data-phase2-005", "name": "content-packages-batch2.json", "url": "https://files.catbox.moe/yya0pt.json"},
    {"batch": "4B", "task": "lingual-data-phase2-005", "name": "content-packages-batch3.json", "url": "https://files.catbox.moe/l8rztj.json"},
    {"batch": "4B", "task": "lingual-data-phase2-005", "name": "bilingual-articles-batch3.json", "url": "https://files.catbox.moe/r7oaf1.json"},
    {"batch": "4B", "task": "lingual-data-phase2-005", "name": "bilingual-stories.json", "url": "https://files.catbox.moe/xxw4yl.json"},

    # Batch 4C (catbox)
    {"batch": "4C", "task": "lingual-data-phase2-006", "name": "ielts-reading-batch2.json", "url": "https://files.catbox.moe/9bcrzi.json"},
    {"batch": "4C", "task": "lingual-data-phase2-006", "name": "ielts-listening-batch2.json", "url": "https://files.catbox.moe/su61p7.json"},
    {"batch": "4C", "task": "lingual-data-phase2-006", "name": "curriculum-units-batch2.json", "url": "https://files.catbox.moe/2l0tm0.json"},
    {"batch": "4C", "task": "lingual-data-phase2-006", "name": "diary-prompts-batch2.json", "url": "https://files.catbox.moe/5qk6q3.json"},

    # Batch 5A (catbox)
    {"batch": "5A", "task": "lingual-data-phase2-007", "name": "grammar-questions-batch3.json", "url": "https://files.catbox.moe/kwvvdd.json"},
    {"batch": "5A", "task": "lingual-data-phase2-007", "name": "vocab-c1c2.json", "url": "https://files.catbox.moe/acvg0r.json"},
    {"batch": "5A", "task": "lingual-data-phase2-007", "name": "idioms.json", "url": "https://files.catbox.moe/x5cx7w.json"},
    {"batch": "5A", "task": "lingual-data-phase2-007", "name": "phrasal-verbs.json", "url": "https://files.catbox.moe/7m7f5j.json"},
    {"batch": "5A", "task": "lingual-data-phase2-007", "name": "collocations.json", "url": "https://files.catbox.moe/r1d468.json"},
    {"batch": "5A", "task": "lingual-data-phase2-007", "name": "synonyms-antonyms.json", "url": "https://files.catbox.moe/c474w2.json"},
    {"batch": "5A", "task": "lingual-data-phase2-007", "name": "minimal-pairs.json", "url": "https://files.catbox.moe/trj8oj.json"},
    {"batch": "5A", "task": "lingual-data-phase2-007", "name": "tongue-twisters.json", "url": "https://files.catbox.moe/734k0x.json"},
    {"batch": "5A", "task": "lingual-data-phase2-007", "name": "proverbs.json", "url": "https://files.catbox.moe/52n9i9.json"},
    {"batch": "5A", "task": "lingual-data-phase2-007", "name": "game-word-pools.json", "url": "https://files.catbox.moe/zfx42x.json"},
    {"batch": "5A", "task": "lingual-data-phase2-007", "name": "grammar-explanations.json", "url": "https://files.catbox.moe/3g3qqr.json"},

    # Batch 5B (catbox)
    {"batch": "5B", "task": "lingual-data-phase2-008", "name": "dialogues-batch3.json", "url": "https://files.catbox.moe/aa81x1.json"},
    {"batch": "5B", "task": "lingual-data-phase2-008", "name": "content-packages-batch4.json", "url": "https://files.catbox.moe/fgt8an.json"},
    {"batch": "5B", "task": "lingual-data-phase2-008", "name": "content-packages-batch5.json", "url": "https://files.catbox.moe/21cqvj.json"},
    {"batch": "5B", "task": "lingual-data-phase2-008", "name": "listening-monologues.json", "url": "https://files.catbox.moe/xyfn60.json"},
    {"batch": "5B", "task": "lingual-data-phase2-008", "name": "shadowing-sentences-batch3.json", "url": "https://files.catbox.moe/5il33l.json"},
    {"batch": "5B", "task": "lingual-data-phase2-008", "name": "situational-phrases.json", "url": "https://files.catbox.moe/d4v7s8.json"},
    {"batch": "5B", "task": "lingual-data-phase2-008", "name": "business-phrases.json", "url": "https://files.catbox.moe/al4523.json"},
    {"batch": "5B", "task": "lingual-data-phase2-008", "name": "travel-phrases.json", "url": "https://files.catbox.moe/fhgusv.json"},

    # Batch 5C (catbox / uguu)
    {"batch": "5C", "task": "lingual-data-phase2-009", "name": "ielts-listening-batch3.json", "url": "https://files.catbox.moe/1jj9ye.json"},
    {"batch": "5C", "task": "lingual-data-phase2-009", "name": "ielts-speaking.json", "url": "https://files.catbox.moe/lqwcth.json"},
    {"batch": "5C", "task": "lingual-data-phase2-009", "name": "ielts-writing.json", "url": "https://d.uguu.se/ElZJCBOq.json"},
    {"batch": "5C", "task": "lingual-data-phase2-009", "name": "bilingual-articles-batch4.json", "url": "https://files.catbox.moe/enndk5.json"},
    {"batch": "5C", "task": "lingual-data-phase2-009", "name": "bilingual-articles-batch5.json", "url": "https://files.catbox.moe/89qo3m.json"},
    {"batch": "5C", "task": "lingual-data-phase2-009", "name": "bilingual-stories-batch2.json", "url": "https://files.catbox.moe/avv1xo.json"},
    {"batch": "5C", "task": "lingual-data-phase2-009", "name": "story-templates-batch3.json", "url": "https://files.catbox.moe/3jx11j.json"},
    {"batch": "5C", "task": "lingual-data-phase2-009", "name": "curriculum-units-batch3.json", "url": "https://files.catbox.moe/4mvusn.json"},
    {"batch": "5C", "task": "lingual-data-phase2-009", "name": "diary-prompts-batch3.json", "url": "https://files.catbox.moe/woh63p.json"},
]

DEST_DIR = os.path.abspath("data/phase2_all")
os.makedirs(DEST_DIR, exist_ok=True)

results = {"success": [], "failed": []}

print(f"[*] Total files to download: {len(FILES)}")
print(f"[*] Target directory: {DEST_DIR}\n")

for i, item in enumerate(FILES, 1):
    fname = item["name"]
    url = item["url"]
    batch = item["batch"]
    dest_path = os.path.join(DEST_DIR, fname)
    
    print(f"[{i:02d}/{len(FILES):02d}] Downloading [{batch}] {fname} from {url}...")
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read()
            
        # Check if tmpfiles returned html instead of raw content
        if content.startswith(b"<!DOCTYPE") or content.startswith(b"<html"):
            raise ValueError("Received HTML instead of JSON file")
            
        # Validate JSON parse
        parsed = json.loads(content.decode("utf-8"))
        count = len(parsed) if isinstance(parsed, (list, dict)) else 1
        
        with open(dest_path, "wb") as f:
            f.write(content)
            
        print(f"     -> OK: {len(content):,} bytes, {count} records parsed.")
        results["success"].append({"name": fname, "batch": batch, "size": len(content), "count": count})
    except Exception as e:
        print(f"     -> ERROR: {e}")
        results["failed"].append({"name": fname, "batch": batch, "url": url, "error": str(e)})
    
    time.sleep(0.2)

print("\n" + "="*50)
print(f"SUMMARY: {len(results['success'])}/{len(FILES)} succeeded, {len(results['failed'])} failed.")
if results["failed"]:
    print("FAILED FILES:")
    for f in results["failed"]:
        print(f" - [{f['batch']}] {f['name']}: {f['error']} ({f['url']})")
