import { Link, useNavigate } from 'react-router-dom';
import { Globe, ChevronDown, CloudUpload, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center group">
            <img src="/logo/complete logo.png" alt="VaidyaVaani Logo" className="h-10 w-auto group-hover:scale-105 transition-transform" />
          </Link>

          {/* Center Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to={isAuthenticated ? "/home" : "/"} className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Home</Link>
            <a href="/#how-it-works" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">How It Works</a>
            <a href="/#features" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Features</a>
            <a href="#about" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">About Us</a>
            <a href="#faqs" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">FAQs</a>
            <a href="#contact" className="text-slate-600 font-medium hover:text-blue-600 transition-colors">Contact</a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="hidden sm:flex items-center space-x-1 text-slate-600 hover:text-slate-900 font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Globe className="w-4 h-4" />
              <span>English</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="hidden sm:flex items-center space-x-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center space-x-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-900 transition-colors shadow-sm"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <CloudUpload className="w-5 h-5" />
                <span className="hidden sm:inline">Upload Report</span>
                <span className="sm:hidden">Upload</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
