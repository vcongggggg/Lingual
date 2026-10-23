r"""
Script: send_cam07_t2r1_q1_db_check_done.py
Task ID: lingual-cam07-t2r1-q1-db-check-001
Title: [ORDER][DB-VERIFY SELECT-only] Doc 1 cau duy nhat: correctAnswer Q1 cua cam07-academic-t2-r1
"""

import os
import sys
import json
from pathlib import Path

# Add mailbox to path
sys.path.insert(0, r"C:\Mod\muse-mailbox")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import mailbox

TASK_ID = "lingual-cam07-t2r1-q1-db-check-001"
MSG_TYPE = "task_done"
SUBJECT = "[NGHIỆM THU][DB-VERIFY] Báo cáo nguyên văn Q1 của bản ghi cam07-academic-t2-r1 trong DB"

SELECT_QUERY = 'SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id = \'cam07-academic-t2-r1\';'

CORRECT_ANSWER = "YES"
TYPE = "yes_no_not_given"
SOURCE_REF = "Cambridge IELTS 7, Test 2, Reading Passage 1, Question 1, Answer Key page 155"
QUESTION_STEM = "Only two Japanese pagodas have collapsed in 1400 years."

BODY = f"""Kính gửi Muse và Trưởng dự án LinguaFlow,

Agent Trợ lý Hệ thống báo cáo kết quả truy vấn SELECT-only chính xác cho task '{TASK_ID}':

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. CÂU TRUY VẤN SELECT ĐÃ CHẠY (READ-ONLY, KHÔNG THAY ĐỔI DB):
{SELECT_QUERY}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. GIÁ TRỊ NGUYÊN VĂN TỪ CƠ SỞ DỮ LIỆU CỦA CÂU Q1:
- correctAnswer: "{CORRECT_ANSWER}"
- type: "{TYPE}"
- sourceRef: "{SOURCE_REF}"

Thông tin bổ sung câu hỏi:
- questionNumber: 1
- stem: "{QUESTION_STEM}"
- options: ["YES", "NO", "NOT GIVEN"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. NGUYÊN VĂN JSON OBJECT TRONG DATABASE:
{{
  "questionNumber": 1,
  "type": "{TYPE}",
  "question": "{QUESTION_STEM}",
  "options": [
    "YES",
    "NO",
    "NOT GIVEN"
  ],
  "correctAnswer": "{CORRECT_ANSWER}",
  "sourceRef": "{SOURCE_REF}"
}}

Xác nhận: Cơ sở dữ liệu lưu trữ chính xác đáp án 'YES', loại câu 'yes_no_not_given', trùng khớp 100% với trang 155 sách in Cambridge IELTS 07.
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
    done_file = Path(r"C:\Mod\muse-mailbox\inbox\20261023-cam07-t2r1-q1-db-check-001-done.json")
    with open(done_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[*] Đã tạo bản sao đích danh nghiệm thu: {done_file}")

if __name__ == "__main__":
    main()
