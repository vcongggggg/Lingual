import psycopg2
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = psycopg2.connect('postgresql://postgres:HIgb8WOzsluowBEjq5BA_BNtuEIy6bbk@localhost:5432/linguaflow_db')
cur = conn.cursor()
cur.execute('SELECT id, idiom, "meaningVi" FROM idioms')
existing = cur.fetchall()

def normalize_text(text):
    text = text.lower().strip()
    text = re.sub(r'\s+', ' ', text)
    return text

existing_map = {normalize_text(row[1]): (row[0], row[1], row[2]) for row in existing}
print(f'Total existing idioms in DB: {len(existing)}')

duplicates = []
unique_new = []

with open(r'C:\Mod\muse-data-exchange\results\idioms-002.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        d = json.loads(line)
        norm = normalize_text(d['idiom'])
        if norm in existing_map:
            duplicates.append((d['idiom'], existing_map[norm]))
        else:
            unique_new.append(d)

print(f'Number of duplicates with existing dataset: {len(duplicates)}')
print(f'Number of new unique idioms to import: {len(unique_new)}')
print(f'Total after import will be: {len(existing) + len(unique_new)}')

print('\nDetailed list of duplicates:')
for new_idiom, (ex_id, ex_idiom, ex_meaning) in duplicates:
    print(f'  - "{new_idiom}" matches existing id={ex_id} ("{ex_idiom}")')

cur.close()
conn.close()
