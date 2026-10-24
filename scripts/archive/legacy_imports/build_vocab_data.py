#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pipeline to build standardized vocabulary data (Oxford 5000 + CEFR C2 + OVDP StarDict + Tatoeba)
and generate real audio using edge-tts.
"""

import os
import sys
import csv
import json
import re
import struct
import bz2
import asyncio
import time
from collections import Counter, defaultdict

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

DATA_DIR = "data"
STANDARDIZED_DIR = os.path.join(DATA_DIR, "standardized")
AUDIO_DIR = os.path.join("apps", "web", "public", "audio", "vocab")
OUTPUT_JSON = os.path.join(STANDARDIZED_DIR, "vocab-bulk.json")
UNMAPPED_TXT = "unmapped-words.txt"

ALLOWED_POS = {
    "noun", "verb", "adjective", "adverb",
    "pronoun", "preposition", "conjunction",
    "interjection", "phrase"
}

ALLOWED_CEFR = {"A1", "A2", "B1", "B2", "C1", "C2"}

def normalize_pos(raw_pos: str, word: str) -> str:
    raw = (raw_pos or "").strip().lower()
    if " " in word or "-" in word:
        return "phrase"
    if "adverb" in raw or "adv" in raw:
        return "adverb"
    if "pronoun" in raw or "determiner" in raw or "article" in raw:
        return "pronoun"
    if "verb" in raw:
        return "verb"
    if "noun" in raw or "number" in raw:
        return "noun"
    if "adjective" in raw or "adj" in raw:
        return "adjective"
    if "preposition" in raw or "prep" in raw:
        return "preposition"
    if "conjunction" in raw or "conj" in raw:
        return "conjunction"
    if "interjection" in raw or "exclamation" in raw:
        return "interjection"
    return "noun"

def normalize_cefr(raw_cefr: str) -> str:
    level = (raw_cefr or "").strip().upper()
    if level in ALLOWED_CEFR:
        return level
    return "B1"

def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "word"

def load_existing_seed_words():
    existing = set()
    seed_file = os.path.join("prisma", "seed.ts")
    if os.path.exists(seed_file):
        with open(seed_file, "r", encoding="utf-8") as f:
            content = f.read()
        matches = re.findall(r'targetText:\s*\"([^\"]+)\"', content)
        for m in matches:
            existing.add(m.strip().lower())
    print(f"Loaded {len(existing)} existing words from prisma/seed.ts")
    return existing

def load_tatoeba_pairs():
    print("Loading Tatoeba English-Vietnamese sentence pairs...")
    links_file = os.path.join(DATA_DIR, "eng-vie_links.tsv.bz2")
    vie_file = os.path.join(DATA_DIR, "vie_sentences.tsv.bz2")
    eng_file = os.path.join(DATA_DIR, "eng_sentences.tsv.bz2")

    links = {}
    with bz2.open(links_file, "rt", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) >= 2:
                eng_id, vie_id = parts[0], parts[1]
                if eng_id not in links:
                    links[eng_id] = vie_id

    vie_sentences = {}
    with bz2.open(vie_file, "rt", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) >= 3:
                vie_sentences[parts[0]] = parts[2]

    # Index pairs by English words (tokenized)
    word_to_sentences = defaultdict(list)
    total_pairs = 0
    with bz2.open(eng_file, "rt", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) >= 3:
                eng_id, eng_text = parts[0], parts[2]
                if eng_id in links:
                    vie_id = links[eng_id]
                    if vie_id in vie_sentences:
                        vie_text = vie_sentences[vie_id]
                        total_pairs += 1
                        words_in_sent = set(re.findall(r"[a-zA-Z]+", eng_text.lower()))
                        num_words = len(eng_text.split())
                        # Only keep short sentences (< 15 words) per requirement
                        if num_words <= 14:
                            for w in words_in_sent:
                                if len(word_to_sentences[w]) < 5:
                                    word_to_sentences[w].append((num_words, eng_text, vie_text))

    print(f"Loaded {total_pairs} Tatoeba sentence pairs. Indexed {len(word_to_sentences)} words.")
    return word_to_sentences

def load_stardict():
    print("Loading OVDP StarDict dictionary...")
    idx_path = os.path.join(DATA_DIR, "star_anhviet.idx")
    dict_path = os.path.join(DATA_DIR, "star_anhviet.dict")

    word_to_offset = {}
    with open(idx_path, "rb") as f_idx:
        idx_data = f_idx.read()
        pos = 0
        total = len(idx_data)
        while pos < total:
            null_idx = idx_data.find(b"\x00", pos)
            if null_idx == -1:
                break
            word = idx_data[pos:null_idx].decode("utf-8", errors="ignore").lower().strip()
            pos = null_idx + 1
            offset, size = struct.unpack(">II", idx_data[pos:pos+8])
            pos += 8
            if word not in word_to_offset:
                word_to_offset[word] = (offset, size)

    print(f"Indexed {len(word_to_offset)} words from StarDict.")
    return word_to_offset, dict_path

def clean_vietnamese_meaning(line: str) -> str:
    m = line.lstrip("-").strip()
    m = re.sub(r"\([^)]+\)", "", m).strip()
    m = re.sub(r"\s+", " ", m).strip()
    parts = [p.strip() for p in m.split(";") if p.strip()]
    if parts:
        return parts[0]
    return m

def parse_dict_entry(defn_text: str):
    ipa = None
    first_meaning = None

    lines = defn_text.splitlines()
    if lines:
        ipa_match = re.search(r"/([^/]+)/", lines[0])
        if ipa_match:
            ipa = f"/{ipa_match.group(1)}/"

    for line in lines:
        line = line.strip()
        if line.startswith("-") and not line.startswith("--"):
            cleaned = clean_vietnamese_meaning(line)
            if cleaned and len(cleaned) > 1 and not cleaned.startswith("="):
                first_meaning = cleaned
                break

    return ipa, first_meaning

def build_data():
    os.makedirs(STANDARDIZED_DIR, exist_ok=True)
    os.makedirs(AUDIO_DIR, exist_ok=True)

    existing_seed_words = load_existing_seed_words()
    tatoeba_index = load_tatoeba_pairs()
    stardict_index, dict_file_path = load_stardict()

    # Load Oxford 5000 raw datasets
    entries = {}

    # Source A: winterdl oxford_5000.json
    winterdl_path = os.path.join(DATA_DIR, "oxford_5000_winterdl.json")
    if os.path.exists(winterdl_path):
        with open(winterdl_path, "r", encoding="utf-8") as f:
            w_data = json.load(f)
            items = w_data.values() if isinstance(w_data, dict) else w_data
            for item in items:
                w = item.get("word", "").strip().lower()
                if w and w not in entries:
                    entries[w] = {
                        "word": w,
                        "type": item.get("type", ""),
                        "cefr": item.get("cefr", ""),
                        "phon_n_am": item.get("phon_n_am", ""),
                        "phon_br": item.get("phon_br", ""),
                        "example": item.get("example", "")
                    }

    # Source B: oxford-5k.csv
    oxford_csv_path = os.path.join(DATA_DIR, "oxford-5k.csv")
    if os.path.exists(oxford_csv_path):
        with open(oxford_csv_path, "r", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                w = row.get("word", "").strip().lower()
                if w and w not in entries:
                    entries[w] = {
                        "word": w,
                        "type": row.get("pos", ""),
                        "cefr": row.get("level", ""),
                        "phon_n_am": "",
                        "phon_br": "",
                        "example": ""
                    }

    # Source C: CEFR C2 expansion (to ensure full A1-C2 range & >= 5000 unique words)
    c1c2_path = os.path.join(DATA_DIR, "c1c2.csv")
    if os.path.exists(c1c2_path):
        c2_count = 0
        with open(c1c2_path, "r", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                if row.get("CEFR", "").upper() == "C2":
                    w = row.get("headword", "").strip().lower()
                    if w and w not in entries and re.match(r"^[a-z]+$", w):
                        entries[w] = {
                            "word": w,
                            "type": row.get("pos", ""),
                            "cefr": "C2",
                            "phon_n_am": "",
                            "phon_br": "",
                            "example": ""
                        }
                        c2_count += 1
                        if c2_count >= 200:  # 200 C2 words for balanced representation
                            break

    print(f"Total entries gathered across Oxford 5000 + C2: {len(entries)}")

    standardized_records = []
    unmapped_words = []

    with open(dict_file_path, "rb") as f_dict:
        for w, ox in entries.items():
            # Check StarDict
            defn_text = ""
            if w in stardict_index:
                offset, size = stardict_index[w]
                f_dict.seek(offset)
                defn_text = f_dict.read(size).decode("utf-8", errors="ignore")
            elif w.replace("-", " ") in stardict_index:
                offset, size = stardict_index[w.replace("-", " ")]
                f_dict.seek(offset)
                defn_text = f_dict.read(size).decode("utf-8", errors="ignore")

            dict_ipa, dict_meaning = parse_dict_entry(defn_text)

            if not dict_meaning:
                unmapped_words.append(w)
                continue

            phonetic = ox.get("phon_n_am") or ox.get("phon_br") or dict_ipa
            if phonetic and not phonetic.startswith("/"):
                phonetic = f"/{phonetic}/"

            pos = normalize_pos(ox.get("type") or "", w)
            cefr = normalize_cefr(ox.get("cefr") or "")

            # Tatoeba example
            example_sentence = None
            example_translation = None
            candidates = tatoeba_index.get(w, [])
            if candidates:
                candidates.sort(key=lambda x: x[0])
                example_sentence = candidates[0][1].strip()
                example_translation = candidates[0][2].strip()

            slug = slugify(w)
            audio_url = f"/audio/vocab/{slug}.mp3"

            record = {
                "targetText": w,
                "translation": dict_meaning,
                "phonetic": phonetic or None,
                "partOfSpeech": pos,
                "cefrLevel": cefr,
                "exampleSentence": example_sentence,
                "exampleTranslation": example_translation,
                "imageUrl": None,
                "audioUrl": audio_url,
                "source": "oxford5000+ovdp+tatoeba",
                "verified": False
            }
            standardized_records.append(record)

    # Sort records: A1 -> A2 -> B1 -> B2 -> C1 -> C2, then alphabetical
    cefr_order = {"A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5, "C2": 6}
    standardized_records.sort(key=lambda r: (cefr_order.get(r["cefrLevel"], 99), r["targetText"]))

    # Save standardized JSON
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(standardized_records, f, ensure_ascii=False, indent=2)

    # Save unmapped words
    with open(UNMAPPED_TXT, "w", encoding="utf-8") as f:
        for u in sorted(unmapped_words):
            f.write(u + "\n")

    # Statistics
    cefr_stats = Counter(r["cefrLevel"] for r in standardized_records)
    pos_stats = Counter(r["partOfSpeech"] for r in standardized_records)
    ex_count = sum(1 for r in standardized_records if r["exampleSentence"])

    print("\n" + "="*50)
    print("DATA PIPELINE SUMMARY:")
    print(f"Total Standardized Records: {len(standardized_records)}")
    print(f"Unmapped words written to {UNMAPPED_TXT}: {len(unmapped_words)}")
    print(f"Records with Tatoeba example sentence: {ex_count} ({ex_count/len(standardized_records)*100:.1f}%)")
    print(f"CEFR Distribution: {dict(sorted(cefr_stats.items(), key=lambda x: cefr_order.get(x[0], 99)))}")
    print(f"POS Distribution: {dict(pos_stats)}")
    print(f"Output saved to: {OUTPUT_JSON}")
    print("="*50 + "\n")

    return standardized_records

if __name__ == "__main__":
    build_data()
