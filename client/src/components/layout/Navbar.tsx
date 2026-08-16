import { useNavigate, Link } from 'react-router-dom';
import { Globe, ChevronDown, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-[#000000] border-b border-white/[0.06] sticky top-0 z-50 transition-colors backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo from public/logo */}
          <Logo to={isAuthenticated ? "/home" : "/"} size="md" />

          {/* Links */}
          <div className="hidden md:flex items-center space-x-9">
            {isAuthenticated ? (
              <>
                <Link to="/home" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#ffffff] hover:text-[#004fdc] transition-colors">
                  Workspace
                </Link>
                <a href="#timeline" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Timeline
                </a>
                <a href="#interactions" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Interactions
                </a>
                <a href="#labs" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Lab Diagnostics
                </a>
                <a href="#chat" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  AI Neural Chat
                </a>
              </>
            ) : (
              <>
                <a href="#intelligence" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Intelligence
                </a>
                <a href="#features" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Capabilities
                </a>
                <a href="#lab-decoder" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Lab Decoding
                </a>
                <a href="#pipeline" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Pipeline
                </a>
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-5">
            {isAuthenticated ? (
              <div className="flex items-center space-x-5">
                <button className="hidden sm:flex items-center space-x-2 text-[#9a9a9a] hover:text-[#ffffff] px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.05em] transition-colors border border-white/10">
                  <Globe className="w-3.5 h-3.5 text-[#004fdc]" />
                  <span>ENG / हिन्दी</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center space-x-3 cursor-pointer group" onClick={logout}>
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-[10px] font-semibold text-[#9a9a9a] uppercase tracking-[0.08em] leading-none mb-1">Authenticated</span>
                    <span className="font-normal text-[#ffffff] text-xs leading-none group-hover:text-[#004fdc] transition-colors">Member</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#004fdc]/20 border border-[#004fdc]/40 flex items-center justify-center text-[#ffffff]">
                    <User className="w-4 h-4 text-[#004fdc]" />
                  </div>
                </div>
                <button className="text-[#9a9a9a] hover:text-[#ffffff] relative transition-colors">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#004fdc] rounded-full"></span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button className="hidden sm:flex items-center space-x-2 text-[#9a9a9a] hover:text-[#ffffff] px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.05em] transition-colors border border-white/10 mr-1">
                  <Globe className="w-3.5 h-3.5 text-[#004fdc]" />
                  <span>ENG / हिन्दी</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-[#004fdc] hover:bg-[#003eb0] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.025em] transition-all duration-200 active:scale-[0.98] shadow-[0_0_20px_rgba(0,79,220,0.35)]"
                >
                  Request Access
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
