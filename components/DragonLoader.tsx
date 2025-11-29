import React from 'react';

interface DragonLoaderProps {
  message: string;
}

export const DragonLoader: React.FC<DragonLoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 relative overflow-hidden w-full">
      
      {/* 核心容器 */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        
        {/* 背景光晕 */}
        <div className="absolute inset-0 bg-amber-600/20 rounded-full blur-3xl animate-pulse"></div>
        
        {/* 龙行环绕特效 - 外圈 (逆时针) */}
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite_reverse]">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="dragonGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#d97706" /> {/* amber-600 */}
                <stop offset="100%" stopColor="#fbbf24" /> {/* amber-400 */}
              </linearGradient>
            </defs>
            {/* 模拟龙身的弧线 */}
            <path 
              d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0" 
              fill="none" 
              stroke="url(#dragonGradient1)" 
              strokeWidth="2"
              strokeDasharray="200 100"
              strokeLinecap="round"
              className="opacity-80"
            />
            {/* 龙头光点 */}
            <circle cx="50" cy="5" r="3" fill="#fbbf24" className="shadow-[0_0_10px_#fbbf24]" />
          </svg>
        </div>

        {/* 龙行环绕特效 - 内圈 (顺时针，更快速) */}
        <div className="absolute inset-4 animate-[spin_2s_linear_infinite]">
          <svg className="w-full h-full" viewBox="0 0 100 100">
             <defs>
              <linearGradient id="dragonGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="30%" stopColor="#b45309" /> 
                <stop offset="100%" stopColor="#fcd34d" /> 
              </linearGradient>
            </defs>
            <path 
              d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" 
              fill="none" 
              stroke="url(#dragonGradient2)" 
              strokeWidth="3"
              strokeDasharray="150 80"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 科技感网格圆环 */}
        <div className="absolute inset-0 border border-amber-500/10 rounded-full scale-125 animate-pulse"></div>
        <div className="absolute inset-0 border border-slate-700/50 rounded-full scale-75 border-dashed animate-[spin_10s_linear_infinite]"></div>

        {/* 核心龙珠/AI大脑 */}
        <div className="relative z-10 w-20 h-20 bg-slate-950 rounded-full border border-amber-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.2)]">
           <div className="text-3xl animate-bounce">🐉</div>
           {/* 环绕核心的小粒子 */}
           <div className="absolute w-full h-full animate-[spin_4s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full blur-[1px]"></div>
           </div>
        </div>
      </div>

      {/* 动态进度文字 */}
      <div className="mt-8 text-center space-y-3 z-10">
        <h3 className="text-2xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent animate-pulse tracking-wider">
          AI 龙脑正在拆解
        </h3>
        <div className="flex items-center justify-center gap-2">
           <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
           <p className="text-amber-100/80 font-mono text-sm border-b border-amber-500/30 pb-1">
             {message || "正在初始化神经元..."}
           </p>
           <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping delay-150"></div>
        </div>
      </div>
      
    </div>
  );
};