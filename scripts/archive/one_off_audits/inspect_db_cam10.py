import os
import psycopg2

_db_url = os.environ.get("DATABASE_URL")
if not _db_url:
    raise RuntimeError("DATABASE_URL environment variable is missing")
conn = psycopg2.connect(_db_url)
cur = conn.cursor()

print("=== READING PASSAGES (CAM10) ===")
cur.execute('SELECT id, pg_typeof("passageJson"), left("passageJson"::text, 100), length("passageJson"::text) FROM ielts_reading_passages WHERE id LIKE %s ORDER BY id;', ('cam10%',))
for r in cur.fetchall():
    print(r[0], r[1], r[3], repr(r[2]))

print("\n=== LISTENING SECTIONS (CAM10) ===")
cur.execute('SELECT id, pg_typeof("scriptJson"), left("scriptJson"::text, 80), length("scriptJson"::text) FROM ielts_listening_sections WHERE id LIKE %s ORDER BY id;', ('cam10%',))
for r in cur.fetchall():
    print(r[0], r[1], r[3], repr(r[2]))

print("\n=== QUESTIONS JSON (CAM10 T4) ===")
cur.execute('SELECT id, left("questionsJson"::text, 120) FROM ielts_reading_passages WHERE id LIKE %s ORDER BY id;', ('cam10-academic-t4%',))
for r in cur.fetchall():
    print(r[0], repr(r[1]))

cur.close()
conn.close()
