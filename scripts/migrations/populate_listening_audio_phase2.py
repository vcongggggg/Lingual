import os
"""
Populate Listening Audio Phase 2:
- Barron 8 sections: populate audioUrl, audioStartSec/audioEndSec = NULL
- Cam01/02 32 sections: populate audioStartSec and audioEndSec (with Cam02 T3 S4 calibrated to 1398)
Task ID: lingual-listening-audio-phase2-populate-001
"""

import sys
import psycopg2

BARRON_MAP = [
    {
        "id": "barrons-academic-t2-l1",
        "title": "Shopping Mall Survey",
        "audioUrl": "/audio/ielts-listening/barrons-ielts-practice-tests/Barons_IELTS_CD2_10.mp3",
    },
    {
        "id": "barrons-academic-t2-l2",
        "title": "Health Club Tour",
        "audioUrl": "/audio/ielts-listening/barrons-ielts-practice-tests/Barons_IELTS_CD2_11.mp3",
    },
    {
        "id": "barrons-academic-t2-l3",
        "title": "Essay Writing Class",
        "audioUrl": "/audio/ielts-listening/barrons-ielts-practice-tests/Barons_IELTS_CD2_12.mp3",
    },
    {
        "id": "barrons-academic-t2-l4",
        "title": "Introduction to Anthropology Class",
        "audioUrl": "/audio/ielts-listening/barrons-ielts-practice-tests/Barons_IELTS_CD2_13.mp3",
    },
    {
        "id": "barrons-academic-t3-l1",
        "title": "Lost Item Report",
        "audioUrl": "/audio/ielts-listening/barrons-ielts-practice-tests/Barons_IELTS_CD2_14.mp3",
    },
    {
        "id": "barrons-academic-t3-l2",
        "title": "Places to Look for Housing",
        "audioUrl": "/audio/ielts-listening/barrons-ielts-practice-tests/Barons_IELTS_CD2_15.mp3",
    },
    {
        "id": "barrons-academic-t3-l3",
        "title": "Bicycles",
        "audioUrl": "/audio/ielts-listening/barrons-ielts-practice-tests/Barons_IELTS_CD2_16.mp3",
    },
    {
        "id": "barrons-academic-t3-l4",
        "title": "Writing a Research Paper",
        "audioUrl": "/audio/ielts-listening/barrons-ielts-practice-tests/Barons_IELTS_CD2_18.mp3",
    },
]

CAMBRIDGE_TIMESTAMPS = [
    # Cam01 Test 1
    {"id": "cam01-academic-t1-l1", "start": 0, "end": 470},
    {"id": "cam01-academic-t1-l2", "start": 470, "end": 731},
    {"id": "cam01-academic-t1-l3", "start": 731, "end": 1113},
    {"id": "cam01-academic-t1-l4", "start": 1113, "end": 1573},
    # Cam01 Test 2
    {"id": "cam01-academic-t2-l1", "start": 0, "end": 482},
    {"id": "cam01-academic-t2-l2", "start": 482, "end": 728},
    {"id": "cam01-academic-t2-l3", "start": 728, "end": 1108},
    {"id": "cam01-academic-t2-l4", "start": 1108, "end": 1494},
    # Cam01 Test 3
    {"id": "cam01-academic-t3-l1", "start": 0, "end": 470},
    {"id": "cam01-academic-t3-l2", "start": 470, "end": 874},
    {"id": "cam01-academic-t3-l3", "start": 874, "end": 1198},
    {"id": "cam01-academic-t3-l4", "start": 1198, "end": 1637},
    # Cam01 Test 4
    {"id": "cam01-academic-t4-l1", "start": 0, "end": 473},
    {"id": "cam01-academic-t4-l2", "start": 473, "end": 726},
    {"id": "cam01-academic-t4-l3", "start": 726, "end": 1075},
    {"id": "cam01-academic-t4-l4", "start": 1075, "end": 1686},

    # Cam02 Test 1
    {"id": "cam02-academic-t1-l1", "start": 0, "end": 395},
    {"id": "cam02-academic-t1-l2", "start": 395, "end": 754},
    {"id": "cam02-academic-t1-l3", "start": 754, "end": 1048},
    {"id": "cam02-academic-t1-l4", "start": 1048, "end": 1467},
    # Cam02 Test 2
    {"id": "cam02-academic-t2-l1", "start": 0, "end": 508},
    {"id": "cam02-academic-t2-l2", "start": 508, "end": 829},
    {"id": "cam02-academic-t2-l3", "start": 829, "end": 1122},
    {"id": "cam02-academic-t2-l4", "start": 1122, "end": 1466},
    # Cam02 Test 3 (HIEU CHINH S4: 1080 - 1398)
    {"id": "cam02-academic-t3-l1", "start": 0, "end": 420},
    {"id": "cam02-academic-t3-l2", "start": 420, "end": 760},
    {"id": "cam02-academic-t3-l3", "start": 760, "end": 1080},
    {"id": "cam02-academic-t3-l4", "start": 1080, "end": 1398},
    # Cam02 Test 4
    {"id": "cam02-academic-t4-l1", "start": 0, "end": 435},
    {"id": "cam02-academic-t4-l2", "start": 435, "end": 770},
    {"id": "cam02-academic-t4-l3", "start": 770, "end": 1100},
    {"id": "cam02-academic-t4-l4", "start": 1100, "end": 1470},
]

def run():
    _db_url = os.environ.get("DATABASE_URL")
    if not _db_url:
        raise RuntimeError("DATABASE_URL environment variable is missing")
    conn = psycopg2.connect(_db_url)
    cur = conn.cursor()

    try:
        # 1. State before
        barron_ids = [b['id'] for b in BARRON_MAP]
        cur.execute("SELECT COUNT(*) FROM ielts_listening_sections WHERE id = ANY(%s) AND audio_url IS NOT NULL", (barron_ids,))
        barron_with_url_before = cur.fetchone()[0]

        cam_ids = [c['id'] for c in CAMBRIDGE_TIMESTAMPS]
        cur.execute("SELECT COUNT(*) FROM ielts_listening_sections WHERE id = ANY(%s) AND audio_start_sec IS NOT NULL", (cam_ids,))
        cam_with_timestamps_before = cur.fetchone()[0]

        print(f"[*] BEFORE: Barron sections with audio_url: {barron_with_url_before}/8")
        print(f"[*] BEFORE: Cam01/Cam02 sections with timestamps: {cam_with_timestamps_before}/32")

        # 2. Update Barron
        barron_updated = 0
        for b in BARRON_MAP:
            cur.execute("""
                UPDATE ielts_listening_sections
                SET audio_url = %s, audio_start_sec = NULL, audio_end_sec = NULL
                WHERE id = %s
            """, (b['audioUrl'], b['id']))
            if cur.rowcount == 1:
                barron_updated += 1
            else:
                print(f"[!] Warning: Barron section {b['id']} not updated (rowcount={cur.rowcount})")

        # 3. Update Cam01/02 timestamps
        cam_updated = 0
        for c in CAMBRIDGE_TIMESTAMPS:
            cur.execute("""
                UPDATE ielts_listening_sections
                SET audio_start_sec = %s, audio_end_sec = %s
                WHERE id = %s
            """, (c['start'], c['end'], c['id']))
            if cur.rowcount == 1:
                cam_updated += 1
            else:
                print(f"[!] Warning: Cam section {c['id']} not updated (rowcount={cur.rowcount})")

        conn.commit()
        print(f"[*] UPDATED: Barron {barron_updated}/8, Cam01/02 {cam_updated}/32")

        # 4. State after
        cur.execute("SELECT COUNT(*) FROM ielts_listening_sections WHERE id = ANY(%s) AND audio_url IS NOT NULL", (barron_ids,))
        barron_with_url_after = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM ielts_listening_sections WHERE id = ANY(%s) AND audio_start_sec IS NOT NULL AND audio_end_sec IS NOT NULL", (cam_ids,))
        cam_with_timestamps_after = cur.fetchone()[0]

        print(f"[*] AFTER: Barron sections with audio_url: {barron_with_url_after}/8")
        print(f"[*] AFTER: Cam01/Cam02 sections with timestamps: {cam_with_timestamps_after}/32")

        assert barron_with_url_after == 8, f"Expected 8 Barron sections with url, got {barron_with_url_after}"
        assert cam_with_timestamps_after == 32, f"Expected 32 Cam sections with timestamps, got {cam_with_timestamps_after}"

        # 5. Spot-check 2 Barron sections + 2 Cam sections
        print("\n[*] SPOT-CHECK FROM DB:")
        spot_ids = [
            'barrons-academic-t2-l1',
            'barrons-academic-t3-l4',
            'cam01-academic-t1-l1',
            'cam02-academic-t3-l4'
        ]
        cur.execute("""
            SELECT id, title, audio_url, audio_start_sec, audio_end_sec
            FROM ielts_listening_sections
            WHERE id = ANY(%s)
            ORDER BY id
        """, (spot_ids,))
        for row in cur.fetchall():
            print(f"  [{row[0]}] {row[1]}:")
            print(f"      audio_url: {row[2]}")
            print(f"      start_sec: {row[3]}, end_sec: {row[4]}")

        print("\n[+] ALL PHASE 2 POPULATE DoD CHECKS PASSED SUCCESSFULLY!")

    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Populate failed: {e}", file=sys.stderr)
        raise e
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    run()
