export interface CaptureSettings {
  interval: number;
  intervalType: 'seconds' | 'minutes';
  startTime: number;
  endTime?: number;
}

export interface CapturedImage {
  id: string;
  url: string;
  timestamp: number;
  timeString: string;
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
}

export interface CaptureProgress {
  current: number;
  total: number;
  percentage: number;
} 