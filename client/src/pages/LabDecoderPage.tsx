import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Volume2, 
  VolumeX, 
  Activity, 
  Sliders, 
  Sparkles
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { BIOMARKERS_EVALUATOR } from '../services/clinicalData';

interface LabReferenceItem {
  name: string;
  category: string;
  normalRange: string;
  unit: string;
  elevatedRisk: string;
  lowRisk: string;
  clinicalNote: string;
}

const LAB_REFERENCE_CATALOG: LabReferenceItem[] = [
  {
    name: 'Fasting Blood Sugar (FBS)',
    category: 'Endocrinology / Diabetes',
    normalRange: '70 – 99',
    unit: 'mg/dL',
    elevatedRisk: 'Prediabetes (100–125), Diabetes Mellitus (≥126)',
    lowRisk: 'Hypoglycemia (<70)',
    clinicalNote: 'Requires 8-12 hours of overnight water-only fasting for accurate glycemic baseline.'
  },
  {
    name: 'Glycated Hemoglobin (HbA1c)',
    category: 'Endocrinology / Diabetes',
    normalRange: '4.0 – 5.6',
    unit: '%',
    elevatedRisk: 'Prediabetes (5.7–6.4%), Diabetes Mellitus (≥6.5%)',
    lowRisk: 'Hemolytic Anemia / Low Red Cell Turnover',
    clinicalNote: 'Reflects 90-day average blood glucose saturation without requiring fasting.'
  },
  {
    name: 'LDL Cholesterol (Bad Cholesterol)',
    category: 'Lipid Profile / Cardiology',
    normalRange: '< 100',
    unit: 'mg/dL',
    elevatedRisk: 'Atherosclerosis, Coronary Artery Disease, Stroke',
    lowRisk: 'Malnutrition / Severe Hepatic Insufficiency',
    clinicalNote: 'Target LDL is <70 mg/dL for patients with established cardiovascular history.'
  },
  {
    name: 'HDL Cholesterol (Good Cholesterol)',
    category: 'Lipid Profile / Cardiology',
    normalRange: '> 40 (Men), > 50 (Women)',
    unit: 'mg/dL',
    elevatedRisk: 'Protective against coronary heart disease',
    lowRisk: 'Elevated cardiovascular risk profile',
    clinicalNote: 'Increased via regular aerobic exercise, healthy fats (almonds, olive oil).'
  },
  {
    name: 'Serum Creatinine',
    category: 'Renal Function (KFT)',
    normalRange: '0.6 – 1.2',
    unit: 'mg/dL',
    elevatedRisk: 'Acute or Chronic Kidney Disease (CKD), Dehydration',
    lowRisk: 'Decreased muscle mass / Myasthenia',
    clinicalNote: 'Essential indicator of glomerular filtration rate (eGFR) and renal clearance.'
  },
  {
    name: 'Hemoglobin (Hb)',
    category: 'Complete Blood Count (CBC)',
    normalRange: '13.0 – 17.0 (Men), 12.0 – 15.5 (Women)',
    unit: 'g/dL',
    elevatedRisk: 'Polycythemia, Chronic Hypoxia, Dehydration',
    lowRisk: 'Iron Deficiency Anemia, Blood Loss',
    clinicalNote: 'Carries oxygen from lungs to systemic organs; essential during pregnancy & fatigue audits.'
  }
];

const LabDecoderPage = () => {
  const navigate = useNavigate();

  // Interactive Live Tester State
  const [selectedBiomarkerKey, setSelectedBiomarkerKey] = useState<'glucose' | 'hba1c' | 'ldl' | 'creatinine'>('glucose');
  const [testValue, setTestValue] = useState<number>(115);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentBio = BIOMARKERS_EVALUATOR[selectedBiomarkerKey];
  const evalResult = currentBio.evaluate(testValue);

  // Presets
  const handleLoadPreset = (key: 'glucose' | 'hba1c' | 'ldl' | 'creatinine', val: number) => {
    setSelectedBiomarkerKey(key);
    setTestValue(val);
  };

  // Text-To-Speech
  const handleSpeakAnalysis = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const text = `${currentBio.name} measured at ${testValue} ${currentBio.unit}. Result is ${evalResult.label}. Explanation: ${evalResult.explanation}. Lifestyle recommendation: ${evalResult.lifestyleTip}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Filter reference items
  const filteredCatalog = LAB_REFERENCE_CATALOG.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.elevatedRisk.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors font-mono cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="med-badge font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>NABL Pathology Diagnostic Matrix</span>
          </div>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono uppercase text-emerald-700 font-bold mb-2">Pathology Biomarker Intelligence</div>
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Lab Report Diagnostic & Biomarker Decoder
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Translate complex pathology blood test values into clear clinical understanding, normal reference ranges, and actionable physician lifestyle guidance.
          </p>
        </div>

        {/* =========================================================
            INTERACTIVE LIVE BIOMARKER DECODER TOOL
            ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-16">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-700 font-bold mb-3">
            <Sliders className="w-4 h-4 text-emerald-600" />
            Interactive Blood Test Diagnostic Simulator
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Input Your Pathology Test Value
          </h2>

          {/* Biomarker Selector Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => {
                setSelectedBiomarkerKey('glucose');
                setTestValue(115);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                selectedBiomarkerKey === 'glucose' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Fasting Glucose (Sugar)
            </button>
            <button
              onClick={() => {
                setSelectedBiomarkerKey('hba1c');
                setTestValue(6.1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                selectedBiomarkerKey === 'hba1c' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              HbA1c (3-Month Avg)
            </button>
            <button
              onClick={() => {
                setSelectedBiomarkerKey('ldl');
                setTestValue(135);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                selectedBiomarkerKey === 'ldl' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              LDL Cholesterol (Lipid)
            </button>
            <button
              onClick={() => {
                setSelectedBiomarkerKey('creatinine');
                setTestValue(1.3);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                selectedBiomarkerKey === 'creatinine' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Serum Creatinine (Kidney)
            </button>
          </div>

          {/* Value Slider & Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
            
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono font-bold uppercase text-slate-500">
                  {currentBio.name} Value:
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {testValue} <span className="text-sm text-slate-500 font-normal">{currentBio.unit}</span>
                </span>
              </div>

              <input 
                type="range"
                min={selectedBiomarkerKey === 'hba1c' ? '3.5' : selectedBiomarkerKey === 'creatinine' ? '0.4' : '40'}
                max={selectedBiomarkerKey === 'hba1c' ? '12.0' : selectedBiomarkerKey === 'creatinine' ? '4.0' : '300'}
                step={selectedBiomarkerKey === 'hba1c' ? '0.1' : selectedBiomarkerKey === 'creatinine' ? '0.1' : '1'}
                value={testValue}
                onChange={(e) => setTestValue(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 font-bold">
                <span>Standard Range: {currentBio.normalMin} – {currentBio.normalMax} {currentBio.unit}</span>
              </div>

              {/* Sample Presets */}
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-2">
                <span className="text-[11px] font-mono text-slate-500 self-center font-bold">Presets:</span>
                <button
                  onClick={() => setTestValue(selectedBiomarkerKey === 'glucose' ? 88 : selectedBiomarkerKey === 'hba1c' ? 5.2 : selectedBiomarkerKey === 'ldl' ? 85 : 0.9)}
                  className="text-[11px] font-mono px-2 py-1 bg-white border border-slate-200 rounded text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                >
                  Optimal Normal
                </button>
                <button
                  onClick={() => setTestValue(selectedBiomarkerKey === 'glucose' ? 112 : selectedBiomarkerKey === 'hba1c' ? 6.1 : selectedBiomarkerKey === 'ldl' ? 122 : 1.4)}
                  className="text-[11px] font-mono px-2 py-1 bg-white border border-slate-200 rounded text-amber-700 hover:bg-amber-50 cursor-pointer"
                >
                  Borderline / Mild
                </button>
                <button
                  onClick={() => setTestValue(selectedBiomarkerKey === 'glucose' ? 168 : selectedBiomarkerKey === 'hba1c' ? 8.4 : selectedBiomarkerKey === 'ldl' ? 175 : 2.4)}
                  className="text-[11px] font-mono px-2 py-1 bg-white border border-slate-200 rounded text-rose-700 hover:bg-rose-50 cursor-pointer"
                >
                  High / Alert
                </button>
              </div>
            </div>

            {/* Analysis Result Card */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Pathology Evaluation</span>
                  <h3 className="text-lg font-bold text-slate-900">{evalResult.label}</h3>
                </div>

                <button
                  onClick={handleSpeakAnalysis}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Listen Report'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {evalResult.explanation}
              </p>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900">
                <div className="font-bold uppercase text-[11px] font-mono mb-0.5">Clinical & Lifestyle Advisory:</div>
                <p>{evalResult.lifestyleTip}</p>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================
            PATHOLOGY LAB REFERENCE CATALOG
            ========================================================= */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Diagnostic Blood Marker Reference Catalog</h2>
            <p className="text-xs text-slate-500">Standardized clinical norms & diagnostic alert criteria.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter blood tests..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Departments</option>
              <option value="Diabetes">Diabetes / Endocrinology</option>
              <option value="Cardiology">Cardiology / Lipids</option>
              <option value="Renal">Renal Function (KFT)</option>
              <option value="CBC">Complete Blood Count (CBC)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalog.map((item, idx) => (
            <div key={idx} className="med-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">{item.category}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Normal: {item.normalRange} {item.unit}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.name}</h3>

                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <strong>Elevated Indicator:</strong> {item.elevatedRisk}
                  </div>
                  <p className="text-slate-500 leading-relaxed">{item.clinicalNote}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (item.name.includes('Glucose')) handleLoadPreset('glucose', 110);
                    else if (item.name.includes('HbA1c')) handleLoadPreset('hba1c', 6.0);
                    else if (item.name.includes('LDL')) handleLoadPreset('ldl', 130);
                    else if (item.name.includes('Creatinine')) handleLoadPreset('creatinine', 1.3);
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
                  className="w-full btn-med-secondary text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Test in Simulator</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default LabDecoderPage;
