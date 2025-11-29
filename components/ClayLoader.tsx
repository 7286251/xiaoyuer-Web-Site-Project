
import React from 'react';

interface ThemeLoaderProps {
  message: string;
  progress?: number;
}

export const ThemeLoader: React.FC<ThemeLoaderProps> = ({ message, progress = 0 }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 relative overflow-hidden w-full">
      
      {/* Animation Container */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-10">
        
        {/* Bouncing Ball 1 (Primary) */}
        <div className="absolute w-12 h-12 bg-theme-primary rounded-full shadow-theme-btn animate-[bounce_1s_infinite] left-8 top-12 z-20">
           <div className="absolute top-2 right-3 w-3 h-3 bg-white/60 rounded-full blur-[1px]"></div>
        </div>

        {/* Bouncing Ball 2 (Secondary) - Delayed */}
        <div className="absolute w-10 h-10 bg-theme-secondary rounded-full shadow-theme-btn animate-[bounce_1.2s_infinite] delay-100 right-8 top-14 z-10">
           <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full blur-[1px]"></div>
        </div>
        
        {/* Orbital Ring */}
        <div className="absolute w-36 h-36 border-4 border-theme-border rounded-full animate-[spin_6s_linear_infinite] border-dashed opacity-50"></div>
      </div>

      {/* Dynamic Progress Section */}
      <div className="bg-theme-surface px-8 py-6 rounded-theme shadow-theme-card border-2 border-theme-border text-center relative max-w-lg w-full mx-4">
        
        <div className="flex justify-between items-end mb-3">
          <h3 className="text-xl font-cute text-theme-primary tracking-widest animate-pulse">
            小渝兒思考中...
          </h3>
          <span className="text-2xl font-black text-theme-secondary font-mono">
            {progress}%
          </span>
        </div>

        {/* CSS Tech Progress Bar */}
        <div className="relative w-full h-5 bg-theme-bg rounded-full shadow-theme-inset overflow-hidden mb-4">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-primary background-animate transition-all duration-700 ease-out"
            style={{ 
              width: `${progress}%`,
              backgroundSize: '200% 100%',
              animation: 'shine 2s infinite linear' 
            }}
          >
             {/* Glossy Overlay */}
             <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
           <p className="text-theme-text-light font-medium text-sm">
             {message || "正在分析黄金钩子..."}
           </p>
        </div>
      </div>
      
      <style>{`
        @keyframes shine {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
        .background-animate {
          animation: shine 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
