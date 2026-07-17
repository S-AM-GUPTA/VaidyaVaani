import { Link, useNavigate } from 'react-router-dom';
import { Globe, ChevronDown, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center group">
            <img src="/logo/complete logo.png" alt="VaidyaVaani Logo" className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform" />
          </Link>

          {/* Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/home" className="text-emerald-600 font-bold border-b-2 border-emerald-600 pb-1 text-sm">Home</Link>
                <a href="#timeline" className="text-slate-700 font-semibold hover:text-emerald-600 transition-colors text-sm">Medical Timeline</a>
                <a href="#interaction" className="text-slate-700 font-semibold hover:text-emerald-600 transition-colors text-sm">Interaction Checks</a>
                <a href="#chat" className="text-slate-700 font-semibold hover:text-emerald-600 transition-colors text-sm">AI Chat</a>
                <Link to="/dashboard" className="text-slate-700 font-semibold hover:text-emerald-600 transition-colors text-sm">My Reports</Link>
                <a href="#support" className="text-slate-700 font-semibold hover:text-emerald-600 transition-colors text-sm">Support</a>
              </>
            ) : (
              <>
                <Link to="/" className="text-emerald-600 font-bold text-sm">Home</Link>
                <a href="#features" className="text-slate-700 font-semibold hover:text-emerald-600 transition-colors text-sm">Features</a>
                <a href="#about" className="text-slate-700 font-semibold hover:text-emerald-600 transition-colors text-sm">About Us</a>
                <div className="text-slate-700 font-semibold text-sm cursor-pointer hover:text-emerald-600">Language (English/Hindi)</div>
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button className="hidden sm:flex items-center space-x-1 text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>Hindi/English</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="hidden sm:flex flex-col text-sm cursor-pointer" onClick={logout}>
                    <span className="text-slate-500 font-medium leading-none mb-1">Welcome back,</span>
                    <span className="font-bold text-slate-800 leading-none">[User Name]!</span>
                  </div>
                </div>
                <button className="text-emerald-600 hover:text-emerald-700 relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#2B4B6F] hover:bg-[#1f3752] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm"
              >
                Get Started / Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
