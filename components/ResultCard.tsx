import React, { useState, useEffect } from 'react';
import { Copy, Check, Image as ImageIcon, User, Mic, PenTool, Loader2, Zap, Music } from 'lucide-react';
import { SceneAnalysis } from '../types';

interface ResultCardProps {
  scene: SceneAnalysis;
  index: number;
  videoSource?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ scene, index, videoSource }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loadingThumb, setLoadingThumb] = useState(true);
  const [visualLang, setVisualLang] = useState<'cn' | 'en'>('en'); // Default to English prompt for MJ/Flux

  // Thumbnail Generation Logic
  useEffect(() => {
    if (!videoSource || !scene.timestamp) {
      setLoadingThumb(false);
      return;
    }

    setThumbnail(null);
    setLoadingThumb(true);

    const video = document.createElement('video');
    video.src = videoSource;
    video.crossOrigin = 'anonymous';
    video.muted = true;
    
    const timeStr = scene.timestamp.split('-')[0].trim();
    const parts = timeStr.split(':');
    let seekTime = 0;
    if (parts.length === 2) {
      seekTime = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      seekTime = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }

    const captureFrame = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 480; 
        canvas.height = video.videoHeight * (480 / video.videoWidth);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setThumbnail(canvas.toDataURL('image/jpeg', 0.8));
        }
      } catch (e) {
        console.error("Frame capture failed", e);
      } finally {
        setLoadingThumb(false);
        video.src = "";
        video.load();
      }
    };

    video.onloadedmetadata = () => { video.currentTime = seekTime; };
    video.onseeked = () => { captureFrame(); };
    video.onerror = () => { setLoadingThumb(false); };
  }, [videoSource, scene.timestamp]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-theme-surface rounded-theme p-6 md:p-8 mb-8 transition-transform duration-300 hover:scale-[1.01] shadow-theme-card border-theme border-theme-border">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-theme-border pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-theme-secondary text-theme-surface px-4 py-1.5 rounded-lg shadow-theme-btn text-sm font-cute tracking-wide">
            场景 {index + 1}
          </div>
          <span className="text-theme-primary font-mono font-bold text-lg bg-theme-bg px-3 py-1 rounded-lg shadow-theme-inset">
            {scene.timestamp}
          </span>
        </div>
        <div className="text-sm text-theme-text font-medium truncate max-w-md bg-theme-bg px-3 py-1.5 rounded-lg shadow-theme-inset">
          {scene.description}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Left: Visual Preview & Base Info */}
        <div className="w-full xl:w-1/3 flex flex-col gap-6">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-theme-bg rounded-theme overflow-hidden shadow-theme-inset border-theme border-theme-border">
            {loadingThumb ? (
              <div className="absolute inset-0 flex items-center justify-center text-theme-secondary">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : thumbnail ? (
              <img src={thumbnail} alt="Scene Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-theme-text-light font-cute">
                无预览
              </div>
            )}
          </div>

          {/* Golden Hook Analysis */}
           {scene.goldenHook && (
            <div className="bg-gradient-to-r from-theme-primary to-theme-secondary p-[2px] rounded-theme shadow-theme-card">
               <div className="bg-theme-surface rounded-[calc(var(--border-radius)-2px)] p-4 h-full">
                 <div className="flex items-center gap-2 mb-2">
                   <Zap className="w-4 h-4 text-theme-primary fill-current animate-pulse" />
                   <span className="text-xs font-bold text-theme-primary uppercase">黄金三秒钩子分析</span>
                 </div>
                 <p className="text-sm text-theme-text font-bold leading-snug">
                   {scene.goldenHook}
                 </p>
               </div>
            </div>
           )}

          {/* Info Bubbles */}
          <div className="grid grid-cols-1 gap-3">
             <div className="bg-theme-bg p-4 rounded-theme shadow-theme-inset flex items-start gap-3">
               <div className="bg-theme-primary p-1.5 rounded-lg text-theme-surface mt-0.5 shadow-theme-btn">
                 <User className="w-4 h-4" />
               </div>
               <div className="flex-1">
                 <p className="text-xs text-theme-text-light font-bold mb-1">人物特征</p>
                 <p className="text-sm text-theme-text leading-relaxed">{scene.characters}</p>
               </div>
            </div>

            <div className="bg-theme-bg p-4 rounded-theme shadow-theme-inset flex items-start gap-3">
               <div className="bg-theme-secondary p-1.5 rounded-lg text-theme-surface mt-0.5 shadow-theme-btn">
                 <Music className="w-4 h-4" />
               </div>
               <div className="flex-1">
                 <p className="text-xs text-theme-text-light font-bold mb-1">背景音乐/音效</p>
                 <p className="text-sm text-theme-text leading-relaxed">{scene.audio}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Visual Prompt & Scripts */}
        <div className="w-full xl:w-2/3 flex flex-col gap-6">
          
          {/* Visual Prompt Section (Bilingual) */}
          <div className="flex flex-col h-full bg-theme-surface rounded-theme p-5 shadow-theme-card border-2 border-transparent hover:border-theme-secondary transition-colors relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-theme-secondary font-cute text-lg">
                <ImageIcon className="w-5 h-5" /> <span>画面反推提示词</span>
              </div>
              
              <div className="flex items-center gap-2">
                 {/* Lang Switcher */}
                 <div className="flex bg-theme-bg p-1 rounded-lg mr-2">
                    <button 
                      onClick={() => setVisualLang('en')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${visualLang === 'en' ? 'bg-theme-secondary text-theme-surface shadow-sm' : 'text-theme-text-light'}`}
                    >
                      MJ/Flux (EN)
                    </button>
                    <button 
                      onClick={() => setVisualLang('cn')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${visualLang === 'cn' ? 'bg-theme-secondary text-theme-surface shadow-sm' : 'text-theme-text-light'}`}
                    >
                      国内 (CN)
                    </button>
                 </div>

                 <button 
                   onClick={() => handleCopy(scene.visualPrompt[visualLang], 'visual')}
                   className="bg-theme-secondary text-theme-surface p-2 rounded-lg hover:brightness-110 transition-colors shadow-sm"
                 >
                   {copied === 'visual' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                 </button>
              </div>
            </div>
            
            <textarea
              readOnly
              value={scene.visualPrompt[visualLang]}
              className="w-full min-h-[140px] bg-theme-bg rounded-lg p-4 text-sm text-theme-text focus:outline-none resize-none shadow-theme-inset border-none leading-relaxed font-mono"
            />
          </div>

          {/* Scripts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-theme-bg rounded-theme p-5 shadow-theme-inset border-theme border-theme-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-theme-text-light font-cute">
                  <Mic className="w-4 h-4" /> <span>原始对白</span>
                </div>
              </div>
              <div className="text-sm text-theme-text leading-relaxed min-h-[80px]">
                {scene.originalScript || "无对白"}
              </div>
            </div>

            <div className="bg-theme-surface rounded-theme p-5 shadow-theme-card border-2 border-theme-primary/30 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-theme-primary font-cute text-lg">
                  <PenTool className="w-4 h-4" /> <span>二创旁白</span>
                </div>
                <button 
                  onClick={() => handleCopy(scene.rewrittenScript, 'rewrite')}
                  className="bg-theme-primary text-theme-surface p-1.5 rounded-lg hover:brightness-110 transition-colors shadow-sm"
                >
                  {copied === 'rewrite' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-sm text-theme-text font-bold leading-relaxed">
                {scene.rewrittenScript}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};