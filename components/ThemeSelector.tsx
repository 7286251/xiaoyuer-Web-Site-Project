
import React, { useState } from 'react';
import { X, Palette, Grid, Zap, Layers, Box, Upload, Smile, Check } from 'lucide-react';
import { ALL_THEMES } from '../utils/themeGenerator';
import { Theme, ThemeStyle, VideoWallpaper } from '../types';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (theme: Theme) => void;
  onSelectVideo: (video: VideoWallpaper) => void;
  backgroundMode: 'css' | 'video';
  currentVideoId?: string;
  uiLang: 'cn' | 'en';
}

const CATEGORIES: { id: ThemeStyle | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: '全部', icon: <Grid className="w-4 h-4" /> },
  { id: 'clay', label: '软萌粘土', icon: <Box className="w-4 h-4" /> },
  { id: 'brutalism', label: '新粗野', icon: <Zap className="w-4 h-4" /> },
  { id: 'neumorphism', label: '新拟态', icon: <Layers className="w-4 h-4" /> },
  { id: 'sticker', label: '动画贴纸', icon: <Smile className="w-4 h-4" /> },
  { id: 'flat', label: '扁平极简', icon: <Palette className="w-4 h-4" /> },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  isOpen, onClose, currentThemeId, onSelectTheme, onSelectVideo, backgroundMode, currentVideoId 
}) => {
  const [activeTab, setActiveTab] = useState<'css' | 'video'>('css');
  const [activeCategory, setActiveCategory] = useState<ThemeStyle | 'all'>('all');

  const filteredThemes = activeCategory === 'all' 
    ? ALL_THEMES 
    : ALL_THEMES.filter(t => t.style === activeCategory);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      onSelectVideo({
        id: `local-${Date.now()}`,
        name: file.name,
        url: url,
        isLocal: true
      });
      // onClose(); // Allow user to see change first
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent backdrop allows previewing changes */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[scale-in_0.3s_ease-out]">
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-20">
          <div>
            <h2 className="text-3xl font-cute text-slate-800 tracking-wide">
              随心换主题引擎 <span className="text-slate-300 mx-2">|</span> <span className="text-slate-500 text-lg">Visual Engine</span>
            </h2>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="flex gap-8 px-8 pt-6 pb-0 bg-white border-b border-slate-200">
           <button 
             onClick={() => setActiveTab('css')}
             className={`pb-4 px-2 text-lg font-bold transition-all relative ${activeTab === 'css' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
           >
             🎨 UI 主题风格
             {activeTab === 'css' && <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800 rounded-t-full"></div>}
           </button>
           <button 
             onClick={() => setActiveTab('video')}
             className={`pb-4 px-2 text-lg font-bold transition-all relative ${activeTab === 'video' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
           >
             🎬 动态视频壁纸
             {activeTab === 'video' && <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800 rounded-t-full"></div>}
           </button>
        </div>

        {activeTab === 'css' && (
          <>
            <div className="flex items-center gap-3 p-4 bg-slate-50 overflow-x-auto scrollbar-hide border-b border-slate-200">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all
                    ${activeCategory === cat.id 
                      ? 'bg-slate-800 text-white shadow-lg scale-105' 
                      : 'bg-white text-slate-600 hover:bg-slate-200'}
                  `}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredThemes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => onSelectTheme(theme)}
                    className={`group relative aspect-[4/3] rounded-2xl overflow-hidden border-4 transition-all duration-300 flex flex-col
                      ${currentThemeId === theme.id && backgroundMode === 'css' ? 'border-slate-800 scale-[1.02] shadow-xl ring-4 ring-slate-800/20' : 'border-transparent hover:scale-105 shadow-sm hover:shadow-md'}
                    `}
                    style={{ backgroundColor: theme.colors.bg }}
                  >
                    <div className="flex-1 w-full flex items-center justify-center p-4 relative">
                      <div 
                        className="w-12 h-12 flex items-center justify-center text-xs font-bold transition-transform group-hover:rotate-12"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.surface,
                          borderRadius: theme.borderRadius === '0px' ? '0px' : '50%',
                          boxShadow: theme.shadows.button
                        }}
                      >
                        Aa
                      </div>
                    </div>
                    <div className="p-2 bg-white/90 backdrop-blur text-center text-xs font-bold text-slate-700 truncate w-full">
                      {theme.name}
                    </div>
                    {currentThemeId === theme.id && backgroundMode === 'css' && (
                      <div className="absolute top-2 left-2 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'video' && (
          <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col p-8 items-center justify-center relative">
            
            {/* Cool Voice Clone Dynamic Link */}
            <div className="absolute top-6 right-6 z-10">
               <a 
                 href="https://noiz.ai" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-xy"></div>
                 <div className="relative flex items-center gap-2 text-white font-black italic tracking-wider">
                   <span>🎙️ 声音克隆</span>
                 </div>
               </a>
            </div>

            <div className="mb-10 relative group cursor-default">
               <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
               <div className="relative px-8 py-4 bg-black rounded-lg leading-none flex items-center">
                 <span className="text-gray-200 font-bold mr-2">🚀 Pro Mode:</span>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 font-black animate-pulse">
                   自由投屏 & 本地播放
                 </span>
               </div>
            </div>

            <div className="w-full max-w-lg">
              <div className="relative group border-2 border-dashed border-slate-300 rounded-3xl p-10 flex flex-col items-center justify-center hover:bg-white hover:border-slate-800 transition-all cursor-pointer bg-white shadow-sm hover:shadow-xl">
                <input 
                  type="file" 
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-slate-800 transition-colors">
                   <Upload className="w-10 h-10 text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">上传本地视频</h3>
                <p className="text-sm text-slate-400">支持 MP4, WebM</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
