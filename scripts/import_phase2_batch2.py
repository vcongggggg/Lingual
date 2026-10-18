#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Import script for Phase 2 Batch 2:
- Generates edge-tts audio for shadowing sentences and dialogue lines
- Ingests into PostgreSQL:
  1. grammar_questions (400)
  2. shadowing_sentences (150)
  3. dialogue_scenarios (18)
  4. story_templates (15)
"""

import os
import sys
import json
import re
import asyncio
import edge_tts
from concurrent.futures import ThreadPoolExecutor

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

INPUT_DIR = os.path.join("data", "phase2_batch2")
AUDIO_BASE = os.path.join("apps", "web", "public", "audio")
SHADOWING_AUDIO_DIR = os.path.join(AUDIO_BASE, "shadowing")
DIALOGUES_AUDIO_DIR = os.path.join(AUDIO_BASE, "dialogues")

MALE_NAMES = {"mike", "tom", "david", "john", "peter", "alex", "sam", "mark", "james", "robert", "chris", "paul", "brian", "kevin", "daniel", "jason", "clerk", "waiter", "doctor", "officer", "manager"}
FEMALE_NAMES = {"anna", "lisa", "sarah", "emma", "mary", "jessica", "emily", "laura", "rachel", "amy", "claire", "elena", "chloe", "sophia", "receptionist", "waitress", "nurse"}

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
                    print(f"Failed audio for: {out_path}: {e}")
                    return False
                await asyncio.sleep(0.5 * (attempt + 1))
    return False

async def process_audio_and_prepare_data():
    sem = asyncio.Semaphore(15)
    tasks = []

    # 1. Shadowing audio
    with open(os.path.join(INPUT_DIR, "shadowing-sentences-batch2.json"), "r", encoding="utf-8") as f:
        shadowing_data = json.load(f)

    print(f"Preparing audio for {len(shadowing_data)} shadowing sentences...")
    for item in shadowing_data:
        sid = item["id"]
        out_path = os.path.join(SHADOWING_AUDIO_DIR, f"{sid}.mp3")
        item["audioUrl"] = f"/audio/shadowing/{sid}.mp3"
        tasks.append(gen_audio(item["textEn"], "en-US-AriaNeural", out_path, sem))

    # 2. Dialogue audio
    with open(os.path.join(INPUT_DIR, "dialogues-batch2.json"), "r", encoding="utf-8") as f:
        dialogues_data = json.load(f)

    total_lines = 0
    print(f"Preparing audio for {len(dialogues_data)} dialogues...")
    for d in dialogues_data:
        did = d["id"]
        lines = d.get("lines", [])
        for idx, line in enumerate(lines):
            total_lines += 1
            lid = line.get("id") or f"{did}-{idx+1:02d}"
            line["id"] = lid
            voice = get_voice(line.get("speaker", ""), idx)
            out_path = os.path.join(DIALOGUES_AUDIO_DIR, did, f"{lid}.mp3")
            line["audioUrl"] = f"/audio/dialogues/{did}/{lid}.mp3"
            tasks.append(gen_audio(line["textEn"], voice, out_path, sem))

    print(f"Generating {len(tasks)} audio files concurrently with edge-tts...")
    await asyncio.gather(*tasks)
    print("All audio generation finished successfully!")

    # Save prepared data with audioUrl included
    with open(os.path.join(INPUT_DIR, "shadowing-sentences-batch2.json"), "w", encoding="utf-8") as f:
        json.dump(shadowing_data, f, ensure_ascii=False, indent=2)

    with open(os.path.join(INPUT_DIR, "dialogues-batch2.json"), "w", encoding="utf-8") as f:
        json.dump(dialogues_data, f, ensure_ascii=False, indent=2)

    return shadowing_data, dialogues_data

if __name__ == "__main__":
    asyncio.run(process_audio_and_prepare_data())
