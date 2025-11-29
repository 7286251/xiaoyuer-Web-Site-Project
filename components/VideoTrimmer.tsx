
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Scissors, Check, X, RotateCcw, Clock, Monitor, Loader2 } from 'lucide-react';

interface VideoTrimmerProps {
  file: File;
  onConfirm: (start: number, end: number, resolution: string) => void;
  onCancel: () => void;
}

export const VideoTrimmer: React.FC<VideoTrimmerProps> = ({ file, onConfirm, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [resolution, setResolution] = useState('1080p');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setIsReady(false); // Reset ready state on new file
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setEndTime(dur);
      setIsReady(true); // Video metadata loaded, no longer "black screen"
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (endTime > 0 && videoRef.current.currentTime >= endTime && !videoRef.current.paused) {
         videoRef.current.pause();
         setIsPlaying(false);
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current && isReady) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        if (videoRef.current.currentTime >= endTime) {
            videoRef.current.currentTime = startTime;
        }
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const setStartToCurrent = () => {
    if (currentTime >= endTime) return; 
    setStartTime(currentTime);
  };

  const setEndToCurrent = () => {
    if (currentTime <= startTime) return; 
    setEndTime(currentTime);
  };

  const resetTrim = () => {
    setStartTime(0);
    setEndTime(duration);
    if(videoRef.current) videoRef.current.currentTime = 0;
  };

  const startPercent = duration > 0 ? (startTime / duration) * 100 : 0;
  const endPercent = duration > 0 ? (endTime / duration) * 100 : 100;
  const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      <div className="bg-theme-surface rounded-theme p-8 shadow-theme-card border-theme border-theme-border">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-theme-secondary p-2 rounded-lg text-theme-surface shadow-theme-btn">
              <Scissors className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-cute text-theme-text">裁剪片段与设置</h2>
          </div>
          <button 
            onClick={onCancel}
            className="p-3 bg-theme-surface rounded-full shadow-theme-btn active:shadow-theme-inset text-theme-text-light hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative w-fit mx-auto bg-black/5 rounded-theme overflow-hidden border-4 border-theme-surface shadow-theme-inset mb-8 group min-h-[300px] flex items-center justify-center">
          
          {/* Loading Overlay */}
          {!isReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 z-20">
               <Loader2 className="w-10 h-10 text-theme-primary animate-spin mb-2" />
               <p className="text-theme-text-light font-bold text-sm">Loading Preview...</p>
            </div>
          )}

          <video
            ref={videoRef}
            src={videoUrl}
            className="max-h-[60vh] w-auto block object-contain"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            preload="auto" // Optimize loading
          />
          
          {/* Play Button Overlay */}
          {isReady && !isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/10 cursor-pointer transition-colors z-10"
              onClick={togglePlay}
            >
              <div className="p-6 bg-theme-surface/90 rounded-full shadow-lg backdrop-blur-sm transform group-hover:scale-110 transition-transform text-theme-primary">
                <Play className="w-10 h-10 ml-1 fill-current" />
              </div>
            </div>
          )}
        </div>

        {/* Timeline Control */}
        <div className="mb-10 select-none px-2 relative opacity-90 transition-opacity hover:opacity-100">
          {/* Mask for disabled state */}
          {!isReady && <div className="absolute inset-0 bg-white/50 z-50 cursor-not-allowed"></div>}

          <div className="relative h-6 bg-theme-bg rounded-full shadow-theme-inset flex items-center cursor-pointer">
            <div 
               className="absolute top-0 bottom-0 bg-theme-primary border-2 border-theme-surface rounded-full"
               style={{ left: `${startPercent}%`, width: `${endPercent - startPercent}%` }}
            />
            <div 
               className="absolute w-5 h-5 bg-theme-surface rounded-full shadow-md border-2 border-theme-secondary top-1/2 -translate-y-1/2 z-20 transition-all duration-75"
               style={{ left: `calc(${currentPercent}% - 10px)` }}
            />
            
            <input 
              type="range" 
              min={0} max={duration} step={0.1}
              value={currentTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if(videoRef.current) videoRef.current.currentTime = val;
                setCurrentTime(val);
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-30"
              disabled={!isReady}
            />
          </div>
          <div className="flex justify-between text-sm text-theme-text-light font-bold font-mono mt-3 px-1">
             <span>00:00</span>
             <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Trim Controls */}
          <div className={`space-y-4 ${!isReady ? 'opacity-50 pointer-events-none' : ''}`}>
             <div className="flex items-center justify-between gap-4">
               
               {/* Start Time */}
               <div className="flex flex-col gap-2 w-full">
                 <label className="text-xs text-theme-text-light font-cute ml-1">开始时间</label>
                 <div className="flex items-center gap-2">
                   <div className="flex-1 bg-theme-bg shadow-theme-inset rounded-lg p-3 text-center font-mono text-theme-secondary font-bold text-lg">
                     {formatTime(startTime)}
                   </div>
                   <button 
                    onClick={setStartToCurrent}
                    className="p-3 bg-theme-surface rounded-lg shadow-theme-btn active:scale-95 text-theme-secondary"
                    title="设为当前"
                   >
                     <Clock className="w-5 h-5" />
                   </button>
                 </div>
               </div>

               {/* End Time */}
               <div className="flex flex-col gap-2 w-full">
                 <label className="text-xs text-theme-text-light font-cute ml-1">结束时间</label>
                 <div className="flex items-center gap-2">
                   <div className="flex-1 bg-theme-bg shadow-theme-inset rounded-lg p-3 text-center font-mono text-theme-primary font-bold text-lg">
                     {formatTime(endTime)}
                   </div>
                   <button 
                     onClick={setEndToCurrent}
                     className="p-3 bg-theme-surface rounded-lg shadow-theme-btn active:scale-95 text-theme-primary"
                     title="设为当前"
                   >
                     <Clock className="w-5 h-5" />
                   </button>
                 </div>
               </div>
             </div>
             
             <button 
               onClick={resetTrim}
               className="w-full py-2 text-theme-text-light hover:text-theme-text font-cute text-sm flex items-center justify-center gap-1 transition-colors"
             >
               <RotateCcw className="w-3 h-3" /> 重置全部
             </button>
          </div>

          {/* Right: Actions & Settings */}
          <div className="flex flex-col justify-end space-y-4">
             <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs text-theme-text-light font-cute ml-1 flex items-center gap-1">
                      <Monitor className="w-3 h-3" /> 提示词分辨率
                    </label>
                    <div className="relative">
                      <select 
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="w-full p-3 bg-theme-bg rounded-lg border-none shadow-theme-inset text-theme-text font-mono font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-theme-primary outline-none"
                      >
                        <option value="480p">480p (SD)</option>
                        <option value="720p">720p (HD)</option>
                        <option value="1080p">1080p (FHD)</option>
                        <option value="4K">4K (UHD)</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-theme-text-light">
                        ▼
                      </div>
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs text-theme-text-light font-cute ml-1">选定时长</label>
                    <div className="flex items-center justify-center bg-theme-bg p-3 rounded-lg border border-theme-border shadow-theme-inset text-theme-primary font-mono font-bold text-lg h-[48px]">
                        {formatTime(endTime - startTime)}
                    </div>
                </div>
             </div>
             
             <div className="flex gap-4">
               <button 
                 onClick={onCancel}
                 className="flex-1 py-4 bg-theme-bg hover:brightness-95 text-theme-text rounded-theme font-bold transition-colors shadow-theme-btn"
               >
                 取消
               </button>
               <button 
                 onClick={() => onConfirm(startTime, endTime, resolution)}
                 disabled={!isReady}
                 className={`flex-[2] py-4 bg-theme-primary text-theme-surface rounded-theme font-bold shadow-theme-btn flex items-center justify-center gap-2 transition-all
                   ${!isReady ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 active:scale-95'}
                 `}
               >
                 <Check className="w-5 h-5" />
                 确认并分析
               </button>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};
