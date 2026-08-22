import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Activity, 
  Search, 
  UploadCloud 
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

interface BiomarkerTest {
  name: string;
  category: string;
  normalRange: string;
  unit: string;
  significance: string;
  sampleVal: string;
  status: 'normal' | 'elevated' | 'optimal';
}

const BIOMARKERS_LIST: BiomarkerTest[] = [
  {
    name: 'Hemoglobin A1c (HbA1c)',
    category: 'Endocrinology / Diabetes',
    normalRange: '< 5.7',
    unit: '%',
    significance: 'Reflects average blood glucose concentrations over the previous 90-120 days.',
    sampleVal: '5.4%',
    status: 'normal'
  },
  {
    name: 'Fasting Blood Glucose',
    category: 'Metabolic Panel',
    normalRange: '70 – 99',
    unit: 'mg/dL',
    significance: 'Measures circulating blood sugar after an overnight fast (minimum 8 hours).',
    sampleVal: '108 mg/dL',
    status: 'elevated'
  },
  {
    name: 'LDL Cholesterol (Direct)',
    category: 'Lipid Profile',
    normalRange: '< 100',
    unit: 'mg/dL',
    significance: 'Primary clinical indicator for arterial plaque buildup and cardiovascular risk.',
    sampleVal: '94 mg/dL',
    status: 'optimal'
  },
  {
    name: 'HDL Cholesterol (Good)',
    category: 'Lipid Profile',
    normalRange: '> 40 (Male) / > 50 (Female)',
    unit: 'mg/dL',
    significance: 'Scavenges excess cholesterol from arteries and returns it to the liver.',
    sampleVal: '52 mg/dL',
    status: 'optimal'
  },
  {
    name: 'Total Leukocyte Count (WBC)',
    category: 'Complete Blood Count (CBC)',
    normalRange: '4,500 – 11,000',
    unit: '/µL',
    significance: 'Primary immune cells indicating inflammation, viral infection, or immune activation.',
    sampleVal: '7,200 /µL',
    status: 'normal'
  },
  {
    name: 'Serum Creatinine',
    category: 'Renal / Kidney Function (KFT)',
    normalRange: '0.7 – 1.3',
    unit: 'mg/dL',
    significance: 'Waste product filtered exclusively by kidney glomeruli to evaluate renal clearance.',
    sampleVal: '0.9 mg/dL',
    status: 'normal'
  },
  {
    name: 'Serum Alanine Aminotransferase (ALT/SGPT)',
    category: 'Liver Function Test (LFT)',
    normalRange: '7 – 56',
    unit: 'U/L',
    significance: 'Enzyme concentrated in hepatocytes; elevated in liver strain or medication toxicity.',
    sampleVal: '28 U/L',
    status: 'normal'
  },
  {
    name: 'Thyroid Stimulating Hormone (TSH)',
    category: 'Endocrinology / Thyroid',
    normalRange: '0.4 – 4.0',
    unit: 'µIU/mL',
    significance: 'Pituitary signal regulating thyroid hormone synthesis for metabolic control.',
    sampleVal: '2.1 µIU/mL',
    status: 'normal'
  },
];

const LabDecoderPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Metabolic Panel', 'Lipid Profile', 'Complete Blood Count (CBC)', 'Renal / Kidney Function (KFT)', 'Liver Function Test (LFT)'];

  const filteredTests = BIOMARKERS_LIST.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || b.category.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

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
              <span className="text-sky-700 font-bold">Lab Report Decoder</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="med-badge mb-2 font-mono">
                  <Activity className="w-3.5 h-3.5" />
                  Pathology & Biomarker Analysis
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Clinical Lab Report & Diagnostic Decoder
                </h1>
                <p className="text-slate-600 text-sm mt-2 max-w-2xl leading-relaxed">
                  Understand your blood test numbers, reference boundaries, and clinical parameters in everyday language with zero medical jargon.
                </p>
              </div>

              <button 
                onClick={() => navigate(isAuthenticated ? '/home' : '/login')}
                className="btn-med-primary text-xs font-semibold shrink-0"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isAuthenticated ? 'Upload My Lab Report' : 'Sign In to Decode Report'}</span>
              </button>
            </div>

          </div>
        </section>

        {/* Diagnostic Reference Explorer */}
        <section className="py-12 px-6 lg:px-12 max-w-[1280px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-sky-600 text-white shadow-xs' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search biomarker (e.g. Glucose)..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          {/* Biomarkers Data Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredTests.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-sky-300 hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">{item.category}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'elevated' ? 'bg-amber-100 text-amber-800' :
                      'bg-teal-100 text-teal-800'
                    }`}>
                      {item.status === 'elevated' ? 'Slightly Elevated' : 'Normal Reference'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.significance}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-500">
                    <span>Standard Reference Norm:</span>
                    <strong className="text-slate-900">{item.normalRange} {item.unit}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Typical Patient Level:</span>
                    <span className={item.status === 'elevated' ? 'text-amber-700 font-bold' : 'text-teal-700 font-bold'}>
                      {item.sampleVal}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ingestion Pipeline Explanation */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4">How Pathology Ingestion Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs mb-3 font-mono">
                  01
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">OCR Document Scanning</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Extracts printed pathology tables from camera photographs, scanned PDFs, and hospital lab printouts.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs mb-3 font-mono">
                  02
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Norm Boundary Matching</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Compares individual values against verified medical laboratory reference ranges for age and gender.
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs mb-3 font-mono">
                  03
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Plain Language Summary</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates an easy-to-read summary with voice playback in your chosen regional Indian dialect.
                </p>
              </div>

            </div>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
};

export default LabDecoderPage;
