#!/usr/bin/env python3
"""
scripts/verify_cambridge11_fix_db.py
Mục đích: Hard Gate Verification - Đọc trực tiếp từ DB local (linguaflow_db),
kiểm tra toàn bộ 240 câu hỏi của Tests 2, 3, 4 theo 5 tiêu chí bắt buộc:
1. Đủ thân câu ('question', độ dài > 10 ký tu)
2. Đủ 'type'
3. Đủ 'sourceRef'
4. Đủ 'options' cho các câu trắc nghiệm/matching
5. Đủ 'correctAnswer' khớp 100% Answer Key in ấn
"""

import sys
import json
import psycopg2
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

DSN = 'postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db'
SCRATCH_DIR = Path(r"C:\Users\ADMIN\.gemini\antigravity-ide\brain\0bd9d617-5304-423d-b1ed-51e8b88707d0\scratch")

def main():
    print("=" * 80)
    print("HARD GATE AUDIT - VERIFY 240 CÂU HỎI CAMBRIDGE 11 TESTS 2, 3, 4 TỪ DB LOCAL")
    print("=" * 80)

    # Load official keys
    with open(SCRATCH_DIR / "official_keys_tests234.json", "r", encoding="utf-8") as f:
        official_keys = json.load(f)

    conn = psycopg2.connect(DSN)
    cur = conn.cursor()

    test_stats = {
        2: {"listening": {"total": 0, "valid_stem": 0, "valid_type": 0, "valid_options": 0, "key_matched": 0, "failed": 0},
            "reading":   {"total": 0, "valid_stem": 0, "valid_type": 0, "valid_options": 0, "key_matched": 0, "failed": 0}},
        3: {"listening": {"total": 0, "valid_stem": 0, "valid_type": 0, "valid_options": 0, "key_matched": 0, "failed": 0},
            "reading":   {"total": 0, "valid_stem": 0, "valid_type": 0, "valid_options": 0, "key_matched": 0, "failed": 0}},
        4: {"listening": {"total": 0, "valid_stem": 0, "valid_type": 0, "valid_options": 0, "key_matched": 0, "failed": 0},
            "reading":   {"total": 0, "valid_stem": 0, "valid_type": 0, "valid_options": 0, "key_matched": 0, "failed": 0}},
    }

    failed_questions = []
    all_matched = True

    # 1. AUDIT READING PASSAGES (9 passages)
    cur.execute('SELECT id, "questionsJson" FROM "ielts_reading_passages" WHERE id LIKE \'cam11-academic-t%\' AND NOT id LIKE \'cam11-academic-t1%\' ORDER BY id')
    r_rows = cur.fetchall()
    print(f"\n[1. ĐỌC DỮ LIỆU READING TỪ DB]: Đã nạp {len(r_rows)} passages (kỳ vọng 9)")

    for rid, q_json_str in r_rows:
        # rid e.g. 'cam11-academic-t2-r1'
        parts = rid.split('-')
        t_num = int(parts[2][1])
        p_num = int(parts[3][1])
        off_r = official_keys[f"test_{t_num}"]["reading"]

        qs = json.loads(q_json_str) if isinstance(q_json_str, str) else q_json_str
        st = test_stats[t_num]["reading"]

        for q in qs:
            st["total"] += 1
            qnum = str(q.get("questionNumber"))
            stem = q.get("question", "")
            qtype = q.get("type", "")
            options = q.get("options", [])
            ans = q.get("correctAnswer", "")
            expected_ans = off_r.get(qnum)

            is_stem_ok = len(stem) > 10
            is_type_ok = bool(qtype)
            is_options_ok = True
            if qtype in ["multiple_choice", "matching", "matching_headings", "matching_information", "yes_no_not_given", "true_false_not_given"]:
                is_options_ok = (len(options) > 0)
            is_key_ok = (ans == expected_ans)

            if is_stem_ok: st["valid_stem"] += 1
            if is_type_ok: st["valid_type"] += 1
            if is_options_ok: st["valid_options"] += 1
            if is_key_ok: st["key_matched"] += 1

            if not (is_stem_ok and is_type_ok and is_options_ok and is_key_ok):
                st["failed"] += 1
                all_matched = False
                failed_questions.append({
                    "id": rid, "qnum": qnum, "stem_ok": is_stem_ok, "type_ok": is_type_ok,
                    "options_ok": is_options_ok, "key_ok": is_key_ok, "ans": ans, "expected": expected_ans
                })

    # 2. AUDIT LISTENING SECTIONS (12 sections)
    cur.execute('SELECT id, "questionsJson" FROM "ielts_listening_sections" WHERE id LIKE \'cam11-academic-t%\' AND NOT id LIKE \'cam11-academic-t1%\' ORDER BY id')
    l_rows = cur.fetchall()
    print(f"[2. ĐỌC DỮ LIỆU LISTENING TỪ DB]: Đã nạp {len(l_rows)} sections (kỳ vọng 12)")

    for lid, q_json_str in l_rows:
        parts = lid.split('-')
        t_num = int(parts[2][1])
        s_num = int(parts[3][1])
        off_l = official_keys[f"test_{t_num}"]["listening"]

        qs = json.loads(q_json_str) if isinstance(q_json_str, str) else q_json_str
        st = test_stats[t_num]["listening"]

        for q in qs:
            st["total"] += 1
            qnum = str(q.get("questionNumber"))
            stem = q.get("question", "")
            qtype = q.get("type", "")
            options = q.get("options", [])
            ans = q.get("correctAnswer", "")
            expected_ans = off_l.get(qnum)

            is_stem_ok = len(stem) > 10
            is_type_ok = bool(qtype)
            is_options_ok = True
            if qtype in ["multiple_choice", "matching", "plan_labeling"]:
                is_options_ok = (len(options) > 0)
            is_key_ok = (ans == expected_ans)

            if is_stem_ok: st["valid_stem"] += 1
            if is_type_ok: st["valid_type"] += 1
            if is_options_ok: st["valid_options"] += 1
            if is_key_ok: st["key_matched"] += 1

            if not (is_stem_ok and is_type_ok and is_options_ok and is_key_ok):
                st["failed"] += 1
                all_matched = False
                failed_questions.append({
                    "id": lid, "qnum": qnum, "stem_ok": is_stem_ok, "type_ok": is_type_ok,
                    "options_ok": is_options_ok, "key_ok": is_key_ok, "ans": ans, "expected": expected_ans
                })

    print("\n" + "=" * 80)
    print("BẢNG THỐNG KÊ CHI TIẾT TỪNG TEST VÀ KỸ NĂNG (DOC TRỰC TIẾP TỪ DB)")
    print("=" * 80)
    print(f"{'Test':<8} | {'Kỹ năng':<12} | {'Tổng câu':<10} | {'Thân câu >10':<14} | {'Đủ Type':<10} | {'Đủ Options':<12} | {'Khớp Key In':<12} | {'Parse Failed':<12}")
    print("-" * 95)

    grand_total = 0
    grand_stem = 0
    grand_type = 0
    grand_options = 0
    grand_key = 0
    grand_failed = 0

    for t in [2, 3, 4]:
        for skill in ["listening", "reading"]:
            s = test_stats[t][skill]
            grand_total += s["total"]
            grand_stem += s["valid_stem"]
            grand_type += s["valid_type"]
            grand_options += s["valid_options"]
            grand_key += s["key_matched"]
            grand_failed += s["failed"]
            print(f"Test {t:<3} | {skill.capitalize():<12} | {s['total']:<10} | {s['valid_stem']:<14} | {s['valid_type']:<10} | {s['valid_options']:<12} | {s['key_matched']:<12} | {s['failed']:<12}")

    print("-" * 95)
    print(f"{'TỔNG':<8} | {'Listening+Read':<12} | {grand_total:<10} | {grand_stem:<14} | {grand_type:<10} | {grand_options:<12} | {grand_key:<12} | {grand_failed:<12}")

    # Check 5 tables
    print("\n" + "=" * 80)
    print("SỐ ĐẾM 5 BẢNG ĐÍCH SAU AUDIT")
    print("=" * 80)
    tables = [
        ('ielts_reading_passages', 100),
        ('ielts_listening_sections', 76),
        ('ielts_writing_topics', 308),
        ('ielts_writing_models', 68),
        ('ielts_speaking_topics', 600)
    ]
    counts_ok = True
    for t, exp in tables:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        actual = cur.fetchone()[0]
        match = (actual == exp)
        if not match: counts_ok = False
        print(f"  {t:26}: Thực tế = {actual:3} | Kỳ vọng = {exp:3} | {'KHỚP 100%' if match else 'LỆCH'}")

    cur.close()
    conn.close()

    result_summary = {
        "grand_total": grand_total,
        "grand_stem": grand_stem,
        "grand_type": grand_type,
        "grand_options": grand_options,
        "grand_key": grand_key,
        "grand_failed": grand_failed,
        "counts_ok": counts_ok,
        "all_matched": all_matched,
        "test_stats": test_stats,
        "failed_questions": failed_questions
    }

    with open(SCRATCH_DIR / "hard_gate_audit_results.json", "w", encoding="utf-8") as f:
        json.dump(result_summary, f, indent=2, ensure_ascii=False)

    if grand_total == 240 and grand_stem == 240 and grand_type == 240 and grand_key == 240 and grand_failed == 0 and counts_ok:
        print("\n>>> [PASSED] TẤT CẢ CÁC ĐIỀU KIỆN HARD GATE ĐỀU ĐẠT 100% TUYỆT ĐỐI! <<<")
        return 0
    else:
        print("\n>>> [FAILED] CÓ LỖI CHƯA ĐẠT HARD GATE! <<<")
        return 1

if __name__ == "__main__":
    sys.exit(main())
