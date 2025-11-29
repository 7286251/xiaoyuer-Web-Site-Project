
import React, { useCallback, useState } from 'react';
import { Upload, Video, Link as LinkIcon, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
  uiLang: 'cn' | 'en';
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileSelect, isAnalyzing, uiLang }) => {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    setIsDownloading(true);
    setDownloadMsg("正在尝试连接...");
    
    try {
      if (!urlInput.startsWith('http')) throw new Error("请输入 http/https 链接");
      
      let response: Response;
      let usedProxy = false;

      // 1. Try Direct Fetch
      try {
        response = await fetch(urlInput, { method: 'GET' });
        if (!response.ok) throw new Error("Direct fetch failed");
      } catch (e) {
        // 2. Fallback to AllOrigins Proxy if direct fetch fails (CORS)
        console.log("Direct fetch failed, trying proxy...");
        setDownloadMsg("正在尝试代理下载...");
        usedProxy = true;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlInput)}`;
        response = await fetch(proxyUrl);
      }

      if (!response.ok) throw new Error(`下载失败: ${response.status} ${response.statusText}`);
      
      const blob = await response.blob();
      if (blob.size < 1000) throw new Error("文件过小，可能无法访问该链接");

      const fileName = urlInput.split('/').pop()?.split('?')[0] || 'downloaded_video.mp4';
      const file = new File([blob], fileName, { type: blob.type || 'video/mp4' });
      
      onFileSelect(file);
      setUrlInput(''); // Clear input on success
      
    } catch (error: any) {
      console.error("URL Download Error:", error);
      alert(`无法解析链接: ${error.message}\n建议：\n1. 请使用直链 (.mp4/.mov)\n2. 部分平台(抖音/B站)链接不支持直接解析，请先下载视频文件。`);
    } finally {
      setIsDownloading(false);
      setDownloadMsg("");
    }
  };

  const t = {
    cn: {
      title: "拖入爆款视频",
      desc: "支持 MP4, MOV。小渝兒将自动识别黄金三秒钩子。",
      or: "或者",
      placeholder: "粘贴视频链接 (https://...)",
      btnParse: "解析链接",
      downloading: "下载中"
    },
    en: {
      title: "Drop Viral Video",
      desc: "Supports MP4, MOV. Auto-detects 3s Hook.",
      or: "OR",
      placeholder: "Paste Video URL (https://...)",
      btnParse: "Parse Link",
      downloading: "Downloading"
    }
  }[uiLang];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Drop Zone */}
      <div 
        className={`relative group rounded-theme transition-all duration-300 ease-out border-theme
          ${dragActive ? 'bg-theme-bg shadow-theme-inset border-theme-primary' : 'bg-theme-surface shadow-theme-card border-theme-border hover:translate-y-[-4px]'}
          ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          accept="video/*"
          onChange={handleChange}
          disabled={isAnalyzing || isDownloading}
        />
        
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center relative overflow-hidden rounded-theme">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-theme-secondary opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-theme-primary opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 shadow-theme-card border-theme border-theme-border
            ${dragActive ? 'bg-theme-primary scale-110 rotate-12 text-theme-surface' : 'bg-theme-bg text-theme-secondary'}
          `}>
            <Upload className="w-10 h-10" strokeWidth={2.5} />
          </div>
          
          <h3 className="text-2xl font-cute text-theme-text mb-2 tracking-wide">
            {t.title}
          </h3>
          <p className="text-theme-text-light font-medium max-w-sm">
            {t.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 px-8">
        <div className="h-1 bg-theme-border rounded-full flex-1"></div>
        <span className="text-theme-text-light font-cute text-lg">{t.or}</span>
        <div className="h-1 bg-theme-border rounded-full flex-1"></div>
      </div>

      {/* URL Input */}
      <div className="flex flex-col md:flex-row gap-4 px-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <LinkIcon className="h-5 w-5 text-theme-primary" />
          </div>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={isDownloading || isAnalyzing}
            className="block w-full pl-12 pr-4 py-4 rounded-theme bg-theme-bg text-theme-text placeholder-theme-text-light focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all shadow-theme-inset border-theme border-transparent font-medium"
            placeholder={t.placeholder}
          />
        </div>
        <button
          onClick={handleUrlSubmit}
          disabled={isDownloading || isAnalyzing || !urlInput}
          className={`px-8 py-4 rounded-theme font-bold shadow-theme-btn transition-all active:scale-95 flex items-center justify-center min-w-[160px] border-theme border-theme-border
            ${isDownloading || !urlInput ? 'bg-theme-bg text-theme-text-light cursor-not-allowed' : 'bg-theme-secondary text-theme-surface hover:brightness-110'}
          `}
        >
          {isDownloading ? (
             <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {downloadMsg || t.downloading}</>
          ) : (
             <><Sparkles className="w-5 h-5 mr-2" /> {t.btnParse}</>
          )}
        </button>
      </div>
    </div>
  );
};
