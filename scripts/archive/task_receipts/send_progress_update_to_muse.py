import sys
import os
import json

# Add mailbox to path
sys.path.insert(0, r"C:\Mod\muse-mailbox")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import mailbox

task_id = "lingual-book-materials-ingestion-progress-001"
msg_type = "info"
subject = "[CẬP NHẬT TIẾN ĐỘ] Kích hoạt thành công Google Colab GPU xử lý trọn bộ 14 cuốn sách Scan"

body = """Kính gửi Muse,

Agent Trợ lý Hệ thống báo cáo cập nhật tiến độ thực tế triển khai kế hoạch số hóa và tích hợp kho sách tiếng Anh (>570 MB) vào LinguaFlow:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. TRẠNG THÁI HIỆN TẠI CỦA 2 PHÂN NHÁNH DỮ LIỆU:

a) Nhánh 1: 11 cuốn sách DIGITAL (Native Text Layer):
- Đã hoàn tất 100% việc trích xuất thô tại task 'lingual-book-extract-all-001' bằng PyMuPDF + Heuristic tọa độ X.
- Dữ liệu sạch (145 Units Murphy, Destination C1&C2, 60 Units Collocations, Cambridge 11) đã sẵn sàng tại C:\\Mod\\muse-data-exchange\\book-corpus\\ để nạp vào PostgreSQL Lingual.

b) Nhánh 2: 14 cuốn sách SCAN ĐỘC BẢN (>2.500 trang hình ảnh):
- Đã thiết lập xong Notebook 'Docling_Batch_All_Scan_Books_GPU.ipynb' trên Google Colab với phần cứng GPU NVIDIA T4.
- Đã đưa toàn bộ 14 cuốn sách scan lên thư mục 'LinguaBooks' trên Google Drive.
- TIẾN TRÌNH ĐANG CHẠY TRỰC TIẾP TRÊN COLAB:
  + Colab đã mount thành công Google Drive.
  + Tải xong 100% model weights Docling TableFormer (770/770).
  + Đang xử lý tuần tự từ cuốn 1/14 ('Barrons IELTS Practice Tests 2 & 3 Full.pdf') trên GPU T4.
  + Dự kiến hoàn thành toàn bộ 14 cuốn trong khoảng 35 - 50 phút.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. CƠ CHẾ ĐÓN NHẬN KẾT QUẢ & SEEDING VÀO DATABASE:
- Kết quả xuất xưởng (gồm cả .json và .md) được Colab ghi trực tiếp vào 'Google Drive / LinguaBooks / extracted_output /'.
- Sau khi Colab hoàn tất, Agent sẽ đồng bộ các tệp JSON về máy local, áp dụng bộ lọc Regex Post-processing để hoàn thiện các bảng Phrasal Verbs và nạp vào các Prisma models:
  + grammar_questions (Bài tập trắc nghiệm B1/B2)
  + ielts_listening_sections & ielts_reading_passages (Đề thi Cam 06, 07, 09, 10, 12, 13, 14, 15)

Agent sẽ tiếp tục theo dõi và gửi thông báo nghiệm thu ngay khi toàn bộ dữ liệu được chuyển đổi xong."""

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

print(f"SUCCESS: Đã gửi thông báo cập nhật tiến độ tới Muse: {file_path}")
print(f"Message ID: {data['id']}")
