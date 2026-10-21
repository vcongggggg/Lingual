import json
import os
import re
import sys
import psycopg2

sys.stdout.reconfigure(encoding='utf-8')

try:
    from db_helper import get_database_url
except ImportError:
    from scripts.db_helper import get_database_url

GRAMMAR_FILE = r'C:\Mod\muse-data-exchange\results\grammar-002.jsonl'

def normalize(text):
    if not text:
        return ''
    text = text.lower().strip()
    return re.sub(r'\s+', ' ', text)

def main():
    print('=== [AUDIT GRAMMAR QUESTIONS: gen-data-grammar-002] ===')
    
    # 1. Inspect existing DB
    conn = psycopg2.connect(get_database_url())
    cur = conn.cursor()
    cur.execute('SELECT COUNT(*) FROM grammar_questions')
    existing_count = cur.fetchone()[0]
    print(f'[1] So cau grammar hien co trong DB: {existing_count}')
    
    cur.execute('SELECT id, question, "correctAnswer", "cefrLevel", topic, source FROM grammar_questions ORDER BY id LIMIT 3')
    print('    Sample existing rows:')
    for r in cur.fetchall():
        print('    ', r)
        
    cur.execute('SELECT id FROM grammar_questions ORDER BY id DESC LIMIT 5')
    last_ids = cur.fetchall()
    print('    Last 5 IDs:', last_ids)
    
    cur.execute('SELECT id, question FROM grammar_questions')
    existing_rows = cur.fetchall()
    existing_questions = {normalize(r[1]): r[0] for r in existing_rows}
    
    cur.close()
    conn.close()
    
    # 2. Inspect grammar-002.jsonl
    print(f'\n[2] Doc file: {GRAMMAR_FILE}')
    all_records = []
    g_tag_records = []
    valid_candidates = []
    
    with open(GRAMMAR_FILE, 'r', encoding='utf-8') as f:
        for line_no, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            item = json.loads(line)
            all_records.append(item)
            
            expl = item.get('explanation_vi', '') or ''
            if expl.startswith('[G-TAG]'):
                g_tag_records.append(item)
            else:
                valid_candidates.append(item)
                
    print(f'    Tong so ban ghi doc duoc: {len(all_records)}')
    print(f'    So ban ghi G-TAG (giu lai, KHONG import): {len(g_tag_records)}')
    print(f'    So ban ghi phan (b) xem xet import: {len(valid_candidates)}')
    
    # 3. Dedupe phan (b)
    internal_dups = 0
    db_dups = 0
    seen_questions = set()
    to_import = []
    
    for r in valid_candidates:
        q_norm = normalize(r.get('question', ''))
        if q_norm in existing_questions:
            db_dups += 1
            continue
        if q_norm in seen_questions:
            internal_dups += 1
            continue
        seen_questions.add(q_norm)
        to_import.append(r)
        
    print(f'\n[3] Ket qua Dedupe phan (b):')
    print(f'    - Trung lap voi DB hien co: {db_dups}')
    print(f'    - Trung lap noi bo trong phan (b): {internal_dups}')
    print(f'    - Tong bi loai do trung: {db_dups + internal_dups}')
    print(f'    - Ty le bi loai: {((db_dups + internal_dups) / len(valid_candidates) * 100):.2f}% (Yeu cau DoD: <1%)')
    print(f'    - So ban ghi hop le se import: {len(to_import)}')
    print(f'    - Du kien tong grammar_questions sau import: {existing_count + len(to_import)}')

    # 4. Check topics and levels in to_import
    topics = set(r.get('topic') for r in to_import)
    levels = set(r.get('level') for r in to_import)
    print(f'\n[4] Phan bo du lieu se import:')
    print(f'    - Cac cap do (levels): {sorted(list(levels))}')
    print(f'    - So luong chu de (topics): {len(topics)}')
    print(f'    - Sample topics: {sorted(list(topics))[:10]}')

if __name__ == '__main__':
    main()
