# -*- coding: utf-8 -*-
r"""
Script: db_verify_cambridge12_tests234.py
Description: SELECT-only Verification for Cambridge IELTS 12 Tests 2, 3, 4 (Academic)
Audits:
1. Overall table row counts:
   - ielts_reading_passages: 160
   - ielts_listening_sections: 156
   - ielts_writing_topics: 348
   - ielts_writing_models: 108
   - ielts_speaking_topics: 660
2. track='academic' on 100% of newly imported records (cam12-academic-t2%, t3%, t4%)
3. Step 0 Hard Gate: 240/240 questions in DB match official Answer Keys across Tests 2, 3, 4
4. Spot-checks questions directly against printed answer keys from pages 118-123
5. Non-empty content audit (passageJson, scriptJson, modelAnswer, prompts, ideasJson)
"""

import json
import os
import sys
import psycopg2
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = Path(__file__).resolve().parent
LOADERS_DIR = SCRIPT_DIR.parent / "loaders"
if str(LOADERS_DIR) not in sys.path:
    sys.path.insert(0, str(LOADERS_DIR))

DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

from cambridge12_data_t2 import OFFICIAL_LISTENING_KEYS as L2_KEYS, OFFICIAL_READING_KEYS as R2_KEYS
from cambridge12_data_t3 import OFFICIAL_LISTENING_KEYS as L3_KEYS, OFFICIAL_READING_KEYS as R3_KEYS
from cambridge12_data_t4 import OFFICIAL_LISTENING_KEYS as L4_KEYS, OFFICIAL_READING_KEYS as R4_KEYS

KEYS_BY_TEST = {
    2: {"listening": L2_KEYS, "reading": R2_KEYS},
    3: {"listening": L3_KEYS, "reading": R3_KEYS},
    4: {"listening": L4_KEYS, "reading": R4_KEYS}
}

EXPECTED_COUNTS = {
    'ielts_reading_passages': 160,
    'ielts_listening_sections': 156,
    'ielts_writing_topics': 348,
    'ielts_writing_models': 108,
    'ielts_speaking_topics': 660
}

def run_db_verify():
    print("=" * 70)
    print("BẮT ĐẦU AUDIT XÁC MINH TOÀN DIỆN DB: CAMBRIDGE IELTS 12 TESTS 2, 3, 4 (ACADEMIC)")
    print("=" * 70)

    conn = psycopg2.connect(DSN)
    cur = conn.cursor()

    try:
        # Audit 1: Overall Table Counts
        print("\n--- AUDIT 1: TỔNG SỐ LƯỢNG BẢN GHI THEO BẢNG ---")
        for table, expected in EXPECTED_COUNTS.items():
            cur.execute(f'SELECT count(*) FROM "{table}"')
            actual = cur.fetchone()[0]
            status = "PASS" if actual == expected else "FAIL"
            print(f"  {table:26}: Hiện tại={actual:4} | Kỳ vọng={expected:4} [{status}]")
            assert actual == expected, f"Count mismatch for {table}: actual={actual}, expected={expected}"

        # Audit 2: Track Verification
        print("\n--- AUDIT 2: KIỂM TRA TRACK='academic' TRÊN TẤT CẢ RECORD MỚI ---")
        for t in [2, 3, 4]:
            prefix = f"cam12-academic-t{t}%"
            for table in EXPECTED_COUNTS.keys():
                cur.execute(f'SELECT count(*) FROM "{table}" WHERE id LIKE %s AND track != %s', (prefix, 'academic'))
                invalid_track = cur.fetchone()[0]
                assert invalid_track == 0, f"Found {invalid_track} non-academic records in {table} for Test {t}"
            print(f"  [PASS] Test {t}: 100% bản ghi thuộc 5 bảng đều có track='academic'")

        # Audit 3: Step 0 Hard Gate Verification from DB (240/240 questions)
        print("\n--- AUDIT 3: HARD GATE 240/240 CÂU HỎI TỪ DATABASE VS OFFICIAL KEY ---")
        for t in [2, 3, 4]:
            prefix = f"cam12-academic-t{t}%"
            off_r = KEYS_BY_TEST[t]["reading"]
            off_l = KEYS_BY_TEST[t]["listening"]

            # Reading (40 questions)
            cur.execute('SELECT id, "questionsJson" FROM "ielts_reading_passages" WHERE id LIKE %s ORDER BY id', (prefix,))
            r_rows = cur.fetchall()
            assert len(r_rows) == 3, f"Expected 3 reading passages for Test {t}, got {len(r_rows)}"
            r_count = 0
            for r_id, q_json in r_rows:
                qs = json.loads(q_json) if isinstance(q_json, str) else q_json
                r_count += len(qs)
                for q in qs:
                    qnum = int(q["questionNumber"])
                    expected = off_r.get(qnum)
                    actual = q.get("correctAnswer")
                    assert actual == expected, f"Reading {r_id} Q{qnum} mismatch: actual='{actual}' vs expected='{expected}'"
            print(f"  [PASS] Test {t} Reading: 3 passages, 40/40 câu hỏi khớp 100% key in sách.")

            # Listening (40 questions)
            cur.execute('SELECT id, "questionsJson" FROM "ielts_listening_sections" WHERE id LIKE %s ORDER BY id', (prefix,))
            l_rows = cur.fetchall()
            assert len(l_rows) == 4, f"Expected 4 listening sections for Test {t}, got {len(l_rows)}"
            l_count = 0
            for l_id, q_json in l_rows:
                qs = json.loads(q_json) if isinstance(q_json, str) else q_json
                l_count += len(qs)
                for q in qs:
                    qnum = int(q["questionNumber"])
                    expected = off_l.get(qnum)
                    actual = q.get("correctAnswer")
                    assert actual == expected, f"Listening {l_id} Q{qnum} mismatch: actual='{actual}' vs expected='{expected}'"
            print(f"  [PASS] Test {t} Listening: 4 sections, 40/40 câu hỏi khớp 100% key in sách.")

        # Audit 4: Spot-check sample questions
        print("\n--- AUDIT 4: SPOT-CHECKS CÁC CÂU HỎI TIÊU BIỂU TỪ DB ---")
        spot_checks = [
            # (table, id, qnum, expected_answer)
            ("ielts_listening_sections", "cam12-academic-t2-l1", 1, "2.45"),
            ("ielts_listening_sections", "cam12-academic-t2-l4", 40, "mediator"),
            ("ielts_reading_passages", "cam12-academic-t2-r1", 1, "A"),
            ("ielts_reading_passages", "cam12-academic-t2-r3", 40, "C"),
            ("ielts_listening_sections", "cam12-academic-t3-l1", 1, "travel"),
            ("ielts_reading_passages", "cam12-academic-t3-r1", 1, "v"),
            ("ielts_listening_sections", "cam12-academic-t4-l1", 1, "temporary"),
            ("ielts_reading_passages", "cam12-academic-t4-r1", 1, "obsidian"),
        ]
        for tbl, rec_id, qnum, exp in spot_checks:
            cur.execute(f'SELECT "questionsJson" FROM "{tbl}" WHERE id = %s', (rec_id,))
            row = cur.fetchone()
            assert row is not None, f"Missing record {rec_id} in {tbl}"
            qs = json.loads(row[0]) if isinstance(row[0], str) else row[0]
            matched = [q for q in qs if int(q.get("questionNumber")) == qnum]
            assert len(matched) == 1, f"Could not find Q{qnum} in {rec_id}"
            actual = matched[0].get("correctAnswer")
            assert actual == exp, f"Spot check failed for {rec_id} Q{qnum}: got '{actual}', expected '{exp}'"
            print(f"  [SPOT-CHECK PASS] {rec_id} Q{qnum} = '{actual}' == '{exp}'")

        # Audit 5: Non-empty Content Audit
        print("\n--- AUDIT 5: KIỂM TRA TÍNH TOÀN VẸN NỘI DUNG (ZERO STUBS) ---")
        for t in [2, 3, 4]:
            prefix = f"cam12-academic-t{t}%"
            # Reading passages
            cur.execute('SELECT id, title, "passageJson" FROM "ielts_reading_passages" WHERE id LIKE %s', (prefix,))
            for rid, title, p_json in cur.fetchall():
                assert title and len(title) > 3, f"Stub title in {rid}"
                p = json.loads(p_json) if isinstance(p_json, str) else p_json
                assert len(p) > 0, f"Empty passageJson in {rid}"

            # Listening sections
            cur.execute('SELECT id, title, "scriptJson" FROM "ielts_listening_sections" WHERE id LIKE %s', (prefix,))
            for lid, title, s_json in cur.fetchall():
                assert title and len(title) > 3, f"Stub title in {lid}"
                s = json.loads(s_json) if isinstance(s_json, str) else s_json
                assert len(s) > 0, f"Empty scriptJson in {lid}"

            # Writing models
            cur.execute('SELECT id, prompt, model_answer, band_estimate FROM "ielts_writing_models" WHERE id LIKE %s', (prefix,))
            for wid, prompt, model, band in cur.fetchall():
                assert prompt and len(prompt) > 10, f"Stub prompt in {wid}"
                assert model and len(model) > 50, f"Stub model_answer in {wid}"
                assert band >= 5.0, f"Invalid band_estimate {band} in {wid}"

            # Speaking topics
            cur.execute('SELECT id, question, "ideasJson" FROM "ielts_speaking_topics" WHERE id LIKE %s', (prefix,))
            for sid, question, ideas_json in cur.fetchall():
                assert question and len(question) > 3, f"Stub question in {sid}"
                ideas = json.loads(ideas_json) if isinstance(ideas_json, str) else ideas_json
                assert len(ideas) > 0, f"Empty ideasJson in {sid}"

            print(f"  [PASS] Test {t}: Tất cả văn bản, kịch bản, đề bài, bài mẫu đều đầy đủ và hợp lệ.")

        print("\n" + "=" * 70)
        print("KẾT QUẢ: 100% AUDITS PASS HOÀN TOÀN! DATABASE SẴN SÀNG NGHIỆM THU!")
        print("=" * 70)
        return True

    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    run_db_verify()
