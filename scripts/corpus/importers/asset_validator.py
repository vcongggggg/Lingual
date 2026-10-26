# -*- coding: utf-8 -*-
r"""
Module: asset_validator.py
Description: Validates question image asset references (imageRef) against QUESTION_ASSETS_DIR.
Enforces:
- Basename only (traversal blocking)
- Allowed image extensions (.png, .jpg, .jpeg, .webp)
- Immediate hard error on missing asset file (zero silent skipping)
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional

DEFAULT_ASSETS_DIR = Path(os.environ.get("QUESTION_ASSETS_DIR", r"C:\Mod\muse-data-exchange\question-assets"))
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


class QuestionAssetError(Exception):
    """Raised when a question asset reference fails security or existence checks."""
    pass


def get_assets_dir() -> Path:
    assets_dir_env = os.environ.get("QUESTION_ASSETS_DIR")
    if assets_dir_env:
        return Path(assets_dir_env).resolve()
    return DEFAULT_ASSETS_DIR.resolve()


def validate_single_image_ref(image_ref: Optional[str], assets_dir: Optional[Path] = None) -> Optional[Path]:
    """
    Validates a single image reference string.
    Returns the resolved Path if valid and exists.
    Raises QuestionAssetError or FileNotFoundError if invalid or missing.
    """
    if not image_ref:
        return None

    if not isinstance(image_ref, str) or not image_ref.strip():
        return None

    clean_ref = image_ref.strip()

    # Traversal blocking
    if ".." in clean_ref or "/" in clean_ref or "\\" in clean_ref or "\0" in clean_ref:
        raise QuestionAssetError(
            f"Security violation: imageRef '{clean_ref}' contains illegal traversal or path characters."
        )

    # Basename validation
    if Path(clean_ref).name != clean_ref:
        raise QuestionAssetError(
            f"Security violation: imageRef '{clean_ref}' must be a pure basename without directory prefixes."
        )

    ext = Path(clean_ref).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise QuestionAssetError(
            f"Invalid asset extension '{ext}' for imageRef '{clean_ref}'. Allowed: {sorted(ALLOWED_EXTENSIONS)}"
        )

    base_dir = (assets_dir or get_assets_dir()).resolve()
    target_path = (base_dir / clean_ref).resolve()

    # Directory jail check
    try:
        target_path.relative_to(base_dir)
    except ValueError:
        raise QuestionAssetError(f"Security violation: '{clean_ref}' resolves outside assets directory '{base_dir}'.")

    if not target_path.exists() or not target_path.is_file():
        raise FileNotFoundError(
            f"Question asset referenced by '{clean_ref}' not found at '{target_path}'. "
            f"Missing image assets must not be silently skipped during import."
        )

    return target_path


def validate_questions_json_assets(
    questions: List[Dict[str, Any]],
    assets_dir: Optional[Path] = None,
    context_label: str = ""
) -> List[str]:
    """
    Validates all imageRef entries within a list of question objects.
    Raises FileNotFoundError or QuestionAssetError upon encountering any invalid or missing asset.
    Returns list of verified imageRef filenames.
    """
    verified: List[str] = []
    errors: List[str] = []

    for idx, q in enumerate(questions):
        ref = q.get("imageRef") or q.get("image_ref")
        if ref:
            q_num = q.get("questionNumber") or q.get("id") or idx + 1
            try:
                validate_single_image_ref(ref, assets_dir=assets_dir)
                verified.append(ref)
            except Exception as e:
                errors.append(f"[{context_label} Q{q_num}] {str(e)}")

    if errors:
        raise QuestionAssetError("\n".join(errors))

    return verified


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    import json

    if len(sys.argv) < 2:
        print("Usage: python asset_validator.py <path_to_data.json>")
        sys.exit(1)

    json_path = Path(sys.argv[1])
    if not json_path.exists():
        print(f"Error: JSON file not found: {json_path}")
        sys.exit(1)

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"Checking assets in {json_path.name}...")
    total_verified = 0

    # Check listening sections
    for sec in data.get("listening_sections", []):
        q_raw = sec.get("questionsJson")
        if q_raw:
            q_list = json.loads(q_raw) if isinstance(q_raw, str) else q_raw
            v = validate_questions_json_assets(q_list, context_label=f"Listening Sec {sec.get('section')}")
            total_verified += len(v)

    # Check reading passages
    for pas in data.get("reading_passages", []):
        q_raw = pas.get("questionsJson")
        if q_raw:
            q_list = json.loads(q_raw) if isinstance(q_raw, str) else q_raw
            v = validate_questions_json_assets(q_list, context_label=f"Reading Sec {pas.get('section')}")
            total_verified += len(v)

    print(f"✅ Success: Verified {total_verified} imageRef asset references without error.")
