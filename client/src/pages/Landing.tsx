import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Check, 
  Globe, 
  Volume2, 
  VolumeX, 
  UploadCloud,
  Pill,
  HeartPulse,
  Phone,
  ChevronRight,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  X
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentLanguage, t, speakText, stopSpeaking, isSpeaking } = useLanguage();

  const [activeSeverityTab, setActiveSeverityTab] = useState<'low' | 'mod' | 'crit'>('mod');
  const [isDemoUploadOpen, setIsDemoUploadOpen] = useState(false);

  const toggleVoiceDemo = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText();
    }
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-sky-600 selection:text-white">
      <Navbar />

      {/* =========================================================
          HERO SECTION: High-Trust Hospital & Clinical Banner
          ========================================================= */}
      <section className="relative bg-gradient-to-b from-sky-50/70 via-white to-[#f8fafc] pt-14 pb-28 border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-6 border border-sky-200">
            <HeartPulse className="w-4 h-4 text-sky-600" />
            Trusted Healthcare Safety Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.12] mb-6 max-w-4xl mx-auto">
            Making Clinical Healthcare Clear, Safe & Accessible for Every Family.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto font-normal">
            A secure digital medical vault that cross-checks prescriptions across doctors for dangerous drug interactions, simplifies blood test lab reports, and delivers plain-language voice guidance in 7 regional Indian languages.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button 
              onClick={handleCtaClick}
              className="btn-med-primary py-3.5 px-7 text-sm font-semibold flex items-center gap-2"
            >
              <span>{isAuthenticated ? 'Open Clinical Workspace' : 'Access Patient Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a 
              href="#safety-matrix" 
              className="btn-med-secondary py-3.5 px-6 text-sm font-semibold"
            >
              Check Drug Interactions
            </a>
          </div>

          {/* Clinical Assurance Bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-500 pt-6 border-t border-slate-200/80 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Zero-Knowledge Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>Standard Pharmacopeia Screening</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>7 Indian Regional Dialects</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          CLASSIC 4 OVERLAPPING FEATURE CARDS (CareMed / Medilink Pattern)
          ========================================================= */}
      <section className="relative z-20 max-w-[1280px] mx-auto px-6 lg:px-12 -mt-16 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Emergency SOS Medical ID */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all border-t-4 border-t-rose-500 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Emergency SOS & ID</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Rapid clinical medical card with blood group, active allergies, and direct emergency hospital dialers (108 / 102).
              </p>
            </div>
            <div className="text-xs font-semibold text-rose-600 flex items-center gap-1">
              <span>24/7 Rapid Response</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Prescription & Drug Safety */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all border-t-4 border-t-teal-500 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Drug Safety Matrix</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Multi-doctor prescription screening that prevents dangerous drug-drug conflicts and bioavailability spacing errors.
              </p>
            </div>
            <a href="#safety-matrix" className="text-xs font-semibold text-teal-600 flex items-center gap-1">
              <span>View Safety Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Lab Biomarker Ingestion */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all border-t-4 border-t-sky-500 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Lab Report Decoder</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Automated extraction of HbA1c, fasting glucose, lipid profiles, and CBC with standard reference ranges.
              </p>
            </div>
            <a href="#lab-decoder" className="text-xs font-semibold text-sky-600 flex items-center gap-1">
              <span>Explore Diagnostic Decoder</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4: Regional Voice Care */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all border-t-4 border-t-indigo-500 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Regional Voice Audio</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Prescriptions and health guidance translated and spoken in Hindi, Bengali, Tamil, Telugu, Marathi, and Gujarati.
              </p>
            </div>
            <a href="#multilingual-voice" className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
              <span>Listen to Speech Demo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION: CLINICAL SERVICES & DEPARTMENTS
          ========================================================= */}
      <section id="services" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="med-badge mb-2 font-mono">
              Clinical Specializations
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Specialized Care for Every Health Need
            </h2>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              VaidyaVaani coordinates treatment parameters across major medical disciplines, ensuring that specialized therapies work harmoniously.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Dept 1 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Cardiology & Hypertension</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tracking beta-blockers, ACE inhibitors, and blood pressure trends with dietary sodium advisories.
              </p>
            </div>

            {/* Dept 2 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Endocrinology & Diabetes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monitoring HbA1c, fasting glucose levels, and oral hypoglycemic drug schedules over time.
              </p>
            </div>

            {/* Dept 3 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Pathology & Lab Diagnostics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant optical extraction of blood test markers, lipid profiles, kidney function, and liver enzymes.
              </p>
            </div>

            {/* Dept 4 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Gastroenterology Spacing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated reminders for antacids, proton-pump inhibitors, and gut absorption intervals.
              </p>
            </div>

            {/* Dept 5 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Pharmacology Contraindication</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time safety flags for anticoagulants, NSAIDs, and allergic reaction risks.
              </p>
            </div>

            {/* Dept 6 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Family Health Vault</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage unified health records and emergency contacts for elderly parents, children, and dependents.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURE 1: INTERACTIVE DRUG SAFETY MATRIX (Interactive Medical Tool)
          ========================================================= */}
      <section id="safety-matrix" className="py-20 bg-[#f8fafc] border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="max-w-2xl mb-12">
            <div className="med-badge mb-2 font-mono">
              Pharmacology Safety Screening
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Interactive Drug Interaction Screening
            </h2>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              When patients visit multiple doctors, prescription cross-effects can cause serious complications. Select a clinical scenario below to see how VaidyaVaani safeguards patient care:
            </p>
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
            <div className="lg:col-span-8 bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-md">
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
                  <div className="text-xs font-mono text-slate-500 uppercase">Primary Therapy</div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {activeSeverityTab === 'crit' ? 'Warfarin 5mg' : activeSeverityTab === 'mod' ? 'Atenolol 50mg' : 'Atorvastatin 20mg'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Prescribed by Cardiologist</div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-mono text-slate-500 uppercase">Co-Administered Agent</div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {activeSeverityTab === 'crit' ? 'Aspirin 325mg (NSAID)' : activeSeverityTab === 'mod' ? 'Magnesium Hydroxide' : 'Grapefruit Extract'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Secondary Prescription / Over-the-counter</div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border text-xs sm:text-sm leading-relaxed ${
                activeSeverityTab === 'crit' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                activeSeverityTab === 'mod' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                'bg-teal-50 border-teal-200 text-teal-900'
              }`}>
                <div className="font-bold uppercase text-xs font-mono mb-1">Clinical Pharmacist Summary:</div>
                <p>
                  {activeSeverityTab === 'crit' && 'Severe hemorrhagic hazard: Concomitant platelet inhibition and coagulation cascade suppression dramatically elevate GI bleeding. Notify physician immediately to review alternative analgesics.'}
                  {activeSeverityTab === 'mod' && 'Chelation & pH interference: Antacids bind with beta-blockers in the stomach, reducing peak absorption by up to 35%. Take Atenolol at least 2 hours before antacids.'}
                  {activeSeverityTab === 'low' && 'Metabolic pathway competition: Ingestion with meals reduces mild gastric discomfort. No significant therapeutic alteration observed.'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURE 2: LAB BIOMARKER DECODER (Diagnostic Report Table)
          ========================================================= */}
      <section id="lab-decoder" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Medical Lab Report View */}
            <div className="lg:col-span-6 bg-[#f8fafc] rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div>
                  <div className="text-xs font-mono text-slate-500 uppercase">Pathology Ingestion</div>
                  <h3 className="text-lg font-bold text-slate-900">Comprehensive Metabolic & Lipid Panel</h3>
                </div>
                <span className="text-xs font-mono font-bold text-sky-700 bg-sky-100 px-2.5 py-1 rounded">
                  Ref Norms 2026
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                  <div>
                    <div className="text-xs text-slate-500 font-mono">HEMOGLOBIN A1C</div>
                    <div className="text-sm font-bold text-slate-900">5.4%</div>
                  </div>
                  <span className="text-xs text-teal-700 font-semibold font-mono px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                    Normal (&lt; 5.7%)
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200 flex items-center justify-between shadow-xs">
                  <div>
                    <div className="text-xs text-amber-700 font-mono">FASTING BLOOD GLUCOSE</div>
                    <div className="text-sm font-bold text-slate-900">108 mg/dL</div>
                  </div>
                  <span className="text-xs text-amber-700 font-semibold font-mono px-2 py-0.5 rounded bg-amber-100 border border-amber-300">
                    Mild Elevation (70–99)
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                  <div>
                    <div className="text-xs text-slate-500 font-mono">LIPID PROFILE (LDL CHOLESTEROL)</div>
                    <div className="text-sm font-bold text-slate-900">94 mg/dL</div>
                  </div>
                  <span className="text-xs text-teal-700 font-semibold font-mono px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                    Optimal (&lt; 100)
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                  <div>
                    <div className="text-xs text-slate-500 font-mono">TOTAL LEUKOCYTES (WBC)</div>
                    <div className="text-sm font-bold text-slate-900">7,200 /µL</div>
                  </div>
                  <span className="text-xs text-teal-700 font-semibold font-mono px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                    Normal (4.5k–11k)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Diagnostic Features */}
            <div className="lg:col-span-6">
              <div className="med-badge mb-2 font-mono">
                Diagnostic Clarity
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
                Understand Pathology Reports Without Confusion
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Blood tests and lab numbers often cause unnecessary anxiety. VaidyaVaani interprets complex clinical values into clear explanations, highlighting what is normal and what needs a doctor's attention.
              </p>

              <div className="space-y-3.5 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-slate-700">Instant extraction of reference ranges, normal boundaries, and clinical units.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-slate-700">Tracks longitudinal changes across tests to observe metabolic health trends.</p>
                </div>
              </div>

              <button 
                onClick={() => setIsDemoUploadOpen(true)}
                className="btn-med-primary text-xs font-semibold"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Sample Lab Report</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURE 3: MULTILINGUAL VOICE INCLUSIVITY
          ========================================================= */}
      <section id="multilingual-voice" className="py-20 bg-[#0f172a] text-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-900/60 text-sky-400 text-xs font-mono uppercase tracking-wider mb-4 border border-sky-700">
                <Globe className="w-3.5 h-3.5" />
                Universal Regional Inclusivity
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                Healthcare Clarity in the Languages Families Speak at Home.
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-8">
                Elderly parents and rural patients often find English medical jargon difficult to follow. VaidyaVaani translates and reads prescription instructions aloud in 7 Indian regional languages.
              </p>

              {/* Functional Audio Player Box */}
              <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-wrap items-center justify-between gap-4 max-w-lg mb-6 shadow-md">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={toggleVoiceDemo}
                    className="w-12 h-12 rounded-lg bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
                  >
                    {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <span>{currentLanguage.native} Speech Audio</span>
                      <span className="text-[10px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">ACTIVE</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {isSpeaking ? 'Playing voice guidance...' : 'Click play button to listen'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 cursor-pointer pr-2" onClick={toggleVoiceDemo}>
                  {[30, 60, 25, 80, 45, 70, 35].map((height, i) => (
                    <div 
                      key={i} 
                      className={`w-1 bg-sky-400 rounded-full transition-all duration-300 ${isSpeaking ? 'animate-pulse' : 'opacity-40'}`}
                      style={{ height: `${isSpeaking ? height * 0.35 : 8}px` }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Supported: English • हिन्दी • বাংলা • தமிழ் • తెలుగు • मराठी • ગુજરાતી
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800 rounded-xl p-8 border border-slate-700 text-center shadow-xl">
              <div className="w-14 h-14 rounded-full bg-sky-900/60 border border-sky-700 text-sky-400 flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-7 h-7" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {currentLanguage.code === 'hi' ? 'स्वास्थ्य मार्गदर्शन' :
                 currentLanguage.code === 'bn' ? 'চিকিৎসা পরামর্শ' :
                 currentLanguage.code === 'ta' ? 'ஆரோக்கிய அறிவுரை' :
                 currentLanguage.code === 'te' ? 'ఆరోగ్య సలహా' :
                 currentLanguage.code === 'mr' ? 'वैद्यकीय सल्ला' :
                 currentLanguage.code === 'gu' ? 'સ્વાસ્થ્ય સલાહ' :
                 'Clinical Audio Guidance'}
              </div>
              <p className="text-sm text-slate-300 italic mb-6 leading-relaxed">
                "{currentLanguage.demoSpeechText}"
              </p>
              <button 
                onClick={toggleVoiceDemo}
                className="btn-med-primary text-xs font-semibold"
              >
                {isSpeaking ? 'Stop Voice Demo' : `Play Voice in ${currentLanguage.native}`}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          EMERGENCY 24/7 CALLOUT BANNER (Classic Hospital Banner)
          ========================================================= */}
      <section className="bg-sky-700 text-white py-12">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-sky-200">Emergency Medical Assistance</div>
              <h3 className="text-2xl font-bold text-white">Call National Emergency Hotline: 108 / 102</h3>
            </div>
          </div>

          <button 
            onClick={handleCtaClick}
            className="bg-white text-sky-800 hover:bg-sky-50 font-bold px-6 py-3 rounded-lg text-sm shadow-md transition-all shrink-0"
          >
            {isAuthenticated ? 'Open Health Vault' : 'Sign In to Patient Portal'}
          </button>
        </div>
      </section>

      {/* Modal: Document Ingestion Demo */}
      <AnimatePresence>
        {isDemoUploadOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsDemoUploadOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-sky-600 font-mono">
                    Document Ingestion
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{t('uploadLabReport')}</h3>
                </div>
                <button 
                  onClick={() => setIsDemoUploadOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div 
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/home');
                  } else {
                    navigate('/login');
                  }
                }}
                className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-sky-50/50 transition-all"
              >
                <UploadCloud className="w-10 h-10 text-sky-600 mx-auto mb-3" />
                <div className="text-sm font-bold text-slate-900">Select PDF or Image</div>
                <p className="text-xs text-slate-500 mt-1">Authenticate to process clinical lab results securely</p>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => {
                    setIsDemoUploadOpen(false);
                    navigate('/login');
                  }}
                  className="btn-med-primary text-xs"
                >
                  Continue to Login
                </button>
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
