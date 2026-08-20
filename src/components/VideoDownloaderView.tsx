import React, { useState } from 'react';
import { 
  Download, Link, Clipboard, Sparkles, CheckCircle2, Play, Pause, 
  Volume2, VolumeX, Music, Image, Eye, ThumbsUp, Clock, Share2, 
  ShieldCheck, Zap, Layers, RefreshCw, AlertCircle, ArrowRight, ExternalLink, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoInfo, DownloadOption, SupportedPlatform, DownloadHistoryItem } from '../types';
import { parseVideoUrl, detectPlatform, getPlatformBadge, SAMPLE_POPULAR_URLS } from '../utils/platformDetector';

interface VideoDownloaderViewProps {
  onSendToEnhancer: (videoUrl: string, title: string) => void;
  onSendToAudioExtractor: (videoUrl: string, title: string) => void;
  onAddToHistory: (item: DownloadHistoryItem) => void;
  isArabic: boolean;
}

export const VideoDownloaderView: React.FC<VideoDownloaderViewProps> = ({
  onSendToEnhancer,
  onSendToAudioExtractor,
  onAddToHistory,
  isArabic,
}) => {
  const [urlInput, setUrlInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeDownloadOption, setActiveDownloadOption] = useState<DownloadOption | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Handle URL fetch
  const handleFetchVideo = async (targetUrl?: string) => {
    const urlToUse = (targetUrl || urlInput).trim();
    if (!urlToUse) {
      setErrorMessage(isArabic ? 'يرجى لصق رابط فيديو صحيح أولاً!' : 'Please paste a valid video URL first!');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setVideoInfo(null);

    try {
      // Simulate real neural network and media extraction
      await new Promise((r) => setTimeout(r, 650));
      const info = await parseVideoUrl(urlToUse);
      setVideoInfo(info);
      if (targetUrl) {
        setUrlInput(targetUrl);
      }
    } catch (err) {
      setErrorMessage(isArabic ? 'تعذر استخراج بيانات هذا الرابط. تأكد من صحة الرابط وحاول ثانية.' : 'Failed to extract video details. Check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Paste from clipboard
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text);
        handleFetchVideo(text);
      }
    } catch {
      // fallback
      const pasted = prompt(isArabic ? 'الصق رابط الفيديو هنا:' : 'Paste the video URL here:');
      if (pasted) {
        setUrlInput(pasted);
        handleFetchVideo(pasted);
      }
    }
  };

  // Trigger simulated high-speed download
  const handleStartDownload = (option: DownloadOption) => {
    setActiveDownloadOption(option);
    setIsDownloading(true);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          
          // Trigger Confetti
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            console.error(e);
          }

          // Trigger real browser download
          const link = document.createElement('a');
          link.href = option.url;
          link.download = `${videoInfo?.title || 'pipo_video'}_${option.quality}.${option.format}`;
          link.target = '_blank';
          link.rel = 'noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Add to History
          if (videoInfo) {
            onAddToHistory({
              id: `hist-${Date.now()}`,
              title: videoInfo.title,
              platform: videoInfo.platform,
              thumbnail: videoInfo.thumbnail,
              format: option.format,
              quality: option.quality,
              downloadDate: new Date().toLocaleDateString('ar-EG'),
              fileSize: option.size || '25 MB',
              originalUrl: videoInfo.url,
              downloadUrl: option.url,
              noWatermark: option.noWatermark,
            });
          }

          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const detectedCurrentPlatform = urlInput.trim() ? detectPlatform(urlInput) : null;
  const currentBadge = detectedCurrentPlatform ? getPlatformBadge(detectedCurrentPlatform) : null;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/90 via-[#0b101c] to-[#080B12] border border-white/10 p-6 sm:p-10 shadow-2xl">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>{isArabic ? 'تنزيل فائق السرعة بدون أي علامة مائية نهائياً' : 'Ultra-Fast 100% No-Watermark Downloader'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {isArabic ? (
              <>
                تنزيل الفيديوهات من <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400">جميع المواقع</span> بدون علامة مائية
              </>
            ) : (
              <>
                Download Videos from <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400">All Platforms</span> Without Watermark
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto font-normal">
            {isArabic 
              ? 'يدعم تنزيل الفيديوهات بدقة عالية من تيك توك، انستقرام، يوتيوب شورتس، فيسبوك، إكس (تويتر) مع إمكانية استخراج الصوت MP3 ورفع الجودة إلى 4K بالذكاء الاصطناعي.'
              : 'Download HD videos from TikTok, Instagram Reels, YouTube Shorts, Facebook, X (Twitter), Pinterest without watermark with 4K AI enhancement.'}
          </p>

          {/* URL Input Form */}
          <div className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFetchVideo();
              }}
              className="relative flex flex-col sm:flex-row items-center gap-2 bg-slate-950/80 p-2 sm:p-2.5 rounded-2xl border-2 border-amber-500/30 focus-within:border-amber-400 shadow-2xl transition-all"
            >
              <div className="flex items-center gap-2 w-full px-3 py-1">
                <Link className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={isArabic ? 'الصق رابط الفيديو هنا (مثال: https://www.tiktok.com/...)' : 'Paste video URL here (e.g. TikTok, Instagram, YouTube)...'}
                  className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none font-medium"
                />
                
                {currentBadge && (
                  <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold border ${currentBadge.color}`}>
                    {currentBadge.icon} {currentBadge.name}
                  </span>
                )}

                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all flex-shrink-0"
                  title={isArabic ? 'لصق من الحافظة' : 'Paste from clipboard'}
                >
                  <Clipboard className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{isArabic ? 'لصق' : 'Paste'}</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>{isArabic ? 'جاري الفحص...' : 'Extracting...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>{isArabic ? 'تنزيل الفيديو' : 'Download Now'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Demo URLs Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[11px]">
            <span className="text-slate-400 font-medium">{isArabic ? 'أو جرّب روابط تجريبية فورية:' : 'Or try instant demo clips:'}</span>
            {SAMPLE_POPULAR_URLS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleFetchVideo(sample.url)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-white/5 hover:border-amber-500/30 transition-all font-medium flex items-center gap-1"
              >
                <span>{sample.label}</span>
              </button>
            ))}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>
      </div>

      {/* Video Result Card & Download Options */}
      {videoInfo && (
        <div className="rounded-3xl bg-slate-900/80 border border-amber-500/30 p-4 sm:p-6 shadow-2xl space-y-6 animate-fade-in">
          
          {/* Header of the Result */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Video Preview Player Column */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 aspect-[9/16] sm:aspect-video lg:aspect-[9/14] shadow-lg group">
                <video
                  src={videoInfo.previewVideoUrl}
                  poster={videoInfo.thumbnail}
                  controls={false}
                  autoPlay={false}
                  loop
                  muted={isMuted}
                  className="w-full h-full object-cover"
                  ref={(ref) => {
                    if (ref) {
                      if (isPlayingPreview) {
                        ref.play().catch(() => {});
                      } else {
                        ref.pause();
                      }
                    }
                  }}
                />

                {/* Custom Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-3 opacity-90 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-white/10">
                      {videoInfo.duration || '00:45'}
                    </span>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-lg bg-black/60 text-white hover:text-amber-400 transition-all"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                      className="w-12 h-12 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                    >
                      {isPlayingPreview ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                  </div>

                  <div className="text-center text-[10px] text-slate-300 font-mono">
                    {isArabic ? 'معاينة الفيديو المباشرة' : 'Live Video Preview'}
                  </div>
                </div>
              </div>

              {/* Action: Send to AI Enhancer Button */}
              <button
                onClick={() => onSendToEnhancer(videoInfo.previewVideoUrl || '', videoInfo.title)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-cyan-200 animate-spin-slow" />
                <span>{isArabic ? 'تحسين جودة هذا الفيديو بالذكاء الاصطناعي 4K' : 'Enhance & Upscale to 4K with AI'}</span>
              </button>
            </div>

            {/* Video Details & Download Options */}
            <div className="flex-1 space-y-5">
              
              {/* Author & Meta */}
              <div className="space-y-2 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={videoInfo.author.avatar}
                      alt={videoInfo.author.name}
                      className="w-10 h-10 rounded-full border border-amber-500/40 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white">{videoInfo.author.name}</h3>
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <p className="text-xs text-slate-400">{videoInfo.author.username}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getPlatformBadge(videoInfo.platform).color}`}>
                    {getPlatformBadge(videoInfo.platform).icon} {getPlatformBadge(videoInfo.platform).name}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-slate-200 line-clamp-2 leading-relaxed">
                  {videoInfo.title}
                </h4>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
                  {videoInfo.views && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-amber-400" /> {videoInfo.views} {isArabic ? 'مشاهدة' : 'views'}
                    </span>
                  )}
                  {videoInfo.likes && (
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-rose-400" /> {videoInfo.likes} {isArabic ? 'إعجاب' : 'likes'}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> {isArabic ? 'بدون علامة مائية' : 'No Watermark'}
                  </span>
                </div>
              </div>

              {/* Download Options List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{isArabic ? 'خيارات وصيغ التنزيل المتاحة:' : 'Available Download Formats:'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {isArabic ? 'اختر الجودة المطلوبة' : 'Select preferred quality'}
                  </span>
                </h4>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Dedicated AI 4K Upscale & Enhance Option Card */}
                  <div className="p-3.5 rounded-2xl border bg-gradient-to-r from-cyan-950/70 via-blue-950/60 to-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/40 animate-pulse">
                        <Sparkles className="w-4 h-4 text-cyan-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{isArabic ? 'تحسين جودة هذا الفيديو بالذكاء الاصطناعي 4K' : 'AI 4K 60FPS Video Enhancer'}</span>
                          <span className="px-1.5 py-0.2 rounded bg-cyan-400 text-black text-[9px] font-black">
                            AI PRO ✨
                          </span>
                        </div>
                        <div className="text-[11px] text-cyan-200/80 flex items-center gap-2 pt-0.5 font-mono">
                          <span>4K UHD 60FPS</span>
                          <span>•</span>
                          <span>{isArabic ? 'ترميم تفاصيل + HDR' : 'Face Restore & HDR'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      <button
                        onClick={() => onSendToEnhancer(videoInfo.previewVideoUrl || (videoInfo.options?.[0]?.url) || '', videoInfo.title)}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black shadow-cyan-500/20 active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>{isArabic ? 'تحسين الآن' : 'Enhance Now'}</span>
                      </button>
                    </div>
                  </div>

                  {videoInfo.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        opt.isPopular
                          ? 'bg-amber-500/10 border-amber-500/40 shadow-md'
                          : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                          opt.format === 'mp3' 
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : opt.format === 'jpg'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {opt.format === 'mp3' ? <Music className="w-4 h-4" /> : opt.format === 'jpg' ? <Image className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{opt.label}</span>
                            {opt.isPopular && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black text-[9px] font-black">
                                {isArabic ? 'الموصى به ⭐' : 'POPULAR'}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5 font-mono">
                            <span>{opt.quality}</span>
                            <span>•</span>
                            <span>{opt.size}</span>
                            {opt.bitrate && (
                              <>
                                <span>•</span>
                                <span>{opt.bitrate}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center">
                        <button
                          onClick={() => handleStartDownload(opt)}
                          className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                            opt.isPopular
                              ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
                          }`}
                        >
                          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{isArabic ? 'تحميل' : 'Download'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Download in progress modal */}
      {isDownloading && activeDownloadOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0e1322] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto animate-bounce">
              <Download className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">{isArabic ? 'جاري تجهيز وتنزيل الملف...' : 'Downloading Video...'}</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">{activeDownloadOption.label}</p>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/10">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>{downloadProgress}%</span>
                <span>28.4 MB/s (Ultra Speed)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              {isArabic ? 'يتم سحب الفيديو مباشرة بأعلى دقة بدون أي علامة مائية' : 'Extracting clean master stream with zero watermarks'}
            </p>
          </div>
        </div>
      )}

      {/* Supported Platforms Grid Showcase */}
      <div className="space-y-4 pt-4">
        <div className="text-center space-y-1">
          <h3 className="text-base sm:text-lg font-black text-white">
            {isArabic ? 'المنصات المدعومة بالكامل وبدون علامة مائية' : 'Fully Supported Video Platforms'}
          </h3>
          <p className="text-xs text-slate-400">
            {isArabic ? 'نقوم بسحب الفيديو من السيرفر الأصلي بدون ضغط وبدون علامة التطبيق' : 'Direct original server extraction with zero compression'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[
            { name: 'TikTok', desc: 'HD بدون علامة + صوت', icon: '🎵', color: 'from-pink-500/20 to-purple-500/20 border-pink-500/30' },
            { name: 'Instagram', desc: 'Reels, Posts & Stories', icon: '📸', color: 'from-rose-500/20 to-orange-500/20 border-rose-500/30' },
            { name: 'YouTube', desc: 'Shorts & 4K Videos', icon: '▶️', color: 'from-red-500/20 to-red-600/20 border-red-500/30' },
            { name: 'Facebook', desc: 'Watch & Reels 1080p', icon: '👥', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30' },
            { name: 'X (Twitter)', desc: 'تغريدات الفيديو الفائقة', icon: '𝕏', color: 'from-slate-700/30 to-slate-800/30 border-white/20' },
            { name: 'Pinterest', desc: 'فيديوهات وبنز بجودة عالية', icon: '📌', color: 'from-red-700/20 to-red-800/20 border-red-500/30' },
            { name: 'Snapchat', desc: 'Spotlight & Stories', icon: '👻', color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30' },
            { name: 'Douyin', desc: 'تيك توك الصيني الأصلي', icon: '⚡', color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30' },
            { name: 'Threads', desc: 'فيديوهات ثريدز عالية الدقة', icon: '🧵', color: 'from-slate-800/30 to-slate-900/30 border-white/20' },
            { name: 'Reddit', desc: 'فيديوهات ريديت مع الصوت', icon: '🤖', color: 'from-orange-500/20 to-red-500/20 border-orange-500/30' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl bg-gradient-to-b ${item.color} border flex items-center gap-2.5 transition-all hover:scale-105`}
            >
              <div className="text-xl">{item.icon}</div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                <p className="text-[10px] text-slate-300 truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">{isArabic ? 'بدون علامة مائية 100%' : '100% Zero Watermark'}</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {isArabic ? 'إزالة الشعارات والعلامات المائية المزعجة من فيديوهات تيك توك وريلز للاستخدام النظيف.' : 'Extract the clean camera roll version without any watermarks or overlays.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">{isArabic ? 'دعم الذكاء الاصطناعي 4K' : '4K AI Upscaler Integration'}</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {isArabic ? 'إمكانية إرسال أي فيديو تم تنزيله فوراً لمحرك تحسين الجودة لرفع الدقة وإزالة النويز.' : 'Directly boost your downloaded video to 4K UHD 60FPS using neural super-resolution.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white">{isArabic ? 'مجاني وسريع وآمن' : 'Unlimited & Ultra Fast'}</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {isArabic ? 'لا حدود للتنزيل، سرعات سيرفرات فائقة، وتشفير كامل للبيانات بدون أي إعلانات مزعجة.' : 'No limits, maximum CDN bandwidth, SSL secured, and instant response.'}
          </p>
        </div>
      </div>

    </div>
  );
};
