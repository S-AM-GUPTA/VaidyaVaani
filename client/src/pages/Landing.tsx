import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  HeartPulse,
  X,
  UploadCloud
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ConstellationCanvas } from '../components/ConstellationCanvas';
import HeroNeuralBrain from '../components/HeroNeuralBrain';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

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
    <div className="min-h-screen bg-[#000000] text-[#ffffff] font-sans overflow-x-hidden selection:bg-[#004fdc] selection:text-[#ffffff]">
      <Navbar />

      {/* Ambient background particle field */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <ConstellationCanvas variant="ambient" particleCount={60} interactive={false} />
      </div>

      {/* =========================================================
          HERO SECTION: Asymmetric 2-Column with 3D Neural Brain Visual
          ========================================================= */}
      <section className="relative z-10 min-h-[calc(100vh-80px)] max-w-[1280px] mx-auto px-6 lg:px-12 pt-8 lg:pt-12 pb-16 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
        
        {/* Left Column (Display Typography, Pill CTA & Micro Stats) */}
        <motion.div 
          className="lg:w-1/2 text-left z-10 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Saffron Spark Uppercase Label */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb829] animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb829]">
              {t('distributedIntel')}
            </span>
          </motion.div>
          
          {/* Monolithic Weight-400 Display Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-[58px] xl:text-[66px] font-normal text-[#ffffff] leading-[1.06] tracking-[-0.04em] mb-6"
          >
            {t('heroHeadline')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004fdc] via-[#2563eb] to-[#00d2d3]">
              {t('heroSubHeadline')}
            </span>
          </motion.h1>
          
          {/* Ultra-light Body Copy */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-[#bdbdbd] font-light leading-relaxed mb-8 max-w-[480px]"
          >
            {t('heroDesc')}
          </motion.p>
          
          {/* Primary Action Button: Electric Blue (#004fdc) Pill */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5">
            <button 
              onClick={handleCtaClick}
              className="bg-[#004fdc] hover:bg-[#003eb0] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.025em] transition-all duration-300 flex items-center group active:scale-[0.98] shadow-[0_0_30px_rgba(0,79,220,0.35)]"
            >
              {isAuthenticated ? t('openDashboard') : t('startExploring')}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>

            <a 
              href="#pipeline" 
              className="text-xs font-normal text-[#9a9a9a] hover:text-[#ffffff] tracking-[0.02em] transition-colors flex items-center gap-1.5"
            >
              {t('howItWorks')} <span className="text-[#004fdc]">↓</span>
            </a>
          </motion.div>

          {/* Micro Stats floating on black */}
          <motion.div 
            variants={itemVariants}
            className="mt-10 pt-6 border-t border-white/[0.08] flex items-center gap-6 sm:gap-8"
          >
            <div>
              <div className="text-xl sm:text-2xl font-normal text-[#ffffff] tracking-[-0.03em]">95.4%</div>
              <div className="text-[10px] font-mono text-[#9a9a9a] uppercase tracking-wider mt-0.5">{t('ocrExtraction')}</div>
            </div>
            <div className="w-px h-7 bg-white/10"></div>
            <div>
              <div className="text-xl sm:text-2xl font-normal text-[#004fdc] tracking-[-0.03em]">&lt; 4.8s</div>
              <div className="text-[10px] font-mono text-[#9a9a9a] uppercase tracking-wider mt-0.5">{t('neuralSynthesis')}</div>
            </div>
            <div className="w-px h-7 bg-white/10"></div>
            <div>
              <div className="text-xl sm:text-2xl font-normal text-[#00d2d3] tracking-[-0.03em]">100%</div>
              <div className="text-[10px] font-mono text-[#9a9a9a] uppercase tracking-wider mt-0.5">{t('clientEncrypted')}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: 3D Neural Brain Visual Model */}
        <motion.div 
          className="lg:w-1/2 w-full z-10"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroNeuralBrain />
        </motion.div>
      </section>


      {/* =========================================================
          PIPELINE SECTION: 4-Stage Connected Workflow
          ========================================================= */}
      <section id="pipeline" className="relative z-10 py-20 lg:py-24 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="mb-14">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb829] mb-3">
              {t('pipeline')}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffffff] tracking-[-0.04em]">
              {t('pipelineTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div 
              onClick={() => setIsDemoUploadOpen(true)}
              className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-[#004fdc]/60 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-[#004fdc]/20 border border-[#004fdc]/40 flex items-center justify-center text-xs font-mono text-[#004fdc] mb-5 group-hover:scale-110 transition-transform">
                01
              </div>
              <ScanLine className="w-5 h-5 text-[#ffffff] mb-3" />
              <h3 className="text-base font-normal text-[#ffffff] mb-2 group-hover:text-[#004fdc] transition-colors">{t('step1Title')}</h3>
              <p className="text-xs font-light text-[#9a9a9a] leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-[#ffb829]/60 transition-all">
              <div className="w-9 h-9 rounded-full bg-[#ffb829]/20 border border-[#ffb829]/40 flex items-center justify-center text-xs font-mono text-[#ffb829] mb-5">
                02
              </div>
              <FileSpreadsheet className="w-5 h-5 text-[#ffffff] mb-3" />
              <h3 className="text-base font-normal text-[#ffffff] mb-2">{t('step2Title')}</h3>
              <p className="text-xs font-light text-[#9a9a9a] leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-[#00d2d3]/60 transition-all">
              <div className="w-9 h-9 rounded-full bg-[#00d2d3]/20 border border-[#00d2d3]/40 flex items-center justify-center text-xs font-mono text-[#00d2d3] mb-5">
                03
              </div>
              <Layers className="w-5 h-5 text-[#ffffff] mb-3" />
              <h3 className="text-base font-normal text-[#ffffff] mb-2">{t('step3Title')}</h3>
              <p className="text-xs font-light text-[#9a9a9a] leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>

            {/* Step 4 */}
            <div 
              onClick={toggleVoiceDemo}
              className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-[#004fdc]/60 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-[#004fdc]/20 border border-[#004fdc]/40 flex items-center justify-center text-xs font-mono text-[#004fdc] mb-5 group-hover:scale-110 transition-transform">
                04
              </div>
              <Volume2 className="w-5 h-5 text-[#ffffff] mb-3" />
              <h3 className="text-base font-normal text-[#ffffff] mb-2 group-hover:text-[#004fdc] transition-colors">{t('step4Title')}</h3>
              <p className="text-xs font-light text-[#9a9a9a] leading-relaxed">
                {t('step4Desc')}
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
                {t('safetyMatrix')}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffffff] leading-[1.08] tracking-[-0.04em] mb-5">
                {t('interactionTitle')}
              </h2>
              <p className="text-base text-[#bdbdbd] font-light leading-relaxed mb-6 max-w-[480px]">
                {t('interactionDesc')}
              </p>

              {/* Functional Severity Tab Selector */}
              <div className="flex gap-2 p-1 bg-white/[0.04] rounded-full border border-white/10 w-fit mb-6">
                <button 
                  onClick={() => setActiveSeverityTab('low')}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeSeverityTab === 'low' ? 'bg-[#15846e] text-white shadow-[0_0_15px_rgba(21,132,110,0.4)]' : 'text-[#9a9a9a] hover:text-white'
                  }`}
                >
                  {t('lowRisk')}
                </button>
                <button 
                  onClick={() => setActiveSeverityTab('mod')}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeSeverityTab === 'mod' ? 'bg-[#ffb829] text-black font-bold shadow-[0_0_15px_rgba(255,184,41,0.4)]' : 'text-[#9a9a9a] hover:text-white'
                  }`}
                >
                  {t('moderateRisk')}
                </button>
                <button 
                  onClick={() => setActiveSeverityTab('crit')}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeSeverityTab === 'crit' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'text-[#9a9a9a] hover:text-white'
                  }`}
                >
                  {t('criticalRisk')}
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#004fdc]/15 border border-[#004fdc]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#004fdc]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-[#ffffff] tracking-tight">{t('contraindicationRadar')}</h3>
                    <p className="text-xs font-light text-[#9a9a9a] leading-relaxed mt-0.5">Instant alerts on antagonistic drug pairings before administration.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-[#ffb829]/15 border border-[#ffb829]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#ffb829]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-[#ffffff] tracking-tight">{t('pharmacokineticSpacing')}</h3>
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
                      <div className="w-8 h-8 rounded-xl bg-[#004fdc]/20 flex items-center justify-center text-[#004fdc] font-mono text-xs font-semibold">
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
                    <span className="text-xs font-mono text-[#004fdc]">Doctor A</span>
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
                  <span className="text-[11px] font-mono text-[#004fdc]">Verified Reference Ranges</span>
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
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#004fdc] mb-3">
                {t('labDecoding')}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffffff] leading-[1.08] tracking-[-0.04em] mb-5">
                {t('labDecoderTitle')}
              </h2>
              <p className="text-base text-[#bdbdbd] font-light leading-relaxed mb-6 max-w-[480px]">
                {t('labDecoderDesc')}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => setIsDemoUploadOpen(true)}
                  className="bg-[#004fdc] hover:bg-[#003eb0] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.025em] transition-all duration-300 shadow-[0_0_20px_rgba(0,79,220,0.3)] active:scale-95"
                >
                  {t('uploadLabReport')}
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* =========================================================
          SECTION 3: Linguistic & Live Multi-Language Voice Narration
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
                {currentLanguage.native} • {t('intelligence')}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffffff] leading-[1.08] tracking-[-0.04em] mb-5">
                {t('voiceTitle')}
              </h2>
              <p className="text-base text-[#bdbdbd] font-light leading-relaxed mb-6 max-w-[480px]">
                {t('voiceDesc')}
              </p>

              {/* Functional Voice Player Pill with Live Multilingual SpeechSynthesis */}
              <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-between max-w-md mb-6 hover:border-[#004fdc]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={toggleVoiceDemo}
                    className="w-10 h-10 rounded-full bg-[#004fdc] hover:bg-[#003eb0] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,79,220,0.4)]"
                  >
                    {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div>
                    <div className="text-xs font-normal text-[#ffffff] flex items-center gap-2">
                      <span>{currentLanguage.native} {t('voiceDemoTitle')}</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#004fdc]/20 text-[#004fdc] border border-[#004fdc]/30">LIVE</span>
                    </div>
                    <div className="text-[10px] font-light text-[#9a9a9a]">
                      {isSpeaking ? t('speakingNow') : t('clickToHear')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 cursor-pointer" onClick={toggleVoiceDemo}>
                  {[40, 70, 30, 90, 50, 80, 45].map((height, i) => (
                    <div 
                      key={i} 
                      className={`w-1 bg-[#004fdc] rounded-full transition-all duration-300 ${isSpeaking ? 'animate-pulse' : 'opacity-40'}`}
                      style={{ height: `${isSpeaking ? height * 0.35 : 8}px` }}
                    />
                  ))}
                </div>
              </div>

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]">
                <Globe2 className="w-3.5 h-3.5 text-[#ffb829]" />
                <span className="text-[11px] font-mono text-[#ffffff]">English • हिन्दी • বাংলা • தமிழ் • తెలుగు • मराठी • ગુજરાતી</span>
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
                <div className="text-4xl sm:text-5xl font-light text-[#ffffff] tracking-[-0.03em]">
                  {currentLanguage.code === 'hi' ? 'स्वास्थ्य ज्ञान' :
                   currentLanguage.code === 'bn' ? 'স্বাস্থ্য সচেতনতা' :
                   currentLanguage.code === 'ta' ? 'ஆரோக்கிய அறிவு' :
                   currentLanguage.code === 'te' ? 'ఆరోగ్య స్పష్టత' :
                   currentLanguage.code === 'mr' ? 'आरोग्य मार्गदर्शन' :
                   currentLanguage.code === 'gu' ? 'સ્વાસ્થ્ય જ્ઞાન' :
                   'Clinical Clarity'}
                </div>
                <p className="text-xs sm:text-sm font-light text-[#bdbdbd] max-w-xs mx-auto italic leading-relaxed">
                  "{currentLanguage.demoSpeechText}"
                </p>
                <button 
                  onClick={toggleVoiceDemo}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#004fdc]/20 hover:bg-[#004fdc]/30 text-[#004fdc] font-mono text-xs uppercase tracking-wider border border-[#004fdc]/30 transition-colors shadow-[0_0_15px_rgba(0,79,220,0.2)]"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {isSpeaking ? t('speakingNow') : `${t('playVoice')} (${currentLanguage.native})`}
                </button>
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
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#004fdc] mb-3">
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
                <Lock className="w-4 h-4 text-[#004fdc]" />
              </div>
              <h3 className="text-lg font-normal text-[#ffffff] tracking-tight mb-2">{t('zeroKnowledgeVault')}</h3>
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
              <span className="text-[#004fdc]">Just ask VaidyaVaani.</span>
            </h2>

            <p className="text-base text-[#bdbdbd] font-light leading-relaxed mb-10 max-w-lg mx-auto">
              Join thousands of health-conscious individuals and caregivers who command their diagnostic records with instant neural intelligence.
            </p>

            <button 
              onClick={handleCtaClick}
              className="bg-[#004fdc] hover:bg-[#003eb0] text-white px-9 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.025em] transition-all duration-300 shadow-[0_0_35px_rgba(0,79,220,0.4)] active:scale-[0.98]"
            >
              {isAuthenticated ? t('openDashboard') : t('requestAccess')}
            </button>
          </motion.div>

        </div>
      </section>

      {/* Demo Modal for Lab Report / Upload */}
      <AnimatePresence>
        {isDemoUploadOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsDemoUploadOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0c0c0c] rounded-[32px] w-full max-w-lg overflow-hidden shadow-[0_0_80px_rgba(0,79,220,0.3)] relative z-10 border border-white/10 p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-6">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#004fdc]">
                    Quick Document Ingestion
                  </div>
                  <h3 className="text-xl font-normal text-white">{t('uploadLabReport')}</h3>
                </div>
                <button 
                  onClick={() => setIsDemoUploadOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"
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
                className="border border-dashed border-white/20 hover:border-[#004fdc] rounded-2xl p-8 text-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] transition-all"
              >
                <UploadCloud className="w-10 h-10 text-[#004fdc] mx-auto mb-3" />
                <div className="text-sm font-normal text-white">Select PDF or Image</div>
                <p className="text-xs text-[#9a9a9a] mt-1">Click to sign in and process through the Neural Engine</p>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => {
                    setIsDemoUploadOpen(false);
                    navigate('/login');
                  }}
                  className="bg-[#004fdc] hover:bg-[#003eb0] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
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
