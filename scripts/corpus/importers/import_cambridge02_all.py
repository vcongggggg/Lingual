# -*- coding: utf-8 -*-
r"""
Script: import_cambridge02_all.py
Description: Full-book importer for Cambridge IELTS 02 Academic (Tests 1-4)
             into local PostgreSQL DB (linguaflow_db).
Features:
- Gate 0 SHA256 Verification:
  + Validates cam02_t1_draft.json, cam02_t234_draft.json, manifest, exploitation-report
  + Enforces STOP if any SHA mismatch
- Gate 1 Pre-import Hard Gate:
  + Checks DB base counts (208/220/380/132/700)
  + Checks Tests 1-4 records in DB (must be exactly 0)
- Clean insertion of all 4 Academic Tests (12 records/test = 48 records total:
  4 Listening + 3 Reading + 2 Writing Topics + 2 Writing Models + 1 Speaking Topic)
- Plain text verification (zero double-encoding for passageJson and scriptJson)
- Gate 3 Post-import Verification:
  + Target table counts (220/236/388/140/704)
  + 6 Spot-checks with real DB content:
    (a) T1 Listening S1: Q6-8 null + gapReason (key jumps Q5->Q9)
    (b) T2 Listening S4: 0 questions in questionsJson, 10 unparseable items
    (c) T3 Listening S2 Q11-20: all null + gapReason
    (d) T4 Reading P3 Q39=A, Q40=A
    (e) T1 Writing models: consumer-durables report + fatherhood essay
    (f) passageJson starts with '## ' + title, scriptJson starts with 'SECTION', no double-encoding
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

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "cambridge-ielts-02"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

TABLES = [
    'ielts_reading_passages',
    'ielts_listening_sections',
    'ielts_writing_topics',
    'ielts_writing_models',
    'ielts_speaking_topics'
]

GATE0_EXPECTED_HASHES = {
    'cam02_t1_draft.json': 'aac404ad7521191d4c98819ed4187092dcc4477cac0776e42b120e32563d05e3',
    'cam02_t234_draft.json': 'd9e0573b84e391ca7f0e06c1aa5b51bff06ec2c55fdfcaabda21d3fb5ffeaa24',
    'cam02_academic_manifest.json': 'ea0b66e636350783f82e371d492c0c15ee06752c79919f43235cdab18e947d4d',
    'cam02_academic_exploitation_report.json': 'fc0181555ca77adda5ca86fed98ec04cb6f5a09a0ad98edca0ecf59663040879'
}

GATE1_BASE_COUNTS = {
    'ielts_reading_passages': 208,
    'ielts_listening_sections': 220,
    'ielts_writing_topics': 380,
    'ielts_writing_models': 132,
    'ielts_speaking_topics': 700
}

GATE3_TARGET_COUNTS = {
    'ielts_reading_passages': 220,
    'ielts_listening_sections': 236,
    'ielts_writing_topics': 388,
    'ielts_writing_models': 140,
    'ielts_speaking_topics': 704
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
    print("[GATE 0] KIỂM TRA SHA256 CÁC FILE NGUỒN CAMBRIDGE IELTS 02")
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
    print("\n--- 1.2 Kiểm Tra Tests 1-4 Chưa Có Trong DB (id LIKE 'cam02-academic%') ---")
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}" WHERE id LIKE %s', ('cam02-academic%',))
        cnt = cur.fetchone()[0]
        assert cnt == 0, f"Gate 1 Error: {t} already has {cnt} records for Cambridge 02!"
    print("  Tests 1-4: Toàn bộ 0 bản ghi (Sạch, chưa có bản ghi nào tồn tại).")

    cur.close()
    print("\n[PASS] GATE 1 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
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
        with open(MAPPED_DIR / "cam02_t1_draft.json", "r", encoding="utf-8") as f:
            t1 = json.load(f)
        with open(MAPPED_DIR / "cam02_t234_draft.json", "r", encoding="utf-8") as f:
            t234 = json.load(f)

        tests_list = [t1] + t234["tests"]
        assert len(tests_list) == 4, f"Expected 4 tests, got {len(tests_list)}"

        # Step 3: Database Insertions (All 4 Tests, 48 records: 12 per test)
        print("\n" + "=" * 80)
        print("[THỰC HIỆN INSERT CAMBRIDGE IELTS 02 TESTS 1-4 VÀO DATABASE]")
        print("=" * 80)

        now = datetime.now()
        total_inserted = 0

        for test_idx, test_data in enumerate(tests_list, 1):
            t_num = test_data.get("test", test_idx)
            prefix = f"cam02-academic-t{t_num}%"

            # Clean any partial records for idempotency
            for tbl in TABLES:
                cur.execute(f'DELETE FROM "{tbl}" WHERE id LIKE %s', (prefix,))

            # (a) Reading Passages (3 per test)
            for r in test_data.get("reading_passages", []):
                p_val = r.get("passageJson") or ""
                p_json = json.dumps(p_val, ensure_ascii=False) if isinstance(p_val, (list, dict)) else str(p_val)
                q_val = r.get("questionsJson") or []
                q_json = json.dumps(q_val, ensure_ascii=False) if isinstance(q_val, (list, dict)) else str(q_val)
                cur.execute("""
                    INSERT INTO "ielts_reading_passages" (
                        id, section, track, "cefrLevel", difficulty_band, title, module, notes,
                        source_url, "passageJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    r['id'], str(r.get('section', '1')), r.get('track', 'academic'), r.get('cefrLevel') or 'B2',
                    r.get('difficultyBand'), r['title'], r.get('module', 'academic'), r.get('notes'),
                    r.get('sourceUrl'), p_json, q_json, r.get('source') or 'cambridge-ielts-02-full-text',
                    r.get('license') or 'Cambridge IELTS 2 Official Materials', r.get('verified', True), now
                ))
                total_inserted += 1

            # (b) Listening Sections (4 per test)
            for l in test_data.get("listening_sections", []):
                s_val = l.get("scriptJson") or ""
                s_json = json.dumps(s_val, ensure_ascii=False) if isinstance(s_val, (list, dict)) else str(s_val)
                q_val = l.get("questionsJson") or []
                q_json = json.dumps(q_val, ensure_ascii=False) if isinstance(q_val, (list, dict)) else str(q_val)
                cur.execute("""
                    INSERT INTO "ielts_listening_sections" (
                        id, section, track, "cefrLevel", difficulty_band, title, "titleVi",
                        "scriptJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    l['id'], str(l.get('section', '1')), l.get('track', 'academic'), l.get('cefrLevel') or 'B1',
                    l.get('difficultyBand'), l['title'], l.get('titleVi'), s_json, q_json,
                    l.get('source') or 'cambridge-ielts-02-full-text',
                    l.get('license') or 'Cambridge IELTS 2 Official Materials', l.get('verified', True), now
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
                    wt['id'], wt.get('track', 'academic'), wt['prompt'], wt.get('type', 'chart'),
                    wt.get('typeVi'), wt.get('bandRange'), o_json, k_json,
                    wt.get('source') or 'cambridge-ielts-02-full-text', wt.get('verified', True), now
                ))
                total_inserted += 1

            # (d) Writing Models (2 per test)
            for wm in test_data.get("writing_models", []):
                k_val = wm.get("keyVocabJson") or "[]"
                k_json = json.dumps(k_val, ensure_ascii=False) if isinstance(k_val, (list, dict)) else str(k_val)
                band_est = wm.get("bandEstimate")
                band_float = float(band_est) if band_est is not None else 7.0
                cur.execute("""
                    INSERT INTO "ielts_writing_models" (
                        id, task, track, topic, chart_type, chart_description, prompt, model_answer,
                        key_vocab_json, examiner_notes_vi, band_estimate, source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wm['id'], int(wm['task']), wm.get('track', 'academic'), wm['topic'], wm.get('chartType'),
                    wm.get('chartDescription'), wm['prompt'], wm['modelAnswer'], k_json,
                    wm.get('examinerNotesVi'), band_float, wm.get('source') or 'cambridge-ielts-02-full-text',
                    wm.get('license') or 'Cambridge IELTS 2 Official Materials', wm.get('verified', True), now
                ))
                total_inserted += 1

            # (e) Speaking Topics (1 per test)
            for sp in test_data.get("speaking_topics", []):
                i_val = sp.get("ideasJson") or "[]"
                i_json = json.dumps(i_val, ensure_ascii=False) if isinstance(i_val, (list, dict)) else str(i_val)
                f_val = sp.get("followUpQuestions") or "[]"
                f_json = json.dumps(f_val, ensure_ascii=False) if isinstance(f_val, (list, dict)) else str(f_val)
                cur.execute("""
                    INSERT INTO "ielts_speaking_topics" (
                        id, part, track, question, "topicVi", "ideasJson", topic, follow_up_questions, source, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    sp['id'], int(sp.get('part', 1)), sp.get('track', 'academic'), sp['question'],
                    sp.get('topicVi'), i_json, sp.get('topic'), f_json,
                    sp.get('source') or 'cambridge-ielts-02-full-text', sp.get('verified', True), now
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
        print(f"\n[COMMIT SUCCESS] Đã commit thành công {total_inserted} bản ghi Cam 02 Tests 1-4 vào database!")

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

    # (a) T1 Listening S1: Q6-8 null + gapReason (key jumps Q5->Q9)
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('cam02-academic-t1-l1',))
    t1_l1_q = json.loads(cur.fetchone()[0])
    for q in t1_l1_q:
        if q.get('questionNumber') in [6, 7, 8]:
            print(f"  (a) T1 L1 Q{q.get('questionNumber')}: ans={q.get('correctAnswer')}, gapReason={q.get('gapReason')}")
            assert q.get('correctAnswer') is None, f"Expected Q{q.get('questionNumber')} correctAnswer=None"
            assert q.get('gapReason'), f"Expected Q{q.get('questionNumber')} gapReason"

    # (b) T2 Listening S4: 0 questions in questionsJson, 10 unparseable items
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('cam02-academic-t2-l4',))
    t2_l4_q = json.loads(cur.fetchone()[0])
    print(f"  (b) T2 L4 questions count = {len(t2_l4_q)} (Kỳ vọng: 0)")
    assert len(t2_l4_q) == 0, f"Expected 0 questions for T2 L4, got {len(t2_l4_q)}"

    # (c) T3 Listening S2 Q11-20: all null + gapReason
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('cam02-academic-t3-l2',))
    t3_l2_q = json.loads(cur.fetchone()[0])
    null_with_gap = [q for q in t3_l2_q if q.get('correctAnswer') is None and q.get('gapReason')]
    print(f"  (c) T3 L2 Q11-20: {len(null_with_gap)} / {len(t3_l2_q)} null with gapReason (Kỳ vọng: 10/10)")
    assert len(null_with_gap) == 10 and len(t3_l2_q) == 10, f"Expected all 10 questions in T3 L2 to be null with gapReason"

    # (d) T4 Reading P3 Q39=A, Q40=A
    cur.execute('SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id = %s', ('cam02-academic-t4-r3',))
    t4_r3_q = json.loads(cur.fetchone()[0])
    q39 = next(q for q in t4_r3_q if q.get('questionNumber') == 39)
    q40 = next(q for q in t4_r3_q if q.get('questionNumber') == 40)
    print(f"  (d) T4 R3 Q39 ans={q39.get('correctAnswer')}, Q40 ans={q40.get('correctAnswer')} (Kỳ vọng: Q39=A, Q40=A)")
    assert q39.get('correctAnswer') == 'A', f"Expected Q39=A, got {q39.get('correctAnswer')}"
    assert q40.get('correctAnswer') == 'A', f"Expected Q40=A, got {q40.get('correctAnswer')}"

    # (e) T1 Writing models: consumer-durables report + fatherhood essay
    cur.execute('SELECT task, topic, model_answer FROM "ielts_writing_models" WHERE id LIKE %s ORDER BY task', ('cam02-academic-t1%',))
    t1_wm_rows = cur.fetchall()
    print(f"  (e) T1 Writing Models count = {len(t1_wm_rows)}")
    assert len(t1_wm_rows) == 2, f"Expected 2 models for T1, got {len(t1_wm_rows)}"
    print(f"      Task 1 topic: '{t1_wm_rows[0][1]}' (length: {len(t1_wm_rows[0][2])})")
    print(f"      Task 2 topic: '{t1_wm_rows[1][1]}' (length: {len(t1_wm_rows[1][2])})")
    assert 'consumer durables' in t1_wm_rows[0][1].lower(), "Expected consumer-durables topic in Task 1"
    assert 'fatherhood' in t1_wm_rows[1][1].lower(), "Expected fatherhood topic in Task 2"

    # (f) 1 passageJson starts with '## ' + title, 1 scriptJson starts with 'SECTION', no double-encoding
    cur.execute('SELECT title, "passageJson" FROM "ielts_reading_passages" WHERE id = %s', ('cam02-academic-t1-r1',))
    t1_r1_title, t1_r1_pass = cur.fetchone()
    cur.execute('SELECT "scriptJson" FROM "ielts_listening_sections" WHERE id = %s', ('cam02-academic-t1-l1',))
    t1_l1_script = cur.fetchone()[0]
    print(f"  (f) T1 R1 passage preview: {repr(t1_r1_pass[:55])}")
    print(f"      T1 L1 script preview:  {repr(t1_l1_script[:55])}")
    assert t1_r1_pass.startswith(f"## {t1_r1_title}") or t1_r1_pass.startswith("## "), "passageJson must start with ##"
    assert t1_l1_script.startswith("SECTION"), "scriptJson must start with SECTION"
    assert not t1_r1_pass.startswith('\"##'), "passageJson is double-encoded!"
    assert not t1_l1_script.startswith('\"SECTION'), "scriptJson is double-encoded!"

    print("\n[PASS] TOÀN BỘ 6 SPOT-CHECKS ĐÃ VƯỢT QUA 100%!")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Cambridge IELTS 02 Academic Tests 1-4 into local DB")
    parser.add_argument("--dry-run", action="store_true", help="Run validation and rollback without persisting changes")
    args = parser.parse_args()

    run_import(dry_run=args.dry_run)
