
import React, { useState } from 'react';
import { Copy, Check, Hash, Type, AlignLeft, Youtube, Video, PlayCircle } from 'lucide-react';
import { PlatformMatrix as PlatformMatrixType, PlatformContent } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface PlatformMatrixProps {
  data: PlatformMatrixType;
  uiLang: 'cn' | 'en';
}

type PlatformKey = keyof PlatformMatrixType;

const PLATFORMS: { key: PlatformKey; label: string; icon: React.ReactNode }[] = [
  { key: 'douyin', label: '抖音', icon: <span className="font-black">🎵</span> },
  { key: 'kuaishou', label: '快手', icon: <span className="font-black">🟠</span> },
  { key: 'shipinhao', label: '视频号', icon: <span className="font-black">💚</span> },
  { key: 'xiaohongshu', label: '小红书', icon: <span className="font-black">📕</span> },
  { key: 'bilibili', label: 'B站', icon: <span className="font-black">📺</span> },
  { key: 'xigua', label: '西瓜', icon: <span className="font-black">🍉</span> },
  { key: 'toutiao', label: '头条', icon: <span className="font-black">📰</span> },
  { key: 'weibo', label: '微博', icon: <span className="font-black">👁️</span> },
  { key: 'baijiahao', label: '百家号', icon: <span className="font-black">🅱️</span> },
  { key: 'youtube', label: 'YouTube', icon: <Youtube className="w-4 h-4" /> },
  { key: 'tiktok', label: 'TikTok', icon: <span className="font-black">🎼</span> },
];

export const PlatformMatrix: React.FC<PlatformMatrixProps> = ({ data, uiLang }) => {
  const [activeTab, setActiveTab] = useState<PlatformKey>('douyin');
  const [copied, setCopied] = useState<string | null>(null);
  const t = TRANSLATIONS[uiLang];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentData: PlatformContent = data[activeTab] || { title: "N/A", content: "No data available", hashtags: [] };

  return (
    <div className="bg-theme-surface rounded-theme p-0 shadow-theme-card border-theme border-theme-border overflow-hidden">
      
      {/* Platform Tabs - Scrollable */}
      <div className="flex overflow-x-auto scrollbar-hide bg-theme-bg/50 border-b border-theme-border p-2 gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.key}
            onClick={() => setActiveTab(p.key)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap
              ${activeTab === p.key 
                ? 'bg-theme-primary text-theme-surface shadow-theme-btn' 
                : 'bg-theme-surface text-theme-text-light hover:bg-theme-bg'}
            `}
          >
            {p.icon}
            {p.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 space-y-6 animate-fade-in-up">
        
        {/* Title Section */}
        <div className="bg-theme-bg rounded-theme p-4 shadow-theme-inset border border-theme-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-theme-secondary font-cute">
              <Type className="w-4 h-4" /> <span>{t.viralTitle}</span>
            </div>
            <button 
              onClick={() => handleCopy(currentData.title, 'title')}
              className="p-1.5 text-theme-primary hover:bg-theme-surface rounded-lg transition-colors"
            >
              {copied === 'title' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-lg font-bold text-theme-text leading-tight">{currentData.title}</p>
        </div>

        {/* Copy Section */}
        <div className="bg-theme-bg rounded-theme p-4 shadow-theme-inset border border-theme-border relative group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-theme-text-light font-cute">
              <AlignLeft className="w-4 h-4" /> <span>{t.viralContent}</span>
            </div>
            <button 
              onClick={() => handleCopy(currentData.content, 'content')}
              className="p-1.5 text-theme-primary hover:bg-theme-surface rounded-lg transition-colors"
            >
              {copied === 'content' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-sm text-theme-text leading-relaxed whitespace-pre-wrap">{currentData.content}</p>
        </div>

        {/* Hashtags Section */}
        <div className="bg-theme-surface border-2 border-theme-secondary/20 border-dashed rounded-theme p-4 flex flex-wrap gap-2 items-center">
          <div className="mr-2 text-theme-secondary"><Hash className="w-4 h-4" /></div>
          {currentData.hashtags.map((tag, idx) => (
             <span key={idx} className="bg-theme-secondary/10 text-theme-secondary px-2 py-1 rounded-md text-xs font-bold">
               #{tag}
             </span>
          ))}
          <button 
             onClick={() => handleCopy(currentData.hashtags.map(t => `#${t}`).join(' '), 'tags')}
             className="ml-auto p-1.5 bg-theme-secondary text-theme-surface rounded-lg shadow-sm hover:brightness-110"
             title="复制所有话题"
          >
             {copied === 'tags' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

      </div>
    </div>
  );
};
