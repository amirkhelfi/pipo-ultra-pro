import React, { useState } from 'react';
import { 
  Music, Link, Upload, Download, Play, Pause, Scissors, 
  Volume2, Sparkles, CheckCircle2, ShieldCheck, RefreshCw, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DownloadHistoryItem } from '../types';
import { detectPlatform, getPlatformBadge } from '../utils/platformDetector';

interface AudioExtractorViewProps {
  initialVideoUrl?: string;
  initialTitle?: string;
  onAddToHistory: (item: DownloadHistoryItem) => void;
  isArabic: boolean;
}

export const AudioExtractorView: React.FC<AudioExtractorViewProps> = ({
  initialVideoUrl,
  initialTitle,
  onAddToHistory,
  isArabic,
}) => {
  const [inputUrl, setInputUrl] = useState<string>(initialVideoUrl || '');
  const [audioFormat, setAudioFormat] = useState<'mp3' | 'wav' | 'm4a' | 'flac'>('mp3');
  const [audioBitrate, setAudioBitrate] = useState<'320' | '256' | '192' | '128'>('320');
  const [isVocalIsolate, setIsVocalIsolate] = useState<boolean>(false);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedAudioUrl, setExtractedAudioUrl] = useState<string | null>(null);
  const [audioTitle, setAudioTitle] = useState<string>(initialTitle || 'Viral Reel Audio Sound');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handleExtract = () => {
    if (!inputUrl.trim()) return;
    setIsExtracting(true);

    setTimeout(() => {
      setIsExtracting(false);
      setExtractedAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');

      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch (e) {}
    }, 1000);
  };

  const handleDownloadAudio = () => {
    const link = document.createElement('a');
    link.href = extractedAudioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    link.download = `${audioTitle}_${audioBitrate}kbps.${audioFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onAddToHistory({
      id: `audio-${Date.now()}`,
      title: `🎵 MP3: ${audioTitle}`,
      platform: 'general',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
      format: audioFormat,
      quality: `${audioBitrate} kbps Studio`,
      downloadDate: new Date().toLocaleDateString('ar-EG'),
      fileSize: '5.2 MB',
      originalUrl: inputUrl,
      downloadUrl: link.href,
      noWatermark: true,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3 bg-gradient-to-b from-emerald-950/40 via-slate-900/80 to-[#080B12] p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          <Music className="w-3.5 h-3.5" />
          <span>{isArabic ? 'استخراج الصوت عالي الدقة 320kbps' : 'Studio Audio & MP3 Extractor'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white">
          {isArabic ? 'استخراج وتحويل الصوت من أي فيديو' : 'Extract Pure Audio & MP3 from Any Video'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          {isArabic 
            ? 'حوّل أي مقطع فيديو من تيك توك، ريلز، أو يوتيوب إلى ملف صوتي MP3 نقي بدقة استوديو مع ميزة عزل الصوت البشري بالذكاء الاصطناعي.'
            : 'Convert TikTok, Instagram Reels, and YouTube videos into crystal-clear 320kbps MP3 audio tracks.'}
        </p>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-6">
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            {isArabic ? 'رابط الفيديو المراد استخراج الصوت منه:' : 'Video URL to extract audio from:'}
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-950 border border-white/10 focus-within:border-emerald-400">
              <Link className="w-4 h-4 text-emerald-400" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder={isArabic ? 'الصق رابط الفيديو (TikTok, Instagram, YouTube)...' : 'Paste video URL (TikTok, Instagram, YouTube)...'}
                className="w-full bg-transparent text-white text-xs sm:text-sm focus:outline-none"
              />
            </div>
            <button
              onClick={handleExtract}
              disabled={isExtracting || !inputUrl.trim()}
              className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isExtracting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Music className="w-4 h-4" />
              )}
              <span>{isArabic ? 'استخراج الصوت' : 'Extract MP3'}</span>
            </button>
          </div>
        </div>

        {/* Audio Format & Bitrate Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">{isArabic ? 'صيغة الصوت:' : 'Audio Format:'}</label>
            <div className="grid grid-cols-4 gap-2">
              {(['mp3', 'wav', 'm4a', 'flac'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setAudioFormat(fmt)}
                  className={`py-2 rounded-xl text-xs font-black uppercase transition-all ${
                    audioFormat === fmt
                      ? 'bg-emerald-500 text-black'
                      : 'bg-slate-950 text-slate-400 border border-white/10 hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">{isArabic ? 'معدل البت وجودة الصوت:' : 'Audio Bitrate & Quality:'}</label>
            <div className="grid grid-cols-4 gap-2">
              {(['320', '256', '192', '128'] as const).map((br) => (
                <button
                  key={br}
                  onClick={() => setAudioBitrate(br)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    audioBitrate === br
                      ? 'bg-emerald-500 text-black font-black'
                      : 'bg-slate-950 text-slate-400 border border-white/10 hover:text-white'
                  }`}
                >
                  {br} kbps
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Vocal Isolation Toggle */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs font-bold text-white block">
                {isArabic ? 'عزل الكلام والصوت البشري بالذكاء الاصطناعي (AI Vocal Isolation)' : 'AI Vocal Isolation (Acapella mode)'}
              </span>
              <span className="text-[10px] text-slate-400">
                {isArabic ? 'فصل صوت المتحدث عن الموسيقى والمؤثرات الخلفية' : 'Separates speech from background music & noise'}
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isVocalIsolate}
            onChange={(e) => setIsVocalIsolate(e.target.checked)}
            className="accent-emerald-400 w-4 h-4 rounded cursor-pointer"
          />
        </div>

        {/* Result Area */}
        {extractedAudioUrl && (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center flex-shrink-0 font-bold shadow-lg">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{audioTitle}</h4>
                  <p className="text-xs text-emerald-400 font-mono">
                    {audioFormat.toUpperCase()} • {audioBitrate} kbps Studio Master • 4.8 MB
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadAudio}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4 text-black stroke-[2.5]" />
                <span>{isArabic ? `تنزيل ملف الصوت (${audioFormat.toUpperCase()})` : `Download Audio (${audioFormat.toUpperCase()})`}</span>
              </button>
            </div>

            {/* Audio Waveform Player Simulation */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="p-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                
                {/* Simulated Audio Bars */}
                <div className="flex-1 flex items-center gap-1 h-8">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{
                        height: `${Math.max(20, Math.sin(i * 0.5) * 100 * 0.8 + 20)}%`,
                        animationDelay: `${i * 40}ms`
                      }}
                    />
                  ))}
                </div>

                <span className="text-[10px] font-mono text-slate-400">00:45</span>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
