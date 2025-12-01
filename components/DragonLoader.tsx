
import React from 'react';
import { AlertTriangle, Clock, Sparkles } from 'lucide-react';

interface DragonLoaderProps {
  message: string;
  progress?: number;
  uiLang?: 'cn' | 'en';
}

export const DragonLoader: React.FC<DragonLoaderProps> = ({ message, progress = 0, uiLang = 'cn' }) => {
  // Calculate circumference for stroke-dasharray (r=46)
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-12 relative overflow-hidden w-full min-h-[600px]">
      
      {/* Core Container */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-10 group">
        
        {/* Progress Ring SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <defs>
             <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="var(--color-primary)" />
               <stop offset="100%" stopColor="var(--color-secondary)" />
             </linearGradient>
             <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
          </defs>
          
          {/* Background Track */}
          <circle 
            cx="50" cy="50" r={radius} 
            fill="none" 
            stroke="var(--color-border)" 
            strokeWidth="3" 
            className="opacity-30"
          />
          
          {/* Progress Indicator */}
          <circle 
            cx="50" cy="50" r={radius} 
            fill="none" 
            stroke="url(#ringGradient)" 
            strokeWidth="3" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
            filter="url(#glow)"
          />
        </svg>

        {/* Decorative Rotating Rings (Theme Sync) */}
        <div className="absolute inset-6 animate-[spin_8s_linear_infinite]">
             <div className="w-full h-full border-2 border-theme-primary/30 rounded-full border-dashed"></div>
        </div>
        <div className="absolute inset-10 animate-[spin_6s_linear_infinite_reverse]">
             <div className="w-full h-full border border-theme-secondary/40 rounded-full border-dotted"></div>
        </div>

        {/* Dragon Core (Theme Sync) */}
        <div className="relative z-10 w-28 h-28 bg-theme-surface rounded-full border-2 border-theme-primary flex items-center justify-center shadow-theme-card group-hover:scale-105 transition-transform duration-500">
           <div className="text-5xl animate-bounce drop-shadow-md">🐉</div>
        </div>

        {/* Percentage Label */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-mono font-black text-3xl text-theme-primary drop-shadow-sm">
            {Math.round(progress)}%
        </div>
      </div>

      {/* Main Status Text (Dynamic Style + Theme Sync) */}
      <div className="mb-12 text-center space-y-4 z-10 max-w-md px-4">
        <h3 className="text-4xl md:text-5xl font-black italic tracking-wider uppercase relative inline-block">
           <span className="absolute inset-0 text-theme-secondary blur-sm animate-pulse opacity-50">
             {uiLang === 'cn' ? '小渝兒拆解中' : 'XIAO YU ER DISMANTLING'}
           </span>
           <span className="relative bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-primary bg-clip-text text-transparent animate-[shimmer_2s_infinite_linear] bg-[length:200%_auto]">
             {uiLang === 'cn' ? '小渝兒拆解中' : 'XIAO YU ER DISMANTLING'}
           </span>
        </h3>
        
        <div className="flex items-center justify-center gap-3">
           <div className="w-2 h-2 bg-theme-primary rounded-full animate-ping"></div>
           <p className="text-theme-text font-mono font-bold text-sm tracking-wide border-b-2 border-theme-primary/30 pb-1">
             {message || (uiLang === 'cn' ? "正在初始化神经元..." : "Initializing neural pathways...")}
           </p>
           <div className="w-2 h-2 bg-theme-secondary rounded-full animate-ping delay-150"></div>
        </div>
      </div>

      {/* Info Box (Usage Guide) - Theme Synced */}
      <div className="relative w-full max-w-md mx-4 animate-fade-in-up">
        
        {/* Floating Bouncing Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-theme-primary to-theme-secondary text-theme-surface text-xs font-black px-4 py-1.5 rounded-full shadow-lg border border-theme-border flex items-center gap-1 animate-bounce">
             <Sparkles className="w-3 h-3" />
             {uiLang === 'cn' ? '使用指南' : 'USER GUIDE'}
          </div>
        </div>

        {/* Card Content - Theme Synced */}
        <div className="bg-theme-surface/60 backdrop-blur-md border border-theme-border rounded-theme p-6 pt-8 shadow-theme-card relative overflow-hidden group">
           
           {/* Background Grid Effect */}
           <div className="absolute inset-0 opacity-10" 
                style={{
                  backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}>
           </div>

           <div className="relative z-10 space-y-4">
              
              {/* Warnings */}
              <div className="space-y-3">
                 <div className="flex items-start gap-3 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <Clock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-theme-text font-medium leading-relaxed">
                       {uiLang === 'cn' ? '视频时长越大拆解的时间越久，失败的几率也会越高！' : 'Longer videos take longer to process and have a higher risk of failure!'}
                    </p>
                 </div>
                 
                 <div className="flex items-center gap-3 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                    <AlertTriangle className="w-5 h-5 text-green-500 shrink-0" />
                    <p className="text-xs text-theme-text font-medium">
                       {uiLang === 'cn' ? (
                         <>建议时长在 <span className="text-theme-primary font-bold underline">10秒 - 3分钟</span> 之间</>
                       ) : (
                         <>Recommended duration: <span className="text-theme-primary font-bold underline">10s - 3 mins</span></>
                       )}
                    </p>
                 </div>
              </div>

              {/* Author Info */}
              <div className="mt-4 pt-4 border-t border-theme-border flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-theme-primary to-theme-secondary p-[2px] shadow-lg">
                    <div className="w-full h-full bg-theme-surface rounded-full flex items-center justify-center overflow-hidden">
                       <span className="text-2xl">🐟</span>
                    </div>
                 </div>
                 
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                       <h4 className="text-theme-text font-black text-sm tracking-wide">
                          {uiLang === 'cn' ? '小渝兒' : 'Xiao Yu Er'}
                       </h4>
                       <span className="text-[10px] bg-theme-primary/10 text-theme-primary px-1.5 py-0.5 rounded border border-theme-primary/20 font-bold">
                          Author
                       </span>
                    </div>
                    <p className="text-[10px] text-theme-text-light font-mono">
                       {uiLang === 'cn' ? 'AI 视觉逆向工程师 | 专注爆款底层逻辑' : 'AI Visual Reverse Engineer | Viral Logic Expert'}
                    </p>
                 </div>
              </div>

           </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
};
