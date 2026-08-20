import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Radio, 
  Sparkles, 
  AlertTriangle, 
  Info, 
  X, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Check, 
  Clock,
  ChevronRight,
  Flame,
  Zap
} from 'lucide-react';
import { BroadcastNotification } from '../types';

interface BroadcastNotificationToastProps {
  onOpenInstallModal?: () => void;
}

export const BroadcastNotificationToast: React.FC<BroadcastNotificationToastProps> = ({ onOpenInstallModal }) => {
  const [notifications, setNotifications] = useState<BroadcastNotification[]>([]);
  const [activeToast, setActiveToast] = useState<BroadcastNotification | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const seenIdsRef = useRef<Set<string>>(new Set());

  // Function to play sound chime using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.15); // A5
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Poll for notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/broadcast/notifications');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.notifications)) {
          const list: BroadcastNotification[] = json.notifications;
          setNotifications(list);

          // Check if there is a fresh notification we haven't shown as toast
          if (list.length > 0) {
            const latest = list[0];
            if (!seenIdsRef.current.has(latest.id)) {
              seenIdsRef.current.add(latest.id);
              setActiveToast(latest);
              if (latest.sound !== false) {
                playChime();
              }
            }
          }
        }
      }
    } catch (e) {
      // Silent error
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleActionClick = (notif: BroadcastNotification) => {
    if (notif.actionUrl === '#install' && onOpenInstallModal) {
      onOpenInstallModal();
      setActiveToast(null);
    } else if (notif.actionUrl && notif.actionUrl.startsWith('http')) {
      window.open(notif.actionUrl, '_blank');
    }
  };

  const getIcon = (type: BroadcastNotification['type']) => {
    switch (type) {
      case 'live':
      case 'radio':
        return <Radio className="w-5 h-5 text-amber-400 animate-pulse" />;
      case 'breaking':
        return <Flame className="w-5 h-5 text-rose-400 animate-bounce" />;
      case 'announcement':
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'promo':
        return <Zap className="w-5 h-5 text-emerald-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <>
      {/* Floating Bell Button with Badge in Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsDrawerOpen(true)}
          id="open-notifications-drawer-btn"
          className="relative p-3.5 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 text-amber-400 hover:text-amber-300 rounded-full shadow-xl shadow-black/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
          title="إذاعة وإشعارات الموقع"
        >
          <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-slate-900 animate-pulse">
              {notifications.length > 9 ? '+9' : notifications.length}
            </span>
          )}
        </button>
      </div>

      {/* Floating Active In-App Toast Banner */}
      {activeToast && (
        <div 
          className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-bounce-in"
          id="live-broadcast-toast"
        >
          <div className="relative bg-slate-900/95 border-2 border-amber-500/40 rounded-2xl p-4 shadow-2xl shadow-amber-500/20 backdrop-blur-xl">
            {/* Ambient line */}
            <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl shrink-0">
                {getIcon(activeToast.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                    إذاعة PIPO المباشرة
                  </span>
                  <button
                    onClick={() => setActiveToast(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug mb-1">
                  {activeToast.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {activeToast.message}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800">
                  {activeToast.actionLabel ? (
                    <button
                      onClick={() => handleActionClick(activeToast)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all"
                    >
                      {activeToast.actionLabel}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span />
                  )}

                  <button
                    onClick={() => {
                      setIsDrawerOpen(true);
                      setActiveToast(null);
                    }}
                    className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    عرض كل الإشعارات
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Notifications Drawer / Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <Radio className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">مركز إذاعة وإشعارات PIPO</h3>
                  <p className="text-xs text-slate-400">الإشعارات الحية وتحديثات السيرفر الفورية</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-xl border text-xs transition-colors ${
                    soundEnabled 
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                  title={soundEnabled ? 'كتم صوت الإشعارات' : 'تفعيل صوت الإشعارات'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">لا توجد إشعارات جديدة حالياً</p>
                  <p className="text-xs text-slate-500 mt-1">تصلك الإشعارات والإذاعات فور إرسالها من لوحة التحكم</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/30 rounded-2xl transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-900 border border-slate-700 rounded-xl shrink-0 mt-0.5">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-white">{n.title}</h4>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" />
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {n.message}
                        </p>
                        {n.actionLabel && (
                          <button
                            onClick={() => {
                              handleActionClick(n);
                              setIsDrawerOpen(false);
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
                          >
                            {n.actionLabel}
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>يتم استقبال الإشعارات الحية في الوقت الفعلي</span>
              {onOpenInstallModal && (
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onOpenInstallModal();
                  }}
                  className="text-amber-400 hover:underline font-bold flex items-center gap-1"
                >
                  📱 تثبيت التطبيق
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
