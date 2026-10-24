import psycopg2

conn = psycopg2.connect("postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")
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
