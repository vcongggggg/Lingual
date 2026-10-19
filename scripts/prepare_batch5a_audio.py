# -*- coding: utf-8 -*-
import os
import sys
import json
import re
import asyncio
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

VOCAB_DIR = os.path.join("apps", "web", "public", "audio", "vocab")
PRON_DIR = os.path.join("apps", "web", "public", "audio", "pronunciation")
os.makedirs(VOCAB_DIR, exist_ok=True)
os.makedirs(PRON_DIR, exist_ok=True)

def slugify(text: str) -> str:
    s = re.sub(r'[^a-zA-Z0-9]+', '-', text).strip('-').lower()
    return s or "item"

async def gen_audio(text: str, voice: str, out_path: str, sem: asyncio.Semaphore):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 100:
        return True
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    async with sem:
        for attempt in range(3):
            try:
                comm = edge_tts.Communicate(text, voice)
                await comm.save(out_path)
                if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
                    return True
            except Exception as e:
                if attempt == 2:
                    print(f"Failed audio for {out_path}: {e}")
                    return False
                await asyncio.sleep(0.3 * (attempt + 1))
    return False

async def main():
    sem = asyncio.Semaphore(20)
    tasks = []

    # 1. Vocab C1/C2 (300 words + examples)
    c1c2_path = os.path.join("data", "phase2_all", "vocab-c1c2.json")
    with open(c1c2_path, "r", encoding="utf-8") as f:
        c1c2_data = json.load(f)

    print(f"[*] Processing C1/C2 audio for {len(c1c2_data)} words...")
    for item in c1c2_data:
        w = item["targetText"]
        slug = slugify(w)
        item["slug"] = slug
        
        # Word audio
        word_out = os.path.join(VOCAB_DIR, f"{slug}.mp3")
        item["audioUrl"] = f"/audio/vocab/{slug}.mp3"
        tasks.append(gen_audio(w, "en-US-AriaNeural", word_out, sem))

        # Example audio
        ex = item.get("exampleSentence")
        if ex:
            ex_out = os.path.join(VOCAB_DIR, f"{slug}-ex.mp3")
            item["exampleAudioUrl"] = f"/audio/vocab/{slug}-ex.mp3"
            tasks.append(gen_audio(ex, "en-US-GuyNeural", ex_out, sem))

    with open(c1c2_path, "w", encoding="utf-8") as f:
        json.dump(c1c2_data, f, ensure_ascii=False, indent=2)

    # 2. Minimal Pairs (100 pairs)
    mp_path = os.path.join("data", "phase2_all", "minimal-pairs.json")
    with open(mp_path, "r", encoding="utf-8") as f:
        mp_data = json.load(f)

    print(f"[*] Processing Minimal Pairs audio for {len(mp_data)} pairs...")
    for item in mp_data:
        mid = item["id"]
        # word1
        out1 = os.path.join(PRON_DIR, f"{mid}-1.mp3")
        item["audioUrl1"] = f"/audio/pronunciation/{mid}-1.mp3"
        tasks.append(gen_audio(item["word1"], "en-US-AriaNeural", out1, sem))

        # word2
        out2 = os.path.join(PRON_DIR, f"{mid}-2.mp3")
        item["audioUrl2"] = f"/audio/pronunciation/{mid}-2.mp3"
        tasks.append(gen_audio(item["word2"], "en-US-GuyNeural", out2, sem))

    with open(mp_path, "w", encoding="utf-8") as f:
        json.dump(mp_data, f, ensure_ascii=False, indent=2)

    # 3. Tongue Twisters (50 items)
    tw_path = os.path.join("data", "phase2_all", "tongue-twisters.json")
    with open(tw_path, "r", encoding="utf-8") as f:
        tw_data = json.load(f)

    print(f"[*] Processing Tongue Twisters audio for {len(tw_data)} items...")
    for item in tw_data:
        tid = item["id"]
        out = os.path.join(PRON_DIR, f"{tid}.mp3")
        item["audioUrl"] = f"/audio/pronunciation/{tid}.mp3"
        tasks.append(gen_audio(item["text"], "en-US-AriaNeural", out, sem))

    with open(tw_path, "w", encoding="utf-8") as f:
        json.dump(tw_data, f, ensure_ascii=False, indent=2)

    print(f"[*] Total audio tasks to generate: {len(tasks)}")
    results = await asyncio.gather(*tasks)
    success = sum(1 for r in results if r)
    print(f"[*] Generated {success}/{len(tasks)} audio files successfully.")

if __name__ == "__main__":
    asyncio.run(main())
