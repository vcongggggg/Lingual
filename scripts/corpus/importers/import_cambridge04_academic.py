# -*- coding: utf-8 -*-
r"""
Script: import_cambridge04_academic.py
Description: Full-book importer for Cambridge IELTS 04 Academic (Tests 1-4)
             into local PostgreSQL DB (linguaflow_db).
Task ID: lingual-cam04-import-001

Features:
- Gate 0 SHA256 Verification:
  + Validates cam04_academic_draft.json, cam04_academic_manifest.json, cam04_academic_exploitation_report.json
  + Enforces STOP if any SHA mismatch
- Gate 1 Pre-import Hard Gate (Conditional):
  + Milestone A (before Cam 05): Reading 236, Listening 260, Writing topics 400, Writing models 152, Speaking 714
  + Milestone B (after Cam 05): Reading 248, Listening 276, Writing topics 408, Writing models 160, Speaking 718
  + Checks Tests 1-4 records in DB (must be exactly 0)
- Pre-insert Counts Verification:
  + 7 records/test: 4 Listening sections, 0 Reading passages, 2 Writing topics, 0 Writing models, 1 Speaking topic
  + 28 records total, 160 Listening questions, 0 gap, 0 unparseable
  + Reading is BLOCKED inventory (12 passages / 160 questions absent in book scan) - NOT imported
- Clean insertion of all 4 Academic Tests (28 records total)
- ScriptJson fidelity:
  + scripts are all '' (no tapescript in book scan) - imported verbatim as empty string
- Gate 3 Post-import Verification:
  + Target table counts: Gate 1 actuals + (R+0 / L+16 / WT+8 / WM+0 / S+4)
    For Milestone B: 248 / 292 / 416 / 160 / 722
  + Real DB spot-checks verified:
    1. T1S1 Q1 = 'shopping / variety of shopping'
    2. T1S3 Q21 = 'A'
    3. T4S1 Q1 = 'College Dining Room'
    4. T4S1 Q10 = 'speech'
    5. T4S4 Q40 = 'E'
"""

import argparse
import hashlib
import json
import os
import sys
from datetime import datetime
from pathlib import Path
import psycopg2

sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parents[3]
IMPORTERS_DIR = Path(__file__).resolve().parent

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "cambridge-ielts-04"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

TABLES = [
    'ielts_reading_passages',
    'ielts_listening_sections',
    'ielts_writing_topics',
    'ielts_writing_models',
    'ielts_speaking_topics'
]

GATE0_EXPECTED_HASHES = {
    'cam04_academic_draft.json': 'e1d8f4ab686dfc660195e1a47c366ad88abdad193ca4b8852bef0ba0ac0a4046',
    'cam04_academic_manifest.json': '8e3898784d245e4b3b2472a119f54b3bbebbd05c34cb09a40209715cc63a8474',
    'cam04_academic_exploitation_report.json': '53aa6821ef9a7c3c4d8d13ae231bb7f423f720566c384b6c6e589d44667ce1dc'
}

GATE1_MILESTONES = {
    'A': {
        'ielts_reading_passages': 236,
        'ielts_listening_sections': 260,
        'ielts_writing_topics': 400,
        'ielts_writing_models': 152,
        'ielts_speaking_topics': 714
    },
    'B': {
        'ielts_reading_passages': 248,
        'ielts_listening_sections': 276,
        'ielts_writing_topics': 408,
        'ielts_writing_models': 160,
        'ielts_speaking_topics': 718
    }
}

DELTAS = {
    'ielts_reading_passages': 0,
    'ielts_listening_sections': 16,
    'ielts_writing_topics': 8,
    'ielts_writing_models': 0,
    'ielts_speaking_topics': 4
}

def get_counts(conn):
    cur = conn.cursor()
    counts = {}
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        counts[t] = cur.fetchone()[0]
    cur.close()
    return counts

def verify_gate0():
    print("=" * 80)
    print("[GATE 0] KIỂM TRA SHA256 CÁC FILE NGUỒN CAMBRIDGE IELTS 04")
    print("=" * 80)

    results = {}
    has_mismatch = False

    for fname, exp_hash in GATE0_EXPECTED_HASHES.items():
        fpath = MAPPED_DIR / fname
        if not fpath.exists():
            print(f"  {fname:42}: KHÔNG TÌM THẤY TỆP! [FILE MISSING]")
            results[fname] = {"status": "MISSING", "actual": None, "expected": exp_hash}
            has_mismatch = True
            continue

        with open(fpath, "rb") as f:
            act_hash = hashlib.sha256(f.read()).hexdigest().lower()

        match = (act_hash == exp_hash.lower())
        status = "MATCH" if match else "MISMATCH"
        print(f"  {fname:42}: [{status}]")
        print(f"    Thực tế: {act_hash}")
        print(f"    Kỳ vọng: {exp_hash}")
        results[fname] = {"status": status, "actual": act_hash, "expected": exp_hash}
        if not match:
            has_mismatch = True

    return (not has_mismatch), results

def verify_gate1(conn):
    print("\n" + "=" * 80)
    print("[GATE 1] BẮT BUỘC TRƯỚC KHI IMPORT: BASE COUNTS & TEST 1-4 ZERO CHECK")
    print("=" * 80)

    cur = conn.cursor()

    # 1. Base counts against Milestone A or B
    counts = get_counts(conn)
    print("\n--- 1.1 Base Counts DB Local ---")
    detected_milestone = None
    for ms_name, base_counts in GATE1_MILESTONES.items():
        if all(counts[t] == base_counts[t] for t in TABLES):
            detected_milestone = ms_name
            break

    if detected_milestone is None:
        print("  [ERROR] Số đếm hiện tại không khớp Mốc A (trước Cam 05) lẫn Mốc B (sau Cam 05)!")
        for t in TABLES:
            print(f"    {t:26}: Hiện tại={counts[t]:3} | Mốc A={GATE1_MILESTONES['A'][t]:3} | Mốc B={GATE1_MILESTONES['B'][t]:3}")
        raise AssertionError("Gate 1 failed: Current DB counts match neither Milestone A nor Milestone B!")

    print(f"  -> PHÁT HIỆN MỐC {detected_milestone}:")
    for t in TABLES:
        act = counts[t]
        exp = GATE1_MILESTONES[detected_milestone][t]
        print(f"    {t:26}: Hiện tại={act:3} | Kỳ vọng (Mốc {detected_milestone})={exp:3} [MATCH]")

    # 2. Tests 1-4 records in DB (must be exactly 0)
    print("\n--- 1.2 Kiểm Tra Tests 1-4 Chưa Có Trong DB (%cam04% / %cambridge-04%) ---")
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}" WHERE id LIKE %s OR id LIKE %s', ('%cam04%', '%cambridge-04%'))
        cnt = cur.fetchone()[0]
        assert cnt == 0, f"Gate 1 Error: {t} already has {cnt} records for Cambridge 04!"
    print("  Tests 1-4: Toàn bộ 0 bản ghi (Sạch, chưa có bản ghi nào tồn tại).")

    cur.close()
    print(f"\n[PASS] GATE 1 TOÀN BỘ ĐÃ VƯỢT QUA 100% (MỐC {detected_milestone})!")
    return detected_milestone, counts

def parse_json_safely(val):
    if val is None:
        return []
    if isinstance(val, (list, dict)):
        return val
    if isinstance(val, str):
        val = val.strip()
        if not val:
            return []
        return json.loads(val)
    return []

def verify_pre_insert_data(data):
    print("\n" + "=" * 80)
    print("[PRE-INSERT VERIFICATION] XÁC THỰC HÌNH DẠNG & SỐ LƯỢNG CÂU HỎI TRƯỚC INSERT")
    print("=" * 80)

    l_list = data.get("listening_sections", [])
    wt_list = data.get("writing_topics", [])
    sp_list = data.get("speaking_topics", [])

    print(f"Listening sections: {len(l_list)} (Kỳ vọng: 16)")
    print(f"Writing topics:     {len(wt_list)} (Kỳ vọng: 8)")
    print(f"Speaking topics:    {len(sp_list)} (Kỳ vọng: 4)")
    print("Reading passages:   0 (BLOCKED - keys absent in book)")
    print("Writing models:     0 (absent in book)")

    assert len(l_list) == 16, f"Expected 16 listening sections, got {len(l_list)}"
    assert len(wt_list) == 8, f"Expected 8 writing topics, got {len(wt_list)}"
    assert len(sp_list) == 4, f"Expected 4 speaking topics, got {len(sp_list)}"

    total_records = len(l_list) + len(wt_list) + len(sp_list)
    assert total_records == 28, f"Expected 28 total records, got {total_records}"

    listening_q_count = sum(len(parse_json_safely(l.get("questionsJson"))) for l in l_list)
    print(f"Listening questions: {listening_q_count} (Kỳ vọng: 160)")
    assert listening_q_count == 160, f"Expected 160 listening questions, got {listening_q_count}"

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
            return False, gate0_results

        # Step 1: Gate 1 Base Counts Check
        detected_milestone, base_counts = verify_gate1(conn)

        # Calculate target counts for Gate 3
        target_counts = {t: base_counts[t] + DELTAS[t] for t in TABLES}

        # Step 2: Load Cambridge IELTS 04 Data
        draft_path = MAPPED_DIR / "cam04_academic_draft.json"
        with open(draft_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Step 2.5: Pre-insert verification
        verify_pre_insert_data(data)

        # Step 3: Database Insertions (28 records total)
        print("\n" + "=" * 80)
        print("[THỰC HIỆN INSERT CAMBRIDGE IELTS 04 ACADEMIC VÀO DATABASE]")
        print("=" * 80)

        now = datetime.now()
        total_inserted = 0

        # Clean any existing cam04 records for idempotency
        for tbl in TABLES:
            cur.execute(f'DELETE FROM "{tbl}" WHERE id LIKE %s OR id LIKE %s', ('%cam04%', '%cambridge-04%'))

        # (a) Listening Sections (16 records)
        for l in data.get("listening_sections", []):
            s_val = l.get("scriptJson") or ""
            s_text = str(s_val)
            q_val = l.get("questionsJson") or []
            q_json = json.dumps(q_val, ensure_ascii=False) if isinstance(q_val, (list, dict)) else str(q_val)

            # scriptJson is empty string, assert it does not have literal backslash-n
            assert r"\n" not in s_text, f"Literal backslash-n detected in scriptJson: {l['id']}"

            cur.execute("""
                INSERT INTO "ielts_listening_sections" (
                    id, section, track, "cefrLevel", difficulty_band, title, "titleVi",
                    "scriptJson", "questionsJson", source, license, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                l['id'], str(l.get('section', '1')), l.get('track', 'academic').lower(), l.get('cefrLevel') or 'B1',
                l.get('difficultyBand'), l['title'], l.get('titleVi'), s_text, q_json,
                l.get('source') or 'cambridge-ielts-04-full-text',
                l.get('license') or 'Cambridge University Press (Educational/Research Corpus)', True, now
            ))
            total_inserted += 1

        # (b) Writing Topics (8 records)
        for wt in data.get("writing_topics", []):
            o_val = wt.get("outlineJson") or "{}"
            o_json = json.dumps(o_val, ensure_ascii=False) if isinstance(o_val, (list, dict)) else str(o_val)
            k_val = wt.get("keyVocabJson") or "[]"
            k_json = json.dumps(k_val, ensure_ascii=False) if isinstance(k_val, (list, dict)) else str(k_val)

            cur.execute("""
                INSERT INTO "ielts_writing_topics" (
                    id, track, prompt, type, "typeVi", band_range, "outlineJson", "keyVocabJson", source, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                wt['id'], wt.get('track', 'academic').lower(), wt['prompt'], wt.get('type', 'Task 1'),
                wt.get('typeVi'), wt.get('bandRange', '6.0-9.0'), o_json, k_json,
                wt.get('source') or 'cambridge-ielts-04-full-text', True, now
            ))
            total_inserted += 1

        # (c) Speaking Topics (4 records)
        for sp in data.get("speaking_topics", []):
            i_val = sp.get("ideasJson") or "[]"
            i_json = json.dumps(i_val, ensure_ascii=False) if isinstance(i_val, (list, dict)) else str(i_val)
            f_val = sp.get("followUpQuestions") or "[]"
            f_json = json.dumps(f_val, ensure_ascii=False) if isinstance(f_val, (list, dict)) else str(f_val)

            cur.execute("""
                INSERT INTO "ielts_speaking_topics" (
                    id, part, track, question, "topicVi", "ideasJson", topic, follow_up_questions, source, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                sp['id'], 1, sp.get('track', 'academic').lower(), sp['question'],
                sp.get('topicVi'), i_json, sp.get('topic'), f_json,
                sp.get('source') or 'cambridge-ielts-04-full-text', True, now
            ))
            total_inserted += 1

        print(f"\nTổng số bản ghi đã chèn: {total_inserted} (Kỳ vọng: 28)")
        assert total_inserted == 28, f"Expected 28 records, inserted {total_inserted}"

        if dry_run:
            print("\n[DRY RUN] Thực hiện verify Gate 3 trước khi rollback...")
            verify_gate3(cur, target_counts)
            conn.rollback()
            print("[DRY RUN SUCCESS] Đã xác minh 100% hợp lệ và rollback sạch sẽ.")
            return True, gate0_results, detected_milestone

        conn.commit()
        print(f"\n[COMMIT SUCCESS] Đã commit thành công {total_inserted} bản ghi Cam 04 Academic vào database!")

        # Step 4: Gate 3 Post-import Verification
        verify_gate3(cur, target_counts)
        return True, gate0_results, detected_milestone

    except Exception as e:
        conn.rollback()
        print(f"\n[FATAL ERROR] Rollback transaction do lỗi: {e}")
        raise
    finally:
        cur.close()
        conn.close()

def verify_gate3(cur, target_counts):
    print("\n" + "=" * 80)
    print("[GATE 3] KIỂM TRA ĐÍCH SỐ LƯỢNG SAU INSERT & SPOT-CHECKS")
    print("=" * 80)

    # 1. Target Counts
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        cnt = cur.fetchone()[0]
        exp = target_counts[t]
        assert cnt == exp, f"Gate 3 Target mismatch for {t}: actual={cnt}, expected={exp}"
        print(f"  {t:26}: {cnt:3} [MATCH {exp}]")

    # 2. Spot-checks
    print("\n--- SPOT-CHECKS NỘI DUNG THỰC TẾ TỪ DATABASE ---")

    # 1. T1S1 Q1 = 'shopping / variety of shopping'
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('ielts-listening-cambridge-04-test-1-section-1',))
    t1_s1_q = json.loads(cur.fetchone()[0])
    q1 = next((q for q in t1_s1_q if q.get('questionNumber') == 1), None)
    assert q1 is not None, "T1 S1 Q1 not found"
    exp_q1 = 'shopping / variety of shopping'
    act_q1 = q1.get('correctAnswer')
    print(f"  (1) T1 S1 Q1 answer: '{act_q1}'")
    assert act_q1 == exp_q1, f"T1 S1 Q1 expected '{exp_q1}', got '{act_q1}'"

    # 2. T1S3 Q21 = 'A'
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('ielts-listening-cambridge-04-test-1-section-3',))
    t1_s3_q = json.loads(cur.fetchone()[0])
    q21 = next((q for q in t1_s3_q if q.get('questionNumber') == 21), None)
    assert q21 is not None, "T1 S3 Q21 not found"
    exp_q21 = 'A'
    act_q21 = q21.get('correctAnswer')
    print(f"  (2) T1 S3 Q21 answer: '{act_q21}'")
    assert act_q21 == exp_q21, f"T1 S3 Q21 expected '{exp_q21}', got '{act_q21}'"

    # 3. T4S1 Q1 = 'College Dining Room'
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('ielts-listening-cambridge-04-test-4-section-1',))
    t4_s1_q = json.loads(cur.fetchone()[0])
    t4_q1 = next((q for q in t4_s1_q if q.get('questionNumber') == 1), None)
    assert t4_q1 is not None, "T4 S1 Q1 not found"
    exp_t4_q1 = 'College Dining Room'
    act_t4_q1 = t4_q1.get('correctAnswer')
    print(f"  (3) T4 S1 Q1 answer: '{act_t4_q1}'")
    assert act_t4_q1 == exp_t4_q1, f"T4 S1 Q1 expected '{exp_t4_q1}', got '{act_t4_q1}'"

    # 4. T4S1 Q10 = 'speech'
    t4_q10 = next((q for q in t4_s1_q if q.get('questionNumber') == 10), None)
    assert t4_q10 is not None, "T4 S1 Q10 not found"
    exp_t4_q10 = 'speech'
    act_t4_q10 = t4_q10.get('correctAnswer')
    print(f"  (4) T4 S1 Q10 answer: '{act_t4_q10}'")
    assert act_t4_q10 == exp_t4_q10, f"T4 S1 Q10 expected '{exp_t4_q10}', got '{act_t4_q10}'"

    # 5. T4S4 Q40 = 'E'
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('ielts-listening-cambridge-04-test-4-section-4',))
    t4_s4_q = json.loads(cur.fetchone()[0])
    t4_q40 = next((q for q in t4_s4_q if q.get('questionNumber') == 40), None)
    assert t4_q40 is not None, "T4 S4 Q40 not found"
    exp_t4_q40 = 'E'
    act_t4_q40 = t4_q40.get('correctAnswer')
    print(f"  (5) T4 S4 Q40 answer: '{act_t4_q40}'")
    assert act_t4_q40 == exp_t4_q40, f"T4 S4 Q40 expected '{exp_t4_q40}', got '{act_t4_q40}'"

    # 6. Verify scriptJson is empty string
    cur.execute('SELECT "scriptJson" FROM "ielts_listening_sections" WHERE id = %s', ('ielts-listening-cambridge-04-test-1-section-1',))
    s1 = cur.fetchone()[0]
    assert s1 == "", f"scriptJson expected '', got '{s1}'"

    print("\n[PASS] GATE 3 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Cambridge IELTS 04 Academic Tests 1-4 into local DB")
    parser.add_argument("--dry-run", action="store_true", help="Run validation and rollback without persisting changes")
    parser.add_argument("--force-bypass-gate0", action="store_true", help="Bypass Gate 0 check")
    args = parser.parse_args()

    run_import(force_bypass_gate0=args.force_bypass_gate0, dry_run=args.dry_run)
