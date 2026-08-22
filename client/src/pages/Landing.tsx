import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Pill, 
  Volume2, 
  VolumeX, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  Phone, 
  X, 
  Bot, 
  Send,
  Info,
  Clock,
  Building2
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { MEDICINES_DATABASE, checkDrugPairInteraction, type MedicineRecord, type InteractionCheckResult } from '../services/clinicalData';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentLanguage, setLanguage, speakText, stopSpeaking, isSpeaking } = useLanguage();

  // Search in Hero
  const [heroSearch, setHeroSearch] = useState('');
  const [searchResults, setSearchResults] = useState<MedicineRecord[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineRecord | null>(null);

  // Savings Calculator State
  const [monthlySpend, setMonthlySpend] = useState<number>(2500);
  const [selectedConditionBasket, setSelectedConditionBasket] = useState<string>('Custom');

  // Interactive Drug Interaction Radar State on Landing
  const [radarDrug1, setRadarDrug1] = useState('Warfarin 5mg');
  const [radarDrug2, setRadarDrug2] = useState('Aspirin 75mg');
  const [radarResult, setRadarResult] = useState<InteractionCheckResult>(() => 
    checkDrugPairInteraction('Warfarin 5mg', 'Aspirin 75mg')
  );

  // Floating AI Assistant Drawer
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: `Namaste! I am your VaidyaVaani clinical assistant. Ask me anything about medicine prices, generic salt alternatives, or prescription interaction safety in ${currentLanguage.native}!`
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Ingestion Modal
  const [isDemoUploadOpen, setIsDemoUploadOpen] = useState(false);

  // Medicine details speech
  const [isSpeakingMedDetails, setIsSpeakingMedDetails] = useState(false);

  // Search autocomplete effect
  useEffect(() => {
    if (heroSearch.trim().length > 0) {
      const q = heroSearch.toLowerCase();
      const filtered = MEDICINES_DATABASE.filter(m => 
        m.brand.toLowerCase().includes(q) || 
        m.salt.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.useFor.toLowerCase().includes(q)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [heroSearch]);

  // Drug Interaction Live Calculation
  useEffect(() => {
    const res = checkDrugPairInteraction(radarDrug1, radarDrug2);
    setRadarResult(res);
  }, [radarDrug1, radarDrug2]);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  // Speak medicine details
  const handleSpeakMedicine = (med: MedicineRecord) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (isSpeakingMedDetails) {
        setIsSpeakingMedDetails(false);
        return;
      }
      const textToSpeak = `${med.brand}. Salt composition: ${med.salt}. Indicative use: ${med.useFor}. Recommended generic alternative saves ${med.savingsPct} percent. How to take: ${med.dosageTip}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = currentLanguage.code === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.onend = () => setIsSpeakingMedDetails(false);
      utterance.onerror = () => setIsSpeakingMedDetails(false);
      setIsSpeakingMedDetails(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Preset Baskets for Calculator
  const handleSelectBasket = (name: string, spend: number) => {
    setSelectedConditionBasket(name);
    setMonthlySpend(spend);
  };

  // Assistant Query Handler
  const handleAssistantSend = (e: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery || assistantInput).trim();
    if (!query) return;

    setAssistantMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!customQuery) setAssistantInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      setIsAiTyping(false);
      const qLower = query.toLowerCase();
      let reply = '';

      if (qLower.includes('dolo') || qLower.includes('paracetamol')) {
        reply = `Dolo 650 contains Paracetamol (650mg). A branded strip costs ~₹34, whereas generic Jan Aushadhi Paracetamol 650mg costs only ₹11 (68% savings). Take after food, maximum 3-4 tablets daily.`;
      } else if (qLower.includes('augmentin') || qLower.includes('amoxicillin')) {
        reply = `Augmentin 625 contains Amoxicillin (500mg) + Clavulanic Acid (125mg). Branded costs ~₹224 vs ₹65 for generic bioequivalent (71% savings). Take at the start of a meal and complete the full prescribed course.`;
      } else if (qLower.includes('bp') || qLower.includes('antacid') || qLower.includes('spacing')) {
        reply = `Clinical Spacing Alert: Never take blood pressure medicines (like Atenolol or Telmisartan) together with aluminum/magnesium antacids. Antacids reduce BP medicine absorption by 35%. Always space them at least 2 hours apart!`;
      } else if (qLower.includes('sugar') || qLower.includes('hba1c') || qLower.includes('glucose')) {
        reply = `Clinical Reference: Normal fasting glucose is 70-99 mg/dL. An HbA1c below 5.7% is normal; 5.7% to 6.4% indicates prediabetes; 6.5% or above indicates diabetic range. Always consult an endocrinologist for dosage titration.`;
      } else {
        reply = `Under Indian CDSCO regulatory standards, generic medicines containing the identical active salt (API) at the same strength are bioequivalent to branded drugs and save up to 80% on monthly pharmacy expenses. You can verify your prescriptions in our Safety Matrix!`;
      }

      setAssistantMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 500);
  };

  const calculatedAnnualBranded = monthlySpend * 12;
  const calculatedAnnualGeneric = Math.round(monthlySpend * 0.22 * 12);
  const calculatedAnnualSavings = calculatedAnnualBranded - calculatedAnnualGeneric;
  const calculatedSavingsPct = Math.round((calculatedAnnualSavings / calculatedAnnualBranded) * 100);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col relative overflow-x-hidden">
      <Navbar />

      {/* =========================================================
          HERO SECTION: High-Trust Search & Clarity Engine
          ========================================================= */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-24 px-6 lg:px-12 bg-gradient-to-b from-emerald-50/60 via-white to-[#f8fafc] border-b border-slate-200/80">
        
        {/* Subtle Background Geometry */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-300/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>India's Medical Safety & Generic Salt Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
            Healthcare Clarity & Generic Savings. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              In Every Indian Language.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            Find generic salt alternatives that save up to 80%, cross-check multi-doctor prescriptions for dangerous drug interactions, decode blood reports, and hear voice guidance in 7 regional dialects.
          </p>

          {/* =========================================================
              INTERACTIVE HERO SEARCH: Live Medicine & Salt Finder
              ========================================================= */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="relative flex items-center bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/10 shadow-lg transition-all p-2">
              <Search className="w-5 h-5 text-emerald-600 ml-3 mr-2 shrink-0" />
              
              <input 
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search any medicine (e.g. Dolo 650, Augmentin, Telma, Pantocid)..."
                className="w-full py-2.5 sm:py-3.5 text-sm sm:text-base font-medium outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
              />

              {heroSearch && (
                <button 
                  onClick={() => setHeroSearch('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button 
                onClick={() => {
                  if (searchResults.length > 0) {
                    setSelectedMedicine(searchResults[0]);
                  } else {
                    setHeroSearch('Dolo');
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
              >
                <span>Find Salt</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Autocomplete Dropdown */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50 text-left max-h-96 overflow-y-auto"
                >
                  <div className="text-[11px] font-mono font-bold text-slate-400 uppercase px-3 py-1.5 border-b border-slate-100 flex justify-between">
                    <span>Matches Found ({searchResults.length} Generics Available)</span>
                    <span className="text-emerald-600">Click to inspect salt details</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {searchResults.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setSelectedMedicine(item);
                          setSearchResults([]);
                        }}
                        className="p-3.5 hover:bg-emerald-50/50 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-4 group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {item.brand}
                            </span>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-xs text-emerald-700 font-mono font-medium mt-0.5">
                            Salt: {item.salt}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{item.useFor}</div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs text-slate-400 line-through">₹{item.brandPrice}</div>
                          <div className="text-sm font-bold text-emerald-600 font-mono">₹{item.genericPrice}</div>
                          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Save {item.savingsPct}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-10 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Same Salt Composition Guaranteed
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Multi-Doctor Interaction Radar
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              7 Indian Regional Languages
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button 
              onClick={() => setIsDemoUploadOpen(true)}
              className="btn-med-primary py-3.5 px-6 text-sm flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Prescription OCR</span>
            </button>

            <Link 
              to="/safety-matrix" 
              className="btn-med-secondary py-3.5 px-6 text-sm flex items-center gap-2"
            >
              <span>Check Drug Interactions</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80">
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-headline">10,000+</div>
              <div className="text-xs text-slate-500 mt-0.5">Indian Medicines & Salts</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-headline">80%</div>
              <div className="text-xs text-slate-500 mt-0.5">Max Generic Savings</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 font-headline">7</div>
              <div className="text-xs text-slate-500 mt-0.5">Regional Dialects</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-headline">100%</div>
              <div className="text-xs text-slate-500 mt-0.5">Client Encrypted</div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          INTERACTIVE BENTO 1: MEDICINE SAVINGS CALCULATOR
          ========================================================= */}
      <section className="py-16 px-6 lg:px-12 max-w-[1280px] mx-auto w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 lg:p-12 overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Slider Controls */}
            <div className="lg:col-span-7">
              <div className="med-badge mb-3 font-mono">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Interactive Savings Estimator
              </div>

              <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">
                Calculate Your Family's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Annual Medicine Savings
                </span>
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-lg">
                Generic medicines with identical active pharmaceutical ingredients (API) cost up to 80% less. Select your family's chronic profile or drag the monthly expense slider below:
              </p>

              {/* Chronic Prescription Preset Chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => handleSelectBasket('Custom', 2500)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    selectedConditionBasket === 'Custom' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Custom Spend
                </button>
                <button
                  onClick={() => handleSelectBasket('Diabetes + BP', 3800)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    selectedConditionBasket === 'Diabetes + BP' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Diabetes + BP Basket (₹3.8k)
                </button>
                <button
                  onClick={() => handleSelectBasket('Senior Citizen Cardiac', 6500)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    selectedConditionBasket === 'Senior Citizen Cardiac' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Senior Cardiac Care (₹6.5k)
                </button>
                <button
                  onClick={() => handleSelectBasket('General Family', 1500)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    selectedConditionBasket === 'General Family' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Family Basic (₹1.5k)
                </button>
              </div>

              {/* Slider Control Box */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold uppercase text-slate-500">Current Monthly Spend:</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
                    ₹{monthlySpend.toLocaleString()}
                  </span>
                </div>

                <input 
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={monthlySpend}
                  onChange={(e) => {
                    setSelectedConditionBasket('Custom');
                    setMonthlySpend(Number(e.target.value));
                  }}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />

                <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 font-bold">
                  <span>₹500 / mo</span>
                  <span>₹5,000 / mo</span>
                  <span>₹10,000 / mo</span>
                </div>
              </div>
            </div>

            {/* Right: Projected Savings Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-8 text-center shadow-lg flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-100 mb-2">
                  Projected Yearly Savings
                </div>

                <div className="text-xs text-emerald-200 line-through mb-1">
                  Branded: ₹{calculatedAnnualBranded.toLocaleString()} / year
                </div>

                <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight my-2">
                  ₹{calculatedAnnualSavings.toLocaleString()}
                </div>

                <span className="inline-block bg-white/20 text-white text-xs font-bold font-mono px-3 py-1 rounded-full mb-6">
                  Save {calculatedSavingsPct}% on same salts
                </span>

                <p className="text-xs text-emerald-100 leading-relaxed mb-6">
                  Switching to bioequivalent CDSCO verified generic alternatives saves your family thousands annually with zero compromise on efficacy.
                </p>
              </div>

              <button 
                onClick={handleCtaClick}
                className="w-full bg-white hover:bg-emerald-50 text-emerald-800 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-colors"
              >
                Start Generic Prescription Audit
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          INTERACTIVE BENTO 2: POPULAR BRAND VS GENERIC SALT MATRIX
          ========================================================= */}
      <section className="py-16 px-6 lg:px-12 bg-white border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="med-badge mb-2 font-mono">
                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                Generic Salt Equivalence
              </div>
              <h2 className="font-headline text-3xl font-extrabold text-slate-900 tracking-tight">
                Top Prescribed Medicines vs Generic Salts
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Same active molecule, identical therapeutic outcome, fraction of the price.
              </p>
            </div>

            <Link 
              to="/safety-matrix" 
              className="btn-med-secondary text-xs font-semibold flex items-center gap-1.5 w-fit"
            >
              <span>Explore All 10,000+ Salts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MEDICINES_DATABASE.slice(0, 6).map((item) => (
              <div key={item.id} className="med-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">{item.category}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Save {item.savingsPct}%
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{item.brand}</h3>
                  <div className="text-xs font-mono font-bold text-emerald-700 mb-2">
                    Salt: {item.salt}
                  </div>
                  <p className="text-xs text-slate-500 mb-4">{item.useFor}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Brand: ₹{item.brandPrice}</span>
                    <span className="text-base font-extrabold text-slate-900 font-mono">Generic: ₹{item.genericPrice}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedMedicine(item)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================
          INTERACTIVE BENTO 3: MULTI-DOCTOR DRUG INTERACTION RADAR
          ========================================================= */}
      <section id="safety-matrix" className="py-20 bg-[#f8fafc] border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="med-badge mb-2 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Cross-Doctor Safety Radar
              </div>
              <h2 className="font-headline text-3xl font-extrabold text-slate-900 tracking-tight">
                Multi-Prescription Drug Interaction Screening
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                When different doctors prescribe medicines, dangerous cross-effects can occur. Select or choose a clinical pair below to simulate our live interaction radar:
              </p>
            </div>

            <Link 
              to="/safety-matrix" 
              className="btn-med-primary text-xs font-semibold flex items-center gap-1.5 w-fit shrink-0"
            >
              <span>Open Dedicated Radar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive Scenario Buttons */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-slate-400 mb-2">Live Test Scenarios:</div>
              
              <button 
                onClick={() => {
                  setRadarDrug1('Warfarin 5mg');
                  setRadarDrug2('Aspirin 75mg');
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  radarDrug1.includes('Warfarin') 
                    ? 'bg-white border-rose-500 shadow-md ring-1 ring-rose-500' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-mono uppercase text-rose-700 font-bold mb-1">Critical Contraindication</div>
                <div className="text-sm font-semibold text-slate-900">Warfarin + Aspirin</div>
                <div className="text-xs text-slate-500 mt-1">Severe clinical hemorrhage & platelet antagonism hazard.</div>
              </button>

              <button 
                onClick={() => {
                  setRadarDrug1('Atenolol 50mg');
                  setRadarDrug2('Magnesium Antacid');
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  radarDrug1.includes('Atenolol') 
                    ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-mono uppercase text-amber-700 font-bold mb-1">Moderate Risk (Spacing)</div>
                <div className="text-sm font-semibold text-slate-900">Atenolol + Magnesium Antacid</div>
                <div className="text-xs text-slate-500 mt-1">Chelation causing 35% reduction in BP control.</div>
              </button>

              <button 
                onClick={() => {
                  setRadarDrug1('Atorvastatin 20mg');
                  setRadarDrug2('Grapefruit Extract');
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  radarDrug1.includes('Atorvastatin') 
                    ? 'bg-white border-teal-500 shadow-md ring-1 ring-teal-500' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-mono uppercase text-teal-700 font-bold mb-1">Low Dietary Risk</div>
                <div className="text-sm font-semibold text-slate-900">Atorvastatin + Grapefruit Juice</div>
                <div className="text-xs text-slate-500 mt-1">CYP3A4 metabolic competition with statins.</div>
              </button>

              <button 
                onClick={() => {
                  setRadarDrug1('Dolo 650mg (Paracetamol)');
                  setRadarDrug2('Augmentin 625 (Amoxicillin)');
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  radarDrug1.includes('Dolo') 
                    ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-mono uppercase text-emerald-700 font-bold mb-1">Safe Combination</div>
                <div className="text-sm font-semibold text-slate-900">Paracetamol + Amoxicillin</div>
                <div className="text-xs text-slate-500 mt-1">Standard synergistic therapy without adverse interference.</div>
              </button>
            </div>

            {/* Scenario Diagnostic Table Card */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-6">
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Screening Result</div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {radarResult.title}
                  </h3>
                </div>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                  radarResult.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                  radarResult.severity === 'moderate' ? 'bg-amber-100 text-amber-800' :
                  radarResult.severity === 'low' ? 'bg-teal-100 text-teal-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {radarResult.severity === 'critical' ? 'High Hazard Alert' : 
                   radarResult.severity === 'moderate' ? 'Moderate Spacing Needed' : 
                   radarResult.severity === 'low' ? 'Low Dietary Advisory' : 'Safe to Combine'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-mono text-slate-500 uppercase">First Agent:</div>
                  <div className="text-base font-bold text-slate-900 mt-1">{radarResult.drug1}</div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-mono text-slate-500 uppercase">Second Agent:</div>
                  <div className="text-base font-bold text-slate-900 mt-1">{radarResult.drug2}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
                  <div className="font-bold text-slate-900 mb-0.5">Clinical Adverse Effect:</div>
                  <div className="text-slate-600">{radarResult.effect}</div>
                </div>

                <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                  radarResult.severity === 'critical' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                  radarResult.severity === 'moderate' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  radarResult.severity === 'low' ? 'bg-teal-50 border-teal-200 text-teal-900' :
                  'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="font-bold uppercase text-xs font-mono mb-1">Pharmacist Action Protocol:</div>
                  <p>{radarResult.advisory}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          INTERACTIVE BENTO 4: 7-LANGUAGE REGIONAL VOICE CARE
          ========================================================= */}
      <section className="py-20 bg-[#0f172a] text-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-4 border border-emerald-700">
                <Volume2 className="w-3.5 h-3.5" />
                Universal Regional Inclusivity
              </div>

              <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Clinical Guidance in the Languages Families Speak at Home.
              </h2>

              <p className="text-slate-300 text-base leading-relaxed mb-8">
                Eliminating medical comprehension barriers. VaidyaVaani translates and speaks complex prescription instructions in Hindi, Bengali, Tamil, Telugu, Marathi, and Gujarati.
              </p>

              {/* Language Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                      currentLanguage.code === l.code
                        ? 'bg-emerald-500 text-slate-900 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {l.native}
                  </button>
                ))}
              </div>

              {/* Audio Box */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-wrap items-center justify-between gap-4 max-w-lg mb-6 shadow-md">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      if (isSpeaking) stopSpeaking();
                      else speakText();
                    }}
                    className="w-12 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 flex items-center justify-center transition-colors shrink-0 shadow-sm font-bold"
                  >
                    {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{currentLanguage.native} Speech Synthesizer</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">ACTIVE</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {isSpeaking ? 'Speaking in real-time...' : 'Click play button to listen'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 cursor-pointer pr-2">
                  {[30, 60, 25, 80, 45, 70, 35].map((height, i) => (
                    <div 
                      key={i} 
                      className={`w-1 bg-emerald-400 rounded-full transition-all duration-300 ${isSpeaking ? 'animate-pulse' : 'opacity-40'}`}
                      style={{ height: `${isSpeaking ? height * 0.35 : 8}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800/90 rounded-2xl p-8 border border-slate-700 text-center shadow-xl">
              <div className="w-14 h-14 rounded-full bg-emerald-900/60 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-7 h-7" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {currentLanguage.native} Audio Preview
              </div>
              <p className="text-sm text-slate-300 italic mb-6 leading-relaxed">
                "{currentLanguage.demoSpeechText}"
              </p>
              <button 
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  else speakText();
                }}
                className="btn-med-primary text-xs font-semibold bg-emerald-500 text-slate-900 hover:bg-emerald-400"
              >
                {isSpeaking ? 'Stop Voice' : `Listen in ${currentLanguage.native}`}
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          EMERGENCY 24/7 CALLOUT BANNER
          ========================================================= */}
      <section className="bg-emerald-700 text-white py-12">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-emerald-200">Emergency Medical Assistance</div>
              <h3 className="text-2xl font-bold text-white">National Ambulance Hotline: 108 / 102</h3>
            </div>
          </div>

          <button 
            onClick={handleCtaClick}
            className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all shrink-0"
          >
            {isAuthenticated ? 'Open Health Vault' : 'Sign In to Patient Portal'}
          </button>
        </div>
      </section>

      <Footer />

      {/* =========================================================
          MODAL: INTERACTIVE MEDICINE & SALT EXPLORER
          ========================================================= */}
      <AnimatePresence>
        {selectedMedicine && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedMedicine(null)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-200 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-4">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedMedicine.category}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                    {selectedMedicine.brand}
                  </h3>
                  <div className="text-xs font-mono font-bold text-slate-600 mt-0.5">
                    Salt: {selectedMedicine.salt}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedMedicine(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price & Savings Comparison Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 mb-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-mono">Branded MRP: <span className="line-through">₹{selectedMedicine.brandPrice}</span></div>
                  <div className="text-xl font-extrabold text-emerald-700 font-mono">
                    Generic Salt MRP: ₹{selectedMedicine.genericPrice}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Manufacturer: {selectedMedicine.genericMaker}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold font-mono bg-emerald-600 text-white px-3 py-1 rounded-lg shadow-2xs block">
                    Save {selectedMedicine.savingsPct}%
                  </span>
                </div>
              </div>

              {/* Clinical Details */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 font-mono uppercase text-xs">
                    <Info className="w-4 h-4 text-emerald-600" />
                    Medical Indication:
                  </div>
                  <p>{selectedMedicine.useFor}</p>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 font-mono uppercase text-xs">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    How to Take & Dosage Timing:
                  </div>
                  <p>{selectedMedicine.dosageTip}</p>
                  <div className="text-[11px] font-mono text-emerald-700 font-bold mt-1">
                    Frequency: {selectedMedicine.timing}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 font-mono uppercase text-xs">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Branded vs Generic Manufacturer:
                  </div>
                  <p>Branded: {selectedMedicine.manufacturer} • Generic: {selectedMedicine.genericMaker}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                <button
                  onClick={() => handleSpeakMedicine(selectedMedicine)}
                  className="flex-1 btn-med-secondary text-xs flex items-center justify-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>{isSpeakingMedDetails ? 'Stop Audio' : 'Listen Instructions'}</span>
                </button>

                <button
                  onClick={handleCtaClick}
                  className="flex-1 btn-med-primary text-xs"
                >
                  Add to Patient Vault
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          FLOATING CLINICAL AI ASSISTANT BUTTON (FAB)
          ========================================================= */}
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer"
          aria-label="Open Medicine Assistant"
        >
          <Bot className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* Slide-Over Clinical Assistant Modal */}
      <AnimatePresence>
        {isAssistantOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsAssistantOpen(false)}></div>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Vaidya Assistant</h3>
                    <div className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Online • {currentLanguage.native}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsAssistantOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-200/60 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafc]">
                {assistantMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'ai' 
                        ? 'bg-white border border-slate-200 text-slate-800 mr-6 shadow-xs' 
                        : 'bg-emerald-600 text-white ml-6 text-right'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isAiTyping && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2 w-fit font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                    <span>Analyzing clinical pharmacopeia...</span>
                  </div>
                )}
              </div>

              {/* Quick Query Chips */}
              <div className="p-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto text-[11px] font-mono">
                <button
                  onClick={(e) => handleAssistantSend(e, 'What is the generic salt in Dolo 650?')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 whitespace-nowrap transition-colors"
                >
                  Dolo 650 salt?
                </button>
                <button
                  onClick={(e) => handleAssistantSend(e, 'Can I take antacid with BP medicine?')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 whitespace-nowrap transition-colors"
                >
                  BP + Antacid spacing?
                </button>
                <button
                  onClick={(e) => handleAssistantSend(e, 'What does Fasting Glucose 110 mg/dL mean?')}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 whitespace-nowrap transition-colors"
                >
                  Glucose 110 mg/dL?
                </button>
              </div>

              {/* Input Bar */}
              <form onSubmit={handleAssistantSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                <input 
                  type="text"
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  placeholder={`Ask in ${currentLanguage.native}...`}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Document Ingestion Demo */}
      <AnimatePresence>
        {isDemoUploadOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsDemoUploadOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 font-mono">
                    Document Ingestion
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Upload Prescription OCR</h3>
                </div>
                <button 
                  onClick={() => setIsDemoUploadOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div 
                onClick={handleCtaClick}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/50 transition-all"
              >
                <Upload className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <div className="text-sm font-bold text-slate-900">Select PDF or Image</div>
                <p className="text-xs text-slate-500 mt-1">Authenticate to process clinical lab & prescription results securely</p>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleCtaClick}
                  className="btn-med-primary text-xs cursor-pointer"
                >
                  Continue to Portal
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
