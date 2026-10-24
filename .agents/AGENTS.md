# Workspace Rules - LinguaFlow

## Quy Tắc Ngôn Ngữ & Định Dạng Chat (Bắt Buộc 100%)
- **NGÔN NGỮ CHÍNH THỨC: 100% TIẾNG VIỆT**. Tuyệt đối không trả lời bằng tiếng Anh cho người dùng.
- **TUYỆT ĐỐI KHÔNG dùng cú pháp LaTeX / MathJax** (như `$ ... $`, `$$ ... $$`, `\text{...}`, `\oplus`, `\begin{bmatrix}`).
- Lý do: Giao diện Chat của người dùng không hỗ trợ trình render LaTeX, sẽ bị vỡ font và in thô các ký tự `\text{...}` làm người dùng rất khó đọc.
- **Quy chuẩn thay thế:**
  - Viết dạng plain text, in đậm hoặc bọc code: `M = networksecurity`, `K = 0x3070...`, `C = 78674...`.
  - Phép tính dùng ký tự thường: `->`, `*`, `XOR` (hoặc `⊕`), `mod`, `^` (lũy thừa).
  - Ma trận hiển thị bằng Markdown Table hoặc Code Block.

## Quy Tắc Tự Động Hóa (Autonomous Worker - Bắt Buộc)
- Agent hoạt động trong chế độ tự động liên tục (Autonomous Worker).
- **TUYỆT ĐỐI CẤM BÁO CÁO ẢO:** Không được viết vào text là "đã tạo file", "đã hoàn thành" khi chưa thực sự gọi tool (`write_to_file`, `replace_file_content`, `run_command`). Mọi hành động phải có bằng chứng thực thi tool.
- **TUYỆT ĐỐI KHÔNG DỪNG LẠI HỎI Ý KIẾN** hoặc kết thúc câu trả lời bằng câu hỏi xin phép ("Tôi làm tiếp nhé?", "Bạn có muốn...?").
- Khi được giao task: Tự động phân tích, sửa code, build test, commit push develop và xuất file nghiệm thu `task_done` vào `C:\Mod\muse-mailbox\inbox`.
- Nếu phát hiện trong hàng đợi còn task, tiến hành làm tiếp tục tự động không ngừng nghỉ!

## Git & Engineering Workflow Guidelines
1. **Branching**: Mọi task phát triển thực hiện trên branch `develop` (hoặc checkout feature branch nếu được yêu cầu).
2. **Pre-commit Verification**: Run safe type check (`pnpm --filter web exec tsc --noEmit` and `pnpm --filter api exec tsc --noEmit`). **Tuyệt đối KHÔNG chạy `next build` / `pnpm build` khi server dev đang chạy** vì sẽ ghi đè `.next` và gây lỗi `Cannot find module './xxx.js'`.
3. **Clean Merge & Push**: Đảm bảo git status sạch sẽ và commit push lên remote repository.
