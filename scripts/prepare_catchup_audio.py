# -*- coding: utf-8 -*-
import os
import sys
import json
import re
import asyncio
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

AUDIO_BASE = os.path.join("apps", "web", "public", "audio")
DATA_DIR = os.path.join("data", "phase2_all")

MALE_NAMES = {"mike", "tom", "david", "john", "peter", "alex", "sam", "mark", "james", "robert", "chris", "paul", "brian", "kevin", "daniel", "jason", "clerk", "waiter", "doctor", "officer", "manager", "man", "caller", "advisor", "agent", "vendor", "receptionist"}
FEMALE_NAMES = {"anna", "lisa", "sarah", "emma", "mary", "jessica", "emily", "laura", "rachel", "amy", "claire", "elena", "chloe", "sophia", "waitress", "nurse", "woman", "customer", "librarian", "cashier", "seller"}

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
    sem = asyncio.Semaphore(20)
    tasks = []

    # 1. Dialogues (10)
    dlg_path = os.path.join(DATA_DIR, "dialogues.json")
    with open(dlg_path, "r", encoding="utf-8") as f:
        dlg_data = json.load(f)
    print(f"[*] Processing catchup audio for {len(dlg_data)} dialogues...")
    for d in dlg_data:
        did = d["id"]
        for idx, line in enumerate(d.get("lines", [])):
            lid = line.get("id") or f"l{idx+1}"
            line["id"] = lid
            voice = get_voice(line.get("speaker", ""), idx)
            out = os.path.join(AUDIO_BASE, "dialogues", did, f"{lid}.mp3")
            line["audioUrl"] = f"/audio/dialogues/{did}/{lid}.mp3"
            tasks.append(gen_audio(line["textEn"], voice, out, sem))
    with open(dlg_path, "w", encoding="utf-8") as f:
        json.dump(dlg_data, f, ensure_ascii=False, indent=2)

    # 2. IELTS Listening (5)
    l_path = os.path.join(DATA_DIR, "ielts-listening.json")
    with open(l_path, "r", encoding="utf-8") as f:
        l_data = json.load(f)
    print(f"[*] Processing catchup audio for {len(l_data)} IELTS Listening sections...")
    for sec in l_data:
        sid = sec["id"]
        for idx, line in enumerate(sec.get("script", [])):
            lid = line.get("id") or f"l{idx+1}"
            line["id"] = lid
            voice = get_voice(line.get("speaker", ""), idx)
            out = os.path.join(AUDIO_BASE, "ielts-listening", sid, f"{lid}.mp3")
            line["audioUrl"] = f"/audio/ielts-listening/{sid}/{lid}.mp3"
            tasks.append(gen_audio(line["textEn"], voice, out, sem))
    with open(l_path, "w", encoding="utf-8") as f:
        json.dump(l_data, f, ensure_ascii=False, indent=2)

    # 3. Shadowing (50)
    shdw_path = os.path.join(DATA_DIR, "shadowing-sentences.json")
    with open(shdw_path, "r", encoding="utf-8") as f:
        shdw_data = json.load(f)
    print(f"[*] Processing catchup audio for {len(shdw_data)} shadowing sentences...")
    for s in shdw_data:
        sid = s["id"]
        out = os.path.join(AUDIO_BASE, "shadowing", f"{sid}.mp3")
        s["audioUrl"] = f"/audio/shadowing/{sid}.mp3"
        tasks.append(gen_audio(s["textEn"], "en-US-AriaNeural", out, sem))
    with open(shdw_path, "w", encoding="utf-8") as f:
        json.dump(shdw_data, f, ensure_ascii=False, indent=2)

    print(f"[*] Total catchup audio tasks: {len(tasks)}")
    results = await asyncio.gather(*tasks)
    success = sum(1 for r in results if r)
    print(f"[*] Generated {success}/{len(tasks)} audio files successfully.")

if __name__ == "__main__":
    asyncio.run(main())
