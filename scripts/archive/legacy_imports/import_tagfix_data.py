import json
import os
import re
import sys
import datetime
import psycopg2
from psycopg2.extras import execute_batch

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
    print('=== [EXECUTE IMPORT: grammar-002-tagfix.jsonl] ===')
    start_time = datetime.datetime.now()
    
    # 1. Ket noi DB va kiem tra trang thai hien tai
    conn = psycopg2.connect(get_database_url())
    conn.autocommit = False
    cur = conn.cursor()
    
    try:
        cur.execute('SELECT COUNT(*) FROM grammar_questions')
        initial_count = cur.fetchone()[0]
        print(f'[1] So cau grammar hien tai trong DB: {initial_count} (Ky vong: 3984)')
        
        cur.execute('SELECT id, question FROM grammar_questions')
        existing_rows = cur.fetchall()
        existing_questions = {normalize(r[1]): r[0] for r in existing_rows}
        
        # 2. Doc file grammar-002-tagfix.jsonl
        print(f'\n[2] Doc file: {TAGFIX_FILE}')
        with open(TAGFIX_FILE, 'r', encoding='utf-8') as f:
            records = [json.loads(line) for line in f if line.strip()]
        total_read = len(records)
        print(f'    - Tong so ban ghi doc: {total_read} (Ky vong: 30)')
        
        # 3. Dedupe voi DB hien tai
        print(f'\n[3] Dedupe voi DB hien tai theo question chuan hoa...')
        to_insert = []
        updated_dups = []
        
        for r in records:
            q_norm = normalize(r.get('question', ''))
            if q_norm in existing_questions:
                ex_id = existing_questions[q_norm]
                updated_dups.append((r, ex_id))
            else:
                to_insert.append(r)
                
        dedupe_dropped = len(updated_dups)
        import_count = len(to_insert)
        print(f'    - So ban ghi trung lap duoc dedupe: {dedupe_dropped}')
        for r, ex_id in updated_dups:
            print(f'      * "{r.get("question")}" trung voi existing ID={ex_id}')
        print(f'    - So ban ghi moi duoc insert: {import_count}')
        print(f'    - Tong so grammar sau import: {initial_count + import_count} (Ky vong: 4014 tru dedupe = {4014 - dedupe_dropped})')
        
        # 4. Cap nhat ban ghi trung lap voi explanationVi chuan G-TAG (de DB co du 30 G-TAG)
        now_ts = datetime.datetime.now(datetime.timezone.utc)
        for r, ex_id in updated_dups:
            cur.execute('''
                UPDATE grammar_questions
                SET "explanationVi" = %s,
                    "optionsJson" = %s,
                    "correctAnswer" = %s,
                    topic = %s,
                    "topicVi" = %s
                WHERE id = %s
            ''', (
                r.get('explanation_vi', '').strip(),
                json.dumps(r['options'], ensure_ascii=False),
                r['answer'].strip(),
                r.get('topic', 'Câu hỏi đuôi'),
                r.get('topic', 'Câu hỏi đuôi'),
                ex_id
            ))
            print(f'    - Da cap nhat {ex_id} thanh cong voi tag [G-TAG].')
            
        # 5. Insert cac ban ghi moi
        print(f'\n[4] Dang insert {import_count} ban ghi tag question moi vao grammar_questions...')
        insert_rows = []
        for idx, r in enumerate(to_insert):
            gq_id = f'gq-{initial_count + idx + 1}'
            question = r['question'].strip()
            options_json = json.dumps(r['options'], ensure_ascii=False)
            correct_answer = r['answer'].strip()
            explanation_vi = r.get('explanation_vi', '').strip() or None
            cefr_level = r.get('level', 'A2').strip().upper()
            topic = r.get('topic', 'Câu hỏi đuôi').strip()
            topic_vi = r.get('topic', 'Câu hỏi đuôi').strip()
            skill_focus = 'grammar'
            source = r.get('source', 'authored').strip()
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
        execute_batch(cur, insert_sql, insert_rows, page_size=100)
        print(f'    Insert thanh cong {len(insert_rows)} ban ghi!')
        
        # 6. Verify DoD
        cur.execute('SELECT COUNT(*) FROM grammar_questions')
        final_total = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM grammar_questions WHERE \"explanationVi\" LIKE '[G-TAG]%'")
        gtag_total = cur.fetchone()[0]
        
        print(f'\n[5] Ket qua kiem tra sau import (DoD):')
        print(f'    - Tong grammar: {final_total} (DoD: 4014 tru dedupe = {4014 - dedupe_dropped}) -> {"PASS" if final_total == 4014 - dedupe_dropped else "FAIL"}')
        print(f'    - So luong [G-TAG] trong DB: {gtag_total} (DoD bat buoc: 30) -> {"PASS" if gtag_total == 30 else "FAIL"}')
        
        # 7. Mau 3 cau G-TAG de kiem tra
        cur.execute('''
            SELECT id, question, "optionsJson", "correctAnswer", "explanationVi", "cefrLevel"
            FROM grammar_questions
            WHERE "explanationVi" LIKE '[G-TAG]%'
            ORDER BY id
            LIMIT 3
        ''')
        print(f'\n[6] Mau 3 cau G-TAG trong DB:')
        for s in cur.fetchall():
            print(f'    - ID: {s[0]} | Level: {s[5]}')
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
            'dedupe_dropped': dedupe_dropped,
            'imported_new': import_count,
            'initial_grammar_count': initial_count,
            'final_grammar_count': final_total,
            'gtag_total': gtag_total,
            'elapsed_sec': elapsed
        }
        
    except Exception as e:
        conn.rollback()
        print(f'[ERROR] Rollback: {e}')
        raise e
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    main()
