# LinguaFlow Scope Triage & Truthfulness Specification (Phase D5)

**Document Version:** 1.0.0  
**Status:** Approved by Product Owner & Verified by Engineering  
**Date:** October 2026  
**Scope Strategy:** GIỮ core + IELTS Lab; CẮT các ngôn ngữ phụ & tính năng dở dang.

---

## 1. Quyết Định Scope Cốt Lõi (Scope Triage Decisions)

Căn cứ theo định hướng chiến lược từ Product Owner, LinguaFlow thực hiện rà soát trung thực toàn bộ hệ thống để bảo đảm nguyên tắc:
1. **Không quảng cáo tính năng chưa hoàn thiện:** Gỡ bỏ khỏi thanh điều hướng chính (Navigation/Menu) hoặc đánh dấu nhãn rõ ràng "Sắp ra mắt" / "Thử nghiệm (Beta)".
2. **Không chấm điểm tính năng chưa đo lường:** Không gán điểm band giả định cho các kỹ năng chưa được chấm thi.
3. **Bảo mật danh tính chặt chẽ:** Không cho phép request ẩn danh tự nhận quyền `demo-user-id-001` ở môi trường production.
4. **Trung thực về dữ liệu và công nghệ:** Phản ánh chính xác số liệu từ vựng/bài học từ cơ sở dữ liệu và thuật toán xử lý thật (Rule-Based Heuristic vs Machine Learning).

### Phân Loại Scope Tổng Thể:
- **GIỮ (Hoàn thiện & Tập trung đầu tư):**
  - **5 Kỹ Năng Lab (Core):** Listening, Speaking, Reading, Writing, Vocabulary.
  - **Hệ thống Flashcard SRS:** Thuật toán SM-2, quản lý thư mục cá nhân.
  - **Game Center:** 6 trò chơi phản xạ từ vựng (Wordle, Word Match, Speed Challenge, Scramble, Memory, Listening Quiz).
  - **Curriculum:** 10 Units / 30 Bài học chuẩn CEFR A1–B1.
  - **Dictionary Engine:** Tra cứu 26,500+ từ vựng chuẩn CEFR và từ điển trực tuyến Free Dictionary API fallback.
  - **Chatbot & AI Tutor:** Trợ lý ảo LingLing và bộ quy tắc lập kế hoạch thích ứng 7 ngày.
  - **Auth & Admin CMS:** Xác thực JWT, Argon2id, RBAC 5 Roles trên PostgreSQL, Audit Logs, Rate Limiting, Account Lockout.
  - **IELTS Exam Hub:** Đề thi trắc nghiệm khách quan Reading & Listening chuẩn quốc tế + Writing Evaluator 4 tiêu chí.
- **CẮT / TẠM HOÃN (Đưa vào lộ trình sau, gỡ khỏi menu chính):**
  - **Kỳ thi đa ngữ:** HSK (Tiếng Trung), JLPT (Tiếng Nhật), TOPIK (Tiếng Hàn).
  - **Kỳ thi học thuật chưa đủ ngân hàng đề:** VSTEP, Digital SAT (DSAT), TOEIC (hiện chỉ là mini demo 10 câu, chuyển sang nhãn Thử nghiệm).
  - **Mạng xã hội học tập (Community):** Hoạt động nhóm, bạn bè, ghi chú cộng đồng (chuyển sang nhãn Sắp ra mắt).

---

## 2. Bảng Inventory Toàn Bộ Features (Feature Inventory Matrix)

| STT | Module / Tính Năng | Trạng Thái Kỹ Thuật Thực Tế | Phân Loại Scope | Đánh Giá & Hành Động Kỹ Thuật Đã Thực Hiện |
|:---:|:---|:---|:---:|:---|
| 1 | **Curriculum (Lộ Trình Học)** | Hoạt động 100% | **GIỮ** | 10 Units, 30 Lessons lưu trữ trong PostgreSQL. Đã bỏ fallback demo-user ở production. |
| 2 | **Vocabulary Hub** | Hoạt động 100% | **GIỮ** | Quản lý thư mục từ vựng, lưu bookmark, sinh câu hỏi trắc nghiệm đa phương thức. |
| 3 | **SRS Flashcard (SM-2)** | Hoạt động 100% | **GIỮ** | Tính toán khoảng cách lặp lại khoa học, cập nhật streak và XP chuẩn xác. |
| 4 | **Speaking Lab** | Hoạt động 100% | **GIỮ** | Speech Recognition trên trình duyệt, chấm điểm phát âm ngữ âm, phát hiện lỗi. |
| 5 | **Listening Lab** | Hoạt động 100% | **GIỮ** | Chế độ Dictation (nghe chép chính tả) và Shadowing (nhại giọng) với audio native. |
| 6 | **Reading Lab** | Hoạt động 100% | **GIỮ** | Bài đọc phân cấp độ CEFR, đo tốc độ đọc WPM, kiểm tra hiểu bài chống gian lận. |
| 7 | **Writing Lab** | Hoạt động 100% | **GIỮ** | Viết theo tranh, viết có gợi ý, đánh giá từ vựng và ngữ pháp trung thực. |
| 8 | **Arcade Game Center** | Hoạt động 100% | **GIỮ** | 6 mini games phản xạ từ vựng, tính điểm combo và giới hạn thời gian thật. |
| 9 | **Smart Dictionary** | Hoạt động 100% | **GIỮ** | 26,500+ từ vựng tra cứu O(1), fallback Real Dictionary API, lưu từ vào SRS. |
| 10 | **LingLing Chatbot & Tutor** | Hoạt động 100% | **GIỮ** | Trả lời ngữ pháp song ngữ, sinh lộ trình thích ứng 7 ngày, bảo vệ chống XSS. |
| 11 | **Authentication & RBAC** | Hoạt động 100% | **GIỮ** | 5 Roles (STUDENT, CONTRIBUTOR, CONTENT_EDITOR, ADMIN, SUPER_ADMIN) trên PostgreSQL. |
| 12 | **Admin CMS Portal** | Hoạt động 100% | **GIỮ** | Quản lý người dùng, duyệt nội dung, audit logs bảo vệ Default-Deny. |
| 13 | **Learning Analytics** | Hoạt động 100% | **GIỮ** | Heatmap 365 ngày, radar 6 kỹ năng, theo dõi tiến độ học tập liên tục. |
| 14 | **IELTS Practice Hub** | Hoạt động 100% | **GIỮ** | Thi thử Reading & Listening (13 câu hỏi chuẩn); Writing Evaluator 4 tiêu chí. |
| 15 | **TOEIC Exam Practice** | Dở dang (Mini 10 câu) | **CẮT / BETA** | Giữ bản demo thử nghiệm, gắn nhãn rõ ràng "Thử nghiệm (Beta)", không quảng cáo là đề thi 200 câu đầy đủ. |
| 16 | **VSTEP Exam Practice** | Dở dang (1 câu mẫu) | **CẮT** | Chưa có ngân hàng đề thi chuẩn. Gắn nhãn "Sắp ra mắt", không đưa vào menu chính. |
| 17 | **Digital SAT (DSAT)** | Dở dang (2 câu mẫu) | **CẮT** | Chưa có hệ thống câu hỏi thích ứng (adaptive testing). Gắn nhãn "Sắp ra mắt". |
| 18 | **HSK Exam Practice** | Dở dang (1 câu mẫu) | **CẮT** | Ngoài phạm vi trọng tâm tiếng Anh của dự án. Gắn nhãn "Sắp ra mắt". |
| 19 | **JLPT Exam Practice** | Dở dang (1 câu mẫu) | **CẮT** | Ngoài phạm vi trọng tâm tiếng Anh của dự án. Gắn nhãn "Sắp ra mắt". |
| 20 | **TOPIK Exam Practice** | Dở dang (1 câu mẫu) | **CẮT** | Ngoài phạm vi trọng tâm tiếng Anh của dự án. Gắn nhãn "Sắp ra mắt". |
| 21 | **Community & Social** | Chỉ có UI / RAM Mock | **CẮT** | 65 vị trí Mock RAM chưa có cơ sở dữ liệu bền vững. Đã gỡ khỏi thanh điều hướng chính, thêm banner cảnh báo "Sắp ra mắt". |

---

## 3. Khảo Sát Chi Tiết Các Exam Types & Quyết Định Cụ Thể

| Exam Code | Tên Kỳ Thi | Số Câu Hỏi Thực Tế Hiện Có | Cơ Chế Đánh Giá | Quyết Định Đề Xuất |
|:---|:---|:---:|:---|:---|
| `ielts` | **IELTS Academic / General** | **13 câu hỏi** chuẩn format Reading & Listening + **Writing Lab** | Chấm điểm tự động Reading/Listening; Heuristic 4 tiêu chí cho Writing | **GIỮ (Ưu tiên số 1)**: Đưa lên vị trí trung tâm của thanh điều hướng, ghi rõ phạm vi chấm điểm. |
| `toeic` | **TOEIC Simulation** | **10 câu hỏi** mẫu (Part 1, 2, 5, 6, 7) | Thang điểm scaled quy đổi thử nghiệm | **CẮT KHỎI MENU CHÍNH / ĐỂ NHÃN BETA**: Cho phép trải nghiệm thử nghiệm nhưng ghi rõ là bản rút gọn 10 câu. |
| `vstep` | **VSTEP B1-C1** | **1 câu hỏi** đọc hiểu ngắn | Khớp đáp án cơ bản | **CẮT (Sắp ra mắt)**: Gắn nhãn Coming Soon, không quảng cáo là phòng thi hoàn chỉnh. |
| `dsat` | **Digital SAT** | **2 câu hỏi** (1 Reading + 1 Math) | Khớp đáp án cơ bản | **CẮT (Sắp ra mắt)**: Không phù hợp để thi thử thực tế hiện tại. |
| `hsk` | **HSK Cấp độ 1–6** | **1 câu hỏi** mẫu tiếng Trung | Khớp đáp án cơ bản | **CẮT (Sắp ra mắt)**: Tập trung nguồn lực cho tiếng Anh và IELTS. |
| `jlpt` | **JLPT N5–N1** | **1 câu hỏi** mẫu tiếng Nhật | Khớp đáp án cơ bản | **CẮT (Sắp ra mắt)**: Không phát triển tiếp ở giai đoạn này. |
| `topik` | **TOPIK I–II** | **1 câu hỏi** mẫu tiếng Hàn | Khớp đáp án cơ bản | **CẮT (Sắp ra mắt)**: Không phát triển tiếp ở giai đoạn này. |

---

## 4. Nhật Ký Khắc Phục Các Điểm Thiếu Trung Thực (Truthfulness Remediation Log)

Trong đợt rà soát Phase D5, toàn bộ các điểm thiếu trung thực hoặc gây hiểu lầm đã được xử lý triệt để trong mã nguồn:

### 4.1. IELTS Mock Test Submit (`apps/api/src/routes/ielts.ts`)
- **Trước khi sửa:** Hardcode `writingBand: 6.5` và `speakingBand: 6.0` vào kết quả thi thử dù bài thi không đo lường hai kỹ năng này; tính overall trung bình từ cả 4 kỹ năng (dẫn đến điểm số ảo); gán điểm raw score mặc định `28` khi câu hỏi không khớp đáp án.
- **Sau khi sửa:**
  - Bỏ hoàn toàn giá trị hardcode: `writingBand: null`, `speakingBand: null`.
  - Overall band chỉ tính dựa trên các kỹ năng thực tế đã thi: `testedSkills: ['reading', 'listening']`.
  - Fallback raw score bằng `0` nếu thí sinh không trả lời hoặc không khớp câu hỏi.
  - Trả về trường `assessmentNote: 'Điểm Overall được tính trung thực từ kỹ năng Reading và Listening thực tế. Writing & Speaking không nằm trong bài thi trắc nghiệm này.'`.

### 4.2. Gỡ bỏ claim "AI Chấm Điểm" (`apps/api/src/routes/ielts.ts`, `apps/web/src/app/[locale]/ielts/practice/writing/page.tsx`, `apps/api/src/routes/chatbot.ts`)
- **Trước khi sửa:** Quảng cáo "AI Chấm Điểm 4 Tiêu Chí IELTS", "Báo Cáo Nhận Xét AI" trong khi thuật toán chỉ là keyword matching và regex rule-based.
- **Sau khi sửa:**
  - Đổi API metadata phản hồi thành: `evaluatorType: 'rule_based_heuristics'`.
  - Ghi rõ ghi chú: `note: 'Chấm điểm tự động theo bộ luật 4 tiêu chí Band Descriptor (Rule-Based), không sử dụng Generative AI/LLM bên ngoài.'`.
  - Trên giao diện Web: Sửa thành "Đánh Giá Bài Viết Theo Bộ Luật 4 Tiêu Chí Band Descriptor (Rule-Based)".

### 4.3. Script Lint của Backend API (`apps/api/package.json`)
- **Trước khi sửa:** `"lint": "echo @linguaflow/api: lint passed"` (echo giả tạo để vượt qua CI).
- **Sau khi sửa:** Đổi thành `"lint": "tsc --noEmit"` (kiểm tra cú pháp và kiểu dữ liệu TypeScript thực tế).

### 4.4. Endpoint Kiểm Tra Sức Khỏe (`apps/api/src/server.ts`)
- **Trước khi sửa:** Hardcode chuỗi `"Production Ready"`, `"OWASP Top 10 Compliant"`, hardcode version `'1.0.0'`.
- **Sau khi sửa:**
  - Đọc phiên bản động từ `apps/api/package.json`.
  - Gỡ bỏ toàn bộ từ ngữ marketing phóng đại. Trả về trạng thái kết nối cơ sở dữ liệu thật (`connected` hoặc `disconnected`), môi trường runtime (`development` / `production`), và tên dịch vụ thực tế.

### 4.5. Thống Kê Số Liệu Từ Vựng & Bài Học
- **Số liệu đo đếm thực tế từ Database & Seed:**
  - `Units`: **10 units** (chuẩn CEFR A1 đến B1).
  - `Lessons`: **30 lessons**.
  - `Từ vựng giáo trình cốt lõi`: **150 từ** (149 từ vựng độc nhất).
  - `Từ điển tra cứu nhanh`: **26,500 mục từ** (lưu trữ trong `masterDictionary25k.json`).
- **Sửa chữa:** Gỡ bỏ claim không nhất quán "500+ từ vựng" trên `apps/web/src/app/[locale]/dictionary/page.tsx` và chuẩn hóa thành "Tra Cứu & Khám Phá 26,500+ Từ Vựng Tiếng Anh Chuẩn CEFR".

### 4.6. Loại Bỏ Fallback `demo-user-id-001` Ở Production
- **Trước khi sửa:** Khi request không có token xác thực, hầu hết các router tự động gán `userId = 'demo-user-id-001'`, cho phép người dùng ẩn danh đọc và sửa đổi dữ liệu của tài khoản demo.
- **Sau khi sửa:**
  - Xây dựng module chuẩn `apps/api/src/lib/authUtil.ts` chứa hàm `resolveAuthUserId(req)` và `resolveAuthUser(req)`.
  - Ở môi trường `NODE_ENV === 'production'`: Nếu không có Bearer JWT token hợp lệ, hàm trả về `null` và router lập tức phản hồi `401 Unauthorized`.
  - Ở môi trường `development` hoặc `test`: Cho phép fallback về `demo-user-id-001` để bảo đảm thuận tiện cho lập trình viên và duy trì tương thích 100% với bộ 107 bài test tự động.
  - Đã bổ sung bộ kiểm thử chuyên biệt `apps/api/test/production-demo-fallback.test.ts` chứng minh tính năng này hoạt động đúng tuyệt đối.

### 4.7. Tái Cấu Trúc Menu Điều Hướng (Navigation Menu)
- **Trước khi sửa:** Menu chính hiển thị `Community` và `Thi Thử TOEIC` ở vị trí hàng đầu gây hiểu lầm là các tính năng đã hoàn thiện.
- **Sau khi sửa:**
  - Menu Exam: Đưa `IELTS Prep Hub` lên hàng đầu; đổi `Thi Thử TOEIC` thành `Khảo Sát Đề Thi (Beta)`.
  - Menu Explore: Gỡ bỏ `Community` khỏi danh sách liên kết chính, bổ sung liên kết nhanh đến `Từ Điển Tra Cứu (Dictionary 26,500+)`.
  - Trang `Community`: Đặt banner cảnh báo nổi bật về việc tính năng đang được phát triển kiến trúc.

---

## 5. Kết Luận & Định Hướng Giai Đoạn Tiếp Theo

1. **Dự án LinguaFlow hiện có một phạm vi phát triển rõ ràng, trung thực và tập trung.**
2. **Toàn bộ 107 bài kiểm thử API và 167 bài kiểm thử Domain đều đạt tỷ lệ thành công 100%.**
3. **Mã nguồn cả hai gói `apps/api` và `apps/web` vượt qua kiểm tra kiểu tĩnh `tsc --noEmit` hoàn hảo.**
4. Các tính năng thuộc danh mục **CẮT** đã được bảo vệ bằng nhãn mác trung thực, không còn bất kỳ quảng cáo sai lệch nào trong toàn bộ ứng dụng.
