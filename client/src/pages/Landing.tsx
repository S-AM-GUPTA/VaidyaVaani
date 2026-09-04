import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Globe, 
  Phone, 
  MessageCircle, 
  Camera, 
  FileText, 
  Mic, 
  Volume2, 
  Share2, 
  Copy, 
  Check, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  Lock, 
  User, 
  LogOut, 
  LayoutDashboard,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import Uploader from '../components/Uploader';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();

  const userDisplayName = user?.displayName || (user?.email ? user.email.split('@')[0] : (user?.phoneNumber ? user.phoneNumber : 'User'));

  // Modals & Drawers
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'prescriptions' | 'reports'>('reports');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [copiedNote, setCopiedNote] = useState<string | null>(null);

  // Hidden camera input
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Voice Synthesizer Audio State
  const [currentlySpeaking, setCurrentlySpeaking] = useState<string | null>(null);

  const handleSpeak = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;

    if (currentlySpeaking === id) {
      window.speechSynthesis.cancel();
      setCurrentlySpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage.speechCode;
    utterance.rate = 0.95;
    utterance.onstart = () => setCurrentlySpeaking(id);
    utterance.onend = () => setCurrentlySpeaking(null);
    utterance.onerror = () => setCurrentlySpeaking(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyNote = (text: string, noteId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNote(noteId);
    setTimeout(() => setCopiedNote(null), 2500);
  };

  const handleCameraScan = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleCameraFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploadDrawerOpen(true);
    }
  };

  const handleUploadComplete = () => {
    setIsUploadDrawerOpen(false);
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
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
    <div className="bg-[#f9f9ff] text-[#141b2b] antialiased min-h-screen flex flex-col font-sans selection:bg-[#baeada] selection:text-[#0e382f]">
      
      {/* Hidden camera input */}
      <input 
        type="file" 
        ref={cameraInputRef} 
        accept="image/*" 
        capture="environment" 
        onChange={handleCameraFileSelected} 
        className="hidden" 
      />

      {/* =========================================================================
          1. CLEAN LIGHTWEIGHT TOP NAVIGATION
          ========================================================================= */}
      <header className="bg-white/95 sticky top-0 z-50 border-b border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-4 md:px-6 max-w-[1400px] mx-auto min-h-16 py-2.5 gap-3">
          
          {/* Brand Logo + Identity */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-[#baeada] text-[#00221b] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7 text-[#3b665a]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-[#00221b] tracking-tight font-headline">VaidyaVaani</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#3b665a]/10 font-bold text-[#3b665a]">Care</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Simple Health Companion</p>
            </div>
          </Link>

          {/* Language Pill Switcher with Globe Icon */}
          <div className="hidden md:flex items-center bg-[#f1f3ff] border border-slate-200 rounded-full p-1 text-xs font-medium gap-1">
            <span className="flex items-center gap-1 pl-2 pr-1 text-slate-500 text-xs">
              <Globe className="w-4 h-4 text-[#3b665a]" />
            </span>
            {LANGUAGES.slice(0, 4).map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                  currentLanguage.code === lang.code
                    ? 'bg-[#00221b] text-white font-bold shadow-xs'
                    : 'hover:bg-white text-slate-700'
                }`}
              >
                {lang.native} {lang.code === 'hi' ? '(Hindi)' : ''}
              </button>
            ))}
          </div>

          {/* Quick Contact Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp Call to Action */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#0F6848] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Support</span>
            </a>

            {/* Toll-Free Helpline */}
            <a
              href="tel:18002669900"
              className="bg-[#00221b] hover:bg-[#0e382f] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-2xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Toll-Free:</span>
              <span>1800-266-9900</span>
            </a>

            {/* Auth Profile / Get Started */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="hidden lg:inline-flex bg-[#3b665a] hover:bg-[#264e44] text-white text-xs font-bold px-4 py-2 rounded-2xl transition-all shadow-xs"
              >
                Login
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800"
                >
                  <div className="w-6 h-6 rounded-full bg-[#00221b] text-white flex items-center justify-center text-xs">
                    {userDisplayName.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 text-left"
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>Health Vault</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* =========================================================================
          2. SPACIOUS VISUAL HERO SECTION & PICTORIAL ACTION CARDS
          ========================================================================= */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
        
        {/* Clean Minimal Hero Header */}
        <section className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#baeada] text-[#3b665a] font-bold text-xs border border-[#3b665a]/20 shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Free &amp; Private • Secure</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#00221b] tracking-tight font-headline">
            Understand Your Blood Reports &amp; Medicine Clashes with Ease
          </h1>
          <p className="text-sm md:text-base text-slate-600 font-medium">
            Check your lab test reports and prescription conflicts in 1 simple click
          </p>
        </section>

        {/* 2 Large Pictorial Hero Action Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 text-left">
          
          {/* Action Card 1: Blood & Lab Report */}
          <div className="bg-white border-2 border-[#3b665a]/25 hover:border-[#3b665a] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b665a]/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#baeada] flex items-center justify-center text-[#3b665a] shadow-xs group-hover:scale-105 transition-transform text-3xl">
                  🧪
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#3b665a]/15 text-[#3b665a] border border-[#3b665a]/30">
                  Step 1: Blood Test
                </span>
              </div>
              
              <h2 className="text-xl md:text-2xl font-extrabold text-[#00221b] font-headline">
                Blood &amp; Lab Report
              </h2>
              <p className="text-xs font-semibold text-slate-400 mb-3">Blood, Sugar &amp; Lab Report Reader</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Take a photo of your Hemoglobin, Sugar, Thyroid, Kidney, or Urine report to understand it in simple colors.
              </p>

              {/* Visual Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#f1f3ff] text-xs font-bold text-slate-800 border border-slate-200">
                  <span>🩸</span> Hemoglobin (Hb)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#f1f3ff] text-xs font-bold text-slate-800 border border-slate-200">
                  <span>🍬</span> Sugar (Fasting)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#f1f3ff] text-xs font-bold text-slate-800 border border-slate-200">
                  <span>💧</span> Kidney / Creatinine
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setUploadType('reports');
                  setIsUploadDrawerOpen(true);
                }}
                className="w-full bg-[#00221b] hover:bg-[#0e382f] text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>Take Photo / Upload</span>
              </button>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] text-[#065F46] font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-center"
              >
                <MessageCircle className="w-5 h-5 text-[#059669]" />
                <span>Send on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Action Card 2: Doctor Prescription Check */}
          <div className="bg-white border-2 border-[#D97706]/25 hover:border-[#D97706] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FEF3C7]/40 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shadow-xs group-hover:scale-105 transition-transform text-3xl">
                  💊
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                  Step 2: Medicine Check
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold text-[#00221b] font-headline">
                Prescription &amp; Medicine Match
              </h2>
              <p className="text-xs font-semibold text-slate-400 mb-3">Check Medicine Clash &amp; Double Dose</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Are medicines from 2 different doctors conflicting with each other? Snap your prescription slips to check instantly.
              </p>

              {/* Visual Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#f1f3ff] text-xs font-bold text-slate-800 border border-slate-200">
                  <span>🫀</span> Heart Pill
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#f1f3ff] text-xs font-bold text-slate-800 border border-slate-200">
                  <span>⚡</span> Painkiller (Pain)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#f1f3ff] text-xs font-bold text-slate-800 border border-slate-200">
                  <span>🛡️</span> Gas / Acidity
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setUploadType('prescriptions');
                  setIsUploadDrawerOpen(true);
                }}
                className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <FileText className="w-5 h-5" />
                <span>Upload Slip</span>
              </button>
              <button
                type="button"
                onClick={() => handleSpeak("You have uploaded two prescriptions: your heart medication Clopidogrel and your antacid Omeprazole. Note that taking them together reduces the heart medicine's absorption by 45%. Please ask your doctor for safe alternatives like Pantoprazole.", "hero-voice")}
                className="w-full bg-[#f1f3ff] hover:bg-[#e1e8fd] text-[#00221b] font-bold text-sm py-3.5 px-4 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Mic className="w-5 h-5 text-[#3b665a]" />
                <span>Speak Medicine Names</span>
              </button>
            </div>
          </div>

        </section>

        {/* =========================================================================
            3. VISUAL BLOOD & LAB REPORT SECTION (GAUGES & METERS)
            ========================================================================= */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-7 shadow-xs space-y-5 text-left" id="lab-reports">
          
          {/* Patient Bar with Listen + Share */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#baeada] text-[#3b665a] flex items-center justify-center font-bold">
                <User className="w-5 h-5 text-[#3b665a]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#00221b] font-headline">Rohit Kumar</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#e9edff] font-semibold text-slate-500">48 Yrs, Male</span>
                </div>
                <p className="text-xs text-slate-400">Report Date: 04 September • City Diagnostics</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleSpeak("Rohit Kumar, your Hemoglobin is 10.8 g/dL, which is low and requires attention. Your Fasting Blood Sugar is 104 mg/dL, which is borderline high. Your Kidney function and platelets are completely normal and safe.", "full-report")}
                className="flex-1 sm:flex-initial bg-[#f1f3ff] hover:bg-[#e1e8fd] border border-slate-200 text-[#00221b] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#3b665a]" />
                <span>{currentlySpeaking === 'full-report' ? 'Pause Audio' : 'Listen to Full Report'}</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'VaidyaVaani Health Report', text: 'Check out Rohit Kumar’s blood analysis report' });
                  } else {
                    handleCopyNote(window.location.href, 'share-link');
                  }
                }}
                className="bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] text-[#065F46] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#059669]" />
                <span>{copiedNote === 'share-link' ? 'Link Copied!' : 'Share Report'}</span>
              </button>
            </div>
          </div>

          {/* 3 Visual Status Cards with Gauge / Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            
            {/* Card 1: Hemoglobin (Danger / Low) */}
            <div className="bg-white border-2 border-[#ba1a1a]/40 rounded-2xl p-5 flex flex-col justify-between shadow-xs relative">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#ba1a1a] text-white flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    🔴 Low (Attention)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSpeak("Hemoglobin is 10.8 grams per deciliter, which is below the normal range of 13 to 17. Please eat iron-rich food like spinach, beetroot, and pomegranate, and consult your physician.", "hb-audio")}
                    className="text-[#ba1a1a] font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> Listen
                  </button>
                </div>

                <div className="flex items-baseline gap-2 mt-4 mb-1">
                  <span className="text-2xl">🩸</span>
                  <span className="text-sm font-bold text-[#00221b]">Hemoglobin (Hb)</span>
                </div>

                {/* Big Number */}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#ba1a1a]">10.8</span>
                  <span className="text-xs text-slate-400 font-semibold">g/dL</span>
                  <span className="text-xs text-slate-600 ml-auto font-medium">Normal: 13 – 17</span>
                </div>

                {/* Visual Slider Gauge */}
                <div className="mt-3 mb-2">
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#ba1a1a] rounded-full" style={{ width: '48%' }}></div>
                    <div className="h-full bg-transparent border-r-2 border-dashed border-slate-400" style={{ width: '52%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                    <span className="text-[#ba1a1a] font-bold">◄ 10.8 (Low)</span>
                    <span>13.0 (Normal Level)</span>
                  </div>
                </div>

                {/* Simplified Advice Chip */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/20 flex items-center gap-2">
                  <span className="text-xl">🥬🍎</span>
                  <p className="text-xs font-semibold text-slate-800">Eat spinach, beetroot &amp; pomegranate • Inform your doctor</p>
                </div>
              </div>
            </div>

            {/* Card 2: Fasting Sugar (Borderline / Amber) */}
            <div className="bg-white border-2 border-[#D97706]/40 rounded-2xl p-5 flex flex-col justify-between shadow-xs relative">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#D97706] text-white flex items-center gap-1">
                    <span>⚠️</span> ⚠️ Borderline High
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSpeak("Fasting Blood Sugar is 104 milligrams per deciliter, which is slightly above the normal 70 to 99 range. Please reduce refined sugar intake and walk 20 minutes daily.", "sugar-audio")}
                    className="text-[#92400E] font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> Listen
                  </button>
                </div>

                <div className="flex items-baseline gap-2 mt-4 mb-1">
                  <span className="text-2xl">🍬</span>
                  <span className="text-sm font-bold text-[#00221b]">Fasting Blood Sugar</span>
                </div>

                {/* Big Number */}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#B45309]">104</span>
                  <span className="text-xs text-slate-400 font-semibold">mg/dL</span>
                  <span className="text-xs text-slate-600 ml-auto font-medium">Normal: 70 – 99</span>
                </div>

                {/* Visual Slider Gauge */}
                <div className="mt-3 mb-2">
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#059669]" style={{ width: '70%' }}></div>
                    <div className="h-full bg-[#D97706]" style={{ width: '15%' }}></div>
                    <div className="h-full bg-slate-200" style={{ width: '15%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                    <span>70 (Normal)</span>
                    <span className="text-[#B45309] font-bold">104 (Slightly High) ►</span>
                  </div>
                </div>

                {/* Simplified Advice Chip */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center gap-2">
                  <span className="text-xl">🚶‍♂️🍵</span>
                  <p className="text-xs font-semibold text-[#92400E]">Reduce sweets • Walk 20 minutes daily</p>
                </div>
              </div>
            </div>

            {/* Card 3: Kidney & Platelets (Safe / Green) */}
            <div className="bg-white border-2 border-[#059669]/40 rounded-2xl p-5 flex flex-col justify-between shadow-xs relative">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#059669] text-white flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> ✅ 100% Safe (Normal)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSpeak("Serum Creatinine is 0.92 and Platelets are 2.45 Lakh, which are completely in the safe healthy range. Your kidneys are working smoothly.", "kidney-audio")}
                    className="text-[#065F46] font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> Listen
                  </button>
                </div>

                <div className="flex items-baseline gap-2 mt-4 mb-1">
                  <span className="text-2xl">🛡️</span>
                  <span className="text-sm font-bold text-[#00221b]">Kidney &amp; Platelets</span>
                </div>

                {/* Big Number */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#059669]">100% OK</span>
                  <span className="text-xs text-[#065F46] font-bold ml-auto">Healthy Range</span>
                </div>

                {/* Visual Slider Gauge (All Green) */}
                <div className="mt-3 mb-2">
                  <div className="h-2.5 w-full bg-[#059669] rounded-full"></div>
                  <div className="flex justify-between text-[10px] text-[#065F46] mt-1 font-semibold">
                    <span>Creatinine: 0.92</span>
                    <span className="font-bold">Platelets: 2.45 Lakh (Safe)</span>
                  </div>
                </div>

                {/* Simplified Advice Chip */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center gap-2">
                  <span className="text-xl">💧✨</span>
                  <p className="text-xs font-semibold text-[#065F46]">Kidneys working smoothly • No worries at all</p>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* =========================================================================
            4. PICTORIAL PRESCRIPTION & MEDICATION CONFLICT SECTION
            ========================================================================= */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-7 shadow-xs space-y-5 text-left" id="prescription-analysis">
          
          {/* Visual Alert Banner Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-extrabold text-[#00221b] flex items-center gap-2 font-headline">
                <span>Medicine Collision &amp; Clash Check</span>
              </h3>
              <p className="text-xs text-slate-400">Multi-Prescription Collision Check</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#ba1a1a] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>⚠️ 2 Colliding Medicines</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>✅ 7 Safe Medicines</span>
              </span>
            </div>
          </div>

          {/* Collision 1: Visual Clash Card (Heart Pill X Gas Pill) */}
          <div className="border-2 border-[#ba1a1a]/50 bg-white rounded-2xl p-5 md:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#ba1a1a] text-white">
                Danger #1: Drug Action Reduction Risk
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Heart Doctor Slip ⇄ Stomach Doctor Slip</span>
            </div>

            {/* Pill A vs Pill B Pictorial Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#ffdad6]/20 border border-[#ba1a1a]/30">
              {/* Pill A */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                  🫀
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#00221b]">Clopidogrel 75mg</div>
                  <div className="text-xs font-semibold text-[#3b665a]">Heart Pill (Blood Thinner)</div>
                </div>
              </div>

              {/* Big Clash Icon */}
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#ba1a1a] text-white font-extrabold flex items-center justify-center text-lg shadow-md animate-bounce">
                  ✕
                </div>
              </div>

              {/* Pill B */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                  💊
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#00221b]">Omeprazole 20mg</div>
                  <div className="text-xs font-semibold text-[#3b665a]">Gas &amp; Acidity Capsule (Antacid)</div>
                </div>
              </div>
            </div>

            {/* Simple Visual Danger Box + Action */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="md:col-span-2 p-3.5 rounded-xl bg-[#ffdad6]/30 border border-[#ba1a1a]/30 flex items-start gap-3">
                <AlertTriangle className="text-[#ba1a1a] w-6 h-6 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#ba1a1a]">Gas capsule cuts heart medication effectiveness by 45%!</h4>
                  <p className="text-xs text-slate-600 mt-0.5">If taken together, the heart medicine will not thin blood properly.</p>
                </div>
              </div>
              
              <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex flex-col justify-between">
                <div className="text-xs font-bold text-[#065F46]">
                  📝 Ask Doctor: "Please replace Omeprazole with Pantoprazole 40mg"
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyNote('Doctor note: Please replace Omeprazole 20mg with Pantoprazole 40mg due to drug interaction with Clopidogrel 75mg.', 'note-1')}
                  className="mt-2 w-full bg-[#059669] hover:bg-[#065F46] text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedNote === 'note-1' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedNote === 'note-1' ? 'Note Saved!' : 'Save Note for Doctor'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Collision 2: Visual Duplicate Painkillers */}
          <div className="border-2 border-[#ba1a1a]/50 bg-white rounded-2xl p-5 md:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#ba1a1a] text-white">
                Danger #2: Double Painkiller Overdose Risk
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Knee Doctor Slip ⇄ General Clinic Slip</span>
            </div>

            {/* Pill 1 + Pill 2 Pictorial Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#ffdad6]/20 border border-[#ba1a1a]/30">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                  ⚡
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#00221b]">Aceclofenac 100mg</div>
                  <div className="text-xs font-semibold text-[#3b665a]">Knee pain pill</div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#B45309] text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  +
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                  ⚡
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#00221b]">Ibuprofen 400mg</div>
                  <div className="text-xs font-semibold text-[#3b665a]">Headache/fever pill</div>
                </div>
              </div>
            </div>

            {/* Warning + Action */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="md:col-span-2 p-3.5 rounded-xl bg-[#ffdad6]/30 border border-[#ba1a1a]/30 flex items-start gap-3">
                <AlertTriangle className="text-[#ba1a1a] w-6 h-6 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#ba1a1a]">Taking two painkillers together poses severe risk of stomach ulcers, acidity, and internal bleeding!</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Stop Ibuprofen immediately; continue the prescribed knee medicine.</p>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleCopyNote('Doctor note: Stop Ibuprofen 400mg duplicate painkiller; continue Aceclofenac 100mg for knee pain.', 'note-2')}
                  className="w-full bg-[#059669] hover:bg-[#065F46] text-white text-xs font-bold py-3.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  {copiedNote === 'note-2' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedNote === 'note-2' ? 'Note Saved!' : 'Save Note for Doctor'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Clean Visual Safe Pills Row */}
          <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#059669] w-5 h-5" />
                <span className="text-xs md:text-sm font-bold text-[#065F46]">✅ 7 Prescribed Medicines are Completely Safe (Take on regular schedule)</span>
              </div>
              <span className="text-xs text-[#065F46] font-semibold">Take on regular schedule</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
              <div className="bg-white/80 border border-[#A7F3D0] rounded-xl p-2 text-center">
                <span className="text-lg">💊</span>
                <div className="text-[11px] font-bold text-[#00221b] truncate">Telmisartan</div>
                <div className="text-[10px] text-[#059669] font-bold">BP ✔</div>
              </div>
              <div className="bg-white/80 border border-[#A7F3D0] rounded-xl p-2 text-center">
                <span className="text-lg">💊</span>
                <div className="text-[11px] font-bold text-[#00221b] truncate">Metformin</div>
                <div className="text-[10px] text-[#059669] font-bold">Sugar ✔</div>
              </div>
              <div className="bg-white/80 border border-[#A7F3D0] rounded-xl p-2 text-center">
                <span className="text-lg">💊</span>
                <div className="text-[11px] font-bold text-[#00221b] truncate">Calcium D3</div>
                <div className="text-[10px] text-[#059669] font-bold">Bones ✔</div>
              </div>
              <div className="bg-white/80 border border-[#A7F3D0] rounded-xl p-2 text-center">
                <span className="text-lg">💊</span>
                <div className="text-[11px] font-bold text-[#00221b] truncate">Atorvastatin</div>
                <div className="text-[10px] text-[#059669] font-bold">Cholesterol ✔</div>
              </div>
              <div className="bg-white/80 border border-[#A7F3D0] rounded-xl p-2 text-center">
                <span className="text-lg">💊</span>
                <div className="text-[11px] font-bold text-[#00221b] truncate">Vitamin B12</div>
                <div className="text-[10px] text-[#059669] font-bold">Nerves ✔</div>
              </div>
              <div className="bg-white/80 border border-[#A7F3D0] rounded-xl p-2 text-center">
                <span className="text-lg">💊</span>
                <div className="text-[11px] font-bold text-[#00221b] truncate">Thyroxine</div>
                <div className="text-[10px] text-[#059669] font-bold">Thyroid ✔</div>
              </div>
              <div className="bg-white/80 border border-[#A7F3D0] rounded-xl p-2 text-center">
                <span className="text-lg">💊</span>
                <div className="text-[11px] font-bold text-[#00221b] truncate">Pan-40</div>
                <div className="text-[10px] text-[#059669] font-bold">Safe Gas ✔</div>
              </div>
            </div>
          </div>

        </section>

        {/* =========================================================================
            5. 3-STEP SIMPLE GRAPHICAL GUIDE
            ========================================================================= */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 text-center space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-[#00221b] font-headline">Understand Your Reports in 3 Easy Steps</h3>
            <p className="text-xs text-slate-400 mt-0.5">Simple 3-Step Health Check</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#f1f3ff] border border-slate-200 text-center transition-all hover:-translate-y-0.5">
              <div className="w-14 h-14 rounded-2xl bg-[#baeada] text-[#00221b] flex items-center justify-center mx-auto mb-3 text-2xl shadow-xs">
                📸
              </div>
              <h4 className="text-sm font-bold text-[#00221b]">1. Take a Photo</h4>
              <p className="text-xs text-slate-400 font-medium">Snap Photo</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Snap your paper report or doctor prescription, or send via WhatsApp.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[#f1f3ff] border border-slate-200 text-center transition-all hover:-translate-y-0.5">
              <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center mx-auto mb-3 text-2xl shadow-xs">
                🔊
              </div>
              <h4 className="text-sm font-bold text-[#00221b]">2. Listen or Check Colors</h4>
              <p className="text-xs text-slate-400 font-medium">Listen &amp; See Colors</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Red 🔴 danger, Amber 🟡 review, and Green 🟢 safe. Listen with voice playback.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#f1f3ff] border border-slate-200 text-center transition-all hover:-translate-y-0.5">
              <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center mx-auto mb-3 text-2xl shadow-xs">
                🩺
              </div>
              <h4 className="text-sm font-bold text-[#00221b]">3. Consult Doctor</h4>
              <p className="text-xs text-slate-400 font-medium">Ask Doctor</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Show the auto-generated clinical note to your doctor to get safer medicine alternatives.
              </p>
            </div>
          </div>

          {/* Trust Ribbon */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#059669]" /> 256-Bit Secure Encryption
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#3b665a]" /> ABDM Digital Health Standards
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-[#00221b]" /> 100% Private &amp; Protected
            </span>
          </div>
        </section>

      </main>

      {/* =========================================================================
          6. DOCUMENT UPLOAD MODAL DRAWER
          ========================================================================= */}
      <AnimatePresence>
        {isUploadDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-[#293040]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#baeada] text-[#3b665a] flex items-center justify-center text-xl">
                    📸
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#00221b] font-headline">Upload Slip or Lab Report</h3>
                    <p className="text-xs text-slate-400">Upload Prescription or Lab Report</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-[#00221b] mb-2">What would you like to add? (Select Type)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUploadType('prescriptions')}
                      className={`p-3 rounded-xl border-2 text-left font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        uploadType === 'prescriptions'
                          ? 'border-[#00221b] bg-[#f1f3ff] text-[#00221b]'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span className="text-xl">📄</span>
                      <span>Doctor's Prescription</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadType('reports')}
                      className={`p-3 rounded-xl border-2 text-left font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        uploadType === 'reports'
                          ? 'border-[#00221b] bg-[#f1f3ff] text-[#00221b]'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span className="text-xl">🩸</span>
                      <span>Blood / Lab Report</span>
                    </button>
                  </div>
                </div>

                <div className="border-2 border-dashed border-[#3b665a]/50 rounded-2xl p-6 text-center hover:border-[#3b665a] transition-colors cursor-pointer bg-[#ECFDF5]/30">
                  <Camera className="w-12 h-12 text-[#3b665a] mx-auto mb-1" />
                  <div className="text-sm font-bold text-[#00221b] mt-1">Take photo with camera</div>
                  <p className="text-xs text-slate-400 mt-0.5">Or choose photo from device gallery (JPG, PNG, PDF)</p>
                  
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleCameraScan}
                      className="px-4 py-2 bg-[#00221b] hover:bg-[#0e382f] text-white font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      Camera Snap
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Uploader type={uploadType} onUploadComplete={handleUploadComplete} />
                </div>

                <div className="p-3 bg-[#f1f3ff] rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="text-[#059669] w-5 h-5" />
                    <span className="text-xs font-medium text-slate-700">To send directly via WhatsApp:</span>
                  </div>
                  <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#065F46] underline">
                    +91 98765-XXXXX
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadDrawerOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUploadComplete}
                  className="px-5 py-2 bg-[#3b665a] hover:bg-[#00221b] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Start Analysis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          7. CLEAN MINIMAL FOOTER
          ========================================================================= */}
      <footer className="border-t border-slate-200/80 bg-white text-slate-600 py-6 mt-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#3b665a] text-white flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#00221b]">VaidyaVaani</span>
            <span className="text-slate-400">| Simple Health Companion</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
            <a href="tel:18002669900" className="hover:text-[#00221b] transition-colors">Toll-Free: 1800-266-9900</a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00221b] transition-colors">WhatsApp Support</a>
            <a href="#" className="hover:text-[#00221b] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#00221b] transition-colors">Patient Rights</a>
            <span>© 2026 VaidyaVaani Public Health</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
