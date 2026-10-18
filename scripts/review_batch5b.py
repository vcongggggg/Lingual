# -*- coding: utf-8 -*-
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

fnames = [
    'dialogues-batch3.json',
    'content-packages-batch4.json',
    'content-packages-batch5.json',
    'listening-monologues.json',
    'shadowing-sentences-batch3.json',
    'dictation-sentences.json',
    'situational-phrases.json',
    'business-phrases.json',
    'travel-phrases.json'
]

print("=== BATCH 5B SAMPLE REVIEW ===")
for fname in fnames:
    fpath = os.path.join('data/phase2_all', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n--- {fname} (Total: {len(data)}) ---")
    sample = data[0]
    if 'dialogues' in fname:
        print(f"[{sample['id']}] {sample['title']} ({sample['cefrLevel']}) - Lines: {len(sample.get('lines', []))}")
    elif 'content-packages' in fname:
        print(f"[{sample['id']}] Topic: {sample.get('topic')} ({sample['cefrLevel']}) - Dialogue lines: {len(sample.get('dialogue', {}).get('lines', []))}")
    elif 'monologues' in fname:
        print(f"[{sample['id']}] {sample['title']} ({sample['cefrLevel']}) - Script lines: {len(sample.get('script', []))}")
    elif 'shadowing' in fname:
        print(f"[{sample['id']}] {sample['textEn']} | {sample['textVi']}")
    elif 'dictation' in fname:
        print(f"[{sample['id']}] {sample['textEn']} | Tricky words: {len(sample.get('trickyWords', []))}")
    elif 'situational' in fname:
        print(f"[{sample['id']}] ({sample.get('situation')}) {sample['en']} = {sample['vi']}")
    elif 'business' in fname:
        print(f"[{sample['id']}] ({sample.get('category')}) {sample['en']} = {sample['vi']}")
    elif 'travel' in fname:
        print(f"[{sample['id']}] ({sample.get('category')}) {sample['en']} = {sample['vi']}")
