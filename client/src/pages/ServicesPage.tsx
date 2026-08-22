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
    icon: HeartPulse,
    title: 'Cardiology & Hypertension Regimen',
    desc: 'Comprehensive tracking of blood pressure medications, beta-blockers, ACE inhibitors, and lipid management with lifestyle dietary sodium guidance.',
    features: ['Blood pressure timeline', 'Beta-blocker food timing alerts', 'Cardiovascular risk evaluation']
  },
  {
    icon: Activity,
    title: 'Endocrinology & Diabetes Care',
    desc: 'Monitoring HbA1c, fasting glucose levels, and oral hypoglycemic drug schedules over time to prevent sudden glycemic fluctuations.',
    features: ['Longitudinal HbA1c tracking', 'Metformin dosage scheduling', 'Hypoglycemia warning indicators']
  },
  {
    icon: FileSpreadsheet,
    title: 'Pathology & Diagnostic Laboratory',
    desc: 'Instant optical extraction of blood test markers, complete blood counts, lipid profiles, kidney function, and liver enzyme panels.',
    features: ['Optical character recognition (OCR)', 'Reference boundary checks', 'Visual normal vs high flags']
  },
  {
    icon: Pill,
    title: 'Gastroenterology Spacing & Chelation',
    desc: 'Automated reminders for antacids, proton-pump inhibitors, and gut absorption intervals to prevent bioavailability decline.',
    features: ['Antacid 2-hour spacing radar', 'Gastric protection guidelines', 'Drug-food meal interactions']
  },
  {
    icon: ShieldCheck,
    title: 'Pharmacology Safety & Contraindications',
    desc: 'Cross-checking multiple prescriptions across doctors against standardized medical registries for adverse anticoagulant and NSAID interactions.',
    features: ['Multi-doctor cross-audit', 'Critical contraindication flags', 'Plain-language doctor notes']
  },
  {
    icon: Users,
    title: 'Family Health Vault & Emergency SOS',
    desc: 'Unified health records and emergency contacts for elderly parents, children, and dependents with offline zero-knowledge encryption.',
    features: ['Multi-profile patient switcher', 'Emergency SOS hotline access', 'Encrypted JSON key export']
  },
];

const ServicesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
              <span className="text-sky-700 font-bold">Clinical Services</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="med-badge mb-2 font-mono">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Clinical Specialities
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Comprehensive Clinical Services & Departments
                </h1>
                <p className="text-slate-600 text-sm mt-2 max-w-2xl leading-relaxed">
                  Explore how VaidyaVaani integrates multiple medical disciplines to safeguard patient care, track chronic conditions, and explain clinical diagnostics.
                </p>
              </div>

              <button 
                onClick={() => navigate(isAuthenticated ? '/home' : '/login')}
                className="btn-med-primary text-xs font-semibold shrink-0"
              >
                <span>{isAuthenticated ? 'Open Clinical Workspace' : 'Access Patient Portal'}</span>
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
                <div key={i} className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-sky-300 hover:shadow-md transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">{dept.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">{dept.desc}</p>
                  </div>

                  <div>
                    <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-700 font-medium mb-6">
                      {dept.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate(isAuthenticated ? '/home' : '/login')}
                      className="w-full btn-med-secondary text-xs font-semibold"
                    >
                      <span>Explore Department</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emergency 24/7 Callout Banner */}
          <div className="bg-sky-700 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-xs uppercase font-mono tracking-wider text-sky-200 font-bold">24/7 Emergency Healthcare Assistance</div>
                <h3 className="text-2xl font-bold text-white">Call National Emergency Hotline: 108 / 102</h3>
              </div>
            </div>

            <button 
              onClick={() => navigate(isAuthenticated ? '/home' : '/login')}
              className="bg-white text-sky-900 hover:bg-sky-50 font-bold px-6 py-3 rounded-lg text-sm shrink-0 transition-colors shadow-xs"
            >
              Access Patient Health Vault
            </button>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
