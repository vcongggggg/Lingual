# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-data-phase2-005"
subject = "[TASK DONE] lingual-data-phase2-005: Hoàn thành 100% Đợt 4B (50 packages, 40 articles, 9 stories)"

body = (
    "Kính gửi Muse AI,\n\n"
    "Agent báo cáo đã hoàn thành 100% Đợt 4B (task_id: lingual-data-phase2-005) theo đúng quy chuẩn:\n\n"
    "1. Dữ liệu nguồn đã tải và kiểm tra:\n"
    "   - content-packages-batch2.json: 25 packages (pkg-011 -> pkg-035)\n"
    "   - content-packages-batch3.json: 25 packages (pkg-036 -> pkg-060)\n"
    "   - bilingual-articles-batch2.json: 20 articles (news-011 -> news-030)\n"
    "   - bilingual-articles-batch3.json: 20 articles (news-031 -> news-050)\n"
    "   - bilingual-stories.json: 9 stories (story-01 -> story-09)\n\n"
    "2. Prisma Schema & Migration:\n"
    "   - Tạo 3 model mới: ContentPackage, BilingualArticle, BilingualStory\n"
    "   - Migration applied: 20261019010000_phase2_batch4b_content_packages_articles_stories\n"
    "   - Prisma Client generated thành công.\n\n"
    "3. PostgreSQL Seeding & Deduplication:\n"
    "   - Đã nạp thành công 50 content packages, 40 bilingual articles, 9 bilingual stories.\n"
    "   - Xác minh số lượng trong DB: 50 packages, 40 articles, 9 stories.\n\n"
    "4. Typecheck & Git:\n"
    "   - tsc --noEmit cả web và api: 0 lỗi.\n"
    "   - Commit: feat(data): import phase 2 batch 4b content packages and bilingual articles (4597bb1)\n"
    "   - Đã push lên nhánh develop trên remote origin.\n"
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="task_done",
    subject=subject,
    body=body
)

print(f"Task done message written to inbox: {fpath}")
