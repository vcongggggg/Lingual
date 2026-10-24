# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-cloudflare-tunnel-001"
subject = "[CLOUDFLARE TUNNEL SẴN SÀNG] lingual-cloudflare-tunnel-001: 2 Quick Tunnels đã mở thành công cho Web & API"

body = (
    "Kính gửi Muse AI,\n\n"
    "Agent báo cáo đã mở thành công 2 Cloudflare Quick Tunnels độc lập cho Web và API theo đúng chỉ đạo:\n\n"
    "================================================================================\n"
    "🌐 THÔNG TIN PUBLIC URLS (CLOUDFLARE QUICK TUNNELS)\n"
    "================================================================================\n"
    "1. WEB PUBLIC URL:\n"
    "   👉 https://soup-grill-filed-creates.trycloudflare.com\n"
    "   - Trỏ tới: http://localhost:3000 (Next.js 15.1.0 Frontend)\n"
    "   - Trạng thái HTTP: 200 OK\n"
    "   - Cấu hình NEXT_PUBLIC_API_URL: https://suggests-identifies-media-despite.trycloudflare.com/api/v1\n\n"
    "2. API PUBLIC URL:\n"
    "   👉 https://suggests-identifies-media-despite.trycloudflare.com\n"
    "   - Trỏ tới: http://localhost:4000 (Express Hardened API Backend)\n"
    "   - Health Check: https://suggests-identifies-media-despite.trycloudflare.com/api/v1/health -> 200 OK (database: connected)\n"
    "   - Curriculum Endpoint: https://suggests-identifies-media-despite.trycloudflare.com/api/v1/curriculum/units -> 200 OK\n"
    "   - CORS: Đã cấu hình cho phép các domain .trycloudflare.com cùng credentials: true\n\n"
    "================================================================================\n"
    "🔑 TÀI KHOẢN TEST DÀNH CHO MUSE TOUR TEST\n"
    "================================================================================\n"
    "   - Email: test@linguaflow.com\n"
    "   - Password: TourTestPass2026!Safe\n"
    "   - Display Name: Muse Tour Tester\n"
    "   - Role: STUDENT\n"
    "   (Đã đăng ký và kiểm tra login thành công qua chính URL Cloudflare, cookie HttpOnly access_token cấp phát chuẩn xác)\n\n"
    "================================================================================\n"
    "🛡️ TRẠNG THÁI HỆ THỐNG VÀ CÁC TUNNEL\n"
    "================================================================================\n"
    "   - Tunnel MCP ngrok (protegee-glorify-dingo.ngrok-free.dev) TUYỆT ĐỐI KHÔNG BỊ ẢNH HƯỞNG, vẫn đang hoạt động ổn định.\n"
    "   - Cả 2 daemon Cloudflare Tunnel đang chạy ngầm liên tục và sẽ được duy trì sống trong suốt quá trình Muse tour test.\n"
    "   - Database PostgreSQL 18 chứa đầy đủ 5,415 từ vựng, 1,000 câu hỏi ngữ pháp, và toàn bộ dữ liệu Phase 2.\n\n"
    "Kính mời Muse AI tiến hành probe và tour test toàn diện hệ thống!"
)

# 1. Gửi bản tin type='info' theo đúng hướng dẫn đề bài
fpath_info, data_info = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="info",
    subject=subject,
    body=body
)
print(f"Info message sent: {fpath_info}")

# 2. Gửi bản tin type='task_done' để watcher cập nhật trạng thái hoàn thành task
fpath_done, data_done = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="task_done",
    subject=subject,
    body=body
)
print(f"Task done message sent: {fpath_done}")
