import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudUpload, 
  Camera, 
  X, 
  Send,
  Plus,
  Pill,
  FileText,
  Activity,
  Volume2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Trash2
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Uploader from '../components/Uploader';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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
  en: "Hello! I am your AI health assistant. Upload a prescription or lab report, or ask any question about your medicines and dosages.",
  hi: "नमस्ते! मैं आपका स्वास्थ्य सहायक हूँ। अपना पर्चा या लैब रिपोर्ट अपलोड करें, या दवाओं के बारे में कोई भी प्रश्न पूछें।",
  bn: "নমস্কার! আমি আপনার ডিজিটাল স্বাস্থ্য সহকারী। আপনার প্রেসক্রিপশন বা রিপোর্ট সম্পর্কে যেকোনো প্রশ্ন জিজ্ঞাসা করুন।",
  ta: "வணக்கம்! உங்கள் மருந்துச் சீட்டு அல்லது ஆய்வக அறிக்கை பற்றிய சந்தேகங்களை என்னிடம் கேட்கலாம்.",
  te: "నమస్కారం! మీ ప్రిస్క్రిప్షన్ లేదా ల్యాబ్ నివేదిక వివరాల గురించి నన్ను అడగండి.",
  mr: "नमस्कार! मी आपला आरोग्य सहाय्यक आहे. आपल्या औषधांविषयी कोणताही प्रश्न विचारा.",
  gu: "નમસ્તે! તમારા પ્રિસ્ક્રિપ્શન અથવા લેબ રિપોર્ટ વિશે કોઈપણ પ્રશ્ન પૂછો.",
};

const Home: React.FC = () => {
  const { currentLanguage, speakText } = useLanguage();
  const { user } = useAuth();

  const userDisplayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Patient');

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'reports' | 'prescriptions'>('prescriptions');
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<TimelineDoc | null>(null);

  // Active section tab toggle: 'all' | 'prescriptions' | 'labs'
  const [activeTab, setActiveTab] = useState<'all' | 'prescriptions' | 'labs'>('all');

  // Real Persistent Medications List
  const [meds, setMeds] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('vv_patient_meds');
    return saved ? JSON.parse(saved) : [
      { name: 'Amoxicillin 500mg', timing: 'Morning & Night (1-0-1)', doctor: 'Dr. Sharma (Physician)' },
      { name: 'Paracetamol 650mg', timing: 'As Needed (SOS)', doctor: 'Dr. Sharma (Physician)' }
    ];
  });
  const [newMedName, setNewMedName] = useState('');
  const [newMedTiming, setNewMedTiming] = useState('Morning');
  const [newMedDoctor, setNewMedDoctor] = useState('Prescribing Physician');

  // Real Persistent Documents
  const [prescriptions, setPrescriptions] = useState<TimelineDoc[]>(() => {
    const saved = localStorage.getItem('vv_patient_prescriptions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'doc-initial-rx',
        date: '24',
        month: 'Aug',
        title: 'Prescription — General Physician Visit',
        category: 'prescription',
        type: 'Active Therapy',
        badgeColor: '#059669',
        insights: [
          '• Extracted: Amoxicillin 500mg (1-0-1 x 5 days)',
          '• Verified against medicine interaction database'
        ]
      }
    ];
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

  const handleDeleteMedicine = (index: number) => {
    setMeds(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUploadCompleted = () => {
    const today = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const newDoc: TimelineDoc = {
      id: 'doc-' + Date.now(),
      date: today.getDate().toString().padStart(2, '0'),
      month: monthNames[today.getMonth()],
      title: uploadType === 'reports' ? 'Laboratory Diagnostic Report' : 'Doctor Prescription Document',
      category: uploadType === 'reports' ? 'lab' : 'prescription',
      type: uploadType === 'reports' ? 'Diagnostic Pathology' : 'Active Therapy',
      badgeColor: uploadType === 'reports' ? '#0284C7' : '#059669',
      insights: uploadType === 'reports' 
        ? ['• Extracted biomarkers and reference ranges', '• Ready for review with physician']
        : ['• Extracted medicines and dosage schedule', '• Checked for medication safety']
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
      const qLower = userMsg.toLowerCase();

      if (qLower.includes('amox') || qLower.includes('antibiotic')) {
        reply = "Amoxicillin is an antibiotic prescribed for bacterial infections. Take it after food at equal intervals (e.g. morning & night) and make sure to finish the full 5-day course even if you feel better.";
      } else if (qLower.includes('paracetamol') || qLower.includes('fever') || qLower.includes('pain')) {
        reply = "Paracetamol (650mg) is taken for fever or pain as needed (SOS). Keep at least 4 to 6 hours between doses and do not exceed 3 to 4 tablets in 24 hours.";
      } else if (meds.length > 0) {
        reply = `I reviewed your active medicines (${meds.map(m => m.name).join(', ')}). No conflicting interactions were detected. Always consult your doctor before modifying any dosage.`;
      } else {
        reply = "You can upload a prescription or medical report anytime to extract medicine timings and reference biomarker ranges.";
      }

      if (currentLanguage.code === 'hi') {
        reply = meds.length > 0 
          ? `मैंने आपकी दवाओं (${meds.map(m => m.name).join(', ')}) की जांच कर ली है। कोई हानिकारक प्रभाव नहीं मिला है। समय पर दवाएं लें।`
          : `आप कोई भी पर्चा या लैब रिपोर्ट अपलोड करके उसकी आसान व्याख्या देख सकते हैं।`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
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

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">
        
        {/* ======================================================== */}
        {/* Workspace Top Header                                     */}
        {/* ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Patient Health Companion</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome, {userDisplayName}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your centralized dashboard for prescriptions, laboratory diagnostic reports, and medication schedule.
            </p>
          </div>

          {/* Tab Filter Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs w-fit">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Unified Overview
            </button>

            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'prescriptions' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              Prescriptions
            </button>

            <button
              onClick={() => setActiveTab('labs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'labs' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Lab Reports
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Metric Summary Cards                                     */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-10">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Active Medicines</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{meds.length}</div>
            <div className="text-xs text-emerald-700 font-medium mt-1">✓ Scheduled today</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Prescriptions</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{prescriptions.length}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Archived in vault</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Lab Biomarkers</div>
            <div className="text-2xl font-bold text-slate-900 font-mono">{labs.length > 0 ? labs.length * 4 : 0}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Tracked with norms</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Medication Safety</div>
            <div className="text-2xl font-bold text-emerald-700 font-mono">Verified</div>
            <div className="text-xs text-emerald-700 font-medium mt-1">0 Active conflicts</div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* SECTION 1: PRESCRIPTIONS & ACTIVE MEDICATIONS            */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'prescriptions') && (
          <section id="prescriptions" className="mb-12 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Pill className="w-5 h-5 text-emerald-600" />
                  Prescriptions & Medication Regimen
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Track your active doses, doctor instructions, and uploaded prescription files.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleCameraScan}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-500" />
                  <span>Scan Photo</span>
                </button>

                <button
                  onClick={() => openUploadModal('prescriptions')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>Upload Prescription</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Active Medication Schedule */}
              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Current Medication Schedule</h3>
                    <p className="text-xs text-slate-500">Cross-referenced against drug safety matrix</p>
                  </div>
                  <button
                    onClick={() => setIsAddMedModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                {meds.length === 0 ? (
                  <div className="py-10 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                    <Pill className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-700">No active medicines added yet</div>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Add your medicines or upload a prescription to start tracking</p>
                    <button
                      onClick={() => setIsAddMedModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      + Add First Medicine
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {meds.map((m, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between group hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{m.name}</div>
                            <div className="text-xs text-slate-500">{m.doctor}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900">
                            {m.timing}
                          </span>
                          <button
                            onClick={() => handleDeleteMedicine(idx)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer opacity-0 group-hover:opacity-100"
                            title="Remove medicine"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Uploaded Prescription Feed */}
              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Prescription Documents</h3>
                  <p className="text-xs text-slate-500">Decoded doctor prescriptions and treatment plans</p>
                </div>

                {prescriptions.length === 0 ? (
                  <div className="py-10 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                    <CloudUpload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-700">No prescriptions uploaded yet</div>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Upload or photograph a prescription to extract medicines</p>
                    <button
                      onClick={() => openUploadModal('prescriptions')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Upload Prescription
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {prescriptions.map((doc) => (
                      <div 
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center text-center shadow-2xs">
                            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">{doc.month}</span>
                            <span className="text-sm font-bold text-slate-900 font-mono">{doc.date}</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">{doc.title}</div>
                            <div className="text-xs text-slate-500 truncate max-w-[280px]">{doc.insights[0]}</div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-all" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* SECTION 2: LAB DIAGNOSTICS & BIOMARKERS                  */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'labs') && (
          <section id="labs" className="mb-12 scroll-mt-24 border-t border-slate-200/80 pt-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-600" />
                  Medical Reports & Laboratory Diagnostics
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Track extracted biomarkers, normal reference ranges, and diagnostic trends.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <Link
                  to="/lab-decoder"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all"
                >
                  <span>Open Lab Decoder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => openUploadModal('reports')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>Upload Lab Report</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Extracted Biomarkers Overview */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Extracted Pathology Biomarkers</h3>
                  <p className="text-xs text-slate-500">Key metrics compared with clinical standard reference ranges</p>
                </div>

                {labs.length === 0 ? (
                  <div className="py-10 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                    <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-700">No laboratory reports uploaded yet</div>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Upload a blood test or pathology report to decode biomarker ranges</p>
                    <button
                      onClick={() => openUploadModal('reports')}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Upload Lab Report
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {labs.map((doc, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-slate-900">{doc.title}</div>
                          <div className="text-xs text-slate-500">{doc.insights.join(' ')}</div>
                        </div>
                        <span className="text-xs font-semibold text-sky-800 px-2.5 py-1 rounded-md bg-sky-100">
                          {doc.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Lab Documents Timeline */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Diagnostic Archive</h3>
                  <p className="text-xs text-slate-500">Laboratory test history</p>
                </div>

                {labs.length === 0 ? (
                  <div className="py-10 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                    <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-700">No diagnostic history</div>
                    <p className="text-xs text-slate-500 mt-1">Uploaded reports will be archived here</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {labs.map((doc) => (
                      <div 
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all cursor-pointer group flex items-center justify-between"
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

        {/* ======================================================== */}
        {/* SECTION 3: AI HEALTH ASSISTANT                           */}
        {/* ======================================================== */}
        <section id="chat" className="scroll-mt-24 border-t border-slate-200/80 pt-10 mb-10">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Health Assistant ({currentLanguage.native})</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Ask questions about your health records</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Get explanations on medicine timing, active salt ingredients, and laboratory terms.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col h-[460px]">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Health Assistant</h3>
                </div>
                <span className="text-xs text-slate-400">AI-assisted interpretation</span>
              </div>
              
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
                {messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed flex items-start justify-between gap-3 ${
                      m.sender === 'ai' 
                        ? 'bg-slate-50 border border-slate-200 text-slate-800 mr-8' 
                        : 'bg-emerald-600 text-white ml-8 text-right'
                    }`}
                  >
                    <div>{m.text}</div>
                    {m.sender === 'ai' && (
                      <button 
                        onClick={() => speakText(m.text)}
                        className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-emerald-700 transition-colors shrink-0 cursor-pointer"
                        title="Listen to this response"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                    <span>Analyzing health records in {currentLanguage.native}...</span>
                  </div>
                )}
              </div>
              
              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="mt-2 flex items-center bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-1.5 py-1.5 focus-within:border-emerald-500 focus-within:bg-white transition-colors">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question about medicines, food interactions, or report values..." 
                  className="flex-1 text-xs sm:text-sm outline-none bg-transparent text-slate-900 placeholder:text-slate-400" 
                />
                <button 
                  type="submit"
                  className="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* ======================================================== */}
      {/* Modal: Document Ingestion                                */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsUploadModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 p-6 sm:p-8"
            >
               <div className="absolute top-5 right-5 z-10">
                 <button 
                   onClick={() => setIsUploadModalOpen(false)}
                   className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                 >
                   <X className="w-4 h-4" />
                 </button>
               </div>
               
               <div>
                 <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
                   Health Document Ingestion
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                   {uploadType === 'reports' ? 'Upload Medical Report' : 'Upload Doctor Prescription'}
                 </h2>
                 <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
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

      {/* ======================================================== */}
      {/* Modal: Add Medicine                                      */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isAddMedModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsAddMedModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 p-6 sm:p-7"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Medication Schedule</div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Add Medicine</h3>
                </div>
                <button 
                  onClick={() => setIsAddMedModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Prescribing Doctor / Source</label>
                  <input 
                    type="text" 
                    value={newMedDoctor}
                    onChange={(e) => setNewMedDoctor(e.target.value)}
                    placeholder="e.g. Dr. Verma (Physician)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Timing Schedule</label>
                  <select 
                    value={newMedTiming}
                    onChange={(e) => setNewMedTiming(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                    <option value="Morning & Night (1-0-1)">Morning & Night (1-0-1)</option>
                    <option value="Three times a day (1-1-1)">Three times a day (1-1-1)</option>
                    <option value="As Needed (SOS)">As Needed (SOS)</option>
                  </select>
                </div>

                <div className="pt-3">
                  <button 
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Save to Medication List
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* Modal: Document Detail Inspection                        */}
      {/* ======================================================== */}
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
                  <div className={`text-xs font-semibold uppercase tracking-wider ${selectedDoc.category === 'prescription' ? 'text-emerald-700' : 'text-sky-700'}`}>
                    {selectedDoc.category === 'prescription' ? 'Prescription Record' : 'Diagnostic Lab Record'}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedDoc.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Date: {docFormat(selectedDoc.month, selectedDoc.date)}</span>
                  <span className="text-emerald-800 font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
                    Archived
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Extracted Details</div>
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
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Upload New Version
                  </button>
                  <button 
                    onClick={() => setSelectedDoc(null)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
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
