r"""
Script: verify_cambridge07_tests234_db.py
Description: SELECT-only database verification for Cambridge IELTS 07 (Tests 1-4)
Strictly READ-ONLY. No INSERT, UPDATE, or DELETE statements.
Audits:
- Exact total table counts: 124 readings, 108 listenings, 324 writing topics, 84 models, 624 speaking topics
- 100% of 56 Cambridge 07 records (Tests 1-4) have track='academic'
- 100% of 320 questions (160 Listening + 160 Reading) present in DB with valid stems and official answers
- Spot-checks against printed Answer Keys (pages 154-159)
"""

import os
import sys
import json
import psycopg2
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

TABLES = [
    ('ielts_reading_passages', 124),
    ('ielts_listening_sections', 108),
    ('ielts_writing_topics', 324),
    ('ielts_writing_models', 84),
    ('ielts_speaking_topics', 624)
]

def main():
    print("=" * 70)
    print("[DB-VERIFY] BẮT ĐẦU KIỂM TRA ĐỘC LẬP DATABASE CAMBRIDGE 07 (SELECT-ONLY)")
    print("=" * 70)

    conn = psycopg2.connect(DSN)
    cur = conn.cursor()

    # -------------------------------------------------------------
    # 1. ĐẾM SỐ BẢN GHI 5 BẢNG
    # -------------------------------------------------------------
    print("\n--- 1. KIỂM TRA SỐ LƯỢNG BẢN GHI 5 BẢNG ---")
    all_counts_match = True

    for tbl, expected in TABLES:
        cur.execute(f'SELECT count(*) FROM "{tbl}"')
        actual = cur.fetchone()[0]
        match = (actual == expected)
        if not match:
            all_counts_match = False
        status = "PASS" if match else "FAIL"
        print(f"  {tbl:26}: Thực tế={actual:3} | Kỳ vọng={expected:3} [{status}]")

    assert all_counts_match, "Số lượng bản ghi không khớp kỳ vọng!"
    print("  [PASS] Toàn bộ 5 bảng đều có số lượng bản ghi khớp 100% kỳ vọng!")

    # -------------------------------------------------------------
    # 2. KIỂM TRA TRACK CỦA TOÀN BỘ 56 BẢN GHI CAMBRIDGE 07 (TESTS 1-4)
    # -------------------------------------------------------------
    print("\n--- 2. KIỂM TRA CỘT TRACK='academic' TRÊN 56 BẢN GHI CAMBRIDGE 07 ---")
    sub_patterns = [
        ('ielts_listening_sections', 'cam07-academic-t%-l%', 16),
        ('ielts_reading_passages', 'cam07-academic-t%-r%', 12),
        ('ielts_writing_topics', 'cam07-academic-t%-w%', 8),
        ('ielts_writing_models', 'cam07-academic-t%-wm%', 8),
        ('ielts_speaking_topics', 'cam07-academic-t%-sp%', 12)
    ]

    total_cam07_records = 0
    track_violations = []

    for tbl, pat, exp_cnt in sub_patterns:
        cur.execute(f'SELECT id, track FROM "{tbl}" WHERE id LIKE %s ORDER BY id', (pat,))
        rows = cur.fetchall()
        assert len(rows) == exp_cnt, f"Table {tbl} expected {exp_cnt} records, got {len(rows)}"
        for r_id, r_track in rows:
            total_cam07_records += 1
            if r_track != 'academic':
                track_violations.append((tbl, r_id, r_track))

    print(f"  Tổng số bản ghi Cambridge 07 tìm thấy: {total_cam07_records}/56")
    assert total_cam07_records == 56, f"Kỳ vọng 56 bản ghi Cambridge 07, tìm thấy {total_cam07_records}"
    assert len(track_violations) == 0, f"Tìm thấy {len(track_violations)} bản ghi không có track='academic': {track_violations}"
    print("  [PASS] 56/56 bản ghi Cambridge 07 (Tests 1-4) đều có track='academic' 100%!")

    # -------------------------------------------------------------
    # 3. AUDIT ĐỘ TOÀN VẸN CÂU HỎI TỪ DATABASE (TESTS 1-4)
    # -------------------------------------------------------------
    print("\n--- 3. AUDIT 320 CÂU HỎI TRỰC TIẾP TỪ DATABASE (160 L + 160 R) ---")
    for t in [1, 2, 3, 4]:
        # Reading questions
        cur.execute('SELECT id, "questionsJson" FROM "ielts_reading_passages" WHERE id LIKE %s ORDER BY id', (f"cam07-academic-t{t}-r%",))
        r_rows = cur.fetchall()
        tot_r_qs = sum(len(json.loads(row[1])) for row in r_rows)
        for row in r_rows:
            qs = json.loads(row[1])
            for q in qs:
                assert len(q["question"]) > 10, f"Short reading question stem in {row[0]} Q{q['questionNumber']}"
                assert q.get("correctAnswer"), f"Missing answer in {row[0]} Q{q['questionNumber']}"
        assert tot_r_qs == 40, f"Test {t} Reading expected 40 questions, got {tot_r_qs}"

        # Listening questions
        cur.execute('SELECT id, "questionsJson" FROM "ielts_listening_sections" WHERE id LIKE %s ORDER BY id', (f"cam07-academic-t{t}-l%",))
        l_rows = cur.fetchall()
        tot_l_qs = sum(len(json.loads(row[1])) for row in l_rows)
        for row in l_rows:
            qs = json.loads(row[1])
            for q in qs:
                assert len(q["question"]) > 10, f"Short listening question stem in {row[0]} Q{q['questionNumber']}"
                assert q.get("correctAnswer"), f"Missing answer in {row[0]} Q{q['questionNumber']}"
        assert tot_l_qs == 40, f"Test {t} Listening expected 40 questions, got {tot_l_qs}"

        print(f"  Test {t}: 40 Reading + 40 Listening questions trong DB toàn vẹn, stems > 10 chars. [PASS]")

    print("  [PASS] 320/320 câu hỏi Tests 1-4 đều hiện diện đầy đủ và hợp lệ trong Database!")

    # -------------------------------------------------------------
    # 4. SPOT-CHECK 6 ĐÁP ÁN ĐẠI DIỆN TESTS 2, 3, 4 VỚI KEY IN TRANG 154-159
    # -------------------------------------------------------------
    print("\n--- 4. SPOT-CHECK 6 ĐÁP ÁN TEST 2-4 TỪ DB VS KEY IN SÁCH ---")
    spot_checks = [
        {
            "test": 2, "skill": "Listening", "table": "ielts_listening_sections",
            "record_id": "cam07-academic-t2-l1", "q_num": 2,
            "expected": "(a) dentist", "page_ref": "Trang 154, Test 2 Listening Section 1, Question 2 ('(a) dentist')"
        },
        {
            "test": 2, "skill": "Reading", "table": "ielts_reading_passages",
            "record_id": "cam07-academic-t2-r1", "q_num": 1,
            "expected": "YES", "page_ref": "Trang 155, Test 2 Reading Passage 1, Question 1 ('YES')"
        },
        {
            "test": 3, "skill": "Listening", "table": "ielts_listening_sections",
            "record_id": "cam07-academic-t3-l2", "q_num": 12,
            "expected": "C", "page_ref": "Trang 156, Test 3 Listening Section 2, Question 12"
        },
        {
            "test": 3, "skill": "Reading", "table": "ielts_reading_passages",
            "record_id": "cam07-academic-t3-r1", "q_num": 7,
            "expected": "C", "page_ref": "Trang 157, Test 3 Reading Passage 1, Question 7"
        },
        {
            "test": 4, "skill": "Listening", "table": "ielts_listening_sections",
            "record_id": "cam07-academic-t4-l1", "q_num": 10,
            "expected": "this/that afternoon", "page_ref": "Trang 158, Test 4 Listening Section 1, Question 10 ('this/that afternoon')"
        },
        {
            "test": 4, "skill": "Reading", "table": "ielts_reading_passages",
            "record_id": "cam07-academic-t4-r3", "q_num": 33,
            "expected": "I", "page_ref": "Trang 159, Test 4 Reading Passage 3, Question 33 ('I')"
        }
    ]

    for sc in spot_checks:
        cur.execute(f'SELECT "questionsJson" FROM "{sc["table"]}" WHERE id = %s', (sc["record_id"],))
        row = cur.fetchone()
        assert row is not None, f"Không tìm thấy bản ghi {sc['record_id']}"
        qs = json.loads(row[0]) if isinstance(row[0], str) else row[0]
        q_item = next((q for q in qs if q["questionNumber"] == sc["q_num"]), None)
        assert q_item is not None, f"Không tìm thấy câu {sc['q_num']} trong {sc['record_id']}"
        actual = q_item["correctAnswer"]
        match = (actual == sc["expected"])
        status = "PASS" if match else "FAIL"
        print(f"  [{sc['skill']:9}] {sc['record_id']} Q{sc['q_num']:2}: DB='{actual}' | Key in='{sc['expected']}' [{status}]")
        print(f"            Nguồn: {sc['page_ref']}")
        assert match, f"Spot-check mismatch cho {sc['record_id']} Q{sc['q_num']}: actual='{actual}' vs expected='{sc['expected']}'"

    print("\n" + "=" * 70)
    print("[DB-VERIFY PASS] DATABASE ĐÃ ĐƯỢC KIỂM TRA ĐỘC LẬP THÀNH CÔNG 100%!")
    print("=" * 70)

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
