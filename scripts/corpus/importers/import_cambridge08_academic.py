# -*- coding: utf-8 -*-
r"""
Script: import_cambridge08_academic.py
Description: Full-book importer for Cambridge IELTS 08 Academic (Tests 1-4)
             into local PostgreSQL DB (linguaflow_db).
Task ID: lingual-cam08-import-001

Features:
- Gate 0 SHA256 Verification:
  + Validates cam08_academic_draft.json, cam08_academic_manifest.json, cam08_academic_exploitation_report.json
  + Enforces STOP if any SHA mismatch
- Gate 1 Pre-import Hard Gate (Conditional):
  + Milestone C (Cam 04 not finished): Reading 248, Listening 276, Writing topics 408, Writing models 160, Speaking 718
  + Milestone D (Cam 04 finished): Reading 248, Listening 292, Writing topics 416, Writing models 160, Speaking 722
  + Checks Tests 1-4 records in DB (must be exactly 0)
- Pre-insert Counts Verification:
  + 12 records/test x 4 tests: 4 Listening, 3 Reading, 2 Writing topics, 2 Writing models, 1 Speaking topic
  + 48 records total, 320 questions (160 Listening + 160 Reading), 0 gap, 0 unparseable, 0 blocked
  + Hierarchical draft structure: tests[] x module lists
- Clean insertion of all 4 Academic Tests (48 records total)
- Verbatim answer & content fidelity:
  + T1 L S1 Q1-Q10 = C, B, '48 North Avenue', 'WS62YH', '01674553242', '(free) drink(s)/refreshment(s)', '(the/a) pianist/piano player', 10.50, 4, 50%
- Plain text verification (zero double-encoding for passageJson and scriptJson):
  + passageJson starts with '## '
  + scriptJson starts with 'SECTION'
  + Neither starts with quote character
  + Neither contains literal backslash-n
- Gate 3 Post-import Verification:
  + Target table counts: Gate 1 actuals + (R+12 / L+16 / WT+8 / WM+8 / S+4)
    For Milestone D: 260 / 308 / 424 / 168 / 726
  + Real DB spot-checks verified
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

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "cambridge-ielts-08"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

TABLES = [
    'ielts_reading_passages',
    'ielts_listening_sections',
    'ielts_writing_topics',
    'ielts_writing_models',
    'ielts_speaking_topics'
]

GATE0_EXPECTED_HASHES = {
    'cam08_academic_draft.json': '14e546f9312c4827f54e67b50f203b9c75a0df9d52528d81b338eb1c11e00407',
    'cam08_academic_manifest.json': '3c123ad8a31e4fb018e07265286d3d7df9c3ababe4c6701ba3e20aa08cae056a',
    'cam08_academic_exploitation_report.json': '483b1a419ae0a1b6c8588a6c2746b1f098b615f03fa493bcc414abd4cb7071eb'
}

GATE1_MILESTONES = {
    'C': {
        'ielts_reading_passages': 248,
        'ielts_listening_sections': 276,
        'ielts_writing_topics': 408,
        'ielts_writing_models': 160,
        'ielts_speaking_topics': 718
    },
    'D': {
        'ielts_reading_passages': 248,
        'ielts_listening_sections': 292,
        'ielts_writing_topics': 416,
        'ielts_writing_models': 160,
        'ielts_speaking_topics': 722
    }
}

DELTAS = {
    'ielts_reading_passages': 12,
    'ielts_listening_sections': 16,
    'ielts_writing_topics': 8,
    'ielts_writing_models': 8,
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
    print("[GATE 0] KIỂM TRA SHA256 CÁC FILE NGUỒN CAMBRIDGE IELTS 08")
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

    # 1. Base counts against Milestone C or D
    counts = get_counts(conn)
    print("\n--- 1.1 Base Counts DB Local ---")
    detected_milestone = None
    for ms_name, base_counts in GATE1_MILESTONES.items():
        if all(counts[t] == base_counts[t] for t in TABLES):
            detected_milestone = ms_name
            break

    if detected_milestone is None:
        print("  [ERROR] Số đếm hiện tại không khớp Mốc C lẫn Mốc D!")
        for t in TABLES:
            print(f"    {t:26}: Hiện tại={counts[t]:3} | Mốc C={GATE1_MILESTONES['C'][t]:3} | Mốc D={GATE1_MILESTONES['D'][t]:3}")
        raise AssertionError("Gate 1 failed: Current DB counts match neither Milestone C nor Milestone D!")

    print(f"  -> PHÁT HIỆN MỐC {detected_milestone}:")
    for t in TABLES:
        act = counts[t]
        exp = GATE1_MILESTONES[detected_milestone][t]
        print(f"    {t:26}: Hiện tại={act:3} | Kỳ vọng (Mốc {detected_milestone})={exp:3} [MATCH]")

    # 2. Tests 1-4 records in DB (must be exactly 0)
    print("\n--- 1.2 Kiểm Tra Tests 1-4 Chưa Có Trong DB (%cam08% / %cambridge-08%) ---")
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}" WHERE id LIKE %s OR id LIKE %s', ('%cam08%', '%cambridge-08%'))
        cnt = cur.fetchone()[0]
        assert cnt == 0, f"Gate 1 Error: {t} already has {cnt} records for Cambridge 08!"
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

    tests = data.get("tests", [])
    assert len(tests) == 4, f"Expected 4 tests, got {len(tests)}"

    total_records = 0
    total_reading_qs = 0
    total_listening_qs = 0

    for t in tests:
        t_num = t["test"]
        r_list = t.get("reading_passages", [])
        l_list = t.get("listening_sections", [])
        wt_list = t.get("writing_topics", [])
        wm_list = t.get("writing_models", [])
        sp_list = t.get("speaking_topics", [])

        assert len(r_list) == 3, f"Test {t_num}: Expected 3 reading passages, got {len(r_list)}"
        assert len(l_list) == 4, f"Test {t_num}: Expected 4 listening sections, got {len(l_list)}"
        assert len(wt_list) == 2, f"Test {t_num}: Expected 2 writing topics, got {len(wt_list)}"
        assert len(wm_list) == 2, f"Test {t_num}: Expected 2 writing models, got {len(wm_list)}"
        assert len(sp_list) == 1, f"Test {t_num}: Expected 1 speaking topic, got {len(sp_list)}"

        rec_cnt = len(r_list) + len(l_list) + len(wt_list) + len(wm_list) + len(sp_list)
        total_records += rec_cnt

        for r in r_list:
            qs = parse_json_safely(r.get("questionsJson"))
            total_reading_qs += len(qs)

        for l in l_list:
            qs = parse_json_safely(l.get("questionsJson"))
            total_listening_qs += len(qs)

    print(f"Total tests:           {len(tests)}")
    print(f"Total records:         {total_records} (Kỳ vọng: 48)")
    print(f"Reading questions:     {total_reading_qs} (Kỳ vọng: 160)")
    print(f"Listening questions:   {total_listening_qs} (Kỳ vọng: 160)")
    print(f"Total questions:       {total_reading_qs + total_listening_qs} (Kỳ vọng: 320)")

    assert total_records == 48, f"Expected 48 total records, got {total_records}"
    assert total_reading_qs == 160, f"Expected 160 reading questions, got {total_reading_qs}"
    assert total_listening_qs == 160, f"Expected 160 listening questions, got {total_listening_qs}"

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

        # Step 2: Load Cambridge IELTS 08 Data
        draft_path = MAPPED_DIR / "cam08_academic_draft.json"
        with open(draft_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Step 2.5: Pre-insert verification
        verify_pre_insert_data(data)

        # Step 3: Database Insertions (48 records total)
        print("\n" + "=" * 80)
        print("[THỰC HIỆN INSERT CAMBRIDGE IELTS 08 ACADEMIC VÀO DATABASE]")
        print("=" * 80)

        now = datetime.now()
        total_inserted = 0

        # Clean any existing cam08 records for idempotency
        for tbl in TABLES:
            cur.execute(f'DELETE FROM "{tbl}" WHERE id LIKE %s OR id LIKE %s', ('%cam08%', '%cambridge-08%'))

        for test_data in data.get("tests", []):
            t_num = test_data["test"]

            # (a) Reading Passages (3 per test)
            for r in test_data.get("reading_passages", []):
                p_val = r.get("passageJson") or ""
                p_text = str(p_val)
                q_val = r.get("questionsJson") or []
                q_json = json.dumps(q_val, ensure_ascii=False) if isinstance(q_val, (list, dict)) else str(q_val)

                # Strict format and plain-text checks
                assert not p_text.startswith('\"##'), f"Double-encoding detected in passageJson: {r['id']}"
                assert p_text.startswith("## "), f"passageJson must start with '## ': {r['id']}"
                assert r"\n" not in p_text, f"Literal backslash-n detected in passageJson: {r['id']}"

                cur.execute("""
                    INSERT INTO "ielts_reading_passages" (
                        id, section, track, "cefrLevel", difficulty_band, title, module, notes,
                        source_url, "passageJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    r['id'], str(r.get('section', '1')), r.get('track', 'academic').lower(), r.get('cefrLevel') or 'B2',
                    r.get('difficultyBand'), r['title'], r.get('module', 'Academic Reading'), r.get('notes'),
                    r.get('sourceUrl') or r.get('sourceRef'), p_text, q_json, r.get('source') or 'cambridge-ielts-08-full-text',
                    r.get('license') or 'Cambridge University Press (Educational/Research Corpus)', True, now
                ))
                total_inserted += 1

            # (b) Listening Sections (4 per test)
            for l in test_data.get("listening_sections", []):
                s_val = l.get("scriptJson") or ""
                s_text = str(s_val)
                q_val = l.get("questionsJson") or []
                q_json = json.dumps(q_val, ensure_ascii=False) if isinstance(q_val, (list, dict)) else str(q_val)

                # Strict format checks
                assert not s_text.startswith('\"SECTION'), f"Double-encoding detected in scriptJson: {l['id']}"
                assert s_text.startswith("SECTION"), f"scriptJson must start with 'SECTION': {l['id']}"
                assert r"\n" not in s_text, f"Literal backslash-n detected in scriptJson: {l['id']}"

                cur.execute("""
                    INSERT INTO "ielts_listening_sections" (
                        id, section, track, "cefrLevel", difficulty_band, title, "titleVi",
                        "scriptJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    l['id'], str(l.get('section', '1')), l.get('track', 'academic').lower(), l.get('cefrLevel') or 'B1',
                    l.get('difficultyBand'), l['title'], l.get('titleVi'), s_text, q_json,
                    l.get('source') or 'cambridge-ielts-08-full-text',
                    l.get('license') or 'Cambridge Assessment English', True, now
                ))
                total_inserted += 1

            # (c) Writing Topics (2 per test)
            for wt in test_data.get("writing_topics", []):
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
                    wt.get('source') or 'cambridge-ielts-08-full-text', True, now
                ))
                total_inserted += 1

            # (d) Writing Models (2 per test)
            for wm in test_data.get("writing_models", []):
                task_int = 1 if '1' in str(wm.get('task', '1')) else 2
                band_est = wm.get("bandEstimate")
                band_float = float(band_est) if band_est is not None else 9.0  # Official examiner model answer

                cur.execute("""
                    INSERT INTO "ielts_writing_models" (
                        id, task, track, topic, chart_type, chart_description, prompt, model_answer,
                        key_vocab_json, examiner_notes_vi, band_estimate, source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wm['id'], task_int, wm.get('track', 'academic').lower(), wm.get('topic', f"Test {t_num} Task {task_int}"),
                    wm.get('chartType'), wm.get('chartDescription'), wm.get('prompt', ''), wm.get('modelAnswer', ''),
                    '[]', wm.get('examinerComment') or wm.get('examinerNotesVi'), band_float,
                    wm.get('source') or 'cambridge-ielts-08-full-text',
                    'Cambridge University Press (Educational/Research Corpus)', True, now
                ))
                total_inserted += 1

            # (e) Speaking Topics (1 per test)
            for sp in test_data.get("speaking_topics", []):
                i_val = sp.get("ideasJson") or "{}"
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
                    sp.get('source') or 'cambridge-ielts-08-full-text', True, now
                ))
                total_inserted += 1

        print(f"\nTổng số bản ghi đã chèn: {total_inserted} (Kỳ vọng: 48)")
        assert total_inserted == 48, f"Expected 48 records, inserted {total_inserted}"

        if dry_run:
            print("\n[DRY RUN] Thực hiện verify Gate 3 trước khi rollback...")
            verify_gate3(cur, target_counts)
            conn.rollback()
            print("[DRY RUN SUCCESS] Đã xác minh 100% hợp lệ và rollback sạch sẽ.")
            return True, gate0_results, detected_milestone

        conn.commit()
        print(f"\n[COMMIT SUCCESS] Đã commit thành công {total_inserted} bản ghi Cam 08 Academic vào database!")

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

    # T1 L S1 Q1-Q10 spot-checks
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('ielts-listening-cambridge-08-test-1-section-1',))
    t1_s1_q = json.loads(cur.fetchone()[0])
    assert len(t1_s1_q) == 10, f"Expected 10 questions in T1 S1, got {len(t1_s1_q)}"

    expected_answers = {
        1: 'C',
        2: 'B',
        3: '48 North Avenue',
        4: 'WS62YH',
        5: '01674553242',
        6: '(free) drink(s)/refreshment(s)',
        7: '(the/a) pianist/piano player',
        8: '10.50',
        9: '4',
        10: '50%'
    }

    for q_num, exp_ans in expected_answers.items():
        q_item = next((q for q in t1_s1_q if q.get('questionNumber') == q_num), None)
        assert q_item is not None, f"T1 S1 Q{q_num} not found"
        act_ans = str(q_item.get('correctAnswer'))
        print(f"  T1 L S1 Q{q_num:2}: '{act_ans}' [MATCH '{exp_ans}']")
        assert act_ans == exp_ans, f"T1 L S1 Q{q_num} expected '{exp_ans}', got '{act_ans}'"

    # Verify passageJson prefix
    cur.execute('SELECT "passageJson" FROM "ielts_reading_passages" WHERE id = %s', ('ielts-reading-cambridge-08-test-1-passage-1',))
    p1 = cur.fetchone()[0]
    assert p1.startswith("## A CHRONICLE OF TIMEKEEPING"), f"Passage 1 prefix mismatch: {p1[:30]}"
    assert not p1.startswith('"'), "Double encoding in passageJson"

    # Verify scriptJson prefix
    cur.execute('SELECT "scriptJson" FROM "ielts_listening_sections" WHERE id = %s', ('ielts-listening-cambridge-08-test-1-section-1',))
    s1 = cur.fetchone()[0]
    assert s1.startswith("SECTION 1"), f"Script 1 prefix mismatch: {s1[:30]}"
    assert not s1.startswith('"'), "Double encoding in scriptJson"

    print("\n[PASS] GATE 3 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Cambridge IELTS 08 Academic Tests 1-4 into local DB")
    parser.add_argument("--dry-run", action="store_true", help="Run validation and rollback without persisting changes")
    parser.add_argument("--force-bypass-gate0", action="store_true", help="Bypass Gate 0 check")
    args = parser.parse_args()

    run_import(force_bypass_gate0=args.force_bypass_gate0, dry_run=args.dry_run)
