import { useNavigate } from 'react-router-dom';
import { 
  CloudUpload, 
  Camera, 
  FileText, 
  AlertTriangle,
  Settings,
  Activity,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f1f6f5] font-sans text-slate-900 overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Dashboard & Upload */}
          <div className="lg:col-span-5 space-y-8">
            {/* Header & Stats */}
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-[#0B1B3D] leading-tight mb-6">
                Your Personalized <br/>Health Dashboard
              </h1>
              
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex justify-between text-center divide-x divide-slate-100">
                <div className="px-2 w-1/3">
                  <div className="text-xs font-bold text-slate-600 mb-1">Total Documents</div>
                  <div className="text-2xl font-bold text-slate-900">5</div>
                </div>
                <div className="px-2 w-1/3">
                  <div className="text-xs font-bold text-slate-600 mb-1">Active Prescriptions</div>
                  <div className="text-2xl font-bold text-emerald-600">3</div>
                </div>
                <div className="px-2 w-1/3">
                  <div className="text-xs font-bold text-slate-600 mb-1">Recent Checks</div>
                  <div className="text-2xl font-bold text-red-500">1 Alert</div>
                </div>
              </div>
            </div>

            {/* Circular Upload Area */}
            <div className="flex items-center justify-center py-10 relative">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-100/50 via-transparent to-transparent"></div>
               
               <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform mr-4" onClick={() => navigate('/dashboard')}>
                 <div className="w-12 h-12 bg-emerald-600 rounded-full text-white flex items-center justify-center mb-2 shadow-md">
                   <Camera className="w-5 h-5" />
                 </div>
                 <div className="text-xs font-bold text-slate-700 text-center">[Scan from<br/>Camera]</div>
               </div>

               <div className="relative z-10 cursor-pointer group" onClick={() => navigate('/dashboard')}>
                 <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-md group-hover:bg-emerald-500/30 transition-all"></div>
                 <div className="w-32 h-32 bg-[#2B4B6F] rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-white text-white">
                    <FileText className="w-8 h-8 mb-2" />
                    <div className="text-sm font-bold text-center leading-tight">
                      [Upload New<br/>Document]
                    </div>
                 </div>
               </div>

               <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform ml-4" onClick={() => navigate('/dashboard')}>
                 <div className="w-12 h-12 bg-emerald-600 rounded-full text-white flex items-center justify-center mb-2 shadow-md">
                   <CloudUpload className="w-5 h-5" />
                 </div>
                 <div className="text-xs font-bold text-slate-700 text-center">[Upload<br/>PDF/Image]</div>
               </div>
            </div>

            {/* Interaction Checker Alert */}
            <div className="bg-[#fefce8] border-2 border-[#fef08a] rounded-2xl p-6">
               <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider">Medicine Interaction Checker:</h3>
               
               <div className="flex items-start mb-6">
                 {/* Pill Icons Placeholder */}
                 <div className="flex -space-x-2 mr-4">
                     <div className="w-10 h-12 bg-white border-2 border-slate-300 rounded-lg shadow-sm flex items-center justify-center flex-col">
                       <div className="w-6 h-1.5 bg-orange-400 rounded-t-sm mb-1"></div>
                     </div>
                     <div className="w-10 h-12 bg-white border-2 border-slate-300 rounded-lg shadow-sm flex items-center justify-center mt-2 relative z-10">
                       <div className="w-6 h-1.5 bg-blue-500 rounded-t-sm mb-1"></div>
                     </div>
                 </div>

                 <div className="flex-1 space-y-2">
                   <div className="bg-[#fef9c3] border border-yellow-400 text-yellow-800 px-3 py-2 rounded-lg text-xs font-bold flex items-center w-fit">
                     <AlertTriangle className="w-3 h-3 mr-1 text-yellow-600" />
                     Moderate Interaction: Timing Adjusted
                   </div>
                   <div className="bg-[#fef9c3] border border-yellow-400 text-yellow-800 px-3 py-2 rounded-lg text-xs font-bold flex items-center w-fit opacity-50">
                     <AlertTriangle className="w-3 h-3 mr-1 text-yellow-600" />
                     Moderate Interaction: Timing Adjusted
                   </div>
                 </div>
               </div>

               <div className="mb-6">
                 <div className="text-sm font-bold text-slate-800 mb-1">Your Active Medicines:</div>
                 <ul className="text-sm font-medium text-slate-600">
                   <li>• [Atenolol 25mg]</li>
                   <li>• [Paracetamol 650mg]</li>
                   <li>• [Vitamin B Complex]</li>
                 </ul>
               </div>

               <button className="w-full bg-[#49996F] hover:bg-[#387a58] text-white py-3 rounded-lg font-bold transition-colors">
                 [Check for New Interactions]
               </button>
            </div>
          </div>

          {/* MIDDLE COLUMN: Medical Timeline */}
          <div className="lg:col-span-4 bg-[#f4f8fa] border-2 border-blue-100 rounded-3xl p-6 relative overflow-hidden">
            <h2 className="text-xl font-bold text-[#0B1B3D] mb-8 relative z-10">Medical Timeline</h2>
            
            {/* Timeline Vertical Line */}
            <div className="absolute left-[39px] top-24 bottom-10 w-0.5 bg-slate-300 z-0"></div>

            <div className="space-y-8 relative z-10">
              {/* Timeline Item 1 */}
              <div className="flex relative">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex flex-col items-center justify-center flex-shrink-0 z-10 shadow-md mr-4">
                  <span className="text-[10px] font-bold leading-tight">Jun</span>
                  <span className="text-sm font-bold leading-tight">15</span>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex-1 shadow-sm hover:border-emerald-300 transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>
                   <div className="flex items-center space-x-3 mb-2">
                     <div className="w-8 h-10 bg-red-50 rounded flex justify-center border border-red-100">
                       <div className="w-2 h-full bg-red-500 rounded-full mt-2"></div>
                     </div>
                     <div className="font-bold text-sm text-slate-800">[CBC Report]</div>
                   </div>
                   <div className="text-xs font-bold text-slate-700 mb-1">Key Abnormal results:</div>
                   <ul className="text-[10px] font-medium text-slate-600 space-y-0.5">
                     <li className="flex items-center"><div className="w-1 h-1 bg-red-500 rounded-full mr-1"></div>Normal Sugar</li>
                     <li className="flex items-center"><div className="w-1 h-1 bg-slate-400 rounded-full mr-1"></div>Normalid terms II</li>
                     <li className="flex items-center"><div className="w-1 h-1 bg-slate-400 rounded-full mr-1"></div>Normalid terms III</li>
                     <li className="flex items-center"><div className="w-1 h-1 bg-red-500 rounded-full mr-1"></div>Abnoronormal results</li>
                   </ul>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="flex relative">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex flex-col items-center justify-center flex-shrink-0 z-10 shadow-md mr-4">
                  <span className="text-[10px] font-bold leading-tight">Jun</span>
                  <span className="text-sm font-bold leading-tight">10</span>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex-1 shadow-sm hover:border-emerald-300 transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>
                   <div className="font-bold text-sm text-slate-800 mb-2">[Jun 10 - Dr. Gupta Prescription]</div>
                   <div className="flex items-start space-x-3">
                     <div className="w-8 h-10 bg-yellow-50 rounded border border-yellow-200 flex items-center justify-center flex-shrink-0">
                       <FileText className="w-4 h-4 text-yellow-600" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-slate-700 mb-1">Summary:</div>
                       <ul className="text-[10px] font-medium text-slate-600 space-y-0.5">
                         <li>• Atenolol 25mg</li>
                         <li>• Paracetamol 650mg</li>
                         <li>• Vitamin B Complex</li>
                       </ul>
                     </div>
                   </div>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="flex relative">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex flex-col items-center justify-center flex-shrink-0 z-10 shadow-md mr-4">
                  <span className="text-[10px] font-bold leading-tight">Jun</span>
                  <span className="text-sm font-bold leading-tight">5</span>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex-1 shadow-sm hover:border-emerald-300 transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>
                   <div className="font-bold text-sm text-slate-800 mb-2">[Jun 5 - Radiology Report]</div>
                   <div className="flex items-start space-x-3">
                     <div className="w-10 h-10 bg-slate-800 rounded border border-slate-700 flex items-center justify-center flex-shrink-0">
                       <Activity className="w-5 h-5 text-slate-300" />
                     </div>
                     <div>
                       <div className="text-xs font-bold text-slate-700 mb-1">Key abnormal results:</div>
                       <ul className="text-[10px] font-medium text-slate-600 space-y-0.5">
                         <li>• X-ray</li>
                         <li>• Biodrwns</li>
                         <li>• Key summay</li>
                       </ul>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Bottom Arrow for Timeline */}
            <div className="absolute left-[35px] bottom-6 text-slate-300">
               <ChevronRight className="w-4 h-4 transform rotate-90" />
            </div>
          </div>

          {/* RIGHT COLUMN: Settings & AI Chat */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* User Preferences Box */}
            <div className="bg-[#eaf4ed] rounded-2xl p-6 border-2 border-emerald-100">
              <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider">User Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Support</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold">हिन्दी</span>
                    <span className="text-xs font-bold">English</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">FAQ</span>
                  <div className="w-8 h-4 bg-emerald-200 rounded-full relative">
                    <div className="absolute left-1 top-0.5 w-3 h-3 bg-emerald-600 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">FASs</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">My Account</span>
                </div>
                
                <div className="pt-4 border-t border-emerald-200/50 text-center">
                  <span className="text-xs font-bold text-emerald-800 flex justify-center items-center">
                    Secure Medical Vault
                  </span>
                </div>
              </div>
            </div>

            {/* AI Chat Assistant Placeholder */}
            <div className="bg-[#1f5f5b] rounded-2xl p-4 flex flex-col h-[350px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">AI Chat Assistant</h3>
                <Settings className="w-4 h-4 text-emerald-200" />
              </div>
              
              <div className="flex-1 bg-white rounded-xl p-4 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4">
                   <div className="bg-slate-100 p-2 rounded-lg text-xs text-slate-600 font-medium w-3/4 ml-auto rounded-br-none">
                     Ask about your lipid profile
                   </div>
                   <div className="bg-slate-100 p-2 rounded-lg text-xs text-slate-600 font-medium w-3/4 ml-auto rounded-br-none">
                     Check drug interaction list
                   </div>
                   <div className="bg-slate-100 p-2 rounded-lg text-xs text-slate-600 font-medium w-3/4 ml-auto rounded-br-none">
                     Check drug interaction list
                   </div>
                </div>
                
                <div className="mt-4 flex items-center border border-slate-200 rounded-full px-3 py-2">
                  <input type="text" placeholder="Type a message..." className="flex-1 text-xs outline-none bg-transparent" />
                  <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center ml-2">
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
