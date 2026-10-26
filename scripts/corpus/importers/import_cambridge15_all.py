# -*- coding: utf-8 -*-
r"""
Script: import_cambridge15_all.py
Description: Full-book close importer for Cambridge IELTS 15 Academic (Tests 1-4)
             into local PostgreSQL DB (linguaflow_db).
Features:
- Gate 0 SHA256 Verification:
  + Validates T1, T2, T3, T4, manifest, exploitation-report
  + Enforces STOP if any SHA mismatch
- Gate 1 Pre-import Hard Gate:
  + Checks DB base counts (184/188/364/124/684)
  + Checks Tests 1-4 records in DB (must be exactly 0)
- Asset Validation (asset_validator.py):
  + Verifies imageRef files exist in QUESTION_ASSETS_DIR
  + Validates 12 map questions (T2 L2 Q15-20, T4 L2 Q11-16)
- Synchronizes aggregate files ielts_*.json in mapped folder across all 4 tests
- Clean insertion of all 4 tests (12 reading, 16 listening, 8 writing topics, 8 writing models, 12 speaking topics)
- Plain text verification (zero double-encoding for passageJson and scriptJson)
- Gate 3 Post-import Verification:
  + Target table counts (196/204/372/132/696)
  + Spot-checks real DB content (T2 R P3 Q38=YES, Q39=NO; T3 R P2 Q20=i; T2 L2 Q15-20=E,C,B,A,G,D; T4 L2 Q11-16=D,C,G,H,A,E)
"""

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
sys.path.insert(0, str(IMPORTERS_DIR))

from asset_validator import validate_questions_json_assets, get_assets_dir

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "cambridge-ielts-15"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

TABLES = [
    'ielts_reading_passages',
    'ielts_listening_sections',
    'ielts_writing_topics',
    'ielts_writing_models',
    'ielts_speaking_topics'
]

GATE0_EXPECTED_HASHES = {
    'cam15-academic-test-1-data.json': '3ee70e120105d9f944eb0a99321ce34cf542fda495f89ca09a382eaa812bc68a',
    'cam15-academic-test-2-data.json': 'd030287f9f0c4711d53833b44b8673c3cf91429d13f0f125e493125c932d261d',
    'cam15-academic-test-3-data.json': 'b309ceb554450b3b48cc14d8fb9b3b420345a06a5e07cd0c2ca46b7cff77caa8',
    'cam15-academic-test-4-data.json': '17f68421d07aca8fd74bbcce72764042c0d51afc78a1e576f6fc2cd91d29842a',
    'manifest.json': 'ddee2a9c3e34e2aa6641214d5009c9b6ab1561dd13b2af033fa79794b32f5959',
    'exploitation-report.json': 'ddae9e10c50854094b90203f0fd498b9b3a0e3a1bddeb0c9f123ff8e630fbec9'
}

GATE1_BASE_COUNTS = {
    'ielts_reading_passages': 184,
    'ielts_listening_sections': 188,
    'ielts_writing_topics': 364,
    'ielts_writing_models': 124,
    'ielts_speaking_topics': 684
}

GATE3_TARGET_COUNTS = {
    'ielts_reading_passages': 196,
    'ielts_listening_sections': 204,
    'ielts_writing_topics': 372,
    'ielts_writing_models': 132,
    'ielts_speaking_topics': 696
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
    print("[GATE 0] KIỂM TRA SHA256 CÁC FILE NGUỒN CAMBRIDGE IELTS 15")
    print("=" * 80)

    results = {}
    has_mismatch = False

    for fname, exp_hash in GATE0_EXPECTED_HASHES.items():
        fpath = MAPPED_DIR / fname
        if not fpath.exists():
            print(f"  {fname:32}: KHÔNG TÌM THẤY TỆP! [FILE MISSING]")
            results[fname] = {"status": "MISSING", "actual": None, "expected": exp_hash}
            has_mismatch = True
            continue

        with open(fpath, "rb") as f:
            act_hash = hashlib.sha256(f.read()).hexdigest().lower()

        match = (act_hash == exp_hash.lower())
        status = "MATCH" if match else "MISMATCH"
        print(f"  {fname:32}: [{status}]")
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
    print("\n--- 1.2 Kiểm Tra Tests 1-4 Chưa Có Trong DB (id LIKE 'cam15-academic%') ---")
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}" WHERE id LIKE %s', ('cam15-academic%',))
        cnt = cur.fetchone()[0]
        assert cnt == 0, f"Gate 1 Error: {t} already has {cnt} records for Cambridge 15!"
    print("  Tests 1-4: Toàn bộ 0 bản ghi (Sạch, chưa có bản ghi nào tồn tại).")

    cur.close()
    print("\n[PASS] GATE 1 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
    return True

def validate_all_assets(tests_data):
    print("\n" + "=" * 80)
    print("[VALIDATE QUESTION ASSETS (imageRef)]")
    print("=" * 80)

    assets_dir = get_assets_dir()
    print(f"Thư mục assets: {assets_dir}")

    expected_assets = {
        'cam15-t2-l2-minster-park-map.png',
        'cam15-t4-l2-croft-valley-park-map.png'
    }

    for a in expected_assets:
        ap = assets_dir / a
        assert ap.exists() and ap.is_file(), f"Asset file missing: {ap}"
        print(f"  Asset tồn tại: {a} ({ap.stat().st_size:,} bytes)")

    total_with_image = 0
    for t in [1, 2, 3, 4]:
        d = tests_data[t]
        for s in d.get("listening_sections", []):
            qs = s.get("questionsJson")
            q_list = json.loads(qs) if isinstance(qs, str) else qs
            v = validate_questions_json_assets(q_list, context_label=f"Cam15 T{t} L{s.get('section')}")
            total_with_image += len(v)

        for p in d.get("reading_passages", []):
            qs = p.get("questionsJson")
            q_list = json.loads(qs) if isinstance(qs, str) else qs
            v = validate_questions_json_assets(q_list, context_label=f"Cam15 T{t} R{p.get('section')}")
            total_with_image += len(v)

    print(f"\nTổng số câu hỏi có imageRef hợp lệ: {total_with_image}/12 câu")
    assert total_with_image == 12, f"Expected exactly 12 imageRef questions, got {total_with_image}"
    print("[PASS] VALIDATE ASSETS THÀNH CÔNG 100%!")

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
        tests_data = {}
        for t in [1, 2, 3, 4]:
            p = MAPPED_DIR / f"cam15-academic-test-{t}-data.json"
            assert p.exists(), f"Missing file: {p}"
            with open(p, "r", encoding="utf-8") as f:
                tests_data[t] = json.load(f)

        # Step 3: Validate Question Assets
        validate_all_assets(tests_data)

        # Step 4: Synchronize aggregate files
        sync_aggregate_files(tests_data)

        # Step 5: Database Insertions (All 4 Tests, 56 records)
        print("\n" + "=" * 80)
        print("[THỰC HIỆN INSERT CAMBRIDGE IELTS 15 TESTS 1-4 VÀO DATABASE]")
        print("=" * 80)

        now = datetime.now()
        total_inserted = 0

        for t in [1, 2, 3, 4]:
            data = tests_data[t]
            prefix = f"cam15-academic-t{t}%"

            # Clean any partial records for idempotency
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
                    r['title'], r.get('module', 'academic'), r.get('notes'), r.get('sourceUrl'), p_json, q_json, r.get('source') or 'cambridge-ielts-15-scan',
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
                    l['title'], l.get('titleVi'), s_json, q_json, l.get('source') or 'cambridge-ielts-15-scan',
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
                    wt.get('typeVi'), wt.get('bandRange'), o_json, k_json, wt.get('source') or 'cambridge-ielts-15-scan',
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
                    band_float, wm.get('source') or 'cambridge-ielts-15-scan',
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
                    sp.get('topic'), sp.get('followUpQuestions'), sp.get('source') or 'cambridge-ielts-15-scan',
                    sp.get('verified', True), now
                ))
            total_inserted += len(data["speaking_topics"])

        if dry_run:
            print("\n[DRY RUN] Thực hiện verify Gate 3 trước khi rollback...")
            verify_gate3(cur)
            conn.rollback()
            print("[DRY RUN SUCCESS] Đã xác minh 100% hợp lệ và rollback sạch sẽ.")
            return True, gate0_results

        conn.commit()
        print(f"\n[COMMIT SUCCESS] Đã commit thành công {total_inserted} bản ghi Cam 15 Tests 1-4 vào database!")

        # Step 6: Gate 3 Post-import Verification
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

    # 2. Check 60 chars of passageJson and scriptJson for newly imported Tests 1-4
    print("\n--- 3.2 Kiểm Tra 60 Ký Tự Đầu Của passageJson và scriptJson (Tests 1-4) ---")
    for t in [1, 2, 3, 4]:
        prefix = f"cam15-academic-t{t}%"
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

    # 3. Spot-check Real Content from DB
    print("\n--- 3.3 Spot-check Có Nội Dung Thật Từ DB ---")

    # (a) T2 Reading P3 Q38 = YES, Q39 = NO
    cur.execute('SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id = %s', ('cam15-academic-t2-r3',))
    qs = json.loads(cur.fetchone()[0])
    q38 = next(q for q in qs if q.get("questionNumber") == 38)
    q39 = next(q for q in qs if q.get("questionNumber") == 39)
    print(f"\n  [CHECK] T2 R P3 Q38: Answer={q38.get('correctAnswer')} | Stem={repr(q38.get('question'))[:60]}")
    print(f"  [CHECK] T2 R P3 Q39: Answer={q39.get('correctAnswer')} | Stem={repr(q39.get('question'))[:60]}")
    assert q38.get('correctAnswer') == 'YES', f"Expected YES for T2 R P3 Q38, got {q38.get('correctAnswer')}"
    assert q39.get('correctAnswer') == 'NO', f"Expected NO for T2 R P3 Q39, got {q39.get('correctAnswer')}"

    # (b) T3 Reading P2 Q20 = i
    cur.execute('SELECT "questionsJson", notes FROM "ielts_reading_passages" WHERE id = %s', ('cam15-academic-t3-r2',))
    row = cur.fetchone()
    qs3 = json.loads(row[0])
    notes3 = row[1]
    q20 = next(q for q in qs3 if q.get("questionNumber") == 20)
    print(f"\n  [CHECK] T3 R P2 Q20: Answer={q20.get('correctAnswer')} | Notes={repr(notes3)[:60]}")
    assert q20.get('correctAnswer') == 'i', f"Expected i for T3 R P2 Q20, got {q20.get('correctAnswer')}"

    # (c) T2 Listening Q15-20 = E, C, B, A, G, D (imageRef check)
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('cam15-academic-t2-l2',))
    qs_t2l2 = json.loads(cur.fetchone()[0])
    exp_t2 = {15: 'E', 16: 'C', 17: 'B', 18: 'A', 19: 'G', 20: 'D'}
    print("\n  [CHECK] T2 Listening Q15-20 (Minster Park Map):")
    for qn, ans in exp_t2.items():
        q_item = next(q for q in qs_t2l2 if q.get("questionNumber") == qn)
        print(f"    Q{qn}: ans={q_item.get('correctAnswer')} (exp={ans}) | imageRef={q_item.get('imageRef')}")
        assert q_item.get('correctAnswer') == ans, f"Mismatch on T2 L2 Q{qn}: {q_item.get('correctAnswer')} != {ans}"
        assert q_item.get('imageRef') == 'cam15-t2-l2-minster-park-map.png', f"Missing imageRef on Q{qn}"

    # (d) T4 Listening Q11-16 = D, C, G, H, A, E (imageRef check)
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('cam15-academic-t4-l2',))
    qs_t4l2 = json.loads(cur.fetchone()[0])
    exp_t4 = {11: 'D', 12: 'C', 13: 'G', 14: 'H', 15: 'A', 16: 'E'}
    print("\n  [CHECK] T4 Listening Q11-16 (Croft Valley Park Map):")
    for qn, ans in exp_t4.items():
        q_item = next(q for q in qs_t4l2 if q.get("questionNumber") == qn)
        print(f"    Q{qn}: ans={q_item.get('correctAnswer')} (exp={ans}) | imageRef={q_item.get('imageRef')}")
        assert q_item.get('correctAnswer') == ans, f"Mismatch on T4 L2 Q{qn}: {q_item.get('correctAnswer')} != {ans}"
        assert q_item.get('imageRef') == 'cam15-t4-l2-croft-valley-park-map.png', f"Missing imageRef on Q{qn}"

    print("\n" + "=" * 80)
    print("[ALL PASS] GATE 3 AUDIT VƯỢT QUA 100% HOÀN HẢO!")
    print("=" * 80)

if __name__ == "__main__":
    force_bypass = ("--force" in sys.argv)
    is_dry = ("--dry-run" in sys.argv)
    success, res = run_import(force_bypass_gate0=force_bypass, dry_run=is_dry)
    if not success:
        sys.exit(2)
