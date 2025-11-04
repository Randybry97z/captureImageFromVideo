import { LicenseInfo, LicenseType, UsageStats, LICENSE_LIMITS } from '../types/license';

// Simple in-memory storage (in production, use database)
const LICENSE_STORAGE_KEY = 'video-capture-license';
const USAGE_STORAGE_KEY = 'video-capture-usage';

export class LicenseService {
  private static instance: LicenseService;
  private currentLicense: LicenseInfo | null = null;
  private usageStats: UsageStats | null = null;

  private constructor() {
    this.loadLicenseFromStorage();
    this.loadUsageFromStorage();
  }

  static getInstance(): LicenseService {
    if (!LicenseService.instance) {
      LicenseService.instance = new LicenseService();
    }
    return LicenseService.instance;
  }

  // License Management
  setLicense(licenseKey: string): boolean {
    // Simple license validation (in production, validate against your backend)
    const isPremium = licenseKey.startsWith('PREMIUM-') && licenseKey.length > 20;
    const type: LicenseType = isPremium ? 'premium' : 'free';
    
    const license: LicenseInfo = {
      type,
      key: licenseKey,
      monthlyLimit: LICENSE_LIMITS[type].monthlyImages,
      currentUsage: this.usageStats?.imagesGenerated || 0,
      resetDate: this.getNextResetDate(),
      isActive: true,
    };

    this.currentLicense = license;
    this.saveLicenseToStorage();
    return true;
  }

  getCurrentLicense(): LicenseInfo | null {
    return this.currentLicense;
  }

  // Usage Tracking
  incrementUsage(imagesGenerated: number = 1): boolean {
    if (!this.currentLicense) {
      this.setLicense('FREE'); // Default to free license
    }

    if (!this.usageStats) {
      this.usageStats = {
        imagesGenerated: 0,
        videosProcessed: 0,
        lastResetDate: new Date().toISOString(),
      };
    }

    // Check if we need to reset monthly usage
    this.checkAndResetMonthlyUsage();

    // Check limits
    if (this.currentLicense!.type === 'free') {
      const newTotal = this.usageStats.imagesGenerated + imagesGenerated;
      if (newTotal > LICENSE_LIMITS.free.monthlyImages) {
        return false; // Limit exceeded
      }
    }

    // Update usage
    this.usageStats.imagesGenerated += imagesGenerated;
    this.usageStats.videosProcessed += 1;
    this.currentLicense!.currentUsage = this.usageStats.imagesGenerated;
    
    this.saveUsageToStorage();
    this.saveLicenseToStorage();
    return true;
  }

  canGenerateImages(count: number = 1): boolean {
    if (!this.currentLicense) {
      this.setLicense('FREE');
    }

    this.checkAndResetMonthlyUsage();

    if (this.currentLicense!.type === 'premium') {
      return true; // Unlimited
    }

    const newTotal = (this.usageStats?.imagesGenerated || 0) + count;
    return newTotal <= LICENSE_LIMITS.free.monthlyImages;
  }

  getRemainingImages(): number {
    if (!this.currentLicense) {
      return LICENSE_LIMITS.free.monthlyImages;
    }

    if (this.currentLicense.type === 'premium') {
      return -1; // Unlimited
    }

    const used = this.usageStats?.imagesGenerated || 0;
    return Math.max(0, LICENSE_LIMITS.free.monthlyImages - used);
  }

  getUsageStats(): UsageStats | null {
    return this.usageStats;
  }

  // Private methods
  private checkAndResetMonthlyUsage(): void {
    if (!this.usageStats) return;

    const lastReset = new Date(this.usageStats.lastResetDate);
    const now = new Date();
    const isNewMonth = lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear();

    if (isNewMonth) {
      this.usageStats.imagesGenerated = 0;
      this.usageStats.videosProcessed = 0;
      this.usageStats.lastResetDate = now.toISOString();
      this.currentLicense!.currentUsage = 0;
      this.currentLicense!.resetDate = this.getNextResetDate();
      this.saveUsageToStorage();
      this.saveLicenseToStorage();
    }
  }

  private getNextResetDate(): string {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toISOString();
  }

  private loadLicenseFromStorage(): void {
    try {
      const stored = localStorage.getItem(LICENSE_STORAGE_KEY);
      if (stored) {
        this.currentLicense = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load license from storage:', error);
    }
  }

  private saveLicenseToStorage(): void {
    try {
      if (this.currentLicense) {
        localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(this.currentLicense));
      }
    } catch (error) {
      console.warn('Failed to save license to storage:', error);
    }
  }

  private loadUsageFromStorage(): void {
    try {
      const stored = localStorage.getItem(USAGE_STORAGE_KEY);
      if (stored) {
        this.usageStats = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load usage from storage:', error);
    }
  }

  private saveUsageToStorage(): void {
    try {
      if (this.usageStats) {
        localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(this.usageStats));
      }
    } catch (error) {
      console.warn('Failed to save usage to storage:', error);
    }
  }
} 