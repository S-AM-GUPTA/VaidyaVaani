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
  Camera
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

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 40);
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
          1. HERO SECTION: Split Layout with Realistic Product Interaction
          ========================================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>UNDERSTAND YOUR HEALTH RECORDS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Medical information, <br className="hidden sm:inline" />
              made easier to understand.
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              VaidyaVaani helps you understand handwritten prescriptions, medical reports, medicines, and health records using AI-assisted extraction and explanation.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => openUploadModal('prescriptions')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload a Prescription</span>
              </button>

              <button
                onClick={handleCameraScan}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm transition-all"
                title="Scan with Camera"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span className="sm:hidden">Scan Camera</span>
              </button>
              
              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-sm transition-all"
              >
                <span>Explore how it works</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Micro Tagline */}
            <p className="text-xs text-slate-500 font-medium pt-1">
              Prescription images • Lab reports • Health records
            </p>

          </div>

          {/* Right Column: Realistic Product Preview & Active Extraction Panel */}
          <div className="lg:col-span-6">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xl relative overflow-hidden">
              
              {/* Product Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-semibold text-slate-500 ml-2">Prescription Analysis Preview</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    AI-Assisted
                  </span>
                </div>
              </div>

              {/* Split Interactive Demo Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Left Card: Prescription Scan with Scanning Line */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] text-slate-400 font-mono">
                    <span>Rx Document #4829</span>
                    <span>Clinic Scan</span>
                  </div>

                  {/* Simulated Doctor Prescription Script with Highlighted Bounding Box */}
                  <div className="py-4 space-y-3 relative">
                    
                    {/* Active Scan Laser Line */}
                    <motion.div 
                      className="absolute left-0 right-0 h-0.5 bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)] z-10"
                      style={{ top: `${scanProgress}%` }}
                    />

                    {/* Rx Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-serif font-black text-slate-800">℞</span>
                      <span className="text-[10px] text-slate-400 font-mono">Dr. V. Mehta, MD</span>
                    </div>

                    {/* Region 1: Amoxicillin (Clean Box) */}
                    <div className="p-2 rounded border border-emerald-400/80 bg-emerald-50/40 relative">
                      <span className="text-[9px] font-mono uppercase text-emerald-800 font-bold block mb-0.5">
                        Region 01: Detected Script
                      </span>
                      <p className="text-xs font-serif italic text-slate-700 font-semibold tracking-wide">
                        Tab. Amoxicillin 500mg (1-0-1) x 5d
                      </p>
                    </div>

                    {/* Region 2: Paracetamol (Needs Review Box) */}
                    <div className="p-2 rounded border border-amber-400/80 bg-amber-50/40 relative">
                      <span className="text-[9px] font-mono uppercase text-amber-800 font-bold block mb-0.5">
                        Region 02: Cursive Script
                      </span>
                      <p className="text-xs font-serif italic text-slate-600 tracking-wide">
                        Tab. Metformin 500mg (0-0-1) pc
                      </p>
                    </div>

                    {/* Region 3: Advice */}
                    <div className="text-[10px] text-slate-400 italic pt-1">
                      Adv: Drink plenty of warm fluids & review in 5 days.
                    </div>

                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>2 text regions identified</span>
                    <span className="text-emerald-700 font-medium">Scanning active</span>
                  </div>
                </div>

                {/* Right Card: Extracted Structured Medicine Panel */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900">Extracted Information</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Structured View
                      </span>
                    </div>

                    {/* Identified Item 1 */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Amoxicillin</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          High Conf
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 mt-1.5">
                        <div>Strength: <strong className="text-slate-900">500 mg</strong></div>
                        <div>Form: <strong className="text-slate-900">Tablet</strong></div>
                        <div>Dosage: <strong className="text-slate-900">1-0-1</strong></div>
                        <div>Duration: <strong className="text-slate-900">5 days</strong></div>
                      </div>
                    </div>

                    {/* Identified Item 2: Needs Review */}
                    <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Metformin</span>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Needs review
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-900 mt-1">
                        Dosage detected as 500mg night. Please confirm with physical prescription.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => openUploadModal('prescriptions')}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Try with your prescription</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. PROBLEM SECTION: Editorial & Educational Comparison
          ========================================================================= */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full">
        <div className="max-w-3xl mb-14 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Medical information isn't always written for patients.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            Handwritten prescriptions can be difficult to decipher, while laboratory reports can contain terminology that is difficult to understand without medical context.
          </p>
        </div>

        {/* 2-Column Problem vs Solution Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column: Hard to Read */}
          <div className="bg-slate-100/80 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Original Document</span>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  Hard to read
                </span>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-white border border-slate-300 font-serif italic text-slate-500 text-base leading-relaxed space-y-3">
                <p className="border-b border-slate-100 pb-2">"Rx Augmentin 625 1 tab bd pc x 5d"</p>
                <p className="border-b border-slate-100 pb-2">"Pantocid DSR 1 cap od ac 30m before bfast"</p>
                <p>"HbA1c 6.8% (Target &lt; 5.7%) — Titrate dose"</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-6 leading-relaxed">
              Abbreviations like "bd pc", cursive brand names, and clinical reference ranges often leave patients confused about correct timing and dietary precautions.
            </p>
          </div>

          {/* Right Column: Easier to Understand */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-500/20 shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3 right-8 bg-emerald-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs">
              VaidyaVaani Assisted
            </div>

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">Structured Breakdown</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Easier to understand
                </span>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Augmentin 625 (Amoxicillin + Clavulanate)</span>
                    <span className="text-[10px] font-bold text-emerald-700">Twice Daily</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Take 1 tablet twice a day after meals. Complete the full 5-day course.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Pantocid DSR (Acidity Relief)</span>
                    <span className="text-[10px] font-bold text-sky-700">Morning Only</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Take 1 capsule on an empty stomach, 30 minutes before breakfast.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-emerald-800 font-medium mt-6 leading-relaxed">
              Clear plain-language instructions, dosage schedules, dietary precautions, and voice guidance in your regional dialect.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. THREE CORE FEATURES
          ========================================================================= */}
      <section id="features" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="max-w-3xl mb-14 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">Core Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
              Three pillars for health record clarity.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
              Designed around the exact documents patients receive from clinics, hospitals, and diagnostic labs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Prescription Reader */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-6">
                  <Pill className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Understand prescriptions
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload or scan a prescription and extract readable medicine names, strengths, and instructions.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <button
                  onClick={() => openUploadModal('prescriptions')}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  <span>Try Prescription Reader</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 2: Lab Report Decoder */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-100/80 text-sky-700 flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Decode medical reports
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Turn complex laboratory and diagnostic information into simpler explanations.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <Link
                  to="/lab-decoder"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-700 hover:text-sky-800 transition-colors"
                >
                  <span>Analyze a report</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 3: Medication Safety */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Keep track of medication safety
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Review medicines across prescriptions and surface potential conflicts for further verification.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <Link
                  to="/safety-matrix"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors"
                >
                  <span>View safety</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. HOW IT WORKS: 4-Step Horizontal Workflow
          ========================================================================= */}
      <section id="how-it-works" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full">
        <div className="max-w-3xl mb-14 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">Simple Workflow</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
            How VaidyaVaani works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            From physical clinic paper to understandable digital health records in four steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Step 01 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative">
            <span className="text-2xl font-black text-slate-300 font-mono block mb-3">01</span>
            <h4 className="text-base font-bold text-slate-900 mb-1.5">Upload</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add a prescription or medical report.
            </p>
          </div>

          {/* Step 02 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative">
            <span className="text-2xl font-black text-slate-300 font-mono block mb-3">02</span>
            <h4 className="text-base font-bold text-slate-900 mb-1.5">Analyze</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              VaidyaVaani extracts relevant information.
            </p>
          </div>

          {/* Step 03 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative">
            <span className="text-2xl font-black text-slate-300 font-mono block mb-3">03</span>
            <h4 className="text-base font-bold text-slate-900 mb-1.5">Review</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review extracted information and uncertain results.
            </p>
          </div>

          {/* Step 04 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative">
            <span className="text-2xl font-black text-slate-300 font-mono block mb-3">04</span>
            <h4 className="text-base font-bold text-slate-900 mb-1.5">Understand</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get a clearer view of your health records.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. PRESCRIPTION AI SECTION: Machine Learning in Practice
          ========================================================================= */}
      <section id="prescription-reader" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="max-w-3xl mb-14 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">Specialized OCR</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
              Built for the prescriptions people actually receive.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
              Messy handwriting shouldn't make your health records impossible to understand.
            </p>
          </div>

          {/* Large Interactive UI Mockup */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Highlighted Bounding Box Regions */}
            <div className="lg:col-span-7 bg-slate-100/70 rounded-xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs text-slate-500 font-mono">
                <span>Multi-Engine Text Localizer</span>
                <span className="text-emerald-700 font-bold">Region Router Active</span>
              </div>

              {/* Sample Document Graphic with Bounding Box Overlays */}
              <div className="p-4 rounded-lg bg-white border border-slate-200 relative space-y-4 font-serif">
                <div className="text-xs text-slate-400 font-sans font-medium flex justify-between border-b pb-2">
                  <span>Prescription Record: #0821-DEL</span>
                  <span>Patient Age: 42</span>
                </div>

                {/* Cursive text row 1 with box */}
                <div className="relative p-2.5 rounded border-2 border-emerald-500/80 bg-emerald-50/20">
                  <div className="absolute -top-2.5 right-3 bg-emerald-700 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                    Confidence: 92%
                  </div>
                  <p className="text-sm font-serif italic text-slate-800 font-semibold">
                    1. Tab. Amoxicillin 500mg — 1 tab tid po pc x 5 days
                  </p>
                </div>

                {/* Cursive text row 2 with warning box */}
                <div className="relative p-2.5 rounded border-2 border-amber-500/80 bg-amber-50/20">
                  <div className="absolute -top-2.5 right-3 bg-amber-700 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                    Confidence: 68% • Review Suggested
                  </div>
                  <p className="text-sm font-serif italic text-slate-700">
                    2. Tab. Cetirizine 10mg — 1 tab hs prn for allergy
                  </p>
                </div>

                <div className="text-xs text-slate-400 font-sans italic pt-2">
                  * TrOCR & Vision transformers extract word crops and map against clinical pharmacopeia.
                </div>
              </div>
            </div>

            {/* Right: Detected Information Card */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Extraction Result</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Detected Information</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Medicine:</span>
                  <strong className="text-slate-900">Amoxicillin</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Strength:</span>
                  <strong className="text-slate-900">500 mg</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Form:</span>
                  <strong className="text-slate-900">Tablet</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Frequency:</span>
                  <strong className="text-slate-900">1-0-1 (Three times daily after meals)</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Confidence:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">92%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <p className="font-medium text-slate-700">
                  Some handwriting may require manual verification.
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  VaidyaVaani flags low-confidence words so you can quickly cross-check.
                </p>
              </div>

              <button
                onClick={() => openUploadModal('prescriptions')}
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <span>Review extraction</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          6. TRUST / UNCERTAINTY SECTION: Honest AI Philosophy
          ========================================================================= */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full">
        <div className="max-w-3xl mb-14 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Transparency by Design</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
            AI should know when it isn't sure.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            VaidyaVaani is designed to surface uncertainty rather than hide it. When handwriting or medical information is unclear, users are prompted to review the result.
          </p>
        </div>

        {/* Three Confidence Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tier 1: High Confidence */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  HIGH CONFIDENCE
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">✓ Ready to review</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear printed text or unambiguous cursive characters match clinical databases with high certainty (&gt;85%).
              </p>
            </div>
          </div>

          {/* Tier 2: Medium Confidence */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  MEDIUM CONFIDENCE
                </span>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Review suggested</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Partially cursive strokes or ambiguous dosages are highlighted for quick human inspection before finalizing records.
              </p>
            </div>
          </div>

          {/* Tier 3: Low Confidence */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  LOW CONFIDENCE
                </span>
                <HelpCircle className="w-5 h-5 text-slate-400" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Manual verification required</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Faint, heavily stylized, or damaged paper strokes require manual confirmation directly with your doctor or pharmacist.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. RESEARCH / TECHNOLOGY ARCHITECTURE SECTION
          ========================================================================= */}
      <section id="technology" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                Research prototype
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Technology behind VaidyaVaani
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              Modular pipeline combining computer vision, specialized handwriting recognition, and clinical safety checks.
            </p>
          </div>

          {/* Architecture Pipeline Flow Diagram */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs overflow-x-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 min-w-[700px]">
              
              <div className="flex-1 text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">01 Input</span>
                <p className="text-xs font-bold text-slate-900">Prescription</p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden md:block" />

              <div className="flex-1 text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">02 Vision</span>
                <p className="text-xs font-bold text-slate-900">Image Preprocessing</p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden md:block" />

              <div className="flex-1 text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">03 Detection</span>
                <p className="text-xs font-bold text-slate-900">Region Detection</p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden md:block" />

              <div className="flex-1 text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">04 OCR/ML</span>
                <p className="text-xs font-bold text-slate-900">Handwriting OCR</p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden md:block" />

              <div className="flex-1 text-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">05 Database</span>
                <p className="text-xs font-bold text-slate-900">Medicine Matching</p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden md:block" />

              <div className="flex-1 text-center p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-mono text-emerald-700 block mb-1">06 Human Review</span>
                <p className="text-xs font-bold text-emerald-900">User Verification</p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          8. PRIVACY & SECURITY SECTION
          ========================================================================= */}
      <section id="privacy" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#0F172A] text-white">
        <div className="max-w-[1280px] mx-auto">
          
          <div className="max-w-3xl mb-14 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Data Security</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mt-2">
              Your health information deserves care.
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mt-3 leading-relaxed">
              We design with privacy as a foundational requirement, ensuring you remain in total control of your records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Principle 1 */}
            <div className="p-6 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Privacy-first design</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your medical documents are processed solely for your personal health understanding and record organization.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="p-6 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Secure processing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingested documents and extracted prescription details reside securely inside your isolated patient vault.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="p-6 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">User-controlled records</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You can review, edit, export, or permanently delete your prescriptions and lab history at any time.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          9. FINAL CALL TO ACTION SECTION
          ========================================================================= */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Make your medical records easier to understand.
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Start with a prescription or medical report.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openUploadModal('prescriptions')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all active:scale-[0.99]"
            >
              Upload a Prescription
            </button>
            
            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-sm transition-all"
            >
              Explore VaidyaVaani
            </Link>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Upload {uploadType === 'prescriptions' ? 'Prescription' : 'Lab Report'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {uploadType === 'prescriptions'
                      ? 'Upload doctor prescription photo or PDF scan'
                      : 'Upload pathology or diagnostic lab report'}
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
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
