import React, { useState } from 'react';
import { 
  History, Download, Trash2, Play, ExternalLink, 
  Sparkles, Music, ShieldCheck, Search, Film
} from 'lucide-react';
import { DownloadHistoryItem } from '../types';
import { getPlatformBadge } from '../utils/platformDetector';

interface DownloadHistoryViewProps {
  history: DownloadHistoryItem[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  isArabic: boolean;
}

export const DownloadHistoryView: React.FC<DownloadHistoryViewProps> = ({
  history,
  onClearHistory,
  onDeleteItem,
  isArabic,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredItems = history.filter((item) => {
    if (filter === 'ai' && !item.title.includes('AI Enhanced')) return false;
    if (filter === 'audio' && item.format !== 'mp3') return false;
    if (filter === 'video' && item.format === 'mp3') return false;
    if (search.trim() && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (history.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-white/5 p-8 max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
          <History className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">
          {isArabic ? 'سجل التنزيلات والتحسين فارغ' : 'No Download History Yet'}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
          {isArabic 
            ? 'الفيديوهات والمقاطع الصوتية التي تقوم بتنزيلها أو تحسين جودتها ستظهر هنا لسهولة الوصول إليها وإعادة تنزيلها لاحقاً.'
            : 'Any videos you download or enhance with AI will be safely listed here for quick retrieval.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 font-black">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">
              {isArabic ? 'سجل التنزيلات والتحسين المحفوظ' : 'Download & AI Enhancement History'}
            </h2>
            <p className="text-xs text-slate-400">
              {history.length} {isArabic ? 'عنصر مسجل محلياً' : 'items stored'}
            </p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{isArabic ? 'مسح السجل بالكامل' : 'Clear All History'}</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: isArabic ? 'الكل' : 'All' },
            { id: 'video', label: isArabic ? 'فيديوهات' : 'Videos' },
            { id: 'ai', label: isArabic ? '✨ محسن بالذكاء الاصطناعي' : '✨ AI Enhanced' },
            { id: 'audio', label: isArabic ? '🎵 مقاطع صوتية MP3' : '🎵 Audio MP3' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 w-full sm:w-64 text-xs">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isArabic ? 'بحث في السجل...' : 'Search history...'}
            className="w-full bg-transparent text-white focus:outline-none"
          />
        </div>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const badge = getPlatformBadge(item.platform);
          return (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${badge.color}`}>
                      {badge.name}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-amber-400">
                    {item.format.toUpperCase()}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-1 flex items-center justify-between">
                    <span>{item.quality}</span>
                    <span>{item.fileSize}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-[10px] text-slate-500 font-mono">{item.downloadDate}</span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={item.downloadUrl}
                    download={`${item.title}.${item.format}`}
                    className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black transition-all"
                    title={isArabic ? 'إعادة التنزيل' : 'Re-download'}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-all"
                    title={isArabic ? 'حذف من السجل' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
