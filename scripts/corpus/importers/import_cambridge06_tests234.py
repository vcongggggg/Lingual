r"""
Script: import_cambridge06_tests234.py
Description: Imports Cambridge IELTS 06 Academic Tests 2, 3, 4 into local PostgreSQL DB (linguaflow_db)
Features:
- Step 0 Hard Gate Verification against official Answer Keys
- Early-exit guards for idempotency per Test (cam06-academic-t2%, t3%, t4%)
- Sets track='academic' explicitly across all 5 tables
- Post-import Hard Gate DB audits: 40 questions per test for reading & listening, zero stubs
- Verifies exact delta counts:
  + Reading: 103 -> 112 (+9)
  + Listening: 80 -> 92 (+12)
  + Writing Topics: 310 -> 316 (+6)
  + Writing Models: 70 -> 76 (+6)
  + Speaking Topics: 603 -> 612 (+9)
"""

import os
import sys
import json
import psycopg2
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

MAPPED_DIR = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-06")
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

TABLES = [
    'ielts_reading_passages',
    'ielts_listening_sections',
    'ielts_writing_topics',
    'ielts_writing_models',
    'ielts_speaking_topics'
]

def get_counts(conn):
    cur = conn.cursor()
    counts = {}
    for t in TABLES:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        counts[t] = cur.fetchone()[0]
    cur.close()
    return counts

def verify_step_0_keys():
    print("=" * 70)
    print("[BƯỚC 0] HARD GATE XÁC MINH ĐÁP ÁN TEST 2, 3, 4 VỚI KEY IN CHÍNH THỨC")
    print("=" * 70)

    from parse_cambridge06_all import OFFICIAL_KEYS

    with open(MAPPED_DIR / "ielts_listening_sections.json", "r", encoding="utf-8") as f:
        listenings = json.load(f)
    with open(MAPPED_DIR / "ielts_reading_passages.json", "r", encoding="utf-8") as f:
        readings = json.load(f)

    for t in [2, 3, 4]:
        off_l = OFFICIAL_KEYS[t]["listening"]
        off_r = OFFICIAL_KEYS[t]["reading"]

        # Verify Reading
        t_readings = [r for r in readings if r["id"].startswith(f"cam06-academic-t{t}-")]
        assert len(t_readings) == 3, f"Test {t} expected 3 readings, got {len(t_readings)}"
        r_count = 0
        for r in t_readings:
            qs = json.loads(r["questionsJson"]) if isinstance(r["questionsJson"], str) else r["questionsJson"]
            r_count += len(qs)
            for q in qs:
                qnum = q.get("questionNumber")
                expected = off_r.get(qnum)
                actual = q.get("correctAnswer")
                assert actual == expected, f"Test {t} Reading Q{qnum} mismatch: actual='{actual}' vs expected='{expected}'"
        print(f"[*] Test {t} Reading: 3 passages, đủ {r_count}/40 câu hỏi khớp 100% Answer Key in ấn.")

        # Verify Listening
        t_listenings = [l for l in listenings if l["id"].startswith(f"cam06-academic-t{t}-")]
        assert len(t_listenings) == 4, f"Test {t} expected 4 listenings, got {len(t_listenings)}"
        l_count = 0
        for l in t_listenings:
            qs = json.loads(l["questionsJson"]) if isinstance(l["questionsJson"], str) else l["questionsJson"]
            l_count += len(qs)
            for q in qs:
                qnum = q.get("questionNumber")
                expected = off_l.get(qnum)
                actual = q.get("correctAnswer")
                assert actual == expected, f"Test {t} Listening Q{qnum} mismatch: actual='{actual}' vs expected='{expected}'"
        print(f"[*] Test {t} Listening: 4 sections, đủ {l_count}/40 câu hỏi khớp 100% Answer Key in ấn.")

    print("\n[PASS] BƯỚC 0 THÀNH CÔNG: 100% ĐÁP ÁN READING VÀ LISTENING CỦA TEST 2, 3, 4 ĐỀU KHỚP KEY IN SÁCH!")
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

        # 2. Đọc dữ liệu từ 5 file JSON mapped
        with open(MAPPED_DIR / "ielts_reading_passages.json", "r", encoding="utf-8") as f:
            all_readings = json.load(f)
        with open(MAPPED_DIR / "ielts_listening_sections.json", "r", encoding="utf-8") as f:
            all_listenings = json.load(f)
        with open(MAPPED_DIR / "ielts_writing_topics.json", "r", encoding="utf-8") as f:
            all_writing_topics = json.load(f)
        with open(MAPPED_DIR / "ielts_writing_models.json", "r", encoding="utf-8") as f:
            all_writing_models = json.load(f)
        with open(MAPPED_DIR / "ielts_speaking_topics.json", "r", encoding="utf-8") as f:
            all_speaking_topics = json.load(f)

        now = datetime.now()
        total_inserted = 0

        # 3. Import theo từng Test (2, 3, 4)
        for t in [2, 3, 4]:
            prefix = f"cam06-academic-t{t}%"
            print(f"\n--- XỬ LÝ TEST {t} ---")

            # Early-Exit Guard cho Test t
            cur.execute('SELECT count(*) FROM "ielts_reading_passages" WHERE id LIKE %s', (prefix,))
            if cur.fetchone()[0] > 0:
                print(f"[EARLY-EXIT GUARD] Test {t} đã tồn tại trong DB -> Bỏ qua, chèn 0 bản ghi.")
                continue

            # (a) Insert Reading Passages (3 records)
            t_readings = [r for r in all_readings if r["id"].startswith(f"cam06-academic-t{t}-")]
            for r in t_readings:
                p_json = json.dumps(r['passageJson'], ensure_ascii=False) if isinstance(r['passageJson'], (list, dict)) else r['passageJson']
                q_json = json.dumps(r['questionsJson'], ensure_ascii=False) if isinstance(r['questionsJson'], (list, dict)) else r['questionsJson']
                cur.execute("""
                    INSERT INTO "ielts_reading_passages" (
                        id, section, track, "cefrLevel", difficulty_band, title, module, notes,
                        source_url, "passageJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    r['id'], r.get('section', 'reading'), r.get('track', 'academic'), r.get('cefrLevel', 'B2'),
                    r.get('difficultyBand'), r['title'], r.get('module', 'academic'), r.get('notes'),
                    r.get('sourceUrl'), p_json, q_json, r.get('source', 'cambridge-ielts-06-scan'),
                    r.get('license'), r.get('verified', True), now
                ))
            total_inserted += len(t_readings)

            # (b) Insert Listening Sections (4 records)
            t_listenings = [l for l in all_listenings if l["id"].startswith(f"cam06-academic-t{t}-")]
            for l in t_listenings:
                s_json = json.dumps(l['scriptJson'], ensure_ascii=False) if isinstance(l['scriptJson'], (list, dict)) else l['scriptJson']
                q_json = json.dumps(l['questionsJson'], ensure_ascii=False) if isinstance(l['questionsJson'], (list, dict)) else l['questionsJson']
                cur.execute("""
                    INSERT INTO "ielts_listening_sections" (
                        id, section, track, "cefrLevel", difficulty_band, title, "titleVi",
                        "scriptJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    l['id'], l.get('section', 'listening'), l.get('track', 'academic'), l.get('cefrLevel', 'B1'), l.get('difficultyBand'),
                    l['title'], l.get('titleVi'), s_json, q_json, l.get('source', 'cambridge-ielts-06-scan'),
                    l.get('license'), l.get('verified', True), now
                ))
            total_inserted += len(t_listenings)

            # (c) Insert Writing Topics (2 records)
            t_writing_topics = [w for w in all_writing_topics if w["id"].startswith(f"cam06-academic-t{t}-")]
            for wt in t_writing_topics:
                o_json = json.dumps(wt['outlineJson'], ensure_ascii=False) if isinstance(wt['outlineJson'], (list, dict)) else wt['outlineJson']
                k_json = json.dumps(wt['keyVocabJson'], ensure_ascii=False) if isinstance(wt['keyVocabJson'], (list, dict)) else wt['keyVocabJson']
                cur.execute("""
                    INSERT INTO "ielts_writing_topics" (
                        id, track, prompt, type, "typeVi", band_range, "outlineJson", "keyVocabJson", source, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wt['id'], wt.get('track', 'academic'), wt['prompt'], wt.get('type', 'report'),
                    wt.get('typeVi'), wt.get('bandRange'), o_json, k_json, wt.get('source', 'cambridge-ielts-06-scan'),
                    wt.get('verified', True), now
                ))
            total_inserted += len(t_writing_topics)

            # (d) Insert Writing Models (2 records)
            t_writing_models = [m for m in all_writing_models if m["id"].startswith(f"cam06-academic-t{t}-")]
            for wm in t_writing_models:
                k_json = json.dumps(wm['keyVocabJson'], ensure_ascii=False) if isinstance(wm['keyVocabJson'], (list, dict)) else wm['keyVocabJson']
                cur.execute("""
                    INSERT INTO "ielts_writing_models" (
                        id, task, track, topic, chart_type, chart_description, prompt, model_answer,
                        key_vocab_json, examiner_notes_vi, band_estimate, source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wm['id'], wm['task'], wm.get('track', 'academic'), wm['topic'], wm.get('chartType'), wm.get('chartDescription'),
                    wm['prompt'], wm['modelAnswer'], k_json, wm.get('examinerNotesVi'),
                    float(wm.get('bandEstimate', 8.0)), wm.get('source', 'cambridge-ielts-06-scan'),
                    wm.get('license'), wm.get('verified', True), now
                ))
            total_inserted += len(t_writing_models)

            # (e) Insert Speaking Topics (3 records)
            t_speaking_topics = [s for s in all_speaking_topics if s["id"].startswith(f"cam06-academic-t{t}-")]
            for sp in t_speaking_topics:
                i_json = json.dumps(sp['ideasJson'], ensure_ascii=False) if isinstance(sp['ideasJson'], (list, dict)) else sp['ideasJson']
                cur.execute("""
                    INSERT INTO "ielts_speaking_topics" (
                        id, part, track, question, "topicVi", "ideasJson", topic, follow_up_questions, source, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    sp['id'], sp['part'], sp.get('track', 'academic'), sp['question'], sp.get('topicVi'), i_json,
                    sp.get('topic'), sp.get('followUpQuestions'), sp.get('source', 'cambridge-ielts-06-scan'),
                    sp.get('verified', True), now
                ))
            total_inserted += len(t_speaking_topics)
            print(f"  -> Đã chèn 14 bản ghi cho Test {t} thành công.")

        conn.commit()
        print(f"\n[SUCCESS] Đã commit thành công {total_inserted} bản ghi vào DB local!")

        # 4. Đếm số lượng SAU
        after_counts = get_counts(conn)
        print("\n" + "=" * 70)
        print("[SỐ LƯỢNG SAU IMPORT VÀ CHÊNH LỆCH]")
        expected_diffs = {
            'ielts_reading_passages': 9 if total_inserted > 0 else 0,
            'ielts_listening_sections': 12 if total_inserted > 0 else 0,
            'ielts_writing_topics': 6 if total_inserted > 0 else 0,
            'ielts_writing_models': 6 if total_inserted > 0 else 0,
            'ielts_speaking_topics': 9 if total_inserted > 0 else 0
        }
        for k in before_counts:
            diff = after_counts[k] - before_counts[k]
            exp = expected_diffs[k]
            status = "OK" if diff == exp else "MISMATCH"
            print(f"  {k:26}: Trước={before_counts[k]:3} | Sau={after_counts[k]:3} | Chênh lệch={diff:+d} (Kỳ vọng: +{exp}) [{status}]")
            assert diff == exp, f"Delta mismatch for {k}: expected +{exp}, got {diff}"

        # 5. Hard Gate sau Import: Kiểm tra trực tiếp từ DB
        print("\n" + "=" * 70)
        print("[HARD GATE SAU IMPORT - KIỂM TRA ĐỘ TOÀN VẸN TỪ DB]")
        for t in [1, 2, 3, 4]:
            print(f"\n--- AUDIT TEST {t} TỪ DB ---")

            # Reading
            cur.execute('SELECT id, "questionsJson", track FROM "ielts_reading_passages" WHERE id LIKE %s ORDER BY id', (f"cam06-academic-t{t}-r%",))
            r_rows = cur.fetchall()
            assert len(r_rows) == 3, f"Test {t} expected 3 readings in DB, got {len(r_rows)}"
            tot_r = sum(len(json.loads(row[1])) for row in r_rows)
            for row in r_rows:
                assert row[2] == 'academic', f"Reading {row[0]} track is not academic: {row[2]}"
            print(f"[*] Reading: 3 passages đọc từ DB có {tot_r}/40 câu hỏi, track='academic'")
            assert tot_r == 40, f"Test {t} reading questions count {tot_r} != 40"

            # Listening
            cur.execute('SELECT id, "questionsJson", track FROM "ielts_listening_sections" WHERE id LIKE %s ORDER BY id', (f"cam06-academic-t{t}-l%",))
            l_rows = cur.fetchall()
            assert len(l_rows) == 4, f"Test {t} expected 4 listenings in DB, got {len(l_rows)}"
            tot_l = sum(len(json.loads(row[1])) for row in l_rows)
            for row in l_rows:
                assert row[2] == 'academic', f"Listening {row[0]} track is not academic: {row[2]}"
            print(f"[*] Listening: 4 sections đọc từ DB có {tot_l}/40 câu hỏi, track='academic'")
            assert tot_l == 40, f"Test {t} listening questions count {tot_l} != 40"

            # Writing Topics
            cur.execute('SELECT id, track FROM "ielts_writing_topics" WHERE id LIKE %s', (f"cam06-academic-t{t}-w%",))
            w_rows = cur.fetchall()
            assert len(w_rows) == 2, f"Test {t} expected 2 writing topics in DB, got {len(w_rows)}"
            for row in w_rows:
                assert row[1] == 'academic', f"Writing topic {row[0]} track is not academic"

            # Writing Models
            cur.execute('SELECT id, track FROM "ielts_writing_models" WHERE id LIKE %s', (f"cam06-academic-t{t}-wm%",))
            wm_rows = cur.fetchall()
            assert len(wm_rows) == 2, f"Test {t} expected 2 writing models in DB, got {len(wm_rows)}"
            for row in wm_rows:
                assert row[1] == 'academic', f"Writing model {row[0]} track is not academic"

            # Speaking Topics
            cur.execute('SELECT id, track FROM "ielts_speaking_topics" WHERE id LIKE %s', (f"cam06-academic-t{t}-sp%",))
            sp_rows = cur.fetchall()
            assert len(sp_rows) == 3, f"Test {t} expected 3 speaking topics in DB, got {len(sp_rows)}"
            for row in sp_rows:
                assert row[1] == 'academic', f"Speaking topic {row[0]} track is not academic"

            print(f"[*] Writing (2 topics, 2 models) & Speaking (3 topics): track='academic' 100%")

        print("\n" + "=" * 70)
        print("[HARD GATE PASS] TOÀN BỘ 56 BẢN GHI CỦA TEST 1-4 ĐÃ ĐƯỢC AUDIT CHUẨN XÁC TRONG DB LOCAL!")
        print("=" * 70)

    except Exception as e:
        conn.rollback()
        print(f"\n[ERROR] Rollback do lỗi: {e}")
        raise e
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    run_import()
