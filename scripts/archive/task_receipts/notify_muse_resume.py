# -*- coding: utf-8 -*-
import os
import json
import uuid
import datetime

now = datetime.datetime.now().astimezone()
iso_ts = now.isoformat(timespec='seconds')
short_hash = uuid.uuid4().hex[:4]
msg_id = f"{now.strftime('%Y%m%d-%H%M%S')}-{short_hash}"

body = """Chào Muse! Luồng work Lingual đã được dựng lại và sẵn sàng 100% vào sáng nay (25/10/2026):
1. Hạ tầng CSDL: PostgreSQL 18 ONLINE (Port 5432, kết nối ổn định, 151 reading passages baseline).
2. Dịch vụ ứng dụng: LinguaFlow Express API (Port 4000) & Next.js Web (Port 3000) đang chạy phục vụ audit và kiểm thử UI/API.
3. Watcher & Daemon: Mailbox Watcher (PID 20128) & Bridge Daemon (PID 7472) đang hoạt động bình thường.
4. Tiến trình Lingual: Đang thực thi nốt task Cambridge IELTS 12 Tests 2-4 (đã scan 240/240 keys, đang nạp DB và chuẩn bị xuất task_done).
5. Hàng đợi (Queue): Task Cambridge IELTS 13 Test 1 Pilot đã xếp sẵn ở vị trí #1.
Mời Muse kích hoạt lại luồng audit, đối soát chất lượng và tiếp tục giao các task tiếp theo vào Mailbox!"""

data = {
    "id": msg_id,
    "ts": iso_ts,
    "from": "system",
    "to": "muse",
    "task_id": "resume-workstream-cam12-13",
    "type": "system_ready",
    "subject": "[KHỞI ĐỘNG LUỒNG WORK] Hệ thống máy trạm đã sẵn sàng, mời Muse tiếp tục giao task và audit",
    "body": body,
    "needs_decision": [],
    "needs_user_approval": False
}

inbox_dir = r"C:\Mod\muse-mailbox\inbox"
file_path = os.path.join(inbox_dir, f"{msg_id}.json")
temp_path = file_path + ".tmp"
with open(temp_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
os.replace(temp_path, file_path)

print(f"SUCCESS! Created message at: {file_path}")
print(f"Message ID: {msg_id}")
