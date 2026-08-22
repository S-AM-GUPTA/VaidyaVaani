import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Check, 
  Languages,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

const RegionalCarePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentLanguage, setLanguage, speakText, stopSpeaking, isSpeaking } = useLanguage();

  const toggleVoice = (text?: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(text);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

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
              <span className="text-sky-700 font-bold">Regional Healthcare Inclusivity</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="med-badge mb-2 font-mono">
                  <Languages className="w-3.5 h-3.5" />
                  Multilingual Audio Synthesis
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Health Guidance in 7 Indian Regional Languages
                </h1>
                <p className="text-slate-600 text-sm mt-2 max-w-2xl leading-relaxed">
                  Eliminating medical communication barriers. VaidyaVaani explains prescriptions and health advice clearly in Hindi, Bengali, Tamil, Telugu, Marathi, and Gujarati.
                </p>
              </div>

              <button 
                onClick={() => navigate(isAuthenticated ? '/home' : '/login')}
                className="btn-med-primary text-xs font-semibold shrink-0"
              >
                <span>{isAuthenticated ? 'Open Clinical Workspace' : 'Sign In for Regional Voice'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>

        {/* Dialect Selector & Audio Player */}
        <section className="py-12 px-6 lg:px-12 max-w-[1280px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            
            {/* Language Selector Column */}
            <div className="lg:col-span-5 space-y-3">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Select Regional Dialect</h2>
              
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    currentLanguage.code === lang.code 
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      currentLanguage.code === lang.code ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {lang.code.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{lang.native}</div>
                      <div className={`text-xs ${currentLanguage.code === lang.code ? 'text-sky-100' : 'text-slate-500'}`}>
                        {lang.label} Language
                      </div>
                    </div>
                  </div>

                  {currentLanguage.code === lang.code && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>

            {/* Audio Synthesis Demonstration Box */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <div className="text-xs font-mono text-slate-500 uppercase">Live Voice Synthesizer</div>
                  <h3 className="text-lg font-bold text-slate-900">{currentLanguage.native} Clinical Audio</h3>
                </div>
                <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
                  Voice Engine Ready
                </span>
              </div>

              {/* Functional Player Controller */}
              <div className="p-6 rounded-xl bg-slate-900 text-white mb-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleVoice()}
                      className="w-14 h-14 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition-all shadow-md shrink-0"
                    >
                      {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                    <div>
                      <div className="text-sm font-bold text-white">Prescription Summary & Advice</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {isSpeaking ? 'Playing voice audio...' : 'Click button to hear spoken instructions'}
                      </div>
                    </div>
                  </div>

                  {/* Audio Equalizer Bars */}
                  <div className="flex items-center gap-1">
                    {[30, 65, 25, 80, 45, 70, 35].map((height, i) => (
                      <div 
                        key={i} 
                        className={`w-1 bg-sky-400 rounded-full transition-all duration-300 ${isSpeaking ? 'animate-pulse' : 'opacity-30'}`}
                        style={{ height: `${isSpeaking ? height * 0.35 : 8}px` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-800/90 rounded-lg text-xs sm:text-sm text-slate-200 leading-relaxed italic border border-slate-700">
                  "{currentLanguage.demoSpeechText}"
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Speaks medication timings clearly in everyday words (e.g. morning with breakfast, avoid empty stomach).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Empowers elderly family members to listen to their own health plans without English literacy barriers.</span>
                </div>
              </div>
            </div>

          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
};

export default RegionalCarePage;
