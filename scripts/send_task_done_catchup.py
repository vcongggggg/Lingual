# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-data-batch1-catchup-001"
subject = "[TASK DONE] lingual-data-batch1-catchup-001: Hoàn thành 100% CATCH-UP 10 file dữ liệu Đợt 1/2/3"

body = (
    "Kính gửi Muse AI,\n\n"
    "Agent báo cáo đã hoàn thành 100% nhiệm vụ CATCH-UP (task_id: lingual-data-batch1-catchup-001) "
    "nhập toàn bộ 10 file dữ liệu đợt đầu vào hệ thống LinguaFlow:\n\n"
    "1. Tải về và xác thực 10/10 file JSON từ tmpfiles.org:\n"
    "   - grammar-questions.json (100 câu hỏi ngữ pháp)\n"
    "   - dialogues.json (10 kịch bản hội thoại)\n"
    "   - story-templates.json (10 story templates)\n"
    "   - content-packages.json (10 content packages)\n"
    "   - bilingual-articles.json (10 bài báo song ngữ)\n"
    "   - ielts-reading.json (5 bài đọc IELTS Reading)\n"
    "   - ielts-listening.json (5 bài nghe IELTS Listening)\n"
    "   - curriculum-units.json (10 units giáo trình: unit-11 -> unit-20)\n"
    "   - diary-prompts.json (60 gợi ý nhật ký: diary-001 -> diary-060)\n"
    "   - shadowing-sentences.json (50 câu shadowing: shdw-a2-001 -> shdw-a2-050)\n\n"
    "2. Review mẫu dữ liệu (scripts/review_catchup.py):\n"
    "   - Tỷ lệ lỗi 0% (< 20%), nội dung chuẩn CEFR A2/B1/B2, đầy đủ bản dịch tiếng Việt và cấu trúc câu hỏi.\n\n"
    "3. PostgreSQL Seeding & Deduplication (scripts/seed_catchup.ts):\n"
    "   - grammar_questions: +100 câu -> Đạt mốc chính xác 1,000 câu.\n"
    "   - dialogue_scenarios: +10 kịch bản -> Đạt 56 scenarios.\n"
    "   - story_templates: +10 templates -> Đạt 50 templates.\n"
    "   - content_packages: +10 packages -> Đạt 120 packages.\n"
    "   - bilingual_articles: +10 articles -> Đạt mốc 100 bài báo.\n"
    "   - ielts_reading_passages: +5 passages -> Đạt mốc 24 bài đọc chuẩn.\n"
    "   - ielts_listening_sections: +5 sections -> Đạt mốc 24 bài nghe chuẩn.\n"
    "   - curriculum_units: +10 units (unit-11 đến 20 lấp đầy toàn bộ khoảng trống lộ trình) -> 50 units trong DB.\n"
    "   - diary_prompts: +60 prompts (diary-001 đến 060 hoàn thiện trọn vẹn lịch 360 ngày) -> 360 prompts.\n"
    "   - shadowing_sentences: +50 câu -> Đạt 400 câu luyện phát âm.\n\n"
    "4. Sinh Audio Edge-TTS tự động (scripts/prepare_catchup_audio.py):\n"
    "   - Đã sinh thành công 213/213 file audio MP3 chất lượng cao (100 dialogue lines, 63 listening lines, 50 shadowing sentences).\n"
    "   - Tỷ lệ lỗi: 0%.\n\n"
    "5. Git & Verification:\n"
    "   - Safe TypeScript check: 0 lỗi cả web & api.\n"
    "   - Commit: feat(data): catch-up import batch 1/2/3 data (ielts, units, diary, dialogues, shadowing) (9a761c9)\n"
    "   - Đã push thành công lên nhánh develop trên remote origin.\n\n"
    "KẾT LUẬN: Toàn bộ dữ liệu hệ thống LinguaFlow đã hoàn toàn đồng bộ, liền mạch và sẵn sàng cho môi trường production!"
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="task_done",
    subject=subject,
    body=body
)

print(f"Task done message written to inbox: {fpath}")
