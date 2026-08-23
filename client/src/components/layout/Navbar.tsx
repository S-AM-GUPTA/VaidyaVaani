import { useState, useRef } from 'react';
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
  FileText, 
  ShieldCheck, 
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import Logo from '../Logo';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();
  
  const userDisplayName = user?.displayName || (user?.email ? user.email.split('@')[0] : (user?.phoneNumber ? user.phoneNumber : 'Patient Vault'));
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (anchorId: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + anchorId);
      return;
    }
    const element = document.querySelector(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-[72px]">
          
          {/* Logo & Left Navigation */}
          <div className="flex items-center gap-8 lg:gap-10">
            <Logo to={isAuthenticated ? "/home" : "/"} size="md" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium text-slate-600">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/home"
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/home' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                    Dashboard
                  </Link>

                  <Link
                    to="/home#prescriptions"
                    className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Pill className="w-4 h-4 text-slate-500" />
                    Prescriptions
                  </Link>

                  <Link
                    to="/lab-decoder"
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/lab-decoder' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    Reports
                  </Link>

                  <Link
                    to="/safety-matrix"
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                      location.pathname === '/safety-matrix' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    Safety Matrix
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('#features')}
                    className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Product
                  </button>
                  <button
                    onClick={() => handleNavClick('#how-it-works')}
                    className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    How it Works
                  </button>
                  <button
                    onClick={() => handleNavClick('#prescription-ai')}
                    className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Prescription Reader
                  </button>
                  <Link
                    to="/lab-decoder"
                    className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    Reports
                  </Link>
                  <Link
                    to="/safety-matrix"
                    className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    Safety
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Buttons & Language */}
          <div className="flex items-center gap-3">
            
            {/* Minimal Language Switcher */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsProfileOpen(false);
                }}
                className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors cursor-pointer"
                title="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold">{currentLanguage.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-slate-800"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2.5 py-1 border-b border-slate-100 mb-1">
                      Choose Language
                    </div>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
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

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer" 
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsLangOpen(false);
                  }}
                >
                  <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800 text-xs hidden sm:inline max-w-[120px] truncate">{userDisplayName}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-slate-800"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="text-xs font-semibold text-slate-900 truncate">{userDisplayName}</div>
                        <div className="text-[11px] text-slate-500">Authenticated Account</div>
                      </div>

                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/profile');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Profile & Emergency Info</span>
                      </button>

                      <button 
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link 
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#059669] hover:bg-[#047857] text-white shadow-xs hover:shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pb-5 border-t border-slate-100 pt-3 space-y-1 overflow-hidden text-slate-700"
            >
              {isAuthenticated ? (
                <>
                  <Link
                    to="/home"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/lab-decoder"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Medical Reports
                  </Link>
                  <Link
                    to="/safety-matrix"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Medication Safety
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    My Profile
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('#features')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Product
                  </button>
                  <button
                    onClick={() => handleNavClick('#how-it-works')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    How it Works
                  </button>
                  <button
                    onClick={() => handleNavClick('#prescription-ai')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Prescription Reader
                  </button>
                  <Link
                    to="/lab-decoder"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Reports
                  </Link>
                  <Link
                    to="/safety-matrix"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Safety
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};

export default Navbar;
