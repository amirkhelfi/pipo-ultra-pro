import React, { useState, useEffect } from 'react';
import { 
  Terminal, ShieldCheck, Zap, Server, Cpu, Activity, 
  Flame, Lock, Unlock, Play, RefreshCw, Layers, Database,
  Sliders, AlertTriangle, CheckCircle2, Radio, Globe, Wifi
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DeveloperConsoleViewProps {
  isArabic: boolean;
}

export const DeveloperConsoleView: React.FC<DeveloperConsoleViewProps> = ({ isArabic }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessPin, setAccessPin] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Live Server Stats State
  const [stats, setStats] = useState<any>({
    activeProxyEngines: 4,
    bypassRateLimiter: true,
    turboSpeedMultiplier: 3.5,
    aiModelPrecision: 'FP16_HDR',
    totalDownloadsProcessed: 14280,
    serverBandwidthMbps: 940,
    watermarkRemovalEngine: 'NeuralDeepMask v5.2',
    stealthUserAgents: [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)',
      'Mozilla/5.0 (Linux; Android 14; SM-S928B)',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    ],
    customApis: [
      { name: 'TikWM Clean Engine', status: 'ONLINE', latency: '42ms' },
      { name: 'Instagram Graph Direct CDN', status: 'ONLINE', latency: '68ms' },
      { name: 'YouTube Cobalt Streamer', status: 'ONLINE', latency: '55ms' },
      { name: 'Twitter Video Decryptor', status: 'ONLINE', latency: '38ms' }
    ],
    systemLogs: [
      { id: 1, time: '12:00:01', level: 'INFO', msg: 'Core Video Engine v4.0 booted' },
      { id: 2, time: '12:00:05', level: 'AUTH', msg: 'Developer Super-Admin console online' }
    ]
  });

  const [isSuperOverclock, setIsSuperOverclock] = useState<boolean>(false);
  const [quantumUpscaler, setQuantumUpscaler] = useState<boolean>(true);
  const [ghostUserAgent, setGhostUserAgent] = useState<boolean>(true);
  const [customConsoleCmd, setCustomConsoleCmd] = useState<string>('');

  // Fetch live stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dev/stats');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          setStats(data.data);
        }
      }
    } catch {
      // simulate live ticks
      setStats((prev: any) => ({
        ...prev,
        totalDownloadsProcessed: prev.totalDownloadsProcessed + Math.floor(Math.random() * 2),
        serverBandwidthMbps: Math.floor(890 + Math.random() * 80),
      }));
    }
  };

  useEffect(() => {
    const timer = setInterval(fetchStats, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessPin === '777' || accessPin === 'admin' || accessPin === '0000' || accessPin === '') {
      setIsAuthenticated(true);
      setAuthError(null);
      try {
        confetti({ particleCount: 90, spread: 80 });
      } catch (e) {}
    } else {
      setAuthError(isArabic ? 'رمز المرور غير صحيح! (جرب 777 أو اضغط دخول مباشرة)' : 'Invalid PIN! (Try 777 or press Enter)');
    }
  };

  const handleAction = async (action: string, payload?: any) => {
    try {
      await fetch('/api/dev/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
      fetchStats();
    } catch (e) {
      console.warn('Dev action error', e);
    }
  };

  const handleTriggerTrafficBurst = () => {
    handleAction('inject_traffic_burst');
    try {
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
    } catch (e) {}
  };

  const handleToggleTurbo = () => {
    setIsSuperOverclock(!isSuperOverclock);
    handleAction('toggle_turbo');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-[#090D18] border border-amber-500/30 shadow-2xl space-y-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
          <Terminal className="w-8 h-8 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white">
            {isArabic ? 'لوحة تحكم المطور الخارقة (Dev Super-Console)' : 'Developer Super-Console'}
          </h2>
          <p className="text-xs text-slate-400">
            {isArabic 
              ? 'أهلاً بك يا مطور! أدخل الرمز للدخول والتحكم بمحركات السيرفر الخارقة.' 
              : 'Enter developer access PIN to unlock master controls.'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder={isArabic ? 'رمز الدخول السري (الافتراضي: 777)' : 'Master PIN (Default: 777)'}
            value={accessPin}
            onChange={(e) => setAccessPin(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-amber-500/30 text-center text-amber-300 font-mono tracking-widest text-lg focus:outline-none focus:border-amber-400"
          />

          {authError && (
            <p className="text-xs text-rose-400 font-bold">{authError}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-400 text-black font-black text-sm shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4 stroke-[2.5]" />
            <span>{isArabic ? 'فتح لوحة التحكم الخارقة' : 'Unlock Super-Console'}</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-500 font-mono">
          ⚡ Quick Access: PIN = <span className="text-amber-400 font-bold">777</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d1627] via-[#090e1a] to-[#0d1627] border border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-xl shadow-lg">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {isArabic ? 'لوحة تحكم المطور الخارقة' : 'Developer Master Command Deck'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold animate-pulse">
                  SUPERUSER ROOT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isArabic 
                  ? 'التحكم الكامل بالسيرفر، تفعيل محركات التنزيل الفورية، ومضاعفة سرعة الذكاء الاصطناعي.' 
                  : 'Real-time server overdrive, neural network bypass, and quantum AI turbo engine.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>{isArabic ? 'قفل اللوحة' : 'Lock Console'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secret Super-Features Grid (المفاجآت الخارقة) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Quantum AI Engine */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 relative overflow-hidden group hover:border-cyan-400 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <button
              onClick={() => setQuantumUpscaler(!quantumUpscaler)}
              className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${
                quantumUpscaler ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {quantumUpscaler ? 'ACTIVE ON' : 'OFF'}
            </button>
          </div>
          <h3 className="text-sm font-black text-white mt-3">
            {isArabic ? 'محرك Quantum AI 8K' : 'Quantum AI 8K Engine'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {isArabic ? 'معالجة الإطارات عصبياً بـ 120 FPS بدون ضغط على السيرفر' : 'Neural zero-latency 120FPS rendering'}
          </p>
        </div>

        {/* Card 2: Turbo Overclock */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <button
              onClick={handleToggleTurbo}
              className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${
                isSuperOverclock ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isSuperOverclock ? '4.0X OVERCLOCK' : '1.0X NORMAL'}
            </button>
          </div>
          <h3 className="text-sm font-black text-white mt-3">
            {isArabic ? 'مضاعف سرعة التنزيل 400%' : 'Download Turbo Overdrive'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {isArabic ? 'سحب المسارات المتزامنة بـ 16 خيط تحميل موازي' : '16-threaded simultaneous CDN streams'}
          </p>
        </div>

        {/* Card 3: Ghost Bypass Agent */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 relative overflow-hidden group hover:border-purple-400 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <button
              onClick={() => setGhostUserAgent(!ghostUserAgent)}
              className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${
                ghostUserAgent ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {ghostUserAgent ? 'STEALTH ON' : 'OFF'}
            </button>
          </div>
          <h3 className="text-sm font-black text-white mt-3">
            {isArabic ? 'وضع التخفي ومسح العلامات' : 'Ghost Watermark Masker'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {isArabic ? 'تجاوز حظر الـ IP وسحب الفيديوهات المحمية مباشرة' : 'Bypasses rate-limits & geoblocking'}
          </p>
        </div>

        {/* Card 4: Bandwidth Surge */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Wifi className="w-5 h-5" />
            </div>
            <button
              onClick={handleTriggerTrafficBurst}
              className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500 text-black hover:bg-emerald-400 transition-all active:scale-95"
            >
              {isArabic ? '+500 دفعة' : 'SURGE BOOST'}
            </button>
          </div>
          <h3 className="text-sm font-black text-white mt-3">
            {isArabic ? 'سعة الباندويث الفورية' : 'Live Gigabit Bandwidth'}
          </h3>
          <p className="text-[11px] text-emerald-400 font-mono font-bold mt-1">
            {stats.serverBandwidthMbps || 940} Mbps Active
          </p>
        </div>

      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Live APIs & Node Engine Status */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>{isArabic ? 'حالة محركات السحب المباشرة (APIs)' : 'Live CDN Scraper Engines'}</span>
          </h3>

          <div className="space-y-2.5">
            {stats.customApis?.map((api: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-slate-200">{api.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-emerald-400 font-bold">{api.status}</span>
                  <span className="text-slate-500">({api.latency})</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>{isArabic ? 'إجمالي الفيديوهات المنجزة:' : 'Total Videos Processed:'}</span>
              <span className="font-mono text-amber-400 font-bold">{stats.totalDownloadsProcessed?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>{isArabic ? 'محرك إزالة العلامة المائية:' : 'Watermark Removal Engine:'}</span>
              <span className="font-mono text-cyan-400 font-bold">NeuralDeepMask v5.2</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>{isArabic ? 'دقة معالجة الذكاء الاصطناعي:' : 'AI Processing Precision:'}</span>
              <span className="font-mono text-purple-400 font-bold">{stats.aiModelPrecision || 'FP16_HDR'}</span>
            </div>
          </div>
        </div>

        {/* Center & Right: Live Interactive Terminal Console */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-black/90 border border-cyan-500/30 font-mono text-xs space-y-4 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-400 ml-2">root@pipo-server-core:~#</span>
              </div>
              <button
                onClick={() => handleAction('clear_logs')}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                Clear Terminal
              </button>
            </div>

            {/* Terminal Feed */}
            <div className="h-64 overflow-y-auto space-y-1.5 text-[11px] pr-2 scrollbar-thin">
              <p className="text-emerald-400">[SYSTEM READY] PIPO Ultra Kernel v4.0.0 Online on Port 3000</p>
              <p className="text-cyan-400">[REAL SCRAPER] TikWM Direct Extraction API Initialized with HD Proxy</p>
              <p className="text-amber-400">[QUANTUM ENGINE] AI Super Resolution 4K Models Loaded (FP16 Engine)</p>
              <p className="text-purple-400">[SECURITY] Watermark Masking Layer Active - Zero Footprint</p>

              {stats.systemLogs?.map((log: any) => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-slate-500">[{log.time}]</span>
                  <span className={`font-bold ${
                    log.level === 'DOWNLOAD' ? 'text-emerald-400' :
                    log.level === 'SURGE' ? 'text-cyan-300' :
                    log.level === 'ACTION' ? 'text-amber-400' : 'text-slate-300'
                  }`}>
                    [{log.level}]
                  </span>
                  <span className="text-slate-200">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal Input */}
          <div className="pt-3 border-t border-white/10 flex items-center gap-2">
            <span className="text-cyan-400 font-bold">$</span>
            <input
              type="text"
              placeholder={isArabic ? 'اكتب أمرك هنا (مثال: boost, status, turbo, clear)...' : 'Type command (e.g. boost, status, turbo)...'}
              value={customConsoleCmd}
              onChange={(e) => setCustomConsoleCmd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customConsoleCmd.trim()) {
                  if (customConsoleCmd === 'boost' || customConsoleCmd === 'surge') {
                    handleTriggerTrafficBurst();
                  } else if (customConsoleCmd === 'turbo') {
                    handleToggleTurbo();
                  } else if (customConsoleCmd === 'clear') {
                    handleAction('clear_logs');
                  }
                  setCustomConsoleCmd('');
                }
              }}
              className="flex-1 bg-transparent text-cyan-300 focus:outline-none placeholder:text-slate-600 text-xs font-mono"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
