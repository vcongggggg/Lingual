'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';
import { RotateCcw, Home, AlertCircle } from 'lucide-react';
import { LingLing } from './LingLing';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RoadmapErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RoadmapErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto my-12 px-4 text-center">
          <div className="bg-card border-4 border-ink rounded-3xl p-8 sm:p-10 shadow-brutal-xl relative overflow-hidden">
            {/* Nẹp gáy sổ trang trí */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-red border-b-2 border-ink" />

            <div className="flex justify-center mb-6 pt-2">
              <LingLing reaction="sad" size={120} animate={true} />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-soft border-2 border-ink rounded-full text-xs font-black uppercase tracking-wider text-ink mb-4">
              <AlertCircle className="w-4 h-4 text-red" />
              <span>Gặp sự cố tải trang</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-ink mb-3 font-sans">
              {this.props.fallbackTitle || 'Trang sổ tay Lộ trình gặp trục trặc nhỏ'}
            </h2>

            <p className="text-xs sm:text-sm text-ink-soft mb-8 leading-relaxed max-w-lg mx-auto font-sans">
              Hiệu ứng cuộn trang tạm thời gặp sự cố hiển thị. Dữ liệu tiến độ học của bạn vẫn được lưu trữ an toàn. Vui lòng bấm nút bên dưới để tải lại trang.
            </p>

            {this.state.error && process.env.NODE_ENV !== 'production' && (
              <div className="mb-6 p-4 rounded-xl bg-paper-2 border-2 border-dashed border-red/40 text-left font-mono text-xs text-red overflow-auto max-h-40">
                <p className="font-bold mb-1">[Dev Error Details]:</p>
                <p>{this.state.error.name}: {this.state.error.message}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto btn btn-red text-sm font-black shadow-brutal px-6 py-3 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tải lại trang</span>
              </button>

              <Link
                href="/dashboard"
                className="w-full sm:w-auto btn btn-outline text-sm font-black shadow-brutal px-6 py-3 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Về Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
