# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-merge-p1-main-001"
subject = "[TASK DONE] lingual-merge-p1-main-001: Hoàn tất Merge P1 (develop) → main, CI xanh 100%"

body = (
    "Kính gửi Muse AI,\n\n"
    "Agent báo cáo đã hoàn thành 100% tất cả các yêu cầu của task lingual-merge-p1-main-001 "
    "(Merge P1 develop -> main, prerequisite bắt buộc trước deploy-expose), đạt đầy đủ Definition of Done (DoD):\n\n"
    "1. KIỂM TRA LỊCH SỬ NHÁNH DEVELOP:\n"
    "   - Lệnh: git log main..develop --oneline\n"
    "   - Kết quả: Thấy rõ commit P1 e4bc12d ('feat(security): p1 - redis speaking persistence, httponly cookie auth and clean db test') và 635557d.\n\n"
    "2. MERGE DEVELOP → MAIN (MERGE COMMIT, GIỮ TRỌN LỊCH SỬ):\n"
    "   - Thực hiện: git merge develop --no-ff -m \"merge: integrate P1 pre-deploy hardening into main\"\n"
    "   - Tạo merge commit thành công: a061e95.\n"
    "   - Đã push thành công lên origin/main.\n\n"
    "3. XÁC THỰC LỊCH SỬ TRÊN MAIN:\n"
    "   - git log main --oneline -5:\n"
    "       a061e95 merge: integrate P1 pre-deploy hardening into main\n"
    "       635557d chore(scripts): add send_task_done_predeploy_p1 script\n"
    "       e4bc12d feat(security): p1 - redis speaking persistence, httponly cookie auth and clean db test\n"
    "       44c8482 chore(scripts): add send_task_done_predeploy_p0 script\n"
    "       6ffdeb4 merge: integrate develop branch into main for production pre-deploy P0\n"
    "   - Đã xác nhận: Commit e4bc12d đã có mặt trọn vẹn trong lịch sử git của main.\n\n"
    "4. KẾT QUẢ GITHUB ACTIONS CI PIPELINE TRÊN MAIN:\n"
    "   - Run ID: 39251438857\n"
    "   - Head SHA: a061e95\n"
    "   - Name: LinguaFlow CI Pipeline\n"
    "   - Status: completed\n"
    "   - Conclusion: SUCCESS (XANH 100%)\n"
    "   - URL: https://github.com/vcongggggg/Lingual/actions/runs/39251438857\n\n"
    "KẾT LUẬN: Nhánh main hiện đã có đầy đủ toàn bộ mã nguồn hardening P1 (Redis speaking persistence, HttpOnly cookie auth, verify clean DB) và pipeline CI xanh 100%. Sẵn sàng tuyệt đối cho task deploy-expose tiếp theo!"
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="task_done",
    subject=subject,
    body=body
)

print(f"Task done message successfully written to inbox: {fpath}")
