# -*- coding: utf-8 -*-
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

fnames = [
    'grammar-questions-batch3.json',
    'daily-vocab-questions.json',
    'vocab-c1c2.json',
    'idioms.json',
    'phrasal-verbs.json',
    'collocations.json',
    'synonyms-antonyms.json',
    'minimal-pairs.json',
    'tongue-twisters.json',
    'proverbs.json',
    'game-word-pools.json',
    'grammar-explanations.json'
]

print("=== BATCH 5A SAMPLE AUDIT & REVIEW ===")
for fname in fnames:
    fpath = os.path.join('data/phase2_all', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n--- {fname} (Total: {len(data)}) ---")
    limit = 10 if 'grammar-questions' in fname else 3
    for idx, item in enumerate(data[:limit]):
        if 'grammar-questions' in fname:
            print(f"[{item['id']}] {item['question']} -> {item['correctAnswer']} (Topic: {item.get('topic')})")
        elif 'daily-vocab' in fname:
            print(f"[{item['id']}] {item['question']} -> {item['correctAnswer']}")
        elif 'vocab-c1c2' in fname:
            print(f"[{item['id']}] {item['targetText']} ({item['cefrLevel']}): {item['translation']} - Ex: {item.get('exampleSentence')}")
        elif 'idioms' in fname:
            print(f"[{item['id']}] {item['idiom']}: {item['meaningVi']} - Ex: {item.get('exampleEn')}")
        elif 'phrasal-verbs' in fname:
            print(f"[{item['id']}] {item['verb']}: {item['meaningVi']} - Ex: {item.get('exampleEn')}")
        elif 'collocations' in fname:
            print(f"[{item['id']}] {item['collocation']}: {item['meaningVi']}")
        elif 'synonyms-antonyms' in fname:
            print(f"[{item['id']}] {item['word']}: syn={item.get('synonyms')} | ant={item.get('antonyms')}")
        elif 'minimal-pairs' in fname:
            print(f"[{item['id']}] {item['word1']} ({item['phonetic1']}) vs {item['word2']} ({item['phonetic2']}): {item.get('differenceVi')}")
        elif 'tongue-twisters' in fname:
            print(f"[{item['id']}] {item['text']} (Focus: {item.get('focusSounds')})")
        elif 'proverbs' in fname:
            print(f"[{item['id']}] {item['proverb']} = {item.get('vietnameseEquivalent')}")
        elif 'game-word-pools' in fname:
            print(f"[{item['id']}] {item['targetText']}: {item['translation']} ({item.get('topic')})")
        elif 'grammar-explanations' in fname:
            print(f"[{item['id']}] {item['topic']} ({item['cefrLevel']}): {item.get('ruleVi')[:60]}...")
