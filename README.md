# Lingual (LinguaFlow) — Nền Tảng Học Tiếng Anh Toàn Diện & Luyện Thi IELTS

[![CI Pipeline](https://github.com/vcongggggg/Lingual/actions/workflows/ci.yml/badge.svg)](https://github.com/vcongggggg/Lingual/actions/workflows/ci.yml)
[![Node.js Version](https://img.shields.io/badge/Node.js-20%20%7C%2022-brightgreen.svg)](https://nodejs.org/)
[![pnpm Version](https://img.shields.io/badge/pnpm-11.9.0-orange.svg)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

Lingual là nền tảng học tiếng Anh hiện đại với ngôn ngữ thiết kế **"Sổ Tay Giấy" (Editorial Paper Notebook)** kết hợp linh vật **Bò sữa LingLing**. Hệ thống tích hợp toàn diện các phương pháp học tập khoa học (Spaced Repetition, Shadowing, Dictation), luyện phát âm trực tiếp, luyện viết câu/đoạn, từ điển tra cứu ngữ cảnh, phòng thi thử IELTS 4 kỹ năng và trung tâm trò chơi tương tác.

---

## 🎨 Ngôn Ngữ Thiết Kế: "Sổ Tay Giấy" & Linh Vật LingLing

- **Cảm giác vật lý ấm áp:** Nền giấy kraft ấm áp (`#FAF5EA`), lưới chấm mực mộc mạc, thẻ bài học xếp lớp với băng dính kẹp giấy và con dấu dập nổi.
- **Mực in dứt khoát:** Viền mực đen nâu 2px (`#211A13`), hiệu ứng đổ bóng lệch dập nổi cứng cáp (hard offset shadow), không mờ nhòe, không "AI Slop" bóng bẩy công nghiệp.
- **Linh vật LingLing:** Đồng hành cùng người học ở từng bài học, dải điểm danh chuỗi ngày học, phòng thi và góc giải trí.
- **Ngôn ngữ thuần Việt:** Giao diện tự nhiên, gần gũi, sử dụng bảng thuật ngữ học tập chuẩn mực và loại bỏ thuật ngữ máy móc.

---

## 🏗️ Kiến Trúc Hệ Thống (Monorepo)

Hệ thống được tổ chức dạng Monorepo quản lý bởi **pnpm workspaces**:

```
LinguaFlow/
├── apps/
│   ├── api/                 # Backend RESTful API (Express + Prisma + PostgreSQL + Redis)
│   ├── web/                 # Giao diện chính thức Next.js 15 Standalone ("Sổ Tay Giấy")
│   └── web-old-archive/     # Lưu trữ lịch sử giao diện tiền nhiệm
├── packages/
│   ├── contracts/           # DTOs, API Contracts & Shared TypeScript Interfaces
│   └── domain/              # Logic cốt lõi, mô hình đánh giá & thuật ngữ học tập
├── prisma/                  # Prisma Schema, Migrations & Database Seeders
├── docs/                    # Tài liệu kiến trúc, hướng dẫn triển khai & đặc tả giao diện
│   ├── DEPLOY.md            # Hướng dẫn triển khai Docker Compose Production
│   ├── UI_REDESIGN.md       # Đặc tả Design System "Sổ Tay Giấy"
│   └── SECURITY.md          # Chính sách bảo mật & phân quyền
├── scripts/                 # Scripts kiểm thử, crawl dữ liệu và QA tự động
└── docker-compose.yml       # Production Stack (Web, API, Postgres, Redis)
```

---

## 🚀 Khởi Chạy Nhanh (Local Development)

### Yêu Cầu Tiên Quyết
- Node.js >= 20 (Khuyến nghị Node.js 22 LTS)
- pnpm >= 11.9.0
- Docker & Docker Compose (cho PostgreSQL và Redis)

### 1. Cài đặt Dependencies
```bash
pnpm install
```

### 2. Cấu hình Môi trường
Sao chép tệp mẫu và cập nhật các biến môi trường:
```bash
cp .env.example .env
```

### 3. Khởi tạo Cơ sở dữ liệu
```bash
# Khởi chạy PostgreSQL và Redis nội bộ
docker compose up -d postgres redis

# Chạy Prisma migration và seed dữ liệu mẫu
pnpm exec prisma db push
pnpm exec prisma db seed
```

### 4. Khởi chạy Ứng dụng
```bash
# Khởi chạy đồng thời API (cổng 4000) và Web (cổng 3000)
pnpm dev

# Hoặc khởi chạy từng thành phần riêng biệt:
pnpm --filter @linguaflow/api dev   # API tại http://localhost:4000
pnpm --filter web dev               # Web tại http://localhost:3000
```

---

## 🐳 Triển Khai Production (Docker Compose)

Hệ thống hỗ trợ đóng gói container đa tầng (multi-stage build) tự động:

```bash
# Build và chạy toàn bộ cụm dịch vụ Production
docker compose up -d --build

# Xem logs vận hành
docker compose logs -f web
docker compose logs -f api
```

Chi tiết các biến môi trường và kịch bản vận hành được quy định tại [docs/DEPLOY.md](file:///c:/Study/HocKy6/LinguaFlow/docs/DEPLOY.md).

---

## 🧪 Kiểm Thử & Đảm Bảo Chất Lượng (QA / CI)

```bash
# Typecheck toàn bộ workspace (0 lỗi)
pnpm --filter web exec tsc --noEmit
pnpm --filter @linguaflow/api exec tsc --noEmit

# Lint mã nguồn
pnpm --filter web lint

# Build kiểm tra ứng dụng Web Next.js 15
pnpm --filter web build

# Kiểm thử Unit & Domain
pnpm --filter @linguaflow/domain test
pnpm --filter @linguaflow/api test
```

---

## 📜 Giấy Phép, Nguồn Dữ Liệu & Ghi Công (Attribution)

- Dự án phát triển phục vụ học phần và đồ án công nghệ Lingual / LinguaFlow.
- **Câu ví dụ:** Tatoeba ([CC BY 2.0 FR](https://creativecommons.org/licenses/by/2.0/fr/))
- **Hội thoại & Luyện nghe:** VOA Learning English (Public Domain)
- **Truyện song ngữ & Văn học:** Project Gutenberg (Public Domain)

