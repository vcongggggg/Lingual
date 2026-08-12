# LinguaFlow — Plan v3: Mở rộng thành nền tảng Học + Ôn + Luyện thi IELTS/TOEIC

Plan này bổ sung một **Exam Prep Module** vào LinguaFlow hiện có, không phá vỡ
kiến trúc domain-agnostic và multi-language đã chốt ở plan v2 — luyện thi
IELTS/TOEIC được xây như một lớp nội dung + tính năng riêng, dùng chung
auth/XP/streak/admin đã có.

---

## 1. Phạm vi mở rộng

LinguaFlow từ nay có 2 track song song, chọn ở onboarding:
- **General English** (track hiện có: Units/Lessons/SRS/Games theo CEFR).
- **Exam Prep**: IELTS Academic/General Training, TOEIC Listening & Reading
  (và tuỳ chọn TOEIC Speaking & Writing ở giai đoạn sau).

Hai track dùng chung: Auth, XP/Streak engine, Vocabulary/SRS engine, Admin
CMS, i18n/multi-language routing. Không tách app riêng.

---

## 2. Tính năng chi tiết theo từng kỳ thi

### 2.1. IELTS

| Kỹ năng | Loại câu hỏi cần hỗ trợ | Tính năng |
|---|---|---|
| **Listening** | Multiple choice, form/note/table completion, matching, map/plan labelling | Audio player với transcript ẩn, mock test 4 section theo timer thật (~30 phút + 10 phút chuyển đáp án) |
| **Reading** | True/False/Not Given, Yes/No/Not Given, matching headings, matching information, summary completion, multiple choice | Passage + câu hỏi song song 2 cột, highlight-to-note, timer 60 phút/3 passage |
| **Writing** | Task 1 (Academic: biểu đồ/bảng/quy trình; General: thư), Task 2 (essay) | Editor có word count, **AI chấm điểm theo 4 tiêu chí band descriptor** (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy), feedback chi tiết từng câu |
| **Speaking** | Part 1 (giới thiệu bản thân), Part 2 (cue card 1 phút chuẩn bị + 2 phút nói), Part 3 (thảo luận sâu) | Ghi âm qua trình duyệt, speech-to-text (Whisper hoặc Web Speech API), AI chấm Fluency, Lexical Resource, Grammar, Pronunciation (ước lượng qua text vì chưa có audio scoring model) |
| **Band Score Estimator** | — | Ước tính band tổng từ 4 kỹ năng theo bảng quy đổi công khai của IELTS |
| **Full Mock Test** | — | Giả lập đúng trình tự thi thật (Listening → Reading → Writing, Speaking đặt lịch riêng), tính giờ nghiêm ngặt, không cho tua lại |

### 2.2. TOEIC

| Phần | Nội dung | Tính năng |
|---|---|---|
| **Listening (Part 1-4)** | Photographs, Question-Response, Conversations, Talks | Mock test 45 phút, chấm điểm thô → quy đổi thang 495 |
| **Reading (Part 5-7)** | Incomplete sentences (ngữ pháp/từ vựng), Text completion, Reading comprehension (single/multiple passage) | Mock test 75 phút, phân tích lỗi sai theo loại (ngữ pháp/từ vựng/suy luận) |
| **Score Conversion** | — | Bảng quy đổi số câu đúng → điểm TOEIC (theo thang chính thức ETS công bố công khai, không phải nội dung độc quyền) |
| **TOEIC Speaking & Writing** (v2, không làm MVP exam module) | 11 task nói + 8 task viết | Để giai đoạn sau, dùng chung pipeline AI feedback với IELTS Speaking/Writing |

### 2.3. Tính năng chung cho cả 2 track thi

- **Weak-point analysis**: thống kê tỷ lệ đúng/sai theo dạng câu hỏi (vd "matching headings" hay sai → đề xuất bài luyện riêng dạng này) — tái dùng domain logic thống kê đã có cho SRS.
- **Adaptive mock test difficulty**: dựa trên band/score gần nhất để đề xuất bộ đề phù hợp.
- **Exam-specific vocabulary deck**: nạp riêng TOEIC Service List / IELTS academic wordlist vào SRS engine hiện có — không cần domain logic mới, chỉ cần seed data gắn tag `examType`.
- **Countdown mock exam mode**: full-screen, khoá điều hướng, mô phỏng áp lực phòng thi thật.
- **Progress report theo thời gian**: biểu đồ band/score ước tính qua từng lần mock test.

---

## 3. Cập nhật schema (bổ sung, không phá schema cũ)

```prisma
model ExamTrack {                     // [MỚI]
  id       String @id @default(uuid())
  type     String   // "IELTS_ACADEMIC" | "IELTS_GENERAL" | "TOEIC_LR" | "TOEIC_SW"
}

model ExamQuestion {                  // [MỚI]
  id          String  @id @default(uuid())
  examType    String  // liên kết ExamTrack.type
  skill       String  // "listening" | "reading" | "writing" | "speaking"
  part        String  // vd "part_5", "task_2", "cue_card"
  difficulty  String  // band/score tương đương, vd "band_6.5", "toeic_700_850"
  content     Json    // câu hỏi, đáp án, transcript/audio url, passage text...
  source      String  // nguồn gốc dữ liệu (để audit bản quyền — xem mục 5)
}

model MockTestAttempt {               // [MỚI]
  id           String   @id @default(uuid())
  userId       String
  examType     String
  startedAt    DateTime
  submittedAt  DateTime
  rawScore     Json     // điểm thô từng section
  estimatedBand Json    // band/score ước tính
}

model WritingSubmission {             // [MỚI]
  id         String @id @default(uuid())
  attemptId  String
  taskType   String   // "task_1" | "task_2"
  text       String
  aiScores   Json     // 4 tiêu chí + feedback chi tiết
}

model SpeakingSubmission {            // [MỚI]
  id           String @id @default(uuid())
  attemptId    String
  part         String
  audioUrl     String
  transcript   String
  aiScores     Json
}
```

`ExamQuestion` dùng `Json` cho `content` vì cấu trúc câu hỏi IELTS/TOEIC rất
đa dạng theo từng dạng — tránh phải tạo hàng chục bảng con.

---

## 4. AI feedback pipeline (Writing & Speaking)

- Dùng Anthropic API (Claude) với prompt chấm theo đúng band descriptor công
  khai của IELTS (4 tiêu chí) — **không tự sáng tác rubric**, dùng nguyên văn
  tiêu chí công khai từ IELTS/ETS để đảm bảo tính nhất quán.
- Cache kết quả chấm theo hash(text) để tránh chấm lại + tốn chi phí API khi
  user chỉ xem lại bài cũ.
- Rate limit số lần chấm/ngày theo user (chi phí API là biến phí thực, khác
  với các tính năng khác trong app).
- Speaking: pipeline gồm ghi âm → speech-to-text (Whisper self-host hoặc
  Web Speech API cho MVP, nâng cấp sau) → transcript đưa vào cùng prompt
  chấm như Writing, cộng thêm ước lượng fluency dựa trên tốc độ nói/số lần
  ngập ngừng (đo từ timestamp audio, không cần model riêng).

---

## 5. Nguồn dữ liệu để nạp vào hệ thống

> ⚠️ **Lưu ý bản quyền quan trọng**: đề thi thật của IELTS (do British
> Council/IDP/Cambridge sở hữu) và TOEIC (do ETS sở hữu), kể cả sách
> "Cambridge IELTS 1-19", đều có bản quyền — **không được scrape/redistribute
> nguyên văn** để nạp vào sản phẩm thương mại hoặc public. Các nguồn dưới đây
> là dữ liệu mở, do cộng đồng/AI tạo, hoặc là wordlist công khai — phù hợp để
> bootstrap nội dung MVP hoặc dùng làm dữ liệu train/tham khảo cấu trúc câu
> hỏi, không phải đề thi thật.

### 5.1. Bộ đề luyện tập (open/community-generated)

- **ielts-ai-dataset** (LuchoBazz) — bộ đề IELTS Listening/Reading/Writing
  do AI tạo, JSON/Markdown, royalty-free, có sẵn cấu trúc theo band mục
  tiêu — phù hợp nhất để seed nhanh MVP.
  `github.com/LuchoBazz/ielts-ai-dataset`
- **ieltstrek** (nvtai040502) — không phải dataset nội dung, nhưng có schema
  DB mẫu rất chi tiết cho Reading/Listening (exam parts → passages →
  question groups → questions) — dùng để tham khảo thiết kế `content` JSON.
  `github.com/nvtai040502/ieltstrek`
- **toeicbert** (graykode) — dataset câu hỏi TOEIC dạng điền khuyết
  (ngữ pháp + từ vựng) ở định dạng JSON có sẵn đáp án, phù hợp seed Part 5.
  `github.com/graykode/toeicbert`
- **GitHub topic `ielts-exam` / `ielts` / `toeic`** — nhiều repo nhỏ hơn có
  câu hỏi mẫu, nên rà thêm khi cần mở rộng số lượng câu hỏi:
  `github.com/topics/ielts-exam`, `github.com/topics/toeic`

### 5.2. Chấm điểm Writing tự động (tham khảo kỹ thuật)

- **Grade-Your-IELTS** (edbertw) — model DeBERTa V3 fine-tune để chấm
  IELTS Writing, có thể dùng làm baseline offline (không tốn API) song
  song với chấm bằng LLM, hoặc dùng để so sánh/kiểm định kết quả AI feedback.
  `github.com/edbertw/Grade-Your-IELTS`
- **IELTS_PracticeAndEvaluation** (ZainabZaman) — tham khảo cách thiết kế
  rubric chấm chi tiết theo từng tiêu chí (task_achievement, coherence,
  lexical_resource...) rất sát với cấu trúc `WritingSubmission.aiScores`
  đề xuất ở mục 3.
  `github.com/ZainabZaman/IELTS_PracticeAndEvaluation`

### 5.3. Từ vựng chuyên biệt cho thi (nạp thẳng vào SRS engine hiện có)

- **TOEIC Service List (TSL)** — wordlist chính thức do Charles Browne &
  Brent Culligan biên soạn riêng cho TOEIC, miễn phí học thuật.
  `github.com/fildpauz/vocab-lists`
- **New General Service List (NGSL)** — từ vựng lõi tiếng Anh tần suất cao,
  nền tảng tốt trước khi vào từ chuyên ngành thi.
  (cùng repo `fildpauz/vocab-lists`)
- **Oxford 3000/5000 by CEFR level** — wordlist chính thức Oxford, có bản
  PDF/TXT/CSV cộng đồng đã convert sẵn kèm audio phát âm:
  `github.com/jnoodle/English-Vocabulary-Word-List`,
  `github.com/winterdl/oxford-5000-vocabulary-audio-definition` (kèm 10K
  file audio UK/US).
- **Words-CEFR-Dataset** (Maximax67) — mapping từ vựng → CEFR level dựa
  trên CEFR-J + tần suất Google N-Gram, hữu ích để tự động gắn `difficulty`
  cho từ vựng chưa có nhãn sẵn.
  `github.com/Maximax67/Words-CEFR-Dataset`
- **toeic-600-essential-words** (nguyenquanghuy15091995) — bộ 600 từ TOEIC
  thiết yếu, định dạng đơn giản dễ parse, phù hợp seed nhanh giai đoạn đầu.

### 5.4. Cách nạp dữ liệu (ingestion pipeline đề xuất)

1. Viết script trong `prisma/seed-exam/` đọc các dataset JSON/CSV ở trên,
   chuẩn hoá về đúng shape `ExamQuestion.content` đã định nghĩa ở mục 3.
2. Gắn `source` field rõ ràng cho từng câu hỏi (tên dataset gốc) để sau này
   audit hoặc gỡ bỏ nếu phát sinh vấn đề bản quyền.
3. Với phần thiếu (đặc biệt Speaking cue cards, Writing Task 1 biểu đồ) —
   cân nhắc **tự sinh bằng LLM** theo đúng format/độ khó chuẩn (không copy đề
   thật), có bước review thủ công trước khi publish qua Admin CMS — Admin
   CMS cần thêm trạng thái `draft/review/published` cho `ExamQuestion`.
4. Audio Listening: với MVP có thể dùng TTS (đã có trong plan tổng, mục
   Web Speech API/OpenAI TTS) để tự sinh audio cho đề tự tạo, thay vì cần
   audio thật.

---

## 6. Cập nhật Admin CMS

- Thêm khu vực quản lý riêng cho Exam Prep: tạo/sửa `ExamQuestion` theo
  từng skill/part, preview mock test trước khi publish.
- Trạng thái nội dung: `draft → review → published` (đặc biệt quan trọng
  cho nội dung AI-generated, cần người duyệt trước khi đưa vào mock test
  thật).
- Dashboard thống kê: tỷ lệ đúng/sai theo từng câu hỏi trên toàn bộ user
  (câu nào quá dễ/quá khó cần điều chỉnh).

---

## 7. Lộ trình triển khai đề xuất

1. **Giai đoạn 1**: Vocabulary theo TSL/Oxford (tái dùng SRS engine có sẵn,
   gần như không tốn dev effort mới) + Reading/Listening mock test dùng
   `ielts-ai-dataset` và `toeicbert` để seed nhanh.
2. **Giai đoạn 2**: Writing module + AI feedback pipeline (Task 2 trước,
   Task 1 sau vì cần xử lý ảnh biểu đồ).
3. **Giai đoạn 3**: Speaking module (ghi âm + speech-to-text + AI feedback)
   — phức tạp nhất, cần hạ tầng audio storage.
4. **Giai đoạn 4**: TOEIC Speaking & Writing (dùng chung pipeline giai đoạn
   2-3), Admin CMS review workflow hoàn chỉnh.

---

## 8. Câu hỏi cần chốt

1. MVP có bắt buộc phải có Speaking module ngay không, hay ưu tiên
   Listening/Reading/Writing trước (Speaking tốn hạ tầng audio nhất)?
2. Ngân sách cho AI feedback (gọi Claude API để chấm Writing/Speaking) —
   có giới hạn số lượt chấm/user/ngày ở bản miễn phí không?
3. Nội dung mock test dùng hoàn toàn AI-generated (như `ielts-ai-dataset`)
   hay có kế hoạch mua license nội dung chính thức (Cambridge/ETS) sau này
   khi sản phẩm scale?
