import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Pill, 
  FileText, 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Sparkles, 
  Scan,
  RefreshCw,
  Camera,
  X,
  Lock,
  Sliders
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  // Hero Interactive Demo State
  const [heroScanStep, setHeroScanStep] = useState<number>(1); // 0: raw, 1: scanning, 2: extracted
  const [isScanningActive, setIsScanningActive] = useState<boolean>(true);

  // Upload Modal State (Real Upload Flow)
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<'prescriptions' | 'reports'>('prescriptions');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Auto-cycle hero scanning demo every few seconds if user isn't interacting
  useEffect(() => {
    if (!isScanningActive) return;
    const interval = setInterval(() => {
      setHeroScanStep((prev) => (prev === 2 ? 0 : prev + 1));
    }, 3200);
    return () => clearInterval(interval);
  }, [isScanningActive]);

  // Primary CTA Handler
  const handlePrimaryUploadClick = (category: 'prescriptions' | 'reports' = 'prescriptions') => {
    setUploadCategory(category);
    setSelectedFile(null);
    setUploadStatus('idle');
    setUploadError('');
    setIsUploadOpen(true);
  };

  // Real Upload Handler
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    if (!isAuthenticated) {
      // Save pending upload intent to session and redirect to login
      sessionStorage.setItem('pending_upload_category', uploadCategory);
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('idle');

    try {
      await axios.post(`${API_URL}/${uploadCategory}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(percent);
        }
      });
      setUploadStatus('success');
      setTimeout(() => {
        setIsUploadOpen(false);
        navigate(uploadCategory === 'prescriptions' ? '/home#prescriptions' : '/lab-decoder');
      }, 1000);
    } catch (err: any) {
      setUploadStatus('error');
      setUploadError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus('idle');
      setUploadError('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* ======================================================== */}
      {/* 1. HERO SECTION (Split Layout)                           */}
      {/* ======================================================== */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Subtle Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Understand Your Health Records</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-slate-900 leading-[1.12] tracking-tight">
                Medical information,<br />
                made easier to understand.
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                VaidyaVaani helps you understand handwritten prescriptions, medical reports, medicines, and health records using AI-assisted extraction and explanation.
              </p>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => handlePrimaryUploadClick('prescriptions')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-[#059669] hover:bg-[#047857] text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload a Prescription</span>
                </button>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-all cursor-pointer"
                >
                  <span>Explore how it works</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Sub-text under CTA */}
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Prescription images • Lab reports • Health records</span>
              </div>

            </div>

            {/* Right Column: Realistic Product Preview */}
            <div 
              className="lg:col-span-6"
              onMouseEnter={() => setIsScanningActive(false)}
              onMouseLeave={() => setIsScanningActive(true)}
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                
                {/* Window Header */}
                <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                    <span className="text-xs font-semibold text-slate-700 ml-2">Prescription Analysis</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-medium text-slate-500">AI-assisted preview</span>
                  </div>
                </div>

                {/* Main Split Demo Body */}
                <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                  
                  {/* Left Box: Prescription Sample Image with Scan Animation */}
                  <div className="relative rounded-xl border border-slate-200 bg-slate-100/70 p-3 overflow-hidden">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                      <span>Source Sample</span>
                      <span className="text-[10px] text-slate-400">Dr. Sharma, MD</span>
                    </div>

                    {/* Prescription Crop Mockup */}
                    <div className="relative bg-white rounded-lg p-3 border border-slate-200/80 shadow-2xs min-h-[190px] flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-1 text-slate-400">
                          <span>Rx #84920</span>
                          <span>24 Aug</span>
                        </div>
                        <div className="text-xs font-serif italic text-slate-700 leading-snug">
                          <p className="line-through-none">Rx: Tab Amox 500mg</p>
                          <p className="text-slate-500 pl-4">1 tab TID x 5 days</p>
                          <p className="pt-1">Tab Ctz 10mg hs</p>
                        </div>
                      </div>

                      {/* Scanning Line Animation */}
                      {heroScanStep === 1 && (
                        <motion.div 
                          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_8px_rgba(5,150,105,0.6)]"
                          initial={{ top: '10%' }}
                          animate={{ top: '85%' }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        />
                      )}

                      {/* Region highlight box */}
                      {heroScanStep >= 1 && (
                        <div className="mt-2 p-1.5 rounded border border-dashed border-emerald-500 bg-emerald-50/40 text-[10px] text-emerald-800 font-medium flex items-center justify-between">
                          <span>Localized Region #1</span>
                          <span className="font-semibold">Match 92%</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Scan className="w-3 h-3 text-emerald-600" />
                        {heroScanStep === 0 ? 'Ready' : heroScanStep === 1 ? 'Extracting text...' : 'Extraction complete'}
                      </span>
                      <button 
                        onClick={() => setHeroScanStep((prev) => (prev === 2 ? 0 : prev + 1))}
                        className="text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                      >
                        Re-scan
                      </button>
                    </div>
                  </div>

                  {/* Right Box: Structured Extraction Panel */}
                  <div className="space-y-3">
                    
                    {/* Primary Identified Medicine Card */}
                    <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Medicine identified
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          High confidence
                        </span>
                      </div>

                      <div className="pt-0.5">
                        <div className="text-sm font-bold text-slate-900">Amoxicillin</div>
                        <div className="text-xs text-slate-600">500 mg • Tablet</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs border-t border-emerald-100 text-slate-700">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Dosage</span>
                          <span className="font-semibold">1-0-1 (Twice daily)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Duration</span>
                          <span className="font-semibold">5 days</span>
                        </div>
                      </div>
                    </div>

                    {/* Second Extracted Card (Uncertainty Demonstration) */}
                    <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800">Cetirizine 10 mg</span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-900">
                          <AlertCircle className="w-3 h-3 text-amber-700" />
                          Needs review
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Night dose detected. Please verify frequency with doctor.
                      </p>
                    </div>

                  </div>

                </div>

                {/* Footer bar inside card */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>Structured interpretation preview</span>
                  <button 
                    onClick={() => handlePrimaryUploadClick('prescriptions')}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    Try with your prescription →
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PROBLEM SECTION (Editorial 2-Column Comparison)       */}
      {/* ======================================================== */}
      <section className="py-20 md:py-28 bg-white border-y border-slate-200/80">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Medical information isn't always written for patients.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Handwritten prescriptions can be difficult to decipher, while laboratory reports can contain terminology that is difficult to understand without medical context.
            </p>
          </div>

          {/* Comparison Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center max-w-4xl mx-auto">
            
            {/* Column 1: Messy Prescription */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Hard to read
                </span>
                <span className="text-xs text-slate-400">Doctor's handwritten slip</span>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs font-serif italic text-slate-700 space-y-2 min-h-[160px] flex flex-col justify-center">
                <p className="text-sm opacity-85">Tab Augm 625 1-0-1 x 5d pc</p>
                <p className="text-sm opacity-85">Cap Pan 40 OD ac 15m</p>
                <p className="text-sm opacity-85">Syr Grilinctus 2 tsp tid</p>
                <p className="text-[11px] text-slate-400 not-italic pt-2 border-t border-slate-100">
                  Unclear abbreviation and timing
                </p>
              </div>

              <p className="text-xs text-slate-500 leading-normal">
                Patients often struggle to verify medicine names, dosage timings, and safety precautions.
              </p>
            </div>

            {/* Column 2: Structured VaidyaVaani Output */}
            <div className="p-6 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Easier to understand
                </span>
                <span className="text-xs text-emerald-700 font-medium">VaidyaVaani interpretation</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-200/80 shadow-2xs space-y-2.5 min-h-[160px] flex flex-col justify-center">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Augmentin 625 mg</div>
                    <div className="text-xs text-slate-600">Amoxicillin + Clavulanic Acid</div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    1 Tab • Twice daily
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                  Take after food. Complete all 5 prescribed days.
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-normal">
                Extracted readable medicine names, active salts, and clear timing instructions in plain language.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. THREE CORE FEATURES                                   */}
      {/* ======================================================== */}
      <section id="features" className="py-20 md:py-28 bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Three core tools for your health clarity.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Designed to help you navigate prescriptions, laboratory diagnostic reports, and medication safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Prescription Reader */}
            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <Pill className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Understand prescriptions</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload or scan a prescription and extract readable medicine names, strengths, and instructions.
                </p>
              </div>

              <button
                onClick={() => handlePrimaryUploadClick('prescriptions')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 pt-2 cursor-pointer"
              >
                <span>Try Prescription Reader</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Lab Report Decoder */}
            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Decode medical reports</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Turn complex laboratory and diagnostic information into simpler explanations and normal biomarker ranges.
                </p>
              </div>

              <Link
                to="/lab-decoder"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-800 pt-2"
              >
                <span>Analyze a report</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3: Medication Safety */}
            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Keep track of medication safety</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Review medicines across prescriptions and surface potential conflicts for further verification with your physician.
                </p>
              </div>

              <Link
                to="/safety-matrix"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:text-indigo-800 pt-2"
              >
                <span>View safety</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. HOW IT WORKS (Horizontal 4-Step Workflow)             */}
      {/* ======================================================== */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white border-y border-slate-200/80">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Simple, transparent workflow.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              How VaidyaVaani transforms raw health documents into clear, organized records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="space-y-3 relative">
              <div className="text-3xl font-bold text-slate-300 font-mono">01</div>
              <h3 className="text-lg font-bold text-slate-900">Upload</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Add a prescription photo, scan, or digital medical report.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 relative">
              <div className="text-3xl font-bold text-slate-300 font-mono">02</div>
              <h3 className="text-lg font-bold text-slate-900">Analyze</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                VaidyaVaani extracts relevant text, dosages, and diagnostic markers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 relative">
              <div className="text-3xl font-bold text-slate-300 font-mono">03</div>
              <h3 className="text-lg font-bold text-slate-900">Review</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Review extracted information, confidence scores, and flagged items.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-3 relative">
              <div className="text-3xl font-bold text-slate-300 font-mono">04</div>
              <h3 className="text-lg font-bold text-slate-900">Understand</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get a clearer view of your health records, timings, and medication safety.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. PRESCRIPTION AI SECTION (Realistic ML Showcase)      */}
      {/* ======================================================== */}
      <section id="prescription-ai" className="py-20 md:py-28 bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Built for the prescriptions people actually receive.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Messy handwriting shouldn't make your health records impossible to understand.
            </p>
          </div>

          {/* Large UI Mockup Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Left Side: Mockup Image with Bounding Boxes */}
              <div className="md:col-span-6 p-6 sm:p-8 bg-slate-50 border-r border-slate-200 flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Prescription Document Scan
                  </div>

                  <div className="relative bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                    {/* Bounding box 1 */}
                    <div className="p-2 rounded-lg border-2 border-emerald-500 bg-emerald-50/50 relative">
                      <span className="absolute -top-2.5 left-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-600 text-white uppercase">
                        Region #1
                      </span>
                      <p className="text-sm font-serif italic text-slate-800">
                        Tab. Amoxicillin 500mg (1-0-1)
                      </p>
                    </div>

                    {/* Bounding box 2 */}
                    <div className="p-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 relative">
                      <span className="absolute -top-2.5 left-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-400 text-white uppercase">
                        Region #2
                      </span>
                      <p className="text-xs font-serif italic text-slate-500">
                        Tab. Paracetamol 650mg SOS
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-400 pt-1">
                      Localized text regions identified by layout model.
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Trained on multi-engine medical character recognition models.
                </div>
              </div>

              {/* Right Side: Detected Information */}
              <div className="md:col-span-6 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
                    Detected Information
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Medicine:</span>
                      <span className="font-bold text-slate-900">Amoxicillin</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Strength:</span>
                      <span className="font-semibold text-slate-900">500 mg</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Form:</span>
                      <span className="font-semibold text-slate-900">Tablet</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Frequency:</span>
                      <span className="font-semibold text-slate-900">1-0-1 (Morning & Night)</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Confidence:</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                        92% Confidence
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Some handwriting may require manual verification.</span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handlePrimaryUploadClick('prescriptions')}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    <span>Review extraction</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. TRUST / UNCERTAINTY SECTION                          */}
      {/* ======================================================== */}
      <section className="py-20 md:py-28 bg-white border-y border-slate-200/80">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              AI should know when it isn't sure.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              VaidyaVaani is designed to surface uncertainty rather than hide it. When handwriting or medical information is unclear, users are prompted to review the result.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            
            {/* State 1: High Confidence */}
            <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">High Confidence</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-sm font-bold text-slate-900">✓ Ready to review</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear printed or standardized handwriting matches established medicine dictionaries.
              </p>
            </div>

            {/* State 2: Medium Confidence */}
            <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Medium Confidence</span>
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-sm font-bold text-slate-900">Review suggested</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ambiguous strokes detected; system presents candidate matches for user confirmation.
              </p>
            </div>

            {/* State 3: Low Confidence */}
            <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Low Confidence</span>
                <HelpCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-sm font-bold text-slate-900">Manual verification required</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Heavy cursive or damaged images are flagged explicitly to prevent incorrect assumptions.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. RESEARCH & TECHNOLOGY SECTION                        */}
      {/* ======================================================== */}
      <section id="technology" className="py-20 md:py-28 bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-200/70 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              Research Prototype
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Technology behind VaidyaVaani
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Combining document computer vision, specialized handwriting recognition models, and clinical dictionary verification.
            </p>
          </div>

          {/* Minimal Pipeline Flowchart */}
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
              
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                1. Prescription
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                2. Image Preprocessing
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                3. Region Detection
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
                4. Handwriting / OCR
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                5. Medicine Matching
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                6. AI Explanation
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
                7. User Verification
              </div>

            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
              <span>Evaluated on multi-engine OCR and prescription benchmark datasets.</span>
              <span className="font-medium text-slate-700">Human-in-the-loop verification design</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. PRIVACY & SECURITY SECTION (Clean Dark Navy #0F172A) */}
      {/* ======================================================== */}
      <section id="privacy" className="py-20 md:py-28 bg-[#0F172A] text-slate-300">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Your health information deserves care.
            </h2>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              We design our architecture so that you remain in full control of your personal health data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            
            {/* Principle 1 */}
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Privacy-first</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Health documents are processed only to assist your personal comprehension.
              </p>
            </div>

            {/* Principle 2 */}
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Secure processing</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Encrypted transit and secure database vaults protect uploaded records.
              </p>
            </div>

            {/* Principle 3 */}
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">User-controlled records</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                You can export, modify, or remove your stored records at any time.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. FINAL CALL TO ACTION                                 */}
      {/* ======================================================== */}
      <section className="py-20 md:py-28 bg-white text-center">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-2xl mx-auto space-y-6">
            
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Make your medical records easier to understand.
            </h2>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Start with a prescription or medical report.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => handlePrimaryUploadClick('prescriptions')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-[#059669] hover:bg-[#047857] text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload a Prescription</span>
              </button>

              <Link
                to={isAuthenticated ? "/home" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
              >
                <span>Explore VaidyaVaani</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. REAL UPLOAD MODAL (Prescriptions & Lab Reports)     */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" 
              onClick={() => !uploading && setIsUploadOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-7 overflow-hidden text-slate-900"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {uploadCategory === 'prescriptions' ? 'Upload Prescription' : 'Upload Medical Report'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {uploadCategory === 'prescriptions' 
                      ? 'Upload doctor slip, handwritten notes, or pharmacy prescription' 
                      : 'Upload blood test, diagnostic report, or metabolic panel'}
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadOpen(false)}
                  disabled={uploading}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Selector */}
              <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUploadCategory('prescriptions')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    uploadCategory === 'prescriptions' 
                      ? 'bg-white text-emerald-800 shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Prescription
                </button>
                <button
                  type="button"
                  onClick={() => setUploadCategory('reports')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    uploadCategory === 'reports' 
                      ? 'bg-white text-emerald-800 shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lab Report
                </button>
              </div>

              {/* Hidden File and Camera Inputs */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden" 
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <input 
                type="file" 
                ref={cameraInputRef}
                onChange={handleFileChange}
                className="hidden" 
                accept="image/*"
                capture="environment"
              />

              {/* Drop / Select Zone */}
              {!selectedFile ? (
                <div className="space-y-3">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-emerald-500/80 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Click to choose file or drag & drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports JPG, PNG, PDF (Up to 10MB)
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs text-slate-400">or</span>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <span>Take Photo with Camera</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 truncate max-w-[220px]">
                          {selectedFile.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      disabled={uploading}
                      className="text-xs text-slate-400 hover:text-rose-600 font-medium cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  {uploading && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-500 font-mono">
                        <span>Uploading & analyzing...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {uploadStatus === 'error' && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {uploadStatus === 'success' && (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>Upload complete! Redirecting to interpretation...</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      disabled={uploading}
                      className="w-1/3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleFileUpload}
                      disabled={uploading || uploadStatus === 'success'}
                      className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Proceed with Analysis</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-5 pt-3 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400">
                  {isAuthenticated ? 'Encrypted & linked to your Patient Vault' : 'Sign in required to persist your health vault'}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Landing;
