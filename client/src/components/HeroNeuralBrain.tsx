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
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 15, y: y * 15 });
  };

  return (
    <div 
      className={`relative w-full max-w-[1380px] mx-auto select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      
      {/* Background Volumetric Neural Lighting */}
      <div className="absolute top-1/2 left-[32%] -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[#8052ff]/20 blur-[130px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-[68%] -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#00d2d3]/20 blur-[120px] pointer-events-none"></div>

      {/* Main Glass Stage Showcase */}
      <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-black/80 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_0_80px_rgba(128,82,255,0.18)]">
        
        {/* Responsive Grid: Left Inflow Cards (26%) | Center Anatomical 3D Brain (48%) | Right Outflow Features (26%) */}
        <div className="relative w-full min-h-[500px] sm:min-h-[560px] lg:min-h-[600px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
          
          {/* =========================================================
              LEFT COLUMN: Holographic Clinical Inflow Cards
              ========================================================= */}
          <div className="w-full lg:w-[26%] flex flex-col justify-between gap-4 z-20">
            
            {/* Card 1: ℞ Prescription */}
            <motion.div 
              whileHover={{ scale: 1.03, x: 6 }}
              onHoverStart={() => setActiveNode('rx')}
              onHoverEnd={() => setActiveNode(null)}
              className={`p-4 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                activeNode === 'rx' 
                  ? 'border-[#8052ff] shadow-[0_0_30px_rgba(128,82,255,0.4)]' 
                  : 'border-[#8052ff]/30 hover:border-[#8052ff]/60'
              }`}
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
              whileHover={{ scale: 1.03, x: 6 }}
              onHoverStart={() => setActiveNode('lab')}
              onHoverEnd={() => setActiveNode(null)}
              className={`p-4 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                activeNode === 'lab' 
                  ? 'border-[#00d2d3] shadow-[0_0_30px_rgba(0,210,211,0.4)]' 
                  : 'border-[#00d2d3]/30 hover:border-[#00d2d3]/60'
              }`}
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
              whileHover={{ scale: 1.03, x: 6 }}
              onHoverStart={() => setActiveNode('path')}
              onHoverEnd={() => setActiveNode(null)}
              className={`p-4 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                activeNode === 'path' 
                  ? 'border-[#a855f7] shadow-[0_0_30px_rgba(168,85,247,0.4)]' 
                  : 'border-[#a855f7]/30 hover:border-[#a855f7]/60'
              }`}
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
              CENTER: 100% Anatomically Accurate 3D Glowing Neural Brain Model
              ========================================================= */}
          <div className="w-full lg:w-[48%] h-[380px] sm:h-[460px] lg:h-[540px] relative flex items-center justify-center">
            
            {/* SVG Connecting Bezier Inflow & Outflow Data Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="glowInflow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8052ff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#8052ff" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="glowInflowCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d2d3" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#00d2d3" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="glowOutflow" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#00d2d3" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#00d2d3" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Inflow paths from left */}
              <path d="M 0,110 C 80,110 130,200 200,200" stroke="url(#glowInflow)" strokeWidth={activeNode === 'rx' ? "2.5" : "1.2"} fill="none" strokeDasharray="3,3" className="transition-all duration-300" />
              <path d="M 0,260 C 90,260 140,240 200,240" stroke="url(#glowInflowCyan)" strokeWidth={activeNode === 'lab' ? "2.5" : "1.2"} fill="none" strokeDasharray="3,3" className="transition-all duration-300" />
              <path d="M 0,410 C 80,410 140,310 200,290" stroke="url(#glowInflow)" strokeWidth={activeNode === 'path' ? "2.5" : "1.2"} fill="none" strokeDasharray="3,3" className="transition-all duration-300" />

              {/* Outflow paths to right */}
              <path d="M 370,160 C 430,160 470,85 540,85" stroke="url(#glowOutflow)" strokeWidth={activeNode === 'safety' ? "2.5" : "1.2"} fill="none" strokeDasharray="3,3" className="transition-all duration-300" />
              <path d="M 380,210 C 440,210 470,170 540,170" stroke="url(#glowOutflow)" strokeWidth={activeNode === 'summary' ? "2.5" : "1.2"} fill="none" strokeDasharray="3,3" className="transition-all duration-300" />
              <path d="M 390,260 C 450,260 470,260 540,260" stroke="url(#glowOutflow)" strokeWidth={activeNode === 'voice' ? "2.5" : "1.2"} fill="none" strokeDasharray="3,3" className="transition-all duration-300" />
              <path d="M 380,310 C 440,310 470,350 540,350" stroke="url(#glowOutflow)" strokeWidth={activeNode === 'alerts' ? "2.5" : "1.2"} fill="none" strokeDasharray="3,3" className="transition-all duration-300" />
              <path d="M 370,350 C 430,350 470,430 540,430" stroke="url(#glowOutflow)" strokeWidth={activeNode === 'health' ? "2.5" : "1.2"} fill="none" strokeDasharray="3,3" className="transition-all duration-300" />
            </svg>

            {/* Central 3D Interactive Glowing Brain with Mouse Tilt Parallax */}
            <motion.div 
              className="relative w-full h-full flex items-center justify-center"
              animate={{
                rotateX: -mousePos.y * 0.4,
                rotateY: mousePos.x * 0.4,
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              style={{ perspective: 1000 }}
            >
              {/* High-Resolution Glowing Anatomical Sagittal Brain Image */}
              <img 
                src="/images/neural-brain-center.png" 
                alt="VaidyaVaani 3D Neural Brain Model" 
                className="w-full h-full max-h-[460px] object-contain pointer-events-none select-none drop-shadow-[0_0_45px_rgba(128,82,255,0.4)]"
              />

              {/* Ambient Micro Particle Spark Overlay */}
              <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30">
                <ConstellationCanvas variant="ambient" particleCount={50} interactive={false} />
              </div>
            </motion.div>

            {/* Central Holographic HUD Indicator */}
            <div className="absolute bottom-2 px-4 py-1.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-md flex items-center gap-2 pointer-events-none z-20 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <span className="w-2 h-2 rounded-full bg-[#8052ff] animate-ping"></span>
              <span className="text-[10px] font-mono text-[#bdbdbd] tracking-wider uppercase">
                3D Neural Brain Constellation / Active
              </span>
            </div>
          </div>


          {/* =========================================================
              RIGHT COLUMN: Interactive Clinical Feature Nodes
              ========================================================= */}
          <div className="w-full lg:w-[26%] flex flex-col justify-between gap-3 z-20">
            
            {/* Feature 1: Medicine Safety */}
            <motion.div 
              whileHover={{ scale: 1.03, x: -6 }}
              onHoverStart={() => setActiveNode('safety')}
              onHoverEnd={() => setActiveNode(null)}
              className={`flex items-center gap-3.5 p-3 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                activeNode === 'safety' 
                  ? 'border-[#00d2d3] shadow-[0_0_30px_rgba(0,210,211,0.4)]' 
                  : 'border-white/[0.08] hover:border-[#00d2d3]/50'
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
              whileHover={{ scale: 1.03, x: -6 }}
              onHoverStart={() => setActiveNode('summary')}
              onHoverEnd={() => setActiveNode(null)}
              className={`flex items-center gap-3.5 p-3 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                activeNode === 'summary' 
                  ? 'border-[#8052ff] shadow-[0_0_30px_rgba(128,82,255,0.4)]' 
                  : 'border-white/[0.08] hover:border-[#8052ff]/50'
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
              whileHover={{ scale: 1.03, x: -6 }}
              onHoverStart={() => setActiveNode('voice')}
              onHoverEnd={() => setActiveNode(null)}
              className={`flex items-center gap-3.5 p-3 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                activeNode === 'voice' 
                  ? 'border-[#00d2d3] shadow-[0_0_30px_rgba(0,210,211,0.4)]' 
                  : 'border-white/[0.08] hover:border-[#00d2d3]/50'
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
              whileHover={{ scale: 1.03, x: -6 }}
              onHoverStart={() => setActiveNode('alerts')}
              onHoverEnd={() => setActiveNode(null)}
              className={`flex items-center gap-3.5 p-3 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                activeNode === 'alerts' 
                  ? 'border-[#a855f7] shadow-[0_0_30px_rgba(168,85,247,0.4)]' 
                  : 'border-white/[0.08] hover:border-[#a855f7]/50'
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
              whileHover={{ scale: 1.03, x: -6 }}
              onHoverStart={() => setActiveNode('health')}
              onHoverEnd={() => setActiveNode(null)}
              className={`flex items-center gap-3.5 p-3 rounded-2xl bg-black/60 border backdrop-blur-md transition-all cursor-pointer ${
                activeNode === 'health' 
                  ? 'border-[#ff6b81] shadow-[0_0_30px_rgba(255,107,129,0.4)]' 
                  : 'border-white/[0.08] hover:border-[#ff6b81]/50'
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
