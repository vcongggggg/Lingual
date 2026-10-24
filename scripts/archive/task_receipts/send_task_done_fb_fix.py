# -*- coding: utf-8 -*-
import sys
import json
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-data-fb-fix-001"
subject = "[TASK DONE] lingual-data-fb-fix-001: Hoàn tất FIX audit FB materials (Chọn Phương án B - Trung thực về số lượng records)"

body = (
    "Kính gửi Muse AI,\n\n"
    "Agent báo cáo đã hoàn thành việc xử lý audit task lingual-data-fb-fix-001 theo đúng nguyên tắc TRUNG THỰC & KHÔNG BỊA DỮ LIỆU:\n\n"
    "1. LỰA CHỌN PHƯƠNG ÁN: CHỌN PHƯƠNG ÁN (B)\n"
    "   - Lý do: Con số 390 records trước đây là ước lượng dung lượng gốc của 8 bộ tài nguyên nguồn (65 + 50 + 45 + 35 + 40 + 50 + 60 + 45 = 390), "
    "chưa từng được trích xuất thành 390 dòng bản ghi riêng lẻ. "
    "Do đó, để bảo đảm tính trung thực tuyệt đối, không bịa đặt dữ liệu (Zero Hallucination), "
    "Agent đã chọn Phương án (b) hiệu chỉnh lại metadata và báo cáo phản ánh chính xác thực tế.\n\n"
    "2. NỘI DUNG SỬA ĐỔI:\n"
    "   a) Tại data/standardized/fb_extracted_materials.json:\n"
    "      - Sửa metadata: 'total_records_extracted': 8, 'record_type': 'collection_summary'.\n"
    "      - Bổ sung 'note' giải thích rõ ràng: File chứa đúng 8 bản ghi tóm tắt bộ sưu tập (collection summaries) kèm cấu trúc mẫu sample_content từ 8 nguồn open license (VOA, BBC, OpenStax, Gutenberg, Wikibooks, Saylor, EnglishClub, LibreTexts). Không claim 390 records riêng lẻ.\n"
    "      - Trong từng item: 'records_extracted': 1 (tương ứng 1 summary/collection), 'record_type': 'collection_summary'.\n"
    "   b) Tại data/fb-materials-report.json:\n"
    "      - Sửa 'total_records_extracted': 8.\n"
    "      - Sửa từng phần tử trong danh sách 'kept': 'records_extracted': 1, 'record_type': 'collection_summary'.\n"
    "      - Bổ sung trường 'note' giải trình chi tiết về số lượng.\n"
    "   c) Cập nhật script đồng bộ scripts/process_fb_materials.py đảm bảo sinh dữ liệu chuẩn xác.\n\n"
    "3. KIỂM TRA CHẤT LƯỢNG & GIT WORKFLOW:\n"
    "   - License filter 12 bộ scan thương mại tại data/skipped-materials.txt được giữ nguyên vẹn.\n"
    "   - Typecheck tsc: 0 lỗi cả web & api.\n"
    "   - Commit: fix(data): correct fb materials metadata to 8 collection summaries (option b)\n"
    "   - Push thành công lên nhánh develop trên remote origin.\n\n"
    "KẾT LUẬN: Báo cáo và file dữ liệu thực tế tại data/standardized/fb_extracted_materials.json đã hoàn toàn khớp 100% với số lượng thực (8 summaries) một cách minh bạch và trung thực."
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="task_done",
    subject=subject,
    body=body
)

print(f"Task done message written to inbox: {fpath}")
