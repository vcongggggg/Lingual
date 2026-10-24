# -*- coding: utf-8 -*-
"""
Receipt generator for lingual-cam09-remove-book-literals-001
"""

import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

receipt = {
  "id": "20261024-115900-rem09",
  "ts": "2026-10-24T11:59:00+07:00",
  "from": "agent",
  "to": "muse",
  "task_id": "lingual-cam09-remove-book-literals-001",
  "type": "task_done",
  "subject": "[NGHIỆM THU] Hoàn tất git rm 3 file build_cam09_t2/3/4_data.py chứa literal sách khỏi repo — tuân thủ 100% containment",
  "body": """Kính gửi Muse và Trưởng dự án LinguaFlow,

Agent Trợ lý Hệ thống báo cáo hoàn thành nhiệm vụ 'lingual-cam09-remove-book-literals-001':
Đã loại bỏ hoàn toàn các file chứa literal dữ liệu sách Cambridge IELTS 09 khỏi repository code theo đúng quy tắc containment tuyệt đối.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. CÁC TỆP ĐÃ XÓA KHỎI REPOSITORY (GIT RM):
- scripts/build_cam09_t2_data.py (chứa literal stems và answers Test 2)
- scripts/build_cam09_t3_data.py (chứa literal stems và answers Test 3)
- scripts/build_cam09_t4_data.py (chứa literal stems và answers Test 4)
=> Đã thực hiện `git rm` và commit loại bỏ hoàn toàn khỏi tip nhánh develop.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. GIỮ NGUYÊN TOÀN VẸN CÁC THÀNH PHẦN CHUẨN:
- JSON ngoài repo tại C:\\Mod\\muse-data-exchange\\book-corpus-mapped\\cambridge-ielts-09\\:
  + cam09-academic-test-2-data.json
  + cam09-academic-test-3-data.json
  + cam09-academic-test-4-data.json
- Loaders nội bộ (scripts/cambridge09_data_t1..t4.py): Chuẩn lightweight loaders đúng 34 dòng mỗi file, đọc dữ liệu ngoài repo, tuyệt đối 0 literal sách.
- Trình phân tích / nạp / kiểm tra: parse_cambridge09_all.py, import_cambridge09_tests234.py, db_verify_cambridge09_tests234.py hoạt động bình thường độc lập.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. KẾT QUẢ KIỂM TRA ĐỘ TOÀN VẸN VÀ CI:
- Grep scripts/cambridge09*: 0 literal nội dung câu hỏi sách trong các loaders.
- Database Local: Không có bất kỳ thay đổi nào, counts 5 bảng giữ nguyên 100%:
  + ielts_reading_passages   : 136
  + ielts_listening_sections : 124
  + ielts_writing_topics     : 332
  + ielts_writing_models     :  92
  + ielts_speaking_topics    : 636
- CI Test Suite: 130/130 unit & integration tests PASSED (100% GREEN).
- Git Commit: 4c7d1f4 trên nhánh 'develop' (đã push thành công lên origin/develop).
""",
  "needs_decision": [],
  "needs_user_approval": False
}

out_path = Path(r"C:\Mod\muse-mailbox\inbox\20261024-cambridge09-remove-literals-001-done.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(receipt, f, indent=2, ensure_ascii=False)

print(f"[SUCCESS] Wrote containment receipt to {out_path}")
