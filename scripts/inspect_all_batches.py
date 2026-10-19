# -*- coding: utf-8 -*-
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

DATA_DIR = 'data/phase2_all'
files = sorted(os.listdir(DATA_DIR))

print(f"Total files in {DATA_DIR}: {len(files)}\n")

for fname in files:
    if not fname.endswith('.json'): continue
    fpath = os.path.join(DATA_DIR, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            t = type(data).__name__
            l = len(data)
            keys = []
            if isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
                keys = list(data[0].keys())
            elif isinstance(data, dict):
                keys = list(data.keys())[:8]
            print(f"- {fname:<32} | {t:<4} | len={l:<5} | keys: {keys[:6]}")
        except Exception as e:
            print(f"- {fname:<32} | ERROR: {e}")
