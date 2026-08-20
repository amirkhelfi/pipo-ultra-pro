import React, { useState, useEffect } from 'react';
import { MainAppTab, DownloadHistoryItem } from './types';
import { Navbar } from './components/Navbar';
import { VideoDownloaderView } from './components/VideoDownloaderView';
import { AIVideoEnhancerView } from './components/AIVideoEnhancerView';
import { AudioExtractorView } from './components/AudioExtractorView';
import { BatchDownloaderView } from './components/BatchDownloaderView';
import { DownloadHistoryView } from './components/DownloadHistoryView';
import { AIVideoAssistantModal } from './components/AIVideoAssistantModal';
import { DeveloperConsoleView } from './components/DeveloperConsoleView';
import { LiveBroadcastBanner } from './components/LiveBroadcastBanner';
import { BroadcastNotificationToast } from './components/BroadcastNotificationToast';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { 
  Download, Sparkles, ShieldCheck, Zap, ArrowDownToLine, 
  Layers, Music, Globe, CheckCircle2, Bot, Terminal
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainAppTab>('downloader');
  const [isArabic, setIsArabic] = useState<boolean>(true);
  
  // Shared state to pass downloaded video to AI Enhancer or Audio Extractor
  const [targetVideoUrl, setTargetVideoUrl] = useState<string>('');
  const [targetVideoTitle, setTargetVideoTitle] = useState<string>('');

  // Modals
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // Real-time visitor tracking and telemetry ping
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const screenResolution = `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio}x)`;
        const language = navigator.language || 'ar';
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        const referrer = document.referrer || 'Direct Entry';

        await fetch('/api/track-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            screenResolution,
            language,
            timeZone,
            activeTab,
            referrer
          })
        });
      } catch (err) {
        // Silent error
      }
    };

    trackVisitor();

    // Heartbeat every 30 seconds to maintain online telemetry status
    const heartbeatInterval = setInterval(async () => {
      try {
        await fetch('/api/track-visit/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activeTab })
        });
      } catch {
        // Silent error
      }
    }, 30000);

    return () => clearInterval(heartbeatInterval);
  }, [activeTab]);

  // Local storage history
  const [history, setHistory] = useState<DownloadHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('pipo_download_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'hist-demo-1',
        title: 'Trending Cyberpunk Cinematic Showcase #viral',
        platform: 'tiktok',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
        format: 'mp4',
        quality: '1080p HD (No Watermark)',
        downloadDate: new Date().toLocaleDateString('ar-EG'),
        fileSize: '24.8 MB',
        originalUrl: 'https://www.tiktok.com/@alex_motion/video/734891238491823',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        noWatermark: true,
      },
      {
        id: 'hist-demo-2',
        title: '✨ AI Enhanced: Switzerland Alps 4K 60FPS',
        platform: 'instagram',
        thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=80',
        format: 'mp4',
        quality: '4K 60FPS Ultra HD',
        downloadDate: new Date().toLocaleDateString('ar-EG'),
        fileSize: '84.2 MB',
        originalUrl: 'https://www.instagram.com/reel/C38491kLm9P/',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        noWatermark: true,
      }
    ];
  });

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pipo_download_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  const handleAddToHistory = (item: DownloadHistoryItem) => {
    setHistory(prev => [item, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(i => i.id !== id));
  };

  const handleSendToEnhancer = (url: string, title: string) => {
    setTargetVideoUrl(url);
    setTargetVideoTitle(title);
    setActiveTab('enhancer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendToAudioExtractor = (url: string, title: string) => {
    setTargetVideoUrl(url);
    setTargetVideoTitle(title);
    setActiveTab('audio-extractor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-[#070A11] text-slate-100 flex flex-col antialiased ${isArabic ? 'font-sans' : 'font-sans'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* Live Broadcast Header Ticker & Audio Player */}
      <LiveBroadcastBanner isArabic={isArabic} />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'ai-assistant') {
            setIsAIOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        isArabic={isArabic}
        setIsArabic={setIsArabic}
        historyCount={history.length}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        
        {activeTab === 'downloader' && (
          <VideoDownloaderView
            onSendToEnhancer={handleSendToEnhancer}
            onSendToAudioExtractor={handleSendToAudioExtractor}
            onAddToHistory={handleAddToHistory}
            isArabic={isArabic}
          />
        )}

        {activeTab === 'enhancer' && (
          <AIVideoEnhancerView
            initialVideoUrl={targetVideoUrl}
            initialTitle={targetVideoTitle}
            onAddToHistory={handleAddToHistory}
            isArabic={isArabic}
          />
        )}

        {activeTab === 'audio-extractor' && (
          <AudioExtractorView
            initialVideoUrl={targetVideoUrl}
            initialTitle={targetVideoTitle}
            onAddToHistory={handleAddToHistory}
            isArabic={isArabic}
          />
        )}

        {activeTab === 'batch' && (
          <BatchDownloaderView
            onAddToHistory={handleAddToHistory}
            isArabic={isArabic}
          />
        )}

        {activeTab === 'history' && (
          <DownloadHistoryView
            history={history}
            onClearHistory={handleClearHistory}
            onDeleteItem={handleDeleteHistoryItem}
            isArabic={isArabic}
          />
        )}

        {activeTab === 'dev-console' && (
          <DeveloperConsoleView
            isArabic={isArabic}
          />
        )}

      </main>

      {/* Floating AI Assistant & Dev Trigger */}
      <div className={`fixed bottom-6 ${isArabic ? 'left-6' : 'right-6'} z-30 flex items-center gap-2`}>
        <button
          onClick={() => setActiveTab('dev-console')}
          className="p-3 rounded-full bg-slate-900 border border-amber-500/40 text-amber-400 font-extrabold shadow-2xl hover:scale-110 active:scale-95 transition-all"
          title={isArabic ? 'لوحة تحكم المطور' : 'Developer Super-Console'}
        >
          <Terminal className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsAIOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-500 text-black font-extrabold text-xs shadow-2xl shadow-cyan-500/30 hover:scale-110 active:scale-95 transition-all group"
        >
          <Sparkles className="w-4 h-4 text-black group-hover:animate-spin" />
          <span>{isArabic ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'}</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#05070c] py-8 px-4 mt-16 text-center text-xs text-slate-500 space-y-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-black flex items-center justify-center font-black text-xs">
              P
            </div>
            <span className="font-bold text-white tracking-wide">PIPO ULTRA PRO</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-black">
              LIVE ENGINE v4.0
            </span>
            <span>• {isArabic ? 'تنزيل الفيديوهات الحقيقية بدون علامة مائية + تحسين الجودة 4K' : 'Real-time No-Watermark Downloader & 4K AI Enhancer'}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> {isArabic ? 'سحب حقيقي 100%' : '100% Real Extraction'}
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Sparkles className="w-4 h-4" /> {isArabic ? 'محرك 4K 60FPS AI' : '4K 60FPS AI Engine'}
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Zap className="w-4 h-4" /> {isArabic ? 'سرعة تنزيل فائقة' : 'Unlimited Speed'}
            </span>
          </div>

        </div>
      </footer>

      {/* AI Assistant Modal */}
      <AIVideoAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        isArabic={isArabic}
      />

      {/* PWA App Installation Prompt (تثبيت تطبيق PIPO في خلفية الهاتف) */}
      <PWAInstallPrompt
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Real-time In-App Broadcast Notification Toasts (إذاعة الإشعارات داخل الموقع) */}
      <BroadcastNotificationToast
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

    </div>
  );
}
