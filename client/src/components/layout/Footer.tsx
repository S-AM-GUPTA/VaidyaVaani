import { Link } from 'react-router-dom';
import { Shield, Apple, Play } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-[#1C2A24]/5">
      {/* Dark Green Trust Banner */}
      <div className="bg-[#133E2B] text-[#F8F7F4] py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Your Health Records are Secure.</h2>
            <p className="text-[#F8F7F4]/70 font-medium">End-to-end Encrypted Medical Vault.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-emerald-400/30 mb-3 relative backdrop-blur-sm">
               <Shield className="w-8 h-8 text-emerald-400" />
               <div className="absolute -bottom-2 bg-emerald-400 text-[#133E2B] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">TRUSTED</div>
            </div>
          </div>
        </div>
      </div>

      {/* White Links Section */}
      <div className="bg-[#F8F7F4] pt-16 pb-8 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo & Socials */}
          <div className="flex flex-col">
            <Link to="/" className="mb-8">
              <img src="/logo/complete logo.png" alt="VaidyaVaani Logo" className="h-8 w-auto opacity-90" />
            </Link>
            <div className="flex items-center space-x-4 text-[#1C2A24]/50">
              {/* Social icons placeholder */}
            </div>
          </div>

          {/* Column 1 */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-sm text-[#1C2A24]/70 hover:text-[#133E2B] font-medium transition-colors">Home</Link>
            <Link to="/about" className="text-sm text-[#1C2A24]/70 hover:text-[#133E2B] font-medium transition-colors">About</Link>
            <Link to="/press" className="text-sm text-[#1C2A24]/70 hover:text-[#133E2B] font-medium transition-colors">Press</Link>
            <Link to="/contact" className="text-sm text-[#1C2A24]/70 hover:text-[#133E2B] font-medium transition-colors">Contact</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-4">
            <Link to="/about-us" className="text-sm text-[#1C2A24]/70 hover:text-[#133E2B] font-medium transition-colors">About Us</Link>
            <Link to="/vaidyavaani" className="text-sm text-[#1C2A24]/70 hover:text-[#133E2B] font-medium transition-colors">VaidyaVaani</Link>
            <Link to="/language" className="text-sm text-[#1C2A24]/70 hover:text-[#133E2B] font-medium transition-colors">Regional Language</Link>
            <Link to="/timeline" className="text-sm text-[#1C2A24]/70 hover:text-[#133E2B] font-medium transition-colors">App Store Timeline</Link>
          </div>

          {/* Column 3 - App Store */}
          <div className="flex flex-col">
            <h4 className="text-[11px] font-bold text-[#1C2A24]/50 uppercase tracking-widest mb-4">Future App Store</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-[#1C2A24] text-white rounded-xl px-4 py-2.5 flex items-center justify-center space-x-2 hover:bg-black transition-colors shadow-sm">
                <Apple className="w-5 h-5" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] leading-none text-white/70 uppercase tracking-wider mb-0.5">Download on the</span>
                  <span className="text-sm font-bold leading-none tracking-tight">App Store</span>
                </div>
              </button>
              <button className="bg-[#1C2A24] text-white rounded-xl px-4 py-2.5 flex items-center justify-center space-x-2 hover:bg-black transition-colors shadow-sm">
                <Play className="w-5 h-5" />
                <div className="flex flex-col items-start">
                  <span className="text-[9px] leading-none text-white/70 uppercase tracking-wider mb-0.5">GET IT ON</span>
                  <span className="text-sm font-bold leading-none tracking-tight">Google Play</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto border-t border-[#1C2A24]/10 pt-8 text-xs text-[#1C2A24]/40 font-medium flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} VaidyaVaani. All rights reserved.</p>
          <p className="mt-2 md:mt-0 uppercase tracking-widest text-[10px]">Medical Intelligence</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
