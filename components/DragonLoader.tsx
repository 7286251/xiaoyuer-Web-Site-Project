import React from 'react';

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
    <div className="flex flex-col items-center justify-center py-24 relative overflow-hidden w-full">
      
      {/* Core Container */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-4">
        
        {/* Progress Ring SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <defs>
             <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#f59e0b" /> {/* amber-500 */}
               <stop offset="100%" stopColor="#d97706" /> {/* amber-600 */}
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
            stroke="#451a03" 
            strokeWidth="3" 
            className="opacity-10"
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

        {/* Decorative Rotating Rings */}
        <div className="absolute inset-6 animate-[spin_8s_linear_infinite]">
             <div className="w-full h-full border-2 border-amber-500/20 rounded-full border-dashed"></div>
        </div>
        <div className="absolute inset-10 animate-[spin_6s_linear_infinite_reverse]">
             <div className="w-full h-full border border-orange-500/30 rounded-full border-dotted"></div>
        </div>

        {/* Dragon Core */}
        <div className="relative z-10 w-28 h-28 bg-slate-950 rounded-full border border-amber-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)]">
           <div className="text-5xl animate-bounce drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">🐉</div>
        </div>

        {/* Percentage Label */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-mono font-black text-2xl text-amber-500 drop-shadow-md">
            {Math.round(progress)}%
        </div>
      </div>

      {/* Text Info */}
      <div className="mt-8 text-center space-y-4 z-10 max-w-md px-4">
        <h3 className="text-3xl font-black bg-gradient-to-r from-amber-200 via-orange-400 to-amber-600 bg-clip-text text-transparent animate-pulse tracking-widest uppercase">
           {uiLang === 'cn' ? 'AI 龙脑解析中' : 'AI DRAGON PROCESSING'}
        </h3>
        
        <div className="flex items-center justify-center gap-3">
           <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
           <p className="text-amber-800 dark:text-amber-100/90 font-mono font-bold text-sm tracking-wide border-b border-amber-500/30 pb-1">
             {message || (uiLang === 'cn' ? "正在初始化神经元..." : "Initializing neural pathways...")}
           </p>
           <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping delay-150"></div>
        </div>
      </div>
      
    </div>
  );
};