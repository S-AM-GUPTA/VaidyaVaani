import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Bell, User, LogOut, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
];

const NOTIFICATIONS = [
  { id: 1, title: 'Drug Spacing Reminder', desc: 'Space Atenolol 2 hours from antacids.', time: '10m ago', unread: true },
  { id: 2, title: 'Lab Biomarkers Ingested', desc: 'Fasting glucose extracted at 108 mg/dL.', time: '1h ago', unread: true },
  { id: 3, title: 'Vault Sealed', desc: 'Zero-knowledge encryption keys refreshed.', time: '1d ago', unread: false },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const markAllNotifsRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <nav className="bg-[#000000] border-b border-white/[0.06] sticky top-0 z-50 transition-colors backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Logo to={isAuthenticated ? "/home" : "/"} size="md" />

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-9">
            {isAuthenticated ? (
              <>
                <LinkTo to="/home" label="Workspace" active />
                <a href="#timeline" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Timeline
                </a>
                <a href="#interactions" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Interactions
                </a>
                <a href="#labs" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Lab Diagnostics
                </a>
                <a href="#chat" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  AI Neural Chat
                </a>
              </>
            ) : (
              <>
                <a href="#intelligence" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Intelligence
                </a>
                <a href="#features" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Capabilities
                </a>
                <a href="#lab-decoder" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Lab Decoding
                </a>
                <a href="#pipeline" className="text-xs uppercase font-semibold tracking-[0.05em] text-[#9a9a9a] hover:text-[#ffffff] transition-colors">
                  Pipeline
                </a>
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Language Switcher Dropdown */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsNotifOpen(false);
                  setIsProfileOpen(false);
                }}
                className="flex items-center space-x-2 text-[#9a9a9a] hover:text-[#ffffff] px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.05em] transition-colors border border-white/10 hover:border-white/20 bg-white/[0.02]"
              >
                <Globe className="w-3.5 h-3.5 text-[#004fdc]" />
                <span className="font-mono text-[11px]">{selectedLang.native}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0d0d12] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] p-2 z-50"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9a9a9a] px-3 py-1.5 border-b border-white/[0.06] mb-1">
                      Select Dialect
                    </div>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLang(lang);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          selectedLang.code === lang.code 
                            ? 'bg-[#004fdc]/20 text-[#004fdc] font-medium' 
                            : 'text-[#bdbdbd] hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        <span>{lang.native} <span className="text-[10px] text-[#9a9a9a]">({lang.label})</span></span>
                        {selectedLang.code === lang.code && <Check className="w-3.5 h-3.5 text-[#004fdc]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                
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
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#004fdc] rounded-full animate-ping"></span>
                    )}
                    {notifs.some(n => n.unread) && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#004fdc] rounded-full"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0d0d12] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] p-3 z-50"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-2 px-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-white">Notifications</span>
                          <button 
                            onClick={markAllNotifsRead} 
                            className="text-[10px] text-[#004fdc] hover:underline"
                          >
                            Mark all read
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

                {/* Profile & Logout Trigger */}
                <div className="relative">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer group" 
                    onClick={() => {
                      setIsProfileOpen(!isProfileOpen);
                      setIsLangOpen(false);
                      setIsNotifOpen(false);
                    }}
                  >
                    <div className="hidden sm:flex flex-col text-right">
                      <span className="text-[10px] font-semibold text-[#15846e] uppercase tracking-[0.08em] leading-none mb-1">Active</span>
                      <span className="font-normal text-[#ffffff] text-xs leading-none group-hover:text-[#15846e] transition-colors">Member</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#15846e]/20 border border-[#15846e]/40 flex items-center justify-center text-[#ffffff] shadow-[0_0_15px_rgba(21,132,110,0.3)]">
                      <User className="w-4 h-4 text-[#15846e]" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0d0d12] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] p-2 z-50"
                      >
                        <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                          <div className="text-xs font-medium text-white">Member Session</div>
                          <div className="text-[10px] text-[#15846e] font-mono">Zero-Knowledge Sealed</div>
                        </div>
                        <button 
                          onClick={() => {
                            logout();
                            navigate('/');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/30 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>End Session</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-[#004fdc] hover:bg-[#003eb0] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.025em] transition-all duration-200 active:scale-[0.98] shadow-[0_0_20px_rgba(0,79,220,0.35)]"
                >
                  Request Access
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

const LinkTo = ({ to, label, active = false }: { to: string; label: string; active?: boolean }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(to)} 
      className={`text-xs uppercase font-semibold tracking-[0.05em] transition-colors ${
        active ? 'text-[#ffffff] border-b border-[#004fdc] pb-0.5' : 'text-[#9a9a9a] hover:text-[#ffffff]'
      }`}
    >
      {label}
    </button>
  );
};

export default Navbar;
