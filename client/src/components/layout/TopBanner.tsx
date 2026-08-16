import { Lock } from 'lucide-react';

const TopBanner = () => {
  return (
    <div className="bg-[#000000] border-b border-white/[0.06] text-[#bdbdbd] py-2 px-4 flex justify-center items-center text-xs font-light tracking-wider uppercase">
      <Lock className="w-3.5 h-3.5 mr-2 text-[#ffb829]" />
      <span>Zero-Knowledge Clinical Encryption Active • Transient Inference Only</span>
    </div>
  );
};

export default TopBanner;
