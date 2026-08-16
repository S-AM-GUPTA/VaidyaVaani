import { Link } from 'react-router-dom';
import { Apple, Play, Lock } from 'lucide-react';
import Logo from '../Logo';

const Footer = () => {
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

            <div className="flex items-center gap-2 text-[11px] font-mono text-[#00d2d3]">
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

              <button className="bg-white/5 border border-white/10 hover:border-[#00d2d3]/50 text-white rounded-full px-4 py-2 flex items-center space-x-3 transition-colors">
                <Play className="w-4 h-4 text-[#00d2d3]" />
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
            <span className="text-[#8052ff]">NEURAL COGNITION</span>
            <span>•</span>
            <span className="text-[#00d2d3]">ZERO-KNOWLEDGE MEDICINE</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
