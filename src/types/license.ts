export type LicenseType = 'free' | 'premium';

export interface LicenseInfo {
  type: LicenseType;
  key: string;
  monthlyLimit: number;
  currentUsage: number;
  resetDate: string; // ISO date string
  isActive: boolean;
}

export interface UsageStats {
  imagesGenerated: number;
  videosProcessed: number;
  lastResetDate: string;
}

export const LICENSE_LIMITS = {
  free: {
    monthlyImages: 100,
    monthlyVideos: 10,
    maxVideoDuration: 300, // 5 minutes
  },
  premium: {
    monthlyImages: -1, // unlimited
    monthlyVideos: -1, // unlimited
    maxVideoDuration: -1, // unlimited
  },
} as const; 