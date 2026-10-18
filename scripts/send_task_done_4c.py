# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-data-phase2-006"
subject = "[TASK DONE] lingual-data-phase2-006: Hoàn thành 100% Đợt 4C (IELTS 7+7, 10 units, 120 diary)"

body = (
    "Kính gửi Muse AI,\n\n"
    "Agent báo cáo đã hoàn thành 100% Đợt 4C (task_id: lingual-data-phase2-006) theo đúng các bước quy chuẩn:\n\n"
    "1. Tải & Kiểm tra JSON:\n"
    "   - ielts-reading-batch2.json: 7 passages (ielts-r-006 -> ielts-r-012)\n"
    "   - ielts-listening-batch2.json: 7 sections (ielts-l-006 -> ielts-l-012)\n"
    "   - curriculum-units-batch2.json: 10 units (unit-21 -> unit-30, 270 từ)\n"
    "   - diary-prompts-batch2.json: 120 prompts (diary-061 -> diary-180)\n\n"
    "2. Review mẫu bắt buộc:\n"
    "   - 1 passage (The Amazing Honeybee): 5 paragraphs, 5 multiple-choice questions, đáp án chuẩn xác.\n"
    "   - 1 section (Doctor's Appointment): 12 script lines, 5 questions, audio link khớp từng dòng.\n"
    "   - 1 unit (Home & Living): 3 lessons, 27 từ vựng có phonetic, partOfSpeech, ví dụ song ngữ.\n"
    "   - 5 diary prompts: Đúng CEFR A2, có gợi ý keywords và minSentences.\n"
    "   - Tỷ lệ lỗi: 0% (< 20% yêu cầu).\n\n"
    "3. Deduplication từ vựng 10 units:\n"
    "   - Tổng số từ vựng trong 10 units: 270 từ.\n"
    "   - Đã tồn tại trong Vocabulary DB: 109 từ (furniture, curtain, lamp, carpet...).\n"
    "   - Từ vựng mới: 161 từ.\n\n"
    "4. Audio edge-tts cho IELTS Listening:\n"
    "   - Đã sinh toàn bộ 86/86 file audio MP3 cho từng dòng hội thoại của 7 sections tại apps/web/public/audio/ielts-listening/<sectionId>/<lineId>.mp3.\n"
    "   - 0 lỗi phát sinh, dung lượng chuẩn, gắn audioUrl vào script.\n\n"
    "5. Prisma & PostgreSQL:\n"
    "   - Tạo 4 model: IeltsReadingPassage, IeltsListeningSection, CurriculumUnit, DiaryPrompt.\n"
    "   - Migration: 20261019020000_phase2_batch4c_ielts_units_diary.\n"
    "   - Đã seed vào DB: 7 passages, 7 sections, 10 units, 120 diary prompts.\n\n"
    "6. Typecheck & Git:\n"
    "   - tsc --noEmit cả web và api: 0 lỗi.\n"
    "   - Commit: feat(data): phase 2 dot 4C - ielts/units/diary batch2 (28946c8)\n"
    "   - Đã push lên nhánh develop trên remote origin.\n"
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="task_done",
    subject=subject,
    body=body
)

print(f"Task done message written to inbox: {fpath}")
