
import React, { useState } from 'react';
import { DeepAnalysisResult, DeepShot } from '../types';
import { Clock, Film, Music, Settings, User, Camera, Video, Volume2, Palette, Copy, Check } from 'lucide-react';

interface DeepAnalysisViewProps {
  result: DeepAnalysisResult;
  onReset: () => void;
}

export const DeepAnalysisView: React.FC<DeepAnalysisViewProps> = ({ result, onReset }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateShotText = (shot: DeepShot, idx: number) => {
    return `Shot ${idx + 1} (${shot.timestamp}):
- 画面氛围: ${shot.visual_atmosphere}
- 人物表现: ${shot.character_performance}
- 剧情细节: ${shot.story_plot}
- 镜头语言: ${shot.camera_language}
- 音效设计: ${shot.audio_design}`;
  };

  const generateFullReport = () => {
    const header = `【详细拆解方案】${result.title || '无标题'}\n\n[核心主题]: ${result.theme}\n[设定一致性]: ${result.consistency}\n[背景音乐]: ${result.bgm}\n\n`;
    const shotsText = result.shots.map((shot, idx) => generateShotText(shot, idx)).join('\n\n-------------------\n\n');
    return header + shotsText;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-20">
      
      {/* Header & Global Analysis */}
      <div className="bg-theme-surface rounded-theme p-8 shadow-theme-card border-theme border-theme-border relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
           <Film className="w-32 h-32" />
         </div>

         <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-3xl font-cute text-theme-primary flex items-center gap-3">
                  <Film className="w-8 h-8" />
                  {result.title || "详细拆解方案"}
                </h2>
                <button
                  onClick={() => handleCopy(generateFullReport(), 'full-report')}
                  className="px-6 py-2 bg-theme-secondary text-theme-surface rounded-full shadow-theme-btn font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
                >
                  {copiedId === 'full-report' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  一键复制全部方案
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Theme */}
              <div className="bg-theme-bg/50 p-5 rounded-xl border border-theme-border">
                 <h3 className="text-sm font-black text-theme-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                   <Video className="w-4 h-4" /> 核心主题 (Core Theme)
                 </h3>
                 <p className="text-theme-text font-medium leading-relaxed">{result.theme}</p>
              </div>

              {/* Consistency */}
              <div className="bg-theme-bg/50 p-5 rounded-xl border border-theme-border">
                 <h3 className="text-sm font-black text-theme-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                   <Settings className="w-4 h-4" /> 设定与一致性 (Consistency)
                 </h3>
                 <p className="text-theme-text font-medium leading-relaxed">{result.consistency}</p>
              </div>

               {/* BGM */}
               <div className="bg-theme-bg/50 p-5 rounded-xl border border-theme-border md:col-span-2">
                 <h3 className="text-sm font-black text-theme-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                   <Music className="w-4 h-4" /> 背景音乐分析 (BGM & Audio)
                 </h3>
                 <p className="text-theme-text font-medium leading-relaxed">{result.bgm}</p>
              </div>
            </div>
         </div>
      </div>

      {/* Timeline / Shot List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-cute text-theme-text px-2">逐帧详细拆解 (Frame-by-Frame)</h3>
        
        {result.shots.map((shot, idx) => (
          <div key={idx} className="bg-theme-surface rounded-theme p-6 shadow-theme-card border-l-4 border-theme-primary transition-transform hover:scale-[1.01] group relative">
             
             {/* Header: Timestamp & Copy */}
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="bg-theme-primary text-theme-surface px-3 py-1 rounded-lg font-mono font-bold text-sm shadow-sm flex items-center gap-2">
                     <Clock className="w-4 h-4" /> {shot.timestamp}
                   </div>
                   <span className="text-theme-text-light font-black text-xs uppercase">Shot {idx + 1}</span>
                </div>
                <button
                  onClick={() => handleCopy(generateShotText(shot, idx), `shot-${idx}`)}
                  className="p-2 text-theme-text-light hover:text-theme-primary hover:bg-theme-bg rounded-lg transition-all"
                  title="复制此镜头详情"
                >
                  {copiedId === `shot-${idx}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Visuals */}
                <div className="space-y-4">
                   <div className="bg-theme-bg p-4 rounded-xl border border-theme-border/50">
                      <h4 className="text-xs font-bold text-theme-text-light uppercase mb-2 flex items-center gap-2">
                         <Palette className="w-3 h-3" /> 画面氛围与风格 (Visual & Atmosphere)
                      </h4>
                      <p className="text-sm text-theme-text leading-relaxed">{shot.visual_atmosphere}</p>
                   </div>
                   
                   <div className="bg-theme-bg p-4 rounded-xl border border-theme-border/50">
                      <h4 className="text-xs font-bold text-theme-text-light uppercase mb-2 flex items-center gap-2">
                         <User className="w-3 h-3" /> 人物表现与细节 (Character & Action)
                      </h4>
                      <p className="text-sm text-theme-text leading-relaxed">{shot.character_performance}</p>
                   </div>
                </div>

                {/* Narrative & Technical */}
                <div className="space-y-4">
                   <div className="bg-theme-bg p-4 rounded-xl border border-theme-border/50">
                      <h4 className="text-xs font-bold text-theme-text-light uppercase mb-2 flex items-center gap-2">
                         <Film className="w-3 h-3" /> 剧情与故事细节 (Plot & Story)
                      </h4>
                      <p className="text-sm text-theme-text leading-relaxed">{shot.story_plot}</p>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-theme-bg p-4 rounded-xl border border-theme-border/50">
                          <h4 className="text-xs font-bold text-theme-text-light uppercase mb-2 flex items-center gap-2">
                            <Camera className="w-3 h-3" /> 镜头语言 (Camera)
                          </h4>
                          <p className="text-sm text-theme-text leading-relaxed">{shot.camera_language}</p>
                      </div>
                      <div className="bg-theme-bg p-4 rounded-xl border border-theme-border/50">
                          <h4 className="text-xs font-bold text-theme-text-light uppercase mb-2 flex items-center gap-2">
                            <Volume2 className="w-3 h-3" /> 音效设计 (SFX)
                          </h4>
                          <p className="text-sm text-theme-text leading-relaxed">{shot.audio_design}</p>
                      </div>
                   </div>
                </div>

             </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-theme-bg text-theme-text font-bold rounded-full shadow-theme-btn hover:bg-theme-surface transition-all"
        >
          返回首页
        </button>
      </div>

    </div>
  );
};
