# BÀN GIAO TIẾN ĐỘ TASK: lingual-map-cambridge10-tests234-001

## 1. Thông Tin Task
- **Task ID:** `lingual-map-cambridge10-tests234-001`
- **Mục tiêu:** Map + Import Cambridge IELTS 10 (Academic Tests 2, 3, 4) vào cơ sở dữ liệu PostgreSQL (`linguaflow_db`), đạt Hard Gate 80/80 câu hỏi mỗi test, `track='academic'`, commit push git develop và xuất file nghiệm thu `task_done`.

---

## 2. Những Việc ĐÃ HOÀN THÀNH
1. **Dữ liệu thô & Cleaned:**
   - Toàn bộ nội dung sách Cambridge 10 đã được bóc tách và làm sạch tại `C:\Mod\muse-data-exchange\book-corpus\cambridge-ielts-10-scan\`.
2. **Dữ liệu JSON Mapped đã sẵn sàng 100% tại `C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-10\`:**
   - `cam10-academic-test-1-data.json`
   - `cam10-academic-test-2-data.json`
   - `cam10-academic-test-3-data.json`
   - `cam10-academic-test-4-data.json`
   - `ielts_listening_sections.json`
   - `ielts_reading_passages.json`
   - `ielts_speaking_topics.json`
   - `ielts_writing_models.json`
   - `ielts_writing_topics.json`
   - `manifest.json`
3. **Các script loader trong `scripts/`:**
   - `scripts/cambridge10_data_t1.py`
   - `scripts/cambridge10_data_t2.py`
   - `scripts/cambridge10_data_t3.py`
   - `scripts/cambridge10_data_t4.py`

---

## 3. Các Bước CẦN THỰC HIỆN ĐỂ HOÀN THÀNH TASK
1. **Viết và chạy script import:** `scripts/import_cambridge10_tests234.py` (Tham khảo mẫu chuẩn tại `scripts/import_cambridge09_tests234.py`):
   - Đảm bảo `track='academic'` cho mọi bản ghi.
   - Kiểm tra Hard Gate Step 0: Đối chiếu 100% câu hỏi Reading & Listening với Answer Keys chính thức.
   - Nạp vào 5 bảng PostgreSQL: `ielts_reading_passages`, `ielts_listening_sections`, `ielts_writing_topics`, `ielts_writing_models`, `ielts_speaking_topics`.
2. **Viết và chạy script xác thực DB độc lập:** `scripts/db_verify_cambridge10_tests234.py` (Tham khảo mẫu tại `scripts/db_verify_cambridge09_tests234.py`).
3. **Git commit & push:**
   - Thực hiện commit code vào branch `develop` và push lên origin.
4. **Xuất file nghiệm thu Mailbox:**
   - Xuất file JSON nghiệm thu vào `C:\Mod\muse-mailbox\inbox\20261024-cambridge10-tests234-001-done.json` với cấu trúc:
     ```json
     {
       "id": "20261024-c10-t234-done",
       "ts": "...",
       "from": "agent",
       "to": "muse",
       "task_id": "lingual-map-cambridge10-tests234-001",
       "type": "task_done",
       "subject": "[HOÀN THÀNH] Map + Import Cam 10 Test 2-4 đạt chuẩn Hard Gate 80/80",
       "body": "Chi tiết kết quả nghiệm thu..."
     }
     ```
