import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudUpload, 
  Camera, 
  AlertTriangle, 
  X, 
  Sparkles, 
  Send,
  Plus,
  Pill,
  CheckCircle2,
  Activity,
  FileSpreadsheet,
  ChevronRight,
  Volume2
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Uploader from '../components/Uploader';
import { ConstellationCanvas } from '../components/ConstellationCanvas';
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

const INITIAL_PRESCRIPTIONS: TimelineDoc[] = [
  {
    id: 'rx-1',
    date: '10',
    month: 'Jun',
    title: 'Cardiology Prescription (Dr. Sharma)',
    category: 'prescription',
    type: 'Active Therapy',
    badgeColor: '#15846e',
    insights: ['• Atenolol 25mg 1-0-0 (30 Days)', '• Low sodium dietary guidance attached'],
  },
  {
    id: 'rx-2',
    date: '28',
    month: 'May',
    title: 'General Physician Rx (Dr. Verma)',
    category: 'prescription',
    type: 'Acute Care',
    badgeColor: '#15846e',
    insights: ['• Paracetamol 650mg SOS', '• Vitamin B Complex (Once Daily)'],
  },
];

const INITIAL_LABS: TimelineDoc[] = [
  {
    id: 'lab-1',
    date: '15',
    month: 'Jun',
    title: 'Complete Blood Count & Metabolic Panel',
    category: 'lab',
    type: 'Blood Pathology',
    badgeColor: '#004fdc',
    insights: ['• Fasting Glucose: 108 mg/dL (Slightly High)', '• Lipid Profile: Optimal (LDL 94 mg/dL)', '• Hemoglobin: 13.2 g/dL (Normal)'],
  },
  {
    id: 'lab-2',
    date: '05',
    month: 'Jun',
    title: 'Radiology Scan Assessment',
    category: 'lab',
    type: 'Radiology Imaging',
    badgeColor: '#004fdc',
    insights: ['• Chest X-Ray Normal / No Infiltrates', '• Clear lung fields verified'],
  },
];

const AI_GREETINGS: Record<string, string> = {
  en: "Hello. I've decoded both your prescription regimen and your diagnostic lab records. Fasting glucose is at 108 mg/dL and Atenolol is scheduled for morning dosage. How can I assist?",
  hi: "नमस्ते। मैंने आपकी दवाओं और लैब रिपोर्ट दोनों का विश्लेषण कर लिया है। आपका ब्लड ग्लूकोज 108 mg/dL है और एटेनोलॉल सुबह के लिए निर्धारित है। मैं आपकी क्या सहायता कर सकता हूँ?",
  bn: "নমস্কার। আমি আপনার প্রেসক্রিপশন এবং ল্যাব রিপোর্ট বিশ্লেষণ করেছি। আপনার ব্লাড সুগার ১০৮ mg/dL এবং অ্যাটেনোলল সকালে নেওয়ার পরামর্শ দেওয়া হয়েছে। আমি কীভাবে সাহায্য করতে পারি?",
  ta: "வணக்கம். உங்கள் மருந்துச் சீட்டு மற்றும் ஆய்வக அறிக்கைகளை நான் ஆய்வு செய்துவிட்டேன். இரத்த சர்க்கரை 108 mg/dL உள்ளது. நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
  te: "నమస్కారం. మీ ప్రిస్క్రిప్షన్ మరియు ల్యాబ్ నివేదికలు పరిశీలించబడ్డాయి. రక్తంలో చక్కెర 108 mg/dL ఉంది. నేను మీకు ఎలా సహాయపడగలను?",
  mr: "नमस्कार. मी आपले प्रिस्क्रिप्शन आणि लॅब अहवाल तपासले आहेत. रक्तातील साखर 108 mg/dL आहे आणि अ‍ॅटेनोलॉल सकाळी घ्यायचे आहे. मी काय मदत करू शकतो?",
  gu: "નમસ્તે. મેં તમારા પ્રિસ્ક્રિપ્શન અને લેબ રિપોર્ટ તપાસ્યા છે. બ્લડ સુગર 108 mg/dL છે. હું તમને કેવી રીતે મદદ કરી શકું?",
};

const Home = () => {
  const navigate = useNavigate();
  const { currentLanguage, t, speakText } = useLanguage();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'reports' | 'prescriptions'>('reports');
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<TimelineDoc | null>(null);

  // Active section tab toggle: 'all' | 'prescriptions' | 'labs'
  const [activeTaskSection, setActiveTaskSection] = useState<'all' | 'prescriptions' | 'labs'>('all');

  // Pharmacopeia List State
  const [meds, setMeds] = useState([
    { name: 'Atenolol 25mg', timing: 'Morning', doctor: 'Dr. Sharma' },
    { name: 'Paracetamol 650mg', timing: 'As Needed', doctor: 'Dr. Verma' },
    { name: 'Vitamin B Complex', timing: 'Afternoon', doctor: 'Self' },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedTiming, setNewMedTiming] = useState('Morning');
  const [newMedDoctor, setNewMedDoctor] = useState('Prescribing Physician');

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
      
      if (currentLanguage.code === 'hi') {
        reply = `आपकी सक्रिय दवाओं (${meds.map(m => m.name).join(', ')}) के आधार पर कोई हानिकारक दुष्प्रभाव नहीं पाया गया है। कृपया एंटासिड दवा से 2 घंटे का अंतर रखें।`;
      } else if (currentLanguage.code === 'bn') {
        reply = `আপনার বর্তমান ওষুধ (${meds.map(m => m.name).join(', ')}) অনুযায়ী কোনো ক্ষতিকর প্রতিক্রিয়া নেই। অ্যান্টাসিড থেকে ২ ঘণ্টা ব্যবধানে খান।`;
      } else if (currentLanguage.code === 'ta') {
        reply = `உங்கள் மருந்துகளில் (${meds.map(m => m.name).join(', ')}) எந்தவித முரண்பாடும் இல்லை. என்டாசிட் மாத்திரையிலிருந்து 2 மணி நேரம் இடைவெளி விடவும்.`;
      } else if (currentLanguage.code === 'te') {
        reply = `మీ మందులలో (${meds.map(m => m.name).join(', ')}) ఎటువంటి సమస్యలు లేవు. యాంటాసిడ్ మందుల నుండి 2 గంటల వ్యవధి పాటించండి.`;
      } else if (currentLanguage.code === 'mr') {
        reply = `आपल्या चालू औषधांमध्ये (${meds.map(m => m.name).join(', ')}) कोणताही दुष्परिणाम आढळला नाही. अ‍ॅसिडिटीच्या गोळीपासून २ तासांचे अंतर ठेवा.`;
      } else if (currentLanguage.code === 'gu') {
        reply = `તમારી ચાલુ દવાઓમાં (${meds.map(m => m.name).join(', ')}) કોઈ આડઅસર જણાઈ નથી. એન્ટાસિડથી 2 કલાકનું અંતર રાખો.`;
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

      <main className="relative z-10 flex-grow w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-10">
        
        {/* Workspace Top Header & Section Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#15846e] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#15846e] animate-pulse"></span>
              {currentLanguage.native} • {t('distributedIntel')}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#ffffff] tracking-[-0.04em] leading-[1.06]">
              {t('vaultTitle')}
            </h1>
          </div>

          {/* Section Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] border border-white/10 rounded-full w-fit">
            <button
              onClick={() => setActiveTaskSection('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTaskSection === 'all' 
                  ? 'bg-white/15 text-white shadow-sm' 
                  : 'text-[#9a9a9a] hover:text-white'
              }`}
            >
              {t('unifiedView')}
            </button>

            <button
              onClick={() => setActiveTaskSection('prescriptions')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTaskSection === 'prescriptions' 
                  ? 'bg-[#15846e] text-white shadow-[0_0_15px_rgba(21,132,110,0.4)]' 
                  : 'text-[#9a9a9a] hover:text-white'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              {t('rxSafetyTab')}
            </button>

            <button
              onClick={() => setActiveTaskSection('labs')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTaskSection === 'labs' 
                  ? 'bg-[#004fdc] text-white shadow-[0_0_15px_rgba(0,79,220,0.4)]' 
                  : 'text-[#9a9a9a] hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              {t('labDiagTab')}
            </button>
          </div>
        </div>

        {/* Global Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9a9a9a] mb-1">{t('activeRx')}</div>
            <div className="text-3xl font-normal text-[#15846e] tracking-tight">{meds.length}</div>
            <div className="text-[11px] text-[#bdbdbd] font-light mt-1">Cross-checked safe</div>
          </div>

          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9a9a9a] mb-1">{t('labBiomarkers')}</div>
            <div className="text-3xl font-normal text-[#004fdc] tracking-tight">14</div>
            <div className="text-[11px] text-[#ffb829] font-light mt-1">1 mild elevation</div>
          </div>

          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9a9a9a] mb-1">{t('contraindicationRadar')}</div>
            <div className="text-3xl font-normal text-[#ffb829] tracking-tight">1</div>
            <div className="text-[11px] text-[#bdbdbd] font-light mt-1">{t('pharmacokineticSpacing')}</div>
          </div>

          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9a9a9a] mb-1">{t('zeroKnowledgeVault')}</div>
            <div className="text-3xl font-normal text-[#ffffff] tracking-tight">100%</div>
            <div className="text-[11px] text-[#15846e] font-light mt-1">Client Encrypted</div>
          </div>
        </div>

        {/* =========================================================
            TASK SECTION 1: PRESCRIPTIONS & DRUG SAFETY VAULT
            ========================================================= */}
        {(activeTaskSection === 'all' || activeTaskSection === 'prescriptions') && (
          <section id="section-prescriptions" className="mb-20 pt-4 scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15846e]/15 border border-[#15846e]/30 text-[#15846e] text-[11px] font-mono uppercase tracking-wider mb-2">
                  <Pill className="w-3.5 h-3.5" />
                  Task 01 — {t('rxSafetyTab')}
                </div>
                <h2 className="text-2xl sm:text-3xl font-normal text-[#ffffff] tracking-tight">
                  {t('rxSafetyTab')}
                </h2>
              </div>

              {/* Prescription Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCameraScan}
                  className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(21,132,110,0.2)]"
                >
                  <Camera className="w-4 h-4 text-[#15846e]" />
                  {t('scanRxPhoto')}
                </button>

                <button
                  onClick={() => openUploadModal('prescriptions')}
                  className="px-5 py-2.5 rounded-full bg-[#15846e] hover:bg-[#116e5c] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(21,132,110,0.4)]"
                >
                  <CloudUpload className="w-4 h-4" />
                  {t('uploadPrescription')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Active Medication List */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-5">
                  <div>
                    <h3 className="text-base font-normal text-white">{t('activeSchedule')}</h3>
                    <p className="text-xs text-[#9a9a9a] font-light">Cross-checked against contraindication databases</p>
                  </div>
                  <button
                    onClick={() => setIsAddMedModalOpen(true)}
                    className="px-3 py-1.5 rounded-full bg-[#15846e]/20 hover:bg-[#15846e]/30 text-[#15846e] text-xs font-semibold flex items-center gap-1.5 border border-[#15846e]/30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t('addRx')}
                  </button>
                </div>

                <div className="space-y-3">
                  {meds.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/15 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-[#15846e]/15 border border-[#15846e]/30 flex items-center justify-center text-[#15846e]">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-normal text-white">{m.name}</div>
                          <div className="text-[11px] text-[#9a9a9a] font-light">Source: {m.doctor}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-[#15846e]/15 border border-[#15846e]/30 text-[#15846e]">
                          {m.timing}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interaction Warning Box */}
                <div className="mt-5 p-4 rounded-2xl bg-[#ffb829]/10 border border-[#ffb829]/25 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-[#ffb829] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#ffb829] uppercase tracking-wider">{t('pharmacokineticSpacing')}</div>
                    <p className="text-xs text-[#bdbdbd] font-light mt-0.5">Space dosage by 2 hours to avoid up to 35% bioavailability loss.</p>
                  </div>
                </div>
              </div>

              {/* Prescription Documents Feed */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
                <div className="pb-4 border-b border-white/[0.06] mb-5">
                  <h3 className="text-base font-normal text-white">{t('rxTimeline')}</h3>
                  <p className="text-xs text-[#9a9a9a] font-light">Deciphered doctor records and dosage orders</p>
                </div>

                <div className="space-y-4">
                  {INITIAL_PRESCRIPTIONS.map((doc) => (
                    <div 
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#15846e]/50 transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-black border border-white/10 flex flex-col items-center justify-center text-center">
                          <span className="text-[8px] font-mono text-[#9a9a9a] uppercase">{doc.month}</span>
                          <span className="text-sm font-normal text-white">{doc.date}</span>
                        </div>
                        <div>
                          <div className="text-sm font-normal text-white group-hover:text-[#15846e] transition-colors">{doc.title}</div>
                          <div className="text-xs text-[#9a9a9a] font-light">{doc.insights[0]}</div>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-[#9a9a9a] group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* =========================================================
            TASK SECTION 2: CLINICAL LAB BIOMARKERS & DIAGNOSTICS
            ========================================================= */}
        {(activeTaskSection === 'all' || activeTaskSection === 'labs') && (
          <section id="section-diagnostics" className="mb-20 pt-4 scroll-mt-28 border-t border-white/[0.06] pt-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004fdc]/15 border border-[#004fdc]/30 text-[#004fdc] text-[11px] font-mono uppercase tracking-wider mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  Task 02 — {t('labDiagTab')}
                </div>
                <h2 className="text-2xl sm:text-3xl font-normal text-[#ffffff] tracking-tight">
                  {t('labDiagTab')}
                </h2>
              </div>

              {/* Lab Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openUploadModal('reports')}
                  className="px-5 py-2.5 rounded-full bg-[#004fdc] hover:bg-[#003eb0] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(0,79,220,0.4)]"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  {t('uploadLabReport')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Extracted Biomarker Grid */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-5">
                  <div>
                    <h3 className="text-base font-normal text-white">{t('extractedPanels')}</h3>
                    <p className="text-xs text-[#9a9a9a] font-light">Calculated against verified international reference ranges</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#004fdc] px-2.5 py-1 rounded-full bg-[#004fdc]/10 border border-[#004fdc]/20">
                    Latest CBC
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Biomarker 1 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-[10px] font-mono text-[#9a9a9a]">HEMOGLOBIN A1C</div>
                    <div className="text-xl font-normal text-white mt-1">5.4%</div>
                    <div className="text-[11px] text-[#15846e] flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Normal (&lt; 5.7%)
                    </div>
                  </div>

                  {/* Biomarker 2 */}
                  <div className="p-4 rounded-2xl bg-[#ffb829]/5 border border-[#ffb829]/20">
                    <div className="text-[10px] font-mono text-[#ffb829]">FASTING GLUCOSE</div>
                    <div className="text-xl font-normal text-white mt-1">108 mg/dL</div>
                    <div className="text-[11px] text-[#ffb829] flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" /> Slightly High (70–99)
                    </div>
                  </div>

                  {/* Biomarker 3 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-[10px] font-mono text-[#9a9a9a]">LIPID PROFILE (LDL-C)</div>
                    <div className="text-xl font-normal text-white mt-1">94 mg/dL</div>
                    <div className="text-[11px] text-[#15846e] flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Optimal (&lt; 100)
                    </div>
                  </div>

                  {/* Biomarker 4 */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-[10px] font-mono text-[#9a9a9a]">TOTAL LEUKOCYTES (WBC)</div>
                    <div className="text-xl font-normal text-white mt-1">7,200 /µL</div>
                    <div className="text-[11px] text-[#15846e] flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Normal (4.5k–11k)
                    </div>
                  </div>

                </div>
              </div>

              {/* Lab Reports Documents Timeline */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
                <div className="pb-4 border-b border-white/[0.06] mb-5">
                  <h3 className="text-base font-normal text-white">{t('diagFeed')}</h3>
                  <p className="text-xs text-[#9a9a9a] font-light">Laboratory & radiology PDF assessments</p>
                </div>

                <div className="space-y-4">
                  {INITIAL_LABS.map((doc) => (
                    <div 
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#004fdc]/50 transition-all cursor-pointer group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-black border border-white/10 flex flex-col items-center justify-center text-center">
                          <span className="text-[8px] font-mono text-[#9a9a9a] uppercase">{doc.month}</span>
                          <span className="text-sm font-normal text-white">{doc.date}</span>
                        </div>
                        <div>
                          <div className="text-sm font-normal text-white group-hover:text-[#004fdc] transition-colors">{doc.title}</div>
                          <div className="text-xs text-[#9a9a9a] font-light">{doc.insights[0]}</div>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-[#9a9a9a] group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* =========================================================
            NEURAL AI CHAT ASSISTANT TERMINAL
            ========================================================= */}
        <section id="chat" className="scroll-mt-28 border-t border-white/[0.06] pt-14 mb-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffb829]/15 border border-[#ffb829]/30 text-[#ffb829] text-[11px] font-mono uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {currentLanguage.native} • {t('aiChat')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-normal text-white">{t('askQuestionsTitle')}</h2>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] flex flex-col h-[500px] shadow-2xl">
              
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#15846e] animate-pulse"></span>
                  <h3 className="font-normal text-[#ffffff] text-xs uppercase tracking-widest">{t('aiChat')} ({currentLanguage.native})</h3>
                </div>
                <span className="text-[10px] font-mono text-[#9a9a9a]">{t('zeroKnowledgeVault')}</span>
              </div>
              
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
                {messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl text-xs font-light leading-relaxed flex items-start justify-between gap-3 ${
                      m.sender === 'ai' 
                        ? 'bg-white/[0.03] border border-white/10 text-[#ffffff] mr-8' 
                        : 'bg-[#15846e] text-white ml-8 text-right shadow-[0_0_20px_rgba(21,132,110,0.3)]'
                    }`}
                  >
                    <div>{m.text}</div>
                    {m.sender === 'ai' && (
                      <button 
                        onClick={() => speakText(m.text)}
                        className="p-1 rounded-full hover:bg-white/10 text-[#9a9a9a] hover:text-[#15846e] transition-colors shrink-0"
                        title="Listen to this response"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-[#9a9a9a] flex items-center gap-2 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15846e] animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15846e] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15846e] animate-bounce [animation-delay:0.4s]"></span>
                    <span>Synthesizing clinical response in {currentLanguage.native}...</span>
                  </div>
                )}
              </div>
              
              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="mt-2 flex items-center bg-white/[0.04] border border-white/10 rounded-full pl-5 pr-2 py-2 focus-within:border-[#15846e] transition-colors">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t('askAi')} 
                  className="flex-1 text-xs outline-none bg-transparent text-[#ffffff] placeholder:text-[#9a9a9a] font-light" 
                />
                <button 
                  type="submit"
                  className="w-9 h-9 bg-[#15846e] hover:bg-[#116e5c] text-white rounded-full flex items-center justify-center transition-colors active:scale-95 shrink-0 shadow-[0_0_15px_rgba(21,132,110,0.4)]"
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
                   {t('zeroKnowledgeVault')}
                 </div>
                 <h2 className="text-3xl font-normal text-[#ffffff] tracking-tight mb-2">
                   {uploadType === 'reports' ? t('uploadLabReport') : t('uploadPrescription')}
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

      {/* Modal: Add Medicine to Pharmacopeia */}
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
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#15846e]">Task 01 Action</div>
                  <h3 className="text-xl font-normal text-white">{t('addRx')}</h3>
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">Prescribing Doctor / Source</label>
                  <input 
                    type="text" 
                    value={newMedDoctor}
                    onChange={(e) => setNewMedDoctor(e.target.value)}
                    placeholder="e.g. Dr. Verma (Endocrinologist)"
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

      {/* Modal: Document Detail Inspection */}
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
                  <div className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${selectedDoc.category === 'prescription' ? 'text-[#15846e]' : 'text-[#004fdc]'}`}>
                    {selectedDoc.category === 'prescription' ? 'Task 01 — Prescription Record' : 'Task 02 — Diagnostic Record'}
                  </div>
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
                      const typeToUpload = selectedDoc.category === 'prescription' ? 'prescriptions' : 'reports';
                      setSelectedDoc(null);
                      openUploadModal(typeToUpload);
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
