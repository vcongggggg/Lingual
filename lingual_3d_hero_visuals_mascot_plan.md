# Lingual — Plan: Hero 3D Tương Tác, Hình Ảnh Điểm Nhấn & Mascot LingLing

## 1. Nhận xét UI hiện tại

Nền tảng thị giác (màu duotone coral/amber-teal, dark theme, glassmorphism
có kiểm soát, typography phân cấp rõ) đã đúng như plan đã chốt — phần này
tốt, không cần đổi. Nhưng đúng như bạn thấy: **toàn bộ giao diện hiện tại
100% là text + card phẳng + icon outline nhỏ**, không có bất kỳ hình ảnh,
illustration, hay vật thể thị giác nào để mắt "nghỉ" — kể cả hero section
(nơi quan trọng nhất để gây ấn tượng đầu) cũng chỉ có chữ + 2 nút + 3 card
thông số. Chatbot LingLing cũng chỉ là emoji 🤖 generic, chưa có nhận diện
riêng dù đã có hẳn 5-state animation system trong plan trước — thiếu đúng
"khuôn mặt" để gắn animation đó vào.

Hai việc cần làm, đúng thứ tự ưu tiên:
1. Hero 3D tương tác (tác động lớn nhất tới ấn tượng đầu).
2. Hình ảnh/illustration rải rác ở các điểm trống hợp lý + mascot LingLing
   thật sự (tận dụng lại state machine đã thiết kế).

---

## 2. Hero Section 3D tương tác

### 2.1. Chọn công cụ

| Công cụ | Ưu điểm | Nhược điểm | Khuyến nghị |
|---|---|---|---|
| **React Three Fiber** (code, free, mã nguồn mở) | Kiểm soát hoàn toàn, không branding, tương tác được với state thật của app (vd render card SRS thật đang bay), nhẹ nếu tối ưu đúng | Cần code 3D tay, mất thời gian dựng scene hơn | **Khuyến nghị chính** — vì đã có sẵn stack React/Next.js, và muốn scene phản ứng theo dữ liệu thật (XP, streak) |
| **Spline** | Dựng scene trực quan như Figma, xuất thẳng React component, có AI hỗ trợ tạo scene nhanh, tương tác hover/click/scroll dựng sẵn không cần code | Bản free có gắn watermark Spline, scene phức tạp có thể nặng, khó nối trực tiếp với state app runtime | Dùng để **prototype nhanh hình dáng/chuyển động** của scene, sau đó nếu cần custom sâu thì dựng lại bằng R3F |

**Đề xuất thực tế**: Dùng Spline để thiết kế + duyệt ý tưởng hình khối trước
(nhanh, trực quan, không cần dev ngồi chỉnh tay), sau khi chốt hình dáng thì
implement lại bằng React Three Fiber cho bản production (free, không
watermark, nhẹ, tương tác được với XP/streak thật).

### 2.2. Concept scene (bám sát nhận diện thương hiệu đã có, không tạo ra thứ lạc quẻ)

Logo hiện tại đã dùng icon ⭐ (spark/star) làm mark chính — hero 3D nên khai
triển trực tiếp từ đó, không bịa ra motif mới:

- **Vật thể trung tâm**: 1 khối tinh thể/spark 3D phát sáng (glow theo màu
  gradient coral→amber→teal đã dùng ở tiêu đề), xoay chậm liên tục (idle
  animation), phản ứng nghiêng theo vị trí chuột (parallax tilt, không cần
  drag).
- **Vật thể quỹ đạo quanh trung tâm**: 4-5 thẻ nhỏ dạng "flashcard mini" bay
  quanh khối trung tâm theo quỹ đạo elip — mỗi thẻ hiện 1 từ vựng thật (vd
  lấy random từ bảng Vocabulary qua API) mặt trước tiếng Việt, tự lật sang
  tiếng Anh sau vài giây — **đây là điểm kết nối trực tiếp hero marketing
  với tính năng SRS thật của sản phẩm**, không phải hình trang trí vô nghĩa.
- **Tương tác**: click vào 1 thẻ đang bay → thẻ phóng to ra giữa màn hình
  kèm hiệu ứng flip 3D giống card SRS thật trong app → đóng lại quay về quỹ
  đạo. Đây là cách giới thiệu tính năng SRS ngay từ hero mà không cần đọc
  text.
- **Nền**: giữ nguyên nền tối hiện tại, chỉ thêm particle/glow nhẹ theo
  chuyển động camera, không dùng skybox màu mè phá vỡ tông tối đã chọn.

---

## 3. Vị trí thêm hình ảnh/illustration (không phải 3D, đơn giản hơn nhưng hiệu quả)

| Vị trí | Loại hình ảnh | Lý do |
|---|---|---|
| Dashboard — khu vực trống bên phải card "Game Center" | 1 illustration nhỏ nhân vật đang chơi game/học | Hiện tại khu này chỉ có text, trống thị giác |
| Trang Luyện Thi IELTS — dưới hero tím | Illustration học viên đang đọc sách/làm bài thi | Tách section rõ hơn, giảm cảm giác toàn chữ |
| Từng Unit trong Lộ Trình Học | Icon minh hoạ chủ đề (gia đình, chào hỏi...) thay vì chỉ icon sách chung chung | Giúp phân biệt nhanh các Unit khi lướt mắt |
| Game Center — 4 card | Illustration nền mờ phía sau icon emoji hiện tại | 4 card hiện đang chỉ có emoji + text, khá trơ |
| Trạng thái rỗng (chưa có streak, chưa hoàn thành bài nào) | Illustration "empty state" động viên nhẹ | Chưa thấy trong ảnh nhưng chắc chắn sẽ gặp — nên chuẩn bị trước |

---

## 4. Nguồn hình ảnh/illustration phù hợp

Ưu tiên 1 style xuyên suốt, không trộn nhiều nguồn (tránh giao diện lởm
chởm phong cách):

- **SALY** (DrawKit) — bộ illustration 3D **thiết kế riêng cho dark mode**,
  khớp chính xác nền tối hiện tại của app, phong cách hiện đại gần với
  gradient/glow đang dùng. Ưu tiên hàng đầu cho các vị trí ở mục 3.
- **unDraw** — CC0, không cần credit, cho phép đổi 1 màu accent trước khi
  tải — dùng cho các illustration phụ/empty state nếu SALY không có scene
  phù hợp, đảm bảo consistency màu với theme.
- **DrawKit** (gói Education) — có SVG/PNG lẫn Lottie, không yêu cầu
  attribution ở bản free, hợp cho illustration chủ đề học tập (unit gia
  đình, công việc...).
- **Blush** — hệ thống mix-and-match nhân vật, hữu ích nếu sau này cần
  nhiều biến thể nhân vật học viên (đa dạng giới tính/phong cách) cho
  testimonial hoặc onboarding.
- **LottieFiles marketplace** — tìm animated icon miễn phí bổ sung cho
  Game Center (confetti, trophy, streak fire...) khớp `lottiefiles-motion-design`
  skill đã có sẵn trong project.

Nguyên tắc chọn: **chỉ chọn asset có bản SVG + cho phép đổi màu**, để luôn
ép về đúng bảng màu duotone coral/amber-teal đã chốt — không dùng illustration
có sẵn màu cố định không khớp theme.

---

## 5. Mascot LingLing — thiết kế nhân vật riêng (thay emoji 🤖 generic)

### 5.1. Định hướng nhân vật

Không đi theo hướng "con cú/con vật" kiểu Duolingo (dễ bị so sánh trực
tiếp) — tận dụng chính motif **spark/star ⭐** đã có sẵn trong logo Lingual
để mascot gắn liền với nhận diện thương hiệu thay vì là 1 nhân vật tách
rời:

- Hình dáng: 1 sinh vật nhỏ dạng "tia sáng/ngôi sao" có gương mặt biểu cảm
  đơn giản (2 mắt + miệng, không cần chi tiết phức tạp), thân phát gradient
  coral→teal y hệt logo.
- Không tay chân phức tạp — dạng "blob" mềm mại, dễ animate, dễ scale nhỏ
  xuống làm avatar 32px trong header chat vẫn nhận diện được.

### 5.2. Bộ pose cần có (khớp đúng 5 state đã thiết kế ở plan chatbot v2)

`idle` (lơ lửng nhẹ), `thinking` (nghiêng đầu, mắt nhìn lên), `speaking`
(miệng động nhẹ), `celebrating` (nhún nhảy, tay giơ cao nếu có), `apologetic`
(cúi nhẹ, mắt cong buồn).

### 5.3. Cách tạo ra mascot (miễn phí → có phí, theo ngân sách)

1. **LottieFiles AI Vector Generator** (free, prompt-to-SVG) — mô tả đúng
   concept ở mục 5.1, generate ra SVG có layer tách sẵn, sau đó dùng **Lottie
   Creator** (cùng nền tảng, free) để animate từng pose trong 5.2 thành file
   `.json` — nhẹ, load nhanh, đúng định dạng skill `lottiefiles-motion-design`
   đã dùng.
2. **Recraft AI** — phương án thay thế, vectorize + xuất thẳng Lottie, hữu
   ích nếu cần thử nhiều biến thể hình dáng nhanh trước khi chốt.
3. Nếu muốn chất lượng production/thật sự độc quyền (không AI-generated) —
   thuê designer trên Fiverr/Dribbble tìm theo từ khoá "mascot design +
   lottie animation" (nhiều portfolio có sẵn case study đúng dạng linh vật
   app + animation, dễ brief theo đúng mục 5.1-5.2).

---

## 6. Thứ tự triển khai đề xuất

1. Mascot LingLing 5 pose (effort thấp nhất, tác động ngay tới chatbot đã
   có sẵn state machine — "trả nợ" thiết kế còn thiếu từ plan trước).
2. Illustration tại các vị trí mục 3 (effort thấp, hiệu quả thị giác tức thì
   toàn site).
3. Hero 3D tương tác (effort cao nhất, làm sau khi đã có mascot + illustration
   để đảm bảo tông màu/phong cách nhất quán trước khi đầu tư 3D).
