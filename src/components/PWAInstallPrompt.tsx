import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  X, 
  Share, 
  PlusSquare, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Detect OS
    const ua = navigator.userAgent || '';
    const isIosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroidDevice = /Android/.test(ua);
    setIsIOS(isIosDevice);
    setIsAndroid(isAndroidDevice);

    // Listen for install prompt on Chrome / Android / Desktop
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallSuccess(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setInstallSuccess(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else if (isAndroid) {
      // Fallback instruction for Android
      alert('لتثبيت التطبيق على جهازك: اضغط على زر الخيارات (⋮) في أعلى المتصفح، ثم اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق".');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" id="pwa-install-modal">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-pwa-modal-btn"
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Download className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                PWA Web App
              </span>
              <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> تطبيق آمن
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">تثبيت تطبيق PIPO ULTRA</h3>
            <p className="text-xs text-slate-400">تثبيت الموقع كتطبيق أصلي في خلفية هاتفك</p>
          </div>
        </div>

        {/* Status / Success View */}
        {isInstalled || installSuccess ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center my-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white">التطبيق مثبت وجاهز على جهازك!</h4>
            <p className="text-xs text-slate-300 mt-2">
              يمكنك الآن فتح PIPO ULTRA من الشاشة الرئيسية لهاتفك واستخدامه مباشرة وسحب الفيديوهات في الخلفية.
            </p>
            <button
              onClick={onClose}
              className="mt-5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl text-sm transition-all"
            >
              تم، المتابعة إلى التطبيق
            </button>
          </div>
        ) : (
          <>
            {/* Features list */}
            <div className="grid grid-cols-2 gap-3 my-5">
              <div className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl flex items-start gap-2.5">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white">سحب وتنزيل فوري</h5>
                  <p className="text-[10px] text-slate-400">وصول مباشر بدون فتح المتصفح</p>
                </div>
              </div>
              <div className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl flex items-start gap-2.5">
                <Smartphone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white">يعمل في الخلفية</h5>
                  <p className="text-[10px] text-slate-400">تطبيق خفيف وسريع على الهاتف</p>
                </div>
              </div>
              <div className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white">تحسين 4K بالذكاء</h5>
                  <p className="text-[10px] text-slate-400">استوديو تحسين متكامل</p>
                </div>
              </div>
              <div className="p-3 bg-slate-800/60 border border-slate-700/50 rounded-xl flex items-start gap-2.5">
                <Layers className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white">تحديثات وإذاعة حية</h5>
                  <p className="text-[10px] text-slate-400">إشعارات فورية بالميزات الجديدة</p>
                </div>
              </div>
            </div>

            {/* iOS Specific Instructions */}
            {isIOS && (
              <div className="p-4 bg-slate-800/90 border border-amber-500/20 rounded-2xl mb-5 text-right">
                <h5 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> طريقة التثبيت على أجهزة iPhone / iPad:
                </h5>
                <ol className="text-xs text-slate-300 space-y-2 pr-4 list-decimal">
                  <li>
                    اضغط على زر المشاركة <Share className="w-3.5 h-3.5 inline text-blue-400 mx-1" /> في شريط متصفح Safari بالأسفل.
                  </li>
                  <li>
                    مرر للأسفل واضغط على <strong className="text-white">"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-300 mx-1" />.
                  </li>
                  <li>
                    اضغط على كلمة <strong className="text-amber-400">"إضافة" (Add)</strong> في أعلى الزاوية.
                  </li>
                </ol>
              </div>
            )}

            {/* Main Action Button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleInstallClick}
                id="execute-pwa-install-btn"
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 text-base transition-all transform active:scale-95"
              >
                <Download className="w-5 h-5" />
                تثبيت تطبيق PIPO على الهاتف الآن
              </button>

              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                تطبيق PWA أصلي خفيف وآمن 100% بدون أي إعلانات مزعجة
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
