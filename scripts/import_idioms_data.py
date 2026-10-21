import psycopg2
from psycopg2.extras import execute_batch
import json
import re
import sys
import random

sys.stdout.reconfigure(encoding='utf-8')

DB_URL = 'postgresql://postgres:HIgb8WOzsluowBEjq5BA_BNtuEIy6bbk@localhost:5432/linguaflow_db'

def normalize_text(text):
    text = text.lower().strip()
    return re.sub(r'\s+', ' ', text)

def main():
    print('=== [LINGUAFLOW IDIOMS IMPORT: gen-data-idioms-002] ===')
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    cur = conn.cursor()
    
    try:
        # 1. Kiem tra va giu nguyen 200 idioms hien co
        cur.execute('SELECT id, idiom, "meaningVi", "cefrLevel", source FROM idioms ORDER BY id')
        existing_rows = cur.fetchall()
        existing_count = len(existing_rows)
        print(f'[1] So ban ghi hien co trong DB: {existing_count} (DoD yeu cau khong mat ban ghi cu)')
        
        existing_map = {normalize_text(row[1]): row[0] for row in existing_rows}
        existing_ids = set(row[0] for row in existing_rows)
        
        # 2. Doc file idioms-002.jsonl tu exchange
        filepath = r'C:\Mod\muse-data-exchange\results\idioms-002.jsonl'
        all_file_records = []
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                all_file_records.append(json.loads(line))
                
        print(f'[2] So ban ghi doc tu file idioms-002.jsonl: {len(all_file_records)}')
        
        # 3. Kiem tra overlap
        duplicates = []
        unique_to_import = []
        
        for d in all_file_records:
            norm = normalize_text(d['idiom'])
            if norm in existing_map:
                duplicates.append((d['idiom'], existing_map[norm]))
            else:
                unique_to_import.append(d)
                
        print(f'\n[3] Ket qua phan tich trung lap:')
        print(f'   - So luong trung lap voi DB: {len(duplicates)}')
        print(f'   - So luong ban ghi moi can import: {len(unique_to_import)} (605 - {len(duplicates)} = {len(unique_to_import)})')
        print(f'   - Danh sach 11 idioms trung lap:')
        for item, ex_id in duplicates:
            print(f'     * "{item}" (khop voi existing id={ex_id})')
            
        # 4. Chuan bi batch insert
        insert_records = []
        for idx, d in enumerate(unique_to_import):
            idiom_id = f'idm-{existing_count + idx + 1:03d}'
            insert_records.append((
                idiom_id,
                d['idiom'].strip(),
                d['meaning_vi'].strip(),
                d.get('meaning_en', '').strip() or None,
                d.get('example_en', '').strip() or None,
                d.get('example_vi', '').strip() or None,
                d.get('level', 'B2').strip().upper(),
                d.get('source', 'wiktionary').strip(),
                d.get('license', 'CC BY-SA').strip(),
                False
            ))
            
        print(f'\n[4] Dang nạp {len(insert_records)} ban ghi moi vao bang idioms...')
        insert_sql = '''
            INSERT INTO idioms (
                id, idiom, "meaningVi", "meaningEn", "exampleEn", "exampleVi",
                "cefrLevel", source, license, verified
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        execute_batch(cur, insert_sql, insert_records, page_size=200)
        
        # 5. Kiem tra sau import
        cur.execute('SELECT COUNT(*) FROM idioms')
        total_after = cur.fetchone()[0]
        
        # Kiem tra tat ca 200 ban ghi cu con nguyen ven
        cur.execute('SELECT id FROM idioms WHERE id = ANY(%s)', (list(existing_ids),))
        remaining_old_count = len(cur.fetchall())
        
        # Kiem tra so ban ghi moi
        cur.execute('SELECT COUNT(*) FROM idioms WHERE source = \'wiktionary\'')
        wiktionary_count = cur.fetchone()[0]
        
        print(f'\n[5] Ket qua kiem tra sau import:')
        print(f'   - Tong so ban ghi trong DB: {total_after} (Ky vong: {existing_count + len(unique_to_import)})')
        print(f'   - So ban ghi cu giu nguyen: {remaining_old_count}/{existing_count}')
        print(f'   - So ban ghi moi wiktionary: {wiktionary_count}/{len(unique_to_import)}')
        
        # 6. Lay ngau nhien 5 idioms moi de kiem tra chat luong doc hieu nghia VI
        cur.execute('''
            SELECT id, idiom, "meaningVi", "meaningEn", "exampleEn", "exampleVi", "cefrLevel", source, license
            FROM idioms
            WHERE source = 'wiktionary'
        ''')
        new_rows = cur.fetchall()
        sample_5 = random.sample(new_rows, 5)
        print('\n[6] Mau ngau nhien 5 idioms moi import:')
        for s in sample_5:
            print(f'   - ID: {s[0]} | Level: {s[6]}')
            print(f'     Idiom: "{s[1]}"')
            print(f'     Nghia VI: {s[2]}')
            print(f'     Nghia EN: {s[3]}')
            print(f'     Vi du EN: {s[4]}')
            print(f'     Vi du VI: {s[5]}')
            print(f'     Source: {s[7]} | License: {s[8]}\n')
            
        conn.commit()
        print('>>> TRANSACTION COMMIT THANH CONG! <<<')
        
        return {
            'existing_count': existing_count,
            'file_count': len(all_file_records),
            'duplicate_count': len(duplicates),
            'duplicates': [d[0] for d in duplicates],
            'imported_count': len(unique_to_import),
            'total_after': total_after,
            'old_preserved': remaining_old_count == existing_count,
            'sample_5': [
                {
                    'id': s[0],
                    'idiom': s[1],
                    'meaningVi': s[2],
                    'meaningEn': s[3],
                    'exampleEn': s[4],
                    'exampleVi': s[5],
                    'level': s[6],
                    'source': s[7],
                    'license': s[8]
                }
                for s in sample_5
            ]
        }
        
    except Exception as e:
        conn.rollback()
        print(f'[ERROR] Rollback: {e}')
        raise e
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    main()
