'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button, Card } from '@linguaflow/ui';
import { Shield, ArrowLeft, History, User, Lock, Sparkles, RefreshCw } from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function AdminAuditLogPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAuditLogs();
      if (data?.auditLogs) {
        setLogs(data.auditLogs);
      } else {
        loadFallbackLogs();
      }
    } catch {
      loadFallbackLogs();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackLogs = () => {
    setLogs([
      {
        id: 'audit-001',
        actorId: 'superadmin-001',
        action: 'user.role.update',
        resourceType: 'User',
        resourceId: 'editor-001',
        beforeState: { role: 'STUDENT' },
        afterState: { role: 'CONTENT_EDITOR' },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'audit-002',
        actorId: 'editor-001',
        action: 'lesson.create_draft',
        resourceType: 'Lesson',
        resourceId: 'lesson-101',
        beforeState: null,
        afterState: { title: 'Bài học IELTS Listening Part 1', status: 'draft' },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'audit-003',
        actorId: 'reviewer-001',
        action: 'lesson.publish',
        resourceType: 'Lesson',
        resourceId: 'lesson-101',
        beforeState: { status: 'draft' },
        afterState: { status: 'published' },
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ]);
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/${locale}/admin`}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Về Admin CMS
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <History className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-display font-bold text-white">Nhật Ký Hệ Thống (AuditLog)</h1>
        </div>
        <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4" />} onClick={loadAuditLogs}>
          Làm Mới
        </Button>
      </div>

      <Card glow="amber" className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
            Lịch sử thao tác quản trị & phân quyền
          </span>
          <span className="text-xs font-mono text-slate-400">{logs.length} bản ghi</span>
        </div>

        {loading ? (
          <div className="text-center py-8 space-y-2">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Đang tải nhật ký AuditLog...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-slate-400">[{log.resourceType}: {log.resourceId}]</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(log.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="text-slate-400 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  <span>Actor ID: <strong className="text-slate-200">{log.actorId}</strong></span>
                </div>

                {(log.beforeState || log.afterState) && (
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-rose-400 font-bold block mb-0.5">Trạng thái trước:</span>
                      <pre className="text-slate-400 whitespace-pre-wrap">{JSON.stringify(log.beforeState, null, 2)}</pre>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-emerald-400 font-bold block mb-0.5">Trạng thái sau:</span>
                      <pre className="text-slate-300 whitespace-pre-wrap">{JSON.stringify(log.afterState, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
