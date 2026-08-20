import React, { useState, useEffect, useRef } from 'react';
import { Radio, Volume2, VolumeX, Play, Pause, X, AlertCircle, Sparkles, BellRing } from 'lucide-react';
import { BroadcastState } from '../types';

interface LiveBroadcastBannerProps {
  isArabic: boolean;
}

export const LiveBroadcastBanner: React.FC<LiveBroadcastBannerProps> = ({ isArabic }) => {
  const [broadcast, setBroadcast] = useState<BroadcastState>({
    enabled: true,
    message: '🎙️ إذاعة PIPO ULTRA: تم إطلاق محرك Instagram الحقيقي وسحب الفيديوهات بدقة 1080p و 4K بدون علامة مائية!',
    type: 'live',
    audioStreamUrl: 'https://backup.qurango.net/radio/tarteel',
    radioStationName: 'إذاعة القرآن الكريم (تلاوات مباركة خاشعة 24/7)',
    isRadioPlaying: false,
    marqueeSpeed: 25,
    allowDismiss: true,
    createdAt: new Date().toISOString()
  });

  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Poll for live broadcast updates from server
  const fetchBroadcast = async () => {
    try {
      const res = await fetch('/api/broadcast');
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.data) {
          setBroadcast(prev => {
            // if new message arrived, un-dismiss
            if (prev.message !== json.data.message || prev.type !== json.data.type) {
              setIsDismissed(false);
            }
            return json.data;
          });
        }
      }
    } catch {
      // offline / quiet
    }
  };

  useEffect(() => {
    fetchBroadcast();
    const interval = setInterval(fetchBroadcast, 5000);
    return () => clearInterval(interval);
  }, []);

  // Audio stream handling
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayAudio = () => {
    if (!audioRef.current) {
      if (broadcast.audioStreamUrl) {
        const audio = new Audio(broadcast.audioStreamUrl);
        audio.volume = isMuted ? 0 : volume;
        audioRef.current = audio;
      }
    }

    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlayingAudio(true);
        }).catch(err => {
          console.warn('Audio stream play error:', err);
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!broadcast.enabled || isDismissed) {
    return null;
  }

  // Theme styling based on broadcast type
  const getTypeBadge = () => {
    switch (broadcast.type) {
      case 'breaking':
        return {
          badge: isArabic ? '🔴 بث عاجل' : '🔴 BREAKING LIVE',
          bgColor: 'bg-gradient-to-r from-rose-950 via-rose-900/90 to-red-950',
          borderColor: 'border-rose-500/50',
          textColor: 'text-rose-200',
          badgeStyle: 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/50'
        };
      case 'radio':
        return {
          badge: isArabic ? '🎙️ إذاعة PIPO المباشرة' : '🎙️ LIVE RADIO STATION',
          bgColor: 'bg-gradient-to-r from-[#0d172e] via-[#101e40] to-[#0d172e]',
          borderColor: 'border-cyan-500/40',
          textColor: 'text-cyan-200',
          badgeStyle: 'bg-cyan-500 text-black font-black shadow-lg shadow-cyan-500/40'
        };
      case 'promo':
        return {
          badge: isArabic ? '✨ ترقية وإذاعة خاصة' : '✨ SPECIAL BROADCAST',
          bgColor: 'bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950',
          borderColor: 'border-emerald-500/40',
          textColor: 'text-emerald-200',
          badgeStyle: 'bg-emerald-500 text-black font-black'
        };
      case 'announcement':
        return {
          badge: isArabic ? '📢 إعلان النظام' : '📢 SYSTEM BROADCAST',
          bgColor: 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950',
          borderColor: 'border-amber-500/40',
          textColor: 'text-amber-200',
          badgeStyle: 'bg-amber-500 text-black font-black'
        };
      default:
        return {
          badge: isArabic ? '🔴 بث مباشر الإذاعة' : '🔴 LIVE BROADCAST',
          bgColor: 'bg-gradient-to-r from-[#110e24] via-[#1b153b] to-[#110e24]',
          borderColor: 'border-purple-500/40',
          textColor: 'text-purple-200',
          badgeStyle: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse'
        };
    }
  };

  const currentTheme = getTypeBadge();

  return (
    <aside 
      aria-label={isArabic ? 'شريط الإذاعة والبث المباشر' : 'Live Broadcast Bar'}
      className={`w-full ${currentTheme.bgColor} border-b ${currentTheme.borderColor} shadow-xl py-2 px-3 sm:px-6 relative overflow-hidden transition-all duration-300 z-40`}
    >
      {/* Background ambient shine */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        
        {/* Left / Start: Badge & Audio Button */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${currentTheme.badgeStyle}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>{currentTheme.badge}</span>
          </span>

          {/* Live Radio Audio Trigger */}
          {broadcast.audioStreamUrl && (
            <button
              onClick={togglePlayAudio}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isPlayingAudio 
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/30' 
                  : 'bg-black/40 hover:bg-black/60 text-slate-200 border-white/10 hover:border-cyan-400/40'
              }`}
              title={isArabic ? 'تشغيل / إيقاف إذاعة الراديو الحية' : 'Play/Pause Live Audio Radio'}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline font-mono">
                    {isArabic ? 'الإذاعة تعمل' : 'On Air'}
                  </span>
                  {/* Equalizer animation */}
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-full bg-black animate-pulse" />
                    <span className="w-0.5 h-2 bg-black animate-bounce" />
                    <span className="w-0.5 h-3.5 bg-black animate-pulse" />
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-cyan-400" />
                  <span className="hidden sm:inline text-cyan-300">
                    {isArabic ? 'استمع للإذاعة' : 'Listen Live'}
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Center: Live Scrolling Message */}
        <div className="flex-1 overflow-hidden relative mx-2">
          <div className="whitespace-nowrap flex items-center gap-4">
            <span className={`font-semibold ${currentTheme.textColor} inline-block animate-marquee`}>
              {broadcast.message}
            </span>
            {broadcast.radioStationName && (
              <span className="text-[11px] text-slate-400 hidden lg:inline-flex items-center gap-1 border-s border-white/20 ps-3">
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>{broadcast.radioStationName}</span>
              </span>
            )}
          </div>
        </div>

        {/* Right / End: Audio Volume & Dismiss */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isPlayingAudio && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
              title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-300" />}
            </button>
          )}

          {broadcast.allowDismiss && (
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-md text-slate-400 hover:text-rose-300 hover:bg-white/5 transition-all"
              title={isArabic ? 'إغلاق الإشعار' : 'Dismiss'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </aside>
  );
};
