r"""
Script: import_cambridge09_pilot.py
Mục đích: Import Cambridge IELTS 09 Pilot Test 1 vào local PostgreSQL DB với:
- Hard gate Bước 0: Đối chiếu 100% (40 Listening + 40 Reading) với Answer Key chính thức
- Early-exit guard (idempotent: 'cam09-academic-t1%')
- Báo cáo số lượng 5 bảng IELTS trước và sau import (+14 bản ghi mới)
- Ghi nhận cột track='academic' trên 100% bản ghi
- Hard gate sau import: SELECT lại từ DB xác minh 40 câu Listening, 40 câu Reading toàn vẹn, 0 stub
Dữ liệu đọc từ: C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-09\ (NGOÀI REPO)
Tuyệt đối không commit dữ liệu sách vào repo Git.
"""

import os
import sys
import json
import psycopg2
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# Import official keys directly from the lightweight loader (which loads the external JSON)
from cambridge09_data_t1 import OFFICIAL_LISTENING_KEYS, OFFICIAL_READING_KEYS

MAPPED_DIR = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-09")
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

def verify_step_0():
    print("=" * 60)
    print("[BƯỚC 0] HARD GATE - ĐỐI CHIẾU 100% ĐÁP ÁN READING + LISTENING VỚI KEY IN TRONG SÁCH")
    print("=" * 60)

    listening_file = MAPPED_DIR / "ielts_listening_sections.json"
    reading_file = MAPPED_DIR / "ielts_reading_passages.json"

    if not listening_file.exists() or not reading_file.exists():
        msg = f"Thiếu file nguồn mapped tại {MAPPED_DIR}"
        print(f"[ERROR] {msg}")
        return False, msg

    with open(listening_file, "r", encoding="utf-8") as f:
        listenings = json.load(f)
    with open(reading_file, "r", encoding="utf-8") as f:
        readings = json.load(f)

    # 1. Check Listening (40 questions)
    listening_count = 0
    for sec in listenings:
        q_list = json.loads(sec['questionsJson']) if isinstance(sec['questionsJson'], str) else sec['questionsJson']
        for q in q_list:
            q_num = q.get('questionNumber')
            listening_count += 1
            expected = OFFICIAL_LISTENING_KEYS.get(q_num)
            actual = q.get('correctAnswer')
            if actual != expected:
                msg = f"LỆCH ĐÁP ÁN Listening Q{q_num}: actual='{actual}' != expected='{expected}'"
                print(f"[BLOCKED] {msg}")
                return False, msg

    # 2. Check Reading (40 questions)
    reading_count = 0
    for p in readings:
        q_list = json.loads(p['questionsJson']) if isinstance(p['questionsJson'], str) else p['questionsJson']
        for q in q_list:
            q_num = q.get('questionNumber')
            reading_count += 1
            expected = OFFICIAL_READING_KEYS.get(q_num)
            actual = q.get('correctAnswer')
            if actual != expected:
                msg = f"LỆCH ĐÁP ÁN Reading Q{q_num}: actual='{actual}' != expected='{expected}'"
                print(f"[BLOCKED] {msg}")
                return False, msg

    if listening_count != 40 or reading_count != 40:
        msg = f"Số lượng câu hỏi không đủ 40: Listening={listening_count}, Reading={reading_count}"
        print(f"[BLOCKED] {msg}")
        return False, msg

    print(f"[*] Đối soát Listening 40/40 câu: KHỚP 100%")
    print(f"[*] Đối soát Reading 40/40 câu: KHỚP 100%")
    print("[PASS] BƯỚC 0 XÁC MINH THÀNH CÔNG: 100% ĐÁP ÁN TEST 1 TRÙNG KHỚP ANSWER KEY CHÍNH THỨC TRANG 152-153!")
    return True, "Bước 0 hợp lệ"

def get_counts(conn):
    tables = [
        'ielts_reading_passages',
        'ielts_listening_sections',
        'ielts_writing_topics',
        'ielts_writing_models',
        'ielts_speaking_topics'
    ]
    cur = conn.cursor()
    counts = {}
    for t in tables:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        counts[t] = cur.fetchone()[0]
    cur.close()
    return counts

def run_import():
    step0_ok, reason = verify_step_0()
    if not step0_ok:
        print("\n" + "="*60)
        print("KẾT QUẢ: IMPORT BỊ CHẶN (BLOCKED)")
        print(f"Lý do: {reason}")
        print("Không có bản ghi nào được ghi vào DB local.")
        print("="*60)
        sys.exit(2)

    conn = psycopg2.connect(DSN)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # 1. Đếm số lượng TRƯỚC
        before_counts = get_counts(conn)
        print("\n" + "=" * 60)
        print("[SỐ LƯỢNG TRƯỚC IMPORT]")
        for k, v in before_counts.items():
            print(f"  {k:26}: {v}")

        # 2. Early-Exit Guard
        tables = [
            'ielts_reading_passages',
            'ielts_listening_sections',
            'ielts_writing_topics',
            'ielts_writing_models',
            'ielts_speaking_topics'
        ]
        already_imported = False
        for t in tables:
            cur.execute(f'SELECT count(*) FROM "{t}" WHERE id LIKE %s', ('cam09-academic-t1%',))
            if cur.fetchone()[0] > 0:
                already_imported = True
                break

        if already_imported:
            print("\n[EARLY-EXIT GUARD] Đã tồn tại bản ghi của Cambridge 09 Test 1 ('cam09-academic-t1%') trong DB.")
            print("[INFO] Status: 'already imported', chèn 0 bản ghi, dừng lại an toàn.")
            conn.rollback()
            cur.close()
            conn.close()
            return

        # 3. Đọc dữ liệu từ 5 file JSON mapped
        with open(MAPPED_DIR / "ielts_reading_passages.json", "r", encoding="utf-8") as f:
            readings = json.load(f)
        with open(MAPPED_DIR / "ielts_listening_sections.json", "r", encoding="utf-8") as f:
            listenings = json.load(f)
        with open(MAPPED_DIR / "ielts_writing_topics.json", "r", encoding="utf-8") as f:
            writing_topics = json.load(f)
        with open(MAPPED_DIR / "ielts_writing_models.json", "r", encoding="utf-8") as f:
            writing_models = json.load(f)
        with open(MAPPED_DIR / "ielts_speaking_topics.json", "r", encoding="utf-8") as f:
            speaking_topics = json.load(f)

        now = datetime.now()

        # 4. Insert Reading (3 records)
        for r in readings:
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
                r.get('sourceUrl'), p_json, q_json, r.get('source', 'cambridge-ielts-09-scan'),
                r.get('license'), r.get('verified', True), now
            ))

        # 5. Insert Listening (4 records)
        for l in listenings:
            s_json = json.dumps(l['scriptJson'], ensure_ascii=False) if isinstance(l['scriptJson'], (list, dict)) else l['scriptJson']
            q_json = json.dumps(l['questionsJson'], ensure_ascii=False) if isinstance(l['questionsJson'], (list, dict)) else l['questionsJson']
            cur.execute("""
                INSERT INTO "ielts_listening_sections" (
                    id, section, track, "cefrLevel", difficulty_band, title, "titleVi",
                    "scriptJson", "questionsJson", source, license, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                l['id'], str(l.get('section', '1')), l.get('track', 'academic'), l.get('cefrLevel', 'B1'),
                l.get('difficultyBand'), l['title'], l.get('titleVi'), s_json, q_json,
                l.get('source', 'cambridge-ielts-09-scan'), l.get('license'), l.get('verified', True), now
            ))

        # 6. Insert Writing Topics (2 records)
        for wt in writing_topics:
            o_json = json.dumps(wt['outlineJson'], ensure_ascii=False) if isinstance(wt['outlineJson'], (list, dict)) else wt['outlineJson']
            k_json = json.dumps(wt['keyVocabJson'], ensure_ascii=False) if isinstance(wt['keyVocabJson'], (list, dict)) else wt['keyVocabJson']
            cur.execute("""
                INSERT INTO "ielts_writing_topics" (
                    id, track, prompt, type, "typeVi", band_range, "outlineJson", "keyVocabJson", source, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                wt['id'], wt.get('track', 'academic'), wt['prompt'], wt.get('type', 'report'),
                wt.get('typeVi'), wt.get('bandRange'), o_json, k_json, wt.get('source', 'cambridge-ielts-09-scan'),
                wt.get('verified', True), now
            ))

        # 7. Insert Writing Models (2 records)
        for wm in writing_models:
            k_json = json.dumps(wm['keyVocabJson'], ensure_ascii=False) if isinstance(wm['keyVocabJson'], (list, dict)) else wm['keyVocabJson']
            cur.execute("""
                INSERT INTO "ielts_writing_models" (
                    id, task, track, topic, chart_type, chart_description, prompt, model_answer,
                    key_vocab_json, examiner_notes_vi, band_estimate, source, license, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                wm['id'], wm['task'], wm.get('track', 'academic'), wm['topic'], wm.get('chartType'),
                wm.get('chartDescription'), wm['prompt'], wm['modelAnswer'], k_json,
                wm.get('examinerNotesVi'), float(wm.get('bandEstimate', 8.0)),
                wm.get('source', 'cambridge-ielts-09-scan'), wm.get('license'),
                wm.get('verified', True), now
            ))

        # 8. Insert Speaking Topics (3 records)
        for sp in speaking_topics:
            i_json = json.dumps(sp['ideasJson'], ensure_ascii=False) if isinstance(sp['ideasJson'], (list, dict)) else sp['ideasJson']
            f_text = sp.get('followUpQuestions')
            if isinstance(f_text, list):
                f_text = "\n".join(f_text)
            cur.execute("""
                INSERT INTO "ielts_speaking_topics" (
                    id, part, track, question, "topicVi", "ideasJson", topic, follow_up_questions, source, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                sp['id'], sp['part'], sp.get('track', 'academic'), sp['question'], sp.get('topicVi'),
                i_json, sp.get('topic'), f_text, sp.get('source', 'cambridge-ielts-09-scan'),
                sp.get('verified', True), now
            ))

        conn.commit()
        print("\n[SUCCESS] Đã commit thành công 14 bản ghi vào DB local!")

        # 9. Đếm số lượng SAU
        after_counts = get_counts(conn)
        print("\n" + "=" * 60)
        print("[SỐ LƯỢNG SAU IMPORT VÀ CHÊNH LỆCH]")
        diffs = {}
        for k in before_counts:
            diff = after_counts[k] - before_counts[k]
            diffs[k] = diff
            print(f"  {k:26}: Trước={before_counts[k]:3} | Sau={after_counts[k]:3} | Chênh lệch={diff:+d}")

        assert diffs['ielts_reading_passages'] == 3, f"Expected +3 reading passages, got {diffs['ielts_reading_passages']}"
        assert diffs['ielts_listening_sections'] == 4, f"Expected +4 listening sections, got {diffs['ielts_listening_sections']}"
        assert diffs['ielts_writing_topics'] == 2, f"Expected +2 writing topics, got {diffs['ielts_writing_topics']}"
        assert diffs['ielts_writing_models'] == 2, f"Expected +2 writing models, got {diffs['ielts_writing_models']}"
        assert diffs['ielts_speaking_topics'] == 3, f"Expected +3 speaking topics, got {diffs['ielts_speaking_topics']}"

        # 10. HARD GATE SAU IMPORT
        print("\n" + "=" * 60)
        print("[HARD GATE SAU IMPORT - KIỂM TRA ĐỘ TOÀN VẸN TỪ DB]")

        # Check track='academic' on all 14 records
        for t in tables:
            cur.execute(f'SELECT id, track FROM "{t}" WHERE id LIKE %s', ('cam09-academic-t1%',))
            rows = cur.fetchall()
            for r_id, r_track in rows:
                assert r_track == 'academic', f"Record {r_id} in {t} has track='{r_track}' != 'academic'"
        print("[*] Xác minh cột track='academic': 100% bản ghi mới đều đạt chuẩn!")

        cur.execute('SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id LIKE %s', ('cam09-academic-t1%',))
        rows = cur.fetchall()
        db_reading_q_count = 0
        for r in rows:
            qs = json.loads(r[0])
            db_reading_q_count += len(qs)
            for q in qs:
                assert len(q["question"]) > 10, f"Reading Q stem too short: {q}"
                assert q.get("type"), f"Reading Q missing type: {q}"
                assert q.get("sourceRef"), f"Reading Q missing sourceRef: {q}"
        print(f"[*] Tổng câu hỏi Reading Test 1 trong DB: {db_reading_q_count} (Zero stub, thân câu > 10 chars)")
        assert db_reading_q_count == 40, f"Expected 40 reading questions in DB, got {db_reading_q_count}"

        cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id LIKE %s', ('cam09-academic-t1%',))
        rows = cur.fetchall()
        db_listening_q_count = 0
        for r in rows:
            qs = json.loads(r[0])
            db_listening_q_count += len(qs)
            for q in qs:
                assert len(q["question"]) > 10, f"Listening Q stem too short: {q}"
                assert q.get("type"), f"Listening Q missing type: {q}"
                assert q.get("sourceRef"), f"Listening Q missing sourceRef: {q}"
        print(f"[*] Tổng câu hỏi Listening Test 1 trong DB: {db_listening_q_count} (Zero stub, thân câu > 10 chars)")
        assert db_listening_q_count == 40, f"Expected 40 listening questions in DB, got {db_listening_q_count}"

        print("[PASS] HARD GATE SAU IMPORT TOÀN THẮNG!")
        print("=" * 60)

    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Import thất bại, đã rollback: {e}")
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    run_import()
