import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Lock,
  Globe2,
  Volume2,
  VolumeX,
  ScanLine,
  FileSpreadsheet,
  Layers,
  HeartPulse
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ConstellationCanvas } from '../components/ConstellationCanvas';
import HeroNeuralBrain from '../components/HeroNeuralBrain';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const Landing = () => {
  const navigate = useNavigate();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSeverityTab, setActiveSeverityTab] = useState<'low' | 'mod' | 'crit'>('mod');

  const toggleVoiceDemo = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] font-sans overflow-x-hidden selection:bg-[#8052ff] selection:text-[#ffffff]">
      <Navbar />

      {/* Ambient background particle field */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25">
        <ConstellationCanvas variant="ambient" particleCount={70} interactive={false} />
      </div>

      {/* =========================================================
          HERO SECTION: Headline + 3D Neural Brain Model Component
          ========================================================= */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-10 lg:pt-14 pb-20">
        
        {/* Top Header Text & CTA Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Saffron Spark Uppercase Label */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d2d3] animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#00d2d3]">
              Distributed Medical Intelligence
            </span>
          </motion.div>
          
          {/* Monolithic Weight-400 Display Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-normal text-[#ffffff] leading-[1.06] tracking-[-0.04em] mb-5"
          >
            Understand your health. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8052ff] via-[#a855f7] to-[#00d2d3]">
              Weightless, unified & instant.
            </span>
          </motion.h1>
          
          {/* Body Copy */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-[#bdbdbd] font-light leading-relaxed mb-8 max-w-xl mx-auto"
          >
            Upload prescriptions and clinical lab reports. Decode biomarkers, cross-reference drug contraindications across doctors, and receive spoken regional guidance.
          </motion.p>
          
          {/* Action Button */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#8052ff] hover:bg-[#6c3df5] text-white px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.025em] transition-all duration-300 flex items-center group active:scale-[0.98] shadow-[0_0_35px_rgba(128,82,255,0.4)]"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>

            <a 
              href="#pipeline" 
              className="text-xs font-normal text-[#9a9a9a] hover:text-[#ffffff] tracking-[0.02em] transition-colors flex items-center gap-1.5 px-4 py-4"
            >
              View Pipeline <span className="text-[#8052ff]">↓</span>
            </a>
          </motion.div>
        </motion.div>

        {/* 3D Neural Brain Model Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <HeroNeuralBrain />
        </motion.div>

        {/* Floating Telemetry Stats Bar */}
        <div className="mt-12 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          <div className="pt-2 md:pt-0">
            <div className="text-2xl font-normal text-[#ffffff] tracking-tight">95.4%</div>
            <div className="text-[10px] font-mono text-[#9a9a9a] uppercase tracking-wider mt-0.5">OCR Extraction</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl font-normal text-[#8052ff] tracking-tight">&lt; 4.8s</div>
            <div className="text-[10px] font-mono text-[#9a9a9a] uppercase tracking-wider mt-0.5">Neural Synthesis</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl font-normal text-[#00d2d3] tracking-tight">100%</div>
            <div className="text-[10px] font-mono text-[#9a9a9a] uppercase tracking-wider mt-0.5">Zero-Knowledge Encrypted</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl font-normal text-[#ffb829] tracking-tight">6+</div>
            <div className="text-[10px] font-mono text-[#9a9a9a] uppercase tracking-wider mt-0.5">Indian Regional Dialects</div>
          </div>
        </div>

      </section>


      {/* =========================================================
          PIPELINE SECTION: Upload → OCR → AI Analysis → Storage
          ========================================================= */}
      <section id="pipeline" className="relative z-10 py-20 lg:py-24 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="mb-14">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb829] mb-3">
              Processing Pipeline
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffffff] tracking-[-0.04em]">
              From prescription to crystal clarity in four stages.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#8052ff]/20 border border-[#8052ff]/40 flex items-center justify-center text-xs font-mono text-[#8052ff] mb-5">
                01
              </div>
              <ScanLine className="w-5 h-5 text-[#ffffff] mb-3" />
              <h3 className="text-base font-normal text-[#ffffff] mb-2">Multimodal Ingestion</h3>
              <p className="text-xs font-light text-[#9a9a9a] leading-relaxed">
                Accepts camera scans, PDF lab printouts, and photo gallery uploads with client-side sanitization.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#ffb829]/20 border border-[#ffb829]/40 flex items-center justify-center text-xs font-mono text-[#ffb829] mb-5">
                02
              </div>
              <FileSpreadsheet className="w-5 h-5 text-[#ffffff] mb-3" />
              <h3 className="text-base font-normal text-[#ffffff] mb-2">Neural OCR Extraction</h3>
              <p className="text-xs font-light text-[#9a9a9a] leading-relaxed">
                Deciphers doctor handwriting, tabular biomarker ranges, and dosage abbreviations with high precision.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#00d2d3]/20 border border-[#00d2d3]/40 flex items-center justify-center text-xs font-mono text-[#00d2d3] mb-5">
                03
              </div>
              <Layers className="w-5 h-5 text-[#ffffff] mb-3" />
              <h3 className="text-base font-normal text-[#ffffff] mb-2">Pharmacopeia Analysis</h3>
              <p className="text-xs font-light text-[#9a9a9a] leading-relaxed">
                Cross-references active prescriptions against contraindication databases to detect lethal interactions.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#8052ff]/20 border border-[#8052ff]/40 flex items-center justify-center text-xs font-mono text-[#8052ff] mb-5">
                04
              </div>
              <Volume2 className="w-5 h-5 text-[#ffffff] mb-3" />
              <h3 className="text-base font-normal text-[#ffffff] mb-2">Voice & Dialect Audio</h3>
              <p className="text-xs font-light text-[#9a9a9a] leading-relaxed">
                Generates spoken summaries in Hindi & regional languages so elderly and rural patients stay safe.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          SECTION 1: Two-Column Zigzag — Interaction Intelligence
          ========================================================= */}
      <section id="features" className="relative z-10 py-20 lg:py-24 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb829] mb-3">
                Safety Matrix & Interaction Radar
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffffff] leading-[1.08] tracking-[-0.04em] mb-5">
                Cross-reference active prescriptions in milliseconds.
              </h2>
              <p className="text-base text-[#bdbdbd] font-light leading-relaxed mb-6 max-w-[480px]">
                Eliminate uncertainty when managing multi-drug schedules across different doctors. Our neural engine checks contraindications, dosage spacing, and food interactions across international pharmacology databases.
              </p>

              {/* Severity Tab Selector */}
              <div className="flex gap-2 p-1 bg-white/[0.04] rounded-full border border-white/10 w-fit mb-6">
                <button 
                  onClick={() => setActiveSeverityTab('low')}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeSeverityTab === 'low' ? 'bg-[#15846e] text-white' : 'text-[#9a9a9a]'
                  }`}
                >
                  Low Risk
                </button>
                <button 
                  onClick={() => setActiveSeverityTab('mod')}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeSeverityTab === 'mod' ? 'bg-[#ffb829] text-black font-bold' : 'text-[#9a9a9a]'
                  }`}
                >
                  Moderate
                </button>
                <button 
                  onClick={() => setActiveSeverityTab('crit')}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeSeverityTab === 'crit' ? 'bg-red-500 text-white' : 'text-[#9a9a9a]'
                  }`}
                >
                  Critical Risk
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#8052ff]/15 border border-[#8052ff]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8052ff]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-[#ffffff] tracking-tight">Contraindication Radar</h3>
                    <p className="text-xs font-light text-[#9a9a9a] leading-relaxed mt-0.5">Instant alerts on antagonistic drug pairings before administration.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#ffb829]/15 border border-[#ffb829]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#ffb829]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-[#ffffff] tracking-tight">Pharmacokinetic Spacing</h3>
                    <p className="text-xs font-light text-[#9a9a9a] leading-relaxed mt-0.5">Automated interval scheduling to prevent absorption degradation.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Simulation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative p-7 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] backdrop-blur-xl">
                
                <div className="flex items-center justify-between pb-5 border-b border-white/[0.06] mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      activeSeverityTab === 'low' ? 'bg-[#15846e]' :
                      activeSeverityTab === 'mod' ? 'bg-[#ffb829] animate-pulse' : 'bg-red-500 animate-ping'
                    }`}></div>
                    <span className="text-xs font-mono text-[#ffffff] uppercase tracking-widest">
                      {activeSeverityTab === 'low' ? 'Low Risk: Food Timing' :
                       activeSeverityTab === 'mod' ? 'Moderate: Spacing Adjustment' : 'Critical: Adverse Interaction'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#9a9a9a]">Confidence: 99.8%</span>
                </div>

                {/* Drug pairing comparison */}
                <div className="space-y-3.5 mb-6">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#8052ff]/20 flex items-center justify-center text-[#8052ff] font-mono text-xs font-semibold">
                        Rx1
                      </div>
                      <div>
                        <div className="text-sm font-normal text-[#ffffff]">
                          {activeSeverityTab === 'crit' ? 'Warfarin — 5mg' : 'Atenolol — 50mg'}
                        </div>
                        <div className="text-[11px] font-light text-[#9a9a9a]">
                          {activeSeverityTab === 'crit' ? 'Anticoagulant (Blood Thinner)' : 'Beta-blocker (Cardiovascular)'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#8052ff]">Doctor A</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#ffb829]/20 flex items-center justify-center text-[#ffb829] font-mono text-xs font-semibold">
                        Rx2
                      </div>
                      <div>
                        <div className="text-sm font-normal text-[#ffffff]">
                          {activeSeverityTab === 'crit' ? 'Aspirin — 325mg' : 'Magnesium Hydroxide'}
                        </div>
                        <div className="text-[11px] font-light text-[#9a9a9a]">
                          {activeSeverityTab === 'crit' ? 'NSAID (Pain / Inflammation)' : 'Antacid Compound'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#ffb829]">Doctor B</span>
                  </div>
                </div>

                {/* Action Recommendation Box */}
                <div className={`p-4 rounded-2xl border ${
                  activeSeverityTab === 'crit' ? 'bg-red-950/40 border-red-500/30' :
                  activeSeverityTab === 'low' ? 'bg-[#15846e]/10 border-[#15846e]/20' : 'bg-[#ffb829]/10 border-[#ffb829]/20'
                }`}>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1">
                    <AlertTriangle className={`w-3.5 h-3.5 ${activeSeverityTab === 'crit' ? 'text-red-400' : 'text-[#ffb829]'}`} />
                    <span className={activeSeverityTab === 'crit' ? 'text-red-400' : 'text-[#ffb829]'}>
                      Clinical Safety Recommendation
                    </span>
                  </div>
                  <div className="text-xs font-light text-[#ffffff]/90 leading-relaxed">
                    {activeSeverityTab === 'crit' && 'High hemorrhagic risk. Concomitant use increases severe internal bleeding incidence. Consult prescribing physician immediately.'}
                    {activeSeverityTab === 'mod' && 'Space dosage by at least 2 hours. Antacids reduce Atenolol bioavailability by up to 35%.'}
                    {activeSeverityTab === 'low' && 'Take with food to minimize gastric irritation. No pharmacokinetic antagonism detected.'}
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* =========================================================
          SECTION 2: Two-Column Zigzag — Lab Report Deconstruction
          ========================================================= */}
      <section id="lab-decoder" className="relative z-10 py-20 lg:py-24 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Visual: Floating Lab Biomarkers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="relative p-7 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] backdrop-blur-xl">
                
                <div className="flex items-center justify-between pb-5 border-b border-white/[0.06] mb-5">
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-[#15846e]" />
                    <span className="text-xs font-mono text-[#ffffff] uppercase tracking-widest">Biomarker Diagnostic Mesh</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#8052ff]">Verified Reference Ranges</span>
                </div>

                {/* Biomarker Items */}
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-[#9a9a9a]">HEMOGLOBIN A1C</div>
                      <div className="text-lg font-normal text-[#ffffff] tracking-tight mt-0.5">5.4%</div>
                      <div className="text-[11px] font-light text-[#15846e] mt-0.5">Normal (Reference: &lt; 5.7%)</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#15846e]/20 border border-[#15846e]/40 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-[#15846e]" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-[#9a9a9a]">FASTING BLOOD GLUCOSE</div>
                      <div className="text-lg font-normal text-[#ffffff] tracking-tight mt-0.5">108 mg/dL</div>
                      <div className="text-[11px] font-light text-[#ffb829] mt-0.5">Slightly Elevated (Ref: 70–99 mg/dL)</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#ffb829]/20 border border-[#ffb829]/40 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-[#ffb829]" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-[#9a9a9a]">LIPID PROFILE (LDL-C)</div>
                      <div className="text-lg font-normal text-[#ffffff] tracking-tight mt-0.5">94 mg/dL</div>
                      <div className="text-[11px] font-light text-[#15846e] mt-0.5">Optimal (Ref: &lt; 100 mg/dL)</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#15846e]/20 border border-[#15846e]/40 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-[#15846e]" />
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8052ff] mb-3">
                Precision Analysis
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffffff] leading-[1.08] tracking-[-0.04em] mb-5">
                Decode lab reports without the confusing jargon.
              </h2>
              <p className="text-base text-[#bdbdbd] font-light leading-relaxed mb-6 max-w-[480px]">
                Stop cross-referencing obscure acronyms. VaidyaVaani contextualizes complete metabolic panels, lipid panels, thyroid markers, and radiology notes into crisp, plain-language summaries with actionable doctor talking points.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-[#8052ff] hover:bg-[#6c3df5] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.025em] transition-all duration-300"
                >
                  Upload Lab Report
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* =========================================================
          SECTION 3: Linguistic & Voice Narration (हिन्दी & Regional)
          ========================================================= */}
      <section id="intelligence" className="relative z-10 py-20 lg:py-24 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb829] mb-3">
                Regional Cognition & Voice Narration
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffffff] leading-[1.08] tracking-[-0.04em] mb-5">
                Native voice intelligence in हिन्दी and regional languages.
              </h2>
              <p className="text-base text-[#bdbdbd] font-light leading-relaxed mb-6 max-w-[480px]">
                Healthcare belongs to everyone. Our natural language pipeline reads complex reports aloud and translates doctor prescriptions into clear audio guidance for elderly and rural caregivers.
              </p>

              {/* Interactive Voice Player Pill */}
              <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-between max-w-md mb-6">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={toggleVoiceDemo}
                    className="w-9 h-9 rounded-full bg-[#8052ff] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(128,82,255,0.4)]"
                  >
                    {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <div className="text-xs font-normal text-[#ffffff]">Hindi Voice Synthesis Demo</div>
                    <div className="text-[10px] font-light text-[#9a9a9a]">
                      {isPlayingAudio ? 'Playing synthetic audio...' : 'Click to hear audio report summary'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[40, 70, 30, 90, 50, 80, 45].map((height, i) => (
                    <div 
                      key={i} 
                      className={`w-1 bg-[#8052ff] rounded-full transition-all duration-300 ${isPlayingAudio ? 'animate-pulse' : 'opacity-40'}`}
                      style={{ height: `${isPlayingAudio ? height * 0.35 : 8}px` }}
                    />
                  ))}
                </div>
              </div>

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]">
                <Globe2 className="w-3.5 h-3.5 text-[#ffb829]" />
                <span className="text-[11px] font-mono text-[#ffffff]">Hindi • Bengali • Tamil • Telugu • Marathi • Gujarati</span>
              </div>
            </motion.div>

            {/* Right Visual: Linguistic Hologram Cluster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative flex items-center justify-center p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08]"
            >
              <div className="text-center z-10 space-y-3">
                <div className="text-5xl sm:text-6xl font-light text-[#ffffff] tracking-[-0.04em]">
                  स्वास्थ्य ज्ञान
                </div>
                <p className="text-xs sm:text-sm font-light text-[#bdbdbd] max-w-xs mx-auto">
                  "आपकी रिपोर्ट के अनुसार रक्त शर्करा 108 mg/dL है। दवा को भोजन के 30 मिनट बाद लेना सर्वोत्तम है।"
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-[#8052ff]/20 text-[#8052ff] font-mono text-[10px] uppercase tracking-wider">
                  Real-Time Hindi Narration Ready
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* =========================================================
          SECTION 4: Pure Typographic Core Values
          ========================================================= */}
      <section className="relative z-10 py-20 lg:py-24 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="mb-14">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8052ff] mb-3">
              Architectural Principles
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffffff] tracking-[-0.04em]">
              Built for absolute privacy, precision & universal access.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Principle 1 */}
            <div>
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <Lock className="w-4 h-4 text-[#8052ff]" />
              </div>
              <h3 className="text-lg font-normal text-[#ffffff] tracking-tight mb-2">Zero-Knowledge Vault</h3>
              <p className="text-xs font-light text-[#9a9a9a] leading-relaxed">
                Medical records are cryptographically sealed in client-side vaults. Your diagnostic data is processed in transient memory and never indexed for advertising.
              </p>
            </div>

            {/* Principle 2 */}
            <div>
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <Cpu className="w-4 h-4 text-[#ffb829]" />
              </div>
              <h3 className="text-lg font-normal text-[#ffffff] tracking-tight mb-2">Pharmacopeia Verification</h3>
              <p className="text-xs font-light text-[#9a9a9a] leading-relaxed">
                Every drug interaction check is cross-referenced with accredited medical monographs, dosage schedules, and international pharmaceutical registries.
              </p>
            </div>

            {/* Principle 3 */}
            <div>
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <HeartPulse className="w-4 h-4 text-[#15846e]" />
              </div>
              <h3 className="text-lg font-normal text-[#ffffff] tracking-tight mb-2">Empowering Caregivers</h3>
              <p className="text-xs font-light text-[#9a9a9a] leading-relaxed">
                Designed to eliminate anxiety for chronic disease patients and family members managing multi-doctor prescriptions simultaneously.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          SECTION 5: Giant Monolithic CTA on Void
          ========================================================= */}
      <section className="relative z-10 py-28 border-t border-white/[0.06] text-center">
        <div className="max-w-[900px] mx-auto px-6">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ffb829] mb-5">
              Empower Your Care
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-[#ffffff] leading-[1.06] tracking-[-0.04em] mb-6">
              Your health has the answer. <br />
              <span className="text-[#8052ff]">Just ask VaidyaVaani.</span>
            </h2>

            <p className="text-base text-[#bdbdbd] font-light leading-relaxed mb-10 max-w-lg mx-auto">
              Join thousands of health-conscious individuals and caregivers who command their diagnostic records with instant neural intelligence.
            </p>

            <button 
              onClick={() => navigate('/login')}
              className="bg-[#8052ff] hover:bg-[#6c3df5] text-white px-9 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.025em] transition-all duration-300 shadow-[0_0_35px_rgba(128,82,255,0.4)] active:scale-[0.98]"
            >
              Request Access Free
            </button>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
