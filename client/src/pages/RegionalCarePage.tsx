import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Volume2, 
  ArrowLeft, 
  Sparkles, 
  Play, 
  Pause,
  RotateCcw
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

const PRESET_PHRASES = [
  {
    title: 'Post-Meal Prescription Instruction',
    text: 'Take one tablet twice daily strictly after meals with warm water. Do not skip doses.',
    hi: 'भोजन के बाद गर्म पानी के साथ दिन में दो बार एक गोली लें। खुराक न छोड़ें।',
    bn: 'খাওয়ার পর হালকা গরম জলের সাথে দিনে দুবার একটি ট্যাবলেট খান।',
    ta: 'உணவுக்குப் பிறகு வெதுவெதுப்பான நீரில் தினமும் இரண்டு முறை ஒரு மாத்திரை எடுத்துக் கொள்ளுங்கள்.',
    te: 'భోజనం తర్వాత గోరువెచ్చని నీటితో రోజుకు రెండుసార్లు ఒక టాబ్లెట్ తీసుకోండి.',
    mr: 'जेवणानंतर कोमट पाण्यासोबत दिवसातून दोनदा एक गोळी घ्या. डोस चुकवू नका.',
    gu: 'જમ્યા પછી હુંફાળા પાણી સાથે દિવસમાં બે વાર એક ગોળી લો.'
  },
  {
    title: 'Drug Spacing Safety Alert',
    text: 'Do not take antacids at the same time as blood pressure medicine. Maintain a 2-hour separation window.',
    hi: 'ब्लड प्रेशर की दवा के साथ एंटासिड न लें। दोनों के बीच कम से कम 2 घंटे का अंतर रखें।',
    bn: 'রক্তচাপের ওষুধের সাথে অ্যান্টাসিড খাবেন না। অন্তত ২ ঘণ্টার ব্যবধান রাখুন।',
    ta: 'ரத்த அழுத்த மருந்துடன் அமில எதிர்ப்பு மருந்தை உட்கொள்ள வேண்டாம். 2 மணி நேர இடைவெளியை பராமரிக்கவும்.',
    te: 'రక్తపోటు మందులతో పాటు యాంటాసిడ్ తీసుకోకండి. కనీసం 2 గంటల వ్యవధిని పాటించండి.',
    mr: 'रक्तदाबाच्या औषधासोबत ॲसिडिटीची औषधे घेऊ नका. किमान २ तासांचे अंतर ठेवा.',
    gu: 'બ્લડ પ્રેશરની દવા સાથે એન્ટાસિડ ન લો. બંને વચ્ચે 2 કલાકનું અંતર રાખો.'
  },
  {
    title: 'Fasting Glucose Pathology Note',
    text: 'Your fasting blood glucose is in the normal range. Continue maintaining balanced daily fiber and light exercise.',
    hi: 'आपका फास्टिंग ब्लड शुगर सामान्य सीमा में है। संतुलित खानपान और नियमित व्यायाम जारी रखें।',
    bn: 'আপনার ফাস্টিং ব্লাড সুগার স্বাভাবিক মাত্রায় রয়েছে। সুষম খাদ্য ও নিয়মিত ব্যায়াম বজায় রাখুন।',
    ta: 'உங்கள் இரத்த சர்க்கரை அளவு இயல்பான வரம்பில் உள்ளது. சீரான உணவு முறையை தொடரவும்.',
    te: 'మీ ఉపవాస రక్తంలో చక్కెర స్థాయి సాధారణ పరిధిలో ఉంది. సమతుల్య ఆహారం తీసుకోండి.',
    mr: 'तुमची फास्टिंग ब्लड शुगर सामान्य पातळीत आहे. संतुलित आहार आणि नियमित व्यायाम सुरू ठेवा.',
    gu: 'તમારું ફાસ્ટિંગ બ્લડ સુગર સામાન્ય મર્યાદામાં છે. સંતુલિત આહાર અને નિયમિત કસરત ચાલુ રાખો.'
  }
];

const RegionalCarePage = () => {
  const navigate = useNavigate();
  const { currentLanguage, setLanguage } = useLanguage();

  const [customText, setCustomText] = useState(
    'VaidyaVaani explains your prescriptions and medical reports clearly in your mother tongue.'
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = (textToSpeak?: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    const text = textToSpeak || customText;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language code to TTS locale
    const localeMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      gu: 'gu-IN'
    };

    utterance.lang = localeMap[currentLanguage.code] || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleApplyPreset = (phrase: typeof PRESET_PHRASES[0]) => {
    let regional = phrase.text;
    if (currentLanguage.code === 'hi') regional = phrase.hi;
    else if (currentLanguage.code === 'bn') regional = phrase.bn;
    else if (currentLanguage.code === 'ta') regional = phrase.ta;
    else if (currentLanguage.code === 'te') regional = phrase.te;
    else if (currentLanguage.code === 'mr') regional = phrase.mr;
    else if (currentLanguage.code === 'gu') regional = phrase.gu;
    
    setCustomText(regional);
    handleSpeak(regional);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors font-mono cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="med-badge font-mono">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Regional Multilingual Speech Engine</span>
          </div>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono uppercase text-emerald-700 font-bold mb-2">Universal Healthcare Access</div>
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Regional Language Clinical Voice Synthesizer
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Eliminating prescription illiteracy. Listen to doctor instructions, drug timing warnings, and pathology lab evaluations spoken aloud in 7 Indian regional languages.
          </p>
        </div>

        {/* =========================================================
            INTERACTIVE VOICE SYNTHESIZER CONSOLE
            ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-16">
          
          {/* Language Selector Pills */}
          <div className="mb-6">
            <label className="block text-xs font-mono uppercase font-bold text-slate-500 mb-2">
              Select Output Dialect:
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    if (isPlaying) {
                      window.speechSynthesis.cancel();
                      setIsPlaying(false);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                    currentLanguage.code === l.code
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {l.native} ({l.label})
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Text Input Area */}
          <div className="mb-6">
            <label className="block text-xs font-mono uppercase font-bold text-slate-500 mb-2">
              Text to Synthesize ({currentLanguage.native}):
            </label>
            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Type prescription notes or clinical text to hear it spoken..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white resize-none"
            />
          </div>

          {/* Action Bar & Animated Waveform */}
          <div className="p-4 rounded-2xl bg-[#f8fafc] border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSpeak()}
                className="w-12 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{currentLanguage.native} Voice Engine</span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                    {isPlaying ? 'ACTIVE AUDIO' : 'READY'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {isPlaying ? 'Speaking aloud in real-time...' : 'Click play to synthesize'}
                </div>
              </div>
            </div>

            {/* Audio Wave Bars */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl border border-slate-200">
              {[35, 65, 25, 80, 45, 70, 30, 90, 50, 40].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 bg-emerald-600 rounded-full transition-all duration-200 ${isPlaying ? 'animate-pulse' : 'opacity-30'}`}
                  style={{ height: `${isPlaying ? (h * 0.4) : 8}px` }}
                />
              ))}
            </div>

            <button
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                setIsPlaying(false);
                setCustomText(currentLanguage.defaultSpeechText);
              }}
              className="btn-med-secondary text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>

        </div>

        {/* =========================================================
            PRESET CLINICAL PHRASES
            ========================================================= */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Standard Clinical Voice Presets</h2>
          <p className="text-xs text-slate-500 mb-6">Click any preset to load and listen in {currentLanguage.native}.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESET_PHRASES.map((phrase, idx) => (
              <div key={idx} className="med-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-emerald-700 font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Preset #{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{phrase.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    "{phrase.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleApplyPreset(phrase)}
                    className="w-full btn-med-secondary text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:border-emerald-300"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Speak in {currentLanguage.native}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default RegionalCarePage;
