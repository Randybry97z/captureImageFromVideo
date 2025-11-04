import { CapturedImage } from '../types/video';

export async function captureImageAtTime(video: HTMLVideoElement, timestamp: number): Promise<string> {
  return new Promise((resolve) => {
    video.currentTime = timestamp;
    const onSeeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } else {
        resolve('');
      }
      video.removeEventListener('seeked', onSeeked);
    };
    video.addEventListener('seeked', onSeeked);
  });
}

export async function captureMultipleImages(
  video: HTMLVideoElement,
  times: number[],
  formatTime: (seconds: number) => string,
  onProgress?: (progress: number) => void
): Promise<CapturedImage[]> {
  const images: CapturedImage[] = [];
  for (let i = 0; i < times.length; i++) {
    const timestamp = times[i];
    const url = await captureImageAtTime(video, timestamp);
    if (url) {
      images.push({
        id: `capture-${timestamp}-${Date.now()}`,
        url,
        timestamp,
        timeString: formatTime(timestamp),
      });
    }
    if (onProgress) onProgress(((i + 1) / times.length) * 100);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return images;
} 