# -*- coding: utf-8 -*-
r"""
Bridge wrapper for import_cambridge03_academic.py
"""
import sys
from pathlib import Path

IMPORTER_PATH = Path(__file__).resolve().parent.parent / "corpus" / "importers"
sys.path.insert(0, str(IMPORTER_PATH))

from import_cambridge03_academic import *

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Cambridge IELTS 03 Academic Tests 1-4 into local DB")
    parser.add_argument("--dry-run", action="store_true", help="Run validation and rollback without persisting changes")
    parser.add_argument("--force-bypass-gate0", action="store_true", help="Bypass Gate 0 check")
    args = parser.parse_args()

    run_import(force_bypass_gate0=args.force_bypass_gate0, dry_run=args.dry_run)
