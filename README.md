# PIPO ULTRA PRO 🎬✨
### Universal Video Downloader (No Watermark) & 4K AI Video Enhancer
**تطبيق ومنصة تنزيل الفيديوهات بدون علامة مائية ورفع الجودة بالذكاء الاصطناعي إلى 4K 60FPS**

---

## 🌟 Features / المميزات الرئيسية

1. **Universal No-Watermark Downloader (تنزيل بدون علامة مائية)**:
   - Supports: **TikTok, Instagram (Reels & Stories), YouTube (Shorts & 4K), Facebook, X (Twitter), Pinterest, Threads, Snapchat, Douyin**.
   - Multiple quality presets: **1080p Full HD**, **4K Ultra HD**, **720p Fast**, **Studio MP3 (320kbps)**, **HD Cover Thumbnail**.

2. **AI Video Enhancer & 4K Upscaler (محرك تحسين الجودة بالذكاء الاصطناعي)**:
   - **Super-Resolution 4K Pro**: Neural pixel reconstruction to 4K UHD.
   - **AI Face Restoration**: Facial enhancement & skin detail clarity.
   - **HDR Cinema Color Grade**: Dynamic range & contrast expansion.
   - **Anime & 2D Sharpener**: Edge refinement for animation.
   - **AI Night Denoise**: Low-light video grain cleaner.
   - **Real-Time Interactive Split Slider**: Compare Before & After dynamically.

3. **Studio MP3 & Audio Extractor (استخراج الصوت عالي النقاء)**:
   - Extract audio to MP3, WAV, M4A, FLAC with AI Vocal Isolation.

4. **Batch Multi-Link Downloader (تنزيل الروابط المتعددة)**:
   - Paste dozens of URLs simultaneously and download all in bulk.

5. **AI Video Assistant (مساعد الذكاء الاصطناعي)**:
   - Generates trending hashtags and optimal enhancement presets.

---

## 🚀 How to Run Locally / طريقة التشغيل على حاسوبك

### 1. Prerequisites (المتطلبات)
- [Node.js](https://nodejs.org/) version 18 or 20+
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/)

### 2. Installation (التثبيت)
```bash
# Clone the repository / استنساخ المستودع
git clone <YOUR_REPO_URL>
cd pipo-video-downloader

# Install all dependencies / تثبيت المكتبات
npm install
```

### 3. Running in Development Mode (وضع التطوير)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Start (بناء وتشغيل النسخة النهائية)
```bash
# Build the client and backend server bundle
npm run build

# Start the high-performance production server
npm start
```

---

## 📁 Project Structure / هيكل الملفات

```text
├── server.ts                   # Express Backend + Vite Middleware server
├── index.html                  # Main Web Entry point
├── package.json                # Dependencies, build & start scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite + Tailwind CSS plugin config
├── metadata.json               # Applet capabilities & metadata
├── src/
│   ├── main.tsx                # React client bootstrap
│   ├── App.tsx                 # Master application component
│   ├── index.css               # Global styling & Tailwind CSS
│   ├── types.ts                # TypeScript types & data contracts
│   ├── components/
│   │   ├── Navbar.tsx                  # Navigation header & actions
│   │   ├── VideoDownloaderView.tsx     # Watermark-free downloader
│   │   ├── AIVideoEnhancerView.tsx     # 4K AI Enhancer & split slider
│   │   ├── AudioExtractorView.tsx      # MP3 320kbps extractor
│   │   ├── BatchDownloaderView.tsx     # Bulk multi-link downloader
│   │   ├── DownloadHistoryView.tsx     # Download history manager
│   │   ├── AIVideoAssistantModal.tsx   # AI Assistant chatbot
│   │   └── ProjectExportModal.tsx      # Export & backup helper
│   └── utils/
│       ├── platformDetector.ts         # Social platform detection & scraper
│       └── aiEnhancerEngine.ts         # AI neural upscaler engine simulation
```

---

## ⚙️ Environment Variables (اختياري)
Create a `.env` file in the root directory:
```env
# Optional Gemini API Key for Server-side AI
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 📜 License
MIT License - Developed with Google AI Studio.
