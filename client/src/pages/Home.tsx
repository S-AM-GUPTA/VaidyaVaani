import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CloudUpload, 
  Camera, 
  FileText, 
  AlertTriangle, 
  X,
  Lock,
  Sparkles,
  Send
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Uploader from '../components/Uploader';
import { ConstellationCanvas } from '../components/ConstellationCanvas';

const Home = () => {
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'reports' | 'prescriptions'>('reports');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello. I've decoded your latest CBC and prescription records. Your blood glucose is slightly elevated at 108 mg/dL. How can I assist?" },
  ]);

  const openUploadModal = (type: 'reports' | 'prescriptions') => {
    setUploadType(type);
    setIsUploadModalOpen(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { sender: 'ai', text: `Based on your Atenolol prescription (50mg) and current lab markers, it is recommended to maintain regular blood pressure monitoring and schedule dosage at least 2 hours apart from antacids.` }
      ]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] font-sans overflow-x-hidden flex flex-col selection:bg-[#8052ff] selection:text-[#ffffff] relative">
      <Navbar />

      {/* Subtle ambient particle dust */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <ConstellationCanvas variant="ambient" particleCount={70} interactive={false} />
      </div>

      <main className="relative z-10 flex-grow w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* =========================================================
              LEFT COLUMN: Dashboard Telemetry & Action Hub
              ========================================================= */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Header & Stats */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb829] mb-3">
                Workspace Telemetry
              </div>
              <h1 className="text-3xl sm:text-4xl font-normal text-[#ffffff] tracking-[-0.04em] leading-[1.08] mb-6">
                Clinical Intelligence Vault
              </h1>
              
              {/* Floating Stat metrics on black */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] flex justify-between text-center divide-x divide-white/[0.08]">
                <div className="px-2 w-1/3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9a9a9a] mb-1">Encrypted Docs</div>
                  <div className="text-2xl font-normal text-[#ffffff] tracking-tight">5</div>
                </div>
                <div className="px-2 w-1/3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9a9a9a] mb-1">Active Rx</div>
                  <div className="text-2xl font-normal text-[#8052ff] tracking-tight">3</div>
                </div>
                <div className="px-2 w-1/3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9a9a9a] mb-1">Interactions</div>
                  <div className="text-2xl font-normal text-[#ffb829] tracking-tight">1</div>
                </div>
              </div>
            </div>

            {/* Circular Holographic Upload Hub */}
            <div className="flex items-center justify-center py-10 relative">
               <div className="absolute w-44 h-44 rounded-full bg-[#8052ff]/10 blur-[80px] pointer-events-none"></div>
               
               <motion.div 
                 whileHover={{ scale: 1.06 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex flex-col items-center cursor-pointer mr-6 z-10" 
                 onClick={() => openUploadModal('prescriptions')}
               >
                 <div className="w-12 h-12 bg-white/[0.04] border border-white/10 rounded-full text-[#ffffff] flex items-center justify-center mb-3 hover:border-[#ffb829]/50 transition-colors">
                   <Camera className="w-5 h-5 text-[#ffb829]" />
                 </div>
                 <div className="text-[10px] font-semibold uppercase tracking-widest text-[#9a9a9a] text-center">Scan<br/>Camera</div>
               </motion.div>

               <motion.div 
                 whileHover={{ scale: 1.04 }}
                 whileTap={{ scale: 0.96 }}
                 className="relative z-10 cursor-pointer group" 
                 onClick={() => openUploadModal('reports')}
               >
                 <div className="w-32 h-32 bg-[#8052ff] hover:bg-[#6c3df5] rounded-full flex flex-col items-center justify-center shadow-[0_0_35px_rgba(128,82,255,0.4)] text-white transition-all duration-300">
                    <FileText className="w-7 h-7 mb-1.5" />
                    <div className="text-xs font-semibold uppercase tracking-wider text-center leading-tight">
                      Upload<br/>Document
                    </div>
                 </div>
               </motion.div>

               <motion.div 
                 whileHover={{ scale: 1.06 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex flex-col items-center cursor-pointer ml-6 z-10" 
                 onClick={() => openUploadModal('reports')}
               >
                 <div className="w-12 h-12 bg-white/[0.04] border border-white/10 rounded-full text-[#ffffff] flex items-center justify-center mb-3 hover:border-[#8052ff]/50 transition-colors">
                   <CloudUpload className="w-5 h-5 text-[#8052ff]" />
                 </div>
                 <div className="text-[10px] font-semibold uppercase tracking-widest text-[#9a9a9a] text-center">Upload<br/>PDF</div>
               </motion.div>
            </div>

            {/* Interaction Checker Alert Card */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
               <div className="flex items-center justify-between mb-5">
                 <h3 className="font-semibold text-[#ffffff] text-xs uppercase tracking-[0.1em]">Interaction Radar</h3>
                 <span className="text-[10px] font-mono text-[#ffb829]">Active Alert</span>
               </div>
               
               <div className="p-4 rounded-2xl bg-[#ffb829]/10 border border-[#ffb829]/20 mb-5">
                 <div className="flex items-center gap-2 text-xs font-semibold text-[#ffb829] uppercase tracking-wider mb-1">
                   <AlertTriangle className="w-3.5 h-3.5" />
                   Atenolol + Antacid Timing
                 </div>
                 <div className="text-xs font-light text-[#bdbdbd] leading-relaxed">
                   Space administration by 2 hours to avoid up to 35% bioavailability loss.
                 </div>
               </div>

               <div className="space-y-2 mb-6">
                 <div className="text-[10px] font-semibold text-[#9a9a9a] uppercase tracking-widest">Active Pharmacopeia List</div>
                 <ul className="text-xs font-light text-[#ffffff] space-y-1.5">
                   <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#8052ff] mr-2.5"></span> Atenolol 25mg • Morning</li>
                   <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#8052ff] mr-2.5"></span> Paracetamol 650mg • As Needed</li>
                   <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#8052ff] mr-2.5"></span> Vitamin B Complex • Afternoon</li>
                 </ul>
               </div>

               <button 
                 onClick={() => openUploadModal('prescriptions')}
                 className="w-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 py-3 rounded-full font-semibold transition-all text-xs uppercase tracking-wider active:scale-[0.98]"
               >
                 Add Medicine to Cross-Check
               </button>
            </div>
          </div>


          {/* =========================================================
              MIDDLE COLUMN: Timeline of Deconstructed Reports
              ========================================================= */}
          <div id="timeline" className="lg:col-span-4 relative">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8052ff] mb-3">
              Diagnostic Feed
            </div>
            <h2 className="text-2xl font-normal text-[#ffffff] tracking-tight mb-8">Medical Timeline</h2>
            
            <div className="absolute left-[23px] top-24 bottom-0 w-px bg-white/[0.08]"></div>

            <div className="space-y-8 relative z-10 pl-16">
              
              {/* Timeline Item 1 */}
              <div className="relative">
                <div className="absolute -left-16 w-12 h-12 bg-[#000000] border border-white/10 text-[#ffffff] rounded-full flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[9px] font-mono text-[#9a9a9a] uppercase tracking-widest">Jun</span>
                  <span className="text-sm font-normal">15</span>
                </div>
                
                <div 
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#8052ff]/50 transition-all cursor-pointer group"
                  onClick={() => navigate('/dashboard')}
                >
                   <div className="flex items-center space-x-3 mb-2">
                     <div className="w-2 h-2 rounded-full bg-[#ffb829]"></div>
                     <div className="font-normal text-sm text-[#ffffff] group-hover:text-[#8052ff] transition-colors">CBC & Metabolic Panel</div>
                   </div>
                   <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">Extracted Insights</div>
                   <ul className="text-xs font-light text-[#bdbdbd] space-y-1">
                     <li className="flex items-center text-[#ffb829]">• Fasting Glucose: 108 mg/dL (Slightly High)</li>
                     <li className="flex items-center text-[#15846e]">• Lipid Profile: Optimal</li>
                   </ul>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative">
                <div className="absolute -left-16 w-12 h-12 bg-[#000000] border border-white/10 text-[#ffffff] rounded-full flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[9px] font-mono text-[#9a9a9a] uppercase tracking-widest">Jun</span>
                  <span className="text-sm font-normal">10</span>
                </div>
                
                <div 
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#8052ff]/50 transition-all cursor-pointer group"
                  onClick={() => navigate('/dashboard')}
                >
                   <div className="flex items-center space-x-3 mb-2">
                     <div className="w-2 h-2 rounded-full bg-[#8052ff]"></div>
                     <div className="font-normal text-sm text-[#ffffff] group-hover:text-[#8052ff] transition-colors">Cardiology Prescription</div>
                   </div>
                   <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">Prescribed Dosage</div>
                   <ul className="text-xs font-light text-[#bdbdbd] space-y-1">
                     <li>• Atenolol 25mg 1-0-0 (30 Days)</li>
                     <li>• Low sodium dietary guidance attached</li>
                   </ul>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative">
                <div className="absolute -left-16 w-12 h-12 bg-[#000000] border border-white/10 text-[#ffffff] rounded-full flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[9px] font-mono text-[#9a9a9a] uppercase tracking-widest">Jun</span>
                  <span className="text-sm font-normal">05</span>
                </div>
                
                <div 
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#8052ff]/50 transition-all cursor-pointer group"
                  onClick={() => navigate('/dashboard')}
                >
                   <div className="flex items-center space-x-3 mb-2">
                     <div className="w-2 h-2 rounded-full bg-[#15846e]"></div>
                     <div className="font-normal text-sm text-[#ffffff] group-hover:text-[#8052ff] transition-colors">Radiology Scan Assessment</div>
                   </div>
                   <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">Radiologist Notes</div>
                   <ul className="text-xs font-light text-[#15846e] space-y-1">
                     <li>• Chest X-Ray Normal / No Infiltrates</li>
                   </ul>
                </div>
              </div>

            </div>
          </div>


          {/* =========================================================
              RIGHT COLUMN: Neural AI Assistant Chat
              ========================================================= */}
          <div id="chat" className="lg:col-span-3 space-y-6">
            
            {/* Vault Encryption Info */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8052ff] mb-3">
                <Lock className="w-3.5 h-3.5" />
                Zero-Knowledge Vault
              </div>
              <p className="text-xs font-light text-[#9a9a9a] leading-relaxed">
                All uploaded documents and chat histories are processed through transient neural inference without persistence.
              </p>
            </div>

            {/* Neural Chat Assistant Terminal */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] flex flex-col h-[460px]">
              
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8052ff] animate-pulse"></span>
                  <h3 className="font-normal text-[#ffffff] text-xs uppercase tracking-widest">Neural Assistant</h3>
                </div>
                <Sparkles className="w-4 h-4 text-[#ffb829]" />
              </div>
              
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
                {messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-2xl text-xs font-light leading-relaxed ${
                      m.sender === 'ai' 
                        ? 'bg-white/[0.03] border border-white/10 text-[#ffffff] mr-4' 
                        : 'bg-[#8052ff] text-white ml-6 text-right'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
              
              {/* Input Box */}
              <form onSubmit={handleSendMessage} className="mt-2 flex items-center bg-white/[0.04] border border-white/10 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-[#8052ff] transition-colors">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your reports..." 
                  className="flex-1 text-xs outline-none bg-transparent text-[#ffffff] placeholder:text-[#9a9a9a] font-light" 
                />
                <button 
                  type="submit"
                  className="w-8 h-8 bg-[#8052ff] hover:bg-[#6c3df5] text-white rounded-full flex items-center justify-center transition-colors active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>

          </div>

        </div>
      </main>

      <Footer />

      {/* Upload Modal on Dark Void */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsUploadModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#0c0c0c] rounded-[32px] w-full max-w-2xl overflow-hidden shadow-[0_0_80px_rgba(128,82,255,0.2)] relative z-10 border border-white/10"
          >
             <div className="absolute top-6 right-6 z-10">
               <button 
                 onClick={() => setIsUploadModalOpen(false)}
                 className="w-9 h-9 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-colors active:scale-95 border border-white/10"
               >
                 <X className="w-4 h-4" />
               </button>
             </div>
             
             <div className="p-8 md:p-12">
               <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8052ff] mb-2">
                 Zero-Knowledge Ingestion
               </div>
               <h2 className="text-3xl font-normal text-[#ffffff] tracking-tight mb-2">
                 Upload {uploadType === 'reports' ? 'Clinical Lab Report' : 'Doctor Prescription'}
               </h2>
               <p className="text-sm font-light text-[#9a9a9a] mb-8">
                 Your document will be encrypted and instantly deciphered by our distributed neural intelligence engine.
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
