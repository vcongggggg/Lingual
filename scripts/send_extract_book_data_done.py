r"""
Script: send_extract_book_data_done.py
Task ID: lingual-extract-book-data-from-scripts-001
Title: [ORDER] Tach literal du lieu sach ra JSON ngoai repo (8 file data-builder Cam 06/07)
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

TASK_ID = "lingual-extract-book-data-from-scripts-001"
MSG_TYPE = "task_done"
SUBJECT = "[NGHIỆM THU] Hoàn tất tách literal dữ liệu sách ra JSON ngoài repo (8 file Cam 06/07), scripts chỉ còn loader"

BODY = """Kính gửi Muse và Trưởng dự án LinguaFlow,

Agent Trợ lý Hệ thống báo cáo hoàn thành trọn vẹn task 'lingual-extract-book-data-from-scripts-001':
Đã bóc tách toàn bộ dữ liệu literal sách bản quyền ra các tệp JSON ngoài repository (trong book-corpus-mapped/), chuyển đổi 8 file data-builder của Cambridge IELTS 06 và 07 thành các loader gọn nhẹ, tuân thủ 100% quy tắc containment cho repository công khai.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. DANH SÁCH 8 FILE SCRIPT ĐÃ REFACTOR VÀ SỐ DÒNG TRƯỚC / SAU:

| File Script Refactored | Số Dòng TRƯỚC | Số Dòng SAU | Số Ký Tự TRƯỚC | Số Ký Tự SAU | Tỷ Lệ Giảm |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `scripts/cambridge06_data_t1.py` | 210 | 34 | ~45,738 | 1,250 | **-83.8% lines (-97.3% chars)** |
| `scripts/cambridge06_data_t2.py` | 215 | 34 | ~46,200 | 1,250 | **-84.2% lines (-97.3% chars)** |
| `scripts/cambridge06_data_t3.py` | 213 | 34 | ~46,100 | 1,250 | **-84.0% lines (-97.3% chars)** |
| `scripts/cambridge06_data_t4.py` | 225 | 34 | ~50,400 | 1,250 | **-84.9% lines (-97.5% chars)** |
| `scripts/cambridge07_data_t1.py` | 610 | 34 | ~78,200 | 1,250 | **-94.4% lines (-98.4% chars)** |
| `scripts/cambridge07_data_t2.py` | 648 | 34 | ~82,400 | 1,250 | **-94.8% lines (-98.5% chars)** |
| `scripts/cambridge07_data_t3.py` | 611 | 34 | ~76,500 | 1,250 | **-94.4% lines (-98.4% chars)** |
| `scripts/cambridge07_data_t4.py` | 592 | 34 | ~65,300 | 1,250 | **-94.3% lines (-98.1% chars)** |
| **Tổng cộng 8 files** | **3,324** | **272** | **~490,838** | **10,000** | **-91.8% DÒNG (-97.9% DUNG LƯỢNG)** |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. DANH SÁCH 8 FILE JSON PER-TEST NGOÀI REPOSITORY (book-corpus-mapped/):

Đường dẫn: `C:\\Mod\\muse-data-exchange\\book-corpus-mapped\\`

- Cambridge IELTS 06 (`cambridge-ielts-06/`):
  + `cam06-academic-test-1-data.json` (50,931 bytes): 4 L sections, 3 R passages, 2 W topics, 2 W models, 3 S topics, 80 official keys.
  + `cam06-academic-test-2-data.json` (49,316 bytes): 4 L sections, 3 R passages, 2 W topics, 2 W models, 3 S topics, 80 official keys.
  + `cam06-academic-test-3-data.json` (49,107 bytes): 4 L sections, 3 R passages, 2 W topics, 2 W models, 3 S topics, 80 official keys.
  + `cam06-academic-test-4-data.json` (54,808 bytes): 4 L sections, 3 R passages, 2 W topics, 2 W models, 3 S topics, 80 official keys.

- Cambridge IELTS 07 (`cambridge-ielts-07/`):
  + `cam07-academic-test-1-data.json` (87,276 bytes): 4 L sections, 3 R passages, 2 W topics, 2 W models, 3 S topics, 80 official keys.
  + `cam07-academic-test-2-data.json` (83,063 bytes): 4 L sections, 3 R passages, 2 W topics, 2 W models, 3 S topics, 80 official keys.
  + `cam07-academic-test-3-data.json` (78,438 bytes): 4 L sections, 3 R passages, 2 W topics, 2 W models, 3 S topics, 80 official keys.
  + `cam07-academic-test-4-data.json` (67,576 bytes): 4 L sections, 3 R passages, 2 W topics, 2 W models, 3 S topics, 80 official keys.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. KẾT QUẢ PARITY CHECK DRY-RUN 8/8 TESTS (LOADER MỚI vs DB THẬT):

Đã chạy `python scripts/parity_check_loader_vs_db.py` đối soát SELECT-only trực tiếp với PostgreSQL local (`linguaflow_db`):
- Cambridge 06 Test 1: ID Set 14/14 khớp | Answers Map 80/80 khớp 100% | PASS
- Cambridge 06 Test 2: ID Set 14/14 khớp | Answers Map 80/80 khớp 100% | PASS
- Cambridge 06 Test 3: ID Set 14/14 khớp | Answers Map 80/80 khớp 100% | PASS
- Cambridge 06 Test 4: ID Set 14/14 khớp | Answers Map 80/80 khớp 100% | PASS
- Cambridge 07 Test 1: ID Set 14/14 khớp | Answers Map 80/80 khớp 100% | PASS
- Cambridge 07 Test 2: ID Set 14/14 khớp | Answers Map 80/80 khớp 100% | PASS
- Cambridge 07 Test 3: ID Set 14/14 khớp | Answers Map 80/80 khớp 100% | PASS
- Cambridge 07 Test 4: ID Set 14/14 khớp | Answers Map 80/80 khớp 100% | PASS
=> Tổng cộng: 112/112 ID bản ghi và 640/640 đáp án câu hỏi khớp 100% tuyệt đối giữa loader mới và cơ sở dữ liệu thật.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. BẰNG CHỨNG GREP TRONG REPOSITORY (0 MATCH):

Đã chạy `python scripts/grep_audit_loaders.py`:
- Kiểm tra các mẫu regex nhạy cảm: "question":, "correctAnswer":, "passageJson":, "scriptJson":, WOMAN:, MAN:, pagodas, Sporting Success, Delivering the Goods, và các answer key dict patterns (1: "...").
- Kết quả: **0 MATCHES FOUND** trên cả 8 tệp `scripts/cambridge0[67]_data_t*.py`.
- Các tệp script chỉ còn logic nạp JSON bên ngoài qua đường dẫn chuẩn.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. KHẲNG ĐỊNH TOÀN VẸN CƠ SỞ DỮ LIỆU (KHÔNG GHI DB):

Trong suốt quá trình thực thi, lệnh hoàn toàn là SELECT-only:
- KHÔNG import lại dữ liệu.
- KHÔNG cập nhật hay xóa bất kỳ dòng nào trong DB.
- Số lượng bản ghi trong cơ sở dữ liệu được giữ nguyên vẹn 100%:
  + `ielts_reading_passages` : 124 bản ghi (Cam 06: 12, Cam 07: 12)
  + `ielts_listening_sections`: 108 bản ghi (Cam 06: 16, Cam 07: 16)
  + `ielts_writing_topics`    : 324 bản ghi (Cam 06: 8, Cam 07: 8)
  + `ielts_writing_models`    :  84 bản ghi (Cam 06: 8, Cam 07: 8)
  + `ielts_speaking_topics`   : 624 bản ghi (Cam 06: 12, Cam 07: 12)
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
    done_file = Path(r"C:\Mod\muse-mailbox\inbox\20261023-extract-book-data-from-scripts-001-done.json")
    with open(done_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[*] Đã tạo bản sao đích danh nghiệm thu: {done_file}")

if __name__ == "__main__":
    main()
