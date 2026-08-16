import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pill, Clock, AlertTriangle, Utensils, CheckCircle2 } from 'lucide-react';

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
    <div className="p-8 text-center text-[#9a9a9a] animate-pulse flex flex-col items-center">
      <div className="w-8 h-8 border-2 border-[#8052ff] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-light tracking-wide">Deciphering handwritten prescription...</p>
    </div>
  );

  if (medicines.length === 0) return (
    <div className="p-8 text-center bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
      <Pill className="w-6 h-6 text-[#9a9a9a] mx-auto mb-2" />
      <p className="text-xs font-light text-[#9a9a9a]">No pharmacopeia items detected in this document.</p>
    </div>
  );

  return (
    <div className="mt-4 space-y-6">
      <div className="flex items-center gap-2">
        <Pill className="w-4 h-4 text-[#8052ff]" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#ffffff]">Deciphered Medications</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicines.map((med) => {
          const confidence = med.confidenceScore || 100;
          const isHigh = confidence >= 90;
          const isMedium = confidence >= 70 && confidence < 90;
          const isLow = confidence < 70;
          
          return (
            <div 
              key={med._id} 
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#8052ff]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-normal text-[#ffffff] text-base">
                    {med.name}
                  </h4>
                  <span className="text-xs font-mono text-[#8052ff] bg-[#8052ff]/10 px-2.5 py-1 rounded-full border border-[#8052ff]/20">
                    {med.dosage || 'Standard'}
                  </span>
                </div>
                
                {/* Confidence */}
                <div className="mb-3">
                  {isHigh && (
                    <span className="inline-flex items-center text-[10px] font-mono text-[#15846e]">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {confidence}% Match
                    </span>
                  )}
                  {isMedium && (
                    <span className="inline-flex items-center text-[10px] font-mono text-[#ffb829]">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Probable ({confidence}%)
                    </span>
                  )}
                  {isLow && (
                    <span className="inline-flex items-center text-[10px] font-mono text-red-400">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Review Needed ({confidence}%)
                    </span>
                  )}
                </div>

                <p className="text-xs font-light text-[#bdbdbd] mb-4 leading-relaxed">
                  {med.purpose || 'Prescribed therapy'}
                </p>
              </div>
              
              <div className="space-y-2 pt-3 border-t border-white/[0.06] text-xs font-light text-[#9a9a9a]">
                {med.timing && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#8052ff]" />
                    <span>{med.timing}</span>
                  </div>
                )}
                {med.foodInstructions && (
                  <div className="flex items-center gap-2">
                    <Utensils className="w-3.5 h-3.5 text-[#ffb829]" />
                    <span>{med.foodInstructions}</span>
                  </div>
                )}
                {med.warnings && (
                  <div className="flex items-center gap-2 text-[#ffb829]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
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
