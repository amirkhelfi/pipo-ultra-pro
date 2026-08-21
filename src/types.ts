export type SupportedPlatform =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'facebook'
  | 'twitter'
  | 'pinterest'
  | 'threads'
  | 'snapchat'
  | 'douyin'
  | 'reddit'
  | 'general';

export interface DownloadOption {
  id: string;
  label: string;
  format: 'mp4' | 'mp3' | 'webm' | 'jpg';
  quality: string;
  resolution?: string;
  size?: string;
  noWatermark: boolean;
  url: string;
  bitrate?: string;
  isPopular?: boolean;
}

export interface VideoInfo {
  id: string;
  url: string;
  platform: SupportedPlatform;
  title: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  thumbnail: string;
  duration?: string;
  views?: string;
  likes?: string;
  publishedAt?: string;
  options: DownloadOption[];
  previewVideoUrl?: string;
}

export interface AIEnhancementSettings {
  model: 'super_resolution' | 'anime_upscale' | 'face_restore' | 'hdr_cinema' | 'denoise_fast';
  upscaleFactor: '1080p' | '2k' | '4k' | '8k';
  targetFps: '30' | '60' | '120';
  sharpening: number; // 0 - 100
  denoising: number; // 0 - 100
  colorVibrance: number; // 0 - 100
  brightness: number; // -50 to 50
  contrast: number; // -50 to 50
  faceRestoration: boolean;
  audioDenoise: boolean;
  aiDeblur: boolean;
}

export interface EnhancementJob {
  id: string;
  originalFileName: string;
  originalFileSize: string;
  originalResolution: string;
  originalFps: number;
  originalVideoUrl: string;
  enhancedVideoUrl?: string;
  progress: number;
  status: 'idle' | 'analyzing' | 'upscaling' | 'enhancing' | 'rendering' | 'completed' | 'error';
  statusMessage: string;
  settings: AIEnhancementSettings;
  durationSeconds: number;
  processedFrames?: number;
  totalFrames?: number;
  estimatedTimeLeft?: string;
  enhancedMetrics?: {
    resolution: string;
    fps: number;
    bitrate: string;
    clarityScore: number;
    colorDepth: string;
  };
}

export interface DownloadHistoryItem {
  id: string;
  title: string;
  platform: SupportedPlatform;
  thumbnail: string;
  format: string;
  quality: string;
  downloadDate: string;
  fileSize: string;
  originalUrl: string;
  downloadUrl: string;
  noWatermark: boolean;
}

export interface VisitorLogItem {
  id: string;
  ip: string;
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet' | 'bot';
  os: string;
  browser: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  city: string;
  isp?: string;
  screenResolution: string;
  language: string;
  timeZone: string;
  firstSeen: string;
  lastSeen: string;
  activeTab: string;
  isOnline: boolean;
  pageViews: number;
  referrer?: string;
}

export interface VisitorStatsSummary {
  activeOnlineCount: number;
  totalVisitsCount: number;
  uniqueVisitorsCount: number;
  mobilePercentage: number;
  desktopPercentage: number;
  tabletPercentage: number;
  topCountries: { country: string; flag: string; count: number }[];
  topDevices: { name: string; count: number }[];
}

export type MainAppTab = 'downloader' | 'enhancer' | 'batch' | 'audio-extractor' | 'history' | 'ai-assistant' | 'dev-console';

