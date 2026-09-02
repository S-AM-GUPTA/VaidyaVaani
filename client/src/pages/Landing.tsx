import React, { useState, useRef } from 'react';
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
  Activity, 
  Mic, 
  UploadCloud, 
  Camera, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Sparkles, 
  TrendingDown
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Uploader from '../components/Uploader';
import { useAuth } from '../context/AuthContext';
import { MEDICINES_DATABASE, type MedicineRecord } from '../services/clinicalData';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Search & Generic Salt Finder State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState<MedicineRecord | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'prescriptions' | 'reports'>('prescriptions');

  // Camera file input
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
    <div className="min-h-screen bg-[#fafcf9] text-slate-900 font-sans selection:bg-emerald-700 selection:text-white flex flex-col relative overflow-x-hidden">
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

      {/* =========================================================================
          1. HERO SECTION: Exact Match with Reference Design
          ========================================================================= */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto w-full">
        
        {/* Soft Botanical Leaf Accents in Background */}
        <div className="absolute top-10 left-0 w-48 h-48 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline, Real-Time Salt Search, Popular Chips */}
          <div className="lg:col-span-6 space-y-6 text-left relative z-20">
            
            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-serif font-black tracking-tight leading-[1.08] text-slate-900">
                Intelligent Health Information.
              </h1>
              <span className="text-3xl sm:text-4xl lg:text-[52px] font-serif font-extrabold text-[#1a472a] block tracking-tight">
                In Every Language.
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal pt-1">
              VaidyaVaani brings together clinical intelligence, generic salt discovery and regional voice knowledge to make health information accessible and trustworthy for everyone.
            </p>

            {/* Interactive Search Bar with Live Generic Matching */}
            <div className="relative max-w-xl">
              <div className="relative flex items-center bg-white border border-slate-200/90 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] pl-4 pr-2 py-1.5 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/10 transition-all">
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
                  className="w-10 h-10 rounded-full bg-[#1a472a] hover:bg-[#143720] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-xs"
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
                className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 text-xs transition-colors cursor-pointer shadow-2xs"
              >
                Paracetamol
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Augmentin 625 Duo');
                  const found = MEDICINES_DATABASE.find(m => m.brand.includes('Augmentin'));
                  if (found) setSelectedMed(found);
                }}
                className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 text-xs transition-colors cursor-pointer shadow-2xs"
              >
                Amoxicillin 500mg
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Shelcal 500');
                  const found = MEDICINES_DATABASE.find(m => m.brand.includes('Shelcal'));
                  if (found) setSelectedMed(found);
                }}
                className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 text-xs transition-colors cursor-pointer shadow-2xs"
              >
                Vitamin D3
              </button>
              <button
                onClick={() => {
                  setSearchQuery('Glycomet 500mg');
                  const found = MEDICINES_DATABASE.find(m => m.brand.includes('Glycomet'));
                  if (found) setSelectedMed(found);
                }}
                className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 text-xs transition-colors cursor-pointer shadow-2xs"
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
                className="p-4 rounded-2xl bg-white border border-emerald-300 shadow-md max-w-xl relative"
              >
                <button
                  onClick={() => setSelectedMed(null)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Generic Salt Equivalence
                  </span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 font-mono">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {selectedMed.savingsPct}% Savings Available
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-headline">{selectedMed.brand}</h4>
                <p className="text-xs text-slate-600 font-mono mt-0.5">Active Salt: <strong className="text-emerald-900">{selectedMed.salt}</strong></p>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Brand Name Price:</span>
                    <strong className="text-slate-900 font-mono">₹{selectedMed.brandPrice}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-medium block text-[11px]">Generic Substitute:</span>
                    <strong className="text-emerald-800 font-mono">₹{selectedMed.genericPrice} ({selectedMed.genericMaker})</strong>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Right Column: Orbital Multi-Lingual Node Diagram */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] select-none">
            
            {/* Concentric Dashed Orbit Circles */}
            <div className="absolute w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] rounded-full border border-dashed border-slate-300/80 pointer-events-none" />
            <div className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full border border-dashed border-emerald-200/80 pointer-events-none" />

            {/* Central Green Leaf Emblem Circle */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-emerald-100 shadow-[0_8px_30px_rgba(16,185,129,0.15)] flex items-center justify-center z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-800" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A9.49 9.49 0 0 0 12 21c6.08 0 10-4.92 10-11 0-.6-.05-1.19-.14-1.77L20.5 7.6A9.9 9.9 0 0 0 17 8zm-4.7 10.7a7.6 7.6 0 0 1-3.2-1.7c1.7-3.6 3.6-6.2 8.7-7.9a8 8 0 0 1-5.5 9.6zM7.2 4.4a8 8 0 0 1 8.6 1.4c-4.3 1.5-6.8 3.8-8.2 6.9A7.8 7.8 0 0 1 7.2 4.4z"/>
                </svg>
              </div>
            </div>

            {/* Orbiting Language Nodes */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold font-mono shadow-xs">
              हिंदी
            </div>
            <div className="absolute left-6 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold font-mono shadow-xs">
              বাংলা
            </div>
            <div className="absolute right-6 bottom-16 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold font-mono shadow-xs">
              தமிழ்
            </div>

            {/* 3 Floating Orbital Cards (Matching Reference Screenshot) */}
            
            {/* Card 1: Clinical Intelligence (Top Left) */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="absolute -top-4 -left-2 sm:left-4 max-w-[210px] bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200 shadow-lg text-left z-20"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-headline">Clinical Intelligence</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">
                Evidence based insights from trusted medical sources.
              </p>
              <Link 
                to="/services" 
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-900 mt-2"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>

            {/* Card 2: Generic Salt Finder (Top Right) */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="absolute top-8 -right-2 sm:right-2 max-w-[210px] bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200 shadow-lg text-left z-20"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
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
                className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-800 mt-2 cursor-pointer"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </motion.div>

            {/* Card 3: Regional Voice Vault (Bottom Left/Center) */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="absolute bottom-0 left-4 sm:left-12 max-w-[220px] bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200 shadow-lg text-left z-20"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                  <Mic className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-headline">Regional Voice Vault</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">
                Listen and learn health information in your own language.
              </p>
              <Link 
                to="/regional-care" 
                className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-800 mt-2"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          2. VALUE STRIP: 4 Core Trust Pillars (Matching Screenshot)
          ========================================================================= */}
      <section className="py-6 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            
            {/* Pillar 1: Evidence Based */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-headline">Evidence Based</h4>
                <p className="text-xs text-slate-500 mt-0.5">Trusted medical information</p>
              </div>
            </div>

            {/* Pillar 2: Multi-Lingual */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                <Users className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-headline">Multi-Lingual</h4>
                <p className="text-xs text-slate-500 mt-0.5">Information in your language</p>
              </div>
            </div>

            {/* Pillar 3: Transparent */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                <Lock className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-headline">Transparent</h4>
                <p className="text-xs text-slate-500 mt-0.5">Clear, reliable and unbiased</p>
              </div>
            </div>

            {/* Pillar 4: Accessible */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                <UserCheck className="w-6 h-6 text-emerald-800" />
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
          3. "EXPLORE VAIDYAVAANI" SECTION (Matching Screenshot)
          ========================================================================= */}
      <section id="clinical-intelligence" className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto w-full text-center">
        
        {/* Section Header with Green Underline */}
        <div className="inline-block mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 tracking-tight">
            Explore VaidyaVaani
          </h2>
          <div className="w-12 h-1 bg-[#1a472a] rounded-full mx-auto mt-2" />
        </div>

        {/* 3 Wide Interactive Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          
          {/* Card 1: Clinical Intelligence */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-6 border border-emerald-100">
                <Activity className="w-6 h-6 text-emerald-800" />
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
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a472a] hover:text-[#143720] transition-colors group"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Generic Salt Finder */}
          <div id="generic-finder" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-6 border border-purple-100">
                <Pill className="w-6 h-6 text-purple-700" />
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
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800 transition-colors group cursor-pointer"
              >
                <span>Find Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: Regional Voice Vault */}
          <div id="voice-vault" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-6 border border-sky-100">
                <Mic className="w-6 h-6 text-sky-700" />
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
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 transition-colors group"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. INTEGRATED PRESCRIPTION SCANNER & OCR WORKSPACE
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-[1360px] mx-auto">
          
          <div className="max-w-3xl mb-12 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prescription Reading & Lab Ingestion</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-headline">
              Upload Any Prescription or Diagnostic Report
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Extract handwriting, check dangerous drug interactions, and hear dosage instructions read aloud.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Interactive Upload Actions */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <h3 className="text-xl font-bold text-slate-900 font-headline">
                Start with a photo or digital PDF
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Take a quick photo using your phone camera or upload clinic printouts to translate cursive handwriting into structured generic medicines.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openUploadModal('prescriptions')}
                  className="bg-[#1a472a] hover:bg-[#143720] text-white px-5 py-3 rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Prescription</span>
                </button>

                <button
                  onClick={handleCameraScan}
                  className="bg-white border border-slate-200 hover:border-slate-300 text-slate-800 px-4 py-3 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Camera Scan</span>
                </button>

                <Link
                  to="/lab-decoder"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <span>Lab Decoder</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-500">
                <span>✓ 100% Client Encrypted</span>
                <span>✓ Multi-Engine OCR</span>
              </div>
            </div>

            {/* Right Column: Mini Prescription Preview */}
            <div className="lg:col-span-6 bg-[#f8fafc] rounded-2xl p-5 sm:p-6 border border-slate-200/90 text-left space-y-3 font-serif">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs text-slate-400 font-sans font-medium">
                <span>Prescription Document #4829</span>
                <span className="text-emerald-700 font-bold font-mono">Vision Pipeline Active</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-300">
                <div className="flex justify-between text-[10px] font-mono font-bold text-emerald-800">
                  <span>REGION 1: ANTIBIOTIC</span>
                  <span>94% CONFIDENCE</span>
                </div>
                <p className="text-xs sm:text-sm italic font-semibold text-slate-800 mt-1">
                  1. Tab. Augmentin 625 Duo — 1 tab bd pc x 5 days
                </p>
                <p className="text-[11px] text-emerald-900 font-sans mt-1">
                  Generic Salt: Amoxicillin + Clavulanic Acid (Save 71% via Jan Aushadhi)
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500">
                  <span>REGION 2: GASTROPROTECTIVE</span>
                  <span>92% CONFIDENCE</span>
                </div>
                <p className="text-xs sm:text-sm italic text-slate-700 mt-1">
                  2. Cap. Pantocid DSR — 1 cap od ac 30m before breakfast
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. ABOUT US & RESOURCES ANCHORS
          ========================================================================= */}
      <section id="about-us" className="py-16 md:py-20 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto w-full text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase text-emerald-800 font-bold">About VaidyaVaani</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 tracking-tight">
              Bridging the gap between medical documents and patient understanding.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              VaidyaVaani is built for families and caregivers across India. By pairing specialized transformer handwriting recognition with verified generic salt mapping and multi-dialect voice synthesis, we ensure no patient is left in the dark about their prescriptions.
            </p>
          </div>

          <div id="resources" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-headline">Clinical Guidelines & Resources</h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>CDSCO & Jan Aushadhi Generic Pharmaceutical Database</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>NABL Diagnostic Pathology Blood Range Index</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>7 Indian Regional Language Multimodal Voice Engines</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FOOTER
          ========================================================================= */}
      <Footer />

      {/* =========================================================================
          7. INTERACTIVE UPLOAD MODAL
          ========================================================================= */}
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
