import React from 'react';
import { MainAppTab } from '../types';
import { 
  Download, Sparkles, Music, Layers, History, Bot, 
  Globe, ShieldCheck, Zap, ArrowDownToLine, Flame, FolderArchive
} from 'lucide-react';

interface NavbarProps {
  activeTab: MainAppTab;
  setActiveTab: (tab: MainAppTab) => void;
  isArabic: boolean;
  setIsArabic: (val: boolean) => void;
  historyCount: number;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isArabic,
  setIsArabic,
  historyCount,
  onOpenExportModal,
}) => {
  const tabs = [
    {
      id: 'downloader' as MainAppTab,
      label: isArabic ? 'تنزيل الفيديوهات' : 'Video Downloader',
      sublabel: isArabic ? 'بدون علامة مائية' : 'No Watermark',
      icon: Download,
      accent: 'text-amber-400',
    },
    {
      id: 'enhancer' as MainAppTab,
      label: isArabic ? 'تحسين الجودة بالذكاء الاصطناعي' : 'AI Video Enhancer',
      sublabel: isArabic ? '4K 60FPS AI' : 'Super Resolution',
      icon: Sparkles,
      accent: 'text-cyan-400',
      badge: 'PRO 4K',
    },
    {
      id: 'audio-extractor' as MainAppTab,
      label: isArabic ? 'استخراج الصوت MP3' : 'Audio Extractor',
      sublabel: isArabic ? '320kbps Studio' : 'High Quality',
      icon: Music,
      accent: 'text-emerald-400',
    },
    {
      id: 'batch' as MainAppTab,
      label: isArabic ? 'تنزيل متعدد (Batch)' : 'Batch Download',
      sublabel: isArabic ? 'روابط متعددة' : 'Bulk URLs',
      icon: Layers,
      accent: 'text-purple-400',
    },
    {
      id: 'history' as MainAppTab,
      label: isArabic ? 'السجل' : 'History',
      sublabel: `${historyCount} ${isArabic ? 'عنصر' : 'items'}`,
      icon: History,
      accent: 'text-rose-400',
    },
    {
      id: 'ai-assistant' as MainAppTab,
      label: isArabic ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant',
      sublabel: isArabic ? 'تحليل وهاشتاجات' : 'Video Analyzer',
      icon: Bot,
      accent: 'text-amber-400',
      badge: 'AI',
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080B12]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      {/* Top micro-bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-amber-500/10 border-b border-white/5 py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-amber-400">
              <Zap className="w-3.5 h-3.5" />
              {isArabic ? 'محرك PIPO ULTRA AI v4.0 الخارق: تنزيل فائق السرعة + رفع دقة 4K' : 'PIPO ULTRA AI Engine v4.0: Ultra-Fast No-Watermark & 4K AI Upscaling'}
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">
              {isArabic ? 'يدعم: TikTok • Instagram • YouTube • Facebook • X (Twitter) • Pinterest' : 'Supports: TikTok • Instagram • YouTube • Facebook • X • Pinterest'}
            </span>
          </div>

            {/* Language & Export Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenExportModal}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all font-bold text-[11px]"
                title={isArabic ? 'تنزيل ملفات المشروع' : 'Download Project Files'}
              >
                <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
                <span>{isArabic ? 'تنزيل ملفات الموقع' : 'Export Files'}</span>
              </button>

              <button
                onClick={() => setIsArabic(!isArabic)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all font-mono text-[11px]"
              >
                <Globe className="w-3 h-3 text-amber-400" />
                <span>{isArabic ? 'English' : 'عربي'}</span>
              </button>
            </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Logo & Branding */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => setActiveTab('downloader')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-cyan-400 p-[2px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center">
                  <ArrowDownToLine className="w-6 h-6 text-amber-400 group-hover:animate-bounce" />
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-[#090D16] animate-ping" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                    <span>PIPO</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-400 font-extrabold">ULTRA PRO</span>
                  </h1>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    AI HD
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate max-w-[280px] sm:max-w-md">
                  {isArabic 
                    ? 'تنزيل الفيديوهات بدون علامة مائية + تحسين الجودة 4K' 
                    : 'No-Watermark Downloader & 4K AI Video Enhancer'}
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                onClick={() => setActiveTab('enhancer')}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>4K AI</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-white border border-amber-500/40 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? tab.accent : 'text-slate-400'}`} />
                  <span className="font-semibold">{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>
      </div>
    </header>
  );
};
