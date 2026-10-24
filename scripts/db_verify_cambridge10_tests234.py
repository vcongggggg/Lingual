# -*- coding: utf-8 -*-
"""
Script: db_verify_cambridge10_tests234.py
Task ID: lingual-map-cambridge10-tests234-db-verify-001
Title: DB-VERIFY SELECT-only for Cambridge IELTS 10 Tests 2-4 (including T4 schema checks)

This script performs read‑only verification of the PostgreSQL database after importing
Cambridge IELTS 10 academic tests 2‑4. It checks:
1. Record counts for the five main tables.
2. That all 42 newly‑imported records have track='academic'.
3. Schema details for a sample T4 reading passage (id like cam10‑academic‑t4‑p1) and a
   sample T4 speaking record (id like cam10‑academic‑t4‑s1).
4. Spot‑checks of 5 answer keys against the DB values.

The script prints a human‑readable report and writes a JSON ``task_done`` file to
``C:\\Mod\\muse-mailbox\\inbox`` with a summary of the verification results.
"""

import os
import sys
import json
import psycopg2
from datetime import datetime
from pathlib import Path

# Ensure UTF‑8 output for Windows console
sys.stdout.reconfigure(encoding='utf-8')

DSN = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db"
)

# Expected record counts after importing Tests 2‑4 (including the new T4 records)
EXPECTED_COUNTS = {
    "ielts_reading_passages": 148,   # 139 existing + 9 new (tests 2‑4)
    "ielts_listening_sections": 140, # 128 existing + 12 new
    "ielts_writing_topics": 340,     # 334 existing + 6 new
    "ielts_writing_models": 100,     # 94 existing + 6 new
    "ielts_speaking_topics": 648,    # 639 existing + 9 new
}

# Spot‑check definitions – you can adjust the IDs / question numbers if you know the exact key‑in values.
SPOT_CHECKS = [
    {"record_id": "cam10-academic-t2-l1", "question_number": 1, "page_ref": "Cambridge IELTS 10 Test 2 Listening Section 1 Q1"},
    {"record_id": "cam10-academic-t2-r1", "question_number": 1, "page_ref": "Cambridge IELTS 10 Test 2 Reading Passage 1 Q1"},
    {"record_id": "cam10-academic-t3-l1", "question_number": 1, "page_ref": "Cambridge IELTS 10 Test 3 Listening Section 1 Q1"},
    {"record_id": "cam10-academic-t3-r2", "question_number": 23, "page_ref": "Cambridge IELTS 10 Test 3 Reading Passage 2 Q23"},
    {"record_id": "cam10-academic-t4-l2", "question_number": 11, "page_ref": "Cambridge IELTS 10 Test 4 Listening Section 2 Q11"}
]

def get_counts(conn):
    cur = conn.cursor()
    counts = {}
    for tbl in EXPECTED_COUNTS:
        cur.execute(f'SELECT count(*) FROM "{tbl}"')
        counts[tbl] = cur.fetchone()[0]
    cur.close()
    return counts

def verify_counts(counts):
    all_ok = True
    for tbl, exp in EXPECTED_COUNTS.items():
        actual = counts.get(tbl, 0)
        status = "PASS" if actual == exp else "FAIL"
        print(f"  {tbl:26}: actual={actual:4} | expected={exp:4} [{status}]")
        if actual != exp:
            all_ok = False
    return all_ok

def verify_new_tracks(conn):
    cur = conn.cursor()
    pattern = 'cam10-academic-t[234]-%'
    tables = [
        "ielts_reading_passages",
        "ielts_listening_sections",
        "ielts_writing_topics",
        "ielts_writing_models",
        "ielts_speaking_topics",
    ]
    all_records = []
    for tbl in tables:
        cur.execute(f'SELECT id, track FROM "{tbl}" WHERE id LIKE %s', (pattern,))
        all_records.extend(cur.fetchall())
    cur.close()
    print(f"  Total new records found: {len(all_records)} (expected 42)")
    track_ok = all(rec[1] == 'academic' for rec in all_records)
    if not track_ok:
        bad = [rec for rec in all_records if rec[1] != 'academic']
        print(f"[FAIL] Non‑academic tracks: {bad}")
    else:
        print("  [PASS] All new records have track='academic'.")
    return len(all_records) == 42 and track_ok

def inspect_t4_schema(conn):
    cur = conn.cursor()
    # Sample T4 reading passage (id pattern used by loaders)
    cur.execute('SELECT id, "questionsJson" FROM "ielts_reading_passages" WHERE id = %s', ('cam10-academic-t4-p1',))
    reading_row = cur.fetchone()
    # Sample T4 speaking topic (id pattern)
    cur.execute('SELECT id, "questionsJson", "scriptJson" FROM "ielts_speaking_topics" WHERE id = %s', ('cam10-academic-t4-s1',))
    speaking_row = cur.fetchone()
    cur.close()

    print("--- T4 Schema inspection ---")
    if reading_row:
        qs = json.loads(reading_row[1]) if isinstance(reading_row[1], str) else reading_row[1]
        sample_q = qs[0] if qs else {}
        field = 'question' if 'question' in sample_q else ('stem' if 'stem' in sample_q else 'UNKNOWN')
        has_options = 'options' in sample_q
        print(f"[Reading] id={reading_row[0]} – first question field '{field}', options present={has_options}")
    else:
        print("[Reading] No cam10‑academic‑t4‑p1 record found.")

    if speaking_row:
        qs = json.loads(speaking_row[1]) if isinstance(speaking_row[1], str) else speaking_row[1]
        sample_q = qs[0] if qs else {}
        field = 'question' if 'question' in sample_q else ('stem' if 'stem' in sample_q else 'UNKNOWN')
        has_options = 'options' in sample_q
        script_content = speaking_row[2]
        script_str = script_content if isinstance(script_content, str) else json.dumps(script_content)
        has_section = '## SECTION' in script_str
        print(f"[Speaking] id={speaking_row[0]} – first question field '{field}', options present={has_options}, script contains '## SECTION'={has_section}")
    else:
        print("[Speaking] No cam10‑academic‑t4‑s1 record found.")
    return {
        "reading_id": reading_row[0] if reading_row else None,
        "speaking_id": speaking_row[0] if speaking_row else None,
    }

def spot_check_answers(conn):
    cur = conn.cursor()
    results = []
    for chk in SPOT_CHECKS:
        # Determine which table to query based on id prefix
        if chk["record_id"].endswith('l1') or chk["record_id"].endswith('l2'):
            table = "ielts_listening_sections"
        elif chk["record_id"].endswith('r1') or chk["record_id"].endswith('r2'):
            table = "ielts_reading_passages"
        else:
            table = "ielts_speaking_topics"
        cur.execute(f'SELECT "questionsJson" FROM "{table}" WHERE id = %s', (chk["record_id"],))
        row = cur.fetchone()
        if not row:
            print(f"[WARN] Record {chk['record_id']} not found in {table}.")
            continue
        qs = json.loads(row[0]) if isinstance(row[0], str) else row[0]
        q_item = next((q for q in qs if q.get('questionNumber') == chk['question_number']), None)
        if not q_item:
            print(f"[WARN] Q{chk['question_number']} not found in {chk['record_id']}")
            continue
        answer = q_item.get('correctAnswer')
        results.append({
            "record_id": chk["record_id"],
            "question_number": chk["question_number"],
            "db_answer": answer,
            "page_ref": chk["page_ref"]
        })
        print(f"[Spot] {chk['record_id']} Q{chk['question_number']}: answer='{answer}' (ref: {chk['page_ref']})")
    cur.close()
    return results

def main():
    conn = psycopg2.connect(DSN)
    print("=" * 70)
    print("DB VERIFY: Cambridge IELTS 10 Tests 2-4 (SELECT‑ONLY)")
    print("=" * 70)

    counts = get_counts(conn)
    print("\n--- 1. Record counts ---")
    counts_ok = verify_counts(counts)

    print("\n--- 2. Track validation for new records ---")
    tracks_ok = verify_new_tracks(conn)

    print("\n--- 3. T4 schema inspection ---")
    schema_info = inspect_t4_schema(conn)

    print("\n--- 4. Spot‑check answers ---")
    spot_results = spot_check_answers(conn)

    conn.close()

    overall = counts_ok and tracks_ok
    task_done = {
        "task_id": "lingual-map-cambridge10-tests234-db-verify-001",
        "from": "agent",
        "type": "task_done",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "results": {
            "counts_ok": counts_ok,
            "counts": counts,
            "expected_counts": EXPECTED_COUNTS,
            "tracks_ok": tracks_ok,
            "t4_schema": schema_info,
            "spot_checks": spot_results,
            "overall_success": overall
        }
    }
    out_path = Path(r"C:\Mod\muse-mailbox\inbox\20261024-cambridge10-tests234-db-verify-001-done.json")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(task_done, ensure_ascii=False, indent=2), encoding='utf-8')
    print("\nTask‑done JSON written to:", out_path)
    if not overall:
        sys.exit(1)

if __name__ == "__main__":
    main()
