import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Bell, User, LogOut, Check, Menu, X, Pill, Activity, ShieldCheck, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import Logo from '../Logo';

const NOTIFICATIONS = [
  { id: 1, title: 'Drug Spacing Reminder', desc: 'Space Atenolol 2 hours from antacids.', time: '10m ago', unread: true },
  { id: 2, title: 'Lab Biomarkers Ingested', desc: 'Fasting glucose extracted at 108 mg/dL.', time: '1h ago', unread: true },
  { id: 3, title: 'Vault Sealed', desc: 'Zero-knowledge encryption keys refreshed.', time: '1d ago', unread: false },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === '/' || location.pathname === '';
  const isDashboard = location.pathname === '/home';

  const markAllNotifsRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleNavClick = (anchorId: string) => {
    setIsMobileMenuOpen(false);
    if (!isHome && !isDashboard) {
      navigate('/' + anchorId);
      return;
    }
    const element = document.querySelector(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-[#000000]/90 border-b border-white/[0.08] sticky top-0 z-50 transition-colors backdrop-blur-xl">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <Logo to={isAuthenticated ? "/home" : "/"} size="md" />

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-full">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/home')}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.05em] transition-all flex items-center gap-1.5 ${
                    isDashboard 
                      ? 'bg-[#15846e] text-white shadow-[0_0_15px_rgba(21,132,110,0.4)]' 
                      : 'text-[#9a9a9a] hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  {t('workspace')}
                </button>

                <button
                  onClick={() => handleNavClick('#section-prescriptions')}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.05em] text-[#9a9a9a] hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Pill className="w-3.5 h-3.5 text-[#15846e]" />
                  {t('prescriptions')}
                </button>

                <button
                  onClick={() => handleNavClick('#section-diagnostics')}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.05em] text-[#9a9a9a] hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#004fdc]" />
                  {t('labDiagnostics')}
                </button>

                <button
                  onClick={() => handleNavClick('#chat')}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.05em] text-[#9a9a9a] hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#ffb829]" />
                  {t('aiChat')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('#intelligence')}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.05em] text-[#9a9a9a] hover:text-white transition-colors"
                >
                  {t('intelligence')}
                </button>
                <button
                  onClick={() => handleNavClick('#features')}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.05em] text-[#9a9a9a] hover:text-white transition-colors"
                >
                  {t('safetyMatrix')}
                </button>
                <button
                  onClick={() => handleNavClick('#lab-decoder')}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.05em] text-[#9a9a9a] hover:text-white transition-colors"
                >
                  {t('labDecoding')}
                </button>
                <button
                  onClick={() => handleNavClick('#pipeline')}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.05em] text-[#9a9a9a] hover:text-white transition-colors"
                >
                  {t('pipeline')}
                </button>
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Live Multilingual Language Switcher Dropdown */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsNotifOpen(false);
                  setIsProfileOpen(false);
                }}
                className="flex items-center space-x-2 text-[#ffffff] hover:text-[#ffffff] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.05em] transition-colors border border-white/20 hover:border-[#004fdc]/60 bg-white/[0.04] shadow-[0_0_15px_rgba(0,79,220,0.15)]"
              >
                <Globe className="w-3.5 h-3.5 text-[#004fdc]" />
                <span className="font-mono text-[11px]">{currentLanguage.native}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0d0d12] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] p-2 z-50 backdrop-blur-2xl"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9a9a9a] px-3 py-1.5 border-b border-white/[0.06] mb-1 flex items-center justify-between">
                      <span>Select Language Mode</span>
                      <span className="text-[#004fdc] text-[9px] font-mono">LIVE</span>
                    </div>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          currentLanguage.code === lang.code 
                            ? 'bg-[#004fdc]/20 text-[#004fdc] font-medium border border-[#004fdc]/30' 
                            : 'text-[#bdbdbd] hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="font-medium">{lang.native}</span>
                          <span className="text-[10px] text-[#9a9a9a]">({lang.label})</span>
                        </span>
                        {currentLanguage.code === lang.code && <Check className="w-3.5 h-3.5 text-[#004fdc]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
                    className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/20 text-[#9a9a9a] hover:text-[#ffffff] flex items-center justify-center relative transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {notifs.some(n => n.unread) && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#15846e] rounded-full animate-ping"></span>
                    )}
                    {notifs.some(n => n.unread) && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#15846e] rounded-full"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0d0d12] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] p-3 z-50 backdrop-blur-2xl"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-2 px-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-white">{t('notifications')}</span>
                          <button 
                            onClick={markAllNotifsRead} 
                            className="text-[10px] text-[#15846e] hover:underline"
                          >
                            {t('markAllRead')}
                          </button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {notifs.map((n) => (
                            <div 
                              key={n.id} 
                              className={`p-2.5 rounded-xl border text-xs transition-colors ${
                                n.unread ? 'bg-white/[0.04] border-white/10' : 'bg-transparent border-transparent opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-white">{n.title}</span>
                                <span className="text-[9px] font-mono text-[#9a9a9a]">{n.time}</span>
                              </div>
                              <p className="text-[11px] font-light text-[#bdbdbd]">{n.desc}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Session Menu */}
                <div className="relative">
                  <div 
                    className="flex items-center space-x-2.5 cursor-pointer group p-1 pr-2.5 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all" 
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsLangOpen(false);
                      setIsNotifOpen(false);
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#15846e]/20 border border-[#15846e]/40 flex items-center justify-center text-[#ffffff] shadow-[0_0_15px_rgba(21,132,110,0.3)]">
                      <User className="w-4 h-4 text-[#15846e]" />
                    </div>
                    <span className="font-normal text-[#ffffff] text-xs hidden sm:inline">{t('member')}</span>
                    <ChevronDown className="w-3 h-3 text-[#9a9a9a]" />
                  </div>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0d0d12] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] p-2 z-50 backdrop-blur-2xl"
                      >
                        <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                          <div className="text-xs font-medium text-white">{t('member')}</div>
                          <div className="text-[10px] text-[#15846e] font-mono">{t('zeroKnowledgeVault')}</div>
                        </div>
                        <button 
                          onClick={() => {
                            logout();
                            navigate('/');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/30 flex items-center gap-2 transition-colors"
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
                className="bg-[#004fdc] hover:bg-[#003eb0] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.025em] transition-all duration-200 active:scale-[0.98] shadow-[0_0_20px_rgba(0,79,220,0.35)]"
              >
                {t('requestAccess')}
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
              className="lg:hidden pb-6 border-t border-white/[0.06] pt-4 space-y-2 overflow-hidden"
            >
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/home');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#15846e]/20 border border-[#15846e]/30 flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4 text-[#15846e]" />
                    {t('workspace')}
                  </button>
                  <button
                    onClick={() => handleNavClick('#section-prescriptions')}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#bdbdbd] hover:bg-white/5 flex items-center gap-2"
                  >
                    <Pill className="w-4 h-4 text-[#15846e]" />
                    {t('prescriptions')}
                  </button>
                  <button
                    onClick={() => handleNavClick('#section-diagnostics')}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#bdbdbd] hover:bg-white/5 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#004fdc]" />
                    {t('labDiagnostics')}
                  </button>
                  <button
                    onClick={() => handleNavClick('#chat')}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#bdbdbd] hover:bg-white/5 flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-[#ffb829]" />
                    {t('aiChat')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('#intelligence')}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#bdbdbd] hover:bg-white/5"
                  >
                    {t('intelligence')}
                  </button>
                  <button
                    onClick={() => handleNavClick('#features')}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#bdbdbd] hover:bg-white/5"
                  >
                    {t('safetyMatrix')}
                  </button>
                  <button
                    onClick={() => handleNavClick('#lab-decoder')}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#bdbdbd] hover:bg-white/5"
                  >
                    {t('labDecoding')}
                  </button>
                  <button
                    onClick={() => handleNavClick('#pipeline')}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#bdbdbd] hover:bg-white/5"
                  >
                    {t('pipeline')}
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  );
};

export default Navbar;
