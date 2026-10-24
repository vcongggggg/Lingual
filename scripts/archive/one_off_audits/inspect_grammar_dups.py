import json
import sys
import re
from collections import Counter, defaultdict

sys.stdout.reconfigure(encoding='utf-8')

GRAMMAR_FILE = r'C:\Mod\muse-data-exchange\results\grammar-002.jsonl'

def normalize(text):
    if not text:
        return ''
    return re.sub(r'\s+', ' ', text.lower().strip())

with open(GRAMMAR_FILE, 'r', encoding='utf-8') as f:
    items = [json.loads(line) for line in f if not json.loads(line).get('explanation_vi', '').startswith('[G-TAG]')]

q_groups = defaultdict(list)
for it in items:
    q_groups[normalize(it['question'])].append(it)

multi = {q: l for q, l in q_groups.items() if len(l) > 1}
print(f'Total non-tag items: {len(items)}')
print(f'Unique question texts: {len(q_groups)}')
print(f'Questions with multiple records: {len(multi)}')

sample_count = 0
for q, group in multi.items():
    if sample_count >= 5:
        break
    print(f'\n--- Question: "{q}" ({len(group)} records) ---')
    for g in group:
        print(f'  Answer: {g.get("answer")} | Options: {g.get("options")} | Topic: {g.get("topic")} | Explanation: {g.get("explanation_vi")[:50]}...')
    sample_count += 1
