import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Lock, 
  UserCheck, 
  Pill, 
  Mic, 
  UploadCloud, 
  Camera, 
  X, 
  ChevronRight, 
  Sparkles, 
  TrendingDown,
  Brain,
  Zap,
  Sliders,
  Play,
  Pause,
  Cpu
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Uploader from '../components/Uploader';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  MEDICINES_DATABASE, 
  BIOMARKERS_EVALUATOR, 
  checkDrugPairInteraction, 
  type MedicineRecord 
} from '../services/clinicalData';

// Botanical Leaf SVG Illustration Component
const BotanicalLeaves = ({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    style={style}
  >
    <g opacity="0.35">
      <path d="M20 180C60 140 120 100 180 20" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M180 20C170 60 140 70 120 60C100 50 140 20 180 20Z" fill="#52b788" opacity="0.6" />
      <path d="M140 60C110 80 90 60 100 40C110 20 140 40 140 60Z" fill="#74c69d" opacity="0.7" />
      <path d="M120 80C140 110 120 130 100 120C80 110 100 80 120 80Z" fill="#40916c" opacity="0.6" />
      <path d="M80 120C60 140 40 120 50 100C60 80 80 100 80 120Z" fill="#95d5b2" opacity="0.7" />
      <path d="M60 140C80 170 60 190 40 180C20 170 40 140 60 140Z" fill="#2d6a4f" opacity="0.5" />
    </g>
  </svg>
);

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentLanguage } = useLanguage();

  // 1. Generic Salt Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState<MedicineRecord | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // 2. Upload Modal & Camera Input
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'prescriptions' | 'reports'>('prescriptions');
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 3. Prescription Optical Laser Scanner Cycle & Active Bounding Box
  const [scanProgress, setScanProgress] = useState(0);
  const [activeRegionIndex, setActiveRegionIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // 4. In-Page Pathology Biomarker Simulator
  const [bioKey, setBioKey] = useState<'glucose' | 'hba1c' | 'ldl' | 'creatinine'>('glucose');
  const [bioValue, setBioValue] = useState<number>(115);
  const currentBio = BIOMARKERS_EVALUATOR[bioKey];
  const evalResult = currentBio.evaluate(bioValue);

  // 5. In-Page Drug Interaction Radar Simulator
  const [drugA, setDrugA] = useState('Warfarin 5mg');
  const [drugB, setDrugB] = useState('Aspirin 75mg');
  const [interactionResult, setInteractionResult] = useState(() => 
    checkDrugPairInteraction('Warfarin 5mg', 'Aspirin 75mg')
  );

  const handleRunRadar = (d1: string, d2: string) => {
    setDrugA(d1);
    setDrugB(d2);
    setInteractionResult(checkDrugPairInteraction(d1, d2));
  };

  // 6. In-Page Regional Voice Synthesizer
  const [isSpeakingVoice, setIsSpeakingVoice] = useState(false);

  const handlePlayVoice = (text?: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeakingVoice) {
      window.speechSynthesis.cancel();
      setIsSpeakingVoice(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text || currentLanguage.defaultSpeechText);
    utterance.lang = currentLanguage.speechCode;
    utterance.rate = 0.92;
    utterance.onstart = () => setIsSpeakingVoice(true);
    utterance.onend = () => setIsSpeakingVoice(false);
    utterance.onerror = () => setIsSpeakingVoice(false);
    window.speechSynthesis.speak(utterance);
  };

  // Filtered medicines based on search
  const filteredMeds = searchQuery.trim() === '' ? [] : MEDICINES_DATABASE.filter(m => 
    m.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.salt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.useFor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openUploadModal = (type: 'prescriptions' | 'reports') => {
    setUploadType(type);
    setIsUploadModalOpen(true);
  };

  const handleCameraScan = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleCameraFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      openUploadModal('prescriptions');
    }
  };

  const handleUploadComplete = () => {
    setIsUploadModalOpen(false);
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleSelectMedicine = (med: MedicineRecord) => {
    setSelectedMed(med);
    setSearchQuery(med.brand);
    setIsSearchFocused(false);
  };

  return (
    <div className="min-h-screen bg-[#fafcf9] text-slate-900 font-sans selection:bg-[#1e5631] selection:text-white flex flex-col relative overflow-x-hidden">
      <Navbar 
        onOpenUpload={openUploadModal} 
        onOpenSearch={() => {
          const el = document.getElementById('search-box');
          if (el) el.focus();
        }}
      />

      {/* Hidden camera input */}
      <input 
        type="file" 
        ref={cameraInputRef} 
        accept="image/*" 
        capture="environment" 
        onChange={handleCameraFileSelected} 
        className="hidden" 
      />

      {/* Botanical Foliage Accents */}
      <BotanicalLeaves className="absolute -top-10 -left-10 w-72 h-72 rotate-12 -z-10" />
      <BotanicalLeaves className="absolute top-20 right-0 w-80 h-80 -rotate-45 -z-10" />
      <BotanicalLeaves className="absolute top-[850px] -left-16 w-96 h-96 rotate-90 -z-10" />
      <BotanicalLeaves className="absolute bottom-40 -right-10 w-80 h-80 180deg -z-10" />

      {/* =========================================================================
          1. HERO SECTION: Merged Editorial Headline & Orbital Graphic
          ========================================================================= */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline, Real-Time Salt Search, Popular Chips */}
          <div className="lg:col-span-6 space-y-6 text-left relative z-20">
            
            {/* Main Editorial Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-editorial font-bold tracking-tight leading-[1.12] text-slate-900">
                Intelligent Health Information.
              </h1>
              <span className="text-3xl sm:text-4xl lg:text-[48px] font-editorial font-bold text-[#1e5631] block tracking-tight">
                In Every Language.
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal pt-1">
              VaidyaVaani brings together clinical intelligence, generic salt discovery and regional voice knowledge to make health information accessible and trustworthy for everyone.
            </p>

            {/* Interactive Search Bar with Live Generic Matching */}
            <div className="relative max-w-xl" id="generic-finder">
              <div className="relative flex items-center bg-white border border-slate-200/90 rounded-full shadow-[0_6px_25px_rgba(0,0,0,0.04)] pl-4 pr-2 py-1.5 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/10 transition-all">
                <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
                <input
                  id="search-box"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search medicine, salt, condition or any health topic..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (filteredMeds.length > 0) {
                      handleSelectMedicine(filteredMeds[0]);
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-[#1e5631] hover:bg-[#143d22] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-xs"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Real-time Matching Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 max-h-80 overflow-y-auto">
                  {filteredMeds.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-mono">
                      No exact medicine match. Try "Paracetamol", "Augmentin", "Telma", or "Dolo".
                    </div>
                  ) : (
                    filteredMeds.map((med) => (
                      <div
                        key={med.id}
                        onClick={() => handleSelectMedicine(med)}
                        className="p-3 rounded-xl hover:bg-emerald-50/70 border-b border-slate-100 last:border-0 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-900 font-headline">{med.brand}</p>
                          <p className="text-[11px] text-emerald-800 font-medium font-mono">{med.salt}</p>
                          <p className="text-[10px] text-slate-400">{med.useFor}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Save {med.savingsPct}%
                          </span>
                          <p className="text-[11px] text-slate-500 mt-1">
                            <span className="line-through text-slate-400">₹{med.brandPrice}</span> → <strong className="text-slate-900">₹{med.genericPrice}</strong>
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Popular Searches Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
              <span className="text-slate-600 font-medium">Popular searches:</span>
              <button
                onClick={() => {
                  setSearchQuery('Dolo 650mg');
                  const found = MEDICINES_DATABASE.find(m => m.brand.includes('Dolo'));
                  if (found) setSelectedMed(found);
                }}
                className="px-3.5 py-1 rounded-full bg-white border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 text-xs transition-colors cursor-pointer shadow-2xs"
              >
                Paracetamol
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Augmentin 625 Duo');
                  const found = MEDICINES_DATABASE.find(m => m.brand.includes('Augmentin'));
                  if (found) setSelectedMed(found);
                }}
                className="px-3.5 py-1 rounded-full bg-white border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 text-xs transition-colors cursor-pointer shadow-2xs"
              >
                Amoxicillin 500mg
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Shelcal 500');
                  const found = MEDICINES_DATABASE.find(m => m.brand.includes('Shelcal'));
                  if (found) setSelectedMed(found);
                }}
                className="px-3.5 py-1 rounded-full bg-white border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 text-xs transition-colors cursor-pointer shadow-2xs"
              >
                Vitamin D3
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Glycomet 500mg');
                  const found = MEDICINES_DATABASE.find(m => m.brand.includes('Glycomet'));
                  if (found) setSelectedMed(found);
                }}
                className="px-3.5 py-1 rounded-full bg-white border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 text-xs transition-colors cursor-pointer shadow-2xs"
              >
                Diabetes
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('search-box');
                  if (el) el.focus();
                }}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors cursor-pointer font-medium"
              >
                More &gt;
              </button>
            </div>

            {/* Selected Medicine Popover Card */}
            {selectedMed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl bg-white border border-emerald-300 shadow-xl max-w-xl relative text-left"
              >
                <button
                  onClick={() => setSelectedMed(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Generic Salt Equivalence
                  </span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Save {selectedMed.savingsPct}% with Jan Aushadhi
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 font-headline">{selectedMed.brand}</h4>
                <p className="text-xs text-slate-600 font-mono mt-0.5">Active Salt: <strong className="text-emerald-900">{selectedMed.salt}</strong></p>
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Brand Name Price:</span>
                    <strong className="text-slate-900 font-mono text-sm">₹{selectedMed.brandPrice}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-medium block text-[11px]">Generic Substitute:</span>
                    <strong className="text-emerald-800 font-mono text-sm">₹{selectedMed.genericPrice} ({selectedMed.genericMaker})</strong>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Action Upload Buttons in Hero */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openUploadModal('prescriptions')}
                className="bg-[#1e5631] hover:bg-[#143d22] text-white px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload a Prescription</span>
              </button>

              <button
                onClick={handleCameraScan}
                className="bg-white border border-slate-200 hover:border-slate-300 text-slate-800 px-4 py-3 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                title="Scan Prescription via Camera"
              >
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>Camera Scan</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('prescription-ocr');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-3 flex items-center gap-1 cursor-pointer"
              >
                <span>Live OCR Demo</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

          </div>

          {/* Right Column: Orbital Multi-Lingual Node Diagram */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[480px] select-none">
            
            {/* Concentric Dashed Orbit Rings */}
            <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full border border-dashed border-emerald-900/15 pointer-events-none" />
            <div className="absolute w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] rounded-full border border-dashed border-emerald-700/20 pointer-events-none" />

            {/* Central Green Leaf Emblem Circle */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white border border-emerald-100 shadow-[0_10px_35px_rgba(30,86,49,0.12)] flex items-center justify-center z-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#f0f7f2] text-[#1e5631] flex items-center justify-center">
                <svg className="w-12 h-12 text-[#1e5631]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A9.49 9.49 0 0 0 12 21c6.08 0 10-4.92 10-11 0-.6-.05-1.19-.14-1.77L20.5 7.6A9.9 9.9 0 0 0 17 8zm-4.7 10.7a7.6 7.6 0 0 1-3.2-1.7c1.7-3.6 3.6-6.2 8.7-7.9a8 8 0 0 1-5.5 9.6zM7.2 4.4a8 8 0 0 1 8.6 1.4c-4.3 1.5-6.8 3.8-8.2 6.9A7.8 7.8 0 0 1 7.2 4.4z"/>
                </svg>
              </div>
            </div>

            {/* Orbiting Language Nodes */}
            <div className="absolute top-2 right-24 sm:right-32 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold font-mono shadow-xs">
              हिंदी
            </div>
            <div className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold font-mono shadow-xs">
              বাংলা
            </div>
            <div className="absolute right-4 sm:right-10 bottom-20 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold font-mono shadow-xs">
              தமிழ்
            </div>

            {/* 3 Floating Orbital Cards (Matching Reference Screenshot) */}
            
            {/* Card 1: Clinical Intelligence (Top Left) */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="absolute -top-6 left-0 sm:left-6 max-w-[210px] bg-white/95 backdrop-blur-sm p-4 rounded-3xl border border-slate-200/90 shadow-[0_12px_30px_rgba(0,0,0,0.06)] text-left z-20"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#edf7ee] text-[#1e5631] flex items-center justify-center shrink-0 border border-emerald-100">
                  <Brain className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-headline">Clinical Intelligence</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">
                Evidence based insights from trusted medical sources.
              </p>
              <Link 
                to="/services" 
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1e5631] hover:text-emerald-800 mt-2.5 group"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Card 2: Generic Salt Finder (Top Right) */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="absolute top-8 right-0 sm:right-4 max-w-[210px] bg-white/95 backdrop-blur-sm p-4 rounded-3xl border border-slate-200/90 shadow-[0_12px_30px_rgba(0,0,0,0.06)] text-left z-20"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#f5eeff] text-[#6b21a8] flex items-center justify-center shrink-0 border border-purple-100">
                  <Pill className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-headline">Generic Salt Finder</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">
                Find the generic salt, composition, uses and alternatives.
              </p>
              <button 
                onClick={() => {
                  const el = document.getElementById('search-box');
                  if (el) el.focus();
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6b21a8] hover:text-purple-900 mt-2.5 cursor-pointer group"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 3: Regional Voice Vault (Bottom Left/Center) */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="absolute bottom-0 left-6 sm:left-14 max-w-[220px] bg-white/95 backdrop-blur-sm p-4 rounded-3xl border border-slate-200/90 shadow-[0_12px_30px_rgba(0,0,0,0.06)] text-left z-20"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#eaf4fe] text-[#0369a1] flex items-center justify-center shrink-0 border border-sky-100">
                  <Mic className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-headline">Regional Voice Vault</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">
                Listen and learn health information in your own language.
              </p>
              <Link 
                to="/regional-care" 
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0369a1] hover:text-sky-800 mt-2.5 group"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          2. VALUE STRIP: 4 Core Trust Pillars
          ========================================================================= */}
      <section className="py-6 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto w-full">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            
            {/* Pillar 1: Evidence Based */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#edf7ee] text-[#1e5631] flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-6 h-6 text-[#1e5631]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-headline">Evidence Based</h4>
                <p className="text-xs text-slate-500 mt-0.5">Trusted medical information</p>
              </div>
            </div>

            {/* Pillar 2: Multi-Lingual */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#edf7ee] text-[#1e5631] flex items-center justify-center shrink-0 border border-emerald-100">
                <Users className="w-6 h-6 text-[#1e5631]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-headline">Multi-Lingual</h4>
                <p className="text-xs text-slate-500 mt-0.5">Information in your language</p>
              </div>
            </div>

            {/* Pillar 3: Transparent */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#edf7ee] text-[#1e5631] flex items-center justify-center shrink-0 border border-emerald-100">
                <Lock className="w-6 h-6 text-[#1e5631]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-headline">Transparent</h4>
                <p className="text-xs text-slate-500 mt-0.5">Clear, reliable and unbiased</p>
              </div>
            </div>

            {/* Pillar 4: Accessible */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#edf7ee] text-[#1e5631] flex items-center justify-center shrink-0 border border-emerald-100">
                <UserCheck className="w-6 h-6 text-[#1e5631]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-headline">Accessible</h4>
                <p className="text-xs text-slate-500 mt-0.5">For everyone, everywhere</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. "EXPLORE VAIDYAVAANI" SECTION
          ========================================================================= */}
      <section id="clinical-intelligence" className="py-16 md:py-20 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto w-full text-center">
        
        {/* Section Header with Green Underline */}
        <div className="inline-block mb-12">
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 tracking-tight">
            Explore VaidyaVaani
          </h2>
          <div className="w-12 h-1 bg-[#1e5631] rounded-full mx-auto mt-2" />
        </div>

        {/* 3 Wide Interactive Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          
          {/* Card 1: Clinical Intelligence */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#edf7ee] text-[#1e5631] flex items-center justify-center mb-6 border border-emerald-100 shadow-2xs">
                <Brain className="w-7 h-7 text-[#1e5631]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-headline mb-2">
                Clinical Intelligence
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Smart search and AI-powered insights from clinical data and trusted sources.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e5631] hover:text-emerald-800 transition-colors group"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Generic Salt Finder */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#f5eeff] text-[#6b21a8] flex items-center justify-center mb-6 border border-purple-100 shadow-2xs">
                <Pill className="w-7 h-7 text-[#6b21a8]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-headline mb-2">
                Generic Salt Finder
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Find the right generic salt, composition, strength, uses and alternatives.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => {
                  const el = document.getElementById('search-box');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    el.focus();
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b21a8] hover:text-purple-900 transition-colors group cursor-pointer"
              >
                <span>Find Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: Regional Voice Vault */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#eaf4fe] text-[#0369a1] flex items-center justify-center mb-6 border border-sky-100 shadow-2xs">
                <Mic className="w-7 h-7 text-[#0369a1]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-headline mb-2">
                Regional Voice Vault
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Discover health knowledge in regional languages through voice.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <Link
                to="/regional-care"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0369a1] hover:text-sky-800 transition-colors group"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. INTERACTIVE PRESCRIPTION OCR & VISION PIPELINE SECTION
          ========================================================================= */}
      <section id="prescription-ocr" className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-white border-t border-slate-200/80">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="max-w-3xl mb-12 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Engine Transformer OCR (RxHandBD + PaddleOCR)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-slate-900 tracking-tight">
              Built for the Prescriptions People Actually Receive
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-normal">
              Messy handwriting shouldn't prevent you from understanding your medicines. Inspect our live dual-engine extraction below.
            </p>
          </div>

          <div className="bg-slate-50/80 rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Interactive Prescription Laser Scanner */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-sm text-left font-serif">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-mono text-slate-500 font-sans">
                <span>Prescription Document: #0821-DEL</span>
                <span className="text-emerald-700 font-bold">Dual-Engine Active</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 relative space-y-4">
                {/* Active Laser Sweep */}
                <motion.div 
                  className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)] z-10"
                  style={{ top: `${scanProgress}%` }}
                />

                {/* Region 1 */}
                <div 
                  onClick={() => setActiveRegionIndex(0)}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    activeRegionIndex === 0 
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-800 mb-1">
                    <span>01: ANTIBIOTIC SCRIPT</span>
                    <span className="text-emerald-700">94% CONFIDENCE</span>
                  </div>
                  <p className="text-sm italic font-semibold text-slate-800">
                    1. Tab. Augmentin 625 Duo — 1 tab bd pc x 5 days
                  </p>
                </div>

                {/* Region 2 */}
                <div 
                  onClick={() => setActiveRegionIndex(1)}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    activeRegionIndex === 1 
                      ? 'border-amber-500 bg-amber-50/50 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-800 mb-1">
                    <span>02: GASTROPROTECTIVE</span>
                    <span className="text-amber-700">68% REVIEW SUGGESTED</span>
                  </div>
                  <p className="text-sm italic text-slate-700">
                    2. Cap. Pantocid DSR — 1 cap od ac 30m before breakfast
                  </p>
                </div>

                <p className="text-[11px] text-slate-400 font-sans italic pt-1">
                  * Click any bounding region to inspect matched pharmaceutical salt, generic alternative, and dosage rules.
                </p>
              </div>
            </div>

            {/* Right Column: Structured Extracted Information */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Matched Clinical Entity</span>
                <h3 className="text-2xl font-bold text-slate-900 font-headline mt-1">
                  {activeRegionIndex === 0 ? 'Augmentin 625 Duo' : 'Pantocid DSR'}
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-500">Active Salt:</span>
                  <strong className="text-slate-900 font-bold">
                    {activeRegionIndex === 0 ? 'Amoxicillin + Clavulanic Acid' : 'Pantoprazole + Domperidone'}
                  </strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-500">Timing & Schedule:</span>
                  <strong className="text-slate-900 font-bold">
                    {activeRegionIndex === 0 ? 'Twice Daily (After Food)' : 'Early Morning (Empty Stomach)'}
                  </strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-500">Generic Alternative:</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-xs">
                    {activeRegionIndex === 0 ? 'Jan Aushadhi (Save 71%)' : 'Generic Pantoprazole (Save 65%)'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <strong>Human-in-the-Loop Safety:</strong>
                <p className="mt-0.5 leading-relaxed">
                  When handwriting confidence is lower, VaidyaVaani flags the characters for quick patient verification rather than guessing dangerous medicine strengths.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => openUploadModal('prescriptions')}
                  className="bg-[#1e5631] hover:bg-[#143d22] text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Your Prescription</span>
                </button>
                <button
                  onClick={handleCameraScan}
                  className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Scan Camera</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          5. INTERACTIVE LIVE LAB BIOMARKER DECODER
          ========================================================= */}
      <section className="py-16 md:py-20 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto w-full text-left">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>NABL Pathology Biomarker Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 tracking-tight">
            Decode Blood Tests & Pathology Ranges
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Test any biomarker value to receive instant plain-language clinical explanations and doctor consultation talking points.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* Biomarker Selector Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => { setBioKey('glucose'); setBioValue(115); }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                bioKey === 'glucose' ? 'bg-[#1e5631] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Fasting Blood Sugar
            </button>
            <button
              onClick={() => { setBioKey('hba1c'); setBioValue(6.1); }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                bioKey === 'hba1c' ? 'bg-[#1e5631] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              HbA1c (3-Month Avg)
            </button>
            <button
              onClick={() => { setBioKey('ldl'); setBioValue(135); }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                bioKey === 'ldl' ? 'bg-[#1e5631] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              LDL Cholesterol
            </button>
            <button
              onClick={() => { setBioKey('creatinine'); setBioValue(1.3); }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                bioKey === 'creatinine' ? 'bg-[#1e5631] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Serum Creatinine (Kidney)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold uppercase text-slate-500">{currentBio.name}:</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                    {bioValue} <span className="text-xs text-slate-500 font-normal">{currentBio.unit}</span>
                  </span>
                </div>

                <input 
                  type="range"
                  min={bioKey === 'hba1c' ? '3.5' : bioKey === 'creatinine' ? '0.4' : '40'}
                  max={bioKey === 'hba1c' ? '12.0' : bioKey === 'creatinine' ? '4.0' : '300'}
                  step={bioKey === 'hba1c' ? '0.1' : bioKey === 'creatinine' ? '0.1' : '1'}
                  value={bioValue}
                  onChange={(e) => setBioValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                />

                <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 font-bold">
                  <span>Normal Range: {currentBio.normalMin} – {currentBio.normalMax} {currentBio.unit}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap gap-2">
                <span className="text-[11px] font-mono text-slate-500 self-center font-bold">Presets:</span>
                <button
                  onClick={() => setBioValue(bioKey === 'glucose' ? 88 : bioKey === 'hba1c' ? 5.2 : bioKey === 'ldl' ? 85 : 0.9)}
                  className="text-[11px] font-mono px-3 py-1 bg-white border border-slate-200 rounded-full text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                >
                  Optimal Normal
                </button>
                <button
                  onClick={() => setBioValue(bioKey === 'glucose' ? 112 : bioKey === 'hba1c' ? 6.1 : bioKey === 'ldl' ? 122 : 1.4)}
                  className="text-[11px] font-mono px-3 py-1 bg-white border border-slate-200 rounded-full text-amber-700 hover:bg-amber-50 cursor-pointer"
                >
                  Borderline / Mild
                </button>
                <button
                  onClick={() => setBioValue(bioKey === 'glucose' ? 168 : bioKey === 'hba1c' ? 8.4 : bioKey === 'ldl' ? 175 : 2.4)}
                  className="text-[11px] font-mono px-3 py-1 bg-white border border-slate-200 rounded-full text-rose-700 hover:bg-rose-50 cursor-pointer"
                >
                  High / Alert
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Diagnostic Evaluation</span>
                    <h3 className="text-lg font-bold text-slate-900 font-headline">{evalResult.label}</h3>
                  </div>
                  <Link
                    to="/lab-decoder"
                    className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 font-mono"
                  >
                    <span>Full Lab Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-4">
                  {evalResult.explanation}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <div className="font-bold uppercase text-[10px] font-mono mb-1">Clinical Lifestyle Advisory:</div>
                <p className="leading-relaxed">{evalResult.lifestyleTip}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. INTERACTIVE DRUG-DRUG INTERACTION RADAR
          ========================================================= */}
      <section className="py-16 md:py-20 px-4 sm:px-8 lg:px-12 bg-white border-t border-slate-200/80 text-left">
        <div className="max-w-[1360px] mx-auto">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 mb-2">
              <Zap className="w-3.5 h-3.5 text-purple-700" />
              <span>Multi-Prescription Cross-Audit Radar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-slate-900 tracking-tight">
              Screen for Harmful Drug-Drug Interactions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select any two medicines prescribed by different doctors to check pharmacokinetic clashes, antacid timing conflicts, and dosage spacing rules.
            </p>
          </div>

          <div className="bg-slate-50/70 rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-6">
              <div className="md:col-span-5">
                <label className="block text-xs font-bold font-mono text-slate-700 mb-1.5">First Medicine (Drug A):</label>
                <select
                  value={drugA}
                  onChange={(e) => handleRunRadar(e.target.value, drugB)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600 cursor-pointer shadow-2xs"
                >
                  {MEDICINES_DATABASE.map(m => (
                    <option key={m.id} value={`${m.brand} (${m.salt})`}>{m.brand} — {m.category}</option>
                  ))}
                  <option value="Warfarin 5mg">Warfarin 5mg (Blood Thinner)</option>
                  <option value="Magnesium Antacid">Gelusil / Magnesium Antacid</option>
                  <option value="Radiological Contrast">Radiological CT Contrast</option>
                </select>
              </div>

              <div className="md:col-span-2 text-center text-xs font-mono font-bold text-slate-400">
                <span className="px-3 py-1 rounded-full bg-slate-200 border border-slate-300">VS</span>
              </div>

              <div className="md:col-span-5">
                <label className="block text-xs font-bold font-mono text-slate-700 mb-1.5">Second Medicine (Drug B):</label>
                <select
                  value={drugB}
                  onChange={(e) => handleRunRadar(drugA, e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600 cursor-pointer shadow-2xs"
                >
                  <option value="Ecosprin 75mg (Aspirin)">Ecosprin 75mg (Aspirin)</option>
                  <option value="Magnesium Antacid">Gelusil / Magnesium Antacid</option>
                  <option value="Shelcal 500 (Calcium)">Shelcal 500 (Calcium+D3)</option>
                  <option value="Radiological Contrast">Radiological CT Contrast</option>
                  {MEDICINES_DATABASE.map(m => (
                    <option key={m.id} value={`${m.brand} (${m.salt})`}>{m.brand} — {m.category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Screening Result</span>
                  <h4 className="text-base font-bold text-slate-900 font-headline">{interactionResult.title}</h4>
                </div>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                  interactionResult.severity === 'critical' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                  interactionResult.severity === 'moderate' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {interactionResult.severity === 'critical' ? 'Lethal Hazard Contraindication' :
                   interactionResult.severity === 'moderate' ? 'Spacing Advisory Required' : 'Safe Synergy'}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                <strong>Adverse Effect:</strong> {interactionResult.effect}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <strong>Pharmacist Protocol:</strong> {interactionResult.advisory}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. REGIONAL AUDIO VOICE DEMO BAR
          ========================================================= */}
      <section className="py-14 px-4 sm:px-8 lg:px-12 bg-[#f0f7f2] border-t border-slate-200 text-left">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <span className="text-xs font-mono font-bold uppercase text-[#1e5631]">Universal Multilingual Speech</span>
            <h3 className="text-2xl font-editorial font-bold text-slate-900">
              Listen to Medical Instructions in {currentLanguage.native}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              VaidyaVaani reads complex doctor schedules and warnings aloud for rural and elderly family caregivers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handlePlayVoice()}
              className="bg-[#1e5631] hover:bg-[#143d22] text-white px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              {isSpeakingVoice ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              <span>{isSpeakingVoice ? 'Pause Audio' : `Play in ${currentLanguage.native}`}</span>
            </button>

            <Link
              to="/regional-care"
              className="bg-white border border-slate-200 hover:border-slate-300 text-slate-800 px-5 py-3 rounded-full text-xs font-bold transition-all shadow-2xs"
            >
              Open Voice Studio
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          8. PRIVACY & SECURITY VAULT (DEEP OLED #0B1120)
          ========================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-[#0B1120] text-white">
        <div className="max-w-[1360px] mx-auto text-left">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Data Governance & Isolation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-white tracking-tight">
              Your Health Information Deserves Complete Privacy
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              We design with privacy as a non-negotiable standard. Your prescriptions, lab reports, and vitals reside in your personal isolated health vault.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white font-headline">Client-Side Privacy</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Documents are processed solely for personal health organization and clinical understanding.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white font-headline">Isolated Vault Storage</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Uploaded doctor slips and biomarker baselines reside inside your isolated profile with zero third-party monetization.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white font-headline">User Record Ownership</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export, backup, modify, or permanently purge your health documents from the database at any moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          9. FOOTER
          ========================================================= */}
      <Footer />

      {/* =========================================================
          10. INTERACTIVE UPLOAD MODAL
          ========================================================= */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-headline">
                    Upload {uploadType === 'prescriptions' ? 'Prescription' : 'Lab Report'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {uploadType === 'prescriptions'
                      ? 'Upload doctor prescription photo or PDF document'
                      : 'Upload pathology or diagnostic lab report'}
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5">
                <Uploader type={uploadType} onUploadComplete={handleUploadComplete} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Landing;
