import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'mark';
  to?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  to = '/',
}) => {
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
  };

  const markSizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
  };

  const logoSrc = variant === 'mark' 
    ? '/logo/dark%20logo%20mark.png' 
    : '/logo/complete%20logo%20dark.png';

  const content = (
    <div className={`inline-flex items-center group select-none ${className}`}>
      <img
        src={logoSrc}
        alt="VaidyaVaani"
        className={`${variant === 'mark' ? markSizeClasses[size] : heightClasses[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] drop-shadow-[0_0_20px_rgba(128,82,255,0.25)]`}
      />
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
};

export default Logo;
