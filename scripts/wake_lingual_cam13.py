import os
import sys
import subprocess

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(r'c:\Users\ADMIN\.gemini\antigravity-ide\scratch\telegram-antigravity-bot')
from engine.ide_bridge import resolve_antigravity_env, API_EXE_PATH

env = resolve_antigravity_env()
conv_id = '5d971f9a-5af5-4962-93f6-6e94212a167b'

prompt = """📬 [CHỈ ĐẠO TRỰC TIẾP TỪ ANH VĂN CÔNG: TIẾP TỤC TASK]
Anh Văn Công vừa vào kiểm tra và chỉ đạo: 'kêu lingual tiếp tục task đi'.

1. TRẠNG THÁI HẠ TẦNG MÁY TRẠM:
- PostgreSQL 18: ONLINE (Port 5432, kết nối linguaflow_db ổn định, 160 reading passages).
- Backend API (Port 4000) & Frontend Web (Port 3000): ONLINE 100%.
- Watcher Daemon (PID 4444) & Telegram Bot: ONLINE.

2. NHIỆM VỤ TIẾP THEO:
- Trước khi máy tắt, bạn đã hoàn tất Cambridge 12 và Pilot Cambridge 13 Test 1.
- Hãy tiếp tục xử lý chuỗi: Cambridge IELTS 13 Tests 2, 3, 4 (Academic).
- Nguồn ngữ liệu scan sạch có sẵn tại:
  C:\\Mod\\muse-data-exchange\\book-corpus\\cambridge-ielts-13-scan\\
- TUYỆT ĐỐI TUÂN THỦ:
  + CẤM gọi tool mạng ngoài (read_url_content, browser_subagent) để tránh popup xin quyền.
  + Đối soát 80/80 đáp án mỗi test theo key in trong sách.
  + Trích xuất dữ liệu sạch ra cam13-academic-test-2-data.json, test-3, test-4.
  + Import vào PostgreSQL, verify đếm bản ghi, commit code-only và xuất file task_done vào C:\\Mod\\muse-mailbox\\inbox.

Hãy bắt tay vào thực hiện ngay lập tức!"""

cmd = [
    str(API_EXE_PATH),
    'agentapi',
    'send-message',
    '--title=Tiếp Tục Task Cambridge 13 Tests 2-4',
    conv_id,
    prompt
]

res = subprocess.run(cmd, env=env, capture_output=True, text=True, timeout=30)
print("send-message returncode:", res.returncode)
print("stdout:", res.stdout)
print("stderr:", res.stderr)
