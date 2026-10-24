# -*- coding: utf-8 -*-
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

files = [
    'content-packages-batch2.json',
    'content-packages-batch3.json',
    'bilingual-articles-batch2.json',
    'bilingual-articles-batch3.json',
    'bilingual-stories.json'
]

for fname in files:
    fpath = os.path.join('data/phase2_all', fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print('='*50)
    print(f"File: {fname} (type: {type(data).__name__}, len: {len(data)})")
    if isinstance(data, list) and len(data) > 0:
        sample = data[0]
        if isinstance(sample, dict):
            print("Keys:", list(sample.keys()))
            for k in list(sample.keys())[:6]:
                val_str = str(sample[k])
                if len(val_str) > 80: val_str = val_str[:80] + '...'
                print(f"  {k}: {val_str}")
    elif isinstance(data, dict):
        print("Dict keys:", list(data.keys())[:10])
