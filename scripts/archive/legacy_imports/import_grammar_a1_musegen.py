"""
Import 50 A1 GrammarQuestions from MuseGen (results/grammar-a1-001.json) into grammar_questions table.
Task ID: lingual-import-grammar-a1-001

Steps:
1. Validate schema (7 fields, optionsJson length 4, correctAnswer in optionsJson, cefrLevel='A1').
2. Dedupe against existing DB records (normalize: lowercase, strip, collapse whitespace).
   Skip matching stems and log skipped indices.
3. Guard early-exit: check if import_id ('gen-data-grammar-a1-001') already exists in DB.
4. Insert unique questions with source='gen-data-grammar-a1-001'.
5. Verify DB counts: cefrLevel='A1' increases by exact number of inserted questions (50 - duplicates).
"""

import sys
import json
import re
import datetime
import psycopg2
from psycopg2.extras import execute_batch
from pathlib import Path

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

IMPORT_ID = 'gen-data-grammar-a1-001'
DATA_FILE = Path(r'C:\Mod\muse-data-exchange\results\grammar-a1-001.json')

# DB Connection
DSN = 'postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db'

def normalize_stem(text: str) -> str:
    if not text:
        return ''
    text = text.lower().strip()
    return re.sub(r'\s+', ' ', text)

def run_import():
    print(f"=== [IMPORT GRAMMAR A1: {IMPORT_ID}] ===")
    
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Input file not found: {DATA_FILE}")
        
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        raw_items = json.load(f)
    print(f"[1] Đã đọc {len(raw_items)} câu hỏi từ {DATA_FILE}")

    # Step 1: Validate Schema
    required_fields = ['question', 'optionsJson', 'correctAnswer', 'explanationVi', 'cefrLevel', 'topic', 'topicVi']
    for idx, it in enumerate(raw_items):
        for fld in required_fields:
            if fld not in it or it[fld] is None:
                raise ValueError(f"Câu index {idx} thiếu trường bắt buộc: {fld}")
        opts = it['optionsJson']
        if not isinstance(opts, list) or len(opts) != 4:
            raise ValueError(f"Câu index {idx} optionsJson không phải mảng 4 phần tử: {opts}")
        ans = it['correctAnswer']
        if ans not in opts:
            raise ValueError(f"Câu index {idx} correctAnswer '{ans}' không nằm trong options: {opts}")
        if it['cefrLevel'] != 'A1':
            raise ValueError(f"Câu index {idx} cefrLevel không phải A1: {it['cefrLevel']}")
    print("    -> Kiểm tra Schema: PASS 100% (7 trường, options=4, đáp án thuộc options, level=A1).")

    conn = psycopg2.connect(DSN)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # Step 3 (Early check): Guard early-exit if already imported
        cur.execute('SELECT COUNT(1) FROM grammar_questions WHERE source = %s', (IMPORT_ID,))
        existing_imported = cur.fetchone()[0]
        if existing_imported > 0:
            print(f"[GUARD EARLY-EXIT] Đã phát hiện {existing_imported} bản ghi với import_id='{IMPORT_ID}' trong DB.")
            print("Hệ thống dừng lại, không thực hiện insert lần 2 (already imported).")
            conn.rollback()
            return {
                "status": "already_imported",
                "count": existing_imported,
                "inserted": 0,
                "skipped_indices": []
            }

        # Check pre-import A1 count and total count
        cur.execute('SELECT COUNT(1) FROM grammar_questions WHERE "cefrLevel" = \'A1\'')
        initial_a1_count = cur.fetchone()[0]
        cur.execute('SELECT COUNT(1) FROM grammar_questions')
        initial_total_count = cur.fetchone()[0]
        print(f"[2] Trạng thái DB trước import:")
        print(f"    - Tổng số câu Grammar: {initial_total_count}")
        print(f"    - Tổng số câu Grammar A1: {initial_a1_count} (20 câu P0 ban đầu)")

        # Step 2: Dedupe against all existing grammar questions
        cur.execute('SELECT id, question, "cefrLevel" FROM grammar_questions')
        existing_rows = cur.fetchall()
        existing_stem_map = {}
        for q_id, q_text, lvl in existing_rows:
            norm = normalize_stem(q_text)
            existing_stem_map[norm] = (q_id, lvl, q_text)

        to_insert = []
        skipped_items = []
        seen_in_batch = set()

        for idx, it in enumerate(raw_items):
            norm = normalize_stem(it['question'])
            if norm in existing_stem_map:
                ex_id, ex_lvl, ex_text = existing_stem_map[norm]
                skipped_items.append({
                    "index": idx,
                    "question": it['question'],
                    "reason": f"Trùng câu hỏi đã có trong DB (ID={ex_id}, level={ex_lvl})"
                })
            elif norm in seen_in_batch:
                skipped_items.append({
                    "index": idx,
                    "question": it['question'],
                    "reason": "Trùng lặp nội bộ trong cùng batch"
                })
            else:
                seen_in_batch.add(norm)
                to_insert.append((idx, it))

        print(f"[3] Kết quả Dedupe:")
        print(f"    - Số câu trùng bị BỎ QUA: {len(skipped_items)}")
        for sk in skipped_items:
            print(f"      * Index {sk['index']}: '{sk['question']}' ({sk['reason']})")
        print(f"    - Số câu hợp lệ sẽ INSERT: {len(to_insert)}")

        # Step 3: Insert unique questions
        now_ts = datetime.datetime.now(datetime.timezone.utc)
        insert_rows = []
        for seq, (orig_idx, it) in enumerate(to_insert):
            q_id = f"gq-gen-a1-{orig_idx + 1:03d}"
            question = it['question'].strip()
            options_json = json.dumps(it['optionsJson'], ensure_ascii=False)
            correct_answer = it['correctAnswer'].strip()
            explanation_vi = it['explanationVi'].strip() if it.get('explanationVi') else None
            cefr_level = 'A1'
            topic = it.get('topic', '').strip() or None
            topic_vi = it.get('topicVi', '').strip() or None
            skill_focus = 'grammar'
            source = IMPORT_ID
            verified = True

            insert_rows.append((
                q_id, question, options_json, correct_answer,
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
        conn.commit()
        print(f"[4] Đã thực hiện INSERT thành công {len(insert_rows)} bản ghi vào DB.")

        # Step 4: Verification of post-import counts
        cur.execute('SELECT COUNT(1) FROM grammar_questions WHERE "cefrLevel" = \'A1\'')
        final_a1_count = cur.fetchone()[0]
        cur.execute('SELECT COUNT(1) FROM grammar_questions')
        final_total_count = cur.fetchone()[0]
        cur.execute('SELECT COUNT(1) FROM grammar_questions WHERE source = %s', (IMPORT_ID,))
        imported_count = cur.fetchone()[0]

        expected_final_a1 = initial_a1_count + len(insert_rows)
        print(f"[5] Kiểm đếm đối soát sau import:")
        print(f"    - Tổng số câu Grammar A1 sau import: {final_a1_count} (Kỳ vọng: {expected_final_a1})")
        print(f"    - Số bản ghi có source='{IMPORT_ID}': {imported_count} (Kỳ vọng: {len(insert_rows)})")
        print(f"    - Tổng số câu Grammar toàn DB: {final_total_count}")

        if final_a1_count != expected_final_a1:
            raise RuntimeError(f"Lỗi kiểm đếm: A1 count {final_a1_count} khác kỳ vọng {expected_final_a1}")
        if imported_count != len(insert_rows):
            raise RuntimeError(f"Lỗi kiểm đếm: imported count {imported_count} khác {len(insert_rows)}")

        print("\n=> IMPORT HOÀN THÀNH XUẤT SẮC: PASS 100%!")
        return {
            "status": "success",
            "initial_a1": initial_a1_count,
            "final_a1": final_a1_count,
            "inserted_count": len(insert_rows),
            "skipped_count": len(skipped_items),
            "skipped_indices": [sk["index"] for sk in skipped_items],
            "skipped_details": skipped_items
        }
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    run_import()
