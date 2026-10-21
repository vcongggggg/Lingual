import json
import re
import sys
import psycopg2

sys.stdout.reconfigure(encoding='utf-8')

try:
    from db_helper import get_database_url
except ImportError:
    from scripts.db_helper import get_database_url

TAGFIX_FILE = r'C:\Mod\muse-data-exchange\results\grammar-002-tagfix.jsonl'

def normalize(text):
    if not text:
        return ''
    text = text.lower().strip()
    return re.sub(r'\s+', ' ', text)

def main():
    print('=== [AUDIT TAGFIX: grammar-002-tagfix.jsonl] ===')
    
    # 1. DB questions
    conn = psycopg2.connect(get_database_url())
    cur = conn.cursor()
    cur.execute('SELECT COUNT(*) FROM grammar_questions')
    existing_count = cur.fetchone()[0]
    print(f'[1] So cau grammar hien tai trong DB: {existing_count} (Ky vong: 3984)')
    
    cur.execute('SELECT id, question FROM grammar_questions')
    db_questions = {normalize(r[1]): r[0] for r in cur.fetchall()}
    cur.close()
    conn.close()
    
    # 2. Doc file tagfix
    with open(TAGFIX_FILE, 'r', encoding='utf-8') as f:
        records = [json.loads(line) for line in f if line.strip()]
        
    print(f'[2] So ban ghi doc tu tagfix: {len(records)} (Ky vong: 30)')
    
    # 3. Dedupe check
    duplicates = []
    unique_records = []
    
    for r in records:
        q_norm = normalize(r.get('question', ''))
        if q_norm in db_questions:
            duplicates.append((r.get('question'), db_questions[q_norm]))
        else:
            unique_records.append(r)
            
    print(f'[3] Ket qua Dedupe vs DB:')
    print(f'    - Trung lap: {len(duplicates)}')
    for d, ex_id in duplicates:
        print(f'      * "{d}" matches {ex_id}')
    print(f'    - Hop le can import: {len(unique_records)}')
    print(f'    - Tong sau import du kien: {existing_count + len(unique_records)}')

if __name__ == '__main__':
    main()
