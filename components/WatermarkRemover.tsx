
import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Eraser, Download, RotateCcw, Image as ImageIcon, Sparkles, ScanLine, MousePointer2 } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

interface WatermarkRemoverProps {
  lang: 'cn' | 'en';
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const WatermarkRemover: React.FC<WatermarkRemoverProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [displayImage, setDisplayImage] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Selection State
  const [selection, setSelection] = useState<Rect | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file input click
  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          setDisplayImage(img);
          setSelection(null);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Main Draw Loop
  const draw = () => {
    if (!canvasRef.current || !displayImage) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Clear & Draw Image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(displayImage, 0, 0, canvas.width, canvas.height);

    // 2. Draw Selection Overlay
    if (selection && selection.w !== 0 && selection.h !== 0) {
      // Semi-transparent fill
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)'; 
      ctx.fillRect(selection.x, selection.y, selection.w, selection.h);
      
      // Solid Border
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
      
      // Dashed White Border for visibility on dark backgrounds
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
      ctx.restore();

      // Corner handles
      const handleSize = 6;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(selection.x - handleSize/2, selection.y - handleSize/2, handleSize, handleSize);
      ctx.fillRect(selection.x + selection.w - handleSize/2, selection.y + selection.h - handleSize/2, handleSize, handleSize);
    }
  };

  // Adjust canvas size to fit container while maintaining aspect ratio
  useEffect(() => {
    if (displayImage && containerRef.current && canvasRef.current) {
      const containerW = containerRef.current.clientWidth;
      // Max height constraint
      const maxHeight = 600; 
      
      const imgRatio = displayImage.width / displayImage.height;
      
      let renderWidth = containerW;
      let renderHeight = containerW / imgRatio;

      if (renderHeight > maxHeight) {
        renderHeight = maxHeight;
        renderWidth = maxHeight * imgRatio;
      }

      canvasRef.current.width = renderWidth;
      canvasRef.current.height = renderHeight;

      // Initial draw
      draw();
    }
  }, [displayImage, containerRef.current?.clientWidth]);

  // Redraw on selection change
  useEffect(() => {
    draw();
  }, [selection, displayImage]);


  // --- Input Handling (Mouse & Touch) ---

  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!displayImage) return;
    // Prevent scrolling on touch devices while drawing
    if ('touches' in e && e.cancelable) {
       // e.preventDefault(); // Optional: might block page scroll entirely
    }
    
    setIsDragging(true);
    const coords = getCoords(e);
    setStartPos(coords);
    setSelection({ x: coords.x, y: coords.y, w: 0, h: 0 });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !startPos) return;
    if ('touches' in e && e.cancelable) {
       e.preventDefault(); 
    }

    const coords = getCoords(e);
    const width = coords.x - startPos.x;
    const height = coords.y - startPos.y;

    setSelection({
      x: width > 0 ? startPos.x : coords.x,
      y: height > 0 ? startPos.y : coords.y,
      w: Math.abs(width),
      h: Math.abs(height)
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // --- Advanced Inpainting Algorithm ---
  const processRemoval = () => {
    if (!displayImage || !selection || !canvasRef.current) return;
    if (selection.w < 5 || selection.h < 5) return; 

    setIsProcessing(true);

    // Use setTimeout to allow UI render update before heavy calculation
    setTimeout(() => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      
      const { x, y, w, h } = selection;

      try {
        // 1. Get the Image Data for the whole canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        
        // Define region boundaries (clamped)
        const startX = Math.max(0, Math.floor(x));
        const startY = Math.max(0, Math.floor(y));
        const endX = Math.min(canvas.width, Math.ceil(x + w));
        const endY = Math.min(canvas.height, Math.ceil(y + h));
        
        // "Patch-Based" Inpainting Approximation
        // For each pixel in the selection, find a "source" pixel from the immediate outside border
        // This is a simplified "Texture Synthesis" / "Nearest Neighbor" approach
        
        // Strategy: 
        // Iterate inward from the borders of the selection.
        // Fill each pixel with a weighted average of its already-known neighbors.
        // Repeat multiple passes to diffuse the texture into the center.
        
        // Safety check
        if (endX <= startX || endY <= startY) {
            setIsProcessing(false);
            return;
        }

        // We will do a multi-pass diffusion
        // Pass 1: Horizontal Fill
        // Pass 2: Vertical Fill
        // Pass 3: Blur/Blend
        
        // Helper to get pixel index
        const idx = (x: number, y: number) => (y * width + x) * 4;

        // Create a temporary buffer for the selection area
        const patchW = endX - startX;
        const patchH = endY - startY;
        
        // --- Smart Content Aware Fill (Simplified) ---
        // We scan lines and fill holes with neighboring valid pixels
        
        for (let py = startY; py < endY; py++) {
            for (let px = startX; px < endX; px++) {
                const i = idx(px, py);
                
                // Find nearest valid pixels (Left, Right, Top, Bottom) outside the box
                // For a true "content aware", we'd search distinct patches, but for speed in JS:
                // We pick a source point relative to the border.
                
                // Distance to each border
                const distL = px - startX;
                const distR = endX - px;
                const distT = py - startY;
                const distB = endY - py;
                
                // Find closest border
                const min = Math.min(distL, distR, distT, distB);
                
                let sourceX = px;
                let sourceY = py;
                
                // Mirror logic: Pick a pixel from the "reflection" outside the box
                if (min === distL) sourceX = Math.max(0, startX - distL - 1);
                else if (min === distR) sourceX = Math.min(width - 1, endX + distR + 1);
                else if (min === distT) sourceY = Math.max(0, startY - distT - 1);
                else if (min === distB) sourceY = Math.min(canvas.height - 1, endY + distB + 1);
                
                // Add some noise/randomness to prevent tiling artifacts
                const noise = Math.floor(Math.random() * 5) - 2;
                sourceX = Math.max(0, Math.min(width - 1, sourceX + noise));
                sourceY = Math.max(0, Math.min(canvas.height - 1, sourceY + noise));

                const sourceIdx = idx(sourceX, sourceY);
                
                // Copy pixel
                data[i] = data[sourceIdx];     // R
                data[i + 1] = data[sourceIdx + 1]; // G
                data[i + 2] = data[sourceIdx + 2]; // B
                data[i + 3] = 255;             // Alpha
            }
        }

        // Put basic fill back
        ctx.putImageData(imageData, 0, 0);
        
        // --- Blending Pass ---
        // Apply a localized blur to smooth the seams and the internal texture
        ctx.save();
        ctx.beginPath();
        ctx.rect(x - 2, y - 2, w + 4, h + 4); // Slightly larger area
        ctx.clip();
        ctx.filter = 'blur(4px)'; // Adjust blur amount based on size?
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
        
        // Add noise back to simulate texture
        // (Optional advanced step, skipped for performance)
        
        ctx.restore();

        // Update state
        const newImg = new Image();
        newImg.src = canvas.toDataURL();
        newImg.onload = () => {
           setDisplayImage(newImg);
           setSelection(null);
           setIsProcessing(false);
        };
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
      }
    }, 100);
  };

  const handleDownload = () => {
    if (!displayImage) return;
    const link = document.createElement('a');
    link.download = 'watermark-removed.png';
    link.href = displayImage.src;
    link.click();
  };

  const handleReset = () => {
      setDisplayImage(originalImage);
      setSelection(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 animate-fade-in-up">
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*" 
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Inline Header */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="bg-theme-secondary p-2 rounded-lg text-theme-surface shadow-theme-btn border-2 border-theme-border">
          <ScanLine className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-cute text-theme-text">{t.wmTitle}</h2>
          <p className="text-theme-text-light text-sm font-bold flex items-center gap-1">
            <MousePointer2 className="w-3 h-3" /> {t.wmDrag}
          </p>
        </div>
      </div>

      <div className="bg-theme-surface rounded-theme shadow-theme-card border-theme border-theme-border overflow-hidden p-6 md:p-8">
        
        {/* Editor Area */}
        <div 
          className="w-full min-h-[400px] bg-theme-bg rounded-2xl border-2 border-theme-border shadow-theme-inset relative overflow-hidden flex flex-col items-center justify-center select-none" 
          ref={containerRef}
        >
            {!displayImage ? (
              <div 
                onClick={triggerUpload}
                className="flex flex-col items-center justify-center p-12 cursor-pointer group transition-all transform hover:scale-105"
              >
                 <div className="w-24 h-24 bg-theme-primary rounded-full flex items-center justify-center mb-6 shadow-theme-btn border-4 border-theme-surface group-hover:rotate-12 transition-transform">
                    <Upload className="w-10 h-10 text-theme-surface" />
                 </div>
                 <h3 className="text-xl font-bold text-theme-text mb-2">{t.wmUpload}</h3>
                 <p className="text-theme-text-light text-sm">支持 JPG, PNG, WebP</p>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]">
                 <canvas 
                   ref={canvasRef}
                   onMouseDown={handleStart}
                   onMouseMove={handleMove}
                   onMouseUp={handleEnd}
                   onMouseLeave={handleEnd}
                   onTouchStart={handleStart}
                   onTouchMove={handleMove}
                   onTouchEnd={handleEnd}
                   className={`max-w-full shadow-lg touch-none cursor-crosshair ${isProcessing ? 'opacity-80 blur-[1px]' : ''}`}
                 />
                 
                 {/* Processing Overlay */}
                 {isProcessing && (
                   <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                      <div className="absolute inset-0 bg-theme-surface/50 backdrop-blur-sm"></div>
                      <div className="relative bg-theme-surface p-4 rounded-xl shadow-theme-card border-2 border-theme-border flex flex-col items-center animate-bounce">
                         <Sparkles className="w-8 h-8 text-theme-primary mb-2 animate-spin" />
                         <span className="font-bold text-theme-text">{t.wmProcessing}</span>
                      </div>
                   </div>
                 )}
              </div>
            )}
        </div>

        {/* Toolbar */}
        {displayImage && (
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
             <div className="flex gap-2">
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 bg-theme-bg text-theme-text-light font-bold rounded-xl border-2 border-theme-border hover:bg-red-50 hover:text-red-400 hover:border-red-200 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> <span className="hidden sm:inline">{t.wmReset}</span>
                </button>
                <button 
                  onClick={triggerUpload}
                  className="px-4 py-2 bg-theme-bg text-theme-text font-bold rounded-xl border-2 border-theme-border hover:bg-theme-surface transition-colors flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" /> <span className="hidden sm:inline">换图</span>
                </button>
             </div>

             <div className="flex gap-2 flex-1 justify-end">
                <button 
                  onClick={processRemoval}
                  disabled={!selection || isProcessing}
                  className={`px-6 py-3 bg-theme-primary text-theme-surface font-black rounded-xl border-2 border-theme-border shadow-theme-btn flex items-center gap-2 transition-all
                    ${!selection || isProcessing ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:-translate-y-1 active:translate-y-0'}
                  `}
                >
                  <Eraser className="w-5 h-5" />
                  {t.wmProcess}
                </button>

                <button 
                  onClick={handleDownload}
                  className="px-6 py-3 bg-theme-secondary text-theme-surface font-black rounded-xl border-2 border-theme-border shadow-theme-btn flex items-center gap-2 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  <Download className="w-5 h-5" />
                  {t.wmSave}
                </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
