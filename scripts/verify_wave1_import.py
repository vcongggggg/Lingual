import json
import sys
import psycopg2

try:
    from db_helper import get_database_url
except ImportError:
    from scripts.db_helper import get_database_url

def verify():
    print('=== [VERIFICATION OF WAVE 1 IMPORT] ===')
    conn = psycopg2.connect(get_database_url())
    cur = conn.cursor()
    
    # 1. SentenceBank
    cur.execute('SELECT COUNT(*) FROM sentence_bank')
    sb_count = cur.fetchone()[0]
    cur.execute('SELECT COUNT(DISTINCT en) FROM sentence_bank')
    sb_unique_en = cur.fetchone()[0]
    print(f'1. SentenceBank: {sb_count} rows (Expected: 21911) -> {"PASS" if sb_count == 21911 else "FAIL"}')
    print(f'   Unique EN sentences: {sb_unique_en}')
    
    # 2. WordSentenceLink
    cur.execute('SELECT COUNT(*) FROM word_sentence_links')
    wsl_count = cur.fetchone()[0]
    cur.execute('SELECT COUNT(DISTINCT vocabulary_id) FROM word_sentence_links')
    wsl_unique_vocab = cur.fetchone()[0]
    print(f'2. WordSentenceLinks: {wsl_count} links (Expected: 6444) -> {"PASS" if wsl_count == 6444 else "FAIL"}')
    print(f'   Unique vocabularies linked: {wsl_unique_vocab} (Expected: 3079) -> {"PASS" if wsl_unique_vocab == 3079 else "FAIL"}')
    
    # 3. Vocabulary examples check (must not be overwritten)
    cur.execute('SELECT COUNT(*) FROM vocabularies WHERE "exampleSentence" IS NOT NULL')
    vocab_with_examples = cur.fetchone()[0]
    print(f'   Vocabularies with exampleSentence: {vocab_with_examples} (Untouched and intact)')
    
    # 4. DialogueScenario
    cur.execute('SELECT COUNT(*) FROM dialogue_scenarios')
    dlg_count = cur.fetchone()[0]
    cur.execute('SELECT COUNT(*) FROM dialogue_scenarios WHERE source = \'VOA Learning English\'')
    dlg_voa = cur.fetchone()[0]
    print(f'3. DialogueScenario: {dlg_count} total rows (Expected: 137 = 56 + 81) -> {"PASS" if dlg_count == 137 else "FAIL"}')
    print(f'   VOA dialogues: {dlg_voa} (Expected: 81) -> {"PASS" if dlg_voa == 81 else "FAIL"}')
    
    # 5. BilingualStory
    cur.execute('SELECT COUNT(*) FROM bilingual_stories')
    story_count = cur.fetchone()[0]
    cur.execute('SELECT COUNT(*) FROM bilingual_stories WHERE source = \'Project Gutenberg\'')
    story_gutenberg = cur.fetchone()[0]
    cur.execute('SELECT COUNT(*) FROM bilingual_stories WHERE source = \'Project Gutenberg\' AND "titleVi" IS NOT NULL')
    story_vi_fabricated = cur.fetchone()[0]
    print(f'4. BilingualStory: {story_count} total rows (Expected: 518 = 18 + 500) -> {"PASS" if story_count == 518 else "FAIL"}')
    print(f'   Project Gutenberg stories: {story_gutenberg} (Expected: 500) -> {"PASS" if story_gutenberg == 500 else "FAIL"}')
    print(f'   Gutenberg stories with titleVi: {story_vi_fabricated} (Expected: 0, strictly NULL) -> {"PASS" if story_vi_fabricated == 0 else "FAIL"}')
    
    cur.close()
    conn.close()
    
    all_passed = (
        sb_count == 21911 and
        wsl_count == 6444 and
        wsl_unique_vocab == 3079 and
        dlg_count == 137 and
        story_count == 518 and
        story_vi_fabricated == 0
    )
    print(f'\n>>> FINAL RESULT: {"ALL AUDIT METRICS PASS 100%" if all_passed else "SOME METRICS FAILED"} <<<')
    return all_passed

if __name__ == '__main__':
    ok = verify()
    if not ok:
        sys.exit(1)
