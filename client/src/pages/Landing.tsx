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
  Sparkles,
  Lock,
  Globe2
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ConstellationCanvas } from '../components/ConstellationCanvas';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] font-sans overflow-x-hidden selection:bg-[#8052ff] selection:text-[#ffffff]">
      <Navbar />

      {/* Ambient background particle field */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <ConstellationCanvas variant="ambient" particleCount={90} interactive={false} />
      </div>

      {/* =========================================================
          HERO SECTION: Asymmetric 2-Column with 3D Neural Constellation
          ========================================================= */}
      <section className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pt-16 lg:pt-28 pb-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Column (Sculptural Display Typography & Pill CTA) */}
        <motion.div 
          className="lg:w-1/2 text-left z-10"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Saffron Spark Uppercase Label */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb829] animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb829]">
              Distributed Medical Intelligence
            </span>
          </motion.div>
          
          {/* Monolithic Weight-400 Display Headline with -0.04em Tracking */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-[76px] xl:text-[84px] font-normal text-[#ffffff] leading-[1.02] tracking-[-0.04em] mb-8"
          >
            Understand your health. <br />
            <span className="text-[#8052ff]">Weightless & instant.</span>
          </motion.h1>
          
          {/* Signature Ultra-light (Weight 200/300) 18px Body Copy */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-[#bdbdbd] font-light leading-relaxed mb-10 max-w-[480px]"
          >
            Upload prescriptions and clinical lab reports. Decode complex medical biomarkers, simulate drug-drug interactions, and command your health data on a single unified canvas.
          </motion.p>
          
          {/* Primary Action Button: Electric Iris (#8052ff) Pill */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#8052ff] hover:bg-[#6c3df5] text-white px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-[0.025em] transition-all duration-300 flex items-center group active:scale-[0.98] shadow-[0_0_30px_rgba(128,82,255,0.35)]"
            >
              Start Exploring Now
              <ArrowRight className="w-4 h-4 ml-2.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>

            <a 
              href="#features" 
              className="text-sm font-normal text-[#9a9a9a] hover:text-[#ffffff] tracking-[0.02em] transition-colors flex items-center gap-1.5"
            >
              Explore Capabilities <span className="text-[#8052ff]">↓</span>
            </a>
          </motion.div>

          {/* Micro Stats floating on black */}
          <motion.div 
            variants={itemVariants}
            className="mt-14 pt-8 border-t border-white/[0.08] flex items-center gap-8"
          >
            <div>
              <div className="text-2xl font-normal text-[#ffffff] tracking-[-0.03em]">99.4%</div>
              <div className="text-[11px] font-medium text-[#9a9a9a] uppercase tracking-wider mt-0.5">Extraction Accuracy</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <div className="text-2xl font-normal text-[#ffffff] tracking-[-0.03em]">&lt; 3.2s</div>
              <div className="text-[11px] font-medium text-[#9a9a9a] uppercase tracking-wider mt-0.5">Neural Synthesis</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <div className="text-2xl font-normal text-[#ffffff] tracking-[-0.03em]">100%</div>
              <div className="text-[11px] font-medium text-[#9a9a9a] uppercase tracking-wider mt-0.5">Client Encrypted</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: 3D Animated Brain Constellation Visualization */}
        <motion.div 
          className="lg:w-1/2 w-full h-[450px] sm:h-[550px] lg:h-[620px] relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glow backdrop */}
          <div className="absolute w-[320px] h-[320px] rounded-full bg-[#8052ff]/15 blur-[120px] pointer-events-none"></div>
          <div className="absolute w-[240px] h-[240px] rounded-full bg-[#15846e]/20 blur-[100px] pointer-events-none"></div>

          {/* Live 3D Canvas */}
          <div className="relative w-full h-full">
            <ConstellationCanvas variant="brain" particleCount={680} interactive={true} />
          </div>

          {/* Floating Minimalist Telemetry Pill */}
          <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#8052ff] animate-ping"></span>
            <span className="text-[11px] font-mono text-[#bdbdbd] tracking-wider uppercase">
              Neural Constellation / Active
            </span>
          </div>
        </motion.div>
      </section>


      {/* =========================================================
          SECTION 1: Two-Column Zigzag — Interaction Intelligence
          ========================================================= */}
      <section id="features" className="relative z-10 py-24 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb829] mb-4">
                Safety Intelligence
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-normal text-[#ffffff] leading-[1.06] tracking-[-0.04em] mb-6">
                Cross-reference active prescriptions in milliseconds.
              </h2>
              <p className="text-base sm:text-lg text-[#bdbdbd] font-light leading-relaxed mb-8 max-w-[500px]">
                Eliminate uncertainty when managing multi-drug schedules. Our neural engine cross-checks contraindications, dosage spacing, and food interactions across international pharmacology databases.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#8052ff]/15 border border-[#8052ff]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-[#8052ff]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-[#ffffff] tracking-tight">Contraindication Radar</h3>
                    <p className="text-xs font-light text-[#9a9a9a] leading-relaxed mt-0.5">Instant alerts on antagonistic drug pairings before administration.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#ffb829]/15 border border-[#ffb829]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-[#ffb829]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-normal text-[#ffffff] tracking-tight">Pharmacokinetic Spacing</h3>
                    <p className="text-xs font-light text-[#9a9a9a] leading-relaxed mt-0.5">Automated interval scheduling to prevent absorption degradation.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Simulation (Floating on black void, no heavy containers) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Interaction Matrix Visual Card floating */}
              <div className="relative p-8 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] backdrop-blur-xl">
                
                <div className="flex items-center justify-between pb-6 border-b border-white/[0.06] mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#ffb829] animate-pulse"></div>
                    <span className="text-xs font-mono text-[#ffffff] uppercase tracking-widest">Active Interaction Warning</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#9a9a9a]">Confidence: 99.8%</span>
                </div>

                {/* Drug pairing comparison */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#8052ff]/20 flex items-center justify-center text-[#8052ff] font-mono text-xs font-semibold">
                        A1
                      </div>
                      <div>
                        <div className="text-sm font-normal text-[#ffffff]">Atenolol — 50mg</div>
                        <div className="text-[11px] font-light text-[#9a9a9a]">Beta-blocker (Hypertension)</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#8052ff]">Primary Rx</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#ffb829]/20 flex items-center justify-center text-[#ffb829] font-mono text-xs font-semibold">
                        M2
                      </div>
                      <div>
                        <div className="text-sm font-normal text-[#ffffff]">Magnesium Hydroxide</div>
                        <div className="text-[11px] font-light text-[#9a9a9a]">Antacid Compound</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#ffb829]">Over-the-Counter</span>
                  </div>
                </div>

                {/* Saffron Action Recommendation */}
                <div className="p-4 rounded-2xl bg-[#ffb829]/10 border border-[#ffb829]/20">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#ffb829] uppercase tracking-wider mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Recommended Protocol
                  </div>
                  <div className="text-xs font-light text-[#ffffff]/90 leading-relaxed">
                    Space dosage by at least <span className="font-normal text-[#ffb829]">2 hours</span>. Antacids can reduce oral absorption of Atenolol by up to 35%.
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
      <section id="lab-decoder" className="relative z-10 py-24 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Visual: Floating Lab Biomarkers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="relative p-8 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] backdrop-blur-xl">
                
                <div className="flex items-center justify-between pb-6 border-b border-white/[0.06] mb-6">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-[#15846e]" />
                    <span className="text-xs font-mono text-[#ffffff] uppercase tracking-widest">Biomarker Diagnostic Mesh</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#8052ff]">Verified Reference Ranges</span>
                </div>

                {/* Biomarker Items */}
                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-[#9a9a9a]">HEMOGLOBIN A1C</div>
                      <div className="text-xl font-normal text-[#ffffff] tracking-tight mt-0.5">5.4%</div>
                      <div className="text-[11px] font-light text-[#15846e] mt-1">Normal (Reference: &lt; 5.7%)</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#15846e]/20 border border-[#15846e]/40 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-[#15846e]" />
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-[#9a9a9a]">FASTING BLOOD GLUCOSE</div>
                      <div className="text-xl font-normal text-[#ffffff] tracking-tight mt-0.5">108 mg/dL</div>
                      <div className="text-[11px] font-light text-[#ffb829] mt-1">Slightly Elevated (Ref: 70–99 mg/dL)</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#ffb829]/20 border border-[#ffb829]/40 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-[#ffb829]" />
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-[#9a9a9a]">LIPID PROFILE (LDL-C)</div>
                      <div className="text-xl font-normal text-[#ffffff] tracking-tight mt-0.5">94 mg/dL</div>
                      <div className="text-[11px] font-light text-[#15846e] mt-1">Optimal (Ref: &lt; 100 mg/dL)</div>
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
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8052ff] mb-4">
                Precision Analysis
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-normal text-[#ffffff] leading-[1.06] tracking-[-0.04em] mb-6">
                Decode lab reports without the confusing jargon.
              </h2>
              <p className="text-base sm:text-lg text-[#bdbdbd] font-light leading-relaxed mb-8 max-w-[500px]">
                Stop cross-referencing obscure acronyms. VaidyaVaani contextualizes complete metabolic panels, lipid panels, and hormonal assays into crisp, plain-language summaries with actionable doctor talking points.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-[#8052ff] hover:bg-[#6c3df5] text-white px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.025em] transition-all duration-300"
                >
                  Upload Lab Report
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* =========================================================
          SECTION 3: Linguistic & Neural Dialects (हिन्दी & Regional)
          ========================================================= */}
      <section id="intelligence" className="relative z-10 py-24 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb829] mb-4">
                Multi-Lingual Cognition
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-normal text-[#ffffff] leading-[1.06] tracking-[-0.04em] mb-6">
                Native intelligence in हिन्दी and regional languages.
              </h2>
              <p className="text-base sm:text-lg text-[#bdbdbd] font-light leading-relaxed mb-8 max-w-[500px]">
                Healthcare belongs to everyone. Our natural language pipeline translates and synthesizes doctor prescriptions into clear audio and visual summaries in regional Indian dialects.
              </p>

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]">
                <Globe2 className="w-4 h-4 text-[#ffb829]" />
                <span className="text-xs font-mono text-[#ffffff]">Hindi • Bengali • Tamil • Telugu • Marathi</span>
              </div>
            </motion.div>

            {/* Right Visual: Linguistic Hologram Cluster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative flex items-center justify-center p-12 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08]"
            >
              <div className="text-center z-10 space-y-4">
                <div className="text-6xl sm:text-7xl font-light text-[#ffffff] tracking-[-0.04em]">
                  स्वास्थ्य ज्ञान
                </div>
                <p className="text-sm font-light text-[#bdbdbd] max-w-xs mx-auto">
                  "आपकी रिपोर्ट के अनुसार दवा को भोजन के 30 मिनट बाद लेना सर्वोत्तम है।"
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-[#8052ff]/20 text-[#8052ff] font-mono text-[11px] uppercase tracking-wider">
                  Neural Dialect Pipeline Active
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* =========================================================
          SECTION 4: Pure Typographic Core Values (No Heavy Cards)
          ========================================================= */}
      <section className="relative z-10 py-24 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          
          <div className="mb-16">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8052ff] mb-4">
              Architectural Principles
            </div>
            <h2 className="text-4xl sm:text-5xl font-normal text-[#ffffff] tracking-[-0.04em]">
              Designed for absolute privacy & rigor.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Principle 1 */}
            <div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Lock className="w-4 h-4 text-[#8052ff]" />
              </div>
              <h3 className="text-xl font-normal text-[#ffffff] tracking-tight mb-3">Zero Knowledge Encryption</h3>
              <p className="text-sm font-light text-[#9a9a9a] leading-relaxed">
                Medical records are cryptographically sealed in client-side vaults. Your private diagnostic data is never indexed or used for third-party training.
              </p>
            </div>

            {/* Principle 2 */}
            <div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Cpu className="w-4 h-4 text-[#ffb829]" />
              </div>
              <h3 className="text-xl font-normal text-[#ffffff] tracking-tight mb-3">Pharmacopeia Verification</h3>
              <p className="text-sm font-light text-[#9a9a9a] leading-relaxed">
                Every medication interaction check is cross-referenced with accredited medical monographs, dosage guidelines, and international registries.
              </p>
            </div>

            {/* Principle 3 */}
            <div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Sparkles className="w-4 h-4 text-[#15846e]" />
              </div>
              <h3 className="text-xl font-normal text-[#ffffff] tracking-tight mb-3">Weightless Clarity</h3>
              <p className="text-sm font-light text-[#9a9a9a] leading-relaxed">
                Stripped of extraneous visual noise. We believe cognitive clarity in personal health is achieved through minimal, focused typographic hierarchy.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================
          SECTION 5: Giant Monolithic CTA on Void
          ========================================================= */}
      <section className="relative z-10 py-32 border-t border-white/[0.06] text-center">
        <div className="max-w-[1000px] mx-auto px-6">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ffb829] mb-6">
              Empower Your Care
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-[76px] font-normal text-[#ffffff] leading-[1.04] tracking-[-0.04em] mb-8">
              Your health has the answer. <br />
              <span className="text-[#8052ff]">Just ask VaidyaVaani.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#bdbdbd] font-light leading-relaxed mb-12 max-w-xl mx-auto">
              Join thousands of health-conscious individuals and caregivers who command their diagnostic records with instant neural intelligence.
            </p>

            <button 
              onClick={() => navigate('/login')}
              className="bg-[#8052ff] hover:bg-[#6c3df5] text-white px-10 py-5 rounded-full text-sm font-semibold uppercase tracking-[0.025em] transition-all duration-300 shadow-[0_0_40px_rgba(128,82,255,0.4)] active:scale-[0.98]"
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
