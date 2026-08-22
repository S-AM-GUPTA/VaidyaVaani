import { useState, useEffect } from 'react';
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
  Send
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

interface MedicineAlternative {
  brand: string;
  salt: string;
  brandPrice: number;
  genericPrice: number;
  savings: number;
  useFor: string;
  category: string;
}

const POPULAR_MEDICINES: MedicineAlternative[] = [
  {
    brand: 'Augmentin 625 Duo',
    salt: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    brandPrice: 224,
    genericPrice: 65,
    savings: 71,
    useFor: 'Bacterial Infections / Throat & Chest',
    category: 'Antibiotic'
  },
  {
    brand: 'Dolo 650mg',
    salt: 'Paracetamol (650mg)',
    brandPrice: 34,
    genericPrice: 11,
    savings: 68,
    useFor: 'Fever, Body Ache & Pain Relief',
    category: 'Analgesic'
  },
  {
    brand: 'Telma 40mg',
    salt: 'Telmisartan (40mg)',
    brandPrice: 146,
    genericPrice: 28,
    savings: 81,
    useFor: 'Hypertension & High Blood Pressure',
    category: 'Cardiology'
  },
  {
    brand: 'Pantocid 40mg',
    salt: 'Pantoprazole (40mg)',
    brandPrice: 172,
    genericPrice: 36,
    savings: 79,
    useFor: 'Acid Reflux, Heartburn & GERD',
    category: 'Gastroenterology'
  },
  {
    brand: 'Glycomet-GP 2',
    salt: 'Metformin (500mg) + Glimepiride (2mg)',
    brandPrice: 195,
    genericPrice: 44,
    savings: 77,
    useFor: 'Type 2 Diabetes Blood Sugar Control',
    category: 'Endocrinology'
  },
  {
    brand: 'Atorva 20mg',
    salt: 'Atorvastatin (20mg)',
    brandPrice: 258,
    genericPrice: 52,
    savings: 80,
    useFor: 'High Cholesterol & Heart Protection',
    category: 'Lipid Care'
  },
  {
    brand: 'Pan-D Capsule',
    salt: 'Pantoprazole (40mg) + Domperidone (30mg)',
    brandPrice: 210,
    genericPrice: 48,
    savings: 77,
    useFor: 'Acidity, Gas & Nausea',
    category: 'Gastroenterology'
  },
  {
    brand: 'Montair-LC',
    salt: 'Montelukast (10mg) + Levocetirizine (5mg)',
    brandPrice: 232,
    genericPrice: 55,
    savings: 76,
    useFor: 'Allergic Rhinitis, Sneezing & Asthma',
    category: 'Respiratory'
  }
];

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentLanguage, setLanguage, speakText, stopSpeaking, isSpeaking } = useLanguage();

  // Search in Hero
  const [heroSearch, setHeroSearch] = useState('');
  const [searchResults, setSearchResults] = useState<MedicineAlternative[]>([]);

  // Savings Calculator
  const [monthlySpend, setMonthlySpend] = useState<number>(2500);

  // Active Severity Demo Tab
  const [activeSeverityTab, setActiveSeverityTab] = useState<'low' | 'mod' | 'crit'>('mod');

  // Floating AI Assistant Drawer
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: `Hello! I am your VaidyaVaani clinical assistant. Ask me about medicine prices, generic salt alternatives, or prescription interactions in ${currentLanguage.native}!`
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Ingestion Modal
  const [isDemoUploadOpen, setIsDemoUploadOpen] = useState(false);

  useEffect(() => {
    if (heroSearch.trim().length > 1) {
      const q = heroSearch.toLowerCase();
      const filtered = POPULAR_MEDICINES.filter(m => 
        m.brand.toLowerCase().includes(q) || 
        m.salt.toLowerCase().includes(q) ||
        m.useFor.toLowerCase().includes(q)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [heroSearch]);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  const handleAssistantSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim()) return;

    const userText = assistantInput;
    setAssistantMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setAssistantInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      setIsAiTyping(false);
      let reply = `Based on Indian CDSCO standards, medicines sharing the exact same active salt (e.g. Paracetamol or Telmisartan) are bioequivalent. Generic alternatives typically save 70% to 80% with identical therapeutic efficacy.`;
      
      if (currentLanguage.code === 'hi') {
        reply = `भारतीय मानक के अनुसार एक ही साल्ट वाली दवाएं (जैसे पैरासिटामोल या टेल्मीसार्टन) समान रूप से प्रभावी होती हैं। जेनेरिक विकल्प चुनने से आप 70% से 80% तक बचत कर सकते हैं।`;
      } else if (currentLanguage.code === 'bn') {
        reply = `একই সল্টযুক্ত জেনেরিক ওষুধ ব্র্যান্ডেড ওষুধের মতোই কার্যকর এবং এতে ৭০% থেকে ৮০% পর্যন্ত সাশ্রয় হয়।`;
      }

      setAssistantMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
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
                onClick={handleCtaClick}
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
                  <div className="text-[11px] font-mono font-bold text-slate-400 uppercase px-3 py-1.5 border-b border-slate-100">
                    Matches Found ({searchResults.length} Generics Available)
                  </div>

                  <div className="divide-y divide-slate-100">
                    {searchResults.map((item, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          setHeroSearch(item.brand);
                          setSearchResults([]);
                        }}
                        className="p-3.5 hover:bg-emerald-50/50 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{item.brand}</span>
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
                            Save {item.savings}%
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

              <p className="text-sm text-slate-600 leading-relaxed mb-8 max-w-lg">
                Generic medicines with the identical active pharmaceutical ingredient (API) cost up to 80% less. Slide your family's monthly medicine expense below to see the savings:
              </p>

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
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
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
            {POPULAR_MEDICINES.slice(0, 6).map((item, idx) => (
              <div key={idx} className="med-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">{item.category}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Save {item.savings}%
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
                    onClick={handleCtaClick}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>Check</span>
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
                When different doctors prescribe medicines, dangerous cross-effects can occur. Click a clinical case below to simulate our interaction radar:
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
              <button 
                onClick={() => setActiveSeverityTab('low')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeSeverityTab === 'low' 
                    ? 'bg-white border-teal-500 shadow-md ring-1 ring-teal-500' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-mono uppercase text-teal-700 font-bold mb-1">Low Clinical Risk</div>
                <div className="text-sm font-semibold text-slate-900">Food & Dietary Timing</div>
                <div className="text-xs text-slate-500 mt-1">Minor gastrointestinal interactions manageable with meals.</div>
              </button>

              <button 
                onClick={() => setActiveSeverityTab('mod')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeSeverityTab === 'mod' 
                    ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-mono uppercase text-amber-700 font-bold mb-1">Moderate Risk</div>
                <div className="text-sm font-semibold text-slate-900">Dosage Spacing Adjustments</div>
                <div className="text-xs text-slate-500 mt-1">Bioavailability reduction requiring timed intervals.</div>
              </button>

              <button 
                onClick={() => setActiveSeverityTab('crit')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeSeverityTab === 'crit' 
                    ? 'bg-white border-rose-500 shadow-md ring-1 ring-rose-500' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-mono uppercase text-rose-700 font-bold mb-1">Critical Contraindication</div>
                <div className="text-sm font-semibold text-slate-900">Adverse Antagonism</div>
                <div className="text-xs text-slate-500 mt-1">Severe clinical complications requiring immediate doctor review.</div>
              </button>
            </div>

            {/* Scenario Diagnostic Table Card */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-6">
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Screening Result</div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {activeSeverityTab === 'low' && 'Case A: Atorvastatin (Lipids) + Grapefruit Extract'}
                    {activeSeverityTab === 'mod' && 'Case B: Atenolol (Blood Pressure) + Magnesium Antacids'}
                    {activeSeverityTab === 'crit' && 'Case C: Warfarin (Blood Thinner) + High-Dose Aspirin'}
                  </h3>
                </div>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                  activeSeverityTab === 'crit' ? 'bg-rose-100 text-rose-800' :
                  activeSeverityTab === 'mod' ? 'bg-amber-100 text-amber-800' :
                  'bg-teal-100 text-teal-800'
                }`}>
                  {activeSeverityTab === 'crit' ? 'High Hazard Alert' : activeSeverityTab === 'mod' ? 'Moderate Spacing Needed' : 'Low Risk / Advisory'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-mono text-slate-500 uppercase">Primary Prescription</div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {activeSeverityTab === 'crit' ? 'Warfarin 5mg' : activeSeverityTab === 'mod' ? 'Atenolol 50mg' : 'Atorvastatin 20mg'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Specialist Cardiologist</div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-mono text-slate-500 uppercase">Secondary Agent</div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {activeSeverityTab === 'crit' ? 'Aspirin 325mg (NSAID)' : activeSeverityTab === 'mod' ? 'Magnesium Hydroxide' : 'Grapefruit Extract'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Secondary Doctor / OTC</div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                activeSeverityTab === 'crit' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                activeSeverityTab === 'mod' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                'bg-teal-50 border-teal-200 text-teal-900'
              }`}>
                <div className="font-bold uppercase text-xs font-mono mb-1">Clinical Pharmacist Assessment:</div>
                <p>
                  {activeSeverityTab === 'crit' && 'Severe hemorrhagic hazard: Dual platelet and coagulation suppression drastically elevates bleeding risks. Contact prescribing doctor immediately for non-NSAID alternatives.'}
                  {activeSeverityTab === 'mod' && 'Absorption Chelation: Antacids bind with beta-blockers in gastric juice, reducing absorption by up to 35%. Administer Atenolol at least 2 hours before antacids.'}
                  {activeSeverityTab === 'low' && 'Metabolic pathway competition: Ingestion with meals reduces mild gastric discomfort. No therapeutic alteration observed.'}
                </p>
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
          FLOATING CLINICAL AI ASSISTANT BUTTON (FAB)
          ========================================================= */}
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 relative group"
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
                  className="w-8 h-8 rounded-lg bg-slate-200/60 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
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
                    <span>Thinking...</span>
                  </div>
                )}
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
                  className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs"
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
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
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
                  className="btn-med-primary text-xs"
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
