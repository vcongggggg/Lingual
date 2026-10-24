# LinguaFlow Scripts Directory

Thư mục `scripts/` chứa toàn bộ các công cụ vận hành, nạp dữ liệu (data ingestion), kiểm thử bảo mật và đối soát chất lượng dữ liệu của dự án LinguaFlow.

---

## 1. Cấu Trúc Tổng Thể

```
scripts/
├── cambridge*_data_t*.py          # [CORE] Lightweight data loaders cho Cambridge IELTS
├── import_cambridge*.py           # [CORE] Script nạp dữ liệu IELTS Cambridge vào PostgreSQL
├── db_verify_cambridge*.py        # [CORE] Script kiểm thử & đối soát độc lập phía Database
├── db_helper.py                   # [CORE] Module kết nối DB bảo mật & lấy DATABASE_URL
├── pentest_simulator.ts           # [CORE] Bộ kiểm thử bảo mật API & Web (chạy qua pnpm pentest)
├── seed_*.ts                      # [CORE] Seeding data mẫu phục vụ môi trường dev & staging
├── test_clean_db_migrate_seed.ts  # [CORE] Kiểm thử deploy & migrate tự động trên DB trắng
│
├── parsers/                       # Các parser chuyên biệt trích xuất cấu trúc văn bản
├── qa/                            # [QA & AUDIT] Các bài test route, checklist kiểm thử DoD
│   ├── qa_*_test.ts               # Test chuyên sâu từng route (reading, speaking, tutor...)
│   └── verify-*.mjs               # Checklist kiểm thử tính năng và giao diện
│
└── archive/                       # [LƯU TRỮ LỊCH SỬ] Các script tạm thời từ các task trước
    ├── task_receipts/             # Các script gửi báo cáo task_done cũ (send_*.py)
    ├── screenshots/               # Script Playwright chụp màn hình UI (capture-*.mjs)
    ├── crawlers/                  # Các bộ crawl dữ liệu nội dung từ web
    ├── media_and_assets/          # Script tải và xử lý audio, mascot, cow assets
    ├── one_off_audits/            # Các script audit và fix lỗi cục bộ trong quá khứ
    └── legacy_imports/            # Các batch import dữ liệu từ Phase 1 và Phase 2
```

---

## 2. Các Script Cốt Lõi Tại Thư Mục Gốc

| Tệp / Nhóm Tệp | Mô Tả Chức Năng |
| :--- | :--- |
| `cambridge{XX}_data_t{Y}.py` | Lightweight loader đọc JSON ngoài repo (`C:\Mod\muse-data-exchange\book-corpus-mapped\`) cho từng Test. Đảm bảo 0 literal sách trong repo. |
| `import_cambridge{XX}_*.py` | Import dữ liệu IELTS vào 5 bảng PostgreSQL (`ielts_reading_passages`, `ielts_listening_sections`, `ielts_writing_topics`, `ielts_writing_models`, `ielts_speaking_topics`). |
| `db_verify_cambridge{XX}_*.py`| Độc lập SELECT-only đối soát số lượng bản ghi và đáp án vs Answer Key in gốc. |
| `db_helper.py` | Quản lý credentials tập trung cho mọi script Python truy vấn PostgreSQL. |
| `pentest_simulator.ts` | Giả lập tấn công khai thác bảo mật (SQLi, IDOR, Rate-limit, XSS, Broken Auth). |
| `seed_*.ts` | Nạp dữ liệu seed chuẩn hóa cho ngữ pháp, idioms, shadowing, hội thoại. |

---

## 3. Quy Tắc Bảo Mật & Kỹ Thuật Khi Viết Script Mới

1. **Tuyệt đối không nhúng text sách vào mã nguồn:** Mọi nội dung IELTS Cambridge phải được nạp từ file JSON bên ngoài repository (`C:\Mod\muse-data-exchange`).
2. **Không commit mật khẩu trần:** Sử dụng `db_helper.py` để kết nối PostgreSQL thay vì hardcode password.
3. **Phân loại script sau khi xong:** Script dùng một lần (one-off) phục vụ nhiệm vụ tạm thời nên được lưu trữ vào `scripts/archive/` để giữ thư mục gốc luôn tinh gọn và dễ bảo trì.
