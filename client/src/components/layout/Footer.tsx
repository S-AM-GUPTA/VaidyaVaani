import { Link } from 'react-router-dom';
import { Shield, Apple, Play } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto">
      {/* Dark Green Trust Banner */}
      <div className="bg-[#3b8a66] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Your Health Records are Secure.</h2>
            <p className="text-emerald-50 text-lg">End-to-end Encrypted Medical Vault.</p>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-[#f7e089] mb-2 relative">
               <Shield className="w-8 h-8 text-[#f7e089]" />
               <div className="absolute -bottom-2 bg-[#f7e089] text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">TRUSTED</div>
            </div>
          </div>
        </div>
      </div>

      {/* White Links Section */}
      <div className="bg-white pt-12 pb-6 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Logo & Socials */}
          <div className="flex flex-col">
            <Link to="/" className="mb-6">
              <img src="/logo/complete logo.png" alt="VaidyaVaani Logo" className="h-8 w-auto" />
            </Link>
            <div className="flex items-center space-x-4 text-slate-600">
              {/* Social icons placeholder */}
            </div>
          </div>

          {/* Column 1 */}
          <div className="flex flex-col space-y-3">
            <Link to="/" className="text-sm text-slate-600 hover:text-emerald-600 font-medium">Home</Link>
            <Link to="/about" className="text-sm text-slate-600 hover:text-emerald-600 font-medium">About</Link>
            <Link to="/press" className="text-sm text-slate-600 hover:text-emerald-600 font-medium">Press</Link>
            <Link to="/contact" className="text-sm text-slate-600 hover:text-emerald-600 font-medium">Contact</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-3">
            <Link to="/about-us" className="text-sm text-slate-600 hover:text-emerald-600 font-medium">About Us</Link>
            <Link to="/vaidyavaani" className="text-sm text-slate-600 hover:text-emerald-600 font-medium">VaidyaVaani</Link>
            <Link to="/language" className="text-sm text-slate-600 hover:text-emerald-600 font-medium">Regional Language</Link>
            <Link to="/timeline" className="text-sm text-slate-600 hover:text-emerald-600 font-medium">App Store Timeline</Link>
          </div>

          {/* Column 3 - App Store */}
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-slate-800 mb-4">Future App Store</h4>
            <div className="flex space-x-3">
              <button className="bg-black text-white rounded-lg px-3 py-2 flex items-center space-x-2 hover:bg-slate-800 transition-colors">
                <Apple className="w-5 h-5" />
                <div className="flex flex-col items-start">
                  <span className="text-[10px] leading-none text-slate-300">Download on the</span>
                  <span className="text-xs font-bold leading-none">App Store</span>
                </div>
              </button>
              <button className="bg-black text-white rounded-lg px-3 py-2 flex items-center space-x-2 hover:bg-slate-800 transition-colors">
                <Play className="w-5 h-5" />
                <div className="flex flex-col items-start">
                  <span className="text-[10px] leading-none text-slate-300">GET IT ON</span>
                  <span className="text-xs font-bold leading-none">Google Play</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-100 pt-6 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center">
          <p>© 2022 - 2024 INC. - VaidyaVaani</p>
          <p className="mt-2 md:mt-0">Poweredsite Design</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
