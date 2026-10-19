# Lingual Design System Specification — "Sổ Tay Giấy" & Linh Vật LingLing (Phase R1)

**Version:** 1.0.0  
**Status:** Approved by User  
**Target App:** `apps/web` (Giao diện chính thức sau Cutover, `apps/web-old-archive` lưu trữ bản cũ)  
**Tài liệu tham khảo trực quan:** [mockup-lingual-giay-linhvat.html](file:///c:/Study/HocKy6/LinguaFlow/mockup-lingual-giay-linhvat.html) & Screenshots tại `docs/screenshots/`.

---

## 1. Triết Lý Thiết Kế Cốt Lõi (Core Philosophy)

Lingual chuyển mình từ giao diện "AI Slop" chung chung (dark mode phát sáng, gradient blobs mờ ảo, kính mờ glassmorphism) sang phong cách **"Sổ Tay Giấy" (Light Editorial Paper Notebook)** đậm chất nhân văn, thân thiện và tập trung vào việc học thực chất:
- **Cảm giác vật lý ấm áp:** Mỗi màn hình như một trang sổ tay da hoặc giấy vẽ mộc mạc, có lưới chấm bi mực nhẹ (dot grid), thẻ bài học xếp lớp với băng keo dán (tape) và con dấu dập nổi (stamp).
- **Mực in dứt khoát:** Đường viền mực đen nâu 2px (`--ink: #211A13`) phân định không gian mạch lạc, bóng đổ dập nổi cứng cáp (hard offset brutalist shadow), không blur mờ ảo.
- **Linh vật LingLing (Bò sữa vui vẻ):** Xuất hiện có chủ đích ở hero, streak card, bài học, speech bubbles và empty states — như một người bạn học cùng đồng hành, hướng dẫn và cổ vũ người học.

---

## 2. Bảng Design Tokens Chuẩn (Color & Style Palette)

### 2.1. Bảng Màu (Color Tokens)
```css
:root {
  /* Nền giấy & Thẻ */
  --paper: #FAF5EA;        /* Nền giấy chính, ấm áp, bảo vệ mắt */
  --paper-2: #F1E9D6;      /* Nền giấy phụ / nhãn thẻ / bảng phụ */
  --card: #FFFDF6;         /* Nền thẻ nội dung trắng kem */
  
  /* Mực in */
  --ink: #211A13;          /* Mực đen nâu cổ điển, sắc sảo */
  --ink-soft: #6B5F4E;     /* Mực nâu nhạt cho lede, chú thích, phonetic */
  --ink-muted: #8F8270;    /* Mực nhạt cho disabled / placeholder */
  
  /* Màu điểm nhấn (Accents) */
  --red: #D64027;          /* Đỏ son truyền thống - nút hành động chính (Primary CTA) */
  --red-dark: #A82E1C;     /* Đỏ son đậm khi hover / active */
  --teal: #0F766E;         /* Xanh ngọc tri thức - dải streak, nghĩa từ vựng */
  --teal-dark: #0D655E;    /* Xanh ngọc sẫm */
  --amber: #F2A93B;        /* Vàng hổ phách - highlight bút nhớ, ô streak hoàn thành */
  --amber-soft: #FDF3E3;   /* Vàng nhạt nền thông báo */
  
  /* Đường nét & Viền */
  --line-width: 2px;
  --line: 2px solid var(--ink);
  --line-dashed: 2px dashed #211A1355;
  
  /* Đổ bóng dập nổi cứng cáp (Hard Offset Shadows) */
  --shadow-sm: 2px 2px 0 var(--ink);
  --shadow-md: 4px 4px 0 var(--ink);
  --shadow-lg: 6px 6px 0 var(--ink);
  --shadow-xl: 8px 8px 0 var(--ink);
  --shadow-2xl: 10px 10px 0 var(--ink);
}
```

### 2.2. Typography (Phông Chữ)
- **Primary Font Family:** `'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif;`
- **Heading 1:** `clamp(36px, 5vw, 64px)`, `line-height: 1.08`, `font-weight: 900`, `letter-spacing: -1.5px`.
- **Heading 2:** `clamp(26px, 3.5vw, 42px)`, `line-height: 1.15`, `font-weight: 900`, `letter-spacing: -0.8px`.
- **Heading 3:** `clamp(19px, 2.2vw, 24px)`, `line-height: 1.3`, `font-weight: 800`.
- **Body / Lede:** `16px - 18px`, `line-height: 1.7`, `color: var(--ink-soft)`.

---

## 3. Quy Tắc Bắt Buộc & Điều Cấm Kỵ (Do's & Don'ts)

### ❌ TUYỆT ĐỐI CẤM (Strictly Forbidden):
1. **Không Glassmorphism:** Cấm dùng `backdrop-blur-md/lg`, `bg-white/10` mờ ảo tạo cảm giác công nghệ lạnh lẽo.
2. **Không Gradient Blobs & Glowing:** Cấm tạo các khối cầu màu tím/hồng/xanh mờ chạy nền hoặc bóng phát sáng neon rực rỡ (`box-shadow: 0 0 25px #...`).
3. **Không Text Gradient 3 Màu:** Cấm các đoạn chữ `bg-gradient-to-r from-blue-400 via-pink-500 to-purple-600 bg-clip-text text-transparent`.
4. **Không Staggered Fade-Up Thừa Thãi:** Không làm delay animation từng dòng text khiến người dùng phải chờ trang hiện ra.
5. **Lịch sử mã nguồn được bảo toàn:** Giao diện cũ được lưu trữ tại `apps/web-old-archive`. Mọi thay đổi UI chính thức nằm tại `apps/web`.

### ✅ BẮT BUỘC TUÂN THỦ (Mandatory Guidelines):
1. **Nền giấy kraft:** Sử dụng `background: var(--paper)` kết hợp mẫu chấm mực `radial-gradient(#211a1314 1px, transparent 1px)` kích thước `22px 22px`.
2. **Hard Brutalist Shadow:** Mọi thẻ (Card), nút bấm (Button), badge đều dùng viền mực 2px và đổ bóng lệch `4px 4px 0 #211a13` hoặc `6px 6px 0 #211a13`. Khi hover thì dịch chuyển nhẹ `transform: translate(-2px, -2px)` và tăng bóng `box-shadow: 6px 6px 0 #211a13`.
3. **Thẻ bài học phong cách sổ tay:** Thẻ có nhãn tag bo tròn (`background: var(--paper-2); border: 2px solid var(--ink)`), dải băng dính trang trí góc (`tape`), và dấu mộc mực đỏ (`stamp`).
4. **Linh vật LingLing thân thiện:** Sử dụng bộ sticker bò LingLing trong `public/mascot/` với lời thoại hóm hỉnh trong bong bóng hội thoại (`.say`) tại các mốc: Chào mừng ở Hero, Chúc mừng streak, Hướng dẫn phát âm, Động viên khi làm sai.
5. **Tiếng Việt tự nhiên, trung thực:** Mọi nhãn, hướng dẫn, giải thích từ vựng và bài đọc đều dùng tiếng Việt mộc mạc, không dùng từ ngữ phóng đại.

---

## 4. Danh Mục Linh Vật LingLing & Ngữ Cảnh Sử Dụng

| Sticker File | Biểu Cảm Linh Vật | Ngữ Cảnh Triển Khai Trong Web |
|:---|:---|:---|
| `cow_greet_heart.png` | Cầm trà sữa, ôm tim chào | Hero Section, Welcome Screen, Trang chủ |
| `cow_salute.png` | Giơ tay chào kiểu chiến binh | Dải Streak Card, Bảng điểm danh hàng ngày |
| `cow_wink_kiss.png` | Nháy mắt tự tin, hôn gió | Hộp kêu gọi hành động CTA Box, Hoàn thành bài |
| `cow_hands_on_hips.png` | Chống nạnh sẵn sàng | Game Center, Vào phòng thi IELTS, Bắt đầu ôn SRS |
| `cow_cry_soft.png` | Mếu máo, rơi nước mắt nhẹ | Empty State, Báo sai bài tập, Quên ôn từ |
| `cow_run_side.png` | Chạy nhanh hăm hở | Speed typing game, Thử thách bấm giờ |

---

## 5. Cấu Trúc Monorepo Của Ứng Dụng (`apps/web`)

```
apps/web/
├── public/
│   ├── mascot/             # Bộ sticker LingLing gốc (PNG)
│   └── fonts/              # Font Be Vietnam Pro
├── src/
│   ├── app/                # Next.js 15 App Router
│   │   ├── layout.tsx      # Root Layout với font Be Vietnam Pro & Dot pattern
│   │   ├── page.tsx        # Trang chủ Sổ tay giấy (Home)
│   │   ├── dashboard/      # Trang tổng quan học tập
│   │   ├── login/          # Đăng nhập chuẩn sổ tay
│   │   ├── register/       # Đăng ký tài khoản
│   │   ├── srs/            # Lật thẻ ghi nhớ SM-2 Flashcard
│   │   ├── games/          # Game Center 4 trò chơi
│   │   ├── ielts/          # Luyện thi IELTS (Reading, Listening, Writing, Mock)
│   │   ├── listening/      # Lab Nghe chép chính tả & Shadowing
│   │   ├── speaking/       # Lab Luyện phát âm
│   │   ├── reading/        # Lab Đọc hiểu bài báo
│   │   ├── writing/        # Lab Luyện viết câu & đoạn
│   │   ├── vocabulary/     # Lab Danh mục từ vựng CEFR
│   │   ├── dictionary/     # Từ điển Anh - Việt tra cứu
│   │   ├── tutor/          # Chatbot sổ tay LingLing
│   │   ├── analytics/      # Phân tích tiến độ học tập
│   │   └── admin/          # Quản trị hệ thống
│   ├── components/
│   │   ├── ui/             # Button, Card, Input, Badge, Modal, StreakCard...
│   │   ├── Navbar.tsx      # Header thanh điều hướng sổ tay
│   │   ├── Footer.tsx      # Footer sổ tay Lingual
│   │   └── LingLing.tsx    # Component hiển thị linh vật + Speech bubble
│   ├── lib/
│   │   ├── api.ts          # API Client kết nối http://localhost:4000/api/v1
│   │   └── auth.ts         # Quản lý token & session
│   └── styles/
│       ├── globals.css     # Design tokens & brutalist base utilities
│       └── dot-grid.css    # Paper texture & background patterns
├── tailwind.config.ts      # Tailwind mở rộng bảng màu paper, ink, red, teal, amber
├── next.config.ts          # Next.js 15 standalone config
└── package.json            # Scripts: dev (cổng 3001), build, start (cổng 3001)
```
