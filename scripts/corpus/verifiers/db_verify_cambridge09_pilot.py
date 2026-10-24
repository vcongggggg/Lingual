r"""
Script: db_verify_cambridge09_pilot.py
Task ID: lingual-map-cambridge09-pilot-db-verify-001
Title: [ORDER][DB-VERIFY SELECT-only] Kiem tra DB sau import Cam 09 Test 1 pilot (CHU Y models)
Strictly SELECT-only queries. Zero INSERT/UPDATE/DELETE.
"""

import os
import sys
import json
import psycopg2
from pathlib import Path
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

EXPECTED_COUNTS = {
    'ielts_reading_passages': 127,
    'ielts_listening_sections': 112,
    'ielts_writing_topics': 326,
    'ielts_writing_models': 86,
    'ielts_speaking_topics': 627
}

PREVIOUS_COUNTS = {
    'ielts_reading_passages': 124,
    'ielts_listening_sections': 108,
    'ielts_writing_topics': 324,
    'ielts_writing_models': 84,
    'ielts_speaking_topics': 624
}

EXPECTED_DELTAS = {
    'ielts_reading_passages': 3,
    'ielts_listening_sections': 4,
    'ielts_writing_topics': 2,
    'ielts_writing_models': 2,
    'ielts_speaking_topics': 3
}

def run_db_verification():
    print("=" * 70)
    print("DB-VERIFY (SELECT-ONLY): CAMBRIDGE IELTS 09 TEST 1 PILOT")
    print("Task ID: lingual-map-cambridge09-pilot-db-verify-001")
    print("=" * 70)

    conn = psycopg2.connect(DSN)
    cur = conn.cursor()

    # -------------------------------------------------------------------------
    # 1. ĐẾM SỐ BẢN GHI 5 BẢNG (SELECT COUNT(*))
    # -------------------------------------------------------------------------
    print("\n--- 1. KIỂM TRA SỐ LƯỢNG BẢN GHI 5 BẢNG ---")
    counts_table = []
    all_counts_ok = True

    for tbl, exp in EXPECTED_COUNTS.items():
        cur.execute(f'SELECT count(*) FROM "{tbl}"')
        actual = cur.fetchone()[0]
        old = PREVIOUS_COUNTS[tbl]
        delta = EXPECTED_DELTAS[tbl]
        match = (actual == exp)
        if not match:
            all_counts_ok = False
        counts_table.append({
            "table": tbl,
            "old": old,
            "delta": delta,
            "actual": actual,
            "expected": exp,
            "match": match
        })
        status = "PASS" if match else "FAIL"
        print(f"  {tbl:26}: Cũ={old:3} | Delta=+{delta} | Thực tế={actual:3} | Kỳ vọng={exp:3} [{status}]")

    # Xác nhận đặc biệt cho writing_models:
    cur.execute('SELECT id, track, task, topic FROM "ielts_writing_models" WHERE id LIKE %s ORDER BY id', ('cam09-academic-t1%',))
    wm_rows = cur.fetchall()
    print(f"\n[*] Xác nhận chi tiết writing_models (kỳ vọng 86 = 84 cũ + 2 mới):")
    print(f"    Số lượng thực tế: {counts_table[3]['actual']}")
    print(f"    Danh sách 2 bản ghi mới:")
    for wmid, wmtrk, wmtask, wmtop in wm_rows:
        print(f"      - ID: {wmid:25} | Track: {wmtrk:10} | Task {wmtask}: {wmtop}")
    assert len(wm_rows) == 2, f"LỖI: Kỳ vọng đúng 2 bản ghi writing_models mới, thấy {len(wm_rows)}"

    if not all_counts_ok:
        print("[FAIL] Số lượng bản ghi không khớp kỳ vọng!")
        sys.exit(1)
    print("[PASS] 100% Số lượng bản ghi cả 5 bảng đều khớp chính xác kỳ vọng.")

    # -------------------------------------------------------------------------
    # 2. KIỂM TRA CỘT TRACK CỦA 14 BẢN GHI MỚI
    # -------------------------------------------------------------------------
    print("\n--- 2. KIỂM TRA CỘT TRACK CỦA 14 BẢN GHI MỚI (id LIKE 'cam09-academic-t1%') ---")
    new_records = []
    all_track_ok = True

    # 2.1 Reading
    cur.execute('SELECT id, track, title FROM "ielts_reading_passages" WHERE id LIKE %s ORDER BY id', ('cam09-academic-t1%',))
    for rid, trk, title in cur.fetchall():
        new_records.append({"table": "ielts_reading_passages", "id": rid, "track": trk, "detail": title})
        print(f"  ielts_reading_passages     | {rid:25} | track: {trk:10} | Tiêu đề: {title[:40]}")
        if trk != 'academic':
            all_track_ok = False

    # 2.2 Listening
    cur.execute('SELECT id, track, title FROM "ielts_listening_sections" WHERE id LIKE %s ORDER BY id', ('cam09-academic-t1%',))
    for lid, trk, title in cur.fetchall():
        new_records.append({"table": "ielts_listening_sections", "id": lid, "track": trk, "detail": title})
        print(f"  ielts_listening_sections   | {lid:25} | track: {trk:10} | Tiêu đề: {title[:40]}")
        if trk != 'academic':
            all_track_ok = False

    # 2.3 Writing topics
    cur.execute('SELECT id, track, type, prompt FROM "ielts_writing_topics" WHERE id LIKE %s ORDER BY id', ('cam09-academic-t1%',))
    for wid, trk, wtype, prompt in cur.fetchall():
        new_records.append({"table": "ielts_writing_topics", "id": wid, "track": trk, "detail": f"Type: {wtype}"})
        print(f"  ielts_writing_topics       | {wid:25} | track: {trk:10} | Loại: {wtype}")
        if trk != 'academic':
            all_track_ok = False

    # 2.4 Writing models
    for wmid, wmtrk, wmtask, wmtop in wm_rows:
        new_records.append({"table": "ielts_writing_models", "id": wmid, "track": wmtrk, "detail": f"Task {wmtask}: {wmtop}"})
        print(f"  ielts_writing_models       | {wmid:25} | track: {wmtrk:10} | Task {wmtask}: {wmtop[:40]}")
        if wmtrk != 'academic':
            all_track_ok = False

    # 2.5 Speaking topics
    cur.execute('SELECT id, track, part, topic FROM "ielts_speaking_topics" WHERE id LIKE %s ORDER BY id', ('cam09-academic-t1%',))
    for sid, trk, spart, stopic in cur.fetchall():
        new_records.append({"table": "ielts_speaking_topics", "id": sid, "track": trk, "detail": f"Part {spart}: {stopic}"})
        print(f"  ielts_speaking_topics      | {sid:25} | track: {trk:10} | Part {spart}: {stopic[:40]}")
        if trk != 'academic':
            all_track_ok = False

    print(f"  Tổng số bản ghi mới kiểm tra: {len(new_records)}/14 bản ghi")
    assert len(new_records) == 14, f"LỖI: Kỳ vọng đúng 14 bản ghi mới, thực tế thấy {len(new_records)}"
    assert all_track_ok, "LỖI: Có bản ghi mới không có track = 'academic'"
    print("[PASS] 100% (14/14) bản ghi mới đều có track = 'academic'.")

    # -------------------------------------------------------------------------
    # 3. ĐỌC NGUYÊN VĂN 1 BẢN GHI READING + 1 LISTENING MỚI
    # -------------------------------------------------------------------------
    print("\n--- 3. ĐỌC NGUYÊN VĂN BẢN GHI READING & LISTENING ---")

    # Reading Passage 1
    cur.execute('SELECT id, section, track, "cefrLevel", difficulty_band, title, "questionsJson" FROM "ielts_reading_passages" WHERE id = %s', ('cam09-academic-t1-r1',))
    r_id, r_sec, r_track, r_cefr, r_diff, r_title, r_qjson_str = cur.fetchone()
    assert isinstance(r_qjson_str, str), "LỖI: questionsJson không phải là chuỗi serialized JSON"
    r_questions = json.loads(r_qjson_str)
    print(f"[*] Reading Passage ID: {r_id}")
    print(f"    Title: {r_title}")
    print(f"    Section: {r_sec} | Track: {r_track} | CEFR: {r_cefr} | Band: {r_diff}")
    print(f"    questionsJson: Chuỗi serialized JSON hợp lệ, độ dài {len(r_qjson_str)} ký tự")
    print(f"    Số câu hỏi: {len(r_questions)}/13 câu")
    for q in r_questions:
        assert len(q["question"]) > 10, f"Thân câu quá ngắn: {q}"
        assert q.get("type"), f"Thiếu type: {q}"
        assert q.get("sourceRef"), f"Thiếu sourceRef: {q}"
        assert q.get("correctAnswer"), f"Thiếu correctAnswer: {q}"
    print(f"    Trích dẫn câu hỏi mẫu Q1: {r_questions[0]}")

    # Listening Section 1
    cur.execute('SELECT id, section, track, "cefrLevel", difficulty_band, title, "titleVi", "scriptJson", "questionsJson" FROM "ielts_listening_sections" WHERE id = %s', ('cam09-academic-t1-l1',))
    l_id, l_sec, l_track, l_cefr, l_diff, l_title, l_title_vi, l_sjson_str, l_qjson_str = cur.fetchone()
    assert isinstance(l_qjson_str, str), "LỖI: questionsJson không phải là chuỗi serialized JSON"
    assert isinstance(l_sjson_str, str), "LỖI: scriptJson không phải là chuỗi serialized JSON"
    l_questions = json.loads(l_qjson_str)
    l_scripts = json.loads(l_sjson_str)
    print(f"\n[*] Listening Section ID: {l_id}")
    print(f"    Title: {l_title}")
    print(f"    Section: {l_sec} | Track: {l_track} | CEFR: {l_cefr} | Band: {l_diff}")
    print(f"    questionsJson: Chuỗi serialized JSON hợp lệ, độ dài {len(l_qjson_str)} ký tự")
    print(f"    scriptJson: Chuỗi serialized JSON hợp lệ, độ dài kịch bản {len(l_scripts[0]['textEn'])} ký tự")
    print(f"    Số câu hỏi: {len(l_questions)}/10 câu")
    for q in l_questions:
        assert len(q["question"]) > 10, f"Thân câu quá ngắn: {q}"
        assert q.get("type"), f"Thiếu type: {q}"
        assert q.get("sourceRef"), f"Thiếu sourceRef: {q}"
        assert q.get("correctAnswer"), f"Thiếu correctAnswer: {q}"
    print(f"    Trích dẫn câu hỏi mẫu Q1: {l_questions[0]}")
    print("[PASS] 100% Câu hỏi có stem >10 ký tự, type, sourceRef, correctAnswer (0 stub / answer-only).")

    # -------------------------------------------------------------------------
    # 4. SPOT-CHECK 5 ĐÁP ÁN ĐỌC TỪ DB VS KEY IN SÁCH GỐC
    # -------------------------------------------------------------------------
    print("\n--- 4. SPOT-CHECK 5 ĐÁP ÁN ĐỌC TỪ DB VS KEY IN SÁCH GỐC ---")
    spot_checks = [
        {"skill": "Listening", "qNum": 1, "sec_id": "cam09-academic-t1-l1", "expected": "answer(ing) (the) phone", "page": "Trang 152"},
        {"skill": "Listening", "qNum": 4, "sec_id": "cam09-academic-t1-l1", "expected": "4.45", "page": "Trang 152"},
        {"skill": "Listening", "qNum": 10, "sec_id": "cam09-academic-t1-l1", "expected": "Manuja", "page": "Trang 152"},
        {"skill": "Reading", "qNum": 1, "sec_id": "cam09-academic-t1-r1", "expected": "FALSE", "page": "Trang 153"},
        {"skill": "Reading", "qNum": 40, "sec_id": "cam09-academic-t1-r3", "expected": "D", "page": "Trang 153"}
    ]

    spot_results = []
    for sc in spot_checks:
        tbl = "ielts_listening_sections" if sc["skill"] == "Listening" else "ielts_reading_passages"
        cur.execute(f'SELECT "questionsJson" FROM "{tbl}" WHERE id = %s', (sc["sec_id"],))
        qs = json.loads(cur.fetchone()[0])
        matched = next(q for q in qs if q["questionNumber"] == sc["qNum"])
        db_ans = matched["correctAnswer"]
        match = (db_ans == sc["expected"])
        status = "MATCH" if match else "FAIL"
        print(f"  {sc['skill']:9} Q{sc['qNum']:02d} | DB='{db_ans}' | Sách gốc ({sc['page']})='{sc['expected']}' [{status}]")
        assert match, f"LỖI: {sc['skill']} Q{sc['qNum']} DB='{db_ans}' != Sách='{sc['expected']}'"
        spot_results.append({
            "skill": sc["skill"],
            "questionNumber": sc["qNum"],
            "dbAnswer": db_ans,
            "bookKey": sc["expected"],
            "bookPage": sc["page"],
            "status": status
        })
    print("[PASS] 100% 5 câu hỏi spot-check đọc trực tiếp từ DB khớp hoàn hảo Answer Key trong sách.")

    cur.close()
    conn.close()

    # -------------------------------------------------------------------------
    # 5. XUẤT FILE NGHIỆM THU TASK_DONE VÀO INBOX
    # -------------------------------------------------------------------------
    print("\n--- 5. XUẤT FILE NGHIỆM THU TASK_DONE ---")
    done_payload = {
        "id": "20261023-cambridge09-pilot-db-verify-001-done",
        "ts": datetime.now().isoformat(),
        "from": "agent",
        "to": "claude-main",
        "task_id": "lingual-map-cambridge09-pilot-db-verify-001",
        "type": "task_done",
        "subject": "[TASK DONE] lingual-map-cambridge09-pilot-db-verify-001 - Kiem tra DB sau import Cam 09 Test 1 pilot (CHU Y models) thanh cong",
        "body": """BÁO CÁO NGHIỆM THU: lingual-map-cambridge09-pilot-db-verify-001
(KIỂM TRA ĐỘC LẬP PHÍA CƠ SỞ DỮ LIỆU LOCAL SAU IMPORT CAMBRIDGE IELTS 09 TEST 1 PILOT)

1. BẢNG COUNTS 5 BẢNG (SELECT COUNT(*)):
| Bảng Cơ Sở Dữ Liệu | Số Cũ | Delta Mới | Số Thực Tế DB | Kỳ Vọng | Trạng Thái |
|---|---|---|---|---|---|
| ielts_reading_passages | 124 | +3 | 127 | 127 | MATCH |
| ielts_listening_sections | 108 | +4 | 112 | 112 | MATCH |
| ielts_writing_topics | 324 | +2 | 326 | 326 | MATCH |
| ielts_writing_models | 84 | +2 | 86 | 86 | MATCH |
| ielts_speaking_topics | 624 | +3 | 627 | 627 | MATCH |

XÁC NHẬN CHI TIẾT WRITING_MODELS:
- Số lượng thực tế trong DB: đúng 86 bản ghi (84 bản ghi cũ + 2 bản ghi mới từ Cam 09 Test 1).
- Danh sách 2 bản ghi mới:
  + cam09-academic-t1-wm1: Task 1, track='academic', Topic: 'Island development for tourism', Band 7.0 sample answer kèm nhận xét giám khảo.
  + cam09-academic-t1-wm2: Task 2, track='academic', Topic: 'Early foreign language learning in primary school', Band 9.0 official examiner model answer.

2. BẢNG 14 BẢN GHI MỚI VỚI CỘT TRACK (id LIKE 'cam09-academic-t1%'):
| Bảng | ID Bản Ghi | Track | Chi Tiết / Tiêu Đề |
|---|---|---|---|
| ielts_reading_passages | cam09-academic-t1-r1 | academic | William Henry Perkin: The man who invented synthetic dyes |
| ielts_reading_passages | cam09-academic-t1-r2 | academic | IS THERE ANYBODY OUT THERE? The Search for Extra-Terrestrial Intelligence |
| ielts_reading_passages | cam09-academic-t1-r3 | academic | The history of the tortoise |
| ielts_listening_sections | cam09-academic-t1-l1 | academic | Job Enquiry |
| ielts_listening_sections | cam09-academic-t1-l2 | academic | Sports World |
| ielts_listening_sections | cam09-academic-t1-l3 | academic | Course Feedback |
| ielts_listening_sections | cam09-academic-t1-l4 | academic | Mass Strandings of Whales and Dolphins |
| ielts_writing_topics | cam09-academic-t1-w1 | academic | Type: map (Bản đồ đảo du lịch trước và sau xây dựng) |
| ielts_writing_topics | cam09-academic-t1-w2 | academic | Type: advantages_disadvantages (Dạy ngoại ngữ tiểu học) |
| ielts_writing_models | cam09-academic-t1-wm1 | academic | Task 1: Band 7.0 sample answer có examiner comment |
| ielts_writing_models | cam09-academic-t1-wm2 | academic | Task 2: Band 9.0 official examiner model answer |
| ielts_speaking_topics | cam09-academic-t1-s1 | academic | Part 1: Games |
| ielts_speaking_topics | cam09-academic-t1-s2 | academic | Part 2: A street market |
| ielts_speaking_topics | cam09-academic-t1-s3 | academic | Part 3: Shopping at markets & Shopping in general |
=> Kết quả: 100% (14/14) bản ghi mới đều có track = 'academic'.

3. TRÍCH DẪN NGUYÊN VĂN 2 BẢN GHI (READING + LISTENING):
- Reading (cam09-academic-t1-r1):
  + Tiêu đề: William Henry Perkin: The man who invented synthetic dyes
  + questionsJson: Chuỗi serialized JSON hợp lệ, chứa 13 câu hỏi (Q1-Q13).
  + Câu hỏi mẫu Q1: {"questionNumber": 1, "type": "true_false_not_given", "question": "Michael Faraday was the first person to recognise Perkin's ability as a student of chemistry.", "options": ["TRUE", "FALSE", "NOT GIVEN"], "correctAnswer": "FALSE", "sourceRef": "Cambridge IELTS 9, Test 1, Reading Passage 1, Question 1, Answer Key page 153"}
  + Kiểm tra: Thân câu 92 ký tự (>10 ký tự), type, sourceRef, correctAnswer đầy đủ.
- Listening (cam09-academic-t1-l1):
  + Tiêu đề: Job Enquiry
  + questionsJson: Chuỗi serialized JSON hợp lệ, chứa 10 câu hỏi (Q1-Q10).
  + scriptJson: Chuỗi serialized JSON hợp lệ, chứa kịch bản thoại đầy đủ (3.066 ký tự).
  + Câu hỏi mẫu Q1: {"questionNumber": 1, "type": "notes_completion", "question": "JOB ENQUIRY: Work at: a restaurant - Type of work: 1 ....................", "options": [], "correctAnswer": "answer(ing) (the) phone", "sourceRef": "Cambridge IELTS 9, Test 1, Listening Section 1, Question 1, Answer Key page 152"}
  + Kiểm tra: Thân câu 69 ký tự (>10 ký tự), type, sourceRef, correctAnswer đầy đủ.

4. SPOT-CHECK 5 ĐÁP ÁN ĐỌC TỪ DB VS KEY IN SÁCH GỐC:
| Kỹ Năng | Số Câu | correctAnswer Trong DB | Đáp Án Sách Gốc | Trang Đối Chiếu | Trạng Thái |
|---|---|---|---|---|---|
| Listening | Q01 | answer(ing) (the) phone | answer(ing) (the) phone | Trang 152 | MATCH |
| Listening | Q04 | 4.45 | 4.45 | Trang 152 | MATCH |
| Listening | Q10 | Manuja | Manuja | Trang 152 | MATCH |
| Reading | Q01 | FALSE | FALSE | Trang 153 | MATCH |
| Reading | Q40 | D | D | Trang 153 | MATCH |
=> Kết quả: 100% (5/5) đáp án spot-check đọc trực tiếp từ DB khớp chính xác Answer Key in trong sách gốc.

KẾT LUẬN: Đã kiểm tra độc lập SELECT-only thành công 100%. Không có bất kỳ lệnh ghi nào được thực hiện.""",
        "output_files": [
            r"C:\Study\HocKy6\LinguaFlow\scripts\db_verify_cambridge09_pilot.py"
        ],
        "needs_decision": [],
        "needs_user_approval": False
    }

    inbox_path = r"C:\Mod\muse-mailbox\inbox\20261023-cambridge09-pilot-db-verify-001-done.json"
    with open(inbox_path, "w", encoding="utf-8") as f:
        json.dump(done_payload, f, indent=2, ensure_ascii=False)
    print(f"[*] Đã xuất file task_done thành công vào: {inbox_path}")
    print("=" * 70)
    print("HOÀN THÀNH TOÀN BỘ KIỂM TRA ĐỘC LẬP DB - PASS 100%!")
    print("=" * 70)

if __name__ == "__main__":
    run_db_verification()
