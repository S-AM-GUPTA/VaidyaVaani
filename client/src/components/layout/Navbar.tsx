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
  LayoutDashboard
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Logo to={isAuthenticated ? "/dashboard" : "/"} size="md" />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => handleNavClick('#features')}
                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Product
                  </button>
                  <button 
                    onClick={() => handleNavClick('#how-it-works')}
                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    How it Works
                  </button>
                  <button 
                    onClick={() => handleNavClick('#prescription-reader')}
                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Prescription Reader
                  </button>
                  <button 
                    onClick={() => handleNavClick('#reports')}
                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Reports
                  </button>
                  <button 
                    onClick={() => handleNavClick('#safety')}
                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Safety
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/dashboard"
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/dashboard' 
                        ? 'text-emerald-700 bg-emerald-50/80 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/services"
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/services' 
                        ? 'text-emerald-700 bg-emerald-50/80 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Pill className="w-4 h-4" />
                    <span>Prescriptions</span>
                  </Link>
                  <Link 
                    to="/lab-decoder"
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/lab-decoder' 
                        ? 'text-emerald-700 bg-emerald-50/80 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>Reports</span>
                  </Link>
                  <Link 
                    to="/safety-matrix"
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/safety-matrix' 
                        ? 'text-emerald-700 bg-emerald-50/80 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Safety</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100/80 hover:bg-slate-200/80 transition-colors border border-slate-200"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentLanguage.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-lg p-1 z-50 text-slate-800"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 border-b border-slate-100">
                      Languages
                    </div>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          currentLanguage.code === lang.code 
                            ? 'bg-emerald-50 text-emerald-800 font-semibold' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{lang.native} <span className="text-[10px] text-slate-400 font-normal">({lang.label})</span></span>
                        {currentLanguage.code === lang.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Authentication Buttons (Public vs Authenticated) */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors inline-flex items-center justify-center"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                    {userDisplayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{userDisplayName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-slate-800"
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{userDisplayName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email || 'Logged in'}</p>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          <span>Health Vault</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          <span>Profile & Records</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors"
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3"
          >
            {!isAuthenticated ? (
              <>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => handleNavClick('#features')}
                    className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Product
                  </button>
                  <button
                    onClick={() => handleNavClick('#how-it-works')}
                    className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    How it Works
                  </button>
                  <button
                    onClick={() => handleNavClick('#prescription-reader')}
                    className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Prescription Reader
                  </button>
                  <button
                    onClick={() => handleNavClick('#reports')}
                    className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Reports
                  </button>
                  <button
                    onClick={() => handleNavClick('#safety')}
                    className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Safety
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
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
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <span>Prescriptions</span>
                </Link>
                <Link
                  to="/lab-decoder"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Lab Reports</span>
                </Link>
                <Link
                  to="/safety-matrix"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Medication Safety</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Profile & Vault Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
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
