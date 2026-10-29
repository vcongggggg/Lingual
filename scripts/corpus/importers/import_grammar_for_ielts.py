# -*- coding: utf-8 -*-
r"""
Script: import_grammar_for_ielts.py
Description: Full-book importer for Cambridge Grammar for IELTS (25 units + Entry test)
             into local PostgreSQL DB (linguaflow_db).
Task ID: lingual-grammar-g4i-import-001

Features:
- Gate 0 SHA256 Verification:
  + Validates 3 part files and concatenates into grammar_for_ielts_full_draft.json
  + Verifies full concatenated file hash f67909ced27ba213c6e47f15d03d1d377999faebdcc6076fe61e4eb33615c006
  + Validates manifest and exploitation report
- Gate 1 Pre-import Hard Gate (Conditional):
  + Milestone A (Murphy not finished): 4,082
  + Milestone B (Murphy finished): 8,644
  + Checks G4I records in DB (must be exactly 0)
- Pre-insert Counts Verification:
  + 26 sections (25 units + Entry test)
  + 1,753 questions total (1,548 mapped + 205 gaps)
- Clean insertion of all 1,753 questions:
  + Gap questions have correctAnswer=null, preserving gapReason
  + Flags (derived, keyTypo, weakMatch) preserved
- Gate 3 Post-import Verification:
  + Target table count: Gate 1 actuals + 1,753 (For Milestone A: 5,835)
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

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "grammar-for-ielts"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

GATE0_EXPECTED_PARTS = {
    "grammar_for_ielts_full_draft.json.part1": "89e193777725db3c4751278ed75d951f9c69f5bd6b784a69972a11806466716d",
    "grammar_for_ielts_full_draft.json.part2": "2ee08878e42874505ee50e5b963c51ab00ecfbe931e3f9592299b74623062b7d",
    "grammar_for_ielts_full_draft.json.part3": "ed335247045b2442014645ae88a7ead8648052168114efe630c3eec170cb2661",
    "grammar_for_ielts_manifest.json": "acfeb4a371dda489188e08e21c5462b7bd265f76b3ceb5dd814e1beb98028746",
    "grammar_for_ielts_exploitation_report.json": "5babf4dfcd21df12974d6805cccdffbc95cfcf7ebcd8ce36e80a371b19118214"
}

GATE0_EXPECTED_FULL_DRAFT_HASH = "f67909ced27ba213c6e47f15d03d1d377999faebdcc6076fe61e4eb33615c006"

GATE1_MILESTONES = {
    'A': 4082,
    'B': 8644
}

DELTA_QUESTIONS = 1753

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest().lower()

def verify_gate0():
    print("=" * 80)
    print("[GATE 0] KIỂM TRA SHA256 CÁC FILE NGUỒN GRAMMAR FOR IELTS")
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
    full_draft_path = MAPPED_DIR / "grammar_for_ielts_full_draft.json"
    print("\n--- NỐI 3 PHẦN THÀNH grammar_for_ielts_full_draft.json ---")
    with open(full_draft_path, "wb") as out_f:
        for p in ["grammar_for_ielts_full_draft.json.part1", "grammar_for_ielts_full_draft.json.part2", "grammar_for_ielts_full_draft.json.part3"]:
            with open(MAPPED_DIR / p, "rb") as in_f:
                out_f.write(in_f.read())

    full_hash = sha256_file(full_draft_path)
    match_full = (full_hash == GATE0_EXPECTED_FULL_DRAFT_HASH.lower())
    status_full = "MATCH" if match_full else "MISMATCH"
    print(f"  grammar_for_ielts_full_draft.json         : [{status_full}]")
    print(f"    Thực tế: {full_hash}")
    print(f"    Kỳ vọng: {GATE0_EXPECTED_FULL_DRAFT_HASH}")
    results["grammar_for_ielts_full_draft.json"] = {"status": status_full, "actual": full_hash, "expected": GATE0_EXPECTED_FULL_DRAFT_HASH}

    if not match_full:
        return False, results

    return True, results

def verify_gate1(conn):
    print("\n" + "=" * 80)
    print("[GATE 1] BẮT BUỘC TRƯỚC KHI IMPORT: BASE COUNTS & ZERO CHECK G4I")
    print("=" * 80)

    cur = conn.cursor()

    # 1. Base counts against Milestone A or B
    cur.execute('SELECT count(*) FROM "grammar_questions"')
    count = cur.fetchone()[0]
    print(f"\n--- 1.1 Base Counts grammar_questions hiện tại: {count} ---")

    detected_milestone = None
    for ms_name, exp_cnt in GATE1_MILESTONES.items():
        if count == exp_cnt:
            detected_milestone = ms_name
            break

    if detected_milestone is None:
        print(f"  [ERROR] Số đếm grammar_questions ({count}) không khớp Mốc A (4.082) lẫn Mốc B (8.644)!")
        raise AssertionError(f"Gate 1 failed: Current grammar_questions count ({count}) matches neither Milestone A (4082) nor Milestone B (8644)!")

    print(f"  -> PHÁT HIỆN MỐC {detected_milestone}: Hiện tại={count} | Kỳ vọng (Mốc {detected_milestone})={GATE1_MILESTONES[detected_milestone]} [MATCH]")

    # 2. Check G4I records in DB (must be exactly 0)
    print("\n--- 1.2 Kiểm Tra Bản Ghi G4I Chưa Có Trong DB (%g4i-% / cambridge-grammar-for-ielts) ---")
    cur.execute("SELECT count(*) FROM grammar_questions WHERE id LIKE %s OR source = %s", ('%g4i-%', 'cambridge-grammar-for-ielts'))
    cnt = cur.fetchone()[0]
    assert cnt == 0, f"Gate 1 Error: grammar_questions already has {cnt} records for G4I!"
    print("  G4I records: Toàn bộ 0 bản ghi (Sạch, chưa có bản ghi nào tồn tại).")

    cur.close()
    print(f"\n[PASS] GATE 1 TOÀN BỘ ĐÃ VƯỢT QUA 100% (MỐC {detected_milestone})!")
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

    assert len(data) == 26, f"Expected 26 sections, got {len(data)}"

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

    print(f"Total sections:     {len(data)} (Kỳ vọng: 26)")
    print(f"Total questions:    {total_questions} (Kỳ vọng: 1753)")
    print(f"Mapped questions:   {total_mapped} (Kỳ vọng: 1548)")
    print(f"Gap questions:      {total_gaps} (Kỳ vọng: 205)")

    assert total_questions == 1753, f"Expected 1753 questions, got {total_questions}"
    assert total_mapped == 1548, f"Expected 1548 mapped questions, got {total_mapped}"
    assert total_gaps == 205, f"Expected 205 gap questions, got {total_gaps}"

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

        # Step 2: Load Cambridge Grammar for IELTS Data
        draft_path = MAPPED_DIR / "grammar_for_ielts_full_draft.json"
        with open(draft_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Step 2.5: Pre-insert verification
        verify_pre_insert_data(data)

        # Step 3: Database Insertions (1,753 questions)
        print("\n" + "=" * 80)
        print("[THỰC HIỆN INSERT CAMBRIDGE GRAMMAR FOR IELTS VÀO DATABASE]")
        print("=" * 80)

        now = datetime.now()

        # Clean any existing g4i records for idempotency
        cur.execute("DELETE FROM grammar_questions WHERE id LIKE %s OR source = %s", ('%g4i-%', 'cambridge-grammar-for-ielts'))

        insert_rows = []
        for sec in data:
            unit_num = sec.get("unitNumber", 0)
            topic_title = sec.get("title", f"Unit {unit_num}")
            cefr_level = "B2"

            for q in sec.get("questions", []):
                sub = str(q.get("subsection", "main")).lower().replace(" ", "-")
                item_val = q.get("itemNumber", 1)
                item_str = str(item_val)
                item_int = parse_int_safe(item_val, 1)

                qid = f"g4i-u{unit_num:02d}-{sub}-q{item_str}"
                q_text = q.get("question", "").strip()
                options_json = json.dumps(q.get("options", []), ensure_ascii=False)
                correct_ans = q.get("correctAnswer")
                if correct_ans is not None:
                    correct_ans = str(correct_ans).strip()

                q_type = q.get("type", "fill_in")
                source_ref = q.get("sourceRef")
                gap_reason = q.get("gapReason")
                derived_flag = bool(q.get("derivedFromKeyExplanation") or q.get("derived", False))
                key_typo = q.get("keyTypo")
                weak_match_flag = bool(q.get("weakMatch", False))

                insert_rows.append((
                    qid, q_text, options_json, correct_ans, None,
                    cefr_level, topic_title, None, "grammar",
                    "cambridge-grammar-for-ielts", True, now, None,
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
        print(f"\nTổng số câu hỏi đã chèn: {total_inserted} (Kỳ vọng: 1753)")
        assert total_inserted == 1753, f"Expected 1753 records, inserted {total_inserted}"

        if dry_run:
            print("\n[DRY RUN] Thực hiện verify Gate 3 trước khi rollback...")
            verify_gate3(cur, target_count)
            conn.rollback()
            print("[DRY RUN SUCCESS] Đã xác minh 100% hợp lệ và rollback sạch sẽ.")
            return True, gate0_results, detected_milestone

        conn.commit()
        print(f"\n[COMMIT SUCCESS] Đã commit thành công {total_inserted} câu hỏi Grammar for IELTS vào database!")

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

    # (a) Entry test 50 questions present / 50 mapped
    cur.execute("SELECT count(*), count(\"correctAnswer\") FROM grammar_questions WHERE id LIKE 'g4i-u00-entry-%'")
    entry_total, entry_mapped = cur.fetchone()
    print(f"  (a) Entry test total: {entry_total}/50, mapped: {entry_mapped}/50 [MATCH]")
    assert entry_total == 50, f"Expected 50 Entry test questions, got {entry_total}"
    assert entry_mapped == 50, f"Expected 50 mapped Entry test questions, got {entry_mapped}"

    # (b) 1 derived-from-key-explanation answer keeps derived=True
    cur.execute("SELECT id, \"correctAnswer\", \"sourceRef\", derived FROM grammar_questions WHERE id LIKE 'g4i-%' AND derived = true LIMIT 1")
    der_row = cur.fetchone()
    assert der_row is not None, "Derived question not found in DB"
    print(f"  (b) Derived question: ID={der_row[0]}, ans='{der_row[1]}', derived={der_row[3]} [MATCH]")
    assert der_row[3] is True, "Derived flag is not True"

    # (c) 1 keyTypo question keeps flag + print form (Entry Q44 printed 'Λ', stored 'A')
    cur.execute("SELECT id, \"correctAnswer\", \"keyTypo\" FROM grammar_questions WHERE id = 'g4i-u00-entry-q44'")
    typo_row = cur.fetchone()
    assert typo_row is not None, "Entry Q44 not found in DB"
    print(f"  (c) Entry Q44: correctAnswer='{typo_row[1]}', keyTypo='{typo_row[2]}' [MATCH]")
    assert typo_row[1] == 'A', f"Expected 'A', got '{typo_row[1]}'"
    assert typo_row[2] == 'Λ', f"Expected 'Λ', got '{typo_row[2]}'"

    # (d) Subsection unparseable U20 A Task 5: 0 questions imported
    cur.execute("SELECT count(*) FROM grammar_questions WHERE id LIKE 'g4i-u20-a-task5%'")
    u20_unp_cnt = cur.fetchone()[0]
    print(f"  (d) U20 A Task 5 questions count: {u20_unp_cnt} (Kỳ vọng: 0) [MATCH]")
    assert u20_unp_cnt == 0, f"Expected 0 questions for unparseable U20 A Task 5, got {u20_unp_cnt}"

    # (e) Verify gap questions count (205 nulls)
    cur.execute("SELECT count(*) FROM grammar_questions WHERE id LIKE 'g4i-%' AND \"correctAnswer\" IS NULL")
    gap_cnt = cur.fetchone()[0]
    print(f"  (e) G4I gap questions with null correctAnswer: {gap_cnt} (Kỳ vọng: 205) [MATCH]")
    assert gap_cnt == 205, f"Expected 205 gap questions with null, got {gap_cnt}"

    print("\n[PASS] GATE 3 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Cambridge Grammar for IELTS into local DB")
    parser.add_argument("--dry-run", action="store_true", help="Run validation and rollback without persisting changes")
    parser.add_argument("--force-bypass-gate0", action="store_true", help="Bypass Gate 0 check")
    args = parser.parse_args()

    run_import(force_bypass_gate0=args.force_bypass_gate0, dry_run=args.dry_run)
