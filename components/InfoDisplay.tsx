import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Globe } from 'lucide-react';

export const InfoDisplay: React.FC = () => {
  const [dateInfo, setDateInfo] = useState({
    ymd: '',
    weekday: '',
    lunar: '',
    zone: ''
  });

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      
      // Standard Date
      const ymd = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const weekday = now.toLocaleDateString('zh-CN', { weekday: 'long' });
      
      // Timezone
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1] || 'Local';

      // Lunar Date (using Intl API)
      let lunar = '';
      try {
        lunar = new Intl.DateTimeFormat('zh-CN', { 
          calendar: 'chinese', 
          day: 'numeric', 
          month: 'long' 
        }).format(now);
        // Cleanup typical format "2024年九月27" -> "农历 九月二十七"
        lunar = lunar.replace(/[0-9]+年/, "农历 ");
      } catch (e) {
        lunar = '农历 计算中...';
      }

      setDateInfo({ ymd, weekday, lunar, zone });
    };

    updateDate();
    const timer = setInterval(updateDate, 60000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden xl:flex flex-col items-end gap-1 p-5 bg-theme-surface/60 backdrop-blur-md rounded-2xl border-2 border-theme-border shadow-theme-card animate-fade-in-right absolute right-4 top-8 z-30 transform hover:scale-105 transition-transform duration-300 min-w-[200px]">
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-black text-theme-secondary bg-theme-bg px-2 py-0.5 rounded-full shadow-inner tracking-wider flex items-center gap-1 uppercase">
           <MapPin className="w-3 h-3" /> {dateInfo.zone}
        </span>
      </div>

      <div className="text-3xl font-black text-theme-text font-mono leading-none tracking-tight">
        {dateInfo.ymd}
      </div>
      
      <div className="text-sm font-bold text-theme-text-light flex gap-2 items-center">
         <span className="bg-theme-bg px-2 py-0.5 rounded-md text-xs">{dateInfo.weekday}</span>
      </div>

      <div className="w-full h-px bg-theme-border/50 my-2"></div>

      <div className="text-sm font-cute text-theme-primary flex items-center gap-1.5 font-bold">
        <Calendar className="w-4 h-4" />
        {dateInfo.lunar}
      </div>
    </div>
  );
};