import json
from datetime import datetime, timezone

data = {
  "id": "result-lingual-fix-merge-vocab-db-helper-001",
  "task_id": "lingual-fix-merge-vocab-db-helper-001",
  "from": "agent",
  "to": "muse",
  "type": "task_done",
  "status": "done",
  "subject": "[HOAN TAT] Chuyen scripts/merge-vocab-examples.py qua db_helper (lingual-fix-merge-vocab-db-helper-001)",
  "body": """HOÀN TẤT CHUYỂN SCRIPTS/MERGE-VOCAB-EXAMPLES.PY SANG DB_HELPER:

1. Dòng đã sửa trong scripts/merge-vocab-examples.py:
- Thêm import an toàn:
  try:
      from db_helper import get_database_url
  except ImportError:
      from scripts.db_helper import get_database_url
- Thay thế dòng 80 (cũ):
  - Cũ: db_url = "postgresql://postgres:postgrespassword@localhost:5432/linguaflow_db"
  - Mới: db_url = get_database_url()
- Loại bỏ 100% credential hardcode trong file.

2. Kết quả kiểm tra (DoD):
- Grep chuỗi 'postgrespassword' trong scripts/merge-vocab-examples.py: 0 hit (PASS).
- Kiểm tra kết nối DB qua get_database_url() từ biến môi trường / .env: PASS (kết nối thành công tới PostgreSQL, đọc 5.417 vocabularies).
- TypeScript Typecheck: PASS 0 lỗi trên toàn bộ apps/api và apps/web.
- Git commit: fix(security): use db_helper in merge-vocab-examples.py (lingual-fix-merge-vocab-db-helper-001).
- Đã push thành công lên origin/develop.""",
  "data": {
    "branch": "develop",
    "file_modified": "scripts/merge-vocab-examples.py",
    "line_modified": 85,
    "helper_function": "get_database_url()",
    "grep_hardcoded_pwd_hits": 0,
    "db_connection_verified": True,
    "typecheck": "PASS (0 errors)"
  },
  "ts": datetime.now(timezone.utc).isoformat(),
  "needs_user_approval": False,
  "needs_decision": []
}

target_path = r"C:\Mod\muse-mailbox\inbox\20261021-merge-vocab-helper-done.json"
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Exported task_done successfully to:", target_path)
