import os
import sys
import json
import hashlib
import re
import psycopg2

"""
Migration Script: Import 180 audited idiom meanings from draft file
Task ID: lingual-idiom-meaning-import-180-001
Source File: C:\\Mod\\muse-data-exchange\\audit-reports\\20261101-idioms-meaning-en-draft-180.json
Expected SHA256: f4d85885eb84dd20e00e3a2b8a9dde58964c42efbccc8f1fc04b052f32b91983
"""

EXPECTED_SHA256 = "f4d85885eb84dd20e00e3a2b8a9dde58964c42efbccc8f1fc04b052f32b91983"
DRAFT_FILE_PATH = r"C:\Mod\muse-data-exchange\audit-reports\20261101-idioms-meaning-en-draft-180.json"

def clean_dsn_for_psycopg2(url: str) -> str:
    """Strip parameters like ?schema=public which psycopg2/libpq does not support."""
    if not url:
        return url
    cleaned = re.sub(r'\?schema=[^&]*&?', '?', url)
    cleaned = re.sub(r'&schema=[^&]*', '', cleaned)
    cleaned = re.sub(r'\?$', '', cleaned)
    return cleaned

def compute_sha256(filepath: str) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest().lower()

def run_import():
    # 1. Enforce DATABASE_URL from environment
    _db_url = os.environ.get("DATABASE_URL")
    if not _db_url:
        raise RuntimeError("DATABASE_URL environment variable is missing or empty. Fail-fast triggered.")

    # 2. Check draft file existence and verify SHA256
    if not os.path.exists(DRAFT_FILE_PATH):
        raise FileNotFoundError(f"Source draft file not found: {DRAFT_FILE_PATH}")

    actual_sha = compute_sha256(DRAFT_FILE_PATH)
    print(f"[*] Verified Draft File SHA256: {actual_sha}")
    if actual_sha != EXPECTED_SHA256:
        raise RuntimeError(f"SHA256 MISMATCH! Expected: {EXPECTED_SHA256}, Got: {actual_sha}. STOPPING IMMEDIATELY.")

    # 3. Load and validate draft records
    with open(DRAFT_FILE_PATH, "r", encoding="utf-8") as f:
        payload = json.load(f)

    draft_items = payload.get("draftItems", [])
    if len(draft_items) != 180:
        raise ValueError(f"Expected 180 items in draftItems, but found {len(draft_items)}")

    # Verify all items have status DRAFTED and non-empty proposedMeaningEn
    for idx, item in enumerate(draft_items):
        if item.get("status") != "DRAFTED":
            raise ValueError(f"Item at index {idx} ({item.get('id')}) status is not 'DRAFTED': {item.get('status')}")
        if not item.get("proposedMeaningEn"):
            raise ValueError(f"Item at index {idx} ({item.get('id')}) has empty proposedMeaningEn")

    cleaned_dsn = clean_dsn_for_psycopg2(_db_url)
    conn = psycopg2.connect(cleaned_dsn)
    cur = conn.cursor()

    try:
        # 4. Pre-import gate count check
        cur.execute('SELECT COUNT(*) FROM idioms WHERE "meaningEn" IS NULL OR trim("meaningEn") = \'\'')
        before_null_count = cur.fetchone()[0]
        print(f"[*] BEFORE IMPORT: idioms with meaningEn NULL/empty count = {before_null_count}")

        if before_null_count != 180:
            raise RuntimeError(f"Gate check failed: Expected exactly 180 null idioms before import, but found {before_null_count}")

        # Fetch current DB state for these 180 IDs to check before updating
        draft_ids = [item["id"] for item in draft_items]
        cur.execute('SELECT id, "meaningEn", idiom FROM idioms WHERE id = ANY(%s)', (draft_ids,))
        existing_rows = {r[0]: {"meaningEn": r[1], "idiom": r[2]} for r in cur.fetchall()}

        updated_count = 0
        skipped_items = []

        # 5. Process each of the 180 IDs
        for item in draft_items:
            iid = item["id"]
            prop_meaning = item["proposedMeaningEn"]
            prop_idiom = item.get("idiom", "")

            # Verify existence in DB
            if iid not in existing_rows:
                skipped_items.append({"id": iid, "reason": "ID does not exist in DB"})
                print(f"[!] SKIP: ID {iid} does not exist in DB")
                continue

            db_info = existing_rows[iid]
            # Verify that meaningEn in DB is currently NULL/empty
            if db_info["meaningEn"] is not None and db_info["meaningEn"].strip() != "":
                skipped_items.append({"id": iid, "reason": f"meaningEn already populated: {db_info['meaningEn']}"})
                print(f"[!] SKIP: ID {iid} already has meaningEn: {db_info['meaningEn']}")
                continue

            # Update ONLY meaningEn for this exact ID
            cur.execute(
                'UPDATE idioms SET "meaningEn" = %s WHERE id = %s AND ("meaningEn" IS NULL OR trim("meaningEn") = \'\')',
                (prop_meaning, iid)
            )
            if cur.rowcount == 1:
                updated_count += 1
            else:
                skipped_items.append({"id": iid, "reason": f"Rowcount was {cur.rowcount} on UPDATE"})
                print(f"[!] SKIP: ID {iid} update rowcount was {cur.rowcount}")

        conn.commit()
        print(f"[*] Successfully updated {updated_count} / {len(draft_items)} idioms.")
        print(f"[*] Skipped count: {len(skipped_items)}")

        # 6. Post-import gate count check
        cur.execute('SELECT COUNT(*) FROM idioms WHERE "meaningEn" IS NULL OR trim("meaningEn") = \'\'')
        after_null_count = cur.fetchone()[0]
        print(f"[*] AFTER IMPORT: idioms with meaningEn NULL/empty count = {after_null_count}")

        if after_null_count != 0:
            raise RuntimeError(f"Gate check failed: Expected 0 null idioms after import, but found {after_null_count}")

        # 7. Spot-check verification (read >= 10 records directly from DB)
        # Select 15 items evenly spaced across the 180 records
        spot_check_indices = [int(i * (len(draft_items) - 1) / 14) for i in range(15)]
        spot_check_targets = [draft_items[i] for i in spot_check_indices]
        spot_check_ids = [item["id"] for item in spot_check_targets]

        cur.execute('SELECT id, idiom, "meaningEn" FROM idioms WHERE id = ANY(%s) ORDER BY id', (spot_check_ids,))
        db_spot_rows = {r[0]: {"idiom": r[1], "meaningEn": r[2]} for r in cur.fetchall()}

        print("\n[*] SPOT-CHECK VERIFICATION (15 items directly read from DB):")
        spot_check_results = []
        for target in spot_check_targets:
            tid = target["id"]
            expected_meaning = target["proposedMeaningEn"]
            actual_row = db_spot_rows.get(tid)
            assert actual_row is not None, f"Spot-check failed: ID {tid} not returned from DB"
            actual_meaning = actual_row["meaningEn"]
            assert actual_meaning == expected_meaning, (
                f"Spot-check mismatch for {tid}:\n"
                f"  Expected: {expected_meaning}\n"
                f"  Got:      {actual_meaning}"
            )
            print(f"  [PASS] [{tid}] '{actual_row['idiom']}': '{actual_meaning}'")
            spot_check_results.append({
                "id": tid,
                "idiom": actual_row["idiom"],
                "meaningEn": actual_meaning,
                "matchedDraft": True
            })

        print("\n[+] DEFINITION OF DONE ACHIEVED: 180/180 imported, 0 skipped, 0 nulls remaining, 15 spot-checks passed.")
        return {
            "success": True,
            "updated_count": updated_count,
            "skipped_count": len(skipped_items),
            "skipped_items": skipped_items,
            "before_null_count": before_null_count,
            "after_null_count": after_null_count,
            "spot_check_results": spot_check_results,
            "source_sha256": actual_sha
        }

    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Import transaction failed and rolled back: {e}", file=sys.stderr)
        raise e
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    run_import()
