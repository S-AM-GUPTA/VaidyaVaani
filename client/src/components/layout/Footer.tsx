import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Play, X, QrCode, Smartphone, ShieldCheck } from 'lucide-react';
import Logo from '../Logo';

const Footer = () => {
  const [appModalPlatform, setAppModalPlatform] = useState<'ios' | 'android' | null>(null);

  return (
    <footer className="bg-[#090d16] border-t border-[#1e293b] text-slate-300 pt-16 pb-12">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & Manifesto */}
          <div className="flex flex-col space-y-4">
            <Logo size="md" />
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Distributed healthcare safety infrastructure. Simplifying prescriptions, lab biomarkers, and medical records for families across India.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Knowledge Encrypted</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="flex flex-col space-y-2.5">
            <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono mb-1">
              Clinical Platform
            </div>
            <a href="#safety-matrix" className="text-xs text-slate-400 hover:text-white transition-colors">
              Drug Interaction Matrix
            </a>
            <a href="#lab-decoder" className="text-xs text-slate-400 hover:text-white transition-colors">
              Lab Biomarker Decoder
            </a>
            <a href="#multilingual-voice" className="text-xs text-slate-400 hover:text-white transition-colors">
              Regional Voice Guidance
            </a>
            <Link to="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
              Patient Portal Access
            </Link>
          </div>

          {/* Column 2: Safety & Architecture */}
          <div className="flex flex-col space-y-2.5">
            <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono mb-1">
              Security & Standards
            </div>
            <a href="#safety-matrix" className="text-xs text-slate-400 hover:text-white transition-colors">
              Pharmacopeia Database
            </a>
            <a href="#workflow" className="text-xs text-slate-400 hover:text-white transition-colors">
              HIPAA Compliant Ingestion
            </a>
            <a href="#multilingual-voice" className="text-xs text-slate-400 hover:text-white transition-colors">
              Multilingual Speech Models
            </a>
            <a href="#workflow" className="text-xs text-slate-400 hover:text-white transition-colors">
              Patient Emergency SOS Protocol
            </a>
          </div>

          {/* Column 3: Mobile Apps */}
          <div className="flex flex-col space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono mb-1">
              Patient Mobile App
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setAppModalPlatform('ios')}
                className="bg-[#0f1523] border border-[#1e293b] hover:border-slate-600 text-white rounded-lg px-3.5 py-2 flex items-center space-x-3 transition-colors text-left"
              >
                <Apple className="w-4 h-4 text-white" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Available on</span>
                  <span className="text-xs font-medium text-white">Apple iOS</span>
                </div>
              </button>

              <button 
                onClick={() => setAppModalPlatform('android')}
                className="bg-[#0f1523] border border-[#1e293b] hover:border-slate-600 text-white rounded-lg px-3.5 py-2 flex items-center space-x-3 transition-colors text-left"
              >
                <Play className="w-4 h-4 text-teal-400" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Get it on</span>
                  <span className="text-xs font-medium text-white">Google Play</span>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1e293b] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} VaidyaVaani Healthcare Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px] font-mono text-slate-400">
            <span className="text-teal-400">CLINICAL SAFETY</span>
            <span>•</span>
            <span className="text-blue-400">SECURE PATIENT PORTAL</span>
          </div>
        </div>

      </div>

      {/* App Download Modal */}
      <AnimatePresence>
        {appModalPlatform && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => setAppModalPlatform(null)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="bg-[#0f1523] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 border border-[#1e293b] p-6 text-center"
            >
              <div className="flex justify-between items-center pb-3 mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-teal-400 font-mono">Mobile App Link</div>
                <button 
                  onClick={() => setAppModalPlatform(null)}
                  className="w-7 h-7 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-white flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-12 h-12 rounded-xl bg-teal-950/60 border border-teal-500/30 flex items-center justify-center mx-auto mb-3 text-teal-400">
                <Smartphone className="w-6 h-6" />
              </div>

              <h3 className="text-base font-semibold text-white mb-1">
                {appModalPlatform === 'ios' ? 'VaidyaVaani for iOS' : 'VaidyaVaani for Android'}
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Scan the secure QR code with your camera or launch the web app directly.
              </p>

              <div className="p-5 rounded-xl bg-[#090d16] border border-[#1e293b] flex flex-col items-center justify-center mb-5">
                <QrCode className="w-20 h-20 text-white" />
                <span className="text-[10px] font-mono text-slate-400 mt-2">SECURE APP CLOUD PAIRING</span>
              </div>

              <button 
                onClick={() => setAppModalPlatform(null)}
                className="w-full btn-primary text-xs font-semibold"
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
