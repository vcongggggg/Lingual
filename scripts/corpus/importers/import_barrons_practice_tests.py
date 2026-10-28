# -*- coding: utf-8 -*-
r"""
Script: import_barrons_practice_tests.py
Description: Importer for Barron's IELTS Practice Tests (Model Tests 2-3)
             into local PostgreSQL DB (linguaflow_db).
Task ID: lingual-barrons-import-001

Features:
- Gate 0 SHA256 Verification:
  + Validates barrons_t2_draft.json, barrons_t3_final.json, barrons_manifest.json, barrons_notes.md
  + Enforces STOP if any SHA mismatch
- Gate 1 Pre-import Hard Gate:
  + Checks DB base counts (232/252/396/148/708)
  + Checks Barron records in DB (must be exactly 0)
- Pre-insert Counts & Shape Verification:
  + T2 shape: 12 records (4L + 1R + 2WT + 2WM + 3SP) + 2 blockedPassages (not inserted)
  + T3 shape: 14 records (4L + 3R + 2WT + 2WM + 3SP)
  + Total records: 26
  + Questions mapped: T2 = 55 questions, T3 = 80 questions -> Total 135 mapped questions
  + Guard check: T2 Writing models must be taxes Agree + taxes Disagree; zero 'older people' or 'universities'
- Clean insertion of all 26 records:
  + Handles both 'questions' (list) in T2 and 'questionsJson' (JSON string) in T3
  + Set-valued answers preserved as JSON arrays (T2 L12-14 ['A','D','F'], L15-17 ['C','E','F'])
  + T3 R Q8-14 word box (12 words) preserved
  + All listening scriptJson = ''
- Gate 3 Post-import Verification:
  + Target table counts (236/260/400/152/714)
  + Real DB Spot-checks:
    (a) T2 W models = taxes Agree + taxes Disagree
    (b) T3 L Q39 = 'Organize your notes'
    (c) T3 R Q8-14 options = 12-word box
    (d) T2 R P2/P3 = 0 questions in DB
    (e) All 8 Barron scripts = ''
    (f) T2 L12-14 and L15-17 set-valued answers
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

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "barrons-ielts-practice-tests"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

TABLES = [
    'ielts_reading_passages',
    'ielts_listening_sections',
    'ielts_writing_topics',
    'ielts_writing_models',
    'ielts_speaking_topics'
]

GATE0_EXPECTED_HASHES = {
    'barrons_t2_draft.json': '76040f393e203fbecd9bad1ca7ea638010bd0f44b47e3843350e48f7d6f049c6',
    'barrons_t3_final.json': '5edee5bb0821a13f06d4ffb46f34927ec5e44110d1f3dcf2ee2294c521f04673',
    'barrons_manifest.json': 'd9d868bf250d3061b8c87ea1ae95dc30f970456f02dab85f3feec9b08d06d62f',
    'barrons_notes.md': '91e7fc31bfade97b925da5e06a8284d43e1a5ba9febbaba7637d554ae04dee7c'
}

GATE1_BASE_COUNTS = {
    'ielts_reading_passages': 232,
    'ielts_listening_sections': 252,
    'ielts_writing_topics': 396,
    'ielts_writing_models': 148,
    'ielts_speaking_topics': 708
}

GATE3_TARGET_COUNTS = {
    'ielts_reading_passages': 236,
    'ielts_listening_sections': 260,
    'ielts_writing_topics': 400,
    'ielts_writing_models': 152,
    'ielts_speaking_topics': 714
}

EXPECTED_QUESTIONS = {
    2: 55,
    3: 80
}

EXPECTED_WORD_BOX = [
    'mold', 'smelling', 'identify', 'allergens', 'avoiding', 'medicines',
    'eating', 'treat', 'antihistamine', 'anaphylaxis', 'causes', 'signs'
]

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
    print("[GATE 0] KIỂM TRA SHA256 CÁC FILE NGUỒN BARRON'S IELTS PRACTICE TESTS")
    print("=" * 80)

    results = {}
    has_mismatch = False

    for fname, exp_hash in GATE0_EXPECTED_HASHES.items():
        fpath = MAPPED_DIR / fname
        if not fpath.exists():
            print(f"  {fname:30}: KHÔNG TÌM THẤY TỆP! [FILE MISSING]")
            results[fname] = {"status": "MISSING", "actual": None, "expected": exp_hash}
            has_mismatch = True
            continue

        with open(fpath, "rb") as f:
            act_hash = hashlib.sha256(f.read()).hexdigest().lower()

        match = (act_hash == exp_hash.lower())
        status = "MATCH" if match else "MISMATCH"
        print(f"  {fname:30}: [{status}]")
        print(f"    Thực tế: {act_hash}")
        print(f"    Kỳ vọng: {exp_hash}")
        results[fname] = {"status": status, "actual": act_hash, "expected": exp_hash}
        if not match:
            has_mismatch = True

    return (not has_mismatch), results

def verify_gate1(conn):
    print("\n" + "=" * 80)
    print("[GATE 1] BẮT BUỘC TRƯỚC KHI IMPORT: BASE COUNTS & BARRON ZERO CHECK")
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

    # 2. Tests 2-3 records in DB (must be exactly 0)
    print("\n--- 1.2 Kiểm Tra Barron Chưa Có Trong DB (%barron%) ---")
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}" WHERE id LIKE %s OR source LIKE %s', ('%barron%', '%barron%'))
        cnt = cur.fetchone()[0]
        assert cnt == 0, f"Gate 1 Error: {t} already has {cnt} records for Barron's!"
    print("  Barron's records: Toàn bộ 0 bản ghi (Sạch, chưa có bản ghi nào tồn tại).")

    cur.close()
    print("\n[PASS] GATE 1 TOÀN BỘ ĐÃ VƯỢT QUA 100%!")
    return True

def extract_questions_list(item):
    if "questions" in item:
        q = item["questions"]
    elif "questionsJson" in item:
        q = item["questionsJson"]
    else:
        q = []

    if isinstance(q, str):
        q = q.strip()
        if not q:
            return []
        return json.loads(q)
    elif isinstance(q, list):
        return q
    return []

def serialize_questions_json(item):
    if "questionsJson" in item and item["questionsJson"]:
        q_val = item["questionsJson"]
        if isinstance(q_val, (list, dict)):
            return json.dumps(q_val, ensure_ascii=False)
        return str(q_val)
    elif "questions" in item and item["questions"]:
        q_val = item["questions"]
        if isinstance(q_val, (list, dict)):
            return json.dumps(q_val, ensure_ascii=False)
        return str(q_val)
    return "[]"

def verify_pre_insert_data(t2, t3):
    print("\n" + "=" * 80)
    print("[PRE-INSERT VERIFICATION] XÁC THỰC HÌNH DẠNG, SỐ LƯỢNG CÂU HỎI & EDITION GUARD")
    print("=" * 80)

    # 1. Shape verification
    # T2: 4L + 1R + 2WT + 2WM + 3SP = 12 records
    t2_l = len(t2.get("listening_sections", []))
    t2_r = len(t2.get("reading_passages", []))
    t2_wt = len(t2.get("writing_topics", []))
    t2_wm = len(t2.get("writing_models", []))
    t2_sp = len(t2.get("speaking_topics", []))
    t2_rec = t2_l + t2_r + t2_wt + t2_wm + t2_sp
    print(f"Test 2 Shape: L={t2_l}, R={t2_r}, WT={t2_wt}, WM={t2_wm}, SP={t2_sp} -> Total={t2_rec} (Kỳ vọng: 12)")
    assert t2_l == 4, f"T2 expected 4 listening, got {t2_l}"
    assert t2_r == 1, f"T2 expected 1 reading, got {t2_r}"
    assert t2_wt == 2, f"T2 expected 2 writing topics, got {t2_wt}"
    assert t2_wm == 2, f"T2 expected 2 writing models, got {t2_wm}"
    assert t2_sp == 3, f"T2 expected 3 speaking topics, got {t2_sp}"
    assert t2_rec == 12, f"T2 expected 12 records, got {t2_rec}"

    # T3: 4L + 3R + 2WT + 2WM + 3SP = 14 records
    t3_l = len(t3.get("listening_sections", []))
    t3_r = len(t3.get("reading_passages", []))
    t3_wt = len(t3.get("writing_topics", []))
    t3_wm = len(t3.get("writing_models", []))
    t3_sp = len(t3.get("speaking_topics", []))
    t3_rec = t3_l + t3_r + t3_wt + t3_wm + t3_sp
    print(f"Test 3 Shape: L={t3_l}, R={t3_r}, WT={t3_wt}, WM={t3_wm}, SP={t3_sp} -> Total={t3_rec} (Kỳ vọng: 14)")
    assert t3_l == 4, f"T3 expected 4 listening, got {t3_l}"
    assert t3_r == 3, f"T3 expected 3 reading, got {t3_r}"
    assert t3_wt == 2, f"T3 expected 2 writing topics, got {t3_wt}"
    assert t3_wm == 2, f"T3 expected 2 writing models, got {t3_wm}"
    assert t3_sp == 3, f"T3 expected 3 speaking topics, got {t3_sp}"
    assert t3_rec == 14, f"T3 expected 14 records, got {t3_rec}"

    total_records = t2_rec + t3_rec
    print(f"Tổng số bản ghi cả 2 tests: {total_records} (Kỳ vọng: 26)")
    assert total_records == 26, f"Expected 26 records, got {total_records}"

    # 2. Question count verification
    t2_q = sum(len(extract_questions_list(item)) for item in t2["listening_sections"] + t2["reading_passages"])
    t3_q = sum(len(extract_questions_list(item)) for item in t3["listening_sections"] + t3["reading_passages"])
    print(f"  Test 2 Mapped Questions: {t2_q} (Kỳ vọng: 55)")
    print(f"  Test 3 Mapped Questions: {t3_q} (Kỳ vọng: 80)")
    assert t2_q == 55, f"Test 2 expected 55 questions, got {t2_q}"
    assert t3_q == 80, f"Test 3 expected 80 questions, got {t3_q}"
    assert t2_q + t3_q == 135, f"Expected 135 total mapped questions, got {t2_q + t3_q}"

    # 3. Guard ngoai le edition: T2 Writing models must be taxes Agree + taxes Disagree
    for wm in t2["writing_models"]:
        wm_text = (wm.get("prompt", "") + " " + wm.get("topic", "") + " " + (wm.get("modelAnswer") or "")).lower()
        assert "older people" not in wm_text, f"Guard failed: 'older people' found in T2 model {wm.get('id')}"
        assert "universities" not in wm_text, f"Guard failed: 'universities' found in T2 model {wm.get('id')}"
        assert "tax" in wm_text, f"Guard failed: 'tax' not found in T2 model {wm.get('id')}"
    print("  Guard Edition Check: PASSED (T2 Writing Models = Universal Education Taxes, 0 extraneous text)")

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

        # Step 2: Load Data
        with open(MAPPED_DIR / "barrons_t2_draft.json", "r", encoding="utf-8") as f:
            t2 = json.load(f)
        with open(MAPPED_DIR / "barrons_t3_final.json", "r", encoding="utf-8") as f:
            t3 = json.load(f)

        # Step 2.5: Pre-insert checks
        verify_pre_insert_data(t2, t3)

        # Step 3: Database Insertions (26 records total: T2 12 + T3 14)
        print("\n" + "=" * 80)
        print("[THỰC HIỆN INSERT BARRON'S TESTS 2-3 VÀO DATABASE]")
        print("=" * 80)

        now = datetime.now()
        total_inserted = 0

        # Clean existing records for idempotency
        for tbl in TABLES:
            cur.execute(f'DELETE FROM "{tbl}" WHERE id LIKE %s OR id LIKE %s', ('barrons-academic-t2-%', 'barrons-academic-t3-%'))

        tests_to_insert = [
            (2, t2, "Barron's IELTS Practice Tests, Model Test 2"),
            (3, t3, "Barron's IELTS Practice Tests, Model Test 3")
        ]

        for t_num, test_data, source_title in tests_to_insert:
            print(f"\n--- Insert Test {t_num} Records ---")

            # (a) Reading Passages
            for r in test_data.get("reading_passages", []):
                p_val = r.get("passageJson") or ""
                p_json = json.dumps(p_val, ensure_ascii=False) if isinstance(p_val, (list, dict)) else str(p_val)
                q_json = serialize_questions_json(r)

                # Format checks
                assert p_json.startswith("## "), f"passageJson must start with '## ': {r['id']}"
                assert not p_json.startswith('\"##'), f"Double-encoding detected in passageJson: {r['id']}"
                assert r"\n" not in p_json, f"Literal backslash-n in passageJson: {r['id']}"

                cur.execute("""
                    INSERT INTO "ielts_reading_passages" (
                        id, section, track, "cefrLevel", difficulty_band, title, module, notes,
                        source_url, "passageJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    r['id'], str(r.get('section', '1')), r.get('track', 'academic').lower(), r.get('cefrLevel') or 'B2',
                    r.get('difficultyBand'), r['title'], r.get('module', 'academic'), r.get('notes'),
                    r.get('sourceUrl'), p_json, q_json, r.get('source') or f"{source_title}, Reading Passage {r.get('section', 1)}",
                    r.get('license') or "Barron's Educational Series (Educational/Research Corpus)", r.get('verified', True), now
                ))
                total_inserted += 1

            # (b) Listening Sections (All scriptJson = '')
            for l in test_data.get("listening_sections", []):
                s_json = ""  # Debt ghi ro theo yeu cau Muse: scriptJson = ''
                q_json = serialize_questions_json(l)

                cur.execute("""
                    INSERT INTO "ielts_listening_sections" (
                        id, section, track, "cefrLevel", difficulty_band, title, "titleVi",
                        "scriptJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    l['id'], str(l.get('section', '1')), l.get('track', 'academic').lower(), l.get('cefrLevel') or 'B1',
                    l.get('difficultyBand'), l['title'], l.get('titleVi'), s_json, q_json,
                    l.get('source') or f"{source_title}, Listening Section {l.get('section', 1)}",
                    l.get('license') or "Barron's Educational Series (Educational/Research Corpus)", l.get('verified', True), now
                ))
                total_inserted += 1

            # (c) Writing Topics
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
                    wt.get('source') or f"{source_title}, Writing Task", wt.get('verified', True), now
                ))
                total_inserted += 1

            # (d) Writing Models
            for wm in test_data.get("writing_models", []):
                k_val = wm.get("keyVocabJson") or "[]"
                k_json = json.dumps(k_val, ensure_ascii=False) if isinstance(k_val, (list, dict)) else str(k_val)
                task_int = int(re.search(r'\d+', str(wm.get('task', 2))).group(0))
                band_float = float(wm.get('bandEstimate') or 7.0)

                cur.execute("""
                    INSERT INTO "ielts_writing_models" (
                        id, task, track, topic, chart_type, chart_description, prompt, model_answer,
                        key_vocab_json, examiner_notes_vi, band_estimate, source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wm['id'], task_int, wm.get('track', 'academic').lower(), wm['topic'], wm.get('chartType'),
                    wm.get('chartDescription'), wm['prompt'], wm.get('modelAnswer') or wm.get('model_answer') or '', k_json,
                    wm.get('examinerNotesVi'), band_float, wm.get('source') or f"{source_title}, Writing Model",
                    wm.get('license') or "Barron's Educational Series (Educational/Research Corpus)", wm.get('verified', True), now
                ))
                total_inserted += 1

            # (e) Speaking Topics
            for sp in test_data.get("speaking_topics", []):
                i_val = sp.get("ideasJson") or "[]"
                i_json = json.dumps(i_val, ensure_ascii=False) if isinstance(i_val, (list, dict)) else str(i_val)
                f_val = sp.get("followUpQuestions") or "[]"
                f_json = json.dumps(f_val, ensure_ascii=False) if isinstance(f_val, (list, dict)) else str(f_val)
                part_int = int(re.search(r'\d+', str(sp.get('part', 1))).group(0))

                cur.execute("""
                    INSERT INTO "ielts_speaking_topics" (
                        id, part, track, question, "topicVi", "ideasJson", topic, follow_up_questions, source, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    sp['id'], part_int, sp.get('track', 'academic').lower(), sp['question'],
                    sp.get('topicVi'), i_json, sp.get('topic'), f_json,
                    sp.get('source') or f"{source_title}, Speaking", sp.get('verified', True), now
                ))
                total_inserted += 1

        print(f"\nTổng số bản ghi đã chèn: {total_inserted} (Kỳ vọng: 26)")
        assert total_inserted == 26, f"Expected 26 records, inserted {total_inserted}"

        if dry_run:
            print("\n[DRY RUN] Thực hiện verify Gate 3 trước khi rollback...")
            verify_gate3(cur)
            conn.rollback()
            print("[DRY RUN SUCCESS] Đã xác minh 100% hợp lệ và rollback sạch sẽ.")
            return True, gate0_results

        conn.commit()
        print(f"\n[COMMIT SUCCESS] Đã commit thành công {total_inserted} bản ghi Barron's Tests 2-3 vào database!")

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

    # (a) T2 Writing Models = taxes Agree + taxes Disagree
    cur.execute('SELECT id, topic, model_answer FROM "ielts_writing_models" WHERE id LIKE %s ORDER BY id', ('barrons-academic-t2-%',))
    wm_rows = cur.fetchall()
    assert len(wm_rows) == 2, f"Expected 2 writing models for Barron T2, got {len(wm_rows)}"
    for r in wm_rows:
        print(f"  (a) T2 WM {r[0]}: topic='{r[1]}', answer_len={len(r[2])}")
        text_full = (r[1] + " " + r[2]).lower()
        assert "tax" in text_full, f"Expected 'tax' in {r[0]}"
        assert "older people" not in text_full, f"Unexpected 'older people' in {r[0]}"
        assert "universities" not in text_full, f"Unexpected 'universities' in {r[0]}"

    # (b) T3 L Q39 = 'Organize your notes'
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('barrons-academic-t3-l4',))
    t3_l4_q = json.loads(cur.fetchone()[0])
    q39 = next((q for q in t3_l4_q if q.get('questionNumber') == 39), None)
    assert q39 is not None, "T3 L4 Q39 not found"
    print(f"  (b) T3 L4 Q39 ans: '{q39.get('correctAnswer')}'")
    assert q39.get('correctAnswer') == 'Organize your notes', f"Expected 'Organize your notes', got '{q39.get('correctAnswer')}'"

    # (c) T3 R Q8-14 options = hop 12 tu in san
    cur.execute('SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id = %s', ('barrons-academic-t3-r1',))
    t3_r1_q = json.loads(cur.fetchone()[0])
    wb_qs = [q for q in t3_r1_q if 8 <= q.get('questionNumber', 0) <= 14]
    assert len(wb_qs) == 7, f"Expected 7 word-box questions, got {len(wb_qs)}"
    for q in wb_qs:
        opts = q.get('options')
        assert opts == EXPECTED_WORD_BOX, f"Q{q.get('questionNumber')} word box mismatch: {opts}"
    print(f"  (c) T3 R1 Q8-14 word-box verified: 7/7 questions contain exact 12 options {EXPECTED_WORD_BOX[:4]}...")

    # (d) T2 R P2/P3 = 0 cau hoi trong DB (chi co P1)
    cur.execute('SELECT id FROM "ielts_reading_passages" WHERE id LIKE %s', ('barrons-academic-t2-%',))
    t2_r_rows = [r[0] for r in cur.fetchall()]
    print(f"  (d) T2 Reading passages in DB: {t2_r_rows} (Kỳ vọng: chỉ có barrons-academic-t2-r1)")
    assert t2_r_rows == ['barrons-academic-t2-r1'], f"Expected only barrons-academic-t2-r1, got {t2_r_rows}"

    # (e) Tat ca 8 Barron listening scripts = ''
    cur.execute('SELECT id, "scriptJson" FROM "ielts_listening_sections" WHERE id LIKE %s', ('barrons-academic-%',))
    l_rows = cur.fetchall()
    print(f"  (e) Barron listening sections in DB count = {len(l_rows)} (Kỳ vọng: 8)")
    assert len(l_rows) == 8, f"Expected 8 listening sections for Barron, got {len(l_rows)}"
    for lr in l_rows:
        assert lr[1] == '', f"Expected empty script for {lr[0]}, got {repr(lr[1])}"
    print("      Toàn bộ 8/8 scriptJson đều bằng '' (Clean debt as documented).")

    # (f) T2 L12-14 and L15-17 multi-select set-valued answers preserved as JSON array
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('barrons-academic-t2-l2',))
    t2_l2_q = json.loads(cur.fetchone()[0])
    q12 = next(q for q in t2_l2_q if q.get('questionNumber') == 12)
    q15 = next(q for q in t2_l2_q if q.get('questionNumber') == 15)
    print(f"  (f) T2 L2 Q12 ans: {q12.get('correctAnswer')}")
    print(f"      T2 L2 Q15 ans: {q15.get('correctAnswer')}")
    assert q12.get('correctAnswer') == ['A', 'D', 'F'], f"Expected ['A', 'D', 'F'], got {q12.get('correctAnswer')}"
    assert q15.get('correctAnswer') == ['C', 'E', 'F'], f"Expected ['C', 'E', 'F'], got {q15.get('correctAnswer')}"

    print("\n[PASS] TOÀN BỘ SPOT-CHECKS ĐÃ VƯỢT QUA 100%!")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Barron's IELTS Practice Tests 2-3 into local DB")
    parser.add_argument("--dry-run", action="store_true", help="Run validation and rollback without persisting changes")
    parser.add_argument("--force-bypass-gate0", action="store_true", help="Bypass Gate 0 check")
    args = parser.parse_args()

    run_import(force_bypass_gate0=args.force_bypass_gate0, dry_run=args.dry_run)
