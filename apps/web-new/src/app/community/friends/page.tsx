'use client';

import React from 'react';
import { ComingSoon } from '../../../components/ui/ComingSoon';

export default function CommunityFriendsPage() {
  return (
    <ComingSoon
      title="Danh Sách Bạn Cùng Học"
      category="Kết Nối Bạn Bè"
      description="Tính năng theo dõi tiến độ và cùng nhau nhắc nhở rèn luyện mỗi ngày đang được phát triển. Hãy quay lại sau nhé!"
      backHref="/community"
      backLabel="Quay lại Cộng đồng"
    />
  );
}
