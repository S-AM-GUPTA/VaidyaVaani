import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Upload, 
  Printer, 
  Play, 
  Pause, 
  Volume2, 
  ArrowRight, 
  Check, 
  Copy, 
  Sparkles,
  Phone,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Uploader from '../components/Uploader';

export const LabDecoderPage: React.FC = () => {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: false,
    4: false
  });
  const [copiedText, setCopiedText] = useState(false);

  const toggleQuestion = (id: number) => {
    setCheckedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePlayVoice = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage.speechCode || 'hi-IN';
    utterance.rate = playbackSpeed;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyQuestions = () => {
    const questions = [
      "1. दवा संशोधन: डॉक्टर साहब, मेरा HbA1c 7.4 से बढ़कर 8.2 हो गया है, क्या मेरी मेटफॉर्मिन की खुराक बदलने की जरूरत है?",
      "2. कोलेस्ट्रॉल दवा: कोलेस्ट्रॉल 232 mg/dL आया है, क्या इसके लिए स्टेटिन शुरू करनी होगी या केवल खाने में परहेज काफी है?",
      "3. किडनी सुरक्षा: मेरी क्रिएटिनिन सामान्य है, फिर भी क्या मुझे कोई यूरीन माइक्रोएल्ब्यूमिन टेस्ट कराना चाहिए?",
      "4. अगला टेस्ट: अगली बार मुझे कितने महीने बाद दोबारा टेस्ट कराना चाहिए?"
    ].join('\n');
    navigator.clipboard.writeText(questions);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#c1ecde] selection:text-[#00221b] flex flex-col">
      
      {/* =========================================================================
          1. TOP APP SUB-NAVIGATION BAR
          ========================================================================= */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 flex-wrap">
          
          {/* Left Tabs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/" className="flex items-center group select-none mr-1">
              <img
                src="/logo/complete%20logo.png"
                alt="VaidyaVaani"
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5e9] text-[#1b5e20] text-xs font-bold border border-[#c8e6c9]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>ABDM / ABHA Connected</span>
            </span>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs">
              <Link
                to="/lab-decoder"
                className="px-3.5 py-1 rounded-full font-bold bg-[#00221b] text-white shadow-2xs"
              >
                Lab Reports (स्मार्ट रिपोर्ट)
              </Link>
              <Link
                to="/safety-matrix"
                className="px-3.5 py-1 rounded-full font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors"
              >
                Drug Conflicts (दवा सुरक्षा)
              </Link>
              <a
                href="#doctor-questions"
                className="px-3 py-1 rounded-full font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors hidden md:inline-block"
              >
                Consultation Guide (परामर्श)
              </a>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handlePlayVoice("नमस्ते रमेश कुमार। आपकी 14 अक्टूबर की लाल पैथलैब्स की रिपोर्ट में मुख्य निष्कर्ष यह है: आपका तीन महीने का औसत शुगर HbA1c 8.2 प्रतिशत है जो अनियंत्रित है। आपके गुर्दे और सीरम क्रिएटिनिन 1.05 पूरी तरह सुरक्षित हैं। कोलेस्ट्रॉल 232 थोड़ा बढ़ा हुआ है।")}
              className="bg-[#002f6c] hover:bg-[#001f4c] text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>आवाज़ में सुनें (Voice Audio)</span>
            </button>

            <a
              href="tel:108"
              className="bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>Emergency 108</span>
            </a>

            <div className="w-8 h-8 rounded-full bg-[#00221b] text-white flex items-center justify-center font-bold text-xs">
              {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'RK'}
            </div>
          </div>

        </div>
      </header>

      {/* =========================================================================
          MAIN LAB REPORT CONTENT
          ========================================================================= */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6 text-left">
        
        {/* =========================================================================
            2. PATIENT HEADER STRIP
            ========================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#f1f5f9] border border-slate-200 text-slate-800 flex flex-col items-center justify-center font-extrabold shrink-0">
              <span className="text-lg leading-none">58</span>
              <span className="text-[10px] text-slate-500 font-medium">YRS / M</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-slate-900 font-headline">
                  Ramesh Kumar <span className="text-base font-semibold text-slate-600">(रमेश कुमार, पटना, बिहार)</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 font-mono text-[11px] font-bold">
                  ✓ Verified ABHA ID: 91-8276-1029-4412
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="font-semibold text-slate-700">🏥 Dr. Lal PathLabs</span>
                <span>•</span>
                <span>Comprehensive Metabolic Panel</span>
                <span>•</span>
                <span>Sample Date: <strong>14 Oct 2024, 08:30 AM</strong></span>
              </div>

              <div className="pt-0.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                  Clinical Focus: Type-2 Diabetes &amp; Hypertension
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#00221b]" />
              <span>Upload New Report (नयी रिपोर्ट जोड़ें)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-[#00221b] hover:bg-[#0e382f] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Summary PDF / प्रिंट</span>
            </button>
          </div>
        </section>

        {/* =========================================================================
            3. AI AUDIO SUMMARY BANNER (MEDICAL VOICE EXPLANATION)
            ========================================================================= */}
        <section className="bg-gradient-to-r from-[#002820] to-[#00382b] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-900/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wide border border-emerald-500/30">
                <Sparkles className="w-3 h-3" />
                <span>AI वॉयस सारांश (Medical Voice Explanation)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-headline text-white">
                सुनिए: आपकी 14 अक्टूबर की लैब रिपोर्ट का सरल सारांश
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Listen in plain Hindi &amp; English (2 min 10 sec) — Prepared especially for Ramesh Kumar and family caregivers.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/15 shrink-0">
              <button
                onClick={() => handlePlayVoice("नमस्ते रमेश कुमार। आपकी 14 अक्टूबर की लाल पैथलैब्स की रिपोर्ट में मुख्य निष्कर्ष यह है: आपका तीन महीने का औसत शुगर HbA1c 8.2 प्रतिशत है जो अनियंत्रित है। आपके गुर्दे और सीरम क्रिएटिनिन 1.05 पूरी तरह सुरक्षित हैं। कोलेस्ट्रॉल 232 थोड़ा बढ़ा हुआ है।")}
                className="w-12 h-12 rounded-full bg-[#6098ff] hover:bg-[#4a87ff] text-[#001b44] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-sm"
              >
                {isPlayingAudio ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <div className="space-y-1">
                <div className="text-[11px] font-mono font-bold text-white flex items-center gap-2">
                  <span>हिंदी वॉयस नोट्स (Hindi Audio)</span>
                  <span className="text-emerald-300 font-normal">0:42 / 2:10</span>
                </div>
                {/* Waveform graphic bars */}
                <div className="flex items-center gap-1 h-4">
                  {[4, 8, 14, 10, 6, 12, 16, 10, 14, 8, 12, 6, 10, 14, 8].map((h, i) => (
                    <span 
                      key={i} 
                      className={`w-1 bg-[#6098ff] rounded-full transition-all ${isPlayingAudio ? 'animate-pulse' : 'opacity-60'}`}
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setPlaybackSpeed(s => s === 1.0 ? 1.25 : s === 1.25 ? 1.5 : 1.0)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] font-bold cursor-pointer"
              >
                {playbackSpeed}x
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. PLAIN-LANGUAGE EXECUTIVE SUMMARY CARDS
            ========================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-headline">
              <span className="text-emerald-700">💡</span>
              <span>सरल भाषा में मुख्य निष्कर्ष (Plain-Language Executive Summary)</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">No medical jargon • शुद्ध और सरल भाषा</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Sugar (Action Needed) */}
            <div className="bg-white border-2 border-rose-200 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                    <span>⚠️</span> ध्यान दें (Action Needed)
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">HbA1c Blood Sugar</span>
                </div>
                <h3 className="text-base font-extrabold text-rose-950 font-headline">
                  शुगर का स्तर अनियंत्रित है (8.2%)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  पिछले 3 महीनों का औसत शुगर 8.2% आया है, जो 7.0% से कम होना चाहिए। डॉक्टर से मिलकर दवा या इंसुलिन की मात्रा जांचने की तुरंत आवश्यकता है।
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-rose-700 font-mono font-bold">पिछली रिपोर्ट: 7.4% (+0.8% वृद्धि)</span>
                <a href="#fbs-parameter" className="font-bold text-rose-800 hover:underline flex items-center gap-0.5">
                  <span>आहार सलाह देखें</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Card 2: Kidney (Safe) */}
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                    <span>✓</span> सुरक्षित / सामान्य (Safe)
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">Kidney • Creatinine</span>
                </div>
                <h3 className="text-base font-extrabold text-emerald-950 font-headline">
                  गुर्दे (Kidney) पूरी तरह सुरक्षित हैं
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  सीरम क्रिएटिनिन का स्तर <strong>1.05 mg/dL</strong> है, जो सामान्य सीमा (0.7 – 1.3) के भीतर है। शुगर के बावजूद गुर्दे स्वस्थ काम कर रहे हैं। पर्याप्त पानी पीते रहें।
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-mono font-bold">GFR: 84 mL/min (उत्कृष्ट)</span>
                <span className="text-slate-500 font-medium">सामान्य सीमा में</span>
              </div>
            </div>

            {/* Card 3: Cholesterol (Borderline) */}
            <div className="bg-white border-2 border-amber-200 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center gap-1">
                    <span>⚠️</span> सीमा से थोड़ा अधिक (Borderline)
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">Cholesterol &amp; Triglycerides</span>
                </div>
                <h3 className="text-base font-extrabold text-amber-950 font-headline">
                  कोलेस्ट्रॉल में हल्की बढ़ोतरी (232 mg/dL)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  रक्त में चर्बी (Triglycerides &amp; Total Cholesterol) मानक 200 से अधिक है। तले हुए भोजन और शुद्ध घी पर तुरंत लगाम लगाएं व प्रतिदिन 30 मिनट टहलें।
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-amber-700 font-mono font-bold">लक्ष्य: &lt; 200 mg/dL</span>
                <a href="#cholesterol-parameter" className="font-bold text-amber-800 hover:underline flex items-center gap-0.5">
                  <span>परहेज़ सूची</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            5. CLINICAL PARAMETER BREAKDOWN (विस्तृत पैरामीटर विश्लेषण)
            ========================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-headline">
                विस्तृत पैरामीटर विश्लेषण (Clinical Parameter Breakdown)
              </h2>
              <p className="text-xs text-slate-500">Dr. Lal PathLabs • Barcode ID: #DLP-8849201 • 5 प्रमुख जैविक संकेतक</p>
            </div>
            
            {/* Color Legend */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-slate-500">रंगों का अर्थ:</span>
              <span className="flex items-center gap-1 text-amber-700 font-mono">🟡 कम (Low)</span>
              <span className="flex items-center gap-1 text-cyan-700 font-mono">🔵 सामान्य (Normal)</span>
              <span className="flex items-center gap-1 text-rose-700 font-mono">🔴 अधिक (High)</span>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Parameter 1: Fasting Blood Sugar (FBS) */}
            <div id="fbs-parameter" className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🩸</span>
                  <h4 className="text-sm font-bold text-slate-900 font-headline">Fasting Blood Sugar (FBS)</h4>
                </div>
                <p className="text-[11px] text-slate-500">खाली पेट खून में शर्करा (शुगर की जांच)</p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-black text-rose-700 font-mono">164</span>
                  <span className="text-xs text-slate-500 font-semibold">mg/dL</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold font-mono">
                    अधिक (High)
                  </span>
                </div>
              </div>

              {/* Segmented Range Slider */}
              <div className="lg:col-span-5 space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>Low (&lt; 70)</span>
                  <span>Normal (70 – 99 mg/dL)</span>
                  <span>High (&gt; 125)</span>
                </div>

                <div className="h-4 rounded-full bg-slate-200 overflow-hidden flex relative">
                  {/* Segment 1: Low */}
                  <div className="w-[20%] bg-amber-300" title="Low (<70)"></div>
                  {/* Segment 2: Normal */}
                  <div className="w-[35%] bg-[#67e8f9]" title="Normal (70-99)"></div>
                  {/* Segment 3: Borderline */}
                  <div className="w-[15%] bg-amber-300" title="Pre-diabetic (100-125)"></div>
                  {/* Segment 4: High */}
                  <div className="w-[30%] bg-rose-400" title="High (>125)"></div>

                  {/* Marker Pin */}
                  <div 
                    className="absolute top-0 bottom-0 w-3.5 h-3.5 -mt-0.5 bg-rose-700 border-2 border-white rounded-full shadow-md -translate-x-1/2"
                    style={{ left: '85%' }}
                  />
                </div>

                <div className="text-right text-[11px] font-mono font-bold text-rose-700">
                  आपका स्तर: 164 mg/dL
                </div>
              </div>

              {/* Insight Explanation */}
              <div className="lg:col-span-4 bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                  <span>💡</span>
                  <span>इसका क्या अर्थ है?</span>
                </div>
                <p className="leading-relaxed">
                  रात भर बिना कुछ खाए सुबह का शुगर 164 आया है। यह सामान्य से 65 यूनिट अधिक है। डॉक्टर की बताई दवा समय पर लें।
                </p>
              </div>
            </div>

            {/* Parameter 2: HbA1c (Glycated Hemoglobin) */}
            <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📈</span>
                  <h4 className="text-sm font-bold text-slate-900 font-headline">HbA1c (Glycated Hemoglobin)</h4>
                </div>
                <p className="text-[11px] text-slate-500">पिछली 3 महीनों का औसत शुगर स्कोर</p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-black text-rose-700 font-mono">8.2</span>
                  <span className="text-xs text-slate-500 font-semibold">%</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold font-mono">
                    अनियंत्रित (Uncontrolled)
                  </span>
                </div>
                <p className="text-[10px] text-rose-700 font-bold font-mono">
                  📈 जुलाई 2024 (7.4%) से +0.8% की चिंताजनक वृद्धि
                </p>
              </div>

              {/* Segmented Range Slider */}
              <div className="lg:col-span-5 space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>Non-Diabetic (&lt; 5.7%)</span>
                  <span>Controlled (5.7 – 7.0%)</span>
                  <span>Poor (&gt; 8.0%)</span>
                </div>

                <div className="h-4 rounded-full bg-slate-200 overflow-hidden flex relative">
                  <div className="w-[30%] bg-[#67e8f9]"></div>
                  <div className="w-[35%] bg-amber-300"></div>
                  <div className="w-[35%] bg-rose-400"></div>

                  <div 
                    className="absolute top-0 bottom-0 w-3.5 h-3.5 -mt-0.5 bg-rose-700 border-2 border-white rounded-full shadow-md -translate-x-1/2"
                    style={{ left: '88%' }}
                  />
                </div>

                <div className="text-right text-[11px] font-mono font-bold text-rose-700">
                  वर्तमान स्कोर: 8.2%
                </div>
              </div>

              {/* Insight Explanation */}
              <div className="lg:col-span-4 bg-white p-3.5 rounded-xl border border-rose-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-rose-900 flex items-center gap-1 text-[11px]">
                  <span>⛔</span>
                  <span>मुख्य खतरा</span>
                </div>
                <p className="leading-relaxed">
                  8% से ऊपर शुगर लंबे समय में आंखों, नसों और दिल पर असर डाल सकती है। अपने चिकित्सक से तत्काल खुराक संशोधन करवाएं।
                </p>
              </div>
            </div>

            {/* Parameter 3: Serum Creatinine (Kidney) */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛡️</span>
                  <h4 className="text-sm font-bold text-slate-900 font-headline">Serum Creatinine (Kidney)</h4>
                </div>
                <p className="text-[11px] text-slate-500">गुर्दे की कार्यक्षमता (किडनी फंक्शन टेस्ट)</p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-black text-cyan-800 font-mono">1.05</span>
                  <span className="text-xs text-slate-500 font-semibold">mg/dL</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold font-mono">
                    सामान्य (Healthy Range)
                  </span>
                </div>
              </div>

              {/* Segmented Range Slider */}
              <div className="lg:col-span-5 space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>Low (&lt; 0.6)</span>
                  <span>Optimal (0.7 – 1.30 mg/dL)</span>
                  <span>Elevated (&gt; 1.4)</span>
                </div>

                <div className="h-4 rounded-full bg-slate-200 overflow-hidden flex relative">
                  <div className="w-[20%] bg-amber-300"></div>
                  <div className="w-[55%] bg-[#67e8f9]"></div>
                  <div className="w-[25%] bg-rose-400"></div>

                  <div 
                    className="absolute top-0 bottom-0 w-3.5 h-3.5 -mt-0.5 bg-cyan-700 border-2 border-white rounded-full shadow-md -translate-x-1/2"
                    style={{ left: '52%' }}
                  />
                </div>

                <div className="text-right text-[11px] font-mono font-bold text-cyan-800">
                  आपका स्तर: 1.05 mg/dL
                </div>
              </div>

              {/* Insight Explanation */}
              <div className="lg:col-span-4 bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1 text-[11px]">
                  <span>✓</span>
                  <span>अच्छी खबर</span>
                </div>
                <p className="leading-relaxed">
                  गुर्दे खून को बिल्कुल ठीक से छान रहे हैं। मधुमेह होने के बावजूद किडनी पर कोई बुरा असर नहीं दिखा है।
                </p>
              </div>
            </div>

            {/* Parameter 4: Platelet Count (CBC) */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🩸</span>
                  <h4 className="text-sm font-bold text-slate-900 font-headline">Platelet Count (CBC)</h4>
                </div>
                <p className="text-[11px] text-slate-500">रक्त प्लेटलेट्स की संख्या (थक्का बनने की क्षमता)</p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-black text-cyan-800 font-mono">2.10</span>
                  <span className="text-xs text-slate-500 font-semibold">Lakh/cumm</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold font-mono">
                    सामान्य (Normal)
                  </span>
                </div>
              </div>

              {/* Segmented Range Slider */}
              <div className="lg:col-span-5 space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>Low (&lt; 1.50)</span>
                  <span>Standard (1.50 – 4.50 Lakh)</span>
                  <span>High (&gt; 4.50)</span>
                </div>

                <div className="h-4 rounded-full bg-slate-200 overflow-hidden flex relative">
                  <div className="w-[20%] bg-amber-300"></div>
                  <div className="w-[60%] bg-[#67e8f9]"></div>
                  <div className="w-[20%] bg-amber-300"></div>

                  <div 
                    className="absolute top-0 bottom-0 w-3.5 h-3.5 -mt-0.5 bg-cyan-700 border-2 border-white rounded-full shadow-md -translate-x-1/2"
                    style={{ left: '42%' }}
                  />
                </div>

                <div className="text-right text-[11px] font-mono font-bold text-cyan-800">
                  2.10 Lakh (सुरक्षित)
                </div>
              </div>

              {/* Insight Explanation */}
              <div className="lg:col-span-4 bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                  <span>🛡️</span>
                  <span>स्थिति</span>
                </div>
                <p className="leading-relaxed">
                  प्लेटलेट्स पर्याप्त मात्रा में हैं। किसी भी प्रकार के आंतरिक रक्तस्राव या संक्रमण का खतरा नहीं है।
                </p>
              </div>
            </div>

            {/* Parameter 5: Total Cholesterol & Lipids */}
            <div id="cholesterol-parameter" className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🫀</span>
                  <h4 className="text-sm font-bold text-slate-900 font-headline">Total Cholesterol &amp; Lipids</h4>
                </div>
                <p className="text-[11px] text-slate-500">खून में फैट / लिपिड प्रोफाइल</p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-black text-amber-800 font-mono">232</span>
                  <span className="text-xs text-slate-500 font-semibold">mg/dL</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold font-mono">
                    सीमा से अधिक (Borderline High)
                  </span>
                </div>
              </div>

              {/* Segmented Range Slider */}
              <div className="lg:col-span-5 space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>Desirable (&lt; 200)</span>
                  <span>Borderline (200 – 239)</span>
                  <span>High (≥ 240 mg/dL)</span>
                </div>

                <div className="h-4 rounded-full bg-slate-200 overflow-hidden flex relative">
                  <div className="w-[45%] bg-[#67e8f9]"></div>
                  <div className="w-[35%] bg-amber-300"></div>
                  <div className="w-[20%] bg-rose-400"></div>

                  <div 
                    className="absolute top-0 bottom-0 w-3.5 h-3.5 -mt-0.5 bg-amber-700 border-2 border-white rounded-full shadow-md -translate-x-1/2"
                    style={{ left: '76%' }}
                  />
                </div>

                <div className="text-right text-[11px] font-mono font-bold text-amber-800">
                  वर्तमान: 232 mg/dL
                </div>
              </div>

              {/* Insight Explanation */}
              <div className="lg:col-span-4 bg-white p-3.5 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1 text-[11px]">
                  <span>🥗</span>
                  <span>खान-पान टिप</span>
                </div>
                <p className="leading-relaxed">
                  सरसों तेल की मात्रा सीमित करें, रिफाइंड तेल व मिठाई से बचें। रोजाना कम से कम 2 से 3 किलोमीटर की हल्की वॉक करें।
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            6. HISTORICAL HEALTH PROGRESSION (पिछली रिपोर्टों से तुलना)
            ========================================================================= */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-headline">
                📈 पिछली रिपोर्टों से तुलना (Historical Health Progression)
              </h3>
              <p className="text-xs text-slate-500">Ramesh Kumar’s Fasting Blood Sugar &amp; HbA1c trajectory across 2024</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                3 Visits Tracked
              </span>
              <button 
                onClick={() => setIsUploadOpen(true)}
                className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
              >
                + पुरानी रिपोर्ट जोड़ें
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Visit 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-600">12 JAN 2024</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold text-[10px]">
                  Controlled
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fasting Sugar:</span>
                  <strong className="font-mono text-slate-900">128 mg/dL</strong>
                </div>
                <div className="h-1.5 rounded-full bg-cyan-200 overflow-hidden">
                  <div className="h-full bg-cyan-600" style={{ width: '60%' }}></div>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">HbA1c Score:</span>
                  <strong className="font-mono text-slate-900">6.9%</strong>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 italic">शुरुआती स्थिति - नियंत्रण में थी</p>
            </div>

            {/* Visit 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-600">22 JUL 2024</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                  Elevating
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fasting Sugar:</span>
                  <strong className="font-mono text-amber-800">146 mg/dL</strong>
                </div>
                <div className="h-1.5 rounded-full bg-amber-200 overflow-hidden">
                  <div className="h-full bg-amber-600" style={{ width: '75%' }}></div>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">HbA1c Score:</span>
                  <strong className="font-mono text-amber-800">7.4%</strong>
                </div>
              </div>
              <p className="text-[11px] text-amber-700 font-medium">हल्की वृद्धि शुरू हुई (+0.5%)</p>
            </div>

            {/* Visit 3 (Current) */}
            <div className="p-4 rounded-xl bg-rose-50/60 border-2 border-rose-300 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-rose-900">14 OCT 2024</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px]">
                  अनलॉक रिपोर्ट (Current)
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Fasting Sugar:</span>
                  <strong className="font-mono text-rose-700 font-black">164 mg/dL</strong>
                </div>
                <div className="h-1.5 rounded-full bg-rose-200 overflow-hidden">
                  <div className="h-full bg-rose-600" style={{ width: '90%' }}></div>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">HbA1c Score:</span>
                  <strong className="font-mono text-rose-700 font-black">8.2%</strong>
                </div>
              </div>
              <p className="text-[11px] text-rose-700 font-bold">📈 निष्कर्ष: शुगर लगातार बढ़ रही है</p>
            </div>

          </div>
        </section>

        {/* =========================================================================
            7. GLOSSARY & DOCTOR QUESTIONS CHECKLIST
            ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Medical Terms Simplified */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-headline flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-700" />
              <span>मेडिकल शब्दों का सरल अर्थ (Medical Terms Simplified)</span>
            </h3>
            <p className="text-xs text-slate-500">कठिन रिपोर्ट को आसान उदाहरणों से समझें</p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>HbA1c क्या है?</span>
                  <span className="text-[11px] text-slate-400 font-normal">3 महीने की मेमोरी</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  जैसे फोन की मुख्य ऊपर-नीचे होती रहती है, HbA1c बताता है कि पिछले 90 दिनों में औसतन खून में कितनी चीनी चिपकी रही। यह मधुमेह की सबसे सटीक जांच है।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>सीरम क्रिएटिनिन (Creatinine) क्या है?</span>
                  <span className="text-[11px] text-slate-400 font-normal">किडनी का फिल्टर टेस्ट</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  मांसपेशियों के काम करने से शरीर में कचरा बनता है। यदि गुर्दे सही से काम कर रहे हैं, तो वे इसे पेशाब के रास्ते बाहर निकाल देते हैं। 1.05 स्तर का मतलब आपकी किडनी ठीक से सफाई कर रही है।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>ट्राइग्लिसराइड्स (Triglycerides) क्या है?</span>
                  <span className="text-[11px] text-slate-400 font-normal">अतिरिक्त फैट</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  जब हम जरूरत से ज्यादा तला-भुना या मीठा खाते हैं, तो शरीर बची हुई ऊर्जा को फैट में बदल देता है। यह नसों में जमा होकर ब्लड प्रेशर बढ़ा सकता है।
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Questions Checklist */}
          <div id="doctor-questions" className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-headline flex items-center gap-2">
                <span className="text-emerald-700">🩺</span>
                <span>डॉक्टर से परामर्श के लिए सवाल (Doctor Questions Checklist)</span>
              </h3>
              <p className="text-xs text-slate-500">इस रिपोर्ट के आधार पर अपने फिजिशियन से ये 4 प्रश्न अवश्य पूछें</p>

              <div className="space-y-2.5 mt-4 text-xs">
                
                {/* Question 1 */}
                <div 
                  onClick={() => toggleQuestion(1)}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 transition-colors cursor-pointer ${
                    checkedQuestions[1] ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={checkedQuestions[1]} 
                    onChange={() => {}} 
                    className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500" 
                  />
                  <p className="text-slate-800 leading-relaxed">
                    <strong>1. दवा संशोधन:</strong> "डॉक्टर साहब, मेरा HbA1c 7.4 से बढ़कर 8.2 हो गया है, क्या मेरी मेटफॉर्मिन की खुराक बदलने की जरूरत है?"
                  </p>
                </div>

                {/* Question 2 */}
                <div 
                  onClick={() => toggleQuestion(2)}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 transition-colors cursor-pointer ${
                    checkedQuestions[2] ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={checkedQuestions[2]} 
                    onChange={() => {}} 
                    className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500" 
                  />
                  <p className="text-slate-800 leading-relaxed">
                    <strong>2. कोलेस्ट्रॉल दवा:</strong> "कोलेस्ट्रॉल 232 mg/dL आया है, क्या इसके लिए स्टेटिन (Statin) दवा शुरू करनी होगी या केवल खाने में परहेज काफी है?"
                  </p>
                </div>

                {/* Question 3 */}
                <div 
                  onClick={() => toggleQuestion(3)}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 transition-colors cursor-pointer ${
                    checkedQuestions[3] ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={checkedQuestions[3]} 
                    onChange={() => {}} 
                    className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500" 
                  />
                  <p className="text-slate-800 leading-relaxed">
                    <strong>3. किडनी सुरक्षा:</strong> "मेरी क्रिएटिनिन सामान्य है, फिर भी क्या मुझे भविष्य के लिए कोई यूरीन माइक्रोएल्ब्यूमिन टेस्ट कराना चाहिए?"
                  </p>
                </div>

                {/* Question 4 */}
                <div 
                  onClick={() => toggleQuestion(4)}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 transition-colors cursor-pointer ${
                    checkedQuestions[4] ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={checkedQuestions[4]} 
                    onChange={() => {}} 
                    className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500" 
                  />
                  <p className="text-slate-800 leading-relaxed">
                    <strong>4. अगला टेस्ट:</strong> "अगली बार मुझे कितने महीने बाद (3 महीने या 6 महीने) दोबारा लैब टेस्ट कराना चाहिए?"
                  </p>
                </div>

              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">मरीज़ या परिवार के साथ साझा करें:</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#0F6848] text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>💬 WhatsApp पर भेजें</span>
                </a>
                <button
                  onClick={handleCopyQuestions}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'कॉपी हो गया!' : 'सवाल प्रिंट करें'}</span>
                </button>
              </div>
            </div>
          </div>

        </section>

      </main>

      {/* =========================================================================
          FOOTER & DISCLAIMER
          ========================================================================= */}
      <footer className="border-t border-slate-200/80 bg-white text-slate-500 py-6 mt-12 text-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo/complete%20logo.png"
              alt="VaidyaVaani"
              className="h-8 w-auto object-contain"
            />
            <div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                © 2026 VaidyaVaani Healthcare Intelligence. Not a replacement for emergency clinical diagnosis. Emergency helpline: 108 / 112
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium">
            <a href="tel:18002669900" className="hover:text-slate-900">टोल फ्री सहायता (Help Desk)</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900">Medical Accuracy Disclaimer</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900">Doctor Consultation Protocol</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-900">Privacy &amp; HIPAA Compliance</a>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          UPLOAD MODAL
          ========================================================================= */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-headline">Upload New Diagnostic Lab Report</h3>
              <button 
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <Uploader type="reports" onUploadComplete={() => setIsUploadOpen(false)} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LabDecoderPage;
