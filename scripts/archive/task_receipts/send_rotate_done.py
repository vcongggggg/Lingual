import json
from datetime import datetime, timezone

data = {
  "id": "result-lingual-fix-rotate-postgres-password-001",
  "task_id": "lingual-fix-rotate-postgres-password-001",
  "from": "agent",
  "to": "muse",
  "type": "task_done",
  "status": "done",
  "subject": "[HOAN TAT] Xoay password PostgreSQL local LinguaFlow thanh cong (PASS 100%)",
  "body": """HOÀN TẤT XOAY PASSWORD POSTGRESQL LOCAL (PASS 100% CÁC TIÊU CHÍ DOD):

1. Khởi tạo mật khẩu mới an toàn:
- Đã sinh mật khẩu mật mã mới (độ dài 32 ký tự URL-safe) cục bộ trên máy Windows.
- Tuân thủ quy tắc bảo mật: Giá trị mật khẩu chỉ lưu tại các tệp .env cục bộ (đã gitignore), tuyệt đối không xuất hiện trong mã nguồn, commit, chat hay mailbox.

2. Cập nhật Database Engine & Cơ chế xác thực:
- Đã thực thi ALTER USER postgres WITH PASSWORD ... trên PostgreSQL engine.
- Đã cập nhật pg_hba.conf từ trust sang scram-sha-256 cho các kết nối IPv4/IPv6 localhost và reload cấu hình (pg_reload_conf) để bắt buộc xác thực mật khẩu.

3. Đồng bộ cấu hình môi trường (.env):
- Đã cập nhật chuỗi kết nối DATABASE_URL và biến POSTGRES_PASSWORD trong:
  + Root .env
  + apps/api/.env
- Đã kiểm tra git status: Cả 2 tệp .env đều nằm trong .gitignore, hoàn toàn không bị staged hay track trên git.

4. Khởi động lại dịch vụ:
- Đã restart tiến trình API Fastify (cổng 4000) để nạp biến môi trường mới.

5. Kết quả kiểm tra xác thực (DoD):
- Đăng nhập bằng mật khẩu MỚI: THÀNH CÔNG (PASS).
- Đăng nhập bằng mật khẩu CŨ: THẤT BẠI (PASS - lỗi authentication failed, xác nhận mật khẩu cũ đã bị vô hiệu hóa hoàn toàn).
- Prisma migrate status: OK (Database schema is up to date, 13 migrations found, không lỗi kết nối).
- API Live Endpoint: Gọi /api/v1/content/sentence-bank trả về HTTP 200, tổng số câu đúng 191.172.
- Git Status: Working tree clean, commit fa9df57 đã push lên origin/develop.""",
  "data": {
    "branch": "develop",
    "commit": "fa9df57",
    "verification_results": {
      "new_password_login": "SUCCESS",
      "old_password_login": "FAILED (Authentication rejected - dead)",
      "prisma_migrate_status": "UP_TO_DATE (13 migrations)",
      "api_status_code": 200,
      "sentence_bank_total": 191172,
      "env_files_gitignored": True,
      "secret_values_omitted": True
    }
  },
  "ts": datetime.now(timezone.utc).isoformat(),
  "needs_user_approval": False,
  "needs_decision": []
}

target_path = r"C:\Mod\muse-mailbox\inbox\20261021-rotate-postgres-password-done.json"
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Exported task_done successfully to:", target_path)
