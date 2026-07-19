import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CloudUpload, 
  Camera, 
  FileText, 
  AlertTriangle,
  Settings,
  Activity,
  ChevronRight,
  X
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Uploader from '../components/Uploader';

const Home = () => {
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'reports' | 'prescriptions'>('reports');

  const openUploadModal = (type: 'reports' | 'prescriptions') => {
    setUploadType(type);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans text-[#1C2A24] overflow-x-hidden flex flex-col selection:bg-[#133E2B] selection:text-[#F8F7F4]">
      <Navbar />

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Dashboard & Upload */}
          <div className="lg:col-span-5 space-y-8">
            {/* Header & Stats */}
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#133E2B] tracking-tighter leading-tight mb-6">
                Your Medical <br/>Intelligence Hub
              </h1>
              
              <div className="bg-white rounded-2xl border border-[#1C2A24]/10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-5 flex justify-between text-center divide-x divide-[#1C2A24]/10">
                <div className="px-2 w-1/3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2D4238]/60 mb-1">Total Docs</div>
                  <div className="text-2xl font-bold text-[#1C2A24]">5</div>
                </div>
                <div className="px-2 w-1/3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2D4238]/60 mb-1">Active Rx</div>
                  <div className="text-2xl font-bold text-emerald-600">3</div>
                </div>
                <div className="px-2 w-1/3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2D4238]/60 mb-1">Alerts</div>
                  <div className="text-2xl font-bold text-amber-600">1</div>
                </div>
              </div>
            </div>

            {/* Circular Upload Area */}
            <div className="flex items-center justify-center py-10 relative">
               <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent"></div>
               
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex flex-col items-center cursor-pointer mr-6 z-10" 
                 onClick={() => openUploadModal('prescriptions')}
               >
                 <div className="w-12 h-12 bg-white border border-[#1C2A24]/10 rounded-full text-[#133E2B] flex items-center justify-center mb-3 shadow-sm">
                   <Camera className="w-5 h-5" />
                 </div>
                 <div className="text-[11px] font-bold uppercase tracking-widest text-[#2D4238]/70 text-center">Scan<br/>Camera</div>
               </motion.div>

               <motion.div 
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="relative z-10 cursor-pointer group" 
                 onClick={() => openUploadModal('reports')}
               >
                 <div className="w-32 h-32 bg-[#133E2B] rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-[#F8F7F4] text-[#F8F7F4]">
                    <FileText className="w-8 h-8 mb-2" />
                    <div className="text-xs font-bold uppercase tracking-wider text-center leading-tight">
                      Upload<br/>New
                    </div>
                 </div>
               </motion.div>

               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex flex-col items-center cursor-pointer ml-6 z-10" 
                 onClick={() => openUploadModal('reports')}
               >
                 <div className="w-12 h-12 bg-white border border-[#1C2A24]/10 rounded-full text-[#133E2B] flex items-center justify-center mb-3 shadow-sm">
                   <CloudUpload className="w-5 h-5" />
                 </div>
                 <div className="text-[11px] font-bold uppercase tracking-widest text-[#2D4238]/70 text-center">Upload<br/>File</div>
               </motion.div>
            </div>

            {/* Interaction Checker Alert */}
            <div className="bg-white border border-[#1C2A24]/10 rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
               <h3 className="font-bold text-[#133E2B] text-sm mb-6 uppercase tracking-wider">Interaction Checker</h3>
               
               <div className="flex items-start mb-8">
                 <div className="flex -space-x-2 mr-5">
                     <div className="w-10 h-12 bg-[#F8F7F4] border border-[#1C2A24]/10 rounded-lg flex items-center justify-center flex-col">
                       <div className="w-6 h-1.5 bg-amber-400 rounded-t-sm mb-1"></div>
                     </div>
                     <div className="w-10 h-12 bg-[#F8F7F4] border border-[#1C2A24]/10 rounded-lg flex items-center justify-center mt-2 relative z-10">
                       <div className="w-6 h-1.5 bg-blue-500 rounded-t-sm mb-1"></div>
                     </div>
                 </div>

                 <div className="flex-1 space-y-2">
                   <div className="bg-amber-50 border border-amber-200/50 text-amber-800 px-3 py-2 rounded-lg text-xs font-bold flex items-center w-fit">
                     <AlertTriangle className="w-3 h-3 mr-1.5" />
                     Moderate: Timing Adjusted
                   </div>
                 </div>
               </div>

               <div className="mb-8">
                 <div className="text-xs font-bold text-[#2D4238]/60 uppercase tracking-widest mb-3">Active Medicines</div>
                 <ul className="text-sm font-medium text-[#1C2A24] space-y-2">
                   <li className="flex items-center"><div className="w-1 h-1 bg-[#133E2B] rounded-full mr-2"></div> Atenolol 25mg</li>
                   <li className="flex items-center"><div className="w-1 h-1 bg-[#133E2B] rounded-full mr-2"></div> Paracetamol 650mg</li>
                   <li className="flex items-center"><div className="w-1 h-1 bg-[#133E2B] rounded-full mr-2"></div> Vitamin B Complex</li>
                 </ul>
               </div>

               <button className="w-full bg-[#F8F7F4] hover:bg-[#e8e6df] text-[#133E2B] border border-[#1C2A24]/10 py-4 rounded-xl font-bold transition-colors text-sm active:scale-[0.98]">
                 Check for New Interactions
               </button>
            </div>
          </div>

          {/* MIDDLE COLUMN: Medical Timeline */}
          <div className="lg:col-span-4 relative">
            <h2 className="text-xl font-bold text-[#133E2B] tracking-tight mb-8">Medical Timeline</h2>
            
            <div className="absolute left-[23px] top-16 bottom-0 w-px bg-[#1C2A24]/10"></div>

            <div className="space-y-10 relative z-10 pl-16">
              {/* Timeline Item 1 */}
              <div className="relative">
                <div className="absolute -left-16 w-12 h-12 bg-white border border-[#1C2A24]/10 text-[#133E2B] rounded-full flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-widest">Jun</span>
                  <span className="text-sm font-bold">15</span>
                </div>
                <div 
                  className="bg-white border border-[#1C2A24]/10 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-emerald-600/30 transition-colors cursor-pointer group"
                  onClick={() => navigate('/dashboard')}
                >
                   <div className="flex items-center space-x-3 mb-3">
                     <div className="w-8 h-10 bg-red-50 rounded-lg flex justify-center border border-red-100">
                       <div className="w-2 h-full bg-red-500 rounded-full mt-2"></div>
                     </div>
                     <div className="font-bold text-sm text-[#1C2A24] group-hover:text-emerald-700 transition-colors">CBC Report</div>
                   </div>
                   <div className="text-[11px] font-bold uppercase tracking-wider text-[#2D4238]/60 mb-2">Key Abnormalities</div>
                   <ul className="text-xs font-medium text-[#1C2A24] space-y-1.5">
                     <li className="flex items-center"><div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>Sugar Elevated</li>
                     <li className="flex items-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>Lipids Normal</li>
                   </ul>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative">
                <div className="absolute -left-16 w-12 h-12 bg-white border border-[#1C2A24]/10 text-[#133E2B] rounded-full flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-widest">Jun</span>
                  <span className="text-sm font-bold">10</span>
                </div>
                <div 
                  className="bg-white border border-[#1C2A24]/10 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-emerald-600/30 transition-colors cursor-pointer group"
                  onClick={() => navigate('/dashboard')}
                >
                   <div className="font-bold text-sm text-[#1C2A24] mb-3 group-hover:text-emerald-700 transition-colors">Dr. Gupta Prescription</div>
                   <div className="flex items-start space-x-3">
                     <div className="w-8 h-10 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-center flex-shrink-0">
                       <FileText className="w-4 h-4 text-amber-600" />
                     </div>
                     <div>
                       <div className="text-[11px] font-bold uppercase tracking-wider text-[#2D4238]/60 mb-2">Added</div>
                       <ul className="text-xs font-medium text-[#1C2A24] space-y-1.5">
                         <li>Atenolol 25mg</li>
                         <li>Paracetamol 650mg</li>
                       </ul>
                     </div>
                   </div>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative">
                <div className="absolute -left-16 w-12 h-12 bg-white border border-[#1C2A24]/10 text-[#133E2B] rounded-full flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-widest">Jun</span>
                  <span className="text-sm font-bold">05</span>
                </div>
                <div 
                  className="bg-white border border-[#1C2A24]/10 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-emerald-600/30 transition-colors cursor-pointer group"
                  onClick={() => navigate('/dashboard')}
                >
                   <div className="font-bold text-sm text-[#1C2A24] mb-3 group-hover:text-emerald-700 transition-colors">Radiology Report</div>
                   <div className="flex items-start space-x-3">
                     <div className="w-8 h-10 bg-[#1C2A24] rounded-lg flex items-center justify-center flex-shrink-0">
                       <Activity className="w-4 h-4 text-[#F8F7F4]" />
                     </div>
                     <div>
                       <div className="text-[11px] font-bold uppercase tracking-wider text-[#2D4238]/60 mb-2">Findings</div>
                       <ul className="text-xs font-medium text-[#1C2A24] space-y-1.5">
                         <li>Chest X-ray Clear</li>
                       </ul>
                     </div>
                   </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Settings & AI Chat */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* User Preferences Box */}
            <div className="bg-white border border-[#1C2A24]/10 rounded-3xl p-6">
              <h3 className="font-bold text-[#133E2B] text-xs mb-5 uppercase tracking-widest">Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1C2A24]/5">
                  <span className="text-sm font-medium text-[#1C2A24]">Language</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C2A24]/50">हिन्दी</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#133E2B]">ENG</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b border-[#1C2A24]/5">
                  <span className="text-sm font-medium text-[#1C2A24]">Notifications</span>
                  <div className="w-8 h-4 bg-emerald-100 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-0.5 w-3 h-3 bg-emerald-600 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b border-[#1C2A24]/5 cursor-pointer">
                  <span className="text-sm font-medium text-[#1C2A24]">Account Settings</span>
                  <ChevronRight className="w-4 h-4 text-[#1C2A24]/30" />
                </div>
              </div>
            </div>

            {/* AI Chat Assistant Placeholder */}
            <div className="bg-[#133E2B] rounded-3xl p-5 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-5 px-1">
                <h3 className="font-bold text-[#F8F7F4] text-xs uppercase tracking-widest">Assistant</h3>
                <Settings className="w-4 h-4 text-[#F8F7F4]/50" />
              </div>
              
              <div className="flex-1 bg-[#F8F7F4] rounded-2xl p-4 flex flex-col relative overflow-hidden border border-black/10">
                <div className="flex-1 overflow-y-auto space-y-3 pb-4">
                   <div className="bg-white p-3 rounded-xl text-xs text-[#1C2A24] font-medium w-[85%] border border-[#1C2A24]/5 shadow-sm">
                     Hello! I've analyzed your recent CBC report. Your blood sugar levels are slightly elevated.
                   </div>
                   <div className="bg-[#133E2B] p-3 rounded-xl text-xs text-white font-medium w-[85%] ml-auto border border-[#133E2B] shadow-sm text-right">
                     What should I do?
                   </div>
                </div>
                
                <div className="mt-2 flex items-center bg-white border border-[#1C2A24]/10 rounded-full pl-4 pr-1.5 py-1.5 shadow-sm">
                  <input type="text" placeholder="Ask a question..." className="flex-1 text-xs outline-none bg-transparent placeholder:text-[#1C2A24]/30" />
                  <button className="w-7 h-7 bg-[#133E2B] text-white rounded-full flex items-center justify-center hover:bg-[#0f3223] transition-colors">
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1C2A24]/40 backdrop-blur-md" onClick={() => setIsUploadModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 border border-[#1C2A24]/5"
          >
             <div className="absolute top-6 right-6 z-10">
               <button 
                 onClick={() => setIsUploadModalOpen(false)}
                 className="w-10 h-10 bg-[#F8F7F4] hover:bg-[#e8e6df] text-[#1C2A24] rounded-full flex items-center justify-center transition-colors active:scale-95"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <div className="p-8 md:p-12">
               <h2 className="text-3xl font-extrabold text-[#133E2B] tracking-tight mb-2">
                 Upload {uploadType === 'reports' ? 'Lab Report' : 'Prescription'}
               </h2>
               <p className="text-[#2D4238]/70 mb-10 font-medium text-sm">
                 Your document will be encrypted and instantly analyzed by our medical intelligence engine.
               </p>
               
               <Uploader 
                 type={uploadType} 
                 onUploadComplete={() => {
                   setIsUploadModalOpen(false);
                   navigate('/dashboard');
                 }} 
               />
             </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
