
import React, { useState } from 'react';
import { X, Send, MessageSquare, AlertCircle, Smile, HelpCircle, Mail } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  uiLang: 'cn' | 'en';
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, uiLang }) => {
  const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'other'>('bug');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Construct mailto link
    const subjectPrefix = uiLang === 'cn' ? '[小渝兒反馈]' : '[Xiao Yu Er Feedback]';
    const typeLabel = uiLang === 'cn' 
      ? (feedbackType === 'bug' ? '功能异常' : feedbackType === 'suggestion' ? '产品建议' : '其他问题')
      : (feedbackType === 'bug' ? 'Bug Report' : feedbackType === 'suggestion' ? 'Suggestion' : 'Other');
    
    const subject = encodeURIComponent(`${subjectPrefix} - ${typeLabel}`);
    const body = encodeURIComponent(`Type: ${typeLabel}\n\nMessage:\n${content}`);
    
    const mailtoUrl = `mailto:307779523@qq.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
    
    onClose();
  };

  const t = {
    cn: {
      title: "问题反馈",
      desc: "您的建议是我们进步的动力",
      type: "反馈类型",
      types: { bug: "功能异常", suggestion: "产品建议", other: "其他问题" },
      content: "详细描述",
      placeholder: "请详细描述您遇到的问题或建议，方便我们快速定位...",
      submit: "提交并发送邮件",
      tip: "提交后将自动唤起默认邮件客户端发送至 307779523@qq.com"
    },
    en: {
      title: "Feedback",
      desc: "Help us improve Xiao Yu Er",
      type: "Feedback Type",
      types: { bug: "Bug Report", suggestion: "Suggestion", other: "Other" },
      content: "Details",
      placeholder: "Please describe the issue or suggestion in detail...",
      submit: "Submit via Email",
      tip: "Will open your default email client addressed to 307779523@qq.com"
    }
  }[uiLang];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-theme-surface rounded-3xl shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out] border-4 border-theme-border">
        
        {/* Header */}
        <div className="bg-theme-bg p-6 border-b border-theme-border flex justify-between items-center">
           <div>
             <h2 className="text-2xl font-cute text-theme-text flex items-center gap-2">
               <MessageSquare className="w-6 h-6 text-theme-primary" />
               {t.title}
             </h2>
             <p className="text-sm text-theme-text-light font-bold mt-1">{t.desc}</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-theme-surface rounded-full transition-colors text-theme-text-light">
             <X className="w-6 h-6" />
           </button>
        </div>

        <div className="p-8 space-y-6">
           {/* Type Selector */}
           <div>
             <label className="block text-sm font-black text-theme-text-light mb-3 uppercase tracking-wider">{t.type}</label>
             <div className="flex gap-4">
                {[
                  { id: 'bug', icon: <AlertCircle className="w-4 h-4" />, label: t.types.bug },
                  { id: 'suggestion', icon: <Smile className="w-4 h-4" />, label: t.types.suggestion },
                  { id: 'other', icon: <HelpCircle className="w-4 h-4" />, label: t.types.other },
                ].map((type) => (
                  <button
                    key={type.id}
                    // @ts-ignore
                    onClick={() => setFeedbackType(type.id)}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border-2
                      ${feedbackType === type.id 
                        ? 'bg-theme-primary text-theme-surface border-theme-primary shadow-theme-btn' 
                        : 'bg-theme-bg text-theme-text-light border-transparent hover:bg-theme-surface hover:border-theme-border'}
                    `}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
             </div>
           </div>

           {/* Textarea */}
           <div>
              <label className="block text-sm font-black text-theme-text-light mb-3 uppercase tracking-wider">{t.content}</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t.placeholder}
                className="w-full h-32 bg-theme-bg rounded-xl p-4 text-theme-text placeholder-theme-text-light/50 focus:outline-none focus:ring-2 focus:ring-theme-primary/50 resize-none font-medium shadow-theme-inset"
              />
           </div>

           {/* Submit */}
           <button
             onClick={handleSubmit}
             className="w-full py-4 bg-theme-secondary text-theme-surface rounded-xl font-black text-lg shadow-theme-btn hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 group"
           >
             <Mail className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
             {t.submit}
           </button>
           
           <p className="text-center text-xs text-theme-text-light font-bold opacity-70">
             {t.tip}
           </p>
        </div>

      </div>
    </div>
  );
};
