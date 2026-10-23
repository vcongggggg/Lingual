import psycopg2

DSN = "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db"
conn = psycopg2.connect(DSN)
cur = conn.cursor()

# Add track column if not exists to listening, writing_models, speaking_topics
for table in ["ielts_listening_sections", "ielts_writing_models", "ielts_speaking_topics"]:
    cur.execute(f'ALTER TABLE "{table}" ADD COLUMN IF NOT EXISTS "track" text DEFAULT \'academic\';')
    cur.execute(f'UPDATE "{table}" SET "track" = \'academic\' WHERE "track" IS NULL;')
    print(f"Added and populated track='academic' on {table}")

conn.commit()

# Verify track column on all 5 tables
tables = [
    'ielts_reading_passages',
    'ielts_listening_sections',
    'ielts_writing_topics',
    'ielts_writing_models',
    'ielts_speaking_topics'
]

for t in tables:
    cur.execute(f'SELECT count(*), count(*) FILTER (WHERE track = \'academic\') FROM "{t}" WHERE id LIKE \'cam06-academic-t1%\'')
    total_t1, t1_acad = cur.fetchone()
    print(f"Table '{t}': Test 1 count={total_t1}, track='academic' count={t1_acad}")

conn.close()
