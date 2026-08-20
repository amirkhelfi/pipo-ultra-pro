import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, Film, Tag, Lightbulb, Copy, Check } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIVideoAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  isArabic,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: isArabic
        ? 'مرحباً بك في PIPO AI Video Assistant! 🎬 أنا مساعدك الذكي لتوليد الهاشتاجات الفيروسية، تحسين جودة الفيديوهات بالذكاء الاصطناعي، واقتراح أفكار المحتوى. كيف أساعدك اليوم؟'
        : 'Welcome to PIPO AI Video Assistant! 🎬 I can help generate viral hashtags, optimize video enhancement settings, or suggest content ideas. How can I help you?',
      timestamp: 'الآن',
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickPrompts = [
    { text: isArabic ? 'أفضل هاشتاجات تيك توك تريند 2026' : 'Top trending TikTok hashtags', icon: Tag },
    { text: isArabic ? 'كيف أرفع جودة فيديو مصور في الظلام؟' : 'Best settings for dark videos', icon: Film },
    { text: isArabic ? 'أفكار عناوين جذابة لريلز انستقرام' : 'Catchy hook ideas for Reels', icon: Lightbulb },
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = '';
      const q = query.toLowerCase();

      if (q.includes('هاشتاق') || q.includes('تيك توك') || q.includes('hashtag')) {
        aiReply = isArabic ? `🔥 **مجموعة الهاشتاجات الأكثر انتشاراً (Viral Pack):**
#fyp #foryou #viral #trending #reels #explore #اكسبلور #تريند #تيك_توك #ريلز #فيديو_عالي_الجودة #4kvideo #pipo_ultra

💡 **نصيحة PIPO:** ادمج دائماً 3 هاشتاجات عامة مع 2 هاشتاج دقيقين يصفان محتوى الفيديو لتحقيق أعلى معدل وصول (Reach).` : `🔥 **Top Viral Hashtags Pack:**
#fyp #viral #trending #reels #explore #foryoupage #4kvideo #cinematic #ultraquality`;
      } else if (q.includes('ظلام') || q.includes('ليل') || q.includes('جودة') || q.includes('dark')) {
        aiReply = isArabic ? `🌙 **أفضل إعدادات لتحسين الفيديوهات الليلية والضعيفة:**
1. اختر نموذج **"AI Night Denoise & Enhancer"**.
2. اضبط الدقة على **4K UHD** مع تفعيل **AI Deblur**.
3. ارفع نسبة **التباين (Contrast)** بمقدار +15% و **حدة التفاصيل (Sharpening)** إلى 75%.
4. فعّل خيار **ترميم الوجوه (Face Detailer)** لإبراز ملامح الشخصيات بوضوح فائق.` : `🌙 **Recommended Settings for Dark Footage:**
Use the 'AI Night Denoise' model, set upscale to 4K, boost contrast by +15% and set sharpening to 75%.`;
      } else {
        aiReply = isArabic ? `✨ **خدمات PIPO ULTRA PRO الذكية:**
يمكنك تنزيل أي فيديو بدون علامة مائية من تيك توك وانستقرام ويوتيوب ثم الانتقال فوراً لتبويب **"تحسين الجودة بالذكاء الاصطناعي"** لتحويله إلى تحفة بصرية بدقة 4K 60FPS!` : `✨ You can download any video without watermark and upscale it to 4K 60FPS using our neural engine!`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg h-[600px] rounded-3xl bg-[#0b101c] border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-black flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>{isArabic ? 'مساعد PIPO AI للفيديو' : 'PIPO AI Video Assistant'}</span>
                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-bold">PRO</span>
              </h3>
              <p className="text-[10px] text-slate-400">
                {isArabic ? 'هاشتاجات، تحسين جودة، وأفكار محتوى' : 'Hashtags, AI Upscaling & Content Ideas'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                m.sender === 'user' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-cyan-400'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-black font-bold rounded-tr-none shadow-md'
                  : 'bg-slate-900 text-slate-200 border border-white/10 rounded-tl-none whitespace-pre-line'
              }`}>
                {m.text}
                <div className={`text-[9px] mt-1 text-right ${m.sender === 'user' ? 'text-black/70' : 'text-slate-500'}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-900/60 p-3 rounded-2xl w-fit border border-white/5">
              <Bot className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span>{isArabic ? 'جاري صياغة الإجابة الذكية...' : 'Analyzing & generating answer...'}</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-2 border-t border-white/5 bg-slate-950/60 overflow-x-auto flex gap-1.5 scrollbar-none">
          {quickPrompts.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(p.text)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 text-[11px] font-medium whitespace-nowrap flex items-center gap-1 transition-all"
              >
                <Icon className="w-3 h-3 text-cyan-400" />
                <span>{p.text}</span>
              </button>
            );
          })}
        </div>

        {/* Input Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-900 border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isArabic ? 'اكتب سؤالك أو اطلب هاشتاجات لفيديوهاتك...' : 'Ask question or request hashtags for your video...'}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-bold shadow-md transition-all active:scale-95"
          >
            <Send className="w-4 h-4 fill-current rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
