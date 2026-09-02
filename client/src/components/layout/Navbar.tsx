import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  ChevronDown, 
  User, 
  LogOut, 
  Check, 
  Menu, 
  X, 
  Pill, 
  Activity, 
  ShieldCheck, 
  LayoutDashboard,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import Logo from '../Logo';

interface NavbarProps {
  onOpenUpload?: (type: 'prescriptions' | 'reports') => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();
  
  const userDisplayName = user?.displayName || (user?.email ? user.email.split('@')[0] : (user?.phoneNumber ? user.phoneNumber : 'User'));
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (anchorId: string) => {
    setIsMobileMenuOpen(false);
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
    <header className="sticky top-3 sm:top-4 z-50 max-w-[1240px] mx-auto px-3 sm:px-6 w-full transition-all duration-300">
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-full px-4 sm:px-6 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Logo to={isAuthenticated ? "/dashboard" : "/"} size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => handleNavClick('#features')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100/80 transition-all cursor-pointer"
                >
                  Product
                </button>
                <button 
                  onClick={() => handleNavClick('#how-it-works')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100/80 transition-all cursor-pointer"
                >
                  How it Works
                </button>
                <button 
                  onClick={() => handleNavClick('#prescription-reader')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100/80 transition-all cursor-pointer"
                >
                  Prescription Reader
                </button>
                <button 
                  onClick={() => handleNavClick('#reports')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100/80 transition-all cursor-pointer"
                >
                  Reports
                </button>
                <button 
                  onClick={() => handleNavClick('#safety')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100/80 transition-all cursor-pointer"
                >
                  Safety
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard"
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                    location.pathname === '/dashboard' 
                      ? 'text-emerald-800 bg-emerald-100/80 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Health Vault</span>
                </Link>
                <Link 
                  to="/services"
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                    location.pathname === '/services' 
                      ? 'text-emerald-800 bg-emerald-100/80 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>Prescriptions</span>
                </Link>
                <Link 
                  to="/lab-decoder"
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                    location.pathname === '/lab-decoder' 
                      ? 'text-emerald-800 bg-emerald-100/80 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Reports</span>
                </Link>
                <Link 
                  to="/safety-matrix"
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                    location.pathname === '/safety-matrix' 
                      ? 'text-emerald-800 bg-emerald-100/80 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Safety</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100/80 hover:bg-slate-200/80 transition-colors border border-slate-200/80 cursor-pointer"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentLanguage.native}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-52 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl p-1.5 z-50 text-slate-800"
                >
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-100">
                    Regional Languages
                  </div>
                  <div className="py-1 space-y-0.5">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          currentLanguage.code === lang.code 
                            ? 'bg-emerald-50 text-emerald-800 font-bold' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{lang.native} <span className="text-[10px] text-slate-400 font-normal">({lang.label})</span></span>
                        {currentLanguage.code === lang.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Authentication CTA */}
          {!isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="btn-island-primary text-xs py-1.5 pl-3.5 pr-2 group cursor-pointer"
              >
                <span>Get Started</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3 h-3 text-white" />
                </span>
              </Link>
            </div>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-slate-200/90 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {userDisplayName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">{userDisplayName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl p-1.5 z-50 text-slate-800"
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{userDisplayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email || 'Logged in'}</p>
                    </div>

                    <div className="py-1 space-y-0.5">
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
                        <span>Profile & Records</span>
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

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="md:hidden mt-2 bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-xl p-5 space-y-4"
          >
            {!isAuthenticated ? (
              <>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => handleNavClick('#features')}
                    className="text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Product
                  </button>
                  <button
                    onClick={() => handleNavClick('#how-it-works')}
                    className="text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    How it Works
                  </button>
                  <button
                    onClick={() => handleNavClick('#prescription-reader')}
                    className="text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Prescription Reader
                  </button>
                  <button
                    onClick={() => handleNavClick('#reports')}
                    className="text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Reports
                  </button>
                  <button
                    onClick={() => handleNavClick('#safety')}
                    className="text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Safety
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-full text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-full text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>Health Vault</span>
                </Link>
                <Link
                  to="/services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <span>Prescriptions</span>
                </Link>
                <Link
                  to="/lab-decoder"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Lab Reports</span>
                </Link>
                <Link
                  to="/safety-matrix"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Medication Safety</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Profile & Vault Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
