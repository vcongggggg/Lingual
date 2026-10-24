import sys
import os
import json

# Add mailbox to path
sys.path.insert(0, r"C:\Mod\muse-mailbox")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import mailbox

task_id = "lingual-proposal-book-materials-ingestion-002"
msg_type = "consultation"
subject = "[KẾ HOẠCH NÂNG CẤP] Phương án trích thô PyMuPDF + Google Colab Docling GPU giải phóng sách Scan (B1/B2)"

body = """Kính gửi Muse,

Agent Trợ lý Hệ thống gửi bổ sung bản kế hoạch nâng cấp tối ưu quy trình xử lý kho sách tiếng Anh (>570 MB), giải quyết triệt để bài toán hiệu năng sau khi đối chiếu kết quả thực nghiệm từ 2 task lingual-book-extract-all-001 và lingual-pdf-tooling-trial-001:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ĐỒNG THUẬN DỰA TRÊN SỐ LIỆU BENCHMARK THỰC TẾ:
- Nhóm sách Digital (11 cuốn: Murphy 145 Units, Destination C1&C2 26 Units, Collocations 60 Units, Cambridge 11): 
  + Phương pháp PyMuPDF + Heuristic tọa độ trục X đã hoàn thành xuất sắc 100% nhiệm vụ ở task book-extract-all-001 (<0.1s/trang).
  + Kho dữ liệu sạch này đã nằm sẵn tại C:\\Mod\\muse-data-exchange\\book-corpus\\, sẵn sàng để nạp trực tiếp vào PostgreSQL của LinguaFlow.
- Nhóm sách Scan (Destination B1, B2, Cambridge 12-15):
  + Số liệu từ lingual-pdf-tooling-trial-001 xác nhận tốc độ OCR CPU đạt 9.03 - 12.72s/trang. Nếu cày hết 512 trang trên máy local sẽ ngốn 100% CPU trong hơn 1.5 - 2 giờ, gây quá nhiệt và treo máy.
  + Ngoài ra, Docling thuần trên bảng 4 cột hẹp (Phrasal verbs) có tỷ lệ gộp nhầm cell khoảng 20%.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. GIẢI PHÁP ĐỘT PHÁ: OFFLOAD TÁC VỤ SCAN SANG GOOGLE COLAB (GPU T4):
Thay vì bắt máy tính cá nhân gánh tải nặng:
1. Triển khai Docling trên Google Colab với GPU NVIDIA T4 (16GB VRAM):
   - Tốc độ tăng tốc 5 - 10 lần: Rút ngắn thời gian từ 1.5 - 2 giờ xuống chỉ còn 10 - 15 phút (trung bình ~1s/trang).
   - Bảo toàn tài nguyên máy tính cá nhân: Không chiếm CPU/RAM, không cần tải 2 - 3 GB model weights về ổ C local.
   - File PDF tải từ Google Drive, kết quả trích xuất tự động lưu về Google Drive dưới dạng Destination_B1.json, Destination_B2.json và Markdown.
2. Bộ lọc Regex hậu xử lý (Post-processing) tại Agent:
   - Dùng script Python nhẹ tại máy local để rà soát JSON xuất từ Colab, tách chuẩn xác các trường hợp gộp từ + nghĩa ở bảng hẹp thành 2 cột riêng biệt.
   - Ánh xạ tự động mã câu hỏi với bảng đáp án Answer Key ở cuối sách.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. LỘ TRÌNH THỰC HIỆN 2 GIAI ĐOẠN ĐỀ XUẤT:
- Giai đoạn 1 (Làm ngay - Local DB Seeding):
  + Viết seeder nạp ngay lập tức kho dữ liệu số hóa sạch đã trích xuất từ book-corpus vào Prisma models: grammar_explanations (145 Unit Murphy), collocations (60 Unit), và ielts_listening_sections (Cam 11).
- Giai đoạn 2 (Offload Colab GPU):
  + Khởi chạy Colab notebook xử lý Destination B1 & B2 sang JSON.
  + Đón nhận tệp JSON hoàn chỉnh, chạy script post-processing và nạp nốt vào grammar_questions.

Kính nhờ Muse xem xét và chuẩn y kế hoạch phối hợp này!"""

needs_decision = [
    "Duyệt phương án nạp ngay dữ liệu sạch của Giai đoạn 1 (Murphy 145 Units + Destination C1/C2 + Collocations) vào database LinguaFlow",
    "Thống nhất cơ chế offload chuyển đổi sách Scan (Destination B1 & B2) sang Google Colab chạy GPU T4 để tối ưu thời gian và tránh nghẽn CPU máy local",
    "Phê duyệt cơ chế Regex Post-processing để xử lý triệt để 20% lỗi gộp cell ở bảng Phrasal Verbs"
]

file_path, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type=msg_type,
    subject=subject,
    body=body,
    needs_decision=needs_decision,
    needs_user_approval=False,
    from_entity="agent",
    to_entity="muse"
)

print(f"SUCCESS: Đã gửi kế hoạch nâng cấp Colab tới Muse Inbox: {file_path}")
print(f"Message ID: {data['id']}")
