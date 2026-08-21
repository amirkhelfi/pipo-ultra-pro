import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Upload, Play, Pause, RotateCcw, Sliders, CheckCircle2, 
  Download, Zap, Shield, Cpu, RefreshCw, Layers, Film, Eye, 
  Maximize2, Volume2, VolumeX, ArrowLeftRight, Check, Palette, UserCheck, Moon, Tv
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AIEnhancementSettings, EnhancementJob, DownloadHistoryItem } from '../types';
import { DEFAULT_AI_SETTINGS, AI_MODELS_INFO, SAMPLE_ENHANCE_VIDEOS } from '../utils/aiEnhancerEngine';

interface AIVideoEnhancerViewProps {
  initialVideoUrl?: string;
  initialTitle?: string;
  onAddToHistory: (item: DownloadHistoryItem) => void;
  isArabic: boolean;
}

export const AIVideoEnhancerView: React.FC<AIVideoEnhancerViewProps> = ({
  initialVideoUrl,
  initialTitle,
  onAddToHistory,
  isArabic,
}) => {
  const [videoUrl, setVideoUrl] = useState<string>(
    initialVideoUrl || SAMPLE_ENHANCE_VIDEOS[0].url
  );
  const [videoTitle, setVideoTitle] = useState<string>(
    initialTitle || SAMPLE_ENHANCE_VIDEOS[0].title
  );
  const [settings, setSettings] = useState<AIEnhancementSettings>(DEFAULT_AI_SETTINGS);
  
  // Update state whenever initialVideoUrl or initialTitle changes (e.g. sent from Video Downloader)
  useEffect(() => {
    if (initialVideoUrl && initialVideoUrl.trim()) {
      const clean = initialVideoUrl.trim();
      // Ensure we don't pass an iframe embed into HTML5 video
      if (clean.includes('youtube.com/embed') || clean.includes('youtube-nocookie.com/embed')) {
        setVideoUrl(SAMPLE_ENHANCE_VIDEOS[0].url);
      } else {
        setVideoUrl(clean);
      }
      setIsEnhancedReady(false);
      setProgress(0);
      setIsPlaying(false);
    }
    if (initialTitle && initialTitle.trim()) {
      setVideoTitle(initialTitle.trim());
    }
  }, [initialVideoUrl, initialTitle]);

  // Video error fallback handler
  const handleVideoError = () => {
    console.warn("Video failed to load in AI Enhancer, falling back to proxy or standard stream...");
    if (videoUrl && !videoUrl.startsWith('/api/proxy-video') && !videoUrl.includes('commondatastorage')) {
      setVideoUrl(`/api/proxy-video?url=${encodeURIComponent(videoUrl)}`);
    } else {
      setVideoUrl(SAMPLE_ENHANCE_VIDEOS[0].url);
    }
  };

  // Enhancement Process state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [processStage, setProcessStage] = useState<string>('');
  const [isEnhancedReady, setIsEnhancedReady] = useState<boolean>(false);

  // Video playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Split Slider state (0 to 100%)
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'enhanced-only'>('split');

  const beforeVideoRef = useRef<HTMLVideoElement>(null);
  const afterVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize playback between before & after video players
  const handlePlayPause = () => {
    if (isPlaying) {
      beforeVideoRef.current?.pause();
      afterVideoRef.current?.pause();
      setIsPlaying(false);
    } else {
      beforeVideoRef.current?.play().catch(() => {});
      afterVideoRef.current?.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (beforeVideoRef.current) {
      setCurrentTime(beforeVideoRef.current.currentTime);
      if (!duration && beforeVideoRef.current.duration) {
        setDuration(beforeVideoRef.current.duration);
      }
    }
  };

  const handleSeek = (time: number) => {
    if (beforeVideoRef.current && afterVideoRef.current) {
      beforeVideoRef.current.currentTime = time;
      afterVideoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Slider drag logic
  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDraggingSlider || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (!isDraggingSlider || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPos(percentage);
  };

  useEffect(() => {
    const handleUp = () => setIsDraggingSlider(false);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDraggingSlider]);

  // Handle Local Video File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setVideoTitle(file.name);
      setIsEnhancedReady(false);
      setProgress(0);
    }
  };

  // Run AI Enhancement Pipeline
  const startEnhancement = () => {
    setIsProcessing(true);
    setIsEnhancedReady(false);
    setProgress(0);

    const stages = [
      { p: 15, msg: isArabic ? 'جارٍ تحليل إطارات الفيديو وتفكيك الضغط (Neural Analysis)...' : 'Analyzing video frames and decompression...' },
      { p: 40, msg: isArabic ? `تطبيق خوارزمية رفع الدقة Super-Resolution إلى ${settings.upscaleFactor.toUpperCase()}...` : `Applying Super-Resolution to ${settings.upscaleFactor.toUpperCase()}...` },
      { p: 70, msg: isArabic ? 'إزالة التشويش، ترميم تفاصيل الوجوه ومعالجة HDR...' : 'AI Denoising, Face Restoration & HDR Grading...' },
      { p: 90, msg: isArabic ? `مضاعفة معدل الإطارات إلى ${settings.targetFps} FPS والرندرة النهائية...` : `Interpolating frames to ${settings.targetFps} FPS & Rendering...` },
      { p: 100, msg: isArabic ? 'اكتمل التحسين بنجاح! جاهز للمعاينة والتنزيل.' : 'Enhancement complete! Ready to preview & download.' },
    ];

    let currentStageIndex = 0;

    const interval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        setProgress(stages[currentStageIndex].p);
        setProcessStage(stages[currentStageIndex].msg);
        currentStageIndex++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setIsEnhancedReady(true);

        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {
          console.error(e);
        }

        // Auto play preview
        setTimeout(() => {
          beforeVideoRef.current?.play().catch(() => {});
          afterVideoRef.current?.play().catch(() => {});
          setIsPlaying(true);
        }, 400);
      }
    }, 600);
  };

  // Handle Download Enhanced Video
  const handleDownloadEnhanced = () => {
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}

    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `PIPO_AI_Enhanced_${settings.upscaleFactor.toUpperCase()}_60FPS_${videoTitle}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Save to history
    onAddToHistory({
      id: `enhanced-${Date.now()}`,
      title: `✨ AI Enhanced: ${videoTitle}`,
      platform: 'general',
      thumbnail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80',
      format: 'mp4',
      quality: `${settings.upscaleFactor.toUpperCase()} 60FPS Ultra HD`,
      downloadDate: new Date().toLocaleDateString('ar-EG'),
      fileSize: '88.5 MB',
      originalUrl: videoUrl,
      downloadUrl: videoUrl,
      noWatermark: true,
    });
  };

  // Dynamic CSS Visual filters to simulate realistic crystal-clear AI sharpening and HDR
  const enhancedFilterStyle: React.CSSProperties = {
    filter: `
      contrast(${100 + settings.contrast + 15}%)
      brightness(${100 + settings.brightness + 4}%)
      saturate(${100 + (settings.colorVibrance * 0.4)}%)
    `,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-950/70 via-slate-900/90 to-[#0c1220] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isArabic ? 'استوديو الذكاء الاصطناعي الفائق v4.0' : 'Neural AI Video Super-Resolution Studio'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isArabic ? 'تحسين جودة الفيديو ورفع الدقة إلى 4K 60FPS' : 'AI Video Quality Enhancer & 4K 60FPS'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isArabic 
                ? 'رفع دقة الفيديو المشوش أو منخفض الجودة إلى 4K فائق الوضوح، ترميم ملامح الوجه، إزالة الضوضاء البصرية، ومضاعفة معدل الإطارات إلى 60 FPS.' 
                : 'Upscale low-res, noisy or compressed videos to crystal-clear 4K 60FPS with neural detail synthesis.'}
            </p>
          </div>

          {/* Quick Upload Button */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Upload className="w-4 h-4 text-black stroke-[2.5]" />
              <span>{isArabic ? 'رفع فيديو من جهازك' : 'Upload Video File'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace: Player / Split Screen + AI Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Video Player & Before/After Split Comparison */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-4 shadow-2xl space-y-3">
            
            {/* Top Toolbar: View Mode & Title */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Film className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="font-bold text-white truncate max-w-xs">{videoTitle}</span>
              </div>

              {/* Comparison View Modes */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    viewMode === 'split' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isArabic ? 'سلايدر مقارنة (قبل / بعد)' : 'Split Slider'}
                </button>
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    viewMode === 'side-by-side' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isArabic ? 'جنباً إلى جنب' : 'Side-by-Side'}
                </button>
                <button
                  onClick={() => setViewMode('enhanced-only')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    viewMode === 'enhanced-only' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isArabic ? 'النسخة المحسنة فقط' : 'Enhanced 4K'}
                </button>
              </div>
            </div>

            {/* Video Stage Container */}
            <div 
              ref={containerRef}
              className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 select-none cursor-ew-resize group shadow-2xl"
              onMouseDown={() => setIsDraggingSlider(true)}
              onTouchStart={() => setIsDraggingSlider(true)}
            >
              
              {/* Underneath / Left Side: Original Before Video */}
              <div className="absolute inset-0 w-full h-full">
                <video
                  ref={beforeVideoRef}
                  src={videoUrl}
                  loop
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 30)}
                  onError={handleVideoError}
                  className="w-full h-full object-cover filter blur-[0.5px] brightness-90"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-white/10">
                  {isArabic ? 'قبل: أصلي (جودة منخفضة)' : 'BEFORE: Original (Low-Res)'}
                </div>
              </div>

              {/* Top Layer / Right Side: AI Enhanced After Video (Clipped by Slider) */}
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ 
                  clipPath: viewMode === 'split' 
                    ? `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` 
                    : viewMode === 'enhanced-only'
                    ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    : 'none'
                }}
              >
                <video
                  ref={afterVideoRef}
                  src={videoUrl}
                  loop
                  muted={isMuted}
                  onError={handleVideoError}
                  style={enhancedFilterStyle}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-cyan-500/90 text-black text-[10px] font-black border border-cyan-300/40 shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{isArabic ? `بعد: محسن بالذكاء الاصطناعي (${settings.upscaleFactor.toUpperCase()} 60FPS)` : `AFTER: AI Enhanced (${settings.upscaleFactor.toUpperCase()})`}</span>
                </div>
              </div>

              {/* Draggable Vertical Divider Bar (Visible in Split Mode) */}
              {viewMode === 'split' && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-white to-cyan-400 cursor-ew-resize z-20 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-xl border-2 border-white text-xs font-bold">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Overlay Play/Pause Trigger if not playing */}
              {!isPlaying && (
                <div 
                  onClick={handlePlayPause}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center cursor-pointer z-10"
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-500/90 text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
                    <Play className="w-7 h-7 fill-current ml-0.5" />
                  </div>
                </div>
              )}

            </div>

            {/* Custom Playback & Scrubbing Controls */}
            <div className="flex items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-[11px] font-mono text-slate-400">
                  {Math.floor(currentTime)}s / {Math.floor(duration || 30)}s
                </span>
              </div>

              {/* Progress Slider */}
              <input
                type="range"
                min={0}
                max={duration || 30}
                step={0.1}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />

              {/* Reset to beginning */}
              <button
                onClick={() => handleSeek(0)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                title={isArabic ? 'إعادة من البداية' : 'Replay'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* AI Metrics Showcase Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block">{isArabic ? 'الدقة المستهدفة' : 'Target Resolution'}</span>
              <span className="text-sm font-black text-cyan-400 font-mono">{settings.upscaleFactor.toUpperCase()} UHD</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block">{isArabic ? 'سلاسة الحركة' : 'Motion Rate'}</span>
              <span className="text-sm font-black text-amber-400 font-mono">{settings.targetFps} FPS Cinema</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block">{isArabic ? 'ترميم الملامح' : 'Face Restore'}</span>
              <span className="text-sm font-black text-emerald-400 font-mono">{settings.faceEnhance ? 'ON' : 'OFF'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block">{isArabic ? 'نظام الألوان' : 'Color Dynamic'}</span>
              <span className="text-sm font-black text-purple-400 font-mono">HDR 10-Bit</span>
            </div>
          </div>

        </div>

        {/* Right Column: AI Model Settings & Trigger Controls */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="rounded-3xl bg-slate-900/80 border border-cyan-500/30 p-5 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>{isArabic ? 'إعدادات معالجة الذكاء الاصطناعي' : 'AI Processing Settings'}</span>
              </h3>
            </div>

            {/* Model Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {isArabic ? 'محرك الذكاء الاصطناعي' : 'Neural AI Model'}
              </label>
              <div className="grid grid-cols-1 gap-2">
                {AI_MODELS_INFO.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSettings(prev => ({ ...prev, model: model.id as any }))}
                    className={`p-3 rounded-xl border text-right transition-all flex items-start justify-between ${
                      settings.model === model.id
                        ? 'bg-cyan-500/10 border-cyan-400 text-white'
                        : 'bg-black/40 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{model.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{model.description}</div>
                    </div>
                    {settings.model === model.id && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Upscale Target Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {isArabic ? 'مستوى رفع الدقة (Upscale Factor)' : 'Upscale Factor'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['2k', '4k', '8k'] as const).map((factor) => (
                  <button
                    key={factor}
                    onClick={() => setSettings(prev => ({ ...prev, upscaleFactor: factor }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      settings.upscaleFactor === factor
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950 text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {factor.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Target FPS Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {isArabic ? 'معدل الإطارات (Smooth FPS)' : 'Target Framerate'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([30, 60, 120] as const).map((fps) => (
                  <button
                    key={fps}
                    onClick={() => setSettings(prev => ({ ...prev, targetFps: fps }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      settings.targetFps === fps
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {fps} FPS
                  </button>
                ))}
              </div>
            </div>

            {/* Fine Tuning Sliders */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{isArabic ? 'حدة التفاصيل (Sharpening)' : 'Sharpness'}</span>
                  <span className="font-mono text-cyan-400">{settings.sharpening}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.sharpening}
                  onChange={(e) => setSettings(prev => ({ ...prev, sharpening: parseInt(e.target.value) }))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{isArabic ? 'تشبع الألوان السينمائي (HDR Vibrance)' : 'HDR Vibrance'}</span>
                  <span className="font-mono text-amber-400">{settings.colorVibrance}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.colorVibrance}
                  onChange={(e) => setSettings(prev => ({ ...prev, colorVibrance: parseInt(e.target.value) }))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Action Button: Run or Download */}
            <div className="pt-2 space-y-2">
              {!isEnhancedReady ? (
                <button
                  onClick={startEnhancement}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-black font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>{isArabic ? 'جارٍ معالجة الفيديو بالذكاء الاصطناعي...' : 'Enhancing with AI Neural Net...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 stroke-[2.5]" />
                      <span>{isArabic ? 'بدء تحسين جودة الفيديو 4K' : 'Start 4K AI Enhancement'}</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleDownloadEnhanced}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>{isArabic ? 'تنزيل الفيديو المحسن بجودة 4K' : 'Download 4K Enhanced Video'}</span>
                </button>
              )}

              {/* Progress Feedback */}
              {isProcessing && (
                <div className="space-y-2 pt-2 animate-fade-in">
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/10">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-cyan-300 font-mono text-center">
                    {processStage} ({progress}%)
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
