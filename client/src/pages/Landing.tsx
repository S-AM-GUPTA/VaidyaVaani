import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CloudUpload, 
  FileText, 
  FileSearch, 
  Pill, 
  Users, 
  Sparkles, 
  ArrowRight,
  Brain,
  History,
  MessageSquare,
  Activity
} from 'lucide-react';
import TopBanner from '../components/layout/TopBanner';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden flex flex-col">
      <TopBanner />
      <Navbar />

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32 flex flex-col lg:flex-row items-center">
        {/* Left Column */}
        <div className="lg:w-1/2 lg:pr-12 mb-16 lg:mb-0 z-10">
          <h1 className="text-5xl lg:text-6xl font-display font-extrabold text-[#0B1B3D] leading-[1.1] tracking-tight mb-6">
            Understand Your <br />
            Reports. <br />
            <span className="text-blue-700">Take Control of <br />Your Health.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-xl font-medium leading-relaxed">
            VaidyaVaani uses advanced AI to explain medical reports in simple language, check medicine interactions, and help you make better health decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center justify-center space-x-2 bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-700/20 text-lg"
            >
              <CloudUpload className="w-6 h-6" />
              <span>Upload Your Report</span>
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center justify-center space-x-2 bg-white text-blue-700 border-2 border-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-lg"
            >
              <FileText className="w-6 h-6" />
              <span>Try Sample Report</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3 border border-blue-100">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
              </div>
              <span className="font-bold text-slate-900 text-sm mb-1">100% Secure</span>
              <span className="text-xs text-slate-500 font-medium">Your data is safe and encrypted</span>
            </div>
            <div className="flex flex-col">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3 border border-blue-100">
                <FileSearch className="w-5 h-5 text-blue-700" />
              </div>
              <span className="font-bold text-slate-900 text-sm mb-1">AI Explained</span>
              <span className="text-xs text-slate-500 font-medium">Complex reports in simple words</span>
            </div>
            <div className="flex flex-col">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3 border border-blue-100">
                <Pill className="w-5 h-5 text-blue-700" />
              </div>
              <span className="font-bold text-slate-900 text-sm mb-1">Medicine Safety</span>
              <span className="text-xs text-slate-500 font-medium">Check interactions instantly</span>
            </div>
            <div className="flex flex-col">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3 border border-blue-100">
                <Users className="w-5 h-5 text-blue-700" />
              </div>
              <span className="font-bold text-slate-900 text-sm mb-1">10K+ Users</span>
              <span className="text-xs text-slate-500 font-medium">Trusted by thousands across India</span>
            </div>
          </div>
        </div>

        {/* Right Column: Image and AI Card Overlay */}
        <div className="lg:w-1/2 relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg">
            {/* The generated doctor image */}
            <img 
              src="/doctor_hero.png" 
              alt="Doctor reviewing lab report" 
              className="w-full h-auto rounded-3xl shadow-xl object-cover border border-slate-200"
              onError={(e) => {
                // Fallback if image not found during dev
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800';
              }}
            />
            
            {/* AI Summary Floating Card */}
            <div className="absolute -left-4 md:-left-16 top-1/4 bg-white rounded-2xl shadow-2xl p-5 border border-slate-100 w-72 transform rotate-[-2deg] transition-transform hover:scale-105 hover:rotate-0 duration-300">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-slate-800">AI Summary</span>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center text-emerald-600 font-semibold text-sm mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>
                  Overall Status
                </div>
                <div className="font-bold text-slate-800 text-lg mb-1">Mostly Normal</div>
                <div className="text-xs text-slate-500 font-medium">2 parameters need attention</div>
              </div>
              
              <div className="mb-4 bg-red-50 p-3 rounded-xl border border-red-100">
                <div className="flex items-center text-red-600 font-semibold text-sm mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
                  Abnormal Findings
                </div>
                <ul className="text-sm text-slate-700 space-y-1 font-medium">
                  <li>• Hemoglobin <span className="text-red-500">(Low)</span></li>
                  <li>• Vitamin D <span className="text-red-500">(Low)</span></li>
                </ul>
              </div>

              <div>
                <div className="font-bold text-slate-800 text-sm mb-1">Doctor's Advice</div>
                <div className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Increase iron rich foods and consider Vitamin D supplements.
                </div>
                <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-semibold text-blue-600 flex items-center justify-center transition-colors">
                  View Full Analysis <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Core Features Grid */}
      <section id="features" className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-5 shadow-md shadow-blue-600/20">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Reports</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Upload medical reports in PDF, image, or text format securely to your vault.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-5 shadow-md shadow-blue-600/20">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Explanation</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Get easy-to-understand summaries in simple language for complex lab values.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-5 shadow-md shadow-blue-600/20">
                <Pill className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Medicine Interaction Check</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Ensure your prescribed medicines are safe to take together without side effects.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-5 shadow-md shadow-blue-600/20">
                <History className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Track History</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Save and track your reports and health history securely in one dashboard.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-extrabold text-[#0B1B3D]">How It Works</h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/4 px-4 mb-8 md:mb-0 z-10 relative">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm mb-4">
                <CloudUpload className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">1. Upload</h4>
              <p className="text-sm text-slate-600 font-medium">Upload your medical report securely.</p>
            </div>
            
            {/* Arrow 1 */}
            <div className="hidden md:block absolute top-8 left-[12.5%] w-[25%] -z-0">
               <div className="w-full border-t-2 border-slate-200 relative">
                 <div className="absolute -right-1 -top-[9px] text-slate-300"><ArrowRight className="w-4 h-4"/></div>
               </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/4 px-4 mb-8 md:mb-0 z-10 relative">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm mb-4">
                <Activity className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">2. AI Analysis</h4>
              <p className="text-sm text-slate-600 font-medium">Our AI analyzes and understands your report.</p>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:block absolute top-8 left-[37.5%] w-[25%] -z-0">
               <div className="w-full border-t-2 border-slate-200 relative">
                 <div className="absolute -right-1 -top-[9px] text-slate-300"><ArrowRight className="w-4 h-4"/></div>
               </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/4 px-4 mb-8 md:mb-0 z-10 relative">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm mb-4">
                <MessageSquare className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">3. Get Results</h4>
              <p className="text-sm text-slate-600 font-medium">Receive simple summary, abnormal findings & advice.</p>
            </div>

            {/* Arrow 3 */}
            <div className="hidden md:block absolute top-8 left-[62.5%] w-[25%] -z-0">
               <div className="w-full border-t-2 border-slate-200 relative">
                 <div className="absolute -right-1 -top-[9px] text-slate-300"><ArrowRight className="w-4 h-4"/></div>
               </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/4 px-4 z-10 relative">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm mb-4">
                <ShieldCheck className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">4. Take Action</h4>
              <p className="text-sm text-slate-600 font-medium">Follow recommendations and stay healthy.</p>
            </div>
            
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Landing;
