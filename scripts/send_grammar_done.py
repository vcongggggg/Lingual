import json
from datetime import datetime, timezone

data = {
  "id": "result-lingual-data-grammar-import-001",
  "task_id": "lingual-data-grammar-import-001",
  "from": "agent",
  "to": "muse",
  "type": "task_done",
  "status": "done",
  "subject": "[HOAN TAT] Import 2.984 cau grammar (gen-data-grammar-002) - tach nhom G-TAG va dedupe PASS 100%",
  "body": """HOÀN TẤT IMPORT DỮ LIỆU NGỮ PHÁP (PASS 100% TẤT CẢ TIÊU CHÍ DOD):

1. Đọc và phân loại file nguồn (grammar-002.jsonl):
- Tổng số bản ghi đọc được từ C:\\Mod\\muse-data-exchange\\results\\grammar-002.jsonl: 3.041 bản ghi.
- Phần (a) - Nhóm G-TAG (tag questions, explanation_vi startswith '[G-TAG]'): ĐÃ TÁCH VÀ GIỮ LẠI RIÊNG, KHÔNG IMPORT: 30 bản ghi.
- Phần (b) - Các nhóm câu hỏi ngữ pháp hợp lệ khác (G-ART, G-REL, G-TENSE, G-PREP, G-COND, G-PASSIVE, cloze...): 3.011 bản ghi.

2. Kết quả Dedupe phần (b) với 1.000 câu grammar hiện có trong DB:
- Tiêu chí chuẩn hóa câu hỏi: question lower/strip/collapse-space.
- Số câu trùng với DB hiện có: 27 câu.
- Tỷ lệ trùng lặp: 0.897% (DoD: < 1.0%) -> ĐẠT YÊU CẦU.
- Số bản ghi hợp lệ nạp mới: 2.984 bản ghi (3.011 - 27 = 2.984).

3. Kết quả cập nhật Database:
- Số câu grammar ban đầu trong DB: 1.000 câu.
- Đã bảo tồn nguyên vẹn 1.000 / 1.000 câu ban đầu (không bị sửa đổi hay mất mát).
- Tổng số câu grammar trong bảng grammar_questions sau khi nạp: 3.984 câu (1.000 + 2.984 = 3.984).
- Số bản ghi G-TAG trong DB sau khi nạp: 0 bản ghi (DoD bắt buộc: G-TAG = 0).
- Quy chuẩn ID: gq-1001 đến gq-3984 liên tục.
- Nguồn dữ liệu & provenance: source='corpus-derived', skillFocus='grammar', optionsJson lưu mảng JSON các lựa chọn.

4. Kiểm thử API & Typecheck:
- REST API endpoint (/api/v1/content/grammar-questions): Hoạt động ổn định, trả về total: 3.984.
- TypeScript typecheck (apps/api & apps/web): PASS 0 lỗi.
- Git commit: feat(data): import 2984 grammar questions excluding G-TAG (gen-data-grammar-002).
- Đã push thành công lên origin/develop.""",
  "data": {
    "branch": "develop",
    "table": "grammar_questions",
    "source_file": "grammar-002.jsonl",
    "total_records_read": 3041,
    "g_tag_held_back": 30,
    "part_b_candidates": 3011,
    "dedupe_dropped_count": 27,
    "dedupe_rate_percent": 0.897,
    "imported_count": 2984,
    "initial_grammar_count": 1000,
    "final_grammar_count": 3984,
    "g_tag_in_db_after": 0,
    "initial_records_preserved": 1000,
    "id_range": "gq-1001 to gq-3984",
    "typecheck": "PASS (0 errors)",
    "samples": [
      {
        "id": "gq-1151",
        "question": "The rocket put ___ communications satellite into orbit.",
        "options": ["the", "an", "—", "a"],
        "answer": "a",
        "explanation": "[G-ART] Danh từ nhắc lần đầu: 'a' trước phụ âm ('communications'). Đáp án khớp câu gốc trong ngân hàng Tatoeba.",
        "level": "A2",
        "topic": "Mạo từ a/an"
      },
      {
        "id": "gq-1488",
        "question": "That's the person I've been waiting ___.",
        "options": ["about", "for", "into", "without"],
        "answer": "for",
        "explanation": "[G-PREP] Cụm cố định 'waiting + for'. Đáp án khớp câu gốc trong ngân hàng Tatoeba.",
        "level": "B1",
        "topic": "Cụm giới từ cố định"
      },
      {
        "id": "gq-1879",
        "question": "What she ___ she never forgets.",
        "options": ["will learn", "learned", "learn", "learns"],
        "answer": "learns",
        "explanation": "[G-TENSE-PRES] Thói quen/dấu hiệu hiện tại → hiện tại đơn (he/she/it + V-s/es). Đáp án khớp câu gốc Tatoeba.",
        "level": "A2",
        "topic": "Thì hiện tại đơn"
      },
      {
        "id": "gq-1035",
        "question": "Is there ___ youth hostel near here?",
        "options": ["the", "a", "an", "—"],
        "answer": "a",
        "explanation": "[G-ART] Danh từ nhắc lần đầu: 'a' trước phụ âm ('youth'). Đáp án khớp câu gốc trong ngân hàng Tatoeba.",
        "level": "A2",
        "topic": "Mạo từ a/an"
      },
      {
        "id": "gq-1609",
        "question": "You ___ to the park yesterday, didn't you?",
        "options": ["went", "go", "will go", "goes"],
        "answer": "went",
        "explanation": "[G-TENSE-PAST] Dấu hiệu quá khứ (yesterday/last…/ago) → động từ chia quá khứ đơn. Đáp án khớp câu gốc Tatoeba.",
        "level": "A2",
        "topic": "Thì quá khứ đơn"
      }
    ]
  },
  "ts": datetime.now(timezone.utc).isoformat(),
  "needs_user_approval": False,
  "needs_decision": []
}

target_path = r"C:\Mod\muse-mailbox\inbox\20261021-grammar-import-done.json"
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Exported task_done successfully to:", target_path)
