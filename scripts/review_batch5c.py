# -*- coding: utf-8 -*-
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

fnames = [
    'ielts-reading-batch3.json',
    'ielts-listening-batch3.json',
    'ielts-speaking.json',
    'ielts-writing.json',
    'bilingual-articles-batch4.json',
    'bilingual-articles-batch5.json',
    'bilingual-stories-batch2.json',
    'story-templates-batch3.json',
    'curriculum-units-batch3.json',
    'diary-prompts-batch3.json'
]

print("=== BATCH 5C SAMPLE REVIEW ===")
for fname in fnames:
    fpath = os.path.join('data/phase2_all', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n--- {fname} (Total: {len(data)}) ---")
    sample = data[0]
    if 'reading' in fname:
        print(f"[{sample['id']}] {sample.get('title')} ({sample.get('cefrLevel')}) - Passages: {len(sample.get('passage', []))}, Qs: {len(sample.get('questions', []))}")
    elif 'listening' in fname:
        print(f"[{sample['id']}] {sample.get('title')} ({sample.get('cefrLevel')}) - Script lines: {len(sample.get('script', []))}, Qs: {len(sample.get('questions', []))}")
    elif 'speaking' in fname:
        print(f"[{sample['id']}] Part {sample.get('part')}: {sample.get('question')} (Ideas: {len(sample.get('ideasVi', []))})")
    elif 'writing' in fname:
        print(f"[{sample['id']}] Type {sample.get('type')}: {sample.get('prompt')[:60]}...")
    elif 'articles' in fname:
        print(f"[{sample['id']}] {sample.get('title')} ({sample.get('cefrLevel')}) - Paras: {len(sample.get('paragraphs', []))}")
    elif 'stories' in fname:
        print(f"[{sample['id']}] {sample.get('title')} ({sample.get('cefrLevel')}) - Pages: {len(sample.get('pages', []))}")
    elif 'templates' in fname:
        print(f"[{sample['id']}] {sample.get('title')} ({sample.get('cefrLevel')}) - Paras: {len(sample.get('paragraphs', []))}")
    elif 'units' in fname:
        words_count = sum(len(l.get('words', [])) for l in sample.get('lessons', []))
        print(f"[{sample['id']}] {sample.get('title')} - Lessons: {len(sample.get('lessons', []))}, Words in unit: {words_count}")
    elif 'diary' in fname:
        print(f"[{sample['id']}] {sample.get('prompt')} | Vi: {sample.get('promptVi')}")
