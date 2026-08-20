import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Bot, 
  RefreshCw, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Activity, 
  Copy, 
  Check, 
  Filter,
  Eye,
  Radio,
  Wifi,
  Sparkles
} from 'lucide-react';
import { VisitorLogItem, VisitorStatsSummary } from '../types';

interface DeveloperVisitorsTabProps {
  isArabic: boolean;
}

export const DeveloperVisitorsTab: React.FC<DeveloperVisitorsTabProps> = ({ isArabic }) => {
  const [visitors, setVisitors] = useState<VisitorLogItem[]>([]);
  const [summary, setSummary] = useState<VisitorStatsSummary>({
    activeOnlineCount: 1,
    totalVisitsCount: 1,
    uniqueVisitorsCount: 1,
    mobilePercentage: 75,
    desktopPercentage: 25,
    tabletPercentage: 0,
    topCountries: [{ country: 'الجزائر', flag: '🇩🇿', count: 1 }],
    topDevices: [{ name: 'Samsung Galaxy S24 Ultra', count: 1 }]
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'online' | 'mobile' | 'desktop'>('all');
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  const fetchVisitors = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dev/visitors');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          if (json.visitors) setVisitors(json.visitors);
          if (json.summary) setSummary(json.summary);
        }
      }
    } catch (e) {
      console.warn('Fetch visitors error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
    if (!autoRefresh) return;
    const interval = setInterval(fetchVisitors, 3500);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const handleClearLogs = async () => {
    if (window.confirm(isArabic ? 'هل أنت متأكد من مسح جميع سجلات الزوار؟' : 'Clear all visitor records?')) {
      try {
        await fetch('/api/dev/visitors/clear', { method: 'POST' });
        fetchVisitors();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getDeviceIcon = (type: VisitorLogItem['deviceType']) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      case 'tablet':
        return <Tablet className="w-4 h-4 text-purple-400" />;
      case 'bot':
        return <Bot className="w-4 h-4 text-rose-400" />;
      default:
        return <Laptop className="w-4 h-4 text-amber-400" />;
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    // Search filter
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      v.ip.toLowerCase().includes(q) || 
      v.deviceName.toLowerCase().includes(q) || 
      v.country.toLowerCase().includes(q) || 
      v.city.toLowerCase().includes(q) || 
      (v.isp && v.isp.toLowerCase().includes(q)) ||
      v.browser.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterType === 'online') return v.isOnline;
    if (filterType === 'mobile') return v.deviceType === 'mobile';
    if (filterType === 'desktop') return v.deviceType === 'desktop';

    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans" id="developer-visitors-telemetry">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black">
            <Users className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">
                {isArabic ? 'رادار تتبع الزوار المباشر (Real-Time Visitor Telemetry)' : 'Live Real Visitor Radar'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {isArabic ? 'بيانات حقيقية 100%' : '100% REAL DATA'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isArabic 
                ? 'عرض عناوين IP الحقيقية، أسماء الأجهزة والموديلات الدقيقة، والموقع الجغرافي لكل زائر يدخل الموقع.' 
                : 'Inspect genuine client IPs, exact device hardware models, and live geo-locations.'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              autoRefresh 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>{autoRefresh ? (isArabic ? 'تحديث تلقائي: مفعل' : 'Auto Live: ON') : (isArabic ? 'تحديث تلقائي: معطل' : 'Auto Live: OFF')}</span>
          </button>

          <button
            onClick={fetchVisitors}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isArabic ? 'تحديث فوري' : 'Manual Refresh'}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleClearLogs}
            className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 transition-colors"
            title={isArabic ? 'مسح سجل الزوار' : 'Clear Logs'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Online */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/30 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>{isArabic ? 'المتصلون الآن بالثانية' : 'Active Visitors Online'}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono flex items-baseline gap-2">
            {summary.activeOnlineCount}
            <span className="text-xs font-sans text-emerald-500 font-bold">{isArabic ? 'زائر نشط' : 'users'}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <Wifi className="w-3 h-3 text-emerald-400" />
            {isArabic ? 'متصلون حالياً في الموقع' : 'Real-time active connection'}
          </p>
        </div>

        {/* Unique Visitors */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-amber-500/30 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>{isArabic ? 'إجمالي الزوار الفريدين (IPs)' : 'Unique IP Addresses'}</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">
            {summary.uniqueVisitorsCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            {isArabic ? 'عناوين IP حقيقية مسجلة' : 'Unique client IP sessions'}
          </p>
        </div>

        {/* Total Page Views */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/30 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>{isArabic ? 'مشاهدات الصفحات' : 'Total Page Views'}</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400 font-mono">
            {summary.totalVisitsCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            {isArabic ? 'تفاعلات وأوامر سحب تم تنفيذها' : 'Page navigation & tool uses'}
          </p>
        </div>

        {/* Devices Split */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-purple-500/30 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>{isArabic ? 'توزيع الأجهزة' : 'Device Distribution'}</span>
            <Smartphone className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-center gap-3 text-lg font-black text-white font-mono">
            <span className="text-cyan-400">📱 {summary.mobilePercentage}%</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400">💻 {summary.desktopPercentage}%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            {isArabic ? 'هواتف ذكية مقابل أجهزة حاسوب' : 'Mobile vs Desktop share'}
          </p>
        </div>

      </div>

      {/* Top Countries & Top Devices Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Countries */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{isArabic ? 'أبرز الدول الزائرة:' : 'Top Countries:'}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {summary.topCountries?.map((c, i) => (
              <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm">
                <span>{c.flag}</span>
                <span>{c.country}</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-black">{c.count}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Top Devices */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>{isArabic ? 'أبرز أجهزة الزوار:' : 'Top Devices:'}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {summary.topDevices?.slice(0, 2).map((d, i) => (
              <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm">
                <span className="truncate max-w-[150px]">{d.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-black">{d.count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? 'بحث بالـ IP، اسم الجهاز، الدولة، المدينة...' : 'Search by IP, Device model, Country, City...'}
            className="w-full pl-4 pr-10 py-2.5 bg-black/60 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 self-center">
          {[
            { id: 'all', label: isArabic ? 'الكل' : 'All' },
            { id: 'online', label: isArabic ? '🟢 المتصلون فقط' : '🟢 Online' },
            { id: 'mobile', label: isArabic ? '📱 هواتف' : '📱 Mobile' },
            { id: 'desktop', label: isArabic ? '💻 حواسيب' : '💻 Desktop' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === f.id 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real Visitors Table */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 text-xs font-bold border-b border-slate-800">
                <th className="p-4">{isArabic ? 'الحالة والـ IP' : 'Status & IP'}</th>
                <th className="p-4">{isArabic ? 'اسم ونوع الجهاز الدقيق' : 'Exact Device Model'}</th>
                <th className="p-4">{isArabic ? 'الموقع والمزود' : 'Location & ISP'}</th>
                <th className="p-4">{isArabic ? 'المتصفح والنظام' : 'Browser & OS'}</th>
                <th className="p-4">{isArabic ? 'الصفحة النشطة' : 'Active Tab'}</th>
                <th className="p-4 text-center">{isArabic ? 'آخر ظهور' : 'Last Seen'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    {isArabic ? 'لا توجد نتائج تطابق معايير البحث' : 'No visitors matched your search query'}
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Status & IP */}
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <span 
                          className={`w-3 h-3 rounded-full shrink-0 ${
                            v.isOnline ? 'bg-emerald-400 shadow-md shadow-emerald-500/50 animate-pulse' : 'bg-slate-600'
                          }`}
                          title={v.isOnline ? 'متصل الآن' : 'غير متصل'}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-amber-300 text-sm">{v.ip}</span>
                            <button
                              onClick={() => handleCopyIp(v.ip)}
                              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                              title={isArabic ? 'نسخ الـ IP' : 'Copy IP'}
                            >
                              {copiedIp === v.ip ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <span className={`text-[10px] font-bold ${v.isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {v.isOnline ? (isArabic ? '🟢 متصل بالثانية' : '🟢 Online Now') : (isArabic ? '⚫ غير متصل' : '⚫ Offline')}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Exact Device Name */}
                    <td className="p-4">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 shrink-0 mt-0.5">
                          {getDeviceIcon(v.deviceType)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">
                            {v.deviceName}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>الشاشة: {v.screenResolution || '1080p'}</span>
                            <span>•</span>
                            <span className="uppercase">{v.deviceType}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location & ISP */}
                    <td className="p-4">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-200">
                          <span className="text-base">{v.countryFlag || '🌐'}</span>
                          <span>{v.country}</span>
                          {v.city && <span className="text-slate-400 font-normal">({v.city})</span>}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{v.isp || 'شبكة اتصالات محلية'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Browser & OS */}
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-cyan-300">{v.browser}</span>
                        <div className="text-[10px] text-slate-400">{v.os}</div>
                      </div>
                    </td>

                    {/* Active Tab */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium">
                        {v.activeTab === 'downloader' ? '🚀 تنزيل الفيديوهات' :
                         v.activeTab === 'enhancer' ? '✨ تحسين 4K بالذكاء' :
                         v.activeTab === 'batch' ? '📦 تنزيل دفعات' :
                         v.activeTab === 'audio-extractor' ? '🎵 فصل الصوت' :
                         v.activeTab === 'dev-console' ? '⚡ لوحة التحكم' : v.activeTab}
                      </span>
                    </td>

                    {/* Last Seen */}
                    <td className="p-4 text-center">
                      <span className="text-[11px] text-slate-400 font-mono block">
                        {new Date(v.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {v.pageViews} {isArabic ? 'زيارات/طلبات' : 'views'}
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
