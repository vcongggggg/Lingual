# -*- coding: utf-8 -*-
r"""
Script: import_cambridge14_pilot.py
Description: Pilot importer for Cambridge IELTS 14 Academic Test 1 (INSERT, only Test 1)
             into local PostgreSQL DB (linguaflow_db)
Features:
- Gate 1 Pre-import Hard Gate:
  + Checks DB base counts (172/172/356/116/672)
  + Checks SHA256 hashes of 3 mapped files (test-1-data, manifest, exploitation-report)
- Creates / updates aggregate files ielts_*.json in mapped folder with ONLY Test 1 records
- Idempotent clean insertion of 14 records (3 reading, 4 listening, 2 writing topics, 2 writing models, 3 speaking topics)
- Sets track='academic' across all records
- Gate 3 Post-import Verification:
  + Final table counts (175/176/358/118/675)
  + Spot-checks real DB content (at least 2 listening + 2 reading for Test 1)
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
    'ielts_reading_passages': 172,
    'ielts_listening_sections': 172,
    'ielts_writing_topics': 356,
    'ielts_writing_models': 116,
    'ielts_speaking_topics': 672
}

GATE1_HASHES = {
    'cam14-academic-test-1-data.json': '3e8bcafbdaa632a2b06352db087ad7e0835f7dec0efdfedcc4e441a5c136c239',
    'manifest.json': 'bbd96eccc437910ab64a56346ee178f72f7cfcc9247cc626af9fc6de6f78ab1b',
    'exploitation-report.json': '4da1e087f584ca7cd4c22844a4e2124c79c47ae729c425d805e761e98bffd69c'
}

GATE3_TARGET_COUNTS = {
    'ielts_reading_passages': 175,
    'ielts_listening_sections': 176,
    'ielts_writing_topics': 358,
    'ielts_writing_models': 118,
    'ielts_speaking_topics': 675
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
    print("=" * 75)
    print("[GATE 1] BẮT BUỘC TRƯỚC KHI IMPORT: KIỂM TRA BASE COUNTS & SHA256 HASHES")
    print("=" * 75)

    # 1. Base counts
    counts = get_counts(conn)
    print("\n--- 1.1 Base Counts DB Local ---")
    for t in TABLES:
        act = counts[t]
        exp = GATE1_BASE_COUNTS[t]
        status = "MATCH" if act == exp else "MISMATCH"
        print(f"  {t:26}: Hiện tại={act:3} | Kỳ vọng={exp:3} [{status}]")
        assert act == exp, f"Gate 1 Count mismatch for {t}: actual={act}, expected={exp}"

    # 2. SHA256 Hashes
    print("\n--- 1.2 SHA256 Hashes Mapped Files ---")
    for fname, exp_hash in GATE1_HASHES.items():
        fpath = MAPPED_DIR / fname
        assert fpath.exists(), f"Missing file: {fpath}"
        with open(fpath, "rb") as f:
            h = hashlib.sha256(f.read()).hexdigest()
        status = "MATCH" if h == exp_hash else "MISMATCH"
        print(f"  {fname:35}: [{status}]")
        assert h == exp_hash, f"Gate 1 Hash mismatch for {fname}: actual={h}, expected={exp_hash}"

    print("\n[PASS] GATE 1 TOÀN BỘ ĐÃ VƯỢT QUA 100%! BẮT ĐẦU IMPORT.")
    return True

def sync_aggregate_files(test1_data):
    print("\n" + "=" * 75)
    print("[TẠO/CẬP NHẬT CÁC FILE TỔNG HỢP ielts_*.json TRONG MAPPED DIR (CHỈ TEST 1)]")
    print("=" * 75)

    aggregates = {
        "ielts_reading_passages.json": test1_data["reading_passages"],
        "ielts_listening_sections.json": test1_data["listening_sections"],
        "ielts_writing_topics.json": test1_data["writing_topics"],
        "ielts_writing_models.json": test1_data["writing_models"],
        "ielts_speaking_topics.json": test1_data["speaking_topics"]
    }

    for fname, items in aggregates.items():
        fp = MAPPED_DIR / fname
        with open(fp, "w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=False, indent=2)
        print(f"  Đã ghi {fname:30}: {len(items):2} bản ghi (Test 1).")

    print("[PASS] ĐÃ TẠO/CẬP NHẬT HOÀN TẤT 5 FILE TỔNG HỢP.")

def run_import():
    conn = psycopg2.connect(DSN)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # Step 1: Gate 1
        verify_gate1(conn)

        # Step 2: Load Test 1 Data
        p = MAPPED_DIR / "cam14-academic-test-1-data.json"
        with open(p, "r", encoding="utf-8") as f:
            test1_data = json.load(f)

        # Step 3: Synchronize aggregate files with Test 1 only
        sync_aggregate_files(test1_data)

        # Step 4: Database Insertions (Test 1 Only)
        print("\n" + "=" * 75)
        print("[THỰC HIỆN INSERT CAMBRIDGE IELTS 14 TEST 1 VÀO DATABASE]")
        print("=" * 75)

        prefix = "cam14-academic-t1%"
        # Idempotency guard: clean any existing t1 records
        for t in TABLES:
            cur.execute(f'DELETE FROM "{t}" WHERE id LIKE %s', (prefix,))

        now = datetime.now()
        total_inserted = 0

        # (a) Reading Passages (3 records)
        for r in test1_data["reading_passages"]:
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
        total_inserted += len(test1_data["reading_passages"])

        # (b) Listening Sections (4 records)
        for l in test1_data["listening_sections"]:
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
        total_inserted += len(test1_data["listening_sections"])

        # (c) Writing Topics (2 records)
        for wt in test1_data["writing_topics"]:
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
        total_inserted += len(test1_data["writing_topics"])

        # (d) Writing Models (2 records)
        for wm in test1_data["writing_models"]:
            k_val = wm.get('keyVocabJson') or []
            k_json = json.dumps(k_val, ensure_ascii=False) if isinstance(k_val, (list, dict)) else str(k_val)
            cur.execute("""
                INSERT INTO "ielts_writing_models" (
                    id, task, track, topic, chart_type, chart_description, prompt, model_answer,
                    key_vocab_json, examiner_notes_vi, band_estimate, source, license, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                wm['id'], wm['task'], wm.get('track', 'academic'), wm['topic'], wm.get('chartType'), wm.get('chartDescription'),
                wm['prompt'], wm['modelAnswer'], k_json, wm.get('examinerNotesVi'),
                float(wm.get('bandEstimate', 6.0)), wm.get('source') or 'cambridge-ielts-14-scan',
                wm.get('license'), wm.get('verified', True), now
            ))
        total_inserted += len(test1_data["writing_models"])

        # (e) Speaking Topics (3 records)
        for sp in test1_data["speaking_topics"]:
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
        total_inserted += len(test1_data["speaking_topics"])

        conn.commit()
        print(f"\n[COMMIT SUCCESS] Đã commit thành công {total_inserted} bản ghi Cam 14 Test 1 vào database!")

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
    print("\n" + "=" * 75)
    print("[GATE 3] XÁC MINH TOÀN DIỆN HẬU IMPORT (COUNTS, SPOT-CHECK, PASSAGE/SCRIPT)")
    print("=" * 75)

    # 1. Target Counts Check
    print("\n--- 3.1 Kiểm Tra Số Lượng Bản Ghi Đạt Chuẩn ---")
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        act = cur.fetchone()[0]
        tgt = GATE3_TARGET_COUNTS[t]
        status = "MATCH TARGET" if act == tgt else "MISMATCH"
        print(f"  {t:26}: Đích={tgt:3} | Thực tế={act:3} [{status}]")
        assert act == tgt, f"Gate 3 Target count mismatch for {t}: expected {tgt}, got {act}"

    # 2. Check 60 chars of passageJson and scriptJson for Test 1
    print("\n--- 3.2 Kiểm Tra 60 Ký Tự Đầu Của passageJson và scriptJson (Test 1) ---")
    cur.execute('SELECT id, "passageJson" FROM "ielts_reading_passages" WHERE id LIKE %s ORDER BY id', ('cam14-academic-t1%',))
    for r_id, pj in cur.fetchall():
        assert len(pj.strip()) > 300, f"Reading {r_id} is suspiciously short!"
        first60 = pj[:60].replace('\n', ' ')
        assert not first60.startswith('"{') and not first60.startswith('\\"'), f"Possible double-encoding in {r_id}"
        print(f"  [R] {r_id:22}: len={len(pj):4} | Đầu: {repr(first60[:45])}")

    cur.execute('SELECT id, "scriptJson" FROM "ielts_listening_sections" WHERE id LIKE %s ORDER BY id', ('cam14-academic-t1%',))
    for l_id, sj in cur.fetchall():
        assert len(sj.strip()) > 200, f"Listening {l_id} is suspiciously short!"
        first60 = sj[:60].replace('\n', ' ')
        assert not first60.startswith('"{') and not first60.startswith('\\"'), f"Possible double-encoding in {l_id}"
        print(f"  [L] {l_id:22}: len={len(sj):4} | Đầu: {repr(first60[:45])}")

    # 3. Spot-check Real Content from DB (at least 2 listening + 2 reading for Test 1)
    print("\n--- 3.3 Spot-check Có Nội Dung Thật Từ DB (Test 1) ---")
    spot_checks = [
        ('cam14-academic-t1-l1', 'listening', 1),
        ('cam14-academic-t1-l4', 'listening', 31),
        ('cam14-academic-t1-r1', 'reading', 1),
        ('cam14-academic-t1-r3', 'reading', 36),
    ]

    for item_id, kind, qnum in spot_checks:
        tbl = "ielts_listening_sections" if kind == "listening" else "ielts_reading_passages"
        cur.execute(f'SELECT "questionsJson" FROM "{tbl}" WHERE id = %s', (item_id,))
        raw_q = cur.fetchone()[0]
        qs = json.loads(raw_q) if isinstance(raw_q, str) else raw_q
        target_q = next((q for q in qs if q.get("questionNumber") == qnum), None)
        assert target_q, f"Question {qnum} not found in {item_id}"
        print(f"  [{kind.upper()[:1]}] {item_id:22} Q{qnum:02d}: Answer='{target_q.get('correctAnswer')}'")
        print(f"       Stem: {repr(target_q.get('question')[:65])}...")
        print(f"       Options: {target_q.get('options')}")
        print(f"       SourceRef: {target_q.get('sourceRef')}")

    print("\n" + "=" * 75)
    print("[ALL PASS] GATE 3 AUDIT VƯỢT QUA 100% HOÀN HẢO!")
    print("=" * 75)

if __name__ == "__main__":
    run_import()
