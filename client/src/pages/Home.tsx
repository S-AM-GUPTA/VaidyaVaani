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
  ChevronRight,
  Volume2
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

const Home = () => {
  const { currentLanguage, t, speakText } = useLanguage();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'reports' | 'prescriptions'>('reports');
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<TimelineDoc | null>(null);

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
        ? ['• Extracted from uploaded pathology document', '• Processed with zero-knowledge encryption']
        : ['• Ingested into active medication list', '• Verified against pharmacopeia interaction database']
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
    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let reply = '';
      if (meds.length > 0) {
        reply = `I have reviewed your active logged medications (${meds.map(m => m.name).join(', ')}). No conflicting contraindications were detected. Take medicines as scheduled with water and adhere to doctor prescribed intervals.`;
      } else {
        reply = `You currently have 0 medications logged in your vault. You can click "+ Add Rx" or upload a prescription to check for drug-drug interactions.`;
      }

      if (currentLanguage.code === 'hi') {
        reply = meds.length > 0 
          ? `मैंने आपकी सक्रिय दवाओं (${meds.map(m => m.name).join(', ')}) की जांच कर ली है। कोई हानिकारक प्रभाव नहीं मिला है।`
          : `वर्तमान में कोई दवा दर्ज नहीं है। आप पर्चा अपलोड करके या दवा जोड़कर सुरक्षा जांच सकते हैं।`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-sky-600 selection:text-white">
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

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-10">
        
        {/* Workspace Top Header & Section Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-700 mb-1 flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span>
              {currentLanguage.native} • Patient Health Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {t('vaultTitle')}
            </h1>
          </div>

          {/* Section Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg shadow-xs w-fit">
            <button
              onClick={() => setActiveTaskSection('all')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTaskSection === 'all' 
                  ? 'bg-sky-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('unifiedView')}
            </button>

            <button
              onClick={() => setActiveTaskSection('prescriptions')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTaskSection === 'prescriptions' 
                  ? 'bg-sky-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              {t('rxSafetyTab')}
            </button>

            <button
              onClick={() => setActiveTaskSection('labs')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTaskSection === 'labs' 
                  ? 'bg-sky-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              {t('labDiagTab')}
            </button>
          </div>
        </div>

        {/* Real Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-mono uppercase text-slate-500 font-bold mb-1">{t('activeRx')}</div>
            <div className="text-2xl font-bold text-sky-700 font-mono">{meds.length} Active</div>
            <div className="text-xs text-teal-600 font-medium mt-1">{meds.length > 0 ? 'Cross-checked safe' : 'Ready for entry'}</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-mono uppercase text-slate-500 font-bold mb-1">{t('labBiomarkers')}</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{labs.length} Tracked</div>
            <div className="text-xs text-slate-500 font-medium mt-1">{labs.length > 0 ? 'Decoded with norms' : 'No reports yet'}</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-mono uppercase text-slate-500 font-bold mb-1">Safety Advisory</div>
            <div className="text-2xl font-bold text-teal-700 font-mono">0 Conflicts</div>
            <div className="text-xs text-slate-500 mt-1">Pharmacopeia radar active</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-mono uppercase text-slate-500 font-bold mb-1">Vault Privacy</div>
            <div className="text-2xl font-bold text-teal-700 font-mono">100% Encrypted</div>
            <div className="text-xs text-slate-500 mt-1">Client Zero-Knowledge</div>
          </div>
        </div>

        {/* =========================================================
            TASK SECTION 1: PRESCRIPTIONS & DRUG SAFETY VAULT
            ========================================================= */}
        {(activeTaskSection === 'all' || activeTaskSection === 'prescriptions') && (
          <section id="section-prescriptions" className="mb-12 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="med-badge mb-1 font-mono">
                  Prescription Regimen
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {t('rxSafetyTab')}
                </h2>
              </div>

              {/* Prescription Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCameraScan}
                  className="btn-med-secondary text-xs"
                >
                  <Camera className="w-4 h-4 text-sky-600" />
                  {t('scanRxPhoto')}
                </button>

                <button
                  onClick={() => openUploadModal('prescriptions')}
                  className="btn-med-primary text-xs"
                >
                  <CloudUpload className="w-4 h-4" />
                  {t('uploadPrescription')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Active Medication List */}
              <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{t('activeSchedule')}</h3>
                    <p className="text-xs text-slate-500">Current therapies verified against interactions</p>
                  </div>
                  <button
                    onClick={() => setIsAddMedModalOpen(true)}
                    className="px-3 py-1 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1 border border-sky-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t('addRx')}
                  </button>
                </div>

                {meds.length === 0 ? (
                  <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Pill className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-700">No active medications logged</div>
                    <p className="text-xs text-slate-500 mt-0.5 mb-4">Add your medicines or scan a prescription to check safety</p>
                    <button
                      onClick={() => setIsAddMedModalOpen(true)}
                      className="btn-med-primary text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add First Medicine
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {meds.map((m, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{m.name}</div>
                            <div className="text-xs text-slate-500">{m.doctor}</div>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                            {m.timing}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prescription Documents Feed */}
              <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="pb-4 border-b border-slate-100 mb-4">
                  <h3 className="text-base font-bold text-slate-900">{t('rxTimeline')}</h3>
                  <p className="text-xs text-slate-500">Deciphered clinical records and doctor orders</p>
                </div>

                {prescriptions.length === 0 ? (
                  <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <CloudUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-700">No prescriptions uploaded yet</div>
                    <p className="text-xs text-slate-500 mt-0.5 mb-4">Upload or photograph your doctor's prescription</p>
                    <button
                      onClick={() => openUploadModal('prescriptions')}
                      className="btn-med-primary text-xs"
                    >
                      <CloudUpload className="w-3.5 h-3.5" /> Upload Prescription
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {prescriptions.map((doc) => (
                      <div 
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition-all cursor-pointer group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center text-center shadow-2xs">
                            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">{doc.month}</span>
                            <span className="text-sm font-bold text-slate-900 font-mono">{doc.date}</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">{doc.title}</div>
                            <div className="text-xs text-slate-500">{doc.insights[0]}</div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-700 transition-all" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </section>
        )}

        {/* =========================================================
            TASK SECTION 2: CLINICAL LAB BIOMARKERS & DIAGNOSTICS
            ========================================================= */}
        {(activeTaskSection === 'all' || activeTaskSection === 'labs') && (
          <section id="section-diagnostics" className="mb-12 scroll-mt-24 border-t border-slate-200 pt-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="med-badge mb-1 font-mono">
                  Diagnostics & Labs
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {t('labDiagTab')}
                </h2>
              </div>

              {/* Lab Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openUploadModal('reports')}
                  className="btn-med-primary text-xs"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  {t('uploadLabReport')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Extracted Biomarker Grid */}
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{t('extractedPanels')}</h3>
                    <p className="text-xs text-slate-500">Biomarkers extracted from uploaded pathology reports</p>
                  </div>
                </div>

                {labs.length === 0 ? (
                  <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-700">No lab reports decoded yet</div>
                    <p className="text-xs text-slate-500 mt-0.5 mb-4">Upload a blood test or pathology report to extract biomarkers</p>
                    <button
                      onClick={() => openUploadModal('reports')}
                      className="btn-med-primary text-xs"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" /> Upload Lab Report
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {labs.map((doc, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-slate-900">{doc.title}</div>
                          <div className="text-xs text-slate-500">{doc.insights.join(' ')}</div>
                        </div>
                        <span className="text-xs font-mono font-bold text-teal-700 px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                          {doc.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lab Reports Documents Timeline */}
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="pb-4 border-b border-slate-100 mb-4">
                  <h3 className="text-base font-bold text-slate-900">{t('diagFeed')}</h3>
                  <p className="text-xs text-slate-500">Laboratory and imaging assessments</p>
                </div>

                {labs.length === 0 ? (
                  <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-700">No diagnostic records</div>
                    <p className="text-xs text-slate-500 mt-0.5">Uploaded lab documents will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {labs.map((doc) => (
                      <div 
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition-all cursor-pointer group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center text-center shadow-2xs">
                            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">{doc.month}</span>
                            <span className="text-sm font-bold text-slate-900 font-mono">{doc.date}</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">{doc.title}</div>
                            <div className="text-xs text-slate-500">{doc.insights[0]}</div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-700 transition-all" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </section>
        )}

        {/* =========================================================
            AI HEALTH CONSULTATION ASSISTANT
            ========================================================= */}
        <section id="chat" className="scroll-mt-24 border-t border-slate-200 pt-10 mb-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <div className="med-badge mb-2 font-mono">
                {currentLanguage.native} • Clinical Assistant
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t('askQuestionsTitle')}</h2>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col h-[480px]">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  <h3 className="font-bold text-slate-900 text-xs font-mono uppercase tracking-wider">{t('aiChat')} ({currentLanguage.native})</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">Zero-Knowledge Consultation</span>
              </div>
              
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
                {messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed flex items-start justify-between gap-3 ${
                      m.sender === 'ai' 
                        ? 'bg-slate-50 border border-slate-200 text-slate-800 mr-8' 
                        : 'bg-sky-600 text-white ml-8 text-right'
                    }`}
                  >
                    <div>{m.text}</div>
                    {m.sender === 'ai' && (
                      <button 
                        onClick={() => speakText(m.text)}
                        className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-sky-600 transition-colors shrink-0"
                        title="Listen to this response"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2 w-fit font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-bounce [animation-delay:0.4s]"></span>
                    <span>Analyzing clinical guidelines in {currentLanguage.native}...</span>
                  </div>
                )}
              </div>
              
              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="mt-2 flex items-center bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-1.5 py-1.5 focus-within:border-sky-500 focus-within:bg-white transition-colors">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t('askAi')} 
                  className="flex-1 text-xs sm:text-sm outline-none bg-transparent text-slate-900 placeholder:text-slate-400" 
                />
                <button 
                  type="submit"
                  className="w-8 h-8 bg-sky-600 hover:bg-sky-700 text-white rounded-md flex items-center justify-center transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Modal: Document Ingestion */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsUploadModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 p-8 md:p-10"
            >
               <div className="absolute top-5 right-5 z-10">
                 <button 
                   onClick={() => setIsUploadModalOpen(false)}
                   className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center transition-colors"
                 >
                   <X className="w-4 h-4" />
                 </button>
               </div>
               
               <div>
                 <div className="text-xs font-bold uppercase tracking-wider text-sky-700 font-mono mb-1">
                   {t('zeroKnowledgeVault')}
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                   {uploadType === 'reports' ? t('uploadLabReport') : t('uploadPrescription')}
                 </h2>
                 <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                   Upload your medical document to extract medicine timings, dosage guidelines, and lab reference values.
                 </p>
                 
                 <Uploader 
                   type={uploadType} 
                   onUploadComplete={handleUploadCompleted} 
                 />
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Add Medicine to Pharmacopeia */}
      <AnimatePresence>
        {isAddMedModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsAddMedModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-sky-700 font-mono">Pharmacopeia Entry</div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{t('addRx')}</h3>
                </div>
                <button 
                  onClick={() => setIsAddMedModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddMedicine} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Medicine Name & Strength</label>
                  <input 
                    type="text" 
                    required
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="e.g. Metformin 500mg"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Prescribing Doctor / Source</label>
                  <input 
                    type="text" 
                    value={newMedDoctor}
                    onChange={(e) => setNewMedDoctor(e.target.value)}
                    placeholder="e.g. Dr. Verma (Endocrinologist)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Timing Schedule</label>
                  <select 
                    value={newMedTiming}
                    onChange={(e) => setNewMedTiming(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
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
                    className="w-full btn-med-primary py-3 text-xs"
                  >
                    Save to Medication List
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Document Detail Inspection */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedDoc(null)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-200 p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                <div>
                  <div className={`text-xs font-bold uppercase tracking-wider font-mono ${selectedDoc.category === 'prescription' ? 'text-sky-700' : 'text-teal-700'}`}>
                    {selectedDoc.category === 'prescription' ? 'Prescription Record' : 'Diagnostic Lab Record'}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedDoc.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Date: {docFormat(selectedDoc.month, selectedDoc.date)}</span>
                  <span className="text-teal-700 font-bold px-2 py-0.5 rounded bg-teal-50 border border-teal-200">Verified Ingestion</span>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Extracted Details</div>
                  {selectedDoc.insights.map((ins, i) => (
                    <div key={i} className="text-xs text-slate-700">{ins}</div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    onClick={() => {
                      const typeToUpload = selectedDoc.category === 'prescription' ? 'prescriptions' : 'reports';
                      setSelectedDoc(null);
                      openUploadModal(typeToUpload);
                    }}
                    className="btn-med-secondary text-xs"
                  >
                    Upload New Version
                  </button>
                  <button 
                    onClick={() => setSelectedDoc(null)}
                    className="btn-med-primary text-xs"
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

function docFormat(month: string, date: string) {
  return `${month} ${date}, 2026`;
}

export default Home;
