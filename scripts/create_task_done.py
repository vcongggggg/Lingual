import json
from datetime import datetime, timezone

data = {
  "id": "result-lingual-data-idioms-import-001",
  "task_id": "lingual-data-idioms-import-001",
  "from": "agent",
  "to": "muse",
  "type": "task_done",
  "status": "done",
  "subject": "[HOAN TAT] Import 594 idioms Wiktionary (gen-data-idioms-002) vao dataset LinguaFlow",
  "body": """HOÀN TẤT IMPORT IDIOMS TỪ GEN-DATA-IDIOMS-002 (PASS 100% TẤT CẢ TIÊU CHÍ DOD):

1. Kiểm tra Overlap & Giữ nguyên bản ghi cũ:
- Tổng số idioms trong dataset ban đầu: 200 bản ghi (idm-001 đến idm-200).
- Đã bảo tồn nguyên vẹn 200/200 bản ghi cũ, không ghi đè hay làm mất dữ liệu.
- Tổng số bản ghi trong idioms-002.jsonl: 605 bản ghi.
- Số bản ghi trùng lặp nội dung với DB hiện có: 11 bản ghi (chuẩn hóa khoảng trắng & lowercase):
  + 'add fuel to the fire' (idm-147)
  + 'beat the clock' (idm-062)
  + 'between the devil and the deep blue sea' (idm-151)
  + 'bite the dust' (idm-064)
  + 'blood is thicker than water' (idm-129)
  + 'blow off steam' (idm-065)
  + 'break a sweat' (idm-137)
  + 'burn the candle at both ends' (idm-153)
  + 'by hook or by crook' (idm-134)
  + 'by the book' (idm-015)
  + 'cast pearls before swine' (idm-155)

2. Kết quả Import mới:
- Số bản ghi không trùng được import: 594 bản ghi (605 - 11 = 594).
- Tổng số bản ghi sau khi import: 794 bản ghi (200 cũ + 594 mới).
- Quy chuẩn ID: idm-201 đến idm-794 liên tục, không đứt đoạn.
- Provenance & License: Giữ nguyên source='wiktionary', license='CC BY-SA'.

3. Schema & Migration:
- Bổ sung trường meaningEn (String?) và license (String?, default 'CC BY-SA') vào model Idiom trong Prisma.
- Migration 20261021120000_add_meaning_en_and_license_to_idioms đã deploy thành công vào PostgreSQL.

4. Typecheck & Git Workflow:
- TypeScript typecheck (pnpm --filter api exec tsc --noEmit && pnpm --filter web exec tsc --noEmit): PASS 0 lỗi.
- Commit message: 'feat(data): import 605 idioms Wiktionary (gen-data-idioms-002)'.
- Đã push thành công lên origin/develop (commit 32477ba).

5. Kiểm định thực tế & Sample 5 idioms ngẫu nhiên:
- Đã test trực tiếp qua REST API (cả localhost:4000 và public ngrok tunnel), trả về tổng total: 794.
- 5 mẫu ngẫu nhiên mới import:
  + [idm-630 - B2] 'butter one\'s bread on both sides': Ăn cả hai đầu; hưởng lợi từ cả hai phía đối lập.
  + [idm-358 - B2] 'beyond one\'s pay grade': Vượt quá thẩm quyền của mình.
  + [idm-203 - B2] 'accident waiting to happen': Nguy cơ tai nạn chực chờ xảy ra.
  + [idm-750 - C1] 'cast in someone\'s teeth': Trách móc, xỉ vả ai về điều gì.
  + [idm-213 - B2] 'after the fact': Sau khi sự đã rồi.""",
  "data": {
    "branch": "develop",
    "commit": "32477ba",
    "table": "idioms",
    "source_file": "idioms-002.jsonl",
    "file_records_count": 605,
    "existing_records_count": 200,
    "old_records_preserved": 200,
    "duplicate_count": 11,
    "duplicate_list": [
      "add fuel to the fire",
      "beat the clock",
      "between the devil and the deep blue sea",
      "bite the dust",
      "blood is thicker than water",
      "blow off steam",
      "break a sweat",
      "burn the candle at both ends",
      "by hook or by crook",
      "by the book",
      "cast pearls before swine"
    ],
    "imported_count": 594,
    "total_after": 794,
    "source": "wiktionary",
    "license": "CC BY-SA",
    "samples": [
      {
        "id": "idm-630",
        "idiom": "butter one's bread on both sides",
        "level": "B2",
        "meaning_vi": "Ăn cả hai đầu; hưởng lợi từ cả hai phía đối lập.",
        "meaning_en": "To profit from two conflicting sides at once.",
        "example_en": "He butters his bread on both sides, advising both rival companies.",
        "example_vi": "Anh ta ăn cả hai đầu, làm cố vấn cho cả hai công ty đối thủ."
      },
      {
        "id": "idm-358",
        "idiom": "beyond one's pay grade",
        "level": "B2",
        "meaning_vi": "Vượt quá thẩm quyền của mình.",
        "meaning_en": "Beyond one's authority or responsibility.",
        "example_en": "That decision is beyond my pay grade — ask the director.",
        "example_vi": "Quyết định đó vượt quá thẩm quyền của tôi — hỏi giám đốc ấy."
      },
      {
        "id": "idm-203",
        "idiom": "accident waiting to happen",
        "level": "B2",
        "meaning_vi": "Nguy cơ tai nạn chực chờ xảy ra.",
        "meaning_en": "Almost certain to eventually lead to an accident.",
        "example_en": "That loose railing is an accident waiting to happen.",
        "example_vi": "Cái lan can lỏng lẻo kia chẳng khác nào một tai nạn đang chờ xảy ra."
      },
      {
        "id": "idm-750",
        "idiom": "cast in someone's teeth",
        "level": "C1",
        "meaning_vi": "Trách móc, xỉ vả ai về điều gì.",
        "meaning_en": "To accuse or reproach someone for something.",
        "example_en": "She cast his failures in his teeth.",
        "example_vi": "Cô ta xỉ vả anh về những thất bại của anh."
      },
      {
        "id": "idm-213",
        "idiom": "after the fact",
        "level": "B2",
        "meaning_vi": "Sau khi sự đã rồi.",
        "meaning_en": "After the occurrence of some action or event.",
        "example_en": "He locked the door after the fact, when the thief had already left.",
        "example_vi": "Anh ta khóa cửa sau khi sự đã rồi, lúc tên trộm đã chuồn mất."
      }
    ]
  },
  "ts": datetime.now(timezone.utc).isoformat(),
  "needs_user_approval": False,
  "needs_decision": []
}

target_path = r"C:\Mod\muse-mailbox\inbox\20261021-idioms-import-done.json"
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Exported successfully to:", target_path)
