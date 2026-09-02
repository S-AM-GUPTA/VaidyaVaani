import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenUpload?: (type: 'prescriptions' | 'reports') => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  
  const userDisplayName = user?.displayName || (user?.email ? user.email.split('@')[0] : (user?.phoneNumber ? user.phoneNumber : 'User'));
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (anchorId: string) => {
    setIsMobileMenuOpen(false);
    if (anchorId === '#generic-finder') {
      if (onOpenSearch) {
        onOpenSearch();
        return;
      }
    }
    if (location.pathname !== '/' && location.pathname !== '/home') {
      navigate('/' + anchorId);
      setTimeout(() => {
        const element = document.querySelector(anchorId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const element = document.querySelector(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100/90 w-full transition-all">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo with Botanical Leaf and Tagline */}
        <Link to="/" className="flex items-center gap-3 select-none group text-left">
          {/* Green Leaf Botanical Icon */}
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-emerald-800" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A9.49 9.49 0 0 0 12 21c6.08 0 10-4.92 10-11 0-.6-.05-1.19-.14-1.77L20.5 7.6A9.9 9.9 0 0 0 17 8zm-4.7 10.7a7.6 7.6 0 0 1-3.2-1.7c1.7-3.6 3.6-6.2 8.7-7.9a8 8 0 0 1-5.5 9.6zM7.2 4.4a8 8 0 0 1 8.6 1.4c-4.3 1.5-6.8 3.8-8.2 6.9A7.8 7.8 0 0 1 7.2 4.4z"/>
            </svg>
          </div>

          <div>
            <span className="text-xl sm:text-2xl font-black font-headline tracking-tight text-slate-900 block leading-none">
              VaidyaVaani
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide block mt-1">
              Clinical Intelligence. Trusted Information.
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          <Link 
            to="/"
            className={`text-xs font-semibold py-1 transition-colors relative ${
              location.pathname === '/' || location.pathname === '/home'
                ? 'text-slate-900 font-bold after:content-[""] after:absolute after:bottom-[-6px] after:left-0 after:right-0 after:h-[2.5px] after:bg-[#1a472a] after:rounded-full' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Home
          </Link>

          <button 
            onClick={() => handleNavClick('#clinical-intelligence')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Clinical Intelligence
          </button>

          <button 
            onClick={() => handleNavClick('#generic-finder')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Generic Salt Finder
          </button>

          <Link 
            to="/regional-care"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Voice Vault
          </Link>

          <button 
            onClick={() => handleNavClick('#about-us')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            About Us
          </button>

          <button 
            onClick={() => handleNavClick('#resources')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Resources
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Moon className="w-4 h-4 text-emerald-700" /> : <Sun className="w-4 h-4 text-amber-600" />}
          </button>

          {/* Authentication Action */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="bg-[#1a472a] hover:bg-[#143720] text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer select-none"
            >
              Get Started
            </Link>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#1a472a] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {userDisplayName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{userDisplayName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-slate-800"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 text-left">
                      <p className="text-xs font-bold text-slate-900">{userDisplayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email || 'Logged in'}</p>
                    </div>

                    <div className="py-1 space-y-0.5 text-left">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>Health Vault</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>Profile & Settings</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3 text-left"
          >
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-xs font-bold text-emerald-800 py-1"
            >
              Home
            </Link>
            <button
              onClick={() => handleNavClick('#clinical-intelligence')}
              className="block text-xs font-semibold text-slate-700 py-1"
            >
              Clinical Intelligence
            </button>
            <button
              onClick={() => handleNavClick('#generic-finder')}
              className="block text-xs font-semibold text-slate-700 py-1"
            >
              Generic Salt Finder
            </button>
            <Link
              to="/regional-care"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-xs font-semibold text-slate-700 py-1"
            >
              Voice Vault
            </Link>
            <button
              onClick={() => handleNavClick('#about-us')}
              className="block text-xs font-semibold text-slate-700 py-1"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('#resources')}
              className="block text-xs font-semibold text-slate-700 py-1"
            >
              Resources
            </button>
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center bg-[#1a472a] text-white py-2.5 rounded-lg text-xs font-bold"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
