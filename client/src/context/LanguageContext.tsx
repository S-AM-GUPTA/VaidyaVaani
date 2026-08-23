import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  native: string;
  speechCode: string;
  defaultSpeechText: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    native: 'English',
    speechCode: 'en-IN',
    defaultSpeechText: "Hello! VaidyaVaani is your health record companion. You can upload prescriptions and lab reports to check drug safety in your regional language."
  },
  {
    code: 'hi',
    label: 'Hindi',
    native: 'हिन्दी',
    speechCode: 'hi-IN',
    defaultSpeechText: "नमस्ते! वैद्यवाणी आपका स्वास्थ्य साथी है। आप अपनी दवाओं और लैब रिपोर्ट की जांच अपनी भाषा में कर सकते हैं।"
  },
  {
    code: 'bn',
    label: 'Bengali',
    native: 'বাংলা',
    speechCode: 'bn-IN',
    defaultSpeechText: "নমস্কার! বৈদ্যবাণী আপনার স্বাস্থ্য সহযোগী। আপনি নিজের ভাষায় প্রেসক্রিপশন ও ল্যাব রিপোর্ট বুঝতে পারবেন।"
  },
  {
    code: 'ta',
    label: 'Tamil',
    native: 'தமிழ்',
    speechCode: 'ta-IN',
    defaultSpeechText: "வணக்கம்! வைத்தியவாணி உங்கள் மருத்துவ உதவியாளர். உங்கள் மருந்துச் சீட்டு மற்றும் ஆய்வக அறிக்கைகளை தமிழில் எளிதாகப் புரிந்து கொள்ளலாம்."
  },
  {
    code: 'te',
    label: 'Telugu',
    native: 'తెలుగు',
    speechCode: 'te-IN',
    defaultSpeechText: "నమస్కారం! వైద్యవాణి మీ ఆరోగ్య సహాయకుడు. మీ ప్రిస్క్రిప్షన్లు మరియు ల్యాబ్ నివేదికలను తెలుగులో సులభంగా అర్థం చేసుకోండి."
  },
  {
    code: 'mr',
    label: 'Marathi',
    native: 'मराठी',
    speechCode: 'mr-IN',
    defaultSpeechText: "नमस्कार! वैद्यवाणी आपले आरोग्य सहाय्यक आहे. आपण आपले प्रिस्क्रिप्शन आणि लॅब अहवाल मराठीत सहज समजून घेऊ शकता."
  },
  {
    code: 'gu',
    label: 'Gujarati',
    native: 'ગુજરાતી',
    speechCode: 'gu-IN',
    defaultSpeechText: "નમસ્તે! વૈદ્યવાણી તમારું હેલ્થ સહાયક છે. તમે તમારા પ્રિસ્ક્રિપ્શન અને લેબ રિપોર્ટ સરળ ગુજરાતીમાં સમજી શકો છો."
  },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    workspace: 'Workspace',
    prescriptions: 'Prescriptions',
    labDiagnostics: 'Lab Diagnostics',
    aiChat: 'AI Clinical Chat',
    intelligence: 'Intelligence',
    safetyMatrix: 'Safety Matrix',
    labDecoding: 'Lab Decoding',
    pipeline: 'Pipeline',
    requestAccess: 'Request Access',
    member: 'Member',
    active: 'Active',
    endSession: 'End Session',
    notifications: 'Notifications',
    markAllRead: 'Mark all read',

    distributedIntel: 'Distributed Medical Intelligence',
    heroHeadline: 'Understand your health.',
    heroSubHeadline: 'Weightless & instant.',
    heroDesc: 'Upload prescriptions and clinical lab reports. Decode complex medical biomarkers, simulate drug interactions across doctors, and receive spoken regional explanations in seconds.',
    startExploring: 'Start Exploring Now',
    openDashboard: 'Open Dashboard Vault',
    howItWorks: 'How It Works',
    ocrExtraction: 'OCR Extraction',
    neuralSynthesis: 'Neural Synthesis',
    clientEncrypted: 'Client Encrypted',

    pipelineTitle: 'From prescription to crystal clarity in four stages.',
    step1Title: 'Multimodal Ingestion',
    step1Desc: 'Accepts camera scans, PDF lab printouts, and photo gallery uploads with client-side sanitization.',
    step2Title: 'Neural OCR Extraction',
    step2Desc: 'Deciphers doctor handwriting, tabular biomarker ranges, and dosage abbreviations with high precision.',
    step3Title: 'Pharmacopeia Analysis',
    step3Desc: 'Cross-references active prescriptions against contraindication databases to detect lethal interactions.',
    step4Title: 'Voice & Dialect Audio',
    step4Desc: 'Generates spoken summaries in Hindi & regional languages so elderly and rural patients stay safe.',

    interactionTitle: 'Cross-reference active prescriptions in milliseconds.',
    interactionDesc: 'Eliminate uncertainty when managing multi-drug schedules across different doctors. Our neural engine checks contraindications, dosage spacing, and food interactions across international pharmacology databases.',
    lowRisk: 'Low Risk',
    moderateRisk: 'Moderate',
    criticalRisk: 'Critical Risk',
    contraindicationRadar: 'Contraindication Radar',
    pharmacokineticSpacing: 'Pharmacokinetic Spacing',

    labDecoderTitle: 'Decode lab reports without the confusing jargon.',
    labDecoderDesc: 'Stop cross-referencing obscure acronyms. VaidyaVaani contextualizes complete metabolic panels, lipid panels, thyroid markers, and radiology notes into crisp, plain-language summaries with actionable doctor talking points.',
    uploadLabReport: 'Upload Lab Report',

    voiceTitle: 'Native voice intelligence in regional Indian languages.',
    voiceDesc: 'Healthcare belongs to everyone. Our natural language pipeline reads complex reports aloud and translates doctor prescriptions into clear audio guidance for elderly and rural caregivers.',
    voiceDemoTitle: 'Voice Synthesis Live Demo',
    clickToHear: 'Click to hear audio report summary in your language',
    speakingNow: 'Speaking aloud now...',
    playVoice: 'Play Synthetic Voice',

    vaultTitle: 'Patient Health Dashboard',
    unifiedView: 'Unified View',
    rxSafetyTab: 'Prescriptions & Safety',
    labDiagTab: 'Lab Diagnostics',
    activeRx: 'Active Prescriptions',
    labBiomarkers: 'Lab Biomarkers',
    scanRxPhoto: 'Scan Rx Photo',
    uploadPrescription: 'Upload Prescription',
    activeSchedule: 'Active Regimen Schedule',
    addRx: 'Add Rx',
    rxTimeline: 'Prescription Documents Timeline',
    extractedPanels: 'Extracted Biomarker Panels',
    diagFeed: 'Diagnostic Reports Feed',
    askAi: 'Ask about medications, lab results, or meal timings...',
    askQuestionsTitle: 'Ask Questions About Your Health Records',
    zeroKnowledgeVault: 'Zero-Knowledge Vault',
  },

  hi: {
    workspace: 'कार्यक्षेत्र',
    prescriptions: 'पर्चे एवं दवाएं',
    labDiagnostics: 'लैब जांच',
    aiChat: 'एआई परामर्श',
    intelligence: 'स्मार्ट सिस्टम',
    safetyMatrix: 'सुरक्षा मैट्रिक्स',
    labDecoding: 'लैब अनुवाद',
    pipeline: 'प्रक्रिया',
    requestAccess: 'पहुंच का अनुरोध',
    member: 'सदस्य',
    active: 'सक्रिय',
    endSession: 'लॉग आउट',
    notifications: 'सूचनाएं',
    markAllRead: 'सभी पढ़ें',

    distributedIntel: 'वितरित चिकित्सा बुद्धिमत्ता',
    heroHeadline: 'अपने स्वास्थ्य को समझें।',
    heroSubHeadline: 'सरल, सटीक और तुरंत।',
    heroDesc: 'डॉक्टर के पर्चे और लैब रिपोर्ट अपलोड करें। बायोमार्कर को समझें, दवाओं के आपसी दुष्प्रभावों की जांच करें और अपनी भाषा में ऑडियो व्याख्या सुनें।',
    startExploring: 'अभी शुरू करें',
    openDashboard: 'डैशबोर्ड खोलें',
    howItWorks: 'यह कैसे काम करता है',
    ocrExtraction: 'ओसीआर निष्कर्षण',
    neuralSynthesis: 'त्वरित विश्लेषण',
    clientEncrypted: 'पूर्णतः एन्क्रिप्टेड',

    pipelineTitle: 'पर्चे से लेकर स्पष्ट समझ तक केवल चार चरणों में।',
    step1Title: 'मल्टीमॉडल इनपुट',
    step1Desc: 'कैमरा स्कैन, पीडीएफ प्रिंटआउट और फोटो का सुरक्षित विश्लेषण।',
    step2Title: 'न्यूरल ओसीआर',
    step2Desc: 'डॉक्टर की लिखावट और रिपोर्ट की जटिल संख्याओं का सटीक अनुवाद।',
    step3Title: 'दवा सुरक्षा जांच',
    step3Desc: 'विभिन्न डॉक्टरों द्वारा लिखी दवाओं के संभावित खतरों की पहचान।',
    step4Title: 'मातृभाषा में आवाज़',
    step4Desc: 'बुजुर्गों और देखभालकर्ताओं के लिए क्षेत्रीय भाषा में बोलकर जानकारी।',

    interactionTitle: 'दवाओं के आपसी प्रभाव की तुरंत जांच करें।',
    interactionDesc: 'अलग-अलग डॉक्टरों की दवाओं के बीच कोई हानिकारक टकराव तो नहीं? हमारा सिस्टम तुरंत समय और खुराक का सुरक्षित अंतराल बताता है।',
    lowRisk: 'कम जोखिम',
    moderateRisk: 'मध्यम',
    criticalRisk: 'अति संवेदनशील',
    contraindicationRadar: 'टकराव की चेतावनी',
    pharmacokineticSpacing: 'दवा लेने का सही अंतराल',

    labDecoderTitle: 'बिना जटिल शब्दों के लैब रिपोर्ट समझें।',
    labDecoderDesc: 'कठिन मेडिकल शब्दों की चिंता छोड़ें। वैद्यवाणी ब्लड शुगर, लिपिड और सीबीसी को सरल भाषा में स्पष्ट करता है।',
    uploadLabReport: 'लैब रिपोर्ट अपलोड करें',

    voiceTitle: 'अपनी भाषा में बोलकर समझाती स्वास्थ्य सेवा।',
    voiceDesc: 'स्वास्थ्य की जानकारी हर किसी के लिए है। हमारा सिस्टम बुजुर्गों के लिए पूरी रिपोर्ट हिंदी और अन्य भाषाओं में बोलकर सुनाता है।',
    voiceDemoTitle: 'हिंदी वॉयस सिंथेसिस डेमो',
    clickToHear: 'अपनी भाषा में ऑडियो रिपोर्ट सुनने के लिए क्लिक करें',
    speakingNow: 'ऑडियो चल रहा है...',
    playVoice: 'आवाज़ में सुनें',

    vaultTitle: 'व्यक्तिगत स्वास्थ्य वॉल्ट',
    unifiedView: 'समग्र दृश्य',
    rxSafetyTab: 'पर्चे और दवा सुरक्षा',
    labDiagTab: 'लैब रिपोर्ट जांच',
    activeRx: 'सक्रिय दवाएं',
    labBiomarkers: 'बायोमार्कर',
    scanRxPhoto: 'कैमरे से स्कैन करें',
    uploadPrescription: 'पर्चा अपलोड करें',
    activeSchedule: 'वर्तमान दवा समय सारिणी',
    addRx: 'नई दवा जोड़ें',
    rxTimeline: 'पर्चे का इतिहास',
    extractedPanels: 'निकाले गए बायोमार्कर',
    diagFeed: 'निदान रिपोर्ट फ़ीड',
    askAi: 'दवाओं, रिपोर्ट या खान-पान के बारे में पूछें...',
    askQuestionsTitle: 'अपनी मेडिकल रिपोर्ट के बारे में सवाल पूछें',
    zeroKnowledgeVault: 'शून्य-ज्ञान सुरक्षित वॉल्ट',
  },

  bn: {
    workspace: 'ওয়ার্কস্পেস',
    prescriptions: 'প্রেসক্রিপশন ও ওষুধ',
    labDiagnostics: 'ল্যাব ডায়াগনস্টিকস',
    aiChat: 'এআই চ্যাট',
    intelligence: 'বুদ্ধিমত্তা',
    safetyMatrix: 'নিরাপত্তা ব্যবস্থা',
    labDecoding: 'রিপোর্ট ডিকোডিং',
    pipeline: 'পদ্ধতি',
    requestAccess: 'অনুরোধ করুন',
    member: 'সদস্য',
    active: 'সক্রিয়',
    endSession: 'লগআউট',
    notifications: 'বিজ্ঞপ্তি',
    markAllRead: 'সব পড়া হয়েছে',

    distributedIntel: 'উন্নত চিকিৎসা বুদ্ধিমত্তা',
    heroHeadline: 'আপনার স্বাস্থ্যকে বুঝুন।',
    heroSubHeadline: 'সহজ ও নির্ভুল।',
    heroDesc: 'ডাক্তারের প্রেসক্রিপশন ও ল্যাব রিপোর্ট আপলোড করুন। ওষুধের পার্শ্বপ্রতিক্রিয়া জানুন এবং নিজের ভাষায় অডিও শুনুন।',
    startExploring: 'এখনই শুরু করুন',
    openDashboard: 'ড্যাশবোর্ড খুলুন',
    howItWorks: 'কীভাবে কাজ করে',
    ocrExtraction: 'ওসিআর নির্ভুলতা',
    neuralSynthesis: 'দ্রুত বিশ্লেষণ',
    clientEncrypted: 'সম্পূর্ণ সুরক্ষিত',

    pipelineTitle: 'প্রেসক্রিপশন থেকে স্বচ্ছ বোঝাপড়া মাত্র চার ধাপে।',
    step1Title: 'নথিপত্র আপলোড',
    step1Desc: 'ক্যামেরা স্ক্যান ও পিডিএফ সুরক্ষিতভাবে জমা দিন।',
    step2Title: 'হস্তাক্ষর বিশ্লেষণ',
    step2Desc: 'ডাক্তারের হাতের লেখা ও টেস্ট রিপোর্ট স্পষ্ট করা হয়।',
    step3Title: 'ওষুধের সুরক্ষা',
    step3Desc: 'ওষুধের পারস্পরিক ক্ষতিকর প্রভাব পরীক্ষা করা হয়।',
    step4Title: 'বাংলায় অডিও বার্তা',
    step4Desc: 'বয়স্কদের সুবিধার্থে বাংলায় স্পষ্ট অডিও বিবরণ।',

    interactionTitle: 'ওষুধের পারস্পরিক ক্ষতিকর প্রভাব মিলিসেকেন্ডে পরীক্ষা করুন।',
    interactionDesc: 'একাধিক ডাক্তারের ওষুধের মধ্যে কোনো বিরূপ প্রভাব আছে কিনা তা জানুন।',
    lowRisk: 'কম ঝুঁকি',
    moderateRisk: 'মাঝারি',
    criticalRisk: 'উচ্চ ঝুঁকি',
    contraindicationRadar: 'পারস্পরিক প্রভাব যাচাই',
    pharmacokineticSpacing: 'ওষুধ খাওয়ার সঠিক ব্যবধান',

    labDecoderTitle: 'সহজ ভাষায় রক্ত ও টেস্ট রিপোর্ট বুঝুন।',
    labDecoderDesc: 'জটিল পরিভাষা ছাড়াই ব্লাড সুগার ও সিবিসি রিপোর্টের সহজ ব্যাখ্যা।',
    uploadLabReport: 'ল্যাব রিপোর্ট আপলোড করুন',

    voiceTitle: 'বাংলায় কথা বলা ডিজিটাল স্বাস্থ্য সহযোগী।',
    voiceDesc: 'চিকিৎসা ব্যবস্থা সবার জন্য। আমাদের সিস্টেম বয়স্কদের জন্য বাংলায় রিপোর্ট পড়ে শোনায়।',
    voiceDemoTitle: 'বাংলা ভয়েস ডেমো',
    clickToHear: 'বাংলায় রিপোর্ট শুনতে ক্লিক করুন',
    speakingNow: 'অডিও চলছে...',
    playVoice: 'বাংলায় শুনুন',

    vaultTitle: 'ব্যক্তিগত মেডিকেল ভল্ট',
    unifiedView: 'একত্রে দেখুন',
    rxSafetyTab: 'প্রেসক্রিপশন ও সুরক্ষা',
    labDiagTab: 'ল্যাব রিপোর্ট',
    activeRx: 'চলমান ওষুধ',
    labBiomarkers: 'বায়োমার্কার',
    scanRxPhoto: 'ছবি স্ক্যান করুন',
    uploadPrescription: 'প্রেসক্রিপশন আপলোড',
    activeSchedule: 'দৈনিক ওষুধের সময়সূচি',
    addRx: 'ওষুধ যোগ করুন',
    rxTimeline: 'প্রেসক্রিপশন ইতিহাস',
    extractedPanels: 'ল্যাব বায়োমার্কার',
    diagFeed: 'রিপোর্ট টাইমলাইন',
    askAi: 'ওষুধ বা রিপোর্ট সম্পর্কে প্রশ্ন করুন...',
    askQuestionsTitle: 'আপনার স্বাস্থ্য রিপোর্ট সম্পর্কে প্রশ্ন করুন',
    zeroKnowledgeVault: 'সম্পূর্ণ এনক্রিপ্টেড ভল্ট',
  },

  ta: {
    workspace: 'பணிவெளி',
    prescriptions: 'மருந்துச் சீட்டு',
    labDiagnostics: 'ஆய்வக அறிக்கைகள்',
    aiChat: 'ஏஐ உரையாடல்',
    intelligence: 'மருத்துவ நுண்ணறிவு',
    safetyMatrix: 'பாதுகாப்பு கட்டமைப்பு',
    labDecoding: 'அறிக்கை விளக்கம்',
    pipeline: 'செயல்முறை',
    requestAccess: 'அணுகல் கோருக',
    member: 'உறுப்பினர்',
    active: 'செயலில்',
    endSession: 'வெளியேறு',
    notifications: 'அறிவிப்புகள்',
    markAllRead: 'அனைத்தும் படிக்கப்பட்டது',

    distributedIntel: 'பரவலாக்கப்பட்ட மருத்துவ நுண்ணறிவு',
    heroHeadline: 'உங்கள் ஆரோக்கியத்தை உணருங்கள்.',
    heroSubHeadline: 'எளிமையாகவும் துல்லியமாகவும்.',
    heroDesc: 'மருத்துவர் மருந்துச் சீட்டுகளையும் ஆய்வக அறிக்கைகளையும் பதிவேற்றி, மருந்துகளின் கலவை பாதுகாப்பை உங்கள் தாய்மொழியில் கேட்டுத் தெரிந்து கொள்ளுங்கள்.',
    startExploring: 'தொடங்குக',
    openDashboard: 'முகப்பை திறக்க',
    howItWorks: 'எப்படி செயல்படுகிறது',
    ocrExtraction: 'துல்லியமான கண்டறிதல்',
    neuralSynthesis: 'விரைவான ஆய்வு',
    clientEncrypted: 'முழுமையான பாதுகாப்பு',

    pipelineTitle: 'நான்கு எளிய நிலைகளில் தெளிவான புரிதல்.',
    step1Title: 'ஆவணம் பதிவேற்றம்',
    step1Desc: 'கேமரா மூலம் எளிதாக ஸ்கேன் செய்து பதிவேற்றலாம்.',
    step2Title: 'எழுத்து பகுப்பாய்வு',
    step2Desc: 'மருத்துவரின் கையெழுத்து துல்லியமாகப் படிக்கப்படுகிறது.',
    step3Title: 'மருந்து பாதுகாப்பு',
    step3Desc: 'ஒன்றுக்கு மேற்பட்ட மருந்துகளின் பாதுகாப்பை உறுதிசெய்கிறது.',
    step4Title: 'தமிழ் குரல் வடிவம்',
    step4Desc: 'முதியவர்களுக்காக தமிழில் பேசி வழிகாட்டும் சேவை.',

    interactionTitle: 'மருந்துகளின் கலவை பாதுகாப்பை உடனடியாக அறிக.',
    interactionDesc: 'வெவ்வேறு மருத்துவர்கள் பரிந்துரைத்த மருந்துகளால் பக்கவிளைவுகள் ஏற்படாமல் தடுக்கும் அறிவுரைகள்.',
    lowRisk: 'குறைந்த ஆபத்து',
    moderateRisk: 'நடுத்தரம்',
    criticalRisk: 'அதி முக்கியம்',
    contraindicationRadar: 'பாதிப்பு எச்சரிக்கை',
    pharmacokineticSpacing: 'மருந்து உட்கொள்ளும் இடைவெளி',

    labDecoderTitle: 'ஆய்வக அறிக்கைகளை எளிதாகப் புரிந்து கொள்ளுங்கள்.',
    labDecoderDesc: 'இரத்த சர்க்கரை மற்றும் கொலஸ்ட்ரால் அளவுகளை தமிழில் எளிய நடையில் விளக்குகிறது.',
    uploadLabReport: 'அறிக்கையை பதிவேற்றுக',

    voiceTitle: 'தமிழில் பேசி விளக்கும் மருத்துவ உதவியாளர்.',
    voiceDesc: 'அனைவருக்கும் எளிய மருத்துவ சேவை. உங்கள் அறிக்கையை தமிழிலேயே வாசித்து விளக்குகிறது.',
    voiceDemoTitle: 'தமிழ் குரல் மாதிரி',
    clickToHear: 'தமிழில் கேட்க கிளிக் செய்யவும்',
    speakingNow: 'குரல் ஒலிக்கிறது...',
    playVoice: 'குரல் வழியே கேள்',

    vaultTitle: 'மருத்துவ பாதுகாப்பு பெட்டகம்',
    unifiedView: 'முழுப் பார்வை',
    rxSafetyTab: 'மருந்து பாதுகாப்பு',
    labDiagTab: 'ஆய்வக சோதனைகள்',
    activeRx: 'நடப்பு மருந்துகள்',
    labBiomarkers: 'பயோமார்க்கர்கள்',
    scanRxPhoto: 'கேமரா ஸ்கேன்',
    uploadPrescription: 'மருந்துச் சீட்டு பதிவேற்றம்',
    activeSchedule: 'மருந்து உட்கொள்ளும் அட்டவணை',
    addRx: 'மருந்து சேர்க்க',
    rxTimeline: 'மருத்துவ காலவரிசை',
    extractedPanels: 'பிரித்தெடுக்கப்பட்ட குறியீடுகள்',
    diagFeed: 'சோதனை அறிக்கைகள்',
    askAi: 'மருந்துகள் அல்லது அறிக்கைகள் குறித்து கேட்க...',
    askQuestionsTitle: 'உங்கள் ஆரோக்கியம் குறித்து கேட்கவும்',
    zeroKnowledgeVault: 'மறைகுறியாக்கப்பட்ட பெட்டகம்',
  },

  te: {
    workspace: 'వర్క్‌స్పేస్',
    prescriptions: 'ప్రిస్క్రిప్షన్లు',
    labDiagnostics: 'ల్యాబ్ నివేదికలు',
    aiChat: 'ఏఐ సంభాషణ',
    intelligence: 'వైద్య మేధస్సు',
    safetyMatrix: 'రక్షణ వ్యవస్థ',
    labDecoding: 'నివేదిక విశ్లేషణ',
    pipeline: 'విధానం',
    requestAccess: 'యాక్సెస్ పొందండి',
    member: 'సభ్యులు',
    active: 'చురుకుగా ఉంది',
    endSession: 'లాగౌట్',
    notifications: 'నోటిఫికేషన్లు',
    markAllRead: 'అన్నీ చదివినట్లు మార్క్ చేయండి',

    distributedIntel: 'ఆధునిక వైద్య సాంకేతికత',
    heroHeadline: 'మీ ఆరోగ్యాన్ని సులభంగా అర్థం చేసుకోండి.',
    heroSubHeadline: 'వేగంగా మరియు స్పష్టంగా.',
    heroDesc: 'ప్రిస్క్రిప్షన్లు మరియు ల్యాబ్ నివేదికలను అప్‌లోడ్ చేయండి, మందుల పరస్పర చర్యలను తనిఖీ చేయండి మరియు తెలుగులో ఆడియో వివరణ వినండి.',
    startExploring: 'ఇప్పుడే ప్రారంభించండి',
    openDashboard: 'డాష్‌బోర్డ్ తెరవండి',
    howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
    ocrExtraction: 'ఖచ్చితమైన గుర్తింపు',
    neuralSynthesis: 'త్వరిత విశ్లేషణ',
    clientEncrypted: 'పూర్తి భద్రత',

    pipelineTitle: 'నాలుగు దశల్లో పూర్తి ఆరోగ్య స్పష్టత.',
    step1Title: 'పత్రాల అప్‌లోడ్',
    step1Desc: 'కెమెరా స్కాన్ లేదా పిడిఎఫ్ ద్వారా సులభంగా అప్‌లోడ్ చేయండి.',
    step2Title: 'రాతపూర్వక గుర్తింపు',
    step2Desc: 'వైద్యుల చేతిరాత మరియు నివేదికల కచ్చితమైన విశ్లేషణ.',
    step3Title: 'మందుల భద్రత',
    step3Desc: 'వివిధ మందుల మధ్య హానికరమైన పరస్పర చర్యల పరిశీలన.',
    step4Title: 'తెలుగు వాయిస్ ఆడియో',
    step4Desc: 'పెద్దల కోసం తెలుగులో మాట్లాడి వివరించే సాంకేతికత.',

    interactionTitle: 'మందుల భద్రతా విశ్లేషణను క్షణాల్లో పొందండి.',
    interactionDesc: 'వివిధ వైద్యులు రాసిన మందుల మధ్య ఏవైనా సమస్యలు ఉన్నాయా అని తనిఖీ చేస్తుంది.',
    lowRisk: 'తక్కువ ప్రమాదం',
    moderateRisk: 'మధ్యస్థం',
    criticalRisk: 'అత్యవసరం',
    contraindicationRadar: 'హెచ్చరిక రాడార్',
    pharmacokineticSpacing: 'మందుల మధ్య సరైన సమయం',

    labDecoderTitle: 'ల్యాబ్ నివేదికలను సులభమైన తెలుగులో అర్థం చేసుకోండి.',
    labDecoderDesc: 'బ్లడ్ షుగర్ మరియు ఇతర టెస్ట్ రిపోర్టుల యొక్క సరళమైన వివరణ.',
    uploadLabReport: 'ల్యాబ్ రిపోర్ట్ అప్‌లోడ్ చేయండి',

    voiceTitle: 'తెలుగులో మాట్లాడే వైద్య సహాయకుడు.',
    voiceDesc: 'మీ ల్యాబ్ రిపోర్టులను తెలుగులోనే స్పష్టంగా వినిపిస్తుంది.',
    voiceDemoTitle: 'తెలుగు వాయిస్ డెమో',
    clickToHear: 'తెలుగులో వినడానికి క్లిక్ చేయండి',
    speakingNow: 'ఆడియో నడుస్తోంది...',
    playVoice: 'వాయిస్ వినండి',

    vaultTitle: 'డిజిటల్ హెల్త్ వాల్ట్',
    unifiedView: 'మొత్తం వీక్షణ',
    rxSafetyTab: 'ప్రిస్క్రిప్షన్లు & భద్రత',
    labDiagTab: 'ల్యాబ్ పరీక్షలు',
    activeRx: 'ప్రస్తుత మందులు',
    labBiomarkers: 'ల్యాబ్ మార్కర్లు',
    scanRxPhoto: 'కెమెరా స్కాన్',
    uploadPrescription: 'ప్రిస్క్రిప్షన్ అప్‌లోడ్',
    activeSchedule: 'మందుల సమయ పట్టిక',
    addRx: 'మందును జోడించండి',
    rxTimeline: 'ప్రిస్క్రిప్షన్ చరిత్ర',
    extractedPanels: 'గుర్తించిన అంశాలు',
    diagFeed: 'నివేదికల ఫీడ్',
    askAi: 'మందులు లేదా రిపోర్టుల గురించి అడగండి...',
    askQuestionsTitle: 'మీ ఆరోగ్య పత్రాల గురించి ప్రశ్నలు అడగండి',
    zeroKnowledgeVault: 'రక్షిత డిజిటల్ వాల్ట్',
  },

  mr: {
    workspace: 'कार्यक्षेत्र',
    prescriptions: 'प्रिस्क्रिप्शन व औषधे',
    labDiagnostics: 'लॅब अहवाल',
    aiChat: 'एआय संवाद',
    intelligence: 'वैद्यकीय बुद्धिमत्ता',
    safetyMatrix: 'सुरक्षा मॅट्रिक्स',
    labDecoding: 'अहवाल विश्लेषण',
    pipeline: 'प्रक्रिया',
    requestAccess: 'प्रवेश विनंती',
    member: 'सदस्य',
    active: 'सक्रिय',
    endSession: 'लॉग आउट',
    notifications: 'सूचना',
    markAllRead: 'सर्व वाचले म्हणून चिन्हांकित करा',

    distributedIntel: 'प्रगत वैद्यकीय बुद्धिमत्ता',
    heroHeadline: 'आपले आरोग्य सोप्या भाषेत समजून घ्या.',
    heroSubHeadline: 'वेगवान आणि अचूक.',
    heroDesc: 'प्रिस्क्रिप्शन आणि लॅब अहवाल अपलोड करा, औषधांमधील परस्पर परिणाम तपासा आणि मराठीत ऑडिओ ऐका.',
    startExploring: 'आता सुरू करा',
    openDashboard: 'डॅशबोर्ड उघडा',
    howItWorks: 'हे कसे कार्य करते',
    ocrExtraction: 'अचूक ओळख',
    neuralSynthesis: 'जलद विश्लेषण',
    clientEncrypted: 'पूर्ण सुरक्षित',

    pipelineTitle: 'चार सोप्या टप्प्यांत संपूर्ण आरोग्य स्पष्टता.',
    step1Title: 'कागदपत्रे अपलोड',
    step1Desc: 'कॅमेरा स्कॅन किंवा पीडीएफ द्वारे सुरक्षितपणे अपलोड करा.',
    step2Title: 'हस्ताक्षर विश्लेषण',
    step2Desc: 'डॉक्टरांचे हस्ताक्षर आणि रिपोर्टचे अचूक वाचन.',
    step3Title: 'औषध सुरक्षा तपासणी',
    step3Desc: 'औषधांमधील संभाव्य धोके आणि दुष्परिणामांची तपासणी.',
    step4Title: 'मराठी ऑडिओ मार्गदर्शन',
    step4Desc: 'ज्येष्ठांसाठी मराठीत बोलून माहिती देणारी प्रणाली.',

    interactionTitle: 'औषधांच्या परस्पर परिणामांची त्वरित तपासणी.',
    interactionDesc: 'वेगवेगळ्या डॉक्टरांच्या औषधांमध्ये कोणताही धोकादायक परस्परसंवाद नाही ना याची खात्री करा.',
    lowRisk: 'कमी जोखीम',
    moderateRisk: 'मध्यम',
    criticalRisk: 'अतिसंवेदनशील',
    contraindicationRadar: 'धोका चेतावणी',
    pharmacokineticSpacing: 'औषधे घेण्यामधील अंतर',

    labDecoderTitle: 'क्लिष्ट शब्दांशिवाय लॅब अहवाल समजून घ्या.',
    labDecoderDesc: 'ब्लड शुगर, कोलेस्टेरॉल आणि सीबीसी अहवालांचे मराठीत सोपे स्पष्टीकरण.',
    uploadLabReport: 'लॅब अहवाल अपलोड करा',

    voiceTitle: 'मराठीत बोलणारा डिजिटल आरोग्य सहाय्यक.',
    voiceDesc: 'आपल्या भाषेतील आरोग्य सेवा. वैद्यवाणी संपूर्ण अहवाल मराठीत वाचून दाखवते.',
    voiceDemoTitle: 'मराठी व्हॉईस डेमो',
    clickToHear: 'मराठीत ऐकण्यासाठी क्लिक करा',
    speakingNow: 'ऑडिओ चालू आहे...',
    playVoice: 'आवाजात ऐका',

    vaultTitle: 'वैद्यकीय सुरक्षा व्हॉल्ट',
    unifiedView: 'एकत्रित दृश्य',
    rxSafetyTab: 'प्रिस्क्रिप्शन व सुरक्षा',
    labDiagTab: 'लॅब अहवाल तपासणी',
    activeRx: 'चालू औषधे',
    labBiomarkers: 'बायोमार्कर्स',
    scanRxPhoto: 'फोटो स्कॅन करा',
    uploadPrescription: 'प्रिस्क्रिप्शन अपलोड',
    activeSchedule: 'दैनिक औषध वेळापत्रक',
    addRx: 'औषध जोडा',
    rxTimeline: 'प्रिस्क्रिप्शन इतिहास',
    extractedPanels: 'बायोमार्कर निकाल',
    diagFeed: 'अहवाल टाइमलाइन',
    askAi: 'औषधे किंवा रिपोर्टबद्दल विचारा...',
    askQuestionsTitle: 'आपल्या आरोग्याविषयी प्रश्न विचारा',
    zeroKnowledgeVault: 'एनक्रिप्टेड व्हॉल्ट',
  },

  gu: {
    workspace: 'વર્કસ્પેસ',
    prescriptions: 'પ્રિસ્ક્રિપ્શન અને દવાઓ',
    labDiagnostics: 'લેબ રિપોર્ટ્સ',
    aiChat: 'એઆઈ સંવાદ',
    intelligence: 'તબીબી બુદ્ધિમત્તા',
    safetyMatrix: 'સુરક્ષા માળખું',
    labDecoding: 'રિપોર્ટ સમજૂતી',
    pipeline: 'પ્રક્રિયા',
    requestAccess: 'પ્રવેશ વિનંતી',
    member: 'સભ્ય',
    active: 'સક્રિય',
    endSession: 'લૉગ આઉટ',
    notifications: 'સૂચનાઓ',
    markAllRead: 'બધું વાંચેલું માર્ક કરો',

    distributedIntel: 'આધુનિક તબીબી બુદ્ધિમત્તા',
    heroHeadline: 'તમારા સ્વાસ્થ્યને સરળતાથી સમજો.',
    heroSubHeadline: 'ઝડપી અને સચોટ.',
    heroDesc: 'ડોક્ટરનું પ્રિસ્ક્રિપ્શન અને લેબ રિપોર્ટ અપલોડ કરો, દવાઓની આડઅસર ચકાસો અને ગુજરાતીમાં ઑડિયો સાંભળો.',
    startExploring: 'હમણાં જ શરૂ કરો',
    openDashboard: 'ડેશબોર્ડ ખોલો',
    howItWorks: 'આ કેવી રીતે કાર્ય કરે છે',
    ocrExtraction: 'સચોટ ઓળખ',
    neuralSynthesis: 'ઝડપી વિશ્લેષણ',
    clientEncrypted: 'સંપૂર્ણ સુરક્ષિત',

    pipelineTitle: 'ચાર સરળ તબક્કામાં સંપૂર્ણ આરોગ્ય સ્પષ્ટતા.',
    step1Title: 'દસ્તાવેજ અપલોડ',
    step1Desc: 'કેમેરા સ્કેન અથવા પીડીએફ દ્વારા સરળતાથી અપલોડ કરો.',
    step2Title: 'હસ્તાક્ષર વિશ્લેષણ',
    step2Desc: 'ડોક્ટરના લખાણ અને રિપોર્ટનું ચોક્કસ વાંચન.',
    step3Title: 'દવા સુરક્ષા તપાસ',
    step3Desc: 'દવાઓ વચ્ચેના સંભવિત જોખમોની ઓળખ.',
    step4Title: 'ગુજરાતી ઑડિયો માર્ગદર્શન',
    step4Desc: 'વડીલો માટે ગુજરાતીમાં બોલીને સમજાવતી ટેકનોલોજી.',

    interactionTitle: 'દવાઓની પરસ્પર અસરોની ત્વરિત તપાસ.',
    interactionDesc: 'અલગ અલગ ડોક્ટરોની દવાઓ વચ્ચે કોઈ નુકસાનકારક ટકરાવ નથી તેની ખાતરી કરો.',
    lowRisk: 'ઓછું જોખમ',
    moderateRisk: 'મધ્યમ',
    criticalRisk: 'અતિ સંવેદનશીલ',
    contraindicationRadar: 'જોખમ ચેતવણી',
    pharmacokineticSpacing: 'દવા લેવા વચ્ચેનો યોગ્ય સમય',

    labDecoderTitle: 'અઘરા શબ્દો વિના લેબ રિપોર્ટ સમજો.',
    labDecoderDesc: 'બ્લડ સુગર, કોલેસ્ટ્રોલ અને સીબીસી રિપોર્ટની સરળ ગુજરાતીમાં સમજૂતી.',
    uploadLabReport: 'લેબ રિપોર્ટ અપલોડ કરો',

    voiceTitle: 'ગુજરાતીમાં બોલતો ડિજિટલ હેલ્થ સહાયક.',
    voiceDesc: 'તમારા રિપોર્ટ્સને ગુજરાતીમાં સ્પષ્ટ અવાજમાં સાંભળો.',
    voiceDemoTitle: 'ગુજરાતી વૉઇસ ડેમો',
    clickToHear: 'ગુજરાતીમાં સાંભળવા ક્લિક કરો',
    speakingNow: 'ઑડિયો ચાલુ છે...',
    playVoice: 'અવાજમાં સાંભળો',

    vaultTitle: 'ડિજિટલ હેલ્થ વૉલ્ટ',
    unifiedView: 'સંયુક્ત દૃશ્ય',
    rxSafetyTab: 'પ્રિસ્ક્રિપ્શન અને સુરક્ષા',
    labDiagTab: 'લેબ પરીક્ષણો',
    activeRx: 'ચાલુ દવાઓ',
    labBiomarkers: 'બાયોમાર્કર્સ',
    scanRxPhoto: 'કેમેરા સ્કેન',
    uploadPrescription: 'પ્રિસ્ક્રિપ્શન અપલોડ',
    activeSchedule: 'દવા સમયપત્રક',
    addRx: 'દવા ઉમેરો',
    rxTimeline: 'પ્રિસ્ક્રિપ્શન ઇતિહાસ',
    extractedPanels: 'તારવેલા તત્વો',
    diagFeed: 'રિપોર્ટ્સ ફીડ',
    askAi: 'દવાઓ અથવા રિપોર્ટ્સ વિશે પૂછો...',
    askQuestionsTitle: 'તમારા રિપોર્ટ્સ વિશે પ્રશ્નો પૂછો',
    zeroKnowledgeVault: 'સુરક્ષિત ડિજિટલ વૉલ્ટ',
  },
};

interface LanguageContextType {
  currentLanguage: LanguageOption;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
  speakText: (customText?: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(() => {
    const saved = localStorage.getItem('vv_lang');
    const found = LANGUAGES.find(l => l.code === saved);
    return found || LANGUAGES[0];
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    localStorage.setItem('vv_lang', currentLanguage.code);
  }, [currentLanguage]);

  const setLanguage = (code: LanguageCode) => {
    const lang = LANGUAGES.find(l => l.code === code);
    if (lang) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setCurrentLanguage(lang);
    }
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[currentLanguage.code] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  const speakText = (customText?: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const textToSpeak = customText || currentLanguage.defaultSpeechText;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = currentLanguage.speechCode;
    utterance.rate = 0.92;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, speakText, stopSpeaking, isSpeaking }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
