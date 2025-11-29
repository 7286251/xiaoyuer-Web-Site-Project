import React from 'react';

export const DragonBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      
      {/* Animated Dragon Scales/Grid Effect */}
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: 'linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             transform: 'perspective(500px) rotateX(60deg)',
             transformOrigin: 'top center'
           }}>
      </div>

      {/* Floating Particles (Dragon Fire/Sparks) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
         {Array.from({ length: 10 }).map((_, i) => (
           <div
             key={i}
             className="absolute rounded-full bg-amber-500 blur-sm animate-pulse"
             style={{
               width: Math.random() * 6 + 2 + 'px',
               height: Math.random() * 6 + 2 + 'px',
               top: Math.random() * 100 + '%',
               left: Math.random() * 100 + '%',
               animationDuration: Math.random() * 3 + 2 + 's',
               opacity: Math.random() * 0.5
             }}
           />
         ))}
      </div>

      {/* Dragon Energy Lines (SVG Animation Simulation) */}
      <svg className="absolute w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="#fbbf24" strokeWidth="0.2">
          <animate attributeName="d" dur="10s" repeatCount="indefinite"
            values="M0,50 Q25,0 50,50 T100,50; M0,50 Q25,100 50,50 T100,50; M0,50 Q25,0 50,50 T100,50" />
        </path>
         <path d="M0,20 Q50,80 100,20" fill="none" stroke="#f59e0b" strokeWidth="0.1">
          <animate attributeName="d" dur="15s" repeatCount="indefinite"
            values="M0,20 Q50,80 100,20; M0,80 Q50,20 100,80; M0,20 Q50,80 100,20" />
        </path>
      </svg>
    </div>
  );
};