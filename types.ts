
export interface PlatformContent {
  title: string;
  content: string;
  hashtags: string[];
}

export interface PlatformMatrix {
  douyin: PlatformContent;
  kuaishou: PlatformContent;
  shipinhao: PlatformContent;
  bilibili: PlatformContent;
  youtube: PlatformContent;
  tiktok: PlatformContent;
  xigua: PlatformContent;      // New
  baijiahao: PlatformContent;  // New
  weibo: PlatformContent;      // New
  toutiao: PlatformContent;    // New
  xiaohongshu: PlatformContent;// New
}

export interface SceneAnalysis {
  timestamp: string;
  description: string;
  goldenHook?: string; 
  characters: string;
  audio: string;
  visualPrompt: {
    cn: string;
    en: string;
  }; 
  originalScript: string;
  rewrittenScript: string;
}

export interface AnalysisResult {
  title: string; // Internal title
  overallMood: string;
  scenes: SceneAnalysis[];
  recreationPrompt: {
    cn: string;
    en: string;
  };
  platformMatrix: PlatformMatrix;
  fullCreativeScript: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

// --- New Deep Analysis Types ---

export interface DeepShot {
  timestamp: string;
  visual_atmosphere: string; // Points 3, 5
  character_performance: string; // Points 8, 6
  story_plot: string; // Points 4, 6
  camera_language: string; // Point 9
  audio_design: string; // Point 7
}

export interface DeepAnalysisResult {
  title: string;
  theme: string; // Point 2
  consistency: string; // Point 1
  bgm: string; // Point 10
  shots: DeepShot[];
}

// --- Theme System Types ---

export type ThemeStyle = 'clay' | 'brutalism' | 'neumorphism' | 'sticker' | 'minimal' | 'flat';

export interface Theme {
  id: string;
  name: string;
  style: ThemeStyle;
  colors: {
    bg: string;       
    surface: string;  
    primary: string;  
    secondary: string;
    text: string;     
    textLight: string;
    border: string;   
  };
  borderRadius: string; 
  borderWidth: string;  
  shadows: {
    card: string;
    button: string;
    inset: string;
  };
  font: string; 
}

// --- Video Background Types ---

export type BackgroundMode = 'css' | 'video';

export interface VideoWallpaper {
  id: string;
  name: string;
  url: string; // URL or blob URL
  thumbnail?: string;
  isLocal?: boolean;
}
