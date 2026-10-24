import os
import re
import asyncio
import edge_tts

def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "word"

AUDIO_DIR = os.path.join("apps", "web", "public", "audio", "vocab")

async def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    with open("prisma/seed.ts", "r", encoding="utf-8") as f:
        content = f.read()

    words = re.findall(r'targetText:\s*"([^"]+)"', content)
    print(f"Checking {len(words)} unit words for audio...")

    sem = asyncio.Semaphore(10)
    async def worker(w):
        slug = slugify(w)
        path = os.path.join(AUDIO_DIR, f"{slug}.mp3")
        if not os.path.exists(path) or os.path.getsize(path) < 100:
            async with sem:
                comm = edge_tts.Communicate(w, "en-US-AriaNeural")
                await comm.save(path)
                print(f"Generated audio for unit word: {w} -> {slug}.mp3")

    await asyncio.gather(*(worker(w) for w in words))
    print("Unit words audio sync complete!")

if __name__ == "__main__":
    asyncio.run(main())
