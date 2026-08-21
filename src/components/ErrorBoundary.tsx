import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isClearing: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isClearing: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isClearing: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled UI Exception caught by ErrorBoundary:', error, errorInfo);
  }

  public handleHardReset = async (): Promise<void> => {
    this.setState({ isClearing: true });
    try {
      localStorage.clear();
      sessionStorage.clear();

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }

      window.location.href = window.location.origin + '?cache_bust=' + Date.now();
    } catch (e) {
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070A11] text-slate-100 flex items-center justify-center p-4 font-['Cairo',sans-serif]" dir="rtl">
          <div className="max-w-md w-full bg-slate-900/90 border border-red-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">
                تم رصد خطأ مؤقت في المتصفح
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                حدث تعارض في ذاكرة التخزين المؤقتة القديمة أو ملفات المتصفح المخزنة مسبقاً.
              </p>
            </div>

            <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 text-left text-[11px] text-red-300 font-mono overflow-x-auto max-h-24">
              {this.state.error?.message || 'Unknown runtime render state'}
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={this.handleHardReset}
                disabled={this.state.isClearing}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {this.state.isClearing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري تنظيف الذاكرة وإعادة التشغيل...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>إصلاح تلقائي وتحديث الموقع فوراً</span>
                  </>
                )}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-white/10 transition-all"
              >
                إعادة تحميل الصفحة فقط
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
