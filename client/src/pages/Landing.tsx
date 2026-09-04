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

  const isHi = currentLanguage.code === 'hi' || currentLanguage.code === 'bn' || currentLanguage.code === 'ta' || currentLanguage.code === 'te' || currentLanguage.code === 'mr' || currentLanguage.code === 'gu';
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
          1. TOP THIN COMPLIANCE & EMERGENCY STRIP (BILINGUAL)
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
              <span>🚨 Emergency / आपातकालीन: 108</span>
            </a>
            <span>•</span>
            <a href="tel:18002669900" className="text-slate-200 hover:text-white font-mono font-semibold">
              Toll-Free / टोल-फ्री: 1800-266-9900
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. MAIN HEADER & NAVIGATION (BILINGUAL)
          ========================================================================= */}
      <header className="bg-white/95 sticky top-0 z-50 border-b border-slate-200/90 shadow-2xs backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 max-w-[1400px] mx-auto min-h-16 py-2.5 gap-3">
          
          {/* Brand Original Logo */}
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <img
              src="/logo/complete%20logo.png"
              alt="VaidyaVaani वैद्यवाणी"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 text-xs">
            <Link
              to="/"
              className="px-4 py-1.5 rounded-full font-bold bg-white text-[#00221b] shadow-2xs"
            >
              {isHi ? "होम (Home)" : "Home (होम)"}
            </Link>
            <Link
              to="/lab-decoder"
              className="px-4 py-1.5 rounded-full font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-colors"
            >
              {isHi ? "Lab Reports (स्मार्ट रिपोर्ट)" : "Lab Reports (स्मार्ट रिपोर्ट)"}
            </Link>
            <Link
              to="/safety-matrix"
              className="px-4 py-1.5 rounded-full font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-colors"
            >
              {isHi ? "Drug Conflicts (दवा सुरक्षा)" : "Drug Conflicts (दवा सुरक्षा)"}
            </Link>
            <a
              href="#doctor-guide"
              className="px-4 py-1.5 rounded-full font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-colors hidden lg:inline-block"
            >
              {isHi ? "Consultation Guide (परामर्श)" : "Consultation Guide (परामर्श)"}
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
              <span>{isHi ? "📊 अपनी पर्ची या रिपोर्ट जांचें" : "📊 Check Prescription or Lab Report"}</span>
            </button>

            {/* Profile Avatar / Auth */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="hidden lg:inline-flex bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
              >
                {isHi ? "लॉगिन / Login" : "Login"}
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-8 h-8 rounded-full bg-[#00221b] text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer"
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
                        <span>Health Vault (हेल्थ वॉल्ट)</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out (लॉग आउट)</span>
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
          3. HERO SECTION (BILINGUAL TYPOGRAPHY & DUAL CORE CARDS)
          ========================================================================= */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
        
        {/* Main Hero Typography */}
        <section className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e8f5e9] text-[#1b5e20] font-bold text-xs border border-[#c8e6c9]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {isHi 
                ? "भारत का पहला निष्पक्ष AI • 100% मुफ़्त एवं सुरक्षित (Free for All Citizens)" 
                : "India's First Unbiased Health AI • 100% Free & Secure for All Citizens"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.18] font-headline">
            {isHi ? (
              <>
                हर रिपोर्ट का सरल अर्थ, हर दवा की सुरक्षा —{' '}
                <span className="text-[#0284c7]">आपकी अपनी भाषा में</span>
              </>
            ) : (
              <>
                Understand Every Lab Report, Stay Safe from Every Drug Clash —{' '}
                <span className="text-[#0284c7]">In Your Language</span>
              </>
            )}
          </h1>

          <div className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto space-y-1 font-normal leading-relaxed">
            <p>
              {isHi 
                ? "जटिल मेडिकल रिपोर्ट को रोजमर्रा की सरल भाषा में समझें। अगर दो डॉक्टरों की दवाएं आपस में टकरा रही हों या ओवरडोज हो रही हों, तो तुरंत अलर्ट पाएं।"
                : "Translates dense medical diagnostics into clear, everyday language. Automatically flags duplicate medicines, overdose hazards, and interactions across multiple prescriptions."}
            </p>
          </div>

          {/* Language Selector Pills */}
          <div className="pt-2 flex items-center justify-center flex-wrap gap-2 text-xs">
            <span className="text-slate-500 font-semibold">
              {isHi ? "अपनी भाषा चुनें (Choose Language):" : "Choose Language (अपनी भाषा चुनें):"}
            </span>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  currentLanguage.code === lang.code
                    ? 'bg-[#00221b] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                }`}
              >
                {lang.native} {lang.code === 'hi' ? '(Hindi)' : lang.code === 'en' ? '(English)' : ''}
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
                  {isHi ? "100% निष्पक्ष (Biomarker Engine)" : "100% Unbiased (Biomarker Engine)"}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 font-headline">
                  {isHi ? "स्मार्ट लैब रिपोर्ट विश्लेषक" : "Smart Lab Report Analyzer"}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {isHi 
                    ? "Sugar (HbA1c), CBC, Lipid व KFT की जटिल मेडिकल रिपोर्ट को रंगीन संकेतकों और सरल हिंदी ऑडियो व भाषा में समझें।"
                    : "Understand complex Sugar (HbA1c), CBC, Lipid & KFT diagnostics with color-coded gauges and plain vernacular audio."}
                </p>
              </div>

              {/* Segmented Range Preview Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-700 font-mono">
                    {isHi ? "HbA1c 3-महीने का औसत शुगर:" : "HbA1c 3-Month Average Glucose:"}
                  </span>
                  <span className="text-rose-700 font-black font-mono">
                    {isHi ? "8.2% अनियंत्रित (High) 🔴" : "8.2% Uncontrolled (High) 🔴"}
                  </span>
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
                  💡 <strong>{isHi ? "सरल अर्थ:" : "Simple Summary:"}</strong>{' '}
                  {isHi 
                    ? "आपका शुगर अनियंत्रित है। तुरंत डॉक्टर से मिलकर दवा एडजस्ट करवाएं।"
                    : "Your glucose level is uncontrolled. Consult your physician promptly for dosage adjustments."}
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
                <span>{isHi ? "📷 लैब रिपोर्ट अपलोड करें (PDF/फोटो)" : "📷 Upload Lab Report (PDF/Photo)"}</span>
              </button>

              <Link
                to="/lab-decoder"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors text-center"
              >
                <span>{isHi ? "📊 रियल सैंपल रिपोर्ट देखें (Live Demo) →" : "📊 View Real Sample Report (Live Demo) →"}</span>
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
                  {isHi ? "दवा सुरक्षा चेतावनी (Safety Radar)" : "Drug Conflict Radar (Safety Radar)"}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 font-headline">
                  {isHi ? "मल्टी-प्रिस्क्रिप्शन दवा रडार" : "Multi-Prescription Drug Radar"}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {isHi 
                    ? "अगर आप 2 अलग डॉक्टरों की पर्चियां खा रहे हैं, तो जांचिए कि कहीं एक ही साल्ट (एसिटामिनोफेन या दर्द निवारक) का खतरनाक ओवरडोज़ तो नहीं हो रहा!"
                    : "If you take medicines from 2 different specialists, check if duplicate active salts (like Paracetamol or NSAIDs) are triggering dangerous accidental overdoses!"}
                </p>
              </div>

              {/* Duplicate Overdose Preview Box */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2 text-xs">
                <div className="text-rose-800 font-bold flex items-center gap-1 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isHi ? "संभावित टकराव और ओवरडोज़ (Duplicate Dose Found)" : "Potential Conflict & Overdose (Duplicate Dose Found)"}</span>
                </div>
                
                <div className="space-y-1 text-[11px] text-slate-700">
                  <div className="flex justify-between">
                    <span>{isHi ? "डॉ. शर्मा (कार्डियोलॉजी): Crocin 650mg" : "Dr. Sharma (Cardio): Crocin 650mg"}</span>
                    <strong className="font-mono">Paracetamol</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{isHi ? "डॉ. वर्मा (ऑर्थोपेडिक्स): Combiflam" : "Dr. Verma (Ortho): Combiflam"}</span>
                    <strong className="font-mono">Paracetamol + Ibuprofen</strong>
                  </div>
                </div>

                <p className="text-[11px] text-rose-700 font-semibold pt-1">
                  ⚠️ <strong>{isHi ? "चेतावनी:" : "Warning:"}</strong>{' '}
                  {isHi 
                    ? "दोनों दवाओं में Paracetamol का दोहराव लिवर पर भारी नुकसान कर सकता है।"
                    : "Duplicate Paracetamol across both slips poses severe acute liver injury risk."}
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
                <span>{isHi ? "📋 डॉक्टर का पर्चा अपलोड करें (Upload Slips)" : "📋 Upload Doctor Prescription Slips"}</span>
              </button>

              <Link
                to="/safety-matrix"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors text-center"
              >
                <span>{isHi ? "⚠️ लाइव दवा टकराव सिमुलेटर देखें →" : "⚠️ Open Drug Conflicts Simulator →"}</span>
              </Link>
            </div>
          </div>

        </section>

        {/* =========================================================================
            4. TRUST METRIC STRIP (4 PILLARS - BILINGUAL)
            ========================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🛡️</span>
              <span>{isHi ? "100% सुरक्षित डेटा स्टोरेज (ABHA & ABDM)" : "100% Secure Isolated Storage (ABHA & ABDM)"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔊</span>
              <span>{isHi ? "बुजुर्गों के लिए विशेष वॉइस सुविधा" : "Voice Playback for Elders & Caregivers"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🏥</span>
              <span>{isHi ? "एम्स व पीजीआई चिकित्सीय गाइडलाइन्स" : "AIIMS & PGI Clinical Guidelines"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">👥</span>
              <span>{isHi ? "1,50,000+ भारतीय परिवारों का भरोसा" : "Trusted by 150,000+ Indian Families"}</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. CLINICAL HAZARD BREAKDOWN (REAL CASE-STUDY - BILINGUAL)
            ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6 text-left">
          
          <div className="max-w-3xl space-y-1.5">
            <span className="text-xs font-mono uppercase font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              {isHi ? "वास्तविक मामलों की पड़ताल • Real Medical Conflict Case-Study" : "Real Medical Conflict Case-Study • वास्तविक मामलों की पड़ताल"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-headline pt-1">
              {isHi 
                ? "दो अलग डॉक्टरों की दवाएं कभी-कभी अनजाने में नुकसान पहुँचा सकती हैं" 
                : "Prescriptions from Two Different Doctors Can Silently Harm Your Health"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHi 
                ? "भारत में 65% बुजुर्ग एक से अधिक डॉक्टरों (General Physician, Orthopedic, Cardiologist) से एक साथ इलाज करवाते हैं। बिना जानकारी के दवाइयों का आपस में टकराव जानलेवा हो सकता है।"
                : "Over 65% of seniors in India consult multiple specialists concurrently. Without cross-auditing, uncoordinated drug combinations can cause severe liver or gastrointestinal injury."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Box: Unaware Patient */}
            <div className="p-6 rounded-2xl bg-rose-50/40 border-2 border-rose-200 space-y-4">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">✕</span>
                <span>
                  {isHi 
                    ? "लापरवाह दवा सेवन: परिवार की अनजानी चूक (Without VaidyaVaani)" 
                    : "Uncoordinated Ingestion: An Accidental Oversight (Without VaidyaVaani)"}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {isHi 
                  ? "रमेश जी (58 वर्ष, पटना) घुटने के दर्द का इलाज ऑर्थोपेडिक डॉक्टर से करवा रहे थे, जिन्होंने Combiflam (दिन में 2 बार) दी। उसी दौरान दिल के डॉक्टर ने Crocin 650 दिन में 2 बार लिखी थी।"
                  : "Ramesh Kumar (58, Patna) took Combiflam twice daily for knee pain from his orthopedist, while concurrently taking Crocin 650 twice daily from his cardiologist."}
              </p>

              <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span>{isHi ? "पर्ची 1: Crocin 650 (दिन में 2 बार)" : "Slip 1: Crocin 650 (Twice daily)"}</span>
                  <strong className="text-rose-700">1300 mg Paracetamol</strong>
                </div>
                <div className="flex justify-between">
                  <span>{isHi ? "पर्ची 2: Combiflam (दिन में 2 बार)" : "Slip 2: Combiflam (Twice daily)"}</span>
                  <strong className="text-rose-700">+ 650 mg Paracetamol</strong>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-rose-900 text-sm">
                  <span>{isHi ? "कुल दैनिक खुराक (Total Ingestion)" : "Total Daily Ingestion"}</span>
                  <span>1950 mg/day ({isHi ? "घातक मात्रा" : "Liver Toxicity Risk"})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-100/70 border border-rose-300 text-xs text-rose-900 font-medium">
                ⚠️ <strong>{isHi ? "परिणाम:" : "Result:"}</strong>{' '}
                {isHi 
                  ? "अत्यधिक Paracetamol के कारण लिवर एनजाइम 4 गुना बढ़ गए और पेट में अल्सर की शुरुआत हुई।"
                  : "Uncontrolled Paracetamol elevated liver enzymes 4x and initiated gastric ulceration."}
              </div>
            </div>

            {/* Right Box: With VaidyaVaani */}
            <div className="p-6 rounded-2xl bg-emerald-50/40 border-2 border-emerald-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">✓</span>
                  <span>
                    {isHi 
                      ? "वैद्यवाणी सुरक्षा रडार के साथ (With VaidyaVaani Safety Radar)" 
                      : "Protected by VaidyaVaani Safety Radar (With VaidyaVaani)"}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {isHi 
                    ? "जैसे ही दोनों पर्चियों की फोटो वैद्यवाणी पर अपलोड की, सिस्टम ने तुरंत अलर्ट जारी किया कि दोनों दवाओं में Paracetamol का दोहराव है।"
                    : "As soon as both prescriptions were uploaded, VaidyaVaani instantly flagged the duplicate Paracetamol molecule and alerted the family."}
                </p>

                <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">
                      {isHi ? "प्रिस्क्रिप्शन टकराव: Crocin & Combiflam" : "Prescription Conflict: Crocin & Combiflam"}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold font-mono">
                      Overdose Risk Alert
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {isHi 
                      ? '"सचेत रहें: दोनों पर्चियों में बुखार व दर्द की दवा एक ही है। कृपया अपने डॉक्टर से बात करके किसी एक दवाई को बंद करें या खुराक बदलें!"'
                      : '"Caution: Both slips contain identical analgesic molecules. Consult your doctor to pause one medicine or adjust dosage!"'}
                  </p>
                  <button
                    onClick={() => handleCopyNote("डॉक्टर हेतु नोट: मरीज क्रोसिन 650 और कॉम्बिफ्लाम दोनों ले रहे हैं, जिससे पैरासिटामोल ओवरडोज हो रहा है। कृपया खुराक संशोधन करें।", "case-study-note")}
                    className="mt-1 text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{copiedNote === 'case-study-note' ? '✓ नोट कॉपी हुआ (Note Copied)' : (isHi ? 'डॉक्टर को दिखाने हेतु पर्चा तैयार करें 📋' : 'Copy Doctor Reconciliation Note 📋')}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-900 font-medium">
                ✓ <strong>{isHi ? "नतीजा:" : "Outcome:"}</strong>{' '}
                {isHi 
                  ? "डॉक्टर ने तुरंत दवा बदलकर एक सुरक्षित दर्द निवारक और एंटासिड दिया।"
                  : "Physician promptly substituted with a single safe analgesic and gastroprotective PPI."}
              </div>
            </div>

          </div>

        </section>

        {/* =========================================================================
            6. SIMPLIFIED LAB INTELLIGENCE SECTION (BILINGUAL)
            ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6 text-left" id="doctor-guide">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                {isHi ? "बायोमार्कर मैट्रिक्स • SMART LAB INTELLIGENCE" : "Biomarker Matrix • SMART LAB INTELLIGENCE"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-headline pt-1">
                {isHi ? "कठिन लैब रिपोर्ट अब कोई पहेली नहीं" : "Complex Lab Reports Are No Longer a Mystery"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {isHi 
                  ? "Lactate Dehydrogenase, Serum Creatinine, SGOT जैसे जटिल शब्दों को डरने के बजाय समझें।"
                  : "Stop fearing terms like Serum Creatinine, SGOT, and Lipid Fractions. Understand your body in plain words."}
              </p>
            </div>

            <Link
              to="/lab-decoder"
              className="px-4 py-2 rounded-xl bg-[#00221b] hover:bg-[#0e382f] text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-center transition-colors shadow-xs"
            >
              <span>{isHi ? "📊 सैंपल रिपोर्ट खोलें" : "📊 Open Sample Report"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Mockup Box */}
            <div className="lg:col-span-7 bg-slate-50/70 p-6 rounded-2xl border border-slate-200 space-y-5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 font-headline">
                  {isHi ? "किडनी व ब्लड रिपोर्ट (KFT + Lipid)" : "Kidney & Blood Panel (KFT + Lipid)"}
                </span>
                <span className="text-emerald-700 font-bold font-mono">✓ Verified Markers</span>
              </div>

              {/* Item 1 */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">
                      {isHi ? "सीरम क्रिएटिनिन (Serum Creatinine)" : "Serum Creatinine (Kidney Function)"}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {isHi ? "किडनी फंक्शन टेस्ट" : "Kidney Function Test"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-cyan-800 font-mono">1.10</span>
                    <span className="text-[10px] text-slate-500 font-mono"> mg/dL</span>
                    <span className="block text-[10px] font-bold text-cyan-700">
                      {isHi ? "🟢 सामान्य दायरा" : "🟢 Optimal Healthy Range"}
                    </span>
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
                  💡 <strong>{isHi ? "हमारा सारांश:" : "Our Summary:"}</strong>{' '}
                  {isHi 
                    ? '"आपके गुर्दे बिल्कुल सामान्य तरीके से काम कर रहे हैं। यूरिया और अपशिष्ट ठीक से बाहर निकल रहा है।"'
                    : '"Your kidneys are filtering waste properly and operating within optimal physiological limits."'}
                </p>
              </div>

              {/* Item 2 */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">
                      {isHi ? "फास्टिंग ब्लड शुगर (Fasting Glucose)" : "Fasting Blood Sugar (Glucose)"}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {isHi ? "सुबह खाली पेट जांच" : "Overnight Fasting Check"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-800 font-mono">116</span>
                    <span className="text-[10px] text-slate-500 font-mono"> mg/dL</span>
                    <span className="block text-[10px] font-bold text-amber-700">
                      {isHi ? "🟡 थोड़ा अधिक (Pre-diabetic)" : "🟡 Borderline High (Pre-diabetic)"}
                    </span>
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
                  💡 <strong>{isHi ? "हमारा सारांश:" : "Our Summary:"}</strong>{' '}
                  {isHi 
                    ? '"हल्का बढ़ा हुआ। मीठा तुरंत नियंत्रित करें। घबराने की बात नहीं है।"'
                    : '"Borderline elevated. Moderate your sugar intake and follow lifestyle tips. No immediate alarm."'}
                </p>
              </div>

              {/* Audio Player Bar */}
              <div className="p-3.5 rounded-xl bg-[#00221b] text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-300" />
                  <span>{isHi ? "सुनें: पूरी रिपोर्ट का सरल हिंदी विश्लेषण (2 मिनट)" : "Listen: 2-Minute Vernacular Audio Breakdown"}</span>
                </div>
                <button
                  onClick={() => handleSpeak("आपकी सीरम क्रिएटिनिन 1.10 पूरी तरह सामान्य है। फास्टिंग शुगर 116 थोड़ा बढ़ा हुआ है।")}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  ▶ {isHi ? "सुनें" : "Play"}
                </button>
              </div>
            </div>

            {/* Right Doctor Questions & Timeline */}
            <div className="lg:col-span-5 space-y-5 text-xs">
              
              {/* Doctor Questions */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-bold text-slate-900 font-headline text-sm flex items-center gap-1.5">
                  <span>🩺</span>
                  <span>{isHi ? "डॉक्टर से क्या पूछें?" : "Questions to Ask Your Doctor"}</span>
                </h4>

                <div className="space-y-2 text-slate-700">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    {isHi 
                      ? '1. "क्रिएटिनिन 1.10 स्तर क्या मेरे ब्लड प्रेशर की दवाओं के लिए सुरक्षित है?"' 
                      : '1. "Is my 1.10 Creatinine level safe with my current blood pressure medication?"'}
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    {isHi 
                      ? '2. "फास्टिंग शुगर 116 होने पर क्या मुझे कोई नई दवा शुरू करनी होगी?"' 
                      : '2. "With a Fasting Glucose of 116, do I need a new medication or dietary adjustments?"'}
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    {isHi 
                      ? '3. "अगला लैब टेस्ट मुझे कितने महीने बाद कराना चाहिए?"' 
                      : '3. "When should I schedule my next follow-up panel (3 or 6 months)?"'}
                  </div>
                </div>

                <button
                  onClick={() => handleCopyNote("डॉक्टर से सवाल: 1. क्रिएटिनिन 1.10 बीपी दवाओं के लिए सुरक्षित है? 2. फास्टिंग शुगर 116 पर क्या करें? 3. अगला टेस्ट कब कराएं?", "doctor-questions")}
                  className="w-full py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#0F6848] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedNote === 'doctor-questions' ? '✓ सवाल कॉपी हुए (Copied)' : (isHi ? '📋 सवाल डॉक्टर को भेजें (WhatsApp)' : '📋 Send Questions via WhatsApp')}</span>
                </button>
              </div>

              {/* Timeline */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <h4 className="font-bold text-slate-900 font-headline text-sm">
                  {isHi ? "रिपोर्ट 3 महीनों का रुझान" : "3-Month Progression Trajectory"}
                </h4>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">12 JAN 2024</span>
                    <strong className="text-slate-900">110 mg/dL ({isHi ? "नियंत्रण में" : "Controlled"})</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">18 JUL 2024</span>
                    <strong className="text-amber-800">112 mg/dL ({isHi ? "हल्का बढ़ा" : "Mild Elevation"})</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">14 OCT 2024 (Current)</span>
                    <strong className="text-amber-800 font-bold">116 mg/dL ({isHi ? "अनुशंसा" : "Follow-up Advised"})</strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic pt-1">
                  * {isHi ? "आपका फास्टिंग शुगर पिछले 9 महीनों से लगातार 110-116 के बीच बढ़ रहा है।" : "Your fasting blood sugar has maintained a 110-116 mg/dL elevation across the last 9 months."}
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* =========================================================================
            7. MULTI-PRESCRIPTION CROSS-MATCHING 4 PILLARS (BILINGUAL)
            ========================================================================= */}
        <section className="space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {isHi ? "मल्टीपल प्रिस्क्रिप्शन रडार • MULTI-PRESCRIPTION RADAR" : "MULTI-PRESCRIPTION RADAR • मल्टीपल प्रिस्क्रिप्शन रडार"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-headline pt-1">
              {isHi ? "विभिन्न पर्चियों का 'स्मार्ट दवा मिलान'" : "Smart Cross-Matching Across Multiple Doctor Prescriptions"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              {isHi 
                ? "जब मरीज सरकारी अस्पताल, प्राइवेट क्लिनिक और लोकल मेडिकल स्टोर से दवाएं ले रहे होते हैं, तब वैद्यवाणी आपका कवच बनती है।"
                : "When patients receive prescriptions from hospital specialists, local clinics, and pharmacies, VaidyaVaani shields your family from hazardous overlaps."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left text-xs">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center text-xl mb-3">
                  ⏰
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{isHi ? "खास समय सारणी" : "Precision Timing Schedule"}</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  {isHi 
                    ? "सुबह 8 बजे कौन सी लें, दोपहर 1 बजे कौन सी। दवाइयों के सही समय और खाने के साथ/खाली पेट के सटीक नियम।"
                    : "Precise meal timing rules (empty stomach, with meals, before bed) to maximize bioavailability."}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-emerald-800 font-semibold text-[11px]">
                ✓ {isHi ? "खुराक समय निर्धारण नियम" : "Dosage Timing Rules"}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl mb-3">
                  ⚠️
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{isHi ? "डबल डोज बचाव" : "Double-Dose Prevention"}</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  {isHi 
                    ? "दो अलग डॉक्टरों द्वारा एक ही सॉल्ट (जैसे Paracetamol या Pantoprazole) लिखे जाने पर तुरंत अलर्ट।"
                    : "Instant warnings when two different doctors unknowingly prescribe identical molecules under different brand names."}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-emerald-800 font-semibold text-[11px]">
                ✓ {isHi ? "ओवरडोज़ सुरक्षा कवच" : "Overdose Shield Guard"}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center text-xl mb-3">
                  📅
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{isHi ? "24-घंटे सुरक्षा समय सारणी" : "24-Hour Safe Routine"}</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  {isHi 
                    ? "हार्ट की दवा, बीपी की दवा और पेनकिलर के बीच सही समय अंतराल का सटीक शेड्यूलर।"
                    : "Intelligent spacing between blood thinners, hypertension pills, and analgesics to avoid gastric clashes."}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-emerald-800 font-semibold text-[11px]">
                ✓ {isHi ? "दैनिक शेड्यूलर प्लान" : "Daily Scheduler Plan"}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl mb-3">
                  📋
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{isHi ? "डॉक्टर हेतु समन्वय पर्ची" : "Doctor Reconciliation Slip"}</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  {isHi 
                    ? "डॉक्टर से मिलकर पर्चा बदलने के लिए क्लिनिकल समरी तैयार करना ताकि डॉक्टर को पूरी बात एक नजर में समझ आ जाए।"
                    : "Generates concise pharmacological conflict notes ready to hand directly to your physician for rapid substitution."}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-emerald-800 font-semibold text-[11px]">
                ✓ {isHi ? "क्लिनिकल समरी रिपोर्ट" : "Clinical Summary Dispatch"}
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            8. 3-STEP HOW IT WORKS (BILINGUAL)
            ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8 text-center">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase font-bold text-slate-400">
              {isHi ? "सरल 3 चरण • THREE SIMPLE STEPS" : "THREE SIMPLE STEPS • सरल 3 चरण"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-headline pt-1">
              {isHi ? "स्मार्टफोन से बस फोटो खींचें, बाकी काम हमारा" : "Snap a Quick Photo with Your Phone — We Handle the Rest"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              {isHi 
                ? "किसी कठिन तकनीकी ज्ञान की जरूरत नहीं। बुजुर्ग और ग्रामीण परिवार भी आसानी से उपयोग कर सकते हैं।"
                : "Zero complex technical steps. Designed so that elderly parents and rural caregivers can use it effortlessly."}
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
              <h4 className="text-sm font-bold text-slate-900 font-headline">
                {isHi ? "फोटो खींचें या PDF अपलोड करें" : "1. Snap Photo or Upload PDF"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi 
                  ? "घर बैठे किसी भी पर्चे, खून जांच रिपोर्ट या अल्ट्रासाउंड की साफ फोटो खींचें।"
                  : "Capture a clear photo of any clinic prescription slip or pathology blood report."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#00221b] text-white flex items-center justify-center text-xs font-black">
                2
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-2xl shadow-2xs">
                ⚙️
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-headline">
                {isHi ? "सिस्टम करेगा विस्तृत जाँच" : "2. AI Cross-Audits Safety"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi 
                  ? "AI मॉडल सुरक्षित डेटाबेस से दवाई का नाम, खुराक, और टेस्ट पैरामीटर्स को जांचकर सरल भाषा में रिपोर्ट तैयार करता है।"
                  : "Our clinical model cross-references drug formulations, dosage thresholds, and diagnostic reference bounds."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#00221b] text-white flex items-center justify-center text-xs font-black">
                3
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shadow-2xs">
                💡
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-headline">
                {isHi ? "समझकर सही कदम उठाएं" : "3. Listen & Take Action"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi 
                  ? "अपनी मातृभाषा में रिपोर्ट का सारांश सुनें, अगर कोई दवा टकरा रही हो तो डॉक्टर से बात करें।"
                  : "Listen to the vernacular audio summary in your own language and consult your physician with the auto-generated note."}
              </p>
            </div>

          </div>
        </section>

        {/* =========================================================================
            9. REAL PATIENT TESTIMONIALS (BILINGUAL)
            ========================================================================= */}
        <section className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase font-bold text-slate-400">
                {isHi ? "सच्चे अनुभव • REAL PATIENT STORIES" : "REAL PATIENT STORIES • सच्चे अनुभव"}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-headline">
                {isHi ? "भारत के परिवारों ने क्या कहा" : "What Indian Families & Physicians Are Saying"}
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
                  {isHi 
                    ? '"वैद्यवाणी की बदौलत मुझे पता चला कि ऑर्थोपेडिक डॉक्टर और फिजिशियन दोनों ने मुझे अलग-अलग नाम से पैरासिटामोल लिख दी थी। वैद्यवाणी ने मुझे लिवर डैमेज से बचा लिया।"'
                    : '"Thanks to VaidyaVaani, I discovered that my orthopedist and cardiologist had both prescribed Paracetamol under different brand names. It saved me from severe liver damage."'}
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-[10px]">
                  RK
                </div>
                <div>
                  <strong className="text-slate-900 block">{isHi ? "रमेश कुमार (58 वर्ष)" : "Ramesh Kumar (58 Yrs)"}</strong>
                  <span className="text-[10px] text-slate-400">{isHi ? "व्यवसायी, पटना (बिहार)" : "Business Owner, Patna (Bihar)"}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-amber-500">⭐⭐⭐⭐⭐</div>
                <p className="text-slate-700 leading-relaxed italic">
                  {isHi 
                    ? '"मेरी माताजी पढ़ी-लिखी नहीं हैं। उनकी रिपोर्ट देखकर हम परेशान थे। वैद्यवाणी ने बहुत ही सरल भाषा में समझाया कि रिपोर्ट ठीक है। ऑडियो सुनकर माताजी बहुत खुश हुईं।"'
                    : '"My elderly mother cannot read English reports. We were very anxious about her diagnostic blood panel. VaidyaVaani explained everything in simple Hindi audio, bringing our family immense relief."'}
                </p>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                  SS
                </div>
                <div>
                  <strong className="text-slate-900 block">{isHi ? "सुनीता शर्मा" : "Sunita Sharma"}</strong>
                  <span className="text-[10px] text-slate-400">{isHi ? "गृहिणी, जयपुर (राजस्थान)" : "Homemaker, Jaipur (Rajasthan)"}</span>
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
            10. BOTTOM HIGH-IMPACT CTA BANNER (BILINGUAL)
            ========================================================================= */}
        <section className="bg-gradient-to-br from-[#00221b] via-[#002f26] to-[#001813] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl border border-emerald-900/50">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
              {isHi ? "100% निःशुल्क एवं सुरक्षित • Free for All Citizens" : "100% Free & Secure • Free for All Citizens"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-headline tracking-tight text-white pt-2">
              {isHi 
                ? "अपनी या परिवार की रिपोर्ट अभी जांचें — कोई डर नहीं, केवल स्पष्ट ज्ञान" 
                : "Check Your Family's Reports & Prescriptions — Zero Fear, Complete Clarity"}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
              {isHi 
                ? "Take control of your family's prescription safety. Upload a photo or document right from your phone and receive a vernacular audio briefing in seconds."
                : "Take control of your family's prescription safety. Upload a photo or document right from your phone and receive a vernacular audio briefing in seconds."}
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
              <span>{isHi ? "📊 लैब रिपोर्ट अपलोड करें" : "📊 Upload Lab Report"}</span>
            </button>

            <button
              onClick={() => {
                setUploadType('prescriptions');
                setIsUploadDrawerOpen(true);
              }}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{isHi ? "📋 दवा पर्ची (Prescription) जांचें" : "📋 Check Prescription Slips"}</span>
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-emerald-200/70 font-mono">
            <span>✓ {isHi ? "भारतीय मानक" : "Indian Standards"}</span>
            <span>•</span>
            <span>✓ {isHi ? "100% निजता की गारंटी" : "100% Privacy Guarantee"}</span>
            <span>•</span>
            <span>✓ {isHi ? "24x7 तत्काल परिणाम" : "Instant 24x7 Analysis"}</span>
          </div>
        </section>

      </main>

      {/* =========================================================================
          11. CLEAN COMPREHENSIVE FOOTER (BILINGUAL)
          ========================================================================= */}
      <footer className="border-t border-slate-200/80 bg-white text-slate-500 py-6 mt-12 text-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo/complete%20logo.png"
              alt="VaidyaVaani"
              className="h-8 w-auto object-contain"
            />
            <div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                © 2026 VaidyaVaani Healthcare Intelligence. Not a replacement for emergency clinical diagnosis. Emergency helpline: 108 / 112
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium">
            <a href="tel:18002669900" className="hover:text-slate-900">
              {isHi ? "टोल फ्री सहायता (Help Desk)" : "Toll-Free Helpline: 1800-266-9900"}
            </a>
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
          12. UPLOAD MODAL DRAWER (BILINGUAL)
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
                      {uploadType === 'reports' 
                        ? (isHi ? 'Upload Blood / Lab Report (रक्त जांच रिपोर्ट)' : 'Upload Blood / Lab Report') 
                        : (isHi ? 'Upload Doctor Prescription Slip (डॉक्टर की पर्ची)' : 'Upload Doctor Prescription Slip')}
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
                  <label className="block text-xs font-bold text-[#00221b] mb-2">
                    {isHi ? "दस्तावेज़ का प्रकार चुनें (Select Document Type)" : "Select Document Type (दस्तावेज़ का प्रकार)"}
                  </label>
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
                  <div className="text-sm font-bold text-[#00221b] mt-1">
                    {isHi ? "कैमरा से फोटो खींचें" : "Take photo with camera"}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isHi ? "या गैलरी से फोटो/PDF चुनें (JPG, PNG, PDF)" : "Or choose file from device gallery (JPG, PNG, PDF)"}
                  </p>
                  
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCameraScan(uploadType)}
                      className="px-4 py-2 bg-[#00221b] hover:bg-[#0e382f] text-white font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      {isHi ? "कैमरा खोलें" : "Camera Snap"}
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
                  {isHi ? "रद्द करें (Cancel)" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={handleUploadComplete}
                  className="px-5 py-2 bg-[#3b665a] hover:bg-[#00221b] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  {isHi ? "जाँच शुरू करें" : "Start Analysis"}
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
