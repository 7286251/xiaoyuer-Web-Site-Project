import React, { useEffect, useState } from 'react';

const FlipCard = ({ digit }: { digit: string }) => {
  return (
    <div className="relative w-8 h-12 bg-theme-text rounded-md overflow-hidden shadow-sm border border-theme-border/20 group">
      <div className="absolute inset-0 flex items-center justify-center text-2xl font-mono font-bold text-theme-surface z-10">
        {digit}
      </div>
      {/* Horizontal Line for Flip Look */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-theme-bg/50 z-20"></div>
      
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
    </div>
  );
};

export const FlipClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');
  
  const h = format(time.getHours());
  const m = format(time.getMinutes());
  const s = format(time.getSeconds());

  return (
    <div className="hidden xl:flex flex-col items-center gap-2 p-5 bg-theme-surface/60 backdrop-blur-md rounded-2xl border-2 border-theme-border shadow-theme-card animate-fade-in-left absolute left-4 top-8 z-30 transform hover:scale-105 transition-transform duration-300">
      <span className="text-[10px] font-black text-theme-primary uppercase tracking-[0.2em] mb-1 bg-theme-bg px-2 py-0.5 rounded-full shadow-inner">
        SYSTEM TIME
      </span>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <FlipCard digit={h[0]} />
          <FlipCard digit={h[1]} />
        </div>
        <div className="flex flex-col gap-1 py-1">
           <div className="w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
           <div className="w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
        </div>
        <div className="flex gap-1">
          <FlipCard digit={m[0]} />
          <FlipCard digit={m[1]} />
        </div>
        <div className="flex flex-col gap-1 py-1">
           <div className="w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
           <div className="w-1 h-1 bg-theme-text rounded-full animate-pulse"></div>
        </div>
        <div className="flex gap-1">
          <FlipCard digit={s[0]} />
          <FlipCard digit={s[1]} />
        </div>
      </div>
    </div>
  );
};