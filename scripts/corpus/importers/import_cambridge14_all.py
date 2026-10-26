# -*- coding: utf-8 -*-
r"""
Script: import_cambridge14_all.py
Description: Full-book close importer for Cambridge IELTS 14 Academic (Tests 2, 3, 4)
             into local PostgreSQL DB (linguaflow_db). Test 1 is preserved intact.
Features:
- Gate 1 Pre-import Hard Gate:
  + Checks DB base counts (175/176/358/118/675)
  + Checks Test 1 records in DB (exactly 14 records: 3 R + 4 L + 2 WT + 2 WM + 3 S)
  + Checks Tests 2-4 records in DB (must be exactly 0)
  + Checks SHA256 hashes of 5 mapped files (test-2, test-3, test-4, manifest, exploitation-report)
- Synchronizes aggregate files ielts_*.json in mapped folder across all 4 tests
- Clean insertion of Tests 2-4 (9 reading, 12 listening, 6 writing topics, 6 writing models, 9 speaking topics)
- Sets track='academic' across all records
- Gate 3 Post-import Verification:
  + Final table counts (184/188/364/124/684)
  + Spot-checks real DB content (at least 2 reading per test, prioritizing recovered gaps: T2 Q3+Q31, T3 Q9+Q36, T4 Q29+Q32)
  + Audit 60 chars of passageJson and scriptJson for clean plain text (zero double-encoding)
"""

import hashlib
import json
import os
import sys
from datetime import datetime
from pathlib import Path
import psycopg2

sys.stdout.reconfigure(encoding="utf-8")

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "cambridge-ielts-14"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

TABLES = [
    'ielts_reading_passages',
    'ielts_listening_sections',
    'ielts_writing_topics',
    'ielts_writing_models',
    'ielts_speaking_topics'
]

GATE1_BASE_COUNTS = {
    'ielts_reading_passages': 175,
    'ielts_listening_sections': 176,
    'ielts_writing_topics': 358,
    'ielts_writing_models': 118,
    'ielts_speaking_topics': 675
}

GATE1_TEST1_EXPECTED = {
    'ielts_reading_passages': 3,
    'ielts_listening_sections': 4,
    'ielts_writing_topics': 2,
    'ielts_writing_models': 2,
    'ielts_speaking_topics': 3
}

GATE1_HASHES = {
    'cam14-academic-test-2-data.json': 'b49dac68801fa40c8e856262fab80b0a9c88d8209d10b47724b94252ff247fc4',
    'cam14-academic-test-3-data.json': 'a9478f6e52c2ed6c723b8c7d7c31666075fbc8d8b73bdcca0b2588bd14bd8b74',
    'cam14-academic-test-4-data.json': '9f11c13d40a764bdc2554f3a6d7056566735218155faa8a0621cbd8845939e78',
    'manifest.json': 'bbd96eccc437910ab64a56346ee178f72f7cfcc9247cc626af9fc6de6f78ab1b',
    'exploitation-report.json': '1f405596af35641ad01cc7dedf98893920f83265271e0939863770a3d602f564'
}

GATE3_TARGET_COUNTS = {
    'ielts_reading_passages': 184,
    'ielts_listening_sections': 188,
    'ielts_writing_topics': 364,
    'ielts_writing_models': 124,
    'ielts_speaking_topics': 684
}

def get_counts(conn):
    cur = conn.cursor()
    counts = {}
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        counts[t] = cur.fetchone()[0]
    cur.close()
    return counts

def verify_gate1(conn):
    print("=" * 80)
    print("[GATE 1] BẮT BUỘC TRƯỚC KHI IMPORT: BASE COUNTS, TEST 1 CHECK, TEST 2-4 ZERO, SHA256")
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

    # 2. Test 1 records in DB (must be exactly 14 records)
    print("\n--- 1.2 Kiểm Tra Test 1 Trong DB (id LIKE 'cam14-academic-t1%') ---")
    total_t1 = 0
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}" WHERE id LIKE %s', ('cam14-academic-t1%',))
        cnt = cur.fetchone()[0]
        exp = GATE1_TEST1_EXPECTED[t]
        status = "MATCH" if cnt == exp else "MISMATCH"
        print(f"  {t:26}: Hiện tại={cnt:2} | Kỳ vọng={exp:2} [{status}]")
        assert cnt == exp, f"Gate 1 Test 1 count mismatch for {t}: actual={cnt}, expected={exp}"
        total_t1 += cnt
    print(f"  Tổng số bản ghi Test 1: {total_t1}/14 (Đủ và đúng)")
    assert total_t1 == 14, f"Gate 1 Test 1 total mismatch: {total_t1} != 14"

    # 3. Tests 2-4 records in DB (must be exactly 0)
    print("\n--- 1.3 Kiểm Tra Tests 2-4 Chưa Có Trong DB (id LIKE 'cam14-academic-t[234]%') ---")
    for test_num in [2, 3, 4]:
        for t in TABLES:
            cur.execute(f'SELECT count(*) FROM "{t}" WHERE id LIKE %s', (f'cam14-academic-t{test_num}%',))
            cnt = cur.fetchone()[0]
            assert cnt == 0, f"Gate 1 Error: {t} already has {cnt} records for Test {test_num}!"
    print("  Tests 2-4: Toàn bộ 0 bản ghi (Sạch, chưa có bản ghi nào tồn tại).")

    # 4. SHA256 Hashes
    print("\n--- 1.4 SHA256 Hashes Mapped Files ---")
    for fname, exp_hash in GATE1_HASHES.items():
        fpath = MAPPED_DIR / fname
        assert fpath.exists(), f"Missing file: {fpath}"
        with open(fpath, "rb") as f:
            h = hashlib.sha256(f.read()).hexdigest()
        status = "MATCH" if h == exp_hash else "MISMATCH"
        print(f"  {fname:35}: [{status}]")
        assert h == exp_hash, f"Gate 1 Hash mismatch for {fname}: actual={h}, expected={exp_hash}"

    cur.close()
    print("\n[PASS] GATE 1 TOÀN BỘ ĐÃ VƯỢT QUA 100%! BẮT ĐẦU IMPORT.")
    return True

def sync_aggregate_files(tests_data):
    print("\n" + "=" * 80)
    print("[ĐỒNG BỘ CÁC FILE TỔNG HỢP ielts_*.json TRONG MAPPED DIR]")
    print("=" * 80)

    all_readings = []
    all_listenings = []
    all_writing_topics = []
    all_writing_models = []
    all_speaking_topics = []

    for t in [1, 2, 3, 4]:
        d = tests_data[t]
        all_readings.extend(d["reading_passages"])
        all_listenings.extend(d["listening_sections"])
        all_writing_topics.extend(d["writing_topics"])
        all_writing_models.extend(d["writing_models"])
        all_speaking_topics.extend(d["speaking_topics"])

    aggregates = {
        "ielts_reading_passages.json": all_readings,
        "ielts_listening_sections.json": all_listenings,
        "ielts_writing_topics.json": all_writing_topics,
        "ielts_writing_models.json": all_writing_models,
        "ielts_speaking_topics.json": all_speaking_topics
    }

    for fname, items in aggregates.items():
        fp = MAPPED_DIR / fname
        with open(fp, "w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=False, indent=2)
        print(f"  Đã đồng bộ {fname:30}: {len(items):2} bản ghi (Tests 1-4).")

    print("[PASS] ĐÃ ĐỒNG BỘ HOÀN TẤT CẢ 5 FILE TỔNG HỢP.")

def run_import():
    conn = psycopg2.connect(DSN)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # Step 1: Gate 1
        verify_gate1(conn)

        # Step 2: Load All 4 Tests Data
        tests_data = {}
        for t in [1, 2, 3, 4]:
            p = MAPPED_DIR / f"cam14-academic-test-{t}-data.json"
            assert p.exists(), f"Missing file: {p}"
            with open(p, "r", encoding="utf-8") as f:
                tests_data[t] = json.load(f)

        # Step 3: Synchronize aggregate files across all 4 tests
        sync_aggregate_files(tests_data)

        # Step 4: Database Insertions (Tests 2, 3, 4 Only - DO NOT TOUCH TEST 1)
        print("\n" + "=" * 80)
        print("[THỰC HIỆN INSERT CAMBRIDGE IELTS 14 TESTS 2, 3, 4 VÀO DATABASE]")
        print("=" * 80)

        now = datetime.now()
        total_inserted = 0

        for t in [2, 3, 4]:
            data = tests_data[t]
            prefix = f"cam14-academic-t{t}%"

            # Clean any partial records for idempotency (only for tests 2, 3, 4)
            for tbl in TABLES:
                cur.execute(f'DELETE FROM "{tbl}" WHERE id LIKE %s', (prefix,))

            # (a) Reading Passages (3 per test)
            for r in data["reading_passages"]:
                p_val = r.get('passageJson') or ''
                p_json = json.dumps(p_val, ensure_ascii=False) if isinstance(p_val, (list, dict)) else str(p_val)
                q_val = r.get('questionsJson') or []
                q_json = json.dumps(q_val, ensure_ascii=False) if isinstance(q_val, (list, dict)) else str(q_val)
                cur.execute("""
                    INSERT INTO "ielts_reading_passages" (
                        id, section, track, "cefrLevel", difficulty_band, title, module, notes,
                        source_url, "passageJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    r['id'], str(r.get('section', '1')), r.get('track', 'academic'), r.get('cefrLevel', 'B2'), r.get('difficultyBand'),
                    r['title'], r.get('module', 'academic'), r.get('notes'), r.get('sourceUrl'), p_json, q_json, r.get('source') or 'cambridge-ielts-14-scan',
                    r.get('license'), r.get('verified', True), now
                ))
            total_inserted += len(data["reading_passages"])

            # (b) Listening Sections (4 per test)
            for l in data["listening_sections"]:
                s_val = l.get('scriptJson') or ''
                s_json = json.dumps(s_val, ensure_ascii=False) if isinstance(s_val, (list, dict)) else str(s_val)
                q_val = l.get('questionsJson') or []
                q_json = json.dumps(q_val, ensure_ascii=False) if isinstance(q_val, (list, dict)) else str(q_val)
                cur.execute("""
                    INSERT INTO "ielts_listening_sections" (
                        id, section, track, "cefrLevel", difficulty_band, title, "titleVi",
                        "scriptJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    l['id'], str(l.get('section', '1')), l.get('track', 'academic'), l.get('cefrLevel', 'B1'), l.get('difficultyBand'),
                    l['title'], l.get('titleVi'), s_json, q_json, l.get('source') or 'cambridge-ielts-14-scan',
                    l.get('license'), l.get('verified', True), now
                ))
            total_inserted += len(data["listening_sections"])

            # (c) Writing Topics (2 per test)
            for wt in data["writing_topics"]:
                o_val = wt.get('outlineJson') or []
                o_json = json.dumps(o_val, ensure_ascii=False) if isinstance(o_val, (list, dict)) else str(o_val)
                k_val = wt.get('keyVocabJson') or []
                k_json = json.dumps(k_val, ensure_ascii=False) if isinstance(k_val, (list, dict)) else str(k_val)
                cur.execute("""
                    INSERT INTO "ielts_writing_topics" (
                        id, track, prompt, type, "typeVi", band_range, "outlineJson", "keyVocabJson", source, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wt['id'], wt.get('track', 'academic'), wt['prompt'], wt.get('type', 'report'),
                    wt.get('typeVi'), wt.get('bandRange'), o_json, k_json, wt.get('source') or 'cambridge-ielts-14-scan',
                    wt.get('verified', True), now
                ))
            total_inserted += len(data["writing_topics"])

            # (d) Writing Models (2 per test)
            for wm in data["writing_models"]:
                k_val = wm.get('keyVocabJson') or []
                k_json = json.dumps(k_val, ensure_ascii=False) if isinstance(k_val, (list, dict)) else str(k_val)
                band_est = wm.get('bandEstimate')
                band_float = float(band_est) if band_est is not None else 6.0
                cur.execute("""
                    INSERT INTO "ielts_writing_models" (
                        id, task, track, topic, chart_type, chart_description, prompt, model_answer,
                        key_vocab_json, examiner_notes_vi, band_estimate, source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wm['id'], wm['task'], wm.get('track', 'academic'), wm['topic'], wm.get('chartType'), wm.get('chartDescription'),
                    wm['prompt'], wm['modelAnswer'], k_json, wm.get('examinerNotesVi'),
                    band_float, wm.get('source') or 'cambridge-ielts-14-scan',
                    wm.get('license'), wm.get('verified', True), now
                ))
            total_inserted += len(data["writing_models"])

            # (e) Speaking Topics (3 per test)
            for sp in data["speaking_topics"]:
                i_val = sp.get('ideasJson') or []
                i_json = json.dumps(i_val, ensure_ascii=False) if isinstance(i_val, (list, dict)) else str(i_val)
                cur.execute("""
                    INSERT INTO "ielts_speaking_topics" (
                        id, part, track, question, "topicVi", "ideasJson", topic, follow_up_questions, source, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    sp['id'], sp['part'], sp.get('track', 'academic'), sp['question'], sp.get('topicVi'), i_json,
                    sp.get('topic'), sp.get('followUpQuestions'), sp.get('source') or 'cambridge-ielts-14-scan',
                    sp.get('verified', True), now
                ))
            total_inserted += len(data["speaking_topics"])

        conn.commit()
        print(f"\n[COMMIT SUCCESS] Đã commit thành công {total_inserted} bản ghi Cam 14 Tests 2-4 vào database!")

        # Step 5: Gate 3 Post-import Verification
        verify_gate3(cur)

    except Exception as e:
        conn.rollback()
        print(f"\n[FATAL ERROR] Rollback transaction do lỗi: {e}")
        raise
    finally:
        cur.close()
        conn.close()

def verify_gate3(cur):
    print("\n" + "=" * 80)
    print("[GATE 3] XÁC MINH TOÀN DIỆN HẬU IMPORT (COUNTS, SPOT-CHECK, PASSAGE/SCRIPT)")
    print("=" * 80)

    # 1. Target Counts Check
    print("\n--- 3.1 Kiểm Tra Số Lượng Bản Ghi Đạt Chuẩn ---")
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        act = cur.fetchone()[0]
        tgt = GATE3_TARGET_COUNTS[t]
        status = "MATCH TARGET" if act == tgt else "MISMATCH"
        print(f"  {t:26}: Đích={tgt:3} | Thực tế={act:3} [{status}]")
        assert act == tgt, f"Gate 3 Target count mismatch for {t}: expected {tgt}, got {act}"

    # 2. Check 60 chars of passageJson and scriptJson for newly imported Tests 2, 3, 4
    print("\n--- 3.2 Kiểm Tra 60 Ký Tự Đầu Của passageJson và scriptJson (Tests 2, 3, 4) ---")
    for t in [2, 3, 4]:
        prefix = f"cam14-academic-t{t}%"
        cur.execute('SELECT id, "passageJson" FROM "ielts_reading_passages" WHERE id LIKE %s ORDER BY id', (prefix,))
        for r_id, pj in cur.fetchall():
            assert len(pj.strip()) > 300, f"Reading {r_id} is suspiciously short!"
            first60 = pj[:60].replace('\n', ' ')
            assert not first60.startswith('"{') and not first60.startswith('\\"'), f"Possible double-encoding in {r_id}"
            print(f"  [R] {r_id:22}: len={len(pj):4} | Đầu: {repr(first60[:45])}")

        cur.execute('SELECT id, "scriptJson" FROM "ielts_listening_sections" WHERE id LIKE %s ORDER BY id', (prefix,))
        for l_id, sj in cur.fetchall():
            assert len(sj.strip()) > 200, f"Listening {l_id} is suspiciously short!"
            first60 = sj[:60].replace('\n', ' ')
            assert not first60.startswith('"{') and not first60.startswith('\\"'), f"Possible double-encoding in {l_id}"
            print(f"  [L] {l_id:22}: len={len(sj):4} | Đầu: {repr(first60[:45])}")

    # 3. Spot-check Real Content from DB (at least 2 reading per test, prioritizing recovered gaps)
    print("\n--- 3.3 Spot-check Có Nội Dung Thật Từ DB (Ưu Tiên Các Câu Gap Vừa Merge) ---")
    spot_checks = [
        # Test 2
        ('cam14-academic-t2-r1', 3, 'T2 R Q3 (Recovered Gap: Alexander Henderson)'),
        ('cam14-academic-t2-r3', 31, 'T2 R Q31 (Recovered Gap: Matching Headings Section E)'),
        # Test 3
        ('cam14-academic-t3-r1', 9, 'T3 R Q9 (Recovered Gap: Intelligence Theories)'),
        ('cam14-academic-t3-r3', 36, 'T3 R Q36 (Recovered Gap: Power of Play)'),
        # Test 4
        ('cam14-academic-t4-r3', 29, 'T4 R Q29 (Recovered Gap: Marine Debris)'),
        ('cam14-academic-t4-r3', 32, 'T4 R Q32 (Recovered Gap: Mussels Plastic)')
    ]

    for item_id, qnum, label in spot_checks:
        cur.execute('SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id = %s', (item_id,))
        raw_q = cur.fetchone()[0]
        qs = json.loads(raw_q) if isinstance(raw_q, str) else raw_q
        target_q = next((q for q in qs if q.get("questionNumber") == qnum), None)
        assert target_q, f"Question {qnum} not found in {item_id}"
        print(f"\n  [CHECK] {label} -> {item_id} Q{qnum:02d}:")
        print(f"         Correct Answer : {target_q.get('correctAnswer')}")
        print(f"         Question Stem  : {repr(target_q.get('question'))}")
        print(f"         Options        : {target_q.get('options')}")
        print(f"         SourceRef      : {target_q.get('sourceRef')}")

    print("\n" + "=" * 80)
    print("[ALL PASS] GATE 3 AUDIT VƯỢT QUA 100% HOÀN HẢO!")
    print("=" * 80)

if __name__ == "__main__":
    run_import()
