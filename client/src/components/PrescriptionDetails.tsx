import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pill, Clock, AlertTriangle, Utensils } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface PrescriptionDetailsProps {
  prescriptionId: string;
  token: string | null;
}

const PrescriptionDetails: React.FC<PrescriptionDetailsProps> = ({ prescriptionId, token }) => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get(`${API_URL}/medicines/${prescriptionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMedicines(res.data);
      } catch (err) {
        console.error('Failed to fetch medicines', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, [prescriptionId, token]);

  if (loading) return (
    <div className="p-8 text-center text-slate-500 animate-pulse flex flex-col items-center">
      <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mb-4"></div>
      <p className="font-medium">Deciphering prescription...</p>
    </div>
  );

  if (medicines.length === 0) return (
    <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <Pill className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-slate-500 font-medium">No medicines were detected in this prescription.</p>
    </div>
  );

  return (
    <div className="animate-fade-in-up mt-2">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mr-3 shadow-sm border border-teal-100">
          <Pill className="w-5 h-5 text-teal-600" />
        </div>
        <h3 className="text-lg font-display font-bold text-[var(--color-text-primary)]">Extracted Medicines</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {medicines.map((med) => {
          const confidence = med.confidenceScore || 100;
          const isHigh = confidence >= 90;
          const isMedium = confidence >= 70 && confidence < 90;
          const isLow = confidence < 70;
          
          let borderColor = 'border-slate-200/60';
          let indicatorColor = 'bg-teal-400';
          
          if (isMedium) {
            borderColor = 'border-amber-200/60';
            indicatorColor = 'bg-amber-400';
          } else if (isLow) {
            borderColor = 'border-red-200/60';
            indicatorColor = 'bg-red-400';
          }

          return (
            <div key={med._id} className={`glass-card bg-white/80 p-5 rounded-2xl group border ${borderColor} shadow-sm shadow-slate-200/20 relative overflow-hidden flex flex-col h-full`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${indicatorColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="flex flex-col mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-display font-bold text-slate-800 text-lg flex items-center pr-2">
                    {isLow ? (
                      <span className="blur-sm select-none opacity-50" title="Low confidence match">{med.name}</span>
                    ) : (
                      med.name
                    )}
                  </h4>
                  <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg shrink-0 border border-slate-200 shadow-sm">{med.dosage || 'N/A'}</span>
                </div>
                
                {/* Confidence Badge */}
                {isHigh && (
                  <div className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 self-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                    {confidence}% Match
                  </div>
                )}
                {isMedium && (
                  <div className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 self-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                    Possible Match ({confidence}%)
                  </div>
                )}
                {isLow && (
                  <div className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 self-start">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Uncertain Match ({confidence}%)
                  </div>
                )}
              </div>
              
              <p className={`text-sm text-slate-600 mb-4 font-medium leading-relaxed flex-grow ${isLow ? 'opacity-50 blur-[2px] select-none' : ''}`}>
                {med.purpose}
              </p>
              
              <div className={`space-y-2.5 mt-auto bg-slate-50/50 rounded-xl p-3 border border-slate-100 ${isLow ? 'opacity-50 blur-[2px] select-none' : ''}`}>
                {med.timing && (
                  <div className="flex items-center text-xs font-medium text-slate-700">
                    <Clock className="w-4 h-4 mr-2.5 text-indigo-500 shrink-0" /> 
                    <span>{med.timing}</span>
                  </div>
                )}
                {med.foodInstructions && (
                  <div className="flex items-center text-xs font-medium text-slate-700">
                    <Utensils className="w-4 h-4 mr-2.5 text-amber-500 shrink-0" /> 
                    <span>{med.foodInstructions}</span>
                  </div>
                )}
              </div>

              {/* Warnings / Verification actions */}
              <div className="mt-3">
                {med.warnings && !isLow && (
                  <div className="flex items-start text-xs font-medium text-red-700 bg-red-50/80 p-2.5 rounded-lg border border-red-100">
                    <AlertTriangle className="w-4 h-4 mr-2 shrink-0 text-red-500 mt-0.5" /> 
                    <span className="leading-relaxed">{med.warnings}</span>
                  </div>
                )}
                
                {isMedium && (
                  <div className="mt-2 text-xs font-bold text-amber-600 flex items-center bg-amber-50/50 p-2 rounded border border-amber-100">
                    ⚠️ Please verify with your doctor or pharmacist.
                  </div>
                )}
                
                {isLow && (
                  <button 
                    onClick={() => alert("Upload Strip feature coming soon!")}
                    className="w-full mt-2 py-2.5 px-4 bg-white border border-red-200 text-red-600 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Upload Medicine Strip
                  </button>
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
