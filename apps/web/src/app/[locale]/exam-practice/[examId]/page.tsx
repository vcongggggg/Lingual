'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen, Trophy, ShieldAlert, Play, CheckCircle2, AlertTriangle } from 'lucide-react';
import { MASTER_EXAMS } from '@/lib/exams/sampleData';
import { examsApi } from '@/lib/exams/api';
import { Exam } from '@linguaflow/domain';
import { Button, Badge, Card } from '@linguaflow/ui';

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'vi';
  const examId = params?.examId as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [starting, setStarting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const found = MASTER_EXAMS.find((e) => e.id === examId) || MASTER_EXAMS[0];
    setExam(found);

    examsApi
      .getExam(examId)
      .then((res: any) => {
        if (res?.exam) setExam(res.exam);
      })
      .catch(() => {});
  }, [examId]);

  const handleStartAttempt = async () => {
    if (starting || !exam) return;
    setStarting(true);

    try {
      const res = await examsApi.startExam(exam.id);
      if (res?.attemptId) {
        router.push(`/${locale}/exam-practice/${exam.id}/attempt/${res.attemptId}`);
      }
    } catch {
      // Fallback local attempt id
      const fallbackId = `att-exam-${Date.now()}`;
      router.push(`/${locale}/exam-practice/${exam.id}/attempt/${fallbackId}`);
    } finally {
      setStarting(false);
    }
  };

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        <p>Đang tải thông tin đề thi...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 pointer-events-auto">
      {/* Back Link */}
      <Link
        href={`/${locale}/exam-practice`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh sách đề thi</span>
      </Link>

      {/* Header Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/30 backdrop-blur-2xl shadow-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="teal" className="text-xs font-extrabold uppercase px-3 py-1">
            {exam.type} • {exam.difficulty}
          </Badge>
          {exam.isOfficialMock && (
            <Badge variant="amber" className="text-xs font-bold">
              Chuẩn Format Quốc Tế
            </Badge>
          )}
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white leading-tight">
            {exam.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {exam.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Thời lượng: <strong className="text-white">{exam.durationMinutes} phút</strong></span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>Tổng số câu: <strong className="text-white">{exam.totalQuestions} câu</strong></span>
          </div>
          {exam.maxScore && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span>Thang điểm: <strong className="text-purple-300">{exam.maxScore}</strong></span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section Structure Overview */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="font-display font-bold text-lg text-white">
          Cấu Trúc Các Phần Thi ({exam.sections.length} phần)
        </h3>

        <div className="space-y-3">
          {exam.sections.map((sec, idx) => (
            <div
              key={sec.id}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="font-display font-extrabold text-sm text-white">
                  Phần {idx + 1}: {sec.title}
                </span>
                <span className="text-xs text-slate-400 block">
                  Kỹ năng: <strong className="text-teal-400 capitalize">{sec.type}</strong> • {sec.questions.length} câu hỏi
                </span>
              </div>

              <Badge variant="teal" className="text-xs font-mono">
                {sec.durationMinutes} phút
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Rules & Instructions Card */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-3 text-xs text-slate-300">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Quy chế phòng thi trực tuyến:</span>
        </div>
        <ul className="space-y-1.5 list-disc list-inside leading-relaxed text-slate-300">
          <li>Đồng hồ bấm giờ sẽ đếm ngược ngay sau khi nhấn "Bắt đầu thi".</li>
          <li>Bạn có thể nhảy qua lại giữa các câu hỏi bất kỳ lúc nào bằng Question Navigator.</li>
          <li>Hệ thống lưu câu trả lời tự động. Khi hết giờ, bài thi sẽ được nộp tự động.</li>
          <li>Kết quả phân tích chi tiết, biểu đồ điểm yếu và từ vựng sẽ hiển thị sau khi nộp bài.</li>
        </ul>
      </div>

      {/* CTA Start Exam */}
      <div className="flex justify-center pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowConfirmModal(true)}
          icon={<Play className="w-4 h-4" />}
          className="px-8 py-4 text-base font-extrabold shadow-xl"
        >
          Bắt Đầu Làm Bài Thi
        </Button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-slate-900 border border-teal-500/40 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <h3 className="font-display font-extrabold text-xl text-white">
              Sẵn sàng vào phòng thi?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thời gian làm bài là <strong>{exam.durationMinutes} phút</strong>. Hãy chuẩn bị tai nghe và không gian yên tĩnh trước khi bắt đầu.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowConfirmModal(false)} disabled={starting}>
                Quay lại
              </Button>
              <Button
                variant="primary"
                onClick={handleStartAttempt}
                disabled={starting}
                icon={<Play className="w-4 h-4" />}
              >
                {starting ? 'Đang khởi tạo...' : 'Bắt đầu ngay'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
