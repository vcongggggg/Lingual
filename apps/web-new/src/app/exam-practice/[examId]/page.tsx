'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ComingSoon } from '../../../components/ui/ComingSoon';
import ToeicHubPage from '../toeic/page';

const EXAM_NAMES: Record<string, string> = {
  vstep: 'Kỳ thi VSTEP (Khung Năng Lực 6 Bậc)',
  dsat: 'Kỳ thi Digital SAT Chuẩn Hóa',
  hsk: 'Kỳ thi Năng Lực Hán Ngữ (HSK)',
  jlpt: 'Kỳ thi Năng Lực Nhật Ngữ (JLPT)',
  topik: 'Kỳ thi Năng Lực Hàn Ngữ (TOPIK)',
};

export default function DynamicExamPage() {
  const params = useParams();
  const examId = params?.examId ? String(params.examId).toLowerCase() : '';

  if (examId === 'toeic') {
    return <ToeicHubPage />;
  }

  const examTitle = EXAM_NAMES[examId] || `Kỳ thi chứng chỉ ${examId.toUpperCase()}`;

  return (
    <ComingSoon
      title={examTitle}
      category="Phòng Khảo Thí Đang Biên Soạn"
      description="Bộ đề thi thử và hệ thống ngân hàng câu hỏi chuẩn định dạng quốc tế đang được đội ngũ khảo thí hoàn thiện. Hãy quay lại sau nhé!"
      backHref="/exam-practice"
      backLabel="Quay lại Trung tâm khảo thí"
    />
  );
}
