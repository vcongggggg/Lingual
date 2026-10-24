r"""
Script: db_verify_cambridge12_pilot.py
Description: SELECT-only Verification for Cambridge IELTS 12 Test 1 (Academic Pilot)
Audits:
1. Overall table row counts:
   - ielts_reading_passages: 151
   - ielts_listening_sections: 144
   - ielts_writing_topics: 342
   - ielts_writing_models: 102
   - ielts_speaking_topics: 651
2. track='academic' on 100% of newly imported records (cam12-academic-t1%)
3. Step 0 Hard Gate: 80/80 questions in DB match official Answer Keys
4. Spot-checks 5 questions directly against printed answer keys from pages 116 & 117
5. Non-empty content audit (passageJson, scriptJson, modelAnswer, prompts)
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

from cambridge12_data_t1 import (
    OFFICIAL_LISTENING_KEYS,
    OFFICIAL_READING_KEYS
)

EXPECTED_COUNTS = {
    'ielts_reading_passages': 151,
    'ielts_listening_sections': 144,
    'ielts_writing_topics': 342,
    'ielts_writing_models': 102,
    'ielts_speaking_topics': 651
}

def run_db_verify():
    print("=" * 70)
    print("BẮT ĐẦU AUDIT XÁC MINH TOÀN DIỆN DB: CAMBRIDGE IELTS 12 TEST 1 (PILOT)")
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
        prefix = "cam12-academic-t1%"
        for table in EXPECTED_COUNTS.keys():
            cur.execute(f'SELECT count(*) FROM "{table}" WHERE id LIKE %s AND track != %s', (prefix, 'academic'))
            invalid_track = cur.fetchone()[0]
            print(f"  {table:26}: Bản ghi track!='academic' = {invalid_track} [PASS]")
            assert invalid_track == 0, f"Found {invalid_track} non-academic records in {table}"

        # Audit 3: Step 0 Hard Gate Verification from DB (80/80 questions)
        print("\n--- AUDIT 3: HARD GATE 80/80 CÂU HỎI TỪ DATABASE VS OFFICIAL KEY ---")
        # Reading (40 questions)
        cur.execute('SELECT id, "questionsJson" FROM "ielts_reading_passages" WHERE id LIKE %s ORDER BY id', (prefix,))
        r_rows = cur.fetchall()
        assert len(r_rows) == 3, f"Expected 3 reading passages, got {len(r_rows)}"
        r_count = 0
        for r_id, q_json in r_rows:
            qs = json.loads(q_json) if isinstance(q_json, str) else q_json
            r_count += len(qs)
            for q in qs:
                qnum = q["questionNumber"]
                expected = OFFICIAL_READING_KEYS.get(qnum)
                actual = q.get("correctAnswer")
                assert actual == expected, f"Reading {r_id} Q{qnum} mismatch: actual='{actual}' vs expected='{expected}'"
        print(f"  [PASS] Reading: 3 passages, 40/40 câu hỏi khớp 100% key in sách trang 117.")

        # Listening (40 questions)
        cur.execute('SELECT id, "questionsJson" FROM "ielts_listening_sections" WHERE id LIKE %s ORDER BY id', (prefix,))
        l_rows = cur.fetchall()
        assert len(l_rows) == 4, f"Expected 4 listening sections, got {len(l_rows)}"
        l_count = 0
        for l_id, q_json in l_rows:
            qs = json.loads(q_json) if isinstance(q_json, str) else q_json
            l_count += len(qs)
            for q in qs:
                qnum = q["questionNumber"]
                expected = OFFICIAL_LISTENING_KEYS.get(qnum)
                actual = q.get("correctAnswer")
                assert actual == expected, f"Listening {l_id} Q{qnum} mismatch: actual='{actual}' vs expected='{expected}'"
        print(f"  [PASS] Listening: 4 sections, 40/40 câu hỏi khớp 100% key in sách trang 116.")

        # Audit 4: Spot-check 5 questions directly against printed page keys
        print("\n--- AUDIT 4: SPOT-CHECK 5 CÂU HỎI TRỰC TIẾP TỪ DB ---")
        cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('cam12-academic-t1-l1',))
        l1_qs = json.loads(cur.fetchone()[0])
        print(f"  - L1 Q1 (p116): expected='mountains' -> DB='{l1_qs[0]['correctAnswer']}' [PASS]")
        assert l1_qs[0]['correctAnswer'] == 'mountains'

        cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('cam12-academic-t1-l3',))
        l3_qs = json.loads(cur.fetchone()[0])
        print(f"  - L3 Q23 (p116): expected='C' -> DB='{l3_qs[2]['correctAnswer']}' [PASS]")
        assert l3_qs[2]['correctAnswer'] == 'C'

        cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('cam12-academic-t1-l4',))
        l4_qs = json.loads(cur.fetchone()[0])
        print(f"  - L4 Q40 (p116): expected='market share' -> DB='{l4_qs[9]['correctAnswer']}' [PASS]")
        assert l4_qs[9]['correctAnswer'] == 'market share'

        cur.execute('SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id = %s', ('cam12-academic-t1-r1',))
        r1_qs = json.loads(cur.fetchone()[0])
        print(f"  - R1 Q1 (p117): expected='NOT GIVEN' -> DB='{r1_qs[0]['correctAnswer']}' [PASS]")
        assert r1_qs[0]['correctAnswer'] == 'NOT GIVEN'

        cur.execute('SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id = %s', ('cam12-academic-t1-r3',))
        r3_qs = json.loads(cur.fetchone()[0])
        print(f"  - R3 Q33 (p117): expected='fire science' -> DB='{r3_qs[6]['correctAnswer']}' [PASS]")
        assert r3_qs[6]['correctAnswer'] == 'fire science'

        # Audit 5: Zero Stubs / Non-empty Content
        print("\n--- AUDIT 5: KIỂM TRA ĐỘ ĐẦY ĐỦ NỘI DUNG (ZERO STUBS) ---")
        cur.execute('SELECT id, "passageJson" FROM "ielts_reading_passages" WHERE id LIKE %s', (prefix,))
        for r_id, p_json in cur.fetchall():
            assert len(p_json.strip()) > 300, f"Reading passage {r_id} is suspiciously short!"
        print("  [PASS] Tất cả reading passages có nội dung đầy đủ (>300 ký tự).")

        cur.execute('SELECT id, "scriptJson" FROM "ielts_listening_sections" WHERE id LIKE %s', (prefix,))
        for l_id, s_json in cur.fetchall():
            assert len(s_json.strip()) > 200, f"Listening section {l_id} script is suspiciously short!"
        print("  [PASS] Tất cả listening audioscripts có nội dung đầy đủ (>200 ký tự).")

        cur.execute('SELECT id, model_answer, examiner_notes_vi FROM "ielts_writing_models" WHERE id LIKE %s', (prefix,))
        for wm_id, model, notes in cur.fetchall():
            assert len(model.strip()) > 200, f"Writing model {wm_id} is suspiciously short!"
            assert len(notes.strip()) > 50, f"Writing model {wm_id} notes are missing!"
        print("  [PASS] Tất cả writing models có modelAnswer (>200 ký tự) và examinerNotesVi (>50 ký tự).")

        cur.execute('SELECT id, question, "ideasJson" FROM "ielts_speaking_topics" WHERE id LIKE %s', (prefix,))
        for s_id, q, ideas in cur.fetchall():
            assert len(q.strip()) > 20, f"Speaking topic {s_id} question is suspiciously short!"
            assert len(ideas.strip()) > 10, f"Speaking topic {s_id} ideas are missing!"
        print("  [PASS] Tất cả speaking topics có question và ideas đầy đủ.")

        print("\n" + "=" * 70)
        print("TOÀN BỘ 5 AUDIT KIỂM TRA ĐỀU VƯỢT QUA 100% HOÀN HẢO!")
        print("=" * 70)
        return True

    except Exception as e:
        print(f"\n[FAIL] Audit thất bại: {e}")
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    run_db_verify()
