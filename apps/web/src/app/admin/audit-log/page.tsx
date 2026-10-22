'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShieldCheck,
  Search,
  Filter,
  FileText,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { api, getAuthToken } from '../../../lib/api';
import { LingLing } from '../../../components/ui/LingLing';

interface AuditLogRecord {
  id: string;
  action: string;
  actionLabel: string;
  actor: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING';
  details: string;
  beforeState?: string;
  afterState?: string;
}

const ALLOWED_AUDIT_LOG_ROLES = ['ADMIN', 'SUPER_ADMIN'];

export default function AdminAuditLogPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted && !isAuthorized) {
        window.location.replace('/login');
      }
    }, 2500);

    async function checkAuthAndFetchLogs() {
      try {
        const token = getAuthToken();
        const hasCookie = typeof document !== 'undefined' && document.cookie.includes('access_token');
        if (!token && !hasCookie) {
          if (isMounted) {
            window.location.replace('/login');
          }
          return;
        }

        const mePromise = api.getMe();
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Auth check timeout')), 2200)
        );

        const meRes = await Promise.race([mePromise, timeoutPromise]) as any;
        if (!isMounted) return;

        if (!meRes || !meRes.user) {
          window.location.replace('/login');
          return;
        }

        const currentUser = meRes.user;
        if (!currentUser.role || !ALLOWED_AUDIT_LOG_ROLES.includes(currentUser.role)) {
          if (isMounted) {
            setIsAuthorized(false);
            setAuthError('Bạn không có quyền truy cập nhật ký kiểm toán. Đang chuyển hướng về Bảng điều khiển...');
            setTimeout(() => {
              window.location.replace('/dashboard');
            }, 1000);
          }
          return;
        }

        clearTimeout(timeoutId);
        setUser(currentUser);
        setIsAuthorized(true);

        try {
          const res = await api.getAuditLogs();
          if (isMounted) {
            if (res && res.auditLogs && Array.isArray(res.auditLogs)) {
              // Map real DB audit logs to view records
              const mapped: AuditLogRecord[] = res.auditLogs.map((item: any, idx: number) => ({
                id: item.id || `LOG-${9000 + idx}`,
                action: item.action || 'system.event',
                actionLabel: item.action?.replace('.', ' ') || 'Sự kiện hệ thống',
                actor: item.actor || item.userId || 'Admin',
                resourceType: item.resourceType || 'Resource',
                resourceId: item.resourceId || 'ID-001',
                timestamp: item.createdAt ? new Date(item.createdAt).toISOString().replace('T', ' ').slice(0, 19) : '2026-10-17 12:00:00',
                status: 'SUCCESS',
                details: item.details || `Hoạt động ghi nhận trên ${item.resourceType || 'hệ thống'}`,
                beforeState: item.beforeState ? JSON.stringify(item.beforeState) : undefined,
                afterState: item.afterState ? JSON.stringify(item.afterState) : undefined,
              }));
              setLogs(mapped);
            } else {
              setLogs([]);
            }
          }
        } catch (err) {
          console.error('Error fetching audit logs:', err);
          if (isMounted) {
            setLogs([]);
          }
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        // Chưa đăng nhập hoặc timeout -> chuyển hướng về /login
        if (isMounted) {
          window.location.replace('/login');
        }
      }
    }

    checkAuthAndFetchLogs();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [router, isAuthorized]);

  const filterOptions = [
    { key: 'ALL', label: 'Tất cả nhật ký' },
    { key: 'lesson', label: 'Bài học & Unit' },
    { key: 'vocabulary', label: 'Từ vựng' },
    { key: 'ielts_question', label: 'Đề thi' },
    { key: 'system', label: 'Cấu hình hệ thống' },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = selectedFilter === 'ALL' || log.action.startsWith(selectedFilter);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      log.actionLabel.toLowerCase().includes(q) ||
      log.actor.toLowerCase().includes(q) ||
      log.resourceId.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  if (loading || !user || !isAuthorized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
        <LingLing reaction={authError ? "crying" : "studying"} size={80} />
        <div className="text-sm font-black font-mono text-ink animate-pulse text-center max-w-md">
          {authError || 'Đang xác thực quyền truy cập nhật ký...'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 pb-28 sm:pb-20 text-left">
      {/* Breadcrumb text mực */}
      <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <Link
          href="/admin"
          className="hover:text-red transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Quản trị nội dung</span>
        </Link>
        <span>/</span>
        <span className="text-ink">Nhật ký hệ thống (Audit Log)</span>
      </div>

      {/* Header bar Sổ Ghi Chép Nhật Ký Hệ Thống */}
      <div className="bg-card border-2 border-ink rounded-3xl p-6 sm:p-8 shadow-brutal-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-paper-2 border border-ink rounded-full text-xs font-black uppercase tracking-wider text-teal">
            <Lock className="w-3.5 h-3.5" />
            <span>Sổ Ghi Chép Bất Biến</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-sans">
            Nhật ký hệ thống (Audit Log)
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft font-sans">
            Ghi nhận toàn bộ thao tác xuất bản bài học, thêm từ vựng, sửa câu hỏi và thay đổi cấu hình bảo mật trên hệ thống.
          </p>
        </div>

        <div className="flex flex-col items-center flex-shrink-0">
          <div className="speech-bubble speech-bubble-bottom mb-2 text-xs font-black text-ink">
            Ghi chép minh bạch & chuẩn xác!
          </div>
          <LingLing reaction="salute" size={105} />
        </div>
      </div>

      {/* Thanh Tìm Kiếm & Lọc Giấy */}
      <div className="bg-card border-2 border-ink rounded-2xl p-4 sm:p-5 shadow-brutal space-y-3">
        <div className="flex items-center gap-3 bg-paper border-2 border-ink rounded-xl px-3.5 py-2">
          <Search className="w-4 h-4 text-ink-muted flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo người thực hiện, mã tài nguyên, hành động..."
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-bold text-ink placeholder:text-ink-muted"
          />
        </div>

        {/* Chip bộ lọc cuộn ngang trên mobile */}
        <div className="w-full overflow-x-auto pb-1 scrollbar-none">
          <div className="min-w-max flex items-center gap-2">
            <span className="text-[11px] font-black uppercase text-ink-muted mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Lọc sổ:
            </span>
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSelectedFilter(opt.key)}
                className={`text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  selectedFilter === opt.key
                    ? 'bg-ink text-paper border-ink shadow-brutal-sm'
                    : 'bg-paper text-ink border-ink/30 hover:border-ink'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danh Sách Nhật Ký Hệ Thống Dạng Sổ Ghi Chép */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-black text-ink uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-red" />
            <span>Dòng sự kiện được ghi nhận ({filteredLogs.length} bản ghi)</span>
          </h2>
          <span className="text-xs font-mono font-bold text-ink-muted">
            CHUẨN BẢO MẬT OWASP A10
          </span>
        </div>

        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="card-paper p-12 text-center text-ink-muted text-sm font-bold bg-card border-2 border-ink rounded-2xl shadow-brutal-sm">
              Không có bản ghi nhật ký kiểm toán nào được tìm thấy.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div
                  key={log.id}
                  className="bg-card border-2 border-ink rounded-2xl p-4 sm:p-5 shadow-brutal-sm hover:shadow-brutal transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-ink bg-paper-2 px-2 py-0.5 rounded border border-ink/20">
                          {log.timestamp}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-ink-muted">
                          [{log.id}]
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-teal/15 text-teal border border-teal/30">
                          {log.actionLabel}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm font-black text-ink">
                        {log.details}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                        <span className="flex items-center gap-1 font-bold text-ink">
                          <User className="w-3.5 h-3.5 text-red" />
                          {log.actor}
                        </span>
                        <span>·</span>
                        <span className="font-mono text-xs text-ink-muted">
                          Tài nguyên: <strong className="text-ink">{log.resourceId}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="text-xs font-black px-3 py-1.5 rounded-lg border border-ink bg-paper hover:bg-paper-2 transition-colors cursor-pointer"
                      >
                        {isExpanded ? 'Thu gọn' : 'Xem chi tiết trước/sau'}
                      </button>
                    </div>
                  </div>

                  {/* Khối Trước / Sau khi mở rộng (Before/After State) */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t-2 border-ink/15 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs animate-in fade-in duration-150">
                      <div className="p-3 bg-paper border border-ink/20 rounded-xl space-y-1">
                        <span className="text-[10px] font-black uppercase text-amber block">
                          Trạng thái trước (Before State):
                        </span>
                        <pre className="font-mono text-[11px] text-ink-soft overflow-x-auto whitespace-pre-wrap">
                          {log.beforeState || 'null'}
                        </pre>
                      </div>

                      <div className="p-3 bg-paper border border-ink/20 rounded-xl space-y-1">
                        <span className="text-[10px] font-black uppercase text-teal block">
                          Trạng thái sau (After State):
                        </span>
                        <pre className="font-mono text-[11px] text-ink overflow-x-auto whitespace-pre-wrap font-bold">
                          {log.afterState || 'null'}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
