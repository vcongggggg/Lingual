import json
from datetime import datetime, timezone

data = {
  "id": "result-lingual-data-grammar-tagfix-import-001",
  "task_id": "lingual-data-grammar-tagfix-import-001",
  "from": "agent",
  "to": "muse",
  "type": "task_done",
  "status": "done",
  "subject": "[HOAN TAT] Import 30 cau tag question (grammar-002-tagfix) vao grammar_questions (PASS 100%)",
  "body": """HOÀN TẤT IMPORT DỮ LIỆU CÂU HỎI ĐUÔI (PASS 100% TẤT CẢ TIÊU CHÍ DOD):

1. Đọc và phân loại file nguồn:
- Tệp nguồn: C:\\Mod\\muse-data-exchange\\results\\grammar-002-tagfix.jsonl
- Tổng số bản ghi đọc được: 30 bản ghi.
- Schema sạch 100%, đúng quy tắc đảo ngữ, polarity và các trường hợp đặc biệt.

2. Kết quả Dedupe & Xử lý:
- So khớp chuẩn hóa với DB hiện tại: Phát hiện 1 câu trùng lặp: 'You like coffee, ___?' (khớp với gq-315 có sẵn trong DB).
- Số lượng bản ghi trùng lặp được dedupe: 1 bản ghi.
- Đã cập nhật gq-315 với phần giải thích chuẩn [G-TAG] và bộ đáp án chính xác.
- Số lượng bản ghi mới được insert: 29 bản ghi (gq-3985 đến gq-4013).

3. Kết quả cập nhật Database:
- Tổng số grammar trước khi nạp: 3.984 câu.
- Tổng số grammar sau khi nạp: 4.013 câu (khớp đúng 4.014 trừ dedupe 1 = 4.013).
- Số lượng câu hỏi có tag [G-TAG] trong DB: đúng 30 câu (29 câu nạp mới + 1 câu cập nhật).

4. Kiểm thử API & Typecheck:
- REST API endpoint (/api/v1/content/grammar-questions): Trả về total: 4.013.
- TypeScript typecheck (apps/api & apps/web): PASS 0 lỗi.
- Git commit: feat(data): import 30 tag questions with dedupe (gen-data-grammar-002-tagfix).
- Đã push thành công lên origin/develop.""",
  "data": {
    "branch": "develop",
    "table": "grammar_questions",
    "source_file": "grammar-002-tagfix.jsonl",
    "total_records_read": 30,
    "dedupe_dropped_count": 1,
    "dedupe_detail": [
      {
        "question": "You like coffee, ___?",
        "existing_id": "gq-315",
        "action": "updated_with_gtag_explanation"
      }
    ],
    "imported_new_count": 29,
    "initial_grammar_count": 3984,
    "final_grammar_count": 4013,
    "expected_by_dod": 4013,
    "gtag_in_db_after": 30,
    "typecheck": "PASS (0 errors)",
    "samples": [
      {
        "id": "gq-315",
        "question": "You like coffee, ___?",
        "options": ["do you", "aren't you", "are you", "don't you"],
        "answer": "don't you",
        "explanation": "[G-TAG] Không có trợ động từ, động từ thường ở hiện tại + chủ ngữ 'you' → mượn 'do', câu khẳng định → tag phủ định: don't you.",
        "level": "B1"
      },
      {
        "id": "gq-3985",
        "question": "You are ready, ___?",
        "options": ["are you", "aren't you", "don't you", "do you"],
        "answer": "aren't you",
        "explanation": "[G-TAG] Trợ động từ thật là 'are', câu khẳng định → tag phủ định: aren't you.",
        "level": "A2"
      },
      {
        "id": "gq-3986",
        "question": "He is a doctor, ___?",
        "options": ["isn't he", "doesn't he", "is he", "does he"],
        "answer": "isn't he",
        "explanation": "[G-TAG] Trợ động từ thật là 'is', câu khẳng định → tag phủ định: isn't he.",
        "level": "A2"
      }
    ]
  },
  "ts": datetime.now(timezone.utc).isoformat(),
  "needs_user_approval": False,
  "needs_decision": []
}

target_path = r"C:\Mod\muse-mailbox\inbox\20261021-tagfix-done.json"
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Exported task_done successfully to:", target_path)
