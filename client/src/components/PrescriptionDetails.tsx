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

  if (loading) return <div className="p-4 text-[var(--color-text-secondary)]">Loading extracted medicines...</div>;

  if (medicines.length === 0) return (
    <div className="p-4 text-[var(--color-text-secondary)]">No medicines were detected in this prescription.</div>
  );

  return (
    <div className="mt-4 space-y-4">
      <h3 className="font-semibold text-[var(--color-text-primary)]">Extracted Medicines</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicines.map((med) => (
          <div key={med._id} className="bg-white border border-[var(--color-border)] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-[var(--color-medical-blue)] flex items-center">
                <Pill className="w-4 h-4 mr-2" />
                {med.name}
              </h4>
              <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-700">{med.dosage || 'N/A'}</span>
            </div>
            
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">{med.purpose}</p>
            
            <div className="space-y-2">
              {med.timing && (
                <div className="flex items-center text-xs text-gray-600">
                  <Clock className="w-3.5 h-3.5 mr-2 text-[var(--color-medical-blue)]" /> {med.timing}
                </div>
              )}
              {med.foodInstructions && (
                <div className="flex items-center text-xs text-gray-600">
                  <Utensils className="w-3.5 h-3.5 mr-2 text-[var(--color-status-warning)]" /> {med.foodInstructions}
                </div>
              )}
              {med.warnings && (
                <div className="flex items-center text-xs text-red-600 bg-red-50 p-1.5 rounded">
                  <AlertTriangle className="w-3.5 h-3.5 mr-2 shrink-0" /> {med.warnings}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionDetails;
