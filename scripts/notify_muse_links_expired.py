# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

subject = "[BLOCKED - YÊU CẦU CẤP LẠI LINK] Toàn bộ link tải tmpfiles.org các đợt 4B, 4C, 5A, 5B, 5C đã hết hạn (404)"

body = (
    "Kính gửi Muse AI,\n\n"
    "Agent kiểm tra hàng đợi các task Phase 2 và xác nhận TOÀN BỘ link tải trên dịch vụ lưu trữ tạm tmpfiles.org "
    "đều đã bị hết hạn (HTTP 404 Not Found) do dịch vụ tự động xóa file sau 1-2 tiếng:\n\n"
    "1. Đợt 4B (task_id: lingual-data-phase2-005):\n"
    "   - content-packages-batch2.json -> 404 Not Found\n"
    "   - content-packages-batch3.json -> 404 Not Found\n"
    "   - bilingual-articles-batch2.json -> 404 Not Found\n"
    "   - bilingual-articles-batch3.json -> 404 Not Found\n"
    "   - bilingual-stories.json -> 404 Not Found\n\n"
    "2. Đợt 4C (task_id: lingual-data-phase2-006):\n"
    "   - ielts-reading-batch2.json -> 404 Not Found\n"
    "   - ielts-listening-batch2.json -> 404 Not Found\n"
    "   - curriculum-units-batch2.json -> 404 Not Found\n"
    "   - diary-prompts-batch2.json -> 404 Not Found\n\n"
    "3. Đợt 5A (task_id: lingual-data-phase2-007): 12 file (grammar-questions-batch3, daily-vocab-questions, v.v.) -> 404 Not Found\n"
    "4. Đợt 5B (task_id: lingual-data-phase2-008): 9 file (dialogues-batch3, content-packages-batch4/5, v.v.) -> 404 Not Found\n"
    "5. Đợt 5C (task_id: lingual-data-phase2-009): 10 file (ielts, bilingual articles, stories, units, v.v.) -> 404 Not Found\n\n"
    "Theo đúng quy chuẩn: 'Nếu link chết thì báo blocked, không tự bịa data'.\n\n"
    "Kính đề nghị Muse AI cung cấp lại bộ link mới (hoặc lưu trữ lên nguồn bền vững hơn như Google Drive / GitHub Gist / release / copy thẳng vào thư mục data/) "
    "để Agent có thể tải và tiếp tục thực hiện các đợt import tiếp theo."
)

fpath, data = mailbox.write_inbox_message(
    task_id="lingual-data-phase2-all",
    msg_type="needs_decision",
    subject=subject,
    body=body,
    needs_decision=["reupload_links_phase2"],
    needs_user_approval=False
)

print(f"Sent formal message to Muse AI: {fpath}")
