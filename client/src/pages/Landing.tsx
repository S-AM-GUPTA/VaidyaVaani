import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Lock, 
  Globe2, 
  Volume2, 
  VolumeX, 
  X,
  UploadCloud,
  Check
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
    <div className="min-h-screen bg-[#090d16] text-[#f8fafc] font-sans selection:bg-[#0d9488] selection:text-white">
      <Navbar />

      {/* =========================================================
          HERO SECTION: High-Trust Clinical Health Intelligence
          ========================================================= */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Authoritative Medical Value Proposition */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-500/30 text-teal-400 text-xs font-mono uppercase tracking-wider mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Clinical Pharmacopeia & Diagnostic Vault
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-semibold text-white tracking-tight leading-[1.08] mb-6">
              Prescription safety & lab diagnostics, <br />
              <span className="text-teal-400">explained in your language.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-[560px]">
              VaidyaVaani safeguards patient care by detecting harmful drug interactions across multiple doctors and translating clinical lab reports into clear, actionable health summaries.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button 
                onClick={handleCtaClick}
                className="btn-primary py-3.5 px-6 text-sm font-semibold flex items-center gap-2"
              >
                <span>{isAuthenticated ? t('openDashboard') : 'Access Patient Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a 
                href="#safety-matrix" 
                className="btn-secondary py-3.5 px-5 text-sm font-medium"
              >
                Explore Drug Safety Matrix
              </a>
            </div>

            {/* Trusted Medical Standard Badges */}
            <div className="pt-6 border-t border-[#1e293b] grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="text-lg font-semibold text-white font-mono">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Zero-Knowledge Encrypted</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-teal-400 font-mono">7+ Regional</div>
                <div className="text-xs text-slate-400 mt-0.5">Indian Dialects</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-400 font-mono">Multi-Rx</div>
                <div className="text-xs text-slate-400 mt-0.5">Cross-Interaction Check</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Clinical Intelligence Simulator */}
          <div className="lg:col-span-5">
            <div className="clinical-card p-6 border border-[#1e293b] shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#1e293b] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400"></div>
                  <span className="text-xs font-mono text-slate-200 uppercase tracking-wider">Live Clinical Audit</span>
                </div>
                <span className="text-[11px] font-mono text-teal-400 bg-teal-950/50 px-2 py-0.5 rounded border border-teal-500/20">Verified Protocol</span>
              </div>

              {/* Simulated Patient Prescription Record */}
              <div className="space-y-3 mb-4">
                <div className="p-3.5 rounded-lg bg-[#131a2b] border border-[#1e293b] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Atenolol 50mg (Beta-Blocker)</div>
                    <div className="text-[11px] text-slate-400">Dr. Sharma (Cardiology) • 1-0-0</div>
                  </div>
                  <span className="text-[10px] font-mono text-teal-400 font-medium px-2 py-0.5 rounded bg-teal-950/40 border border-teal-500/30">Active</span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#131a2b] border border-[#1e293b] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Magnesium Hydroxide (Antacid)</div>
                    <div className="text-[11px] text-slate-400">Dr. Verma (Gastroenterology) • SOS</div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 font-medium px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">Spacing Required</span>
                </div>
              </div>

              {/* Safety Assessment Alert */}
              <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs leading-relaxed mb-4">
                <div className="font-semibold text-amber-400 flex items-center gap-1.5 mb-1 font-mono uppercase text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Pharmacokinetic Spacing Advisory
                </div>
                Antacids decrease Atenolol gastrointestinal absorption by up to 35%. Take Atenolol at least <strong>2 hours before</strong> antacid administration.
              </div>

              {/* Biomarker Summary Strip */}
              <div className="p-3 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Latest Fasting Glucose:</span>
                <span className="text-teal-400 font-semibold">108 mg/dL (Mild Elevation)</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================
          FEATURE 1: PHARMACOKINETIC SAFETY MATRIX
          ========================================================= */}
      <section id="safety-matrix" className="py-20 border-t border-[#1e293b] bg-[#0c111c]/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="max-w-2xl mb-12">
            <div className="clinical-badge mb-3 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Pharmacology Safety Matrix
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Prevent unintended drug interactions across multiple prescriptions.
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              When consulting different specialists, drug-drug conflicts often go unnoticed. VaidyaVaani automatically cross-checks your medications against medical registries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive Selector */}
            <div className="lg:col-span-4 space-y-3">
              <button 
                onClick={() => setActiveSeverityTab('low')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeSeverityTab === 'low' 
                    ? 'bg-[#131a2b] border-teal-500/80 shadow-md' 
                    : 'bg-[#0f1523] border-[#1e293b] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono uppercase text-teal-400 font-semibold mb-1">Low Clinical Risk</div>
                <div className="text-sm font-semibold text-white">Food & Dietary Timing</div>
                <div className="text-xs text-slate-400 mt-1">Minor gastrointestinal interactions manageable with meals.</div>
              </button>

              <button 
                onClick={() => setActiveSeverityTab('mod')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeSeverityTab === 'mod' 
                    ? 'bg-[#131a2b] border-amber-500/80 shadow-md' 
                    : 'bg-[#0f1523] border-[#1e293b] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono uppercase text-amber-400 font-semibold mb-1">Moderate Risk</div>
                <div className="text-sm font-semibold text-white">Dosage Spacing Adjustments</div>
                <div className="text-xs text-slate-400 mt-1">Bioavailability reduction requiring timed intervals.</div>
              </button>

              <button 
                onClick={() => setActiveSeverityTab('crit')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeSeverityTab === 'crit' 
                    ? 'bg-[#131a2b] border-rose-500/80 shadow-md' 
                    : 'bg-[#0f1523] border-[#1e293b] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono uppercase text-rose-400 font-semibold mb-1">Critical Contraindication</div>
                <div className="text-sm font-semibold text-white">Adverse Antagonism</div>
                <div className="text-xs text-slate-400 mt-1">Severe clinical complications requiring immediate doctor review.</div>
              </button>
            </div>

            {/* Detailed Inspection Display */}
            <div className="lg:col-span-8 clinical-card p-6 md:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#1e293b] mb-6">
                <div className="text-sm font-semibold text-white font-mono">
                  {activeSeverityTab === 'low' && 'Case A: Atorvastatin (Lipids) + Grapefruit Extract'}
                  {activeSeverityTab === 'mod' && 'Case B: Atenolol (Blood Pressure) + Magnesium Antacids'}
                  {activeSeverityTab === 'crit' && 'Case C: Warfarin (Blood Thinner) + High-Dose Aspirin'}
                </div>
                <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded ${
                  activeSeverityTab === 'crit' ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40' :
                  activeSeverityTab === 'mod' ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40' :
                  'bg-teal-950/60 text-teal-300 border border-teal-500/40'
                }`}>
                  {activeSeverityTab === 'crit' ? 'High Hazard' : activeSeverityTab === 'mod' ? 'Moderate Risk' : 'Low Risk'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-[#090d16] border border-[#1e293b]">
                  <div className="text-xs font-mono text-slate-400 uppercase">Primary Therapy</div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {activeSeverityTab === 'crit' ? 'Warfarin 5mg' : activeSeverityTab === 'mod' ? 'Atenolol 50mg' : 'Atorvastatin 20mg'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Cardiovascular Regimen</div>
                </div>

                <div className="p-4 rounded-lg bg-[#090d16] border border-[#1e293b]">
                  <div className="text-xs font-mono text-slate-400 uppercase">Co-Administered Agent</div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {activeSeverityTab === 'crit' ? 'Aspirin 325mg (NSAID)' : activeSeverityTab === 'mod' ? 'Magnesium Hydroxide' : 'CYP3A4 Inhibitor'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Secondary Prescription</div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${
                activeSeverityTab === 'crit' ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' :
                activeSeverityTab === 'mod' ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' :
                'bg-teal-950/20 border-teal-500/30 text-teal-200'
              }`}>
                <div className="font-semibold text-xs uppercase font-mono mb-1">Clinical Pharmacist Note:</div>
                <p className="text-xs leading-relaxed">
                  {activeSeverityTab === 'crit' && 'Severe hemorrhagic hazard: Concomitant platelet inhibition and coagulation cascade suppression dramatically elevate GI bleeding. Alert physician immediately.'}
                  {activeSeverityTab === 'mod' && 'Chelation & pH interference: Antacids bind with beta-blockers in the stomach, reducing peak blood concentration by 35%. Space dosages by a minimum of 2 hours.'}
                  {activeSeverityTab === 'low' && 'Metabolic pathway competition: Ingestion with meals reduces mild gastric discomfort. No significant therapeutic alteration observed.'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          FEATURE 2: LAB BIOMARKER DECODER
          ========================================================= */}
      <section id="lab-decoder" className="py-20 border-t border-[#1e293b]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Diagnostic Report Data Table */}
            <div className="lg:col-span-6 clinical-card p-6 md:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#1e293b] mb-6">
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase">Automated OCR Extraction</div>
                  <h3 className="text-lg font-semibold text-white">Comprehensive Metabolic & Lipid Panel</h3>
                </div>
                <span className="text-xs font-mono text-teal-400 bg-teal-950/50 px-2.5 py-1 rounded border border-teal-500/30">
                  Ref Ranges 2026
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-mono">HEMOGLOBIN A1C</div>
                    <div className="text-sm font-semibold text-white">5.4%</div>
                  </div>
                  <span className="text-xs text-teal-400 font-medium font-mono px-2 py-0.5 rounded bg-teal-950/40 border border-teal-500/20">
                    Normal (&lt; 5.7%)
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-mono">FASTING BLOOD GLUCOSE</div>
                    <div className="text-sm font-semibold text-white">108 mg/dL</div>
                  </div>
                  <span className="text-xs text-amber-400 font-medium font-mono px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/20">
                    Mild Elevation (70–99)
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-mono">LIPID PROFILE (LDL CHOLESTEROL)</div>
                    <div className="text-sm font-semibold text-white">94 mg/dL</div>
                  </div>
                  <span className="text-xs text-teal-400 font-medium font-mono px-2 py-0.5 rounded bg-teal-950/40 border border-teal-500/20">
                    Optimal (&lt; 100)
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-mono">TOTAL LEUKOCYTES (WBC)</div>
                    <div className="text-sm font-semibold text-white">7,200 /µL</div>
                  </div>
                  <span className="text-xs text-teal-400 font-medium font-mono px-2 py-0.5 rounded bg-teal-950/40 border border-teal-500/20">
                    Normal (4.5k–11k)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Explanations */}
            <div className="lg:col-span-6">
              <div className="clinical-badge mb-3 font-mono">
                <Activity className="w-3.5 h-3.5" />
                Diagnostic Report Decoding
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">
                Understand your lab results without clinical confusion.
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                Upload photos or PDF copies of blood tests, lipid profiles, and pathology reports. VaidyaVaani extracts each parameter and summarizes what numbers mean in everyday language.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-teal-950 text-teal-400 border border-teal-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-slate-300">Instant extraction of reference ranges, high/low flags, and units.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-teal-950 text-teal-400 border border-teal-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-slate-300">Tracks changes across tests over time to monitor metabolic trends.</p>
                </div>
              </div>

              <button 
                onClick={() => setIsDemoUploadOpen(true)}
                className="btn-primary py-3 px-5 text-xs font-semibold"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Sample Lab Report
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          FEATURE 3: MULTILINGUAL HEALTH VOICE INTELLIGENCE
          ========================================================= */}
      <section id="multilingual-voice" className="py-20 border-t border-[#1e293b] bg-[#0c111c]/60">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <div className="clinical-badge mb-3 font-mono">
                <Globe2 className="w-3.5 h-3.5" />
                Universal Patient Inclusivity
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">
                Health clarity in the regional languages families speak at home.
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                Complex medical English creates barriers for elderly patients and non-English speaking family members. VaidyaVaani explains prescriptions and medical advice clearly in Hindi, Bengali, Tamil, Telugu, Marathi, and Gujarati.
              </p>

              {/* Functional Voice Player */}
              <div className="p-4 rounded-xl bg-[#0f1523] border border-[#1e293b] flex items-center justify-between max-w-lg mb-6">
                <div className="flex items-center gap-3.5">
                  <button 
                    onClick={toggleVoiceDemo}
                    className="w-10 h-10 rounded-lg bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition-colors shrink-0 shadow-md"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      <span>{currentLanguage.native} Health Narration</span>
                      <span className="text-[10px] font-mono text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-500/30">AUDIO DEMO</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {isSpeaking ? 'Playing voice synthesis...' : 'Click to listen to prescription summary'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 cursor-pointer pr-2" onClick={toggleVoiceDemo}>
                  {[30, 60, 25, 80, 45, 70, 35].map((height, i) => (
                    <div 
                      key={i} 
                      className={`w-1 bg-teal-400 rounded-full transition-all duration-300 ${isSpeaking ? 'animate-pulse' : 'opacity-40'}`}
                      style={{ height: `${isSpeaking ? height * 0.3 : 6}px` }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Supported: English • हिन्दी • বাংলা • தமிழ் • తెలుగు • मराठी • ગુજરાતી
              </div>
            </div>

            <div className="lg:col-span-5 clinical-card p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-950/60 border border-teal-500/40 text-teal-400 flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-6 h-6" />
              </div>
              <div className="text-2xl font-semibold text-white mb-2">
                {currentLanguage.code === 'hi' ? 'स्वास्थ्य ज्ञान' :
                 currentLanguage.code === 'bn' ? 'স্বাস্থ্য সচেতনতা' :
                 currentLanguage.code === 'ta' ? 'ஆரோக்கிய அறிவு' :
                 currentLanguage.code === 'te' ? 'ఆరోగ్య స్పష్టత' :
                 currentLanguage.code === 'mr' ? 'आरोग्य मार्गदर्शन' :
                 currentLanguage.code === 'gu' ? 'સ્વાસ્થ્ય જ્ઞાન' :
                 'Clinical Clarity'}
              </div>
              <p className="text-xs text-slate-300 italic mb-6 leading-relaxed">
                "{currentLanguage.demoSpeechText}"
              </p>
              <button 
                onClick={toggleVoiceDemo}
                className="btn-secondary text-xs font-mono uppercase"
              >
                {isSpeaking ? 'Stop Audio' : `Play Voice in ${currentLanguage.native}`}
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          WORKFLOW / HOW IT WORKS
          ========================================================= */}
      <section id="workflow" className="py-20 border-t border-[#1e293b]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="max-w-xl mb-14">
            <div className="clinical-badge mb-3 font-mono">
              <Cpu className="w-3.5 h-3.5" />
              Clinical Processing Pipeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              From paper prescription to verified patient insight.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="clinical-card p-6">
              <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-xs font-mono text-teal-400 mb-4">
                01
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Upload or Scan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Photograph paper prescriptions or upload lab PDF documents securely from your phone or PC.
              </p>
            </div>

            <div className="clinical-card p-6">
              <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-xs font-mono text-teal-400 mb-4">
                02
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Intelligent OCR</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-precision medical OCR extracts medicine names, dosages, biomarkers, and test values.
              </p>
            </div>

            <div className="clinical-card p-6">
              <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-xs font-mono text-teal-400 mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Pharmacology Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All records are cross-checked against international drug interaction databases and reference norms.
              </p>
            </div>

            <div className="clinical-card p-6">
              <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-xs font-mono text-teal-400 mb-4">
                04
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">Voice & Plain Language</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive clear advisories, dosage timelines, and voice guidance in your regional language.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          FINAL CTA
          ========================================================= */}
      <section className="py-24 border-t border-[#1e293b] bg-[#0c111c]/60 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="clinical-badge mb-4 font-mono">
            <Lock className="w-3.5 h-3.5" />
            Zero-Knowledge Patient Identity
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">
            Take command of your family's healthcare today.
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Join patients and caregivers managing multiple prescriptions, lab records, and emergency SOS profiles in one encrypted vault.
          </p>
          <button 
            onClick={handleCtaClick}
            className="btn-primary py-3.5 px-8 text-sm font-semibold"
          >
            {isAuthenticated ? 'Open Clinical Workspace' : 'Get Started with VaidyaVaani'}
          </button>
        </div>
      </section>

      {/* Demo Modal for Lab Report / Upload */}
      <AnimatePresence>
        {isDemoUploadOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsDemoUploadOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="bg-[#0f1523] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-[#1e293b] p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#1e293b] mb-6">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-400 font-mono">
                    Document Processing Portal
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-0.5">{t('uploadLabReport')}</h3>
                </div>
                <button 
                  onClick={() => setIsDemoUploadOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-300 flex items-center justify-center"
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
                className="border border-dashed border-[#334155] hover:border-teal-500 rounded-xl p-8 text-center cursor-pointer bg-[#090d16] hover:bg-[#131a2b] transition-all"
              >
                <UploadCloud className="w-10 h-10 text-teal-400 mx-auto mb-3" />
                <div className="text-sm font-semibold text-white">Select PDF or Image</div>
                <p className="text-xs text-slate-400 mt-1">Click to authenticate and process your clinical document</p>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => {
                    setIsDemoUploadOpen(false);
                    navigate('/login');
                  }}
                  className="btn-primary text-xs"
                >
                  Continue to Vault
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
