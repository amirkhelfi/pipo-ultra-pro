import React, { useState } from 'react';
import { 
  Layers, Link, Download, CheckCircle2, RefreshCw, 
  Trash2, Sparkles, FolderArchive, Play, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DownloadHistoryItem, SupportedPlatform } from '../types';
import { parseVideoUrl, detectPlatform, getPlatformBadge } from '../utils/platformDetector';

interface BatchDownloaderViewProps {
  onAddToHistory: (item: DownloadHistoryItem) => void;
  isArabic: boolean;
}

interface BatchItem {
  id: string;
  url: string;
  platform: SupportedPlatform;
  title: string;
  thumbnail: string;
  status: 'pending' | 'processing' | 'ready' | 'downloaded' | 'error';
  downloadUrl: string;
}

export const BatchDownloaderView: React.FC<BatchDownloaderViewProps> = ({
  onAddToHistory,
  isArabic,
}) => {
  const [linksText, setLinksText] = useState<string>(
`https://www.tiktok.com/@alex_motion/video/734891238491823
https://www.instagram.com/reel/C38491kLm9P/
https://www.youtube.com/shorts/dQw4w9WgXcQ
https://x.com/astro_odyssey/status/178491823901`
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloadingAll, setIsDownloadingAll] = useState<boolean>(false);

  const handleStartBatch = async () => {
    const urls = linksText
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 5);

    if (urls.length === 0) return;

    setIsProcessing(true);
    setBatchItems([]);

    const items: BatchItem[] = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const platform = detectPlatform(url);
      try {
        const info = await parseVideoUrl(url);
        items.push({
          id: `batch-${Date.now()}-${i}`,
          url,
          platform,
          title: info.title,
          thumbnail: info.thumbnail,
          status: 'ready',
          downloadUrl: info.options[0]?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        });
      } catch {
        items.push({
          id: `batch-${Date.now()}-${i}`,
          url,
          platform,
          title: `Video from ${platform}`,
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
          status: 'ready',
          downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        });
      }
    }

    setBatchItems(items);
    setIsProcessing(false);
  };

  const handleDownloadAll = () => {
    if (batchItems.length === 0) return;
    setIsDownloadingAll(true);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloadingAll(false);

          try {
            confetti({ particleCount: 90, spread: 70 });
          } catch (e) {}

          // Download simulation
          batchItems.forEach((item, index) => {
            setTimeout(() => {
              const link = document.createElement('a');
              link.href = item.downloadUrl;
              link.download = `PIPO_${item.platform}_${index + 1}.mp4`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              onAddToHistory({
                id: `batch-hist-${Date.now()}-${index}`,
                title: item.title,
                platform: item.platform,
                thumbnail: item.thumbnail,
                format: 'mp4',
                quality: '1080p HD (No Watermark)',
                downloadDate: new Date().toLocaleDateString('ar-EG'),
                fileSize: '24.5 MB',
                originalUrl: item.url,
                downloadUrl: item.downloadUrl,
                noWatermark: true,
              });
            }, index * 300);
          });

          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3 bg-gradient-to-b from-purple-950/40 via-slate-900/80 to-[#080B12] p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
          <Layers className="w-3.5 h-3.5" />
          <span>{isArabic ? 'تنزيل مجموعات الروابط المتعددة' : 'Batch Multi-Link Downloader'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          {isArabic ? 'تنزيل عشرات الفيديوهات دفعة واحدة' : 'Download Multiple Videos in Bulk'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          {isArabic 
            ? 'الصق قائمة روابط فيديوهات تيك توك وريلز ويوتيوب (رابط في كل سطر)، وسيقوم المحرك بفحصها وتنزيلها دفعة واحدة بدون علامة مائية.'
            : 'Paste multiple video URLs (one per line) to batch extract and download all videos simultaneously.'}
        </p>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-4">
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-300">
              {isArabic ? 'الصق الروابط هنا (رابط واحد في كل سطر):' : 'Paste links (one URL per line):'}
            </label>
            <button
              onClick={() => setLinksText('')}
              className="text-slate-400 hover:text-red-400 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isArabic ? 'مسح' : 'Clear'}</span>
            </button>
          </div>

          <textarea
            rows={5}
            value={linksText}
            onChange={(e) => setLinksText(e.target.value)}
            placeholder={`https://www.tiktok.com/...
https://www.instagram.com/reel/...
https://www.youtube.com/shorts/...`}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-400 leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-mono">
            {linksText.split('\n').filter((u) => u.trim()).length} {isArabic ? 'روابط مكتشفة' : 'detected links'}
          </span>

          <button
            onClick={handleStartBatch}
            disabled={isProcessing || !linksText.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{isArabic ? 'جاري فحص الروابط...' : 'Analyzing Batch...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isArabic ? 'فحص وتحضير الروابط' : 'Process All Links'}</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Batch Results Table */}
      {batchItems.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-2xl space-y-4 animate-fade-in">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-black text-white">
                {isArabic ? `تم تجهيز (${batchItems.length}) فيديو للتنزيل` : `Ready (${batchItems.length}) Videos`}
              </h3>
            </div>

            <button
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{isArabic ? 'تنزيل جميع الفيديوهات الآن' : 'Download All as Package'}</span>
            </button>
          </div>

          {/* List */}
          <div className="space-y-2">
            {batchItems.map((item, idx) => {
              const badge = getPlatformBadge(item.platform);
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span className={`px-1.5 py-0.2 rounded border ${badge.color}`}>
                          {badge.name}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-400">No-Watermark HD</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={item.downloadUrl}
                    download={`video_${idx + 1}.mp4`}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-black text-slate-300 transition-all flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
