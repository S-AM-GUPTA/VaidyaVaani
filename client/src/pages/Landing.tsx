
import { Link } from 'react-router-dom';
import { Shield, Activity, ArrowRight, FileText } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] relative overflow-hidden font-sans">
      {/* Decorative background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      
      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-display font-bold text-xl">V</span>
          </div>
          <span className="text-xl font-display font-bold text-[var(--color-text-primary)] tracking-tight">VaidyaVaani</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link to="/login" className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8 animate-fade-in-up">
          <span className="flex w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
          AI-Powered Medical Intelligence
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-[var(--color-text-primary)] tracking-tight max-w-4xl mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Understand your health <br />
          <span className="text-gradient">instantly and securely.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mb-12 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          VaidyaVaani transforms complex medical lab reports and handwritten prescriptions into clear, actionable, and secure insights using advanced AI.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link to="/login" className="px-8 py-4 bg-gradient-primary text-white font-medium rounded-2xl hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 flex items-center text-lg">
            Start Your Free Vault <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-medium rounded-2xl hover:bg-slate-50 transition-colors text-lg shadow-sm">
            See How It Works
          </button>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-card p-8 rounded-3xl border border-white/60">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
              <Activity className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-3">Report Analysis</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Upload blood tests and lab reports. Our AI instantly highlights abnormal values and explains what they mean for your health.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="glass-card p-8 rounded-3xl border border-white/60">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-teal-100">
              <FileText className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-3">Prescription Decoding</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Confused by doctors' handwriting? We digitize and decode prescriptions, giving you clear dosage and timing instructions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-8 rounded-3xl border border-white/60">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-amber-100">
              <Shield className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-3">Secure Vault</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Your health data is sensitive. We use industry-standard encryption to ensure your medical history remains entirely private.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">V</span>
            </div>
            <span className="font-display font-bold text-slate-900">VaidyaVaani</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">© 2026 VaidyaVaani AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
