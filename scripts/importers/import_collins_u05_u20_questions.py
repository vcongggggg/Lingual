# -*- coding: utf-8 -*-
r"""
Script: import_collins_u05_u20_questions.py
Task ID: lingual-collins-questions-import-001
Description: Import Collins Vocabulary for IELTS Units 5-20 questions & gaps
             into PostgreSQL table `lexis_questions` without modifying vocabularies.
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

SOURCE_JSON = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\lexis\collins-u05-u20-questions.json")
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

GATE1_EXPECTED = {
    "lexis_questions": 2961,
    "vocabularies": 12065,
    "collocations": 919,
    "phrasal_verbs": 200
}

GATE3_EXPECTED = {
    "lexis_questions": 3431,
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
    print("[GATE 1] KIỂM TRA SỐ LƯỢNG DATABASE TRƯỚC KHI IMPORT")
    print("=" * 80)

    counts = {}
    for table in ["lexis_questions", "vocabularies", "collocations", "phrasal_verbs"]:
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
    print("[GATE 3] KIỂM TRA SỐ LƯỢNG DATABASE SAU KHI IMPORT")
    print("=" * 80)

    counts = {}
    for table in ["lexis_questions", "vocabularies", "collocations", "phrasal_verbs"]:
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

    units = data.get("units", [])
    assert len(units) == 16, f"Kỳ vọng 16 units, nhận được {len(units)}"

    conn = psycopg2.connect(DSN)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # Step 1: Gate 1 Verification
        base_counts = verify_gate1(cur)

        # Step 2: Prepare rows
        now = datetime.now()
        mapped_rows = []
        gap_rows = []

        for u in units:
            unit_val = u.get("unitNumber", 0)
            unit_str = f"u{unit_val:02d}"
            topic_title = u.get("title", f"Unit {unit_val}")

            # 2.1 Mapped questions
            for q in u.get("questions", []):
                sub = str(q.get("subsection", "main")).replace(" ", "-").replace("/", "-")
                it_val = q.get("itemNumber", 1)
                it_int = parse_int_safe(it_val, 1)
                qid = f"lexq-collins-{unit_str}-{sub}-q{it_val}"

                prompt_text = (q.get("question") or "").strip()
                options_val = q.get("options")
                options_json = json.dumps(options_val, ensure_ascii=False) if options_val is not None else None
                correct_ans = q.get("correctAnswer")
                if correct_ans is not None:
                    correct_ans = str(correct_ans).strip()

                q_type = q.get("type")
                source_ref = q.get("sourceRef") or f"Collins Vocabulary for IELTS, Unit {unit_val}"
                note_text = q.get("note")

                mapped_rows.append((
                    qid, "vocabulary", topic_title, None, prompt_text,
                    options_json, correct_ans, None, None, "B2",
                    source_ref, it_int, q_type, None, None, note_text, now
                ))

            # 2.2 Gaps
            sub_counts = {}
            for g in u.get("gaps", []):
                sub = str(g.get("subsection", "gap")).replace(" ", "-").replace("/", "-")
                sub_counts[sub] = sub_counts.get(sub, 0) + 1
                it_val = g.get("itemNumber", sub_counts[sub])
                it_int = parse_int_safe(it_val, 1)
                qid = f"lexq-collins-{unit_str}-{sub}-gap-q{it_val}"

                reason = (g.get("gapReason") or g.get("reason") or "").strip()
                prompt_text = (g.get("question") or g.get("prompt") or reason or f"Gap in {sub}").strip()
                source_ref = g.get("sourceRef") or f"Collins Vocabulary for IELTS, Unit {unit_val}"
                q_type = g.get("type")

                gap_rows.append((
                    qid, "vocabulary", topic_title, None, prompt_text,
                    None, None, None, None, "B2",
                    source_ref, it_int, q_type, reason, None, None, now
                ))

        all_rows = mapped_rows + gap_rows
        print(f"\nChuẩn bị tổng cộng: {len(all_rows)} câu hỏi ({len(mapped_rows)} mapped + {len(gap_rows)} gaps)")
        assert len(mapped_rows) == 466, f"Kỳ vọng 466 mapped questions, có {len(mapped_rows)}"
        assert len(gap_rows) == 4, f"Kỳ vọng 4 gaps, có {len(gap_rows)}"

        # Step 3: Duplicate Guard
        all_ids = [r[0] for r in all_rows]
        cur.execute('SELECT id FROM "lexis_questions" WHERE id = ANY(%s)', (all_ids,))
        existing_ids = set(r[0] for r in cur.fetchall())
        print(f"Duplicate guard: Phát hiện {len(existing_ids)} câu đã tồn tại trong DB.")

        rows_to_insert = [r for r in all_rows if r[0] not in existing_ids]
        print(f"Số câu mới cần chèn: {len(rows_to_insert)}")

        # Step 4: Execute Insertion
        if rows_to_insert:
            sql = """
                INSERT INTO lexis_questions (
                    id, "contentType", topic, "topicVi", prompt,
                    "optionsJson", "correctAnswer", "explanationEn", "explanationVi", "cefrLevel",
                    "sourceRef", "questionNumber", type, "gapReason", "scriptJson", note, "createdAt"
                ) VALUES (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s
                )
            """
            execute_batch(cur, sql, rows_to_insert, page_size=1000)

        # Step 5: Gate 3 Verification
        post_counts = verify_gate3(cur)

        # Step 6: Spot Checks
        print("\n" + "=" * 80)
        print("[SPOT-CHECKS] TRÍCH XUẤT TRỰC TIẾP TỪ DATABASE")
        print("=" * 80)

        # 6.1 Unit 5 question
        cur.execute("""
            SELECT id, topic, prompt, "correctAnswer", "sourceRef"
            FROM "lexis_questions"
            WHERE id = 'lexq-collins-u05-ex1-q1'
        """)
        sp_u5 = cur.fetchone()
        print("1. Unit 5 (lexq-collins-u05-ex1-q1):")
        print(f"   topic:         {sp_u5[1]}")
        print(f"   prompt:        {sp_u5[2]}")
        print(f"   correctAnswer: {sp_u5[3]}")
        print(f"   sourceRef:     {sp_u5[4]}")

        # 6.2 Unit 20 ex9 question
        cur.execute("""
            SELECT id, topic, prompt, "correctAnswer", "sourceRef"
            FROM "lexis_questions"
            WHERE id = 'lexq-collins-u20-ex9-q1'
        """)
        sp_u20 = cur.fetchone()
        print("\n2. Unit 20 ex9 (lexq-collins-u20-ex9-q1):")
        print(f"   topic:         {sp_u20[1]}")
        print(f"   prompt:        {sp_u20[2]}")
        print(f"   correctAnswer: {sp_u20[3]}")
        print(f"   sourceRef:     {sp_u20[4]}")

        # 6.3 Gap question (reason absent)
        cur.execute("""
            SELECT id, topic, prompt, "gapReason", "sourceRef"
            FROM "lexis_questions"
            WHERE id = 'lexq-collins-u20-exam_practice-gap-q1'
        """)
        sp_gap = cur.fetchone()
        print("\n3. Gap (lexq-collins-u20-exam_practice-gap-q1):")
        print(f"   topic:     {sp_gap[1]}")
        print(f"   prompt:    {sp_gap[2]}")
        print(f"   gapReason: {sp_gap[3]}")
        print(f"   sourceRef: {sp_gap[4]}")

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
                "unit5_q1": {
                    "id": sp_u5[0],
                    "topic": sp_u5[1],
                    "prompt": sp_u5[2],
                    "correctAnswer": sp_u5[3],
                    "sourceRef": sp_u5[4]
                },
                "unit20_ex9_q1": {
                    "id": sp_u20[0],
                    "topic": sp_u20[1],
                    "prompt": sp_u20[2],
                    "correctAnswer": sp_u20[3],
                    "sourceRef": sp_u20[4]
                },
                "gap_absent": {
                    "id": sp_gap[0],
                    "topic": sp_gap[1],
                    "prompt": sp_gap[2],
                    "gapReason": sp_gap[3],
                    "sourceRef": sp_gap[4]
                }
            }
        }

    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        raise e

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Collins U5-U20 questions into DB")
    parser.add_argument("--dry-run", action="store_true", help="Dry run without commit")
    args = parser.parse_args()

    run_import(dry_run=args.dry_run)
