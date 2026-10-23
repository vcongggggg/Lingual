r"""
Script: parity_check_loader_vs_db.py
Task ID: lingual-extract-book-data-from-scripts-001
Description: Strict Parity Check Dry-Run (SELECT-only) comparing:
  - Refactored loaders reading from external JSON
  - Actual records in PostgreSQL local database (linguaflow_db)
Audits 8/8 tests (Cambridge 06 Tests 1-4, Cambridge 07 Tests 1-4):
  - ID set equivalence
  - correctAnswer map equivalence (80 questions per test: 40 L + 40 R)
  - Record counts equivalence
  - Overall DB counts integrity
"""

import os
import sys
import json
import psycopg2
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
sys.path.append(str(Path(__file__).parent))

DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

EXPECTED_GLOBAL_COUNTS = {
    'ielts_reading_passages': 124,
    'ielts_listening_sections': 108,
    'ielts_writing_topics': 324,
    'ielts_writing_models': 84,
    'ielts_speaking_topics': 624
}

def run_parity_check():
    print("=" * 75)
    print("PARITY CHECK DRY-RUN: NEW LOADERS VS ACTUAL DB RECORDS (SELECT-ONLY)")
    print("=" * 75)

    conn = psycopg2.connect(DSN)
    cur = conn.cursor()

    # 1. Global DB Counts check
    print("\n--- 1. KIỂM TRA SỐ LƯỢNG GLOBAL DB (NGUYÊN TRẠNG, KHÔNG THAY ĐỔI) ---")
    for tbl, exp in EXPECTED_GLOBAL_COUNTS.items():
        cur.execute(f'SELECT count(*) FROM "{tbl}"')
        actual = cur.fetchone()[0]
        assert actual == exp, f"DB Global Count Mismatch on {tbl}: actual={actual} != expected={exp}"
        print(f"  {tbl:26}: {actual} [OK]")

    # 2. Test-by-test Parity Check
    print("\n--- 2. PARITY AUDIT 8/8 TESTS (LOADER MỚI vs DB THẬT) ---")
    test_suite = [
        ("cam06", "06", 1, "cambridge06_data_t1", "build_test_1"),
        ("cam06", "06", 2, "cambridge06_data_t2", "build_test_2"),
        ("cam06", "06", 3, "cambridge06_data_t3", "build_test_3"),
        ("cam06", "06", 4, "cambridge06_data_t4", "build_test_4"),
        ("cam07", "07", 1, "cambridge07_data_t1", "build_test_1"),
        ("cam07", "07", 2, "cambridge07_data_t2", "build_test_2"),
        ("cam07", "07", 3, "cambridge07_data_t3", "build_test_3"),
        ("cam07", "07", 4, "cambridge07_data_t4", "build_test_4")
    ]

    all_tests_passed = True
    audit_results = []

    for prefix, book, t_num, mod_name, fn_name in test_suite:
        test_label = f"Cambridge {book} Test {t_num}"
        print(f"\n[AUDIT] {test_label} ...")

        # Load from new loader
        mod = __import__(mod_name)
        fn = getattr(mod, fn_name)
        loader_l, loader_r, loader_w, loader_wm, loader_s = fn()

        # (a) Check Counts
        assert len(loader_l) == 4, f"{test_label} Loader Listening count {len(loader_l)} != 4"
        assert len(loader_r) == 3, f"{test_label} Loader Reading count {len(loader_r)} != 3"
        assert len(loader_w) == 2, f"{test_label} Loader Writing topics count {len(loader_w)} != 2"
        assert len(loader_wm) == 2, f"{test_label} Loader Writing models count {len(loader_wm)} != 2"
        assert len(loader_s) == 3, f"{test_label} Loader Speaking count {len(loader_s)} != 3"

        # Query DB for this test
        pat_prefix = f"{prefix}-academic-t{t_num}-"

        # Reading
        cur.execute('SELECT id, "questionsJson" FROM "ielts_reading_passages" WHERE id LIKE %s ORDER BY id', (f"{pat_prefix}r%",))
        db_r = cur.fetchall()
        assert len(db_r) == 3, f"{test_label} DB Reading count {len(db_r)} != 3"

        # Listening
        cur.execute('SELECT id, "questionsJson" FROM "ielts_listening_sections" WHERE id LIKE %s ORDER BY id', (f"{pat_prefix}l%",))
        db_l = cur.fetchall()
        assert len(db_l) == 4, f"{test_label} DB Listening count {len(db_l)} != 4"

        # Writing Topics
        cur.execute('SELECT id FROM "ielts_writing_topics" WHERE id LIKE %s ORDER BY id', (f"{pat_prefix}w%",))
        db_w = cur.fetchall()
        assert len(db_w) == 2, f"{test_label} DB Writing topics count {len(db_w)} != 2"

        # Writing Models
        cur.execute('SELECT id FROM "ielts_writing_models" WHERE id LIKE %s ORDER BY id', (f"{pat_prefix}wm%",))
        db_wm = cur.fetchall()
        assert len(db_wm) == 2, f"{test_label} DB Writing models count {len(db_wm)} != 2"

        # Speaking Topics
        cur.execute('SELECT id FROM "ielts_speaking_topics" WHERE id LIKE %s ORDER BY id', (f"{pat_prefix}sp%",))
        db_s = cur.fetchall()
        assert len(db_s) == 3, f"{test_label} DB Speaking count {len(db_s)} != 3"

        # (b) ID Set Equivalence
        loader_r_ids = sorted([r["id"] for r in loader_r])
        db_r_ids = sorted([r[0] for r in db_r])
        assert loader_r_ids == db_r_ids, f"{test_label} Reading ID mismatch: {loader_r_ids} != {db_r_ids}"

        loader_l_ids = sorted([l["id"] for l in loader_l])
        db_l_ids = sorted([l[0] for l in db_l])
        assert loader_l_ids == db_l_ids, f"{test_label} Listening ID mismatch: {loader_l_ids} != {db_l_ids}"

        loader_w_ids = sorted([w["id"] for w in loader_w])
        db_w_ids = sorted([w[0] for w in db_w])
        assert loader_w_ids == db_w_ids, f"{test_label} Writing topics ID mismatch"

        loader_wm_ids = sorted([wm["id"] for wm in loader_wm])
        db_wm_ids = sorted([wm[0] for wm in db_wm])
        assert loader_wm_ids == db_wm_ids, f"{test_label} Writing models ID mismatch"

        loader_s_ids = sorted([s["id"] for s in loader_s])
        db_s_ids = sorted([s[0] for s in db_s])
        assert loader_s_ids == db_s_ids, f"{test_label} Speaking ID mismatch"

        print(f"  -> ID Sets (14 IDs: 3 R, 4 L, 2 W, 2 WM, 3 S): KHỚP 100%")

        # (c) CorrectAnswer Map Equivalence
        # Reading questions
        loader_r_answers = {}
        for r in loader_r:
            qs = json.loads(r["questionsJson"]) if isinstance(r["questionsJson"], str) else r["questionsJson"]
            for q in qs:
                loader_r_answers[q["questionNumber"]] = q["correctAnswer"]

        db_r_answers = {}
        for r in db_r:
            qs = json.loads(r[1]) if isinstance(r[1], str) else r[1]
            for q in qs:
                db_r_answers[q["questionNumber"]] = q["correctAnswer"]

        assert len(loader_r_answers) == 40, f"{test_label} Loader Reading answers count {len(loader_r_answers)} != 40"
        assert len(db_r_answers) == 40, f"{test_label} DB Reading answers count {len(db_r_answers)} != 40"
        assert loader_r_answers == db_r_answers, f"{test_label} Reading answer mismatch"

        # Listening questions
        loader_l_answers = {}
        for l in loader_l:
            qs = json.loads(l["questionsJson"]) if isinstance(l["questionsJson"], str) else l["questionsJson"]
            for q in qs:
                loader_l_answers[q["questionNumber"]] = q["correctAnswer"]

        db_l_answers = {}
        for l in db_l:
            qs = json.loads(l[1]) if isinstance(l[1], str) else l[1]
            for q in qs:
                db_l_answers[q["questionNumber"]] = q["correctAnswer"]

        assert len(loader_l_answers) == 40, f"{test_label} Loader Listening answers count {len(loader_l_answers)} != 40"
        assert len(db_l_answers) == 40, f"{test_label} DB Listening answers count {len(db_l_answers)} != 40"
        assert loader_l_answers == db_l_answers, f"{test_label} Listening answer mismatch"

        print(f"  -> Answers Map (40 Reading + 40 Listening = 80 câu hỏi): KHỚP 100% VỚI DB THẬT")
        print(f"  [PASS] {test_label} Parity Dry-Run: 100% OK")

        audit_results.append({
            "test": test_label,
            "status": "PASS",
            "id_count": 14,
            "questions_audited": 80
        })

    cur.close()
    conn.close()

    print("\n" + "=" * 75)
    print("[SUCCESS] 8/8 TESTS PARITY CHECK HOÀN HẢO: LOADER MỚI KHỚP 100% VỚI DB!")
    print("=" * 75)
    return audit_results

if __name__ == "__main__":
    run_parity_check()
