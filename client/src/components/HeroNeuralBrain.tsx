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
    <div className={`relative w-full max-w-[1240px] mx-auto select-none ${className}`}>
      
      {/* Background Volumetric Glows */}
      <div className="absolute top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-[#8052ff]/25 blur-[110px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-[65%] -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[#00d2d3]/25 blur-[100px] pointer-events-none"></div>

      {/* Main Glass Stage */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-black/70 backdrop-blur-md p-4 sm:p-6 lg:p-7 shadow-[0_0_60px_rgba(128,82,255,0.18)]">
        
        {/* Layout Grid: Left Cards | Center 3D Interactive Constellation | Right Feature Nodes */}
        <div className="relative w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* =========================================================
              LEFT COLUMN: Holographic Data Stream Cards
              ========================================================= */}
          <div className="w-full lg:w-[28%] flex flex-col justify-between gap-3.5 z-20">
            
            {/* Card 1: Prescription */}
            <motion.div 
              whileHover={{ scale: 1.02, x: 4 }}
              className="p-3.5 rounded-2xl bg-black/60 border border-[#8052ff]/40 hover:border-[#8052ff] backdrop-blur-md shadow-[0_0_20px_rgba(128,82,255,0.2)] transition-all"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-[#8052ff]/20 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#ffffff]">
                  <span className="text-[#8052ff] font-bold text-sm">℞</span>
                  <span className="font-semibold tracking-wider text-[10px] uppercase">Prescription</span>
                </div>
                <span className="text-[9px] font-mono text-[#8052ff] uppercase">Dr. Sharma</span>
              </div>
              <div className="space-y-1 text-[10px] font-mono text-[#bdbdbd]">
                <div className="text-white font-medium">• Tab. Amoxicillin 500mg</div>
                <div>• Tab. Paracetamol 650mg</div>
                <div>• Cap. Ibuprofen 400mg</div>
              </div>
            </motion.div>

            {/* Card 2: Lab Report */}
            <motion.div 
              whileHover={{ scale: 1.02, x: 4 }}
              className="p-3.5 rounded-2xl bg-black/60 border border-[#00d2d3]/40 hover:border-[#00d2d3] backdrop-blur-md shadow-[0_0_20px_rgba(0,210,211,0.2)] transition-all"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-[#00d2d3]/20 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#ffffff]">
                  <Activity className="w-3 h-3 text-[#00d2d3]" />
                  <span className="font-semibold tracking-wider text-[10px] uppercase">Lab Report</span>
                </div>
                <span className="text-[9px] font-mono text-[#00d2d3]">CBC Panel</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-mono text-[#bdbdbd]">
                <div>Hgb: <span className="text-white">13.2 g/dL</span></div>
                <div>WBC: <span className="text-white">7,200 /µL</span></div>
                <div>Platelets: <span className="text-white">2.45L</span></div>
                <div>Glucose: <span className="text-[#00d2d3]">92 mg/dL</span></div>
              </div>
            </motion.div>

            {/* Card 3: Pathology */}
            <motion.div 
              whileHover={{ scale: 1.02, x: 4 }}
              className="p-3.5 rounded-2xl bg-black/60 border border-[#a855f7]/40 hover:border-[#a855f7] backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-[#a855f7]/20 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#ffffff]">
                  <FileSpreadsheet className="w-3 h-3 text-[#a855f7]" />
                  <span className="font-semibold tracking-wider text-[10px] uppercase">Pathology</span>
                </div>
                <span className="text-[9px] font-mono text-[#15846e]">Verified</span>
              </div>
              <div className="text-[10px] font-mono text-[#bdbdbd]">
                <div>Diagnostic Scan: <span className="text-white">Clear</span></div>
                <div className="text-[9px] text-[#a855f7] mt-0.5">Cellular Morphology Normal</div>
              </div>
            </motion.div>

          </div>


          {/* =========================================================
              CENTER: Live 3D Interactive Sagittal Constellation Canvas
              ========================================================= */}
          <div className="w-full lg:w-[44%] h-[320px] sm:h-[400px] lg:h-[500px] relative flex items-center justify-center">
            
            {/* SVG Connecting Bezier Streams (Left Cards -> Brain -> Right Nodes) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60">
              <defs>
                <linearGradient id="streamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8052ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8052ff" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="streamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d2d3" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00d2d3" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="streamGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#00d2d3" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#00d2d3" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Left Inflow Curves */}
              <path d="M 0,110 C 60,110 110,180 170,180" stroke="url(#streamGrad1)" strokeWidth="1.2" fill="none" strokeDasharray="3,3" />
              <path d="M 0,250 C 70,250 110,230 170,220" stroke="url(#streamGrad2)" strokeWidth="1.2" fill="none" strokeDasharray="3,3" />
              <path d="M 0,390 C 60,390 120,290 170,270" stroke="url(#streamGrad1)" strokeWidth="1.2" fill="none" strokeDasharray="3,3" />

              {/* Right Outflow Curves */}
              <path d="M 330,160 C 370,160 410,90 480,90" stroke="url(#streamGrad3)" strokeWidth="1.2" fill="none" strokeDasharray="3,3" />
              <path d="M 340,200 C 380,200 410,170 480,170" stroke="url(#streamGrad3)" strokeWidth="1.2" fill="none" strokeDasharray="3,3" />
              <path d="M 350,240 C 390,240 410,250 480,250" stroke="url(#streamGrad3)" strokeWidth="1.2" fill="none" strokeDasharray="3,3" />
              <path d="M 340,280 C 380,280 410,330 480,330" stroke="url(#streamGrad3)" strokeWidth="1.2" fill="none" strokeDasharray="3,3" />
              <path d="M 330,320 C 370,320 410,410 480,410" stroke="url(#streamGrad3)" strokeWidth="1.2" fill="none" strokeDasharray="3,3" />
            </svg>

            {/* The Live Interactive 3D Sagittal Particle Constellation */}
            <div className="relative w-full h-full z-10">
              <ConstellationCanvas variant="brain" interactive={true} />
            </div>

            {/* Central HUD Pill */}
            <div className="absolute bottom-2 px-3 py-1 rounded-full bg-black/80 border border-white/10 backdrop-blur-md flex items-center gap-2 pointer-events-none z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8052ff] animate-ping"></span>
              <span className="text-[9px] font-mono text-[#bdbdbd] tracking-wider uppercase">
                3D Synaptic Constellation / Active
              </span>
            </div>
          </div>


          {/* =========================================================
              RIGHT COLUMN: Interactive Feature Anchor Nodes
              ========================================================= */}
          <div className="w-full lg:w-[28%] flex flex-col justify-between gap-2.5 z-20">
            
            {/* Feature 1: Medicine Safety */}
            <motion.div 
              whileHover={{ scale: 1.03, x: -4 }}
              onHoverStart={() => setHoveredFeature('safety')}
              onHoverEnd={() => setHoveredFeature(null)}
              className={`flex items-center gap-3 p-2.5 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                hoveredFeature === 'safety' ? 'border-[#00d2d3] shadow-[0_0_20px_rgba(0,210,211,0.3)]' : 'border-white/[0.08]'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#00d2d3]/15 border border-[#00d2d3]/40 flex items-center justify-center text-[#00d2d3] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#ffffff]">
                  Medicine Safety
                </div>
                <div className="text-[9px] font-light text-[#9a9a9a]">
                  Checks harmful interactions
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Report Summary */}
            <motion.div 
              whileHover={{ scale: 1.03, x: -4 }}
              onHoverStart={() => setHoveredFeature('summary')}
              onHoverEnd={() => setHoveredFeature(null)}
              className={`flex items-center gap-3 p-2.5 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                hoveredFeature === 'summary' ? 'border-[#8052ff] shadow-[0_0_20px_rgba(128,82,255,0.3)]' : 'border-white/[0.08]'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#8052ff]/15 border border-[#8052ff]/40 flex items-center justify-center text-[#8052ff] shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#ffffff]">
                  Report Summary
                </div>
                <div className="text-[9px] font-light text-[#9a9a9a]">
                  AI explains reports simply
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Voice Assistant */}
            <motion.div 
              whileHover={{ scale: 1.03, x: -4 }}
              onHoverStart={() => setHoveredFeature('voice')}
              onHoverEnd={() => setHoveredFeature(null)}
              className={`flex items-center gap-3 p-2.5 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                hoveredFeature === 'voice' ? 'border-[#00d2d3] shadow-[0_0_20px_rgba(0,210,211,0.3)]' : 'border-white/[0.08]'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#00d2d3]/15 border border-[#00d2d3]/40 flex items-center justify-center text-[#00d2d3] shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#ffffff]">
                  Voice Assistant
                </div>
                <div className="text-[9px] font-light text-[#9a9a9a]">
                  Get answers in your dialect
                </div>
              </div>
            </motion.div>

            {/* Feature 4: Smart Alerts */}
            <motion.div 
              whileHover={{ scale: 1.03, x: -4 }}
              onHoverStart={() => setHoveredFeature('alerts')}
              onHoverEnd={() => setHoveredFeature(null)}
              className={`flex items-center gap-3 p-2.5 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                hoveredFeature === 'alerts' ? 'border-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border-white/[0.08]'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#a855f7]/15 border border-[#a855f7]/40 flex items-center justify-center text-[#a855f7] shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#ffffff]">
                  Smart Alerts
                </div>
                <div className="text-[9px] font-light text-[#9a9a9a]">
                  Timely alerts for critical values
                </div>
              </div>
            </motion.div>

            {/* Feature 5: Better Health */}
            <motion.div 
              whileHover={{ scale: 1.03, x: -4 }}
              onHoverStart={() => setHoveredFeature('health')}
              onHoverEnd={() => setHoveredFeature(null)}
              className={`flex items-center gap-3 p-2.5 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                hoveredFeature === 'health' ? 'border-[#ff6b81] shadow-[0_0_20px_rgba(255,107,129,0.3)]' : 'border-white/[0.08]'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#ff6b81]/15 border border-[#ff6b81]/40 flex items-center justify-center text-[#ff6b81] shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#ffffff]">
                  Better Health
                </div>
                <div className="text-[9px] font-light text-[#9a9a9a]">
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
