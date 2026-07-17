import { useNavigate } from 'react-router-dom';
import { 
  CloudUpload, 
  Activity, 
  FileText, 
  MessageSquare,
  ArrowRight,
  Stethoscope,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfdfc] font-sans text-slate-900 overflow-x-hidden flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24 flex flex-col lg:flex-row items-center">
        {/* Subtle background gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-[#e0f2fe] rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#fef3c7] rounded-full blur-[100px] opacity-60"></div>
        </div>

        {/* Left Column */}
        <div className="lg:w-1/2 lg:pr-8 mb-12 lg:mb-0 z-10 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-[#0B1B3D] leading-tight tracking-tight mb-6">
            UNDERSTAND YOUR <br className="hidden lg:block" />
            HEALTH. INSTANTLY.
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
            Upload prescriptions & medical reports. Get simple explanations in Hindi & English, and check for medicine interactions, all in one safe place.
          </p>
          
          <div className="flex justify-center lg:justify-start">
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#49996F] text-white px-8 py-4 rounded-full font-bold hover:bg-[#387a58] transition-colors shadow-lg shadow-emerald-600/20 text-lg flex flex-col items-center leading-tight hover:scale-105"
            >
              <span>Start Understanding Now</span>
              <span className="text-xs font-medium text-emerald-100 mt-0.5">(Upload First Report)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Illustration Placeholder */}
        <div className="lg:w-1/2 relative flex justify-center">
           {/* Fallback illustration using a mix of CSS and an existing image to simulate the family/doctor graphic */}
           <div className="relative w-full max-w-md bg-[#fffbef] rounded-3xl p-6 border-2 border-[#fdefc3] shadow-xl">
              <img 
                src="/doctor_hero.png" 
                alt="Healthcare illustration" 
                className="w-full h-auto rounded-2xl object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576091160550-2173ff9e5eb4?auto=format&fit=crop&q=80&w=800';
                }}
              />
              {/* Decorative floating badges */}
              <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center space-x-2 animate-bounce-slow">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600"><CheckCircle2 className="w-5 h-5"/></div>
                <div className="text-sm font-bold text-slate-700">All Safe</div>
              </div>
           </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-extrabold text-[#0B1B3D]">How VaidyaVaani Works</h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between relative space-y-12 md:space-y-0">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/3 px-4 z-10">
              <div className="w-24 h-24 bg-[#eaf4ed] rounded-full flex items-center justify-center mb-6 relative">
                <CloudUpload className="w-10 h-10 text-[#49996F]" />
                <div className="absolute -right-2 top-0 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-red-200">PDF</div>
              </div>
              <h4 className="font-bold text-slate-900 text-lg">1. Scan & Upload</h4>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/3 px-4 z-10">
              <div className="w-24 h-24 bg-[#eaf4ed] rounded-full flex items-center justify-center mb-6 relative">
                <Activity className="w-10 h-10 text-[#49996F]" />
                <div className="absolute -right-2 top-0 bg-blue-100 text-blue-600 p-1.5 rounded-full shadow-sm border border-blue-200">
                  <Stethoscope className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-bold text-slate-900 text-lg">2. AI Analysis</h4>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/3 px-4 z-10">
              <div className="w-24 h-24 bg-[#eaf4ed] rounded-full flex items-center justify-center mb-6 relative">
                <MessageSquare className="w-10 h-10 text-[#49996F]" />
                <div className="absolute -right-6 -top-2 bg-white text-green-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-md border border-slate-100 flex items-center space-x-1">
                  <span>Friendly speech</span>
                </div>
              </div>
              <h4 className="font-bold text-slate-900 text-lg">3. Clear Explanation</h4>
            </div>
            
          </div>
        </div>
      </section>

      {/* Feature Grids (Matches the Mobile View layout on the right of the mockup) */}
      <section id="features" className="py-20 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Interaction Checker - Full width */}
          <div className="bg-[#fefce8] border-2 border-[#fef08a] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
             <div className="mb-6 md:mb-0 md:w-1/2">
                <h3 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">Medicine Interaction Checker:</h3>
                <h2 className="text-xl font-bold text-slate-900">Your Safety Companion.</h2>
                <div className="mt-6 flex items-center space-x-3">
                   <div className="flex -space-x-2">
                     <div className="w-12 h-14 bg-white border-2 border-slate-300 rounded-lg shadow-sm flex items-center justify-center flex-col">
                       <div className="w-8 h-2 bg-orange-400 rounded-t-sm mb-1"></div>
                       <div className="flex space-x-1"><div className="w-2 h-2 rounded-full bg-blue-400"></div><div className="w-2 h-2 rounded-full bg-yellow-400"></div></div>
                     </div>
                     <div className="w-10 h-12 bg-white border-2 border-slate-300 rounded-lg shadow-sm flex items-center justify-center mt-2 relative z-10">
                       <div className="w-6 h-2 bg-blue-500 rounded-t-sm mb-1"></div>
                       <div className="w-4 h-2 rounded-full bg-red-400"></div>
                     </div>
                   </div>
                   <ArrowRight className="text-yellow-600 w-5 h-5" />
                   <div className="bg-[#fef9c3] border border-yellow-400 text-yellow-800 px-3 py-2 rounded-lg text-sm font-bold flex items-center">
                     <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                     Moderate Interaction
                   </div>
                </div>
             </div>
             <div className="md:w-1/3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 mb-2">Severity Level:</div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center text-slate-400"><div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>Low</div>
                  <div className="flex items-center text-slate-800"><div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>Moderate</div>
                  <div className="flex items-center text-slate-400"><div className="w-2 h-2 rounded-full bg-orange-500 mr-1"></div>High</div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Decode Lab Reports */}
            <div className="bg-[#f0f9ff] border-2 border-[#bae6fd] rounded-2xl p-6">
               <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider">Decode Lab Reports</h3>
               <div className="flex items-center space-x-4">
                 <div className="w-12 h-16 bg-white border-2 border-slate-300 rounded-md shadow-sm relative flex justify-center">
                    <div className="absolute top-2 w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-500 font-bold text-xs"><Activity className="w-5 h-5"/></div>
                 </div>
                 <div className="flex-1 space-y-2">
                   <div className="flex items-center text-xs font-bold text-slate-700"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>Normal Sugar</div>
                   <div className="flex items-center text-xs font-bold text-slate-700"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>Abnormal Lipid</div>
                 </div>
               </div>
            </div>

            {/* Simplify Prescriptions */}
            <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] rounded-2xl p-6">
               <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider">Simplify Prescriptions</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center text-sm font-bold text-slate-700">
                   <Clock className="w-5 h-5 text-blue-500 mr-2" /> Timing
                 </div>
                 <div className="flex items-center text-sm font-bold text-slate-700">
                   <FileText className="w-5 h-5 text-purple-500 mr-2" /> Dosage
                 </div>
                 <div className="flex items-center text-sm font-bold text-slate-700 col-span-2">
                   <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2"><div className="w-3 h-1.5 bg-red-500 rounded-full transform -rotate-45"></div></div>
                   Understand Purpose
                 </div>
               </div>
            </div>

            {/* Regional Language */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
               <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider">Regional Language Support</h3>
               <div className="flex items-center justify-around mt-6">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-display font-bold text-slate-800 mb-1">हिन्दी</div>
                    <div className="text-sm font-bold text-slate-500 flex items-center"><span className="text-xl mr-1">🇮🇳</span> Hindi</div>
                  </div>
                  <div className="h-10 w-px bg-slate-200"></div>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-display font-bold text-slate-800 mb-1">English</div>
                    <div className="text-sm font-bold text-slate-500 flex items-center"><span className="text-xl mr-1">🇬🇧</span> English</div>
                  </div>
               </div>
            </div>

            {/* AI Chat Assistant */}
            <div className="bg-[#f8fafc] border-2 border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
               <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider">AI Chat Assistant</h3>
               <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm ml-4 mb-2 relative">
                 <div className="absolute -left-3 top-3 w-4 h-4 bg-white border-l border-b border-slate-200 transform rotate-45"></div>
                 <p className="text-sm text-slate-700 font-medium">Ask: "What is HbA1c?"</p>
               </div>
               <div className="bg-blue-50 text-blue-800 rounded-xl p-3 border border-blue-100 shadow-sm mr-4 mt-2">
                 <p className="text-sm font-medium">Get immediate, report-aware answers.</p>
               </div>
               <div className="absolute top-6 right-6 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                 <MessageSquare className="w-5 h-5" />
               </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Landing;
