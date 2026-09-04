import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  AlertTriangle, 
  Check, 
  Copy, 
  Printer, 
  Phone, 
  FileText, 
  Clock, 
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import Uploader from '../components/Uploader';

export const SafetyMatrixPage: React.FC = () => {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedLangAudio, setSelectedLangAudio] = useState<'hi' | 'bho' | 'en'>('hi');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [copiedSlip, setCopiedSlip] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const audioTexts = {
    hi: "चेतावनी: रमेश कुमार, आपकी पर्चियों में दो गंभीर दवाओं का टकराव मिला है। पहली बात: क्रोसिन 650 और कॉम्बिफ्लाम दोनों में पैरासिटामोल है, जिससे आपके लिवर पर दोगुना लोड पड़ रहा है। दूसरी बात: इकोस्प्रिन और कॉम्बिफ्लाम साथ लेने से पेट में ब्लीडिंग और अल्सर का खतरा है। तुरंत डॉक्टर से पर्चा दोबारा जांच करवाएं।",
    bho: "सावधान: रमेश जी, रउवा के दुगो डाक्टर के पर्ची में दवाई के भारी टकराव मिलल बा। क्रोसिन आ कॉम्बिफ्लाम दुनो में पैरासिटामोल बा जवना से लिवर के नुकसान हो सकेला। आ इकोस्प्रिन के साथ दर्द के दवाई लिहला से पेट में ब्लीडिंग के खतरा बा।",
    en: "Critical warning: Two major prescription conflicts detected for Ramesh Kumar. Duplicate Paracetamol across Crocin 650 and Combiflam exceeds safe hepatic limits by 65%. Concurrently, Aspirin plus Ibuprofen increases gastrointestinal bleeding risk by 4.2 times."
  };

  const handlePlayVoice = (lang: 'hi' | 'bho' | 'en') => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio && selectedLangAudio === lang) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    setSelectedLangAudio(lang);
    const text = audioTexts[lang];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage.speechCode || (lang === 'en' ? 'en-IN' : 'hi-IN');
    utterance.rate = 0.92;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopySlip = () => {
    const slipText = `PATIENT CONFLICT DISPATCH • REF: VV-CONFL-88918 • DATE: 12-OCT-2024
PATIENT: Ramesh Kumar (58/M) • ABHA: 91-8276-1029-4412
TO: Dr. Rajiv Verma (Orthopedics, Medanta) & Dr. S.N. Sharma (Cardiology, Apollo)
CLINICAL CONFLICT SUMMARY:
1) Duplicate Paracetamol: Patient is co-prescribed Crocin 650mg TDS (1,950mg) + Combiflam TDS (Paracetamol 325mg x 3 = 975mg), totaling 2,925mg/day, exceeding safe geriatric limits (>2,000mg liver toxicity threshold).
2) Severe Bleed Hazard: Eco-Sprin 75 (Aspirin) + Combiflam (Ibuprofen 400mg) causes simultaneous COX-1 inhibition with high peptic ulcer perforation risk.
RECOMMENDED ACTION: Withhold Combiflam; switch to Paracetamol 500mg alone or topical NSAID gel + Pantoprazole 40mg.`;
    navigator.clipboard.writeText(slipText);
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#ffdad6] selection:text-[#ba1a1a] flex flex-col">
      
      {/* =========================================================================
          1. TOP APP SUB-NAVIGATION BAR
          ========================================================================= */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 flex-wrap">
          
          {/* Left Tabs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/" className="flex items-center group select-none mr-1">
              <img
                src="/logo/complete%20logo.png"
                alt="VaidyaVaani"
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5e9] text-[#1b5e20] text-xs font-bold border border-[#c8e6c9]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>ABDM Integrated + आयुष्मान भारत</span>
            </span>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs">
              <Link
                to="/lab-decoder"
                className="px-3.5 py-1 rounded-full font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors"
              >
                Lab Reports (स्मार्ट रिपोर्ट)
              </Link>
              <Link
                to="/safety-matrix"
                className="px-3.5 py-1 rounded-full font-bold bg-[#00221b] text-white shadow-2xs"
              >
                Drug Conflicts (दवा सुरक्षा)
              </Link>
              <a
                href="#doctor-reconciliation"
                className="px-3 py-1 rounded-full font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors hidden md:inline-block"
              >
                Consultation Guide (परामर्श)
              </a>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector variant="compact" />

            <button
              onClick={() => handlePlayVoice('hi')}
              className="bg-[#002f6c] hover:bg-[#001f4c] text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>आवाज़ में सुनें (Voice Audio)</span>
            </button>

            <a
              href="tel:108"
              className="bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>Emergency 108</span>
            </a>

            <div className="w-8 h-8 rounded-full bg-[#00221b] text-white flex items-center justify-center font-bold text-xs">
              {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'RK'}
            </div>
          </div>

        </div>
      </header>

      {/* =========================================================================
          MAIN DRUG CONFLICTS CONTENT
          ========================================================================= */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6 text-left">
        
        {/* =========================================================================
            2. PATIENT HEADER STRIP WITH CONFLICTS FOUND BANNER
            ========================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          
          {/* Top-Right Red Ribbon */}
          <div className="absolute top-0 right-0 bg-[#ba1a1a] text-white text-[10px] font-black tracking-widest px-8 py-1 rotate-12 translate-x-4 -translate-y-1 shadow-xs pointer-events-none uppercase">
            CONFLICTS FOUND
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center text-2xl font-bold shrink-0">
              👤
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-slate-900 font-headline">
                  Ramesh Kumar (रमेश कुमार)
                </h1>
                <span className="text-xs text-slate-500 font-semibold">58 Yrs • Male, Patna, Bihar</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 font-mono text-[11px] font-bold">
                  ABHA: 91-8276-1029-4412
                </span>
              </div>

              <div className="text-xs text-slate-600 font-medium">
                Active Medical Conditions: <strong className="text-slate-900">Hypertension (उच्च रक्तचाप), Type-2 Diabetes, Knee Osteoarthritis (घुटनों का दर्द)</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0 pr-6">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#00221b] hover:bg-[#0e382f] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>+ Upload New Prescription (नई पर्ची जोड़ें)</span>
            </button>
          </div>
        </section>

        {/* =========================================================================
            3. CROSS-REFERENCING 3 ACTIVE PRESCRIPTIONS
            ========================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-800" />
              <h3 className="text-sm font-bold text-slate-900 font-headline">
                Cross-Referencing 3 Active Prescriptions (सक्रिय पर्चियों की संयुक्त जाँच)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              AI Medical Radar v4.2 • Verified by Clinical Pharmacist DB
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            
            {/* Prescription A */}
            <div className="p-3.5 rounded-xl bg-cyan-50/50 border border-cyan-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-900">Prescription A</span>
                <span className="text-[10px] font-mono text-slate-500">02 Oct 2024</span>
              </div>
              <p className="font-bold text-slate-800">Dr. S. N. Sharma</p>
              <p className="text-[11px] text-slate-500">Cardiology • Apollo Clinic Patna</p>
              <div className="pt-1 text-[11px] text-cyan-800 font-mono font-medium">
                📋 Eco-Sprin 75, Telmisartan 40, Crocin 650
              </div>
            </div>

            {/* Prescription B */}
            <div className="p-3.5 rounded-xl bg-cyan-50/50 border border-cyan-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-900">Prescription B</span>
                <span className="text-[10px] font-mono text-slate-500">11 Oct 2024</span>
              </div>
              <p className="font-bold text-slate-800">Dr. Rajiv Verma</p>
              <p className="text-[11px] text-slate-500">Orthopedics • Medanta Hospital Ranchi</p>
              <div className="pt-1 text-[11px] text-cyan-800 font-mono font-medium">
                📋 Combiflam, Calcium D3, Pantop 40
              </div>
            </div>

            {/* Prescription C */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Prescription C</span>
                <span className="text-[10px] font-mono text-slate-400">Self / Local</span>
              </div>
              <p className="font-bold text-slate-800">Local Ayush &amp; Daily Supplements</p>
              <p className="text-[11px] text-slate-500">OTC &amp; Herbal • Patliputra Chemist</p>
              <div className="pt-1 text-[11px] text-slate-600 font-mono font-medium">
                📋 Ashwagandha Churna, Multivitamin OTC
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            4. URGENT AUDIO NOTICE BANNER
            ========================================================================= */}
        <section className="bg-gradient-to-r from-[#002820] to-[#00382b] text-white rounded-2xl p-5 shadow-md border border-emerald-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 border border-rose-500/30">
              <Volume2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/40 mb-1">
                <span>⚠️ अति ज़रूरी चेतावनी (Urgent Voice Notice)</span>
                <span>• 01:42 mins</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-headline text-white">
                दवाओं के खतरनाक टकराव की सरल ऑडियो चेतावनी (Listen to Why It's Unsafe)
              </h3>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                "डॉ. शर्मा और डॉ. वर्मा की दोनों दवाइयां एक साथ लेने से आपके लिवर और पेट पर क्या बुरा असर होगा—इसे अपनी मातृभाषा में समझें।"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={() => handlePlayVoice('hi')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isPlayingAudio && selectedLangAudio === 'hi'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isPlayingAudio && selectedLangAudio === 'hi' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>Play Hindi (हिन्दी)</span>
            </button>

            <button
              onClick={() => handlePlayVoice('bho')}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              भोजपुरी
            </button>

            <button
              onClick={() => handlePlayVoice('en')}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              English
            </button>
          </div>
        </section>

        {/* =========================================================================
            5. CRITICAL WARNING #1: DUPLICATE PARACETAMOL OVERDOSE
            ========================================================================= */}
        <section className="bg-white rounded-2xl border-2 border-rose-300 p-6 shadow-xs space-y-4">
          
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>CRITICAL WARNING #1 • गंभीर ओवरडोज़ खतरा</span>
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-800">
              Duplicate Molecule: Paracetamol (एसिटामिनोफेन का दोहराव)
            </span>
          </div>

          {/* Simple Explanation */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium leading-relaxed">
            💡 <strong>सरल शब्दों में समझें (What this means in simple terms):</strong> आप अनजाने में दो अलग डॉक्टरों की पर्ची से एक ही दवाई दुगनी मात्रा में खा रहे हैं। इससे लिवर (जिगर) फेल होने का गंभीर खतरा पैदा होता है।
          </div>

          {/* Conflict Clash Visual Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Left Pill: Crocin */}
            <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span className="bg-slate-200 px-2 py-0.5 rounded font-bold">Prescribed by Dr. S.N. Sharma (Apollo)</span>
                <span>Cardiology Rx</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs">
                  💊
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Crocin 650mg</h4>
                  <p className="text-[11px] text-slate-500">Tablet • SOS / दिन में 2 बार</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-mono">
                <span className="text-rose-700 font-bold">Active Salt: Paracetamol</span>
                <strong className="text-slate-900">650 mg</strong>
              </div>
              <p className="text-[10px] text-slate-400 italic">Purpose: Mild post-angioplasty joint ache</p>
            </div>

            {/* Center Collision Icon */}
            <div className="md:col-span-2 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-sm shadow-md animate-pulse">
                ✕
              </div>
              <span className="text-[10px] font-mono font-black text-rose-700 mt-1 uppercase tracking-wider">
                CONFLICT
              </span>
            </div>

            {/* Right Pill: Combiflam */}
            <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span className="bg-slate-200 px-2 py-0.5 rounded font-bold">Prescribed by Dr. Rajiv Verma (Medanta)</span>
                <span>Ortho Knee Rx</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs">
                  💊
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Combiflam Tablet</h4>
                  <p className="text-[11px] text-slate-500">Combination Pill • दिन में 2 बार (सुबह-शाम)</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-mono">
                <span className="text-rose-700 font-bold">Active Salt: Paracetamol</span>
                <strong className="text-slate-900">325 mg</strong>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-500">
                <span>Co-formulation: Ibuprofen</span>
                <span>400 mg</span>
              </div>
            </div>

          </div>

          {/* Dosage Gauge Meter */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="flex items-center gap-1 text-slate-700">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Paracetamol Daily Cumulative Dosage Calculator</span>
              </span>
              <span className="text-rose-700 font-black">
                Current Combined Ingestion: ~1,950 mg to 2,600 mg / day
              </span>
            </div>

            <div className="h-4 rounded-full bg-slate-200 overflow-hidden flex relative">
              <div className="w-[35%] bg-emerald-400" title="Safe (0-1500mg)"></div>
              <div className="w-[25%] bg-amber-400" title="Borderline (1500-2000mg)"></div>
              <div className="w-[40%] bg-rose-500" title="Toxicity Risk (>2000mg)"></div>

              {/* Ingestion Needle */}
              <div 
                className="absolute top-0 bottom-0 w-3.5 h-3.5 -mt-0.5 bg-rose-900 border-2 border-white rounded-full shadow-md -translate-x-1/2"
                style={{ left: '82%' }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-500 font-semibold pt-0.5">
              <span>0 mg</span>
              <span>Max Safe Geriatric Limit (1,500 mg)</span>
              <span className="text-rose-700 font-bold">LIVER INJURY RISK THRESHOLD (&gt;2,000 mg) [OVER LIMIT BY 65%]</span>
            </div>

            <p className="text-[10px] text-slate-400 italic pt-1">
              * Indian Pharmacopoeia &amp; ICMR Guidelines for 58-yr diabetic patient: Maximum recommended Paracetamol is 1,500mg/day to prevent acute hepatotoxicity.
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-slate-700">
              🛡️ <strong>तुरंत क्या करें:</strong> दोनों में से कोई एक ही दवा लें, या नीचे दिया गया पर्चा दिखाकर डॉक्टर से नई सलाह लें।
            </div>
            <a
              href="#doctor-reconciliation"
              className="px-4 py-2 rounded-xl bg-[#00221b] hover:bg-[#0e382f] text-white font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>डॉक्टर से पर्ची Reconcile करें (Print Conflict Slip)</span>
            </a>
          </div>

        </section>

        {/* =========================================================================
            6. WARNING #2: DRUG INTERACTION (ECO-SPRIN + COMBIFLAM BLEED HAZARD)
            ========================================================================= */}
        <section className="bg-white rounded-2xl border-2 border-rose-300 p-6 shadow-xs space-y-4">
          
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-rose-100">
            <span className="px-3 py-1 rounded-full bg-[#D97706] text-white text-xs font-black flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>WARNING #2 • DRUG INTERACTION (दवाओं का आपसी टकराव)</span>
            </span>
            <span className="text-xs font-mono font-bold text-amber-900">
              Blood Thinner + NSAID Painkiller Combo
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium leading-relaxed">
            ⚡ <strong>आसान भाषा में:</strong> खून पतला करने वाली गोली (Eco-Sprin) और दर्द निवारक गोली (Combiflam) साथ लेने से पेट में छाले और अंदरूनी ब्लीडिंग का भारी खतरा बनता है।
          </div>

          {/* Conflict Pair */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Pill 1 */}
            <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400">Aspirin 75mg</span>
              <h4 className="text-sm font-black text-slate-900">Eco-Sprin 75</h4>
              <p className="text-xs text-slate-600">Cardio Antiplatelet (खून पतला करने की दवा)</p>
            </div>

            {/* Hazard Box */}
            <div className="md:col-span-2 text-center p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
              <div className="text-xs font-mono font-bold">⚡ SEVERE G.I. BLEED RISK</div>
              <p className="text-[10px] text-rose-700 mt-0.5">पेट में अल्सर व आंतरिक रक्तस्राव का जोखिम</p>
            </div>

            {/* Pill 2 */}
            <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400">Ibuprofen 400mg</span>
              <h4 className="text-sm font-black text-slate-900">Combiflam (NSAID)</h4>
              <p className="text-xs text-slate-600">Pain &amp; Inflammation (दर्द व सूजन निवारक)</p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 font-mono">🩺 Pharmacist Clinical Explanation (क्लीनिकल कारण):</strong>
              <p className="text-slate-600 leading-relaxed">
                Both Aspirin and Ibuprofen inhibit COX-1 enzymes protecting the stomach gastric mucosal barrier. Simultaneous use increases risk of peptic ulcer perforation by 4.2x.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
              <strong className="font-mono text-emerald-900">✓ Safer Alternative to Discuss with Dr. Verma:</strong>
              <p className="leading-relaxed text-slate-700">
                Ask your orthopedist if <strong>Paracetamol alone (plain 500mg)</strong> or topical pain gels (Diclofenac gel) plus a PPI (Pantoprazole 40mg taken before meals) can relieve knee pain without stomach bleed risk.
              </p>
            </div>
          </div>

        </section>

        {/* =========================================================================
            7. 24-HOUR SAFE MEDICINE ROUTINE (सुरक्षित दवा समय सारणी)
            ========================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-headline flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-800" />
                <span>24-Hour Safe Medicine Routine (सुरक्षित दवा समय सारणी)</span>
              </h3>
              <p className="text-xs text-slate-500">Verified non-conflicting daily doses with proper meal timing rules (खाने के पहले / खाने के बाद)</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
              ✓ 3 Verified Safe Today
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            {/* Slot 1: Morning */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-bold">सुबह (Morning)</span>
                <span className="font-mono text-[11px] text-slate-400">08:00 AM ☀️</span>
              </div>
              
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Telmisartan 40mg</span>
                  <span className="text-[10px] text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded font-mono">BP</span>
                </div>
                <p className="text-[11px] text-slate-500">1 Tablet • For High Blood Pressure</p>
                <p className="text-[10px] text-emerald-800 font-semibold">🍽️ नाश्ते के बाद (After Breakfast)</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Pantop 40mg</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">Antacid</span>
                </div>
                <p className="text-[11px] text-slate-500">1 Tablet • Prevents Acidity</p>
                <p className="text-[10px] text-amber-800 font-semibold">⏰ नाश्ते से 30 मिनट पहले (Empty Stomach)</p>
              </div>

              <div className="text-[10px] text-emerald-700 font-semibold">✓ No chemical conflict detected</div>
            </div>

            {/* Slot 2: Afternoon */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-bold">दोपहर (Afternoon)</span>
                <span className="font-mono text-[11px] text-slate-400">01:30 PM ☀️</span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Metformin 500mg</span>
                  <span className="text-[10px] text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded font-mono">Sugar</span>
                </div>
                <p className="text-[11px] text-slate-500">1 Tablet • Diabetes Control</p>
                <p className="text-[10px] text-emerald-800 font-semibold">🍽️ दोपहर के भोजन के तुरंत बाद</p>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 space-y-1">
                <div className="flex justify-between font-bold text-rose-900">
                  <span>HOLD / PAUSED</span>
                  <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-mono">Hold</span>
                </div>
                <p className="text-[11px] text-rose-700">Crocin 650mg &amp; Combiflam put on hold until Dr. verification</p>
              </div>

              <div className="text-[10px] text-rose-700 font-semibold">⚠️ Painkillers currently paused</div>
            </div>

            {/* Slot 3: Evening */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-bold">शाम (Evening Tea)</span>
                <span className="font-mono text-[11px] text-slate-400">06:00 PM ☕</span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Calcium + Vit D3</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">Bone</span>
                </div>
                <p className="text-[11px] text-slate-500">1 Tablet • Prescribed by Dr. Verma</p>
                <p className="text-[10px] text-slate-600 font-semibold">🥛 दूध या हल्के नाश्ते के साथ</p>
              </div>

              <div className="text-[10px] text-emerald-700 font-semibold">✓ Safe with evening routine</div>
            </div>

            {/* Slot 4: Bedtime */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-bold">रात (Bedtime)</span>
                <span className="font-mono text-[11px] text-slate-400">09:30 PM 🌙</span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Atorvastatin 10mg</span>
                  <span className="text-[10px] text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded font-mono">Lipid</span>
                </div>
                <p className="text-[11px] text-slate-500">1 Tablet • Cholesterol Regulation</p>
                <p className="text-[10px] text-slate-600 font-semibold">💧 सोने से ठीक पहले (पानी के साथ)</p>
              </div>

              <div className="text-[10px] text-emerald-700 font-semibold">✓ No lipid-drug interference</div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            8. DOCTOR RECONCILIATION SLIP (डॉक्टर हेतु पर्चा समाधान पत्र)
            ========================================================================= */}
        <section id="doctor-reconciliation" className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-headline flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-800" />
                <span>Doctor Reconciliation Slip (डॉक्टर हेतु पर्चा समाधान पत्र)</span>
              </h3>
              <p className="text-xs text-slate-500">
                A concise, clinically formatted summary tailored for Dr. Verma (Ortho) &amp; Dr. Sharma (Cardio) highlighting the exact pharmacological overlap with drug codes and ABHA identifiers.
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-1">
                <span>✓ PDF Ready</span>
                <span>•</span>
                <span>✓ Direct WhatsApp to Physician</span>
                <span>•</span>
                <span>✓ Encrypted ABHA Format</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Preview Slip (देखें)</span>
              </button>

              <button
                onClick={handleCopySlip}
                className="px-4 py-2 rounded-xl bg-[#00221b] hover:bg-[#0e382f] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                {copiedSlip ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSlip ? 'Slip Copied!' : 'Download Slip for Doctor'}</span>
              </button>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#0F6848] transition-colors"
                title="Share on WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Slip Code Box */}
          <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
            <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-800 text-[11px]">
              <span>PATIENT CONFLICT DISPATCH • REF: VV-CONFL-88918</span>
              <span>DATE: 12-OCT-2024</span>
            </div>
            <div className="pt-2 text-slate-300">
              <span className="text-emerald-400 font-bold">DR. RAJIV VERMA (Medanta):</span> Patient is on Aspirin 75mg via Dr. SN Sharma. Combiflam (Ibuprofen 400 + Paracetamol 325) poses dual conflict: 1) Cumulative Paracetamol exceeds 2100mg with Crocin 650; 2) Increased gastro-duodenal bleeding risk with Aspirin. Kindly review alternative analgesic regimen (e.g. Paracetamol solo or Tramadol low-dose).
            </div>
          </div>

        </section>

      </main>

      {/* =========================================================================
          FOOTER & DISCLAIMER
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
          UPLOAD MODAL
          ========================================================================= */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-headline">Upload New Doctor's Prescription</h3>
              <button 
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <Uploader type="prescriptions" onUploadComplete={() => setIsUploadOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Preview Slip Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-headline">Doctor Reconciliation Letter</h3>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-800">
              <p><strong>To:</strong> Dr. Rajiv Verma / Dr. S.N. Sharma</p>
              <p><strong>Patient:</strong> Ramesh Kumar (58/M, ABHA: 91-8276-1029-4412)</p>
              <p className="text-rose-700 font-bold">Subject: Automated Pharmacological Interaction Advisory</p>
              <p className="leading-relaxed">
                Patient is concurrently taking <strong>Crocin 650mg</strong> and <strong>Combiflam</strong> (total Paracetamol &gt;2,000mg/day). Additionally, co-administration of <strong>Eco-Sprin 75</strong> (Aspirin) with Ibuprofen significantly elevates upper GI bleed hazard.
              </p>
              <p className="text-emerald-800 font-semibold">Recommended Intervention: Discontinue Combiflam; switch to single-agent analgesic + maintain gastroprotective coverage.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#00221b] text-white rounded-xl text-xs font-bold"
              >
                Print Slip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SafetyMatrixPage;
