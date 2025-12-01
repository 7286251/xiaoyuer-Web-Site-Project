
import React, { useState, useRef, useEffect } from 'react';
import { DynamicBackground } from './components/DynamicBackground';
import { VideoBackground } from './components/VideoBackground';
import { ThemeSelector } from './components/ThemeSelector';
import { VideoUploader } from './components/VideoUploader';
import { ResultCard } from './components/ResultCard';
import { DragonLoader } from './components/DragonLoader';
import { VideoTrimmer } from './components/VideoTrimmer';
import { PlatformMatrix } from './components/PlatformMatrix';
import { FlipClock } from './components/FlipClock'; 
import { InfoDisplay } from './components/InfoDisplay'; 
import { FeedbackModal } from './components/FeedbackModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { GuideModal } from './components/GuideModal';
import { DeepAnalysisView } from './components/DeepAnalysisView'; // Import
import { analyzeVideoContent, analyzeDeepContent } from './services/geminiService'; // Import deep service
import { AnalysisResult, DeepAnalysisResult, AppState, Theme, VideoWallpaper, BackgroundMode } from './types';
import { Wand2, RefreshCw, PenTool, Sparkles, Palette, Globe, Volume2, VolumeX, Volume1, Play, ArrowRight, MessageSquare, Eraser, Key, HelpCircle } from 'lucide-react';
import { DEFAULT_THEME } from './utils/themeGenerator';
import { TRANSLATIONS } from './utils/translations';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  
  // Results
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [deepResult, setDeepResult] = useState<DeepAnalysisResult | null>(null);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isTrimming, setIsTrimming] = useState(false);
  
  // Theme & Background State
  const [currentTheme, setCurrentTheme] = useState<Theme>(DEFAULT_THEME);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('css');
  
  const [currentVideo, setCurrentVideo] = useState<VideoWallpaper>({
    id: 'placeholder',
    name: 'None',
    url: ''
  });
  
  // Audio State
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoVolume, setVideoVolume] = useState(0.5); 
  const [prevVolume, setPrevVolume] = useState(0.5); 
  
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  // API Key State
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // Language Toggle State
  const [uiLang, setUiLang] = useState<'cn' | 'en'>('cn');
  const [promptLang, setPromptLang] = useState<'cn' | 'en'>('cn');

  const resultRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[uiLang];

  // Load API Key on Mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      // If no key found in local storage, check env. If neither, prompt user.
      if (!process.env.API_KEY) {
        // Short delay to ensure UI renders first
        setTimeout(() => setIsKeyModalOpen(true), 1000);
      }
    }

    // Check Guide
    const hasSeenGuide = localStorage.getItem('has_seen_guide');
    if (!hasSeenGuide) {
       setTimeout(() => setIsGuideOpen(true), 2000);
    }
  }, []);

  // Apply Theme CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-bg', currentTheme.colors.bg);
    root.style.setProperty('--color-surface', currentTheme.colors.surface);
    root.style.setProperty('--color-primary', currentTheme.colors.primary);
    root.style.setProperty('--color-secondary', currentTheme.colors.secondary);
    root.style.setProperty('--color-text', currentTheme.colors.text);
    root.style.setProperty('--color-text-light', currentTheme.colors.textLight);
    root.style.setProperty('--color-border', currentTheme.colors.border);
    
    root.style.setProperty('--shadow-card', currentTheme.shadows.card);
    root.style.setProperty('--shadow-button', currentTheme.shadows.button);
    root.style.setProperty('--shadow-inset', currentTheme.shadows.inset);
    
    root.style.setProperty('--border-radius', currentTheme.borderRadius);
    root.style.setProperty('--border-width', currentTheme.borderWidth);
  }, [currentTheme]);

  const handleFileSelect = (file: File) => {
    setSourceFile(file);
    setIsTrimming(true);
    setAppState(AppState.IDLE); 
    setErrorMsg(null);
  };

  useEffect(() => {
    if (sourceFile) {
      const url = URL.createObjectURL(sourceFile);
      setVideoUrl(url);
      return () => { URL.revokeObjectURL(url); };
    } else {
      setVideoUrl('');
    }
  }, [sourceFile]);

  // Unified Handler for Analysis
  const handleTrimConfirm = async (startTime: number, endTime: number, resolution: string, mode: 'viral' | 'deep') => {
    if (!sourceFile) return;

    // Check for API Key before starting
    const activeKey = apiKey || process.env.API_KEY;
    if (!activeKey) {
      setIsKeyModalOpen(true);
      return;
    }

    setIsTrimming(false);
    setAppState(AppState.ANALYZING);
    setProgressPercent(0);
    setResult(null); // Clear previous results
    setDeepResult(null);

    try {
      if (mode === 'viral') {
          const analysisData = await analyzeVideoContent(
            sourceFile, 
            { start: startTime, end: endTime },
            resolution,
            (msg, percent) => {
              setProgressMsg(msg);
              setProgressPercent(percent);
            },
            activeKey 
          );
          setResult(analysisData);
      } else {
          // DEEP ANALYSIS MODE
          const analysisData = await analyzeDeepContent(
            sourceFile, 
            { start: startTime, end: endTime },
            (msg, percent) => {
              setProgressMsg(msg);
              setProgressPercent(percent);
            },
            activeKey 
          );
          setDeepResult(analysisData);
      }

      setAppState(AppState.COMPLETED);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (error: any) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMsg(error.message || "视频解析失败，请检查网络或 Key。");
      // If error suggests auth failure, re-open modal
      if (error.message && (error.message.includes('Key') || error.message.includes('403') || error.message.includes('400'))) {
         setIsKeyModalOpen(true);
      }
    }
  };

  const handleTrimCancel = () => {
    setSourceFile(null);
    setIsTrimming(false);
  };

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    alert(msg);
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setDeepResult(null);
    setErrorMsg(null);
    setSourceFile(null);
    setIsTrimming(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Audio Control Logic
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVideoVolume(newVol);
    if (newVol > 0) {
      setIsVideoMuted(false);
    } else {
      setIsVideoMuted(true);
    }
  };

  const toggleMute = () => {
    if (isVideoMuted) {
      setIsVideoMuted(false);
      setVideoVolume(prevVolume === 0 ? 0.5 : prevVolume);
    } else {
      setPrevVolume(videoVolume);
      setVideoVolume(0);
      setIsVideoMuted(true);
    }
  };

  return (
    <div className={`relative min-h-screen font-sans selection:bg-theme-primary selection:text-white ${currentTheme.font}`}>
      
      {/* BACKGROUNDS */}
      {backgroundMode === 'css' && (
        <DynamicBackground themeStyle={currentTheme.style} primaryColor={currentTheme.colors.primary} />
      )}
      {backgroundMode === 'video' && (
        <VideoBackground videoUrl={currentVideo.url} isMuted={isVideoMuted} volume={videoVolume} />
      )}
      
      {/* INFO WIDGETS (Desktop Only) */}
      <FlipClock />
      <InfoDisplay />
      
      {/* MODALS */}
      <ThemeSelector 
        isOpen={isThemeSelectorOpen} 
        onClose={() => setIsThemeSelectorOpen(false)} 
        currentThemeId={currentTheme.id}
        backgroundMode={backgroundMode}
        currentVideoId={currentVideo.id}
        onSelectTheme={(theme) => {
          setCurrentTheme(theme);
          setBackgroundMode('css');
          setIsThemeSelectorOpen(false); // Auto close
        }}
        onSelectVideo={(video) => {
          setCurrentVideo(video);
          setBackgroundMode('video');
          setIsVideoMuted(false); 
          setVideoVolume(0.5);
          setIsThemeSelectorOpen(false); // Auto close
        }}
        uiLang={uiLang}
      />

      <FeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        uiLang={uiLang}
      />

      <ApiKeyModal 
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSave={(key) => setApiKey(key)}
        uiLang={uiLang}
      />

      <GuideModal 
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        uiLang={uiLang}
      />
      
      {/* Floating Audio Control */}
      {backgroundMode === 'video' && currentVideo.url && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-lg group hover:bg-black/60 transition-all">
          <button 
            onClick={toggleMute}
            className="text-white hover:text-theme-primary transition-colors"
          >
            {isVideoMuted || videoVolume === 0 ? <VolumeX className="w-6 h-6" /> : 
             videoVolume < 0.5 ? <Volume1 className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
          
          <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-300 flex items-center">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={isVideoMuted ? 0 : videoVolume}
              onChange={handleVolumeChange}
              className="w-24 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white hover:accent-theme-primary"
            />
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12 flex flex-col items-center min-h-screen">
        
        {/* Header Branding */}
        <header className="text-center mb-12 animate-fade-in-down w-full flex flex-col items-center relative">
          
          <div className="inline-flex items-center justify-center p-6 bg-theme-surface rounded-theme shadow-theme-card mb-6 border-theme border-theme-border backdrop-blur-sm bg-opacity-90 relative z-20">
             <span className="text-4xl mr-3 animate-bounce">🎬</span>
             <h1 className="text-4xl md:text-5xl font-cute tracking-wide text-theme-primary drop-shadow-sm">
               {t.appTitle}<span className="text-theme-secondary">{t.appSubtitle}</span>
             </h1>
          </div>
          
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => setIsThemeSelectorOpen(true)}
              className="group flex items-center gap-2 px-6 py-2 bg-theme-surface rounded-full shadow-theme-btn border-theme border-theme-border hover:scale-105 transition-all cursor-pointer backdrop-blur-sm bg-opacity-90"
            >
              <Palette className="w-4 h-4 text-theme-primary group-hover:rotate-12 transition-transform" />
              <span className="text-theme-text-light font-bold text-sm">{t.themeBtn}</span>
              <div className="w-2 h-2 rounded-full bg-theme-primary animate-pulse"></div>
            </button>
            
            {/* API Key Button */}
            <button 
              onClick={() => setIsKeyModalOpen(true)}
              className="group flex items-center gap-2 px-6 py-2 bg-theme-surface rounded-full shadow-theme-btn border-theme border-theme-border hover:scale-105 transition-all cursor-pointer backdrop-blur-sm bg-opacity-90"
            >
              <Key className="w-4 h-4 text-theme-text group-hover:text-yellow-500 transition-colors" />
              <span className="text-theme-text-light font-bold text-sm">{t.keyBtn}</span>
              {apiKey && <div className="w-2 h-2 rounded-full bg-green-400"></div>}
            </button>

            {/* Guide Button (RENAMED TO REPLICATION TOOL) */}
            <button 
              onClick={() => setIsGuideOpen(true)}
              className="group flex items-center gap-2 px-6 py-2 bg-theme-surface rounded-full shadow-theme-btn border-theme border-theme-border hover:scale-105 transition-all cursor-pointer backdrop-blur-sm bg-opacity-90"
            >
              <HelpCircle className="w-4 h-4 text-theme-text group-hover:text-blue-400 transition-colors" />
              <span className="text-theme-text-light font-bold text-sm">复刻工具</span>
            </button>

            {/* Feedback Button */}
            <button 
              onClick={() => setIsFeedbackOpen(true)}
              className="group flex items-center gap-2 px-6 py-2 bg-theme-surface rounded-full shadow-theme-btn border-theme border-theme-border hover:scale-105 transition-all cursor-pointer backdrop-blur-sm bg-opacity-90"
            >
              <MessageSquare className="w-4 h-4 text-theme-text group-hover:text-theme-primary transition-colors" />
              <span className="text-theme-text-light font-bold text-sm">{t.feedbackBtn}</span>
            </button>
          </div>
        </header>

        <div className="w-full transition-all duration-500">
          
          {/* State 1: Upload (Idle) */}
          {appState === AppState.IDLE && !isTrimming && (
            <VideoUploader onFileSelect={handleFileSelect} isAnalyzing={false} uiLang={uiLang} />
          )}

          {/* State 2: Trimming */}
          {isTrimming && sourceFile && (
            <VideoTrimmer 
              file={sourceFile} 
              onConfirm={handleTrimConfirm} 
              onCancel={handleTrimCancel} 
              uiLang={uiLang}
            />
          )}

          {/* State 3: Analyzing */}
          {appState === AppState.ANALYZING && (
            <DragonLoader message={progressMsg} progress={progressPercent} uiLang={uiLang} />
          )}

          {/* State 4: Error */}
          {appState === AppState.ERROR && (
             <div className="w-full max-w-2xl mx-auto bg-theme-surface rounded-theme p-10 text-center shadow-theme-card border-theme border-red-200 backdrop-blur-sm bg-opacity-95">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
                 <Sparkles className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-cute text-red-400 mb-2">拆解中断</h3>
               <p className="text-theme-text-light mb-8">{errorMsg}</p>
               <button 
                 onClick={resetApp}
                 className="px-8 py-3 bg-theme-primary text-theme-surface hover:brightness-110 rounded-theme font-bold shadow-theme-btn active:scale-95 transition-all"
               >
                 再试一次
               </button>
             </div>
          )}

          {/* State 5: Results */}
          {appState === AppState.COMPLETED && (
             <div ref={resultRef}>
                {/* 5A. Deep Analysis Result */}
                {deepResult && (
                  <DeepAnalysisView result={deepResult} onReset={resetApp} />
                )}

                {/* 5B. Viral Analysis Result */}
                {result && (
                  <div className="space-y-8 animate-fade-in-up pb-20">
                    
                    {/* Action Bar */}
                    <div className="bg-theme-surface/90 p-4 rounded-theme shadow-theme-card backdrop-blur-md sticky top-6 z-40 flex flex-wrap items-center justify-between gap-4 border-theme border-theme-border">
                      <div className="flex items-center gap-3 px-2">
                        <div className="bg-theme-primary p-2 rounded-lg text-theme-surface">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-cute text-theme-text truncate max-w-xs">{result.title}</h2>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={resetApp}
                          className="p-2.5 bg-theme-bg hover:brightness-95 text-theme-text-light rounded-theme transition-colors"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Mood Card */}
                    <div className="bg-theme-surface/95 backdrop-blur-sm rounded-theme p-8 shadow-theme-card border-l-8 border-theme-primary border-theme border-theme-border">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-cute text-theme-primary">🎨 {uiLang === 'cn' ? "风格与氛围分析" : "Mood Analysis"}</h3>
                        <div className="flex bg-theme-bg p-1 rounded-lg">
                            <button 
                              onClick={() => setUiLang('cn')}
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${uiLang === 'cn' ? 'bg-theme-secondary text-theme-surface shadow-sm' : 'text-theme-text-light'}`}
                            >
                              CN
                            </button>
                            <button 
                              onClick={() => setUiLang('en')}
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${uiLang === 'en' ? 'bg-theme-secondary text-theme-surface shadow-sm' : 'text-theme-text-light'}`}
                            >
                              EN
                            </button>
                        </div>
                      </div>
                      <p className="text-theme-text leading-relaxed font-medium">{result.overallMood}</p>
                    </div>

                    {/* Platform Viral Matrix */}
                    <div className="backdrop-blur-sm bg-opacity-90 rounded-theme">
                      <h3 className="text-xl font-cute text-white drop-shadow-md mb-4 flex items-center gap-2 pl-2">
                        <span className="text-2xl">🔥</span> {uiLang === 'cn' ? "全平台爆款文案矩阵" : "Viral Copy Matrix"}
                      </h3>
                      <PlatformMatrix data={result.platformMatrix} uiLang={uiLang} />
                    </div>

                    {/* Scene List */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-cute text-white drop-shadow-md mb-2 flex items-center gap-2 pl-2 mt-8">
                        <span className="text-2xl">📸</span> {t.scene}
                      </h3>
                      {result.scenes.map((scene, idx) => (
                        <ResultCard 
                          key={idx} 
                          scene={scene} 
                          index={idx} 
                          videoSource={videoUrl} 
                          uiLang={uiLang}
                        />
                      ))}
                    </div>

                    {/* Footer Summary Blocks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                      <div className="bg-theme-surface/95 backdrop-blur-sm rounded-theme p-8 shadow-theme-card border-theme border-theme-border">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-cute text-theme-text flex items-center gap-2">
                            <Wand2 className="w-5 h-5 text-theme-secondary" /> {t.fullPromptTitle}
                          </h3>
                          <div className="flex bg-theme-bg p-1 rounded-lg">
                            <button 
                              onClick={() => setPromptLang('cn')}
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${promptLang === 'cn' ? 'bg-theme-primary text-theme-surface shadow-sm' : 'text-theme-text-light'}`}
                            >
                              中文
                            </button>
                            <button 
                              onClick={() => setPromptLang('en')}
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${promptLang === 'en' ? 'bg-theme-primary text-theme-surface shadow-sm' : 'text-theme-text-light'}`}
                            >
                              EN
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-theme-bg p-4 rounded-lg text-theme-text text-sm leading-loose shadow-inner h-64 overflow-y-auto custom-scrollbar mb-4 font-mono">
                          {result.recreationPrompt[promptLang]}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(result.recreationPrompt[promptLang], "提示词已复制！")}
                          className="w-full py-3 bg-theme-secondary text-theme-surface font-bold rounded-theme shadow-theme-btn hover:brightness-110 transition-colors"
                        >
                          <Globe className="w-4 h-4 inline mr-2" />
                          {t.fullPromptBtn} ({promptLang === 'cn' ? 'CN' : 'EN'})
                        </button>
                      </div>

                      <div className="bg-theme-surface/95 backdrop-blur-sm rounded-theme p-8 shadow-theme-card border-theme border-theme-border">
                        <h3 className="text-xl font-cute text-theme-text mb-4 flex items-center gap-2">
                          <PenTool className="w-5 h-5 text-theme-primary" /> {t.fullScriptTitle}
                        </h3>
                        <div className="bg-theme-bg p-4 rounded-lg text-theme-text text-sm leading-loose whitespace-pre-wrap shadow-inner h-64 overflow-y-auto custom-scrollbar mb-4">
                          {result.fullCreativeScript}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(result.fullCreativeScript, "已复制！")}
                          className="w-full py-3 bg-theme-primary text-theme-surface font-bold rounded-theme shadow-theme-btn hover:brightness-110 transition-colors"
                        >
                          {t.fullScriptBtn}
                        </button>
                      </div>
                    </div>

                    {/* NEW ANALYSIS GUIDE */}
                    <div className="mt-20 py-12 px-6 relative overflow-hidden rounded-theme bg-gradient-to-r from-theme-primary to-theme-secondary shadow-theme-card text-center group cursor-pointer" onClick={resetApp}>
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 animate-spin-slow pointer-events-none"></div>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                        
                        <div className="absolute top-10 left-10 text-4xl animate-bounce delay-100">🚀</div>
                        <div className="absolute bottom-10 right-10 text-4xl animate-bounce delay-700">💎</div>

                        <div className="relative z-10">
                          <h2 className="text-4xl md:text-5xl font-cute text-white mb-4 drop-shadow-lg animate-pulse">
                            {t.nextAnalysisTitle}
                          </h2>
                          <p className="text-white/90 text-lg md:text-xl font-bold mb-8 max-w-2xl mx-auto">
                            {t.nextAnalysisDesc}
                          </p>
                          
                          <button className="inline-flex items-center gap-3 px-10 py-5 bg-white text-theme-primary rounded-full font-black text-xl shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all group-hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]">
                            <Play className="w-6 h-6 fill-current" />
                            {t.btnRestart}
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                          </button>
                        </div>
                    </div>

                  </div>
                )}
             </div>
          )}

        </div>
      </main>
    </div>
  );
};
export default App;
