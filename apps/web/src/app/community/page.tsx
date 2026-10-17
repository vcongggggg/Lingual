'use client';

import React from 'react';
import { ComingSoon } from '../../components/ui/ComingSoon';

export default function CommunityHubPage() {
  return (
    <ComingSoon
      title="Cộng Đồng Học Tập Lingual"
      category="Cộng Đồng & Bạn Bè"
      description="Không gian giao lưu học tập, chia sẻ sổ tay ghi nhớ, kết nối bạn bè và thi đua cùng nhau đang được hoàn thiện. Hãy quay lại sau nhé!"
      backHref="/dashboard"
      backLabel="Quay lại Trang chủ"
    />
  );
}
