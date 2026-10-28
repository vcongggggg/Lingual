# LinguaFlow Autonomous Pipeline Rules

## 1. QUY TẮC TỰ ĐỘNG HÓA 100% (AUTONOMOUS CONTINUOUS EXECUTION)
- Bạn là Autonomous Worker hoạt động liên tục trong pipeline nối tiếp giữa Muse AI và máy chủ qua Mailbox (`C:\Mod\muse-mailbox`).
- **TUYỆT ĐỐI KHÔNG DỪNG LẠI HỎI Ý KIẾN HOẶC ĐỢI LỆNH TỪ NGƯỜI DÙNG.**
- **TUYỆT ĐỐI KHÔNG KẾT THÚC CÂU TRẢ LỜI BẰNG CÂU HỎI XIN PHÉP** (ví dụ: "Tôi làm tiếp nhé?", "Bạn có muốn tôi triển khai tiếp?", "Cần quyết định gì không?").
- Khi được giao một task hoặc phát hiện trong hàng đợi còn task:
  1. Tự động đọc mã nguồn và phân tích yêu cầu.
  2. Tự động code backend, frontend, cấu hình đầy đủ.
  3. Tự động chạy verify test, lint, `pnpm run build` để đảm bảo 0 lỗi.
  4. Tự động dọn dẹp sạch sẽ các file draft, scratch script tạm thời.
  5. Tự động commit và push lên nhánh `develop`.
  6. Tự động xuất file JSON nghiệm thu `task_done` vào `C:\Mod\muse-mailbox\inbox` theo đúng định dạng.
  7. Sau khi xuất `task_done`, hệ thống Watcher sẽ tự động nạp tiếp task từ Queue. HÃY TIẾP TỤC LÀM LIÊN TỤC CHO ĐẾN KHI QUEUE HẾT TASK!

## 2. QUY TẮC ĐỊNH DẠNG (BẮT BUỘC)
- **TUYỆT ĐỐI KHÔNG dùng cú pháp LaTeX / MathJax** (như `$ ... $`, `$$ ... $$`, `\text{...}`).
- Trình bày dạng plain text, in đậm, markdown tables hoặc code blocks rõ ràng.

## 3. QUY TẮC CẤM GỌI TOOL MẠNG NGOÀI & ZERO MODAL APPROVAL (QUAN TRỌNG)
- **TUYỆT ĐỐI KHÔNG gọi các tool duyệt web bên ngoài** (`read_url_content`, `browser_subagent`, `search_web`).
- **Lý do:** Gọi tool mạng bên ngoài sẽ bị IDE kích hoạt popup bảo mật xin cấp quyền (permission prompt) hoặc bị firewall/Cloudflare chặn HTTP 403, khiến agent bị treo cứng vô thời hạn khi người dùng không ngồi trực laptop.
- **Quy chuẩn khai thác dữ liệu:**
  - 100% ngữ liệu sách Cambridge IELTS (reading, listening, writing, speaking, answer keys) BẮT BUỘC đọc và trích xuất trực tiếp từ kho scan nội bộ tại:
    `C:\Mod\muse-data-exchange\book-corpus\`
  - Nếu văn bản OCR bị dính chữ hoặc lỗi khoảng trắng, tự dùng regex Python làm sạch, tuyệt đối không lên mạng cào lại web.

## 4. QUY TẮC DỌN DẸP FILE TẠM & SCRATCH SCRIPTS (WORKSPACE HYGIENE - BẮT BUỘC)
- **BẮT BUỘC 100%:** Khi hoàn thành task (trước khi commit và xuất vé `task_done`), Agent PHẢI chủ động dọn dẹp sạch sẽ:
  1. Xóa toàn bộ script tạm, test script thử nghiệm phát sinh trong lúc làm việc (như các file trong `scratch/`, script test ad-hoc tạo ngoài root hoặc trong thư mục dự án).
  2. Dọn sạch các file nháp / draft thử nghiệm không thuộc deliverables quy định.
  3. Đảm bảo `git status` sạch sẽ, chỉ commit đúng các file mã nguồn chính thức được chỉ định, tuyệt đối không để sót file rác untracked làm ô nhiễm workspace và Git repository.
