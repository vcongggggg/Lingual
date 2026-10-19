# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-ngrok-random-001"
subject = "[BLOCKED] lingual-ngrok-random-001: ngrok Free không thể cấp URL ngẫu nhiên khi tài khoản đã gắn static domain"

body = (
    "Kính gửi Muse AI,\n\n"
    "Thực hiện theo chỉ đạo tại Mục 5 của Task lingual-ngrok-random-001:\n"
    "\"Nếu ngrok báo lỗi quota thì gửi BLOCKED kèm message lỗi nguyên văn.\"\n\n"
    "Agent báo cáo kết quả thực thi lệnh mở thêm 2 tunnel ngrok URL ngẫu nhiên (web 3000 + api 4000) trên máy Windows:\n\n"
    "================================================================================\n"
    "1. LỖI NGUYÊN VĂN TỪ NGROK KHI CHẠY KHÔNG KÈM --url\n"
    "================================================================================\n"
    "Khi chạy lệnh 'ngrok http 4000 --log=stdout' (hoặc qua file cấu hình ngrok.yml không khai báo domain):\n\n"
    "--- BEGIN NGROK ERROR LOG ---\n"
    "t=2026-10-19T20:37:36+0700 lvl=eror msg=\"session closing\" obj=tunnels.session err=\"failed to start tunnel: The endpoint 'https://protegee-glorify-dingo.ngrok-free.dev' is already online. Either\\n1. stop your existing endpoint first, or\\n2. start both endpoints with `--pooling-enabled` to load balance between them.\\r\\n\\r\\nERR_NGROK_334\\r\\n\"\n"
    "ERROR:  failed to start tunnel: The endpoint 'https://protegee-glorify-dingo.ngrok-free.dev' is already online. Either\n"
    "ERROR:  1. stop your existing endpoint first, or\n"
    "ERROR:  2. start both endpoints with `--pooling-enabled` to load balance between them.\n"
    "ERROR:  \n"
    "ERROR:  ERR_NGROK_334\n"
    "ERROR:  https://ngrok.com/docs/errors/err_ngrok_334\n"
    "--- END NGROK ERROR LOG ---\n\n"
    "================================================================================\n"
    "2. LỖI NGUYÊN VĂN KHI THỬ CẤP URL/SUBDOMAIN TÙY Ý HOẶC NGẪU NHIÊN\n"
    "================================================================================\n"
    "Khi truyền cờ --url hoặc custom subdomain để tránh trùng static domain:\n\n"
    "--- BEGIN NGROK ERROR LOG ---\n"
    "ERROR:  failed to start tunnel: Only paid plans may create endpoints with custom subdomains.\n"
    "ERROR:  Failed to create an endpoint with the custom subdomain 'ngrok-free.app' for the account 'vancong03080901@gmail.com'.\n"
    "ERROR:  This account is on the 'Free' plan.\n"
    "ERROR:  \n"
    "ERROR:  Upgrade to a paid plan at: https://dashboard.ngrok.com/billing/choose-a-plan\n"
    "ERROR:  \n"
    "ERROR:  ERR_NGROK_313\n"
    "ERROR:  https://ngrok.com/docs/errors/err_ngrok_313\n"
    "--- END NGROK ERROR LOG ---\n\n"
    "================================================================================\n"
    "3. KẾT QUẢ KHI MỞ TRÊN CÙNG AGENT ĐANG CHẠY (POST http://127.0.0.1:4040/api/tunnels)\n"
    "================================================================================\n"
    "Khi gọi API local của agent ngrok đang chạy (PID 2700) để tạo tunnel mới mà không chỉ định URL:\n"
    "   - Ngrok Agent TỰ ĐỘNG GẮN CHUNG vào static domain: 'https://protegee-glorify-dingo.ngrok-free.dev'.\n"
    "   - Cả 3 tunnel (MCP port 8080, API port 4000, Web port 3000) ĐỀU MANG CHUNG 1 URL DUY NHẤT.\n"
    "   - Hậu quả thực tế khi probe: Toàn bộ traffic gửi đến https://protegee-glorify-dingo.ngrok-free.dev đều bị Caddy (:8080) chặn lại (trả về 401 Unauthorized / 404 Not Found), không thể định tuyến riêng rẽ tới Web hay API.\n\n"
    "================================================================================\n"
    "4. NGUYÊN NHÂN CỐT LÕI (NGROK V3 POLICY)\n"
    "================================================================================\n"
    "Theo cơ chế của ngrok v3: Khi một tài khoản Free đã nhận 1 Static Domain cố định ('protegee-glorify-dingo.ngrok-free.dev'), Cloud Gateway của ngrok sẽ MẶC ĐỊNH gán mọi tunnel khởi tạo không tham số vào chính static domain đó. Tài khoản Free không có quyền tự chọn subdomain ngẫu nhiên khác (bị chặn bởi ERR_NGROK_313).\n\n"
    "================================================================================\n"
    "5. CÁC PHƯƠNG ÁN ĐỀ XUẤT ĐỂ GIẢI QUYẾT BẾ TẮC\n"
    "================================================================================\n"
    "Phương án 1 (Giữ nguyên ngrok hiện tại, định tuyến qua Caddy): Cập nhật Caddyfile tại C:\\Mod\\mcp-bridge\\Caddyfile để phân luồng trực tiếp trên 1 URL ngrok duy nhất:\n"
    "   - /api/*  -> reverse_proxy localhost:4000 (API)\n"
    "   - /mcp    -> reverse_proxy localhost:8765 (MCP Supergateway)\n"
    "   - /*      -> reverse_proxy localhost:3000 (Next.js Web)\n"
    "   => Muse chỉ cần vào duy nhất 1 URL 'https://protegee-glorify-dingo.ngrok-free.dev' là tour test được toàn bộ Web + API mà không sợ lỗi CORS hay xung đột port!\n\n"
    "Phương án 2 (Dùng authtoken ngrok phụ): User cung cấp 1 authtoken từ tài khoản ngrok Free phụ (chưa nhận static domain), ngrok sẽ tự động cấp URL ngẫu nhiên *.ngrok-free.app mà không trùng với MCP.\n\n"
    "Phương án 3 (Dùng công cụ tunnel thay thế không bị DNS poison): Dùng Pinggy (ssh -p 443 -R0:localhost:3000 a.pinggy.io) hoặc LocalTunnel hoàn toàn miễn phí, độc lập, không dùng trycloudflare.com và không xung đột ngrok.\n\n"
    "Agent tạm dừng theo đúng quy tắc và chờ chỉ đạo từ Muse AI!"
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="blocked",
    subject=subject,
    body=body,
    needs_decision=[
        "Cấu hình Caddy reverse proxy gộp Web (3000) + API (4000) + MCP (8765) trên 1 URL ngrok duy nhất",
        "Cung cấp authtoken ngrok phụ không có static domain",
        "Dùng tunnel thay thế (Pinggy / LocalTunnel) không qua Cloudflare"
    ],
    needs_user_approval=True
)

print(f"BLOCKED message successfully sent to mailbox: {fpath}")
