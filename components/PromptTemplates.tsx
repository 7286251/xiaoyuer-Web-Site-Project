
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Check, Film, Ghost, Leaf, Play, Maximize2 } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

interface PromptTemplatesProps {
  uiLang: 'cn' | 'en';
}

interface TemplateItem {
  id: string;
  title: { cn: string; en: string };
  prompt: string;
  videoUrl: string;
}

interface TemplateCategory {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
  items: TemplateItem[];
}

const TEMPLATE_DATA: TemplateCategory[] = [
  {
    id: 'anime',
    labelKey: 'catAnime',
    icon: <Ghost className="w-4 h-4" />,
    items: [
      {
        id: 'anime-forest',
        title: { cn: "二次元：月下森林少女", en: "Anime: Night Forest Girl" },
        // Using a particle/magical forest placeholder video
        videoUrl: "https://videos.pexels.com/video-files/2658976/2658976-hd_1920_1080_30fps.mp4", 
        prompt: "In the style of a Japanese anime film, high-quality 2D limited animation with cel shading. A night forest filled with glowing particles, fluttering butterflies, swaying flowers, and shimmering reflections on the water. Amidst this dreamlike scenery, a white-haired girl walks, pauses, and gently interacts with her surroundings. The screen cuts frequently, with both objects and the camera in constant motion. Multi-shot composition: 1. Close-up of the girl’s feet as she steps near the water, ripples spreading with light. 2. Side-tracking shot as she walks among glowing flowers, particles and butterflies drifting around her. 3. She stops, reaching out to touch a flower. Petals fall and scatter onto the water. 4. Close-up of her face, a blink, hair swaying gently in the breeze, background light pulsing. 5. Overhead view of the glowing forest and river as she continues walking. 6. She turns back, butterflies sweep across the frame, camera slowly circling. 7. Wide shot, the entire forest bathed in luminous glow. Climax: The girl stops, and countless butterflies rise all at once, taking flight into the night sky. The camera follows their ascent, the sky filling with glowing wings, petals, and light particles. The scene is flooded with fantastical radiance before gently fading to black."
      },
      {
        id: 'anime-cyborg',
        title: { cn: "赛博格少女特写", en: "Cyborg Girl Close-up" },
        // Placeholder for high-tech/city vibes
        videoUrl: "https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4",
        prompt: "Anime style close-up of a cyborg girl with glowing blue eyes, mechanical parts visible on her face, city lights bokeh in the background, sharp focus, high quality animation, Makoto Shinkai style lighting, emotional expression, rain falling softly."
      }
    ]
  },
  {
    id: 'cinematic',
    labelKey: 'catCinematic',
    icon: <Film className="w-4 h-4" />,
    items: [
      {
        id: 'cine-city',
        title: { cn: "史诗级赛博城市", en: "Epic Cyberpunk City" },
        videoUrl: "https://videos.pexels.com/video-files/2098989/2098989-hd_1920_1080_30fps.mp4",
        prompt: "Cinematic establishing shot of a futuristic cyberpunk city at night, neon lights reflecting on wet rain-slicked streets, towering skyscrapers with holographic advertisements, flying cars moving in traffic lanes, volumetric fog, high contrast, teal and orange color grading, photorealistic, 8k resolution, shot on IMAX."
      },
      {
        id: 'cine-battle',
        title: { cn: "历史战争史诗", en: "Historical Battle Epic" },
        videoUrl: "https://videos.pexels.com/video-files/4552434/4552434-uhd_2560_1440_25fps.mp4", // Placeholder: misty forest/moody
        prompt: "Wide shot of a medieval battlefield at dawn, thousands of soldiers in armor clashing, dust and smoke rising, golden hour lighting, dramatic shadows, intense atmosphere, highly detailed textures, motion blur, cinematic composition, directed by Ridley Scott."
      }
    ]
  },
  {
    id: 'nature',
    labelKey: 'catNature',
    icon: <Leaf className="w-4 h-4" />,
    items: [
      {
        id: 'nature-sea',
        title: { cn: "深海生物发光", en: "Bioluminescent Deep Sea" },
        videoUrl: "https://videos.pexels.com/video-files/855018/855018-hd_1920_1080_30fps.mp4",
        prompt: "National Geographic footage style, deep underwater scene, bioluminescent jellyfish glowing in the dark, coral reefs, particles floating, 4k resolution, macro lens, slow motion, mystical atmosphere."
      },
      {
        id: 'nature-forest',
        title: { cn: "迷雾森林", en: "Misty Ancient Forest" },
        videoUrl: "https://videos.pexels.com/video-files/1536322/1536322-hd_1920_1080_30fps.mp4",
        prompt: "Fly-through shot of an ancient redwood forest in morning mist, sunbeams piercing through the canopy (God rays), ferns covering the forest floor, hyper-realistic, 8k, unreal engine 5 render style, peaceful."
      }
    ]
  },
  {
    id: 'surreal',
    labelKey: 'catSurreal',
    icon: <Sparkles className="w-4 h-4" />,
    items: [
      {
        id: 'surreal-cloud',
        title: { cn: "云端漫步", en: "Cloud Walk" },
        videoUrl: "https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_25fps.mp4",
        prompt: "Surreal dreamscape, a person walking on clouds that look like cotton candy, pink and purple sky, giant floating planets in the background, zero gravity, magical atmosphere, 3D render, ethereal lighting."
      },
      {
        id: 'surreal-ink',
        title: { cn: "水墨流体", en: "Ink Fluid Simulation" },
        videoUrl: "https://videos.pexels.com/video-files/1448735/1448735-hd_1920_1080_24fps.mp4",
        prompt: "Macro shot of colorful ink dropping into water, swirling and mixing, abstract fluid simulation, slow motion, vibrant colors (red, gold, black), high contrast, artistic, 4k."
      }
    ]
  }
];

const VideoCard: React.FC<{ item: TemplateItem; uiLang: 'cn' | 'en' }> = ({ item, uiLang }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="group relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-theme-card border-2 border-theme-border bg-black cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-theme-primary"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        src={item.videoUrl}
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        muted
        loop
        playsInline
      />

      {/* Default State: Title Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <h4 className="text-white font-bold text-lg drop-shadow-md truncate">
          {uiLang === 'cn' ? item.title.cn : item.title.en}
        </h4>
        <div className="flex items-center gap-2 text-white/70 text-xs mt-1">
           <Play className="w-3 h-3 fill-current" /> <span className="uppercase tracking-wider">Preview</span>
        </div>
      </div>

      {/* Hover State: Full Info Overlay */}
      <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm p-6 flex flex-col transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex justify-between items-start mb-2">
           <h4 className="text-theme-primary font-bold text-base line-clamp-1">
             {uiLang === 'cn' ? item.title.cn : item.title.en}
           </h4>
        </div>
        
        <p className="text-gray-300 text-xs leading-relaxed line-clamp-4 font-mono mb-4 flex-1 overflow-hidden">
          {item.prompt}
        </p>

        <button
          onClick={handleCopy}
          className="w-full py-2 bg-theme-primary text-theme-surface rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {uiLang === 'cn' ? '复制提示词' : 'Copy Prompt'}
        </button>
      </div>

      {/* Play Icon Indicator (Hidden on hover) */}
      {!isPlaying && !isHovered && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 text-white shadow-lg">
           <Play className="w-5 h-5 fill-current ml-1" />
        </div>
      )}
    </div>
  );
};

export const PromptTemplates: React.FC<PromptTemplatesProps> = ({ uiLang }) => {
  const t = TRANSLATIONS[uiLang];
  const [activeTab, setActiveTab] = useState(TEMPLATE_DATA[0].id);

  const activeCategory = TEMPLATE_DATA.find(c => c.id === activeTab);

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 animate-fade-in-up px-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-theme-secondary rounded-2xl flex items-center justify-center shadow-theme-btn rotate-3 transform transition-transform hover:rotate-6">
            <Sparkles className="w-6 h-6 text-theme-surface animate-pulse" />
          </div>
          <div>
             <h3 className="text-2xl md:text-3xl font-cute text-theme-text flex items-center gap-2">
               {t.templateTitle} <span className="text-sm bg-theme-primary text-white px-2 py-0.5 rounded-md font-sans font-bold uppercase tracking-wider shadow-sm">Pro</span>
             </h3>
             <p className="text-theme-text-light font-medium">{t.templateDesc}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-8 pb-2">
        {TEMPLATE_DATA.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all whitespace-nowrap shadow-sm border-2
              ${activeTab === cat.id 
                ? 'bg-theme-text text-theme-surface border-theme-text scale-105 shadow-md' 
                : 'bg-theme-bg text-theme-text-light border-transparent hover:bg-theme-surface hover:border-theme-border'}
            `}
          >
            {cat.icon}
            {/* @ts-ignore */}
            {t[cat.labelKey] || cat.id}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        {activeCategory?.items.map((item) => (
          <VideoCard key={item.id} item={item} uiLang={uiLang} />
        ))}
      </div>

    </div>
  );
};
