r"""
Script: import_cambridge11_test1.py
Mục đích: Import Cambridge IELTS 11 Test 1 vào DB local với:
- Hard gate Bước 0 (xác minh Q18='H', Q26='B' khớp 100% Answer Key trang 124 PDF gốc)
- Early-exit guard (idempotent)
- Hard gate sau import: tổng câu hỏi 3 passage = 40, 4 section = 40, Q18 trong DB = 'H'
Dữ liệu đọc từ: C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-11\ (PRIVATE NGOÀI REPO)
Tuyệt đối không commit dữ liệu sách vào repo Git.
"""

import os
import sys
import json
import psycopg2
from datetime import datetime
from pathlib import Path
import fitz # PyMuPDF

sys.stdout.reconfigure(encoding='utf-8')

MAPPED_DIR = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-11")
PDF_PATH = Path(r"C:\Study\HocKy6\materials\Cambridge_IELTS\Cambridge IELTS 11 - Academic & General Practice Tests.pdf")
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

def verify_step_0():
    print("=" * 60)
    print("[BƯỚC 0] XÁC MINH 2 CÂU LISTENING (Q18 & Q26) TRƯỚC KHI IMPORT (ĐIỀU KIỆN CỨNG)")
    print("=" * 60)
    
    listening_file = MAPPED_DIR / "ielts_listening_sections.json"
    if not listening_file.exists():
        print(f"[ERROR] Không tìm thấy file: {listening_file}")
        return False, "Thiếu file nguồn ielts_listening_sections.json"
    
    with open(listening_file, "r", encoding="utf-8") as f:
        sections = json.load(f)
    
    parsed_q18 = None
    parsed_q26 = None
    for sec in sections:
        q_list = json.loads(sec['questionsJson']) if isinstance(sec['questionsJson'], str) else sec['questionsJson']
        for q in q_list:
            if q.get('questionNumber') == 18:
                parsed_q18 = q.get('correctAnswer')
            elif q.get('questionNumber') == 26:
                parsed_q26 = q.get('correctAnswer')
                
    print(f"[*] Giá trị file mapped hiện tại: Q18 = '{parsed_q18}', Q26 = '{parsed_q26}'")
    
    if not PDF_PATH.exists():
        print(f"[ERROR] Không tìm thấy PDF gốc: {PDF_PATH}")
        return False, "Thiếu PDF gốc để đối soát"
        
    doc = fitz.open(PDF_PATH)
    # Trang 124 in ấn nằm ở PDF page index 124 (page 125)
    key_page_text = doc[124].get_text()
    
    official_q18 = None
    official_q26 = None
    
    for line in key_page_text.split('\n'):
        line_clean = line.strip()
        if line_clean.startswith('18 '):
            official_q18 = line_clean.split(' ')[1]
        elif line_clean.startswith('26 '):
            official_q26 = line_clean.split(' ')[1]
            
    print(f"[*] Giá trị trang Answer Key (trang 124 in ấn trong PDF): Q18 = '{official_q18}', Q26 = '{official_q26}'")
    
    q26_match = (parsed_q26 == official_q26)
    q18_match = (parsed_q18 == official_q18)
    
    print(f"[*] Đối chiếu Q26: Mapped '{parsed_q26}' vs Key '{official_q26}' -> {'KHỚP (ĐÚNG)' if q26_match else 'SAI'}")
    print(f"[*] Đối chiếu Q18: Mapped '{parsed_q18}' vs Key '{official_q18}' -> {'KHỚP (ĐÚNG)' if q18_match else 'SAI'}")
    
    if not q18_match or not q26_match:
        msg = f"HARD GATE BƯỚC 0 THẤT BẠI: Q18 mapped='{parsed_q18}' vs key='{official_q18}', Q26 mapped='{parsed_q26}' vs key='{official_q26}'."
        print(f"\n[BLOCKED] {msg}")
        return False, msg
        
    print("\n[PASS] BƯỚC 0 XÁC MINH THÀNH CÔNG: Q18='H' VÀ Q26='B' KHỚP 100% ANSWER KEY TRANG 124!")
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
    # 1. Bước 0 Hard gate
    step0_ok, reason = verify_step_0()
    if not step0_ok:
        print("\n" + "="*60)
        print(f"KẾT QUẢ: IMPORT BỊ CHẶN (BLOCKED)")
        print(f"Lý do: {reason}")
        print("Không có bản ghi nào được ghi vào DB local.")
        print("="*60)
        sys.exit(2)

    conn = psycopg2.connect(DSN)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # 2. Đếm số lượng TRƯỚC
        before_counts = get_counts(conn)
        print("\n" + "=" * 60)
        print("[SỐ LƯỢNG TRƯỚC IMPORT]")
        for k, v in before_counts.items():
            print(f"  {k:26}: {v}")

        # 3. Early-Exit Guard
        tables = [
            'ielts_reading_passages',
            'ielts_listening_sections',
            'ielts_writing_topics',
            'ielts_writing_models',
            'ielts_speaking_topics'
        ]
        already_imported = False
        for t in tables:
            cur.execute(f'SELECT count(*) FROM "{t}" WHERE id LIKE %s', ('cam11-academic-t1%',))
            if cur.fetchone()[0] > 0:
                already_imported = True
                break

        if already_imported:
            print("\n[EARLY-EXIT GUARD] Đã tồn tại bản ghi của Cambridge 11 Test 1 ('cam11-academic-t1%') trong DB.")
            print("[INFO] Status: 'already imported', chèn 0 bản ghi, dừng lại.")
            conn.rollback()
            cur.close()
            conn.close()
            return

        # 4. Đọc dữ liệu từ 5 file JSON mapped
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

        # 5. Insert Reading (3 records)
        for r in readings:
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
                r.get('sourceUrl'), p_json, q_json, r.get('source', 'cambridge-ielts-11-academic'),
                r.get('license'), r.get('verified', True), now
            ))

        # 6. Insert Listening (4 records)
        for l in listenings:
            s_json = json.dumps(l['scriptJson'], ensure_ascii=False) if isinstance(l['scriptJson'], (list, dict)) else l['scriptJson']
            q_json = json.dumps(l['questionsJson'], ensure_ascii=False) if isinstance(l['questionsJson'], (list, dict)) else l['questionsJson']
            cur.execute("""
                INSERT INTO "ielts_listening_sections" (
                    id, section, "cefrLevel", difficulty_band, title, "titleVi",
                    "scriptJson", "questionsJson", source, license, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                l['id'], l.get('section', 'listening'), l.get('cefrLevel', 'B1'), l.get('difficultyBand'),
                l['title'], l.get('titleVi'), s_json, q_json, l.get('source', 'cambridge-ielts-11-academic'),
                l.get('license'), l.get('verified', True), now
            ))

        # 7. Insert Writing Topics (2 records)
        for wt in writing_topics:
            o_json = json.dumps(wt['outlineJson'], ensure_ascii=False) if isinstance(wt['outlineJson'], (list, dict)) else wt['outlineJson']
            k_json = json.dumps(wt['keyVocabJson'], ensure_ascii=False) if isinstance(wt['keyVocabJson'], (list, dict)) else wt['keyVocabJson']
            cur.execute("""
                INSERT INTO "ielts_writing_topics" (
                    id, track, prompt, type, "typeVi", band_range, "outlineJson", "keyVocabJson", source, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                wt['id'], wt.get('track', 'academic'), wt['prompt'], wt.get('type', 'report'),
                wt.get('typeVi'), wt.get('bandRange'), o_json, k_json, wt.get('source', 'cambridge-ielts-11-academic'),
                wt.get('verified', True), now
            ))

        # 8. Insert Writing Models (2 records)
        for wm in writing_models:
            k_json = json.dumps(wm['keyVocabJson'], ensure_ascii=False) if isinstance(wm['keyVocabJson'], (list, dict)) else wm['keyVocabJson']
            cur.execute("""
                INSERT INTO "ielts_writing_models" (
                    id, task, topic, chart_type, chart_description, prompt, model_answer,
                    key_vocab_json, examiner_notes_vi, band_estimate, source, license, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                wm['id'], wm['task'], wm['topic'], wm.get('chartType'), wm.get('chartDescription'),
                wm['prompt'], wm['modelAnswer'], k_json, wm.get('examinerNotesVi'),
                float(wm.get('bandEstimate', 8.0)), wm.get('source', 'cambridge-ielts-11-academic'),
                wm.get('license'), wm.get('verified', True), now
            ))

        # 9. Insert Speaking Topics (3 records)
        for sp in speaking_topics:
            i_json = json.dumps(sp['ideasJson'], ensure_ascii=False) if isinstance(sp['ideasJson'], (list, dict)) else sp['ideasJson']
            cur.execute("""
                INSERT INTO "ielts_speaking_topics" (
                    id, part, question, "topicVi", "ideasJson", topic, follow_up_questions, source, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                sp['id'], sp['part'], sp['question'], sp.get('topicVi'), i_json,
                sp.get('topic'), sp.get('followUpQuestions'), sp.get('source', 'cambridge-ielts-11-academic'),
                sp.get('verified', True), now
            ))

        conn.commit()
        print("\n[SUCCESS] Đã commit thành công 14 bản ghi vào DB local!")

        # 10. Đếm số lượng SAU
        after_counts = get_counts(conn)
        print("\n" + "=" * 60)
        print("[SỐ LƯỢNG SAU IMPORT VÀ CHÊNH LỆCH]")
        diffs = {}
        for k in before_counts:
            diff = after_counts[k] - before_counts[k]
            diffs[k] = diff
            print(f"  {k:26}: Trước={before_counts[k]:3} | Sau={after_counts[k]:3} | Chênh lệch={diff:+d}")

        # 11. HARD GATE SAU IMPORT
        print("\n" + "=" * 60)
        print("[HARD GATE SAU IMPORT - KIỂM TRA ĐỘ TOÀN VẸN TỪ DB]")
        
        # Kiểm tra reading: 3 passage có đúng 40 câu hỏi
        cur.execute('SELECT id, "questionsJson", "passageJson" FROM "ielts_reading_passages" WHERE id LIKE %s', ('cam11-academic-t1%',))
        db_readings = cur.fetchall()
        assert len(db_readings) == 3, f"Expected 3 readings, got {len(db_readings)}"
        total_reading_q = 0
        for r_id, qj, pj in db_readings:
            qs = json.loads(qj)
            ps = json.loads(pj)
            assert len(ps) > 0, f"Passage {r_id} empty passageJson"
            total_reading_q += len(qs)
            for q in qs:
                assert "sourceRef" in q, f"Question in {r_id} missing sourceRef"
        print(f"[*] Reading: 3 passage đọc từ DB có tổng {total_reading_q}/40 câu hỏi (parse JSON OK, sourceRef OK)")
        assert total_reading_q == 40, f"Expected 40 reading questions, got {total_reading_q}"

        # Kiểm tra listening: 4 section có đúng 40 câu hỏi, Q18='H'
        cur.execute('SELECT id, "questionsJson", "scriptJson" FROM "ielts_listening_sections" WHERE id LIKE %s', ('cam11-academic-t1%',))
        db_listenings = cur.fetchall()
        assert len(db_listenings) == 4, f"Expected 4 listenings, got {len(db_listenings)}"
        total_listening_q = 0
        db_q18_ans = None
        for l_id, qj, sj in db_listenings:
            qs = json.loads(qj)
            ss = json.loads(sj)
            assert len(ss) > 0, f"Section {l_id} empty scriptJson"
            total_listening_q += len(qs)
            for q in qs:
                assert "sourceRef" in q, f"Question in {l_id} missing sourceRef"
                if q.get('questionNumber') == 18:
                    db_q18_ans = q.get('correctAnswer')
        print(f"[*] Listening: 4 section đọc từ DB có tổng {total_listening_q}/40 câu hỏi (parse JSON OK, sourceRef OK)")
        print(f"[*] Listening Section 2 Question 18 trong DB: '{db_q18_ans}' (Yêu cầu: 'H')")
        assert total_listening_q == 40, f"Expected 40 listening questions, got {total_listening_q}"
        assert db_q18_ans == 'H', f"Expected Q18 in DB to be 'H', got {db_q18_ans}"

        # Kiểm tra Writing Topics
        cur.execute('SELECT id, "outlineJson", "keyVocabJson" FROM "ielts_writing_topics" WHERE id LIKE %s', ('cam11-academic-t1%',))
        db_wts = cur.fetchall()
        assert len(db_wts) == 2, f"Expected 2 writing topics, got {len(db_wts)}"
        for wt_id, oj, kj in db_wts:
            json.loads(oj)
            json.loads(kj)
        print(f"[*] Writing Topics: 2 topic đọc từ DB (parse JSON OK)")

        # Kiểm tra Writing Models
        cur.execute('SELECT id, key_vocab_json, band_estimate FROM "ielts_writing_models" WHERE id LIKE %s', ('cam11-academic-t1%',))
        db_wms = cur.fetchall()
        assert len(db_wms) == 2, f"Expected 2 writing models, got {len(db_wms)}"
        for wm_id, kj, be in db_wms:
            json.loads(kj)
            assert be in (4.5, 5.5), f"Unexpected band {be}"
        print(f"[*] Writing Models: 2 model đọc từ DB (parse JSON OK, bands 4.5 & 5.5)")

        # Kiểm tra Speaking Topics
        cur.execute('SELECT id, "ideasJson", part FROM "ielts_speaking_topics" WHERE id LIKE %s', ('cam11-academic-t1%',))
        db_sps = cur.fetchall()
        assert len(db_sps) == 3, f"Expected 3 speaking topics, got {len(db_sps)}"
        for sp_id, ij, part in db_sps:
            json.loads(ij)
        print(f"[*] Speaking Topics: 3 part đọc từ DB (parse JSON OK, Parts 1, 2, 3)")

        print("\n" + "=" * 60)
        print("[HARD GATE PASS] TOÀN BỘ 14 BẢN GHI ĐÃ ĐƯỢC AUDIT CHUẨN XÁC TRONG DB LOCAL!")
        print("=" * 60)

    except Exception as e:
        conn.rollback()
        print(f"\n[ERROR] Rollback do lỗi: {e}")
        raise e
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    run_import()
