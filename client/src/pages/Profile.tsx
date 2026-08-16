import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  Heart, 
  AlertCircle, 
  Phone, 
  Users, 
  Edit3, 
  Check, 
  Plus, 
  Download, 
  Lock, 
  ArrowLeft,
  Activity,
  FileCheck,
  X
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ConstellationCanvas } from '../components/ConstellationCanvas';


interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  bloodGroup: string;
  active: boolean;
}

const INITIAL_FAMILY: FamilyMember[] = [
  { id: '1', name: 'Sam Gupta', relation: 'Self (Primary)', age: 28, bloodGroup: 'O+ Positive', active: true },
  { id: '2', name: 'Rajesh Gupta', relation: 'Father', age: 62, bloodGroup: 'B+ Positive', active: false },
  { id: '3', name: 'Sunita Gupta', relation: 'Mother', age: 58, bloodGroup: 'O+ Positive', active: false },
];

const Profile = () => {
  const navigate = useNavigate();

  // Active profile state
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY);
  const activeMember = familyMembers.find(f => f.active) || familyMembers[0];

  // Editable vitals state
  const [isEditingVitals, setIsEditingVitals] = useState(false);
  const [vitals, setVitals] = useState({
    name: 'Sam Gupta',
    age: '28',
    gender: 'Male',
    bloodGroup: 'O+ Positive',
    height: '178 cm',
    weight: '72 kg',
    bmi: '22.7 (Normal)',
    bp: '120/80 mmHg',
    sugar: '108 mg/dL',
  });

  // Emergency SOS state
  const [sosContacts, setSosContacts] = useState([
    { id: 'c1', name: 'Dr. Sharma (Cardiologist)', phone: '+91 98765 43210', relation: 'Primary Physician' },
    { id: 'c2', name: 'Emergency Hospital Hotline', phone: '108 / 102', relation: 'Emergency Medical Service' },
  ]);
  const [newSosName, setNewSosName] = useState('');
  const [newSosPhone, setNewSosPhone] = useState('');
  const [isAddingSos, setIsAddingSos] = useState(false);

  // Allergies & Chronic Conditions
  const [allergies, setAllergies] = useState(['Penicillin (Mild Rash)', 'Peanuts (Anaphylaxis Risk)']);
  const [chronicConditions, setChronicConditions] = useState(['Hypertension (Stage 1)', 'Mild Prediabetes Monitoring']);
  const [newTagInput, setNewTagInput] = useState('');
  const [tagType, setTagType] = useState<'allergy' | 'condition'>('allergy');
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Key export notification
  const [keyExported, setKeyExported] = useState(false);

  const switchProfile = (id: string) => {
    setFamilyMembers(prev => prev.map(m => ({ ...m, active: m.id === id })));
    const target = familyMembers.find(m => m.id === id);
    if (target) {
      setVitals(prev => ({
        ...prev,
        name: target.name,
        age: target.age.toString(),
        bloodGroup: target.bloodGroup
      }));
    }
  };

  const handleAddSos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSosName.trim() || !newSosPhone.trim()) return;
    setSosContacts(prev => [...prev, {
      id: Date.now().toString(),
      name: newSosName.trim(),
      phone: newSosPhone.trim(),
      relation: 'Emergency Contact'
    }]);
    setNewSosName('');
    setNewSosPhone('');
    setIsAddingSos(false);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    if (tagType === 'allergy') {
      setAllergies(prev => [...prev, newTagInput.trim()]);
    } else {
      setChronicConditions(prev => [...prev, newTagInput.trim()]);
    }
    setNewTagInput('');
    setIsTagModalOpen(false);
  };

  const handleExportKey = () => {
    const keyData = {
      vaultId: "vv-zk-8f92a3",
      patient: activeMember.name,
      encryption: "AES-256-GCM / Zero-Knowledge",
      exportedAt: new Date().toISOString(),
      publicKeyFingerprint: "0x89A3...F42C",
    };
    const blob = new Blob([JSON.stringify(keyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaidyavaani-health-vault-key-${activeMember.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    setKeyExported(true);
    setTimeout(() => setKeyExported(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] font-sans overflow-x-hidden flex flex-col selection:bg-[#15846e] selection:text-[#ffffff] relative">
      <Navbar />

      {/* Ambient background dust */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <ConstellationCanvas variant="ambient" particleCount={60} interactive={false} />
      </div>

      <main className="relative z-10 flex-grow w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-10">
        
        {/* Top Breadcrumb / Action */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
          <button 
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workspace</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#15846e]/15 border border-[#15846e]/30 text-[#15846e] text-[11px] font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Clinical Identity</span>
          </div>
        </div>

        {/* =========================================================
            HEADER & FAMILY / PROFILE SWITCHER
            ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#15846e]/40 to-[#004fdc]/40 border-2 border-[#15846e] flex items-center justify-center text-white shadow-[0_0_30px_rgba(21,132,110,0.35)] relative">
              <User className="w-10 h-10 text-white" />
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#15846e] border-2 border-black flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#15846e] mb-1">
                {activeMember.relation}
              </div>
              <h1 className="text-3xl sm:text-4xl font-normal text-white tracking-tight">
                {activeMember.name}
              </h1>
              <p className="text-xs font-light text-[#9a9a9a] mt-1">
                Age: {activeMember.age} • Blood Group: <span className="text-white font-medium">{activeMember.bloodGroup}</span>
              </p>
            </div>
          </div>

          {/* Family Profiles Switcher Pills */}
          <div className="p-2 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center gap-2 w-fit">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#9a9a9a] px-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#ffb829]" />
              Profiles:
            </div>
            {familyMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => switchProfile(member.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  member.active 
                    ? 'bg-[#15846e] text-white shadow-[0_0_15px_rgba(21,132,110,0.4)]' 
                    : 'bg-white/[0.04] text-[#9a9a9a] hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <span>{member.name}</span>
                <span className="text-[9px] opacity-75 font-light">({member.relation})</span>
              </button>
            ))}
          </div>

        </div>

        {/* =========================================================
            GRID SECTION: VITALS, ALLERGIES & EMERGENCY SOS
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Card 1: Patient Vitals & Biological Parameters */}
          <div className="lg:col-span-7 p-7 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#15846e]">Biological Telemetry</div>
                <h2 className="text-xl font-normal text-white">Patient Vitals & Biometrics</h2>
              </div>
              <button
                onClick={() => setIsEditingVitals(!isEditingVitals)}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider text-white border border-white/10 flex items-center gap-1.5 transition-colors"
              >
                {isEditingVitals ? <Check className="w-3.5 h-3.5 text-[#15846e]" /> : <Edit3 className="w-3.5 h-3.5" />}
                {isEditingVitals ? 'Save' : 'Edit'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-[#9a9a9a]">BLOOD GROUP</div>
                {isEditingVitals ? (
                  <input 
                    type="text" 
                    value={vitals.bloodGroup} 
                    onChange={(e) => setVitals({...vitals, bloodGroup: e.target.value})}
                    className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-sm text-white mt-1" 
                  />
                ) : (
                  <div className="text-base font-normal text-white mt-1 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-400" /> {vitals.bloodGroup}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-[#9a9a9a]">HEIGHT / WEIGHT</div>
                {isEditingVitals ? (
                  <div className="flex gap-1 mt-1">
                    <input 
                      type="text" 
                      value={vitals.height} 
                      onChange={(e) => setVitals({...vitals, height: e.target.value})}
                      className="w-1/2 bg-black/40 border border-white/20 rounded px-1 text-xs text-white" 
                    />
                    <input 
                      type="text" 
                      value={vitals.weight} 
                      onChange={(e) => setVitals({...vitals, weight: e.target.value})}
                      className="w-1/2 bg-black/40 border border-white/20 rounded px-1 text-xs text-white" 
                    />
                  </div>
                ) : (
                  <div className="text-base font-normal text-white mt-1">
                    {vitals.height} • {vitals.weight}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-[#9a9a9a]">BODY MASS INDEX (BMI)</div>
                <div className="text-base font-normal text-[#15846e] mt-1">{vitals.bmi}</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-[#9a9a9a]">BLOOD PRESSURE</div>
                {isEditingVitals ? (
                  <input 
                    type="text" 
                    value={vitals.bp} 
                    onChange={(e) => setVitals({...vitals, bp: e.target.value})}
                    className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-sm text-white mt-1" 
                  />
                ) : (
                  <div className="text-base font-normal text-white mt-1">{vitals.bp}</div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-[#9a9a9a]">FASTING SUGAR</div>
                <div className="text-base font-normal text-[#ffb829] mt-1">{vitals.sugar}</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-[#9a9a9a]">PRIMARY DOCTOR</div>
                <div className="text-base font-normal text-white mt-1">Dr. Sharma</div>
              </div>

            </div>
          </div>

          {/* Card 2: Emergency SOS Contacts */}
          <div className="lg:col-span-5 p-7 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Rapid Response</div>
                <h2 className="text-xl font-normal text-white">Emergency SOS Contacts</h2>
              </div>
              <button
                onClick={() => setIsAddingSos(true)}
                className="px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold uppercase tracking-wider text-red-400 border border-red-500/30 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add SOS
              </button>
            </div>

            <div className="space-y-3.5">
              {sosContacts.map((contact) => (
                <div key={contact.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-normal text-white">{contact.name}</div>
                      <div className="text-[11px] text-[#9a9a9a] font-light">{contact.relation}</div>
                    </div>
                  </div>

                  <a 
                    href={`tel:${contact.phone}`} 
                    className="px-3.5 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-mono font-semibold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  >
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>

            {/* Quick SOS Trigger Box */}
            <div className="mt-6 p-4 rounded-2xl bg-red-950/20 border border-red-500/25 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
                <div className="text-xs text-red-200 font-light">Emergency clinical medical card available on lock screen</div>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================
            CHRONIC CONDITIONS, ALLERGIES & VAULT KEY EXPORT
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Allergies & Chronic Conditions */}
          <div className="lg:col-span-8 p-7 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb829]">Pharmacopeia Guard</div>
                <h2 className="text-xl font-normal text-white">Allergies & Chronic Health Conditions</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTagType('allergy');
                    setIsTagModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#ffb829]/15 hover:bg-[#ffb829]/25 text-[#ffb829] text-xs font-semibold flex items-center gap-1 border border-[#ffb829]/30"
                >
                  <Plus className="w-3.5 h-3.5" /> Allergy
                </button>
                <button
                  onClick={() => {
                    setTagType('condition');
                    setIsTagModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#15846e]/15 hover:bg-[#15846e]/25 text-[#15846e] text-xs font-semibold flex items-center gap-1 border border-[#15846e]/30"
                >
                  <Plus className="w-3.5 h-3.5" /> Condition
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-mono uppercase text-[#9a9a9a] mb-2.5">Known Drug & Food Allergies:</div>
                <div className="flex flex-wrap gap-2.5">
                  {allergies.map((allergy, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-300 text-xs font-light flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono uppercase text-[#9a9a9a] mb-2.5">Chronic Medical Conditions:</div>
                <div className="flex flex-wrap gap-2.5">
                  {chronicConditions.map((cond, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-full bg-[#15846e]/15 border border-[#15846e]/30 text-[#15846e] text-xs font-light flex items-center gap-2">
                      <Activity className="w-3 h-3 text-[#15846e]" />
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Zero-Knowledge Vault Keys & Export */}
          <div className="lg:col-span-4 p-7 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#004fdc] mb-2">
                <Lock className="w-3.5 h-3.5" />
                Security Vault
              </div>
              <h2 className="text-xl font-normal text-white mb-2">Zero-Knowledge Key Export</h2>
              <p className="text-xs text-[#9a9a9a] font-light leading-relaxed mb-6">
                Your medical identity is cryptographically anchored. Download your portable JSON key to decrypt records on external hospital systems or offline devices.
              </p>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-[10px] text-[#bdbdbd] space-y-1 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#9a9a9a]">VAULT ID:</span>
                  <span className="text-white">vv-zk-8f92a3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9a9a9a]">CIPHER:</span>
                  <span className="text-[#15846e]">AES-256-GCM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9a9a9a]">STATUS:</span>
                  <span className="text-[#004fdc]">Protected</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportKey}
              className="w-full py-3.5 rounded-full bg-[#004fdc] hover:bg-[#003eb0] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,79,220,0.35)] active:scale-95"
            >
              {keyExported ? <FileCheck className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
              {keyExported ? 'Vault Key Downloaded!' : 'Export Encrypted Key'}
            </button>
          </div>

        </div>

      </main>

      <Footer />

      {/* Modal: Add SOS Contact */}
      <AnimatePresence>
        {isAddingSos && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsAddingSos(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0c0c0c] rounded-[32px] w-full max-w-md overflow-hidden shadow-[0_0_80px_rgba(239,68,68,0.25)] relative z-10 border border-white/10 p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-6">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400">Emergency SOS</div>
                  <h3 className="text-xl font-normal text-white">Add Emergency Contact</h3>
                </div>
                <button 
                  onClick={() => setIsAddingSos(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSos} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">Doctor / Contact Name</label>
                  <input 
                    type="text" 
                    required
                    value={newSosName}
                    onChange={(e) => setNewSosName(e.target.value)}
                    placeholder="e.g. Dr. Verma (Physician)"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">Emergency Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={newSosPhone}
                    onChange={(e) => setNewSosPhone(e.target.value)}
                    placeholder="e.g. +91 98123 45678"
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-xs uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  >
                    Save SOS Contact
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Add Allergy or Condition */}
      <AnimatePresence>
        {isTagModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsTagModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0c0c0c] rounded-[32px] w-full max-w-md overflow-hidden shadow-[0_0_80px_rgba(255,184,41,0.25)] relative z-10 border border-white/10 p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-6">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffb829]">
                    {tagType === 'allergy' ? 'Drug / Food Allergy' : 'Chronic Health Condition'}
                  </div>
                  <h3 className="text-xl font-normal text-white">
                    Add {tagType === 'allergy' ? 'Allergy Tag' : 'Medical Condition'}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsTagModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddTag} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-2">Description</label>
                  <input 
                    type="text" 
                    required
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder={tagType === 'allergy' ? 'e.g. Aspirin (Asthma flare)' : 'e.g. Type 2 Diabetes'}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-[#ffb829]"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-[#ffb829] hover:bg-[#e5a524] text-black rounded-full font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(255,184,41,0.4)]"
                  >
                    Save Tag to Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Profile;
