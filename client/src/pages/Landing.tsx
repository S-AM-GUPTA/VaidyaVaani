import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Globe, 
  Volume2, 
  UploadCloud,
  Pill,
  HeartPulse,
  Phone,
  ChevronRight,
  FileSpreadsheet,
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
  const { t } = useLanguage();

  const [activeSeverityTab, setActiveSeverityTab] = useState<'low' | 'mod' | 'crit'>('mod');
  const [isDemoUploadOpen, setIsDemoUploadOpen] = useState(false);

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

            <Link 
              to="/safety-matrix" 
              className="btn-med-secondary py-3.5 px-6 text-sm font-semibold flex items-center gap-2"
            >
              <span>Drug Safety Matrix</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
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
            <Link to={isAuthenticated ? "/profile" : "/login"} className="text-xs font-semibold text-rose-600 flex items-center gap-1 hover:underline">
              <span>View Emergency Medical ID</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
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
            <Link to="/safety-matrix" className="text-xs font-semibold text-teal-600 flex items-center gap-1 hover:underline">
              <span>Open Safety Matrix Tool</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
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
            <Link to="/lab-decoder" className="text-xs font-semibold text-sky-600 flex items-center gap-1 hover:underline">
              <span>Explore Lab Decoder Tool</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Regional Voice Care */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all border-t-4 border-t-indigo-500 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Regional Voice Care</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Prescriptions and health guidance translated and spoken in Hindi, Bengali, Tamil, Telugu, Marathi, and Gujarati.
              </p>
            </div>
            <Link to="/regional-care" className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:underline">
              <span>Listen in Regional Dialects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================
          SECTION: CLINICAL SERVICES & DEPARTMENTS
          ========================================================= */}
      <section id="services" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="med-badge mb-2 font-mono">
                Clinical Specializations
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Specialized Care for Every Health Need
              </h2>
            </div>

            <Link 
              to="/services" 
              className="btn-med-secondary text-xs font-semibold flex items-center gap-1.5 w-fit"
            >
              <span>View All 6 Clinical Departments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Dept 1 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Cardiology & Hypertension</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Tracking beta-blockers, ACE inhibitors, and blood pressure trends with dietary sodium advisories.
                </p>
              </div>
              <Link to="/services" className="text-xs font-semibold text-sky-600 flex items-center gap-1 hover:underline">
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Dept 2 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Endocrinology & Diabetes</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Monitoring HbA1c, fasting glucose levels, and oral hypoglycemic drug schedules over time.
                </p>
              </div>
              <Link to="/services" className="text-xs font-semibold text-teal-600 flex items-center gap-1 hover:underline">
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Dept 3 */}
            <div className="p-6 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-white hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Pathology & Lab Diagnostics</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Instant optical extraction of blood test markers, lipid profiles, kidney function, and liver enzymes.
                </p>
              </div>
              <Link to="/lab-decoder" className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:underline">
                <span>Open decoder</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURE 1: INTERACTIVE DRUG SAFETY MATRIX SECTION
          ========================================================= */}
      <section id="safety-matrix" className="py-20 bg-[#f8fafc] border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="med-badge mb-2 font-mono">
                Pharmacology Safety Screening
              </div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Interactive Drug Interaction Screening
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Select a clinical scenario below to see how VaidyaVaani flags contraindications and schedules dosage intervals:
              </p>
            </div>

            <Link 
              to="/safety-matrix" 
              className="btn-med-primary text-xs font-semibold flex items-center gap-1.5 w-fit shrink-0"
            >
              <span>Open Full Interactive Checker</span>
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
          EMERGENCY 24/7 CALLOUT BANNER
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
