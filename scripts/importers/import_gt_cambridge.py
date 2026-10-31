# -*- coding: utf-8 -*-
r"""
Script: import_gt_cambridge.py
Task ID: lingual-gt-import-001
Description: Import Cambridge General Training (Cam 01/02/03/05/08)
             reading sections, writing topics, and writing models into PostgreSQL.
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
import psycopg2

sys.stdout.reconfigure(encoding="utf-8")

GT_0508_PATH = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\gt\gt_mapped.json")
GT_010203_PATH = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\gt\gt_010203_mapped.json")
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

GATE1_EXPECTED = {
    "ielts_reading_passages": 260,
    "ielts_listening_sections": 308,
    "ielts_writing_topics": 424,
    "ielts_writing_models": 168,
    "ielts_speaking_topics": 726
}

GATE3_EXPECTED = {
    "ielts_reading_passages": 287,
    "ielts_listening_sections": 308,
    "ielts_writing_topics": 442,
    "ielts_writing_models": 186,
    "ielts_speaking_topics": 726
}

def check_step0_track_column(cur):
    print("=" * 80)
    print("[STEP 0] KIỂM TRA CỘT 'track' TRONG CÁC BẢNG IELTS")
    print("=" * 80)
    for table in GATE1_EXPECTED.keys():
        cur.execute(f"""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = '{table}' AND column_name = 'track'
        """)
        row = cur.fetchone()
        if not row:
            raise AssertionError(f"[STEP 0 FAIL] Bảng '{table}' thiếu cột 'track'! DỪNG LẠI.")
        print(f"  {table:26}: OK (cột track tồn tại)")
    print("[PASS] Step 0: Cột 'track' tồn tại trên toàn bộ các bảng IELTS!")

def verify_gate1(cur):
    print("\n" + "=" * 80)
    print("[GATE 1] KIỂM TRA SỐ LƯỢNG DATABASE TRƯỚC KHI IMPORT GT")
    print("=" * 80)
    counts = {}
    for table, exp in GATE1_EXPECTED.items():
        cur.execute(f'SELECT count(*) FROM "{table}"')
        actual = cur.fetchone()[0]
        counts[table] = actual
        print(f"  {table:26}: {actual} (Kỳ vọng: {exp})")
        if actual != exp:
            raise AssertionError(f"[GATE 1 FAIL] Bảng {table} có {actual} bản ghi, khác {exp}! DỪNG LẠI.")
    print("[PASS] Gate 1 toàn bộ thỏa mãn 100%!")
    return counts

def verify_gate3(cur):
    print("\n" + "=" * 80)
    print("[GATE 3] KIỂM TRA SỐ LƯỢNG DATABASE SAU KHI IMPORT GT")
    print("=" * 80)
    counts = {}
    for table, exp in GATE3_EXPECTED.items():
        cur.execute(f'SELECT count(*) FROM "{table}"')
        actual = cur.fetchone()[0]
        counts[table] = actual
        print(f"  {table:26}: {actual} (Kỳ vọng: {exp})")
        if actual != exp:
            raise AssertionError(f"[GATE 3 FAIL] Bảng {table} có {actual} bản ghi, khác {exp}!")
    print("[PASS] Gate 3 toàn bộ thỏa mãn 100%!")
    return counts

def run_import(dry_run=False):
    for p in [GT_0508_PATH, GT_010203_PATH]:
        if not p.exists():
            raise FileNotFoundError(f"Không tìm thấy file nguồn: {p}")

    with open(GT_0508_PATH, "r", encoding="utf-8") as f:
        data_0508 = json.load(f)
    with open(GT_010203_PATH, "r", encoding="utf-8") as f:
        data_0103 = json.load(f)

    all_items = data_0508 + data_0103
    assert len(all_items) == 63, f"Kỳ vọng 63 bản ghi GT, có {len(all_items)}"

    reading_items = [it for it in all_items if it.get("type") == "reading"]
    topic_items = [it for it in all_items if it.get("type") == "writing_topic"]
    model_items = [it for it in all_items if it.get("type") == "writing_model"]

    assert len(reading_items) == 27, f"Kỳ vọng 27 reading items, có {len(reading_items)}"
    assert len(topic_items) == 18, f"Kỳ vọng 18 writing topic items, có {len(topic_items)}"
    assert len(model_items) == 18, f"Kỳ vọng 18 writing model items, có {len(model_items)}"

    topic_map = {(it["book"], str(it["test"]), int(it["task"])): it for it in topic_items}

    conn = psycopg2.connect(DSN)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        # Step 0: Check track column
        check_step0_track_column(cur)

        # Step 1: Gate 1 Base counts
        base_counts = verify_gate1(cur)

        # Step 2: Duplicate check
        all_ids = [it["id"] for it in all_items]
        for table in ["ielts_reading_passages", "ielts_writing_topics", "ielts_writing_models"]:
            cur.execute(f'SELECT id FROM "{table}" WHERE id = ANY(%s)', (all_ids,))
            existing = [r[0] for r in cur.fetchall()]
            if existing:
                print(f"Warning: {len(existing)} IDs already exist in {table}: {existing}")

        now = datetime.now()

        # Step 3: Insert Reading Passages (27 records)
        print("\n--- Chèn 27 bản ghi Reading vào ielts_reading_passages ---")
        for r in reading_items:
            p_val = r.get("passageJson") or ""
            p_json = json.dumps(p_val, ensure_ascii=False) if isinstance(p_val, (list, dict)) else str(p_val)

            qs = r.get("questionsJson") or []
            if isinstance(qs, str):
                qs = json.loads(qs)

            # Preserve 8 absent-in-book questions in Cam 02 Test A with correctAnswer=None and flag
            for q in qs:
                if q.get("correctAnswer") == "absent-in-book":
                    q["correctAnswer"] = None
                    q["absentInBook"] = True
                    if not q.get("gapReason"):
                        q["gapReason"] = q.get("note") or "Omitted from printed answer key on Page 75 of Cambridge IELTS 2; recorded as absent-in-book per hard-gate rule."

            q_json = json.dumps(qs, ensure_ascii=False)

            cur.execute("""
                INSERT INTO "ielts_reading_passages" (
                    id, section, track, "cefrLevel", difficulty_band, title, module, notes,
                    source_url, "passageJson", "questionsJson", source, license, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                r["id"], str(r.get("section", "1")), "general", r.get("cefrLevel") or "B2",
                r.get("difficultyBand") or "6.0-7.0", r["title"], "general", r.get("sourceRef"),
                None, p_json, q_json, r.get("sourceRef") or r.get("book"),
                "Cambridge University Press (Educational/Research Corpus)", True, now
            ))

        # Step 4: Insert Writing Topics (18 records)
        print("--- Chèn 18 bản ghi Writing Topics vào ielts_writing_topics ---")
        for wt in topic_items:
            cur.execute("""
                INSERT INTO "ielts_writing_topics" (
                    id, track, prompt, type, "typeVi", band_range, "outlineJson", "keyVocabJson", source, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                wt["id"], "general", wt["prompt"], f"Task {wt.get('task', 1)}",
                None, None, "[]", "[]", wt.get("sourceRef") or wt.get("book"),
                True, now
            ))

        # Step 5: Insert Writing Models (18 records)
        print("--- Chèn 18 bản ghi Writing Models vào ielts_writing_models ---")
        for wm in model_items:
            key = (wm["book"], str(wm["test"]), int(wm["task"]))
            matching_topic = topic_map.get(key)
            prompt_text = matching_topic["prompt"] if matching_topic else wm.get("prompt", "")

            band_val = wm.get("bandEstimate")
            if band_val is not None:
                band_float = float(band_val)
            else:
                band_float = 8.5  # Examiner model answer default

            cur.execute("""
                INSERT INTO "ielts_writing_models" (
                    id, task, track, topic, chart_type, chart_description, prompt, model_answer,
                    key_vocab_json, examiner_notes_vi, band_estimate, source, license, verified, "createdAt"
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                wm["id"], int(wm.get("task", 1)), "general", wm["title"],
                None, None, prompt_text, wm.get("content", ""),
                "[]", wm.get("examinerComment"), band_float,
                wm.get("sourceRef") or wm.get("book"),
                "Cambridge University Press (Educational/Research Corpus)",
                True, now
            ))

        # Step 6: Gate 3 Post-import Verification
        post_counts = verify_gate3(cur)

        # Step 7: Spot Checks from real DB
        print("\n" + "=" * 80)
        print("[SPOT-CHECKS] TRÍCH XUẤT TRỰC TIẾP TỪ DATABASE")
        print("=" * 80)

        # 7.1 Cam 01 GT S1 (iron)
        cur.execute("""
            SELECT id, title, track, "questionsJson"
            FROM "ielts_reading_passages"
            WHERE id = 'cam01-gt-r01'
        """)
        sp_cam01 = cur.fetchone()
        qs_cam01 = json.loads(sp_cam01[3])
        q1_cam01 = next(q for q in qs_cam01 if q["questionNumber"] == 1)
        print("1. Cam 01 GT S1 (iron):")
        print(f"   id:            {sp_cam01[0]}")
        print(f"   title:         {sp_cam01[1]}")
        print(f"   track:         {sp_cam01[2]}")
        print(f"   Q1 question:   {q1_cam01.get('question')}")
        print(f"   Q1 ans:        {q1_cam01.get('correctAnswer')}")

        # 7.2 Cam 08 GT with OCR-fix (Q9 in cam08-gta-r01)
        cur.execute("""
            SELECT id, title, track, "questionsJson"
            FROM "ielts_reading_passages"
            WHERE id = 'cam08-gta-r01'
        """)
        sp_cam08 = cur.fetchone()
        qs_cam08 = json.loads(sp_cam08[3])
        q9_cam08 = next(q for q in qs_cam08 if q["questionNumber"] == 9)
        print("\n2. Cam 08 GT with OCR-fix (Q9 in cam08-gta-r01):")
        print(f"   id:            {sp_cam08[0]}")
        print(f"   track:         {sp_cam08[2]}")
        print(f"   Q9 question:   {q9_cam08.get('question')}")
        print(f"   Q9 ans (fix):  {q9_cam08.get('correctAnswer')} (OCR '0' -> 'D')")

        # 7.3 Model GT
        cur.execute("""
            SELECT id, task, track, topic, band_estimate, substring(model_answer from 1 for 100)
            FROM "ielts_writing_models"
            WHERE id = 'cam01-gt-wm01'
        """)
        sp_wm = cur.fetchone()
        print("\n3. Model GT (cam01-gt-wm01):")
        print(f"   id:            {sp_wm[0]}")
        print(f"   task:          {sp_wm[1]}")
        print(f"   track:         {sp_wm[2]}")
        print(f"   topic:         {sp_wm[3]}")
        print(f"   band:          {sp_wm[4]}")
        print(f"   answer prefix: {sp_wm[5]}...")

        if dry_run:
            conn.rollback()
            print("\n[DRY-RUN] Rollback sạch sẽ.")
        else:
            conn.commit()
            print("\n[SUCCESS] Transaction committed successfully!")

        return {
            "status": "done",
            "pre_counts": base_counts,
            "post_counts": post_counts,
            "inserted_records": len(all_items),
            "spot_checks": {
                "cam01_gt_s1": {
                    "id": sp_cam01[0],
                    "title": sp_cam01[1],
                    "track": sp_cam01[2],
                    "q1_question": q1_cam01.get("question"),
                    "q1_correctAnswer": q1_cam01.get("correctAnswer")
                },
                "cam08_gt_ocr_fix": {
                    "id": sp_cam08[0],
                    "track": sp_cam08[2],
                    "q9_question": q9_cam08.get("question"),
                    "q9_correctAnswer": q9_cam08.get("correctAnswer")
                },
                "gt_model": {
                    "id": sp_wm[0],
                    "task": sp_wm[1],
                    "track": sp_wm[2],
                    "topic": sp_wm[3],
                    "band_estimate": sp_wm[4]
                }
            }
        }

    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        raise e

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Cambridge GT corpus into DB")
    parser.add_argument("--dry-run", action="store_true", help="Dry run without commit")
    args = parser.parse_args()

    run_import(dry_run=args.dry_run)
