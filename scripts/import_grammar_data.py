import json
import os
import re
import sys
import datetime
import random
import psycopg2
from psycopg2.extras import execute_batch

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
    print('=== [EXECUTE IMPORT: gen-data-grammar-002] ===')
    start_time = datetime.datetime.now()
    
    # 1. Ket noi DB va doc du lieu hien tai
    conn = psycopg2.connect(get_database_url())
    conn.autocommit = False
    cur = conn.cursor()
    
    try:
        cur.execute('SELECT COUNT(*) FROM grammar_questions')
        existing_count = cur.fetchone()[0]
        print(f'[1] So cau grammar hien co trong DB: {existing_count} (Ky vong: 1000)')
        
        cur.execute('SELECT id, question FROM grammar_questions')
        existing_rows = cur.fetchall()
        existing_questions = {normalize(r[1]): r[0] for r in existing_rows}
        existing_ids = set(r[0] for r in existing_rows)
        
        # 2. Doc file grammar-002.jsonl
        print(f'\n[2] Doc file: {GRAMMAR_FILE}')
        all_records = []
        g_tag_records = []
        part_b_records = []
        
        with open(GRAMMAR_FILE, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                item = json.loads(line)
                all_records.append(item)
                
                expl = item.get('explanation_vi', '') or ''
                if expl.startswith('[G-TAG]'):
                    g_tag_records.append(item)
                else:
                    part_b_records.append(item)
                    
        total_read = len(all_records)
        g_tag_count = len(g_tag_records)
        part_b_count = len(part_b_records)
        
        print(f'    - Tong so ban ghi doc: {total_read} (Ky vong: 3041)')
        print(f'    - So ban ghi G-TAG giu lai, KHONG import: {g_tag_count} (Ky vong: 30)')
        print(f'    - So ban ghi phan (b) dua vao xet import: {part_b_count} (Ky vong: 3011)')
        
        # 3. Dedupe phan (b) voi 1000 cau grammar hien co
        print(f'\n[3] Tien hanh dedupe phan (b) voi 1000 cau grammar hien co trong DB...')
        to_import = []
        dropped_db_dups = []
        
        for r in part_b_records:
            q_norm = normalize(r.get('question', ''))
            if q_norm in existing_questions:
                dropped_db_dups.append((r.get('question'), existing_questions[q_norm]))
            else:
                to_import.append(r)
                
        dedupe_dropped_count = len(dropped_db_dups)
        import_count = len(to_import)
        dedupe_rate_pct = round((dedupe_dropped_count / part_b_count) * 100, 3)
        
        print(f'    - So ban ghi bi loai do trung lap voi DB: {dedupe_dropped_count}')
        print(f'    - Ty le dedupe tren phan (b): {dedupe_rate_pct}% (DoD: <1.0%) -> {"PASS" if dedupe_rate_pct < 1.0 else "FAIL"}')
        print(f'    - So ban ghi hop le se import: {import_count} (3011 - {dedupe_dropped_count} = {import_count})')
        print(f'    - Tong grammar du kien sau import: {existing_count + import_count}')
        
        # 4. Chuan bi batch insert vao grammar_questions
        print(f'\n[4] Dang nap {import_count} ban ghi vao bang grammar_questions...')
        insert_rows = []
        now_ts = datetime.datetime.now(datetime.timezone.utc)
        
        for idx, r in enumerate(to_import):
            gq_id = f'gq-{existing_count + idx + 1}'
            question = r['question'].strip()
            options_json = json.dumps(r['options'], ensure_ascii=False)
            correct_answer = r['answer'].strip()
            explanation_vi = r.get('explanation_vi', '').strip() or None
            cefr_level = r.get('level', 'A2').strip().upper()
            topic = r.get('topic', 'grammar').strip()
            topic_vi = r.get('topic', 'Ngữ pháp').strip()
            skill_focus = 'grammar'
            source = r.get('source', 'corpus-derived').strip()
            verified = False
            
            insert_rows.append((
                gq_id, question, options_json, correct_answer,
                explanation_vi, cefr_level, topic, topic_vi,
                skill_focus, source, verified, now_ts
            ))
            
        insert_sql = '''
            INSERT INTO grammar_questions (
                id, question, "optionsJson", "correctAnswer",
                "explanationVi", "cefrLevel", topic, "topicVi",
                "skillFocus", source, verified, "createdAt"
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        execute_batch(cur, insert_sql, insert_rows, page_size=1000)
        print(f'    Batch insert thanh cong {len(insert_rows)} ban ghi!')
        
        # 5. Kiem tra toan dien sau import (DoD verification)
        cur.execute('SELECT COUNT(*) FROM grammar_questions')
        final_total = cur.fetchone()[0]
        
        # Kiem tra G-TAG trong DB
        cur.execute("SELECT COUNT(*) FROM grammar_questions WHERE \"explanationVi\" LIKE '[G-TAG]%'")
        gtag_in_db = cur.fetchone()[0]
        
        # Kiem tra 1000 ban ghi cu con nguyen
        cur.execute('SELECT id FROM grammar_questions WHERE id = ANY(%s)', (list(existing_ids),))
        old_preserved = len(cur.fetchall())
        
        # Kiem tra ban ghi moi
        cur.execute('SELECT COUNT(*) FROM grammar_questions WHERE source = \'corpus-derived\'')
        corpus_derived_count = cur.fetchone()[0]
        
        print(f'\n[5] Ket qua nghiem thu sau import (DoD):')
        print(f'    - Tong so grammar_questions: {final_total} (Ky vong: {existing_count + import_count}) -> {"PASS" if final_total == existing_count + import_count else "FAIL"}')
        print(f'    - So ban ghi G-TAG trong DB: {gtag_in_db} (DoD bat buoc = 0) -> {"PASS" if gtag_in_db == 0 else "FAIL"}')
        print(f'    - So ban ghi cu giu nguyen: {old_preserved}/{existing_count} -> {"PASS" if old_preserved == existing_count else "FAIL"}')
        print(f'    - So ban ghi moi nguon corpus-derived: {corpus_derived_count}/{import_count}')
        
        # 6. Lay mau 5 cau moi import thuoc cac chu de khac nhau de verify
        cur.execute('''
            SELECT id, question, "optionsJson", "correctAnswer", "explanationVi", "cefrLevel", topic
            FROM grammar_questions
            WHERE source = 'corpus-derived'
            ORDER BY RANDOM()
            LIMIT 5
        ''')
        sample_rows = cur.fetchall()
        print(f'\n[6] Mau 5 cau grammar moi import ngau nhien:')
        for s in sample_rows:
            print(f'    - ID: {s[0]} | Level: {s[5]} | Topic: {s[6]}')
            print(f'      Question: {s[1]}')
            print(f'      Options: {s[2]}')
            print(f'      Answer: {s[3]}')
            print(f'      Explanation: {s[4]}\n')
            
        conn.commit()
        print('>>> TRANSACTION COMMIT THANH CONG! <<<')
        
        elapsed = (datetime.datetime.now() - start_time).total_seconds()
        print(f'Thoi gian thuc hien: {elapsed:.2f}s')
        
        return {
            'total_read': total_read,
            'g_tag_held': g_tag_count,
            'part_b_count': part_b_count,
            'dedupe_dropped': dedupe_dropped_count,
            'dedupe_rate_pct': dedupe_rate_pct,
            'imported_count': import_count,
            'initial_grammar_count': existing_count,
            'final_grammar_count': final_total,
            'gtag_in_db': gtag_in_db,
            'old_preserved': old_preserved == existing_count,
            'samples': [
                {
                    'id': s[0],
                    'question': s[1],
                    'options': json.loads(s[2]),
                    'answer': s[3],
                    'explanation': s[4],
                    'level': s[5],
                    'topic': s[6]
                }
                for s in sample_rows
            ]
        }
        
    except Exception as e:
        conn.rollback()
        print(f'[ERROR] Rollback xay ra: {e}')
        raise e
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    main()
