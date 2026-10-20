'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="card-paper p-6 bg-card border-2 border-ink rounded-3xl shadow-brutal text-center space-y-3 py-8">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-red/10 border-2 border-red flex items-center justify-center text-red">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-ink">
            {this.props.fallbackTitle || 'Không thể hiển thị khu vực này'}
          </h3>
          <p className="text-xs text-ink-muted max-w-md mx-auto">
            {this.props.fallbackMessage || 'Đã xảy ra sự cố khi tải nội dung. Hãy thử bấm nút bên dưới để khôi phục.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="btn btn-paper text-xs font-black px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
