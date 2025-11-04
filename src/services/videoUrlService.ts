export interface VideoUrlInfo {
  url: string;
  platform: 'youtube' | 'vimeo' | 'dailymotion' | 'other';
  isValid: boolean;
  videoId?: string;
}

export function validateVideoUrl(url: string): VideoUrlInfo {
  const trimmedUrl = url.trim();
  
  // YouTube URL patterns
  const youtubePatterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^(https?:\/\/)?(www\.)?(youtube\.com\/v\/)([a-zA-Z0-9-]{11})/,
  ];
  
  // Vimeo URL patterns
  const vimeoPatterns = [
    /^(https?:\/\/)?(www\.)?(vimeo\.com\/)(\d+)/,
    /^(https?:\/\/)?(www\.)?(player\.vimeo\.com\/video\/)(\d+)/,
  ];
  
  // Dailymotion URL patterns
  const dailymotionPatterns = [
    /^(https?:\/\/)?(www\.)?(dailymotion\.com\/video\/)([a-zA-Z0-9]+)/,
    /^(https?:\/\/)?(www\.)?(dai\.ly\/)([a-zA-Z0-9,]+)/,
  ];

  // Check YouTube
  for (const pattern of youtubePatterns) {
    const match = trimmedUrl.match(pattern);
    if (match) {
      return {
        url: trimmedUrl,
        platform: 'youtube',
        isValid: true,
        videoId: match[4],
      };
    }
  }

  // Check Vimeo
  for (const pattern of vimeoPatterns) {
    const match = trimmedUrl.match(pattern);
    if (match) {
      return {
        url: trimmedUrl,
        platform: 'vimeo',
        isValid: true,
        videoId: match[4],
      };
    }
  }

  // Check Dailymotion
  for (const pattern of dailymotionPatterns) {
    const match = trimmedUrl.match(pattern);
    if (match) {
      return {
        url: trimmedUrl,
        platform: 'dailymotion',
        isValid: true,
        videoId: match[4],
      };
    }
  }

  // Check if it's a valid URL (for other platforms)
  try {
    new URL(trimmedUrl);
    return {
      url: trimmedUrl,
      platform: 'other',
      isValid: true,
    };
  } catch {
    return {
      url: trimmedUrl,
      platform: 'other',
      isValid: false,
    };
  }
}

export function getVideoEmbedUrl(urlInfo: VideoUrlInfo): string | null {
  if (!urlInfo.isValid) return null;

  switch (urlInfo.platform) {
    case 'youtube':
      return `https://www.youtube.com/embed/${urlInfo.videoId}`;
    case 'vimeo':
      return `https://player.vimeo.com/video/${urlInfo.videoId}`;
    case 'dailymotion':
      return `https://www.dailymotion.com/embed/video/${urlInfo.videoId}`;
    default:
      return urlInfo.url;
  }
}

export function getPlatformName(platform: VideoUrlInfo['platform']): string {
  switch (platform) {
    case 'youtube':
      return 'YouTube';
    case 'vimeo':
      return 'Vimeo';
    case 'dailymotion':
      return 'Dailymotion';
    default:
      return 'Other';
  }
} 