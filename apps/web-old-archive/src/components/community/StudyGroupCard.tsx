'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Trophy, Shield, ArrowRight } from 'lucide-react';
import { StudyGroup } from '@linguaflow/domain';
import { Badge, Button } from '@linguaflow/ui';

interface StudyGroupCardProps {
  group: StudyGroup;
  isMember?: boolean;
  onJoin?: () => void;
  locale?: string;
  className?: string;
}

export default function StudyGroupCard({
  group,
  isMember = false,
  onJoin,
  locale = 'vi',
  className = '',
}: StudyGroupCardProps) {
  const isVi = locale === 'vi';

  return (
    <div className={`p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-lg hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-4 ${className}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="teal" className="text-[10px] font-extrabold uppercase px-2.5 py-0.5">
            {group.topic} • {group.level}
          </Badge>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>{group.memberCount}/{group.maxMembers}</span>
          </span>
        </div>

        <div className="space-y-1">
          <Link href={`/${locale}/community/groups/${group.id}`} className="block group">
            <h3 className="font-display font-extrabold text-lg text-white group-hover:text-teal-300 transition-colors leading-snug">
              {group.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
            {group.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-amber-300 font-mono font-bold pt-1">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{group.totalGroupXP.toLocaleString()} Group XP</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
        <Link
          href={`/${locale}/community/groups/${group.id}`}
          className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
        >
          <span>{isVi ? 'Xem thảo luận' : 'View Group'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {isMember ? (
          <Badge variant="teal" className="text-xs py-1 px-3">
            {isVi ? 'Đã tham gia' : 'Joined'}
          </Badge>
        ) : onJoin ? (
          <Button variant="primary" size="sm" onClick={onJoin}>
            {isVi ? 'Gia nhập' : 'Join'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
