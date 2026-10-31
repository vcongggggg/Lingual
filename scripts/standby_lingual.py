import os
import sys
import subprocess

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(r'c:\Users\ADMIN\.gemini\antigravity-ide\scratch\telegram-antigravity-bot')
from engine.ide_bridge import resolve_antigravity_env, API_EXE_PATH

env = resolve_antigravity_env()
conv_id = '5d971f9a-5af5-4962-93f6-6e94212a167b'

prompt = """🛑 [LỆNH ĐIỀU CHỈNH TỪ ANH VĂN CÔNG: TẠM DỪNG BÓC TÁCH OCR THỦ CÔNG]
Anh Văn Công và Muse đã thống nhất chuyển đổi sang mô hình phân công mới:
- Muse AI sẽ đảm nhận việc đọc OCR, map và thẩm định 100% dữ liệu sạch ra file JSON (cam13-academic-test-2..4-data.json, manifest, report).
- Phân hệ Lingual KHÔNG CẦN tự viết script bóc tách OCR, parse bảng key hay ráp JSON thủ công nữa.

HÀNH ĐỘNG CỦA BẠN:
1. DỪNG NGAY TOÀN BỘ các script parse OCR, regex hay bóc tách thủ công đang chạy.
2. Chuyển sang trạng thái STANDBY (Sẵn Sàng).
3. Khi Muse hoàn tất việc map file JSON và gửi lệnh qua Mailbox, bạn sẽ chỉ thực hiện khâu IMPORT-ONLY vào PostgreSQL local, chạy verify DB và commit.

Hãy kết thúc lượt và đứng chờ lệnh từ Mailbox!"""

cmd = [
    str(API_EXE_PATH),
    'agentapi',
    'send-message',
    '--title=Standby: Cho Muse Map Data',
    conv_id,
    prompt
]

res = subprocess.run(cmd, env=env, capture_output=True, text=True, timeout=30)
print("send-message returncode:", res.returncode)
