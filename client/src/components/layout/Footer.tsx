import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Play, Lock, X, QrCode, Smartphone } from 'lucide-react';
import Logo from '../Logo';

const Footer = () => {
  const [appModalPlatform, setAppModalPlatform] = useState<'ios' | 'android' | null>(null);

  return (
    <footer className="bg-[#000000] border-t border-white/[0.06] text-[#ffffff] pt-16 pb-12">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & Manifesto */}
          <div className="flex flex-col space-y-4">
            <Logo size="md" />
            
            <p className="text-xs font-light text-[#9a9a9a] leading-relaxed max-w-xs">
              Distributed medical intelligence. Built to translate clinical complexity into weightless personal agency.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[#15846e]">
              <Lock className="w-3.5 h-3.5" />
              <span>HIPAA / Zero-Knowledge Protocol</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="flex flex-col space-y-3">
            <div className="text-[11px] font-semibold text-[#ffffff] uppercase tracking-[0.1em] mb-1">
              Platform
            </div>
            <a href="#features" className="text-xs text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
              Safety Matrix
            </a>
            <a href="#lab-decoder" className="text-xs text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
              Lab Biomarkers
            </a>
            <a href="#intelligence" className="text-xs text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
              Neural Dialects
            </a>
            <Link to="/login" className="text-xs text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
              Vault Access
            </Link>
          </div>

          {/* Column 2: Architecture */}
          <div className="flex flex-col space-y-3">
            <div className="text-[11px] font-semibold text-[#ffffff] uppercase tracking-[0.1em] mb-1">
              Intelligence
            </div>
            <a href="#features" className="text-xs text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
              Pharmacopeia Database
            </a>
            <a href="#pipeline" className="text-xs text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
              Zero Knowledge Proofs
            </a>
            <a href="#intelligence" className="text-xs text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
              Regional Audio Synthesis
            </a>
            <a href="#pipeline" className="text-xs text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
              Clinical Security Whitepaper
            </a>
          </div>

          {/* Column 3: App Downloads */}
          <div className="flex flex-col space-y-4">
            <div className="text-[11px] font-semibold text-[#ffffff] uppercase tracking-[0.1em]">
              Mobile Experience
            </div>
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => setAppModalPlatform('ios')}
                className="bg-white/5 border border-white/10 hover:border-[#004fdc]/50 text-white rounded-full px-4 py-2 flex items-center space-x-3 transition-colors active:scale-95 text-left"
              >
                <Apple className="w-4 h-4 text-white" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-[#9a9a9a] uppercase tracking-wider">Download on</span>
                  <span className="text-xs font-medium text-white tracking-tight">Apple iOS</span>
                </div>
              </button>

              <button 
                onClick={() => setAppModalPlatform('android')}
                className="bg-white/5 border border-white/10 hover:border-[#15846e]/50 text-white rounded-full px-4 py-2 flex items-center space-x-3 transition-colors active:scale-95 text-left"
              >
                <Play className="w-4 h-4 text-[#15846e]" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-[#9a9a9a] uppercase tracking-wider">Get it on</span>
                  <span className="text-xs font-medium text-white tracking-tight">Google Android</span>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-[#9a9a9a]">
          <p>© {new Date().getFullYear()} VaidyaVaani Systems. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px] font-mono">
            <span className="text-[#004fdc]">NEURAL COGNITION</span>
            <span>•</span>
            <span className="text-[#15846e]">ZERO-KNOWLEDGE MEDICINE</span>
          </div>
        </div>

      </div>

      {/* App Download Modal */}
      <AnimatePresence>
        {appModalPlatform && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setAppModalPlatform(null)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0c0c0c] rounded-[32px] w-full max-w-sm overflow-hidden shadow-[0_0_80px_rgba(0,79,220,0.3)] relative z-10 border border-white/10 p-8 text-center"
            >
              <div className="flex justify-between items-center pb-3 mb-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-[#004fdc]">Mobile App Preview</div>
                <button 
                  onClick={() => setAppModalPlatform(null)}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-[#004fdc]/15 border border-[#004fdc]/30 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-[#004fdc]" />
              </div>

              <h3 className="text-lg font-normal text-white mb-1">
                {appModalPlatform === 'ios' ? 'VaidyaVaani for iOS' : 'VaidyaVaani for Android'}
              </h3>
              <p className="text-xs text-[#9a9a9a] mb-6">
                Scan the secure QR key with your camera or launch the web app directly.
              </p>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center mb-6">
                <QrCode className="w-24 h-24 text-white" />
                <span className="text-[10px] font-mono text-[#9a9a9a] mt-2">SECURE APP CLOUD PAIRING</span>
              </div>

              <button 
                onClick={() => setAppModalPlatform(null)}
                className="w-full py-3 bg-[#004fdc] hover:bg-[#003eb0] text-white rounded-full font-semibold text-xs uppercase tracking-wider"
              >
                Close Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
