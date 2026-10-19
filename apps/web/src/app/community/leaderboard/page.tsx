'use client';

import React from 'react';
import { ComingSoon } from '../../../components/ui/ComingSoon';

export default function CommunityLeaderboardPage() {
  return (
    <ComingSoon
      title="Bảng Xếp Hạng Cộng Đồng"
      category="Vinh Danh Học Viên"
      description="Bảng vàng vinh danh những học viên có chuỗi ngày học chăm chỉ và tích lũy điểm kinh nghiệm cao nhất đang được cập nhật. Hãy quay lại sau nhé!"
      backHref="/community"
      backLabel="Quay lại Cộng đồng"
    />
  );
}
