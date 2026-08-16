import { Link } from 'react-router-dom';
import { Apple, Play, Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#000000] border-t border-white/[0.06] text-[#ffffff] pt-16 pb-12">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Logo & Manifesto */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 28 28" fill="none" className="w-6 h-6">
                  <defs>
                    <linearGradient id="dalaFooterLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8052ff" />
                      <stop offset="100%" stopColor="#15846e" />
                    </linearGradient>
                  </defs>
                  <polygon points="14,2 26,24 2,24" fill="url(#dalaFooterLogoGrad)" stroke="#8052ff" strokeWidth="0.5" />
                  <polygon points="14,9 21,22 7,22" fill="#000000" />
                  <circle cx="14" cy="17" r="2.5" fill="#ffb829" />
                </svg>
              </div>
              <span className="text-lg font-normal tracking-tight text-[#ffffff]">
                Vaidya<span className="text-[#8052ff] font-medium">Vaani</span>
              </span>
            </Link>
            
            <p className="text-xs font-light text-[#9a9a9a] leading-relaxed max-w-xs">
              Distributed medical intelligence. Built to translate clinical complexity into weightless personal agency.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[#ffb829]">
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
            <a href="#" className="text-xs text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
              Pharmacopeia Database
            </a>
            <a href="#" className="text-xs text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
              Zero Knowledge Proofs
            </a>
            <a href="#" className="text-xs text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
              Regional Audio Synthesis
            </a>
            <a href="#" className="text-xs text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
              Clinical Security Whitepaper
            </a>
          </div>

          {/* Column 3: App Downloads */}
          <div className="flex flex-col space-y-4">
            <div className="text-[11px] font-semibold text-[#ffffff] uppercase tracking-[0.1em]">
              Mobile Experience
            </div>
            <div className="flex flex-col gap-2.5">
              <button className="bg-white/5 border border-white/10 hover:border-[#8052ff]/50 text-white rounded-full px-4 py-2 flex items-center space-x-3 transition-colors">
                <Apple className="w-4 h-4 text-white" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-[#9a9a9a] uppercase tracking-wider">Download on</span>
                  <span className="text-xs font-medium text-white tracking-tight">Apple iOS</span>
                </div>
              </button>

              <button className="bg-white/5 border border-white/10 hover:border-[#8052ff]/50 text-white rounded-full px-4 py-2 flex items-center space-x-3 transition-colors">
                <Play className="w-4 h-4 text-[#ffb829]" />
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
            <span className="text-[#8052ff]">STYLE REFERENCE: DALA</span>
            <span>•</span>
            <span className="text-[#ffb829]">DISTRIBUTED MEDICAL COGNITION</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
