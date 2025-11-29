
import React, { useRef, useEffect } from 'react';

interface VideoBackgroundProps {
  videoUrl: string;
  isMuted: boolean;
  volume: number; // 0 to 1
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl, isMuted, volume }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.src = videoUrl;
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Auto-play was prevented:", error);
        });
      }
    }
  }, [videoUrl]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      // Ensure volume is clamped between 0 and 1
      videoRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [isMuted, volume]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none transition-opacity duration-1000 ease-in-out opacity-100">
      {videoUrl && (
        <video
          ref={videoRef}
          playsInline
          autoPlay
          loop
          muted={isMuted}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        />
      )}
    </div>
  );
};
