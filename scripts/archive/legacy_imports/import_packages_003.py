"""
Import 180 Content Packages (gen-data-packages-003) into content_packages table.
Task: lingual-data-packages-003-import-001
- Guard early-exit if already imported
- Dedupe by ID
- Skip templates-003.json (no Prisma model)
- Target: 300 total content_packages (120 existing + 180 new)
- Verify sample 5 packages with valid wordOrderJson structure
"""

import os
import sys
import json
import psycopg2
from pathlib import Path

# Ensure UTF-8 console output
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

def main():
    print("=== STARTING IMPORT PACKAGES-003 ===")
    clean_db_url = DB_URL.split("?")[0]
    conn = psycopg2.connect(clean_db_url)
    cur = conn.cursor()

    # 1. Guard check: early-exit if already imported
    cur.execute("SELECT COUNT(*) FROM content_packages WHERE id LIKE 'pkg-003-%'")
    count_003_existing = cur.fetchone()[0]
    print(f"Existing pkg-003-* records in DB: {count_003_existing}")
    if count_003_existing >= 180:
        print("EARLY EXIT: All 180 pkg-003 records are already imported.")
        conn.close()
        return

    # 2. Get initial count
    cur.execute("SELECT COUNT(*) FROM content_packages")
    initial_db_count = cur.fetchone()[0]
    print(f"Initial total records in DB: {initial_db_count}")

    # 3. Read input packages
    pkg_file = Path(r"C:\Mod\muse-data-exchange\results\packages-003-packages.jsonl")
    if not pkg_file.exists():
        raise FileNotFoundError(f"Packages input file not found: {pkg_file}")

    packages = []
    with open(pkg_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                packages.append(json.loads(line))

    print(f"Read {len(packages)} packages from {pkg_file.name}")
    if len(packages) != 180:
        print(f"WARNING: Expected 180 packages, but found {len(packages)}")

    # 4. Check existing IDs for dedupe
    cur.execute("SELECT id FROM content_packages")
    existing_ids = set(r[0] for r in cur.fetchall())

    to_insert = []
    for pkg in packages:
        pid = pkg["id"]
        if pid in existing_ids:
            print(f"Skipping already existing ID: {pid}")
            continue
        to_insert.append(pkg)

    print(f"Packages to insert: {len(to_insert)}")

    # 5. Insert into DB
    insert_query = """
    INSERT INTO content_packages (
        id, topic, "topicVi", "cefrLevel",
        "dialogueJson", "dictationJson", "shadowingJson",
        "wordOrderJson", "quizJson", source, verified, "createdAt"
    ) VALUES (
        %s, %s, %s, %s,
        %s, %s, %s,
        %s, %s, %s, %s, CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO NOTHING;
    """

    insert_rows = []
    for pkg in to_insert:
        level_clean = pkg.get("level", "B2").upper()
        words_json = json.dumps(pkg.get("words", []), ensure_ascii=False)
        insert_rows.append((
            pkg["id"],
            pkg.get("theme", ""),
            pkg.get("title_vi", ""),
            level_clean,
            "{}",                # dialogueJson default
            "{}",                # dictationJson default
            "{}",                # shadowingJson default
            words_json,          # wordOrderJson: list of words
            "[]",                # quizJson default
            "script-derived",    # source
            False                # verified
        ))

    print(f"Executing batch insert of {len(insert_rows)} packages...")
    cur.executemany(insert_query, insert_rows)
    conn.commit()
    print("Insert committed successfully.")

    # 6. Verify DoD
    cur.execute("SELECT COUNT(*) FROM content_packages")
    final_db_count = cur.fetchone()[0]
    expected_total = initial_db_count + len(insert_rows)
    print(f"\nFinal DB count: {final_db_count} (Expected: {expected_total})")

    # Sample 5 random newly inserted records
    cur.execute("""
        SELECT id, topic, "topicVi", "cefrLevel", "wordOrderJson", source
        FROM content_packages
        WHERE id LIKE 'pkg-003-%'
        ORDER BY RANDOM()
        LIMIT 5;
    """)
    samples = cur.fetchall()

    print("\n=== SAMPLE 5 PACKAGES (VERIFIED) ===")
    sample_list = []
    for s in samples:
        words = json.loads(s[4])
        info = {
            "id": s[0],
            "topic": s[1],
            "topicVi": s[2],
            "cefrLevel": s[3],
            "wordsCount": len(words),
            "sampleWords": words[:3],
            "source": s[5]
        }
        sample_list.append(info)
        print(f"ID: {s[0]} [{s[3]}] - {s[2]} (Topic: {s[1]}) | Words: {len(words)}")
        for w in words[:3]:
            print(f"    - {w.get('word')}: {w.get('meaning_vi')}")

    conn.close()

    # Save summary manifest
    result_manifest = {
        "task_id": "lingual-data-packages-003-import-001",
        "initial_db_count": initial_db_count,
        "packages_read": len(packages),
        "inserted_count": len(insert_rows),
        "final_db_count": final_db_count,
        "expected_db_count": expected_total,
        "samples_5": sample_list
    }

    manifest_path = Path(r"C:\Mod\muse-data-exchange\results\result-import-packages-003.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(result_manifest, f, ensure_ascii=False, indent=2)
    print(f"\nResult manifest saved to: {manifest_path}")

    return result_manifest

if __name__ == "__main__":
    main()
