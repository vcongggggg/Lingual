'use client';

import React from 'react';
import { ComingSoon } from '../../../components/ui/ComingSoon';

export default function CommunityAchievementsPage() {
  return (
    <ComingSoon
      title="Huy Hiệu & Thành Tích Học Tập"
      category="Bảng Thành Tích"
      description="Bộ sưu tập huy hiệu mực in, danh hiệu học giả và các mốc kỷ lục học tập của bạn đang được hoàn thiện. Hãy quay lại sau nhé!"
      backHref="/dashboard"
      backLabel="Quay lại Trang chủ"
      reaction="roseGift"
    />
  );
}
