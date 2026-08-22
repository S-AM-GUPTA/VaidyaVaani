import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Play, X, QrCode, Smartphone, Phone, ShieldCheck, Clock } from 'lucide-react';
import Logo from '../Logo';

const Footer = () => {
  const [appModalPlatform, setAppModalPlatform] = useState<'ios' | 'android' | null>(null);

  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 text-slate-300 pt-16 pb-12">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          
          {/* Column 1: Hospital Brand & Info */}
          <div className="space-y-4">
            <Logo size="md" />
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              VaidyaVaani is an encrypted healthcare platform dedicated to simplifying prescriptions, checking multi-doctor drug safety, and deciphering lab biomarkers in 7 Indian regional languages.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Knowledge Clinical Encryption</span>
            </div>
          </div>

          {/* Column 2: Clinical Services */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2">
              Clinical Specialities
            </div>
            <a href="#safety-matrix" className="block text-xs text-slate-400 hover:text-sky-400 transition-colors">
              Cardiology & Hypertension
            </a>
            <a href="#lab-decoder" className="block text-xs text-slate-400 hover:text-sky-400 transition-colors">
              Endocrinology & Diabetes
            </a>
            <a href="#services" className="block text-xs text-slate-400 hover:text-sky-400 transition-colors">
              Pathology & Metabolic Panels
            </a>
            <a href="#safety-matrix" className="block text-xs text-slate-400 hover:text-sky-400 transition-colors">
              Pharmacology Safety Screening
            </a>
            <a href="#multilingual-voice" className="block text-xs text-slate-400 hover:text-sky-400 transition-colors">
              Regional Voice Guidance
            </a>
          </div>

          {/* Column 3: Emergency & Hours */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2">
              Emergency & Hours
            </div>
            
            <div className="text-xs text-slate-300 flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">24/7 National Emergency:</div>
                <div className="font-mono text-rose-400 font-bold">108 / 102 (Toll Free)</div>
              </div>
            </div>

            <div className="text-xs text-slate-300 flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Clinical Vault Services:</div>
                <div className="text-slate-400">Available 24 Hours / 7 Days</div>
              </div>
            </div>

            <div className="pt-2">
              <Link 
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <span>Sign In / Vault Access</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Column 4: Mobile App */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2">
              VaidyaVaani Mobile App
            </div>
            
            <p className="text-xs text-slate-400">
              Access your medical ID, emergency SOS, and medications on the go.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <button 
                onClick={() => setAppModalPlatform('ios')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg px-3 py-2 flex items-center space-x-3 transition-colors text-left"
              >
                <Apple className="w-4 h-4 text-white" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Download on</span>
                  <span className="text-xs font-semibold text-white">Apple iOS</span>
                </div>
              </button>

              <button 
                onClick={() => setAppModalPlatform('android')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg px-3 py-2 flex items-center space-x-3 transition-colors text-left"
              >
                <Play className="w-4 h-4 text-teal-400" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Get it on</span>
                  <span className="text-xs font-semibold text-white">Google Play</span>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} VaidyaVaani Healthcare Technologies. All clinical protocols verified.</p>
          <div className="flex items-center space-x-6 text-[11px] font-mono text-slate-400">
            <span className="text-emerald-400 font-semibold">HEALTHCARE CLARITY</span>
            <span>•</span>
            <span className="text-teal-400 font-semibold">USER PRIVACY FIRST</span>
          </div>
        </div>

      </div>

      {/* App Download Modal */}
      <AnimatePresence>
        {appModalPlatform && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs" onClick={() => setAppModalPlatform(null)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 border border-slate-200 p-6 text-center text-slate-900"
            >
              <div className="flex justify-between items-center pb-3 mb-4">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-600 font-mono">Mobile App Download</div>
                <button 
                  onClick={() => setAppModalPlatform(null)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                {appModalPlatform === 'ios' ? 'VaidyaVaani for Apple iOS' : 'VaidyaVaani for Android'}
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Scan the QR code with your phone camera or launch the mobile portal.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center mb-5">
                <QrCode className="w-20 h-20 text-slate-800" />
                <span className="text-[10px] font-mono text-slate-500 mt-2 font-bold">SECURE MOBILE PAIRING</span>
              </div>

              <button 
                onClick={() => setAppModalPlatform(null)}
                className="w-full btn-med-primary text-xs font-semibold"
              >
                Close Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
