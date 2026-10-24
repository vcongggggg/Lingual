import psycopg2
import json

conn = psycopg2.connect("postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")
cur = conn.cursor()
for book in ['cam06', 'cam07', 'cam09', 'cam11']:
    cur.execute('SELECT id, left("passageJson"::text, 80) FROM ielts_reading_passages WHERE id LIKE %s LIMIT 2;', (f'{book}%',))
    for r in cur.fetchall():
        print('RP', r[0], repr(r[1]))
    cur.execute('SELECT id, left("scriptJson"::text, 80) FROM ielts_listening_sections WHERE id LIKE %s LIMIT 2;', (f'{book}%',))
    for r in cur.fetchall():
        print('LS', r[0], repr(r[1]))
cur.close()
conn.close()

print("\n=== Check mapped aggregate files ===")
mapped_rp = r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-10\ielts_reading_passages.json"
with open(mapped_rp, "r", encoding="utf-8") as f:
    rp_data = json.load(f)
    print("RP aggregate total count:", len(rp_data))
    for p in rp_data:
        if p["id"] in ["cam10-academic-t1-r1", "cam10-academic-t2-r1", "cam10-academic-t3-r1", "cam10-academic-t4-p1"]:
            print(p["id"], "pj type:", type(p.get("passageJson")), "len:", len(str(p.get("passageJson"))))

mapped_ls = r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-10\ielts_listening_sections.json"
with open(mapped_ls, "r", encoding="utf-8") as f:
    ls_data = json.load(f)
    print("LS aggregate total count:", len(ls_data))
    for s in ls_data:
        if s["id"] in ["cam10-academic-t1-l1", "cam10-academic-t2-l1", "cam10-academic-t2-l4", "cam10-academic-t3-l1", "cam10-academic-t4-s1"]:
            print(s["id"], "sj type:", type(s.get("scriptJson")), "len:", len(str(s.get("scriptJson"))))
