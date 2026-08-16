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
  X,
  UserPlus
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ConstellationCanvas } from '../components/ConstellationCanvas';

interface MemberData {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
  bloodGroup: string;
  height: string;
  weight: string;
  bmi: string;
  bp: string;
  sugar: string;
  primaryDoctor: string;
  allergies: string[];
  chronicConditions: string[];
  active: boolean;
}

const INITIAL_PROFILES: MemberData[] = [
  {
    id: '1',
    name: 'Sam Gupta',
    relation: 'Self (Primary)',
    age: 28,
    gender: 'Male',
    bloodGroup: 'O+ Positive',
    height: '178 cm',
    weight: '72 kg',
    bmi: '22.7 (Normal)',
    bp: '120/80 mmHg',
    sugar: '108 mg/dL',
    primaryDoctor: 'Dr. Sharma (Cardiologist)',
    allergies: ['Penicillin (Mild Rash)', 'Peanuts (Anaphylaxis Risk)'],
    chronicConditions: ['Mild Prediabetes Monitoring'],
    active: true,
  },
  {
    id: '2',
    name: 'Rajesh Gupta',
    relation: 'Father',
    age: 62,
    gender: 'Male',
    bloodGroup: 'B+ Positive',
    height: '172 cm',
    weight: '78 kg',
    bmi: '26.4 (Overweight)',
    bp: '135/88 mmHg',
    sugar: '142 mg/dL',
    primaryDoctor: 'Dr. Verma (Endocrinologist)',
    allergies: ['Sulfa Antibiotics'],
    chronicConditions: ['Hypertension (Stage 1)', 'Type 2 Diabetes'],
    active: false,
  },
  {
    id: '3',
    name: 'Sunita Gupta',
    relation: 'Mother',
    age: 58,
    gender: 'Female',
    bloodGroup: 'O+ Positive',
    height: '160 cm',
    weight: '64 kg',
    bmi: '25.0 (Borderline)',
    bp: '124/82 mmHg',
    sugar: '112 mg/dL',
    primaryDoctor: 'Dr. Anita Roy (General Physician)',
    allergies: ['Aspirin (Gastric irritation)'],
    chronicConditions: ['Osteoarthritis (Knee)'],
    active: false,
  },
];

const Profile = () => {
  const navigate = useNavigate();

  // Multi-Patient / Family Profiles
  const [profiles, setProfiles] = useState<MemberData[]>(INITIAL_PROFILES);
  const activeProfile = profiles.find(p => p.active) || profiles[0];

  // Editable vitals toggle
  const [isEditingVitals, setIsEditingVitals] = useState(false);

  // Add Family Member Modal State
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('Spouse');
  const [newMemberAge, setNewMemberAge] = useState('30');
  const [newMemberGender, setNewMemberGender] = useState('Female');
  const [newMemberBlood, setNewMemberBlood] = useState('O+ Positive');

  // Emergency SOS state
  const [sosContacts, setSosContacts] = useState([
    { id: 'c1', name: 'Dr. Sharma (Cardiologist)', phone: '+91 98765 43210', relation: 'Primary Physician' },
    { id: 'c2', name: 'Emergency Hospital Hotline', phone: '108 / 102', relation: 'Emergency Medical Service' },
  ]);
  const [newSosName, setNewSosName] = useState('');
  const [newSosPhone, setNewSosPhone] = useState('');
  const [isAddingSos, setIsAddingSos] = useState(false);

  // Tag Manager Modal State
  const [newTagInput, setNewTagInput] = useState('');
  const [tagType, setTagType] = useState<'allergy' | 'condition'>('allergy');
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Key export notification
  const [keyExported, setKeyExported] = useState(false);

  // Switch Active Patient
  const handleSwitchProfile = (id: string) => {
    setIsEditingVitals(false);
    setProfiles(prev => prev.map(p => ({ ...p, active: p.id === id })));
  };

  // Add New Family Member
  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newId = Date.now().toString();
    const newMember: MemberData = {
      id: newId,
      name: newMemberName.trim(),
      relation: newMemberRelation,
      age: parseInt(newMemberAge) || 30,
      gender: newMemberGender,
      bloodGroup: newMemberBlood,
      height: '170 cm',
      weight: '68 kg',
      bmi: '23.5 (Normal)',
      bp: '120/80 mmHg',
      sugar: '100 mg/dL',
      primaryDoctor: 'Family Physician',
      allergies: [],
      chronicConditions: [],
      active: true,
    };

    setProfiles(prev => [
      ...prev.map(p => ({ ...p, active: false })),
      newMember
    ]);

    setNewMemberName('');
    setIsAddMemberModalOpen(false);
  };

  // Remove Family Member (Except Primary)
  const handleRemoveMember = (id: string) => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter(p => p.id !== id);
    remaining[0].active = true;
    setProfiles(remaining);
  };

  // Update active member vitals
  const handleUpdateActiveVitals = (key: keyof MemberData, value: any) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfile.id) {
        return { ...p, [key]: value };
      }
      return p;
    }));
  };

  // Add Tag (Allergy or Condition) to Active Member
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;

    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfile.id) {
        if (tagType === 'allergy') {
          return { ...p, allergies: [...p.allergies, newTagInput.trim()] };
        } else {
          return { ...p, chronicConditions: [...p.chronicConditions, newTagInput.trim()] };
        }
      }
      return p;
    }));

    setNewTagInput('');
    setIsTagModalOpen(false);
  };

  // Remove Tag
  const handleRemoveTag = (type: 'allergy' | 'condition', index: number) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfile.id) {
        if (type === 'allergy') {
          return { ...p, allergies: p.allergies.filter((_, i) => i !== index) };
        } else {
          return { ...p, chronicConditions: p.chronicConditions.filter((_, i) => i !== index) };
        }
      }
      return p;
    }));
  };

  // Add SOS Contact
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

  // Export Zero-Knowledge Key
  const handleExportKey = () => {
    const keyData = {
      vaultId: `vv-zk-${activeProfile.id}a9`,
      patient: activeProfile.name,
      relation: activeProfile.relation,
      age: activeProfile.age,
      bloodGroup: activeProfile.bloodGroup,
      allergies: activeProfile.allergies,
      chronicConditions: activeProfile.chronicConditions,
      encryption: "AES-256-GCM / Zero-Knowledge",
      exportedAt: new Date().toISOString(),
      publicKeyFingerprint: "0x89A3...F42C",
    };
    const blob = new Blob([JSON.stringify(keyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaidyavaani-vault-key-${activeProfile.name.toLowerCase().replace(/\s+/g, '-')}.json`;
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

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15846e]/15 border border-[#15846e]/30 text-[#15846e] text-[11px] font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Clinical Identity</span>
          </div>
        </div>

        {/* =========================================================
            HEADER & DYNAMIC FAMILY MEMBERS SWITCHER / MANAGER
            ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#15846e]/40 to-[#004fdc]/40 border-2 border-[#15846e] flex items-center justify-center text-white shadow-[0_0_30px_rgba(21,132,110,0.35)] relative shrink-0">
              <User className="w-10 h-10 text-white" />
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#15846e] border-2 border-black flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#15846e] mb-1">
                {activeProfile.relation}
              </div>
              <h1 className="text-3xl sm:text-4xl font-normal text-white tracking-tight">
                {activeProfile.name}
              </h1>
              <p className="text-xs font-light text-[#9a9a9a] mt-1">
                Age: {activeProfile.age} • Gender: {activeProfile.gender} • Blood Group: <span className="text-white font-medium">{activeProfile.bloodGroup}</span>
              </p>
            </div>
          </div>

          {/* Family Profiles Switcher & Add Member Action */}
          <div className="p-2.5 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center gap-2.5 w-fit">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#9a9a9a] px-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#ffb829]" />
              Family Profiles:
            </div>

            {/* Profile Selection Pills */}
            {profiles.map((p) => (
              <div key={p.id} className="relative group">
                <button
                  onClick={() => handleSwitchProfile(p.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    p.active 
                      ? 'bg-[#15846e] text-white shadow-[0_0_15px_rgba(21,132,110,0.4)]' 
                      : 'bg-white/[0.04] text-[#9a9a9a] hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-[9px] opacity-75 font-light">({p.relation})</span>
                </button>

                {/* Delete icon for non-primary profiles */}
                {profiles.length > 1 && p.id !== '1' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMember(p.id);
                    }}
                    title="Remove Profile"
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] transition-opacity"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* "+ Add Member" Button */}
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#004fdc]/20 hover:bg-[#004fdc]/30 text-[#004fdc] border border-[#004fdc]/30 flex items-center gap-1.5 transition-colors shadow-[0_0_15px_rgba(0,79,220,0.2)]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Member
            </button>
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
                <h2 className="text-xl font-normal text-white">Vitals & Health Metrics ({activeProfile.name})</h2>
              </div>
              <button
                onClick={() => setIsEditingVitals(!isEditingVitals)}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider text-white border border-white/10 flex items-center gap-1.5 transition-colors"
              >
                {isEditingVitals ? <Check className="w-3.5 h-3.5 text-[#15846e]" /> : <Edit3 className="w-3.5 h-3.5" />}
                {isEditingVitals ? 'Save Vitals' : 'Edit Vitals'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              {/* Blood Group */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-[#9a9a9a]">BLOOD GROUP</div>
                {isEditingVitals ? (
                  <select 
                    value={activeProfile.bloodGroup} 
                    onChange={(e) => handleUpdateActiveVitals('bloodGroup', e.target.value)}
                    className="w-full bg-[#111115] border border-white/20 rounded-xl px-2 py-1.5 text-xs text-white mt-1 outline-none" 
                  >
                    <option value="A+ Positive">A+ Positive</option>
                    <option value="A- Negative">A- Negative</option>
                    <option value="B+ Positive">B+ Positive</option>
                    <option value="B- Negative">B- Negative</option>
                    <option value="O+ Positive">O+ Positive</option>
                    <option value="O- Negative">O- Negative</option>
                    <option value="AB+ Positive">AB+ Positive</option>
                    <option value="AB- Negative">AB- Negative</option>
                  </select>
                ) : (
                  <div className="text-base font-normal text-white mt-1 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-400" /> {activeProfile.bloodGroup}
                  </div>
                )}
              </div>

              {/* Height / Weight */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-[#9a9a9a]">HEIGHT / WEIGHT</div>
                {isEditingVitals ? (
                  <div className="flex gap-1.5 mt-1">
                    <input 
                      type="text" 
                      value={activeProfile.height} 
                      onChange={(e) => handleUpdateActiveVitals('height', e.target.value)}
                      className="w-1/2 bg-[#111115] border border-white/20 rounded-xl px-2 py-1 text-xs text-white" 
                    />
                    <input 
                      type="text" 
                      value={activeProfile.weight} 
                      onChange={(e) => handleUpdateActiveVitals('weight', e.target.value)}
                      className="w-1/2 bg-[#111115] border border-white/20 rounded-xl px-2 py-1 text-xs text-white" 
                    />
                  </div>
                ) : (
                  <div className="text-base font-normal text-white mt-1">
                    {activeProfile.height} • {activeProfile.weight}
                  </div>
                )}
              </div>

              {/* BMI */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-[#9a9a9a]">BODY MASS INDEX (BMI)</div>
                <div className="text-base font-normal text-[#15846e] mt-1">{activeProfile.bmi}</div>
              </div>

              {/* Blood Pressure */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-[#9a9a9a]">BLOOD PRESSURE</div>
                {isEditingVitals ? (
                  <input 
                    type="text" 
                    value={activeProfile.bp} 
                    onChange={(e) => handleUpdateActiveVitals('bp', e.target.value)}
                    className="w-full bg-[#111115] border border-white/20 rounded-xl px-2 py-1 text-xs text-white mt-1" 
                  />
                ) : (
                  <div className="text-base font-normal text-white mt-1">{activeProfile.bp}</div>
                )}
              </div>

              {/* Fasting Sugar */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-[#9a9a9a]">FASTING SUGAR</div>
                {isEditingVitals ? (
                  <input 
                    type="text" 
                    value={activeProfile.sugar} 
                    onChange={(e) => handleUpdateActiveVitals('sugar', e.target.value)}
                    className="w-full bg-[#111115] border border-white/20 rounded-xl px-2 py-1 text-xs text-white mt-1" 
                  />
                ) : (
                  <div className="text-base font-normal text-[#ffb829] mt-1">{activeProfile.sugar}</div>
                )}
              </div>

              {/* Primary Doctor */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[10px] font-mono text-[#9a9a9a]">PRIMARY DOCTOR</div>
                {isEditingVitals ? (
                  <input 
                    type="text" 
                    value={activeProfile.primaryDoctor} 
                    onChange={(e) => handleUpdateActiveVitals('primaryDoctor', e.target.value)}
                    className="w-full bg-[#111115] border border-white/20 rounded-xl px-2 py-1 text-xs text-white mt-1" 
                  />
                ) : (
                  <div className="text-sm font-normal text-white mt-1 truncate">{activeProfile.primaryDoctor}</div>
                )}
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
                <h2 className="text-xl font-normal text-white">Allergies & Conditions ({activeProfile.name})</h2>
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
                  {activeProfile.allergies.length === 0 ? (
                    <span className="text-xs text-[#9a9a9a] font-light">No allergies recorded for {activeProfile.name}.</span>
                  ) : (
                    activeProfile.allergies.map((allergy, i) => (
                      <span key={i} className="px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-300 text-xs font-light flex items-center gap-2 group">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        {allergy}
                        <button 
                          onClick={() => handleRemoveTag('allergy', i)}
                          className="text-red-400 hover:text-white ml-1 opacity-60 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono uppercase text-[#9a9a9a] mb-2.5">Chronic Medical Conditions:</div>
                <div className="flex flex-wrap gap-2.5">
                  {activeProfile.chronicConditions.length === 0 ? (
                    <span className="text-xs text-[#9a9a9a] font-light">No chronic conditions recorded for {activeProfile.name}.</span>
                  ) : (
                    activeProfile.chronicConditions.map((cond, i) => (
                      <span key={i} className="px-3.5 py-1.5 rounded-full bg-[#15846e]/15 border border-[#15846e]/30 text-[#15846e] text-xs font-light flex items-center gap-2 group">
                        <Activity className="w-3 h-3 text-[#15846e]" />
                        {cond}
                        <button 
                          onClick={() => handleRemoveTag('condition', i)}
                          className="text-[#15846e] hover:text-white ml-1 opacity-60 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
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
                  <span className="text-[#9a9a9a]">PATIENT:</span>
                  <span className="text-white">{activeProfile.name}</span>
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

      {/* Modal: Add New Family Member */}
      <AnimatePresence>
        {isAddMemberModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsAddMemberModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0c0c0c] rounded-[32px] w-full max-w-md overflow-hidden shadow-[0_0_80px_rgba(0,79,220,0.25)] relative z-10 border border-white/10 p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.06] mb-6">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#004fdc]">Family Health Network</div>
                  <h3 className="text-xl font-normal text-white">Add Family Member</h3>
                </div>
                <button 
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddFamilyMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g. Priya Gupta"
                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-[#004fdc]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-1.5">Relationship</label>
                    <select 
                      value={newMemberRelation}
                      onChange={(e) => setNewMemberRelation(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#111115] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#004fdc]"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Child / Dependent">Child / Dependent</option>
                      <option value="Grandparent">Grandparent</option>
                      <option value="Sibling">Sibling</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-1.5">Age</label>
                    <input 
                      type="number" 
                      required
                      value={newMemberAge}
                      onChange={(e) => setNewMemberAge(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#004fdc]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-1.5">Gender</label>
                    <select 
                      value={newMemberGender}
                      onChange={(e) => setNewMemberGender(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#111115] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#004fdc]"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] mb-1.5">Blood Group</label>
                    <select 
                      value={newMemberBlood}
                      onChange={(e) => setNewMemberBlood(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#111115] border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-[#004fdc]"
                    >
                      <option value="O+ Positive">O+ Positive</option>
                      <option value="O- Negative">O- Negative</option>
                      <option value="A+ Positive">A+ Positive</option>
                      <option value="A- Negative">A- Negative</option>
                      <option value="B+ Positive">B+ Positive</option>
                      <option value="B- Negative">B- Negative</option>
                      <option value="AB+ Positive">AB+ Positive</option>
                      <option value="AB- Negative">AB- Negative</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-[#004fdc] hover:bg-[#003eb0] text-white rounded-full font-semibold text-xs uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(0,79,220,0.4)]"
                  >
                    Add to Family Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
