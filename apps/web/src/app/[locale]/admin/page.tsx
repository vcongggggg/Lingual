'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button, Card } from '@linguaflow/ui';
import { Shield, Plus, BookOpen, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { SEED_UNITS } from '../../../../../../prisma/seed';

export default function AdminCMSPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const [units, setUnits] = useState(SEED_UNITS);
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [targetText, setTargetText] = useState('');
  const [translation, setTranslation] = useState('');
  const [phonetic, setPhonetic] = useState('');

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetText || !translation) return;

    const newWord = {
      targetText,
      translation,
      phonetic,
      exampleSentence: `${targetText} is useful.`,
      exampleTranslation: `${translation} rất hữu ích.`,
      cefrLevel: 'A1',
    };

    const updatedUnits = [...units];
    updatedUnits[0].lessons[0].words.push(newWord as any);
    setUnits(updatedUnits);

    setTargetText('');
    setTranslation('');
    setPhonetic('');
    setShowAddWordModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <Link href={`/${locale}/dashboard`}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Về Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-display font-bold text-white">Admin Content CMS</h1>
        </div>
        <Button variant="accent" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddWordModal(true)}>
          Thêm Từ Vựng Mới
        </Button>
      </div>

      <div className="space-y-6">
        {units.map((unit) => (
          <Card key={unit.order} glow="teal" className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <h3 className="text-lg font-display font-bold text-white">{unit.title}</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{unit.lessons.length} Bài học</span>
            </div>

            <div className="space-y-3">
              {unit.lessons.map((lesson) => (
                <div key={lesson.order} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-200">{lesson.title}</h4>
                    <p className="text-xs text-slate-400">{lesson.words.length} Từ vựng • {lesson.exercises.length} Bài tập trắc nghiệm</p>
                  </div>
                  <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                    +{lesson.xpReward} XP
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {showAddWordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-teal-500/30 p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-display font-bold text-white">Thêm Từ Vựng Mới Vào Bài 1</h3>
            <form onSubmit={handleAddWord} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Từ Tiếng Anh (Target Text)</label>
                <input
                  type="text"
                  value={targetText}
                  onChange={(e) => setTargetText(e.target.value)}
                  placeholder="Vd: Apple"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:border-teal-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nghĩa Tiếng Việt (Translation)</label>
                <input
                  type="text"
                  value={translation}
                  onChange={(e) => setTranslation(e.target.value)}
                  placeholder="Vd: Quả táo"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:border-teal-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Phiên Âm IPA (Phonetic)</label>
                <input
                  type="text"
                  value={phonetic}
                  onChange={(e) => setPhonetic(e.target.value)}
                  placeholder="Vd: /ˈæp.əl/"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="secondary" size="md" className="flex-1" onClick={() => setShowAddWordModal(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="accent" size="md" className="flex-1">
                  Lưu Từ Vựng
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
