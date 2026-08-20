import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Megaphone, 
  Send, 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Flame, 
  BellRing, 
  ExternalLink,
  Sliders,
  Layers,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BroadcastState, BroadcastNotification } from '../types';

interface DeveloperBroadcastTabProps {
  isArabic: boolean;
  broadcastForm: BroadcastState;
  setBroadcastForm: React.Dispatch<React.SetStateAction<BroadcastState>>;
  onSaveBroadcast: () => Promise<void>;
  isPublishingBroadcast: boolean;
  broadcastSavedToast: boolean;
}

export const DeveloperBroadcastTab: React.FC<DeveloperBroadcastTabProps> = ({
  isArabic,
  broadcastForm,
  setBroadcastForm,
  onSaveBroadcast,
  isPublishingBroadcast,
  broadcastSavedToast,
}) => {
  // In-App Notification Dispatcher Form State
  const [notifTitle, setNotifTitle] = useState<string>('🎙️ إذاعة PIPO: تحديث جديد!');
  const [notifMessage, setNotifMessage] = useState<string>('تمت إضافة خوادم سحب فائقة السرعة وتثبيت التطبيق على الهاتف بدقة 4K!');
  const [notifType, setNotifType] = useState<BroadcastNotification['type']>('live');
  const [notifActionLabel, setNotifActionLabel] = useState<string>('تثبيت التطبيق الآن 📱');
  const [notifActionUrl, setNotifActionUrl] = useState<string>('#install');
  const [notifSound, setNotifSound] = useState<boolean>(true);
  const [isSendingNotif, setIsSendingNotif] = useState<boolean>(false);
  const [notifSuccessToast, setNotifSuccessToast] = useState<boolean>(false);
  const [sentNotifications, setSentNotifications] = useState<BroadcastNotification[]>([]);

  // Preset Radio Stations
  const RADIO_PRESETS = [
    {
      id: 'quran',
      name: isArabic ? 'إذاعة القرآن الكريم (تلاوات مباركة خاشعة 24/7)' : 'Holy Quran Recitations Live 24/7',
      url: 'https://backup.qurango.net/radio/tarteel',
      icon: '📖'
    },
    {
      id: 'lofi',
      name: isArabic ? 'راديو لوفاي وتركيز وموسيقى هادئة للعمل' : 'Lo-Fi Chill & Focus Study Beats',
      url: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
      icon: '🎧'
    },
    {
      id: 'tech',
      name: isArabic ? 'إذاعة أخبار التكنولوجيا والبودكاست التقني' : 'Tech Pulse & Podcast Audio',
      url: 'https://stream.radiojar.com/4wqre23fytzuv',
      icon: '⚡'
    }
  ];

  const fetchNotificationsList = async () => {
    try {
      const res = await fetch('/api/broadcast/notifications');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.notifications)) {
          setSentNotifications(json.notifications);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotificationsList();
  }, []);

  const handleSendInAppNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    setIsSendingNotif(true);
    try {
      const res = await fetch('/api/broadcast/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage,
          type: notifType,
          actionLabel: notifActionLabel,
          actionUrl: notifActionUrl,
          sound: notifSound,
          priority: 'high'
        })
      });

      if (res.ok) {
        setNotifSuccessToast(true);
        fetchNotificationsList();
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
        } catch {}
        setTimeout(() => setNotifSuccessToast(false), 4000);
      }
    } catch (err) {
      console.error('Send notification error:', err);
    } finally {
      setIsSendingNotif(false);
    }
  };

  const handleClearAllNotifications = async () => {
    if (window.confirm(isArabic ? 'هل تريد حذف جميع الإشعارات المرسلة؟' : 'Clear all dispatched notifications?')) {
      try {
        await fetch('/api/broadcast/notifications/clear', { method: 'POST' });
        setSentNotifications([]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans" id="developer-broadcast-manager">
      
      {/* Toast Confirmation */}
      {(broadcastSavedToast || notifSuccessToast) && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              {notifSuccessToast 
                ? (isArabic ? 'تم إرسال الإشعار الفوري لجميع زوار الموقع بنجاح! 🔔' : 'In-app notification dispatched to all visitors! 🔔')
                : (isArabic ? 'تم تحديث شريط الإذاعة المباشرة بنجاح! 🎙️' : 'Live broadcast banner updated successfully! 🎙️')
              }
            </span>
          </div>
          <span className="text-[10px] bg-emerald-800/50 px-2.5 py-1 rounded-full text-emerald-200 font-mono font-black">
            DISPATCHED LIVE
          </span>
        </div>
      )}

      {/* Part 1: In-App Notification Sender Form (إرسال إشعارات داخل الموقع) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">
                  {isArabic ? 'إرسال إشعارات فورية داخل الموقع (In-App Push Dispatcher)' : 'Direct In-App Notification Dispatcher'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
                  LIVE POPUP
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isArabic 
                  ? 'إرسال إشعار فوري منبثق بصوت تنبيه لجميع الأشخاص المتواجدين داخل الموقع الآن.' 
                  : 'Broadcast real-time floating alert toasts with audio chimes to all active users.'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSendInAppNotification} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Notification Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isArabic ? 'عنوان الإشعار:' : 'Notification Title:'}
              </label>
              <input
                type="text"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder={isArabic ? 'مثال: 🎙️ إذاعة PIPO: ميزة جديدة!' : 'Notification Title...'}
                className="w-full px-4 py-3 bg-black/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            {/* Notification Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isArabic ? 'نوع وأيقونة الإشعار:' : 'Category & Icon:'}
              </label>
              <select
                value={notifType}
                onChange={(e) => setNotifType(e.target.value as any)}
                className="w-full px-4 py-3 bg-black/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="live">{isArabic ? '🎙️ إذاعة وبث حي (Live Broadcast)' : 'Live Broadcast'}</option>
                <option value="breaking">{isArabic ? '🔥 خبر عاجل وهام (Breaking)' : 'Breaking'}</option>
                <option value="announcement">{isArabic ? '📢 إعلان وتحديث نظام (Update)' : 'System Announcement'}</option>
                <option value="promo">{isArabic ? '⚡ ترقية وعرض خاص (Promo)' : 'Special Feature'}</option>
              </select>
            </div>

          </div>

          {/* Notification Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isArabic ? 'نص ومحتوى الإشعار:' : 'Notification Message Content:'}
            </label>
            <textarea
              rows={2}
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              placeholder={isArabic ? 'اكتب الرسالة التي ستظهر في الإشعار الفوري للمستخدمين...' : 'Notification text...'}
              className="w-full p-4 bg-black/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            
            {/* Action Label */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isArabic ? 'نص زر الإجراء (اختياري):' : 'Action Button Label:'}
              </label>
              <input
                type="text"
                value={notifActionLabel}
                onChange={(e) => setNotifActionLabel(e.target.value)}
                placeholder={isArabic ? 'مثال: تثبيت التطبيق الآن 📱' : 'e.g. Install App Now'}
                className="w-full px-3.5 py-2.5 bg-black/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Action URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isArabic ? 'رابط الإجراء (URL أو #install):' : 'Action Link URL:'}
              </label>
              <input
                type="text"
                value={notifActionUrl}
                onChange={(e) => setNotifActionUrl(e.target.value)}
                placeholder="#install"
                className="w-full px-3.5 py-2.5 bg-black/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Sound Toggle & Send Button */}
            <div className="flex items-end gap-3">
              <button
                type="button"
                onClick={() => setNotifSound(!notifSound)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  notifSound ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                title="تفعيل رنة الإشعار"
              >
                {notifSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{notifSound ? 'صوت مفعل' : 'صامت'}</span>
              </button>

              <button
                type="submit"
                disabled={isSendingNotif}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSendingNotif ? (isArabic ? 'جاري الإرسال...' : 'Sending...') : (isArabic ? 'إرسال الإشعار لجميع الزوار الآن' : 'Dispatch Notification Now')}</span>
              </button>
            </div>

          </div>
        </form>

        {/* List of past notifications */}
        {sentNotifications.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>{isArabic ? `الإشعارات المرسلة سابقاً (${sentNotifications.length})` : `Dispatched Notifications (${sentNotifications.length})`}</span>
              <button
                onClick={handleClearAllNotifications}
                className="text-rose-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isArabic ? 'مسح كل الإشعارات' : 'Clear All'}
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {sentNotifications.slice(0, 5).map((sn) => (
                <div key={sn.id} className="p-3 bg-black/40 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h5 className="font-bold text-white text-xs">{sn.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate max-w-md">{sn.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {new Date(sn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Part 2: Broadcast Marquee Banner & Audio Stream Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 space-y-6 shadow-2xl">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  {isArabic ? 'شريط الإذاعة المتحرك والبث الصوتي المباشر' : 'Live Audio Station & Top Marquee'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isArabic ? 'التحكم بالشريط الإخباري العلوي وإذاعة الراديو المباشرة لجميع الزوار.' : 'Broadcast live news banner and audio station.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/50 px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-slate-300">
                {isArabic ? 'حالة الإذاعة:' : 'Status:'}
              </span>
              <button
                type="button"
                onClick={() => setBroadcastForm(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                  broadcastForm.enabled 
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/40 animate-pulse' 
                    : 'bg-rose-900/60 text-rose-300 border border-rose-700/40'
                }`}
              >
                {broadcastForm.enabled ? (isArabic ? 'مفعلة (ON AIR)' : 'ON AIR') : (isArabic ? 'معطلة (OFF)' : 'OFF')}
              </button>
            </div>
          </div>

          {/* Broadcast Message Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>{isArabic ? 'نص شريط الإذاعة المباشر:' : 'Broadcast Marquee Text:'}</span>
              </span>
            </label>

            <textarea
              rows={3}
              value={broadcastForm.message}
              onChange={(e) => setBroadcastForm(prev => ({ ...prev, message: e.target.value }))}
              placeholder={isArabic ? 'اكتب النص الذي سيتحرك في شريط الإذاعة أعلى الصفحة...' : 'Type marquee message...'}
              className="w-full p-4 rounded-2xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all font-medium"
            />
          </div>

          {/* Radio Stream URL & Station Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-purple-400" />
                <span>{isArabic ? 'رابط محطة الراديو الصوتية:' : 'Radio Stream URL:'}</span>
              </label>
              <input
                type="text"
                value={broadcastForm.audioStreamUrl || ''}
                onChange={(e) => setBroadcastForm(prev => ({ ...prev, audioStreamUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                {isArabic ? 'اسم محطة الراديو:' : 'Radio Station Name:'}
              </label>
              <input
                type="text"
                value={broadcastForm.radioStationName || ''}
                onChange={(e) => setBroadcastForm(prev => ({ ...prev, radioStationName: e.target.value }))}
                placeholder={isArabic ? 'مثال: إذاعة القرآن الكريم' : 'Station Name...'}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Preset Stations */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-400">{isArabic ? 'محطات راديو جاهزة للبث المباشر:' : 'Preset Live Stations:'}</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {RADIO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setBroadcastForm(prev => ({ ...prev, audioStreamUrl: p.url, radioStationName: p.name, type: 'radio', enabled: true }))}
                  className="p-2.5 rounded-xl bg-black/40 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-300 transition-all text-right flex items-center gap-2"
                >
                  <span className="text-base">{p.icon}</span>
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Update Button */}
          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onSaveBroadcast}
              disabled={isPublishingBroadcast}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Radio className="w-5 h-5" />
              <span>{isPublishingBroadcast ? (isArabic ? 'جاري البث والتحديث...' : 'Publishing...') : (isArabic ? 'نشر وتحديث شريط الإذاعة الآن' : 'Publish Broadcast Updates')}</span>
            </button>
          </div>

        </div>

        {/* Right 1 Col: Preview */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {isArabic ? 'معاينة البث المباشر' : 'Live Banner Preview'}
            </h4>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-bold text-amber-400 uppercase">
                  {broadcastForm.type.toUpperCase()} ON AIR
                </span>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {broadcastForm.message || 'نص الإذاعة سيظهر هنا...'}
              </p>
              {broadcastForm.audioStreamUrl && (
                <div className="p-2.5 rounded-xl bg-black/60 border border-purple-500/30 flex items-center justify-between text-xs text-purple-300">
                  <div className="flex items-center gap-2 truncate">
                    <Music className="w-4 h-4 shrink-0 text-purple-400" />
                    <span className="truncate">{broadcastForm.radioStationName || 'راديو مباشر'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">4K AUDIO</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">💡 نصيحة للمطور:</p>
            <p>يمكنك تغيير شريط الإذاعة في أي وقت لتنبيه المستخدمين بالتحديثات أو لإذاعة محطات صوتية أثناء التحميل.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
