# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

receipt = {
  "id": "20261024-012000-cam09",
  "ts": "2026-10-24T01:20:00+07:00",
  "from": "agent",
  "to": "muse",
  "task_id": "lingual-map-cambridge09-tests234-001",
  "type": "task_done",
  "subject": "[NGHIỆM THU] Hoàn tất Map + Import Cambridge IELTS 09 Academic Tests 2-4 (Step 0 Hard Gate 80/80 từng test, Decoupled JSON, track='academic')",
  "body": """Kính gửi Muse và Trưởng dự án LinguaFlow,

Agent Trợ lý Hệ thống báo cáo nghiệm thu hoàn tất task 'lingual-map-cambridge09-tests234-001':
Ánh xạ (Mapping) và Nạp (Import) toàn bộ dữ liệu sách Cambridge IELTS 09 (Academic Tests 2, 3, 4) vào hệ thống LinguaFlow với Bước 0 Hard Gate tuyệt đối.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. KẾT QUẢ ĐỐI SOÁT VÀ CHUẨN HÓA DỮ LIỆU (MAPPING & STEP 0 HARD GATE):
- Sách nguồn: Cambridge IELTS 09 Academic Practice Tests (bản quét scan/OCR).
- Khôi phục 100% các câu hỏi bị mất hoặc lỗi scan qua đối soát trực tiếp từ ảnh in PDF sách gốc bằng PyMuPDF:
  + Test 2: Q8 (crowd noise), Q17-20 bản đồ công viên Hinchingbrooke (bird hide, dog-walking area, flower garden, wooded area), Q35 (Iconoclasts fear).
  + Test 3: Q9-12 The language debate, Q23-26 sơ đồ An Undersea Turbine (maintenance, slow (turning), low pressure, cavitation), Q33-37 Voyager 1 space probe.
  + Test 4: Q11-13 sơ đồ Water Heater (on/off switch, reset button, warning indicator), Q1-13 Marie Curie (Q4: Marie stopped doing research for several years when her children were born), Q39 (The boundaries of Leyden have changed little since the seventeenth century), Task 2 nguyên văn bài làm viết tay của thí sinh Band 4.
- Đáp án đối soát trực tiếp từ Answer Key in ấn chính thức (Trang 154-159):
  + Test 2: Listening (40/40), Reading (40/40) -> 100% KHỚP
  + Test 3: Listening (40/40), Reading (40/40) -> 100% KHỚP
  + Test 4: Listening (40/40), Reading (40/40) -> 100% KHỚP
  + Tổng cộng toàn bộ sách (Tests 1-4): 320/320 câu hỏi (160 Listening + 160 Reading) khớp 100% Answer Key in gốc.
- Đã khử sạch 100% scan artifacts (HTML comments <!-- ... -->, watermarks TopSage/大家网, leaked markdown headers ^##).
- 100% câu hỏi có question stem > 10 ký tự, type, sourceRef, correctAnswer. Zero câu hỏi stub / answer-only.
- 100% bản ghi được gắn cờ track='academic' trên cả 5 bảng và file JSON mapped.
- Manifest và Exploitation Report đã được tái hòa giải 100% (87 segments: 70 exploited, 17 unexploited/archive-only như GT modules, front matter).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. NGUYÊN TẮC DECOUPLING VÀ CHỨA DỮ LIỆU (CONTAINMENT):
- Toàn bộ literal dữ liệu sách được lưu trữ ngoài repo tại:
  + C:\\Mod\\muse-data-exchange\\book-corpus-mapped\\cambridge-ielts-09\\cam09-academic-test-2-data.json
  + C:\\Mod\\muse-data-exchange\\book-corpus-mapped\\cambridge-ielts-09\\cam09-academic-test-3-data.json
  + C:\\Mod\\muse-data-exchange\\book-corpus-mapped\\cambridge-ielts-09\\cam09-academic-test-4-data.json
- Các loaders trong repo (scripts/cambridge09_data_t2.py, scripts/cambridge09_data_t3.py, scripts/cambridge09_data_t4.py) là lightweight loaders đúng 34 dòng mỗi file, đọc JSON ngoài repo và KHÔNG chứa literal sách.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. KẾT QUẢ IMPORT VÀO POSTGRESQL LOCAL (linguaflow_db):
- Đã import thành công 42 bản ghi mới của Tests 2, 3, 4 (14 bản ghi/test * 3 tests):
  + Reading Passages   : 127 -> 136 (+9 bản ghi)
  + Listening Sections : 112 -> 124 (+12 bản ghi)
  + Writing Topics     : 326 -> 332 (+6 bản ghi)
  + Writing Models     :  86 ->  92 (+6 bản ghi)
  + Speaking Topics    : 627 -> 636 (+9 bản ghi)
  => Tổng số bản ghi thêm mới: đúng 42 bản ghi.
- Cơ chế Early-Exit Guard: Kiểm tra idempotency theo tiền tố từng test ('cam09-academic-t2%', 't3%', 't4%'). Chạy lại chèn 0 bản ghi an toàn.
- Audit trực tiếp từ DB bằng script độc lập SELECT-only (scripts/db_verify_cambridge09_tests234.py):
  + 56/56 bản ghi của Cambridge 09 (Tests 1-4) đều có track='academic'.
  + 320/320 câu hỏi đọc ra từ DB đều toàn vẹn, stems > 10 ký tự.
  + Spot-check 6 câu hỏi ngẫu nhiên khớp 100% trang in 154-159.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. PHÁT HÀNH VÀ LƯU TRỮ:
- Mapped JSON xuất tại: C:\\Mod\\muse-data-exchange\\book-corpus-mapped\\cambridge-ielts-09\\
  + ielts_listening_sections.json (16 sections, 160 questions)
  + ielts_reading_passages.json (12 passages, 160 questions)
  + ielts_writing_topics.json (8 topics)
  + ielts_writing_models.json (8 models)
  + ielts_speaking_topics.json (12 topics)
  + manifest.json (87 segments)
  + exploitation-report.json (100% reconciliation)
- Git commit: 74594de trên nhánh 'develop' (đã push thành công lên origin/develop).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. GIỚI HẠN PHẠM VI (SCOPE BOUNDARY):
- Nhiệm vụ ánh xạ và nạp Cambridge IELTS 09 Academic Tests 2-4 đã hoàn thành trọn vẹn 100%.
- Agent TUÂN THỦ NGHIÊM NGẶT GIỚI HẠN PHẠM VI: DỪNG LẠI TẠI ĐÂY để chờ kiểm tra độc lập (audit), TUYỆT ĐỐI KHÔNG tự ý chuyển sang sách tiếp theo.
""",
  "needs_decision": [],
  "needs_user_approval": False
}

out_path = r"C:\Mod\muse-mailbox\inbox\20261023-cambridge09-tests234-001-done.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(receipt, f, indent=2, ensure_ascii=False)

print(f"[SUCCESS] Exported receipt to {out_path}")
