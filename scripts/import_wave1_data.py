import json
import sys
import uuid
import time
import psycopg2
from psycopg2.extras import execute_batch

sys.stdout.reconfigure(encoding='utf-8')

DB_URL = 'postgresql://postgres:HIgb8WOzsluowBEjq5BA_BNtuEIy6bbk@localhost:5432/linguaflow_db'

def main():
    print('=== [LINGUAFLOW WAVE 1 DATA IMPORT] ===')
    start_time = time.time()
    
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    cur = conn.cursor()
    
    results = {}
    
    try:
        # =========================================================================
        # 1. IMPORT SENTENCE BANK (Tatoeba 21,911 pairs)
        # =========================================================================
        print('\n[1/4] Dang import sentence-bank-001.jsonl...')
        t0 = time.time()
        
        # Check if table already has data
        cur.execute('SELECT COUNT(*) FROM sentence_bank')
        existing_sb = cur.fetchone()[0]
        print(f'   - So luong hien co trong sentence_bank: {existing_sb}')
        
        sb_records = []
        with open(r'C:\Mod\muse-data-exchange\results\sentence-bank-001.jsonl', 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                d = json.loads(line)
                record_id = str(uuid.uuid4())
                sb_records.append((
                    record_id,
                    d['en'],
                    d.get('en_id'),
                    d['vi'],
                    d.get('vi_id'),
                    'tatoeba',
                    'CC BY 2.0 FR'
                ))
                
        print(f'   - Doc duoc tu file: {len(sb_records)} ban ghi')
        
        if existing_sb > 0:
            print(f'   - Xoa {existing_sb} ban ghi cu de nap tron ven...')
            cur.execute('DELETE FROM word_sentence_links')
            cur.execute('DELETE FROM sentence_bank')
            
        insert_sb_sql = '''
            INSERT INTO sentence_bank (id, en, en_id, vi, vi_id, source, license)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        '''
        execute_batch(cur, insert_sb_sql, sb_records, page_size=2000)
        
        cur.execute('SELECT COUNT(*) FROM sentence_bank')
        sb_count = cur.fetchone()[0]
        print(f'   -> Da import thanh cong: {sb_count} ban ghi vao sentence_bank ({time.time() - t0:.2f}s)')
        results['sentence_bank'] = {
            'expected': 21911,
            'imported': sb_count,
            'match_dod': sb_count == 21911
        }
        
        # =========================================================================
        # 2. IMPORT VOCABULARY SENTENCE MAP (WordSentenceLink)
        # =========================================================================
        print('\n[2/4] Dang import vocab-sentence-map-001.json...')
        t0 = time.time()
        
        with open(r'C:\Mod\muse-data-exchange\results\vocab-sentence-map-001.json', 'r', encoding='utf-8') as f:
            vocab_map = json.load(f)
            
        print(f'   - Doc duoc: {len(vocab_map)} tu vung tu vocab-sentence-map')
        
        # Dedupe duplicated slots in each word
        total_slots_before = 0
        total_slots_after = 0
        words_with_dupes = 0
        total_dupe_slots_dropped = 0
        deduped_map = {}
        
        for word, sentences in vocab_map.items():
            total_slots_before += len(sentences)
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
            
        print(f'   - Dedupe ket qua: {words_with_dupes} tu co slot lap nguyen van')
        print(f'   - So slot bi loai bo: {total_dupe_slots_dropped}')
        print(f'   - So slot hop le con lai: {total_slots_after}')
        
        # Map vocabularyId by word
        cur.execute('SELECT id, lower(trim("targetText")) FROM vocabularies')
        db_vocab = {}
        for vid, target in cur.fetchall():
            if target not in db_vocab:
                db_vocab[target] = vid
                
        # Map sentenceBankId by normalized EN sentence (pick first match)
        cur.execute('SELECT id, lower(trim(en)) FROM sentence_bank')
        db_sentences = {}
        for s_id, en_norm in cur.fetchall():
            if en_norm not in db_sentences:
                db_sentences[en_norm] = s_id
                
        link_records = []
        unmatched_sentences = 0
        unmatched_words = 0
        
        for word, sents in deduped_map.items():
            w_norm = word.lower().strip()
            vocab_id = db_vocab.get(w_norm)
            if not vocab_id:
                unmatched_words += 1
                continue
                
            for s in sents:
                s_norm = s.lower().strip()
                sb_id = db_sentences.get(s_norm)
                if sb_id:
                    link_records.append((str(uuid.uuid4()), vocab_id, sb_id))
                else:
                    unmatched_sentences += 1
                    
        print(f'   - Chuan bi insert {len(link_records)} lien ket word <-> sentence')
        print(f'   - So cau khong khop duoc: {unmatched_sentences}')
        print(f'   - So tu khong tim thay trong Vocabulary: {unmatched_words}')
        
        insert_link_sql = '''
            INSERT INTO word_sentence_links (id, vocabulary_id, sentence_bank_id)
            VALUES (%s, %s, %s)
            ON CONFLICT (vocabulary_id, sentence_bank_id) DO NOTHING
        '''
        execute_batch(cur, insert_link_sql, link_records, page_size=2000)
        
        cur.execute('SELECT COUNT(*) FROM word_sentence_links')
        link_count = cur.fetchone()[0]
        print(f'   -> Da import thanh cong: {link_count} lien ket vao word_sentence_links ({time.time() - t0:.2f}s)')
        
        results['vocab_map'] = {
            'total_words': len(vocab_map),
            'words_with_dupe_slots': words_with_dupes,
            'dupe_slots_dropped': total_dupe_slots_dropped,
            'slots_after_dedupe': total_slots_after,
            'links_created': link_count,
            'unmatched_sentences': unmatched_sentences,
            'unmatched_words': unmatched_words
        }
        
        # =========================================================================
        # 3. IMPORT VOA DIALOGUES (81 VOA Let's Learn English)
        # =========================================================================
        print('\n[3/4] Dang import voa-dialogues-001.json...')
        t0 = time.time()
        
        cur.execute('SELECT COUNT(*) FROM dialogue_scenarios')
        prev_dlg_count = cur.fetchone()[0]
        print(f'   - So luong hien co trong dialogue_scenarios: {prev_dlg_count}')
        
        cur.execute('SELECT lower(trim(title)) FROM dialogue_scenarios')
        existing_dlg_titles = set(r[0] for r in cur.fetchall())
        
        with open(r'C:\Mod\muse-data-exchange\results\voa-dialogues-001.json', 'r', encoding='utf-8') as f:
            voa_dlgs = json.load(f)
            
        print(f'   - Doc duoc tu file: {len(voa_dlgs)} hoi thoai VOA')
        
        dlg_inserted = 0
        dlg_skipped = 0
        insert_dlg_records = []
        
        for i, d in enumerate(voa_dlgs):
            title = d['title'].strip()
            if title.lower() in existing_dlg_titles:
                dlg_skipped += 1
                continue
                
            dlg_id = f'dlg-voa-{i+1:03d}'
            characters_json = json.dumps([{'name': s, 'role': 'speaker'} for s in d.get('speakers', [])], ensure_ascii=False)
            lines_data = [
                {
                    'id': f'line-{idx+1}',
                    'speaker': l.get('speaker', ''),
                    'textEn': l.get('en', ''),
                    'textVi': None
                }
                for idx, l in enumerate(d.get('lines', []))
            ]
            lines_json = json.dumps(lines_data, ensure_ascii=False)
            
            insert_dlg_records.append((
                dlg_id,
                title,
                None, # titleVi
                "Let's Learn English",
                "Học tiếng Anh cùng VOA",
                characters_json,
                lines_json,
                "[]", # questionsJson
                "A1", # VOA Let's Learn English level
                "listening",
                "VOA Learning English",
                False
            ))
            existing_dlg_titles.add(title.lower())
            dlg_inserted += 1
            
        insert_dlg_sql = '''
            INSERT INTO dialogue_scenarios (
                id, title, "titleVi", topic, "topicVi",
                characters, "linesJson", "questionsJson",
                "cefrLevel", "skillFocus", source, verified
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        execute_batch(cur, insert_dlg_sql, insert_dlg_records, page_size=100)
        
        cur.execute('SELECT COUNT(*) FROM dialogue_scenarios')
        current_dlg_count = cur.fetchone()[0]
        print(f'   -> Da them: {dlg_inserted} ban ghi, bo qua (trung): {dlg_skipped}')
        print(f'   -> Tong so hien tai: {current_dlg_count} (Ky vong: {prev_dlg_count + dlg_inserted})')
        
        results['dialogues'] = {
            'prev_count': prev_dlg_count,
            'file_count': len(voa_dlgs),
            'inserted': dlg_inserted,
            'skipped': dlg_skipped,
            'total_after': current_dlg_count,
            'match_dod': current_dlg_count == prev_dlg_count + dlg_inserted
        }
        
        # =========================================================================
        # 4. IMPORT STORIES (500 Gutenberg Stories)
        # =========================================================================
        print('\n[4/4] Dang import stories-001-p1..p4.json...')
        t0 = time.time()
        
        cur.execute('SELECT COUNT(*) FROM bilingual_stories')
        prev_story_count = cur.fetchone()[0]
        print(f'   - So luong hien co trong bilingual_stories: {prev_story_count}')
        
        cur.execute('SELECT lower(trim(title)) FROM bilingual_stories')
        existing_story_titles = set(r[0] for r in cur.fetchall())
        
        all_stories = []
        for part in range(1, 5):
            part_path = f'C:\\Mod\\muse-data-exchange\\results\\stories-001-p{part}.json'
            with open(part_path, 'r', encoding='utf-8') as f:
                all_stories.extend(json.load(f))
                
        print(f'   - Doc duoc tong cong tu 4 file: {len(all_stories)} truyen Gutenberg')
        
        story_inserted = 0
        story_skipped = 0
        insert_story_records = []
        
        for i, s in enumerate(all_stories):
            title = s['title'].strip()
            if title.lower() in existing_story_titles:
                story_skipped += 1
                continue
                
            story_id = f'story-gutenberg-{i+1:04d}'
            paragraphs = s.get('paragraphs', [])
            pages_data = [
                {
                    'id': f'pg-{idx+1}',
                    'en': p,
                    'vi': None # Strictly NULL / None as per DoD
                }
                for idx, p in enumerate(paragraphs)
            ]
            pages_json = json.dumps(pages_data, ensure_ascii=False)
            level = s.get('level', 'C1')
            
            insert_story_records.append((
                story_id,
                title,
                None, # titleVi strictly NULL
                level,
                "classic_literature",
                "Văn học cổ điển",
                pages_json,
                "[]", # quizJson
                "Project Gutenberg",
                False
            ))
            existing_story_titles.add(title.lower())
            story_inserted += 1
            
        insert_story_sql = '''
            INSERT INTO bilingual_stories (
                id, title, "titleVi", "cefrLevel",
                topic, "topicVi", "pagesJson", "quizJson",
                source, verified
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        execute_batch(cur, insert_story_sql, insert_story_records, page_size=200)
        
        cur.execute('SELECT COUNT(*) FROM bilingual_stories')
        current_story_count = cur.fetchone()[0]
        print(f'   -> Da them: {story_inserted} ban ghi, bo qua (trung): {story_skipped}')
        print(f'   -> Tong so hien tai: {current_story_count} (Ky vong: {prev_story_count + story_inserted})')
        
        results['stories'] = {
            'prev_count': prev_story_count,
            'file_count': len(all_stories),
            'inserted': story_inserted,
            'skipped': story_skipped,
            'total_after': current_story_count,
            'match_dod': current_story_count == prev_story_count + story_inserted
        }
        
        # Commit all database changes
        conn.commit()
        print(f'\n>>> TOAN BO TRANSACTION DATABASE DA DUOC COMMIT ({time.time() - start_time:.2f}s) <<<')
        
    except Exception as e:
        conn.rollback()
        print(f'\n[FATAL ERROR] Loi khi import, da rollback: {e}')
        raise e
    finally:
        cur.close()
        conn.close()
        
    return results

if __name__ == '__main__':
    res = main()
    print('\nFinal Summary JSON:')
    print(json.dumps(res, indent=2, ensure_ascii=False))
