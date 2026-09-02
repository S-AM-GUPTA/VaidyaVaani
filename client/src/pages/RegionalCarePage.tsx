import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Volume2, 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

const PRESET_PHRASES = [
  {
    title: 'Dosage Spacing & Food Timing',
    text: 'Take 1 tablet of Amoxicillin twice daily strictly after food. Complete the full 5-day course.',
    hi: 'एमोक्सिसिलिन की 1 गोली दिन में दो बार भोजन के बाद लें। पूरा 5 दिन का कोर्स समाप्त करें।',
    bn: 'অ্যামোক্সিসিলিনের ১টি ট্যাবলেট দিনে দুবার খাবারের পর খান। পুরো ৫ দিনের কোর্স সম্পন্ন করুন।',
    ta: 'அமோக்சிசிலின் 1 மாத்திரையை தினமும் இரண்டு வேளை உணவுக்குப் பிறகு உட்கொள்ளவும்.',
    te: 'అమోక్సిసిలిన్ 1 టాబ్లెట్ రోజుకు రెండుసార్లు భోజనం తర్వాత తీసుకోండి.',
    mr: 'अमोक्सिसिलिनची १ गोळी दिवसातून दोनदा जेवणानंतर घ्या. पूर्ण ५ दिवसांचा कोर्स पूर्ण करा.',
    gu: 'એમોક્સિસિલિનની ૧ ગોળી દિવસમાં બે વાર જમ્યા પછી લો. પૂરો ૫ દિવસનો કોર્સ પૂરો કરો.'
  },
  {
    title: 'Acidity / Antacid Spacing Precaution',
    text: 'Take Pantocid DSR 30 minutes before breakfast. Do not take antacids within 2 hours of heart medicines.',
    hi: 'पैंटोसिड डीएसआर नाश्ते से 30 मिनट पहले खाली पेट लें। दिल की दवाओं के 2 घंटे के भीतर एंटासिड न लें।',
    bn: 'প্যান্টোসিড ডিএসআর প্রাতঃরাশের ৩০ মিনিট আগে খালি পেটে খান।',
    ta: 'காலை உணவுக்கு 30 நிமிடங்களுக்கு முன் பேண்டோசிட் மாத்திரையை உட்கொள்ளவும்.',
    te: 'అల్పాహారానికి 30 నిమిషాల ముందు పాంటోసిడ్ తీసుకోండి.',
    mr: 'न्याहारीच्या ३० मिनिटे आधी पॅन्टोसिड डीएसआर घ्या.',
    gu: 'નાસ્તાના ૩૦ મિનિટ પહેલાં પેન્ટોસિડ ડીએસઆર લો.'
  },
  {
    title: 'Blood Sugar (HbA1c) Advisory',
    text: 'Your 3-month average blood glucose HbA1c is 6.1%. This is within the prediabetes range. Regular walking recommended.',
    hi: 'आपका 3 महीने का औसत ब्लड शुगर एचबीए1सी 6.1% है। यह प्रीडायबिटीज सीमा में है। रोज टहलें।',
    bn: 'আপনার ৩ মাসের গড় ব্লাড সুগার ৬.১%। প্রতিদিন হালকা ব্যায়াম করুন।',
    ta: 'உங்கள் 3 மாத சராசரி சர்க்கரை அளவு 6.1%. தினசரி நடைப்பயிற்சி பரிந்துரைக்கப்படுகிறது.',
    te: 'మీ 3 నెలల సగటు రక్తంలో చక్కెర స్థాయి 6.1%. రోజూ నడవడం మంచిది.',
    mr: 'आपली ३ महिन्यांची सरासरी रक्तातील साखर ६.१% आहे. रोज चालण्याचा व्यायाम करा.',
    gu: 'તમારું ૩ મહિનાનું સરેરાશ બ્લડ સુગર ૬.૧% છે. નિયમિત ચાલવાની સલાહ આપવામાં આવે છે.'
  }
];

const RegionalCarePage = () => {
  const navigate = useNavigate();
  const { currentLanguage, setLanguage } = useLanguage();

  const [customText, setCustomText] = useState(currentLanguage.defaultSpeechText);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = (textToSpeak?: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const phrase = textToSpeak || customText;
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = currentLanguage.speechCode;
    utterance.rate = 0.92;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

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

      <main className="flex-grow w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors font-mono cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="haptic-badge bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Regional Multilingual Speech Engine</span>
          </div>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-[11px] font-mono uppercase text-emerald-700 font-bold mb-2">Universal Healthcare Access</div>
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Regional Language Clinical Voice Synthesizer
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed font-normal">
            Eliminating prescription illiteracy. Listen to doctor instructions, drug timing warnings, and pathology lab evaluations spoken aloud in 7 Indian regional languages.
          </p>
        </div>

        {/* =========================================================
            INTERACTIVE VOICE SYNTHESIZER CONSOLE (DOPPELRAND)
            ========================================================= */}
        <div className="doppel-shell mb-16 shadow-md">
          <div className="doppel-core p-6 sm:p-10 space-y-6">
            
            {/* Language Selector Pills */}
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-slate-500 mb-2.5">
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
                    className={`px-4 py-2 rounded-full text-xs font-bold font-headline transition-all cursor-pointer ${
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
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-slate-500 mb-2">
                Text to Synthesize ({currentLanguage.native}):
              </label>
              <textarea
                rows={4}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type prescription notes or clinical text to hear it spoken..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white resize-none shadow-xs"
              />
            </div>

            {/* Action Bar & Animated Waveform */}
            <div className="p-4 rounded-3xl bg-[#f8fafc] border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSpeak()}
                  className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2 font-headline">
                    <span>{currentLanguage.native} Voice Engine</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                      {isPlaying ? 'ACTIVE AUDIO' : 'READY'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 font-normal">
                    {isPlaying ? 'Speaking aloud in real-time...' : 'Click play to synthesize'}
                  </div>
                </div>
              </div>

              {/* Audio Wave Bars */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
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
                className="btn-island-secondary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>

          </div>
        </div>

        {/* =========================================================
            PRESET CLINICAL PHRASES
            ========================================================= */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 font-headline mb-1">Standard Clinical Voice Presets</h2>
          <p className="text-xs text-slate-500 font-mono mb-6">Click any preset to load and listen in {currentLanguage.native}.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRESET_PHRASES.map((phrase, idx) => (
              <div key={idx} className="doppel-shell flex flex-col justify-between">
                <div className="doppel-core p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-emerald-800 font-bold mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Preset #{idx + 1}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 font-headline mb-2">{phrase.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 font-normal">
                      "{phrase.text}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleApplyPreset(phrase)}
                      className="w-full btn-island-secondary text-xs py-2 px-3 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Speak in {currentLanguage.native}</span>
                    </button>
                  </div>
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
