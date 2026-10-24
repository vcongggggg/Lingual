import json
import random
import sys

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

with open('data/standardized/vocab-bulk.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

random.seed(42)
sample = random.sample(data, 50)
print(f"Total vocabulary pool: {len(data)} words. 50-word random audit:\n")
for idx, r in enumerate(sample, 1):
    ex = f' | Ex: "{r["exampleSentence"]}" -> "{r["exampleTranslation"]}"' if r.get("exampleSentence") else ''
    print(f'{idx:2d}. [{r["cefrLevel"]}] {r["targetText"]} ({r["partOfSpeech"]}): {r["translation"]}{ex}')
