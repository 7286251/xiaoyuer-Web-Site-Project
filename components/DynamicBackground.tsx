
import React from 'react';
import { ThemeStyle } from '../types';

interface DynamicBackgroundProps {
  themeStyle: ThemeStyle;
  primaryColor: string;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ themeStyle, primaryColor }) => {
  
  // 1. CLAY & NEUMORPHISM (Soft Blobs)
  if (themeStyle === 'clay' || themeStyle === 'neumorphism') {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden theme-transition">
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.8),_transparent_80%)]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-theme-primary rounded-full blur-[80px] opacity-40 animate-[float_10s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-theme-secondary rounded-full blur-[80px] opacity-40 animate-[float_12s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-[30%] left-[60%] w-[300px] h-[300px] bg-theme-primary opacity-30 blur-[60px] animate-[float_8s_ease-in-out_infinite]"></div>
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>
    );
  }

  // 2. BRUTALISM (Grid & Hard Shapes)
  if (themeStyle === 'brutalism') {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-theme-bg theme-transition">
         <div className="absolute inset-0 opacity-20" 
              style={{
                backgroundImage: 'radial-gradient(var(--color-text) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}>
         </div>
         <div className="absolute top-20 left-20 w-40 h-40 border-4 border-theme-text opacity-10 rotate-12"></div>
         <div className="absolute bottom-20 right-20 w-60 h-60 bg-theme-primary rounded-full opacity-20 blur-xl"></div>
      </div>
    );
  }

  // 3. ANIMATED STICKER (Pop Art, Cartoon Shapes)
  if (themeStyle === 'sticker') {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#fafafa] theme-transition">
        {/* Graph Paper BG */}
        <div className="absolute inset-0 opacity-5" 
             style={{
               backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}>
        </div>

        {/* Floating Stickers */}
        {/* Star */}
        <div className="absolute top-[15%] left-[10%] animate-[bounce_3s_infinite]">
          <svg width="60" height="60" viewBox="0 0 24 24" fill={primaryColor} stroke="black" strokeWidth="2">
             <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        {/* Smiley */}
        <div className="absolute top-[50%] right-[15%] animate-[spin_10s_linear_infinite]">
           <div className="w-16 h-16 rounded-full border-2 border-black bg-yellow-300 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
             <div className="text-2xl rotate-90">:)</div>
           </div>
        </div>

        {/* Lightning */}
        <div className="absolute bottom-[20%] left-[20%] animate-pulse">
          <svg width="50" height="80" viewBox="0 0 24 24" fill="var(--color-secondary)" stroke="black" strokeWidth="2">
             <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        {/* Blob */}
        <div className="absolute top-[10%] right-[30%] opacity-20">
           <svg width="100" height="100" viewBox="0 0 200 200" fill="var(--color-primary)">
             <path d="M45.7,-51.2C58.9,-40.3,69.1,-24.5,70.5,-7.9C71.9,8.7,64.5,26.1,52.8,39.6C41.1,53.1,25.1,62.7,8.2,63.9C-8.7,65.1,-26.4,57.9,-40.8,45.8C-55.2,33.7,-66.2,16.8,-66.6,-0.5C-67,-17.7,-56.7,-35.4,-43.3,-46.6C-29.9,-57.8,-13.4,-62.5,1.7,-64.5C16.8,-66.5,32.5,-62.1,45.7,-51.2Z" transform="translate(100 100)" />
           </svg>
        </div>
      </div>
    );
  }
  
  // 4. FLAT / DEFAULT
  if (themeStyle === 'flat' || themeStyle === 'minimal') {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-theme-bg theme-transition">
             <div className="absolute inset-0 opacity-10" 
              style={{
                backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}>
            </div>
        </div>
    )
  }

  return <div className="fixed inset-0 bg-theme-bg z-0" />;
};
