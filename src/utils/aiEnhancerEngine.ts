import { AIEnhancementSettings, EnhancementJob } from '../types';

export const DEFAULT_AI_SETTINGS: AIEnhancementSettings = {
  model: 'super_resolution',
  upscaleFactor: '4k',
  targetFps: '60',
  sharpening: 75,
  denoising: 60,
  colorVibrance: 70,
  brightness: 5,
  contrast: 15,
  faceRestoration: true,
  audioDenoise: true,
  aiDeblur: true,
};

export const AI_MODELS_INFO = [
  {
    id: 'super_resolution',
    name: 'محرك Super-Resolution 4K Pro',
    description: 'إعادة بناء تفاصيل البيكسلات المفقودة ورفع الدقة إلى 4K UHD بدقة مذهلة.',
    badge: 'الأكثر شعبية ⭐',
    bestFor: 'فيديوهات تيك توك، ريلز، والفيديوهات القديمة',
    icon: 'Sparkles',
  },
  {
    id: 'face_restore',
    name: 'مُرمم الوجوه وتفاصيل البشرة AI Face Detailer',
    description: 'التركيز على ملامح الوجه والعيون والشعر وإزالة الضبابية تماماً.',
    badge: 'ذكاء متقدم 👤',
    bestFor: 'فيديوهات السيلفي، البودكاست، والمقابلات الشخصية',
    icon: 'UserCheck',
  },
  {
    id: 'hdr_cinema',
    name: 'معالجة الألوان السينمائية HDR Cinema Color Grade',
    description: 'توسيع النطاق الديناميكي وتعديل الإضاءة والظلال للألوان السينمائية.',
    badge: 'هوليوود 🎬',
    bestFor: 'فيديوهات الطبيعة، السيارات، والسفر',
    icon: 'Palette',
  },
  {
    id: 'anime_upscale',
    name: 'مُحسن الأنمي والرسوم المتحركة Anime & 2D Sharpener',
    description: 'تنعيم الخطوط وإزالة التموجات اللونية دون أي تشويش.',
    badge: 'أنمي وفيكتور 🎨',
    bestFor: 'الأنميشن، الموشن جرافيك، والرسوم المتحركة',
    icon: 'Tv',
  },
  {
    id: 'denoise_fast',
    name: 'مُزيل النويز والتشويش الليلي AI Night Denoise',
    description: 'تنظيف الفيديو المصور في الإضاءة المنخفضة بدون فقدان الحدة.',
    badge: 'تصوير ليلي 🌙',
    bestFor: 'الفيديوهات الليلية وضعيفة الإضاءة',
    icon: 'Moon',
  },
];

export const SAMPLE_ENHANCE_VIDEOS = [
  {
    id: 'sample-car',
    title: 'مقطع سيارة رياضية سريع (بحاجة لرفع الدقة ومعدل الإطارات 60FPS)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80',
    originalResolution: '720p HD (30 FPS)',
    size: '18.2 MB'
  },
  {
    id: 'sample-nature',
    title: 'فيديو طبيعة وشلالات (بحاجة لمعالجة HDR ووضوح فائق)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    originalResolution: '480p SD (24 FPS)',
    size: '9.5 MB'
  },
  {
    id: 'sample-tech',
    title: 'مقطع خيال علمي وتأثيرات بصرية (بحاجة لإزالة التشويش Denoise)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    originalResolution: '720p HD',
    size: '14.1 MB'
  }
];
