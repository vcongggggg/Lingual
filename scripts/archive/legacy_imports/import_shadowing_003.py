"""
Import 1.100 Shadowing Sentences (gen-data-shadow-003) into shadowing_sentences table.
Task: lingual-data-shadow-003-import-001
- Dedupe vs 400 existing sentences based on normalized textEn (lowercase, stripped punctuation)
- Guard early-exit if already imported
- Target: 1.500 total sentences (minus duplicates)
- Verify sample 5 records
"""

import os
import sys
import re
import json
import random
import psycopg2
from pathlib import Path

# Fix Windows console encoding if needed
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Database URL from LinguaFlow .env
ENV_PATH = Path(r"C:\Study\HocKy6\LinguaFlow\.env")
DB_URL = None
if ENV_PATH.exists():
    with open(ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("DATABASE_URL="):
                DB_URL = line.split("=", 1)[1].strip().strip('"')

if not DB_URL:
    DB_URL = "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db"

def normalize_text(text):
    if not text:
        return ""
    t = text.strip().lower()
    t = re.sub(r'[\.\?\!\,\;\:\"\']+$', '', t)
    return t.strip()

def main():
    print("=== STARTING IMPORT SHADOWING-003 ===")
    clean_db_url = DB_URL.split("?")[0]
    conn = psycopg2.connect(clean_db_url)
    cur = conn.cursor()

    # 1. Guard check: early-exit if already imported
    cur.execute("SELECT COUNT(*) FROM shadowing_sentences WHERE id LIKE 'shd-003-%'")
    count_003_existing = cur.fetchone()[0]
    print(f"Existing shd-003-* records in DB: {count_003_existing}")
    if count_003_existing >= 1100:
        print("EARLY EXIT: All 1.100 shd-003 records are already imported.")
        conn.close()
        return

    # 2. Get existing sentences for dedupe
    cur.execute('SELECT id, "textEn" FROM shadowing_sentences')
    existing_rows = cur.fetchall()
    initial_db_count = len(existing_rows)
    print(f"Initial total records in DB: {initial_db_count}")

    existing_en_set = set()
    for rid, text_en in existing_rows:
        norm = normalize_text(text_en)
        existing_en_set.add(norm)

    # 3. Read input files
    p1_path = Path(r"C:\Mod\muse-data-exchange\results\shadow-003-p1.jsonl")
    p2_path = Path(r"C:\Mod\muse-data-exchange\results\shadow-003-p2.jsonl")

    raw_records = []
    for p in [p1_path, p2_path]:
        if not p.exists():
            raise FileNotFoundError(f"Input file not found: {p}")
        with open(p, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    raw_records.append(json.loads(line))

    print(f"Read {len(raw_records)} records from {p1_path.name} & {p2_path.name}")
    if len(raw_records) != 1100:
        print(f"WARNING: Expected 1100 records, but found {len(raw_records)}")

    # 4. Dedupe check
    duplicates = []
    valid_records = []
    seen_in_batch = set()

    for rec in raw_records:
        norm = normalize_text(rec["text_en"])
        if norm in existing_en_set:
            duplicates.append((rec["id"], rec["text_en"], "duplicate_with_db"))
        elif norm in seen_in_batch:
            duplicates.append((rec["id"], rec["text_en"], "duplicate_in_batch"))
        else:
            seen_in_batch.add(norm)
            valid_records.append(rec)

    dup_count = len(duplicates)
    insert_count = len(valid_records)
    print(f"\nDedupe results:")
    print(f"  - Duplicate records: {dup_count}")
    print(f"  - Clean records to insert: {insert_count}")
    print(f"  - Hard gate check: {insert_count} == 1100 - {dup_count} -> {insert_count == (1100 - dup_count)}")

    # 5. Insert into DB
    insert_query = """
    INSERT INTO shadowing_sentences (
        id, "textEn", "textVi", "cefrLevel", topic,
        "focusWords", "skillFocus", source, verified, "createdAt"
    ) VALUES (
        %s, %s, %s, %s, %s,
        %s, %s, %s, %s, CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO NOTHING;
    """

    insert_rows = []
    for rec in valid_records:
        insert_rows.append((
            rec["id"],
            rec["text_en"],
            rec["translation_vi"],
            rec.get("level", "A2"),
            rec.get("topic", "daily-life"),
            json.dumps([]),       # focusWords default []
            "speaking",           # skillFocus default speaking
            "corpus-derived",     # source
            False                 # verified
        ))

    print(f"Executing batch insert of {len(insert_rows)} records...")
    cur.executemany(insert_query, insert_rows)
    conn.commit()
    print("Insert committed successfully.")

    # 6. Verify DoD
    cur.execute("SELECT COUNT(*) FROM shadowing_sentences")
    final_db_count = cur.fetchone()[0]
    expected_total = initial_db_count + insert_count
    print(f"\nFinal DB count: {final_db_count} (Expected: {expected_total})")

    # Sample 5 random newly inserted records
    cur.execute("""
        SELECT id, "textEn", "textVi", "cefrLevel", topic, source
        FROM shadowing_sentences
        WHERE id LIKE 'shd-003-%'
        ORDER BY RANDOM()
        LIMIT 5;
    """)
    samples = cur.fetchall()

    print("\n=== SAMPLE 5 RECORDS (VERIFIED) ===")
    sample_list = []
    for s in samples:
        info = {
            "id": s[0],
            "textEn": s[1],
            "textVi": s[2],
            "cefrLevel": s[3],
            "topic": s[4],
            "source": s[5]
        }
        sample_list.append(info)
        print(f"ID: {s[0]} [{s[3]} | {s[4]}]")
        print(f"  EN: {s[1]}")
        print(f"  VI: {s[2]}")

    conn.close()

    # Save summary manifest
    result_manifest = {
        "task_id": "lingual-data-shadow-003-import-001",
        "initial_db_count": initial_db_count,
        "raw_records_count": len(raw_records),
        "duplicates_count": dup_count,
        "inserted_count": insert_count,
        "final_db_count": final_db_count,
        "expected_db_count": expected_total,
        "samples_5": sample_list
    }

    manifest_path = Path(r"C:\Mod\muse-data-exchange\results\result-import-shadow-003.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(result_manifest, f, ensure_ascii=False, indent=2)
    print(f"\nResult manifest saved to: {manifest_path}")

    return result_manifest

if __name__ == "__main__":
    main()
