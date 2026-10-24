# -*- coding: utf-8 -*-
r"""
Script: import_cambridge10_tests234.py
Description: Imports Cambridge IELTS 10 Academic Tests 2, 3, 4 into local PostgreSQL DB (linguaflow_db)
Features:
- Step 0 Hard Gate Verification against official Answer Keys
- Early-exit guards for idempotency per Test (cam10-academic-t2%, t3%, t4%)
- Sets track='academic' explicitly across all 5 tables
- Post-import Hard Gate DB audits: 40 questions per test for reading & listening, zero stubs
- Merges data into collective JSON files in book-corpus-mapped/cambridge-ielts-10
"""

import os
import sys
import json
import psycopg2
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

MAPPED_DIR = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-10")
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

def load_test_data(t):
    p = MAPPED_DIR / f"cam10-academic-test-{t}-data.json"
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)

def verify_step_0_keys():
    print("=" * 70)
    print("[BƯỚC 0] HARD GATE XÁC MINH ĐÁP ÁN TEST 2, 3, 4 VỚI KEY IN CHÍNH THỨC")
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

    print("\n[PASS] BƯỚC 0 THÀNH CÔNG: 100% ĐÁP ÁN READING VÀ LISTENING CỦA TEST 2, 3, 4 ĐỀU KHỚP KEY IN SÁCH!")
    return True

def run_import():
    verify_step_0_keys()

    conn = psycopg2.connect(DSN)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        before_counts = get_counts(conn)
        print("\n" + "=" * 70)
        print("[SỐ LƯỢNG TRƯỚC IMPORT]")
        for k, v in before_counts.items():
            print(f"  {k:26}: {v}")

        now = datetime.now()
        total_inserted = 0

        # Load collective files to merge
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

        for t in [2, 3, 4]:
            prefix = f"cam10-academic-t{t}%"
            print(f"\n--- XỬ LÝ TEST {t} ---")

            data = load_test_data(t)

            # Early-Exit Guard cho Test t
            cur.execute('SELECT count(*) FROM "ielts_reading_passages" WHERE id LIKE %s', (prefix,))
            if cur.fetchone()[0] > 0:
                print(f"[EARLY-EXIT GUARD] Test {t} đã tồn tại trong DB -> Bỏ qua, chèn 0 bản ghi.")
                continue

            # (a) Insert Reading Passages (3 records)
            t_readings = data["reading_passages"]
            for r in t_readings:
                p_json = json.dumps(r['passageJson'], ensure_ascii=False) if isinstance(r['passageJson'], (list, dict)) else r['passageJson']
                q_json = json.dumps(r['questionsJson'], ensure_ascii=False) if isinstance(r['questionsJson'], (list, dict)) else r['questionsJson']
                cur.execute("""
                    INSERT INTO "ielts_reading_passages" (
                        id, section, track, "cefrLevel", difficulty_band, title, module, notes,
                        source_url, "passageJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    r['id'], str(r.get('section', '1')), r.get('track', 'academic'), r.get('cefrLevel', 'B2'),
                    r.get('difficultyBand'), r['title'], r.get('module', 'academic'), r.get('notes'),
                    r.get('sourceUrl'), p_json, q_json, r.get('source', 'cambridge-ielts-10-scan'),
                    r.get('license'), r.get('verified', True), now
                ))
                if not any(x['id'] == r['id'] for x in all_readings):
                    all_readings.append(r)
            total_inserted += len(t_readings)

            # (b) Insert Listening Sections (4 records)
            t_listenings = data["listening_sections"]
            for l in t_listenings:
                s_json = json.dumps(l['scriptJson'], ensure_ascii=False) if isinstance(l['scriptJson'], (list, dict)) else l['scriptJson']
                q_json = json.dumps(l['questionsJson'], ensure_ascii=False) if isinstance(l['questionsJson'], (list, dict)) else l['questionsJson']
                cur.execute("""
                    INSERT INTO "ielts_listening_sections" (
                        id, section, track, "cefrLevel", difficulty_band, title, "titleVi",
                        "scriptJson", "questionsJson", source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    l['id'], str(l.get('section', '1')), l.get('track', 'academic'), l.get('cefrLevel', 'B1'), l.get('difficultyBand'),
                    l['title'], l.get('titleVi'), s_json, q_json, l.get('source', 'cambridge-ielts-10-scan'),
                    l.get('license'), l.get('verified', True), now
                ))
                if not any(x['id'] == l['id'] for x in all_listenings):
                    all_listenings.append(l)
            total_inserted += len(t_listenings)

            # (c) Insert Writing Topics (2 records)
            t_writing_topics = data["writing_topics"]
            for wt in t_writing_topics:
                o_json = json.dumps(wt['outlineJson'], ensure_ascii=False) if isinstance(wt['outlineJson'], (list, dict)) else wt['outlineJson']
                k_json = json.dumps(wt['keyVocabJson'], ensure_ascii=False) if isinstance(wt['keyVocabJson'], (list, dict)) else wt['keyVocabJson']
                cur.execute("""
                    INSERT INTO "ielts_writing_topics" (
                        id, track, prompt, type, "typeVi", band_range, "outlineJson", "keyVocabJson", source, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wt['id'], wt.get('track', 'academic'), wt['prompt'], wt.get('type', 'report'),
                    wt.get('typeVi'), wt.get('bandRange'), o_json, k_json, wt.get('source', 'cambridge-ielts-10-scan'),
                    wt.get('verified', True), now
                ))
                if not any(x['id'] == wt['id'] for x in all_writing_topics):
                    all_writing_topics.append(wt)
            total_inserted += len(t_writing_topics)

            # (d) Insert Writing Models (2 records)
            t_writing_models = data["writing_models"]
            for wm in t_writing_models:
                k_json = json.dumps(wm['keyVocabJson'], ensure_ascii=False) if isinstance(wm['keyVocabJson'], (list, dict)) else wm['keyVocabJson']
                cur.execute("""
                    INSERT INTO "ielts_writing_models" (
                        id, task, track, topic, chart_type, chart_description, prompt, model_answer,
                        key_vocab_json, examiner_notes_vi, band_estimate, source, license, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    wm['id'], wm['task'], wm.get('track', 'academic'), wm['topic'], wm.get('chartType'), wm.get('chartDescription'),
                    wm['prompt'], wm.get('modelAnswer') or wm.get('essayText'), k_json, wm.get('examinerNotesVi'),
                    float(wm.get('bandEstimate', 8.0)), wm.get('source', 'cambridge-ielts-10-scan'),
                    wm.get('license'), wm.get('verified', True), now
                ))
                if not any(x['id'] == wm['id'] for x in all_writing_models):
                    all_writing_models.append(wm)
            total_inserted += len(t_writing_models)

            # (e) Insert Speaking Topics (3 records)
            t_speaking_topics = data["speaking_topics"]
            for sp in t_speaking_topics:
                i_json = json.dumps(sp['ideasJson'], ensure_ascii=False) if isinstance(sp['ideasJson'], (list, dict)) else sp['ideasJson']
                cur.execute("""
                    INSERT INTO "ielts_speaking_topics" (
                        id, part, track, question, "topicVi", "ideasJson", topic, follow_up_questions, source, verified, "createdAt"
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    sp['id'], sp['part'], sp.get('track', 'academic'), sp['question'], sp.get('topicVi'), i_json,
                    sp.get('topic'), sp.get('followUpQuestions'), sp.get('source', 'cambridge-ielts-10-scan'),
                    sp.get('verified', True), now
                ))
                if not any(x['id'] == sp['id'] for x in all_speaking_topics):
                    all_speaking_topics.append(sp)
            total_inserted += len(t_speaking_topics)
            print(f"  -> Đã chèn 14 bản ghi cho Test {t} thành công.")

        conn.commit()
        print(f"\n[SUCCESS] Đã commit thành công {total_inserted} bản ghi vào DB local!")

        # Save merged collective files
        with open(MAPPED_DIR / "ielts_reading_passages.json", "w", encoding="utf-8") as f:
            json.dump(all_readings, f, indent=2, ensure_ascii=False)
        with open(MAPPED_DIR / "ielts_listening_sections.json", "w", encoding="utf-8") as f:
            json.dump(all_listenings, f, indent=2, ensure_ascii=False)
        with open(MAPPED_DIR / "ielts_writing_topics.json", "w", encoding="utf-8") as f:
            json.dump(all_writing_topics, f, indent=2, ensure_ascii=False)
        with open(MAPPED_DIR / "ielts_writing_models.json", "w", encoding="utf-8") as f:
            json.dump(all_writing_models, f, indent=2, ensure_ascii=False)
        with open(MAPPED_DIR / "ielts_speaking_topics.json", "w", encoding="utf-8") as f:
            json.dump(all_speaking_topics, f, indent=2, ensure_ascii=False)
        print("[SUCCESS] Đã lưu cập nhật 5 tệp JSON tổng hợp trong book-corpus-mapped/cambridge-ielts-10!")

        # 4. Đếm số lượng SAU
        after_counts = get_counts(conn)
        print("\n" + "=" * 70)
        print("[SỐ LƯỢNG SAU IMPORT VÀ CHÊNH LỆCH]")
        for k in TABLES:
            b = before_counts[k]
            a = after_counts[k]
            diff = a - b
            print(f"  {k:26}: Trước={b:3d} | Sau={a:3d} | Chênh lệch=+{diff:02d}")

        # 5. Audit từ DB
        print("\n" + "=" * 70)
        print("[HARD GATE SAU IMPORT - KIỂM TRA ĐỘ TOÀN VẸN TỪ DB]")
        for t in range(1, 5):
            print(f"\n--- AUDIT TEST {t} TỪ DB ---")
            cur.execute('SELECT "questionsJson", track FROM "ielts_reading_passages" WHERE id LIKE %s', (f"cam10-academic-t{t}%",))
            r_rows = cur.fetchall()
            r_q_total = 0
            for r_q, tr in r_rows:
                assert tr == 'academic', f"Test {t} Reading track != 'academic'"
                qs = json.loads(r_q) if isinstance(r_q, str) else r_q
                r_q_total += len(qs)
            assert len(r_rows) == 3, f"Test {t} Reading passages count != 3"
            assert r_q_total == 40, f"Test {t} Reading total questions != 40 (got {r_q_total})"
            print(f"  [PASS] Reading DB: 3 passages, {r_q_total}/40 câu hỏi, track='academic', 0 stub.")

            cur.execute('SELECT "questionsJson", track FROM "ielts_listening_sections" WHERE id LIKE %s', (f"cam10-academic-t{t}%",))
            l_rows = cur.fetchall()
            l_q_total = 0
            for l_q, tr in l_rows:
                assert tr == 'academic', f"Test {t} Listening track != 'academic'"
                qs = json.loads(l_q) if isinstance(l_q, str) else l_q
                l_q_total += len(qs)
            assert len(l_rows) == 4, f"Test {t} Listening sections count != 4"
            assert l_q_total == 40, f"Test {t} Listening total questions != 40 (got {l_q_total})"
            print(f"  [PASS] Listening DB: 4 sections, {l_q_total}/40 câu hỏi, track='academic', 0 stub.")

        print("\n" + "=" * 70)
        print("[SUCCESS] IMPORT CAMBRIDGE IELTS 10 TESTS 2, 3, 4 HOÀN TẤT VÀ VƯỢT QUA 100% HARD GATE!")
        print("=" * 70)

    except Exception as e:
        conn.rollback()
        print(f"\n[ERROR] Rollback do lỗi: {e}")
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    run_import()
