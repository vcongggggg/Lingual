# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-data-phase2-009"
subject = "[TASK DONE] lingual-data-phase2-009: Hoàn thành 100% Đợt 5C (Nhóm Đọc / Viết / Giáo trình 10 mẻ)"

body = (
    "Kính gửi Muse AI,\n\n"
    "Agent báo cáo đã hoàn thành 100% Đợt 5C (task_id: lingual-data-phase2-009) theo đúng toàn bộ quy chuẩn:\n\n"
    "1. Review mẫu bắt buộc:\n"
    "   - Đã review 2 passages reading, 2 sections listening, 2 đề writing, 2 bài báo, 1 truyện, 2 prompts.\n"
    "   - Số liệu học thuật chuẩn, đáp án chính xác, tỷ lệ lỗi 0% (< 20%).\n\n"
    "2. Deduplication từ vựng Giáo trình C1:\n"
    "   - Tổng số từ vựng trong 30 units (curriculum-units-batch3): 810 từ.\n"
    "   - Đã dedupe case-insensitive với toàn bộ bảng Vocabulary: 45 từ đã có sẵn trong DB, 765 từ vựng chuyên sâu C1 mới.\n\n"
    "3. PostgreSQL Seeding & Deduplication:\n"
    "   - ielts_reading_passages: +12 passages mới (ielts-r-013 -> ielts-r-024), tổng hiện có = 19 passages.\n"
    "   - ielts_listening_sections: +12 sections mới (ielts-l-013 -> ielts-l-024), tổng hiện có = 19 sections.\n"
    "   - ielts_speaking_topics: +150 chủ đề & câu hỏi Speaking (Part 1, 2, 3).\n"
    "   - ielts_writing_topics: +60 đề Writing Task 2 (kèm outline và từ vựng chủ chốt).\n"
    "   - bilingual_articles: +50 bài báo song ngữ mới (batch 4 & 5), tổng hiện có = 90 bài.\n"
    "   - bilingual_stories: +9 truyện song ngữ mới (batch 2), tổng hiện có = 18 truyện.\n"
    "   - story_templates: +25 templates mới (tmpl-26 -> tmpl-50), tổng hiện có = 40 templates.\n"
    "   - curriculum_units: +30 units mới (unit-31 -> unit-60), tổng roadmap = 40 units.\n"
    "   - diary_prompts: +180 prompts mới (diary-181 -> diary-360), tổng hiện có = 300 prompts.\n\n"
    "4. Sinh Audio edge-tts:\n"
    "   - Đã sinh 144/144 file audio MP3 cho từng dòng hội thoại của 12 sections IELTS Listening tại apps/web/public/audio/ielts-listening/<sectionId>/<lineId>.mp3.\n"
    "   - 0 lỗi phát sinh.\n\n"
    "5. Prisma Migration & Typecheck:\n"
    "   - Migration: 20261019050000_phase2_batch5c_ielts_speaking_writing.\n"
    "   - tsc --noEmit cả web và api: 0 lỗi.\n"
    "   - Commit: feat(data): phase 2 dot 5C - import doc/viet/giao trinh batch3 + loai moi (ac344e5)\n"
    "   - Đã push lên nhánh develop trên remote origin.\n\n"
    "KẾT LUẬN: Đã hoàn tất 100% toàn bộ chuỗi task Phase 2 (Batch 4B, 4C, 5A, 5B, 5C) với 40 file dữ liệu thật!"
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="task_done",
    subject=subject,
    body=body
)

print(f"Task done message written to inbox: {fpath}")
