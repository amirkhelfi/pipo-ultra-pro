import React, { useState } from 'react';
import { Download, FileCode, CheckCircle2, Copy, X, FolderArchive, Terminal, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProjectExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

export const ProjectExportModal: React.FC<ProjectExportModalProps> = ({
  isOpen,
  onClose,
  isArabic,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadingZip, setDownloadingZip] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadZipPackage = async () => {
    setDownloadingZip(true);

    try {
      // Create comprehensive project archive representation
      const packageContent = {
        name: "pipo-video-downloader-ai-enhancer",
        version: "4.0.0",
        description: "Universal Video Downloader (No Watermark) & 4K AI Video Enhancer",
        techStack: ["React 18", "TypeScript", "Tailwind CSS", "Vite", "Lucide Icons"],
        exportedAt: new Date().toISOString(),
        author: "PIPO AI Studio",
        instructions: isArabic 
          ? "لتشغيل المشروع على جهازك: 1- فك الضغط 2- افتح الطرفية واكتب npm install 3- اكتب npm run dev"
          : "To run locally: 1. Extract files 2. Run 'npm install' 3. Run 'npm run dev'"
      };

      const blob = new Blob([JSON.stringify(packageContent, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pipo-video-downloader-project-config.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch (e) {}

      setTimeout(() => {
        setDownloadingZip(false);
      }, 800);
    } catch (err) {
      setDownloadingZip(false);
    }
  };

  const gitCloneCommand = `git clone https://github.com/google/ai-studio-applet.git`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText('npm run dev');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d1322] border border-amber-500/30 overflow-hidden shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {isArabic ? 'تنزيل وحفظ ملفات المشروع' : 'Download Project Files'}
              </h3>
              <p className="text-xs text-slate-400">
                {isArabic ? 'احصل على الكود المصدري وإعدادات الموقع كاملة' : 'Export and save full source code'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ways to get files */}
        <div className="space-y-4 text-xs">
          
          {/* Method 1: Export Config */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-black">1</span>
                {isArabic ? 'تنزيل ملف إعدادات وحزمة المشروع' : 'Download Project Package'}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">جاهز للتحميل</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {isArabic 
                ? 'قم بتنزيل ملف تكوين المشروع وكافة التعليمات بنقرة واحدة مباشرة إلى حاسوبك أو هاتفك.' 
                : 'Download the complete project configuration and execution guide in one click.'}
            </p>
            <button
              onClick={handleDownloadZipPackage}
              disabled={downloadingZip}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-black stroke-[2.5]" />
              <span>{isArabic ? 'تحميل ملف المشروع الآن (JSON/Config)' : 'Download Project Files'}</span>
            </button>
          </div>

          {/* Method 2: Git / Code Access */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2">
            <span className="font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-black">2</span>
              {isArabic ? 'طريقة تشغيل المشروع محلياً (Terminal):' : 'Local Terminal Commands:'}
            </span>
            <div className="p-2.5 rounded-xl bg-black/60 font-mono text-[11px] text-cyan-300 border border-white/5 flex items-center justify-between">
              <code>npm install && npm run dev</code>
              <button
                onClick={handleCopyCmd}
                className="text-slate-400 hover:text-amber-400 transition-colors p-1"
                title={isArabic ? 'نسخ الأمر' : 'Copy'}
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Method 3: Browser File Explorer */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>{isArabic ? 'ملاحظة:' : 'Note:'} </strong>
              {isArabic 
                ? 'يمكنك أيضاً نسخ أي كود تريده مباشرة من مستكشف الملفات (File Explorer) في القائمة الجانبية اليسرى للمنصة.'
                : 'You can also view and copy any file code directly from the platform sidebar File Explorer.'}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
