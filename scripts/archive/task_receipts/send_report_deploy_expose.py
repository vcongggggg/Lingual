# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-deploy-expose-001"
subject = "[BÁO CÁO GIỚI HẠN NGROK] lingual-deploy-expose-001: Ngrok Free bị giới hạn 1 tunnel đồng thời"

body = (
    "Kính gửi Muse AI,\n\n"
    "Thực hiện theo chỉ dẫn tại Bước 2 của Task lingual-deploy-expose-001:\n"
    "\"Lưu ý: máy đang chạy 1 tunnel ngrok cho MCP (static domain). Thêm 2 tunnel nữa. Nếu ngrok free giới hạn số tunnel đồng thời, BÁO LẠI qua mailbox thay vì tự đoán cách khác.\"\n\n"
    "Agent báo cáo kết quả kiểm tra thực tế trên máy Windows:\n\n"
    "1. HIỆN TRẠNG NGROK TRÊN HỆ THỐNG:\n"
    "   - Tài khoản ngrok hiện tại (vancong03080901@gmail.com) thuộc gói FREE PLAN.\n"
    "   - Gói Free chỉ cho phép duy nhất 1 static domain/endpoint: 'https://protegee-glorify-dingo.ngrok-free.dev'.\n"
    "   - Endpoint này HIỆN ĐANG ĐƯỢC SỬ DỤNG liên tục bởi dịch vụ MCP Bridge (C:\\Mod\\mcp-bridge\\ngrok.exe, PID 2700, forward tới localhost:8080).\n"
    "   - Khi chạy lệnh tạo thêm tunnel mới bằng ngrok.exe:\n"
    "       + 'ngrok http 4000': Ngrok tự động bind vào static domain mặc định -> Bị lỗi 'ERR_NGROK_334: The endpoint https://protegee-glorify-dingo.ngrok-free.dev is already online.'\n"
    "       + 'ngrok http 4000 --url ...': Bị lỗi 'ERR_NGROK_313: Only paid plans may create endpoints with custom subdomains. This account is on the Free plan.'\n"
    "   => KẾT LUẬN: ngrok Free trên máy Windows KHÔNG THỂ mở đồng thời 2-3 tunnel trên các URL độc lập.\n\n"
    "2. TRẠNG THÁI APP LOCAL:\n"
    "   - Nhánh main đã merge từ develop, CI GitHub Actions (Run ID: 39251438857) XANH 100%.\n"
    "   - PostgreSQL 18 đang chạy native tại port 5432 với toàn bộ 5,415 từ vựng và Phase 2 dataset.\n"
    "   - Docker Desktop Service (com.docker.service) đang Stopped (cần quyền Administrator để start service Windows), nhưng hệ thống có thể chạy trực tiếp production-like qua pnpm/node (API port 4000, Web port 3000).\n\n"
    "3. CÁC PHƯƠNG ÁN XIN Ý KIẾN CHỈ ĐẠO TỪ MUSE:\n"
    "   - Phương án 1 (Khuyên dùng nếu cần giữ ngrok): Tạm dừng MCP Bridge (ngrok PID 2700), dùng một reverse proxy (Caddy/Nginx) map port 3000 (web) và port 4000 (api /api/v1) chung vào 1 port duy nhất, sau đó chạy 1 tunnel ngrok duy nhất với domain 'protegee-glorify-dingo.ngrok-free.dev'. Test xong sẽ khôi phục MCP Bridge.\n"
    "   - Phương án 2 (Dùng Cloudflare Tunnels): Máy đã có sẵn 'C:\\Mod\\mcp-bridge\\cloudflared.exe'. Cloudflare Quick Tunnels hoàn toàn miễn phí, không giới hạn số lượng tunnel đồng thời -> Mở ngay 2 tunnel độc lập (1 cho API port 4000, 1 cho Web port 3000) mà KHÔNG làm ảnh hưởng tới MCP Bridge ngrok.\n"
    "   - Phương án 3: Cung cấp authtoken ngrok mới (hoặc tài khoản paid) hỗ trợ đa tunnel đồng thời.\n\n"
    "Agent chờ chỉ đạo tiếp theo từ Muse qua mailbox để thực thi ngay!"
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="info",
    subject=subject,
    body=body,
    needs_decision=[
        "Dùng Cloudflare Quick Tunnel (cloudflared) mở 2 tunnel độc lập cho API & Web",
        "Tạm dừng MCP ngrok, dùng reverse proxy gộp Web+API vào 1 static ngrok domain duy nhất",
        "Cung cấp token/ngrok plan mới hỗ trợ đa tunnel"
    ]
)

print(f"Report message successfully sent to mailbox: {fpath}")
