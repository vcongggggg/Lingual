import re

file_path = "apps/api/src/data/readingExpandedData.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace "vocabulary" with "vocabulary-context" in type
content = re.sub(r'type:\s*[\'"]vocabulary[\'"]', "type: 'vocabulary-context'", content)
content = re.sub(r'"type":\s*"vocabulary"', '"type": "vocabulary-context"', content)

# Remove order in questions:
# Matches within questions array or lines like:
# "order": 1,
# order: 1,
# inside questions block
# Notice ReadingParagraph also has order! We must ONLY remove order from ReadingQuestion!
# In ReadingParagraph, order is immediately before english or followed by english.
# In ReadingQuestion, order is between id and type:
# id: '...', order: 1, type: ...

# Let's use regex to selectively remove order inside questions:
# pattern: (id: '[^']+-q\d+',\s*)order: \d+,\s*(type:)
content = re.sub(r'(id:\s*[\'"][^\'"]+-q\d+[\'"],\s*)order:\s*\d+,\s*(type:)', r'\1\2', content)
content = re.sub(r'("id":\s*"[^"]+-q\d+",\s*)"order":\s*\d+,\s*("type":)', r'\1\2', content)
# Also handles newlines
content = re.sub(r'(id:\s*[\'"][^\'"]+-q\d+[\'"],\s*\n\s*)order:\s*\d+,\s*\n\s*(type:)', r'\1\2', content)
content = re.sub(r'("id":\s*"[^"]+-q\d+",\s*\n\s*)"order":\s*\d+,\s*\n\s*("type":)', r'\1\2', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated readingExpandedData.ts successfully.")
