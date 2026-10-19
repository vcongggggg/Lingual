import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-500">
      {/* Animated Logo Spinner */}
      <div className="relative">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-coral-500 via-amber-500 to-teal-400 p-0.5 shadow-lg shadow-coral-500/20 animate-pulse">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        <div className="absolute -inset-4 rounded-[36px] bg-teal-400/10 animate-ping pointer-events-none" style={{ animationDuration: '2s' }} />
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-display font-extrabold text-white">
          Đang tải...
        </h2>
        <p className="text-sm text-slate-400 font-medium">
          LinguaFlow đang chuẩn bị nội dung cho bạn
        </p>
      </div>

      {/* Skeleton Bars */}
      <div className="w-full max-w-md space-y-3 px-4">
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-teal-500/30 to-teal-500/10 rounded-full animate-pulse" />
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-amber-500/30 to-amber-500/10 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-coral-500/30 to-coral-500/10 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
