#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Merge Vocabulary Examples from MuseGen into LinguaFlow Datasets & Database
Path: scripts/merge-vocab-examples.py
"""

import os
import sys
import json
import psycopg2

try:
    from db_helper import get_database_url
except ImportError:
    from scripts.db_helper import get_database_url

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BULK_VOCAB_FILE = os.path.join(REPO_ROOT, "data", "standardized", "vocab-bulk.json")
EXAMPLES_FILE = r"C:\Mod\muse-data-exchange\results\vocab-examples-001.json"

def run_merge():
    print("[*] Starting Vocabulary Examples Merge...")

    if not os.path.exists(EXAMPLES_FILE):
        print(f"[-] ERROR: Source examples file not found: {EXAMPLES_FILE}")
        sys.exit(1)

    with open(EXAMPLES_FILE, "r", encoding="utf-8") as f:
        examples_data = json.load(f)

    # Build lookup: word -> primary example
    example_map = {}
    for item in examples_data:
        w = item["word"].strip().lower()
        ex_list = item.get("examples", [])
        if ex_list:
            example_map[w] = ex_list[0]

    print(f"[*] Loaded {len(example_map)} unique word examples from source.")

    # 1. Update data/standardized/vocab-bulk.json
    with open(BULK_VOCAB_FILE, "r", encoding="utf-8") as f:
        bulk_data = json.load(f)

    merged_count = 0
    skipped_existing = 0

    for item in bulk_data:
        w = item["targetText"].strip().lower()
        has_existing = bool(item.get("exampleSentence") and item["exampleSentence"].strip())
        
        if has_existing:
            skipped_existing += 1
            continue

        if w in example_map:
            ex = example_map[w]
            item["exampleSentence"] = ex["en"]
            item["exampleTranslation"] = ex["vi"]
            if not item.get("exampleAudioUrl"):
                item["exampleAudioUrl"] = f"/audio/vocab/{item['targetText']}-ex.mp3"
            merged_count += 1

    # Atomic write to vocab-bulk.json
    temp_bulk = BULK_VOCAB_FILE + ".tmp"
    with open(temp_bulk, "w", encoding="utf-8") as f:
        json.dump(bulk_data, f, ensure_ascii=False, indent=2)
    os.replace(temp_bulk, BULK_VOCAB_FILE)

    print(f"[+] Successfully merged into {os.path.relpath(BULK_VOCAB_FILE, REPO_ROOT)}:")
    print(f"    - Added new examples to: {merged_count} words")
    print(f"    - Preserved existing examples on: {skipped_existing} words")
    print(f"    - Total records in file: {len(bulk_data)}")

    # 2. Update PostgreSQL Database directly to refresh live vocabularies
    db_updated = 0
    try:
        db_url = get_database_url()
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        update_query = """
        UPDATE vocabularies
        SET "exampleSentence" = %s,
            "exampleTranslation" = %s,
            "exampleAudioUrl" = %s
        WHERE LOWER(TRIM("targetText")) = %s
          AND ("exampleSentence" IS NULL OR "exampleSentence" = '');
        """

        for w, ex in example_map.items():
            en_sent = ex["en"]
            vi_trans = ex["vi"]
            audio_url = f"/audio/vocab/{w}-ex.mp3"
            cur.execute(update_query, (en_sent, vi_trans, audio_url, w))
            db_updated += cur.rowcount

        conn.commit()
        conn.close()
        print(f"[+] Successfully updated PostgreSQL database: {db_updated} rows updated with examples.")
    except Exception as e:
        print(f"[-] Database update note: {e}")

    print("[+] MERGE COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    run_merge()
