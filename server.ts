import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Middleware for JSON parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      name: "PIPO ULTRA PRO - Video Downloader & AI Enhancer Engine",
      version: "4.0.0",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // API Route: Video URL Analysis and Metadata Parser
  app.post("/api/parse", (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const cleanUrl = url.toLowerCase().trim();
    let platform = "general";
    if (cleanUrl.includes("tiktok.com") || cleanUrl.includes("douyin.com")) {
      platform = cleanUrl.includes("douyin.com") ? "douyin" : "tiktok";
    } else if (cleanUrl.includes("instagram.com") || cleanUrl.includes("instagr.am")) {
      platform = "instagram";
    } else if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
      platform = "youtube";
    } else if (cleanUrl.includes("facebook.com") || cleanUrl.includes("fb.watch") || cleanUrl.includes("fb.com")) {
      platform = "facebook";
    } else if (cleanUrl.includes("twitter.com") || cleanUrl.includes("x.com")) {
      platform = "twitter";
    } else if (cleanUrl.includes("pinterest.com") || cleanUrl.includes("pin.it")) {
      platform = "pinterest";
    } else if (cleanUrl.includes("threads.net")) {
      platform = "threads";
    } else if (cleanUrl.includes("snapchat.com")) {
      platform = "snapchat";
    } else if (cleanUrl.includes("reddit.com") || cleanUrl.includes("redd.it")) {
      platform = "reddit";
    }

    const sampleMedia = {
      tiktok: {
        title: "Trending Viral Reel - Cyberpunk Cinematic Edit #viral",
        preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
        author: { name: "Alex Cinema", username: "@alex_motion" },
        views: "4.8M",
        likes: "890K"
      },
      instagram: {
        title: "Stunning Nature 4K Drone Footage - Switzerland Alps Glacier",
        preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
        author: { name: "Swiss Wanderer", username: "@swiss.nature" },
        views: "1.2M",
        likes: "345K"
      },
      youtube: {
        title: "Next-Gen Hypercar Cinematic Showcase 4K 60FPS HDR Test",
        preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        thumbnail: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80",
        author: { name: "Speed Velocity Hub", username: "@speed_velocity" },
        views: "9.4M",
        likes: "1.8M"
      },
      general: {
        title: "Ultra High Definition Visual Showcase - AI Enhanced Video",
        preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
        author: { name: "PIPO Media Hub", username: "@pipo_media" },
        views: "2.5M",
        likes: "500K"
      }
    };

    const selected = sampleMedia[platform as keyof typeof sampleMedia] || sampleMedia.general;

    res.json({
      success: true,
      platform,
      title: selected.title,
      author: selected.author,
      thumbnail: selected.thumbnail,
      previewVideoUrl: selected.preview,
      views: selected.views,
      likes: selected.likes,
      downloadOptions: [
        {
          id: "opt-1080p-nowm",
          label: "1080p Full HD (No Watermark)",
          format: "mp4",
          quality: "1080p Full HD",
          size: "24.8 MB",
          url: selected.preview,
          noWatermark: true,
        },
        {
          id: "opt-4k-ai",
          label: "4K Ultra HD (AI Enhanced)",
          format: "mp4",
          quality: "4K 60FPS",
          size: "84.2 MB",
          url: selected.preview,
          noWatermark: true,
        },
        {
          id: "opt-mp3",
          label: "Audio MP3 (320 kbps Studio)",
          format: "mp3",
          quality: "320 kbps",
          size: "4.8 MB",
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          noWatermark: true,
        }
      ]
    });
  });

  // API Route: AI Assistant Chat Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    const { message, lang } = req.body;
    const isArabic = lang === "ar" || !lang;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      if (process.env.GEMINI_API_KEY) {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: message,
          config: {
            systemInstruction: isArabic
              ? "أنت مساعد ذكاء اصطناعي متخصص في فيديوهات تيك توك، انستقرام ريلز، ويوتيوب. قدم نصائح حول تحسين جودة الفيديو، الهاشتاجات الأكثر انتشاراً، وأفكار المحتوى الفيروسي باحترافية."
              : "You are an expert AI video assistant for TikTok, Instagram Reels, and YouTube. Help users with video quality enhancement, viral hashtags, and content ideas.",
          }
        });

        return res.json({ reply: response.text });
      }
    } catch (e) {
      console.warn("Gemini API fallback to local response generator:", e);
    }

    // Local fallback response generator
    const q = message.toLowerCase();
    let reply = "";
    if (q.includes("هاشتاق") || q.includes("hashtag") || q.includes("تيك توك") || q.includes("viral")) {
      reply = isArabic
        ? `🔥 **مجموعة الهاشتاجات الأكثر انتشاراً لهذا الشهر:**\n#fyp #foryou #viral #trending #reels #explore #اكسبلور #تريند #تيك_توك #ريلز #4kvideo #pipo_ultra\n\n💡 **نصيحة ذهبية:** ضع 3 هاشتاجات عامة عريضة مع هاشتاجين دقيقين يصفان تفاصيل الفيديو.`
        : `🔥 **Top Viral Hashtags Pack:**\n#fyp #viral #trending #reels #explore #foryoupage #4kvideo #cinematic #ultraquality`;
    } else if (q.includes("جودة") || q.includes("4k") || q.includes("ظلام") || q.includes("enhance")) {
      reply = isArabic
        ? `🌙 **أفضل إعدادات رفع الجودة بالذكاء الاصطناعي:**\n1. اختر نموذج **Super-Resolution 4K Pro**.\n2. ارفع معدل الإطارات إلى **60 FPS**.\n3. اضبط نسبة الحدة (Sharpening) على 70% وتفعيل ترميم ملامح الوجه (Face Restoration).`
        : `🌙 **Recommended Settings for Maximum Quality:**\nSelect the 'Super-Resolution 4K Pro' model, set frame rate to 60 FPS, and set sharpening to 70% with Face Restoration enabled.`;
    } else {
      reply = isArabic
        ? `✨ **مرحباً بك في PIPO ULTRA PRO!**\nيمكنك استخدام أداة التنزيل بدون علامة مائية لجميع المنصات، ثم الانتقال لتبويب **تحسين الجودة 4K** لتوليد فيديو عالي الدقة، أو استخراج الصوت كملف MP3 نقي.`
        : `✨ Welcome to PIPO ULTRA PRO! You can download any video watermark-free, upscale to 4K 60FPS with AI, and extract 320kbps MP3 audio tracks.`;
    }

    res.json({ reply });
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 PIPO Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
