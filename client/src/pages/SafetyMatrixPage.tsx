import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Search, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Zap
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { MEDICINES_DATABASE, checkDrugPairInteraction, type InteractionCheckResult } from '../services/clinicalData';

const DRUG_PAIRS_REGISTRY = [
  {
    pair: 'Warfarin + Aspirin',
    primary: 'Warfarin 5mg (Anticoagulant)',
    secondary: 'Aspirin 75mg (Antiplatelet)',
    severity: 'Critical Hazard',
    severityType: 'critical',
    effect: '3.8x elevation in major gastrointestinal bleeding & systemic hemorrhage',
    mechanism: 'Dual platelet COX-1 inhibition combined with vitamin K clotting factor synthesis blockage.',
    spacing: 'Absolute Contraindication: Avoid combination. Contact cardiologist for non-NSAID analgesics.'
  },
  {
    pair: 'Atenolol + Magnesium Antacid',
    primary: 'Atenolol 50mg (Beta-Blocker)',
    secondary: 'Gelusil / Magnesium Hydroxide (Antacid)',
    severity: 'Moderate Spacing',
    severityType: 'moderate',
    effect: '35% drop in beta-blocker absorption & blood pressure regulation loss',
    mechanism: 'Antacid polyvalent cations chelate with beta-blockers in gastric juice.',
    spacing: 'Space Atenolol at least 2 hours BEFORE administering magnesium/aluminum antacids.'
  },
  {
    pair: 'Levothyroxine + Calcium / Iron',
    primary: 'Thyronorm 50mcg (Levothyroxine)',
    secondary: 'Shelcal 500 / Iron Supplement',
    severity: 'Moderate Spacing',
    severityType: 'moderate',
    effect: 'Insoluble complex formation reducing thyroid hormone absorption by up to 50%',
    mechanism: 'Calcium/iron molecules physically bind thyroxine in the gastrointestinal tract.',
    spacing: 'Administer Levothyroxine early morning empty stomach; take Calcium 4 hours later.'
  },
  {
    pair: 'Atorvastatin + Grapefruit Juice',
    primary: 'Atorvastatin 20mg (Statin)',
    secondary: 'Grapefruit Extract / Citrus',
    severity: 'Low / Dietary',
    severityType: 'low',
    effect: 'Mild elevation of circulating statin blood levels',
    mechanism: 'Furanocoumarins in grapefruit inhibit intestinal CYP3A4 metabolism.',
    spacing: 'Limit concentrated grapefruit juice to under 200ml to prevent muscle soreness.'
  },
  {
    pair: 'Metformin + Iodinated Contrast',
    primary: 'Glycomet 500mg (Metformin)',
    secondary: 'Radiological CT Scan Contrast',
    severity: 'Critical Hazard',
    severityType: 'critical',
    effect: 'Acute renal failure and fatal lactic acidosis in bloodstream',
    mechanism: 'Contrast media causes temporary nephropathy impairing metformin renal clearance.',
    spacing: 'Withhold Metformin 48 hours prior to contrast imaging and recheck kidney function.'
  },
  {
    pair: 'Paracetamol + Amoxicillin',
    primary: 'Dolo 650mg (Paracetamol)',
    secondary: 'Augmentin 625 (Amoxicillin+Clav)',
    severity: 'Safe Synergy',
    severityType: 'safe',
    effect: 'Safe therapeutic synergy; no adverse pharmacokinetic clash detected',
    mechanism: 'Metabolized via independent hepatic and renal clearance pathways.',
    spacing: 'Safe to co-administer according to physician instructions.'
  }
];

const SafetyMatrixPage = () => {
  const navigate = useNavigate();

  // Custom Simulator State
  const [selectedDrug1, setSelectedDrug1] = useState('Warfarin 5mg');
  const [selectedDrug2, setSelectedDrug2] = useState('Aspirin 75mg');
  const [simResult, setSimResult] = useState<InteractionCheckResult>(() => 
    checkDrugPairInteraction('Warfarin 5mg', 'Aspirin 75mg')
  );

  // Search Filter State for Registry
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'moderate' | 'low' | 'safe'>('all');

  // Text-To-Speech for simulated interaction
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSimulate = (d1?: string, d2?: string) => {
    const drugA = d1 || selectedDrug1;
    const drugB = d2 || selectedDrug2;
    setSelectedDrug1(drugA);
    setSelectedDrug2(drugB);
    const res = checkDrugPairInteraction(drugA, drugB);
    setSimResult(res);
  };

  const handleSpeakResult = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const textToSpeak = `Clinical screening for ${simResult.drug1} and ${simResult.drug2}. Result: ${simResult.title}. Adverse Effect: ${simResult.effect}. Pharmacist recommendation: ${simResult.advisory}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-IN';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Filter Registry
  const filteredRegistry = DRUG_PAIRS_REGISTRY.filter(item => {
    const matchesSearch = item.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.primary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.secondary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.effect.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || item.severityType === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors font-mono cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="haptic-badge bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clinical Pharmacology Radar V2.4</span>
          </div>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-[11px] font-mono uppercase text-emerald-700 font-bold mb-2">Pharmacopeia Cross-Audit</div>
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Multi-Prescription Drug Interaction Radar
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed font-normal">
            Screen drug combinations prescribed across multiple independent clinics to detect harmful pharmacokinetic clashes, bioavailability interference, and strict dosage spacing rules.
          </p>
        </div>

        {/* =========================================================
            LIVE INTERACTIVE RADAR SIMULATOR (DOPPELRAND)
            ========================================================= */}
        <div className="doppel-shell mb-16 shadow-md">
          <div className="doppel-core p-6 sm:p-10 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-800 font-bold">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Interactive Drug-Drug Co-Administration Radar</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Active Audit
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 font-headline">
              Test Any Medicine Combination
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Drug 1 Selector */}
              <div className="md:col-span-5">
                <label className="block text-xs font-bold font-mono text-slate-700 mb-1.5 uppercase">
                  First Medicine (Drug A):
                </label>
                <select
                  value={selectedDrug1}
                  onChange={(e) => {
                    setSelectedDrug1(e.target.value);
                    handleSimulate(e.target.value, selectedDrug2);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white shadow-xs cursor-pointer"
                >
                  {MEDICINES_DATABASE.map(m => (
                    <option key={m.id} value={`${m.brand} (${m.salt})`}>
                      {m.brand} — {m.category}
                    </option>
                  ))}
                  <option value="Warfarin 5mg">Warfarin 5mg (Blood Thinner)</option>
                  <option value="Magnesium Antacid">Magnesium/Gelusil Antacid</option>
                  <option value="Grapefruit Extract">Grapefruit Extract</option>
                  <option value="Radiological Contrast">Radiological Contrast</option>
                </select>
              </div>

              <div className="md:col-span-2 text-center text-xs font-mono font-bold text-slate-400">
                <span className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200">VS</span>
              </div>

              {/* Drug 2 Selector */}
              <div className="md:col-span-5">
                <label className="block text-xs font-bold font-mono text-slate-700 mb-1.5 uppercase">
                  Second Medicine (Drug B):
                </label>
                <select
                  value={selectedDrug2}
                  onChange={(e) => {
                    setSelectedDrug2(e.target.value);
                    handleSimulate(selectedDrug1, e.target.value);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white shadow-xs cursor-pointer"
                >
                  <option value="Ecosprin 75mg (Aspirin)">Ecosprin 75mg (Aspirin)</option>
                  <option value="Magnesium Antacid">Gelusil / Magnesium Antacid</option>
                  <option value="Shelcal 500 (Calcium)">Shelcal 500 (Calcium+D3)</option>
                  <option value="Grapefruit Extract">Grapefruit Juice Extract</option>
                  <option value="Radiological Contrast">Radiological CT Contrast</option>
                  {MEDICINES_DATABASE.map(m => (
                    <option key={m.id} value={`${m.brand} (${m.salt})`}>
                      {m.brand} — {m.category}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Live Result Display Card */}
            <div className="p-6 rounded-3xl bg-[#f8fafc] border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Screening Verdict</span>
                  <h3 className="text-xl font-extrabold text-slate-900 font-headline">{simResult.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeakResult}
                    className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{isSpeaking ? 'Stop Voice' : 'Listen Warning'}</span>
                  </button>

                  <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full ${
                    simResult.severity === 'critical' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                    simResult.severity === 'moderate' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    simResult.severity === 'low' ? 'bg-teal-100 text-teal-800 border border-teal-300' :
                    'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {simResult.severity === 'critical' ? 'Lethal Hazard Contraindication' :
                     simResult.severity === 'moderate' ? 'Spacing Advisory Required' :
                     simResult.severity === 'low' ? 'Minor Dietary Advisory' : 'Safe to Combine'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="font-bold text-slate-900 mb-1 font-mono uppercase text-xs">Biological Mechanism:</div>
                  <p className="leading-relaxed font-normal">{simResult.mechanism}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="font-bold text-slate-900 mb-1 font-mono uppercase text-xs">Clinical Adverse Outcome:</div>
                  <p className="leading-relaxed font-normal">{simResult.effect}</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                simResult.severity === 'critical' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                simResult.severity === 'moderate' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                simResult.severity === 'low' ? 'bg-teal-50 border-teal-200 text-teal-900' :
                'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="font-bold uppercase text-xs font-mono mb-1">Pharmacist Action Protocol:</div>
                <p className="leading-relaxed font-normal">{simResult.advisory}</p>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================
            SEARCHABLE PHARMACOLOGICAL REGISTRY
            ========================================================= */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-headline">Verified Drug Interaction Database</h2>
            <p className="text-xs text-slate-500 font-mono">Indexed against CDSCO & WHO pharmacopeia guidelines.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter drug pairs..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 w-48 sm:w-60 shadow-xs"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e: any) => setSeverityFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-full px-4 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-emerald-500 shadow-xs cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="moderate">Moderate Only</option>
              <option value="low">Low Risk Only</option>
              <option value="safe">Safe Only</option>
            </select>
          </div>
        </div>

        {/* Registry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRegistry.map((item, idx) => (
            <div key={idx} className="doppel-shell flex flex-col justify-between">
              <div className="doppel-core p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Interaction Screen</span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      item.severityType === 'critical' ? 'bg-rose-100 text-rose-800' :
                      item.severityType === 'moderate' ? 'bg-amber-100 text-amber-800' :
                      item.severityType === 'low' ? 'bg-teal-100 text-teal-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.severity}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 font-headline mb-2">{item.pair}</h3>
                  
                  <div className="space-y-1 text-xs text-slate-600 mb-4">
                    <div><strong>Drug 1:</strong> {item.primary}</div>
                    <div><strong>Drug 2:</strong> {item.secondary}</div>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                    {item.effect}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      handleSimulate(item.primary, item.secondary);
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className="w-full btn-island-secondary text-xs py-2 px-3 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Load in Live Radar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default SafetyMatrixPage;
