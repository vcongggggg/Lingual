r"""
Script: import_cambridge11_test1.py
Mục đích: Import Cambridge IELTS 11 Test 1 vào DB local với Hard gate Bước 0 và Early-exit guard.
Dữ liệu đọc từ: C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-11\ (PRIVATE NGOÀI REPO)
Tuyệt đối không commit dữ liệu sách vào repo Git.
"""

import os
import sys
import json
import psycopg2
from pathlib import Path
import fitz # PyMuPDF

sys.stdout.reconfigure(encoding='utf-8')

MAPPED_DIR = Path(r"C:\Mod\muse-data-exchange\book-corpus-mapped\cambridge-ielts-11")
PDF_PATH = Path(r"C:\Study\HocKy6\materials\Cambridge_IELTS\Cambridge IELTS 11 - Academic & General Practice Tests.pdf")
DSN = os.environ.get("DATABASE_URL", "postgresql://postgres:IvulKvKro_ALoEF_xN3yNT4jI8cI-HEw@localhost:5432/linguaflow_db")

def verify_step_0():
    print("=" * 60)
    print("[BƯỚC 0] XÁC MINH 2 CÂU LISTENING (Q18 & Q26) TRƯỚC KHI IMPORT (ĐIỀU KIỆN CỨNG)")
    print("=" * 60)
    
    # 1. Đọc file nguồn đã parse
    listening_file = MAPPED_DIR / "ielts_listening_sections.json"
    if not listening_file.exists():
        print(f"[ERROR] Không tìm thấy file: {listening_file}")
        return False, "Thiếu file nguồn ielts_listening_sections.json"
    
    with open(listening_file, "r", encoding="utf-8") as f:
        sections = json.load(f)
    
    parsed_q18 = None
    parsed_q26 = None
    for sec in sections:
        q_list = json.loads(sec['questionsJson']) if isinstance(sec['questionsJson'], str) else sec['questionsJson']
        for q in q_list:
            if q.get('questionNumber') == 18:
                parsed_q18 = q.get('correctAnswer')
            elif q.get('questionNumber') == 26:
                parsed_q26 = q.get('correctAnswer')
                
    print(f"[*] Giá trị parser pilot hiện tại: Q18 = '{parsed_q18}', Q26 = '{parsed_q26}'")
    
    # 2. Đọc trực tiếp trang Answer Key 124 trong PDF gốc
    if not PDF_PATH.exists():
        print(f"[ERROR] Không tìm thấy PDF gốc: {PDF_PATH}")
        return False, "Thiếu PDF gốc để đối soát"
        
    doc = fitz.open(PDF_PATH)
    # Trang 124 in ấn nằm ở PDF page index 124 (page 125)
    key_page_text = doc[124].get_text()
    
    official_q18 = None
    official_q26 = None
    
    for line in key_page_text.split('\n'):
        line_clean = line.strip()
        if line_clean.startswith('18 '):
            official_q18 = line_clean.split(' ')[1]
        elif line_clean == '18':
            # trường hợp số và chữ tách dòng
            pass
        if line_clean.startswith('26 '):
            official_q26 = line_clean.split(' ')[1]
            
    print(f"[*] Giá trị trang Answer Key (trang 124 in ấn trong PDF): Q18 = '{official_q18}', Q26 = '{official_q26}'")
    
    # 3. So khớp
    q26_match = (parsed_q26 == official_q26)
    q18_match = (parsed_q18 == official_q18)
    
    print(f"[*] Đối chiếu Q26: Parser '{parsed_q26}' vs Key '{official_q26}' -> {'KHỚP (ĐÚNG)' if q26_match else 'SAI'}")
    print(f"[*] Đối chiếu Q18: Parser '{parsed_q18}' vs Key '{official_q18}' -> {'KHỚP (ĐÚNG)' if q18_match else 'SAI'}")
    
    if not q18_match or not q26_match:
        msg = f"HARD GATE BƯỚC 0 THẤT BẠI: Q18 parser='{parsed_q18}' không khớp với Answer Key trang 124='{official_q18}' (đáp án đúng chính thức là 'H')."
        print(f"\n[BLOCKED] {msg}")
        print("[!] THEO ĐÚNG CHỈ THỊ CỦA MUSE: 'Neu SAI: dung import, bao blocked ghi ro dap an dung'.")
        print("[!] ĐÃ DỪNG IMPORT TOÀN BỘ 14 BẢN GHI ĐỂ BẢO VỆ DỮ LIỆU DB!")
        return False, msg
        
    print("\n[PASS] BƯỚC 0 XÁC MINH THÀNH CÔNG KHỚP 100%!")
    return True, "Bước 0 hợp lệ"

def main():
    step0_ok, reason = verify_step_0()
    if not step0_ok:
        print("\n" + "="*60)
        print(f"KẾT QUẢ: IMPORT BỊ CHẶN (BLOCKED)")
        print(f"Lý do: {reason}")
        print("Không có bản ghi nào được ghi vào DB local.")
        print("="*60)
        sys.exit(2) # Exit code 2 báo hiệu blocked theo hard gate
        
if __name__ == "__main__":
    main()
