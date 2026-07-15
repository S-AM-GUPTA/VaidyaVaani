import { useNavigate } from 'react-router-dom';
import { CloudUpload, History, Activity, Shield, ChevronRight } from 'lucide-react';
import TopBanner from '../components/layout/TopBanner';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden flex flex-col">
      <TopBanner />
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Hero Section */}
        <div className="bg-[#0B1B3D] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
              Welcome back to <span className="text-blue-400">VaidyaVaani</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl">
              Your personalized medical intelligence hub. Upload new reports or view your medical history powered by advanced AI analysis.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all shadow-lg shadow-blue-600/30 group"
              >
                <CloudUpload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                Upload New Report
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-6 py-3 rounded-xl font-bold flex items-center transition-all"
              >
                <History className="w-5 h-5 mr-2" />
                View Past Records
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1B3D] tracking-tight">Quick Actions</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Manage your health data</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Action Card 1 */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CloudUpload className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Lab Report</h3>
            <p className="text-slate-500 text-sm mb-6 flex-grow">
              Upload your latest blood test or lab report. Our AI will analyze it and explain what your results mean in simple terms.
            </p>
            <div className="flex items-center text-blue-600 font-semibold text-sm mt-auto">
              Get Started <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action Card 2 */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:teal-200 transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Prescription</h3>
            <p className="text-slate-500 text-sm mb-6 flex-grow">
              Upload your doctor's prescription. We'll extract the medicines, check for interactions, and help you set reminders.
            </p>
            <div className="flex items-center text-teal-600 font-semibold text-sm mt-auto">
              Get Started <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Action Card 3 */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:indigo-200 transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Medical History</h3>
            <p className="text-slate-500 text-sm mb-6 flex-grow">
              Access your complete repository of past lab reports and prescriptions securely in one place.
            </p>
            <div className="flex items-center text-indigo-600 font-semibold text-sm mt-auto">
              View History <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="mt-12 flex items-center justify-center space-x-2 text-slate-500 text-sm font-medium">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Your data is end-to-end encrypted and HIPAA compliant</span>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
