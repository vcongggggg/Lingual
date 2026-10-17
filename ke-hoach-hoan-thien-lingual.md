# Kế hoạch hoàn thiện Lingual — PHIÊN BẢN DEVELOP (thay thế bản main)
**Spec cho coding agent. Đọc toàn bộ trước khi làm gì.**

## Tình hình thực tế (audit từ bằng chứng agent nộp ngày 17/10/2026)

Nhánh `develop` (a5267cd) là codebase thật, không phải vaporware:
- 640 files, ~47.900 dòng TS/TSX, `web build` pass, 167/167 domain tests pass, 48/55 API tests pass.
- Có thật: các Labs (Listening/Speaking/Reading/Writing/Vocabulary), Exams (IELTS/TOEIC/VSTEP...), Community, Analytics, AI Tutor, Playwright E2E.

**NHƯNG — căn bệnh cốt lõi từ main vẫn còn nguyên:**
- `MOCK_USERS` (mảng in-memory) vẫn là **source of truth** cho auth, RBAC (`middleware/rbac.ts:57`), repository (`repositories/user.repository.ts`), admin (`routes/admin.ts`). "Dual-mode repository persistence" thực chất vẫn đọc/ghi mock → restart server mất dữ liệu.
- `prisma/migrations` chỉ có 1 file SQL viết tay, KHÔNG phải Prisma Migrate chuẩn.
- 7/55 API tests fail vì `@prisma/client` chưa từng được generate → các đường code DB chưa bao giờ chạy.
- Root `pnpm test` exit 0 nhưng **vacuous** — không có workspace nào khai báo script test, CI "xanh" mà không test gì.
- Kết luận: các claim "production", "Phase 20 security hardening", "pentest verification" là **thổi phồng**. Develop = main + 48k dòng tính năng xây trên nền mock.

**Quyết định: đi từ `develop`, KHÔNG từ `main`.** Vứt 48k dòng code thật (build pass, test pass) để xây lại từ main là lãng phí. Nhưng develop phải trải qua **đại phẫu foundation** trước khi thêm bất cứ thứ gì.

## Quy tắc làm việc (giữ 8 quy tắc cũ + thêm 2)

9. **ĐÓNG BĂNG SCOPE.** Từ giờ tới khi Phase D4 xong: cấm thêm tính năng/lab/route mới. Chỉ sửa những gì plan liệt kê.
10. **Mọi claim "đã xong / production / secure" phải chứng minh bằng lệnh chạy.** Không có output thì coi như chưa làm.

Branch: mọi việc làm trên `feature/<ten-phase>` tách từ `develop`, merge về `develop`. `main` giữ nguyên cho tới khi develop production-ready → lúc đó mới merge + tag release.

---

## Phase D0 — Inventory & đóng băng (ước lượng: 1h)

### Việc cần làm
- [ ] Chạy và lưu output: `grep -rn "MOCK_" apps/api/src --include='*.ts' | wc -l` + full list vào file `docs/INVENTORY.md`.
- [ ] Liệt kê toàn bộ files trong `apps/api/src/repositories/`, `apps/api/src/middleware/`, `apps/api/src/routes/` vào `docs/INVENTORY.md`, đánh dấu file nào dùng mock, file nào dùng Prisma thật.
- [ ] Liệt kê toàn bộ test suites + trạng thái hiện tại (pass/fail/vacuous) vào `docs/INVENTORY.md`.
- [ ] Xóa/duyệt các file docs "audit report" thổi phồng nếu chứa claim sai (ghi rõ trong commit message).

### Definition of Done
- File `docs/INVENTORY.md` tồn tại, liệt kê đầy đủ 3 mục trên với số liệu từ lệnh chạy thật.
- Không có code mới nào được thêm trong phase này (chỉ docs + xóa).

---

## Phase D1 — Prisma Migrate thật (ước lượng: 2–3h)

### Việc cần làm
- [ ] Chuyển file SQL thủ công `prisma/migrations/20260912_expanded_core_schema.sql` thành migration chuẩn Prisma Migrate (thư mục `prisma/migrations/<timestamp>_init/` + `migration.sql`). Xóa file cũ sau khi chuyển xong và verify.
- [ ] Thêm `prisma generate` vào pipeline: `"postinstall": "prisma generate"` ở root (hoặc prebuild của api) — fresh clone phải generate được client mà không cần làm tay.
- [ ] Schema Prisma phải khớp 100% với models mà repositories sẽ dùng ở Phase D2 (bổ sung model thiếu: audit log, bookmark, v.v. — liệt kê trong INVENTORY).
- [ ] Viết `prisma/seed.ts` seed dữ liệu thật (users demo có flag, curriculum, IELTS) chạy bằng `prisma db seed`.

### Definition of Done (mô phỏng fresh clone)
```bash
rm -rf node_modules && pnpm install --frozen-lockfile   # phải tự prisma generate, không lỗi
pnpm exec prisma migrate deploy                          # chạy được trên DB trống
cd apps/api && pnpm exec tsc --noEmit                    # pass, không lỗi PrismaClient
```

---

## Phase D2 — Đại phẫu repository: xóa mock làm source of truth (việc lớn nhất, 4–6h)

### Việc cần làm
- [ ] Với MỖI repository trong `apps/api/src/repositories/`: implement Prisma-backed thật (CRUD qua `@prisma/client`). Giữ nguyên interface (đây là điểm cộng của kiến trúc hiện tại — chỉ thay implementation).
- [ ] `middleware/rbac.ts`: đọc role từ DB qua repository, KHÔNG từ `MOCK_USERS`.
- [ ] `middleware/auditLog.ts`: ghi audit log vào DB (model `AuditLog`), KHÔNG vào mảng memory.
- [ ] `routes/admin.ts`, `routes/auth.ts`: đi qua repository layer, không import trực tiếp `MOCK_USERS`.
- [ ] Sau cùng: `grep -rn "MOCK_" apps/api/src --include='*.ts'` → chỉ còn lại trong test fixtures (nếu có), kèm comment giải thích. Production code: **0 kết quả**.
- [ ] JWT_SECRET: bắt buộc từ env, không fallback hardcode (kiểm tra lại claim "hardening" cũ).

### Definition of Done (test như tester thật)
1. Register user A → login → restart API server → login lại bằng cùng credential → **phải thành công** (chứng minh không còn in-memory).
2. User A đổi role của user B qua API với token của A (không phải admin) → **phải bị 403** (RBAC chạy trên DB thật).
3. Tạo audit log (vd login) → restart server → `GET /admin/audit-logs` (admin) → **log còn đó**.

---

## Phase D3 — Test integrity (ước lượng: 2h)

### Việc cần làm
- [ ] Fix 7 API tests đang fail vì Prisma client chưa init (sau D1+D2 chúng phải chạy được trên DB test/ephemeral).
- [ ] Root `package.json`: khai báo script `test` thật cho từng workspace (domain/api/web) — cấm vacuous pass. `pnpm --recursive test` phải chạy test thật.
- [ ] Sửa CI (`.github/workflows/ci.yml`): pnpm 11, `--frozen-lockfile`, jobs = domain test + api test + api typecheck + web build + web lint + `prisma validate`. Trigger cả `develop`.
- [ ] Chạy Playwright E2E suite (`apps/web/e2e/`), báo cáo kết quả thật (pass/fail từng spec, không giấu).

### Tester checklist (chạy tay sau khi D1+D2 xong — mỗi mục ghi: bước, lệnh, kết quả mong đợi, kết quả thực tế, PASS/FAIL)
**A. Auth & RBAC:** (1) register → login → /me = 200 đúng user; (2) register trùng email → 400; (3) sai password → 401; (4) /me không token → 401; (5) restart API → login lại credential cũ → 200 (chứng minh hết in-memory); (6) non-admin đổi role user khác → 403; (7) user A đọc dữ liệu user B (IDOR) → 403/404.
**B. SRS:** (1) GET /srs/queue → items; (2) POST /srs/review quality=5 → 200 + XP; (3) quality=99 → **400** (bug: trước đây chấp nhận — phải fix ở D2); (4) quality=-1 → 400.
**C. Curriculum:** (1) GET /curriculum/units; (2) submit lesson < 2s → 400 anti-cheat; (3) submit đúng flow → chấm theo đúng unit của lesson (bug main: luôn chấm Unit 1).
**D. Games:** (1) GET /games/data?type=... đúng type; (2) submit → leaderboard cập nhật, restart không mất.
**E. IELTS:** (1) GET đề thi có câu hỏi thật; (2) submit 2 lần cùng đáp án → **cùng điểm** (cấm random); (3) writing evaluate có feedback nội dung thật.
**F. Dictionary:** (1) search có kết quả; (2) bookmark → restart → còn.
**G. Admin:** (1) non-admin GET /admin/* → 403; (2) audit logs còn sau restart.
**H. Chatbot SSE:** POST /chatbot/chat → stream SSE có nội dung.

### Definition of Done
- `pnpm --recursive test`: tất cả suites chạy thật, 0 fail (hoặc fail nào cũng có issue ghi nhận + plan fix).
- Toàn bộ tester checklist A–H: PASS (mục nào FAIL phải fix hoặc ghi issue + plan).
- CI xanh trên PR vào `develop`.


---

## Phase D4 — Security verification (ước lượng: 2–3h)

Verify lại TỪNG claim "hardening" cũ bằng test thật, không tin commit message:
- [ ] JWT: không fallback secret; token hết hạn đúng; refresh (nếu có) đúng chuẩn.
- [ ] RBAC 5 roles: ma trận test — mỗi role × mỗi route nhạy cảm → đúng 200/403. RBAC chạy trên DB thật (sau D2).
- [ ] Rate limiting: login brute-force 20 lần → 429.
- [ ] Helmet headers, CORS origin từ env, không lộ stack trace ở production.
- [ ] OWASP quick pass: SQL injection (Prisma parameterized — verify), XSS (không có dangerouslySetInnerHTML với user input), IDOR (user A không đọc/sửa dữ liệu user B).
- [ ] Xóa các file "pentest report" cũ nếu không có bằng chứng chạy thật đi kèm.

### Definition of Done
- File `docs/SECURITY.md`: checklist trên, mỗi mục có lệnh test + kết quả.

---

## Phase D5 — Scope triage + trung thực (ước lượng: 1–2h, CẦN USER)

### Việc cần làm
- [ ] Lập bảng toàn bộ Labs/features trên develop (Listening/Speaking/Reading/Writing/Vocabulary/Exams/Community/Analytics/Tutor...): mỗi dòng ghi trạng thái thật (hoạt động / dở dang / chỉ có UI).
- [ ] **Hỏi user**: lab nào GIỮ, lab nào CẮT (đưa về draft hoặc xóa). Không tự quyết.
- [ ] Quét toàn repo các claim số liệu ("production", số lượng, "AI chấm") → sửa cho trung thực hoặc xóa.
- [ ] Health check API: trả version thật từ package.json, không chữ "Production Ready" nếu chưa deploy.

### Definition of Done
- User đã chốt danh sách features giữ/cắt (ghi vào `docs/SCOPE.md`).
- Không còn claim sai trong code/docs/UI.

---

## Phase D6 — Deploy (giữ nguyên cơ chế quyết định)

Agent làm **Bước 6.0** như bản plan cũ: liệt kê thông tin thiếu → hỏi user nếu cần → đủ thì tự chọn Option A (VPS + Docker, khuyến nghị vì đã có docker-compose) hoặc B (Vercel + managed), viết lý do vào đầu `DEPLOY.md` rồi implement. DoD: deploy thật, 2 users, restart container không mất dữ liệu.

---

## Riêng về UI redesign (tách khỏi 6 phase trên)

Develop có ~62 routes UI — redesign toàn bộ là dự án riêng, KHÔNG làm song song với đại phẫu backend. Thứ tự:
1. Xong D0–D4 (foundation vững).
2. User xem UI develop hiện tại, chốt: (a) giữ UI develop, chỉ polish; hay (b) áp design system mới (mockup giấy + linh vật đã duyệt) cho toàn bộ.
3. Viết UI spec riêng rồi mới implement.

---

## Phụ lục — Lệnh verify nhanh

```bash
pnpm install --frozen-lockfile
pnpm exec prisma validate && pnpm exec prisma migrate deploy
pnpm --recursive test
cd apps/api && pnpm exec tsc --noEmit
pnpm --filter web build
grep -rn "MOCK_" apps/api/src --include='*.ts' | grep -v test | grep -v fixtures
```
