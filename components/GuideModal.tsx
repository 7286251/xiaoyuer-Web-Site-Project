import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Mic, Film, Scissors, Palette, Music, Video, ArrowRight } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  uiLang: 'cn' | 'en';
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, uiLang }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      localStorage.setItem('has_seen_guide', 'true');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      title: "第一步：音色克隆",
      desc: "利用 Fish Audio 或 GPT-SoVITS 等 AI 语音工具，上传目标音频进行训练，生成高还原度的专属语音包。",
      icon: <Mic className="w-10 h-10 text-theme-surface" />,
      color: "bg-pink-500"
    },
    {
      title: "第二步：素材搜集",
      desc: "在网络上寻找画质清晰、表情生动的影视角色片段或经典名场面，作为二创的原始素材。",
      icon: <Film className="w-10 h-10 text-theme-surface" />,
      color: "bg-purple-500"
    },
    {
      title: "第三步：精准切片",
      desc: "使用剪辑软件（如剪映、PR）将下载的素材进行裁剪，剔除无效镜头，只保留最精彩的关键画面帧。",
      icon: <Scissors className="w-10 h-10 text-theme-surface" />,
      color: "bg-blue-500"
    },
    {
      title: "第四步：画面重绘",
      desc: "将截取的画面导入即梦 (Jimeng)、豆包或 Midjourney，配合本工具生成的「画面反推提示词」，进行风格化二创重绘。",
      icon: <Palette className="w-10 h-10 text-theme-surface" />,
      color: "bg-orange-500"
    },
    {
      title: "第五步：唇形同步",
      desc: "使用对口型工具（如即梦对口型、HeyGen），将克隆好的音色与二创画面合成，实现角色开口说话，口型完美匹配。",
      icon: <Music className="w-10 h-10 text-theme-surface" />,
      color: "bg-green-500"
    },
    {
      title: "第六步：合成成片",
      desc: "将所有生成的对口型片段导入剪辑软件，添加背景音乐、字幕和特效，输出最终的爆款二创视频。",
      icon: <Video className="w-10 h-10 text-theme-surface" />,
      color: "bg-indigo-500"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onClose();
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Dynamic backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-theme-surface rounded-3xl shadow-2xl overflow-hidden animate-[scale-in_0.3s_ease-out] border-4 border-theme-border flex flex-col min-h-[550px]">
        
        {/* Header */}
        <div className="p-6 border-b border-theme-border/50 flex justify-between items-center bg-theme-bg/50">
           <div className="flex items-center gap-3">
             <span className="bg-theme-secondary text-theme-surface px-3 py-1 rounded-lg text-xs font-black tracking-widest shadow-sm uppercase">
               复刻工具箱
             </span>
             <span className="text-theme-text-light text-xs font-bold font-mono">
               Step {step + 1} / {steps.length}
             </span>
           </div>
           <button 
            onClick={onClose}
            className="p-2 hover:bg-theme-bg rounded-full transition-colors"
           >
            <X className="w-5 h-5 text-theme-text-light" />
           </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row">
           
           {/* Visual Side (Left) */}
           <div className={`w-full md:w-5/12 ${steps[step].color} transition-colors duration-500 flex items-center justify-center p-8 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="relative z-10 p-6 bg-white/20 backdrop-blur-sm rounded-3xl shadow-lg border border-white/30 transform transition-transform duration-500 scale-110">
                 {steps[step].icon}
              </div>
           </div>

           {/* Text Side (Right) */}
           <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-center bg-theme-surface relative">
              <h2 className="text-3xl font-cute text-theme-text mb-6 leading-tight">
                {steps[step].title}
              </h2>
              <p className="text-theme-text font-medium leading-loose text-base opacity-90">
                {steps[step].desc}
              </p>
              
              {/* Desktop Navigation Arrows (Visual only) */}
              <div className="hidden md:flex gap-2 mt-8 opacity-20">
                 {[...Array(3)].map((_,i) => <ArrowRight key={i} className="w-6 h-6 text-theme-primary" />)}
              </div>
           </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-theme-bg border-t border-theme-border flex items-center justify-between">
           {/* Progress Bar */}
           <div className="flex gap-1.5 flex-1 mr-8">
             {steps.map((_, i) => (
               <div 
                 key={i} 
                 className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-theme-primary flex-1' : 'bg-theme-border w-4'}`}
               />
             ))}
           </div>

           <div className="flex gap-3 shrink-0">
             <button 
               onClick={handlePrev}
               disabled={step === 0}
               className={`px-5 py-2.5 rounded-xl font-bold transition-all border-2 border-transparent
                 ${step === 0 
                   ? 'text-theme-text-light opacity-50 cursor-not-allowed' 
                   : 'text-theme-text hover:bg-theme-bg hover:border-theme-border'}
               `}
             >
               上一步
             </button>
             <button 
               onClick={handleNext}
               className="px-8 py-2.5 bg-theme-primary text-theme-surface rounded-xl font-bold shadow-theme-btn border-2 border-theme-border hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
             >
               {step === steps.length - 1 ? "完成教程" : "下一步"}
               <ChevronRight className="w-4 h-4" />
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};