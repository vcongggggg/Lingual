import psycopg2
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding='utf-8')
from db_helper import get_database_url

conn = psycopg2.connect(get_database_url())
cur = conn.cursor()
cur.execute('SELECT id, question, "optionsJson", "correctAnswer", "explanationVi", "cefrLevel", topic, source FROM grammar_questions WHERE id = %s', ('gq-315',))
row = cur.fetchone()
print("gq-315 details:")
print("id:", row[0])
print("question:", row[1])
print("options:", row[2])
print("answer:", row[3])
print("explanation:", row[4])
print("source:", row[7])

# Check if any [G-TAG] in DB currently
cur.execute("SELECT COUNT(*) FROM grammar_questions WHERE \"explanationVi\" LIKE '[G-TAG]%'")
print("G-TAG in DB right now:", cur.fetchone()[0])
conn.close()
