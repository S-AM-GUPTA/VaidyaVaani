import { Link } from 'react-router-dom';
import { ShieldCheck, Heart } from 'lucide-react';
import Logo from '../Logo';

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12 mb-14">
          
          {/* Column 1: Brand & Positioning (Spans 2 cols on md) */}
          <div className="md:col-span-2 space-y-4">
            <Logo theme="dark" size="md" to="/" />
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An AI-assisted health record companion that helps people understand prescriptions, lab reports, and medication safety.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>User-controlled records • Privacy-first design</span>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Product
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#prescription-ai" className="hover:text-white transition-colors">
                  Prescription Reader
                </a>
              </li>
              <li>
                <Link to="/lab-decoder" className="hover:text-white transition-colors">
                  Lab Reports Decoder
                </Link>
              </li>
              <li>
                <Link to="/safety-matrix" className="hover:text-white transition-colors">
                  Medication Safety
                </Link>
              </li>
              <li>
                <Link to="/annotation" className="hover:text-white transition-colors text-slate-500 hover:text-slate-300">
                  Research Ground Truth
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Resources
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy & Security
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-white transition-colors">
                  Technology Overview
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Core Capabilities
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Account */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Account
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                  Get Started →
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Health Profile
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} VaidyaVaani. An AI-assisted health record companion.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Built for healthcare clarity</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> for patient empowerment
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
