import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudUpload, 
  Camera, 
  FileText, 
  AlertTriangle, 
  X, 
  Lock, 
  Sparkles, 
  Send,
  Plus,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Uploader from '../components/Uploader';
import { ConstellationCanvas } from '../components/ConstellationCanvas';

interface TimelineDoc {
  id: string;
  date: string;
  month: string;
  title: string;
  type: string;
  badgeColor: string;
  insights: string[];
}

const INITIAL_TIMELINE: TimelineDoc[] = [
  {
    id: 'doc-1',
    date: '15',
    month: 'Jun',
    title: 'CBC & Metabolic Panel',
    type: 'Diagnostic Report',
    badgeColor: '#15846e',
    insights: ['• Fasting Glucose: 108 mg/dL (Slightly High)', '• Lipid Profile: Optimal (LDL 94 mg/dL)'],
  },
  {
    id: 'doc-2',
    date: '10',
    month: 'Jun',
    title: 'Cardiology Prescription',
    type: 'Prescription',
    badgeColor: '#15846e',
    insights: ['• Atenolol 25mg 1-0-0 (30 Days)', '• Low sodium dietary guidance attached'],
  },
  {
    id: 'doc-3',
    date: '05',
    month: 'Jun',
    title: 'Radiology Scan Assessment',
    type: 'Radiology',
    badgeColor: '#15846e',
    insights: ['• Chest X-Ray Normal / No Infiltrates', '• Clear lung fields verified'],
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'reports' | 'prescriptions'>('reports');
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<TimelineDoc | null>(null);

  // Pharmacopeia List State
  const [meds, setMeds] = useState([
    { name: 'Atenolol 25mg', timing: 'Morning' },
    { name: 'Paracetamol 650mg', timing: 'As Needed' },
    { name: 'Vitamin B Complex', timing: 'Afternoon' },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedTiming, setNewMedTiming] = useState('Morning');

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello. I've decoded your latest CBC and prescription records. Your blood glucose is slightly elevated at 108 mg/dL. How can I assist with your regimen today?" },
  ]);

  const cameraInputRef = useRef<HTMLInputElement>(null);

  const openUploadModal = (type: 'reports' | 'prescriptions') => {
    setUploadType(type);
    setIsUploadModalOpen(true);
  };

  const handleCameraScan = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleCameraFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      openUploadModal('prescriptions');
    }
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    setMeds(prev => [...prev, { name: newMedName.trim(), timing: newMedTiming }]);
    setNewMedName('');
    setIsAddMedModalOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = `Based on your active medications (${meds.map(m => m.name).join(', ')}), no adverse pharmacokinetic antagonism was identified. Maintain regular blood pressure monitoring and schedule dosage at least 2 hours apart from antacids.`;
      
      if (userMsg.toLowerCase().includes('glucose') || userMsg.toLowerCase().includes('sugar')) {
        reply = "Your fasting glucose was measured at 108 mg/dL (Reference: 70–99 mg/dL). This is mildly elevated. Consider monitoring carbohydrate intake and discussing an HbA1c test with your doctor.";
      } else if (userMsg.toLowerCase().includes('atenolol') || userMsg.toLowerCase().includes('heart')) {
        reply = "Atenolol is a beta-blocker prescribed for cardiovascular control. Take consistently in the morning with water. Do not stop abruptly without medical consultation.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] font-sans overflow-x-hidden flex flex-col selection:bg-[#15846e] selection:text-[#ffffff] relative">
      <Navbar />

      {/* Hidden camera file input */}
      <input 
        type="file" 
        ref={cameraInputRef} 
        accept="image/*" 
        capture="environment" 
        className="hidden"
        onChange={handleCameraFileSelected}
      />

      {/* Subtle ambient verdant particle dust */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25">
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
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#15846e] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#15846e] animate-pulse"></span>
                Workspace Telemetry
              </div>
              <h1 className="text-3xl sm:text-4xl font-normal text-[#ffffff] tracking-[-0.04em] leading-[1.08] mb-6">
                Clinical Intelligence Vault
              </h1>
              
              {/* Floating Stat metrics */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] flex justify-between text-center divide-x divide-white/[0.08]">
                <div className="px-2 w-1/3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9a9a9a] mb-1">Encrypted Docs</div>
                  <div className="text-2xl font-normal text-[#ffffff] tracking-tight">{INITIAL_TIMELINE.length}</div>
                </div>
                <div className="px-2 w-1/3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9a9a9a] mb-1">Active Rx</div>
                  <div className="text-2xl font-normal text-[#15846e] tracking-tight">{meds.length}</div>
                </div>
                <div className="px-2 w-1/3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9a9a9a] mb-1">Interactions</div>
                  <div className="text-2xl font-normal text-[#ffb829] tracking-tight">1</div>
                </div>
              </div>
            </div>

            {/* Circular Holographic Upload Hub in Verdant Green */}
            <div className="flex items-center justify-center py-10 relative">
               <div className="absolute w-52 h-52 rounded-full bg-[#15846e]/20 blur-[90px] pointer-events-none"></div>
               
               {/* 1. Camera Scan Button */}
               <motion.div 
                 whileHover={{ scale: 1.06 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex flex-col items-center cursor-pointer mr-6 z-10" 
                 onClick={handleCameraScan}
               >
                 <div className="w-12 h-12 bg-white/[0.04] border border-white/10 rounded-full text-[#ffffff] flex items-center justify-center mb-3 hover:border-[#15846e]/60 transition-colors shadow-[0_0_15px_rgba(21,132,110,0.2)]">
                   <Camera className="w-5 h-5 text-[#15846e]" />
                 </div>
                 <div className="text-[10px] font-semibold uppercase tracking-widest text-[#9a9a9a] text-center">Scan<br/>Camera</div>
               </motion.div>

               {/* 2. Main Upload Button */}
               <motion.div 
                 whileHover={{ scale: 1.04 }}
                 whileTap={{ scale: 0.96 }}
                 className="relative z-10 cursor-pointer group" 
                 onClick={() => openUploadModal('reports')}
               >
                 <div className="w-32 h-32 bg-[#15846e] hover:bg-[#116e5c] rounded-full flex flex-col items-center justify-center shadow-[0_0_35px_rgba(21,132,110,0.45)] text-white transition-all duration-300 border border-[#15846e]/50">
                    <FileText className="w-7 h-7 mb-1.5" />
                    <div className="text-xs font-semibold uppercase tracking-wider text-center leading-tight">
                      Upload<br/>Document
                    </div>
                 </div>
               </motion.div>

               {/* 3. PDF Upload Button */}
               <motion.div 
                 whileHover={{ scale: 1.06 }}
                 whileTap={{ scale: 0.95 }}
                 className="flex flex-col items-center cursor-pointer ml-6 z-10" 
                 onClick={() => openUploadModal('reports')}
               >
                 <div className="w-12 h-12 bg-white/[0.04] border border-white/10 rounded-full text-[#ffffff] flex items-center justify-center mb-3 hover:border-[#15846e]/60 transition-colors shadow-[0_0_15px_rgba(21,132,110,0.2)]">
                   <CloudUpload className="w-5 h-5 text-[#15846e]" />
                 </div>
                 <div className="text-[10px] font-semibold uppercase tracking-widest text-[#9a9a9a] text-center">Upload<br/>PDF</div>
               </motion.div>
            </div>

            {/* Interaction Checker Alert Card */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
               <div className="flex items-center justify-between mb-5">
                 <h3 className="font-semibold text-[#ffffff] text-xs uppercase tracking-[0.1em]">Interaction Radar</h3>
                 <span className="text-[10px] font-mono text-[#15846e] px-2 py-0.5 rounded-full bg-[#15846e]/15 border border-[#15846e]/30">Active System</span>
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
                 <div className="flex justify-between items-center text-[10px] font-semibold text-[#9a9a9a] uppercase tracking-widest">
                   <span>Active Pharmacopeia List</span>
                   <span className="text-[#15846e]">{meds.length} Meds</span>
                 </div>
                 <ul className="text-xs font-light text-[#ffffff] space-y-1.5 max-h-40 overflow-y-auto">
                   {meds.map((m, idx) => (
                     <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                       <span className="flex items-center">
                         <span className="w-1.5 h-1.5 rounded-full bg-[#15846e] mr-2.5"></span> 
                         {m.name}
                       </span>
                       <span className="text-[10px] text-[#9a9a9a] font-mono">{m.timing}</span>
                     </li>
                   ))}
                 </ul>
               </div>

               {/* Button: Add Medicine */}
               <button 
                 onClick={() => setIsAddMedModalOpen(true)}
                 className="w-full bg-[#15846e]/15 hover:bg-[#15846e]/25 text-[#15846e] border border-[#15846e]/30 py-3 rounded-full font-semibold transition-all text-xs uppercase tracking-wider active:scale-[0.98] flex items-center justify-center gap-2"
               >
                 <Plus className="w-3.5 h-3.5" />
                 Add Medicine to Cross-Check
               </button>
            </div>
          </div>


          {/* =========================================================
              MIDDLE COLUMN: Timeline of Deconstructed Reports
              ========================================================= */}
          <div id="timeline" className="lg:col-span-4 relative">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#15846e] mb-3">
              Diagnostic Feed
            </div>
            <h2 className="text-2xl font-normal text-[#ffffff] tracking-tight mb-8">Medical Timeline</h2>
            
            <div className="absolute left-[23px] top-24 bottom-0 w-px bg-white/[0.08]"></div>

            <div className="space-y-8 relative z-10 pl-16">
              
              {INITIAL_TIMELINE.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-16 w-12 h-12 bg-[#000000] border border-white/10 text-[#ffffff] rounded-full flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[9px] font-mono text-[#9a9a9a] uppercase tracking-widest">{item.month}</span>
                    <span className="text-sm font-normal">{item.date}</span>
                  </div>
                  
                  <div 
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#15846e]/50 transition-all cursor-pointer group hover:bg-white/[0.04]"
                    onClick={() => setSelectedDoc(item)}
                  >
                     <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center space-x-3">
                         <div className="w-2 h-2 rounded-full bg-[#15846e]"></div>
                         <div className="font-normal text-sm text-[#ffffff] group-hover:text-[#15846e] transition-colors">{item.title}</div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-[#9a9a9a] group-hover:text-white group-hover:translate-x-1 transition-all" />
                     </div>
                     <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">{item.type}</div>
                     <ul className="text-xs font-light text-[#bdbdbd] space-y-1">
                       {item.insights.map((ins, i) => (
                         <li key={i}>{ins}</li>
                       ))}
                     </ul>
                  </div>
                </div>
              ))}

            </div>
          </div>


          {/* =========================================================
              RIGHT COLUMN: Neural AI Assistant Chat
              ========================================================= */}
          <div id="chat" className="lg:col-span-3 space-y-6">
            
            {/* Vault Encryption Info */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#15846e] mb-3">
                <Lock className="w-3.5 h-3.5 text-[#15846e]" />
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
                  <span className="w-2 h-2 rounded-full bg-[#15846e] animate-pulse"></span>
                  <h3 className="font-normal text-[#ffffff] text-xs uppercase tracking-widest">Neural Assistant</h3>
                </div>
                <Sparkles className="w-4 h-4 text-[#15846e]" />
              </div>
              
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
                {messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-2xl text-xs font-light leading-relaxed ${
                      m.sender === 'ai' 
                        ? 'bg-white/[0.03] border border-white/10 text-[#ffffff] mr-4' 
                        : 'bg-[#15846e] text-white ml-6 text-right shadow-[0_0_20px_rgba(21,132,110,0.3)]'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
                {isTyping && (
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-[#9a9a9a] flex items-center gap-2 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15846e] animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15846e] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15846e] animate-bounce [animation-delay:0.4s]"></span>
                    <span>Analyzing clinical context...</span>
                  </div>
                )}
              </div>
              
              {/* Input Box */}
              <form onSubmit={handleSendMessage} className="mt-2 flex items-center bg-white/[0.04] border border-white/10 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-[#15846e] transition-colors">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your reports..." 
                  className="flex-1 text-xs outline-none bg-transparent text-[#ffffff] placeholder:text-[#9a9a9a] font-light" 
                />
                <button 
                  type="submit"
                  className="w-8 h-8 bg-[#15846e] hover:bg-[#116e5c] text-white rounded-full flex items-center justify-center transition-colors active:scale-95 shrink-0 shadow-[0_0_15px_rgba(21,132,110,0.4)]"
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
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsUploadModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0c0c0c] rounded-[32px] w-full max-w-2xl overflow-hidden shadow-[0_0_80px_rgba(21,132,110,0.25)] relative z-10 border border-white/10"
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
                 <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#15846e] mb-2">
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
      </AnimatePresence>

      {/* Modal: Add Medicine */}
      <AnimatePresence>
        {isAddMedModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsAddMedModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0c0c0c] rounded-[32px] w-full max-w-md overflow-hidden shadow-[0_0_80px_rgba(21,132,110,0.25)] relative z-10 border border-white/10 p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-6">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#15846e]">Pharmacopeia</div>
                  <h3 className="text-xl font-normal text-white">Add Medication</h3>
                </div>
                <button 
                  onClick={() => setIsAddMedModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddMedicine} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">Medicine Name & Strength</label>
                  <input 
                    type="text" 
                    required
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="e.g. Metformin 500mg"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-[#15846e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">Timing Schedule</label>
                  <select 
                    value={newMedTiming}
                    onChange={(e) => setNewMedTiming(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111115] border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-[#15846e]"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="As Needed">As Needed</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-[#15846e] hover:bg-[#116e5c] text-white rounded-full font-semibold text-xs uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(21,132,110,0.4)]"
                  >
                    Cross-Check & Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Document Details View */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setSelectedDoc(null)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0c0c0c] rounded-[32px] w-full max-w-lg overflow-hidden shadow-[0_0_80px_rgba(21,132,110,0.25)] relative z-10 border border-white/10 p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-6">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#15846e]">Deconstructed Record</div>
                  <h3 className="text-xl font-normal text-white">{selectedDoc.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#9a9a9a]">
                  <span>Date: {selectedDoc.month} {selectedDoc.date}, 2026</span>
                  <span className="text-[#15846e] px-2.5 py-0.5 rounded-full bg-[#15846e]/15 border border-[#15846e]/30">Verified Ingestion</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="text-xs font-semibold text-white uppercase tracking-wider">Extracted Clinical Data</div>
                  {selectedDoc.insights.map((ins, i) => (
                    <div key={i} className="text-xs font-light text-[#bdbdbd]">{ins}</div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => {
                      setSelectedDoc(null);
                      openUploadModal('reports');
                    }}
                    className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider text-white border border-white/10"
                  >
                    Upload Update
                  </button>
                  <button 
                    onClick={() => setSelectedDoc(null)}
                    className="px-6 py-2.5 rounded-full bg-[#15846e] hover:bg-[#116e5c] text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
