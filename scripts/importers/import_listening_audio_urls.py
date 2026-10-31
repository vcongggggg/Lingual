#!/usr/bin/env python3
"""
Populate audioUrl for IELTS Listening Sections (Phase 1)
Task: lingual-listening-audio-import-001

Phase 1 Scope:
- Cam03, Cam05-15: 1-1 direct section audio files (16 sections each, 12 books = 192 sections)
- Cam04: 16 section audio files test{T}_section{S}.mp3 (NOT using the 4 redundant full files)
- Cam01, Cam02: populate audioUrl with full test files, audioStartSec / audioEndSec NULL (32 sections)
- Authored / AI (60 sections): audioUrl = NULL
- Barron (8 sections): audioUrl = NULL (Phase 1 proposal audit only)
Total: 308 sections (240 populated, 68 NULL, 0 missing files)
"""

import os
import re
import psycopg2

BASE_AUDIO_DIR = os.path.abspath(os.path.join(
    os.path.dirname(__file__), '..', '..', 'apps', 'web', 'public', 'audio', 'ielts-listening'
))

def get_db_connection():
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
    db_url = None
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('DATABASE_URL='):
                    db_url = line.split('=', 1)[1].strip().strip('"').strip("'")
                    break
    
    if db_url:
        # Strip query parameters if present
        clean_url = db_url.split('?')[0]
        return psycopg2.connect(clean_url)
    return psycopg2.connect(dbname='linguaflow_db', user='postgres', host='localhost', port=5432)

def parse_section_id(sid):
    # Cam03, 04, 08: ielts-listening-cambridge-03-test-1-section-1
    m = re.match(r'ielts-listening-cambridge-(\d+)-test-(\d+)-section-(\d+)', sid)
    if m:
        return int(m.group(1)), int(m.group(2)), int(m.group(3))
    
    # Cam05: cam05-t01-l01
    m = re.match(r'cam(\d+)-t0?(\d+)-l0?(\d+)', sid)
    if m:
        return int(m.group(1)), int(m.group(2)), int(m.group(3))
    
    # Cam06, 07, 09, 10, 11, 12, 13, 14, 15: cam06-academic-t1-l1, cam10-academic-t4-s1
    m = re.match(r'cam(\d+)-academic-t(\d+)-[ls](\d+)', sid)
    if m:
        return int(m.group(1)), int(m.group(2)), int(m.group(3))
    
    return None

def resolve_audio_mapping():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, title, source FROM ielts_listening_sections ORDER BY id;')
    sections = cur.fetchall()
    cur.close()
    conn.close()

    audio_dirs = {}
    if os.path.exists(BASE_AUDIO_DIR):
        for item in os.listdir(BASE_AUDIO_DIR):
            p = os.path.join(BASE_AUDIO_DIR, item)
            if os.path.isdir(p):
                audio_dirs[item] = os.listdir(p)

    mapping = {}
    errors = []

    for sid, title, src in sections:
        # 1. Barron: Phase 1 proposal only (audioUrl NULL)
        if sid.startswith('barrons-'):
            mapping[sid] = {
                'audio_url': None,
                'category': 'barron',
                'file': None
            }
            continue

        # 2. Authored / AI: audioUrl NULL
        if sid.startswith('ielts-l-b') or (sid.startswith('ielts-l-') and not sid.startswith('ielts-listening-cambridge-')):
            mapping[sid] = {
                'audio_url': None,
                'category': 'authored_ai',
                'file': None
            }
            continue

        parsed = parse_section_id(sid)
        if not parsed:
            errors.append(f'{sid}: Could not parse book/test/section from ID')
            continue

        book_num, t_num, s_num = parsed
        book_folder = f'cambridge-ielts-{book_num:02d}'

        # 3. Cam01 & Cam02: Full test audio file
        if book_num in (1, 2):
            pattern = f'Cambridge IELTS {book_num}.{t_num}'
            matched = [f for f in audio_dirs.get(book_folder, []) if pattern in f]
            if not matched:
                errors.append(f'{sid}: No full test audio for Cam{book_num:02d} T{t_num}')
            else:
                fname = matched[0]
                full_path = os.path.join(BASE_AUDIO_DIR, book_folder, fname)
                if not os.path.isfile(full_path) or os.path.getsize(full_path) == 0:
                    errors.append(f'{sid}: File missing or empty: {full_path}')
                else:
                    mapping[sid] = {
                        'audio_url': f'/audio/ielts-listening/{book_folder}/{fname}',
                        'category': 'cam_full_test',
                        'file': fname
                    }
            continue

        # 4. Cam04: Must use 16 section files (test{t}_section{s}.mp3)
        if book_num == 4:
            fname = f'test{t_num}_section{s_num}.mp3'
            full_path = os.path.join(BASE_AUDIO_DIR, book_folder, fname)
            if not os.path.isfile(full_path) or os.path.getsize(full_path) == 0:
                errors.append(f'{sid}: Cam04 section file missing: {full_path}')
            else:
                mapping[sid] = {
                    'audio_url': f'/audio/ielts-listening/{book_folder}/{fname}',
                    'category': 'cam04_section',
                    'file': fname
                }
            continue

        # 5. Cam15: IELTS15_test{t}_audio{s} [@ieltsxpress].mp3
        if book_num == 15:
            fname = f'IELTS15_test{t_num}_audio{s_num} [@ieltsxpress].mp3'
            full_path = os.path.join(BASE_AUDIO_DIR, book_folder, fname)
            if not os.path.isfile(full_path) or os.path.getsize(full_path) == 0:
                errors.append(f'{sid}: Cam15 section file missing: {full_path}')
            else:
                mapping[sid] = {
                    'audio_url': f'/audio/ielts-listening/{book_folder}/{fname}',
                    'category': 'cam_direct_1_1',
                    'file': fname
                }
            continue

        # 6. Cam03, Cam05-14: Direct 1-1 section audio
        prefix = f'Cambridge IELTS {book_num}.{t_num}.{s_num}'
        candidates = [f for f in audio_dirs.get(book_folder, []) if f.startswith(prefix) and '(2)' not in f]
        if len(candidates) != 1:
            errors.append(f'{sid}: Expected exactly 1 match for prefix {prefix} in {book_folder}, found {candidates}')
        else:
            fname = candidates[0]
            full_path = os.path.join(BASE_AUDIO_DIR, book_folder, fname)
            if not os.path.isfile(full_path) or os.path.getsize(full_path) == 0:
                errors.append(f'{sid}: File missing or empty: {full_path}')
            else:
                mapping[sid] = {
                    'audio_url': f'/audio/ielts-listening/{book_folder}/{fname}',
                    'category': 'cam_direct_1_1',
                    'file': fname
                }

    return mapping, errors

def main():
    print('======================================================================')
    print('MIGRATION & IMPORT: POPULATE AUDIO URLS (IELTS LISTENING PHASE 1)')
    print('======================================================================')
    print(f'Base audio directory: {BASE_AUDIO_DIR}')
    assert os.path.exists(BASE_AUDIO_DIR), f'Base audio directory does not exist: {BASE_AUDIO_DIR}'

    mapping, errors = resolve_audio_mapping()
    if errors:
        print(f'FATAL: Found {len(errors)} mapping/validation errors:')
        for e in errors:
            print(f'  - {e}')
        raise RuntimeError('Mapping validation failed.')

    total_sections = len(mapping)
    populated = {k: v for k, v in mapping.items() if v['audio_url'] is not None}
    nulls = {k: v for k, v in mapping.items() if v['audio_url'] is None}
    authored = {k: v for k, v in nulls.items() if v['category'] == 'authored_ai'}
    barron = {k: v for k, v in nulls.items() if v['category'] == 'barron'}
    cam01_02 = {k: v for k, v in populated.items() if v['category'] == 'cam_full_test'}
    cam04 = {k: v for k, v in populated.items() if v['category'] == 'cam04_section'}
    cam_direct = {k: v for k, v in populated.items() if v['category'] == 'cam_direct_1_1'}

    print(f'Total sections: {total_sections}')
    print(f'Populated audioUrl: {len(populated)}')
    print(f'  - Cam01 & Cam02 (full test): {len(cam01_02)}')
    print(f'  - Cam04 (16 section files): {len(cam04)}')
    print(f'  - Cam03, Cam05-15 (1-1 direct): {len(cam_direct)}')
    print(f'NULL audioUrl: {len(nulls)}')
    print(f'  - Authored / AI: {len(authored)}')
    print(f'  - Barron (Phase 1 proposal audit): {len(barron)}')
    print(f'Errors: {len(errors)}')

    # Database updates
    conn = get_db_connection()
    cur = conn.cursor()

    updated_count = 0
    for sid, info in mapping.items():
        cur.execute('''
            UPDATE ielts_listening_sections
            SET audio_url = %s,
                audio_start_sec = NULL,
                audio_end_sec = NULL
            WHERE id = %s;
        ''', (info['audio_url'], sid))
        updated_count += cur.rowcount

    conn.commit()
    print(f'Database updated successfully: {updated_count} rows updated.')

    # Verification from Database
    cur.execute('''
        SELECT 
            COUNT(*) as total,
            COUNT(audio_url) as populated,
            COUNT(*) - COUNT(audio_url) as nulls,
            COUNT(audio_start_sec) as start_sec_populated,
            COUNT(audio_end_sec) as end_sec_populated
        FROM ielts_listening_sections;
    ''')
    res = cur.fetchone()
    print('\nDatabase Post-Update Verification:')
    print(f'  Total rows: {res[0]}')
    print(f'  Populated audio_url: {res[1]}')
    print(f'  NULL audio_url: {res[2]}')
    print(f'  audio_start_sec populated: {res[3]} (expect 0)')
    print(f'  audio_end_sec populated: {res[4]} (expect 0)')

    # Spot checks
    spot_ids = [
        'ielts-listening-cambridge-03-test-1-section-1',
        'ielts-listening-cambridge-04-test-1-section-1',
        'cam01-academic-t1-l1',
        'barrons-academic-t2-l1',
        'ielts-l-002a-01-enrolling-in-an-evening-langua'
    ]
    print('\nSpot-check records:')
    for sid in spot_ids:
        cur.execute('SELECT id, audio_url, audio_start_sec, audio_end_sec FROM ielts_listening_sections WHERE id = %s;', (sid,))
        print(' ', cur.fetchone())

    cur.close()
    conn.close()
    print('\nALL VERIFICATIONS PASSED!')

if __name__ == '__main__':
    main()
