
import React, { useState, useEffect } from 'react';
import { Key, Check, AlertCircle, Loader2, Lock, X } from 'lucide-react';
import { validateApiKey } from '../services/geminiService';
import { TRANSLATIONS } from '../utils/translations';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  uiLang: 'cn' | 'en';
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, uiLang }) => {
  const [inputKey, setInputKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const t = TRANSLATIONS[uiLang];

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('gemini_api_key');
      if (stored) setInputKey(stored);
      setStatus('idle');
      setErrorMsg('');
    }
  }, [isOpen]);

  const handleVerify = async () => {
    if (!inputKey.trim()) {
      setErrorMsg(uiLang === 'cn' ? '请输入密钥' : 'Please enter a key');
      return;
    }

    setStatus('verifying');
    setErrorMsg('');

    const isValid = await validateApiKey(inputKey.trim());

    if (isValid) {
      setStatus('valid');
      localStorage.setItem('gemini_api_key', inputKey.trim());
      setTimeout(() => {
        onSave(inputKey.trim());
        onClose();
      }, 1000); // Show success for a second
    } else {
      setStatus('invalid');
      setErrorMsg(uiLang === 'cn' ? '密钥无效或网络错误，请检查。' : 'Invalid Key or Network Error.');
    }
  };

  const handleClear = () => {
    setInputKey('');
    localStorage.removeItem('gemini_api_key');
    setStatus('idle');
    onSave(''); // Propagate clear
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-theme-surface rounded-3xl shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out] border-4 border-theme-border">
        
        {/* Header */}
        <div className="bg-theme-bg p-6 border-b border-theme-border flex justify-between items-center">
           <div>
             <h2 className="text-xl font-cute text-theme-text flex items-center gap-2">
               <Key className="w-5 h-5 text-theme-primary" />
               {t.keyTitle}
             </h2>
             <p className="text-xs text-theme-text-light font-bold mt-1">{t.keyDesc}</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-theme-surface rounded-full transition-colors text-theme-text-light">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="p-8 space-y-6">
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-theme-text-light" />
             </div>
             <input
               type="password"
               value={inputKey}
               onChange={(e) => {
                 setInputKey(e.target.value);
                 setStatus('idle');
               }}
               placeholder="AI Studio API Key (Starts with AIza...)"
               className={`w-full pl-10 pr-4 py-4 rounded-xl bg-theme-bg text-theme-text placeholder-theme-text-light/50 focus:outline-none focus:ring-2 transition-all shadow-theme-inset border-2
                 ${status === 'invalid' ? 'border-red-400 focus:ring-red-400' : 'border-transparent focus:ring-theme-primary'}
                 ${status === 'valid' ? 'border-green-400 focus:ring-green-400' : ''}
               `}
             />
           </div>

           {errorMsg && (
             <div className="text-red-500 text-xs font-bold flex items-center gap-1 animate-pulse">
               <AlertCircle className="w-3 h-3" /> {errorMsg}
             </div>
           )}

           <div className="flex gap-3">
             {/* Clear Button */}
             {inputKey && (
                <button
                onClick={handleClear}
                className="px-4 py-3 bg-theme-bg text-theme-text-light font-bold rounded-xl border border-theme-border hover:bg-red-50 hover:text-red-400 transition-colors"
                title={uiLang === 'cn' ? "清除密钥" : "Clear Key"}
              >
                <X className="w-5 h-5" />
              </button>
             )}

             {/* Submit Button */}
             <button
                onClick={handleVerify}
                disabled={status === 'verifying' || status === 'valid'}
                className={`flex-1 py-3 rounded-xl font-black text-lg shadow-theme-btn transition-all flex items-center justify-center gap-2
                  ${status === 'valid' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-theme-primary text-theme-surface hover:brightness-110 active:scale-95'}
                  ${status === 'verifying' ? 'opacity-80 cursor-wait' : ''}
                `}
              >
                {status === 'verifying' && <Loader2 className="w-5 h-5 animate-spin" />}
                {status === 'valid' && <Check className="w-5 h-5 animate-bounce" />}
                
                {status === 'idle' && (uiLang === 'cn' ? '验证并保存' : 'Verify & Save')}
                {status === 'verifying' && (uiLang === 'cn' ? '验证中...' : 'Verifying...')}
                {status === 'valid' && (uiLang === 'cn' ? '验证成功' : 'Success')}
                {status === 'invalid' && (uiLang === 'cn' ? '重试' : 'Retry')}
              </button>
           </div>
           
           <p className="text-center text-xs text-theme-text-light font-bold opacity-70 leading-relaxed">
             {uiLang === 'cn' ? (
               <>
                 密钥仅存储在您的本地浏览器中。<br/>
                 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-theme-secondary hover:underline">点击这里获取免费的 Gemini API Key</a>
               </>
             ) : (
               <>
                 Key is stored locally in your browser.<br/>
                 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-theme-secondary hover:underline">Get free Gemini API Key here</a>
               </>
             )}
           </p>
        </div>

      </div>
    </div>
  );
};
