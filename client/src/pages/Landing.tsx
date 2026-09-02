import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  Pill, 
  Activity, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  X, 
  ChevronRight, 
  Cpu, 
  Lock, 
  UserCheck,
  Camera,
  Check
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Uploader from '../components/Uploader';
import { useAuth } from '../context/AuthContext';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'prescriptions' | 'reports'>('prescriptions');

  // Camera file input
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Hero Scanner Animation Cycle
  const [scanProgress, setScanProgress] = useState(0);

  // Active Bounding Box Highlight toggle in demo section
  const [activeRegionIndex, setActiveRegionIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 45);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col relative overflow-x-hidden">
      <Navbar onOpenUpload={openUploadModal} />

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
          1. HERO SECTION: Asymmetric Split with Double-Bezel Hardware Mockup
          ========================================================================= */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto w-full">
        
        {/* Subtle Ambient Gradient Orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Editorial Headline & High-Conversion CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold font-mono tracking-wider uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>UNDERSTAND YOUR HEALTH RECORDS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Medical information, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                made easier to understand.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              VaidyaVaani helps you understand difficult handwritten doctor prescriptions, laboratory reports, and medication safety using AI-assisted extraction and plain-language guidance.
            </p>

            {/* Action Buttons (Button-in-Button Architecture) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => openUploadModal('prescriptions')}
                className="btn-island-primary py-3 pl-6 pr-3 group cursor-pointer"
              >
                <span>Upload a Prescription</span>
                <span className="btn-icon-vessel">
                  <UploadCloud className="w-4 h-4 text-white" />
                </span>
              </button>

              <button
                onClick={handleCameraScan}
                className="btn-island-secondary py-3 px-4 flex items-center justify-center gap-2 cursor-pointer"
                title="Scan Prescription via Camera"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span className="sm:hidden">Scan Camera</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Explore how it works</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Feature Tags */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Prescription photos
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Pathology lab reports
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                7 Indian regional languages
              </span>
            </div>

          </div>

          {/* Right Column: Double-Bezel Interactive Prescription Analysis Card */}
          <div className="lg:col-span-6">
            <div className="doppel-shell shadow-xl">
              <div className="doppel-core p-4 sm:p-6 space-y-4">
                
                {/* Header Strip */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold text-slate-800 ml-1.5 font-headline">Prescription Analysis</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Vision Ensemble
                  </span>
                </div>

                {/* 2-Column Split Interface */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Left Column: Doctor Script with Laser Line Scan */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 relative overflow-hidden flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 text-[10px] font-mono text-slate-400">
                      <span>DOC: #0821-DEL</span>
                      <span>Clinic Scan</span>
                    </div>

                    <div className="py-4 space-y-2.5 relative">
                      {/* Active Optical Scan Line */}
                      <motion.div 
                        className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)] z-10"
                        style={{ top: `${scanProgress}%` }}
                      />

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-serif font-black text-slate-800 leading-none">℞</span>
                        <span className="text-[10px] font-mono text-slate-400">Dr. V. Mehta (MD)</span>
                      </div>

                      {/* Detected Region 1 */}
                      <div className="p-2 rounded-xl border border-emerald-400 bg-emerald-50/60 transition-all">
                        <div className="flex items-center justify-between text-[9px] font-mono font-bold text-emerald-800 mb-0.5">
                          <span>01: SCRIPT</span>
                          <span className="text-emerald-700">94% CONF</span>
                        </div>
                        <p className="text-xs font-serif italic font-semibold text-slate-800">
                          Tab. Amoxicillin 500mg (1-0-1) x 5d
                        </p>
                      </div>

                      {/* Detected Region 2 */}
                      <div className="p-2 rounded-xl border border-amber-300 bg-amber-50/50 transition-all">
                        <div className="flex items-center justify-between text-[9px] font-mono font-bold text-amber-800 mb-0.5">
                          <span>02: CURSIVE</span>
                          <span className="text-amber-700">62% REVIEW</span>
                        </div>
                        <p className="text-xs font-serif italic text-slate-700">
                          Tab. Metformin 500mg (0-0-1) pc
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>2 Regions Localized</span>
                      <span className="text-emerald-700 font-bold">Scanning</span>
                    </div>
                  </div>

                  {/* Right Column: Structured Extracted Information */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-col justify-between shadow-xs">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900 font-headline">Extracted Medicines</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Ready
                        </span>
                      </div>

                      {/* Medicine 1 */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 font-bold">Amoxicillin</strong>
                          <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                            High Conf
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 pt-0.5">
                          <div>Strength: <span className="font-semibold text-slate-800">500 mg</span></div>
                          <div>Dosage: <span className="font-semibold text-slate-800">1-0-1</span></div>
                          <div>Form: <span className="font-semibold text-slate-800">Tablet</span></div>
                          <div>Course: <span className="font-semibold text-slate-800">5 Days</span></div>
                        </div>
                      </div>

                      {/* Medicine 2: Warning Flag */}
                      <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 font-bold">Metformin</strong>
                          <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Review
                          </span>
                        </div>
                        <p className="text-[10px] text-amber-900 mt-1 leading-snug">
                          Night dose after food. Please verify physical slip.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <button
                        onClick={() => openUploadModal('prescriptions')}
                        className="w-full py-2 px-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-headline flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Analyze Your Prescription</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. PROBLEM SECTION: Editorial Before/After Comparison
          ========================================================================= */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto w-full">
        <div className="max-w-3xl mb-14 text-left">
          <div className="haptic-badge bg-slate-100 text-slate-700 mb-3 border border-slate-200">
            The Healthcare Communication Gap
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Medical information isn't always written for patients.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            Handwritten prescriptions can be difficult to decipher, while laboratory reports contain clinical acronyms that leave families uncertain about correct care.
          </p>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Card: Hard to Read */}
          <div className="bg-slate-100/80 rounded-3xl p-6 sm:p-8 border border-slate-200/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="text-xs font-mono font-bold uppercase text-slate-500">Clinical Source Document</span>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full font-mono">
                  Hard to read
                </span>
              </div>
              
              <div className="mt-6 p-5 rounded-2xl bg-white border border-slate-300 font-serif italic text-slate-600 text-base leading-relaxed space-y-3.5 shadow-xs">
                <p className="border-b border-slate-100 pb-2">"℞ Augmentin 625 1 tab bd pc x 5d"</p>
                <p className="border-b border-slate-100 pb-2">"Pantocid DSR 1 cap od ac 30m before bfast"</p>
                <p>"HbA1c 6.8% (Ref &lt; 5.7%) — Titrate dose"</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-6 leading-relaxed">
              Abbreviations like "bd pc", cursive brand names, and unfamiliar reference ranges create medication timing mistakes and missed doses.
            </p>
          </div>

          {/* Right Card: Easier to Understand */}
          <div className="doppel-shell">
            <div className="doppel-core p-6 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-800">VaidyaVaani Interpretation</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-mono">
                    Easier to understand
                  </span>
                </div>
                
                <div className="mt-6 space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">Augmentin 625 (Antibiotic)</strong>
                      <span className="text-[10px] font-bold font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">Twice Daily</span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                      Take 1 tablet twice daily strictly after food. Complete the full 5-day course without stopping early.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">Pantocid DSR (Acidity Relief)</strong>
                      <span className="text-[10px] font-bold font-mono text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full">Morning Only</span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                      Take 1 capsule early morning on an empty stomach, 30 minutes before breakfast.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-emerald-800 font-medium mt-6 leading-relaxed">
                Clear plain-language instructions, precise food intervals, interaction warnings, and audio in your mother tongue.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. THREE CORE PRODUCT CAPABILITIES (BENTO GRID)
          ========================================================================= */}
      <section id="features" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-t border-slate-200/80">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="max-w-3xl mb-14 text-left">
            <div className="haptic-badge bg-emerald-50 text-emerald-800 mb-3 border border-emerald-200">
              Core Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Three pillars for total medical clarity.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
              Designed around the exact documents patients receive from clinics, hospitals, and diagnostic laboratories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Prescription Reader */}
            <div className="doppel-shell flex flex-col justify-between">
              <div className="doppel-core p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 border border-emerald-100 shadow-xs">
                    <Pill className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-headline mb-3">
                    Understand prescriptions
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Upload or scan a prescription and extract readable medicine names, strengths, dosage schedules, and dietary instructions.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openUploadModal('prescriptions')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors group cursor-pointer font-headline"
                  >
                    <span>Try Prescription Reader</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Lab Report Decoder */}
            <div className="doppel-shell flex flex-col justify-between">
              <div className="doppel-core p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-6 border border-sky-100 shadow-xs">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-headline mb-3">
                    Decode medical reports
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Turn complex laboratory and diagnostic blood test numbers into simple reference ranges and actionable doctor talking points.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <Link
                    to="/lab-decoder"
                    className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-800 transition-colors group font-headline"
                  >
                    <span>Analyze a report</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Medication Safety */}
            <div className="doppel-shell flex flex-col justify-between">
              <div className="doppel-core p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-6 border border-teal-100 shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-headline mb-3">
                    Keep track of medication safety
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Review medicines across multiple doctors and surface dangerous drug interactions, antacid spacing clashes, and dietary precautions.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <Link
                    to="/safety-matrix"
                    className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors group font-headline"
                  >
                    <span>View safety</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. HOW IT WORKS: 4-Step Connected Linear Workflow
          ========================================================================= */}
      <section id="how-it-works" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto w-full">
        <div className="max-w-3xl mb-16 text-left">
          <div className="haptic-badge bg-slate-100 text-slate-700 mb-3 border border-slate-200">
            Seamless Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How VaidyaVaani works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            From physical clinic prescription to understandable digital health records in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Step 01 */}
          <div className="agency-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold text-sm flex items-center justify-center mb-5">
                01
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mb-2 font-headline">Upload</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add a doctor prescription image, PDF scan, or pathology report.
              </p>
            </div>
          </div>

          {/* Step 02 */}
          <div className="agency-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-mono font-bold text-sm flex items-center justify-center mb-5">
                02
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mb-2 font-headline">Analyze</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-engine vision transformers extract text regions and match medicines.
              </p>
            </div>
          </div>

          {/* Step 03 */}
          <div className="agency-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-mono font-bold text-sm flex items-center justify-center mb-5">
                03
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mb-2 font-headline">Review</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review extracted dosages and inspect flagged low-confidence characters.
              </p>
            </div>
          </div>

          {/* Step 04 */}
          <div className="agency-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-mono font-bold text-sm flex items-center justify-center mb-5 shadow-xs">
                04
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mb-2 font-headline">Understand</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get a clear view of schedules, safety interactions, and audio voice guidance.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. PRESCRIPTION AI & VISION TRANSFORMATION SECTION
          ========================================================================= */}
      <section id="prescription-reader" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-t border-slate-200/80">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="max-w-3xl mb-14 text-left">
            <div className="haptic-badge bg-emerald-50 text-emerald-800 mb-3 border border-emerald-200">
              Specialized OCR Engineering
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Built for the prescriptions people actually receive.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
              Messy handwriting shouldn't make your health records impossible to understand.
            </p>
          </div>

          {/* Large Interactive UI Showcase */}
          <div className="doppel-shell">
            <div className="doppel-core p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Bounding Box Document View */}
              <div className="lg:col-span-7 bg-slate-100/80 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-mono text-slate-500">
                  <span>Multi-Engine Localizer (PaddleOCR + TrOCR)</span>
                  <span className="text-emerald-700 font-bold">Dual-Engine Active</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 relative space-y-4 font-serif shadow-xs">
                  <div className="text-xs text-slate-400 font-sans font-medium flex justify-between border-b pb-2">
                    <span>Clinical Prescription Record: #0821-DEL</span>
                    <span>Patient Age: 42</span>
                  </div>

                  {/* Cursive Box 1 */}
                  <div 
                    onClick={() => setActiveRegionIndex(0)}
                    className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      activeRegionIndex === 0 
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="absolute -top-2.5 right-3 bg-emerald-700 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                      Confidence: 92% • High
                    </div>
                    <p className="text-sm font-serif italic text-slate-800 font-semibold">
                      1. Tab. Amoxicillin 500mg — 1 tab tid po pc x 5 days
                    </p>
                  </div>

                  {/* Cursive Box 2 */}
                  <div 
                    onClick={() => setActiveRegionIndex(1)}
                    className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      activeRegionIndex === 1 
                        ? 'border-amber-500 bg-amber-50/40 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="absolute -top-2.5 right-3 bg-amber-700 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                      Confidence: 68% • Review Suggested
                    </div>
                    <p className="text-sm font-serif italic text-slate-700">
                      2. Tab. Cetirizine 10mg — 1 tab hs prn for allergy
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-400 font-sans italic pt-1">
                    * Vision transformers crop localized word patches and verify matches against national pharmacology databases.
                  </div>
                </div>
              </div>

              {/* Right Column: Detected Information */}
              <div className="lg:col-span-5 space-y-6 text-left">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Structured Extraction</span>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-headline mt-1">
                    {activeRegionIndex === 0 ? 'Amoxicillin 500mg' : 'Cetirizine 10mg'}
                  </h3>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Medicine Salt:</span>
                    <strong className="text-slate-900 font-bold">
                      {activeRegionIndex === 0 ? 'Amoxicillin Trihydrate' : 'Cetirizine Hydrochloride'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Strength:</span>
                    <strong className="text-slate-900 font-bold">{activeRegionIndex === 0 ? '500 mg' : '10 mg'}</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Form & Route:</span>
                    <strong className="text-slate-900 font-bold">Oral Tablet (After Food)</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Confidence Score:</span>
                    <span className={`font-mono font-bold px-2.5 py-0.5 rounded-full text-xs ${
                      activeRegionIndex === 0 ? 'text-emerald-800 bg-emerald-100' : 'text-amber-800 bg-amber-100'
                    }`}>
                      {activeRegionIndex === 0 ? '92% (High)' : '68% (Needs Review)'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">
                    Human verification remains central.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    When confidence is low, VaidyaVaani surfaces uncertainty badges rather than guessing dangerous medical details.
                  </p>
                </div>

                <button
                  onClick={() => openUploadModal('prescriptions')}
                  className="btn-island-primary text-xs py-2 pl-4 pr-2 group cursor-pointer"
                >
                  <span>Upload your prescription</span>
                  <span className="btn-icon-vessel">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. TRUST & UNCERTAINTY MATRIX
          ========================================================================= */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto w-full">
        <div className="max-w-3xl mb-14 text-left">
          <div className="haptic-badge bg-slate-100 text-slate-700 mb-3 border border-slate-200">
            Transparency by Design
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            AI should know when it isn't sure.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            VaidyaVaani is designed to surface uncertainty rather than hide it. When handwriting or medical information is unclear, users are prompted to review the result.
          </p>
        </div>

        {/* Three Confidence Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tier 1 */}
          <div className="agency-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  HIGH CONFIDENCE
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mb-2 font-headline">✓ Ready to review</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear printed text or unambiguous script characters matching verified national pharmaceutical databases.
              </p>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="agency-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  MEDIUM CONFIDENCE
                </span>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mb-2 font-headline">Review suggested</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Partially cursive strokes or ambiguous dosage units are highlighted for quick visual inspection before saving.
              </p>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="agency-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  LOW CONFIDENCE
                </span>
                <HelpCircle className="w-5 h-5 text-slate-400" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mb-2 font-headline">Manual verification required</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Faint, stylized, or damaged paper strokes require explicit verification directly with your doctor or pharmacist.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. RESEARCH & TECHNOLOGY ARCHITECTURE FLOW
          ========================================================================= */}
      <section id="technology" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-t border-slate-200/80">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 text-left">
            <div>
              <div className="haptic-badge bg-slate-200 text-slate-700 mb-2 font-mono">
                Research Prototype
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-headline">
                Technology behind VaidyaVaani
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Multi-stage pipeline combining computer vision, transformer handwriting OCR, and clinical safety matrices.
            </p>
          </div>

          {/* Pipeline Flow Diagram */}
          <div className="doppel-shell overflow-x-auto">
            <div className="doppel-core p-6 sm:p-8 min-w-[720px]">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                
                <div className="flex-1 text-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">01 Input</span>
                  <p className="text-xs font-extrabold text-slate-900 font-headline">Prescription</p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden md:block" />

                <div className="flex-1 text-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">02 Preprocess</span>
                  <p className="text-xs font-extrabold text-slate-900 font-headline">Image Enhancement</p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden md:block" />

                <div className="flex-1 text-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">03 Localize</span>
                  <p className="text-xs font-extrabold text-slate-900 font-headline">Region Detection</p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden md:block" />

                <div className="flex-1 text-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">04 OCR/ML</span>
                  <p className="text-xs font-extrabold text-slate-900 font-headline">Handwriting OCR</p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden md:block" />

                <div className="flex-1 text-center p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">05 Match</span>
                  <p className="text-xs font-extrabold text-slate-900 font-headline">Medicine DB</p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden md:block" />

                <div className="flex-1 text-center p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-mono text-emerald-700 block mb-1 font-bold">06 Verify</span>
                  <p className="text-xs font-extrabold text-emerald-900 font-headline">User Review</p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          8. PRIVACY & SECURITY SECTION (DEEP OLED #0B1120)
          ========================================================================= */}
      <section id="privacy" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#0B1120] text-white">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="max-w-3xl mb-14 text-left">
            <div className="haptic-badge bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/30">
              Data Governance
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Your health information deserves care.
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mt-3 leading-relaxed">
              We design with privacy as a foundational requirement, ensuring you remain in total control of your records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            {/* Principle 1 */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-headline">Privacy-first design</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Your medical documents are processed exclusively for your personal health understanding and record organization.
                </p>
              </div>
            </div>

            {/* Principle 2 */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-6 border border-sky-500/20">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-headline">Isolated vault storage</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Ingested prescriptions and extracted medication schedules reside securely inside your isolated patient workspace.
                </p>
              </div>
            </div>

            {/* Principle 3 */}
            <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6 border border-teal-500/20">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-headline">User-controlled records</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  You can review, export, modify, or permanently purge your health documents from the database at any moment.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          9. FINAL HIGH-CONVERSION CTA BANNER
          ========================================================================= */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-[1240px] mx-auto">
          <div className="doppel-shell text-center">
            <div className="doppel-core py-16 px-6 sm:px-12 space-y-6">
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-headline">
                Make your medical records easier to understand.
              </h2>
              
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
                Start with a prescription or laboratory report in seconds.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => openUploadModal('prescriptions')}
                  className="btn-island-primary py-3.5 pl-6 pr-3 text-sm group cursor-pointer"
                >
                  <span>Upload a Prescription</span>
                  <span className="btn-icon-vessel">
                    <UploadCloud className="w-4 h-4 text-white" />
                  </span>
                </button>
                
                <Link
                  to="/services"
                  className="btn-island-secondary py-3.5 px-6 text-sm"
                >
                  Explore All Modules
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. FOOTER
          ========================================================================= */}
      <Footer />

      {/* =========================================================================
          11. INTERACTIVE UPLOAD MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-headline">
                    Upload {uploadType === 'prescriptions' ? 'Prescription' : 'Lab Report'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    {uploadType === 'prescriptions'
                      ? 'Upload doctor prescription photo or PDF document'
                      : 'Upload pathology or diagnostic lab report'}
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6">
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
