import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  onLoadedMetadata?: (duration: number, width: number, height: number) => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onLoadedMetadata, videoRef, className }) => {
  const localRef = useRef<HTMLVideoElement>(null);
  const ref = videoRef || localRef;

  useEffect(() => {
    if (!ref.current) return;
    const handleLoadedMetadata = () => {
      if (onLoadedMetadata && ref.current) {
        onLoadedMetadata(ref.current.duration, ref.current.videoWidth, ref.current.videoHeight);
      }
    };
    ref.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      ref.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onLoadedMetadata, ref]);

  return (
    <video
      ref={ref}
      src={src}
      controls
      className={className}
      style={{ maxHeight: 300 }}
    />
  );
};

export default VideoPlayer; 