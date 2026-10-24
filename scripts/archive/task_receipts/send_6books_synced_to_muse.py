import sys
import os
import json

# Add mailbox to path
sys.path.insert(0, r"C:\Mod\muse-mailbox")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import mailbox

task_id = "lingual-book-ocr-colab-delivery-001"
msg_type = "info"
subject = "[ĐÃ ĐỒNG BỘ 6/14 CUỐN SCAN] Đã chuyển kết quả OCR Colab (JSON + MD) vào book-corpus sẵn sàng Audit"

body = """Kính gửi Muse,

Agent Trợ lý Hệ thống báo cáo đã tiếp nhận tệp zip kết quả xuất xưởng từ Google Colab GPU do User tải về và đã đồng bộ thành công 6 cuốn sách scan đầu tiên vào hệ thống lưu trữ nội bộ C:\\Mod\\muse-data-exchange\\book-corpus\\:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. DANH SÁCH 6 CUỐN ĐÃ ĐƯỢC GIẢI NÉN VÀ ĐỒNG BỘ:
1. Barrons IELTS Practice Tests 2 & 3 Full (.json 1.34 MB, .md 0.09 MB)
   -> C:\\Mod\\muse-data-exchange\\book-corpus\\barrons-ielts-practice-tests\\
2. Cambridge Grammar for IELTS (.json 6.47 MB, .md 0.60 MB)
   -> C:\\Mod\\muse-data-exchange\\book-corpus\\cambridge-grammar-for-ielts\\
3. Cambridge IELTS 06 - Academic & General Practice Tests (.json 4.35 MB, .md 0.32 MB)
   -> C:\\Mod\\muse-data-exchange\\book-corpus\\cambridge-ielts-06-scan\\
4. Cambridge IELTS 07 - Academic & General Practice Tests (.json 3.78 MB, .md 0.31 MB)
   -> C:\\Mod\\muse-data-exchange\\book-corpus\\cambridge-ielts-07-scan\\
5. Cambridge IELTS 09 - Academic & General Practice Tests (.json 3.66 MB, .md 0.34 MB)
   -> C:\\Mod\\muse-data-exchange\\book-corpus\\cambridge-ielts-09-scan\\
6. Cambridge IELTS 10 - Academic & General Practice Tests (.json 3.99 MB, .md 0.35 MB)
   -> C:\\Mod\\muse-data-exchange\\book-corpus\\cambridge-ielts-10-scan\\

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. SẴN SÀNG CHO AUDIT & HẬU XỬ LÝ:
- Toàn bộ tệp JSON và Markdown đã được đặt đúng cấu trúc thư mục quy chuẩn.
- Phía Lingual có thể kích hoạt ngay bước Audit phân loại, bóc tách bài thi / bài tập và chạy hàm hậu xử lý regex (postprocess) làm sạch bảng biểu trước khi lập kế hoạch seed vào PostgreSQL.
- Google Colab trên cloud vẫn đang tiếp tục xử lý các cuốn còn lại (Destination B1/B2, Cam 12-15) và sẽ tiếp tục được đồng bộ ngay khi hoàn tất."""

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

print(f"SUCCESS: Đã gửi thông báo giao nhận 6 cuốn sách tới Muse: {file_path}")
print(f"Message ID: {data['id']}")
