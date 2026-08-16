import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ConstellationCanvas } from './ConstellationCanvas';

interface HeroNeuralBrainProps {
  className?: string;
  interactive?: boolean;
}

export const HeroNeuralBrain: React.FC<HeroNeuralBrainProps> = ({ 
  className = '',
  interactive = true 
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 12, y: y * 12 });
  };

  return (
    <div 
      className={`relative w-full select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      {/* Background Volumetric Glow in #004fdc */}
      <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[#004fdc]/25 blur-[95px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-[65%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#00d2d3]/20 blur-[85px] pointer-events-none"></div>

      {/* Main Container */}
      <motion.div 
        className="relative w-full rounded-3xl overflow-hidden border border-white/[0.08] bg-black/60 backdrop-blur-md p-2 sm:p-4 shadow-[0_0_50px_rgba(0,79,220,0.2)] group"
        animate={{
          rotateX: -mousePos.y * 0.5,
          rotateY: mousePos.x * 0.5,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        style={{ perspective: 1000 }}
      >
        
        {/* Layer 1: High-Resolution 3D Neural Model Image */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center overflow-hidden rounded-2xl">
          <img 
            src="/images/brain-neural-model.png" 
            alt="VaidyaVaani 3D Neural Medical Intelligence" 
            className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-700 group-hover:scale-[1.02]"
          />

          {/* Layer 2: Ambient 3D Particle Constellation Overlay */}
          <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40 group-hover:opacity-60 transition-opacity duration-500">
            <ConstellationCanvas variant="ambient" particleCount={60} interactive={false} />
          </div>

          {/* Layer 3: Subtle Holographic Corner HUD Indicators */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 border border-[#004fdc]/40 backdrop-blur-md flex items-center gap-2 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#004fdc] animate-pulse"></span>
            <span className="text-[9px] font-mono text-[#ffffff] uppercase tracking-wider">
              Neural Core / 3D Model
            </span>
          </div>

          <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/70 border border-[#00d2d3]/40 backdrop-blur-md pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d2d3]"></span>
            <span className="text-[9px] font-mono text-[#00d2d3] uppercase tracking-wider">
              Multimodal Synchronized
            </span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default HeroNeuralBrain;
