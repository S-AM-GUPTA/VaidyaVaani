import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Pill, 
  Clock, 
  AlertTriangle, 
  Utensils, 
  CheckCircle2, 
  Edit3, 
  Check, 
  Plus, 
  ShieldCheck, 
  Info,
  X
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface PrescriptionDetailsProps {
  prescriptionId: string;
  token: string | null;
}

interface MedicineItem {
  _id?: string;
  name: string;
  dosage?: string;
  purpose?: string;
  timing?: string;
  foodInstructions?: string;
  warnings?: string;
  confidenceScore?: number;
  requiresVerification?: boolean;
  isUserVerified?: boolean;
}

const PrescriptionDetails: React.FC<PrescriptionDetailsProps> = ({ prescriptionId, token }) => {
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<MedicineItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newMed, setNewMed] = useState<MedicineItem>({
    name: '',
    dosage: '1 tablet',
    timing: 'Twice daily',
    foodInstructions: 'After food',
    confidenceScore: 100,
    requiresVerification: false,
    isUserVerified: true
  });

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get(`${API_URL}/medicines/${prescriptionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.length > 0) {
          setMedicines(res.data);
        } else {
          // Check local storage for mock/cached results
          const cached = localStorage.getItem(`vv_rx_meds_${prescriptionId}`);
          if (cached) {
            setMedicines(JSON.parse(cached));
          }
        }
      } catch (err) {
        console.error('Failed to fetch medicines', err);
        const cached = localStorage.getItem(`vv_rx_meds_${prescriptionId}`);
        if (cached) {
          setMedicines(JSON.parse(cached));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, [prescriptionId, token]);

  const saveToStorage = (updated: MedicineItem[]) => {
    setMedicines(updated);
    localStorage.setItem(`vv_rx_meds_${prescriptionId}`, JSON.stringify(updated));
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...medicines[index] });
  };

  const handleSaveEdit = (index: number) => {
    if (!editForm) return;
    const updated = [...medicines];
    updated[index] = {
      ...editForm,
      isUserVerified: true,
      requiresVerification: false,
      confidenceScore: 100
    };
    saveToStorage(updated);
    setEditingIndex(null);
    setEditForm(null);
  };

  const handleVerifyMedicine = (index: number) => {
    const updated = [...medicines];
    updated[index] = {
      ...updated[index],
      isUserVerified: true,
      requiresVerification: false,
      confidenceScore: 100
    };
    saveToStorage(updated);
  };

  const handleAddNewMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name.trim()) return;
    const updated = [...medicines, { ...newMed, _id: 'med-' + Date.now() }];
    saveToStorage(updated);
    setIsAddingNew(false);
    setNewMed({
      name: '',
      dosage: '1 tablet',
      timing: 'Twice daily',
      foodInstructions: 'After food',
      confidenceScore: 100,
      requiresVerification: false,
      isUserVerified: true
    });
  };

  const handleDeleteMedicine = (index: number) => {
    const updated = medicines.filter((_, i) => i !== index);
    saveToStorage(updated);
  };

  if (loading) return (
    <div className="p-8 text-center text-slate-500 animate-pulse flex flex-col items-center">
      <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-mono">Running Hybrid OCR & Handwriting Recognition...</p>
    </div>
  );

  return (
    <div className="mt-4 space-y-6">
      
      {/* Medical Safety Callout Banner */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Prescription Interpretation Engine:</span> Please cross-verify detected medicines against your physical prescription. You can edit any field or mark as verified.
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
            Deciphered Medications ({medicines.length})
          </h3>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="btn-med-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-600" />
          <span>Add Medicine</span>
        </button>
      </div>

      {medicines.length === 0 && !isAddingNew ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Pill className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No prescription items detected in this document.</p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="mt-3 btn-med-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manually Add Medication</span>
          </button>
        </div>
      ) : null}

      {/* Add New Medicine Modal / Form */}
      {isAddingNew && (
        <form onSubmit={handleAddNewMedicine} className="p-5 rounded-2xl bg-white border-2 border-emerald-500 shadow-md space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase font-mono">Add Prescribed Medicine</h4>
            <button type="button" onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 font-mono mb-1">Medicine Name *</label>
              <input
                type="text"
                required
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                placeholder="e.g. Augmentin 625"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 font-mono mb-1">Dosage / Strength</label>
              <input
                type="text"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                placeholder="e.g. 625 mg, 1 tablet"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 font-mono mb-1">Timing / Frequency</label>
              <input
                type="text"
                value={newMed.timing}
                onChange={(e) => setNewMed({ ...newMed, timing: e.target.value })}
                placeholder="e.g. Twice daily (1-0-1)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 font-mono mb-1">Food Instructions</label>
              <input
                type="text"
                value={newMed.foodInstructions}
                onChange={(e) => setNewMed({ ...newMed, foodInstructions: e.target.value })}
                placeholder="e.g. After food"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-med-primary text-xs py-1.5 px-4 cursor-pointer"
            >
              Save Medicine
            </button>
          </div>
        </form>
      )}
      
      {/* Medicine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicines.map((med, index) => {
          const isEditing = editingIndex === index;
          const confidence = med.confidenceScore || 85;
          const isVerified = med.isUserVerified || false;
          const isHigh = confidence >= 90 || isVerified;
          const isMedium = confidence >= 70 && confidence < 90 && !isVerified;
          const isLow = confidence < 70 && !isVerified;
          
          if (isEditing && editForm) {
            return (
              <div key={index} className="p-5 rounded-2xl bg-white border-2 border-emerald-500 shadow-md space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase font-mono">Edit Medication</h4>
                  <button onClick={() => setEditingIndex(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 font-mono mb-1">NAME</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono mb-1">DOSAGE</label>
                    <input
                      type="text"
                      value={editForm.dosage || ''}
                      onChange={(e) => setEditForm({ ...editForm, dosage: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono mb-1">TIMING</label>
                    <input
                      type="text"
                      value={editForm.timing || ''}
                      onChange={(e) => setEditForm({ ...editForm, timing: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteMedicine(index)}
                    className="text-xs text-rose-600 hover:underline font-mono"
                  >
                    Delete
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      className="px-3 py-1.5 text-xs text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(index)}
                      className="btn-med-primary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={med._id || index} 
              className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between shadow-xs ${
                isVerified 
                  ? 'border-emerald-300 ring-1 ring-emerald-400/20' 
                  : isLow 
                  ? 'border-rose-300 bg-rose-50/20' 
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-base">
                    {med.name}
                  </h4>
                  <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {med.dosage || 'Standard'}
                  </span>
                </div>
                
                {/* Confidence & Verification Status */}
                <div className="mb-3 flex items-center justify-between text-xs">
                  <div>
                    {isVerified ? (
                      <span className="inline-flex items-center text-[11px] font-mono text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> User Verified
                      </span>
                    ) : isHigh ? (
                      <span className="inline-flex items-center text-[11px] font-mono text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> {confidence}% Match
                      </span>
                    ) : isMedium ? (
                      <span className="inline-flex items-center text-[11px] font-mono text-amber-700 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Review Recommended ({confidence}%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[11px] font-mono text-rose-700 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" /> Verification Required ({confidence}%)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isVerified && (
                      <button
                        onClick={() => handleVerifyMedicine(index)}
                        className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold hover:bg-emerald-200 cursor-pointer"
                        title="Mark verified"
                      >
                        ✓ Confirm
                      </button>
                    )}
                    <button
                      onClick={() => handleStartEdit(index)}
                      className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                      title="Edit medication"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {med.purpose || 'Prescribed medical therapy'}
                </p>
              </div>
              
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                {med.timing && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{med.timing}</span>
                  </div>
                )}
                {med.foodInstructions && (
                  <div className="flex items-center gap-2">
                    <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{med.foodInstructions}</span>
                  </div>
                )}
                {med.warnings && (
                  <div className="flex items-center gap-2 text-amber-800 text-[11px]">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{med.warnings}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrescriptionDetails;
