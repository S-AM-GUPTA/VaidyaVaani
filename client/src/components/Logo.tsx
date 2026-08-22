import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'mark' | 'text';
  theme?: 'light' | 'dark';
  to?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'light',
  to = '/',
}) => {
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  const markSizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  // Select appropriate logo file based on variant and theme
  let logoSrc = '/logo/complete%20logo.png';
  if (theme === 'dark') {
    if (variant === 'mark') logoSrc = '/logo/dark%20logo%20mark.png';
    else if (variant === 'text') logoSrc = '/logo/logo%20text%20dark.png';
    else logoSrc = '/logo/complete%20logo%20dark.png';
  } else {
    if (variant === 'mark') logoSrc = '/logo/logo%20mark.png';
    else if (variant === 'text') logoSrc = '/logo/logo%20text.png';
    else logoSrc = '/logo/complete%20logo.png';
  }

  const content = (
    <div className={`inline-flex items-center group select-none ${className}`}>
      <img
        src={logoSrc}
        alt="VaidyaVaani"
        className={`${variant === 'mark' ? markSizeClasses[size] : heightClasses[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
      />
    </div>
  );

  if (to) {
    return <Link to={to} className="inline-flex items-center">{content}</Link>;
  }

  return content;
};

export default Logo;
