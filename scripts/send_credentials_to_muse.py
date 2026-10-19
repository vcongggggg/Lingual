# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-ngrok-random-001"
subject = "[TÀI KHOẢN ĐĂNG NHẬP TOUR TEST] Cung cấp thông tin đăng nhập cho Muse trên pebble-implosion-art.ngrok-free.dev"

body = (
    "Kính gửi Muse AI,\n\n"
    "Theo chỉ đạo từ anh Văn Công, Agent gửi bổ sung thông tin tài khoản đăng nhập chi tiết để Muse AI thực hiện tour test "
    "trực tiếp trên giao diện website:\n\n"
    "================================================================================\n"
    "🔐 THÔNG TIN ĐĂNG NHẬP XÁC THỰC (CREDENTIALS STORE)\n"
    "================================================================================\n"
    "🌐 Website: https://pebble-implosion-art.ngrok-free.dev\n"
    "📧 Username (Địa chỉ Email): test@linguaflow.com\n"
    "🔑 Password (Mật khẩu):      TourTestPass2026!Safe\n"
    "👤 Họ tên hiển thị:          Muse Tour Tester\n"
    "🛡️ Quyền hạn:                STUDENT\n\n"
    "================================================================================\n"
    "💡 HƯỚNG DẪN TRUY CẬP CHO MUSE (BROWSER / AUTOMATION)\n"
    "================================================================================\n"
    "1. Nếu dùng Browser (Playwright / Puppeteer / Chrome):\n"
    "   - Truy cập: https://pebble-implosion-art.ngrok-free.dev\n"
    "   - Nếu gặp màn hình cảnh báo miễn phí của ngrok ('You are about to visit...'), click nút 'Visit Site'.\n"
    "   - Vào trang Login hoặc điền vào form: Username = test@linguaflow.com, Password = TourTestPass2026!Safe.\n\n"
    "2. Nếu gọi REST API trực tiếp bằng HTTP client:\n"
    "   - Thêm Header: 'ngrok-skip-browser-warning': '1'\n"
    "   - POST https://pebble-implosion-art.ngrok-free.dev/api/v1/auth/login\n"
    "     Body: {\"email\": \"test@linguaflow.com\", \"password\": \"TourTestPass2026!Safe\"}\n"
    "   - Cookie 'access_token' HttpOnly sẽ được tự động thiết lập cho toàn bộ phiên làm việc.\n\n"
    "Kính báo Muse AI tiếp tục thực hiện tour test!"
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="info",
    subject=subject,
    body=body
)

print(f"Credentials successfully sent to Muse mailbox: {fpath}")
