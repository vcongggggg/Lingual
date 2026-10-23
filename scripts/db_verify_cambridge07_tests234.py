r"""
Script: db_verify_cambridge07_tests234.py
Task ID: lingual-map-cambridge07-tests234-db-verify-001
Title: [ORDER][DB-VERIFY SELECT-only] Kiem tra DB sau import Cam 07 Tests 2-4
Strictly SELECT-only queries. No INSERT/UPDATE/DELETE.
"""

import os
import sys
import json
import psycopg2
from pathlib import Path
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

EXPECTED_COUNTS = {
    'ielts_reading_passages': 124,
    'ielts_listening_sections': 108,
    'ielts_writing_topics': 324,
    'ielts_writing_models': 84,
    'ielts_speaking_topics': 624
}

def run_verification():
    print("=" * 70)
    print("DB-VERIFY: CAMBRIDGE IELTS 07 TESTS 2-4 (SELECT-ONLY)")
    print("=" * 70)

    conn = psycopg2.connect(DSN)
    cur = conn.cursor()

    # -------------------------------------------------------------------------
    # 1. ĐẾM SỐ BẢN GHI 5 BẢNG (SELECT COUNT(*))
    # -------------------------------------------------------------------------
    print("\n--- 1. KIỂM TRA SỐ LƯỢNG BẢN GHI 5 BẢNG ---")
    counts_table = []
    all_counts_ok = True

    for tbl, exp in EXPECTED_COUNTS.items():
        cur.execute(f'SELECT count(*) FROM "{tbl}"')
        actual = cur.fetchone()[0]
        match = (actual == exp)
        if not match:
            all_counts_ok = False
        counts_table.append({
            "table": tbl,
            "actual": actual,
            "expected": exp,
            "match": match
        })
        status = "PASS" if match else "FAIL"
        print(f"  {tbl:26}: Thực tế={actual:3} | Kỳ vọng={exp:3} [{status}]")

    if not all_counts_ok:
        print("[FAIL] Số lượng bản ghi không khớp kỳ vọng!")
        sys.exit(1)
    print("[PASS] 100% Số lượng bản ghi cả 5 bảng đều khớp chính xác kỳ vọng.")

    # -------------------------------------------------------------------------
    # 2. KIỂM TRA TRACK CỦA 42 BẢN GHI MỚI ('cam07-academic-t[234]-%')
    # -------------------------------------------------------------------------
    print("\n--- 2. KIỂM TRA TRACK CỦA 42 BẢN GHI MỚI ---")
    tables_for_42 = [
        ('ielts_reading_passages', 'cam07-academic-t%-r%', 9),
        ('ielts_listening_sections', 'cam07-academic-t%-l%', 12),
        ('ielts_writing_topics', 'cam07-academic-t%-w%', 6),
        ('ielts_writing_models', 'cam07-academic-t%-wm%', 6),
        ('ielts_speaking_topics', 'cam07-academic-t%-sp%', 9)
    ]

    records_42 = []
    track_failures = []

    for tbl, pat, exp_cnt in tables_for_42:
        for t in [2, 3, 4]:
            t_pat = pat.replace('%', str(t), 1)
            cur.execute(f'SELECT id, track FROM "{tbl}" WHERE id LIKE %s ORDER BY id', (t_pat,))
            rows = cur.fetchall()
            for r_id, r_track in rows:
                is_academic = (r_track == 'academic')
                records_42.append({
                    "table": tbl,
                    "id": r_id,
                    "track": r_track,
                    "valid": is_academic
                })
                if not is_academic:
                    track_failures.append({"table": tbl, "id": r_id, "track": r_track})

    print(f"  Tổng số bản ghi mới tìm thấy: {len(records_42)}/42")
    assert len(records_42) == 42, f"Kỳ vọng đúng 42 bản ghi mới, tìm thấy {len(records_42)}"

    if track_failures:
        print(f"[FAIL] Có {len(track_failures)} bản ghi không có track='academic': {track_failures}")
        sys.exit(1)
    print("  [PASS] 42/42 bản ghi mới (Tests 2, 3, 4) đều có track='academic' 100%.")

    # -------------------------------------------------------------------------
    # 3. ĐỌC NGUYÊN VĂN 1 BẢN GHI READING + 1 LISTENING MỖI TEST 2-4
    # -------------------------------------------------------------------------
    print("\n--- 3. ĐỌC NGUYÊN VĂN 1 READING + 1 LISTENING MỖI TEST 2-4 ---")
    audits_samples = []

    # Test 2
    # Reading: cam07-academic-t2-r1
    cur.execute('SELECT id, title, "passageJson", "questionsJson", track, source, verified FROM "ielts_reading_passages" WHERE id = %s', ('cam07-academic-t2-r1',))
    t2_r = cur.fetchone()
    # Listening: cam07-academic-t2-l1
    cur.execute('SELECT id, title, "scriptJson", "questionsJson", track, source, verified FROM "ielts_listening_sections" WHERE id = %s', ('cam07-academic-t2-l1',))
    t2_l = cur.fetchone()

    # Test 3
    # Reading: cam07-academic-t3-r2
    cur.execute('SELECT id, title, "passageJson", "questionsJson", track, source, verified FROM "ielts_reading_passages" WHERE id = %s', ('cam07-academic-t3-r2',))
    t3_r = cur.fetchone()
    # Listening: cam07-academic-t3-l3
    cur.execute('SELECT id, title, "scriptJson", "questionsJson", track, source, verified FROM "ielts_listening_sections" WHERE id = %s', ('cam07-academic-t3-l3',))
    t3_l = cur.fetchone()

    # Test 4
    # Reading: cam07-academic-t4-r1
    cur.execute('SELECT id, title, "passageJson", "questionsJson", track, source, verified FROM "ielts_reading_passages" WHERE id = %s', ('cam07-academic-t4-r1',))
    t4_r = cur.fetchone()
    # Listening: cam07-academic-t4-l2
    cur.execute('SELECT id, title, "scriptJson", "questionsJson", track, source, verified FROM "ielts_listening_sections" WHERE id = %s', ('cam07-academic-t4-l2',))
    t4_l = cur.fetchone()

    sample_pairs = [
        (2, t2_r, t2_l),
        (3, t3_r, t3_l),
        (4, t4_r, t4_l)
    ]

    for t_num, r_rec, l_rec in sample_pairs:
        assert r_rec is not None, f"Reading record Test {t_num} not found"
        assert l_rec is not None, f"Listening record Test {t_num} not found"

        r_qs = json.loads(r_rec[3])
        l_qs = json.loads(l_rec[3])

        print(f"\n  [TEST {t_num} SAMPLE AUDIT]")
        print(f"  * Reading ({r_rec[0]} - {r_rec[1]}): {len(r_qs)} câu hỏi, track='{r_rec[4]}'")
        for q in r_qs:
            stem = q.get("question", "")
            assert len(stem) > 10, f"Stub stem in {r_rec[0]} Q{q['questionNumber']}: {stem}"
            assert q.get("type"), f"Missing type in {r_rec[0]} Q{q['questionNumber']}"
            assert q.get("sourceRef"), f"Missing sourceRef in {r_rec[0]} Q{q['questionNumber']}"
            assert q.get("correctAnswer"), f"Missing answer in {r_rec[0]} Q{q['questionNumber']}"

        print(f"  * Listening ({l_rec[0]} - {l_rec[1]}): {len(l_qs)} câu hỏi, track='{l_rec[4]}'")
        for q in l_qs:
            stem = q.get("question", "")
            assert len(stem) > 10, f"Stub stem in {l_rec[0]} Q{q['questionNumber']}: {stem}"
            assert q.get("type"), f"Missing type in {l_rec[0]} Q{q['questionNumber']}"
            assert q.get("sourceRef"), f"Missing sourceRef in {l_rec[0]} Q{q['questionNumber']}"
            assert q.get("correctAnswer"), f"Missing answer in {l_rec[0]} Q{q['questionNumber']}"

        audits_samples.append({
            "test": t_num,
            "reading_id": r_rec[0],
            "reading_title": r_rec[1],
            "reading_q_count": len(r_qs),
            "reading_q1_sample": r_qs[0],
            "listening_id": l_rec[0],
            "listening_title": l_rec[1],
            "listening_q_count": len(l_qs),
            "listening_q1_sample": l_qs[0]
        })

    print("\n  [PASS] Toàn bộ câu hỏi trong mẫu đều có question (>10 ký tự), type, sourceRef, correctAnswer. ZERO stub.")

    # -------------------------------------------------------------------------
    # 4. SPOT-CHECK 5 ĐÁP ÁN ĐỌC TỪ DB VS KEY IN SÁCH
    # -------------------------------------------------------------------------
    print("\n--- 4. SPOT-CHECK 5 ĐÁP ÁN TỪ DB VS KEY IN SÁCH ---")
    spot_checks = [
        {
            "test": 2, "skill": "Listening", "table": "ielts_listening_sections",
            "record_id": "cam07-academic-t2-l1", "q_num": 1,
            "expected": "27 Bank Road",
            "page_ref": "Trang 154, Test 2 Listening Section 1, Question 1"
        },
        {
            "test": 2, "skill": "Reading", "table": "ielts_reading_passages",
            "record_id": "cam07-academic-t2-r1", "q_num": 1,
            "expected": "YES",
            "page_ref": "Trang 155, Test 2 Reading Passage 1, Question 1"
        },
        {
            "test": 3, "skill": "Listening", "table": "ielts_listening_sections",
            "record_id": "cam07-academic-t3-l2", "q_num": 12,
            "expected": "C",
            "page_ref": "Trang 156, Test 3 Listening Section 2, Question 12"
        },
        {
            "test": 3, "skill": "Reading", "table": "ielts_reading_passages",
            "record_id": "cam07-academic-t3-r1", "q_num": 7,
            "expected": "C",
            "page_ref": "Trang 157, Test 3 Reading Passage 1, Question 7"
        },
        {
            "test": 4, "skill": "Listening", "table": "ielts_listening_sections",
            "record_id": "cam07-academic-t4-l1", "q_num": 10,
            "expected": "this/that afternoon",
            "page_ref": "Trang 158, Test 4 Listening Section 1, Question 10"
        },
        {
            "test": 4, "skill": "Reading", "table": "ielts_reading_passages",
            "record_id": "cam07-academic-t4-r3", "q_num": 33,
            "expected": "I",
            "page_ref": "Trang 159, Test 4 Reading Passage 3, Question 33"
        }
    ]

    spot_results = []
    for sc in spot_checks:
        cur.execute(f'SELECT "questionsJson" FROM "{sc["table"]}" WHERE id = %s', (sc["record_id"],))
        row = cur.fetchone()
        assert row is not None, f"Bản ghi {sc['record_id']} không tồn tại"
        qs = json.loads(row[0]) if isinstance(row[0], str) else row[0]
        q_item = next((q for q in qs if q["questionNumber"] == sc["q_num"]), None)
        assert q_item is not None, f"Câu {sc['q_num']} không có trong {sc['record_id']}"
        actual = q_item["correctAnswer"]
        match = (actual == sc["expected"])
        status = "PASS" if match else "FAIL"
        res_item = {
            "test": sc["test"],
            "skill": sc["skill"],
            "record_id": sc["record_id"],
            "questionNumber": sc["q_num"],
            "db_answer": actual,
            "key_in_expected": sc["expected"],
            "page_ref": sc["page_ref"],
            "match": match
        }
        spot_results.append(res_item)
        print(f"  [{sc['skill']:9}] {sc['record_id']} Q{sc['q_num']:2}: DB='{actual}' | Key in='{sc['expected']}' [{status}]")
        print(f"            Nguồn: {sc['page_ref']}")
        assert match, f"Spot check mismatch: {sc['record_id']} Q{sc['q_num']}: actual='{actual}' vs expected='{sc['expected']}'"

    print("\n[PASS] 100% 6/6 câu hỏi spot-check khớp hoàn toàn với Answer Key in ấn chính thức!")

    cur.close()
    conn.close()

    return counts_table, records_42, audits_samples, spot_results

if __name__ == "__main__":
    run_verification()
