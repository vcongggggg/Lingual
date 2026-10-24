# -*- coding: utf-8 -*-
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

fnames = [
    'grammar-questions.json',
    'dialogues.json',
    'story-templates.json',
    'content-packages.json',
    'bilingual-articles.json',
    'ielts-reading.json',
    'ielts-listening.json',
    'curriculum-units.json',
    'diary-prompts.json',
    'shadowing-sentences.json'
]

print("=== CATCH-UP BATCH SAMPLE REVIEW ===")
for fname in fnames:
    fpath = os.path.join('data/phase2_all', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n--- {fname} (Total: {len(data)}) ---")
    sample = data[0]
    if 'grammar' in fname:
        print(f"[{sample['id']}] {sample.get('question')} -> {sample.get('correctAnswer')}")
    elif 'dialogues' in fname:
        print(f"[{sample['id']}] {sample.get('title')} ({sample.get('cefrLevel')}) - Lines: {len(sample.get('lines', []))}")
    elif 'story-templates' in fname:
        print(f"[{sample['id']}] {sample.get('title')} ({sample.get('cefrLevel')}) - Paras: {len(sample.get('paragraphs', []))}")
    elif 'content-packages' in fname:
        print(f"[{sample['id']}] Topic: {sample.get('topic')} ({sample.get('cefrLevel')}) - Lines: {len(sample.get('dialogue', {}).get('lines', []))}")
    elif 'bilingual-articles' in fname:
        print(f"[{sample['id']}] {sample.get('title')} ({sample.get('cefrLevel')}) - Paras: {len(sample.get('paragraphs', []))}")
    elif 'ielts-reading' in fname:
        print(f"[{sample['id']}] {sample.get('title')} ({sample.get('cefrLevel')}) - Qs: {len(sample.get('questions', []))}")
    elif 'ielts-listening' in fname:
        print(f"[{sample['id']}] {sample.get('title')} ({sample.get('cefrLevel')}) - Lines: {len(sample.get('script', []))}")
    elif 'curriculum-units' in fname:
        w_count = sum(len(l.get('words', [])) for l in sample.get('lessons', []))
        print(f"[{sample['id']}] {sample.get('title')} ({sample.get('cefrLevel')}) - Words in unit: {w_count}")
    elif 'diary' in fname:
        print(f"[{sample['id']}] {sample.get('prompt')} | Vi: {sample.get('promptVi')}")
    elif 'shadowing' in fname:
        print(f"[{sample['id']}] {sample.get('textEn')} | {sample.get('textVi')}")
