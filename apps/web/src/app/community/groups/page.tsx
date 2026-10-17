'use client';

import React from 'react';
import { ComingSoon } from '../../../components/ui/ComingSoon';

export default function CommunityGroupsPage() {
  return (
    <ComingSoon
      title="Nhóm Học Tập & Câu Lạc Bộ"
      category="Nhóm Học Tập"
      description="Tham gia các nhóm rèn luyện chuyên sâu theo chủ đề IELTS, TOEIC, giao tiếp công sở... đang được hoàn thiện. Hãy quay lại sau nhé!"
      backHref="/community"
      backLabel="Quay lại Cộng đồng"
    />
  );
}
