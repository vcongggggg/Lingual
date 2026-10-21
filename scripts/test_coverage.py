import os
import sys
import json
import re
import uuid
import psycopg2
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

DB_URL = 'postgresql://postgres:HIgb8WOzsluowBEjq5BA_BNtuEIy6bbk@localhost:5432/linguaflow_db'
RESULTS_DIR = r'C:\Mod\muse-data-exchange\results'

def normalize(text):
    if not text:
        return ''
    text = text.lower().strip()
    return re.sub(r'\s+', ' ', text)

def test_coverage():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # 1. Lay vocab chua co link
    cur.execute('''
        SELECT v.id, v."targetText" 
        FROM vocabularies v 
        WHERE NOT EXISTS (
            SELECT 1 FROM word_sentence_links wsl WHERE wsl.vocabulary_id = v.id
        )
    ''')
    unlinked = cur.fetchall()
    print(f'Unlinked vocabularies count: {len(unlinked)}')
    
    vocab_map = {}
    for vid, word in unlinked:
        w_norm = normalize(word)
        if w_norm:
            vocab_map[w_norm] = vid
            
    print(f'Unique unlinked word keys: {len(vocab_map)}')
    
    # 2. Doc sample 5 files de test match
    sample_sentences = []
    for i in range(1, 6):
        fn = f'sentence-bank-fill-001-p{i:02d}.jsonl'
        fp = os.path.join(RESULTS_DIR, fn)
        with open(fp, 'r', encoding='utf-8') as f:
            for line in f:
                obj = json.loads(line)
                sample_sentences.append(obj['en'])
                
    print(f'Sample sentences loaded: {len(sample_sentences)}')
    
    matched = defaultdict(list)
    for s in sample_sentences:
        tokens = set(re.findall(r"[a-z0-9'-]+", s.lower()))
        for token in tokens:
            if token in vocab_map:
                matched[token].append(s)
                
    print(f'Matched words in first 5 parts: {len(matched)} / {len(vocab_map)}')
    conn.close()

if __name__ == '__main__':
    test_coverage()
