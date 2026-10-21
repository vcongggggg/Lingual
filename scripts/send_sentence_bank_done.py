import json
from datetime import datetime, timezone

data = {
  "id": "result-lingual-data-sentence-bank-fill-import-001",
  "task_id": "lingual-data-sentence-bank-fill-import-001",
  "from": "agent",
  "to": "muse",
  "type": "task_done",
  "status": "done",
  "subject": "[HOAN TAT] Import 169.261 cap cau TED2020 vao sentence_bank LinguaFlow (PASS 100%)",
  "body": """HOÀN TẤT IMPORT DỮ LIỆU KHO CÂU TED2020 (PASS 100% CÁC TIÊU CHÍ):

1. Kiểm tra 35 part files nguồn:
- Toàn bộ 35 files: sentence-bank-fill-001-p01.jsonl đến p35.jsonl trong C:\\Mod\\muse-data-exchange\\results\\
- Tổng số dòng đọc thực tế: 170.221 dòng JSON hợp lệ (Khớp 100% manifest).
- Lỗi cú pháp / schema invalid: 0 dòng.

2. Kết quả Dedupe toàn diện:
- Dữ liệu Tatoeba ban đầu trong DB: 21.911 bản ghi.
- Trùng lặp nội bộ theo cặp (en, vi): 0.
- Trùng lặp nội bộ theo riêng câu EN: 903.
- Trùng lặp với DB theo cặp (en, vi): 4.
- Trùng lặp với DB theo riêng câu EN: 53.
- Tổng số bản ghi bị loại qua dedupe: 960 bản ghi.
- Tổng số bản ghi được nạp mới: 169.261 bản ghi.

3. Kết quả cập nhật Database:
- Tổng số bản ghi trong bảng sentence_bank sau khi nạp: 191.172 bản ghi (21.911 Tatoeba + 169.261 TED2020).
- Bảo tồn nguyên vẹn 21.911 câu cũ Tatoeba (source='tatoeba', license='CC BY 2.0 FR').
- Các câu mới được gắn đúng source='TED2020', license='CC BY-NC-ND 4.0 (TED Talks Usage Policy)', giữ nguyên en_id / vi_id.

4. Mở rộng liên kết từ vựng (WordSentenceLink):
- Số từ vựng chưa có liên kết câu trước khi nạp: 2.338 từ.
- Đã tìm thấy và gán câu ví dụ mới cho: 2.004 / 2.338 từ vựng (chọn tối đa 3 câu ngắn, rõ nghĩa/từ).
- Số liên kết mới được tạo: 5.544 liên kết.
- Tổng số liên kết trong bảng word_sentence_links: 11.988 liên kết.
- Tỷ lệ bao phủ từ vựng có câu ví dụ thực tế (Coverage): Tăng từ 56.8% (3.079 từ) lên 93.83% (5.083 / 5.417 từ cốt lõi).

5. Ghi công (Attribution & Credits):
- Đã thêm ghi công TED2020 vào README.md.
- Đã cập nhật mục Credits tại trang Settings (apps/web/src/app/settings/page.tsx):
  'TED2020 (OPUS) - TED Talks, CC BY-NC-ND 4.0, sử dụng phi thương mại cho mục đích học tập'.

6. CI / Typecheck & Git:
- TypeScript typecheck (api & web): PASS 0 lỗi.
- Commit hash: e16e8ae trên nhánh develop.
- Đã push thành công lên origin/develop.""",
  "data": {
    "branch": "develop",
    "commit": "e16e8ae",
    "table": "sentence_bank",
    "part_files_count": 35,
    "raw_records_counted": 170221,
    "expected_records": 170221,
    "invalid_lines": 0,
    "dedupe": {
      "internal_pair_dups": 0,
      "internal_en_dups": 903,
      "db_pair_overlap": 4,
      "db_en_overlap": 53,
      "total_dropped": 960
    },
    "existing_tatoeba_count": 21911,
    "tatoeba_preserved": 21911,
    "new_ted_imported": 169261,
    "total_sentence_bank_after": 191172,
    "word_links": {
      "previous_links": 6444,
      "previous_linked_vocab": 3079,
      "new_links_created": 5544,
      "newly_covered_vocab": 2004,
      "total_links_after": 11988,
      "total_linked_vocab_after": 5083,
      "total_vocab_count": 5417,
      "coverage_percent": 93.83
    },
    "credit_attribution": {
      "readme": True,
      "settings_page": True,
      "text": "TED2020 (OPUS) - TED Talks, CC BY-NC-ND 4.0, sử dụng phi thương mại cho mục đích học tập"
    },
    "typecheck": "PASS (0 errors)",
    "samples": [
      {
        "id": "0000424a-fd83-4fbc-b413-2d5c454ec424",
        "en": "But it's one thing to have a concept; it's a totally separate thing to actually make it work.",
        "vi": "nhưng có khái niệm là một chuyện; nó hoàn toàn khác với việc biến nó thành hiện thực.",
        "en_id": 297703,
        "vi_id": 297703,
        "source": "TED2020",
        "license": "CC BY-NC-ND 4.0 (TED Talks Usage Policy)"
      },
      {
        "id": "000049a2-ab7e-4d3e-8b4b-0c315eedac42",
        "en": "With that in mind, I set about teaching EDI a magic trick.",
        "vi": "Với ý nghĩ đó, tôi đã dạy EDI một trò ảo thuật.",
        "en_id": 116657,
        "vi_id": 116657,
        "source": "TED2020",
        "license": "CC BY-NC-ND 4.0 (TED Talks Usage Policy)"
      },
      {
        "id": "00005011-8cfb-458c-88ba-281203437a9e",
        "en": "This was an example I built for my daughter.",
        "vi": "Đây là ví dụ tôi dành cho con gái mình.",
        "en_id": 1094,
        "vi_id": 1094,
        "source": "TED2020",
        "license": "CC BY-NC-ND 4.0 (TED Talks Usage Policy)"
      }
    ]
  },
  "ts": datetime.now(timezone.utc).isoformat(),
  "needs_user_approval": False,
  "needs_decision": []
}

target_path = r"C:\Mod\muse-mailbox\inbox\20261021-sentence-bank-fill-done.json"
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Exported task_done successfully to:", target_path)
