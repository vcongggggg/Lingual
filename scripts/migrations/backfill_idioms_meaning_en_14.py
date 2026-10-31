import os
"""
Migration / Backfill Script: Backfill meaningEn for 14 audited idioms only
Task ID: lingual-idiom-meaning-backfill-014-001
Audited Report SHA256: edc381dd1c465bec1315bdd2ef40981de048413741be4f0aacc0deba0c410e32
"""

import sys
import psycopg2

AUDITED_14_IDIOMS = [
    {
        "id": "idm-015",
        "idiom": "by the book",
        "meaningEn": "In strict adherence to rules and official procedures.",
        "source": "idioms-002.jsonl line 484"
    },
    {
        "id": "idm-051",
        "idiom": "every cloud has a silver lining",
        "meaningEn": "difficult situations can also have positive effects",
        "source": "Cambridge Vocabulary for IELTS Advanced, Unit 17.1 (P88)"
    },
    {
        "id": "idm-062",
        "idiom": "beat the clock",
        "meaningEn": "To complete a task within a time limit.",
        "source": "idioms-002.jsonl line 120"
    },
    {
        "id": "idm-064",
        "idiom": "bite the dust",
        "meaningEn": "To die; to fail completely.",
        "source": "idioms-002.jsonl line 173"
    },
    {
        "id": "idm-065",
        "idiom": "blow off steam",
        "meaningEn": "To release stress through energetic activity.",
        "source": "idioms-002.jsonl line 191"
    },
    {
        "id": "idm-129",
        "idiom": "blood is thicker than water",
        "meaningEn": "Family bonds are stronger than other relationships.",
        "source": "idioms-002.jsonl line 186"
    },
    {
        "id": "idm-130",
        "idiom": "born with a silver spoon",
        "meaningEn": "have advantages because you come from a rich family",
        "source": "Destination C1 & C2, Unit 26"
    },
    {
        "id": "idm-134",
        "idiom": "by hook or by crook",
        "meaningEn": "By any means possible, one way or another.",
        "source": "idioms-002.jsonl line 476"
    },
    {
        "id": "idm-137",
        "idiom": "break a sweat",
        "meaningEn": "To start sweating from physical effort.",
        "source": "idioms-002.jsonl line 248"
    },
    {
        "id": "idm-147",
        "idiom": "add fuel to the fire",
        "meaningEn": "To worsen a conflict; to inflame a tense situation.",
        "source": "idioms-002.jsonl line 12"
    },
    {
        "id": "idm-151",
        "idiom": "between the devil and the deep blue sea",
        "meaningEn": "Forced to choose between two bad options.",
        "source": "idioms-002.jsonl line 157"
    },
    {
        "id": "idm-153",
        "idiom": "burn the candle at both ends",
        "meaningEn": "To overwork oneself day and night.",
        "source": "idioms-002.jsonl line 407"
    },
    {
        "id": "idm-155",
        "idiom": "cast pearls before swine",
        "meaningEn": "To give valuable things to those who won't appreciate them.",
        "source": "idioms-002.jsonl line 569"
    },
    {
        "id": "idm-198",
        "idiom": "silver lining",
        "meaningEn": "a positive or hopeful aspect in an otherwise difficult situation",
        "source": "Cambridge Vocabulary for IELTS Advanced, Unit 17.1 & 17.2 (P88)"
    }
]

def run_backfill():
    _db_url = os.environ.get("DATABASE_URL")
    if not _db_url:
        raise RuntimeError("DATABASE_URL environment variable is missing")
    conn = psycopg2.connect(_db_url)
    cur = conn.cursor()

    try:
        # 1. Đếm số lượng meaningEn NULL trước khi chạy
        cur.execute('SELECT COUNT(*) FROM idioms WHERE "meaningEn" IS NULL OR trim("meaningEn") = \'\'')
        before_null_count = cur.fetchone()[0]
        print(f"[*] BEFORE BACKFILL: meaningEn null / empty count = {before_null_count}")

        if before_null_count != 194:
            print(f"[!] Warning: Expected 194 null idioms, but found {before_null_count}")

        # 2. Cập nhật từng idiom
        updated_count = 0
        for item in AUDITED_14_IDIOMS:
            cur.execute(
                'UPDATE idioms SET "meaningEn" = %s WHERE id = %s AND (trim(lower(idiom)) = trim(lower(%s)))',
                (item['meaningEn'], item['id'], item['idiom'])
            )
            if cur.rowcount == 1:
                updated_count += 1
            else:
                print(f"[!] Warning: Failed to update {item['id']} ({item['idiom']}), rowcount = {cur.rowcount}")

        conn.commit()
        print(f"[*] Successfully updated {updated_count} of {len(AUDITED_14_IDIOMS)} audited idioms.")

        # 3. Đếm số lượng meaningEn NULL sau khi chạy
        cur.execute('SELECT COUNT(*) FROM idioms WHERE "meaningEn" IS NULL OR trim("meaningEn") = \'\'')
        after_null_count = cur.fetchone()[0]
        print(f"[*] AFTER BACKFILL: meaningEn null / empty count = {after_null_count}")

        expected_after = before_null_count - updated_count
        assert after_null_count == expected_after, f"Expected {expected_after} nulls, got {after_null_count}"
        assert after_null_count == 180, f"Expected exactly 180 nulls remaining, got {after_null_count}"

        # 4. Spot-check đọc lại cả 14 dòng từ database
        print("\n[*] SPOT-CHECK VERIFICATION (Reading directly from DB):")
        ids = [item['id'] for item in AUDITED_14_IDIOMS]
        cur.execute('SELECT id, idiom, "meaningEn", "meaningVi" FROM idioms WHERE id = ANY(%s) ORDER BY id', (ids,))
        rows = cur.fetchall()

        for r in rows:
            print(f"  - [{r[0]}] {r[1]} -> '{r[2]}'")
            assert r[2] is not None and len(r[2].strip()) > 0, f"meaningEn must not be empty for {r[0]}"

        print(f"\n[+] ALL DoD CHECKS PASSED: 14 updated, 180 remaining untouched.")

    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Backfill failed: {e}", file=sys.stderr)
        raise e
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    run_backfill()
