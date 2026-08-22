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
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();

  const userAccountName = user?.displayName || (user?.email ? user.email.split('@')[0] : (user?.phoneNumber ? `Patient (${user.phoneNumber})` : 'Primary Patient'));

  // Multi-Patient / Family Profiles initialized with active user's name
  const [profiles, setProfiles] = useState<MemberData[]>(() => {
    return INITIAL_PROFILES.map((p, idx) => {
      if (idx === 0) {
        return {
          ...p,
          name: userAccountName
        };
      }
      return p;
    });
  });
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
    { id: 'c2', name: 'Emergency Ambulance Hotline', phone: '108 / 102', relation: 'Emergency Medical Service' },
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
      primaryDoctor: 'Primary Physician',
      allergies: [],
      chronicConditions: [],
      active: false,
    };

    setProfiles(prev => [...prev, newMember]);
    setNewMemberName('');
    setIsAddMemberModalOpen(false);
  };

  // Export JSON Vault Key
  const handleExportKey = () => {
    const keyData = {
      vaultId: 'VAIDYA-VAULT-' + Date.now(),
      patientName: activeProfile.name,
      patientRelation: activeProfile.relation,
      bloodGroup: activeProfile.bloodGroup,
      allergies: activeProfile.allergies,
      chronicConditions: activeProfile.chronicConditions,
      encryptionProtocol: 'AES-256-GCM / Zero-Knowledge Proof',
      exportedAt: new Date().toISOString(),
      integrityHash: 'sha256-' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
    };

    const blob = new Blob([JSON.stringify(keyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VaidyaVaani_VaultKey_${activeProfile.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setKeyExported(true);
    setTimeout(() => setKeyExported(false), 4000);
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

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f8fafc] font-sans selection:bg-[#0d9488] selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-10">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1e293b]">
          <button 
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workspace</span>
          </button>

          <div className="clinical-badge font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Clinical Identity</span>
          </div>
        </div>

        {/* =========================================================
            HEADER & FAMILY MEMBERS SWITCHER / MANAGER
            ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10 pb-8 border-b border-[#1e293b]">
          
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0">
              <User className="w-8 h-8 text-teal-400" />
            </div>

            <div>
              <div className="text-xs font-medium uppercase text-teal-400 mb-0.5 font-mono">
                {activeProfile.relation}
              </div>
              {isEditingVitals ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={activeProfile.name}
                    onChange={(e) => handleUpdateActiveVitals('name', e.target.value)}
                    className="bg-[#0f1523] border border-[#1e293b] rounded-lg px-3 py-1 text-xl font-semibold text-white outline-none focus:border-teal-500"
                    placeholder="Patient Name"
                  />
                </div>
              ) : (
                <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  {activeProfile.name}
                </h1>
              )}
              <p className="text-xs text-slate-400 mt-0.5">
                Age: {activeProfile.age} • Gender: {activeProfile.gender} • Blood Group: <span className="text-white font-medium">{activeProfile.bloodGroup}</span>
              </p>
            </div>
          </div>

          {/* Family Profiles Switcher */}
          <div className="p-1.5 rounded-lg bg-[#0f1523] border border-[#1e293b] flex flex-wrap items-center gap-2 w-fit">
            <div className="text-xs font-mono uppercase text-slate-400 px-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              Profiles:
            </div>

            {/* Profile Selection Tabs */}
            {profiles.map((p) => (
              <div key={p.id} className="relative group">
                <button
                  onClick={() => handleSwitchProfile(p.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    p.active 
                      ? 'bg-teal-700 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] opacity-75 font-normal">({p.relation})</span>
                </button>

                {/* Delete icon for non-primary profiles */}
                {profiles.length > 1 && p.id !== '1' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMember(p.id);
                    }}
                    title="Remove Profile"
                    className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 rounded-full text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] transition-opacity"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* "+ Add Member" Button */}
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 transition-colors font-mono"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Member
            </button>
          </div>

        </div>

        {/* =========================================================
            GRID SECTION: VITALS & EMERGENCY SOS
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          
          {/* Card 1: Patient Vitals */}
          <div className="lg:col-span-7 clinical-card p-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#1e293b] mb-4">
              <div>
                <div className="clinical-badge mb-1 font-mono">Telemetry</div>
                <h2 className="text-lg font-semibold text-white">Vitals & Biological Metrics ({activeProfile.name})</h2>
              </div>
              <button
                onClick={() => setIsEditingVitals(!isEditingVitals)}
                className="btn-secondary text-xs"
              >
                {isEditingVitals ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Edit3 className="w-3.5 h-3.5" />}
                {isEditingVitals ? 'Save Vitals' : 'Edit Vitals'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              {/* Blood Group */}
              <div className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b]">
                <div className="text-xs font-mono text-slate-400">BLOOD GROUP</div>
                {isEditingVitals ? (
                  <select 
                    value={activeProfile.bloodGroup} 
                    onChange={(e) => handleUpdateActiveVitals('bloodGroup', e.target.value)}
                    className="w-full bg-[#0f1523] border border-[#1e293b] rounded-lg px-2 py-1 text-xs text-white mt-1 outline-none" 
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
                  <div className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5 font-mono">
                    <Heart className="w-4 h-4 text-rose-400" /> {activeProfile.bloodGroup}
                  </div>
                )}
              </div>

              {/* Height / Weight */}
              <div className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b]">
                <div className="text-xs font-mono text-slate-400">HEIGHT / WEIGHT</div>
                {isEditingVitals ? (
                  <div className="flex gap-1.5 mt-1">
                    <input 
                      type="text" 
                      value={activeProfile.height} 
                      onChange={(e) => handleUpdateActiveVitals('height', e.target.value)}
                      className="w-1/2 bg-[#0f1523] border border-[#1e293b] rounded px-2 py-1 text-xs text-white" 
                    />
                    <input 
                      type="text" 
                      value={activeProfile.weight} 
                      onChange={(e) => handleUpdateActiveVitals('weight', e.target.value)}
                      className="w-1/2 bg-[#0f1523] border border-[#1e293b] rounded px-2 py-1 text-xs text-white" 
                    />
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-white mt-1 font-mono">
                    {activeProfile.height} • {activeProfile.weight}
                  </div>
                )}
              </div>

              {/* BMI */}
              <div className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b]">
                <div className="text-xs font-mono text-slate-400">BODY MASS INDEX</div>
                <div className="text-sm font-semibold text-teal-400 mt-1 font-mono">{activeProfile.bmi}</div>
              </div>

              {/* Blood Pressure */}
              <div className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b]">
                <div className="text-xs font-mono text-slate-400">BLOOD PRESSURE</div>
                {isEditingVitals ? (
                  <input 
                    type="text" 
                    value={activeProfile.bp} 
                    onChange={(e) => handleUpdateActiveVitals('bp', e.target.value)}
                    className="w-full bg-[#0f1523] border border-[#1e293b] rounded px-2 py-1 text-xs text-white mt-1" 
                  />
                ) : (
                  <div className="text-sm font-semibold text-white mt-1 font-mono">{activeProfile.bp}</div>
                )}
              </div>

              {/* Fasting Sugar */}
              <div className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b]">
                <div className="text-xs font-mono text-slate-400">FASTING GLUCOSE</div>
                {isEditingVitals ? (
                  <input 
                    type="text" 
                    value={activeProfile.sugar} 
                    onChange={(e) => handleUpdateActiveVitals('sugar', e.target.value)}
                    className="w-full bg-[#0f1523] border border-[#1e293b] rounded px-2 py-1 text-xs text-white mt-1" 
                  />
                ) : (
                  <div className="text-sm font-semibold text-amber-400 mt-1 font-mono">{activeProfile.sugar}</div>
                )}
              </div>

              {/* Primary Doctor */}
              <div className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b]">
                <div className="text-xs font-mono text-slate-400">PRIMARY DOCTOR</div>
                {isEditingVitals ? (
                  <input 
                    type="text" 
                    value={activeProfile.primaryDoctor} 
                    onChange={(e) => handleUpdateActiveVitals('primaryDoctor', e.target.value)}
                    className="w-full bg-[#0f1523] border border-[#1e293b] rounded px-2 py-1 text-xs text-white mt-1" 
                  />
                ) : (
                  <div className="text-xs font-medium text-white mt-1 truncate">{activeProfile.primaryDoctor}</div>
                )}
              </div>

            </div>
          </div>

          {/* Card 2: Emergency SOS Contacts */}
          <div className="lg:col-span-5 clinical-card p-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#1e293b] mb-4">
              <div>
                <div className="text-xs font-mono uppercase text-rose-400 font-semibold mb-1">Rapid Response</div>
                <h2 className="text-lg font-semibold text-white">Emergency SOS Contacts</h2>
              </div>
              <button
                onClick={() => setIsAddingSos(true)}
                className="px-3 py-1 rounded-md bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold flex items-center gap-1 border border-rose-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                Add SOS
              </button>
            </div>

            <div className="space-y-2.5">
              {sosContacts.map((contact) => (
                <div key={contact.id} className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{contact.name}</div>
                      <div className="text-xs text-slate-400">{contact.relation}</div>
                    </div>
                  </div>

                  <a 
                    href={`tel:${contact.phone}`} 
                    className="px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-semibold transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>

            {/* Quick SOS Trigger Box */}
            <div className="mt-4 p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Emergency clinical medical card available for lock screen access.</span>
            </div>
          </div>

        </div>

        {/* =========================================================
            CHRONIC CONDITIONS, ALLERGIES & VAULT KEY EXPORT
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Allergies & Chronic Conditions */}
          <div className="lg:col-span-8 clinical-card p-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#1e293b] mb-4">
              <div>
                <div className="text-xs font-mono uppercase text-amber-400 font-semibold mb-1">Pharmacopeia Guard</div>
                <h2 className="text-lg font-semibold text-white">Allergies & Medical Conditions ({activeProfile.name})</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTagType('allergy');
                    setIsTagModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-md bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 text-xs font-semibold flex items-center gap-1 border border-amber-500/30"
                >
                  <Plus className="w-3.5 h-3.5" /> Allergy
                </button>
                <button
                  onClick={() => {
                    setTagType('condition');
                    setIsTagModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-md bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 text-xs font-semibold flex items-center gap-1 border border-teal-500/30"
                >
                  <Plus className="w-3.5 h-3.5" /> Condition
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono uppercase text-slate-400 mb-2">Known Drug & Food Allergies:</div>
                <div className="flex flex-wrap gap-2">
                  {activeProfile.allergies.length === 0 ? (
                    <span className="text-xs text-slate-400">No allergies recorded for {activeProfile.name}.</span>
                  ) : (
                    activeProfile.allergies.map((allergy, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-1.5 group">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        {allergy}
                        <button 
                          onClick={() => handleRemoveTag('allergy', i)}
                          className="text-rose-400 hover:text-white ml-1 opacity-60 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono uppercase text-slate-400 mb-2">Chronic Medical Conditions:</div>
                <div className="flex flex-wrap gap-2">
                  {activeProfile.chronicConditions.length === 0 ? (
                    <span className="text-xs text-slate-400">No chronic conditions recorded for {activeProfile.name}.</span>
                  ) : (
                    activeProfile.chronicConditions.map((cond, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-teal-950/30 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-1.5 group">
                        <Activity className="w-3.5 h-3.5 text-teal-400" />
                        {cond}
                        <button 
                          onClick={() => handleRemoveTag('condition', i)}
                          className="text-teal-400 hover:text-white ml-1 opacity-60 group-hover:opacity-100"
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
          <div className="lg:col-span-4 clinical-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-blue-400 font-semibold mb-1">
                <Lock className="w-3.5 h-3.5" />
                Security Vault
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Zero-Knowledge Key Export</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Download your portable encrypted JSON key to authenticate and decrypt medical records offline or on external clinic systems.
              </p>

              <div className="p-3.5 rounded-lg bg-[#090d16] border border-[#1e293b] font-mono text-xs text-slate-300 space-y-1 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">PATIENT:</span>
                  <span className="text-white">{activeProfile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CIPHER:</span>
                  <span className="text-teal-400">AES-256-GCM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">STATUS:</span>
                  <span className="text-blue-400">Verified</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportKey}
              className="w-full btn-primary text-xs font-semibold"
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
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsAddMemberModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="bg-[#0f1523] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-[#1e293b] p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#1e293b] mb-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono">Family Profile</div>
                  <h3 className="text-lg font-semibold text-white mt-0.5">Add Family Member</h3>
                </div>
                <button 
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-300 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddFamilyMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g. Priya Gupta"
                    className="w-full px-3.5 py-2.5 bg-[#090d16] border border-[#1e293b] rounded-lg text-sm text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">Relationship</label>
                    <select 
                      value={newMemberRelation}
                      onChange={(e) => setNewMemberRelation(e.target.value)}
                      className="w-full px-3 py-2 bg-[#090d16] border border-[#1e293b] rounded-lg text-xs text-white focus:outline-none focus:border-teal-500"
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
                    <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">Age</label>
                    <input 
                      type="number" 
                      required
                      value={newMemberAge}
                      onChange={(e) => setNewMemberAge(e.target.value)}
                      className="w-full px-3 py-2 bg-[#090d16] border border-[#1e293b] rounded-lg text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">Gender</label>
                    <select 
                      value={newMemberGender}
                      onChange={(e) => setNewMemberGender(e.target.value)}
                      className="w-full px-3 py-2 bg-[#090d16] border border-[#1e293b] rounded-lg text-xs text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">Blood Group</label>
                    <select 
                      value={newMemberBlood}
                      onChange={(e) => setNewMemberBlood(e.target.value)}
                      className="w-full px-3 py-2 bg-[#090d16] border border-[#1e293b] rounded-lg text-xs text-white focus:outline-none focus:border-teal-500"
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

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full btn-primary text-xs"
                  >
                    Add to Family Profiles
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
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsAddingSos(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="bg-[#0f1523] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-[#1e293b] p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#1e293b] mb-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 font-mono">Emergency SOS</div>
                  <h3 className="text-lg font-semibold text-white mt-0.5">Add Emergency Contact</h3>
                </div>
                <button 
                  onClick={() => setIsAddingSos(false)}
                  className="w-8 h-8 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-300 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSos} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">Doctor / Contact Name</label>
                  <input 
                    type="text" 
                    required
                    value={newSosName}
                    onChange={(e) => setNewSosName(e.target.value)}
                    placeholder="e.g. Dr. Verma (Physician)"
                    className="w-full px-3.5 py-2.5 bg-[#090d16] border border-[#1e293b] rounded-lg text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">Emergency Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={newSosPhone}
                    onChange={(e) => setNewSosPhone(e.target.value)}
                    placeholder="e.g. +91 98123 45678"
                    className="w-full px-3.5 py-2.5 bg-[#090d16] border border-[#1e293b] rounded-lg text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full btn-primary bg-rose-600 hover:bg-rose-700 border-rose-500/30 text-xs"
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
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsTagModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="bg-[#0f1523] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-[#1e293b] p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#1e293b] mb-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
                    {tagType === 'allergy' ? 'Drug / Food Allergy' : 'Chronic Medical Condition'}
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-0.5">
                    Add {tagType === 'allergy' ? 'Allergy Record' : 'Medical Condition'}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsTagModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-300 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddTag} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">Description</label>
                  <input 
                    type="text" 
                    required
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder={tagType === 'allergy' ? 'e.g. Aspirin (Asthma flare)' : 'e.g. Type 2 Diabetes'}
                    className="w-full px-3.5 py-2.5 bg-[#090d16] border border-[#1e293b] rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full btn-primary text-xs"
                  >
                    Save to Health Record
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
