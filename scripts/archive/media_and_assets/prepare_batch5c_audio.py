# -*- coding: utf-8 -*-
import os
import sys
import json
import re
import asyncio
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

AUDIO_BASE = os.path.join("apps", "web", "public", "audio", "ielts-listening")
DATA_PATH = os.path.join("data", "phase2_all", "ielts-listening-batch3.json")

MALE_NAMES = {"mike", "tom", "david", "john", "peter", "alex", "sam", "mark", "james", "robert", "chris", "paul", "brian", "kevin", "daniel", "jason", "clerk", "waiter", "doctor", "officer", "manager", "man", "caller", "advisor", "agent", "landlord"}
FEMALE_NAMES = {"anna", "lisa", "sarah", "emma", "mary", "jessica", "emily", "laura", "rachel", "amy", "claire", "elena", "chloe", "sophia", "receptionist", "waitress", "nurse", "woman", "customer", "librarian", "landlady"}

def get_voice(speaker_name: str, index: int) -> str:
    name_clean = re.sub(r"[^a-z]", "", (speaker_name or "").lower())
    if name_clean in MALE_NAMES:
        return "en-US-GuyNeural"
    if name_clean in FEMALE_NAMES:
        return "en-US-AriaNeural"
    return "en-US-GuyNeural" if index % 2 == 1 else "en-US-AriaNeural"

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
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        listening_data = json.load(f)

    sem = asyncio.Semaphore(20)
    tasks = []
    total_lines = 0

    print(f"[*] Processing IELTS Listening Batch 3 audio for {len(listening_data)} sections...")

    for section in listening_data:
        sec_id = section["id"]
        for idx, line in enumerate(section.get("script", [])):
            total_lines += 1
            line_id = line.get("id") or f"l{idx+1}"
            line["id"] = line_id
            voice = get_voice(line.get("speaker", ""), idx)
            out_path = os.path.join(AUDIO_BASE, sec_id, f"{line_id}.mp3")
            line["audioUrl"] = f"/audio/ielts-listening/{sec_id}/{line_id}.mp3"
            tasks.append(gen_audio(line["textEn"], voice, out_path, sem))

    print(f"[*] Total script lines to generate: {total_lines}")
    results = await asyncio.gather(*tasks)
    success = sum(1 for r in results if r)
    print(f"[*] Generated {success}/{total_lines} audio files successfully.")

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(listening_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    asyncio.run(main())
