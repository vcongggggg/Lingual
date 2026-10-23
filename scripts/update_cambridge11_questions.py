#!/usr/bin/env python3
"""
scripts/update_cambridge11_questions.py
Mục đích: Cập nhật trực tiếp questionsJson và scriptJson/passageJson cho đúng 21 bản ghi
Cambridge IELTS 11 Academic Tests 2, 3, 4 đã tồn tại trong database local linguaflow_db.
Tuyệt đối KHÔNG chèn bản ghi mới. Giữ nguyên số đếm 5 bảng: 100 / 76 / 308 / 68 / 600.
"""

import sys
import json
import psycopg2
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

DSN = 'postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db'
MAPPED_DIR = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-11")

EXPECTED_COUNTS = [
    ('ielts_reading_passages', 100),
    ('ielts_listening_sections', 76),
    ('ielts_writing_topics', 308),
    ('ielts_writing_models', 68),
    ('ielts_speaking_topics', 600)
]

def check_table_counts(cur, label: str):
    print(f"\n--- [KIỂM TRA SỐ ĐẾM 5 BẢNG: {label}] ---")
    all_ok = True
    for t, expected in EXPECTED_COUNTS:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        actual = cur.fetchone()[0]
        match = (actual == expected)
        if not match:
            all_ok = False
        print(f"  {t:26}: Thực tế = {actual:3} | Kỳ vọng = {expected:3} | {'KHỚP 100%' if match else 'LỆCH'}")
    if not all_ok:
        raise ValueError(f"LỖI: Số đếm bảng không khớp kỳ vọng tại bước {label}!")

def main():
    print("=" * 70)
    print("UPDATE CAMBRIDGE IELTS 11 TESTS 2, 3, 4 QUESTIONS (21 BẢN GHI)")
    print("=" * 70)

    conn = psycopg2.connect(DSN)
    cur = conn.cursor()

    try:
        # Bước 1: Kiểm tra số đếm trước khi update
        check_table_counts(cur, "TRƯỚC UPDATE")

        # Bước 2: Đọc file mapped
        with open(MAPPED_DIR / "ielts_reading_passages.json", "r", encoding="utf-8") as f:
            readings = json.load(f)
        with open(MAPPED_DIR / "ielts_listening_sections.json", "r", encoding="utf-8") as f:
            listenings = json.load(f)

        # Lọc đúng 9 bản ghi Reading Tests 2, 3, 4
        target_readings = [r for r in readings if any(r["id"].startswith(f"cam11-academic-t{t}-") for t in [2, 3, 4])]
        # Lọc đúng 12 bản ghi Listening Tests 2, 3, 4
        target_listenings = [l for l in listenings if any(l["id"].startswith(f"cam11-academic-t{t}-") for t in [2, 3, 4])]

        print(f"\n[*] Sẽ UPDATE {len(target_readings)} Reading Passages và {len(target_listenings)} Listening Sections...")

        # Update Reading Passages
        reading_updated_count = 0
        for r in target_readings:
            rid = r["id"]
            q_json = r["questionsJson"]  # Đã là serialized JSON string
            p_json = r["passageJson"]    # Đã là serialized JSON string
            cur.execute(
                'UPDATE "ielts_reading_passages" SET "questionsJson" = %s, "passageJson" = %s WHERE id = %s',
                (q_json, p_json, rid)
            )
            if cur.rowcount == 1:
                reading_updated_count += 1
            else:
                raise RuntimeError(f"Lỗi: Không tìm thấy hoặc update thất bại cho bản ghi {rid} (rowcount={cur.rowcount})")

        print(f"[OK] Đã UPDATE thành công {reading_updated_count}/9 Reading Passages.")

        # Update Listening Sections
        listening_updated_count = 0
        for l in target_listenings:
            lid = l["id"]
            q_json = l["questionsJson"]  # Đã là serialized JSON string
            s_json = l["scriptJson"]     # Đã là serialized JSON string
            cur.execute(
                'UPDATE "ielts_listening_sections" SET "questionsJson" = %s, "scriptJson" = %s WHERE id = %s',
                (q_json, s_json, lid)
            )
            if cur.rowcount == 1:
                listening_updated_count += 1
            else:
                raise RuntimeError(f"Lỗi: Không tìm thấy hoặc update thất bại cho bản ghi {lid} (rowcount={cur.rowcount})")

        print(f"[OK] Đã UPDATE thành công {listening_updated_count}/12 Listening Sections.")
        print(f"[OK] Tổng số bản ghi đã UPDATE: {reading_updated_count + listening_updated_count}/21 bản ghi.")

        # Bước 3: Kiểm tra số đếm sau khi update
        check_table_counts(cur, "SAU UPDATE")

        # Commit giao dịch
        conn.commit()
        print("\n[SUCCESS] Transaction committed successfully!")

    except Exception as e:
        conn.rollback()
        print(f"\n[ERROR] Rollback transaction do lỗi: {e}")
        raise e
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    main()
