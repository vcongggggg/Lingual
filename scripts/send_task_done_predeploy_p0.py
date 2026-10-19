# -*- coding: utf-8 -*-
import sys
import json
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-predeploy-p0-001"
subject = "[TASK DONE] lingual-predeploy-p0-001: Hoàn tất 100% Pre-deploy P0 (Bảo mật, Cấu hình, Merge main & CI xanh)"

body = (
    "Kính gửi Muse AI,\n\n"
    "Agent báo cáo đã hoàn thành 100% tất cả các hạng mục của task lingual-predeploy-p0-001, "
    "đạt toàn bộ Definition of Done (DoD) được giao:\n\n"
    "1. MỤC 1 — ĐƯA SECRET RA KHỎI GIT + ROTATE (P0 CAO NHẤT):\n"
    "   - docker-compose.yml: Chỉ còn dạng ${...} (POSTGRES_PASSWORD, JWT_SECRET, FRONTEND_URL, NEXT_PUBLIC_API_URL). Không còn secret thật nào.\n"
    "   - .env.example: Cập nhật đầy đủ POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, DATABASE_URL, JWT_SECRET, PORT, NODE_ENV, FRONTEND_URL, ALLOWED_ORIGINS, NEXT_PUBLIC_API_URL.\n"
    "   - .gitignore: Đã có .env, .env.*, !.env.example.\n"
    "   - Rotate secret: Đã sinh cryptographically POSTGRES_PASSWORD mới (32 ký tự ngẫu nhiên base64url) và JWT_SECRET mới (64 ký tự hex), cập nhật trực tiếp vào .env local và engine database. TUYỆT ĐỐI không log secret.\n"
    "   - docker compose config pass 100% không lỗi.\n"
    "   - API login thành công 200 với database PostgreSQL mới (xác thực qua scripts/test_predeploy_p0.ts).\n\n"
    "2. MỤC 2 — NEXT_PUBLIC_API_URL TRUYỀN QUA BUILD ARG:\n"
    "   - docker-compose.yml: Đã thêm args: NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:4000/api/v1} cho service web.\n"
    "   - .env.example: Đã thêm NEXT_PUBLIC_API_URL kèm ghi chú rõ ràng cho môi trường production.\n"
    "   - docker compose config: Hiển thị đúng arg.\n"
    "   - Đã build thử web với NEXT_PUBLIC_API_URL=https://api.example.com/api/v1 -> Grep trong output .next/static không còn chuỗi localhost:4000 (đã bake chính xác https://api.example.com/api/v1).\n\n"
    "3. MỤC 3 — MERGE DEVELOP -> MAIN & CI GREEN:\n"
    "   - Đã merge develop vào main bằng merge commit giữ nguyên toàn bộ history (không squash): commit 6ffdeb4.\n"
    "   - Đã push thành công lên origin/main.\n"
    "   - Kiểm tra prisma/migrations trên main: Có đủ 8/8 migrations chính thức.\n"
    "   - GitHub Actions CI Pipeline trên main (Run ID: 39247144933) đã chạy toàn bộ các bước (Prisma validate, db push, 115 unit & integration tests, typecheck, lint, build) và kết luận: SUCCESS (XANH 100%)!\n\n"
    "4. MỤC 4 — STAMP.TS: PRODUCTION KHÔNG TOKEN -> 401:\n"
    "   - Tại apps/api/src/routes/stamp.ts: Cả 4 route (GET /, POST /claim-daily-goal, POST /award, POST /redeem-writing) đã được bọc qua hàm kiểm tra getAuthUserIdOrFallback. Khi NODE_ENV === 'production', không có token sẽ trả về 401 Unauthorized; fallback demo chỉ duy trì khi NODE_ENV !== 'production'.\n"
    "   - Đã verify tự động: GET /stamps no token (prod) -> 401, with token (prod) -> 200, no token (dev) -> 200 demo fallback.\n\n"
    "5. MỤC 5 — CHỐNG XSS TRONG CHAT TUTOR:\n"
    "   - Tại apps/web/src/app/tutor/page.tsx: Đã bổ sung hàm escapeHtml chuyển đổi các ký tự &, <, >, \", ' thành HTML entities an toàn TRƯỚC khi format **bold** -> <strong>.\n"
    "   - Payload <img src=x onerror=alert(1)> được render an toàn dưới dạng text thuần, không thực thi script. Text in đậm **...** vẫn hiển thị chuẩn xác.\n\n"
    "DANH SÁCH COMMITS:\n"
    "   - 896439b: chore(deploy): extract secrets to env vars and pass NEXT_PUBLIC_API_URL via build args (Mục 1 & 2)\n"
    "   - 04caf60: fix(api): enforce 401 for unauthorized stamp requests in production mode (Mục 4)\n"
    "   - 396c907: fix(web): sanitize html entities before rendering bold markdown in tutor chat (Mục 5)\n"
    "   - f276afc: test(predeploy): add automated verification scripts for secrets rotation, stamp auth and xss\n"
    "   - 6ffdeb4: merge: integrate develop branch into main for production pre-deploy P0 (Mục 3)\n\n"
    "KẾT LUẬN: Toàn bộ 5 mục P0 đã hoàn tất xuất sắc và nhánh main đã sẵn sàng tiếp nhận Task P1 (lingual-predeploy-p1-001)!"
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="task_done",
    subject=subject,
    body=body
)

print(f"Task done message written to inbox: {fpath}")
