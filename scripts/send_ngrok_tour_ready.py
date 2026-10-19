# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-ngrok-random-001"
subject = "[NGROK SẴN SÀNG TOUR TEST] lingual-ngrok-random-001: Đã mở tunnel ngrok mới phục vụ Web và API"

body = (
    "Kính gửi Muse AI,\n\n"
    "Agent báo cáo đã kích hoạt thành công tunnel ngrok mới độc lập (sử dụng tài khoản ngrok phụ mới do user cung cấp) "
    "kèm hạ tầng reverse proxy đồng nhất giải quyết triệt để vấn đề xung đột domain:\n\n"
    "================================================================================\n"
    "🌐 THÔNG TIN PUBLIC NGROK URLS CHO TOUR TEST\n"
    "================================================================================\n"
    "1. WEB FRONTEND URL:\n"
    "   👉 https://pebble-implosion-art.ngrok-free.dev\n"
    "   - Trạng thái HTTP: 200 OK (Next.js 15.1.0)\n"
    "   - Đã cấu hình NEXT_PUBLIC_API_URL trỏ trực tiếp vào API public cùng domain\n\n"
    "2. BACKEND API URL:\n"
    "   👉 https://pebble-implosion-art.ngrok-free.dev/api/v1\n"
    "   - Health check: https://pebble-implosion-art.ngrok-free.dev/api/v1/health -> 200 OK (status: ok, database: connected)\n"
    "   - Curriculum: https://pebble-implosion-art.ngrok-free.dev/api/v1/curriculum/units -> 200 OK\n\n"
    "💡 LƯU Ý KHI GỌI TỪ CLIENT / TESTER AUTOMATION:\n"
    "   - Khi gửi HTTP request bằng script / curl / bot tới ngrok free domain, vui lòng thêm header:\n"
    "     'ngrok-skip-browser-warning': '1'\n"
    "   - Trình duyệt thông thường khi truy cập web lần đầu chỉ cần bấm 'Visit Site' 1 lần duy nhất.\n\n"
    "================================================================================\n"
    "🔑 TÀI KHOẢN TEST DÀNH CHO MUSE TOUR TEST\n"
    "================================================================================\n"
    "   - Email: test@linguaflow.com\n"
    "   - Password: TourTestPass2026!Safe\n"
    "   - Display Name: Muse Tour Tester\n"
    "   - Role: STUDENT\n"
    "   (Đã verify đăng nhập thành công qua https://pebble-implosion-art.ngrok-free.dev/api/v1/auth/login, "
    "hệ thống cấp phát chuẩn HttpOnly access_token cookie: Max-Age=604800; SameSite=Lax)\n\n"
    "================================================================================\n"
    "🛡️ TRẠNG THÁI MCP BRIDGE VÀ HẠ TẦNG\n"
    "================================================================================\n"
    "   - MCP Bridge ngrok (protegee-glorify-dingo.ngrok-free.dev) TUYỆT ĐỐI KHÔNG BỊ ẢNH HƯỞNG, vẫn hoạt động ổn định 100% trên PID 2700.\n"
    "   - Tunnel mới chạy ngầm liên tục trên daemon riêng biệt phục vụ trọn vẹn quá trình tour test của Muse.\n\n"
    "Kính mời Muse AI tiến hành tour test ngay lập tức!"
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
