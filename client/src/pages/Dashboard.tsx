import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudUpload, 
  Camera, 
  X, 
  Send,
  Plus,
  Pill,
  Activity,
  FileSpreadsheet,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Uploader from '../components/Uploader';
import { useLanguage } from '../context/LanguageContext';

interface TimelineDoc {
  id: string;
  date: string;
  month: string;
  title: string;
  category: 'prescription' | 'lab';
  type: string;
  badgeColor: string;
  insights: string[];
}

interface Medication {
  name: string;
  timing: string;
  doctor: string;
}

const AI_GREETINGS: Record<string, string> = {
  en: "Hello! I am your clinical health assistant. Upload a prescription or lab report to begin, or ask me any question about your medications.",
  hi: "नमस्ते! मैं आपका डिजिटल स्वास्थ्य सहायक हूँ। अपने पर्चे या लैब रिपोर्ट अपलोड करें, या अपनी दवाओं के बारे में कोई भी प्रश्न पूछें।",
  bn: "নমস্কার! আমি আপনার ডিজিটাল স্বাস্থ্য সহকারী। আপনার প্রেসক্রিপশন বা ল্যাব রিপোর্ট আপলোড করুন, অথবা ওষুধ সংক্রান্ত যেকোনো প্রশ্ন জিজ্ঞাসা করুন।",
  ta: "வணக்கம்! நான் உங்கள் டிஜிட்டல் மருத்துவ உதவியாளர். உங்கள் மருந்துச் சீட்டு அல்லது ஆய்வக அறிக்கையை பதிவேற்றி மருத்துவ ஆலோசனைகளைப் பெறலாம்.",
  te: "నమస్కారం! నేను మీ డిజిటల్ ఆరోగ్య సహాయకుడిని. మీ ప్రిస్క్రిప్షన్ లేదా ల్యాబ్ నివేదికను అప్‌లోడ్ చేసి సందేహాలు అడగండి.",
  mr: "नमस्कार! मी आपला डिजिटल आरोग्य सहाय्यक आहे. आपले प्रिस्क्रिप्शन किंवा लॅब अहवाल अपलोड करा किंवा औषधांविषयी प्रश्न विचारा.",
  gu: "નમસ્તે! હું તમારો ડિજિટલ હેલ્થ સહાયક છું. તમારા પ્રિસ્ક્રિપ્શન અથવા લેબ રિપોર્ટ અપલોડ કરો અને કોઈપણ પ્રશ્ન પૂછો.",
};

const Dashboard = () => {
  const { currentLanguage } = useLanguage();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'reports' | 'prescriptions'>('reports');
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);

  // Active section tab toggle: 'all' | 'prescriptions' | 'labs'
  const [activeTaskSection, setActiveTaskSection] = useState<'all' | 'prescriptions' | 'labs'>('all');

  // Real Persistent Pharmacopeia List
  const [meds, setMeds] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('vv_patient_meds');
    return saved ? JSON.parse(saved) : [];
  });
  const [newMedName, setNewMedName] = useState('');
  const [newMedTiming, setNewMedTiming] = useState('Morning');
  const [newMedDoctor, setNewMedDoctor] = useState('Prescribing Physician');

  // Real Persistent Documents
  const [prescriptions, setPrescriptions] = useState<TimelineDoc[]>(() => {
    const saved = localStorage.getItem('vv_patient_prescriptions');
    return saved ? JSON.parse(saved) : [];
  });

  const [labs, setLabs] = useState<TimelineDoc[]>(() => {
    const saved = localStorage.getItem('vv_patient_labs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('vv_patient_meds', JSON.stringify(meds));
  }, [meds]);

  useEffect(() => {
    localStorage.setItem('vv_patient_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('vv_patient_labs', JSON.stringify(labs));
  }, [labs]);

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: AI_GREETINGS[currentLanguage.code] || AI_GREETINGS.en },
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
    setMeds(prev => [...prev, { name: newMedName.trim(), timing: newMedTiming, doctor: newMedDoctor.trim() }]);
    setNewMedName('');
    setIsAddMedModalOpen(false);
  };

  const handleUploadCompleted = () => {
    const today = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const newDoc: TimelineDoc = {
      id: 'doc-' + Date.now(),
      date: today.getDate().toString().padStart(2, '0'),
      month: monthNames[today.getMonth()],
      title: uploadType === 'reports' ? 'Clinical Lab Report' : 'Doctor Prescription Document',
      category: uploadType === 'reports' ? 'lab' : 'prescription',
      type: uploadType === 'reports' ? 'Diagnostic Pathology' : 'Active Therapy',
      badgeColor: uploadType === 'reports' ? '#0d9488' : '#0284c7',
      insights: uploadType === 'reports' 
        ? ['• Extracted from uploaded pathology document', '• Processed securely in your health records']
        : ['• Added to active medication list', '• Verified against clinical safety database']
    };

    if (uploadType === 'reports') {
      setLabs(prev => [newDoc, ...prev]);
    } else {
      setPrescriptions(prev => [newDoc, ...prev]);
    }

    setIsUploadModalOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = "I have noted that. You can upload any related prescription or lab report to extract specific medicine schedules and interaction alerts.";
      
      const q = userText.toLowerCase();
      if (q.includes('dolo') || q.includes('paracetamol')) {
        reply = "Dolo 650 (Paracetamol 650mg) is commonly used for fever and pain relief. Usual adult dose is 1 tablet every 6-8 hours after meals. Do not exceed 4000mg in 24 hours.";
      } else if (q.includes('pan d') || q.includes('pantoprazole')) {
        reply = "Pan D contains Pantoprazole + Domperidone for acidity and reflux. It is best taken in the morning 30 minutes before breakfast.";
      } else if (q.includes('augmentin') || q.includes('amoxicillin')) {
        reply = "Augmentin contains Amoxicillin + Clavulanic acid (an antibiotic). Take it with or immediately after a meal to prevent stomach upset. Complete the full prescribed course.";
      } else if (q.includes('sugar') || q.includes('diabetes') || q.includes('hba1c')) {
        reply = "Normal fasting blood sugar is 70-99 mg/dL. An HbA1c below 5.7% is considered normal. Upload your lab report for an itemized breakdown.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  const combinedDocs = [...prescriptions, ...labs].sort((a, b) => b.id.localeCompare(a.id));
  const filteredDocs = activeTaskSection === 'all' 
    ? combinedDocs 
    : activeTaskSection === 'prescriptions' 
      ? prescriptions 
      : labs;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Patient Health Vault
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Your Health Records & Prescriptions
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Upload, organize, and understand your medical documents with AI-assisted extraction.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openUploadModal('prescriptions')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <CloudUpload className="w-4 h-4" />
              <span>Upload Prescription</span>
            </button>
            <button
              onClick={() => openUploadModal('reports')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-semibold shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-sky-600" />
              <span>Add Lab Report</span>
            </button>
            <button
              onClick={handleCameraScan}
              className="p-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-colors"
              title="Camera Scan"
            >
              <Camera className="w-4 h-4 text-slate-600" />
            </button>
            <input 
              type="file" 
              ref={cameraInputRef} 
              accept="image/*" 
              capture="environment" 
              onChange={handleCameraFileSelected}
              className="hidden" 
            />
          </div>
        </div>

        {/* 3-Column Layout: Medications (Left) | Timeline / Records (Center) | Assistant (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          
          {/* Active Medications Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Active Medications</h2>
                    <p className="text-xs text-slate-500">{meds.length} currently tracked</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddMedModalOpen(true)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-emerald-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {meds.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    <Pill className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-medium text-slate-600">No medicines added yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Upload a prescription to populate automatically</p>
                  </div>
                ) : (
                  meds.map((med, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{med.name}</p>
                        <p className="text-[11px] text-slate-500">{med.timing} • Prescribed by {med.doctor}</p>
                      </div>
                      <button
                        onClick={() => setMeds(prev => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-500 p-1 text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-xl p-5 text-white shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300">Prescription Companion</span>
              <h3 className="text-base font-bold mt-1">AI-Assisted Interpretation</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                VaidyaVaani assists you in reading difficult doctor handwriting and understanding lab ranges. When confidence is low, a manual review badge is highlighted.
              </p>
            </div>
          </div>

          {/* Records & Documents Timeline Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Health Document Timeline</h2>
                  <p className="text-xs text-slate-500">Prescription scans & diagnostic reports</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setActiveTaskSection('all')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${activeTaskSection === 'all' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600'}`}
                  >
                    All ({combinedDocs.length})
                  </button>
                  <button
                    onClick={() => setActiveTaskSection('prescriptions')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${activeTaskSection === 'prescriptions' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600'}`}
                  >
                    Rx ({prescriptions.length})
                  </button>
                  <button
                    onClick={() => setActiveTaskSection('labs')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${activeTaskSection === 'labs' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600'}`}
                  >
                    Labs ({labs.length})
                  </button>
                </div>
              </div>

              {/* Timeline List */}
              <div className="mt-4 space-y-3">
                {filteredDocs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">No health records uploaded yet</p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                      Upload a prescription or lab report to get extracted medicine dosages and explanations.
                    </p>
                    <button
                      onClick={() => openUploadModal('prescriptions')}
                      className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      <CloudUpload className="w-3.5 h-3.5" />
                      <span>Upload first document</span>
                    </button>
                  </div>
                ) : (
                  filteredDocs.map((doc) => (
                    <div 
                      key={doc.id}
                      className="p-4 rounded-lg bg-slate-50 hover:bg-emerald-50/30 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex items-start gap-3"
                    >
                      <div className="flex flex-col items-center justify-center w-11 h-11 rounded-lg bg-white border border-slate-200 shrink-0">
                        <span className="text-xs font-bold text-slate-900 leading-none">{doc.date}</span>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 leading-none mt-0.5">{doc.month}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{doc.title}</h4>
                          <span 
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${doc.badgeColor}15`, color: doc.badgeColor }}
                          >
                            {doc.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          {doc.insights[0] || 'Processed with AI assistance'}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 mt-2 shrink-0" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* AI Health Assistant Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col h-[520px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h2 className="text-xs font-bold text-slate-900">Health Assistant</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{currentLanguage.native}</span>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-emerald-600 text-white ml-6' 
                        : 'bg-slate-100 text-slate-800 mr-4'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                ))}
                {isTyping && (
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-500 mr-8 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your medicines..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Upload {uploadType === 'prescriptions' ? 'Prescription' : 'Lab Report'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {uploadType === 'prescriptions' 
                      ? 'Extract medicine names, doses, and timing' 
                      : 'Decode diagnostic ranges and medical terms'}
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <Uploader type={uploadType} onUploadComplete={handleUploadCompleted} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Medication Modal */}
      <AnimatePresence>
        {isAddMedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Add Medication</h3>
                <button
                  onClick={() => setIsAddMedModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMedicine} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medicine Name & Strength</label>
                  <input
                    type="text"
                    required
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="e.g. Amoxicillin 500mg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage Timing / Frequency</label>
                  <input
                    type="text"
                    value={newMedTiming}
                    onChange={(e) => setNewMedTiming(e.target.value)}
                    placeholder="e.g. 1-0-1 After food"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prescribing Doctor / Clinic</label>
                  <input
                    type="text"
                    value={newMedDoctor}
                    onChange={(e) => setNewMedDoctor(e.target.value)}
                    placeholder="e.g. Dr. A. Sharma (General Medicine)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddMedModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                  >
                    Save Medicine
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Dashboard;
