const Footer = () => {
  return (
    <footer className="bg-[#0B1B3D] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-slate-300 font-medium text-sm">
         <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">V</span>
          </div>
          <span className="font-display font-bold text-white text-lg">VaidyaVaani</span>
        </div>
        <p>© 2026 VaidyaVaani AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
