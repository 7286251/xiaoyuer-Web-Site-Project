import React from 'react';

export const ClayBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f0f4f8]">
      
      {/* Soft Gradient Mesh Base */}
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.8),_transparent_80%)]"></div>

      {/* Floating Clay Blobs */}
      {/* Pink Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ffc8dd] rounded-full blur-[80px] opacity-40 animate-[float_10s_ease-in-out_infinite]"></div>
      
      {/* Blue Blob */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#bde0fe] rounded-full blur-[80px] opacity-40 animate-[float_12s_ease-in-out_infinite_reverse]"></div>
      
      {/* Purple Blob */}
      <div className="absolute top-[30%] left-[60%] w-[300px] h-[300px] bg-[#cdb4db] rounded-full blur-[60px] opacity-30 animate-[float_8s_ease-in-out_infinite]"></div>

      {/* Yellow Blob */}
      <div className="absolute top-[60%] left-[10%] w-[250px] h-[250px] bg-[#fdfd96] rounded-full blur-[60px] opacity-30 animate-[float_15s_ease-in-out_infinite_reverse]"></div>

      {/* Overlay Texture (Subtle Noise) */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
    </div>
  );
};