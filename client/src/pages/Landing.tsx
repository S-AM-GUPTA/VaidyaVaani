import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  CloudUpload, 
  Activity, 
  MessageSquare,
  ArrowRight,
  Clock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans text-[#1C2A24] overflow-x-hidden flex flex-col selection:bg-[#133E2B] selection:text-[#F8F7F4]">
      <Navbar />

      {/* Hero Section */}
      <main className="relative max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-12 pt-16 lg:pt-24 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Column (Content) */}
        <motion.div 
          className="lg:w-1/2 z-10 text-left"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="inline-block mb-6">
            <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#133E2B] border border-[#133E2B]/20 rounded-full">
              Medical Intelligence
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-[72px] font-extrabold text-[#133E2B] leading-[1.05] tracking-tighter mb-6"
          >
            Understand your health. <br className="hidden md:block" />
            <span className="opacity-80">Instantly.</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-[#2D4238]/80 mb-10 max-w-[50ch] font-medium leading-relaxed"
          >
            Upload prescriptions & medical reports. Get clear explanations, check for medicine interactions, and take control of your health data in seconds.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#133E2B] text-[#F8F7F4] px-8 py-4 rounded-full font-bold hover:bg-[#0f3223] transition-colors text-base flex items-center group active:scale-[0.98]"
            >
              Start Understanding Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        {/* Right Column (Abstract Visual) */}
        <motion.div 
          className="lg:w-1/2 w-full relative flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
           <div className="relative w-full max-w-lg aspect-square bg-[#F1F0EC] rounded-[40px] p-8 border border-[#1C2A24]/5 overflow-hidden">
              <div className="absolute top-12 left-12 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 w-full h-full flex flex-col justify-center gap-6">
                 
                 <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 transform -rotate-2 ml-4">
                   <div className="flex items-center gap-4 mb-3">
                     <div className="w-10 h-10 bg-[#F8F7F4] rounded-full flex items-center justify-center">
                       <ShieldCheck className="w-5 h-5 text-[#133E2B]" />
                     </div>
                     <div>
                       <div className="h-3 w-24 bg-[#1C2A24]/10 rounded-full mb-2"></div>
                       <div className="h-2 w-16 bg-[#1C2A24]/5 rounded-full"></div>
                     </div>
                   </div>
                   <div className="text-sm font-bold text-[#1C2A24] tracking-tight">All Safe: No Interactions Found</div>
                 </div>

                 <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 transform translate-x-8 rotate-1">
                   <div className="flex justify-between items-end">
                     <div>
                       <div className="text-xs font-bold text-[#1C2A24]/50 mb-1 uppercase tracking-wider">CBC Report</div>
                       <div className="text-lg font-bold text-[#1C2A24]">Normal Ranges</div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                       <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                     </div>
                   </div>
                 </div>

              </div>
           </div>
        </motion.div>
      </main>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#133E2B] tracking-tighter mb-6">
              Complete Clarity.
            </h2>
            <p className="text-lg text-[#2D4238]/70 font-medium">
              We translate complex medical jargon into actionable, easy-to-understand insights.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Cell 1: Interaction Checker (Large) */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 bg-[#F8F7F4] rounded-3xl p-8 lg:p-12 border border-[#1C2A24]/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#e8e6df] rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="mb-12">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <AlertTriangle className="w-6 h-6 text-[#133E2B]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#133E2B] tracking-tight mb-2">Medicine Interaction Checker</h3>
                  <p className="text-[#2D4238]/70 font-medium max-w-sm">Never guess if two medicines are safe together. We cross-reference your active prescriptions instantly.</p>
                </div>
                
                <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm max-w-md w-full">
                  <div className="flex items-center gap-3">
                     <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center">
                       <AlertTriangle className="w-3 h-3 mr-1.5" /> Timing Adjustment Required
                     </div>
                  </div>
                  <div className="mt-3 text-sm font-medium text-[#1C2A24]">
                    Space out <span className="font-bold">Atenolol</span> and <span className="font-bold">Antacid</span> by 2 hours.
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Cell 2: Lab Reports (Tall) */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#133E2B] rounded-3xl p-8 lg:p-12 text-[#F8F7F4] flex flex-col"
            >
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-3">Decode Lab Reports</h3>
              <p className="text-emerald-100/70 font-medium text-sm leading-relaxed mb-8 flex-1">
                Stop googling test names. We highlight what's normal, what's high, and what to ask your doctor.
              </p>
              
              <div className="space-y-3">
                <div className="bg-white/10 p-3 rounded-xl flex items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mr-3"></div>
                  <span className="text-sm font-bold">Lipid Profile: Normal</span>
                </div>
                <div className="bg-white/10 p-3 rounded-xl flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-400 mr-3"></div>
                  <span className="text-sm font-bold">Sugar: Slightly Elevated</span>
                </div>
              </div>
            </motion.div>

            {/* Cell 3: Simplify */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-[#F8F7F4] rounded-3xl p-8 border border-[#1C2A24]/5 flex flex-col"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <Clock className="w-5 h-5 text-[#133E2B]" />
              </div>
              <h3 className="text-xl font-bold text-[#133E2B] tracking-tight mb-2">Simplify Dosages</h3>
              <p className="text-[#2D4238]/70 font-medium text-sm">Clear instructions on when and how to take your medication.</p>
            </motion.div>

            {/* Cell 4: AI Chat */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-[#F8F7F4] rounded-3xl p-8 border border-[#1C2A24]/5 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                  <MessageSquare className="w-5 h-5 text-[#133E2B]" />
                </div>
                <h3 className="text-xl font-bold text-[#133E2B] tracking-tight mb-2">AI Chat Assistant</h3>
                <p className="text-[#2D4238]/70 font-medium text-sm mb-6">Ask direct questions about your uploaded reports.</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-black/5 text-xs font-medium text-[#1C2A24] self-end rounded-br-none shadow-sm">
                "What is HbA1c?"
              </div>
            </motion.div>

            {/* Cell 5: Regional */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-[#F8F7F4] rounded-3xl p-8 border border-[#1C2A24]/5 flex items-center justify-center relative overflow-hidden"
            >
               <div className="text-center z-10">
                 <div className="text-4xl font-extrabold text-[#133E2B] mb-2 tracking-tighter">हिन्दी</div>
                 <div className="text-sm font-bold text-[#2D4238]/60 uppercase tracking-widest">Available Now</div>
               </div>
               <div className="absolute -bottom-6 -right-6 text-[120px] font-bold text-[#133E2B]/5 select-none pointer-events-none">A</div>
            </motion.div>

          </div>
        </div>
      </section>
      
      {/* Quick Action Footer / CTA */}
      <section className="py-24 bg-[#F8F7F4] text-center border-t border-[#1C2A24]/5">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-4 flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-[#133E2B] rounded-2xl flex items-center justify-center mb-8 shadow-lg">
            <CloudUpload className="w-8 h-8 text-[#F8F7F4]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#133E2B] tracking-tighter mb-6">Ready to upload?</h2>
          <button 
            onClick={() => navigate('/login')}
            className="bg-[#133E2B] text-[#F8F7F4] px-8 py-4 rounded-full font-bold hover:bg-[#0f3223] transition-colors text-base active:scale-[0.98]"
          >
            Create Free Account
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
