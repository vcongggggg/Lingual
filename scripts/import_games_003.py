# -*- coding: utf-8 -*-
r"""
Script: import_games_003.py
Task ID: lingual-data-games-003-import-001
Title: Import 2,300 game items from games-003 into GameQuestion model

Requirements:
- Source: C:\Mod\muse-data-exchange\results\games-003-items.jsonl
- Idempotent with early-exit if already imported
- Dedupe by source id
- Do not touch GameWordPool, do not alter existing UI
- Verify GameQuestion counts: total 2,300 (word_match 700 / cloze 520 / sentence_scramble 620 / idiom_quiz 460)
- Emit task_done artifact to C:\Mod\muse-mailbox\inbox
"""

import os
import sys
import json
import psycopg2
from psycopg2.extras import execute_batch
import subprocess
from datetime import datetime, timezone
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

DSN = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db"
)

SOURCE_FILE = r"C:\Mod\muse-data-exchange\results\games-003-items.jsonl"
RESULT_META_FILE = r"C:\Mod\muse-data-exchange\results\result-gen-data-games-003.json"
MAILBOX_INBOX = r"C:\Mod\muse-mailbox\inbox"

EXPECTED_TOTAL = 2300
EXPECTED_BY_TYPE = {
    "word_match": 700,
    "cloze": 520,
    "sentence_scramble": 620,
    "idiom_quiz": 460,
}

def get_git_commit_hash():
    try:
        res = subprocess.run(["git", "rev-parse", "HEAD"], cwd=Path(__file__).parent, capture_output=True, text=True)
        if res.returncode == 0:
            return res.stdout.strip()
    except Exception:
        pass
    return "unknown"

def check_existing_count(conn):
    cur = conn.cursor()
    cur.execute('SELECT count(*) FROM "game_questions" WHERE "id" LIKE %s;', ('game-003-%',))
    count = cur.fetchone()[0]
    cur.close()
    return count

def get_counts_by_type(conn):
    cur = conn.cursor()
    cur.execute('''
        SELECT "game_type", count(*) 
        FROM "game_questions" 
        WHERE "id" LIKE %s 
        GROUP BY "game_type" 
        ORDER BY "game_type";
    ''', ('game-003-%',))
    res = {row[0]: row[1] for row in cur.fetchall()}
    cur.close()
    return res

def import_games(conn, items):
    sql = '''
        INSERT INTO "game_questions" (
            "id", "game_type", "prompt", "choices", "answer", 
            "level", "source", "source_ref", "createdAt", "updatedAt"
        ) VALUES (
            %(id)s, %(game_type)s, %(prompt)s, %(choices)s, %(answer)s, 
            %(level)s, %(source)s, %(source_ref)s, NOW(), NOW()
        )
        ON CONFLICT ("id") DO UPDATE SET
            "game_type" = EXCLUDED."game_type",
            "prompt" = EXCLUDED."prompt",
            "choices" = EXCLUDED."choices",
            "answer" = EXCLUDED."answer",
            "level" = EXCLUDED."level",
            "source" = EXCLUDED."source",
            "source_ref" = EXCLUDED."source_ref",
            "updatedAt" = NOW();
    '''
    cur = conn.cursor()
    batch_data = []
    for it in items:
        choices_json = json.dumps(it.get("choices"), ensure_ascii=False) if it.get("choices") is not None else None
        batch_data.append({
            "id": it["id"],
            "game_type": it["game_type"],
            "prompt": it["prompt"],
            "choices": choices_json,
            "answer": it["answer"],
            "level": it.get("level", "A2"),
            "source": it.get("source", "script-derived"),
            "source_ref": it.get("source_ref"),
        })
    execute_batch(cur, sql, batch_data, page_size=500)
    conn.commit()
    cur.close()

def main():
    print("=" * 70)
    print("IMPORT GAMES-003 (lingual-data-games-003-import-001)")
    print("=" * 70)

    # 1. Step 1: Check source file
    print(f"\n[Step 1] Reading source file: {SOURCE_FILE}")
    if not os.path.exists(SOURCE_FILE):
        print(f"[FATAL] Source file not found: {SOURCE_FILE}", file=sys.stderr)
        sys.exit(1)

    items = []
    seen_ids = set()
    with open(SOURCE_FILE, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, start=1):
            line = line.strip()
            if not line:
                continue
            item = json.loads(line)
            item_id = item.get("id")
            if not item_id:
                print(f"[WARN] Line {line_num} missing id, skipping.")
                continue
            if item_id in seen_ids:
                print(f"[WARN] Duplicate id '{item_id}' at line {line_num}, skipping.")
                continue
            seen_ids.add(item_id)
            items.append(item)

    print(f"  Parsed {len(items)} valid unique items from source.")
    if len(items) != EXPECTED_TOTAL:
        print(f"[ERROR] Expected {EXPECTED_TOTAL} items, got {len(items)}!", file=sys.stderr)
        sys.exit(1)

    # 2. Step 2 & 3: Idempotent check and Import
    conn = psycopg2.connect(DSN)

    existing_count = check_existing_count(conn)
    print(f"\n[Step 2] Database check: existing games-003 items = {existing_count}")

    if existing_count == EXPECTED_TOTAL:
        print("  [EARLY-EXIT] All 2,300 items already exist in game_questions.")
    else:
        print(f"\n[Step 3] Importing {len(items)} items into game_questions...")
        import_games(conn, items)
        print("  [PASS] Import batch completed successfully.")

    # 3. Step 4: Verification
    print("\n[Step 4] Verifying counts in Database...")
    total_in_db = check_existing_count(conn)
    counts_by_type = get_counts_by_type(conn)

    print(f"  Total games-003 in DB: {total_in_db} / {EXPECTED_TOTAL}")
    for gt, exp in EXPECTED_BY_TYPE.items():
        act = counts_by_type.get(gt, 0)
        status = "PASS" if act == exp else "FAIL"
        print(f"    {gt:20}: actual={act:4} | expected={exp:4} [{status}]")

    conn.close()

    total_ok = (total_in_db == EXPECTED_TOTAL)
    types_ok = (counts_by_type == EXPECTED_BY_TYPE)

    if not (total_ok and types_ok):
        print("[ERROR] Verification failed! Database counts do not match expected.", file=sys.stderr)
        sys.exit(1)

    print("  [PASS] All verification checks passed!")

    # 4. Step 5: Emit task_done artifact
    print("\n[Step 5] Writing task_done artifact...")
    commit_hash = get_git_commit_hash()
    task_done = {
        "task_id": "lingual-data-games-003-import-001",
        "from": "agent",
        "to": "claude-main",
        "type": "task_done",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "commit_hash": commit_hash,
        "results": {
            "source_file": SOURCE_FILE,
            "total_items_read": len(items),
            "total_imported": total_in_db,
            "expected_total": EXPECTED_TOTAL,
            "counts_by_game_type": counts_by_type,
            "expected_by_game_type": EXPECTED_BY_TYPE,
            "migration_applied": "20261024200000_add_game_questions",
            "model_name": "GameQuestion",
            "table_name": "game_questions",
            "game_word_pool_untouched": True,
            "game_ui_untouched": True,
            "overall_status": "PASS"
        }
    }

    out_file = os.path.join(MAILBOX_INBOX, "20261024-games-003-import-001-done.json")
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(task_done, f, ensure_ascii=False, indent=2)

    print(f"  [SUCCESS] task_done written to {out_file}")
    print("=" * 70)
    print("IMPORT & VERIFICATION OF GAMES-003 COMPLETED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    main()
