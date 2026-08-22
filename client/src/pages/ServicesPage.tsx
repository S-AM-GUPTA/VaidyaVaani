import { useNavigate, Link } from 'react-router-dom';
import { 
  HeartPulse, 
  Activity, 
  FileSpreadsheet, 
  Pill, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Phone,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const DEPARTMENTS = [
  {
    icon: Pill,
    title: 'Generic Salt Equivalence & Pricing',
    desc: 'Verify identical active pharmaceutical ingredients (API) across top pharmacies and find bioequivalent generic alternatives that save up to 80%.',
    features: ['Active salt mapping', 'Price comparison across 7 pharmacies', 'Direct percentage savings calculation'],
    link: '/'
  },
  {
    icon: ShieldCheck,
    title: 'Multi-Doctor Prescription Cross-Audit',
    desc: 'Screen medications prescribed by different doctors to detect dangerous pharmacokinetic clashes, blood-thinning hazards, and dosing intervals.',
    features: ['Drug-drug interaction screening', 'Bioavailability spacing rules', 'Adverse interaction alerts'],
    link: '/safety-matrix'
  },
  {
    icon: FileSpreadsheet,
    title: 'Pathology & Lab Biomarker Decoder',
    desc: 'Translate complex blood tests, fasting glucose, HbA1c, lipid profiles, and kidney function tests into normal range reference indicators.',
    features: ['Biomarker range indicators', 'Diagnostic status classification', 'Actionable lifestyle tips'],
    link: '/lab-decoder'
  },
  {
    icon: HeartPulse,
    title: 'Cardiovascular & Blood Pressure Safety',
    desc: 'Track blood pressure medications, beta-blockers, and lipid statins with strict dietary spacing rules.',
    features: ['Beta-blocker antacid spacing alerts', 'Statin dietary timing checks', 'Longitudinal vitals history'],
    link: '/safety-matrix'
  },
  {
    icon: Activity,
    title: 'Endocrinology & Diabetes Tracking',
    desc: 'Monitor blood sugar baselines, HbA1c averages, and oral hypoglycemic drug timing with hypoglycemia prevention guidance.',
    features: ['Glycemic range evaluations', 'Meal timing reminders', 'Hypoglycemia precautions'],
    link: '/lab-decoder'
  },
  {
    icon: Users,
    title: 'Family Health Vault & Emergency SOS',
    desc: 'Unified health records and emergency contacts for family members and dependents with client-side zero-knowledge encryption.',
    features: ['Family profile switcher', 'Emergency SOS hotline access', 'Encrypted JSON key export'],
    link: '/profile'
  },
];

const ServicesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        
        {/* Page Header */}
        <section className="bg-white border-b border-slate-200 py-10 px-6 lg:px-12">
          <div className="max-w-[1280px] mx-auto">
            
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-4">
              <Link to="/" className="hover:text-emerald-600">Home</Link>
              <span>/</span>
              <span className="text-emerald-700 font-bold">Services</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="med-badge mb-2 font-mono">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Clinical Modules
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-headline">
                  Healthcare Safety & Intelligence Modules
                </h1>
                <p className="text-slate-600 text-sm mt-2 max-w-2xl leading-relaxed">
                  Explore how VaidyaVaani protects your health with generic medicine savings, multi-doctor interaction checks, and diagnostic report decoders.
                </p>
              </div>

              <button 
                onClick={() => navigate(isAuthenticated ? '/home' : '/login')}
                className="btn-med-primary text-xs font-semibold shrink-0 cursor-pointer"
              >
                <span>{isAuthenticated ? 'Open Dashboard' : 'Access Health Vault'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 px-6 lg:px-12 max-w-[1280px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {DEPARTMENTS.map((dept, i) => {
              const Icon = dept.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 border border-emerald-100">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">{dept.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">{dept.desc}</p>
                  </div>

                  <div>
                    <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-700 font-medium mb-6">
                      {dept.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate(dept.link)}
                      className="w-full btn-med-secondary text-xs font-semibold cursor-pointer"
                    >
                      <span>Explore Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emergency 24/7 Callout Banner */}
          <div className="bg-emerald-700 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-xs uppercase font-mono tracking-wider text-emerald-200 font-bold">24/7 Emergency Medical Hotline</div>
                <h3 className="text-2xl font-bold text-white">National Ambulance: 108 / 102</h3>
              </div>
            </div>

            <button 
              onClick={() => navigate(isAuthenticated ? '/home' : '/login')}
              className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-6 py-3 rounded-xl text-sm shrink-0 transition-colors shadow-xs cursor-pointer"
            >
              Open Health Vault
            </button>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
