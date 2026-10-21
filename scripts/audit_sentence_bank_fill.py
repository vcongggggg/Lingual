import json
import os
import re
import sys
import psycopg2

sys.stdout.reconfigure(encoding='utf-8')

DB_URL = 'postgresql://postgres:HIgb8WOzsluowBEjq5BA_BNtuEIy6bbk@localhost:5432/linguaflow_db'
RESULTS_DIR = r'C:\Mod\muse-data-exchange\results'

def normalize(text):
    if not text:
        return ''
    text = text.lower().strip()
    return re.sub(r'\s+', ' ', text)

def main():
    print('=== [AUDIT & DEDUPE: sentence-bank-fill-001 (TED2020)] ===')
    
    # 1. Kiem tra cac file part p01..p35
    part_files = []
    for i in range(1, 36):
        fn = f'sentence-bank-fill-001-p{i:02d}.jsonl'
        fp = os.path.join(RESULTS_DIR, fn)
        if not os.path.exists(fp):
            print(f'[ERROR] Missing part file: {fp}')
            return
        part_files.append(fp)
        
    print(f'[1] Tim thay du 35/35 part files: p01 den p35.')
    
    # 2. Doc toan bo cac part files
    total_raw_lines = 0
    valid_records = []
    invalid_lines = 0
    
    for fp in part_files:
        with open(fp, 'r', encoding='utf-8') as f:
            for line_no, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                total_raw_lines += 1
                try:
                    obj = json.loads(line)
                    if 'en' in obj and 'vi' in obj:
                        valid_records.append(obj)
                    else:
                        invalid_lines += 1
                except Exception:
                    invalid_lines += 1
                    
    print(f'[2] Tong so dong JSON hop le: {len(valid_records)} (Ky vong: 170.221, Invalid: {invalid_lines})')
    
    # 3. Lay du lieu hien tai trong sentence_bank (PostgreSQL)
    print(f'[3] Dang load du lieu existing tu bang sentence_bank...')
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    cur.execute('SELECT id, en, vi FROM sentence_bank')
    existing_rows = cur.fetchall()
    cur.close()
    conn.close()
    
    print(f'    So ban ghi existing trong DB: {len(existing_rows)}')
    
    existing_en_vi_set = set()
    existing_en_set = set()
    for row in existing_rows:
        n_en = normalize(row[1])
        n_vi = normalize(row[2])
        existing_en_vi_set.add((n_en, n_vi))
        existing_en_set.add(n_en)
        
    # 4. Dedupe:
    # Yeu cau cua Order:
    # - Loai cap trung noi bo (trong 170.221 cap TED2020)
    # - Loai cap trung voi 21.911 dong Tatoeba dang co trong sentence_bank:
    #   (trung theo cap (en,vi) chuan hoa VA trung rieng mat EN chuan hoa)
    print(f'[4] Tien hanh dedupe:')
    
    seen_internal_pairs = set()
    seen_internal_en = set()
    
    internal_pair_dups = 0
    internal_en_dups = 0
    
    overlap_db_exact_pair = 0
    overlap_db_en_only = 0
    
    kept_records = []
    
    for rec in valid_records:
        n_en = normalize(rec.get('en', ''))
        n_vi = normalize(rec.get('vi', ''))
        pair = (n_en, n_vi)
        
        # Check overlap voi DB truoc
        if pair in existing_en_vi_set:
            overlap_db_exact_pair += 1
            continue
            
        if n_en in existing_en_set:
            overlap_db_en_only += 1
            continue
            
        # Check internal dedupe
        if pair in seen_internal_pairs:
            internal_pair_dups += 1
            continue
            
        # Yeu cau order: "loai cap trung noi bo" - xem xet ca mat en hay chi pair
        # Thuong sentence bank moi pair la mot ban dich khac nhau neu en giong nhau,
        # nhung de tranh duplicate cau EN gay loang, ta kiem tra ca internal en duplicate
        if n_en in seen_internal_en:
            internal_en_dups += 1
            continue
            
        seen_internal_pairs.add(pair)
        seen_internal_en.add(n_en)
        kept_records.append(rec)
        
    print(f'   - Trung lap noi bo theo cap (en, vi): {internal_pair_dups}')
    print(f'   - Trung lap noi bo theo EN: {internal_en_dups}')
    print(f'   - Trung lap voi DB theo cap (en, vi): {overlap_db_exact_pair}')
    print(f'   - Trung lap voi DB theo rieng mat EN: {overlap_db_en_only}')
    print(f'   - Tong so record bi loai: {len(valid_records) - len(kept_records)}')
    print(f'   - So record du dieu kien import: {len(kept_records)}')
    print(f'   - Tong sentence_bank sau khi import du kien: {len(existing_rows) + len(kept_records)}')

if __name__ == '__main__':
    main()
