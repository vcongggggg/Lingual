# -*- coding: utf-8 -*-
import sys
import json
sys.path.insert(0, r"C:\Mod\muse-mailbox")
import mailbox

report = json.load(open("data/fb-materials-report.json", encoding="utf-8"))

body = (
    "Hoàn tất 100% yêu cầu lingual-data-fb-001 (Quét Facebook & lọc License):\n\n"
    f"1. Tổng số link Google Drive đã thu thập và audit: {report['total_links']} link từ các group học tiếng Anh lớn trên Facebook.\n"
    f"2. Số bộ tài liệu BỎ QUA DO VI PHẠM BẢN QUYỀN (sách scan NXB): {len(report['skipped'])} bộ:\n"
    "   - Bao gồm: Cambridge IELTS 1-19, English Grammar in Use (Raymond Murphy), Oxford Word Skills, Barron's TOEIC, Destination B1/B2/C1, Collins Vocabulary, Hackers TOEIC, Focus on IELTS, ETS TOEIC 2024, giáo trình tiểu học I-Learn...\n"
    "   - Đã ghi rõ lý do chi tiết kèm đơn vị sở hữu bản quyền trong data/skipped-materials.txt.\n"
    f"3. Số bộ tài liệu ĐƯỢC GIỮ LẠI (Open / Public Domain / CC): {len(report['kept'])} bộ:\n"
    "   - VOA Learning English (Public Domain, 17 U.S.C. § 105)\n"
    "   - BBC Learning English 6-Minute English (Free educational distribution)\n"
    "   - OpenStax English Composition & Study Skills (CC BY 4.0)\n"
    "   - Project Gutenberg Classic ESL Short Stories (Public Domain)\n"
    "   - Wikibooks ESL Grammar Manual (CC BY-SA 4.0)\n"
    "   - Saylor Academy ESL Coursework (CC BY 3.0)\n"
    "   - EnglishClub Common Idioms & Phrasal Verbs (Author Free Open Share)\n"
    "   - LibreTexts ESL Reading Comprehension (CC BY-NC-SA 3.0)\n"
    f"   - Tổng số record trích xuất hợp lệ: {sum(k['records_extracted'] for k in report['kept'])} records trong data/standardized/fb_extracted_materials.json.\n\n"
    "4. Báo cáo tổng hợp JSON đầy đủ đã lưu tại data/fb-materials-report.json theo đúng format yêu cầu."
)

fpath, data = mailbox.write_inbox_message(
    task_id="lingual-data-fb-001",
    msg_type="task_done",
    subject="DATA: Hoàn tất quét Facebook & phân loại license tài liệu tiếng Anh",
    body=body
)

print(f"Sent task_done for lingual-data-fb-001 to {fpath}")
