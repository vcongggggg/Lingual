# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

r_data = json.load(open('data/phase2_all/ielts-reading-batch2.json', encoding='utf-8'))
l_data = json.load(open('data/phase2_all/ielts-listening-batch2.json', encoding='utf-8'))
u_data = json.load(open('data/phase2_all/curriculum-units-batch2.json', encoding='utf-8'))
d_data = json.load(open('data/phase2_all/diary-prompts-batch2.json', encoding='utf-8'))

print('=== 1. SAMPLE READING PASSAGE ===')
r0 = r_data[0]
print(f"ID: {r0['id']}, Title: {r0['title']}, Level: {r0['cefrLevel']}")
print("Passage paragraphs:", len(r0['passage']))
print("Questions count:", len(r0['questions']))
print("Q1:", r0['questions'][0]['question'])
print("Q1 options:", r0['questions'][0]['options'])
print("Q1 answer:", r0['questions'][0]['correctAnswer'])

print('\n=== 2. SAMPLE LISTENING SECTION ===')
l0 = l_data[0]
print(f"ID: {l0['id']}, Title: {l0['title']}, TitleVi: {l0.get('titleVi')}")
print("Script lines:", len(l0['script']))
print("Line 0:", l0['script'][0])
print("Questions count:", len(l0['questions']))
print("Q1:", l0['questions'][0]['question'])
print("Q1 answer:", l0['questions'][0]['correctAnswer'])

print('\n=== 3. SAMPLE CURRICULUM UNIT ===')
u0 = u_data[0]
print(f"ID: {u0['id']}, Order: {u0['order']}, Title: {u0['title']}, TitleVi: {u0.get('titleVi')}")
print("Lessons count:", len(u0['lessons']))
total_words = sum(len(l.get('words', [])) for l in u0['lessons'])
print(f"Sample lesson 0 words: {len(u0['lessons'][0].get('words', []))}, Total unit words: {total_words}")
if u0['lessons'][0].get('words'):
    print("Sample word 0:", u0['lessons'][0]['words'][0])

print('\n=== 4. SAMPLE 5 DIARY PROMPTS ===')
for p in d_data[:5]:
    print(f"[{p['id']}] ({p['cefrLevel']}) {p['prompt']} | Vi: {p.get('promptVi')} | Keywords: {p.get('keywords')} | Min: {p.get('minSentences')}")

print('\n=== VALIDATION SUMMARY ===')
print(f"Total Reading Passages: {len(r_data)}")
print(f"Total Listening Sections: {len(l_data)}")
print(f"Total Curriculum Units: {len(u_data)}")
print(f"Total Diary Prompts: {len(d_data)}")

# Count words in units
all_unit_words = []
for u in u_data:
    for l in u.get('lessons', []):
        for w in l.get('words', []):
            all_unit_words.append(w.get('word') or w.get('targetText'))
print(f"Total vocabulary words across 10 units: {len(all_unit_words)}")
