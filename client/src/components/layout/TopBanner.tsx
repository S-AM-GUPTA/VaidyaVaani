import { ShieldCheck } from 'lucide-react';

const TopBanner = () => {
  return (
    <div className="bg-[#0B1B3D] text-white py-2 px-4 flex justify-center items-center text-sm font-medium">
      <ShieldCheck className="w-4 h-4 mr-2" />
      Your health data is 100% secure and private. We follow industry-standard encryption.
    </div>
  );
};

export default TopBanner;
