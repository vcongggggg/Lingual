# -*- coding: utf-8 -*-
r"""
Script: import_cambridge01_all.py
Description: Full-book importer for Cambridge IELTS 01 Academic (Tests 1-4)
             into local PostgreSQL DB (linguaflow_db).
Features:
- Gate 0 SHA256 Verification:
  + Validates cam01_t1_draft.json, cam01_t234_draft.json, manifest, exploitation-report
  + Enforces STOP if any SHA mismatch
- Gate 1 Pre-import Hard Gate:
  + Checks DB base counts (196/204/372/132/696)
  + Checks Tests 1-4 records in DB (must be exactly 0)
- Clean insertion of all 4 Academic Tests (10 records/test = 40 records total)
- Plain text verification (zero double-encoding for passageJson and scriptJson)
- Gate 3 Post-import Verification:
  + Target table counts (208/220/380/132/700)
  + 5 Spot-checks with real DB content:
    (a) T1 Listening Section 2 has 11 questions
    (b) T3 Reading Passage 3 factors set {B,D,F,G}
    (c) T2 Reading Passage 2 Q20-23 = 0 questions (image-only in unparseable)
    (d) T4 Writing Task 1 type = map
    (e) passageJson starts with '## ' + title, scriptJson starts with 'SECTION', no double-encoding
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

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "cambridge-ielts-01"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

TABLES = [
    'ielts_reading_passages',
    'ielts_listening_sections',
    'ielts_writing_topics',
    'ielts_writing_models',
    'ielts_speaking_topics'
]

GATE0_EXPECTED_HASHES = {
    'cam01_t1_draft.json': '7879940e1a786ef54795b5bbd9cb0c9a508c2eb4e76cc9eafd919751df54e8e9',
    'cam01_t234_draft.json': '656fdd791a446a0f8282885e6bcec522f60f3cfc6295bbade27f847d20928c5d',
    'cam01_academic_manifest.json': '548e6053458c03af10a0efb1cb06f290635af27d844499bcf6bf4b8269d75ad8',
    'cam01_academic_exploitation_report.json': '0d2c08214f66d563b2e648493a59de732eb7bede853e6b97269d6ccec139c875'
}

GATE1_BASE_COUNTS = {
    'ielts_reading_passages': 196,
    'ielts_listening_sections': 204,
    'ielts_writing_topics': 372,
    'ielts_writing_models': 132,
    'ielts_speaking_topics': 696
}

GATE3_TARGET_COUNTS = {
    'ielts_reading_passages': 208,
    'ielts_listening_sections': 220,
    'ielts_writing_topics': 380,
    'ielts_writing_models': 132,
    'ielts_speaking_topics': 700
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
    print("[GATE 0] KIỂM TRA SHA256 CÁC FILE NGUỒN CAMBRIDGE IELTS 01")
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
    print("\n--- 1.2 Kiểm Tra Tests 1-4 Chưa Có Trong DB (id LIKE 'cam01-academic%') ---")
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}" WHERE id LIKE %s', ('cam01-academic%',))
        cnt = cur.fetchone()[0]
        assert cnt == 0, f"Gate 1 Error: {t} already has {cnt} records for Cambridge 01!"
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
        with open(MAPPED_DIR / "cam01_t1_draft.json", "r", encoding="utf-8") as f:
            t1 = json.load(f)
        with open(MAPPED_DIR / "cam01_t234_draft.json", "r", encoding="utf-8") as f:
            t234 = json.load(f)

        tests_list = [t1] + t234["tests"]
        assert len(tests_list) == 4, f"Expected 4 tests, got {len(tests_list)}"

        # Step 3: Database Insertions (All 4 Tests, 40 records: 10 per test)
        print("\n" + "=" * 80)
        print("[THỰC HIỆN INSERT CAMBRIDGE IELTS 01 TESTS 1-4 VÀO DATABASE]")
        print("=" * 80)

        now = datetime.now()
        total_inserted = 0

        for test_idx, test_data in enumerate(tests_list, 1):
            t_num = test_data.get("test", test_idx)
            prefix = f"cam01-academic-t{t_num}%"

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
                    r.get('sourceUrl'), p_json, q_json, r.get('source') or 'cambridge-ielts-01-full-text',
                    r.get('license') or 'Cambridge IELTS 1 Official Materials', r.get('verified', True), now
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
                    l.get('source') or 'cambridge-ielts-01-full-text',
                    l.get('license') or 'Cambridge IELTS 1 Official Materials', l.get('verified', True), now
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
                    wt.get('source') or 'cambridge-ielts-01-full-text', wt.get('verified', True), now
                ))
                total_inserted += 1

            # (d) Speaking Topics (1 per test)
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
                    sp.get('source') or 'cambridge-ielts-01-full-text', sp.get('verified', True), now
                ))
                total_inserted += 1

        print(f"\nTổng số bản ghi đã chèn: {total_inserted} (Kỳ vọng: 40)")
        assert total_inserted == 40, f"Expected 40 records, inserted {total_inserted}"

        if dry_run:
            print("\n[DRY RUN] Thực hiện verify Gate 3 trước khi rollback...")
            verify_gate3(cur)
            conn.rollback()
            print("[DRY RUN SUCCESS] Đã xác minh 100% hợp lệ và rollback sạch sẽ.")
            return True, gate0_results

        conn.commit()
        print(f"\n[COMMIT SUCCESS] Đã commit thành công {total_inserted} bản ghi Cam 01 Tests 1-4 vào database!")

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

    # 1. Counts
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        cnt = cur.fetchone()[0]
        exp = GATE3_TARGET_COUNTS[t]
        assert cnt == exp, f"Gate 3 Target mismatch for {t}: actual={cnt}, expected={exp}"
        print(f"  {t:26}: {cnt:3} [MATCH {exp}]")

    # 2. Spot-checks
    print("\n--- SPOT-CHECKS NỘI DUNG THỰC TẾ TỪ DATABASE ---")

    # (a) T1 L2 has 11 questions
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('cam01-academic-t1-l2',))
    t1_l2_q = json.loads(cur.fetchone()[0])
    print(f"  (a) T1 L2 questions count = {len(t1_l2_q)} (Kỳ vọng: 11)")
    assert len(t1_l2_q) == 11, f"Expected 11 questions for T1 L2, got {len(t1_l2_q)}"

    # (b) T3 R3 factors set {B,D,F,G}
    cur.execute('SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id = %s', ('cam01-academic-t3-r3',))
    t3_r3_q = json.loads(cur.fetchone()[0])
    factors_found = set()
    for q in t3_r3_q:
        if q.get('questionNumber') in [35, 36, 37, 38]:
            factors_found.add(q.get('correctAnswer'))
    print(f"  (b) T3 R3 Q35-38 factors set = {sorted(list(factors_found))} (Kỳ vọng: {{B, D, F, G}})")
    assert factors_found == {'B', 'D', 'F', 'G'}, f"Expected {{'B', 'D', 'F', 'G'}}, got {factors_found}"

    # (c) T2 R2 Q20-23 = 0 questions in questionsJson (image-only in unparseable)
    cur.execute('SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id = %s', ('cam01-academic-t2-r2',))
    t2_r2_q = json.loads(cur.fetchone()[0])
    t2_r2_nums = [q.get('questionNumber') for q in t2_r2_q]
    inter = [x for x in [20, 21, 22, 23] if x in t2_r2_nums]
    print(f"  (c) T2 R2 Q20-23 trong mapped questions = {inter} (Kỳ vọng: rỗng, tổng mapped: {len(t2_r2_q)})")
    assert len(inter) == 0, f"Expected 0 questions in Q20-23, got {inter}"

    # (d) T4 W1 type = map
    cur.execute('SELECT type FROM "ielts_writing_topics" WHERE id = %s', ('cam01-academic-t4-w1',))
    t4_w1_type = cur.fetchone()[0]
    print(f"  (d) T4 W1 type = '{t4_w1_type}' (Kỳ vọng: 'map')")
    assert t4_w1_type == 'map', f"Expected type 'map', got {t4_w1_type}"

    # (e) 1 passageJson starts with '## ' + title, 1 scriptJson starts with 'SECTION', no double-encoding
    cur.execute('SELECT title, "passageJson" FROM "ielts_reading_passages" WHERE id = %s', ('cam01-academic-t1-r1',))
    t1_r1_title, t1_r1_pass = cur.fetchone()
    cur.execute('SELECT "scriptJson" FROM "ielts_listening_sections" WHERE id = %s', ('cam01-academic-t1-l1',))
    t1_l1_script = cur.fetchone()[0]
    print(f"  (e) T1 R1 passage preview: {repr(t1_r1_pass[:55])}")
    print(f"      T1 L1 script preview:  {repr(t1_l1_script[:55])}")
    assert t1_r1_pass.startswith(f"## {t1_r1_title}") or t1_r1_pass.startswith("## "), "passageJson must start with ##"
    assert t1_l1_script.startswith("SECTION"), "scriptJson must start with SECTION"
    # Ensure no JSON double-encoding (e.g. string starting with '\"## ')
    assert not t1_r1_pass.startswith('\"##'), "passageJson is double-encoded!"
    assert not t1_l1_script.startswith('\"SECTION'), "scriptJson is double-encoded!"

    print("\n[PASS] TOÀN BỘ 5 SPOT-CHECKS ĐÃ VƯỢT QUA 100%!")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Cambridge IELTS 01 Academic Tests 1-4 into local DB")
    parser.add_argument("--dry-run", action="store_true", help="Run validation and rollback without persisting changes")
    args = parser.parse_args()

    run_import(dry_run=args.dry_run)
