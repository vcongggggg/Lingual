import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:4000/api/v1/content"

endpoints = [
    ("grammar-questions", 1000),
    ("dialogues", 56),
    ("story-templates", 50),
    ("packages", 120),
    ("articles", 100),
    ("stories", 18),
    ("ielts-reading", 24),
    ("ielts-listening", 24),
    ("ielts-speaking", 150),
    ("ielts-writing", 60),
    ("units", 60), # 10 legacy + 50 curriculum
    ("diary-prompts", 360),
    ("shadowing", 400),
    ("dictation", 50),
    ("monologues", 10),
    ("idioms", 200),
    ("phrasal-verbs", 200),
    ("collocations", 200),
    ("synonyms", 200),
    ("minimal-pairs", 100),
    ("tongue-twisters", 50),
    ("proverbs", 100),
    ("game-pools", 500),
    ("grammar-explanations", 50),
    ("vocab-questions", 300),
    ("phrases?category=situational", 200),
    ("phrases?category=business", 150),
    ("phrases?category=travel", 150),
]

passed = 0
failed = 0

print("================================================================================")
print("TESTING ALL 26+ CONTENT ENDPOINTS (/api/v1/content/...)")
print("================================================================================")

for ep, expected_total in endpoints:
    url = f"{BASE_URL}/{ep}"
    sep = "&" if "?" in ep else "?"
    test_url = f"{url}{sep}limit=5"
    try:
        res = requests.get(test_url, timeout=5)
        if res.status_code != 200:
            print(f"❌ {ep}: HTTP {res.status_code} - {res.text}")
            failed += 1
            continue
        data = res.json()
        items = data.get("items", [])
        total = data.get("total", 0)
        if total >= expected_total and len(items) > 0:
            print(f"✅ {ep}: total={total} (expected >= {expected_total}), returned items={len(items)}")
            passed += 1
        else:
            print(f"⚠️ {ep}: total={total} (expected >= {expected_total}), items={len(items)}")
            failed += 1
    except Exception as e:
        print(f"❌ {ep}: Exception {e}")
        failed += 1

# Also test random sampling & detail by ID on grammar-questions
print("\n--- Testing Random Sampling & Detail Endpoint ---")
try:
    r1 = requests.get(f"{BASE_URL}/grammar-questions?random=true&limit=5", timeout=5).json()
    r2 = requests.get(f"{BASE_URL}/grammar-questions?random=true&limit=5", timeout=5).json()
    ids1 = [x['id'] for x in r1['items']]
    ids2 = [x['id'] for x in r2['items']]
    first_id = ids1[0]
    detail = requests.get(f"{BASE_URL}/grammar-questions/{first_id}", timeout=5).json()
    
    print(f"Sample 1 IDs: {ids1}")
    print(f"Sample 2 IDs: {ids2}")
    if ids1 != ids2:
        print("✅ Random sampling verified: successive queries return different items.")
        passed += 1
    else:
        print("⚠️ Random sampling returned identical set (unlikely but possible)")
    
    if detail.get("item", {}).get("id") == first_id:
        print(f"✅ Detail endpoint verified for ID {first_id}")
        passed += 1
    else:
        print(f"❌ Detail endpoint failed: {detail}")
        failed += 1
except Exception as e:
    print(f"❌ Random/Detail test failed: {e}")
    failed += 1

print("\n================================================================================")
print(f"SUMMARY: {passed} PASSED, {failed} FAILED")
print("================================================================================")
if failed > 0:
    sys.exit(1)
