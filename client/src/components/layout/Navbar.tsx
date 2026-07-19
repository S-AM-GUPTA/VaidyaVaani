import { Link, useNavigate } from 'react-router-dom';
import { Globe, ChevronDown, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-[#F8F7F4] border-b border-[#1C2A24]/5 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center group">
            <img src="/logo/complete logo.png" alt="VaidyaVaani Logo" className="h-12 md:h-16 w-auto mix-blend-multiply group-hover:scale-105 transition-transform" />
          </Link>

          {/* Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/home" className="text-[#133E2B] font-extrabold border-b-[3px] border-[#133E2B] pb-1 text-sm uppercase tracking-wider">Home</Link>
                <a href="#timeline" className="text-[#1C2A24]/70 font-bold hover:text-[#133E2B] transition-colors text-sm uppercase tracking-wider">Medical Timeline</a>
                <a href="#interaction" className="text-[#1C2A24]/70 font-bold hover:text-[#133E2B] transition-colors text-sm uppercase tracking-wider">Interaction Checks</a>
                <a href="#chat" className="text-[#1C2A24]/70 font-bold hover:text-[#133E2B] transition-colors text-sm uppercase tracking-wider">AI Chat</a>
                <Link to="/dashboard" className="text-[#1C2A24]/70 font-bold hover:text-[#133E2B] transition-colors text-sm uppercase tracking-wider">My Reports</Link>
                <a href="#support" className="text-[#1C2A24]/70 font-bold hover:text-[#133E2B] transition-colors text-sm uppercase tracking-wider">Support</a>
              </>
            ) : (
              <>
                <Link to="/" className="text-[#133E2B] font-extrabold border-b-[3px] border-[#133E2B] pb-1 text-sm uppercase tracking-wider">Home</Link>
                <a href="#features" className="text-[#1C2A24]/70 font-bold hover:text-[#133E2B] transition-colors text-sm uppercase tracking-wider">Features</a>
                <a href="#about" className="text-[#1C2A24]/70 font-bold hover:text-[#133E2B] transition-colors text-sm uppercase tracking-wider">About Us</a>
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <button className="hidden sm:flex items-center space-x-2 text-[#1C2A24] bg-white border border-[#1C2A24]/10 hover:bg-[#F8F7F4] px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm">
                  <Globe className="w-3.5 h-3.5 text-[#133E2B]" />
                  <span>ENG / हिन्दी</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center space-x-3 cursor-pointer group" onClick={logout}>
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-[10px] font-bold text-[#1C2A24]/50 uppercase tracking-widest leading-none mb-1">Welcome back</span>
                    <span className="font-extrabold text-[#133E2B] text-sm leading-none group-hover:text-emerald-700 transition-colors">User Name</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#133E2B] flex items-center justify-center text-[#F8F7F4] shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                </div>
                <button className="text-[#1C2A24] hover:text-[#133E2B] relative transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 border-2 border-[#F8F7F4] rounded-full"></span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button className="hidden sm:flex items-center space-x-2 text-[#1C2A24] bg-white border border-[#1C2A24]/10 hover:bg-[#F8F7F4] px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm mr-2">
                  <Globe className="w-3.5 h-3.5 text-[#133E2B]" />
                  <span>ENG / हिन्दी</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-[#133E2B] hover:bg-[#0f3223] text-[#F8F7F4] px-6 py-3 rounded-full font-bold text-sm transition-colors active:scale-95"
                >
                  Get Started
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
