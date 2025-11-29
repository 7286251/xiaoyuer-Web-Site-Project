
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

// Rich Neo-Brutalism Palettes (Vibrant, High Contrast, Beautiful)
const NEO_BRUTALISM_PALETTES = [
  { name: 'Cyber Lemon', bg: '#FEF08A', surface: '#FFFFFF', p: '#F59E0B', s: '#3B82F6', text: '#000000' },
  { name: 'Hot Pink', bg: '#FBCFE8', surface: '#FFFFFF', p: '#EC4899', s: '#10B981', text: '#000000' },
  { name: 'Electric Blue', bg: '#BFDBFE', surface: '#FFFFFF', p: '#2563EB', s: '#F59E0B', text: '#000000' },
  { name: 'Toxic Green', bg: '#BBF7D0', surface: '#FFFFFF', p: '#16A34A', s: '#9333EA', text: '#000000' },
  { name: 'Ultra Violet', bg: '#E9D5FF', surface: '#FFFFFF', p: '#9333EA', s: '#F472B6', text: '#000000' },
  { name: 'Sunset Blvd', bg: '#FED7AA', surface: '#FFFFFF', p: '#EA580C', s: '#06B6D4', text: '#000000' },
  { name: 'Monochrome', bg: '#F3F4F6', surface: '#FFFFFF', p: '#000000', s: '#EF4444', text: '#000000' },
  { name: 'Mint Fresh', bg: '#99F6E4', surface: '#FFFFFF', p: '#0D9488', s: '#F43F5E', text: '#000000' },
  { name: 'Neo Rose', bg: '#FECDD3', surface: '#FFFFFF', p: '#E11D48', s: '#4F46E5', text: '#000000' },
  { name: 'Glitch Pop', bg: '#E0E7FF', surface: '#FFFFFF', p: '#4F46E5', s: '#FACC15', text: '#000000' },
  { name: 'Acid Lime', bg: '#D9F99D', surface: '#FFFFFF', p: '#65A30D', s: '#DB2777', text: '#000000' },
  { name: 'Aqua Marine', bg: '#A5F3FC', surface: '#FFFFFF', p: '#0891B2', s: '#F97316', text: '#000000' },
];

const STYLES: ThemeStyle[] = ['clay', 'brutalism', 'neumorphism', 'sticker', 'flat'];

const generateThemes = (): Theme[] => {
  const themes: Theme[] = [];
  
  for (let i = 0; i < 200; i++) {
    const style = STYLES[i % STYLES.length];
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
    } else if (style === 'brutalism') {
      // NEO-BRUTALISM DESIGN STYLE (Based on reference images)
      const palette = NEO_BRUTALISM_PALETTES[i % NEO_BRUTALISM_PALETTES.length];
      
      theme.name = palette.name + ' ' + (Math.floor(i / NEO_BRUTALISM_PALETTES.length) + 1);
      
      theme.borderRadius = '1rem'; // Distinct rounded corners (not 0, but not full pill for cards)
      theme.borderWidth = '3px'; // Bold borders
      
      theme.colors.bg = palette.bg;
      theme.colors.surface = palette.surface;
      theme.colors.primary = palette.p;
      theme.colors.secondary = palette.s;
      theme.colors.border = '#000000'; // Always black border
      theme.colors.text = '#000000';   // Always black text
      theme.colors.textLight = '#4B5563';
      
      // Hard, solid black shadows, offset to bottom-right
      theme.shadows.card = '6px 6px 0px #000000';
      theme.shadows.button = '4px 4px 0px #000000';
      theme.shadows.inset = 'inset 4px 4px 0px rgba(0,0,0,0.1)';
      theme.font = 'font-sans'; // Clean sans-serif
      
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
      theme.borderWidth = '3px';
      theme.shadows.card = '0 4px 6px -1px rgba(0,0,0,0.1)';
      theme.shadows.button = '0 8px 0px #1f2937';
      theme.font = 'font-cute';
    }

    themes.push(theme);
  }

  return themes;
};

export const ALL_THEMES = generateThemes();
export const DEFAULT_THEME = ALL_THEMES.find(t => t.style === 'brutalism') || ALL_THEMES[0];
