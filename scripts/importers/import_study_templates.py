import os
import json
import psycopg2
from psycopg2.extras import Json

source_file = r"C:\Mod\muse-data-exchange\results\templates-003.json"
db_url = os.environ.get("DATABASE_URL")
if not db_url:
    raise RuntimeError("DATABASE_URL environment variable is missing")

def import_templates():
    if not os.path.exists(source_file):
        raise FileNotFoundError(f"Source file not found: {source_file}")
        
    with open(source_file, "r", encoding="utf-8") as f:
        templates = json.load(f)
        
    print(f"Loaded {len(templates)} templates from {source_file}")
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    upsert_sql = """
    INSERT INTO "study_templates" (id, type, title_vi, title_en, description_vi, structure, source, created_at, updated_at)
    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        type = EXCLUDED.type,
        title_vi = EXCLUDED.title_vi,
        title_en = EXCLUDED.title_en,
        description_vi = EXCLUDED.description_vi,
        structure = EXCLUDED.structure,
        source = EXCLUDED.source,
        updated_at = NOW();
    """
    
    inserted_count = 0
    for t in templates:
        cur.execute(upsert_sql, (
            t["id"],
            t["type"],
            t["title_vi"],
            t["title_en"],
            t["description_vi"],
            Json(t["structure"]),
            t.get("source", "authored")
        ))
        inserted_count += 1
        
    conn.commit()
    print(f"Successfully upserted {inserted_count} templates into study_templates table.")
    
    # Verification: Count
    cur.execute('SELECT COUNT(*) FROM "study_templates";')
    count = cur.fetchone()[0]
    print(f"Total rows in study_templates: {count}")
    
    # Verification: Spot-check 3 templates
    spot_check_ids = ["tpl-003-001", "tpl-003-015", "tpl-003-030"]
    print("\n--- SPOT-CHECK 3 TEMPLATES ---")
    for sc_id in spot_check_ids:
        cur.execute('SELECT id, type, title_vi, title_en, description_vi, structure, source FROM "study_templates" WHERE id = %s;', (sc_id,))
        row = cur.fetchone()
        orig = next((x for x in templates if x["id"] == sc_id), None)
        assert row is not None, f"Row {sc_id} not found in DB!"
        assert orig is not None, f"Original {sc_id} not found in source!"
        assert row[1] == orig["type"], f"Type mismatch for {sc_id}"
        assert row[2] == orig["title_vi"], f"title_vi mismatch for {sc_id}"
        assert row[3] == orig["title_en"], f"title_en mismatch for {sc_id}"
        print(f"Verified {row[0]}: [{row[1]}] {row[2]} ({row[3]}) | structure keys={list(row[5].keys())} -> PASS")
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    import_templates()
