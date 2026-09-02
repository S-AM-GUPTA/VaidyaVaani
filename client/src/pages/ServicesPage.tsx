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
    features: ['Active salt mapping', 'Price comparison across pharmacies', 'Direct percentage savings calculation'],
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
    desc: 'Unified health records and emergency contacts for family members and dependents with isolated patient vault security.',
    features: ['Family profile switcher', 'Emergency SOS hotline access', 'Encrypted JSON export'],
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
        <section className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1240px] mx-auto text-left">
            
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-4">
              <Link to="/" className="hover:text-emerald-600">Home</Link>
              <span>/</span>
              <span className="text-emerald-700 font-bold">Services</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="haptic-badge bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Clinical Intelligence Modules</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-headline">
                  Healthcare Safety & Intelligence Modules
                </h1>
                <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed font-normal">
                  Explore how VaidyaVaani protects your health with generic medicine savings, multi-doctor interaction checks, and diagnostic report decoders.
                </p>
              </div>

              <button 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="btn-island-primary text-xs py-2.5 pl-5 pr-2 group shrink-0 cursor-pointer"
              >
                <span>{isAuthenticated ? 'Open Health Vault' : 'Access Vault'}</span>
                <span className="btn-icon-vessel">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </span>
              </button>
            </div>

          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {DEPARTMENTS.map((dept, i) => {
              const Icon = dept.icon;
              return (
                <div key={i} className="doppel-shell flex flex-col justify-between">
                  <div className="doppel-core p-7 flex flex-col justify-between h-full">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 border border-emerald-100 shadow-xs">
                        <Icon className="w-6 h-6" />
                      </div>

                      <h3 className="text-lg font-extrabold text-slate-900 font-headline mb-2">{dept.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">{dept.desc}</p>
                    </div>

                    <div>
                      <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700 font-medium mb-6">
                        {dept.features.map((f, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => navigate(dept.link)}
                        className="w-full btn-island-secondary text-xs py-2 px-4 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Explore Module</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emergency 24/7 Callout Banner */}
          <div className="rounded-3xl bg-[#0B1120] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-lg mb-8">
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <Phone className="w-7 h-7 text-rose-400" />
              </div>
              <div>
                <div className="text-[11px] uppercase font-mono tracking-wider text-rose-300 font-bold">24/7 Emergency Medical Hotline</div>
                <h3 className="text-2xl font-extrabold text-white font-headline">National Ambulance: 108 / 102</h3>
              </div>
            </div>

            <button 
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              className="btn-island-primary text-xs py-3 px-6 shrink-0 cursor-pointer"
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
