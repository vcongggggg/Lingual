import json
from datetime import datetime, timezone

data = {
  "id": "result-lingual-fix-hardcoded-db-credentials-001",
  "task_id": "lingual-fix-hardcoded-db-credentials-001",
  "from": "agent",
  "to": "muse",
  "type": "task_done",
  "status": "done",
  "subject": "[HOAN TAT] Chuyen toan bo DB password hardcoded sang env var (lingual-fix-hardcoded-db-credentials-001)",
  "body": """HOÀN TẤT FIX BẢO MẬT P0: CHUYỂN TOÀN BỘ DB PASSWORD SANG BIẾN MÔI TRƯỜNG

1. Danh sách các script đã sửa (3 script trọng tâm của commit e16e8ae + 5 script liên quan):
- scripts/audit_sentence_bank_fill.py (commit e16e8ae)
- scripts/import_sentence_bank_fill.py (commit e16e8ae)
- scripts/test_coverage.py (commit e16e8ae)
- scripts/import_idioms_data.py
- scripts/audit_idioms_overlap.py
- scripts/verify_wave1_import.py
- scripts/import_wave1_data.py
- scripts/audit_vocab_map.py

2. Cơ chế nạp credentials bảo mật (scripts/db_helper.py):
- Tên biến môi trường sử dụng:
  + DATABASE_URL (ưu tiên cao nhất)
  + DB_PASSWORD (fallback thứ cấp, tự động ghép connection string chuẩn)
  + Local .env fallback (tiện ích local development)
- Xử lý tương thích: Hàm clean_dsn_for_psycopg2 tự động loại bỏ query parameter ?schema=public (vốn do Prisma yêu cầu nhưng libpq/psycopg2 từ chối).
- Fallback an toàn (Safe Failure): Nếu thiếu cả DATABASE_URL và DB_PASSWORD (khi không có .env), ném ngoại lệ ValueError rõ ràng, tuyệt đối không dùng password mặc định trong code.

3. Cập nhật tài liệu:
- Đã thêm chú thích bảo mật vào mục '2. Cấu hình Môi trường' trong README.md.
- Tệp .env được đảm bảo nằm trong .gitignore, không bị commit lên repo.

4. Kết quả kiểm tra (DoD):
- Grep password cũ trên toàn bộ repository: 0 hit.
- Verify chạy script bằng env var:
  + scripts/audit_sentence_bank_fill.py: PASS (kết nối DB thành công, đọc 191.172 dòng).
  + scripts/test_coverage.py: PASS (kết nối DB thành công, đọc unlinked vocabularies).
  + scripts/audit_idioms_overlap.py: PASS (kết nối DB thành công).
  + Missing env test: PASS (ném ValueError khi thiếu credentials).
- TypeScript Typecheck: PASS 0 lỗi trên api và web.
- Commit hash: c7a0989 trên develop, đã push origin/develop.""",
  "data": {
    "branch": "develop",
    "commit": "c7a0989",
    "env_vars_supported": ["DATABASE_URL", "DB_PASSWORD"],
    "helper_module": "scripts/db_helper.py",
    "fixed_scripts": [
      "scripts/audit_sentence_bank_fill.py",
      "scripts/import_sentence_bank_fill.py",
      "scripts/test_coverage.py",
      "scripts/import_idioms_data.py",
      "scripts/audit_idioms_overlap.py",
      "scripts/verify_wave1_import.py",
      "scripts/import_wave1_data.py",
      "scripts/audit_vocab_map.py"
    ],
    "dod_results": {
      "grep_old_password_hits": 0,
      "safe_fallback_missing_env": "PASS (ValueError raised)",
      "scripts_execution": "PASS",
      "env_file_gitignored": True,
      "readme_updated": True
    }
  },
  "ts": datetime.now(timezone.utc).isoformat(),
  "needs_user_approval": False,
  "needs_decision": []
}

target_path = r"C:\Mod\muse-mailbox\inbox\20261021-hardcoded-db-credentials-done.json"
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Exported task_done successfully to:", target_path)
