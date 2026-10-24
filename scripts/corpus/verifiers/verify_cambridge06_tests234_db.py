r"""
Script: verify_cambridge06_tests234_db.py
Description: SELECT-only database verification for Cambridge IELTS 06 (lingual-map-cambridge06-tests234-db-verify-001)
Strictly READ-ONLY. No INSERT, UPDATE, or DELETE statements.
"""

import os
import sys
import json
import psycopg2
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

TABLES = [
    ('ielts_reading_passages', 112),
    ('ielts_listening_sections', 92),
    ('ielts_writing_topics', 316),
    ('ielts_writing_models', 76),
    ('ielts_speaking_topics', 612)
]

def main():
    print("=" * 70)
    print("[DB-VERIFY] BẮT ĐẦU KIỂM TRA ĐỘC LẬP DATABASE (SELECT-ONLY)")
    print("=" * 70)

    conn = psycopg2.connect(DSN)
    cur = conn.cursor()

    # -------------------------------------------------------------
    # 1. ĐẾM SỐ BẢN GHI 5 BẢNG
    # -------------------------------------------------------------
    print("\n--- 1. KIỂM TRA SỐ LƯỢNG BẢN GHI 5 BẢNG ---")
    counts_report = []
    all_counts_match = True

    for tbl, expected in TABLES:
        cur.execute(f'SELECT count(*) FROM "{tbl}"')
        actual = cur.fetchone()[0]
        match = (actual == expected)
        if not match:
            all_counts_match = False
        counts_report.append({
            "table": tbl,
            "actual": actual,
            "expected": expected,
            "match": match
        })
        status = "PASS" if match else "FAIL"
        print(f"  {tbl:26}: Thực tế={actual:3} | Kỳ vọng={expected:3} [{status}]")

    assert all_counts_match, "Số lượng bản ghi không khớp kỳ vọng!"

    # -------------------------------------------------------------
    # 2. KIỂM TRA TRACK CỦA 14 BẢN GHI TEST 1 CAM 06
    # -------------------------------------------------------------
    print("\n--- 2. KIỂM TRA CỘT TRACK CỦA 14 BẢN GHI TEST 1 CAM 06 ---")
    test1_tables = [
        ('ielts_listening_sections', 'cam06-academic-t1-l%'),
        ('ielts_reading_passages', 'cam06-academic-t1-r%'),
        ('ielts_writing_topics', 'cam06-academic-t1-w%'),
        ('ielts_writing_models', 'cam06-academic-t1-wm%'),
        ('ielts_speaking_topics', 'cam06-academic-t1-sp%')
    ]

    test1_records = []
    track_violations = []

    for tbl, pat in test1_tables:
        cur.execute(f'SELECT id, track FROM "{tbl}" WHERE id LIKE %s ORDER BY id', (pat,))
        rows = cur.fetchall()
        for r_id, r_track in rows:
            is_valid = (r_track == 'academic')
            test1_records.append({
                "table": tbl,
                "id": r_id,
                "track": r_track,
                "valid": is_valid
            })
            if not is_valid:
                track_violations.append((tbl, r_id, r_track))
            print(f"  [{tbl:24}] {r_id:25}: track='{r_track}' {'[OK]' if is_valid else '[INVALID]'}")

    print(f"\n  Tổng số bản ghi Test 1 tìm thấy: {len(test1_records)}/14")
    assert len(test1_records) == 14, f"Kỳ vọng 14 bản ghi Test 1, tìm thấy {len(test1_records)}"
    assert len(track_violations) == 0, f"Tìm thấy {len(track_violations)} bản ghi không có track='academic': {track_violations}"
    print("  [PASS] 14/14 bản ghi Test 1 đều có track='academic'!")

    # -------------------------------------------------------------
    # 3. SPOT-CHECK 5 ĐÁP ÁN TEST 2-4 ĐỌC TỪ DB VS KEY IN SÁCH
    # -------------------------------------------------------------
    print("\n--- 3. SPOT-CHECK 5 ĐÁP ÁN TEST 2-4 TỪ DB VS KEY IN SÁCH ---")
    # Chọn 5 câu đại diện:
    # 1. Test 2 Listening Q3 (Section 1): cam06-academic-t2-l1 -> "green button" (Trang 153)
    # 2. Test 2 Reading Q16 (Passage 2): cam06-academic-t2-r2 -> "F" (Trang 154)
    # 3. Test 3 Listening Q36 (Section 4): cam06-academic-t3-l4 -> "water, sand" (Trang 155)
    # 4. Test 3 Reading Q10 (Passage 1): cam06-academic-t3-r1 -> "B" (Trang 156)
    # 5. Test 4 Listening Q16 (Section 2): cam06-academic-t4-l2 -> "ground floor" (Trang 157)
    # 6. Test 4 Reading Q37 (Passage 3): cam06-academic-t4-r3 -> "(school) curriculum" (Trang 158)

    spot_checks = [
        {
            "test": 2, "skill": "Listening", "table": "ielts_listening_sections",
            "record_id": "cam06-academic-t2-l1", "q_num": 3,
            "expected": "green button", "page_ref": "Trang 153, Test 2 Listening Section 1, Question 3"
        },
        {
            "test": 2, "skill": "Reading", "table": "ielts_reading_passages",
            "record_id": "cam06-academic-t2-r2", "q_num": 16,
            "expected": "F", "page_ref": "Trang 154, Test 2 Reading Passage 2, Question 16"
        },
        {
            "test": 3, "skill": "Listening", "table": "ielts_listening_sections",
            "record_id": "cam06-academic-t3-l4", "q_num": 36,
            "expected": "water, sand", "page_ref": "Trang 155, Test 3 Listening Section 4, Question 36 ('IN EITHER ORDER: water / sand')"
        },
        {
            "test": 3, "skill": "Reading", "table": "ielts_reading_passages",
            "record_id": "cam06-academic-t3-r1", "q_num": 10,
            "expected": "B", "page_ref": "Trang 156, Test 3 Reading Passage 1, Question 10"
        },
        {
            "test": 4, "skill": "Listening", "table": "ielts_listening_sections",
            "record_id": "cam06-academic-t4-l2", "q_num": 16,
            "expected": "ground floor", "page_ref": "Trang 157, Test 4 Listening Section 2, Question 16"
        },
        {
            "test": 4, "skill": "Reading", "table": "ielts_reading_passages",
            "record_id": "cam06-academic-t4-r3", "q_num": 37,
            "expected": "(school) curriculum", "page_ref": "Trang 158, Test 4 Reading Passage 3, Question 37"
        }
    ]

    spot_results = []
    for sc in spot_checks:
        cur.execute(f'SELECT "questionsJson" FROM "{sc["table"]}" WHERE id = %s', (sc["record_id"],))
        row = cur.fetchone()
        assert row is not None, f"Không tìm thấy bản ghi {sc['record_id']}"
        qs = json.loads(row[0]) if isinstance(row[0], str) else row[0]
        q_item = next((q for q in qs if q["questionNumber"] == sc["q_num"]), None)
        assert q_item is not None, f"Không tìm thấy câu {sc['q_num']} trong {sc['record_id']}"
        actual = q_item["correctAnswer"]
        match = (actual == sc["expected"])
        sc_res = {
            "record_id": sc["record_id"],
            "questionNumber": sc["q_num"],
            "db_answer": actual,
            "key_in_expected": sc["expected"],
            "page_ref": sc["page_ref"],
            "match": match
        }
        spot_results.append(sc_res)
        status = "PASS" if match else "FAIL"
        print(f"  [{sc['skill']:9}] {sc['record_id']} Q{sc['q_num']:2}: DB='{actual}' | Key in='{sc['expected']}' [{status}]")
        print(f"            Nguồn: {sc['page_ref']}")
        assert match, f"Spot-check mismatch cho {sc['record_id']} Q{sc['q_num']}: actual='{actual}' vs expected='{sc['expected']}'"

    print("\n" + "=" * 70)
    print("[DB-VERIFY PASS] TẤT CẢ 3 TIÊU CHÍ VERIFY ĐỀU ĐẠT 100%!")
    print("=" * 70)

    cur.close()
    conn.close()

    return counts_report, test1_records, spot_results

if __name__ == "__main__":
    main()
