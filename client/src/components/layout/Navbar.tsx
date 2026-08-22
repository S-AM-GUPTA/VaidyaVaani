import { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  ChevronDown, 
  Bell, 
  User, 
  LogOut, 
  Check, 
  Menu, 
  X, 
  Pill, 
  Activity, 
  ShieldCheck, 
  Phone,
  Clock,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import Logo from '../Logo';

interface NotificationItem {
  id: number | string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  
  const userDisplayName = user?.displayName || (user?.email ? user.email.split('@')[0] : (user?.phoneNumber ? user.phoneNumber : 'Patient Vault'));
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifs, setNotifs] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('vv_patient_notifs');
    return saved ? JSON.parse(saved) : [];
  });

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const isDashboard = location.pathname === '/home';

  const markAllNotifsRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleNavClick = (anchorId: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/home') {
      navigate('/home');
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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      
      {/* Top Medical Utility Bar */}
      <div className="bg-[#0f172a] text-slate-300 text-xs py-2 px-6 lg:px-12 border-b border-slate-800">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-rose-400" />
              <span>Emergency 24/7 Helpline: <strong className="text-white font-mono">108 / 102</strong></span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Clinical Ingestion Support: <span className="text-slate-200">Mon - Sun (24/7)</span></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-teal-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono">Verified Medical Protocol</span>
            </div>

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsNotifOpen(false);
                  setIsProfileOpen(false);
                }}
                className="flex items-center gap-1.5 text-slate-200 hover:text-white px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <Globe className="w-3 h-3 text-sky-400" />
                <span className="font-mono">{currentLanguage.native}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-lg bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-slate-800"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-slate-100 mb-1 font-mono">
                      Select Dialect
                    </div>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                          currentLanguage.code === lang.code 
                            ? 'bg-sky-50 text-sky-700 font-semibold' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{lang.native} <span className="text-[10px] text-slate-400 font-normal">({lang.label})</span></span>
                        {currentLanguage.code === lang.code && <Check className="w-3.5 h-3.5 text-sky-600" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          {/* Hospital Brand Logo */}
          <Logo to={isAuthenticated ? "/home" : "/"} size="md" />

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7 font-medium text-sm text-slate-600">
            {isAuthenticated ? (
              <>
                <Link
                  to="/home"
                  className={`transition-colors py-2 flex items-center gap-1.5 ${
                    isDashboard ? 'text-sky-600 font-bold border-b-2 border-sky-600' : 'hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-4 h-4 text-sky-600" />
                  {t('workspace')}
                </Link>

                <button
                  onClick={() => handleNavClick('#section-prescriptions')}
                  className="hover:text-slate-900 transition-colors py-2 flex items-center gap-1.5"
                >
                  <Pill className="w-4 h-4 text-teal-600" />
                  {t('prescriptions')}
                </button>

                <button
                  onClick={() => handleNavClick('#section-diagnostics')}
                  className="hover:text-slate-900 transition-colors py-2 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  {t('labDiagnostics')}
                </button>

                <Link
                  to="/safety-matrix"
                  className={`hover:text-slate-900 transition-colors py-2 ${location.pathname === '/safety-matrix' ? 'text-sky-600 font-bold border-b-2 border-sky-600' : ''}`}
                >
                  Safety Matrix
                </Link>

                <Link
                  to="/lab-decoder"
                  className={`hover:text-slate-900 transition-colors py-2 ${location.pathname === '/lab-decoder' ? 'text-sky-600 font-bold border-b-2 border-sky-600' : ''}`}
                >
                  Lab Decoder
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/services"
                  className={`transition-colors py-2 ${location.pathname === '/services' ? 'text-sky-600 font-bold border-b-2 border-sky-600' : 'hover:text-sky-600'}`}
                >
                  Medical Services
                </Link>
                <Link
                  to="/safety-matrix"
                  className={`transition-colors py-2 ${location.pathname === '/safety-matrix' ? 'text-sky-600 font-bold border-b-2 border-sky-600' : 'hover:text-sky-600'}`}
                >
                  Drug Safety Matrix
                </Link>
                <Link
                  to="/lab-decoder"
                  className={`transition-colors py-2 ${location.pathname === '/lab-decoder' ? 'text-sky-600 font-bold border-b-2 border-sky-600' : 'hover:text-sky-600'}`}
                >
                  Lab Biomarkers
                </Link>
                <Link
                  to="/regional-care"
                  className={`transition-colors py-2 ${location.pathname === '/regional-care' ? 'text-sky-600 font-bold border-b-2 border-sky-600' : 'hover:text-sky-600'}`}
                >
                  Regional Care
                </Link>
              </>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                
                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => {
                      setIsNotifOpen(!isNotifOpen);
                      setIsLangOpen(false);
                      setIsProfileOpen(false);
                    }}
                    className="w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 flex items-center justify-center relative transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {notifs.some(n => n.unread) && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-xl p-3 z-50 text-slate-800"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 px-1">
                          <span className="text-xs font-semibold text-slate-900 uppercase font-mono">{t('notifications')}</span>
                          <button 
                            onClick={markAllNotifsRead} 
                            className="text-[10px] text-sky-600 hover:underline"
                          >
                            {t('markAllRead')}
                          </button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {notifs.length === 0 ? (
                            <div className="py-6 text-center text-xs text-slate-400 font-mono">
                              No new notifications.
                            </div>
                          ) : (
                            notifs.map((n) => (
                              <div 
                                key={n.id} 
                                className={`p-2.5 rounded-lg border text-xs transition-colors ${
                                  n.unread ? 'bg-sky-50/50 border-sky-100' : 'bg-slate-50 border-transparent opacity-75'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-slate-900">{n.title}</span>
                                  <span className="text-[9px] font-mono text-slate-400">{n.time}</span>
                                </div>
                                <p className="text-[11px] text-slate-600">{n.desc}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile User Dropdown */}
                <div className="relative">
                  <div 
                    className="flex items-center space-x-2.5 cursor-pointer p-1.5 pr-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all" 
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsLangOpen(false);
                      setIsNotifOpen(false);
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-semibold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800 text-xs hidden sm:inline max-w-[120px] truncate">{userDisplayName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-slate-800"
                      >
                        <div className="px-3 py-2 border-b border-slate-100 mb-1">
                          <div className="text-xs font-semibold text-slate-900 truncate">{userDisplayName}</div>
                          <div className="text-[10px] text-teal-600 font-mono">Zero-Knowledge Encrypted</div>
                        </div>

                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/profile');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors mb-1"
                        >
                          <User className="w-3.5 h-3.5 text-sky-600" />
                          <span>Health Profile & SOS</span>
                        </button>

                        <button 
                          onClick={() => {
                            logout();
                            navigate('/');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t('endSession')}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="btn-med-primary text-xs font-semibold"
              >
                <HeartPulse className="w-4 h-4" />
                <span>Patient Portal Login</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700"
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
              className="lg:hidden pb-6 border-t border-slate-200 pt-4 space-y-2 overflow-hidden text-slate-700"
            >
              {isAuthenticated ? (
                <>
                  <Link
                    to="/home"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50"
                  >
                    {t('workspace')}
                  </Link>
                  <Link
                    to="/safety-matrix"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Drug Safety Matrix
                  </Link>
                  <Link
                    to="/lab-decoder"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Lab Report Decoder
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/services"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Medical Services
                  </Link>
                  <Link
                    to="/safety-matrix"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Drug Safety Matrix
                  </Link>
                  <Link
                    to="/lab-decoder"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Lab Biomarkers
                  </Link>
                  <Link
                    to="/regional-care"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Regional Care
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
