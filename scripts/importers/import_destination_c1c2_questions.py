# -*- coding: utf-8 -*-
r"""
Script: import_destination_c1c2_questions.py
Task ID: lingual-c1c2-questions-import-001
Description: Import Destination C1 & C2 questions & gaps into table `grammar_questions`
             without modifying vocabularies, collocations, or phrasal_verbs.
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
import psycopg2
from psycopg2.extras import execute_batch

sys.stdout.reconfigure(encoding="utf-8")

SOURCE_JSON = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\destination-c1-c2\c1c2-questions.json")
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

GATE1_EXPECTED = {
    "grammar_questions": 15056,
    "vocabularies": 12065,
    "collocations": 919,
    "phrasal_verbs": 200
}

GATE3_EXPECTED = {
    "grammar_questions": 18950,
    "vocabularies": 12065,
    "collocations": 919,
    "phrasal_verbs": 200
}

def parse_int_safe(val, default=1):
    if isinstance(val, int):
        return val
    if isinstance(val, str):
        m = re.search(r'\d+', val)
        if m:
            return int(m.group(0))
    return default

def verify_gate1(cur):
    print("=" * 80)
    print("[GATE 1] KIỂM TRA SỐ LƯỢNG DATABASE TRƯỚC KHI IMPORT C1&C2")
    print("=" * 80)

    counts = {}
    for table in ["grammar_questions", "vocabularies", "collocations", "phrasal_verbs"]:
        cur.execute(f'SELECT count(*) FROM "{table}"')
        counts[table] = cur.fetchone()[0]
        print(f"  {table:20}: {counts[table]} (Kỳ vọng: {GATE1_EXPECTED[table]})")
        if counts[table] != GATE1_EXPECTED[table]:
            raise AssertionError(
                f"[GATE 1 FAIL] Bảng {table} có {counts[table]} bản ghi, khác kỳ vọng {GATE1_EXPECTED[table]}! DỪNG LẠI."
            )

    print("[PASS] Gate 1 toàn bộ thỏa mãn 100%!")
    return counts

def verify_gate3(cur):
    print("\n" + "=" * 80)
    print("[GATE 3] KIỂM TRA SỐ LƯỢNG DATABASE SAU KHI IMPORT C1&C2")
    print("=" * 80)

    counts = {}
    for table in ["grammar_questions", "vocabularies", "collocations", "phrasal_verbs"]:
        cur.execute(f'SELECT count(*) FROM "{table}"')
        counts[table] = cur.fetchone()[0]
        print(f"  {table:20}: {counts[table]} (Kỳ vọng: {GATE3_EXPECTED[table]})")
        if counts[table] != GATE3_EXPECTED[table]:
            raise AssertionError(
                f"[GATE 3 FAIL] Bảng {table} có {counts[table]} bản ghi, khác kỳ vọng {GATE3_EXPECTED[table]}!"
            )

    print("[PASS] Gate 3 toàn bộ thỏa mãn 100%!")
    return counts

def run_import(dry_run=False):
    if not SOURCE_JSON.exists():
        raise FileNotFoundError(f"Không tìm thấy file nguồn: {SOURCE_JSON}")

    with open(SOURCE_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    assert len(data) == 41, f"Kỳ vọng 41 entries, nhận được {len(data)}"

    conn = psycopg2.connect(DSN)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # Step 1: Gate 1 Verification
        base_counts = verify_gate1(cur)

        # Step 2: Prepare rows
        now = datetime.now()
        seen_ids = set()
        insert_rows = []

        total_mapped = 0
        total_gaps = 0

        for idx, e in enumerate(data):
            book = e.get("book", "destination-c1-c2")
            u_val = e.get("unitNumber", idx)
            stype = str(e.get("type", "unit")).lower().replace(" ", "-")
            topic_title = e.get("title", f"Unit {u_val}")
            skill_focus = "grammar" if "grammar" in stype else ("vocabulary" if "vocab" in stype else "grammar")
            cefr_level = "C1"

            for q_idx, q in enumerate(e.get("questions", [])):
                sub = str(q.get("subsection", "main")).replace(" ", "-").replace("/", "-")
                it_val = q.get("itemNumber", "1")
                it_str = str(it_val)
                it_int = parse_int_safe(it_val, q_idx + 1)

                base_qid = f"{book}-{stype}-u{u_val}-{sub}-q{it_str}"
                qid = base_qid
                dup_idx = 2
                while qid in seen_ids:
                    qid = f"{base_qid}_{dup_idx}"
                    dup_idx += 1
                seen_ids.add(qid)

                q_text = (q.get("question") or "").strip()
                options_json = json.dumps(q.get("options", []), ensure_ascii=False)
                correct_ans = q.get("correctAnswer")
                if correct_ans is not None:
                    correct_ans = str(correct_ans).strip()
                    total_mapped += 1
                else:
                    total_gaps += 1

                q_type = q.get("type", "fill-in")
                source_ref = q.get("sourceRef")
                gap_reason = q.get("gapReason")
                derived_flag = bool(q.get("derived", False))
                key_typo = q.get("keyTypo")
                weak_match_flag = bool(q.get("weakMatch", False))

                insert_rows.append((
                    qid, q_text, options_json, correct_ans, None,
                    cefr_level, topic_title, None, skill_focus,
                    book, True, now, None,
                    it_int, q_type, source_ref, gap_reason,
                    derived_flag, key_typo, weak_match_flag
                ))

        print(f"\nChuẩn bị tổng cộng: {len(insert_rows)} câu hỏi ({total_mapped} mapped + {total_gaps} gaps)")
        assert len(insert_rows) == 3894, f"Kỳ vọng 3894 câu hỏi, có {len(insert_rows)}"
        assert total_mapped == 3600, f"Kỳ vọng 3600 mapped questions, có {total_mapped}"
        assert total_gaps == 294, f"Kỳ vọng 294 gaps, có {total_gaps}"

        # Step 3: Duplicate Guard
        all_ids = [r[0] for r in insert_rows]
        cur.execute('SELECT id FROM "grammar_questions" WHERE id = ANY(%s)', (all_ids,))
        existing_ids = set(r[0] for r in cur.fetchall())
        print(f"Duplicate guard: Phát hiện {len(existing_ids)} câu đã tồn tại trong DB.")

        rows_to_insert = [r for r in insert_rows if r[0] not in existing_ids]
        print(f"Số câu mới cần chèn: {len(rows_to_insert)}")

        # Step 4: Execute Insertion
        if rows_to_insert:
            sql = """
                INSERT INTO grammar_questions (
                    id, question, "optionsJson", "correctAnswer", "explanationVi",
                    "cefrLevel", topic, "topicVi", "skillFocus",
                    source, verified, "createdAt", "imageRef",
                    "questionNumber", type, "sourceRef", "gapReason",
                    derived, "keyTypo", "weakMatch"
                ) VALUES (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s
                )
            """
            execute_batch(cur, sql, rows_to_insert, page_size=1000)

        # Step 5: Gate 3 Verification
        post_counts = verify_gate3(cur)

        # Step 6: Spot Checks
        print("\n" + "=" * 80)
        print("[SPOT-CHECKS] TRÍCH XUẤT TRỰC TIẾP TỪ DATABASE")
        print("=" * 80)

        # 6.1 Unit 1 Exercise A
        cur.execute("""
            SELECT id, question, "correctAnswer", "sourceRef"
            FROM "grammar_questions"
            WHERE id = 'destination-c1-c2-grammar-u1-A-q1'
        """)
        sp_u1 = cur.fetchone()
        print("1. Unit 1 Exercise A (destination-c1-c2-grammar-u1-A-q1):")
        print(f"   question:      {sp_u1[1]}")
        print(f"   correctAnswer: {sp_u1[2]}")
        print(f"   sourceRef:     {sp_u1[3]}")

        # 6.2 Gap question (correctAnswer null + gapReason)
        cur.execute("""
            SELECT id, question, "correctAnswer", "gapReason", "sourceRef"
            FROM "grammar_questions"
            WHERE id = 'destination-c1-c2-vocabulary-u2-F-q10'
        """)
        sp_gap = cur.fetchone()
        print("\n2. Gap question (destination-c1-c2-vocabulary-u2-F-q10):")
        print(f"   question:      {sp_gap[1]}")
        print(f"   correctAnswer: {sp_gap[2]}")
        print(f"   gapReason:     {sp_gap[3]}")
        print(f"   sourceRef:     {sp_gap[4]}")

        # 6.3 Review question
        cur.execute("""
            SELECT id, question, "correctAnswer", "sourceRef"
            FROM "grammar_questions"
            WHERE id = 'destination-c1-c2-review-u1-A-q1'
        """)
        sp_rev = cur.fetchone()
        print("\n3. Review question (destination-c1-c2-review-u1-A-q1):")
        print(f"   question:      {sp_rev[1]}")
        print(f"   correctAnswer: {sp_rev[2]}")
        print(f"   sourceRef:     {sp_rev[3]}")

        if dry_run:
            conn.rollback()
            print("\n[DRY-RUN] Rollback sạch sẽ.")
        else:
            conn.commit()
            print("\n[SUCCESS] Transaction committed successfully!")

        return {
            "status": "done",
            "pre_counts": base_counts,
            "post_counts": post_counts,
            "inserted_count": len(rows_to_insert),
            "skipped_duplicates": len(existing_ids),
            "spot_checks": {
                "unit1_exA": {
                    "id": sp_u1[0],
                    "question": sp_u1[1],
                    "correctAnswer": sp_u1[2],
                    "sourceRef": sp_u1[3]
                },
                "gap_question": {
                    "id": sp_gap[0],
                    "question": sp_gap[1],
                    "correctAnswer": sp_gap[2],
                    "gapReason": sp_gap[3],
                    "sourceRef": sp_gap[4]
                },
                "review_question": {
                    "id": sp_rev[0],
                    "question": sp_rev[1],
                    "correctAnswer": sp_rev[2],
                    "sourceRef": sp_rev[3]
                }
            }
        }

    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        raise e

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Destination C1&C2 questions into DB")
    parser.add_argument("--dry-run", action="store_true", help="Dry run without commit")
    args = parser.parse_args()

    run_import(dry_run=args.dry_run)
