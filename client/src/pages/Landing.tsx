import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Camera, 
  FileText, 
  Volume2, 
  AlertTriangle, 
  X, 
  LogOut, 
  LayoutDashboard, 
  ArrowRight, 
  Sparkles, 
  Share2
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

  // Voice Synthesizer State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage.speechCode || 'hi-IN';
    utterance.rate = 0.95;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyNote = (text: string, noteId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNote(noteId);
    setTimeout(() => setCopiedNote(null), 2500);
  };

  const handleCameraScan = (type: 'prescriptions' | 'reports') => {
    setUploadType(type);
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
    if (uploadType === 'reports') {
      navigate('/lab-decoder');
    } else {
      navigate('/safety-matrix');
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
    <div className="bg-[#f8fafc] text-slate-900 antialiased min-h-screen flex flex-col font-sans selection:bg-[#c1ecde] selection:text-[#00221b]">
      
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
          1. TOP THIN COMPLIANCE & EMERGENCY STRIP
          ========================================================================= */}
      <div className="bg-[#00221b] text-white text-[11px] py-1.5 px-4 sm:px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap text-emerald-200">
            <span className="flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ABDM Integrated • Ayushman Bharat Digital Health Ready</span>
            </span>
            <span>•</span>
            <span className="text-slate-300">100% Encrypted HIPAA Standard Security</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="tel:108" className="text-rose-300 hover:text-rose-100 font-bold flex items-center gap-1">
              <span>🚨 Emergency: 108</span>
            </a>
            <span>•</span>
            <a href="tel:18002669900" className="text-slate-200 hover:text-white font-mono font-semibold">
              Toll-Free Help Desk: 1800-266-9900
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. MAIN STITCH HEADER & NAVIGATION
          ========================================================================= */}
      <header className="bg-white/95 sticky top-0 z-50 border-b border-slate-200/90 shadow-2xs backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 max-w-[1400px] mx-auto min-h-16 py-2.5 gap-3">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-10 h-10 rounded-2xl bg-[#baeada] text-[#00221b] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-[#3b665a]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-[#00221b] tracking-tight font-headline">VaidyaVaani</span>
                <span className="text-sm font-bold text-[#3b665a]">वैद्यवाणी</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">सरल स्वास्थ्य साथी (Health Companion)</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 text-xs">
            <Link
              to="/"
              className="px-4 py-1.5 rounded-full font-bold bg-white text-[#00221b] shadow-2xs"
            >
              होम (Home)
            </Link>
            <Link
              to="/lab-decoder"
              className="px-4 py-1.5 rounded-full font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-colors"
            >
              Lab Reports (स्मार्ट रिपोर्ट)
            </Link>
            <Link
              to="/safety-matrix"
              className="px-4 py-1.5 rounded-full font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-colors"
            >
              Drug Conflicts (दवा सुरक्षा)
            </Link>
            <a
              href="#doctor-guide"
              className="px-4 py-1.5 rounded-full font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-colors hidden lg:inline-block"
            >
              Consultation Guide (परामर्श)
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            <button
              onClick={() => {
                setUploadType('prescriptions');
                setIsUploadDrawerOpen(true);
              }}
              className="bg-[#00221b] hover:bg-[#0e382f] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>📊 अपनी पर्ची या रिपोर्ट जांचें</span>
            </button>

            {/* Profile Avatar / Auth */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="hidden lg:inline-flex bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
              >
                Login
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-8 h-8 rounded-full bg-[#00221b] text-white flex items-center justify-center font-bold text-xs shadow-xs"
                >
                  {userDisplayName.charAt(0).toUpperCase()}
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 text-left text-xs"
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>Health Vault</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium"
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
          3. HERO SECTION (HER REPORT KA SARAL ARTH)
          ========================================================================= */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
        
        {/* Main Hero Typography */}
        <section className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e8f5e9] text-[#1b5e20] font-bold text-xs border border-[#c8e6c9]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>भारत का पहला निष्पक्ष AI • 100% मुफ़्त एवं सुरक्षित (Free for All Citizens)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.18] font-headline">
            हर रिपोर्ट का सरल अर्थ, हर दवा की सुरक्षा —{' '}
            <span className="text-[#0284c7]">आपकी अपनी भाषा में</span>
          </h1>

          <div className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto space-y-1 font-normal leading-relaxed">
            <p>Translates dense medical reports into everyday Hindi &amp; Indian languages.</p>
            <p>Automatically detects when prescriptions from multiple doctors clash or trigger dangerous duplicate doses.</p>
          </div>

          {/* Language Selector Pills */}
          <div className="pt-2 flex items-center justify-center flex-wrap gap-2 text-xs">
            <span className="text-slate-500 font-semibold">अपनी भाषा चुनें (Choose Language):</span>
            {LANGUAGES.slice(0, 5).map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  currentLanguage.code === lang.code
                    ? 'bg-[#00221b] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                }`}
              >
                {lang.native} {lang.code === 'hi' ? '(Hindi)' : ''}
              </button>
            ))}
          </div>
        </section>

        {/* 2 Large Hero Split Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
          
          {/* Card 1: स्मार्ट लैब रिपोर्ट विश्लेषक */}
          <div className="bg-white rounded-3xl border-2 border-cyan-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-cyan-400 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-800 flex items-center justify-center text-2xl shadow-2xs font-bold">
                  🧪
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold font-mono">
                  100% निष्पक्ष (Biomarker Engine)
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 font-headline">
                  स्मार्ट लैब रिपोर्ट विश्लेषक
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Sugar (HbA1c), CBC, Lipid व KFT की जटिल मेडिकल रिपोर्ट को रंगीन संकेतकों और सरल हिंदी ऑडियो व भाषा में समझें।
                </p>
              </div>

              {/* Segmented Range Preview Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-700 font-mono">HbA1c 3-महीने का औसत शुगर:</span>
                  <span className="text-rose-700 font-black font-mono">8.2% अनियंत्रित (High) 🔴</span>
                </div>
                
                <div className="h-3 rounded-full bg-slate-200 overflow-hidden flex relative">
                  <div className="w-[30%] bg-[#67e8f9]"></div>
                  <div className="w-[35%] bg-amber-300"></div>
                  <div className="w-[35%] bg-rose-400"></div>
                  <div 
                    className="absolute top-0 bottom-0 w-3 h-3 bg-rose-700 border border-white rounded-full -translate-x-1/2"
                    style={{ left: '88%' }}
                  />
                </div>

                <p className="text-[11px] text-slate-500 pt-1">
                  💡 <strong>सरल अर्थ:</strong> आपका शुगर अनियंत्रित है। तुरंत डॉक्टर से मिलकर दवा एडजस्ट करवाएं।
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setUploadType('reports');
                  setIsUploadDrawerOpen(true);
                }}
                className="w-full bg-[#00221b] hover:bg-[#0e382f] text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>📷 लैब रिपोर्ट अपलोड करें (PDF/फोटो)</span>
              </button>

              <Link
                to="/lab-decoder"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors text-center"
              >
                <span>📊 रियल सैंपल रिपोर्ट देखें (Live Demo) →</span>
              </Link>
            </div>
          </div>

          {/* Card 2: मल्टी-प्रिस्क्रिप्शन दवा रडार */}
          <div className="bg-white rounded-3xl border-2 border-rose-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-rose-400 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center text-2xl shadow-2xs font-bold">
                  💊
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold font-mono">
                  दवा सुरक्षा चेतावनी (Safety Radar)
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 font-headline">
                  मल्टी-प्रिस्क्रिप्शन दवा रडार
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  अगर आप 2 अलग डॉक्टरों की पर्चियां खा रहे हैं, तो जांचिए कि कहीं एक ही साल्ट (एसिटामिनोफेन या दर्द निवारक) का खतरनाक ओवरडोज़ तो नहीं हो रहा!
                </p>
              </div>

              {/* Duplicate Overdose Preview Box */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2 text-xs">
                <div className="text-rose-800 font-bold flex items-center gap-1 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>संभावित टकराव और ओवरडोज़ (Duplicate Dose Found)</span>
                </div>
                
                <div className="space-y-1 text-[11px] text-slate-700">
                  <div className="flex justify-between">
                    <span>डॉ. शर्मा (कार्डियोलॉजी): Crocin 650mg</span>
                    <strong className="font-mono">Paracetamol</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>डॉ. वर्मा (ऑर्थोपेडिक्स): Combiflam</span>
                    <strong className="font-mono">Paracetamol + Ibuprofen</strong>
                  </div>
                </div>

                <p className="text-[11px] text-rose-700 font-semibold pt-1">
                  ⚠️ <strong>चेतावनी:</strong> दोनों दवाओं में Paracetamol का दोहराव लिवर पर भारी नुकसान कर सकता है।
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setUploadType('prescriptions');
                  setIsUploadDrawerOpen(true);
                }}
                className="w-full bg-[#00221b] hover:bg-[#0e382f] text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>📋 डॉक्टर का पर्चा अपलोड करें (Upload Slips)</span>
              </button>

              <Link
                to="/safety-matrix"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors text-center"
              >
                <span>⚠️ लाइव दवा टकराव सिमुलेटर देखें →</span>
              </Link>
            </div>
          </div>

        </section>

        {/* =========================================================================
            4. TRUST METRIC STRIP (4 PILLARS)
            ========================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🛡️</span>
              <span>100% सुरक्षित डेटा स्टोरेज (ABHA &amp; ABDM)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔊</span>
              <span>बुजुर्गों के लिए विशेष वॉइस सुविधा</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🏥</span>
              <span>एम्स व पीजीआई चिकित्सीय गाइडलाइन्स</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">👥</span>
              <span>1,50,000+ भारतीय परिवारों का भरोसा</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. CLINICAL HAZARD BREAKDOWN (REAL CASE-STUDY)
            ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6 text-left">
          
          <div className="max-w-3xl space-y-1.5">
            <span className="text-xs font-mono uppercase font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              वास्तविक मामलों की पड़ताल • Real Medical Conflict Case-Study
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-headline pt-1">
              दो अलग डॉक्टरों की दवाएं कभी-कभी अनजाने में नुकसान पहुँचा सकती हैं
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              भारत में 65% बुजुर्ग एक से अधिक डॉक्टरों (General Physician, Orthopedic, Cardiologist) से एक साथ इलाज करवाते हैं। बिना जानकारी के दवाइयों का आपस में टकराव जानलेवा हो सकता है।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Box: Unaware Patient */}
            <div className="p-6 rounded-2xl bg-rose-50/40 border-2 border-rose-200 space-y-4">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">✕</span>
                <span>लापरवाह दवा सेवन: परिवार की अनजानी चूक (Without VaidyaVaani)</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                रमेश जी (58 वर्ष, पटना) घुटने के दर्द का इलाज ऑर्थोपेडिक डॉक्टर से करवा रहे थे, जिन्होंने <strong>Combiflam (दिन में 2 बार)</strong> दी। उसी दौरान दिल के डॉक्टर ने <strong>Crocin 650 दिन में 2 बार</strong> लिखी थी।
              </p>

              <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span>पर्ची 1: Crocin 650 (दिन में 2 बार)</span>
                  <strong className="text-rose-700">1300 mg Paracetamol</strong>
                </div>
                <div className="flex justify-between">
                  <span>पर्ची 2: Combiflam (दिन में 2 बार)</span>
                  <strong className="text-rose-700">+ 650 mg Paracetamol</strong>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-rose-900 text-sm">
                  <span>कुल दैनिक खुराक (Total Ingestion)</span>
                  <span>1950 mg/दिन (घातक मात्रा)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-100/70 border border-rose-300 text-xs text-rose-900 font-medium">
                ⚠️ <strong>परिणाम:</strong> अत्यधिक Paracetamol के कारण लिवर एनजाइम 4 गुना बढ़ गए और पेट में अल्सर की शुरुआत हुई।
              </div>
            </div>

            {/* Right Box: With VaidyaVaani */}
            <div className="p-6 rounded-2xl bg-emerald-50/40 border-2 border-emerald-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">✓</span>
                  <span>वैद्यवाणी सुरक्षा रडार के साथ (With VaidyaVaani Safety Radar)</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  जैसे ही दोनों पर्चियों की फोटो वैद्यवाणी पर अपलोड की, सिस्टम ने तुरंत अलर्ट जारी किया कि दोनों दवाओं में <strong>Paracetamol का दोहराव</strong> है।
                </p>

                <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">प्रिस्क्रिप्शन टकराव: Crocin &amp; Combiflam</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold font-mono">
                      Overdose Risk Alert
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    "सचेत रहें: दोनों पर्चियों में बुखार व दर्द की दवा एक ही है। कृपया अपने डॉक्टर से बात करके किसी एक दवाई को बंद करें या खुराक बदलें!"
                  </p>
                  <button
                    onClick={() => handleCopyNote("डॉक्टर हेतु नोट: मरीज क्रोसिन 650 और कॉम्बिफ्लाम दोनों ले रहे हैं, जिससे पैरासिटामोल ओवरडोज हो रहा है। कृपया खुराक संशोधन करें।", "case-study-note")}
                    className="mt-1 text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{copiedNote === 'case-study-note' ? '✓ नोट कॉपी हुआ' : 'डॉक्टर को दिखाने हेतु पर्चा तैयार करें 📋'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-900 font-medium">
                ✓ <strong>नतीजा:</strong> डॉक्टर ने तुरंत दवा बदलकर एक सुरक्षित दर्द निवारक और एंटासिड दिया।
              </div>
            </div>

          </div>

        </section>

        {/* =========================================================================
            6. SIMPLIFIED LAB INTELLIGENCE SECTION
            ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                बायोमार्कर मैट्रिक्स • SMART LAB INTELLIGENCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-headline pt-1">
                कठिन लैब रिपोर्ट अब कोई पहेली नहीं
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Lactate Dehydrogenase, Serum Creatinine, SGOT जैसे जटिल शब्दों को डरने के बजाय समझें।
              </p>
            </div>

            <Link
              to="/lab-decoder"
              className="px-4 py-2 rounded-xl bg-[#00221b] hover:bg-[#0e382f] text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-center transition-colors shadow-xs"
            >
              <span>📊 सैंपल रिपोर्ट खोलें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Mockup Box */}
            <div className="lg:col-span-7 bg-slate-50/70 p-6 rounded-2xl border border-slate-200 space-y-5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 font-headline">किडनी व ब्लड रिपोर्ट (KFT + Lipid)</span>
                <span className="text-emerald-700 font-bold font-mono">✓ Verified Markers</span>
              </div>

              {/* Item 1 */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">सीरम क्रिएटिनिन (Serum Creatinine)</span>
                    <span className="text-[10px] text-slate-400 block font-mono">किडनी फंक्शन टेस्ट</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-cyan-800 font-mono">1.10</span>
                    <span className="text-[10px] text-slate-500 font-mono"> mg/dL</span>
                    <span className="block text-[10px] font-bold text-cyan-700">🟢 सामान्य दायरा</span>
                  </div>
                </div>

                <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden flex relative">
                  <div className="w-[70%] bg-[#67e8f9]"></div>
                  <div className="w-[30%] bg-rose-400"></div>
                  <div 
                    className="absolute top-0 bottom-0 w-2.5 h-2.5 bg-cyan-800 border border-white rounded-full -translate-x-1/2"
                    style={{ left: '55%' }}
                  />
                </div>

                <p className="text-[11px] text-slate-600 pt-1">
                  💡 <strong>हमारा सारांश:</strong> "आपके गुर्दे बिल्कुल सामान्य तरीके से काम कर रहे हैं। यूरिया और अपशिष्ट ठीक से बाहर निकल रहा है।"
                </p>
              </div>

              {/* Item 2 */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">फास्टिंग ब्लड शुगर (Fasting Glucose)</span>
                    <span className="text-[10px] text-slate-400 block font-mono">सुबह खाली पेट जांच</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-800 font-mono">116</span>
                    <span className="text-[10px] text-slate-500 font-mono"> mg/dL</span>
                    <span className="block text-[10px] font-bold text-amber-700">🟡 थोड़ा अधिक (Pre-diabetic)</span>
                  </div>
                </div>

                <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden flex relative">
                  <div className="w-[45%] bg-[#67e8f9]"></div>
                  <div className="w-[35%] bg-amber-300"></div>
                  <div className="w-[20%] bg-rose-400"></div>
                  <div 
                    className="absolute top-0 bottom-0 w-2.5 h-2.5 bg-amber-700 border border-white rounded-full -translate-x-1/2"
                    style={{ left: '60%' }}
                  />
                </div>

                <p className="text-[11px] text-slate-600 pt-1">
                  💡 <strong>हमारा सारांश:</strong> "हल्का बढ़ा हुआ। मीठा तुरंत नियंत्रित करें। घबराने की बात नहीं है।"
                </p>
              </div>

              {/* Audio Player Bar */}
              <div className="p-3.5 rounded-xl bg-[#00221b] text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-300" />
                  <span>सुनें: पूरी रिपोर्ट का सरल हिंदी विश्लेषण (2 मिनट)</span>
                </div>
                <button
                  onClick={() => handleSpeak("आपकी सीरम क्रिएटिनिन 1.10 पूरी तरह सामान्य है। फास्टिंग शुगर 116 थोड़ा बढ़ा हुआ है।")}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  ▶ सुनें
                </button>
              </div>
            </div>

            {/* Right Doctor Questions & Timeline */}
            <div className="lg:col-span-5 space-y-5 text-xs">
              
              {/* Doctor Questions */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-bold text-slate-900 font-headline text-sm flex items-center gap-1.5">
                  <span>🩺</span>
                  <span>डॉक्टर से क्या पूछें?</span>
                </h4>

                <div className="space-y-2 text-slate-700">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    1. "क्रिएटिनिन 1.10 स्तर क्या मेरे ब्लड प्रेशर की दवाओं के लिए सुरक्षित है?"
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    2. "फास्टिंग शुगर 116 होने पर क्या मुझे कोई नई दवा शुरू करनी होगी?"
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    3. "अगला लैब टेस्ट मुझे कितने महीने बाद कराना चाहिए?"
                  </div>
                </div>

                <button
                  onClick={() => handleCopyNote("डॉक्टर से सवाल: 1. क्रिएटिनिन 1.10 बीपी दवाओं के लिए सुरक्षित है? 2. फास्टिंग शुगर 116 पर क्या करें? 3. अगला टेस्ट कब कराएं?", "doctor-questions")}
                  className="w-full py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#0F6848] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedNote === 'doctor-questions' ? '✓ सवाल कॉपी हुए' : '📋 सवाल डॉक्टर को भेजें (WhatsApp)'}</span>
                </button>
              </div>

              {/* Timeline */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <h4 className="font-bold text-slate-900 font-headline text-sm">रिपोर्ट 3 महीनों का रुझान</h4>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">12 JAN 2024</span>
                    <strong className="text-slate-900">110 mg/dL (नियंत्रण में)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">18 JUL 2024</span>
                    <strong className="text-amber-800">112 mg/dL (हल्का बढ़ा)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">14 OCT 2024 (Current)</span>
                    <strong className="text-amber-800 font-bold">116 mg/dL (अनुशंसा)</strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic pt-1">
                  * आपका फास्टिंग शुगर पिछले 9 महीनों से लगातार 110-116 के बीच बढ़ रहा है।
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* =========================================================================
            7. MULTI-PRESCRIPTION CROSS-MATCHING 4 PILLARS
            ========================================================================= */}
        <section className="space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              मल्टीपल प्रिस्क्रिप्शन रडार • MULTI-PRESCRIPTION RADAR
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-headline pt-1">
              विभिन्न पर्चियों का 'स्मार्ट दवा मिलान'
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              जब मरीज सरकारी अस्पताल, प्राइवेट क्लिनिक और लोकल मेडिकल स्टोर से दवाएं ले रहे होते हैं, तब वैद्यवाणी आपका कवच बनती है।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left text-xs">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center text-xl mb-3">
                  ⏰
                </div>
                <h4 className="font-bold text-slate-900 text-sm">खास समय सारणी</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  सुबह 8 बजे कौन सी लें, दोपहर 1 बजे कौन सी। दवाइयों के सही समय और खाने के साथ/खाली पेट के सटीक नियम।
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-emerald-800 font-semibold text-[11px]">
                ✓ खुराक समय निर्धारण नियम
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl mb-3">
                  ⚠️
                </div>
                <h4 className="font-bold text-slate-900 text-sm">डबल डोज बचाव</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  दो अलग डॉक्टरों द्वारा एक ही सॉल्ट (जैसे Paracetamol या Pantoprazole) लिखे जाने पर तुरंत अलर्ट।
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-emerald-800 font-semibold text-[11px]">
                ✓ ओवरडोज़ सुरक्षा कवच
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center text-xl mb-3">
                  📅
                </div>
                <h4 className="font-bold text-slate-900 text-sm">24-घंटे सुरक्षा समय सारणी</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  हार्ट की दवा, बीपी की दवा और पेनकिलर के बीच सही समय अंतराल का सटीक शेड्यूलर।
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-emerald-800 font-semibold text-[11px]">
                ✓ दैनिक शेड्यूलर प्लान
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl mb-3">
                  📋
                </div>
                <h4 className="font-bold text-slate-900 text-sm">डॉक्टर हेतु समन्वय पर्ची</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  डॉक्टर से मिलकर पर्चा बदलने के लिए क्लिनिकल समरी तैयार करना ताकि डॉक्टर को पूरी बात एक नजर में समझ आ जाए।
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-emerald-800 font-semibold text-[11px]">
                ✓ क्लिनिकल समरी रिपोर्ट
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            8. 3-STEP HOW IT WORKS
            ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8 text-center">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase font-bold text-slate-400">
              सरल 3 चरण • THREE SIMPLE STEPS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-headline pt-1">
              स्मार्टफोन से बस फोटो खींचें, बाकी काम हमारा
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              किसी कठिन तकनीकी ज्ञान की जरूरत नहीं। बुजुर्ग और ग्रामीण परिवार भी आसानी से उपयोग कर सकते हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#00221b] text-white flex items-center justify-center text-xs font-black">
                1
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#baeada] text-[#00221b] flex items-center justify-center text-2xl shadow-2xs">
                📷
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-headline">फोटो खींचें या PDF अपलोड करें</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                घर बैठे किसी भी पर्चे, खून जांच रिपोर्ट या अल्ट्रासाउंड की साफ फोटो खींचें।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#00221b] text-white flex items-center justify-center text-xs font-black">
                2
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-2xl shadow-2xs">
                ⚙️
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-headline">सिस्टम करेगा विस्तृत जाँच</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI मॉडल सुरक्षित डेटाबेस से दवाई का नाम, खुराक, और टेस्ट पैरामीटर्स को जांचकर सरल भाषा में रिपोर्ट तैयार करता है।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#00221b] text-white flex items-center justify-center text-xs font-black">
                3
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shadow-2xs">
                💡
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-headline">समझकर सही कदम उठाएं</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                अपनी मातृभाषा में रिपोर्ट का सारांश सुनें, अगर कोई दवा टकरा रही हो तो डॉक्टर से बात करें।
              </p>
            </div>

          </div>
        </section>

        {/* =========================================================================
            9. REAL PATIENT TESTIMONIALS
            ========================================================================= */}
        <section className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase font-bold text-slate-400">
                सच्चे अनुभव • REAL PATIENT STORIES
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-headline">
                भारत के परिवारों ने क्या कहा
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500 font-mono text-xs font-bold">
              <span>⭐⭐⭐⭐⭐</span>
              <span className="text-slate-700">4.9/5 (1,200+ Verified Family Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-amber-500">⭐⭐⭐⭐⭐</div>
                <p className="text-slate-700 leading-relaxed italic">
                  "वैद्यवाणी की बदौलत मुझे पता चला कि ऑर्थोपेडिक डॉक्टर और फिजिशियन दोनों ने मुझे अलग-अलग नाम से पैरासिटामोल लिख दी थी। वैद्यवाणी ने मुझे लिवर डैमेज से बचा लिया।"
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-[10px]">
                  RK
                </div>
                <div>
                  <strong className="text-slate-900 block">रमेश कुमार (58 वर्ष)</strong>
                  <span className="text-[10px] text-slate-400">व्यवसायी, पटना (बिहार)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-amber-500">⭐⭐⭐⭐⭐</div>
                <p className="text-slate-700 leading-relaxed italic">
                  "मेरी माताजी पढ़ी-लिखी नहीं हैं। उनकी रिपोर्ट देखकर हम परेशान थे। वैद्यवाणी ने बहुत ही सरल भाषा में समझाया कि रिपोर्ट ठीक है। ऑडियो सुनकर माताजी बहुत खुश हुईं।"
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                  SS
                </div>
                <div>
                  <strong className="text-slate-900 block">सुनीता शर्मा</strong>
                  <span className="text-[10px] text-slate-400">गृहिणी, जयपुर (राजस्थान)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-amber-500">⭐⭐⭐⭐⭐</div>
                <p className="text-slate-700 leading-relaxed italic">
                  "As a physician in UP/Bihar, I recommend this for my patients so they can organize multiple prescriptions from different specialists. It reduces accidental double-dosing tremendously."
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-[10px]">
                  AA
                </div>
                <div>
                  <strong className="text-slate-900 block">Dr. Abhay Awasthi</strong>
                  <span className="text-[10px] text-slate-400">Consultant Physician, Lucknow</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            10. BOTTOM HIGH-IMPACT CTA BANNER
            ========================================================================= */}
        <section className="bg-gradient-to-br from-[#00221b] via-[#002f26] to-[#001813] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl border border-emerald-900/50">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
              100% निःशुल्क एवं सुरक्षित • Free for All Citizens
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-headline tracking-tight text-white pt-2">
              अपनी या परिवार की रिपोर्ट अभी जांचें — कोई डर नहीं, केवल स्पष्ट ज्ञान
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
              Take control of your family's prescription safety. Upload a photo or document right from your phone and receive a vernacular audio briefing in seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => {
                setUploadType('reports');
                setIsUploadDrawerOpen(true);
              }}
              className="px-6 py-3.5 rounded-xl bg-[#67e8f9] hover:bg-[#38bdf8] text-[#00221b] font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#00221b]" />
              <span>📊 लैब रिपोर्ट अपलोड करें</span>
            </button>

            <button
              onClick={() => {
                setUploadType('prescriptions');
                setIsUploadDrawerOpen(true);
              }}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>📋 दवा पर्ची (Prescription) जांचें</span>
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-emerald-200/70 font-mono">
            <span>✓ भारतीय मानक</span>
            <span>•</span>
            <span>✓ 100% निजता की गारंटी</span>
            <span>•</span>
            <span>✓ 24x7 तत्काल परिणाम</span>
          </div>
        </section>

      </main>

      {/* =========================================================================
          11. CLEAN COMPREHENSIVE FOOTER
          ========================================================================= */}
      <footer className="border-t border-slate-200/80 bg-white text-slate-500 py-6 mt-12 text-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#00221b]">VaidyaVaani वैद्यवाणी</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              © 2026 VaidyaVaani Healthcare Intelligence. Not a replacement for emergency clinical diagnosis. Emergency helpline: 108 / 112
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium">
            <a href="tel:18002669900" className="hover:text-slate-900">टोल फ्री सहायता (Help Desk)</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900">Medical Accuracy Disclaimer</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900">Doctor Consultation Protocol</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900">Privacy &amp; HIPAA Compliance</a>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          12. UPLOAD MODAL DRAWER
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
                    <h3 className="text-base font-bold text-[#00221b] font-headline">
                      {uploadType === 'reports' ? 'Upload Blood / Lab Report' : 'Upload Doctor Prescription Slip'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {uploadType === 'reports' ? 'रक्त या पैथोलॉजी जांच रिपोर्ट' : 'डॉक्टर की पर्ची अपलोड करें'}
                    </p>
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
                  <label className="block text-xs font-bold text-[#00221b] mb-2">दस्तावेज़ का प्रकार चुनें (Select Type)</label>
                  <div className="grid grid-cols-2 gap-2">
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
                  </div>
                </div>

                <div className="border-2 border-dashed border-[#3b665a]/50 rounded-2xl p-6 text-center hover:border-[#3b665a] transition-colors cursor-pointer bg-[#ECFDF5]/30">
                  <Camera className="w-12 h-12 text-[#3b665a] mx-auto mb-1" />
                  <div className="text-sm font-bold text-[#00221b] mt-1">Take photo with camera</div>
                  <p className="text-xs text-slate-400 mt-0.5">Or choose photo from device gallery (JPG, PNG, PDF)</p>
                  
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCameraScan(uploadType)}
                      className="px-4 py-2 bg-[#00221b] hover:bg-[#0e382f] text-white font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      Camera Snap
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Uploader type={uploadType} onUploadComplete={handleUploadComplete} />
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

    </div>
  );
};

export default Landing;
