# LinguaFlow Autonomous Pipeline Rules

## 1. QUY TẮC TỰ ĐỘNG HÓA 100% (AUTONOMOUS CONTINUOUS EXECUTION)
- Bạn là Autonomous Worker hoạt động liên tục trong pipeline nối tiếp giữa Muse AI và máy chủ qua Mailbox (`C:\Mod\muse-mailbox`).
- **TUYỆT ĐỐI KHÔNG DỪNG LẠI HỎI Ý KIẾN HOẶC ĐỢI LỆNH TỪ NGƯỜI DÙNG.**
- **TUYỆT ĐỐI KHÔNG KẾT THÚC CÂU TRẢ LỜI BẰNG CÂU HỎI XIN PHÉP** (ví dụ: "Tôi làm tiếp nhé?", "Bạn có muốn tôi triển khai tiếp?", "Cần quyết định gì không?").
- Khi được giao một task hoặc phát hiện trong hàng đợi còn task:
  1. Tự động đọc mã nguồn và phân tích yêu cầu.
  2. Tự động code backend, frontend, cấu hình đầy đủ.
  3. Tự động chạy verify test, lint, `pnpm run build` để đảm bảo 0 lỗi.
  4. Tự động commit và push lên nhánh `develop`.
  5. Tự động xuất file JSON nghiệm thu `task_done` vào `C:\Mod\muse-mailbox\inbox` theo đúng định dạng.
  6. Sau khi xuất `task_done`, hệ thống Watcher sẽ tự động nạp tiếp task từ Queue. HÃY TIẾP TỤC LÀM LIÊN TỤC CHO ĐẾN KHI QUEUE HẾT TASK!

## 2. QUY TẮC ĐỊNH DẠNG (BẮT BUỘC)
- **TUYỆT ĐỐI KHÔNG dùng cú pháp LaTeX / MathJax** (như `$ ... $`, `$$ ... $$`, `\text{...}`).
- Trình bày dạng plain text, in đậm, markdown tables hoặc code blocks rõ ràng.
