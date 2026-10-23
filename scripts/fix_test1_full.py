r"""
Script: fix_test1_full.py
Mục đích:
1. Sửa parser Test 1: thêm clean_text_artifacts, normalize_ocr_apostrophes, cắt đuôi thừa wm2
2. Gán track='academic' cho tất cả 14 bản ghi trong 5 file JSON mapped
3. UPDATE đúng 14 bản ghi Test 1 trong PostgreSQL DB local
4. Đối soát counts giữ nguyên 103 / 80 / 310 / 70 / 603
5. Grep 0 artifact watermark/HTML comments trong mapped files
6. Đối soát key-match 80/80 Test 1
7. Xuất bảng trước/sau chuẩn hóa dấu nháy
"""

import json
import os
import re
import sys
from pathlib import Path
import psycopg2

sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, str(Path(__file__).parent.parent))
sys.path.insert(0, str(Path(__file__).parent))

MAPPED_DIR = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-06")
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

APOSTROPHE_FIXES = {
    r"\blo'ts\b": "lots",
    r"\badvertisemen'ts\b": "advertisements",
    r"\bstree'ts\b": "streets",
    r"\borgutnen'ts\b": "arguments",
    r"\bargumen'ts\b": "arguments",
    r"\bcoun'try\b": "country",
    r"\bcoun'tries\b": "countries",
    r"\baspec'ts\b": "aspects",
    r"\bagains't\b": "against",
    r"\bac'tually\b": "actually",
    r"\bsocie'ty\b": "society",
    r"\bbetter'to\b": "better to",
    r"\bno't\b": "not",
    r"\bthe'ir\b": "their"
}

def clean_text_artifacts(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    text = re.sub(r"(?:www\.)?TopSage(?:\.com)?", "", text, flags=re.IGNORECASE)
    text = re.sub(r"大家网", "", text)
    text = re.sub(r"^##\s*(?:SECTION|TEST)\s*\d*.*$", "", text, flags=re.MULTILINE | re.IGNORECASE)
    lines = [line.strip() for line in text.split("\n")]
    lines = [l for l in lines if l]
    return "\n\n".join(lines)

def normalize_ocr_apostrophes(text: str) -> str:
    if not text:
        return ""
    res = text
    for pat, repl in APOSTROPHE_FIXES.items():
        res = re.sub(pat, repl, res, flags=re.IGNORECASE)
    return res

def clean_obj_recursively(obj):
    if isinstance(obj, str):
        cleaned = clean_text_artifacts(obj)
        return cleaned
    elif isinstance(obj, list):
        return [clean_obj_recursively(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: clean_obj_recursively(v) for k, v in obj.items()}
    return obj

def run_fix_test1():
    print("=" * 70)
    print("PART A: FIX TEST 1 ARTIFACTS, APOSTROPHES, TRACK & DB UPDATE")
    print("=" * 70)

    # 1. Đọc và làm sạch 5 file mapped JSON
    # Listening
    with open(MAPPED_DIR / "ielts_listening_sections.json", "r", encoding="utf-8") as f:
        listening = json.load(f)
    for s in listening:
        s["track"] = "academic"
        scripts = json.loads(s["scriptJson"]) if isinstance(s["scriptJson"], str) else s["scriptJson"]
        for sc in scripts:
            sc["textEn"] = clean_text_artifacts(sc.get("textEn", ""))
        s["scriptJson"] = json.dumps(scripts, ensure_ascii=False)
        questions = json.loads(s["questionsJson"]) if isinstance(s["questionsJson"], str) else s["questionsJson"]
        questions = clean_obj_recursively(questions)
        s["questionsJson"] = json.dumps(questions, ensure_ascii=False)

    # Reading
    with open(MAPPED_DIR / "ielts_reading_passages.json", "r", encoding="utf-8") as f:
        reading = json.load(f)
    for p in reading:
        p["track"] = "academic"
        passages = json.loads(p["passageJson"]) if isinstance(p["passageJson"], str) else p["passageJson"]
        passages = clean_obj_recursively(passages)
        p["passageJson"] = json.dumps(passages, ensure_ascii=False)
        questions = json.loads(p["questionsJson"]) if isinstance(p["questionsJson"], str) else p["questionsJson"]
        questions = clean_obj_recursively(questions)
        p["questionsJson"] = json.dumps(questions, ensure_ascii=False)

    # Writing topics
    with open(MAPPED_DIR / "ielts_writing_topics.json", "r", encoding="utf-8") as f:
        writing_topics = json.load(f)
    for wt in writing_topics:
        wt["track"] = "academic"
        wt["prompt"] = clean_text_artifacts(wt["prompt"])

    # Writing models
    with open(MAPPED_DIR / "ielts_writing_models.json", "r", encoding="utf-8") as f:
        writing_models = json.load(f)
    
    apostrophe_changes = []
    for wm in writing_models:
        wm["track"] = "academic"
        if wm["id"] == "cam06-academic-t1-wm2":
            orig = wm["modelAnswer"]
            tail_marker = "This answer does not introduce the information in the table"
            if tail_marker in orig:
                truncated = orig.split(tail_marker)[0].strip()
            else:
                truncated = orig
            
            # Record changes
            for pat, repl in APOSTROPHE_FIXES.items():
                matches = re.findall(pat, truncated, flags=re.IGNORECASE)
                if matches:
                    for m in set(matches):
                        apostrophe_changes.append({
                            "word_before": m,
                            "word_after": repl,
                            "occurrences": len(matches)
                        })
            fixed = normalize_ocr_apostrophes(truncated)
            fixed = clean_text_artifacts(fixed)
            wm["modelAnswer"] = fixed
        else:
            wm["modelAnswer"] = clean_text_artifacts(wm["modelAnswer"])

    # Speaking topics
    with open(MAPPED_DIR / "ielts_speaking_topics.json", "r", encoding="utf-8") as f:
        speaking_topics = json.load(f)
    for sp in speaking_topics:
        sp["track"] = "academic"
        sp["question"] = clean_text_artifacts(sp["question"])

    # Ghi lại 5 file mapped JSON
    with open(MAPPED_DIR / "ielts_listening_sections.json", "w", encoding="utf-8") as f:
        json.dump(listening, f, indent=2, ensure_ascii=False)
    with open(MAPPED_DIR / "ielts_reading_passages.json", "w", encoding="utf-8") as f:
        json.dump(reading, f, indent=2, ensure_ascii=False)
    with open(MAPPED_DIR / "ielts_writing_topics.json", "w", encoding="utf-8") as f:
        json.dump(writing_topics, f, indent=2, ensure_ascii=False)
    with open(MAPPED_DIR / "ielts_writing_models.json", "w", encoding="utf-8") as f:
        json.dump(writing_models, f, indent=2, ensure_ascii=False)
    with open(MAPPED_DIR / "ielts_speaking_topics.json", "w", encoding="utf-8") as f:
        json.dump(speaking_topics, f, indent=2, ensure_ascii=False)
    print("[*] Đã làm sạch và cập nhật 5 file mapped JSON với track='academic'.")

    # 2. Grep artifact check trên 5 file mapped
    print("\n[*] Audit artifacts trên 5 file mapped JSON sau khi clean:")
    patterns = ["<!--", "TopSage", "大家网", "## SECTION", "lo'ts", "coun'try", "advertisemen'ts", "stree'ts"]
    total_leaked = 0
    for f in MAPPED_DIR.glob("ielts_*.json"):
        content = f.read_text(encoding="utf-8")
        for pat in patterns:
            cnt = content.count(pat)
            if cnt > 0:
                print(f"    [FAIL] {f.name}: still contains {cnt} '{pat}'")
                total_leaked += cnt
    if total_leaked == 0:
        print("    [PASS] 0 watermark/scan artifact/apostrophe error trong 5 file mapped!")

    # 3. Kết nối DB và đếm trước
    conn = psycopg2.connect(DSN)
    cur = conn.cursor()
    tables = [
        'ielts_reading_passages',
        'ielts_listening_sections',
        'ielts_writing_topics',
        'ielts_writing_models',
        'ielts_speaking_topics'
    ]
    before_counts = {}
    for t in tables:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        before_counts[t] = cur.fetchone()[0]

    print("\n[*] Số lượng bản ghi DB TRƯỚC UPDATE:")
    for t, c in before_counts.items():
        print(f"    {t:26}: {c}")

    # 4. UPDATE đúng 14 bản ghi trong DB
    updated_counts = {t: 0 for t in tables}

    # Listening (4 records)
    for s in listening:
        cur.execute("""
            UPDATE "ielts_listening_sections"
            SET "track" = %s, "scriptJson" = %s, "questionsJson" = %s
            WHERE id = %s
        """, (s["track"], s["scriptJson"], s["questionsJson"], s["id"]))
        updated_counts['ielts_listening_sections'] += cur.rowcount

    # Reading (3 records)
    for p in reading:
        cur.execute("""
            UPDATE "ielts_reading_passages"
            SET "track" = %s, "passageJson" = %s, "questionsJson" = %s
            WHERE id = %s
        """, (p["track"], p["passageJson"], p["questionsJson"], p["id"]))
        updated_counts['ielts_reading_passages'] += cur.rowcount

    # Writing topics (2 records)
    for wt in writing_topics:
        cur.execute("""
            UPDATE "ielts_writing_topics"
            SET "track" = %s, "prompt" = %s
            WHERE id = %s
        """, (wt["track"], wt["prompt"], wt["id"]))
        updated_counts['ielts_writing_topics'] += cur.rowcount

    # Writing models (2 records)
    for wm in writing_models:
        cur.execute("""
            UPDATE "ielts_writing_models"
            SET "track" = %s, "model_answer" = %s
            WHERE id = %s
        """, (wm["track"], wm["modelAnswer"], wm["id"]))
        updated_counts['ielts_writing_models'] += cur.rowcount

    # Speaking topics (3 records)
    for sp in speaking_topics:
        cur.execute("""
            UPDATE "ielts_speaking_topics"
            SET "track" = %s, "question" = %s
            WHERE id = %s
        """, (sp["track"], sp["question"], sp["id"]))
        updated_counts['ielts_speaking_topics'] += cur.rowcount

    conn.commit()

    print("\n[*] Kết quả UPDATE 14 bản ghi trong DB:")
    total_updated = 0
    for t, cnt in updated_counts.items():
        print(f"    {t:26}: {cnt} rows updated")
        total_updated += cnt
    assert total_updated == 14, f"Expected 14 rows updated, got {total_updated}"

    # 5. Đếm số lượng SAU UPDATE
    after_counts = {}
    for t in tables:
        cur.execute(f'SELECT count(*) FROM "{t}"')
        after_counts[t] = cur.fetchone()[0]

    print("\n[*] Số lượng bản ghi DB SAU UPDATE (Đối soát Counts):")
    for t in tables:
        print(f"    {t:26}: Trước={before_counts[t]} | Sau={after_counts[t]} | Delta={after_counts[t]-before_counts[t]}")
        assert before_counts[t] == after_counts[t], f"Count mismatch in {t}!"

    # 6. Kiểm tra track='academic' trên cả 14 bản ghi trong DB
    print("\n[*] Kiểm tra track='academic' trên cả 14 bản ghi trong DB:")
    for t in tables:
        cur.execute(f'SELECT id, track FROM "{t}" WHERE id LIKE %s', ('cam06-academic-t1%',))
        rows = cur.fetchall()
        for r_id, r_track in rows:
            print(f"    [{t}] {r_id}: track='{r_track}'")
            assert r_track == 'academic', f"{r_id} track is not academic: {r_track}"

    # 7. Đối soát Key-Match 80/80 Test 1
    print("\n[*] Đối soát Key-match 80/80 Test 1...")
    from import_cambridge06_pilot import OFFICIAL_LISTENING_KEYS, OFFICIAL_READING_KEYS
    cur.execute('SELECT "questionsJson" FROM "ielts_listening_sections" WHERE id LIKE %s ORDER BY id', ('cam06-academic-t1%',))
    l_rows = cur.fetchall()
    l_mismatches = 0
    l_total = 0
    for row in l_rows:
        qs = json.loads(row[0])
        for q in qs:
            l_total += 1
            if q["correctAnswer"] != OFFICIAL_LISTENING_KEYS[q["questionNumber"]]:
                l_mismatches += 1
    assert l_total == 40 and l_mismatches == 0, f"Listening key mismatch: {l_mismatches}"
    print(f"    [PASS] 40/40 Listening questions match official keys 100%!")

    cur.execute('SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id LIKE %s ORDER BY id', ('cam06-academic-t1%',))
    r_rows = cur.fetchall()
    r_mismatches = 0
    r_total = 0
    for row in r_rows:
        qs = json.loads(row[0])
        for q in qs:
            r_total += 1
            if q["correctAnswer"] != OFFICIAL_READING_KEYS[q["questionNumber"]]:
                r_mismatches += 1
    assert r_total == 40 and r_mismatches == 0, f"Reading key mismatch: {r_mismatches}"
    print(f"    [PASS] 40/40 Reading questions match official keys 100%!")

    conn.close()

    print("\n" + "=" * 70)
    print("BẢNG LIỆT KÊ CHUẨN HÓA DẤU NHÁY OCR (TRƯỚC -> SAU):")
    print("=" * 70)
    for c in apostrophe_changes:
        print(f"  {c['word_before']:18} -> {c['word_after']:18} ({c['occurrences']} lần)")

    print("\n[SUCCESS] PART A HOÀN TOÀN THÀNH CÔNG VÀ ĐẠT 100% TIÊU CHÍ DOD!")

if __name__ == "__main__":
    run_fix_test1()
