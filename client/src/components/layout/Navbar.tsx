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
  const { isAuthenticated, logout, user } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  
  const userDisplayName = user?.displayName || (user?.email ? user.email.split('@')[0] : (user?.phoneNumber ? user.phoneNumber : 'Patient Vault'));
  
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
    <nav className="bg-[#090d16]/95 border-b border-[#1e293b] sticky top-0 z-50 transition-colors backdrop-blur-xl">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-18">
          
          {/* Brand Logo */}
          <Logo to={isAuthenticated ? "/home" : "/"} size="md" />

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 p-1 bg-[#0f1523] border border-[#1e293b] rounded-lg">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/home')}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isDashboard 
                      ? 'bg-[#0d9488] text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  {t('workspace')}
                </button>

                <button
                  onClick={() => handleNavClick('#section-prescriptions')}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Pill className="w-3.5 h-3.5 text-teal-400" />
                  {t('prescriptions')}
                </button>

                <button
                  onClick={() => handleNavClick('#section-diagnostics')}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  {t('labDiagnostics')}
                </button>

                <button
                  onClick={() => handleNavClick('#chat')}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  {t('aiChat')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('#safety-matrix')}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {t('safetyMatrix')}
                </button>
                <button
                  onClick={() => handleNavClick('#lab-decoder')}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {t('labDecoding')}
                </button>
                <button
                  onClick={() => handleNavClick('#multilingual-voice')}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {t('intelligence')}
                </button>
                <button
                  onClick={() => handleNavClick('#workflow')}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-colors"
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
                className="flex items-center space-x-2 text-slate-200 hover:text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-[#1e293b] hover:border-[#334155] bg-[#0f1523]"
              >
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-mono text-[11px]">{currentLanguage.native}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0f1523] border border-[#1e293b] shadow-xl p-2 z-50"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5 border-b border-[#1e293b] mb-1 flex items-center justify-between font-mono">
                      <span>Regional Dialect</span>
                      <span className="text-teal-400 text-[9px]">ACTIVE</span>
                    </div>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          currentLanguage.code === lang.code 
                            ? 'bg-teal-950/40 text-teal-300 font-medium border border-teal-500/30' 
                            : 'text-slate-300 hover:bg-[#172036] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="font-medium">{lang.native}</span>
                          <span className="text-[10px] text-slate-400">({lang.label})</span>
                        </span>
                        {currentLanguage.code === lang.code && <Check className="w-3.5 h-3.5 text-teal-400" />}
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
                    className="w-9 h-9 rounded-md bg-[#0f1523] border border-[#1e293b] hover:border-[#334155] text-slate-400 hover:text-white flex items-center justify-center relative transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {notifs.some(n => n.unread) && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-teal-400 rounded-full"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 rounded-xl bg-[#0f1523] border border-[#1e293b] shadow-xl p-3 z-50"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] mb-2 px-1">
                          <span className="text-xs font-semibold text-white font-mono uppercase tracking-wider">{t('notifications')}</span>
                          <button 
                            onClick={markAllNotifsRead} 
                            className="text-[10px] text-teal-400 hover:underline"
                          >
                            {t('markAllRead')}
                          </button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {notifs.map((n) => (
                            <div 
                              key={n.id} 
                              className={`p-2.5 rounded-lg border text-xs transition-colors ${
                                n.unread ? 'bg-[#172036] border-[#1e293b]' : 'bg-transparent border-transparent opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-white">{n.title}</span>
                                <span className="text-[9px] font-mono text-slate-400">{n.time}</span>
                              </div>
                              <p className="text-[11px] font-normal text-slate-400">{n.desc}</p>
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
                    className="flex items-center space-x-2.5 cursor-pointer group p-1 pr-2.5 rounded-md bg-[#0f1523] border border-[#1e293b] hover:border-[#334155] transition-all" 
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsLangOpen(false);
                      setIsNotifOpen(false);
                    }}
                  >
                    <div className="w-7 h-7 rounded-md bg-teal-950/60 border border-teal-500/40 flex items-center justify-center text-teal-300">
                      <User className="w-3.5 h-3.5 text-teal-400" />
                    </div>
                    <span className="font-medium text-slate-200 text-xs hidden sm:inline max-w-[120px] truncate">{userDisplayName}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0f1523] border border-[#1e293b] shadow-xl p-2 z-50"
                      >
                        <div className="px-3 py-2 border-b border-[#1e293b] mb-1">
                          <div className="text-xs font-semibold text-white truncate">{userDisplayName}</div>
                          <div className="text-[10px] text-teal-400 font-mono">Zero-Knowledge Encrypted</div>
                        </div>

                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/profile');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-[#172036] hover:text-white flex items-center gap-2 transition-colors mb-1"
                        >
                          <User className="w-3.5 h-3.5 text-teal-400" />
                          <span>Health Profile & SOS</span>
                        </button>

                        <button 
                          onClick={() => {
                            logout();
                            navigate('/');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
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
                className="btn-primary py-2 px-4 text-xs font-semibold"
              >
                {t('requestAccess')}
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-md bg-[#0f1523] border border-[#1e293b] flex items-center justify-center text-white"
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
              className="lg:hidden pb-6 border-t border-[#1e293b] pt-4 space-y-2 overflow-hidden"
            >
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/home');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium text-white bg-teal-950/40 border border-teal-500/30 flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4 text-teal-400" />
                    {t('workspace')}
                  </button>
                  <button
                    onClick={() => handleNavClick('#section-prescriptions')}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#172036] flex items-center gap-2"
                  >
                    <Pill className="w-4 h-4 text-teal-400" />
                    {t('prescriptions')}
                  </button>
                  <button
                    onClick={() => handleNavClick('#section-diagnostics')}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#172036] flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    {t('labDiagnostics')}
                  </button>
                  <button
                    onClick={() => handleNavClick('#chat')}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#172036] flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    {t('aiChat')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('#safety-matrix')}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#172036]"
                  >
                    {t('safetyMatrix')}
                  </button>
                  <button
                    onClick={() => handleNavClick('#lab-decoder')}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#172036]"
                  >
                    {t('labDecoding')}
                  </button>
                  <button
                    onClick={() => handleNavClick('#multilingual-voice')}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#172036]"
                  >
                    {t('intelligence')}
                  </button>
                  <button
                    onClick={() => handleNavClick('#workflow')}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#172036]"
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
