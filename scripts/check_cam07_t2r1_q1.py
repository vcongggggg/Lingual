import os
import sys
import json
import psycopg2

sys.stdout.reconfigure(encoding='utf-8')

DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

conn = psycopg2.connect(DSN)
cur = conn.cursor()

select_query = 'SELECT "questionsJson" FROM "ielts_reading_passages" WHERE id = \'cam07-academic-t2-r1\';'
cur.execute(select_query)
row = cur.fetchone()

if not row:
    print("RECORD_NOT_FOUND")
    sys.exit(1)

questions = json.loads(row[0]) if isinstance(row[0], str) else row[0]
q1 = next((q for q in questions if q.get("questionNumber") == 1), None)

print("--- RESULT ---")
print("SELECT_QUERY:", select_query)
if q1:
    print("QUESTION_NUMBER:", q1.get("questionNumber"))
    print("QUESTION_STEM:", q1.get("question"))
    print("TYPE:", q1.get("type"))
    print("SOURCEREF:", q1.get("sourceRef"))
    print("CORRECT_ANSWER:", q1.get("correctAnswer"))
    print("OPTIONS:", q1.get("options"))
    print("FULL_JSON:", json.dumps(q1, ensure_ascii=False))
else:
    print("Q1_NOT_FOUND")

cur.close()
conn.close()
