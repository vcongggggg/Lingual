import os
import sys
import re
import psycopg2

"""
Migration Script: Clean up 4 idiom test fixture rows from DB
Task ID: lingual-idiom-fixture-cleanup-001
Targets:
  - idm-fix-b2-1: "bite the bullet" ("face a difficult situation with courage")
  - idm-fix-b2-2: "break the ice" ("make people feel more comfortable")
  - idm-fix-b2-3: "burn the midnight oil" ("work late into the night")
  - idm-fix-b2-4: "hit the nail on the head" ("describe exactly what is causing a situation")
"""

EXPECTED_FIXTURES = {
    "idm-fix-b2-1": {
        "idiom": "bite the bullet",
        "meaningEn": "face a difficult situation with courage"
    },
    "idm-fix-b2-2": {
        "idiom": "break the ice",
        "meaningEn": "make people feel more comfortable"
    },
    "idm-fix-b2-3": {
        "idiom": "burn the midnight oil",
        "meaningEn": "work late into the night"
    },
    "idm-fix-b2-4": {
        "idiom": "hit the nail on the head",
        "meaningEn": "describe exactly what is causing a situation"
    }
}

def clean_dsn_for_psycopg2(url: str) -> str:
    """Strip parameters like ?schema=public which psycopg2/libpq does not support."""
    if not url:
        return url
    cleaned = re.sub(r'\?schema=[^&]*&?', '?', url)
    cleaned = re.sub(r'&schema=[^&]*', '', cleaned)
    cleaned = re.sub(r'\?$', '', cleaned)
    return cleaned

def run_cleanup():
    # 1. Enforce DATABASE_URL from environment
    _db_url = os.environ.get("DATABASE_URL")
    if not _db_url:
        raise RuntimeError("DATABASE_URL environment variable is missing or empty. Fail-fast triggered.")

    cleaned_dsn = clean_dsn_for_psycopg2(_db_url)
    conn = psycopg2.connect(cleaned_dsn)
    cur = conn.cursor()

    try:
        # 2. Gate counts before cleanup
        cur.execute('SELECT COUNT(*), COUNT("meaningEn"), COUNT(*) - COUNT("meaningEn") FROM idioms;')
        before_total, before_not_null, before_null = cur.fetchone()
        print(f"[*] BEFORE CLEANUP: total = {before_total}, not_null = {before_not_null}, null = {before_null}")

        # 3. Verification of 4 fixture rows (Step 1)
        target_ids = list(EXPECTED_FIXTURES.keys())
        cur.execute('SELECT id, idiom, "meaningEn", "createdAt" FROM idioms WHERE id = ANY(%s) ORDER BY id;', (target_ids,))
        rows = cur.fetchall()

        if len(rows) != 4:
            raise RuntimeError(f"Step 1 Verification Failed: Expected 4 fixture rows, found {len(rows)}")

        for r in rows:
            fid, fidiom, fmeaning, fcreated = r[0], r[1], r[2], str(r[3])
            expected = EXPECTED_FIXTURES[fid]
            if fidiom.strip().lower() != expected["idiom"].strip().lower():
                raise RuntimeError(f"Step 1 Verification Failed for {fid}: idiom '{fidiom}' != expected '{expected['idiom']}'")
            if fmeaning.strip().lower() != expected["meaningEn"].strip().lower():
                raise RuntimeError(f"Step 1 Verification Failed for {fid}: meaningEn '{fmeaning}' != expected '{expected['meaningEn']}'")
            if not fcreated.startswith("2026-10-23"):
                raise RuntimeError(f"Step 1 Verification Failed for {fid}: createdAt '{fcreated}' does not match 2026-10-23")
            print(f"  [VERIFIED 100%] {fid}: '{fidiom}' -> '{fmeaning}' (created: {fcreated})")

        # 4. Deletion of EXACTLY 4 fixture rows (Step 2)
        cur.execute('DELETE FROM idioms WHERE id = ANY(%s);', (target_ids,))
        deleted_count = cur.rowcount
        print(f"[*] Deleted count: {deleted_count}")
        if deleted_count != 4:
            raise RuntimeError(f"Expected exactly 4 rows deleted, got {deleted_count}. Rolling back.")

        conn.commit()
        print("[*] Deletion transaction committed successfully.")

        # 5. Gate counts after cleanup
        cur.execute('SELECT COUNT(*), COUNT("meaningEn"), COUNT(*) - COUNT("meaningEn") FROM idioms;')
        after_total, after_not_null, after_null = cur.fetchone()
        print(f"[*] AFTER CLEANUP: total = {after_total}, not_null = {after_not_null}, null = {after_null}")

        if after_total != before_total - 4:
            raise RuntimeError(f"Total count mismatch: expected {before_total - 4}, got {after_total}")
        if after_null != 0:
            raise RuntimeError(f"Null count mismatch: expected 0, got {after_null}")
        if after_not_null != 794:
            raise RuntimeError(f"Non-null count mismatch: expected 794, got {after_not_null}")

        # Re-query 4 IDs to verify they return 0 rows
        cur.execute('SELECT COUNT(*) FROM idioms WHERE id = ANY(%s);', (target_ids,))
        remaining_target_count = cur.fetchone()[0]
        if remaining_target_count != 0:
            raise RuntimeError(f"Re-query failed: {remaining_target_count} target rows still present in DB")
        print("[*] Re-query target IDs: exactly 0 rows returned.")

        # Verify 14 backfilled idioms intact
        audited_14_ids = [
            "idm-015", "idm-051", "idm-062", "idm-064", "idm-065",
            "idm-129", "idm-130", "idm-134", "idm-137", "idm-147",
            "idm-151", "idm-153", "idm-155", "idm-198"
        ]
        cur.execute('SELECT COUNT(*) FROM idioms WHERE id = ANY(%s) AND "meaningEn" IS NOT NULL;', (audited_14_ids,))
        intact_14 = cur.fetchone()[0]
        if intact_14 != 14:
            raise RuntimeError(f"Integrity check failed: expected 14 backfilled idioms intact, found {intact_14}")
        print(f"[*] Integrity check: 14/14 previously backfilled idioms intact.")

        print("\n[+] DEFINITION OF DONE ACHIEVED: Exactly 4 fixture rows removed, total idioms now 794, 0 nulls, 794 non-null.")
        return {
            "success": True,
            "deleted_count": deleted_count,
            "before_total": before_total,
            "after_total": after_total,
            "before_null": before_null,
            "after_null": after_null,
            "before_not_null": before_not_null,
            "after_not_null": after_not_null
        }

    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Cleanup transaction failed and rolled back: {e}", file=sys.stderr)
        raise e
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    run_cleanup()
