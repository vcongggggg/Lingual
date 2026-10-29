# -*- coding: utf-8 -*-
r"""
Script: import_destination_grammar.py
Description: Full-book importer for Destination B1 and Destination B2
             (102 entries, 4,659 questions = 2,156 mapped + 2,503 gap)
             into local PostgreSQL DB (linguaflow_db).
Task ID: lingual-grammar-destination-import-001

Features:
- Gate 0 SHA256 Verification:
  + Validates 3 part files and concatenates into destination_full_draft.json
  + Verifies full concatenated file hash e6625bc4759b1ddd0f7afc7700fd9de2783a18206cf155bd9ef4dd2280ddf9e9
  + Validates manifest (13b7f7c4933ae94a58b90e129fa1dbe92347be6689febd4fc8f8ee992b266f44)
  + Validates exploitation report (7bdc12e241f010291f5e37976945a8ea309dbf5563edb4eb6d9d10fd1331bf97)
- Gate 1 Pre-import Hard Gate (Conditional):
  + Validates current grammar_questions count against 4 milestones:
    * 4,082 (neither)
    * 5,835 (G4I only)
    * 8,644 (Murphy only)
    * 10,397 (both G4I and Murphy) -> MATCHED!
  + Deduplication: Count Destination questions in DB (must be exactly 0)
- Pre-insert Counts Verification:
  + 102 entries (B1 58 + B2 44)
  + 4,659 questions total (2,156 mapped + 2,503 gaps)
  + 672 weakMatch questions preserved
  + 53 sentence-building questions preserved
  + 2 unparseable fragments noted (B1 U1 F)
- Database Insertion:
  + All 4,659 questions inserted into grammar_questions
  + correctAnswer=null on gaps, preserving gapReason
  + itemNumber -> questionNumber (int)
  + sourceRef preserved
- Gate 3 Post-import Verification:
  + Target table count: Gate 1 baseline (10,397) + 4,659 = 15,056
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

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "destination-b1-b2"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

GATE0_EXPECTED_PARTS = {
    "destination_full_draft.json.part1": "5c50571a0769342981f8661ccfc808236b232e2629f551558b103ac316fecf1d",
    "destination_full_draft.json.part2": "52740bb51cca4c78f387877789e07cbe93dba2b37af5ddf872a27814b4343ee2",
    "destination_full_draft.json.part3": "4af05ceeacde0fecc58b60a654d10002290512268a78fc84c782e14cc34a97dd",
    "destination_manifest.json": "13b7f7c4933ae94a58b90e129fa1dbe92347be6689febd4fc8f8ee992b266f44",
    "destination_exploitation_report.json": "7bdc12e241f010291f5e37976945a8ea309dbf5563edb4eb6d9d10fd1331bf97"
}

GATE0_EXPECTED_FULL_DRAFT_HASH = "e6625bc4759b1ddd0f7afc7700fd9de2783a18206cf155bd9ef4dd2280ddf9e9"

GATE1_MILESTONES = {
    "neither": 4082,
    "g4i_only": 5835,
    "murphy_only": 8644,
    "both_g4i_and_murphy": 10397
}

DELTA_QUESTIONS = 4659

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest().lower()

def verify_gate0():
    print("=" * 80)
    print("[GATE 0] KIỂM TRA SHA256 CÁC FILE NGUỒN DESTINATION B1+B2")
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
    full_draft_path = MAPPED_DIR / "destination_full_draft.json"
    print("\n--- NỐI 3 PHẦN THÀNH destination_full_draft.json ---")
    with open(full_draft_path, "wb") as out_f:
        for p in ["destination_full_draft.json.part1", "destination_full_draft.json.part2", "destination_full_draft.json.part3"]:
            with open(MAPPED_DIR / p, "rb") as in_f:
                out_f.write(in_f.read())

    full_hash = sha256_file(full_draft_path)
    match_full = (full_hash == GATE0_EXPECTED_FULL_DRAFT_HASH.lower())
    status_full = "MATCH" if match_full else "MISMATCH"
    print(f"  destination_full_draft.json               : [{status_full}]")
    print(f"    Thực tế: {full_hash}")
    print(f"    Kỳ vọng: {GATE0_EXPECTED_FULL_DRAFT_HASH}")
    results["destination_full_draft.json"] = {"status": status_full, "actual": full_hash, "expected": GATE0_EXPECTED_FULL_DRAFT_HASH}

    if not match_full:
        return False, results

    return True, results

def verify_gate1(conn):
    print("\n" + "=" * 80)
    print("[GATE 1] BẮT BUỘC TRƯỚC KHI INSERT: CONDITIONAL MILESTONE & DEDUPLICATION CHECK")
    print("=" * 80)

    cur = conn.cursor()

    cur.execute('SELECT count(*) FROM "grammar_questions"')
    count = cur.fetchone()[0]
    print(f"\n--- 1.1 Base Counts grammar_questions hiện tại: {count} ---")

    detected_milestone = None
    for ms_name, exp_cnt in GATE1_MILESTONES.items():
        if count == exp_cnt:
            detected_milestone = ms_name
            break

    if detected_milestone is None:
        cur.close()
        raise AssertionError(f"Gate 1 Error: Current grammar_questions count ({count}) does not match any of the 4 valid milestones (4082, 5835, 8644, 10397)! STOPPING.")

    print(f"  -> PHÁT HIỆN MỐC: {detected_milestone} (Hiện tại={count} khớp kỳ vọng={GATE1_MILESTONES[detected_milestone]}) [MATCH]")

    # Check Destination records in DB (must be exactly 0)
    print("\n--- 1.2 Kiểm Tra Bản Ghi Destination Chưa Có Trong DB (%destination-% / destination-b1%) ---")
    cur.execute("SELECT count(*) FROM grammar_questions WHERE source LIKE %s OR id LIKE %s", ('%destination%', 'destination-%'))
    cnt = cur.fetchone()[0]
    if cnt > 0:
        cur.close()
        raise AssertionError(f"Gate 1 Error: Destination already exists in DB with {cnt} records! STOPPING to prevent duplicate insertion.")

    print(f"  Destination records trong DB: {cnt} bản ghi (Sạch, chưa có bản ghi nào tồn tại).")
    cur.close()
    print("\n[PASS] GATE 1 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
    return detected_milestone, count

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

    assert len(data) == 102, f"Expected 102 entries, got {len(data)}"

    total_questions = 0
    total_mapped = 0
    total_gaps = 0
    total_weak = 0
    types_count = {}

    for e in data:
        qs = e.get("questions", [])
        total_questions += len(qs)
        for q in qs:
            t = q.get("type")
            types_count[t] = types_count.get(t, 0) + 1
            if q.get("correctAnswer") is not None:
                total_mapped += 1
            else:
                total_gaps += 1
            if q.get("weakMatch") is True:
                total_weak += 1

    print(f"Total entries:      {len(data)} (Kỳ vọng: 102)")
    print(f"Total questions:    {total_questions} (Kỳ vọng: 4659)")
    print(f"Mapped questions:   {total_mapped} (Kỳ vọng: 2156)")
    print(f"Gap questions:      {total_gaps} (Kỳ vọng: 2503)")
    print(f"WeakMatch flags:    {total_weak} (Kỳ vọng: 672)")
    print(f"Sentence-building:  {types_count.get('sentence-building', 0)} (Kỳ vọng: 53)")

    assert total_questions == 4659, f"Expected 4659 questions, got {total_questions}"
    assert total_mapped == 2156, f"Expected 2156 mapped questions, got {total_mapped}"
    assert total_gaps == 2503, f"Expected 2503 gap questions, got {total_gaps}"
    assert total_weak == 672, f"Expected 672 weakMatch questions, got {total_weak}"
    assert types_count.get("sentence-building") == 53, f"Expected 53 sentence-building questions, got {types_count.get('sentence-building')}"

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
        detected_milestone, base_count = verify_gate1(conn)
        target_count = base_count + DELTA_QUESTIONS

        # Step 2: Load Destination Data
        draft_path = MAPPED_DIR / "destination_full_draft.json"
        with open(draft_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Step 2.5: Pre-insert verification
        verify_pre_insert_data(data)

        # Step 3: Database Insertions (4,659 questions)
        print("\n" + "=" * 80)
        print("[THỰC HIỆN INSERT DESTINATION B1+B2 VÀO DATABASE]")
        print("=" * 80)

        now = datetime.now()

        # Clean existing destination records for safety / idempotency
        cur.execute("DELETE FROM grammar_questions WHERE source LIKE %s OR id LIKE %s", ('%destination%', 'destination-%'))

        insert_rows = []
        for idx, e in enumerate(data):
            book = e.get("book", "destination-b1")
            u_val = e.get("unitNumber", idx)
            stype = str(e.get("type", "unit")).lower().replace(" ", "-")
            topic_title = e.get("title", f"Unit {u_val}")
            cefr_level = "B1" if "b1" in book.lower() else "B2"

            for q in e.get("questions", []):
                sub = str(q.get("subsection", "main")).replace(" ", "-").replace("/", "-")
                it_val = q.get("itemNumber", "1")
                it_str = str(it_val)
                it_int = parse_int_safe(it_val, 1)

                qid = f"{book}-{stype}-u{u_val}-{sub}-q{it_str}"
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
                    book, True, now, None,
                    it_int, q_type, source_ref, gap_reason,
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
        print(f"\nTổng số câu hỏi đã chèn: {total_inserted} (Kỳ vọng: 4659)")
        assert total_inserted == DELTA_QUESTIONS, f"Expected {DELTA_QUESTIONS} records, inserted {total_inserted}"

        if dry_run:
            print("\n[DRY RUN] Thực hiện verify Gate 3 trước khi rollback...")
            verify_gate3(cur, target_count)
            conn.rollback()
            print("[DRY RUN SUCCESS] Đã xác minh 100% hợp lệ và rollback sạch sẽ.")
            return True, gate0_results, detected_milestone

        conn.commit()
        print(f"\n[COMMIT SUCCESS] Đã commit thành công {total_inserted} câu hỏi Destination B1+B2 vào database!")

        # Step 4: Gate 3 Post-import Verification
        verify_gate3(cur, target_count)
        return True, gate0_results, detected_milestone

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

    # (a) B1 Progress Test 2: 77 questions present, ALL correctAnswer=null
    cur.execute("""
        SELECT count(*), count("correctAnswer"), count("gapReason")
        FROM grammar_questions
        WHERE id LIKE 'destination-b1-progresstest-u2-%'
    """)
    pt2_total, pt2_mapped, pt2_gaps = cur.fetchone()
    print(f"  (a) B1 Progress Test 2: total={pt2_total}/77, mapped={pt2_mapped}/0, gaps with gapReason={pt2_gaps}/77 [MATCH]")
    assert pt2_total == 77, f"Expected 77 questions for B1 PT2, got {pt2_total}"
    assert pt2_mapped == 0, f"Expected 0 mapped questions for B1 PT2, got {pt2_mapped}"
    assert pt2_gaps == 77, f"Expected 77 gap questions with gapReason for B1 PT2, got {pt2_gaps}"

    # (b) weakMatch flag intact on exactly 672 questions
    cur.execute("SELECT count(*) FROM grammar_questions WHERE source LIKE 'destination-%' AND \"weakMatch\" = true")
    weak_cnt = cur.fetchone()[0]
    print(f"  (b) Destination weakMatch count in DB: {weak_cnt} (Kỳ vọng: 672) [MATCH]")
    assert weak_cnt == 672, f"Expected 672 weakMatch questions, got {weak_cnt}"

    # (c) Sample B1 U29 mapped answers match unit key text
    cur.execute("SELECT id, question, \"correctAnswer\" FROM grammar_questions WHERE id = 'destination-b1-grammar-u29-A-q2'")
    q_u29 = cur.fetchone()
    assert q_u29 is not None, "Question destination-b1-grammar-u29-A-q2 not found"
    print(f"  (c) B1 U29 [A-2]: question='{q_u29[1]}', answer='{q_u29[2]}' [MATCH: No]")
    assert q_u29[2] == "No", f"Expected answer 'No', got '{q_u29[2]}'"

    # (d) sentence-building type accepted (53 questions)
    cur.execute("SELECT count(*) FROM grammar_questions WHERE source LIKE 'destination-%' AND type = 'sentence-building'")
    sb_cnt = cur.fetchone()[0]
    print(f"  (d) sentence-building questions count in DB: {sb_cnt} (Kỳ vọng: 53) [MATCH]")
    assert sb_cnt == 53, f"Expected 53 sentence-building questions, got {sb_cnt}"

    # (e) Verify gap questions count (2,503 nulls)
    cur.execute("SELECT count(*) FROM grammar_questions WHERE source LIKE 'destination-%' AND \"correctAnswer\" IS NULL")
    gap_cnt = cur.fetchone()[0]
    print(f"  (e) Destination gap questions with null correctAnswer: {gap_cnt} (Kỳ vọng: 2503) [MATCH]")
    assert gap_cnt == 2503, f"Expected 2503 gap questions with null, got {gap_cnt}"

    # (f) Verify mapped questions count (2,156 non-null)
    cur.execute("SELECT count(*) FROM grammar_questions WHERE source LIKE 'destination-%' AND \"correctAnswer\" IS NOT NULL")
    mapped_cnt = cur.fetchone()[0]
    print(f"  (f) Destination mapped questions: {mapped_cnt} (Kỳ vọng: 2156) [MATCH]")
    assert mapped_cnt == 2156, f"Expected 2156 mapped questions, got {mapped_cnt}"

    print("\n[PASS] GATE 3 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Destination B1+B2 into local DB")
    parser.add_argument("--dry-run", action="store_true", help="Run validation and rollback without persisting changes")
    parser.add_argument("--force-bypass-gate0", action="store_true", help="Bypass Gate 0 check")
    args = parser.parse_args()

    run_import(force_bypass_gate0=args.force_bypass_gate0, dry_run=args.dry_run)
