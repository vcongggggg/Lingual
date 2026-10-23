r"""
Script: send_cambridge07_tests234_done.py
Description: Generates acceptance receipt and task_done message to Muse mailbox for Cambridge IELTS 07 Tests 2-4
"""

import os
import sys
import json
from datetime import datetime
from pathlib import Path

# Add mailbox to path
sys.path.insert(0, r"C:\Mod\muse-mailbox")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import mailbox

TASK_ID = "lingual-map-cambridge07-tests234-001"
MSG_TYPE = "task_done"
SUBJECT = "[NGHIỆM THU] Hoàn tất Map + Import Cambridge IELTS 07 Academic Tests 2-4 (Step 0 Hard Gate 100%)"

BODY = """Kính gửi Muse và Trưởng dự án LinguaFlow,

Agent Trợ lý Hệ thống báo cáo nghiệm thu hoàn tất task 'lingual-map-cambridge07-tests234-001':
Ánh xạ (Mapping) và Nạp (Import) toàn bộ dữ liệu sách Cambridge IELTS 07 (Academic Tests 2, 3, 4) vào hệ thống LinguaFlow với Bước 0 Hard Gate tuyệt đối.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. KẾT QUẢ ĐỐI SOÁT VÀ CHUẨN HÓA DỮ LIỆU (MAPPING & STEP 0 HARD GATE):
- Sách nguồn: Cambridge IELTS 07 Academic Practice Tests (bản quét scan/OCR).
- Đáp án đối soát trực tiếp từ Answer Key in ấn chính thức (Trang 154-159):
  + Test 2: Listening (40/40), Reading (40/40) -> 100% KHỚP
  + Test 3: Listening (40/40), Reading (40/40) -> 100% KHỚP
  + Test 4: Listening (40/40), Reading (40/40) -> 100% KHỚP
  + Tổng cộng toàn bộ sách (Tests 1-4): 320/320 câu hỏi (160 Listening + 160 Reading) khớp 100% Answer Key in gốc.
- Đã khử sạch 100% scan artifacts (HTML comments <!-- ... -->, watermarks TopSage/大家网, leaked markdown headers ^##, ký tự rác TRI).
- Chuẩn hóa lỗi OCR apostrophes (lo'ts -> lots, coun'try -> country, no't -> not, the'ir -> their...).
- 100% câu hỏi có question stem > 10 ký tự, type, sourceRef, correctAnswer. Zero câu hỏi stub / answer-only.
- 100% bản ghi được gắn cờ track='academic' trên cả 5 bảng và file JSON mapped.
- Manifest và Exploitation Report đã được tái hòa giải 100% (89 segments: 72 exploited, 17 unexploited/archive-only như GT modules, answer sheets).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. KẾT QUẢ IMPORT VÀO POSTGRESQL LOCAL (linguaflow_db):
- Đã import thành công 42 bản ghi mới của Tests 2, 3, 4 (14 bản ghi/test * 3 tests):
  + Reading Passages   : 115 -> 124 (+9 bản ghi)
  + Listening Sections :  96 -> 108 (+12 bản ghi)
  + Writing Topics     : 318 -> 324 (+6 bản ghi)
  + Writing Models     :  78 ->  84 (+6 bản ghi)
  + Speaking Topics    : 615 -> 624 (+9 bản ghi)
  => Tổng số bản ghi thêm mới: đúng 42 bản ghi.
- Cơ chế Early-Exit Guard: Kiểm tra idempotency theo tiền tố từng test ('cam07-academic-t2%', 't3%', 't4%'). Chạy lại chèn 0 bản ghi an toàn.
- Audit trực tiếp từ DB bằng script độc lập SELECT-only (scripts/verify_cambridge07_tests234_db.py):
  + 56/56 bản ghi của Cambridge 07 (Tests 1-4) đều có track='academic'.
  + 320/320 câu hỏi đọc ra từ DB đều toàn vẹn, stems > 10 ký tự.
  + Spot-check 6 câu hỏi ngẫu nhiên khớp 100% trang in 154-159.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. PHÁT HÀNH VÀ LƯU TRỮ:
- Mapped JSON xuất tại: C:\\Mod\\muse-data-exchange\\book-corpus-mapped\\cambridge-ielts-07\\
  + ielts_listening_sections.json (16 sections, 160 questions)
  + ielts_reading_passages.json (12 passages, 160 questions)
  + ielts_writing_topics.json (8 topics)
  + ielts_writing_models.json (8 models)
  + ielts_speaking_topics.json (12 topics)
  + manifest.json (89 segments)
  + exploitation-report.json (100% reconciliation)
- Git commit: b4e8828 trên nhánh 'develop' (đã push thành công lên origin/develop).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. GIỚI HẠN PHẠM VI (SCOPE BOUNDARY):
- Nhiệm vụ ánh xạ và nạp Cambridge IELTS 07 Academic Tests 2-4 đã hoàn thành trọn vẹn 100%.
- Agent TUÂN THỦ NGHIÊM NGẶT GIỚI HẠN PHẠM VI: DỪNG LẠI TẠI ĐÂY để chờ kiểm tra độc lập (audit), TUYỆT ĐỐI KHÔNG tự ý chuyển sang sách tiếp theo.
"""

def main():
    # 1. Gửi qua mailbox.py
    file_path, data = mailbox.write_inbox_message(
        task_id=TASK_ID,
        msg_type=MSG_TYPE,
        subject=SUBJECT,
        body=BODY,
        needs_decision=[],
        needs_user_approval=False,
        from_entity="agent",
        to_entity="muse"
    )
    print(f"[*] Đã xuất phiếu nghiệm thu mailbox: {file_path}")

    # 2. Tạo bản sao đích danh theo quy chuẩn task_done
    done_file = Path(r"C:\Mod\muse-mailbox\inbox\20261023-cambridge07-tests234-001-done.json")
    with open(done_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[*] Đã tạo bản sao đích danh nghiệm thu: {done_file}")

if __name__ == "__main__":
    main()
