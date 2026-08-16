import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  to?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  to = '/',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Glowing Neural Caduceus / V Monogram */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#8052ff] to-[#00d2d3] opacity-50 blur-md group-hover:opacity-80 transition-opacity duration-300"></div>
        
        <svg viewBox="0 0 36 36" fill="none" className="w-full h-full relative z-10 transform group-hover:scale-105 transition-transform duration-300">
          <defs>
            <linearGradient id="vvLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8052ff" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#00d2d3" />
            </linearGradient>
            <filter id="vvGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Triangular Neural Shield */}
          <polygon 
            points="18,3 33,31 3,31" 
            fill="#0a0a0f" 
            stroke="url(#vvLogoGrad)" 
            strokeWidth="1.8" 
            strokeLinejoin="round"
          />

          {/* Internal Geometric Medical V & Pulse */}
          <path 
            d="M9,13 L18,27 L27,13" 
            stroke="url(#vvLogoGrad)" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            filter="url(#vvGlow)"
          />

          {/* Medical Cross Intersection Node */}
          <path 
            d="M18,9 L18,17 M14,13 L22,13" 
            stroke="#00d2d3" 
            strokeWidth="1.8" 
            strokeLinecap="round"
          />

          {/* Neural Node Sparks */}
          <circle cx="18" cy="27" r="2.2" fill="#ffb829" />
          <circle cx="9" cy="13" r="1.6" fill="#00d2d3" />
          <circle cx="27" cy="13" r="1.6" fill="#8052ff" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-normal tracking-[-0.03em] text-[#ffffff] font-sans leading-none`}>
            Vaidya<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8052ff] to-[#00d2d3] font-medium">Vaani</span>
          </span>
          <span className="text-[9px] font-mono text-[#9a9a9a] uppercase tracking-[0.25em] mt-0.5 leading-none">
            Medical Intelligence
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
};

export default Logo;
