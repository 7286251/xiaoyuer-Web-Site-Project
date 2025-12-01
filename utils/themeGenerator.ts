
import { Theme, ThemeStyle } from '../types';

const ADJECTIVES = [
  'Neon', 'Soft', 'Dark', 'Hyper', 'Retro', 'Silent', 'Electric', 'Quantum', 'Mist', 'Solar',
  'Lunar', 'Acid', 'Sweet', 'Deep', 'Hollow', 'Glass', 'Iron', 'Velvet', 'Cyber', 'Pixel',
  'Mystic', 'Raw', 'Pure', 'Wild', 'Cool', 'Hot', 'Frost', 'Bubble', 'Heavy', 'Light'
];

const NOUNS = [
  'Dream', 'Wave', 'Glitch', 'Protocol', 'Mode', 'Vibe', 'Flux', 'Dust', 'Echo', 'Spark',
  'Bloom', 'Pulse', 'Core', 'Shell', 'Grid', 'Loop', 'Drift', 'Shift', 'Zone', 'Byte',
  'Realm', 'Vision', 'Sky', 'Ocean', 'City', 'Night', 'Star', 'Cloud', 'Mint', 'Candy'
];

const BASE_COLORS = [
  { p: '#ffb7c5', s: '#a2d2ff', bg: '#f0f4f8' }, 
  { p: '#845ec2', s: '#d65db1', bg: '#fdfd96' }, 
  { p: '#ff6f91', s: '#ff9671', bg: '#f9f871' }, 
  { p: '#00c9a7', s: '#4d8076', bg: '#c4fcef' }, 
  { p: '#ff005c', s: '#7e2ea0', bg: '#f3f4f6' }, 
  { p: '#000000', s: '#fbbf24', bg: '#ffffff' }, 
  { p: '#4338ca', s: '#6366f1', bg: '#e0e7ff' }, 
  { p: '#059669', s: '#34d399', bg: '#ecfdf5' }, 
  { p: '#db2777', s: '#f472b6', bg: '#fce7f3' }, 
  { p: '#ea580c', s: '#fb923c', bg: '#fff7ed' }, 
  { p: '#0891b2', s: '#22d3ee', bg: '#ecfeff' }, 
  { p: '#7c3aed', s: '#a78bfa', bg: '#f5f3ff' }, 
  { p: '#be123c', s: '#fb7185', bg: '#fff1f2' }, 
  { p: '#15803d', s: '#86efac', bg: '#f0fdf4' }, 
  { p: '#a16207', s: '#facc15', bg: '#fefce8' }, 
  { p: '#4b5563', s: '#9ca3af', bg: '#f3f4f6' }, 
  { p: '#7f1d1d', s: '#f87171', bg: '#fef2f2' }, 
  { p: '#1e3a8a', s: '#60a5fa', bg: '#eff6ff' }, 
  { p: '#14532d', s: '#4ade80', bg: '#f0fdf4' }, 
  { p: '#fbbf24', s: '#ef4444', bg: '#fffbeb' }, 
];

const STYLES: ThemeStyle[] = ['clay', 'brutalism', 'neumorphism', 'sticker', 'flat'];

// --- Advanced Brutalism Helpers ---

const BRUTAL_BG_COLORS = ['#FFFFFF', '#F0F0F0', '#EAEAEA', '#FFF8E1', '#E0F7FA', '#F3E5F5', '#FFF3E0', '#E8F5E9'];
const BRUTAL_ACCENT_COLORS = [
  '#FF00D6', '#00E0FF', '#FFC900', '#7000FF', '#FF005C', 
  '#00FF94', '#FF4D00', '#FAFF00', '#0047FF', '#FF0055', 
  '#6D00FF', '#00FF7F', '#FF2A6D', '#05D9E8', '#D1F7FF'
];

// Helper to pick random item
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate a unique Neo-Brutalism theme
const generateBrutalTheme = (index: number): Theme => {
  // 1. Determine Sub-Style DNA
  const subStyles = ['glitch', 'swiss', 'pop', 'retro'];
  const dna = pick(subStyles);

  let bg = pick(BRUTAL_BG_COLORS);
  let primary = pick(BRUTAL_ACCENT_COLORS);
  let secondary = pick(BRUTAL_ACCENT_COLORS);
  
  // Ensure contrast
  while (primary === secondary) secondary = pick(BRUTAL_ACCENT_COLORS);

  let borderRadius = '0px';
  let borderWidth = '3px';
  let shadowDistance = 4;
  let shadowColor = '#000000';
  let font = 'font-sans';
  let borderStyle = 'solid';

  switch (dna) {
    case 'glitch':
      bg = '#F0F0F0'; // Light grey base
      primary = '#FF00FF'; // Magenta
      secondary = '#00FF00'; // Lime
      borderRadius = '0px';
      borderWidth = '4px';
      shadowDistance = 6;
      font = 'font-mono';
      break;
    case 'swiss':
      bg = '#FFFFFF';
      primary = '#FF3B30'; // Swiss Red
      secondary = '#007AFF'; // Swiss Blue
      borderRadius = '0px';
      borderWidth = '2px';
      shadowDistance = 0; // Flat, rely on grid lines (simulated by border)
      font = 'font-sans';
      break;
    case 'pop':
      bg = '#FFFBEB'; // Warm paper
      primary = '#FF6B6B'; // Pastel Red
      secondary = '#4ECDC4'; // Teal
      borderRadius = '1rem';
      borderWidth = '3px';
      shadowDistance = 5;
      font = 'font-cute';
      break;
    case 'retro':
      bg = '#FFFAF0'; // Floral White
      primary = '#FF9F1C'; // Orange
      secondary = '#2EC4B6'; // Cyan
      borderRadius = '0.5rem';
      borderWidth = '3px';
      shadowDistance = 4;
      font = 'font-mono';
      break;
  }

  // Randomize slightly within DNA to ensure uniqueness
  const shadowOffsetX = (Math.random() > 0.5 ? 1 : -1) * shadowDistance;
  const shadowOffsetY = shadowDistance;
  
  const cardShadow = `${shadowOffsetX}px ${shadowOffsetY}px 0px ${shadowColor}`;
  const btnShadow = `${shadowOffsetX/1.5}px ${shadowOffsetY/1.5}px 0px ${shadowColor}`;
  
  const adj = ADJECTIVES[index % ADJECTIVES.length];
  const noun = NOUNS[(index * 7) % NOUNS.length];

  return {
    id: `brutal-${index}-${dna}`,
    name: `${dna.toUpperCase()} ${adj} ${noun}`,
    style: 'brutalism',
    colors: {
      bg,
      surface: '#FFFFFF',
      primary,
      secondary,
      text: '#000000',
      textLight: '#333333',
      border: '#000000',
    },
    borderRadius,
    borderWidth,
    shadows: {
      card: cardShadow,
      button: btnShadow,
      inset: `inset ${shadowDistance/2}px ${shadowDistance/2}px 0px rgba(0,0,0,0.1)`
    },
    font
  };
};

const generateThemes = (): Theme[] => {
  const themes: Theme[] = [];
  
  for (let i = 0; i < 200; i++) {
    const style = STYLES[i % STYLES.length];
    
    // Special handling for Brutalism to ensure diversity
    if (style === 'brutalism') {
      themes.push(generateBrutalTheme(i));
      continue;
    }

    const colorIndex = (i + Math.floor(i / STYLES.length)) % BASE_COLORS.length;
    const colorBase = BASE_COLORS[colorIndex];
    
    const adj = ADJECTIVES[(i * 3) % ADJECTIVES.length];
    const noun = NOUNS[(i * 7) % NOUNS.length];
    
    let themeName = `${adj} ${noun}`;
    
    let theme: Theme = {
      id: `theme-${i}`,
      name: `${themeName} ${i + 1}`,
      style: style,
      colors: { 
        bg: colorBase.bg,
        primary: colorBase.p,
        secondary: colorBase.s,
        surface: '#ffffff', 
        text: '#334155', 
        textLight: '#94a3b8', 
        border: 'rgba(0,0,0,0.1)' 
      },
      borderRadius: '1rem',
      borderWidth: '2px',
      shadows: { card: '', button: '', inset: '' },
      font: 'font-sans'
    };

    if (style === 'clay') {
      theme.borderRadius = '2rem';
      theme.colors.bg = colorBase.bg;
      theme.shadows.card = '8px 8px 16px rgba(166,180,200,0.4), -8px -8px 16px #ffffff';
      theme.shadows.button = '6px 6px 12px rgba(166,180,200,0.4), -6px -6px 12px #ffffff';
      theme.shadows.inset = 'inset 5px 5px 10px rgba(166,180,200,0.4), inset -5px -5px 10px #ffffff';
      theme.font = 'font-cute';
    } else if (style === 'neumorphism') {
      theme.colors.bg = '#e0e5ec';
      theme.colors.surface = '#e0e5ec';
      theme.borderWidth = '0px';
      theme.shadows.card = '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)';
      theme.shadows.button = '6px 6px 10px rgb(163,177,198,0.6), -6px -6px 10px rgba(255,255,255, 0.5)';
      theme.shadows.inset = 'inset 6px 6px 10px rgb(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255, 0.5)';
    } else if (style === 'sticker') {
      theme.colors.bg = '#ffffff';
      theme.colors.surface = '#ffffff';
      theme.colors.text = '#000000';
      theme.colors.border = '#000000';
      theme.borderWidth = '3px';
      theme.borderRadius = '1rem';
      theme.shadows.card = '5px 5px 0px rgba(0,0,0,1)';
      theme.shadows.button = '3px 3px 0px rgba(0,0,0,1)';
      theme.shadows.inset = 'inset 3px 3px 0px rgba(0,0,0,0.1)';
      theme.font = 'font-cute';
    } else if (style === 'flat') {
      theme.colors.bg = '#ffffff';
      theme.colors.surface = '#ffffff';
      theme.colors.border = '#1f2937';
      theme.borderWidth = '2px';
      theme.shadows.card = '0 4px 6px -1px rgba(0,0,0,0.1)';
      theme.shadows.button = '0 4px 0px #1f2937';
      theme.font = 'font-cute';
    }

    themes.push(theme);
  }

  return themes;
};

export const ALL_THEMES = generateThemes();
export const DEFAULT_THEME = ALL_THEMES.find(t => t.style === 'brutalism') || ALL_THEMES[0];
