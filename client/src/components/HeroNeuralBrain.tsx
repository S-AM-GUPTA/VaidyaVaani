import React, { useState } from 'react';
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
import ConstellationCanvas from './ConstellationCanvas';

interface HeroNeuralBrainProps {
  className?: string;
}

export const HeroNeuralBrain: React.FC<HeroNeuralBrainProps> = ({ className = '' }) => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div className={`relative w-full max-w-[1360px] mx-auto select-none ${className}`}>
      
      {/* Volumetric Glowing Backlights */}
      <div className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#8052ff]/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-[70%] -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full bg-[#00d2d3]/20 blur-[120px] pointer-events-none"></div>

      {/* Main Glass Showcase Container */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-black/75 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-[0_0_80px_rgba(128,82,255,0.15)]">
        
        {/* Fully Stretched Flex Grid: Left Stream Cards | Center 3D Interactive Sagittal Canvas | Right Features */}
        <div className="relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6">
          
          {/* =========================================================
              LEFT COLUMN: Holographic Ingestion Cards
              ========================================================= */}
          <div className="w-full lg:w-[26%] flex flex-col justify-between gap-4 z-20">
            
            {/* Card 1: ℞ Prescription */}
            <motion.div 
              whileHover={{ scale: 1.025, x: 5 }}
              className="p-4 rounded-2xl bg-white/[0.02] border border-[#8052ff]/40 hover:border-[#8052ff] backdrop-blur-md shadow-[0_0_25px_rgba(128,82,255,0.18)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#8052ff]/20 mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#ffffff]">
                  <span className="text-[#8052ff] font-bold text-sm">℞</span>
                  <span className="font-semibold tracking-wider text-[11px] uppercase">Prescription</span>
                </div>
                <span className="text-[10px] font-mono text-[#8052ff] uppercase">Dr. Sharma</span>
              </div>
              <div className="space-y-1 text-[11px] font-mono text-[#bdbdbd]">
                <div className="text-white font-medium">• Tab. Amoxicillin 500mg</div>
                <div>• Tab. Paracetamol 650mg</div>
                <div>• Cap. Ibuprofen 400mg</div>
              </div>
            </motion.div>

            {/* Card 2: Lab Report */}
            <motion.div 
              whileHover={{ scale: 1.025, x: 5 }}
              className="p-4 rounded-2xl bg-white/[0.02] border border-[#00d2d3]/40 hover:border-[#00d2d3] backdrop-blur-md shadow-[0_0_25px_rgba(0,210,211,0.18)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#00d2d3]/20 mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#ffffff]">
                  <Activity className="w-3.5 h-3.5 text-[#00d2d3]" />
                  <span className="font-semibold tracking-wider text-[11px] uppercase">Lab Report</span>
                </div>
                <span className="text-[10px] font-mono text-[#00d2d3]">CBC Panel</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono text-[#bdbdbd]">
                <div>Hgb: <span className="text-white">13.2 g/dL</span></div>
                <div>WBC: <span className="text-white">7,200 /µL</span></div>
                <div>Platelets: <span className="text-white">2.45L</span></div>
                <div>Glucose: <span className="text-[#00d2d3]">92 mg/dL</span></div>
              </div>
            </motion.div>

            {/* Card 3: Pathology */}
            <motion.div 
              whileHover={{ scale: 1.025, x: 5 }}
              className="p-4 rounded-2xl bg-white/[0.02] border border-[#a855f7]/40 hover:border-[#a855f7] backdrop-blur-md shadow-[0_0_25px_rgba(168,85,247,0.18)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#a855f7]/20 mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#ffffff]">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span className="font-semibold tracking-wider text-[11px] uppercase">Pathology</span>
                </div>
                <span className="text-[10px] font-mono text-[#15846e]">Verified</span>
              </div>
              <div className="text-[11px] font-mono text-[#bdbdbd]">
                <div>Diagnostic Scan: <span className="text-white">Clear</span></div>
                <div className="text-[10px] text-[#a855f7] mt-0.5">Cellular Morphology Normal</div>
              </div>
            </motion.div>

          </div>


          {/* =========================================================
              CENTER: Live 3D Interactive Sagittal Constellation Canvas
              ========================================================= */}
          <div className="w-full lg:w-[48%] h-[380px] sm:h-[460px] lg:h-[540px] relative flex items-center justify-center">
            
            {/* SVG Connecting Bezier Inflow & Outflow Streams */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60">
              <defs>
                <linearGradient id="streamGradL1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8052ff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#8052ff" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="streamGradL2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d2d3" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#00d2d3" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="streamGradR" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#00d2d3" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#00d2d3" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Inflow paths from left */}
              <path d="M 0,120 C 70,120 120,200 190,200" stroke="url(#streamGradL1)" strokeWidth="1.4" fill="none" strokeDasharray="3,3" />
              <path d="M 0,270 C 80,270 120,250 190,240" stroke="url(#streamGradL2)" strokeWidth="1.4" fill="none" strokeDasharray="3,3" />
              <path d="M 0,420 C 70,420 130,320 190,300" stroke="url(#streamGradL1)" strokeWidth="1.4" fill="none" strokeDasharray="3,3" />

              {/* Outflow paths to right */}
              <path d="M 370,170 C 420,170 460,95 530,95" stroke="url(#streamGradR)" strokeWidth="1.4" fill="none" strokeDasharray="3,3" />
              <path d="M 380,220 C 430,220 460,180 530,180" stroke="url(#streamGradR)" strokeWidth="1.4" fill="none" strokeDasharray="3,3" />
              <path d="M 390,270 C 440,270 460,270 530,270" stroke="url(#streamGradR)" strokeWidth="1.4" fill="none" strokeDasharray="3,3" />
              <path d="M 380,320 C 430,320 460,360 530,360" stroke="url(#streamGradR)" strokeWidth="1.4" fill="none" strokeDasharray="3,3" />
              <path d="M 370,360 C 420,360 460,445 530,445" stroke="url(#streamGradR)" strokeWidth="1.4" fill="none" strokeDasharray="3,3" />
            </svg>

            {/* The Live Interactive 3D Sagittal Particle Constellation */}
            <div className="relative w-full h-full z-10">
              <ConstellationCanvas variant="brain" interactive={true} />
            </div>

            {/* Central HUD Pill */}
            <div className="absolute bottom-2 px-3.5 py-1.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-md flex items-center gap-2 pointer-events-none z-20">
              <span className="w-2 h-2 rounded-full bg-[#8052ff] animate-ping"></span>
              <span className="text-[10px] font-mono text-[#bdbdbd] tracking-wider uppercase">
                3D Sagittal Neural Constellation / Active
              </span>
            </div>
          </div>


          {/* =========================================================
              RIGHT COLUMN: Interactive Feature Anchor Nodes
              ========================================================= */}
          <div className="w-full lg:w-[26%] flex flex-col justify-between gap-3 z-20">
            
            {/* Feature 1: Medicine Safety */}
            <motion.div 
              whileHover={{ scale: 1.03, x: -5 }}
              onHoverStart={() => setHoveredFeature('safety')}
              onHoverEnd={() => setHoveredFeature(null)}
              className={`flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] border backdrop-blur-md transition-all cursor-pointer ${
                hoveredFeature === 'safety' ? 'border-[#00d2d3] shadow-[0_0_25px_rgba(0,210,211,0.3)]' : 'border-white/[0.08]'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#00d2d3]/15 border border-[#00d2d3]/40 flex items-center justify-center text-[#00d2d3] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#ffffff]">
                  Medicine Safety
                </div>
                <div className="text-[10px] font-light text-[#9a9a9a]">
                  Checks harmful interactions
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Report Summary */}
            <motion.div 
              whileHover={{ scale: 1.03, x: -5 }}
              onHoverStart={() => setHoveredFeature('summary')}
              onHoverEnd={() => setHoveredFeature(null)}
              className={`flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] border backdrop-blur-md transition-all cursor-pointer ${
                hoveredFeature === 'summary' ? 'border-[#8052ff] shadow-[0_0_25px_rgba(128,82,255,0.3)]' : 'border-white/[0.08]'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#8052ff]/15 border border-[#8052ff]/40 flex items-center justify-center text-[#8052ff] shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#ffffff]">
                  Report Summary
                </div>
                <div className="text-[10px] font-light text-[#9a9a9a]">
                  AI explains reports simply
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Voice Assistant */}
            <motion.div 
              whileHover={{ scale: 1.03, x: -5 }}
              onHoverStart={() => setHoveredFeature('voice')}
              onHoverEnd={() => setHoveredFeature(null)}
              className={`flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] border backdrop-blur-md transition-all cursor-pointer ${
                hoveredFeature === 'voice' ? 'border-[#00d2d3] shadow-[0_0_25px_rgba(0,210,211,0.3)]' : 'border-white/[0.08]'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#00d2d3]/15 border border-[#00d2d3]/40 flex items-center justify-center text-[#00d2d3] shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#ffffff]">
                  Voice Assistant
                </div>
                <div className="text-[10px] font-light text-[#9a9a9a]">
                  Get answers in your dialect
                </div>
              </div>
            </motion.div>

            {/* Feature 4: Smart Alerts */}
            <motion.div 
              whileHover={{ scale: 1.03, x: -5 }}
              onHoverStart={() => setHoveredFeature('alerts')}
              onHoverEnd={() => setHoveredFeature(null)}
              className={`flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] border backdrop-blur-md transition-all cursor-pointer ${
                hoveredFeature === 'alerts' ? 'border-[#a855f7] shadow-[0_0_25px_rgba(168,85,247,0.3)]' : 'border-white/[0.08]'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/40 flex items-center justify-center text-[#a855f7] shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#ffffff]">
                  Smart Alerts
                </div>
                <div className="text-[10px] font-light text-[#9a9a9a]">
                  Timely alerts for critical values
                </div>
              </div>
            </motion.div>

            {/* Feature 5: Better Health */}
            <motion.div 
              whileHover={{ scale: 1.03, x: -5 }}
              onHoverStart={() => setHoveredFeature('health')}
              onHoverEnd={() => setHoveredFeature(null)}
              className={`flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] border backdrop-blur-md transition-all cursor-pointer ${
                hoveredFeature === 'health' ? 'border-[#ff6b81] shadow-[0_0_25px_rgba(255,107,129,0.3)]' : 'border-white/[0.08]'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#ff6b81]/15 border border-[#ff6b81]/40 flex items-center justify-center text-[#ff6b81] shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#ffffff]">
                  Better Health
                </div>
                <div className="text-[10px] font-light text-[#9a9a9a]">
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
