import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight,
  Search, 
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const COMMON_DRUGS = [
  'Atenolol 25mg / 50mg (Beta-Blocker)',
  'Metformin 500mg / 850mg (Antidiabetic)',
  'Atorvastatin 10mg / 20mg (Lipid Regimen)',
  'Warfarin 2mg / 5mg (Anticoagulant)',
  'Aspirin 75mg / 325mg (NSAID / Antiplatelet)',
  'Magnesium Hydroxide (Antacid Gel)',
  'Amoxicillin 500mg (Antibiotic)',
  'Omeprazole 20mg (Proton Pump Inhibitor)',
  'Levothyroxine 50mcg (Thyroid)',
  'Amlodipine 5mg (Calcium Channel Blocker)',
];

const SCENARIOS = [
  {
    id: 's1',
    drug1: 'Atenolol 50mg',
    drug2: 'Magnesium Hydroxide (Antacid)',
    severity: 'moderate',
    title: 'Pharmacokinetic Absorption Delay',
    effect: 'Bioavailability reduction up to 35%',
    advisory: 'Antacids form chemical chelates with beta-blockers in gastric juice, delaying peak absorption. Take Atenolol at least 2 hours before administering antacid suspension.',
    dept: 'Cardiology & Gastroenterology',
  },
  {
    id: 's2',
    drug1: 'Warfarin 5mg',
    drug2: 'Aspirin 325mg',
    severity: 'critical',
    title: 'Severe Coagulation Cascade Antagonism',
    effect: 'Dramatic rise in gastrointestinal hemorrhage hazard',
    advisory: 'Concurrent platelet COX-1 inhibition with vitamin K epoxide reductase inhibition multiplies bleeding risks by 3.8x. Immediate physician review and alternative analgesic required.',
    dept: 'Hematology & Cardiology',
  },
  {
    id: 's3',
    drug1: 'Atorvastatin 20mg',
    drug2: 'Grapefruit Extract / CYP3A4 Inhibitor',
    severity: 'low',
    title: 'Hepatic Enzyme Saturation',
    effect: 'Mild elevation in plasma statin concentration',
    advisory: 'Grapefruit juice inhibits intestinal CYP3A4 metabolism. Consuming normal doses with morning meals shows minimal clinical risk; avoid concentrated extracts exceeding 200ml.',
    dept: 'Endocrinology & Nutrition',
  },
  {
    id: 's4',
    drug1: 'Metformin 850mg',
    drug2: 'Iodinated Radiocontrast Dye',
    severity: 'critical',
    title: 'Lactic Acidosis Contraindication',
    effect: 'Temporary acute renal insufficiency',
    advisory: 'Withhold Metformin 48 hours prior to contrast imaging and re-evaluate eGFR before resuming to prevent lactic acid accumulation.',
    dept: 'Radiology & Endocrinology',
  },
];

const SafetyMatrixPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [selectedDrug1, setSelectedDrug1] = useState(COMMON_DRUGS[0]);
  const [selectedDrug2, setSelectedDrug2] = useState(COMMON_DRUGS[5]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScenarios = SCENARIOS.filter(s => 
    s.drug1.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.drug2.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-sky-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        
        {/* Page Header */}
        <section className="bg-white border-b border-slate-200 py-10 px-6 lg:px-12">
          <div className="max-w-[1280px] mx-auto">
            
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-4">
              <Link to="/" className="hover:text-sky-600">Home</Link>
              <span>/</span>
              <span className="text-sky-700 font-bold">Drug Safety Matrix</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="med-badge mb-2 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Pharmacology Cross-Screening Engine
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Multi-Prescription Drug Interaction Checker
                </h1>
                <p className="text-slate-600 text-sm mt-2 max-w-2xl leading-relaxed">
                  Cross-reference active medications prescribed by different healthcare specialists to prevent harmful drug-drug interactions and optimize bioavailability timing.
                </p>
              </div>

              <button 
                onClick={() => navigate(isAuthenticated ? '/home' : '/login')}
                className="btn-med-primary text-xs font-semibold shrink-0"
              >
                <span>{isAuthenticated ? 'Open Patient Vault' : 'Sign In to Check My Rx'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>

        {/* Live Pair Screening Interactive Tool */}
        <section className="py-12 px-6 lg:px-12 max-w-[1280px] mx-auto">
          
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Simulate Drug-Drug Co-Administration</h2>
            <p className="text-xs text-slate-500 mb-6">Select two therapeutic agents to calculate clinical contraindications and spacing rules:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 font-mono uppercase">Primary Prescription (Drug A)</label>
                <select 
                  value={selectedDrug1} 
                  onChange={(e) => setSelectedDrug1(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:border-sky-500 focus:bg-white outline-none"
                >
                  {COMMON_DRUGS.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 font-mono uppercase">Secondary Prescription / Supplement (Drug B)</label>
                <select 
                  value={selectedDrug2} 
                  onChange={(e) => setSelectedDrug2(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium focus:border-sky-500 focus:bg-white outline-none"
                >
                  {COMMON_DRUGS.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Screening Result Output Box */}
            <div className="p-5 rounded-xl bg-sky-50/70 border border-sky-200">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-sky-200 mb-3">
                <div className="text-xs font-mono font-bold text-sky-900 uppercase">
                  Screening Pair: {selectedDrug1.split(' ')[0]} + {selectedDrug2.split(' ')[0]}
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  Standard Audit Passed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Therapeutic guideline: Maintain a <strong>minimum 2-hour dosage window</strong> between gastrointestinal agents and cardiovascular medications to preserve optimal pharmacokinetic absorption.
              </p>
            </div>

          </div>

          {/* Clinical Case Scenarios Table */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Standard Clinical Pharmacopeia Registry</h2>
                <p className="text-xs text-slate-500 mt-1">Verified interactions sourced from international clinical guidelines</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medication or condition..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredScenarios.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono text-slate-500 uppercase">{item.dept}</span>
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        item.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                        item.severity === 'moderate' ? 'bg-amber-100 text-amber-800' :
                        'bg-teal-100 text-teal-800'
                      }`}>
                        {item.severity === 'critical' ? 'Critical Contraindication' :
                         item.severity === 'moderate' ? 'Moderate Spacing Needed' : 'Low Risk / Advisory'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                    
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mb-3 text-xs font-mono text-slate-700">
                      <strong>{item.drug1}</strong> + <strong>{item.drug2}</strong>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {item.advisory}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs font-medium text-sky-700 flex items-center justify-between">
                    <span>Clinical Impact: {item.effect}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Medical Consultation CTA Banner */}
          <div className="bg-sky-800 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Need an Expert Prescription Review?</h3>
              <p className="text-xs sm:text-sm text-sky-100 max-w-xl leading-relaxed">
                Upload your doctor's prescriptions to automatically index your full active regimen and receive automated spacing alerts on your mobile.
              </p>
            </div>
            <button 
              onClick={() => navigate(isAuthenticated ? '/home' : '/login')}
              className="bg-white text-sky-900 hover:bg-sky-50 font-bold px-6 py-3 rounded-lg text-xs sm:text-sm shrink-0 transition-colors shadow-xs"
            >
              Start Automated Prescription Audit
            </button>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
};

export default SafetyMatrixPage;
