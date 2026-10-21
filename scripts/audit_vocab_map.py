import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# 1. Inspect vocab-sentence-map-001.json
with open(r'C:\Mod\muse-data-exchange\results\vocab-sentence-map-001.json', 'r', encoding='utf-8') as f:
    vocab_map = json.load(f)

print(f'Total words in vocab_map: {len(vocab_map)}')

total_slots_before = 0
total_slots_after = 0
words_with_dupes = 0
total_dupe_slots_dropped = 0

deduped_map = {}
for word, sentences in vocab_map.items():
    total_slots_before += len(sentences)
    # Dedupe preserving order or set
    seen = set()
    clean_sents = []
    for s in sentences:
        s_norm = s.strip()
        if s_norm not in seen:
            seen.add(s_norm)
            clean_sents.append(s_norm)
    
    dupes_in_word = len(sentences) - len(clean_sents)
    if dupes_in_word > 0:
        words_with_dupes += 1
        total_dupe_slots_dropped += dupes_in_word
        
    total_slots_after += len(clean_sents)
    deduped_map[word] = clean_sents

print(f'Total slots before dedupe: {total_slots_before}')
print(f'Words with duplicate sentence slots: {words_with_dupes} (Audit noted: 839)')
print(f'Total duplicate slots dropped: {total_dupe_slots_dropped}')
print(f'Total slots after dedupe: {total_slots_after}')

# 2. Inspect sentence bank sentences
sb_sentences = set()
sb_normalized_map = {} # normalized -> list of ids or count
with open(r'C:\Mod\muse-data-exchange\results\sentence-bank-001.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        d = json.loads(line)
        en = d['en'].strip()
        en_norm = en.lower()
        sb_sentences.add(en)
        if en_norm not in sb_normalized_map:
            sb_normalized_map[en_norm] = []
        sb_normalized_map[en_norm].append(d)

print(f'Total sentence bank records: 21911')
print(f'Unique raw EN sentences in sentence bank: {len(sb_sentences)}')
print(f'Unique normalized EN sentences in sentence bank: {len(sb_normalized_map)}')

# 3. Check matching
matched_sentences = 0
unmatched_sentences = 0
matched_word_slots = 0
unmatched_word_slots = 0

for word, sents in deduped_map.items():
    for s in sents:
        s_norm = s.lower()
        if s in sb_sentences or s_norm in sb_normalized_map:
            matched_word_slots += 1
        else:
            unmatched_word_slots += 1

print(f'Matched word-sentence slots: {matched_word_slots}')
print(f'Unmatched word-sentence slots: {unmatched_word_slots}')

import psycopg2
try:
    from db_helper import get_database_url
except ImportError:
    from scripts.db_helper import get_database_url

conn = psycopg2.connect(get_database_url())
cur = conn.cursor()
cur.execute('SELECT id, lower(trim("targetText")) FROM vocabularies')
db_vocab = {}
for vid, word in cur.fetchall():
    if word not in db_vocab:
        db_vocab[word] = vid

matched_words = 0
unmatched_words = []
for w in deduped_map.keys():
    w_norm = w.lower().strip()
    if w_norm in db_vocab:
        matched_words += 1
    else:
        unmatched_words.append(w)

print(f'Total Vocabulary in DB: {len(db_vocab)}')
print(f'Words in map matched with DB: {matched_words}/{len(deduped_map)}')
print(f'Words unmatched: {len(unmatched_words)}')
if unmatched_words:
    print('Sample unmatched words:', unmatched_words[:5])

