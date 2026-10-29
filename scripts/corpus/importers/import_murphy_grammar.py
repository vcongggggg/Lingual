# -*- coding: utf-8 -*-
r"""
Script: import_murphy_grammar.py
Description: Full-book importer for Raymond Murphy's English Grammar in Use (5th Edition)
             (145 units) into local PostgreSQL DB (linguaflow_db).
Task ID: lingual-grammar-murphy-import-002

Features:
- Gate 0 SHA256 Verification:
  + Validates 3 part files and concatenates into murphy_full_draft.json if missing/updated
  + Verifies full concatenated file hash 95873b4c41d390bec58e5d2f229400f622731326d724fd1a4f55309e90a93fdb
  + Validates manifest (1eb4b9e0cacd9e13141c62e44c6cad1b732376a4d6fbeee6d75cf39bfadc369f)
  + Validates exploitation report (8dad05c2766d2669f0070ebd6a2c37864d48ed60a44fa619ccd68ef412d7984f)
- Gate 1 Pre-import Hard Gate:
  + Deduplication: Count Murphy questions in DB (must be exactly 0)
  + Base count verification: Read total grammar_questions (baseline 5,835 after G4I)
- Pre-insert Counts Verification:
  + 145 units (127 key-matched + 18 keyless units 128-145)
  + 4,562 questions total (3,420 mapped + 1,142 gaps)
  + 10 unparseable subsections recorded (0 questions emitted for unparseable items)
- Insertion:
  + Preserves type ('fill-in', 'correction', 'choice', 'matching', 'question-formation', 'multiple_choice')
  + Gap questions have correctAnswer=null, preserving gapReason
  + Maps itemNumber -> questionNumber (int)
  + Retains sourceRef verbatim
- Gate 3 Post-import Verification:
  + Target table count: Gate 1 actuals + 4,562 = 10,397
  + Real DB spot-checks verified
"""

import argparse
import hashlib
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
import psycopg2
from psycopg2.extras import execute_batch

sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parents[3]
IMPORTERS_DIR = Path(__file__).resolve().parent

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "murphy-grammar-in-use-5th"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

GATE0_EXPECTED_PARTS = {
    "murphy_full_draft.json.part1": "9996f64cb36efaeb1b7fb62df084632d43d9f4e790a77ba0d5c6e0b3d4a11899",
    "murphy_full_draft.json.part2": "fff976408c17746b49441d6f7c35b1f9606e8d551d05cbf0a6dde3c1715841a7",
    "murphy_full_draft.json.part3": "9bb17863439054d95f3152703e7d3c8880c559e964a4951491a3233e5b776535",
    "murphy_manifest.json": "1eb4b9e0cacd9e13141c62e44c6cad1b732376a4d6fbeee6d75cf39bfadc369f",
    "murphy_exploitation_report.json": "8dad05c2766d2669f0070ebd6a2c37864d48ed60a44fa619ccd68ef412d7984f"
}

GATE0_EXPECTED_FULL_DRAFT_HASH = "95873b4c41d390bec58e5d2f229400f622731326d724fd1a4f55309e90a93fdb"

GATE1_BASELINE = 5835
DELTA_QUESTIONS = 4562

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest().lower()

def verify_gate0():
    print("=" * 80)
    print("[GATE 0] KIỂM TRA SHA256 CÁC FILE NGUỒN MURPHY GRAMMAR IN USE")
    print("=" * 80)

    results = {}
    has_mismatch = False

    for fname, exp_hash in GATE0_EXPECTED_PARTS.items():
        fpath = MAPPED_DIR / fname
        if not fpath.exists():
            print(f"  {fname:46}: KHÔNG TÌM THẤY TỆP! [FILE MISSING]")
            results[fname] = {"status": "MISSING", "actual": None, "expected": exp_hash}
            has_mismatch = True
            continue

        act_hash = sha256_file(fpath)
        match = (act_hash == exp_hash.lower())
        status = "MATCH" if match else "MISMATCH"
        print(f"  {fname:46}: [{status}]")
        print(f"    Thực tế: {act_hash}")
        print(f"    Kỳ vọng: {exp_hash}")
        results[fname] = {"status": status, "actual": act_hash, "expected": exp_hash}
        if not match:
            has_mismatch = True

    if has_mismatch:
        return False, results

    # Concatenate 3 parts
    full_draft_path = MAPPED_DIR / "murphy_full_draft.json"
    print("\n--- NỐI 3 PHẦN THÀNH murphy_full_draft.json ---")
    with open(full_draft_path, "wb") as out_f:
        for p in ["murphy_full_draft.json.part1", "murphy_full_draft.json.part2", "murphy_full_draft.json.part3"]:
            with open(MAPPED_DIR / p, "rb") as in_f:
                out_f.write(in_f.read())

    full_hash = sha256_file(full_draft_path)
    match_full = (full_hash == GATE0_EXPECTED_FULL_DRAFT_HASH.lower())
    status_full = "MATCH" if match_full else "MISMATCH"
    print(f"  murphy_full_draft.json                    : [{status_full}]")
    print(f"    Thực tế: {full_hash}")
    print(f"    Kỳ vọng: {GATE0_EXPECTED_FULL_DRAFT_HASH}")
    results["murphy_full_draft.json"] = {"status": status_full, "actual": full_hash, "expected": GATE0_EXPECTED_FULL_DRAFT_HASH}

    if not match_full:
        return False, results

    return True, results

def verify_gate1(conn):
    print("\n" + "=" * 80)
    print("[GATE 1] BẮT BUỘC TRƯỚC KHI INSERT: BASE COUNTS & DEDUPLICATION CHECK")
    print("=" * 80)

    cur = conn.cursor()

    # 1. Base counts
    cur.execute('SELECT count(*) FROM "grammar_questions"')
    count = cur.fetchone()[0]
    print(f"\n--- 1.1 Base Counts grammar_questions hiện tại: {count} ---")
    print(f"  Kỳ vọng baseline (sau G4I): {GATE1_BASELINE} [MATCH: {count == GATE1_BASELINE}]")

    # 2. Check existing Murphy records in DB (must be exactly 0)
    print("\n--- 1.2 Kiểm Tra Bản Ghi Murphy Chưa Có Trong DB (%murphy% / murphy-%) ---")
    cur.execute("SELECT count(*) FROM grammar_questions WHERE source LIKE %s OR id LIKE %s", ('%murphy%', 'murphy-%'))
    cnt = cur.fetchone()[0]
    if cnt > 0:
        cur.close()
        raise AssertionError(f"Gate 1 Error: Murphy already exists in DB with {cnt} records! STOPPING to prevent duplicate insertion.")

    print(f"  Murphy records trong DB: {cnt} bản ghi (Sạch, chưa có bản ghi nào tồn tại).")
    cur.close()
    print("\n[PASS] GATE 1 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
    return count

def parse_int_safe(val, default=1):
    if isinstance(val, int):
        return val
    if isinstance(val, str):
        m = re.search(r'\d+', val)
        if m:
            return int(m.group(0))
    return default

def verify_pre_insert_data(data):
    print("\n" + "=" * 80)
    print("[PRE-INSERT VERIFICATION] XÁC THỰC HÌNH DẠNG & SỐ LƯỢNG CÂU HỎI TRƯỚC INSERT")
    print("=" * 80)

    assert len(data) == 145, f"Expected 145 units, got {len(data)}"

    total_questions = 0
    total_mapped = 0
    total_gaps = 0

    for idx, sec in enumerate(data):
        qs = sec.get("questions", [])
        total_questions += len(qs)
        for q in qs:
            if q.get("correctAnswer") is not None:
                total_mapped += 1
            else:
                total_gaps += 1

    print(f"Total units:        {len(data)} (Kỳ vọng: 145)")
    print(f"Total questions:    {total_questions} (Kỳ vọng: 4562)")
    print(f"Mapped questions:   {total_mapped} (Kỳ vọng: 3420)")
    print(f"Gap questions:      {total_gaps} (Kỳ vọng: 1142)")

    assert total_questions == 4562, f"Expected 4562 questions, got {total_questions}"
    assert total_mapped == 3420, f"Expected 3420 mapped questions, got {total_mapped}"
    assert total_gaps == 1142, f"Expected 1142 gap questions, got {total_gaps}"

    print("[PASS] PRE-INSERT VERIFICATION ĐÃ VƯỢT QUA 100%!")
    return True

def run_import(force_bypass_gate0=False, dry_run=False):
    conn = psycopg2.connect(DSN)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # Step 0: Gate 0 SHA Check
        gate0_passed, gate0_results = verify_gate0()
        if not gate0_passed and not force_bypass_gate0:
            print("\n[STOP TRIGGERED] GATE 0 SHA MISMATCH! DỪNG LẠI THEO QUY TẮC AN TOÀN.")
            return False, gate0_results, None

        # Step 1: Gate 1 Base Counts Check
        base_count = verify_gate1(conn)
        target_count = base_count + DELTA_QUESTIONS

        # Step 2: Load Murphy Data
        draft_path = MAPPED_DIR / "murphy_full_draft.json"
        with open(draft_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Step 2.5: Pre-insert verification
        verify_pre_insert_data(data)

        # Step 3: Database Insertions (4,562 questions)
        print("\n" + "=" * 80)
        print("[THỰC HIỆN INSERT MURPHY ENGLISH GRAMMAR IN USE VÀO DATABASE]")
        print("=" * 80)

        now = datetime.now()

        # Clean any existing murphy records for safety
        cur.execute("DELETE FROM grammar_questions WHERE source LIKE %s OR id LIKE %s", ('%murphy%', 'murphy-%'))

        insert_rows = []
        for sec in data:
            unit_num = sec.get("unitNumber", 0)
            topic_title = sec.get("title", f"Unit {unit_num}")
            cefr_level = "B1-B2"

            for q in sec.get("questions", []):
                sub = str(q.get("subsection", "main")).lower().replace(" ", "-")
                item_val = q.get("itemNumber", "1")
                item_str = str(item_val)
                item_int = parse_int_safe(item_val, 1)

                qid = f"murphy-u{unit_num:03d}-{sub}-q{item_str}"
                q_text = q.get("question", "").strip()
                options_json = json.dumps(q.get("options", []), ensure_ascii=False)
                correct_ans = q.get("correctAnswer")
                if correct_ans is not None:
                    correct_ans = str(correct_ans).strip()

                q_type = q.get("type", "fill-in")
                source_ref = q.get("sourceRef")
                gap_reason = q.get("gapReason")
                derived_flag = bool(q.get("derived", False))
                key_typo = q.get("keyTypo")
                weak_match_flag = bool(q.get("weakMatch", False))

                insert_rows.append((
                    qid, q_text, options_json, correct_ans, None,
                    cefr_level, topic_title, None, "grammar",
                    "murphy-grammar-in-use-5th", True, now, None,
                    item_int, q_type, source_ref, gap_reason,
                    derived_flag, key_typo, weak_match_flag
                ))

        insert_sql = """
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
        execute_batch(cur, insert_sql, insert_rows, page_size=1000)

        total_inserted = len(insert_rows)
        print(f"\nTổng số câu hỏi đã chèn: {total_inserted} (Kỳ vọng: 4562)")
        assert total_inserted == 4562, f"Expected 4562 records, inserted {total_inserted}"

        if dry_run:
            print("\n[DRY RUN] Thực hiện verify Gate 3 trước khi rollback...")
            verify_gate3(cur, target_count)
            conn.rollback()
            print("[DRY RUN SUCCESS] Đã xác minh 100% hợp lệ và rollback sạch sẽ.")
            return True, gate0_results, base_count

        conn.commit()
        print(f"\n[COMMIT SUCCESS] Đã commit thành công {total_inserted} câu hỏi Murphy Grammar in Use vào database!")

        # Step 4: Gate 3 Post-import Verification
        verify_gate3(cur, target_count)
        return True, gate0_results, base_count

    except Exception as e:
        conn.rollback()
        print(f"\n[FATAL ERROR] Rollback transaction do lỗi: {e}")
        raise
    finally:
        cur.close()
        conn.close()

def verify_gate3(cur, target_count):
    print("\n" + "=" * 80)
    print("[GATE 3] KIỂM TRA ĐÍCH SỐ LƯỢNG SAU INSERT & SPOT-CHECKS")
    print("=" * 80)

    # 1. Target Counts
    cur.execute('SELECT count(*) FROM "grammar_questions"')
    cnt = cur.fetchone()[0]
    assert cnt == target_count, f"Gate 3 Target mismatch for grammar_questions: actual={cnt}, expected={target_count}"
    print(f"  grammar_questions: {cnt:5} [MATCH {target_count}]")

    # 2. Spot-checks
    print("\n--- SPOT-CHECKS NỘI DUNG THỰC TẾ TỪ DATABASE ---")

    # (a) 1 keyless sample unit (128-145): all questions present with correctAnswer=null + gapReason
    cur.execute("""
        SELECT count(*), count("correctAnswer"), count("gapReason")
        FROM grammar_questions
        WHERE id LIKE 'murphy-u128-%'
    """)
    u128_total, u128_mapped, u128_gaps = cur.fetchone()
    print(f"  (a) Keyless Unit 128 total: {u128_total}/37, mapped: {u128_mapped}/0, gaps with gapReason: {u128_gaps}/37 [MATCH]")
    assert u128_total == 37, f"Expected 37 questions for Unit 128, got {u128_total}"
    assert u128_mapped == 0, f"Expected 0 mapped questions for Unit 128, got {u128_mapped}"
    assert u128_gaps == 37, f"Expected 37 gap questions with gapReason for Unit 128, got {u128_gaps}"

    # Also check Unit 135
    cur.execute("""
        SELECT count(*), count("correctAnswer"), count("gapReason")
        FROM grammar_questions
        WHERE id LIKE 'murphy-u135-%'
    """)
    u135_total, u135_mapped, u135_gaps = cur.fetchone()
    print(f"  (a.2) Keyless Unit 135 total: {u135_total}/36, mapped: {u135_mapped}/0, gaps with gapReason: {u135_gaps}/36 [MATCH]")
    assert u135_total == 36 and u135_mapped == 0 and u135_gaps == 36

    # (b) Subsection unparseable:
    # Items 10-12 of 86.2 were unparseable and not imported
    cur.execute("SELECT count(*) FROM grammar_questions WHERE id LIKE 'murphy-u086-86.2-q10%' OR id LIKE 'murphy-u086-86.2-q11%' OR id LIKE 'murphy-u086-86.2-q12%'")
    unp_86_2_cnt = cur.fetchone()[0]
    print(f"  (b.1) Unparseable items 10-12 in subsection 86.2 count: {unp_86_2_cnt} (Kỳ vọng: 0) [MATCH]")
    assert unp_86_2_cnt == 0, f"Expected 0 imported questions for unparseable items in 86.2, got {unp_86_2_cnt}"

    # Subsection 4.2 has 0 questions imported
    cur.execute("SELECT count(*) FROM grammar_questions WHERE id LIKE 'murphy-u004-4.2%'")
    unp_4_2_cnt = cur.fetchone()[0]
    print(f"  (b.2) Unparseable subsection 4.2 questions count: {unp_4_2_cnt} (Kỳ vọng: 0) [MATCH]")
    assert unp_4_2_cnt == 0, f"Expected 0 imported questions for unparseable subsection 4.2, got {unp_4_2_cnt}"

    # (c) 2-3 mapped answers verified against unit key text
    cur.execute("SELECT id, question, \"correctAnswer\" FROM grammar_questions WHERE id = 'murphy-u001-1.1-q2'")
    q_u1 = cur.fetchone()
    assert q_u1 is not None, "Question murphy-u001-1.1-q2 not found"
    print(f"  (c.1) Unit 1 Q[1.1-2]: question='{q_u1[1]}', answer='{q_u1[2]}' [MATCH: He’s tying / He is tying]")
    assert q_u1[2] == "He’s tying / He is tying", f"Unexpected answer: {q_u1[2]}"

    cur.execute("SELECT id, question, \"correctAnswer\" FROM grammar_questions WHERE id = 'murphy-u002-2.1-q2'")
    q_u2 = cur.fetchone()
    assert q_u2 is not None, "Question murphy-u002-2.1-q2 not found"
    print(f"  (c.2) Unit 2 Q[2.1-2]: question='{q_u2[1]}', answer='{q_u2[2]}' [MATCH: go]")
    assert q_u2[2] == "go", f"Unexpected answer: {q_u2[2]}"

    cur.execute("SELECT id, question, \"correctAnswer\" FROM grammar_questions WHERE id = 'murphy-u005-5.1-q2'")
    q_u5 = cur.fetchone()
    assert q_u5 is not None, "Question murphy-u005-5.1-q2 not found"
    print(f"  (c.3) Unit 5 Q[5.1-2]: question='{q_u5[1]}', answer='{q_u5[2]}' [MATCH: had]")
    assert q_u5[2] == "had", f"Unexpected answer: {q_u5[2]}"

    # (d) Verify gap questions count (1,142 nulls)
    cur.execute("SELECT count(*) FROM grammar_questions WHERE id LIKE 'murphy-%' AND \"correctAnswer\" IS NULL")
    gap_cnt = cur.fetchone()[0]
    print(f"  (d) Murphy gap questions with null correctAnswer: {gap_cnt} (Kỳ vọng: 1142) [MATCH]")
    assert gap_cnt == 1142, f"Expected 1142 gap questions with null, got {gap_cnt}"

    # (e) Verify mapped questions count (3,420 non-null)
    cur.execute("SELECT count(*) FROM grammar_questions WHERE id LIKE 'murphy-%' AND \"correctAnswer\" IS NOT NULL")
    mapped_cnt = cur.fetchone()[0]
    print(f"  (e) Murphy mapped questions: {mapped_cnt} (Kỳ vọng: 3420) [MATCH]")
    assert mapped_cnt == 3420, f"Expected 3420 mapped questions, got {mapped_cnt}"

    print("\n[PASS] GATE 3 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Murphy English Grammar in Use into local DB")
    parser.add_argument("--dry-run", action="store_true", help="Run validation and rollback without persisting changes")
    parser.add_argument("--force-bypass-gate0", action="store_true", help="Bypass Gate 0 check")
    args = parser.parse_args()

    run_import(force_bypass_gate0=args.force_bypass_gate0, dry_run=args.dry_run)
