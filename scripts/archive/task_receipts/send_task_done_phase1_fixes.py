# -*- coding: utf-8 -*-
import sys
sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

subject = "DATA Phase 1: Hoàn tất 4 mục bắt buộc sau audit độc lập của Muse"

body = (
    "Hoàn tất 100% 4 yêu cầu sửa đổi sau audit Phase 1:\n\n"
    "1. Lọc ví dụ nhạy cảm:\n"
    "   - Từ 'underwear': đã thay bằng 'She bought new underwear at the store.' / 'Cô ấy đã mua đồ lót mới ở cửa hàng.'.\n"
    "   - Kiểm tra grep từ khóa 'semen': 0 kết quả trên toàn bộ vocab-bulk.json.\n\n"
    "2. Sửa ví dụ sai lệch:\n"
    "   - Từ 'evolution': đã thay bằng 'Scientists study the evolution of birds from dinosaurs.' / 'Các nhà khoa học nghiên cứu sự tiến hóa của loài chim từ khủng long.'.\n"
    "   - Từ 'evidence': đã thay bằng 'There is no scientific evidence to support this claim.'.\n"
    "   - 'Evolution has no evidence' không còn trong bộ dữ liệu.\n\n"
    "3. Làm sạch rác markup StarDict:\n"
    "   - Đã xóa sạch toàn bộ thẻ <...> trong translation (guitar, basketball, tonne, browser, laser, trademark...).\n"
    "   - Đã thay thế toàn bộ 19 cross-references 'xem X' không có nghĩa thật (suddenly, awareness, deliberately, increasingly, permanently, potentially, anthropologically, athleticism, autonomously...) bằng nghĩa tiếng Việt chuẩn.\n"
    "   - Đã sửa các nghĩa sai ngữ cảnh (bathroom -> 'phòng tắm, nhà vệ sinh', fabulous -> 'tuyệt vời, thần thoại', speculate -> 'suy đoán, đầu cơ').\n"
    "   - Kiểm tra regex <[a-z]+> trong translation: 0 kết quả.\n\n"
    "4. Audio câu ví dụ (edge-tts):\n"
    "   - Đã gen đủ 3.023 file audio MP3 cho tất cả 3.023 từ có exampleSentence tại apps/web/public/audio/vocab/<slug>-ex.mp3 (dung lượng 48.08 MB, 0 lỗi).\n"
    "   - Đã thêm field exampleAudioUrl vào vocab-bulk.json, schema.prisma và đã cập nhật trực tiếp vào PostgreSQL local.\n"
    "   - Đã xóa file thừa apps/web/public/audio/vocab/example.mp3.\n\n"
    "5. Kiểm tra & Git:\n"
    "   - TypeScript typecheck (web + api): 0 lỗi.\n"
    "   - Commit: ba571a1 (feat(data): fix phase 1 audit findings - clean stardict markup, sanitize examples, gen example audio).\n"
    "   - Đã push lên develop."
)

fpath, data = mailbox.write_inbox_message(
    task_id="lingual-data-phase1-003",
    msg_type="task_done",
    subject=subject,
    body=body
)

print(f"Successfully sent task_done to: {fpath}")
