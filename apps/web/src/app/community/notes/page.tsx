'use client';

import React from 'react';
import { ComingSoon } from '../../../components/ui/ComingSoon';

export default function CommunityNotesPage() {
  return (
    <ComingSoon
      title="Sổ Tay Chia Sẻ Kinh Nghiệm"
      category="Ghi Chú Cộng Đồng"
      description="Góc chia sẻ bí quyết học từ vựng, mẹo nhớ ngữ pháp và bài đọc hay giữa các thành viên đang được xây dựng. Hãy quay lại sau nhé!"
      backHref="/community"
      backLabel="Quay lại Cộng đồng"
    />
  );
}
