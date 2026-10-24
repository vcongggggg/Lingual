import json
import os
import re
import sys
import uuid
import datetime
import psycopg2
from psycopg2.extras import execute_batch
from collections import defaultdict

try:
    from db_helper import get_database_url
except ImportError:
    from scripts.db_helper import get_database_url

RESULTS_DIR = r'C:\Mod\muse-data-exchange\results'

def normalize(text):
    if not text:
        return ''
    text = text.lower().strip()
    return re.sub(r'\s+', ' ', text)

def main():
    print('=== [EXECUTE IMPORT: sentence-bank-fill-001 (TED2020)] ===')
    start_time = datetime.datetime.now()
    
    # 1. Kiem tra 35 part files
    part_files = []
    for i in range(1, 36):
        fn = f'sentence-bank-fill-001-p{i:02d}.jsonl'
        fp = os.path.join(RESULTS_DIR, fn)
        if not os.path.exists(fp):
            raise FileNotFoundError(f'Missing part file: {fp}')
        part_files.append(fp)
    print(f'[1] Tim thay 35/35 part files (p01 - p35).')
    
    # 2. Doc toan bo 35 part files
    all_records = []
    for fp in part_files:
        with open(fp, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line:
                    all_records.append(json.loads(line))
    total_file_records = len(all_records)
    print(f'[2] Tong so ban ghi doc tu 35 files: {total_file_records} (Khop manifest 170.221)')
    
    # 3. Ket noi DB va lay thong tin hien tai
    conn = psycopg2.connect(get_database_url())
    conn.autocommit = False
    cur = conn.cursor()
    
    try:
        cur.execute('SELECT id, en, vi FROM sentence_bank')
        existing_rows = cur.fetchall()
        existing_count = len(existing_rows)
        print(f'[3] Ban ghi hien tai trong sentence_bank: {existing_count}')
        
        existing_pairs = set()
        existing_ens = set()
        for row in existing_rows:
            n_en = normalize(row[1])
            n_vi = normalize(row[2])
            existing_pairs.add((n_en, n_vi))
            existing_ens.add(n_en)
            
        # 4. Dedupe
        print(f'[4] Dang dedupe toan bo ban ghi...')
        seen_pairs = set()
        seen_ens = set()
        
        internal_pair_dups = 0
        internal_en_dups = 0
        db_pair_overlap = 0
        db_en_overlap = 0
        
        to_import = []
        for r in all_records:
            n_en = normalize(r.get('en', ''))
            n_vi = normalize(r.get('vi', ''))
            pair = (n_en, n_vi)
            
            if pair in existing_pairs:
                db_pair_overlap += 1
                continue
            if n_en in existing_ens:
                db_en_overlap += 1
                continue
            if pair in seen_pairs:
                internal_pair_dups += 1
                continue
            if n_en in seen_ens:
                internal_en_dups += 1
                continue
                
            seen_pairs.add(pair)
            seen_ens.add(n_en)
            to_import.append(r)
            
        dropped_count = total_file_records - len(to_import)
        print(f'   - Trung lap noi bo theo pair: {internal_pair_dups}')
        print(f'   - Trung lap noi bo theo EN: {internal_en_dups}')
        print(f'   - Trung lap voi DB theo pair: {db_pair_overlap}')
        print(f'   - Trung lap voi DB theo EN: {db_en_overlap}')
        print(f'   - Tong bi loai: {dropped_count}')
        print(f'   - So luong se import: {len(to_import)}')
        print(f'   - Du kien tong sentence_bank sau import: {existing_count + len(to_import)}')
        
        # 5. Chuan bi batch insert vao sentence_bank
        print(f'\n[5] Dang tao ID va insert vao bang sentence_bank theo batch...')
        insert_rows = []
        sentence_bank_items = [] # (sb_id, en_text) cho muc tieu lien ket vocab
        
        now_ts = datetime.datetime.now(datetime.timezone.utc)
        default_license = 'CC BY-NC-ND 4.0 (TED Talks Usage Policy)'
        
        for r in to_import:
            sb_id = str(uuid.uuid4())
            en = r['en'].strip()
            vi = r['vi'].strip()
            en_id = r.get('en_id')
            vi_id = r.get('vi_id')
            source = 'TED2020'
            license_val = default_license
            
            insert_rows.append((sb_id, en, en_id, vi, vi_id, source, license_val, now_ts))
            sentence_bank_items.append((sb_id, en))
            
        insert_sql = '''
            INSERT INTO sentence_bank (
                id, en, en_id, vi, vi_id, source, license, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        '''
        execute_batch(cur, insert_sql, insert_rows, page_size=5000)
        print(f'    Insert thanh cong {len(insert_rows)} ban ghi vao sentence_bank!')
        
        # 6. Mo rong word_sentence_links cho cac tu chua co link
        print(f'\n[6] Dang phan tich mo rong word_sentence_links cho tu vung chua co link...')
        cur.execute('''
            SELECT v.id, v."targetText" 
            FROM vocabularies v 
            WHERE NOT EXISTS (
                SELECT 1 FROM word_sentence_links wsl WHERE wsl.vocabulary_id = v.id
            )
        ''')
        unlinked_vocab_rows = cur.fetchall()
        print(f'    So tu vung chua co lien ket cau: {len(unlinked_vocab_rows)}')
        
        unlinked_map = {}
        for vid, target_text in unlinked_vocab_rows:
            w_norm = normalize(target_text)
            if w_norm and len(w_norm) > 1:
                unlinked_map[w_norm] = vid
                
        # Index candidate sentences cho cac tu unlinked
        # Chi chon cac cau vua phai (do dai 15 den 120 ky tu, it nhat 3 tu)
        word_candidates = defaultdict(list)
        for sb_id, en_text in sentence_bank_items:
            en_len = len(en_text)
            if 15 <= en_len <= 120:
                words = set(re.findall(r"[a-z0-9'-]+", en_text.lower()))
                for w in words:
                    if w in unlinked_map:
                        word_candidates[w].append((en_len, sb_id))
                        
        new_links = []
        covered_words_count = 0
        for w, vid in unlinked_map.items():
            candidates = word_candidates.get(w, [])
            if candidates:
                covered_words_count += 1
                # Uu tien cau ngan ro nghia, toi da 3 cau/tu
                candidates.sort(key=lambda x: x[0])
                chosen = candidates[:3]
                for _, sb_id in chosen:
                    new_links.append((str(uuid.uuid4()), vid, sb_id, now_ts))
                    
        print(f'    So tu vung unlinked duoc phu them: {covered_words_count} / {len(unlinked_map)}')
        print(f'    So link moi duoc tao: {len(new_links)}')
        
        if new_links:
            insert_link_sql = '''
                INSERT INTO word_sentence_links (
                    id, vocabulary_id, sentence_bank_id, created_at
                ) VALUES (%s, %s, %s, %s)
            '''
            execute_batch(cur, insert_link_sql, new_links, page_size=5000)
            print(f'    Insert thanh cong {len(new_links)} word_sentence_links!')
            
        # 7. Kiem tra lai toan bo sau import
        cur.execute('SELECT COUNT(*) FROM sentence_bank')
        final_sb_count = cur.fetchone()[0]
        
        cur.execute('SELECT COUNT(*) FROM sentence_bank WHERE source = \'TED2020\'')
        ted_sb_count = cur.fetchone()[0]
        
        cur.execute('SELECT COUNT(*) FROM sentence_bank WHERE source = \'tatoeba\'')
        tatoeba_sb_count = cur.fetchone()[0]
        
        cur.execute('SELECT COUNT(*) FROM word_sentence_links')
        final_link_count = cur.fetchone()[0]
        
        cur.execute('SELECT COUNT(DISTINCT vocabulary_id) FROM word_sentence_links')
        final_linked_vocab_count = cur.fetchone()[0]
        
        cur.execute('SELECT COUNT(*) FROM vocabularies')
        total_vocab_count = cur.fetchone()[0]
        
        coverage_pct = round((final_linked_vocab_count / total_vocab_count) * 100, 2)
        
        print(f'\n[7] Ket qua kiem tra tong the sau import:')
        print(f'    - Tong sentence_bank: {final_sb_count} (Ky vong: {existing_count + len(to_import)})')
        print(f'    - TED2020 records: {ted_sb_count}')
        print(f'    - Tatoeba records (cu, giu nguyen): {tatoeba_sb_count}')
        print(f'    - Tong word_sentence_links: {final_link_count}')
        print(f'    - So tu duoc lien ket cau: {final_linked_vocab_count}/{total_vocab_count} ({coverage_pct}%)')
        
        # 8. Lay mau 3 cau TED2020 de verify noi dung
        cur.execute('''
            SELECT id, en, vi, en_id, vi_id, source, license
            FROM sentence_bank
            WHERE source = 'TED2020'
            ORDER BY id
            LIMIT 3
        ''')
        sample_rows = cur.fetchall()
        print(f'\n[8] Mau 3 cau TED2020 vua import:')
        for s in sample_rows:
            print(f'    - ID: {s[0]} (en_id: {s[3]}, vi_id: {s[4]})')
            print(f'      EN: {s[1]}')
            print(f'      VI: {s[2]}')
            print(f'      Source: {s[5]} | License: {s[6]}\n')
            
        conn.commit()
        print('>>> TRANSACTION COMMIT THANH CONG! <<<')
        
        elapsed = (datetime.datetime.now() - start_time).total_seconds()
        print(f'Thoi gian thuc hien: {elapsed:.2f} giay')
        
        return {
            'total_file_records': total_file_records,
            'existing_count': existing_count,
            'dropped_count': dropped_count,
            'internal_pair_dups': internal_pair_dups,
            'internal_en_dups': internal_en_dups,
            'db_pair_overlap': db_pair_overlap,
            'db_en_overlap': db_en_overlap,
            'imported_count': len(to_import),
            'final_sb_count': final_sb_count,
            'ted_sb_count': ted_sb_count,
            'tatoeba_sb_count': tatoeba_sb_count,
            'covered_words_new': covered_words_count,
            'new_links_count': len(new_links),
            'final_link_count': final_link_count,
            'final_linked_vocab_count': final_linked_vocab_count,
            'total_vocab_count': total_vocab_count,
            'coverage_pct': coverage_pct
        }
        
    except Exception as e:
        conn.rollback()
        print(f'[ERROR] Rollback xay ra: {e}')
        raise e
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    main()
