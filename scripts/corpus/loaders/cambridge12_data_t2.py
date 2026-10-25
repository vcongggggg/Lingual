r"""
Module: cambridge12_data_t2.py
Description: Lightweight loader for Cambridge IELTS 12 - Test 2 (Academic).
Content literals are decoupled into external JSON outside the repository:
  C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-12\cam12-academic-test-2-data.json
"""

import json
import os
from pathlib import Path

BASE_MAPPED_DIR = Path(os.environ.get("BOOK_CORPUS_MAPPED_DIR", r"C:\Mod\muse-data-exchange\book-corpus-mapped"))
DATA_FILE = BASE_MAPPED_DIR / "cambridge-ielts-12" / "cam12-academic-test-2-data.json"

def _load_test_data():
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Missing mapped test data file: {DATA_FILE}")
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

_DATA = _load_test_data()

OFFICIAL_LISTENING_KEYS = {int(k): v for k, v in _DATA["official_keys"]["listening"].items()}
OFFICIAL_READING_KEYS = {int(k): v for k, v in _DATA["official_keys"]["reading"].items()}

def build_test_2(raw_md_text: str = "", official_keys: dict = None):
    data = _load_test_data()
    return (
        data["listening_sections"],
        data["reading_passages"],
        data["writing_topics"],
        data["writing_models"],
        data["speaking_topics"]
    )
