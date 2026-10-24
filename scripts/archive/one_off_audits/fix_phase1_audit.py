# -*- coding: utf-8 -*-
"""
Script to address all 4 findings from Muse independent audit for Phase 1:
1. Replace inappropriate example for 'underwear'
2. Fix incorrect example for 'evolution' and 'evidence'
3. Clean StarDict markup tags (<...>), cross-references ('xem X'), and context errors in translation
4. Assign exampleAudioUrl to all 3,023 words with exampleSentence and save updated JSON
"""

import json
import re
import os
import sys

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

DATA_PATH = os.path.join("data", "standardized", "vocab-bulk.json")

def main():
    print("Reading vocab-bulk.json...")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    modified_count = 0
    cleaned_markup_count = 0
    cleaned_xem_count = 0

    # Specific cross-reference dictionary mappings
    XEM_MAP = {
        "suddenly": "đột ngột, bất thình lình",
        "cap": "cái mũ lưỡi trai, nắp chai, giới hạn",
        "awareness": "sự nhận thức, ý thức",
        "deliberately": "có chủ ý, cố ý, thận trọng",
        "increasingly": "ngày càng, càng ngày càng",
        "permanently": "vĩnh viễn, lâu dài",
        "potentially": "tiềm năng, tiềm tàng",
        "anthropologically": "về mặt nhân chủng học",
        "anticlimactically": "hụt hẫng, giảm dần kịch tính",
        "athleticism": "tinh thần thể thao, sự dẻo dai thể lực",
        "autonomously": "một cách tự chủ, tự trị",
        "commensurately": "một cách tương xứng",
        "contextually": "theo ngữ cảnh",
        "contractually": "theo hợp đồng",
        "deficiently": "một cách thiếu hụt, khiếm khuyết",
        "pervasiveness": "sự lan tỏa, tính thâm nhập rộng khắp",
        "physiologically": "về mặt sinh lý học",
        "postural": "thuộc tư thế",
        "unequivocally": "một cách rõ ràng, dứt khoát"
    }

    # Specific context corrections
    CONTEXT_MAP = {
        "bathroom": "phòng tắm, nhà vệ sinh",
        "fabulous": "tuyệt vời, thần thoại",
        "speculate": "suy đoán, đầu cơ",
        "guitar": "đàn ghi-ta, đàn guitar",
        "basketball": "bóng rổ",
        "tonne": "tấn (đơn vị trọng lượng)",
        "browser": "trình duyệt web",
        "laser": "tia la-de, laser",
        "trademark": "nhãn hiệu đăng ký, thương hiệu"
    }

    for item in data:
        w = item["targetText"]
        w_lower = w.lower().strip()
        tr = item.get("translation") or ""

        # 1. Underwear fix
        if w_lower == "underwear":
            item["exampleSentence"] = "She bought new underwear at the store."
            item["exampleTranslation"] = "Cô ấy đã mua đồ lót mới ở cửa hàng."
            modified_count += 1
            print(f"Fixed underwear example: {item['exampleSentence']}")

        # 2. Evolution & Evidence fix
        if w_lower == "evolution":
            item["exampleSentence"] = "Scientists study the evolution of birds from dinosaurs."
            item["exampleTranslation"] = "Các nhà khoa học nghiên cứu sự tiến hóa của loài chim từ khủng long."
            modified_count += 1
            print(f"Fixed evolution example: {item['exampleSentence']}")

        if w_lower == "evidence" and "evolution has no evidence" in (item.get("exampleSentence") or "").lower():
            item["exampleSentence"] = "There is no scientific evidence to support this claim."
            item["exampleTranslation"] = "Không có bằng chứng khoa học nào chứng minh cho khẳng định này."
            modified_count += 1
            print(f"Fixed evidence example: {item['exampleSentence']}")

        # 3. Context & StarDict markup fixes
        if w_lower in CONTEXT_MAP:
            item["translation"] = CONTEXT_MAP[w_lower]
            modified_count += 1
            cleaned_markup_count += 1
        elif w_lower in XEM_MAP:
            item["translation"] = XEM_MAP[w_lower]
            modified_count += 1
            cleaned_xem_count += 1
        else:
            # Strip any remaining <tag>
            if "<" in tr and ">" in tr:
                new_tr = re.sub(r"<[^>]+>", "", tr).strip()
                new_tr = re.sub(r"\s+", " ", new_tr)
                if new_tr != tr:
                    item["translation"] = new_tr
                    modified_count += 1
                    cleaned_markup_count += 1

        # 4. Example audio URL mapping
        ex = item.get("exampleSentence")
        if ex and ex.strip():
            audio_url = item.get("audioUrl", "")
            slug = os.path.splitext(os.path.basename(audio_url))[0]
            item["exampleAudioUrl"] = f"/audio/vocab/{slug}-ex.mp3"
        else:
            item["exampleAudioUrl"] = None

    # Verification checks
    total_with_ex = sum(1 for item in data if item.get("exampleSentence") and item.get("exampleSentence").strip())
    total_with_ex_audio = sum(1 for item in data if item.get("exampleAudioUrl"))
    semen_check = any(bool(re.search(r"\bsemen\b", json.dumps(item).lower())) for item in data)
    evolution_bad_check = any("evolution has no evidence" in json.dumps(item).lower() for item in data)
    markup_check = any(bool(re.search(r"<[a-z]+>", item.get("translation") or "", re.IGNORECASE)) for item in data)

    print("\n" + "="*50)
    print("AUDIT FIX VERIFICATION:")
    print(f"Total words: {len(data)}")
    print(f"Words with exampleSentence: {total_with_ex}")
    print(f"Words with exampleAudioUrl: {total_with_ex_audio}")
    print(f"Contains word 'semen': {semen_check} (Must be False)")
    print(f"Contains 'Evolution has no evidence': {evolution_bad_check} (Must be False)")
    print(f"Contains StarDict '<[a-z]+>' markup: {markup_check} (Must be False)")
    print(f"Cleaned markup tags count: {cleaned_markup_count}")
    print(f"Cleaned cross-references count: {cleaned_xem_count}")
    print(f"Total modified records: {modified_count}")
    print("="*50 + "\n")

    assert not semen_check, "Error: 'semen' still found in dataset!"
    assert not evolution_bad_check, "Error: Bad evolution sentence still found!"
    assert not markup_check, "Error: Markup tags still found!"
    assert total_with_ex == total_with_ex_audio, "Mismatch between example count and example audio count!"

    # Save updated json
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Successfully saved updated dataset to {DATA_PATH}!")

if __name__ == "__main__":
    main()
