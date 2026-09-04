import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LANGUAGES, type LanguageCode } from '../context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'pill' | 'header' | 'compact';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'pill',
  className = ''
}) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 transition-all select-none cursor-pointer ${
          variant === 'compact'
            ? 'px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200'
            : variant === 'header'
            ? 'px-3 py-1.5 rounded-full text-xs font-bold text-[#00221b] bg-[#eef7f3] hover:bg-[#d8efe5] border border-[#a2dac7] shadow-2xs'
            : 'px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs'
        }`}
        title="Change Language / भाषा बदलें"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#2e7d32] shrink-0" />
        <span className="font-bold tracking-tight">{currentLanguage.native}</span>
        <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">({currentLanguage.label})</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-slate-800 text-left"
          >
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
              <span>Select Language</span>
              <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                {LANGUAGES.length} Languages
              </span>
            </div>
            <div className="py-1 max-h-72 overflow-y-auto space-y-0.5">
              {LANGUAGES.map((lang) => {
                const isActive = currentLanguage.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as LanguageCode);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#e8f5e9] text-[#1b5e20] font-bold shadow-2xs'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold block leading-tight">{lang.native}</span>
                      <span className="text-[10px] text-slate-400 block">{lang.label}</span>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-[#2e7d32] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
