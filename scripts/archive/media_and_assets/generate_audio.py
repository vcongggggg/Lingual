#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate real MP3 audio for each word in vocab-bulk.json using edge-tts.
Saves to apps/web/public/audio/vocab/<slug>.mp3
"""

import os
import sys
import json
import asyncio
import time
import edge_tts

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

INPUT_JSON = os.path.join("data", "standardized", "vocab-bulk.json")
AUDIO_DIR = os.path.join("apps", "web", "public", "audio", "vocab")
VOICE = "en-US-AriaNeural"
CONCURRENCY = 15

async def generate_single_audio(word: str, slug: str, sem: asyncio.Semaphore, failed_words: list):
    out_file = os.path.join(AUDIO_DIR, f"{slug}.mp3")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 100:
        return True

    # Retries
    for attempt in range(3):
        try:
            async with sem:
                communicate = edge_tts.Communicate(word, VOICE)
                await communicate.save(out_file)
            if os.path.exists(out_file) and os.path.getsize(out_file) > 0:
                return True
        except Exception as e:
            if attempt == 2:
                failed_words.append((word, str(e)))
                return False
            await asyncio.sleep(0.5 * (attempt + 1))
    return False

async def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    if not os.path.exists(INPUT_JSON):
        print(f"Error: {INPUT_JSON} not found!")
        return

    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        records = json.load(f)

    # Unique slug mapping
    items_to_generate = []
    seen_slugs = set()
    for r in records:
        w = r["targetText"]
        audio_url = r["audioUrl"]
        slug = os.path.splitext(os.path.basename(audio_url))[0]
        if slug not in seen_slugs:
            seen_slugs.add(slug)
            items_to_generate.append((w, slug))

    total = len(items_to_generate)
    print(f"Total unique audio files to verify/generate: {total}")

    sem = asyncio.Semaphore(CONCURRENCY)
    failed_words = []

    # Batch in chunks of 300 for clean progress updates
    chunk_size = 300
    completed = 0
    start_time = time.time()

    for i in range(0, total, chunk_size):
        chunk = items_to_generate[i:i + chunk_size]
        tasks = [generate_single_audio(w, slug, sem, failed_words) for w, slug in chunk]
        results = await asyncio.gather(*tasks)
        completed += len(chunk)
        elapsed = time.time() - start_time
        rate = completed / elapsed if elapsed > 0 else 0
        eta = (total - completed) / rate if rate > 0 else 0
        print(f"[{completed}/{total}] Generated audio files. Speed: {rate:.1f} files/sec | ETA: {eta:.0f}s")

    elapsed_total = time.time() - start_time
    # Count generated files on disk
    disk_files = [f for f in os.listdir(AUDIO_DIR) if f.endswith(".mp3")]
    total_size_bytes = sum(os.path.getsize(os.path.join(AUDIO_DIR, f)) for f in disk_files)
    total_size_mb = total_size_bytes / (1024 * 1024)

    print("\n" + "="*50)
    print("AUDIO GENERATION SUMMARY:")
    print(f"Total MP3 files on disk: {len(disk_files)}")
    print(f"Total size: {total_size_mb:.2f} MB")
    print(f"Failed words: {len(failed_words)}")
    print(f"Total time elapsed: {elapsed_total:.1f} seconds ({elapsed_total/60:.1f} minutes)")
    print("="*50 + "\n")

if __name__ == "__main__":
    asyncio.run(main())
