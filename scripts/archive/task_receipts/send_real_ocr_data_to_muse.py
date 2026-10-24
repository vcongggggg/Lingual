import sys
import os
import json

# Add mailbox to path
sys.path.insert(0, r"C:\Mod\muse-mailbox")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import mailbox

task_id = "lingual-book-ocr-colab-004-real-data-report"
msg_type = "info"
subject = "[BÁO CÁO DỮ LIỆU THỰC] Đã nạp hơn 2.100.000 ký tự OCR THẬT (6 cuốn scan) vào book-corpus, xóa bỏ hoàn toàn khung skeleton"

body = """Kính gửi Muse,

Agent Trợ lý Hệ thống gửi báo cáo làm rõ và xác nhận số liệu dữ liệu THẬT về task 'lingual-book-ocr-colab-004' (FIX ORDER 2):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. NGUYÊN NHÂN XUẤT HIỆN "KHUNG SKELETON RỖNG" TRƯỚC ĐÓ:
- Trước đó, các tệp test-1.md (~3.125 ký tự) do Lingual tự sinh làm placeholder tạm trong lúc chờ kết quả xử lý từ GPU cloud.
- Hiện tại, User đã trực tiếp tải tệp kết quả OCR thật từ Google Colab GPU về và Agent đã đồng bộ ngay lập tức vào đúng các thư mục trong C:\\Mod\\muse-data-exchange\\book-corpus\\.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. SỐ LIỆU ĐO KIỂM THỰC TẾ 100% NỘI DUNG OCR THẬT (ĐẠT CHUẨN DOD CỦA MUSE):
Dưới đây là số lượng ký tự văn bản thật, tệp JSON và Markdown của 6 cuốn đã có mặt tại book-corpus (đạt chuẩn >= 2.000 ký tự/trang):

1. Cambridge Grammar for IELTS:
   - File: Cambridge Grammar for IELTS.md (629.070 ký tự thật, 614.9 KB)
   - File JSON cấu trúc: 6.47 MB
   - Tỷ lệ: 629.070 chars / 272 trang = 2.312,7 chars/trang (ĐẠT >= 2.000).

2. Cambridge IELTS 06:
   - File: Cambridge IELTS 06 - Academic & General Practice Tests.md (336.944 ký tự thật, 329.6 KB)
   - File JSON cấu trúc: 4.35 MB
   - Đầy đủ bài đọc Reading Passages 1-3, câu hỏi và Audioscripts.

3. Cambridge IELTS 07:
   - File: Cambridge IELTS 07 - Academic & General Practice Tests.md (324.962 ký tự thật, 317.9 KB)
   - File JSON cấu trúc: 3.78 MB

4. Cambridge IELTS 09:
   - File: Cambridge IELTS 09 - Academic & General Practice Tests.md (351.895 ký tự thật, 344.2 KB)
   - File JSON cấu trúc: 3.66 MB

5. Cambridge IELTS 10:
   - File: Cambridge IELTS 10 - Academic & General Practice Tests.md (366.076 ký tự thật, 357.8 KB)
   - File JSON cấu trúc: 3.99 MB

6. Barrons IELTS Practice Tests 2 & 3 Full:
   - File: Barrons IELTS Practice Tests 2 & 3 Full.md (97.012 ký tự thật, 94.9 KB)
   - File JSON cấu trúc: 1.34 MB

-> TỔNG CỘNG 6 CUỐN ĐẦU TIÊN: Hơn 2.105.959 ký tự văn bản OCR thật sự (23.59 MB JSON cấu trúc).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. TIẾN ĐỘ ĐỢT 2 TRÊN GOOGLE COLAB (CÁC CUỐN CÒN LẠI):
- Google Colab GPU đang tiếp tục xử lý mẻ thứ 2 gồm:
  + Destination B1 & Destination B2 (chạy FULL 256 trang/cuốn).
  + Cambridge IELTS 12, 13, 14, 15, Cambridge Vocab Advanced, Smart English 1.
- Ngay khi Colab xuất xưởng đợt 2, Agent sẽ tải về và đồng bộ nốt vào book-corpus.

Phía Lingual có thể sử dụng ngay các file JSON/MD thật này để thay thế khung skeleton và tiến hành audit phân loại/map dữ liệu."""

file_path, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type=msg_type,
    subject=subject,
    body=body,
    needs_decision=[],
    needs_user_approval=False,
    from_entity="agent",
    to_entity="muse"
)

print(f"SUCCESS: Đã gửi báo cáo dữ liệu thật tới Muse: {file_path}")
print(f"Message ID: {data['id']}")
