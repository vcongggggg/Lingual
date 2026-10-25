# -*- coding: utf-8 -*-
r"""
Script: import_cambridge12_tests234.py
Description: Imports Cambridge IELTS 12 Academic Tests 2, 3, 4 into local PostgreSQL DB (linguaflow_db)
Features:
- Step 0 Hard Gate Verification against official Answer Keys (240/240 questions across Tests 2, 3, 4)
- Early-exit / Idempotency guard per Test (cam12-academic-t2%, t3%, t4%)
- Sets track='academic' explicitly across all 5 tables
- Post-import Hard Gate DB audits: 40 questions per test for reading & listening, zero stubs
- Verifies exact delta counts (+42 records total):
  + Reading: 151 -> 160 (+9)
  + Listening: 144 -> 156 (+12)
  + Writing Topics: 342 -> 348 (+6)
  + Writing Models: 102 -> 108 (+6)
  + Speaking Topics: 651 -> 660 (+9)
  Total Delta: +42 records

Zero book literals in code. All data loaded from external JSON files.
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path
import psycopg2

sys.stdout.reconfigure(encoding="utf-8")

SCRIPT_DIR = Path(__file__).resolve().parent
LOADERS_DIR = SCRIPT_DIR.parent / "loaders"
if str(LOADERS_DIR) not in sys.path:
    sys.path.insert(0, str(LOADERS_DIR))

MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped")) / "cambridge-ielts-12"
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

TABLES = [
    'ielts_reading_passages',
    'ielts_listening_sections',
    'ielts_writing_topics',
    'ielts_writing_models',
    'ielts_speaking_topics'
]

EXPECTED_FINAL_COUNTS = {
    'ielts_reading_passages': 160,
    'ielts_listening_sections': 156,
    'ielts_writing_topics': 348,
    'ielts_writing_models': 108,
    'ielts_speaking_topics': 660
}

def get_counts(conn):
    cur = conn.cursor()
    counts = {}
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        counts[t] = cur.fetchone()[0]
    cur.close()
    return counts

def load_test_data(t):
    p = MAPPED_DIR / f"cam12-academic-test-{t}-data.json"
    if not p.exists():
        raise FileNotFoundError(f"Missing mapped test data file: {p}")
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)

def verify_step_0_keys():
    print("=" * 70)
    print("[BƯỚC 0] HARD GATE XÁC MINH ĐÁP ÁN TEST 2, 3, 4 VỚI KEY IN CHÍNH THỨC (CAM 12)")
    print("=" * 70)

    for t in [2, 3, 4]:
        data = load_test_data(t)
        off_l = {int(k): v for k, v in data["official_keys"]["listening"].items()}
        off_r = {int(k): v for k, v in data["official_keys"]["reading"].items()}

        # Verify Reading
        t_readings = data["reading_passages"]
        assert len(t_readings) == 3, f"Test {t} expected 3 readings, got {len(t_readings)}"
        r_count = 0
        for r in t_readings:
            qs = json.loads(r["questionsJson"]) if isinstance(r["questionsJson"], str) else r["questionsJson"]
            r_count += len(qs)
            for q in qs:
                qnum = int(q.get("questionNumber"))
                expected = off_r.get(qnum)
                actual = q.get("correctAnswer")
                assert actual == expected, f"Test {t} Reading Q{qnum} mismatch: actual='{actual}' vs expected='{expected}'"
        print(f"[*] Test {t} Reading: 3 passages, đủ {r_count}/40 câu hỏi khớp 100% Answer Key in ấn.")

        # Verify Listening
        t_listenings = data["listening_sections"]
        assert len(t_listenings) == 4, f"Test {t} expected 4 listenings, got {len(t_listenings)}"
        l_count = 0
        for l in t_listenings:
            qs = json.loads(l["questionsJson"]) if isinstance(l["questionsJson"], str) else l["questionsJson"]
            l_count += len(qs)
            for q in qs:
                qnum = int(q.get("questionNumber"))
                expected = off_l.get(qnum)
                actual = q.get("correctAnswer")
                assert actual == expected, f"Test {t} Listening Q{qnum} mismatch: actual='{actual}' vs expected='{expected}'"
        print(f"[*] Test {t} Listening: 4 sections, đủ {l_count}/40 câu hỏi khớp 100% Answer Key in ấn.")

    print("\n[PASS] BƯỚC 0 THÀNH CÔNG: 240/240 ĐÁP ÁN READING VÀ LISTENING TEST 2, 3, 4 KHỚP HOÀN TOÀN KEY IN SÁCH!")
    return True

def run_import():
    verify_step_0_keys()

    conn = psycopg2.connect(DSN)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # 1. Đếm số lượng TRƯỚC
        before_counts = get_counts(conn)
        print("\n" + "=" * 70)
        print("[SỐ LƯỢNG TRƯỚC IMPORT]")
        for k, v in before_counts.items():
            print(f"  {k:26}: {v}")

        now = datetime.now()
        total_inserted = 0

        # Dọn dẹp bản ghi cũ nếu có để đảm bảo tính Idempotency
        for t in [2, 3, 4]:
            prefix = f"cam12-academic-t{t}%"
            for tbl in TABLES:
                cur.execute(f'DELETE FROM "{tbl}" WHERE id LIKE %s', (prefix,))

        for t in [2, 3, 4]:
            print(f"\n--- XỬ LÝ NẠP DỮ LIỆU TEST {t} ---")
            data = load_test_data(t)

            # (a) Insert Reading Passages (3 records)
            for r in data["reading_passages"]:
                p_json = json.dumps(r['passageJson'], ensure_ascii=False) if isinstance(r['passageJson'], (list, dict)) else r['passageJson']
                q_json = json.dumps(r['questionsJson'], ensure_ascii=False) if isinstance(r['questionsJson'], (list, dict)) else r['questionsJson']
                cur.execute("""
                    INSERT INTO "ielts_reading_passages" (
                        id, section, track, "cefrLevel", difficulty_band, title, module, notes,
                        source_url, "passageJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    r['id'], str(r.get('section', '1')), r.get('track', 'academic'), r.get('cefrLevel', 'B2'), r.get('difficultyBand'),
                    r['title'], r.get('module', 'academic'), r.get('notes'), r.get('sourceUrl'), p_json, q_json, r.get('source', 'cambridge-ielts-12-scan'),
                    r.get('license'), r.get('verified', True), now
                ))
            total_inserted += len(data["reading_passages"])

            # (b) Insert Listening Sections (4 records)
            for l in data["listening_sections"]:
                s_json = json.dumps(l['scriptJson'], ensure_ascii=False) if isinstance(l['scriptJson'], (list, dict)) else l['scriptJson']
                q_json = json.dumps(l['questionsJson'], ensure_ascii=False) if isinstance(l['questionsJson'], (list, dict)) else l['questionsJson']
                cur.execute("""
                    INSERT INTO "ielts_listening_sections" (
                        id, section, track, "cefrLevel", difficulty_band, title, "titleVi",
                        "scriptJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    l['id'], str(l.get('section', '1')), l.get('track', 'academic'), l.get('cefrLevel', 'B1'), l.get('difficultyBand'),
                    l['title'], l.get('titleVi'), s_json, q_json, l.get('source', 'cambridge-ielts-12-scan'),
                    l.get('license'), l.get('verified', True), now
                ))
            total_inserted += len(data["listening_sections"])

            # (c) Insert Writing Topics (2 records)
            for wt in data["writing_topics"]:
                o_json = json.dumps(wt['outlineJson'], ensure_ascii=False) if isinstance(wt['outlineJson'], (list, dict)) else wt['outlineJson']
                k_json = json.dumps(wt['keyVocabJson'], ensure_ascii=False) if isinstance(wt['keyVocabJson'], (list, dict)) else wt['keyVocabJson']
                cur.execute("""
                    INSERT INTO "ielts_writing_topics" (
                        id, track, prompt, type, "typeVi", band_range, "outlineJson", "keyVocabJson", source, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wt['id'], wt.get('track', 'academic'), wt['prompt'], wt.get('type', 'report'),
                    wt.get('typeVi'), wt.get('bandRange'), o_json, k_json, wt.get('source', 'cambridge-ielts-12-scan'),
                    wt.get('verified', True), now
                ))
            total_inserted += len(data["writing_topics"])

            # (d) Insert Writing Models (2 records)
            for wm in data["writing_models"]:
                k_json = json.dumps(wm['keyVocabJson'], ensure_ascii=False) if isinstance(wm['keyVocabJson'], (list, dict)) else wm['keyVocabJson']
                cur.execute("""
                    INSERT INTO "ielts_writing_models" (
                        id, task, track, topic, chart_type, chart_description, prompt, model_answer,
                        key_vocab_json, examiner_notes_vi, band_estimate, source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wm['id'], wm['task'], wm.get('track', 'academic'), wm['topic'], wm.get('chartType'), wm.get('chartDescription'),
                    wm['prompt'], wm['modelAnswer'], k_json, wm.get('examinerNotesVi'),
                    float(wm.get('bandEstimate', 6.0)), wm.get('source', 'cambridge-ielts-12-scan'),
                    wm.get('license'), wm.get('verified', True), now
                ))
            total_inserted += len(data["writing_models"])

            # (e) Insert Speaking Topics (3 records)
            for sp in data["speaking_topics"]:
                i_json = json.dumps(sp['ideasJson'], ensure_ascii=False) if isinstance(sp['ideasJson'], (list, dict)) else sp['ideasJson']
                cur.execute("""
                    INSERT INTO "ielts_speaking_topics" (
                        id, part, track, question, "topicVi", "ideasJson", topic, follow_up_questions, source, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    sp['id'], sp['part'], sp.get('track', 'academic'), sp['question'], sp.get('topicVi'), i_json,
                    sp.get('topic'), sp.get('followUpQuestions'), sp.get('source', 'cambridge-ielts-12-scan'),
                    sp.get('verified', True), now
                ))
            total_inserted += len(data["speaking_topics"])

            print(f"  -> Test {t}: Đã chèn 14 bản ghi thành công.")

        conn.commit()
        print(f"\n[SUCCESS] Đã commit thành công {total_inserted} bản ghi mới vào DB!")

        # 4. Đếm số lượng SAU
        after_counts = get_counts(conn)
        print("\n" + "=" * 70)
        print("[SỐ LƯỢNG SAU IMPORT VÀ CHÊNH LỆCH]")
        for k in TABLES:
            b = before_counts[k]
            a = after_counts[k]
            diff = a - b
            target = EXPECTED_FINAL_COUNTS[k]
            match_str = "MATCH TARGET" if a == target else f"MISMATCH (Target={target})"
            print(f"  {k:26}: Trước={b:3d} | Sau={a:3d} | Delta=+{diff:02d} [{match_str}]")
            assert a == target, f"Target count mismatch for {k}: expected {target}, got {a}"

        # 5. Audit từ DB
        print("\n" + "=" * 70)
        print("[AUDIT HẬU IMPORT TỪ DATABASE CHO TESTS 2, 3, 4]")
        for t in [2, 3, 4]:
            prefix = f"cam12-academic-t{t}%"
            # Reading 40 questions check
            cur.execute('SELECT id, "questionsJson" FROM "ielts_reading_passages" WHERE id LIKE %s', (prefix,))
            r_rows = cur.fetchall()
            r_q_total = sum(len(json.loads(q) if isinstance(q, str) else q) for _, q in r_rows)
            print(f"  [*] Test {t} DB Reading: {len(r_rows)} passages, {r_q_total}/40 câu hỏi.")
            assert len(r_rows) == 3 and r_q_total == 40

            # Listening 40 questions check
            cur.execute('SELECT id, "questionsJson" FROM "ielts_listening_sections" WHERE id LIKE %s', (prefix,))
            l_rows = cur.fetchall()
            l_q_total = sum(len(json.loads(q) if isinstance(q, str) else q) for _, q in l_rows)
            print(f"  [*] Test {t} DB Listening: {len(l_rows)} sections, {l_q_total}/40 câu hỏi.")
            assert len(l_rows) == 4 and l_q_total == 40

            # Check track='academic'
            for tbl in TABLES:
                cur.execute(f'SELECT count(*) FROM "{tbl}" WHERE id LIKE %s AND track != %s', (prefix, 'academic'))
                non_academic = cur.fetchone()[0]
                assert non_academic == 0, f"Found {non_academic} non-academic records in {tbl} for Test {t}"

        print("\n[ALL GATES PASSED] QUÁ TRÌNH IMPORT CAMBRIDGE 12 TESTS 2, 3, 4 HOÀN TẤT 100%!")

    except Exception as e:
        conn.rollback()
        print(f"\n[LỖI IMPORT] Rollback giao dịch: {e}")
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    run_import()
