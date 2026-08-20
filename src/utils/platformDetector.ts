import { SupportedPlatform, VideoInfo, DownloadOption } from '../types';

export function detectPlatform(url: string): SupportedPlatform {
  const cleanUrl = url.toLowerCase().trim();
  if (cleanUrl.includes('tiktok.com') || cleanUrl.includes('douyin.com')) {
    return cleanUrl.includes('douyin.com') ? 'douyin' : 'tiktok';
  }
  if (cleanUrl.includes('instagram.com') || cleanUrl.includes('instagr.am')) {
    return 'instagram';
  }
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    return 'youtube';
  }
  if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch') || cleanUrl.includes('fb.com')) {
    return 'facebook';
  }
  if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com')) {
    return 'twitter';
  }
  if (cleanUrl.includes('pinterest.com') || cleanUrl.includes('pin.it')) {
    return 'pinterest';
  }
  if (cleanUrl.includes('threads.net')) {
    return 'threads';
  }
  if (cleanUrl.includes('snapchat.com')) {
    return 'snapchat';
  }
  if (cleanUrl.includes('reddit.com') || cleanUrl.includes('redd.it')) {
    return 'reddit';
  }
  return 'general';
}

export function getPlatformBadge(platform: SupportedPlatform) {
  switch (platform) {
    case 'tiktok':
      return { name: 'TikTok', color: 'bg-black text-pink-400 border-pink-500/30', brandColor: '#FE2C55', icon: '🎵' };
    case 'instagram':
      return { name: 'Instagram', color: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-400/40', brandColor: '#E1306C', icon: '📸' };
    case 'youtube':
      return { name: 'YouTube', color: 'bg-red-600/20 text-red-400 border-red-500/40', brandColor: '#FF0000', icon: '▶️' };
    case 'facebook':
      return { name: 'Facebook', color: 'bg-blue-600/20 text-blue-400 border-blue-500/40', brandColor: '#1877F2', icon: '👥' };
    case 'twitter':
      return { name: 'X (Twitter)', color: 'bg-slate-800 text-white border-white/20', brandColor: '#1DA1F2', icon: '𝕏' };
    case 'pinterest':
      return { name: 'Pinterest', color: 'bg-red-700/20 text-red-300 border-red-500/40', brandColor: '#E60023', icon: '📌' };
    case 'threads':
      return { name: 'Threads', color: 'bg-slate-800 text-slate-200 border-slate-600', brandColor: '#000000', icon: '🧵' };
    case 'snapchat':
      return { name: 'Snapchat', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', brandColor: '#FFFC00', icon: '👻' };
    case 'douyin':
      return { name: 'Douyin', color: 'bg-cyan-900/30 text-cyan-300 border-cyan-500/40', brandColor: '#00ffff', icon: '⚡' };
    case 'reddit':
      return { name: 'Reddit', color: 'bg-orange-600/20 text-orange-400 border-orange-500/40', brandColor: '#FF4500', icon: '🤖' };
    default:
      return { name: 'Universal Web', color: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40', brandColor: '#10B981', icon: '🌐' };
  }
}

// Sample mock data generator based on URL to provide instant testing and download options
export async function parseVideoUrl(inputUrl: string): Promise<VideoInfo> {
  const platform = detectPlatform(inputUrl);
  
  // Real high-quality sample video clips for instant preview
  const sampleVideos = {
    tiktok: {
      title: 'Trending Viral Reel - Extreme Cyberpunk Cinematic Edit #viral #trending',
      author: { name: 'Alex Cinema', username: '@alex_motion', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      preview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      views: '4.8M',
      likes: '890K',
      duration: '00:38',
    },
    instagram: {
      title: 'Stunning Nature 4K Drone Footage - Switzerland Alps Glacier River',
      author: { name: 'Swiss Wanderer', username: '@swiss.nature', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
      preview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      views: '1.2M',
      likes: '345K',
      duration: '00:45',
    },
    youtube: {
      title: 'Next-Gen Hypercar Cinematic Showcase 4K 60FPS HDR Test',
      author: { name: 'Speed Velocity Hub', username: '@speed_velocity', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
      thumbnail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80',
      preview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      views: '9.4M',
      likes: '1.8M',
      duration: '01:24',
    },
    facebook: {
      title: 'Master Chef Secret Culinary Technique - Crispy Wagyu Steak Guide',
      author: { name: 'Gourmet Kitchen Pro', username: 'gourmetkitchen', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
      thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      preview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      views: '3.1M',
      likes: '620K',
      duration: '01:10',
    },
    twitter: {
      title: 'SpaceX Falcon Heavy Triple Booster Landing in 4K Super Slow-Mo',
      author: { name: 'Astro Odyssey', username: '@astro_odyssey', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
      thumbnail: 'https://images.unsplash.com/photo-1517976487502-53b0e14a1a67?w=800&auto=format&fit=crop&q=80',
      preview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      views: '8.7M',
      likes: '1.4M',
      duration: '00:29',
    },
    general: {
      title: 'Ultra High Definition Visual Showcase - AI Enhanced Video Stream',
      author: { name: 'PIPO Media Hub', username: '@pipo_media', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
      preview: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      views: '2.5M',
      likes: '500K',
      duration: '00:59',
    }
  };

  const selectedData = sampleVideos[platform as keyof typeof sampleVideos] || sampleVideos.general;

  // Build high-value download options
  const options: DownloadOption[] = [
    {
      id: 'opt-nowm-hd',
      label: 'MP4 بدون علامة مائية (No Watermark HD)',
      format: 'mp4',
      quality: '1080p Full HD',
      resolution: '1080x1920',
      size: '24.8 MB',
      noWatermark: true,
      url: selectedData.preview,
      bitrate: '6.5 Mbps',
      isPopular: true
    },
    {
      id: 'opt-nowm-4k',
      label: 'MP4 فائق الدقة 4K Ultra HD (AI Rendered)',
      format: 'mp4',
      quality: '4K Ultra HD (2160p)',
      resolution: '2160x3840',
      size: '84.2 MB',
      noWatermark: true,
      url: selectedData.preview,
      bitrate: '18.4 Mbps',
      isPopular: false
    },
    {
      id: 'opt-nowm-fast',
      label: 'MP4 جودة سريعة للأجهزة والواتساب (720p Fast)',
      format: 'mp4',
      quality: '720p HD',
      resolution: '720x1280',
      size: '11.4 MB',
      noWatermark: true,
      url: selectedData.preview,
      bitrate: '3.2 Mbps',
      isPopular: false
    },
    {
      id: 'opt-audio-mp3',
      label: 'صوت فقط MP3 عالي النقاء (320 kbps Studio Audio)',
      format: 'mp3',
      quality: '320 kbps High Fidelity',
      resolution: 'Audio Track',
      size: '4.8 MB',
      noWatermark: true,
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      bitrate: '320 kbps',
      isPopular: false
    },
    {
      id: 'opt-thumb-hd',
      label: 'صورة الغلاف بدقة أصلية فائقة (HD Thumbnail/Cover)',
      format: 'jpg',
      quality: 'Full HD Original',
      resolution: '1920x1080',
      size: '1.2 MB',
      noWatermark: true,
      url: selectedData.thumbnail,
      isPopular: false
    }
  ];

  return {
    id: `vid-${Date.now()}`,
    url: inputUrl,
    platform,
    title: selectedData.title,
    author: selectedData.author,
    thumbnail: selectedData.thumbnail,
    previewVideoUrl: selectedData.preview,
    duration: selectedData.duration,
    views: selectedData.views,
    likes: selectedData.likes,
    publishedAt: 'منذ ساعتين',
    options
  };
}

export const SAMPLE_POPULAR_URLS = [
  { platform: 'tiktok' as SupportedPlatform, label: 'تيك توك تريند (TikTok Viral HD)', url: 'https://www.tiktok.com/@alex_motion/video/734891238491823' },
  { platform: 'instagram' as SupportedPlatform, label: 'انستقرام ريلز (Instagram 4K Reel)', url: 'https://www.instagram.com/reel/C38491kLm9P/' },
  { platform: 'youtube' as SupportedPlatform, label: 'يوتيوب شورتس (YouTube Shorts 4K)', url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ' },
  { platform: 'twitter' as SupportedPlatform, label: 'تغريدة إكس فيديو (X / Twitter HD)', url: 'https://x.com/astro_odyssey/status/178491823901' },
  { platform: 'facebook' as SupportedPlatform, label: 'فيسبوك ريلز (Facebook Watch)', url: 'https://www.facebook.com/reel/194829103948' },
];
