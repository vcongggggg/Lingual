import sys
import os
import json

# Add mailbox to path
sys.path.insert(0, r"C:\Mod\muse-mailbox")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
import mailbox

task_id = "lingual-proposal-book-materials-ingestion-001"
msg_type = "consultation"
subject = "[ĐỀ XUẤT KIẾN TRÚC] Phương án tích hợp kho tài liệu sách (Cambridge IELTS 1-15, Destination B1-C2, Murphy, Collocations) vào LinguaFlow"

body = """Kính gửi Muse,

Agent Trợ lý Hệ thống gửi đề xuất kiến trúc và kế hoạch tích hợp kho 27 cuốn sách tiếng Anh chuẩn quốc tế (>570 MB PDF) vừa được tải về tại thư mục C:\\Study\\HocKy6\\materials vào hệ thống LinguaFlow, kính nhờ Muse xem xét và phê duyệt định hướng triển khai:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. HIỆN TRẠNG KHO TÀI LIỆU SẴN CÓ TẠI C:\\Study\\HocKy6\\materials:
- Trọn bộ Cambridge IELTS 01 -> 15 (Academic & General Practice Tests, 15 cuốn PDF đầy đủ đề, Audioscript và Answer Key).
- Trọn bộ Destination Grammar & Vocabulary B1, B2, C1 & C2 (3 cuốn PDF kèm đáp án chi tiết).
- Raymond Murphy - English Grammar in Use 5th Edition (1 cuốn PDF).
- Cambridge English Collocations in Use Intermediate (1 cuốn PDF).
- Cambridge Vocabulary for IELTS Advanced & Collins Vocabulary for IELTS (2 cuốn PDF).
- Cambridge Grammar for IELTS with Answers & Barron's IELTS Practice Tests (2 cuốn PDF).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. BẢN ĐỒ ÁNH XẠ DỮ LIỆU (DATA MAPPING) VÀO PRISMA SCHEMA CỦA LINGUAFLOW:
Hệ thống LinguaFlow (apps/api/prisma/schema.prisma) đã có sẵn các mô hình dữ liệu khớp hoàn hảo:

a) Phân hệ IELTS Exam & Mock Test:
- Model 'IeltsListeningSection': Trích xuất 4 Parts của từng Test (Audio URL/Path, scriptJson lưu Audioscript, questionsJson lưu 40 câu hỏi trắc nghiệm/điền từ/bản đồ kèm đáp án).
- Model 'IeltsReadingPassage': Trích xuất 3 Passages vào passageJson, questionsJson lưu câu hỏi True/False/NG, Matching Headings, Summary Completion.
- Model 'IeltsWritingTopic' & 'IeltsWritingModel': Đề bài Task 1 & Task 2 kèm bài luận mẫu Band 8.5+ của giám khảo Cambridge.
- Model 'IeltsSpeakingTopic' & 'IeltsSpeakingModel': Bộ câu hỏi phỏng vấn Speaking Part 1, 2, 3.

b) Phân hệ Grammar & Curriculum Roadmap:
- Model 'GrammarExplanation': Lưu các bài giảng ngữ pháp theo từng Unit (topic, topicVi, ruleVi, examplesJson, commonMistakesJson) từ Destination B1-C2 và Raymond Murphy.
- Model 'GrammarQuestion': Lưu ngân hàng hàng nghìn câu hỏi bài tập trắc nghiệm và điền dạng đúng của từ (optionsJson, correctAnswer, explanationVi) gắn nhãn CEFR (A2, B1, B2, C1).

c) Phân hệ Collocation & Spaced Repetition (SRS Flashcards):
- Model 'Collocation': 1.000+ cặp từ kết hợp tự nhiên (collocation, type, meaningVi, exampleEn, exampleVi) từ English Collocations in Use.
- Model 'Vocabulary' & 'UserWordState': Nạp từ vựng học thuật trọng tâm cho IELTS vào hệ thống Flashcard kèm thuật toán SM-2 để người dùng ôn tập ngắt quãng hàng ngày.

d) Phân hệ Luyện Nghe Tương Tác Sâu:
- Model 'DictationSentence': Lấy các câu audio ngắn từ Cambridge Listening làm bài tập Nghe chép chính tả có chấm điểm từng từ.
- Model 'ShadowingSentence': Lấy câu thoại mẫu để người học nhại giọng và AI chấm điểm phát âm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. KẾ HOẠCH PHÂN CHIA BATCH TRIỂN KHAI:
- Batch 1 (Ưu tiên cao - Ngữ pháp & Bài tập): Destination B1, B2, C1&C2 và Raymond Murphy -> Nạp vào grammar_explanations và grammar_questions.
- Batch 2 (Từ vựng & Cụm từ): English Collocations in Use + Cambridge Vocabulary for IELTS -> Nạp vào collocations và vocabularies (SRS).
- Batch 3 (Luyện đề chuyên sâu): Cambridge IELTS 11 đến 15 (các tập mới nhất) -> Nạp vào ielts_listening_sections, ielts_reading_passages và standardized_exams.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. PIPELINE KỸ THUẬT:
1. Parser Script (Python): Bóc tách text, câu hỏi, Audioscripts và Answer Key từ PDF sang JSON thô.
2. Normalizer & Enrichment: Chuẩn hóa khớp interface TypeScript/Prisma, bổ sung explanationVi và CEFR level.
3. Idempotent Seeder: Bulk insert an toàn vào PostgreSQL container (không trùng lặp dữ liệu).
4. E2E Verification: Kiểm thử API GET content pagination và hiển thị trên giao diện web."""

needs_decision = [
    "Duyệt tính phù hợp của bản đồ ánh xạ dữ liệu (Data Mapping) vào Prisma Schema hiện tại của LinguaFlow",
    "Thống nhất thứ tự ưu tiên 3 batch nạp dữ liệu (Batch 1: Grammar; Batch 2: Collocations/Vocab; Batch 3: Cambridge IELTS Tests)",
    "Xác nhận cơ chế: Agent tự động viết parser trích xuất PDF sang JSON hay MuseGen hỗ trợ sinh các trường bổ trợ (explanationVi, topicVi)"
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

print(f"SUCCESS: Đã gửi thông điệp đề xuất tới Muse Inbox: {file_path}")
print(f"Message ID: {data['id']}")
