# LinguaFlow Scripts Directory

Thư mục `scripts/` chứa toàn bộ các công cụ vận hành, nạp dữ liệu (data ingestion), kiểm thử bảo mật và đối soát chất lượng dữ liệu của dự án LinguaFlow.

Thư mục đã được tái cấu trúc thành các module chuyên biệt, giữ thư mục gốc tinh gọn tuyệt đối (chỉ còn `db_helper.py` và `README.md`).

---

## 1. Cấu Trúc Tổng Thể

```
scripts/
├── corpus/                        # [IELTS CORPUS] Quản lý dữ liệu Cambridge IELTS
│   ├── loaders/                   # Lightweight loaders (cambridgeXX_data_tY.py, 0 literal sách)
│   ├── importers/                 # Script nạp dữ liệu vào 5 bảng PostgreSQL (import_cambridge*.py)
│   ├── verifiers/                 # SELECT-only đối soát số lượng và đáp án (db_verify_*, verify_*)
│   └── helpers/                   # Công cụ hỗ trợ patch, parity check, migration columns
│
├── database/                      # [DATABASE] Công cụ bảo trì & kiểm thử database
│   ├── db_summary.ts              # Báo cáo tổng quan số lượng tất cả bảng trong DB
│   ├── db_verify.ts               # Kiểm tra phân bổ CEFR, audio, examples của từ vựng
│   └── test_clean_db_migrate_seed.ts # Kiểm thử migrate & seed tự động trên DB trắng
│
├── seeds/                         # [DATABASE SEEDING] Bộ seeding toàn diện cho dev & staging
│   ├── seed_catchup.ts            # Grammar, dialogues, stories, sentence bank
│   ├── seed_comprehensive_database.ts # Master comprehensive database seeder
│   ├── seed_notifications_for_tour.ts # Sample notifications phục vụ tour onboarding
│   └── seed_phase2_batch*.ts      # Các batch seed Phase 2 (2, 4B, 4C, 5A, 5B, 5C)
│
├── security/                      # [BẢO MẬT] Kiểm thử an toàn thông tin & xoay credentials
│   ├── pentest_simulator.ts       # Giả lập pentest API & Web (SQLi, IDOR, Rate-limit, XSS)
│   ├── rotate_postgres_password.py# Tự động xoay mật khẩu PostgreSQL an toàn
│   └── rotate_secrets.ts          # Xoay JWT secret, Session secret & API keys
│
├── qa/                            # [QA & AUDIT] Các bài test route, checklist kiểm thử DoD
│   ├── check_ci_status.py         # Kiểm tra trạng thái GitHub Actions CI runs
│   ├── qa_*_test.ts               # Test chuyên sâu từng route (reading, speaking, tutor...)
│   └── verify-*.mjs               # Checklist kiểm thử tính năng và giao diện
│
├── parsers/                       # Các parser trích xuất cấu trúc văn bản
│
├── archive/                       # [LƯU TRỮ LỊCH SỬ] Các script hoàn tất từ các task trước
│   ├── task_receipts/             # Biên lai nghiệm thu task cũ (send_*.py)
│   ├── screenshots/               # Script Playwright chụp màn hình UI
│   ├── crawlers/                  # Các bộ crawl dữ liệu từ web
│   ├── media_and_assets/          # Script tải và xử lý audio, mascot assets
│   ├── one_off_audits/            # Các script audit và fix lỗi cục bộ
│   └── legacy_imports/            # Các batch import dữ liệu từ Phase 1 và Phase 2
│
├── db_helper.py                   # [CORE] Module kết nối DB bảo mật & lấy DATABASE_URL
└── README.md                      # Hướng dẫn kiến trúc thư mục scripts
```

---

## 2. Quy Tắc Bảo Mật & Kỹ Thuật Khi Viết Script Mới

1. **Tuyệt đối không nhúng text sách vào mã nguồn:** Mọi nội dung IELTS Cambridge phải được nạp từ file JSON bên ngoài repository (`C:\Mod\muse-data-exchange`).
2. **Không commit mật khẩu trần:** Sử dụng `db_helper.py` để kết nối PostgreSQL thay vì hardcode password.
3. **Tuân thủ đúng thư mục chức năng:** Không lưu script bừa bãi ở thư mục gốc `scripts/`. Hãy đặt vào đúng thư mục con: `corpus/`, `database/`, `seeds/`, `security/`, `qa/`, hoặc `archive/`.
