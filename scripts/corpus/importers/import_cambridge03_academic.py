# -*- coding: utf-8 -*-
r"""
Script: import_cambridge03_academic.py
Description: Full-book importer for Cambridge IELTS 03 Academic (Tests 1-4)
             into local PostgreSQL DB (linguaflow_db).
Task ID: lingual-cam03-academic-import-001

Features:
- Gate 0 SHA256 Verification:
  + Validates cam03_t1_draft.json, cam03_t234_draft.json, manifest, exploitation-report
  + Enforces STOP if any SHA mismatch
- Gate 1 Pre-import Hard Gate:
  + Checks DB base counts (220/236/388/140/704)
  + Checks Tests 1-4 records in DB (must be exactly 0)
- Pre-insert Counts Verification:
  + 12 records/test (4 Listening, 3 Reading, 2 Writing topics, 2 Writing models, 1 Speaking topic)
  + Questions mapped per test: T1: 60, T2: 57, T3: 56, T4: 69 -> Total 242 mapped questions
  + 78 unparseable items preserved in unparseable metadata, NOT converted to questions
- Clean insertion of all 4 Academic Tests (48 records total)
- Verbatim answer preservation:
  + T1 Listening S2 Q19: 'B // unemployed people // E // pregnant women // IN EITHER ORDER'
  + T1 Reading P3 Q34 and Q35: 'B // F // IN EITHER ORDER'
  + T3 Reading P3 Q35/36/37: 'B // rainy weather // IN ANY ORDER', 'D // high serotonin levels // IN ANY ORDER', 'E // sunny weather // IN ANY ORDER'
- Plain text verification (zero double-encoding for passageJson and scriptJson):
  + passageJson starts with '## '
  + scriptJson starts with 'SECTION'
  + Neither starts with quote character
  + Neither contains literal backslash-n
- Gate 3 Post-import Verification:
  + Target table counts (232/252/396/148/708)
  + Real DB Spot-checks:
    (a) T1 L S2 Q19 verbatim answer
    (b) T1 R P3 Q34 & Q35 verbatim answer on both
    (c) T3 R P3 Q35, Q36, Q37 verbatim answers
    (d) passageJson prefix '## THE ROCKET - FROM EAST TO WEST'
    (e) scriptJson prefix 'SECTION 1'
    (f) T1 L S1 and S3 have 0 mapped questions
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

sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parents[3]
IMPORTERS_DIR = Path(__file__).resolve().parent

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "cambridge-ielts-03"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

TABLES = [
    'ielts_reading_passages',
    'ielts_listening_sections',
    'ielts_writing_topics',
    'ielts_writing_models',
    'ielts_speaking_topics'
]

GATE0_EXPECTED_HASHES = {
    'cam03_t1_draft.json': 'a4b55ab03ef3019583474fb3ca387087b3c38d9e984bc9ba0eecbc1b7a3262a6',
    'cam03_t234_draft.json': '075a3da468d3c8101b7c1e3be167828b999662320d21754551408b2a393b8123',
    'cam03_academic_manifest.json': '6aa2a310f59a1e0d2961a45f8f332082d98b1f1030d31bbcad53b5ce20d0c518',
    'cam03_academic_exploitation_report.json': 'd2a4e0ef4169b7fac5aadbfc0a2ffe3f6d171ab12e6e643e6a0fee1e47509122'
}

GATE1_BASE_COUNTS = {
    'ielts_reading_passages': 220,
    'ielts_listening_sections': 236,
    'ielts_writing_topics': 388,
    'ielts_writing_models': 140,
    'ielts_speaking_topics': 704
}

GATE3_TARGET_COUNTS = {
    'ielts_reading_passages': 232,
    'ielts_listening_sections': 252,
    'ielts_writing_topics': 396,
    'ielts_writing_models': 148,
    'ielts_speaking_topics': 708
}

EXPECTED_QUESTIONS_PER_TEST = {
    1: 60,
    2: 57,
    3: 56,
    4: 69
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
    print("[GATE 0] KIỂM TRA SHA256 CÁC FILE NGUỒN CAMBRIDGE IELTS 03")
    print("=" * 80)

    results = {}
    has_mismatch = False

    for fname, exp_hash in GATE0_EXPECTED_HASHES.items():
        fpath = MAPPED_DIR / fname
        if not fpath.exists():
            print(f"  {fname:40}: KHÔNG TÌM THẤY TỆP! [FILE MISSING]")
            results[fname] = {"status": "MISSING", "actual": None, "expected": exp_hash}
            has_mismatch = True
            continue

        with open(fpath, "rb") as f:
            act_hash = hashlib.sha256(f.read()).hexdigest().lower()

        match = (act_hash == exp_hash.lower())
        status = "MATCH" if match else "MISMATCH"
        print(f"  {fname:40}: [{status}]")
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

    # 1. Base counts
    counts = get_counts(conn)
    print("\n--- 1.1 Base Counts DB Local ---")
    for t in TABLES:
        act = counts[t]
        exp = GATE1_BASE_COUNTS[t]
        status = "MATCH" if act == exp else "MISMATCH"
        print(f"  {t:26}: Hiện tại={act:3} | Kỳ vọng={exp:3} [{status}]")
        assert act == exp, f"Gate 1 Base count mismatch for {t}: actual={act}, expected={exp}"

    # 2. Tests 1-4 records in DB (must be exactly 0)
    print("\n--- 1.2 Kiểm Tra Tests 1-4 Chưa Có Trong DB (%cambridge-03% / cam03%) ---")
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}" WHERE id LIKE %s OR id LIKE %s', ('%cambridge-03%', 'cam03%'))
        cnt = cur.fetchone()[0]
        assert cnt == 0, f"Gate 1 Error: {t} already has {cnt} records for Cambridge 03!"
    print("  Tests 1-4: Toàn bộ 0 bản ghi (Sạch, chưa có bản ghi nào tồn tại).")

    cur.close()
    print("\n[PASS] GATE 1 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
    return True

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

def parse_int_safe(val, default=1):
    if isinstance(val, int):
        return val
    if isinstance(val, str):
        m = re.search(r'\d+', val)
        if m:
            return int(m.group(0))
    return default

def get_band_estimate(wm):
    band_est = wm.get("bandEstimate")
    if band_est is not None:
        return float(band_est)
    m = re.search(r'Band\s+([0-9]+(?:\.[0-9]+)?)', wm.get('source', ''))
    if m:
        return float(m.group(1))
    if 'examiner model' in wm.get('source', '').lower():
        return 8.5
    return 7.0

def verify_pre_insert_data(tests_list):
    print("\n" + "=" * 80)
    print("[PRE-INSERT VERIFICATION] XÁC THỰC HÌNH DẠNG & SỐ LƯỢNG CÂU HỎI TRƯỚC INSERT")
    print("=" * 80)

    total_mapped_all = 0
    total_unparseable_all = 0

    for test_idx, test_data in enumerate(tests_list, 1):
        t_num = test_data.get("test", test_idx)
        r_list = test_data.get("reading_passages", [])
        l_list = test_data.get("listening_sections", [])
        wt_list = test_data.get("writing_topics", [])
        wm_list = test_data.get("writing_models", [])
        sp_list = test_data.get("speaking_topics", [])

        # Shape verification: exactly 12 records per test
        rec_count = len(r_list) + len(l_list) + len(wt_list) + len(wm_list) + len(sp_list)
        print(f"\n--- Test {t_num} Shape: R={len(r_list)}, L={len(l_list)}, WT={len(wt_list)}, WM={len(wm_list)}, SP={len(sp_list)} (Total={rec_count}) ---")
        assert len(r_list) == 3, f"Test {t_num}: Expected 3 reading passages, got {len(r_list)}"
        assert len(l_list) == 4, f"Test {t_num}: Expected 4 listening sections, got {len(l_list)}"
        assert len(wt_list) == 2, f"Test {t_num}: Expected 2 writing topics, got {len(wt_list)}"
        assert len(wm_list) == 2, f"Test {t_num}: Expected 2 writing models, got {len(wm_list)}"
        assert len(sp_list) == 1, f"Test {t_num}: Expected 1 speaking topic, got {len(sp_list)}"
        assert rec_count == 12, f"Test {t_num}: Expected 12 records, got {rec_count}"

        # Question counts verification
        q_count = 0
        unp_count = 0

        for r in r_list:
            qs = parse_json_safely(r.get("questionsJson"))
            unps = parse_json_safely(r.get("unparseable"))
            q_count += len(qs)
            unp_count += len(unps)

        for l in l_list:
            qs = parse_json_safely(l.get("questionsJson"))
            unps = parse_json_safely(l.get("unparseable"))
            q_count += len(qs)
            unp_count += len(unps)

        exp_q = EXPECTED_QUESTIONS_PER_TEST[t_num]
        print(f"  Test {t_num} Mapped Questions: {q_count} [Kỳ vọng: {exp_q}] | Unparseable: {unp_count}")
        assert q_count == exp_q, f"Test {t_num}: Expected {exp_q} mapped questions, got {q_count}"

        total_mapped_all += q_count
        total_unparseable_all += unp_count

    print(f"\nTổng câu hỏi mapped: {total_mapped_all} (Kỳ vọng: 242) [MATCH]")
    print(f"Tổng unparseable:    {total_unparseable_all} (Kỳ vọng: 78) [MATCH]")
    assert total_mapped_all == 242, f"Expected 242 mapped questions, got {total_mapped_all}"
    assert total_unparseable_all == 78, f"Expected 78 unparseable questions, got {total_unparseable_all}"
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
        verify_gate1(conn)

        # Step 2: Load All 4 Tests Data
        with open(MAPPED_DIR / "cam03_t1_draft.json", "r", encoding="utf-8") as f:
            t1 = json.load(f)
        with open(MAPPED_DIR / "cam03_t234_draft.json", "r", encoding="utf-8") as f:
            t234 = json.load(f)

        tests_list = [t1] + t234["tests"]
        assert len(tests_list) == 4, f"Expected 4 tests, got {len(tests_list)}"

        # Step 2.5: Pre-insert verification
        verify_pre_insert_data(tests_list)

        # Step 3: Database Insertions (All 4 Tests, 48 records: 12 per test)
        print("\n" + "=" * 80)
        print("[THỰC HIỆN INSERT CAMBRIDGE IELTS 03 TESTS 1-4 VÀO DATABASE]")
        print("=" * 80)

        now = datetime.now()
        total_inserted = 0

        for test_idx, test_data in enumerate(tests_list, 1):
            t_num = test_data.get("test", test_idx)
            prefix1 = f"ielts-%-cambridge-03-test-{t_num}%"
            prefix2 = f"cam03-academic-t{t_num}%"

            # Clean any partial records for idempotency
            for tbl in TABLES:
                cur.execute(f'DELETE FROM "{tbl}" WHERE id LIKE %s OR id LIKE %s', (prefix1, prefix2))

            # (a) Reading Passages (3 per test)
            for r in test_data.get("reading_passages", []):
                p_val = r.get("passageJson") or ""
                p_json = json.dumps(p_val, ensure_ascii=False) if isinstance(p_val, (list, dict)) else str(p_val)
                q_val = r.get("questionsJson") or []
                q_json = json.dumps(q_val, ensure_ascii=False) if isinstance(q_val, (list, dict)) else str(q_val)

                # Strict check against double-encoding and format
                assert not p_json.startswith('\"##'), f"Double-encoding detected in passageJson: {r['id']}"
                assert p_json.startswith("## "), f"passageJson must start with '## ': {r['id']}"
                assert r"\n" not in p_json, f"Literal backslash-n detected in passageJson: {r['id']}"

                cur.execute("""
                    INSERT INTO "ielts_reading_passages" (
                        id, section, track, "cefrLevel", difficulty_band, title, module, notes,
                        source_url, "passageJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    r['id'], str(r.get('section', '1')), r.get('track', 'academic').lower(), r.get('cefrLevel') or 'B2',
                    r.get('difficultyBand'), r['title'], r.get('module', 'academic'), r.get('notes'),
                    r.get('sourceUrl'), p_json, q_json, r.get('source') or 'cambridge-ielts-03-full-text',
                    r.get('license') or 'Cambridge University Press (Educational/Research Corpus)', r.get('verified', True), now
                ))
                total_inserted += 1

            # (b) Listening Sections (4 per test)
            for l in test_data.get("listening_sections", []):
                s_val = l.get("scriptJson") or ""
                s_json = json.dumps(s_val, ensure_ascii=False) if isinstance(s_val, (list, dict)) else str(s_val)
                q_val = l.get("questionsJson") or []
                q_json = json.dumps(q_val, ensure_ascii=False) if isinstance(q_val, (list, dict)) else str(q_val)

                # Strict check against double-encoding and format
                assert not s_json.startswith('\"SECTION'), f"Double-encoding detected in scriptJson: {l['id']}"
                assert s_json.startswith("SECTION"), f"scriptJson must start with 'SECTION': {l['id']}"
                assert r"\n" not in s_json, f"Literal backslash-n detected in scriptJson: {l['id']}"

                cur.execute("""
                    INSERT INTO "ielts_listening_sections" (
                        id, section, track, "cefrLevel", difficulty_band, title, "titleVi",
                        "scriptJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    l['id'], str(l.get('section', '1')), l.get('track', 'academic').lower(), l.get('cefrLevel') or 'B1',
                    l.get('difficultyBand'), l['title'], l.get('titleVi'), s_json, q_json,
                    l.get('source') or 'cambridge-ielts-03-full-text',
                    l.get('license') or 'Cambridge University Press (Educational/Research Corpus)', l.get('verified', True), now
                ))
                total_inserted += 1

            # (c) Writing Topics (2 per test)
            for wt in test_data.get("writing_topics", []):
                o_val = wt.get("outlineJson") or "[]"
                o_json = json.dumps(o_val, ensure_ascii=False) if isinstance(o_val, (list, dict)) else str(o_val)
                k_val = wt.get("keyVocabJson") or "[]"
                k_json = json.dumps(k_val, ensure_ascii=False) if isinstance(k_val, (list, dict)) else str(k_val)
                cur.execute("""
                    INSERT INTO "ielts_writing_topics" (
                        id, track, prompt, type, "typeVi", band_range, "outlineJson", "keyVocabJson", source, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wt['id'], wt.get('track', 'academic').lower(), wt['prompt'], wt.get('type', 'Task 1'),
                    wt.get('typeVi'), wt.get('bandRange'), o_json, k_json,
                    wt.get('source') or 'cambridge-ielts-03-full-text', wt.get('verified', True), now
                ))
                total_inserted += 1

            # (d) Writing Models (2 per test)
            for wm in test_data.get("writing_models", []):
                k_val = wm.get("keyVocabJson") or "[]"
                k_json = json.dumps(k_val, ensure_ascii=False) if isinstance(k_val, (list, dict)) else str(k_val)
                task_int = parse_int_safe(wm.get('task'), 1)
                band_float = get_band_estimate(wm)
                cur.execute("""
                    INSERT INTO "ielts_writing_models" (
                        id, task, track, topic, chart_type, chart_description, prompt, model_answer,
                        key_vocab_json, examiner_notes_vi, band_estimate, source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wm['id'], task_int, wm.get('track', 'academic').lower(), wm['topic'], wm.get('chartType'),
                    wm.get('chartDescription'), wm['prompt'], wm['modelAnswer'], k_json,
                    wm.get('examinerNotesVi'), band_float, wm.get('source') or 'cambridge-ielts-03-full-text',
                    wm.get('license') or 'Cambridge University Press (Educational/Research Corpus)', wm.get('verified', True), now
                ))
                total_inserted += 1

            # (e) Speaking Topics (1 per test)
            for sp in test_data.get("speaking_topics", []):
                i_val = sp.get("ideasJson") or "[]"
                i_json = json.dumps(i_val, ensure_ascii=False) if isinstance(i_val, (list, dict)) else str(i_val)
                f_val = sp.get("followUpQuestions") or "[]"
                f_json = json.dumps(f_val, ensure_ascii=False) if isinstance(f_val, (list, dict)) else str(f_val)
                part_int = parse_int_safe(sp.get('part'), 1)
                cur.execute("""
                    INSERT INTO "ielts_speaking_topics" (
                        id, part, track, question, "topicVi", "ideasJson", topic, follow_up_questions, source, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    sp['id'], part_int, sp.get('track', 'academic').lower(), sp['question'],
                    sp.get('topicVi'), i_json, sp.get('topic'), f_json,
                    sp.get('source') or 'cambridge-ielts-03-full-text', sp.get('verified', True), now
                ))
                total_inserted += 1

        print(f"\nTổng số bản ghi đã chèn: {total_inserted} (Kỳ vọng: 48)")
        assert total_inserted == 48, f"Expected 48 records, inserted {total_inserted}"

        if dry_run:
            print("\n[DRY RUN] Thực hiện verify Gate 3 trước khi rollback...")
            verify_gate3(cur)
            conn.rollback()
            print("[DRY RUN SUCCESS] Đã xác minh 100% hợp lệ và rollback sạch sẽ.")
            return True, gate0_results

        conn.commit()
        print(f"\n[COMMIT SUCCESS] Đã commit thành công {total_inserted} bản ghi Cam 03 Tests 1-4 vào database!")

        # Step 4: Gate 3 Post-import Verification
        verify_gate3(cur)
        return True, gate0_results

    except Exception as e:
        conn.rollback()
        print(f"\n[FATAL ERROR] Rollback transaction do lỗi: {e}")
        raise
    finally:
        cur.close()
        conn.close()

def verify_gate3(cur):
    print("\n" + "=" * 80)
    print("[GATE 3] KIỂM TRA ĐÍCH SỐ LƯỢNG SAU IMPORT & SPOT-CHECKS")
    print("=" * 80)

    # 1. Target Counts
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        cnt = cur.fetchone()[0]
        exp = GATE3_TARGET_COUNTS[t]
        assert cnt == exp, f"Gate 3 Target mismatch for {t}: actual={cnt}, expected={exp}"
        print(f"  {t:26}: {cnt:3} [MATCH {exp}]")

    # 2. Spot-checks
    print("\n--- SPOT-CHECKS NỘI DUNG THỰC TẾ TỪ DATABASE ---")

    # (a) T1 Listening S2 Q19: 'B // unemployed people // E // pregnant women // IN EITHER ORDER'
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('ielts-listening-cambridge-03-test-1-section-2',))
    t1_l2_q = json.loads(cur.fetchone()[0])
    q19 = next((q for q in t1_l2_q if q.get('questionNumber') == 19), None)
    assert q19 is not None, "T1 L2 Q19 not found in questionsJson"
    exp_q19 = 'B // unemployed people // E // pregnant women // IN EITHER ORDER'
    print(f"  (a) T1 L2 Q19 ans: '{q19.get('correctAnswer')}'")
    assert q19.get('correctAnswer') == exp_q19, f"T1 L2 Q19 expected '{exp_q19}', got '{q19.get('correctAnswer')}'"

    # (b) T1 Reading P3 Q34 và Q35: 'B // F // IN EITHER ORDER' trên cả 2 câu
    cur.execute('SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id = %s', ('ielts-reading-cambridge-03-test-1-passage-3',))
    t1_r3_q = json.loads(cur.fetchone()[0])
    q34 = next((q for q in t1_r3_q if q.get('questionNumber') == 34), None)
    q35 = next((q for q in t1_r3_q if q.get('questionNumber') == 35), None)
    assert q34 is not None and q35 is not None, "T1 R3 Q34 or Q35 not found in questionsJson"
    exp_q34_35 = 'B // F // IN EITHER ORDER'
    print(f"  (b) T1 R3 Q34 ans: '{q34.get('correctAnswer')}' | Q35 ans: '{q35.get('correctAnswer')}'")
    assert q34.get('correctAnswer') == exp_q34_35, f"T1 R3 Q34 expected '{exp_q34_35}', got '{q34.get('correctAnswer')}'"
    assert q35.get('correctAnswer') == exp_q34_35, f"T1 R3 Q35 expected '{exp_q34_35}', got '{q35.get('correctAnswer')}'"

    # (c) T3 Reading P3 Q35/36/37: 'B // rainy weather // IN ANY ORDER', 'D // high serotonin levels // IN ANY ORDER', 'E // sunny weather // IN ANY ORDER'
    cur.execute('SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id = %s', ('ielts-reading-cambridge-03-test-3-passage-3',))
    t3_r3_q = json.loads(cur.fetchone()[0])
    t3_q35 = next((q for q in t3_r3_q if q.get('questionNumber') == 35), None)
    t3_q36 = next((q for q in t3_r3_q if q.get('questionNumber') == 36), None)
    t3_q37 = next((q for q in t3_r3_q if q.get('questionNumber') == 37), None)
    assert t3_q35 is not None and t3_q36 is not None and t3_q37 is not None, "T3 R3 Q35/36/37 not found"
    exp_t3_q35 = 'B // rainy weather // IN ANY ORDER'
    exp_t3_q36 = 'D // high serotonin levels // IN ANY ORDER'
    exp_t3_q37 = 'E // sunny weather // IN ANY ORDER'
    print(f"  (c) T3 R3 Q35 ans: '{t3_q35.get('correctAnswer')}'")
    print(f"      T3 R3 Q36 ans: '{t3_q36.get('correctAnswer')}'")
    print(f"      T3 R3 Q37 ans: '{t3_q37.get('correctAnswer')}'")
    assert t3_q35.get('correctAnswer') == exp_t3_q35, f"T3 R3 Q35 expected '{exp_t3_q35}', got '{t3_q35.get('correctAnswer')}'"
    assert t3_q36.get('correctAnswer') == exp_t3_q36, f"T3 R3 Q36 expected '{exp_t3_q36}', got '{t3_q36.get('correctAnswer')}'"
    assert t3_q37.get('correctAnswer') == exp_t3_q37, f"T3 R3 Q37 expected '{exp_t3_q37}', got '{t3_q37.get('correctAnswer')}'"

    # (d) Passage prefix '## THE ROCKET - FROM EAST TO WEST'
    cur.execute('SELECT "passageJson" FROM "ielts_reading_passages" WHERE id = %s', ('ielts-reading-cambridge-03-test-1-passage-1',))
    t1_r1_pass = cur.fetchone()[0]
    print(f"  (d) T1 R1 passage preview: {repr(t1_r1_pass[:50])}")
    assert t1_r1_pass.startswith('## THE ROCKET - FROM EAST TO WEST'), f"Expected passage starting with '## THE ROCKET - FROM EAST TO WEST', got {repr(t1_r1_pass[:50])}"
    assert not t1_r1_pass.startswith('\"##'), "passageJson is double-encoded!"

    # (e) Script prefix 'SECTION 1'
    cur.execute('SELECT "scriptJson" FROM "ielts_listening_sections" WHERE id = %s', ('ielts-listening-cambridge-03-test-1-section-1',))
    t1_l1_script = cur.fetchone()[0]
    print(f"  (e) T1 L1 script preview:  {repr(t1_l1_script[:50])}")
    assert t1_l1_script.startswith('SECTION 1'), f"Expected script starting with 'SECTION 1', got {repr(t1_l1_script[:50])}"
    assert not t1_l1_script.startswith('\"SECTION'), "scriptJson is double-encoded!"

    # (f) T1 L S1 and S3 import 0 questions (sections present, all image-only)
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('ielts-listening-cambridge-03-test-1-section-1',))
    t1_l1_q = json.loads(cur.fetchone()[0])
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('ielts-listening-cambridge-03-test-1-section-3',))
    t1_l3_q = json.loads(cur.fetchone()[0])
    print(f"  (f) T1 L S1 questions count = {len(t1_l1_q)} (Kỳ vọng: 0)")
    print(f"      T1 L S3 questions count = {len(t1_l3_q)} (Kỳ vọng: 0)")
    assert len(t1_l1_q) == 0, f"Expected 0 questions for T1 L1, got {len(t1_l1_q)}"
    assert len(t1_l3_q) == 0, f"Expected 0 questions for T1 L3, got {len(t1_l3_q)}"

    print("\n[PASS] TOÀN BỘ CÁC SPOT-CHECKS ĐÃ VƯỢT QUA 100%!")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Cambridge IELTS 03 Academic Tests 1-4 into local DB")
    parser.add_argument("--dry-run", action="store_true", help="Run validation and rollback without persisting changes")
    parser.add_argument("--force-bypass-gate0", action="store_true", help="Bypass Gate 0 check")
    args = parser.parse_args()

    run_import(force_bypass_gate0=args.force_bypass_gate0, dry_run=args.dry_run)
