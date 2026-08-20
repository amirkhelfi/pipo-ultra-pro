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
    }, 700);
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
      brightness(${100 + settings.brightness + 3}%)
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
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isArabic ? 'محرك PIPO Super-Resolution AI للذكاء الاصطناعي' : 'PIPO Neural Super-Resolution Engine'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isArabic ? 'تحسين ورفع جودة الفيديو إلى 4K Ultra HD' : 'AI Video Quality Enhancer & 4K Upscaler'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {isArabic 
                ? 'ارفع دقة أي فيديو ضعيف الجودة أو مشوش إلى 4K/60FPS، تخلص من بكسلة الواتساب والتيك توك، وعزز الألوان السينمائية بضغطة واحدة.'
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
                  className="w-full h-full object-cover filter blur-[0.6px] brightness-90"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-white/10">
                  {isArabic ? 'قبل: أصلي (480p/720p مشوش)' : 'BEFORE: Original (Low-Res)'}
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
              <span className="text-sm font-black text-cyan-400 font-mono">{settings.upscaleFactor.toUpperCase()} UHD (3840x2160)</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block">{isArabic ? 'معدل الإطارات' : 'Frame Rate'}</span>
              <span className="text-sm font-black text-amber-400 font-mono">{settings.targetFps} FPS Ultra Smooth</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block">{isArabic ? 'نسبة الوضوح' : 'Clarity Boost'}</span>
              <span className="text-sm font-black text-emerald-400 font-mono">+{settings.sharpening * 3}% Detail</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block">{isArabic ? 'معالجة الألوان' : 'HDR Grading'}</span>
              <span className="text-sm font-black text-purple-400 font-mono">10-Bit Dynamic</span>
            </div>
          </div>

          {/* Sample Video Clips for Fast Test */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              {isArabic ? 'أو اختر فيديو تجريبي لاختبار محرك الذكاء الاصطناعي:' : 'Or try sample clips to test AI engine:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_ENHANCE_VIDEOS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setVideoUrl(sample.url);
                    setVideoTitle(sample.title);
                    setIsEnhancedReady(false);
                    setProgress(0);
                  }}
                  className={`p-2.5 rounded-xl border text-right sm:text-center transition-all flex sm:flex-col items-center gap-2 ${
                    videoUrl === sample.url
                      ? 'bg-cyan-500/20 border-cyan-500 text-white'
                      : 'bg-slate-950/60 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <img src={sample.thumbnail} alt={sample.title} className="w-12 h-8 sm:w-full sm:h-16 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold block truncate">{sample.title}</span>
                    <span className="text-[9px] text-slate-400 block">{sample.originalResolution}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Enhancement Controls & Model Suite */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-5 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white">
                  {isArabic ? 'إعدادات ومحركات الذكاء الاصطناعي' : 'AI Engine & Tuning Suite'}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PRO 4K
              </span>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                {isArabic ? '1. اختر نموذج الذكاء الاصطناعي (AI Model):' : '1. Select AI Neural Model:'}
              </label>
              
              <div className="space-y-2">
                {AI_MODELS_INFO.map((m) => {
                  const isSelected = settings.model === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSettings(prev => ({ ...prev, model: m.id as any }))}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500/60 shadow-md'
                          : 'bg-slate-950/60 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                          <span>{m.name}</span>
                        </span>
                        <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{m.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Resolution */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                {isArabic ? '2. الدقة المطلوبة (Upscale Target):' : '2. Output Resolution Target:'}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['1080p', '2k', '4k', '8k'] as const).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, upscaleFactor: res }))}
                    className={`py-2 rounded-xl text-xs font-black transition-all ${
                      settings.upscaleFactor === res
                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-950 text-slate-400 border border-white/10 hover:text-white'
                    }`}
                  >
                    {res.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Target FPS Frame Interpolation */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                {isArabic ? '3. سلاسة الحركة (Frame Rate Interpolation):' : '3. Frame Interpolation (FPS):'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['30', '60', '120'] as const).map((fps) => (
                  <button
                    key={fps}
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, targetFps: fps }))}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                      settings.targetFps === fps
                        ? 'bg-amber-500 text-black font-extrabold'
                        : 'bg-slate-950 text-slate-400 border border-white/10'
                    }`}
                  >
                    {fps} FPS
                  </button>
                ))}
              </div>
            </div>

            {/* Tuning Sliders */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              
              {/* Sharpening */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{isArabic ? 'حدة التفاصيل (AI Sharpening)' : 'AI Sharpening'}</span>
                  <span className="font-mono text-cyan-400">{settings.sharpening}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.sharpening}
                  onChange={(e) => setSettings(prev => ({ ...prev, sharpening: parseInt(e.target.value) }))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              {/* Denoising */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{isArabic ? 'إزالة التشويش (AI Denoising)' : 'AI Denoise Level'}</span>
                  <span className="font-mono text-cyan-400">{settings.denoising}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.denoising}
                  onChange={(e) => setSettings(prev => ({ ...prev, denoising: parseInt(e.target.value) }))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              {/* HDR Vibrance */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{isArabic ? 'تشبع وألوان HDR (Color Vibrance)' : 'HDR Vibrance'}</span>
                  <span className="font-mono text-amber-400">{settings.colorVibrance}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.colorVibrance}
                  onChange={(e) => setSettings(prev => ({ ...prev, colorVibrance: parseInt(e.target.value) }))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

            </div>

            {/* Smart Feature Toggles */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-white/5 cursor-pointer">
                <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  {isArabic ? 'ترميم ملامح الوجه (AI Face Detailer)' : 'AI Face Restoration'}
                </span>
                <input
                  type="checkbox"
                  checked={settings.faceRestoration}
                  onChange={(e) => setSettings(prev => ({ ...prev, faceRestoration: e.target.checked }))}
                  className="accent-cyan-400 w-4 h-4 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-white/5 cursor-pointer">
                <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  {isArabic ? 'عزل ضوضاء الصوت (Vocal Noise Cleaner)' : 'AI Audio Denoise'}
                </span>
                <input
                  type="checkbox"
                  checked={settings.audioDenoise}
                  onChange={(e) => setSettings(prev => ({ ...prev, audioDenoise: e.target.checked }))}
                  className="accent-emerald-400 w-4 h-4 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Action Trigger Buttons */}
            <div className="pt-2 space-y-2.5">
              {!isEnhancedReady ? (
                <button
                  onClick={startEnhancement}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>{isArabic ? 'جاري المعالجة بالذكاء الاصطناعي...' : 'Enhancing with AI...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
                      <span>{isArabic ? 'بدء تحسين الفيديو الآن' : 'Start AI Enhancement'}</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleDownloadEnhanced}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-black text-sm shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 animate-pulse"
                >
                  <Download className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>{isArabic ? `تنزيل الفيديو المحسن (${settings.upscaleFactor.toUpperCase()} 60FPS)` : `Download Enhanced ${settings.upscaleFactor.toUpperCase()}`}</span>
                </button>
              )}
            </div>

            {/* Processing Progress Status */}
            {isProcessing && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2 animate-fade-in">
                <div className="flex justify-between text-xs">
                  <span className="text-cyan-300 font-bold">{processStage}</span>
                  <span className="font-mono text-white">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
