# 🚀 LinguaFlow — Full-Stack Implementation Plan (v2, hoàn thiện)

Bản v2 này bổ sung các phần còn thiếu trong plan gốc: anti-cheat, timezone, DevOps, testing đầy đủ, tính năng đề xuất thêm, và đặc biệt là **kiến trúc để mở rộng đa ngôn ngữ (multi-language) sau này** mà không phải viết lại từ đầu.

---

## 1. Kiến trúc tổng thể (cập nhật)

```text
linguaflow/
├── apps/
│   ├── web/                     # Next.js 15 (App Router)
│   │   └── src/app/[locale]/    # Locale-scoped routing ngay từ đầu (xem mục 6)
│   └── api/                     # NestJS
├── packages/
│   ├── contracts/                # Zod schemas + shared types
│   ├── domain/                   # SM-2, XP/Streak, Game scoring — ngôn ngữ-agnostic
│   ├── ui/                       # [MỚI] Shared component library (Button, Card, Modal...)
│   └── config/                   # [MỚI] Feature flags, supported language pairs, env schema
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .github/workflows/            # [MỚI] CI: lint, test, typecheck, build
└── docker-compose.yml
```

**Thay đổi so với bản gốc:**
- Thêm `packages/ui`: tránh lặp component giữa dashboard/lesson/games/admin (4 khu vực đều cần Button, Modal, ProgressBar...).
- Thêm `packages/config`: nơi khai báo cặp ngôn ngữ nào đang bật (vd chỉ `vi→en` cho MVP), dùng chung cho FE/BE/admin.
- `apps/web` route theo `[locale]` ngay từ đầu, kể cả khi MVP chỉ có 1 locale — tránh phải refactor toàn bộ routing khi thêm ngôn ngữ.

---

## 2. Tính năng đề xuất bổ sung

| Tính năng | Mức ưu tiên | Lý do |
|---|---|---|
| **Streak Freeze** (đóng băng streak 1 ngày khi bận) | Cao | Giữ retention, tránh churn khi user lỡ 1 ngày — cơ chế đã chứng minh hiệu quả (Duolingo) |
| **Adaptive Placement Test** | Trung bình | Xếp trình độ đầu vào chính xác hơn quiz tĩnh, giảm churn cho user đã biết tiếng Anh cơ bản |
| **Leaderboard (tuần, bạn bè, toàn cục)** | Trung bình | Tăng động lực cạnh tranh, tận dụng GameSession đã có sẵn |
| **Achievements/Badges** | Trung bình | Gamification bổ sung, không đụng tới domain logic phức tạp |
| **Push/Email reminder khi SRS due hoặc sắp mất streak** | Cao | Retention driver mạnh nhất trong app học ngôn ngữ |
| **Pronunciation practice (Web Speech API STT)** | Thấp (v2) | Tận dụng Web Speech API đã dùng cho TTS, nhưng độ chính xác STT tiếng Việt còn hạn chế — để sau |
| **Offline PWA cho SRS review** | Thấp (v2) | Học viên Việt Nam hay học lúc di chuyển, mạng chập chờn |
| **CEFR level tagging (A1→C2) cho từ vựng/lesson** | Cao (làm ngay dù MVP chỉ có A1) | Không tốn thêm effort nếu làm từ đầu, nhưng cực khó thêm sau nếu bỏ qua |
| **Referral system** | Thấp | Growth loop, làm sau khi core product ổn định |

---

## 3. Anti-cheat & Server-side Validation (bổ sung bắt buộc)

Vấn đề: client gửi điểm/XP lên, nếu server tin tưởng hoàn toàn → dễ bị sửa request để farm điểm.

**Nguyên tắc thiết kế:**
- Mọi hành động sinh XP (hoàn thành lesson, review SRS, chơi game) phải gửi kèm **session token** được server phát ra khi bắt đầu (vd `POST /lessons/:id/start` trả về `attemptId`).
- Khi submit kết quả (`POST /lessons/:id/submit`), server **tính lại** đáp án đúng/sai dựa trên dữ liệu gốc trong DB, không tin số điểm client gửi lên.
- Với game có yếu tố thời gian (Typing Race, Fill-in-Blank Blitz): server ghi `startedAt` khi bắt đầu, so sánh với `submittedAt` để phát hiện bất thường (vd hoàn thành nhanh hơn vật lý cho phép).
- Rate limit theo user cho các endpoint sinh XP (vd tối đa N lần submit/phút) để chặn script tự động.
- `UserXPLog` nên lưu `sourceType` + `sourceId` (vd `lesson:uuid`, `game:uuid`) để audit và chặn double-submit cùng 1 attempt.

---

## 4. Timezone & Streak Logic (bổ sung bắt buộc)

- Lưu `User.timezone` (mặc định `Asia/Ho_Chi_Minh`) khi đăng ký, cho phép đổi trong settings.
- Mọi tính toán "ngày học hôm nay", "streak reset lúc nào", "SRS dueDate" phải quy đổi theo timezone của user, **không dùng UTC ngày trực tiếp**.
- Dùng thư viện `date-fns-tz` hoặc `luxon` ở cả domain layer lẫn cron job xử lý streak.
- Cron job kiểm tra streak (chạy hàng giờ, không chạy 1 lần/ngày theo UTC) để xử lý đúng cho user ở nhiều múi giờ nếu sau này mở rộng ra ngoài VN.

---

## 5. Database Schema — bổ sung field cho các tính năng mới

```prisma
model User {
  id              String   @id @default(uuid())
  timezone        String   @default("Asia/Ho_Chi_Minh")   // [MỚI]
  interfaceLocale String   @default("vi")                  // [MỚI] ngôn ngữ UI, khác với ngôn ngữ đang học
  streakFreezes   Int      @default(0)                     // [MỚI]
  // ...existing fields
}

model Course {
  id                 String @id @default(uuid())
  sourceLanguageCode String  // [MỚI] vd "vi"
  targetLanguageCode String  // [MỚI] vd "en"
  cefrLevel          String  // [MỚI] "A1".."C2"
  // ...
}

model Vocabulary {
  id        String @id @default(uuid())
  cefrLevel String  // [MỚI]
  // ...existing fields (audio link, example sentence...)
}

model GameSession {
  id          String   @id @default(uuid())
  attemptId   String   @unique  // [MỚI] chống double-submit
  startedAt   DateTime            // [MỚI]
  submittedAt DateTime            // [MỚI]
  // ...
}

model Achievement {          // [MỚI]
  id     String @id @default(uuid())
  code   String @unique
  nameKey String  // i18n key, không hardcode text
}

model UserAchievement {      // [MỚI]
  userId        String
  achievementId String
  unlockedAt    DateTime @default(now())
}
```

---

## 6. Chiến lược mở rộng đa ngôn ngữ (Multi-language readiness)

Đây là phần quan trọng nhất để tránh phải viết lại khi thêm ngôn ngữ (vd sau này thêm Nhật→Việt, Việt→Trung...).

### 6.1. Phân biệt 2 loại "ngôn ngữ" trong hệ thống
1. **Ngôn ngữ giao diện (interface locale)** — UI hiển thị tiếng gì (vd menu, nút bấm).
2. **Cặp ngôn ngữ học (learning language pair)** — vd `vi → en`. Đây là nội dung khóa học, không phải UI.

Hai khái niệm này **độc lập** với nhau — một user dùng UI tiếng Anh nhưng học tiếng Nhật vẫn phải chạy được. Plan gốc gộp chung 2 khái niệm này, cần tách rõ ngay từ schema (đã thể hiện ở `User.interfaceLocale` vs `Course.sourceLanguageCode/targetLanguageCode`).

### 6.2. UI i18n
- Dùng `next-intl` (hợp với Next.js 15 App Router) thay vì hardcode text tiếng Việt trong component.
- Toàn bộ string UI đưa vào `messages/vi.json`, `messages/en.json` từ đầu, kể cả khi MVP chỉ ship tiếng Việt — chi phí làm từ đầu gần như bằng 0, nhưng tốn rất nhiều công nếu refactor sau.
- Route theo `/[locale]/dashboard`, `/[locale]/learn/...` ngay từ đầu.

### 6.3. Content layer (khóa học) — tách khỏi code
- Vocabulary, Lesson, Unit không được gắn cứng với "tiếng Việt" ở tầng logic — chỉ là data trong `Course` với `sourceLanguageCode`/`targetLanguageCode`.
- `packages/domain` (SM-2, XP, scoring) đã ngôn ngữ-agnostic sẵn — giữ nguyên nguyên tắc này, không để logic game/SRS phụ thuộc vào ngôn ngữ cụ thể.
- Game logic (Sentence Scramble, Fill-in-Blank...) hoạt động trên token/string tổng quát, không giả định cấu trúc câu tiếng Anh hay tiếng Việt cụ thể (vd tránh hardcode "add space between words" — một số ngôn ngữ như Nhật không có khoảng trắng).

### 6.4. TTS/Audio đa ngôn ngữ
- Web Speech API (`SpeechSynthesisUtterance.lang`) đã hỗ trợ nhiều locale (`en-US`, `ja-JP`...) — chỉ cần lấy `targetLanguageCode` từ Course để set `lang`, không cần đổi kiến trúc.
- Với ngôn ngữ mà Web Speech API hỗ trợ kém (vd giọng hiếm), cần fallback OpenAI TTS đã có trong plan gốc — nên thiết kế interface `TTSProvider` chung để swap provider theo ngôn ngữ.

### 6.5. Admin CMS
- Form tạo Course/Lesson cần dropdown chọn `sourceLanguageCode`/`targetLanguageCode`/`cefrLevel` thay vì giả định luôn là Việt→Anh.
- `packages/config` khai báo danh sách cặp ngôn ngữ được phép tạo (feature flag), để kiểm soát rollout dần từng cặp mới.

### 6.6. Lộ trình mở rộng thực tế (đề xuất)
1. **MVP**: chỉ `vi→en`, nhưng schema + routing + i18n đã tổng quát hóa (chi phí gần như 0 nếu làm đúng từ đầu).
2. **Giai đoạn 2**: thêm cặp ngôn ngữ thứ 2 chỉ cần seed data mới + bật flag trong `packages/config`, không cần đổi code domain/API.
3. **Giai đoạn 3**: cho phép user chọn learning language pair ngay từ onboarding (hiện tại onboarding có thể giả định sẵn `vi→en`).

---

## 7. DevOps / CI-CD (bổ sung, plan gốc chưa có)

- **CI (GitHub Actions)**: lint + typecheck + unit test domain + build chạy trên mọi PR.
- **Migration**: dùng `prisma migrate deploy` cho production, không dùng `db push`. Có bước review migration trước khi merge.
- **Deploy**: đề xuất Vercel cho `apps/web`, Railway/Render cho `apps/api` + Postgres (đơn giản cho quy mô đồ án/MVP).
- **Secrets**: `.env.example` liệt kê đầy đủ biến môi trường cần thiết (JWT secret, DB url, TTS API key nếu dùng OpenAI fallback).
- **Monitoring**: tối thiểu tích hợp Sentry (free tier đủ dùng) cho cả FE và API để bắt lỗi runtime.

---

## 8. Bảo mật bổ sung

- Rate limiting cho `/auth/login` và mọi endpoint sinh XP (NestJS `@nestjs/throttler`).
- CSRF protection nếu dùng cookie HTTP-only cho refresh token (double-submit cookie pattern hoặc SameSite=strict).
- RBAC guard rõ ràng cho `AdminModule` — role `admin` riêng trong `User`, không chỉ check theo email hardcode.
- Input validation ở cả FE (UX) lẫn BE (bắt buộc, qua Zod schema trong `contracts`) — không tin dữ liệu từ client dù đã validate ở FE.

---

## 9. Testing Plan (đầy đủ hơn)

### Automated
1. **Domain unit test**: SM-2 transitions, XP/streak calculation, game scoring — đã có trong plan gốc.
2. **API integration test**: Auth, SRS queue, **Game submission (mới — test anti-cheat logic)**.
3. **E2E (Playwright)** — mới thêm: chạy critical path tự động thay vì chỉ manual — Register → Onboarding → Learn Lesson 1 → SRS Queue → Play 1 Game → Dashboard cập nhật đúng XP/streak.
4. **i18n smoke test** — mới thêm: đảm bảo không có string bị thiếu key khi build cả 2 locale.

### Manual
- UI/motion review (giữ như bản gốc): glassmorphism, responsive, 60fps.
- Kiểm thử timezone: giả lập user ở múi giờ khác UTC+7, xác nhận streak/dueDate tính đúng.

---

## 10. Câu hỏi cần chốt trước khi code (bổ sung so với bản gốc)

1. Docker Desktop có sẵn không, hay dùng SQLite/Supabase cho local dev? *(giữ từ bản gốc)*
2. Web Speech API mặc định, fallback OpenAI TTS khi nào? *(giữ từ bản gốc)*
3. **[MỚI]** Có cần UI đa ngôn ngữ (vi/en toggle) ngay ở MVP, hay chỉ tiếng Việt trước?
4. **[MỚI]** Deploy ở đâu — Vercel + Railway, hay tự host VPS?
5. **[MỚI]** Có dự định thêm cặp ngôn ngữ khác ngoài vi→en trong 6-12 tháng tới không? (quyết định mức độ đầu tư cho kiến trúc đa ngôn ngữ ở mục 6)
