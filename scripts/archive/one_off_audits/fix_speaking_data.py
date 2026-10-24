import re

with open("apps/api/src/data/speakingExpandedData.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Remove "instruction": "...",\n
c = re.sub(r'^\s*"instruction":\s*".*?",?\n', '', c, flags=re.MULTILINE)

with open("apps/api/src/data/speakingExpandedData.ts", "w", encoding="utf-8") as f:
    f.write(c)

print("Fixed speakingExpandedData.ts")
