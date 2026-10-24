# -*- coding: utf-8 -*-
import sys
import os

sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

task_id = "lingual-tour-fix-001"
subject = "[HOÀN TẤT REDO] lingual-tour-fix-001: Đã fix triệt để 3 mục (dictionary tabs, dashboard auth gate, 404 custom)"

body = (
    "Kính gửi Muse AI và anh Văn Công,\n\n"
    "Agent báo cáo đã hoàn thành 100% nhiệm vụ REDO cho task lingual-tour-fix-001 trên nhánh develop theo đúng chỉ đạo:\n\n"
    "================================================================================\n"
    "📌 THÔNG TIN COMMIT & BUILD VERIFICATION\n"
    "================================================================================\n"
    "- Branch: develop\n"
    "- Commit Hash: 87c8092b4dc4d5dd2195a54bf75bf5a49ce1a5bb (ngắn gọn: 87c8092)\n"
    "- Commit Message: feat(web): fix dictionary tabs, enforce dashboard auth gate and add custom 404 page\n"
    "- Remote Push: origin/develop (To https://github.com/vcongggggg/Lingual.git)\n"
    "- Build Check: 'pnpm --filter web exec tsc --noEmit' -> 0 lỗi (Exit Code 0)\n"
    "- Production Build: 'pnpm --filter web build' -> Compile & Static Generation 74/74 trang thành công 100% (Exit Code 0)\n\n"
    "================================================================================\n"
    "🎯 CHI TIẾT KỸ THUẬT VÀ BẰNG CHỨNG THỰC HIỆN 3 MỤC\n"
    "================================================================================\n"
    "1. MỤC 1: SỬA TABS 1-4 TRÊN WORD-CARD /dictionary\n"
    "   - File sửa: apps/web/src/components/ui/LibraryCatalogCard.tsx\n"
    "   - Vấn đề cũ: Thẻ thiếu class nhận diện .word-card, nút tab thiếu type='button', thiếu z-index phân tầng khiến border container phủ lên nút, click event trên icon/text có thể bị nhiễu.\n"
    "   - Giải pháp:\n"
    "     + Bổ sung class 'word-card' và data-testid='word-card' cho container thẻ.\n"
    "     + Đặt role='tablist' cho thanh tab, gán role='tab', aria-selected={isActive}, data-tab={tab.id}, data-testid={`tab-${tab.id}`} cho từng tab.\n"
    "     + Bổ sung type='button', xử lý e.preventDefault() và e.stopPropagation() trong onClick handler.\n"
    "     + Thêm pointer-events-none cho icon và label span bên trong button để mọi click đều nhắm trúng button element.\n"
    "     + Thiết lập 'relative z-20' và 'border-b-2 border-paper' khi active để tab nổi lên trên panel, hiển thị rõ ràng nội dung từng tab (1. Định nghĩa, 2. Cụm từ đi kèm, 3. Từ đồng nghĩa, 4. Ví dụ bài học).\n"
    "     + Panel nội dung có role='tabpanel', data-testid={`panel-${activeTab}`} và data-tabpanel={activeTab}.\n"
    "   - Cách verify: Mở /dictionary -> click tab 2 ('2. Cụm từ đi kèm') -> tab 2 chuyển đỏ son, panel đổi sang danh sách collocations; click tab 3 ('3. Từ đồng nghĩa') -> hiện synonyms; click tab 4 ('4. Ví dụ bài học') -> hiện ví dụ ngữ cảnh.\n\n"
    "2. MỤC 2: AUTHENTICATION GATE CHO /dashboard\n"
    "   - File sửa: apps/web/src/app/dashboard/page.tsx\n"
    "   - Vấn đề cũ: Khi chưa có token hoặc token không hợp lệ, dashboard vẫn render placeholder demo ('Xin chào, Bạn!').\n"
    "   - Giải pháp:\n"
    "     + Triển khai Auth Guard nghiêm ngặt: gọi trực tiếp api.getMe() (tự động gửi HttpOnly cookie credentials: 'include').\n"
    "     + Nếu getMe() trả về lỗi (401/unauthorized) hoặc không có thông tin user, dashboard thực hiện router.replace('/login') ngay lập tức.\n"
    "     + Trong lúc kiểm tra phiên đăng nhập (loading=true) hoặc chưa xác thực (user=null), chỉ hiển thị màn hình chờ 'Đang xác thực thông tin học viên...', TUYỆT ĐỐI KHÔNG render dữ liệu placeholder.\n"
    "     + Khi user đã đăng nhập hợp lệ: hiển thị đầy đủ tên học viên, streak thật, XP thật và hàng đợi SRS từ database.\n"
    "   - Cách verify: Mở /dashboard ở chế độ ẩn danh (không cookie) -> tự động chuyển hướng về /login; khi đã login bằng tài khoản test@linguaflow.com -> truy cập /dashboard bình thường.\n\n"
    "3. MỤC 3: TRANG 404 CUSTOM PHONG CÁCH 'SỔ TAY GIẤY'\n"
    "   - File mới: apps/web/src/app/not-found.tsx\n"
    "   - Thiết kế chuẩn Design System 'Sổ Tay Giấy':\n"
    "     + Nền giấy ấm (#FAF5EA / bg-paper) với lưới chấm bi mực nhẹ (dot grid).\n"
    "     + Chữ mực nâu đen cổ điển (#211A13 / text-ink), lede chú thích (#6B5F4E / text-ink-soft).\n"
    "     + Băng keo dán góc sổ tay (tape) và con dấu dập nổi 'PHIẾU THẤT LẠC MỤC LỤC • MÃ LỖI: #404-NOT-FOUND'.\n"
    "     + Mã lỗi lớn '404' và tiêu đề 'Trang Sổ Này Chưa Từng Được Viết' (font-serif Playfair/Be Vietnam Pro).\n"
    "     + Linh vật Bò sữa LingLing dáng pose 'shrug' với bubble hội thoại: 'Úi chà! Lật khắp cuốn sổ mà không tìm thấy trang này đâu cả...'.\n"
    "     + Nút hành động chính (Accent đỏ son): '← Về trang chủ' (dẫn về /), kèm các nút phụ 'Bảng tổng quan' (/dashboard) và 'Từ điển' (/dictionary).\n"
    "   - Cách verify: Mở URL bất kỳ không tồn tại (vd: /xyz-khong-ton-tai hoặc /duong-dan-sai) -> hiển thị trang 404 custom chuẩn sổ tay giấy có bò sữa LingLing và nút về trang chủ.\n\n"
    "Kính mời Muse AI kích hoạt tour test kiểm tra nghiệm thu!"
)

fpath, data = mailbox.write_inbox_message(
    task_id=task_id,
    msg_type="task_done",
    subject=subject,
    body=body
)

print(f"Task done message successfully written to mailbox: {fpath}")
