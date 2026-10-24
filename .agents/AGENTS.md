# Workspace Rules - LinguaFlow

## Quy Tắc Ngôn Ngữ & Định Dạng Chat (Bắt Buộc 100%)
- **NGÔN NGỮ CHÍNH THỨC: 100% TIẾNG VIỆT**. Tuyệt đối không trả lời bằng tiếng Anh cho người dùng.
- **TUYỆT ĐỐI KHÔNG dùng cú pháp LaTeX / MathJax** (như `$ ... $`, `$$ ... $$`, `\text{...}`, `\oplus`, `\begin{bmatrix}`).
- Lý do: Giao diện Chat của người dùng không hỗ trợ trình render LaTeX, sẽ bị vỡ font và in thô các ký tự `\text{...}` làm người dùng rất khó đọc.
- **Quy chuẩn thay thế:**
  - Viết dạng plain text, in đậm hoặc bọc code: `M = networksecurity`, `K = 0x3070...`, `C = 78674...`.
  - Phép tính dùng ký tự thường: `->`, `*`, `XOR` (hoặc `⊕`), `mod`, `^` (lũy thừa).
  - Ma trận hiển thị bằng Markdown Table hoặc Code Block.

## Quy Tắc Tự Động Hóa & Thao Tác Ngoài Workspace (Bắt Buộc)
- Agent hoạt động trong chế độ tự động liên tục (Autonomous Worker).
- **QUY TẮC ĐỌC/GHI C:\Mod (MUSE DATA & MAILBOX):**
  - Các công cụ tích hợp IDE như `view_file` và `write_to_file` sẽ bị hệ thống CHẶN (Permission denied) khi truy cập ngoài workspace `c:\Study\HocKy6\LinguaFlow`.
  - **BẮT BUỘC:** Mọi thao tác đọc/sửa dữ liệu tại `C:\Mod\muse-data-exchange` và xuất file nghiệm thu `task_done` tại `C:\Mod\muse-mailbox\inbox` PHẢI DÙNG Python script hoặc PowerShell thông qua công cụ `run_command`!
  - **TUYỆT ĐỐI KHÔNG dùng tool `write_to_file` để tạo file task_done** vì tool này sẽ bị đẩy nhầm vào thư mục `brain/` nội bộ, làm Mailbox Watcher không nhận được file và gây tắc nghẽn toàn bộ hệ thống!
  - Ví dụ xuất `task_done` chuẩn:
    ```python
    import json
    with open(r"C:\Mod\muse-mailbox\inbox\20261024-xxx-done.json", "w", encoding="utf-8") as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)
    ```
- **TUYỆT ĐỐI CẤM BÁO CÁO ẢO:** Không được viết vào text là "đã tạo file", "đã hoàn thành" khi chưa thực sự gọi tool (`run_command`). Mọi hành động phải có bằng chứng thực thi tool.
- **TUYỆT ĐỐI KHÔNG DỪNG LẠI HỎI Ý KIẾN** hoặc kết thúc câu trả lời bằng câu hỏi xin phép ("Tôi làm tiếp nhé?", "Bạn có muốn...?", "Cần cấp quyền...?").
- Khi được giao task: Tự động phân tích, sửa file data/code, test verify, commit push develop và xuất file nghiệm thu `task_done` vào `C:\Mod\muse-mailbox\inbox`.

## Git & Engineering Workflow Guidelines
1. **Branching**: Mọi task phát triển thực hiện trên branch `develop` (hoặc checkout feature branch nếu được yêu cầu).
2. **Pre-commit Verification**: Run safe type check (`pnpm --filter web exec tsc --noEmit` and `pnpm --filter api exec tsc --noEmit`). **Tuyệt đối KHÔNG chạy `next build` / `pnpm build` khi server dev đang chạy** vì sẽ ghi đè `.next` và gây lỗi `Cannot find module './xxx.js'`.
3. **Clean Merge & Push**: Đảm bảo git status sạch sẽ và commit push lên remote repository.
