# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-data-phase2-007"
subject = "[TASK DONE] lingual-data-phase2-007: Hoàn thành 100% Đợt 5A (12 mẻ từ vựng & ngữ pháp)"

body = (
    "Kính gửi Muse AI,\n\n"
    "Agent báo cáo đã hoàn thành 100% Đợt 5A (task_id: lingual-data-phase2-007) theo đúng toàn bộ quy trình bắt buộc:\n\n"
    "1. Tải & Review mẫu bắt buộc:\n"
    "   - Đã review 10 câu grammar questions (present-perfect) và các mẫu idiom, phrasal verb, collocation, synonym/antonym, minimal pairs, tongue twister, proverb, game word pool, grammar explanation.\n"
    "   - Chất lượng nội dung chuẩn CEFR, đúng ngữ pháp, tỷ lệ lỗi 0% (< 20%).\n\n"
    "2. Deduplication & PostgreSQL Seeding:\n"
    "   - grammar_questions: +500 câu mới (gq-501 -> gq-1000), tổng hiện có trong DB = 900 câu.\n"
    "   - vocabularies: +277 từ C1/C2 mới (23 từ trùng case-insensitive được dedupe an toàn), tổng từ vựng = 5.417 từ.\n"
    "   - daily_vocab_questions: +300 câu hỏi từ vựng trắc nghiệm.\n"
    "   - idioms: +200 thành ngữ có ví dụ song ngữ.\n"
    "   - phrasal_verbs: +200 cụm động từ có cờ separable.\n"
    "   - collocations: +200 cụm từ cố định.\n"
    "   - synonyms_antonyms: +200 cặp từ đồng nghĩa/trái nghĩa.\n"
    "   - minimal_pairs: +100 cặp từ phát âm dễ nhầm lẫn.\n"
    "   - tongue_twisters: +50 câu líu lưỡi luyện phát âm.\n"
    "   - proverbs: +100 tục ngữ kèm câu tương đương tiếng Việt.\n"
    "   - game_word_pools: +500 từ chia theo 10 chủ đề game.\n"
    "   - grammar_explanations: +50 bài giải thích ngữ pháp chi tiết.\n\n"
    "3. Audio edge-tts:\n"
    "   - Đã sinh đầy đủ 850 file audio MP3:\n"
    "     + 300 từ vựng C1/C2 (apps/web/public/audio/vocab/<slug>.mp3)\n"
    "     + 300 câu ví dụ C1/C2 (apps/web/public/audio/vocab/<slug>-ex.mp3)\n"
    "     + 200 file cho minimal pairs (apps/web/public/audio/pronunciation/mp-<id>-1/2.mp3)\n"
    "     + 50 file cho tongue twisters (apps/web/public/audio/pronunciation/tw-<id>.mp3)\n"
    "   - 0 lỗi phát sinh.\n\n"
    "4. Prisma Migration & Typecheck:\n"
    "   - Migration: 20261019030000_phase2_batch5a_vocab_grammar_types.\n"
    "   - tsc --noEmit cả web và api: 0 lỗi.\n"
    "   - Commit: feat(data): phase 2 dot 5A - import tu vung/ngu phap batch3 + loai moi (e970bf0)\n"
    "   - Đã push lên nhánh develop trên remote origin.\n"
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="task_done",
    subject=subject,
    body=body
)

print(f"Task done message written to inbox: {fpath}")
