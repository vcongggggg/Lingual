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

MALE_NAMES = {"mike", "tom", "david", "john", "peter", "alex", "sam", "mark", "james", "robert", "chris", "paul", "brian", "kevin", "daniel", "jason", "clerk", "waiter", "doctor", "officer", "manager", "man", "caller", "advisor", "agent", "vendor"}
FEMALE_NAMES = {"anna", "lisa", "sarah", "emma", "mary", "jessica", "emily", "laura", "rachel", "amy", "claire", "elena", "chloe", "sophia", "receptionist", "waitress", "nurse", "woman", "customer", "librarian", "cashier", "seller"}

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
    sem = asyncio.Semaphore(25)
    tasks = []

    # 1. Dialogues batch 3 (28 dialogues)
    dlg_path = os.path.join(DATA_DIR, "dialogues-batch3.json")
    with open(dlg_path, "r", encoding="utf-8") as f:
        dlg_data = json.load(f)
    print(f"[*] Processing Dialogues audio for {len(dlg_data)} dialogues...")
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

    # 2. Monologues (10 items)
    mnl_path = os.path.join(DATA_DIR, "listening-monologues.json")
    with open(mnl_path, "r", encoding="utf-8") as f:
        mnl_data = json.load(f)
    print(f"[*] Processing Monologues audio for {len(mnl_data)} items...")
    for m in mnl_data:
        mid = m["id"]
        for idx, line in enumerate(m.get("script", [])):
            lid = line.get("id") or f"l{idx+1}"
            line["id"] = lid
            voice = "en-US-AriaNeural" if idx % 2 == 0 else "en-US-GuyNeural"
            out = os.path.join(AUDIO_BASE, "monologues", mid, f"{lid}.mp3")
            line["audioUrl"] = f"/audio/monologues/{mid}/{lid}.mp3"
            tasks.append(gen_audio(line["textEn"], voice, out, sem))
    with open(mnl_path, "w", encoding="utf-8") as f:
        json.dump(mnl_data, f, ensure_ascii=False, indent=2)

    # 3. Shadowing batch 3 (200 sentences)
    shdw_path = os.path.join(DATA_DIR, "shadowing-sentences-batch3.json")
    with open(shdw_path, "r", encoding="utf-8") as f:
        shdw_data = json.load(f)
    print(f"[*] Processing Shadowing audio for {len(shdw_data)} sentences...")
    for s in shdw_data:
        sid = s["id"]
        out = os.path.join(AUDIO_BASE, "shadowing", f"{sid}.mp3")
        s["audioUrl"] = f"/audio/shadowing/{sid}.mp3"
        tasks.append(gen_audio(s["textEn"], "en-US-AriaNeural", out, sem))
    with open(shdw_path, "w", encoding="utf-8") as f:
        json.dump(shdw_data, f, ensure_ascii=False, indent=2)

    # 4. Dictation (50 sentences)
    dct_path = os.path.join(DATA_DIR, "dictation-sentences.json")
    with open(dct_path, "r", encoding="utf-8") as f:
        dct_data = json.load(f)
    print(f"[*] Processing Dictation audio for {len(dct_data)} sentences...")
    for d in dct_data:
        did = d["id"]
        out = os.path.join(AUDIO_BASE, "listening", "dictation", f"{did}.mp3")
        d["audioUrl"] = f"/audio/listening/dictation/{did}.mp3"
        tasks.append(gen_audio(d["textEn"], "en-US-GuyNeural", out, sem))
    with open(dct_path, "w", encoding="utf-8") as f:
        json.dump(dct_data, f, ensure_ascii=False, indent=2)

    # 5. Situational (200 phrases)
    sit_path = os.path.join(DATA_DIR, "situational-phrases.json")
    with open(sit_path, "r", encoding="utf-8") as f:
        sit_data = json.load(f)
    print(f"[*] Processing Situational audio for {len(sit_data)} phrases...")
    for s in sit_data:
        sid = s["id"]
        out = os.path.join(AUDIO_BASE, "listening", "situational", f"{sid}.mp3")
        s["audioUrl"] = f"/audio/listening/situational/{sid}.mp3"
        tasks.append(gen_audio(s["en"], "en-US-AriaNeural", out, sem))
    with open(sit_path, "w", encoding="utf-8") as f:
        json.dump(sit_data, f, ensure_ascii=False, indent=2)

    # 6. Business (150 phrases)
    biz_path = os.path.join(DATA_DIR, "business-phrases.json")
    with open(biz_path, "r", encoding="utf-8") as f:
        biz_data = json.load(f)
    print(f"[*] Processing Business audio for {len(biz_data)} phrases...")
    for b in biz_data:
        bid = b["id"]
        out = os.path.join(AUDIO_BASE, "listening", "business", f"{bid}.mp3")
        b["audioUrl"] = f"/audio/listening/business/{bid}.mp3"
        tasks.append(gen_audio(b["en"], "en-US-GuyNeural", out, sem))
    with open(biz_path, "w", encoding="utf-8") as f:
        json.dump(biz_data, f, ensure_ascii=False, indent=2)

    # 7. Travel (150 phrases)
    trv_path = os.path.join(DATA_DIR, "travel-phrases.json")
    with open(trv_path, "r", encoding="utf-8") as f:
        trv_data = json.load(f)
    print(f"[*] Processing Travel audio for {len(trv_data)} phrases...")
    for t in trv_data:
        tid = t["id"]
        out = os.path.join(AUDIO_BASE, "listening", "travel", f"{tid}.mp3")
        t["audioUrl"] = f"/audio/listening/travel/{tid}.mp3"
        tasks.append(gen_audio(t["en"], "en-US-AriaNeural", out, sem))
    with open(trv_path, "w", encoding="utf-8") as f:
        json.dump(trv_data, f, ensure_ascii=False, indent=2)

    print(f"[*] Total audio files to generate for Batch 5B: {len(tasks)}")
    results = await asyncio.gather(*tasks)
    success = sum(1 for r in results if r)
    print(f"[*] Generated {success}/{len(tasks)} audio files successfully.")

if __name__ == "__main__":
    asyncio.run(main())
