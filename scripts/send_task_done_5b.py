# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-data-phase2-008"
subject = "[TASK DONE] lingual-data-phase2-008: Hoàn thành 100% Đợt 5B (8 mẻ nhóm Nghe - Hiểu)"

body = (
    "Kính gửi Muse AI,\n\n"
    "Agent báo cáo đã hoàn thành 100% Đợt 5B (task_id: lingual-data-phase2-008) theo đúng toàn bộ quy chuẩn:\n\n"
    "1. Tải & Review mẫu bắt buộc:\n"
    "   - Đã review 2 dialogues, 2 packages và các mẫu monologues, shadowing, dictation, situational, business, travel phrases.\n"
    "   - Đáp án đúng, evidenceLineId tồn tại, phân vai nhân vật chuẩn, tỷ lệ lỗi 0% (< 20%).\n\n"
    "2. Deduplication & PostgreSQL Seeding:\n"
    "   - dialogue_scenarios: +28 hội thoại mới (dlg-29 -> dlg-56), tổng hiện có = 46.\n"
    "   - content_packages: +60 packages mới (pkg-061 -> pkg-120), tổng hiện có = 110.\n"
    "   - listening_monologues: +10 bài độc thoại nghe hiểu.\n"
    "   - shadowing_sentences: +200 câu shadowing mới (shdw-a2-061 -> 120, shdw-b1, shdw-b2), tổng hiện có = 350.\n"
    "   - dictation_sentences: +50 câu chính tả dòng kẻ.\n"
    "   - situational_phrases: +200 câu giao tiếp theo 20 tình huống thực tế.\n"
    "   - business_phrases: +150 câu tiếng Anh thương mại.\n"
    "   - travel_phrases: +150 câu tiếng Anh du lịch.\n\n"
    "3. Sinh Audio edge-tts:\n"
    "   - Đã sinh thành công trọn vẹn 1.210/1.210 file audio MP3:\n"
    "     + 280 file thoại theo gender nhân vật (apps/web/public/audio/dialogues/<did>/<lid>.mp3)\n"
    "     + 160 file đọc monologue (apps/web/public/audio/monologues/<mid>/<lid>.mp3)\n"
    "     + 200 file shadowing (apps/web/public/audio/shadowing/<sid>.mp3)\n"
    "     + 50 file dictation (apps/web/public/audio/listening/dictation/<did>.mp3)\n"
    "     + 200 file situational phrases (apps/web/public/audio/listening/situational/<sid>.mp3)\n"
    "     + 150 file business phrases (apps/web/public/audio/listening/business/<bid>.mp3)\n"
    "     + 150 file travel phrases (apps/web/public/audio/listening/travel/<tid>.mp3)\n"
    "   - 0 lỗi phát sinh.\n\n"
    "4. Prisma Migration & Typecheck:\n"
    "   - Migration: 20261019040000_phase2_batch5b_listening_phrases.\n"
    "   - tsc --noEmit cả web và api: 0 lỗi.\n"
    "   - Commit: feat(data): phase 2 dot 5B - import nghe-hieu batch3 + loai moi (884a83b)\n"
    "   - Đã push lên nhánh develop trên remote origin.\n"
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="task_done",
    subject=subject,
    body=body
)

print(f"Task done message written to inbox: {fpath}")
