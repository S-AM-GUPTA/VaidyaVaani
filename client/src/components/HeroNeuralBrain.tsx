import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  Bell, 
  Heart, 
  Activity, 
  FileSpreadsheet
} from 'lucide-react';

interface HeroNeuralBrainProps {
  className?: string;
}

export const HeroNeuralBrain: React.FC<HeroNeuralBrainProps> = ({ className = '' }) => {

  return (
    <div className={`relative w-full max-w-[1240px] mx-auto select-none ${className}`}>
      
      {/* Background Neural Glow Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#8052ff]/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-[#00d2d3]/20 blur-[120px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-black/60 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
        
        {/* Main Graphic Rendering Layer */}
        <div className="relative w-full aspect-[16/9] min-h-[380px] sm:min-h-[480px] lg:min-h-[580px] flex items-center justify-center">
          
          {/* Base High-Resolution 3D Neural Brain Graphic */}
          <img 
            src="/images/brain-neural-model.png" 
            alt="VaidyaVaani 3D Neural Medical Intelligence" 
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
          />

          {/* Interactive Layer — Left Holographic Floating Cards Overlay */}
          <div className="absolute inset-y-0 left-0 w-[34%] flex flex-col justify-between py-4 sm:py-6 pl-2 sm:pl-4 z-10">
            
            {/* 1. Rx PRESCRIPTION CARD */}
            <motion.div 
              whileHover={{ scale: 1.03, x: 4 }}
              className="p-3 sm:p-4 rounded-2xl bg-black/60 border border-[#8052ff]/40 hover:border-[#8052ff] backdrop-blur-md shadow-[0_0_25px_rgba(128,82,255,0.25)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#8052ff]/20 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#ffffff]">
                  <span className="text-[#8052ff] font-bold text-sm">℞</span>
                  <span className="font-semibold tracking-wider text-[10px] sm:text-xs">PRESCRIPTION</span>
                </div>
                <span className="text-[9px] font-mono text-[#8052ff] uppercase">Dr. Sharma</span>
              </div>
              <div className="space-y-1 text-[9px] sm:text-[11px] font-mono text-[#bdbdbd]">
                <div className="text-white font-medium">• Tab. Amoxicillin 500mg</div>
                <div>• Tab. Paracetamol 650mg</div>
                <div>• Cap. Ibuprofen 400mg</div>
              </div>
            </motion.div>

            {/* 2. LAB REPORT CARD */}
            <motion.div 
              whileHover={{ scale: 1.03, x: 4 }}
              className="p-3 sm:p-4 rounded-2xl bg-black/60 border border-[#00d2d3]/40 hover:border-[#00d2d3] backdrop-blur-md shadow-[0_0_25px_rgba(0,210,211,0.25)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#00d2d3]/20 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#ffffff]">
                  <Activity className="w-3.5 h-3.5 text-[#00d2d3]" />
                  <span className="font-semibold tracking-wider text-[10px] sm:text-xs">LAB REPORT</span>
                </div>
                <span className="text-[9px] font-mono text-[#00d2d3]">CBC Panel</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] sm:text-[11px] font-mono text-[#bdbdbd]">
                <div>Hgb: <span className="text-white">13.2 g/dL</span></div>
                <div>WBC: <span className="text-white">7,200 /µL</span></div>
                <div>Platelets: <span className="text-white">2.45L</span></div>
                <div>Glucose: <span className="text-[#00d2d3]">92 mg/dL</span></div>
              </div>
            </motion.div>

            {/* 3. PATHOLOGY REPORT CARD */}
            <motion.div 
              whileHover={{ scale: 1.03, x: 4 }}
              className="p-3 sm:p-4 rounded-2xl bg-black/60 border border-[#8052ff]/40 hover:border-[#8052ff] backdrop-blur-md shadow-[0_0_25px_rgba(128,82,255,0.25)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#8052ff]/20 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#ffffff]">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#8052ff]" />
                  <span className="font-semibold tracking-wider text-[10px] sm:text-xs">PATHOLOGY</span>
                </div>
                <span className="text-[9px] font-mono text-[#15846e]">Verified</span>
              </div>
              <div className="text-[9px] sm:text-[11px] font-mono text-[#bdbdbd]">
                <div>Diagnostic Scan: <span className="text-white">Clear</span></div>
                <div className="text-[10px] text-[#8052ff] mt-0.5">Cellular Morphology Normal</div>
              </div>
            </motion.div>

          </div>


          {/* Interactive Layer — Right Feature Nodes Overlay */}
          <div className="absolute inset-y-0 right-0 w-[30%] flex flex-col justify-between py-4 sm:py-6 pr-2 sm:pl-2 z-10">
            
            {/* 1. MEDICINE SAFETY */}
            <motion.div 
              whileHover={{ scale: 1.04, x: -4 }}
              className="flex items-center gap-3 p-2 rounded-2xl bg-black/50 hover:bg-black/80 border border-white/5 hover:border-[#00d2d3]/50 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00d2d3]/15 border border-[#00d2d3]/40 flex items-center justify-center text-[#00d2d3] shadow-[0_0_15px_rgba(0,210,211,0.3)] shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#ffffff] group-hover:text-[#00d2d3] transition-colors">
                  Medicine Safety
                </div>
                <div className="text-[9px] sm:text-[10px] font-light text-[#9a9a9a]">
                  Checks harmful interactions
                </div>
              </div>
            </motion.div>

            {/* 2. REPORT SUMMARY */}
            <motion.div 
              whileHover={{ scale: 1.04, x: -4 }}
              className="flex items-center gap-3 p-2 rounded-2xl bg-black/50 hover:bg-black/80 border border-white/5 hover:border-[#8052ff]/50 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#8052ff]/15 border border-[#8052ff]/40 flex items-center justify-center text-[#8052ff] shadow-[0_0_15px_rgba(128,82,255,0.3)] shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#ffffff] group-hover:text-[#8052ff] transition-colors">
                  Report Summary
                </div>
                <div className="text-[9px] sm:text-[10px] font-light text-[#9a9a9a]">
                  AI explains reports simply
                </div>
              </div>
            </motion.div>

            {/* 3. VOICE ASSISTANT */}
            <motion.div 
              whileHover={{ scale: 1.04, x: -4 }}
              className="flex items-center gap-3 p-2 rounded-2xl bg-black/50 hover:bg-black/80 border border-white/5 hover:border-[#00d2d3]/50 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00d2d3]/15 border border-[#00d2d3]/40 flex items-center justify-center text-[#00d2d3] shadow-[0_0_15px_rgba(0,210,211,0.3)] shrink-0">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#ffffff] group-hover:text-[#00d2d3] transition-colors">
                  Voice Assistant
                </div>
                <div className="text-[9px] sm:text-[10px] font-light text-[#9a9a9a]">
                  Get answers in your dialect
                </div>
              </div>
            </motion.div>

            {/* 4. SMART ALERTS */}
            <motion.div 
              whileHover={{ scale: 1.04, x: -4 }}
              className="flex items-center gap-3 p-2 rounded-2xl bg-black/50 hover:bg-black/80 border border-white/5 hover:border-[#a855f7]/50 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/40 flex items-center justify-center text-[#a855f7] shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#ffffff] group-hover:text-[#a855f7] transition-colors">
                  Smart Alerts
                </div>
                <div className="text-[9px] sm:text-[10px] font-light text-[#9a9a9a]">
                  Timely alerts for critical values
                </div>
              </div>
            </motion.div>

            {/* 5. BETTER HEALTH */}
            <motion.div 
              whileHover={{ scale: 1.04, x: -4 }}
              className="flex items-center gap-3 p-2 rounded-2xl bg-black/50 hover:bg-black/80 border border-white/5 hover:border-[#ff6b81]/50 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#ff6b81]/15 border border-[#ff6b81]/40 flex items-center justify-center text-[#ff6b81] shadow-[0_0_15px_rgba(255,107,129,0.3)] shrink-0">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#ffffff] group-hover:text-[#ff6b81] transition-colors">
                  Better Health
                </div>
                <div className="text-[9px] sm:text-[10px] font-light text-[#9a9a9a]">
                  Empowered medical choices
                </div>
              </div>
            </motion.div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default HeroNeuralBrain;
