import glob
import re

files = glob.glob('scripts/cambridge0[67]_data_t*.py')
print(f"Auditing {len(files)} files: {sorted(files)}")

patterns = [
    r'"question":',
    r'"stem":',
    r'"correctAnswer":',
    r'"passageJson":',
    r'"scriptJson":',
    r'WOMAN:',
    r'MAN:',
    r'pagodas',
    r'Sporting Success',
    r'Delivering the Goods',
    r'1:\s*"[^"]+"',
    r'2:\s*"[^"]+"'
]

matches_found = 0
for f in files:
    content = open(f, 'r', encoding='utf-8').read()
    for pat in patterns:
        hits = re.findall(pat, content, flags=re.IGNORECASE)
        if hits:
            print(f"[FAIL] Match {pat} in {f}: {len(hits)} hits")
            matches_found += len(hits)

if matches_found == 0:
    print("SUCCESS: 0 matches of passage text, question stems, or answer key dicts in all 8 loader files!")
else:
    print(f"FAIL: Found {matches_found} matches!")
