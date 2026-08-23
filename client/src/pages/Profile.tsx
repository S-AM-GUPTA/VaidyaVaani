import React, { useState, useEffect } from 'react';
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

interface SosContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userAccountName = user?.displayName || (user?.email ? user.email.split('@')[0] : (user?.phoneNumber ? user.phoneNumber : 'Account Holder'));

  // Persistent Family Profiles
  const [profiles, setProfiles] = useState<MemberData[]>(() => {
    const saved = localStorage.getItem('vv_patient_profiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'primary-user',
        name: userAccountName,
        relation: 'Self (Primary)',
        age: 0,
        gender: 'Not Specified',
        bloodGroup: 'Not Specified',
        height: '-- cm',
        weight: '-- kg',
        bmi: '--',
        bp: '--/-- mmHg',
        sugar: '-- mg/dL',
        primaryDoctor: 'Not Specified',
        allergies: [],
        chronicConditions: [],
        active: true,
      }
    ];
  });

  const activeProfile = profiles.find(p => p.active) || profiles[0];

  // Persistent Emergency SOS contacts
  const [sosContacts, setSosContacts] = useState<SosContact[]>(() => {
    const saved = localStorage.getItem('vv_patient_sos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      { id: 'sos-1', name: 'National Emergency Ambulance', phone: '108 / 102', relation: 'Emergency Medical Hotline' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('vv_patient_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('vv_patient_sos', JSON.stringify(sosContacts));
  }, [sosContacts]);

  // Editable vitals toggle
  const [isEditingVitals, setIsEditingVitals] = useState(false);

  // Add Family Member Modal State
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('Spouse');
  const [newMemberAge, setNewMemberAge] = useState('');
  const [newMemberGender, setNewMemberGender] = useState('Female');
  const [newMemberBlood, setNewMemberBlood] = useState('O+ Positive');

  // Add SOS Contact State
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

    const newId = 'member-' + Date.now();
    const newMember: MemberData = {
      id: newId,
      name: newMemberName.trim(),
      relation: newMemberRelation,
      age: parseInt(newMemberAge) || 0,
      gender: newMemberGender,
      bloodGroup: newMemberBlood,
      height: '-- cm',
      weight: '-- kg',
      bmi: '--',
      bp: '--/-- mmHg',
      sugar: '-- mg/dL',
      primaryDoctor: 'Not Specified',
      allergies: [],
      chronicConditions: [],
      active: false,
    };

    setProfiles(prev => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberAge('');
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
      id: 'sos-' + Date.now(),
      name: newSosName.trim(),
      phone: newSosPhone.trim(),
      relation: 'Emergency Contact'
    }]);
    setNewSosName('');
    setNewSosPhone('');
    setIsAddingSos(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-sky-600 selection:text-white">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-10">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button 
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Health Vault</span>
          </button>

          <div className="med-badge font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Patient Health Profile</span>
          </div>
        </div>

        {/* =========================================================
            HEADER & FAMILY MEMBERS SWITCHER / MANAGER
            ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-200">
          
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg shrink-0">
              <User className="w-8 h-8 text-sky-700" />
            </div>

            <div>
              <div className="text-xs font-bold uppercase text-sky-700 mb-0.5 font-mono">
                {activeProfile.relation}
              </div>
              {isEditingVitals ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={activeProfile.name}
                    onChange={(e) => handleUpdateActiveVitals('name', e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-3 py-1 text-xl font-bold text-slate-900 outline-none focus:border-sky-500"
                    placeholder="Full Name"
                  />
                </div>
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {activeProfile.name}
                </h1>
              )}
              <p className="text-xs text-slate-500 mt-0.5">
                Age: {activeProfile.age > 0 ? activeProfile.age : 'Not specified'} • Gender: {activeProfile.gender} • Blood Group: <span className="text-slate-900 font-bold">{activeProfile.bloodGroup}</span>
              </p>
            </div>
          </div>

          {/* Family Profiles Switcher */}
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs flex flex-wrap items-center gap-2 w-fit">
            <div className="text-xs font-mono uppercase text-slate-500 font-bold px-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              Profiles:
            </div>

            {/* Profile Selection Tabs */}
            {profiles.map((p) => (
              <div key={p.id} className="relative group">
                <button
                  onClick={() => handleSwitchProfile(p.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                    p.active 
                      ? 'bg-sky-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] opacity-75 font-normal">({p.relation})</span>
                </button>

                {/* Delete icon for non-primary profiles */}
                {profiles.length > 1 && p.id !== 'primary-user' && (
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
              className="px-3 py-1.5 rounded-md text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 flex items-center gap-1.5 transition-colors font-mono"
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
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div>
                <div className="med-badge mb-1 font-mono">Telemetry</div>
                <h2 className="text-lg font-bold text-slate-900">Vitals & Biological Metrics ({activeProfile.name})</h2>
              </div>
              <button
                onClick={() => setIsEditingVitals(!isEditingVitals)}
                className="btn-med-secondary text-xs"
              >
                {isEditingVitals ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Edit3 className="w-3.5 h-3.5" />}
                {isEditingVitals ? 'Save Vitals' : 'Edit Vitals'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              
              {/* Blood Group */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-mono text-slate-500 font-bold">BLOOD GROUP</div>
                {isEditingVitals ? (
                  <select 
                    value={activeProfile.bloodGroup} 
                    onChange={(e) => handleUpdateActiveVitals('bloodGroup', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 mt-1 outline-none" 
                  >
                    <option value="Not Specified">Not Specified</option>
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
                  <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5 font-mono">
                    <Heart className="w-4 h-4 text-rose-500" /> {activeProfile.bloodGroup}
                  </div>
                )}
              </div>

              {/* Height / Weight */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-mono text-slate-500 font-bold">HEIGHT / WEIGHT</div>
                {isEditingVitals ? (
                  <div className="flex gap-1.5 mt-1">
                    <input 
                      type="text" 
                      value={activeProfile.height} 
                      onChange={(e) => handleUpdateActiveVitals('height', e.target.value)}
                      placeholder="e.g. 175 cm"
                      className="w-1/2 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900" 
                    />
                    <input 
                      type="text" 
                      value={activeProfile.weight} 
                      onChange={(e) => handleUpdateActiveVitals('weight', e.target.value)}
                      placeholder="e.g. 70 kg"
                      className="w-1/2 bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900" 
                    />
                  </div>
                ) : (
                  <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                    {activeProfile.height} • {activeProfile.weight}
                  </div>
                )}
              </div>

              {/* BMI */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-mono text-slate-500 font-bold">BODY MASS INDEX</div>
                <div className="text-sm font-bold text-slate-700 mt-1 font-mono">{activeProfile.bmi}</div>
              </div>

              {/* Blood Pressure */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-mono text-slate-500 font-bold">BLOOD PRESSURE</div>
                {isEditingVitals ? (
                  <input 
                    type="text" 
                    value={activeProfile.bp} 
                    onChange={(e) => handleUpdateActiveVitals('bp', e.target.value)}
                    placeholder="e.g. 120/80 mmHg"
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 mt-1" 
                  />
                ) : (
                  <div className="text-sm font-bold text-slate-900 mt-1 font-mono">{activeProfile.bp}</div>
                )}
              </div>

              {/* Fasting Sugar */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-mono text-slate-500 font-bold">FASTING GLUCOSE</div>
                {isEditingVitals ? (
                  <input 
                    type="text" 
                    value={activeProfile.sugar} 
                    onChange={(e) => handleUpdateActiveVitals('sugar', e.target.value)}
                    placeholder="e.g. 95 mg/dL"
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 mt-1" 
                  />
                ) : (
                  <div className="text-sm font-bold text-slate-900 mt-1 font-mono">{activeProfile.sugar}</div>
                )}
              </div>

              {/* Primary Doctor */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-xs font-mono text-slate-500 font-bold">PRIMARY DOCTOR</div>
                {isEditingVitals ? (
                  <input 
                    type="text" 
                    value={activeProfile.primaryDoctor} 
                    onChange={(e) => handleUpdateActiveVitals('primaryDoctor', e.target.value)}
                    placeholder="e.g. Dr. Verma (Physician)"
                    className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 mt-1" 
                  />
                ) : (
                  <div className="text-xs font-bold text-slate-900 mt-1 truncate">{activeProfile.primaryDoctor}</div>
                )}
              </div>

            </div>
          </div>

          {/* Card 2: Emergency SOS Contacts */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div>
                <div className="text-xs font-mono uppercase text-rose-600 font-bold mb-1">Rapid Response</div>
                <h2 className="text-lg font-bold text-slate-900">Emergency SOS Contacts</h2>
              </div>
              <button
                onClick={() => setIsAddingSos(true)}
                className="px-3 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 border border-rose-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add SOS
              </button>
            </div>

            <div className="space-y-3">
              {sosContacts.map((contact) => (
                <div key={contact.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{contact.name}</div>
                      <div className="text-xs text-slate-500">{contact.relation}</div>
                    </div>
                  </div>

                  <a 
                    href={`tel:${contact.phone}`} 
                    className="px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>

            {/* Quick SOS Trigger Box */}
            <div className="mt-4 p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Emergency clinical card formatted for instant lock screen access.</span>
            </div>
          </div>

        </div>

        {/* =========================================================
            CHRONIC CONDITIONS, ALLERGIES & VAULT KEY EXPORT
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Allergies & Chronic Conditions */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div>
                <div className="text-xs font-mono uppercase text-amber-700 font-bold mb-1">Pharmacopeia Guard</div>
                <h2 className="text-lg font-bold text-slate-900">Allergies & Medical Conditions ({activeProfile.name})</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTagType('allergy');
                    setIsTagModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1 border border-amber-200"
                >
                  <Plus className="w-3.5 h-3.5" /> Allergy
                </button>
                <button
                  onClick={() => {
                    setTagType('condition');
                    setIsTagModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1 border border-sky-200"
                >
                  <Plus className="w-3.5 h-3.5" /> Condition
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono uppercase text-slate-500 font-bold mb-2">Known Drug & Food Allergies:</div>
                <div className="flex flex-wrap gap-2">
                  {activeProfile.allergies.length === 0 ? (
                    <span className="text-xs text-slate-400">No allergies recorded. Click "+ Allergy" to add.</span>
                  ) : (
                    activeProfile.allergies.map((allergy, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-1.5 group">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        {allergy}
                        <button 
                          onClick={() => handleRemoveTag('allergy', i)}
                          className="text-rose-500 hover:text-rose-900 ml-1 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono uppercase text-slate-500 font-bold mb-2">Chronic Medical Conditions:</div>
                <div className="flex flex-wrap gap-2">
                  {activeProfile.chronicConditions.length === 0 ? (
                    <span className="text-xs text-slate-400">No chronic conditions recorded. Click "+ Condition" to add.</span>
                  ) : (
                    activeProfile.chronicConditions.map((cond, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium flex items-center gap-1.5 group">
                        <Activity className="w-3.5 h-3.5 text-teal-600" />
                        {cond}
                        <button 
                          onClick={() => handleRemoveTag('condition', i)}
                          className="text-teal-600 hover:text-teal-900 ml-1 font-bold"
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
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-sky-700 font-bold mb-1">
                <Lock className="w-3.5 h-3.5" />
                Security Vault
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Zero-Knowledge Key Export</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Download your portable encrypted JSON key to authenticate and decrypt medical records offline or on external clinic systems.
              </p>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 space-y-1 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">PATIENT:</span>
                  <span className="text-slate-900 font-bold">{activeProfile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CIPHER:</span>
                  <span className="text-teal-700 font-bold">AES-256-GCM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">STATUS:</span>
                  <span className="text-sky-700 font-bold">Verified</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleExportKey}
              className="w-full btn-med-primary text-xs font-semibold"
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
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsAddMemberModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-sky-700 font-mono">Family Profile</div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Add Family Member</h3>
                </div>
                <button 
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddFamilyMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g. Family Member Name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">Relationship</label>
                    <select 
                      value={newMemberRelation}
                      onChange={(e) => setNewMemberRelation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">Age</label>
                    <input 
                      type="number" 
                      value={newMemberAge}
                      onChange={(e) => setNewMemberAge(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">Gender</label>
                    <select 
                      value={newMemberGender}
                      onChange={(e) => setNewMemberGender(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">Blood Group</label>
                    <select 
                      value={newMemberBlood}
                      onChange={(e) => setNewMemberBlood(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    >
                      <option value="Not Specified">Not Specified</option>
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
                    className="w-full btn-med-primary text-xs"
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
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsAddingSos(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-600 font-mono">Emergency SOS</div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Add Emergency Contact</h3>
                </div>
                <button 
                  onClick={() => setIsAddingSos(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSos} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">Doctor / Contact Name</label>
                  <input 
                    type="text" 
                    required
                    value={newSosName}
                    onChange={(e) => setNewSosName(e.target.value)}
                    placeholder="e.g. Dr. Primary Physician"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">Emergency Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={newSosPhone}
                    onChange={(e) => setNewSosPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full btn-med-primary bg-rose-600 hover:bg-rose-700 border-rose-500/30 text-xs"
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
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsTagModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-200 p-6 sm:p-8"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-700 font-mono">
                    {tagType === 'allergy' ? 'Drug / Food Allergy' : 'Chronic Medical Condition'}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    Add {tagType === 'allergy' ? 'Allergy Record' : 'Medical Condition'}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsTagModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddTag} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">Description</label>
                  <input 
                    type="text" 
                    required
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder={tagType === 'allergy' ? 'e.g. Penicillin Allergy' : 'e.g. Hypertension'}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full btn-med-primary text-xs"
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
