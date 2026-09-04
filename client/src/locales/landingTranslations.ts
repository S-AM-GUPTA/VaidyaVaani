export interface LandingContent {
  taglineBadge: string;
  heroHeadline: string;
  heroHighlight: string;
  heroSubtitle: string;
  ctaUpload: string;
  ctaGenericSearch: string;
  ctaVoiceDemo: string;
  trustedBy: string;

  // Feature Cards
  feature1Badge: string;
  feature1Title: string;
  feature1Desc: string;
  feature1Cta: string;
  feature1Tags: string[];

  feature2Badge: string;
  feature2Title: string;
  feature2Desc: string;
  feature2Cta: string;
  feature2Tags: string[];

  // Case study
  caseBadge: string;
  caseTitle: string;
  caseSubtitle: string;
  caseProblemTitle: string;
  caseProblemDesc: string;
  caseProblemItems: string[];
  caseSolutionTitle: string;
  caseSolutionDesc: string;
  caseSolutionAlert: string;
  caseSolutionItems: string[];

  // Biomarker Preview
  biomarkerBadge: string;
  biomarkerTitle: string;
  biomarkerSubtitle: string;
  biomarkerNotice: string;
  sampleHbA1c: string;
  sampleHbA1cDesc: string;
  sampleFBS: string;
  sampleFBSDesc: string;
  sampleCreatinine: string;
  sampleCreatinineDesc: string;
  sampleCholesterol: string;
  sampleCholesterolDesc: string;

  // 4 Safety Pillars
  pillarsBadge: string;
  pillarsTitle: string;
  pillarsSubtitle: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;

  // 3-step workflow
  workflowBadge: string;
  workflowTitle: string;
  workflowSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Testimonials
  testimonialsBadge: string;
  testimonialsTitle: string;
  testimonial1Text: string;
  testimonial1Author: string;
  testimonial1Role: string;
  testimonial2Text: string;
  testimonial2Author: string;
  testimonial2Role: string;

  // Final CTA
  bottomCtaTitle: string;
  bottomCtaSubtitle: string;
  bottomCtaBtn: string;
  bottomCtaSubtext: string;

  // Voice Speech Synthesis Text
  voiceSummaryText: string;
}

export const LANDING_TRANSLATIONS: Record<string, LandingContent> = {
  en: {
    taglineBadge: "ABDM & Ayushman Bharat Aligned • Indian Patient Safety",
    heroHeadline: "Clinical Intelligence.",
    heroHighlight: "Every Prescription. Every Lab Report.",
    heroSubtitle: "Upload messy doctor handwriting or diagnostic reports. VaidyaVaani flags lethal multi-doctor drug overlaps, decodes blood biomarkers into plain language, and speaks to your family in your regional dialect.",
    ctaUpload: "Upload Prescription or Lab Report",
    ctaGenericSearch: "Generic Medicine Salt Finder",
    ctaVoiceDemo: "Listen to Voice Briefing",
    trustedBy: "Empowering 50,000+ Indian families, senior citizens, and caregivers nationwide",

    feature1Badge: "Biomarker Decoder",
    feature1Title: "Smart Lab Report Decoder",
    feature1Desc: "Demystifies HbA1c, Liver & Kidney function panels, Lipid profiles, and CBC blood counts into crystal-clear visual status sliders with targeted questions for your doctor.",
    feature1Cta: "Explore Lab Report Decoder →",
    feature1Tags: ["Visual Ranges", "3-Visit Progression", "Doctor Questions"],

    feature2Badge: "Interaction Engine",
    feature2Title: "Multi-Doctor Drug Conflict Radar",
    feature2Desc: "Cross-checks active medications from multiple clinics. Detects dangerous Paracetamol overdose, NSAID internal bleeding risks, and provides hour-by-hour safe scheduling.",
    feature2Cta: "Open Drug Safety Matrix →",
    feature2Tags: ["Dosage Calculator", "Bleed Hazard Alert", "Doctor Slip"],

    caseBadge: "Real Clinical Scenario • Indian Care Matrix",
    caseTitle: "How VaidyaVaani Stopped a Lethal Drug Overdose",
    caseSubtitle: "Case Study: 64-year-old Ramesh Kumar consulted a cardiologist and an orthopedic surgeon within 4 days.",
    caseProblemTitle: "Uncoordinated Care: The Hidden Hazard",
    caseProblemDesc: "Both doctors prescribed Paracetamol under different brand names, along with overlapping blood thinners and NSAIDs without knowing the existing routine.",
    caseProblemItems: [
      "Crocin 650mg TDS (Cardiologist) + Combiflam TDS (Orthopedic) = 3,950mg Paracetamol/day (Fatal liver toxicity threshold)",
      "Eco-Sprin 75mg + Combiflam (Ibuprofen) = Severe gastrointestinal ulceration & internal bleeding risk"
    ],
    caseSolutionTitle: "VaidyaVaani Intelligent Safety Radar",
    caseSolutionDesc: "As soon as both prescriptions were uploaded, VaidyaVaani flagged the duplicate molecule and generated an emergency reconciliation slip.",
    caseSolutionAlert: "URGENT OVERDOSE WARNING: Daily Paracetamol intake exceeds 3,000mg. Combiflam contains 325mg duplicate Paracetamol + Ibuprofen.",
    caseSolutionItems: [
      "Flagged duplicate Paracetamol molecule instantly before the first dose",
      "Calculated exact 24-hour safe routine schedule with 6-hour spacing",
      "Generated 1-click printable doctor reconciliation summary for WhatsApp"
    ],

    biomarkerBadge: "Interactive Lab Diagnostics",
    biomarkerTitle: "Understand Blood Tests Without Medical Jargon",
    biomarkerSubtitle: "Clear color-coded ranges showing exactly where your health stands.",
    biomarkerNotice: "Live Sample: 14 Oct 2024 • Dr. Lal PathLabs Standard Panel",
    sampleHbA1c: "HbA1c (3-Month Sugar)",
    sampleHbA1cDesc: "8.2% — High (Target < 7.0%). Suggests persistent hyperglycemia.",
    sampleFBS: "Fasting Blood Sugar (FBS)",
    sampleFBSDesc: "164 mg/dL — High (Normal: 70–100 mg/dL).",
    sampleCreatinine: "Serum Creatinine (Kidney)",
    sampleCreatinineDesc: "1.05 mg/dL — Normal & Healthy (Range: 0.70–1.20 mg/dL).",
    sampleCholesterol: "Total Cholesterol",
    sampleCholesterolDesc: "232 mg/dL — Borderline High (Desirable < 200 mg/dL).",

    pillarsBadge: "Clinical Foundation",
    pillarsTitle: "Four Pillars of Patient Safety",
    pillarsSubtitle: "Combining deep medical knowledge graphs with patient-first engineering.",
    pillar1Title: "Handwriting & OCR Engine",
    pillar1Desc: "Trained on thousands of Indian prescription handwriting samples to accurately parse brand names and dosages.",
    pillar2Title: "Multi-Drug Conflict Radar",
    pillar2Desc: "Instant pharmacology cross-checks to detect duplicate molecules, high cumulative dosage, and contraindications.",
    pillar3Title: "Pharmacokinetic Spacing",
    pillar3Desc: "Smart 24-hour schedules indicating exact morning, afternoon, and night timing before or after meals.",
    pillar4Title: "Regional Audio Briefing",
    pillar4Desc: "Reads out diagnoses and medicine instructions in Hindi, Bengali, Tamil, Telugu, Marathi, and Gujarati for elders.",

    workflowBadge: "Simple 3-Step Process",
    workflowTitle: "How VaidyaVaani Protects Your Family",
    workflowSubtitle: "Zero setup required. Start in under 30 seconds.",
    step1Title: "1. Snap or Upload",
    step1Desc: "Take a photo of doctor prescriptions or upload PDF diagnostic blood reports directly from your phone.",
    step2Title: "2. Instant AI Cross-Check",
    step2Desc: "Our clinical engine extracts medicines, validates safe dosage thresholds, and decodes abnormal biomarkers.",
    step3Title: "3. Safe Audio & Report",
    step3Desc: "Listen to the report in your language and share an organized doctor discussion checklist over WhatsApp.",

    testimonialsBadge: "Patient Testimonials",
    testimonialsTitle: "Trusted by Families Across India",
    testimonial1Text: "\"Thanks to VaidyaVaani, I discovered that my orthopedist and cardiologist had both prescribed Paracetamol under different brand names. It saved me from severe liver damage.\"",
    testimonial1Author: "Ramesh Kumar, 64",
    testimonial1Role: "Retired Government Officer, Kanpur",
    testimonial2Text: "\"My elderly mother cannot read English reports. We were very anxious about her diagnostic blood panel. VaidyaVaani explained everything in simple Hindi audio, bringing our family immense relief.\"",
    testimonial2Author: "Sunita Devi, 42",
    testimonial2Role: "Teacher & Caregiver, Jaipur",

    bottomCtaTitle: "Take Control of Your Medical Safety Today",
    bottomCtaSubtitle: "Join thousands of Indian families safeguarding their parents and loved ones from preventable drug errors.",
    bottomCtaBtn: "Get Started Free — Upload Document",
    bottomCtaSubtext: "100% Free • ABDM Ready • Encrypted & Private",
    voiceSummaryText: "Hello! Welcome to VaidyaVaani. You can upload doctor prescriptions and diagnostic lab reports. We check medication conflicts across multiple doctors and explain lab results in simple regional language audio."
  },

  hi: {
    taglineBadge: "आयुष्मान भारत एवं ABDM अनुरूप • भारतीय रोगी सुरक्षा",
    heroHeadline: "चिकित्सीय बुद्धिमत्ता।",
    heroHighlight: "हर पर्चा। हर लैब रिपोर्ट।",
    heroSubtitle: "डॉक्टर के कठिन हस्तलिखित पर्चे या लैब रिपोर्ट अपलोड करें। वैद्यवाणी कई डॉक्टरों की दवाओं के बीच घातक टकराव पकड़ती है, जटिल बायोमार्कर को सरल भाषा में समझाती है और आपकी मातृभाषा में बोलकर सुनाती है।",
    ctaUpload: "दवा पर्चा या लैब रिपोर्ट जोड़ें",
    ctaGenericSearch: "सस्ती जेनेरिक दवा खोजें",
    ctaVoiceDemo: "आवाज़ में रिपोर्ट सुनें",
    trustedBy: "देश भर के 50,000+ भारतीय परिवारों, बुजुर्गों और देखभालकर्ताओं का विश्वास",

    feature1Badge: "स्मार्ट लैब रिपोर्ट",
    feature1Title: "स्मार्ट लैब रिपोर्ट डिकोडर",
    feature1Desc: "HbA1c, लिवर और किडनी फंक्शन, लिपिड प्रोफाइल और सीबीसी को आसान विज़ुअल रेंज में समझें और डॉक्टर से पूछने योग्य जरूरी सवाल पाएं।",
    feature1Cta: "स्मार्ट लैब रिपोर्ट खोलें →",
    feature1Tags: ["विज़ुअल रेंज", "3 बार की प्रगति", "डॉक्टर के सवाल"],

    feature2Badge: "दवा सुरक्षा रडार",
    feature2Title: "मल्टी-डॉक्टर दवा सुरक्षा एवं टकराव",
    feature2Desc: "अलग-अलग डॉक्टरों की दवाओं का मिलान करें। पैरासिटामोल के ओवरडोज़ और खून पतला करने वाली दवाओं के आपसी जोखिम को रोकें।",
    feature2Cta: "दवा सुरक्षा मैट्रिक्स खोलें →",
    feature2Tags: ["खुराक कैलकुलेटर", "ब्लीडिंग अलर्ट", "डॉक्टर पर्ची"],

    caseBadge: "सच्चा चिकित्सीय मामला • भारतीय परिवार सुरक्षा",
    caseTitle: "वैद्यवाणी ने कैसे रोकी घातक दवा ओवरडोज़",
    caseSubtitle: "केस स्टडी: 64 वर्षीय रमेश कुमार ने 4 दिनों में कार्डियोलॉजिस्ट और ऑर्थोपेडिक सर्जन से अलग-अलग परामर्श लिया।",
    caseProblemTitle: "अनजानी चूक: छिपा हुआ घातक खतरा",
    caseProblemDesc: "दोनों डॉक्टरों ने अलग-अलग ब्रांड नामों से पैरासिटामोल और दर्द निवारक दवाएं लिख दीं, जिससे अनजान मरीज दोनों दवाएं एक साथ लेने लगे।",
    caseProblemItems: [
      "Crocin 650mg TDS + Combiflam TDS = 3,950mg पैरासिटामोल प्रतिदिन (घातक लिवर विषाक्तता सीमा)",
      "Eco-Sprin 75mg + Combiflam (Ibuprofen) = पेट में गंभीर अल्सर और आंतरिक रक्तस्राव (Internal Bleeding) का जोखिम"
    ],
    caseSolutionTitle: "वैद्यवाणी सुरक्षा रडार के साथ समाधान",
    caseSolutionDesc: "जैसे ही दोनों पर्चे अपलोड किए गए, वैद्यवाणी ने तुरंत डुप्लिकेट मॉलिक्यूल को पकड़ा और अलर्ट जारी किया।",
    caseSolutionAlert: "अति आवश्यक चेतावनी: दैनिक पैरासिटामोल सेवन 3,000mg से अधिक है। कॉम्बिफ्लैम में 325mg अतिरिक्त पैरासिटामोल और आइबुप्रोफेन शामिल है।",
    caseSolutionItems: [
      "पहली खुराक लेने से पहले ही डुप्लिकेट पैरासिटामोल मॉलिक्यूल को तुरंत पकड़ा",
      "दवाओं के बीच 6 घंटे का सुरक्षित अंतराल सुनिश्चित करने वाला 24-घंटे का शेड्यूल तैयार किया",
      "डॉक्टर को दिखाने के लिए 1-क्लिक समाधान पर्ची और व्हाट्सएप शेयरिंग दी"
    ],

    biomarkerBadge: "इंटरैक्टिव लैब बायोमार्कर",
    biomarkerTitle: "बिना कठिन शब्दों के ब्लड टेस्ट समझें",
    biomarkerSubtitle: "रंग-कोडित संकेतकों के साथ जानें कि आपका स्वास्थ्य किस स्थिति में है।",
    biomarkerNotice: "लाइव उदाहरण: 14 अक्टूबर 2024 • डॉ लाल पैथलैब्स मानक रिपोर्ट",
    sampleHbA1c: "HbA1c (3 महीने का औसत शुगर)",
    sampleHbA1cDesc: "8.2% — अनियंत्रित (लक्ष्य < 7.0%)। शुगर नियंत्रण की तत्काल आवश्यकता।",
    sampleFBS: "फास्टिंग ब्लड शुगर (FBS)",
    sampleFBSDesc: "164 mg/dL — बढ़ा हुआ (सामान्य: 70–100 mg/dL)।",
    sampleCreatinine: "सीरम क्रिएटिनिन (गुर्दे का स्वास्थ्य)",
    sampleCreatinineDesc: "1.05 mg/dL — पूर्णतः सामान्य एवं सुरक्षित (सामान्य: 0.70–1.20 mg/dL)।",
    sampleCholesterol: "टोटल कोलेस्ट्रॉल (हृदय स्वास्थ्य)",
    sampleCholesterolDesc: "232 mg/dL — सीमांत बढ़ा हुआ (वांछित < 200 mg/dL)।",

    pillarsBadge: "चिकित्सीय आधार",
    pillarsTitle: "रोगी सुरक्षा के चार मजबूत स्तंभ",
    pillarsSubtitle: "गहन चिकित्सा ज्ञान और भारतीय रोगियों के लिए विशेष रूप से डिज़ाइन की गई तकनीक।",
    pillar1Title: "हस्तलेखन और न्यूरल OCR",
    pillar1Desc: "भारतीय डॉक्टरों की लिखावट को सटीकता से पढ़ने के लिए हजारों वास्तविक पर्चों पर प्रशिक्षित।",
    pillar2Title: "मल्टी-ड्रग टकराव रडार",
    pillar2Desc: "दवाओं के डुप्लिकेट मॉलिक्यूल, अधिक खुराक और हानिकारक परस्पर प्रभाव की त्वरित पहचान।",
    pillar3Title: "सुरक्षित समय अंतराल",
    pillar3Desc: "सुबह, दोपहर और रात की दवाओं के लिए भोजन से पहले और बाद का सटीक 24-घंटे का शेड्यूल।",
    pillar4Title: "क्षेत्रीय भाषा में वॉयस ऑडियो",
    pillar4Desc: "बुजुर्गों के लिए पूरी रिपोर्ट और दवा लेने के नियम हिंदी और क्षेत्रीय भाषाओं में बोलकर समझाना।",

    workflowBadge: "सरल 3-चरणीय प्रक्रिया",
    workflowTitle: "वैद्यवाणी आपके परिवार की सुरक्षा कैसे करती है",
    workflowSubtitle: "किसी जटिल सेटअप की आवश्यकता नहीं। 30 सेकंड में शुरू करें।",
    step1Title: "1. फोटो खींचें या अपलोड करें",
    step1Desc: "डॉक्टर के पर्चे की फोटो खींचें या ब्लड टेस्ट की पीडीएफ सीधे अपने फोन से अपलोड करें।",
    step2Title: "2. तुरंत AI सुरक्षा जांच",
    step2Desc: "हमारा सिस्टम दवाओं की पहचान करता है, सुरक्षित खुराक की पुष्टि करता है और लैब रिपोर्ट को सरल बनाता है।",
    step3Title: "3. अपनी भाषा में सुनें और साझा करें",
    step3Desc: "अपनी मातृभाषा में ऑडियो रिपोर्ट सुनें और डॉक्टर से परामर्श के लिए सवाल व्हाट्सएप पर शेयर करें।",

    testimonialsBadge: "मरीजों के अनुभव",
    testimonialsTitle: "भारत भर के परिवारों का अटूट विश्वास",
    testimonial1Text: "\"वैद्यवाणी की मदद से मुझे पता चला कि मेरे दोनों डॉक्टरों ने अलग-अलग नामों से एक ही पैरासिटामोल लिख दी थी। इसने मुझे लिवर की गंभीर बीमारी से बचा लिया।\"",
    testimonial1Author: "रमेश कुमार, 64",
    testimonial1Role: "सेवानिवृत्त सरकारी अधिकारी, कानपुर",
    testimonial2Text: "\"मेरी माताजी अंग्रेजी रिपोर्ट नहीं पढ़ पाती हैं। हमें उनकी ब्लड रिपोर्ट को लेकर बहुत चिंता थी। वैद्यवाणी ने सरल हिंदी में बोलकर पूरी बात समझाई, जिससे हमें बहुत राहत मिली।\"",
    testimonial2Author: "सुनीता देवी, 42",
    testimonial2Role: "शिक्षिका एवं देखभालकर्ता, जयपुर",

    bottomCtaTitle: "आज ही अपनी और अपने परिवार की दवा सुरक्षा सुनिश्चित करें",
    bottomCtaSubtitle: "दवाओं के अनजाने टकराव और ओवरडोज़ से अपने प्रियजनों को सुरक्षित रखें।",
    bottomCtaBtn: "निःशुल्क शुरू करें — दस्तावेज़ अपलोड करें",
    bottomCtaSubtext: "100% निःशुल्क • आयुष्मान भारत ABDM तैयार • सुरक्षित एवं निजी",
    voiceSummaryText: "नमस्ते! वैद्यवाणी में आपका स्वागत है। आप अपने डॉक्टर के पर्चे और लैब रिपोर्ट अपलोड कर सकते हैं। हम दवाओं के आपसी टकराव की जांच करते हैं और रिपोर्ट को सरल भाषा में बोलकर समझाते हैं।"
  },

  bn: {
    taglineBadge: "আয়ুষ্মান ভারত ও ABDM সম্মত • রোগী সুরক্ষা ব্যবস্থা",
    heroHeadline: "উন্নত চিকিৎসা বুদ্ধিমত্তা।",
    heroHighlight: "প্রতিটি প্রেসক্রিপশন। প্রতিটি ল্যাব রিপোর্ট।",
    heroSubtitle: "ডাক্তারের জটিল হাতের লেখার প্রেসক্রিপশন বা ল্যাব রিপোর্ট আপলোড করুন। একাধিক ডাক্তারের ওষুধের ক্ষতিকর ওভারল্যাপ শনাক্ত করুন এবং বাংলায় স্পষ্ট অডিও শুনুন।",
    ctaUpload: "প্রেসক্রিপশন বা ল্যাব রিপোর্ট দিন",
    ctaGenericSearch: "জেনেরিক ওষুধের নাম ও দাম খুঁজুন",
    ctaVoiceDemo: "বাংলায় অডিও রিপোর্ট শুনুন",
    trustedBy: "ভারত জুড়ে ৫০,০০০+ পরিবার ও প্রবীণ নাগরিকদের বিশ্বস্ত স্বাস্থ্য সঙ্গী",

    feature1Badge: "বায়োমার্কার ডিকোডার",
    feature1Title: "স্মার্ট ল্যাব রিপোর্ট বিশ্লেষক",
    feature1Desc: "HbA1c, লিভার-কিডনি প্রোফাইল এবং সিবিসি টেস্টের সহজ বাংলা ব্যাখ্যা এবং ডাক্তারের জন্য গুরুত্বপূর্ণ প্রশ্নাবলী।",
    feature1Cta: "স্মার্ট ল্যাব রিপোর্ট দেখুন →",
    feature1Tags: ["ভিজ্যুয়াল রেঞ্জ", "৩ বারের অগ্রগতি", "ডাক্তারের প্রশ্ন"],

    feature2Badge: "ওষুধ সুরক্ষা রাডার",
    feature2Title: "মাল্টি-ডাক্তার ওষুধ দ্বন্দ্ব ও নিরাপত্তা",
    feature2Desc: "একাধিক ডাক্তারের প্রেসক্রিপশনের মধ্যে প্যারাসিটামলের ওভারডোজ এবং রক্তক্ষরণের ঝুঁকি তাৎক্ষণিকভাবে প্রতিরোধ করুন।",
    feature2Cta: "ওষুধ সুরক্ষা ম্যাট্রিক্স খুলুন →",
    feature2Tags: ["ডোজ ক্যালকুলেটর", "রক্তক্ষরণ সতর্কতা", "ডাক্তার স্লিপ"],

    caseBadge: "বাস্তব ঘটনা • রোগী সুরক্ষা বিশ্লেষণ",
    caseTitle: "বৈদ্যবাণী কীভাবে একটি মারাত্মক ওষুধের ওভারডোজ রুখেছে",
    caseSubtitle: "কেস স্টাডি: ৬৪ বছর বয়সী রমেশ কুমার ৪ দিনের মধ্যে হার্ট এবং অর্থোপেডিক বিশেষজ্ঞের পরামর্শ নেন।",
    caseProblemTitle: "অজান্তেই মারাত্মক ওষুধের বিপদ",
    caseProblemDesc: "উভয় ডাক্তার ভিন্ন ব্র্যান্ডের নামে প্যারাসিটামল এবং রক্ত পাতলা করার ওষুধ লিখেছিলেন, যার ফলে বিপজ্জনক মাত্রা তৈরি হয়।",
    caseProblemItems: [
      "Crocin 650mg + Combiflam = ৩,৯৫০ মিলিগ্রাম প্যারাসিটামল/দিন (মারাত্মক লিভার ক্ষতির কারণ)",
      "Eco-Sprin 75mg + Combiflam = পেটে মারাত্মক আলসার ও অভ্যন্তরীণ রক্তক্ষরণের ঝুঁকি"
    ],
    caseSolutionTitle: "বৈদ্যবাণী সুরক্ষা রাডারের মাধ্যমে সমাধান",
    caseSolutionDesc: "প্রেসক্রিপশন আপলোড করার সাথে সাথেই সিস্টেম দ্বৈত অণু শনাক্ত করে জরুরি সতর্কতা প্রদান করে।",
    caseSolutionAlert: "জরুরি সতর্কতা: দৈনিক প্যারাসিটামল সেবন ৩,০০০ মিলিগ্রামের বেশি। কম্বিফ্ল্যামে অতিরিক্ত প্যারাসিটামল ও আইবুপ্রোফেন রয়েছে।",
    caseSolutionItems: [
      "প্রথম ডোজ গ্রহণের আগেই ডুপ্লিকেট ওষুধ শনাক্ত করা হয়েছে",
      "৬ ঘণ্টার নিরাপদ ব্যবধান সহ ২৪ ঘণ্টার সময়সূচি প্রস্তুত করা হয়েছে",
      "হোয়াটসঅ্যাপের মাধ্যমে ডাক্তারের সাথে পরামর্শের স্লিপ তৈরি হয়েছে"
    ],

    biomarkerBadge: "ইন্টারেক্টিভ ল্যাব রিপোর্ট",
    biomarkerTitle: "সহজ ভাষায় রক্ত পরীক্ষার ফলাফল বুঝুন",
    biomarkerSubtitle: "রঙিন নির্দেশকের মাধ্যমে আপনার রক্তের প্রতিটি মান স্পষ্টভাবে জানুন।",
    biomarkerNotice: "লাইভ নমুনা: ১৪ অক্টোবর ২০২৪ • ডক্টর লাল প্যাথল্যাবস স্ট্যান্ডার্ড",
    sampleHbA1c: "HbA1c (৩ মাসের গড় সুগার)",
    sampleHbA1cDesc: "৮.২% — অনিয়ন্ত্রিত (স্বাভাবিক < ৭.০%)। সুগার নিয়ন্ত্রণের পরামর্শ প্রয়োজন।",
    sampleFBS: "ফাস্টিং ব্লাড সুগার (FBS)",
    sampleFBSDesc: "১৬৪ mg/dL — উচ্চ (স্বাভাবিক: ৭০–১০০ mg/dL)।",
    sampleCreatinine: "সিরাম ক্রিয়েটিনিন (কিডনির স্বাস্থ্য)",
    sampleCreatinineDesc: "১.০৫ mg/dL — সম্পূর্ণ স্বাভাবিক ও নিরাপদ (০.৭০–১.২০ mg/dL)।",
    sampleCholesterol: "টোটাল কোলেস্টেরল",
    sampleCholesterolDesc: "২৩২ mg/dL — সামান্য বেশি (আকাঙ্ক্ষিত < ২০০ mg/dL)।",

    pillarsBadge: "চিকিৎসা সুরক্ষা স্তম্ভ",
    pillarsTitle: "রোগী সুরক্ষার চারটি মূল স্তম্ভ",
    pillarsSubtitle: "ভারতীয় রোগীদের জন্য তৈরি নির্ভুল এআই প্রযুক্তি।",
    pillar1Title: "হস্তাক্ষর ও নিউরাল OCR",
    pillar1Desc: "ডাক্তারের হাতের লেখা সঠিকভাবে পড়ার জন্য হাজার হাজার প্রেসক্রিপশনে প্রশিক্ষিত।",
    pillar2Title: "ওষুধ দ্বন্দ্ব রাডার",
    pillar2Desc: "একই ওষুধের ডুপ্লিকেট ফর্মুলা এবং অতিরিক্ত ডোজের দ্রুত শনাক্তকরণ।",
    pillar3Title: "সঠিক সময় ব্যবধান",
    pillar3Desc: "সকাল, দুপুর ও রাতের ওষুধ খাওয়ার সঠিক ২৪ ঘণ্টার রুটিন।",
    pillar4Title: "বাংলায় ভয়েস অডিও",
    pillar4Desc: "বয়স্কদের জন্য পুরো রিপোর্ট এবং ওষুধ সেবনের নিয়ম বাংলায় পড়ে শোনায়।",

    workflowBadge: "সহজ ৩টি ধাপ",
    workflowTitle: "বৈদ্যবাণী কীভাবে আপনার পরিবারকে রক্ষা করে",
    workflowSubtitle: "কোনো জটিলতা নেই। মাত্র ৩০ সেকেন্ডে শুরু করুন।",
    step1Title: "১. ছবি তুলুন বা আপলোড করুন",
    step1Desc: "প্রেসক্রিপশনের ছবি তুলুন বা ল্যাব রিপোর্টের পিডিএফ আপলোড করুন।",
    step2Title: "২. তাৎক্ষণিক এআই বিশ্লেষণ",
    step2Desc: "সিস্টেম ওষুধ শনাক্ত করে এবং ল্যাব রিপোর্টের সঠিক ব্যাখ্যা তৈরি করে।",
    step3Title: "৩. বাংলায় শুনুন ও শেয়ার করুন",
    step3Desc: "নিজের ভাষায় অডিও রিপোর্ট শুনুন এবং ডাক্তারের জন্য প্রশ্ন তালিকা হোয়াটসঅ্যাপে শেয়ার করুন।",

    testimonialsBadge: "রোগীদের অভিজ্ঞতা",
    testimonialsTitle: "ভারত জুড়ে পরিবারের নির্ভরযোগ্য ভরসা",
    testimonial1Text: "\"বৈদ্যবাণীর সাহায্যে আমি বুঝতে পেরেছি যে আমার দুই ডাক্তার আলাদা নামে একই প্যারাসিটামল লিখেছিলেন। এটি আমাকে মারাত্মক লিভারের ক্ষতি থেকে বাঁচিয়েছে।\"",
    testimonial1Author: "রমেশ কুমার, ৬৪",
    testimonial1Role: "অবসরপ্রাপ্ত সরকারি কর্মকর্তা",
    testimonial2Text: "\"আমার মা ইংরেজি রিপোর্ট পড়তে পারেন না। বৈদ্যবাণী সহজ বাংলায় সমস্ত রক্ত রিপোর্ট পড়ে শোনাল, যা আমাদের পুরো পরিবারকে স্বস্তি দিয়েছে।\"",
    testimonial2Author: "সুনীতা দেবী, ৪২",
    testimonial2Role: "শিক্ষিকা ও অভিভাবক",

    bottomCtaTitle: "আজই আপনার পরিবারের ওষুধ নিরাপত্তা নিশ্চিত করুন",
    bottomCtaSubtitle: "ওষুধের ভুল ও পার্শ্বপ্রতিক্রিয়া থেকে আপনার প্রিয়জনকে সুরক্ষিত রাখুন।",
    bottomCtaBtn: "বিনামূল্যে শুরু করুন — ফাইল আপলোড করুন",
    bottomCtaSubtext: "সম্পূর্ণ বিনামূল্যে • ABDM যুক্ত • সুরক্ষিত ও ব্যক্তিগত",
    voiceSummaryText: "নমস্কার! বৈদ্যবাণীতে আপনাকে স্বাগতম। আপনি ডাক্তারের প্রেসক্রিপশন ও ল্যাব রিপোর্ট আপলোড করতে পারেন। আমরা একাধিক ওষুধের পার্শ্বপ্রতিক্রিয়া পরীক্ষা করি এবং সহজ বাংলায় পড়ে শোনাই।"
  },

  ta: {
    taglineBadge: "ஆயுஷ்மான் பாரத் & ABDM இணைந்தது • இந்திய நோயாளி பாதுகாப்பு",
    heroHeadline: "மருத்துவ நுண்ணறிவு.",
    heroHighlight: "ஒவ்வொரு மருந்துச் சீட்டும். ஒவ்வொரு ஆய்வக அறிக்கையும்.",
    heroSubtitle: "மருத்துவரின் கையெழுத்து மருந்துச் சீட்டுகளையும் ஆய்வக அறிக்கைகளையும் பதிவேற்றுங்கள். மருந்துகளின் ஆபத்தான கலவைகளை கண்டறிந்து தமிழில் எளிய குரல் வழியே கேட்டுத் தெரிந்து கொள்ளுங்கள்.",
    ctaUpload: "மருந்துச் சீட்டு அல்லது அறிக்கை சேர்க்க",
    ctaGenericSearch: "மலிவு ஜெனரிக் மருந்துகள் தேட",
    ctaVoiceDemo: "தமிழில் குரல் அறிக்கை கேட்க",
    trustedBy: "இந்தியா முழுவதும் 50,000+ குடும்பங்கள் மற்றும் முதியோர்களின் நம்பிக்கை",

    feature1Badge: "பயோமார்க்கர் விளக்கம்",
    feature1Title: "ஸ்மார்ட் ஆய்வக அறிக்கை பகுப்பாய்வு",
    feature1Desc: "சர்க்கரை அளவு (HbA1c), சிறுநீரகம், கல்லீரல் மற்றும் கொலஸ்ட்ரால் அளவுகளை தமிழில் எளிய நடையில் விளக்குகிறது.",
    feature1Cta: "ஆய்வக அறிக்கையை காண்க →",
    feature1Tags: ["வரம்பு நிலைகள்", "முன்னேற்ற வரைபடம்", "மருத்துவ கேள்விகள்"],

    feature2Badge: "மருந்து பாதுகாப்பு",
    feature2Title: "மருந்து சேர்க்கை மற்றும் பாதுகாப்பு ராடார்",
    feature2Desc: "பல்வேறு மருத்துவர்கள் எழுதிய மருந்துகளின் கலவை ஆபத்துகளை கண்டறிந்து பாதுகாப்பான நேர அட்டவணையை வழங்குகிறது.",
    feature2Cta: "மருந்து பாதுகாப்பு மேட்ரிக்ஸ் →",
    feature2Tags: ["அளவு கால்குலேட்டர்", "இரத்தப்போக்கு எச்சரிக்கை", "மருத்துவர் சீட்டு"],

    caseBadge: "உண்மை மருத்துவ சம்பவம் • நோயாளி பாதுகாப்பு",
    caseTitle: "வைத்தியவாணி ஆபத்தான மருந்து அளவை எவ்வாறு தடுத்தது",
    caseSubtitle: "சம்பவம்: 64 வயதான ரமேஷ் குமார் 4 நாட்களில் இருவேறு மருத்துவர்களிடம் ஆலோசனை பெற்றார்.",
    caseProblemTitle: "தெரியாமல் ஏற்படும் மருத்துவ ஆபத்து",
    caseProblemDesc: "இரு மருத்துவர்களும் வெவ்வேறு பெயர்களில் பாராசிட்டமால் மற்றும் வலி நிவாரணிகளை ஒரே நேரத்தில் பரிந்துரைத்தனர்.",
    caseProblemItems: [
      "Crocin 650mg + Combiflam = நாளொன்றுக்கு 3,950mg பாராசிட்டமால் (கல்லீரல் செயலிழப்பு அபாயம்)",
      "Eco-Sprin 75mg + Combiflam = கடுமையான குடல் புண் மற்றும் இரத்தப்போக்கு ஆபத்து"
    ],
    caseSolutionTitle: "வைத்தியவாணி பாதுகாப்பு ராடார் தீர்வு",
    caseSolutionDesc: "சீட்டுகள் பதிவேற்றப்பட்ட உடனேயே ஒரே மூலக்கூறு கொண்ட மருந்துகளை கண்டறிந்து எச்சரித்தது.",
    caseSolutionAlert: "அவசர எச்சரிக்கை: தினசரி பாராசிட்டமால் அளவு 3,000 மி.கி தாண்டுகிறது. உடனே சரிசெய்யவும்.",
    caseSolutionItems: [
      "முதல் மாத்திரை உட்கொள்ளும் முன்னரே ஒரே மருந்தை கண்டறிந்தது",
      "6 மணி நேர இடைவெளியுடன் 24 மணி நேர அட்டவணை தயாரித்தது",
      "மருத்துவரிடம் காட்ட வாட்ஸ்அப் சீட்டு உருவாக்கியது"
    ],

    biomarkerBadge: "இரத்த பரிசோதனை முடிவுகள்",
    biomarkerTitle: "கடினமான வார்த்தைகள் இன்றி இரத்த அறிக்கையை புரிந்துகொள்ளுங்கள்",
    biomarkerSubtitle: "வண்ணக் குறியீடுகள் மூலம் உங்கள் உடல்நிலையை துல்லியமாக அறியலாம்.",
    biomarkerNotice: "மாதிரி: 14 அக்டோபர் 2024 • டாக்டர் லால் பாத்லேப்ஸ்",
    sampleHbA1c: "HbA1c (3 மாத சர்க்கரை அளவு)",
    sampleHbA1cDesc: "8.2% — அதிகம் (வழக்கமானது < 7.0%). சர்க்கரை கட்டுப்பாடு தேவை.",
    sampleFBS: "உணவுக்கு முன் சர்க்கரை (FBS)",
    sampleFBSDesc: "164 mg/dL — அதிகம் (சாதாரண அளவு: 70–100 mg/dL).",
    sampleCreatinine: "சீரம் கிரியேட்டினின் (சிறுநீரகம்)",
    sampleCreatinineDesc: "1.05 mg/dL — இயல்பானது மற்றும் பாதுகாப்பானது (0.70–1.20 mg/dL).",
    sampleCholesterol: "மொத்த கொலஸ்ட்ரால்",
    sampleCholesterolDesc: "232 mg/dL — சற்று அதிகம் (தேவையானது < 200 mg/dL).",

    pillarsBadge: "பாதுகாப்பு தூண்கள்",
    pillarsTitle: "நோயாளி பாதுகாப்பின் நான்கு தூண்கள்",
    pillarsSubtitle: "இந்திய நோயாளிகளுக்காக பிரத்யேகமாக உருவாக்கப்பட்ட தொழில்நுட்பம்.",
    pillar1Title: "கையெழுத்து OCR",
    pillar1Desc: "மருத்துவர்களின் கையெழுத்தை மிகத் துல்லியமாக படிக்கக்கூடியது.",
    pillar2Title: "மருந்து சேர்க்கை சோதனை",
    pillar2Desc: "ஒரே விதமான மருந்துகள் மற்றும் அதிக அளவுகளை கண்டறியும்.",
    pillar3Title: "பாதுகாப்பான நேர இடைவெளி",
    pillar3Desc: "காலை, மதியம், இரவு மருந்துகளுக்கு உணவு இடைவெளி அட்டவணை.",
    pillar4Title: "தமிழில் குரல் வழிகாட்டல்",
    pillar4Desc: "முதியவர்களுக்காக முழு அறிக்கையையும் தமிழிலேயே வாசித்து விளக்கும்.",

    workflowBadge: "3 எளிய நிலைகள்",
    workflowTitle: "வைத்தியவாணி எவ்வாறு உங்கள் குடும்பத்தை பாதுகாக்கிறது",
    workflowSubtitle: "30 வினாடிகளில் எளிதாக தொடங்குங்கள்.",
    step1Title: "1. படம் எடுக்கவும் அல்லது பதிவேற்றவும்",
    step1Desc: "மருந்துச் சீட்டை படம் எடுத்து உடனே பதிவேற்றலாம்.",
    step2Title: "2. உடனடி ஏஐ சோதனை",
    step2Desc: "மருந்துகளின் அளவை சோதித்து அறிக்கையை எளிமைப்படுத்துகிறது.",
    step3Title: "3. தமிழில் கேட்டு பகிரவும்",
    step3Desc: "தமிழில் கேட்டு மருத்துவரிடம் வாட்ஸ்அப்பில் பகிருங்கள்.",

    testimonialsBadge: "நோயாளிகளின் கருத்துக்கள்",
    testimonialsTitle: "இந்திய குடும்பங்களின் பேராதரவு",
    testimonial1Text: "\"இருவேறு மருத்துவர்கள் ஒரே பாராசிட்டமாலை வெவ்வேறு பெயர்களில் தந்ததை வைத்தியவாணி கண்டறிந்து என் கல்லீரலை காப்பாற்றியது.\"",
    testimonial1Author: "ரமேஷ் குமார், 64",
    testimonial1Role: "ஓய்வுபெற்ற அரசு அதிகாரி",
    testimonial2Text: "\"என் தாயாருக்கு ஆங்கில அறிக்கை புரியவில்லை. வைத்தியவாணி தமிழில் தெளிவாக விளக்கியது எங்களுக்கு நிம்மதியை தந்தது.\"",
    testimonial2Author: "சுனிதா தேவி, 42",
    testimonial2Role: "ஆசிரியை",

    bottomCtaTitle: "உங்கள் குடும்பத்தின் மருந்து பாதுகாப்பை இன்றே உறுதி செய்யுங்கள்",
    bottomCtaSubtitle: "பக்கவிளைவுகள் மற்றும் மருந்து முரண்பாடுகளிலிருந்து அன்பானவர்களை பாதுகாக்கவும்.",
    bottomCtaBtn: "இலவசமாக தொடங்குக — ஆவணம் பதிவேற்றுக",
    bottomCtaSubtext: "100% இலவசம் • ABDM இணைந்தது • பாதுகாப்பானது",
    voiceSummaryText: "வணக்கம்! வைத்தியவாணிக்கு நல்வரவு. மருந்துச் சீட்டுகளையும் ஆய்வக அறிக்கைகளையும் பதிவேற்றி உங்கள் தாய்மொழியான தமிழில் குரல் வழியே விளக்கங்களை எளிதாகப் பெறலாம்."
  },

  te: {
    taglineBadge: "ఆయుష్మాన్ భారత్ & ABDM అనుసంధానించబడింది • రోగుల భద్రత",
    heroHeadline: "వైద్య మేధస్సు.",
    heroHighlight: "ప్రతి ప్రిస్క్రిప్షన్. ప్రతి ల్యాబ్ రిపోర్ట్.",
    heroSubtitle: "వైద్యుల చేతిరాత ప్రిస్క్రిప్షన్లు లేదా ల్యాబ్ నివేదికలను అప్‌లోడ్ చేయండి. మందుల హానికరమైన పరస్పర చర్యలను గుర్తించండి మరియు తెలుగులో ఆడియో వివరణ వినండి.",
    ctaUpload: "ప్రిస్క్రిప్షన్ లేదా ల్యాబ్ రిపోర్ట్ జోడించండి",
    ctaGenericSearch: "తక్కువ ధర జెనెరిక్ మందుల వివరాలు",
    ctaVoiceDemo: "తెలుగులో వాయిస్ రిపోర్ట్ వినండి",
    trustedBy: "భారతదేశం అంతటా 50,000+ కుటుంబాలు మరియు వృద్ధుల నమ్మకం",

    feature1Badge: "బయోమార్కర్ వివరణ",
    feature1Title: "స్మార్ట్ ల్యాబ్ రిపోర్ట్ డీకోడర్",
    feature1Desc: "HbA1c, కిడ్నీ, లివర్ మరియు రక్త పరీక్షల నివేదికలను సరళమైన తెలుగులో అర్థం చేసుకోండి.",
    feature1Cta: "ల్యాబ్ రిపోర్ట్ తెరవండి →",
    feature1Tags: ["విజువల్ శ్రేణులు", "పురోగతి చార్ట్", "వైద్యుల ప్రశ్నలు"],

    feature2Badge: "మందుల భద్రత",
    feature2Title: "మల్టీ-డాక్టర్ డ్రగ్ సేఫ్టీ రాడార్",
    feature2Desc: "వివిధ వైద్యులు రాసిన మందుల మధ్య పారాసిటమాల్ ఓవర్‌డోస్ మరియు ఇతర ప్రమాదాలను నివారించండి.",
    feature2Cta: "డ్రగ్ సేఫ్టీ మ్యాట్రిక్స్ తెరవండి →",
    feature2Tags: ["డోస్ కాలిక్యులేటర్", "రక్తస్రావ హెచ్చరిక", "వైద్యుల స్లిప్"],

    caseBadge: "నిజమైన వైద్య సంఘటన • రోగుల భద్రత",
    caseTitle: "వైద్యవాణి ప్రమాదకరమైన మందుల ఓవర్‌డోస్‌ను ఎలా అడ్డుకుంది",
    caseSubtitle: "కేస్ స్టడీ: 64 ఏళ్ల రమేష్ కుమార్ 4 రోజుల్లో ఇద్దరు వేర్వేరు నిపుణులను సంప్రదించారు.",
    caseProblemTitle: "తెలియకుండా జరిగే ప్రాణాంతక పొరపాటు",
    caseProblemDesc: "ఇద్దరు వైద్యులు వేర్వేరు బ్రాండ్ పేర్లతో పారాసిటమాల్ మరియు పెయిన్ కిల్లర్లను రాశారు.",
    caseProblemItems: [
      "Crocin 650mg + Combiflam = రోజుకు 3,950mg పారాసిటమాల్ (కాలేయానికి తీవ్ర నష్టం)",
      "Eco-Sprin 75mg + Combiflam = తీవ్రమైన కడుపులో అల్సర్ మరియు అంతర్గత రక్తస్రావ ప్రమాదం"
    ],
    caseSolutionTitle: "వైద్యవాణి భద్రతా రాడార్ ద్వారా పరిష్కారం",
    caseSolutionDesc: "ప్రిస్క్రిప్షన్లు అప్‌లోడ్ చేసిన వెంటనే సిస్టమ్ ఒకే విధమైన మాలిక్యూల్‌ను గుర్తించి హెచ్చరించింది.",
    caseSolutionAlert: "అత్యవసర హెచ్చరిక: రోజువారీ పారాసిటమాల్ మోతాదు 3,000mg కంటే ఎక్కువ. వెంటనే సరిదిద్దండి.",
    caseSolutionItems: [
      "మొదటి మోతాదు తీసుకోకముందే డూప్లికేట్ మందును గుర్తించింది",
      "6 గంటల విరామంతో 24 గంటల సురక్షిత షెడ్యూల్ అందించింది",
      "వైద్యుడికి చూపించడానికి వాట్సాప్ స్లిప్ రూపొందించింది"
    ],

    biomarkerBadge: "రక్త పరీక్ష ఫలితాలు",
    biomarkerTitle: "కఠినమైన పదాలు లేకుండా రక్త పరీక్ష నివేదికను అర్థం చేసుకోండి",
    biomarkerSubtitle: "రంగుల సూచికలతో మీ ఆరోగ్యం ఏ స్థితిలో ఉందో తెలుసుకోండి.",
    biomarkerNotice: "లైవ్ శాంపిల్: 14 అక్టోబర్ 2024 • లాల్ పాత్‌ల్యాబ్స్",
    sampleHbA1c: "HbA1c (3 నెలల సగటు షుగర్)",
    sampleHbA1cDesc: "8.2% — ఎక్కువ (సాధారణం < 7.0%). షుగర్ నియంత్రణ అవసరం.",
    sampleFBS: "ఫాస్టింగ్ బ్లడ్ షుగర్ (FBS)",
    sampleFBSDesc: "164 mg/dL — ఎక్కువ (సాధారణ పరిధి: 70–100 mg/dL).",
    sampleCreatinine: "సీరం క్రియేటినిన్ (కిడ్నీ ఆరోగ్యం)",
    sampleCreatinineDesc: "1.05 mg/dL — సాధారణం మరియు సురక్షితం (0.70–1.20 mg/dL).",
    sampleCholesterol: "మొత్తం కొలెస్ట్రాల్",
    sampleCholesterolDesc: "232 mg/dL — కొద్దిగా ఎక్కువ (లక్ష్యం < 200 mg/dL).",

    pillarsBadge: "రక్షణ స్తంభాలు",
    pillarsTitle: "రోగుల భద్రతకు నాలుగు మూలస్తంభాలు",
    pillarsSubtitle: "భారతీయ రోగుల కోసం ప్రత్యేకంగా రూపొందించిన ఆధునిక సాంకేతికత.",
    pillar1Title: "చేతిరాత OCR",
    pillar1Desc: "వైద్యుల చేతిరాతను ఖచ్చితంగా గుర్తించగలదు.",
    pillar2Title: "మందుల పరస్పర చర్య రాడార్",
    pillar2Desc: "ఒకే రకమైన మందులు మరియు అధిక మోతాదులను తనిఖీ చేస్తుంది.",
    pillar3Title: "సరైన సమయ విరామం",
    pillar3Desc: "ఉదయం, మధ్యాహ్నం, రాత్రి మందుల భోజన విరామ పట్టిక.",
    pillar4Title: "తెలుగులో వాయిస్ ఆడియో",
    pillar4Desc: "వృద్ధుల కోసం మొత్తం నివేదికను తెలుగులోనే స్పష్టంగా చదివి వినిపిస్తుంది.",

    workflowBadge: "3 సులభమైన దశలు",
    workflowTitle: "వైద్యవాణి మీ కుటుంబాన్ని ఎలా రక్షిస్తుంది",
    workflowSubtitle: "30 సెకన్లలో సులభంగా ప్రారంభించండి.",
    step1Title: "1. ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి",
    step1Desc: "ప్రిస్క్రిప్షన్ ఫోటో తీసి సులభంగా అప్‌లోడ్ చేయండి.",
    step2Title: "2. తక్షణ ఏఐ విశ్లేషణ",
    step2Desc: "మందుల మోతాదును తనిఖీ చేసి నివేదికను విశ్లేషిస్తుంది.",
    step3Title: "3. తెలుగులో వినండి మరియు పంచుకోండి",
    step3Desc: "తెలుగులో విని వైద్యుడితో వాట్సాప్‌లో పంచుకోండి.",

    testimonialsBadge: "రోగుల అనుభవాలు",
    testimonialsTitle: "భారతీయ కుటుంబాల బలమైన నమ్మకం",
    testimonial1Text: "\"ఇద్దరు వేర్వేరు వైద్యులు ఒకే పారాసిటమాల్‌ను వేర్వేరు పేర్లతో రాసిన విషయాన్ని వైద్యవాణి గుర్తించి నా కాలేయాన్ని కాపాడింది.\"",
    testimonial1Author: "రమేష్ కుమార్, 64",
    testimonial1Role: "రిటైర్డ్ ప్రభుత్వ ఉద్యోగి",
    testimonial2Text: "\"మా అమ్మగారికి ఇంగ్లీష్ రిపోర్ట్స్ అర్థం కాలేదు. వైద్యవాణి తెలుగులో వివరంగా చెప్పడం మాకు ఎంతో ఉపశమనం కలిగించింది.\"",
    testimonial2Author: "సునీతా దేవి, 42",
    testimonial2Role: "ఉపాధ్యాయురాలు",

    bottomCtaTitle: "మీ కుటుంబ మందుల భద్రతను ఈరోజే ప్రారంభించండి",
    bottomCtaSubtitle: "మందుల పరస్పర సమస్యలు మరియు ఓవర్‌డోస్ నుండి మీ ఆప్తులను కాపాడుకోండి.",
    bottomCtaBtn: "ఉచితంగా ప్రారంభించండి — పత్రం అప్‌లోడ్ చేయండి",
    bottomCtaSubtext: "100% ఉచితం • ABDM సిద్ధం • సురక్షితమైనది",
    voiceSummaryText: "నమస్కారం! వైద్యవాణికి స్వాగతం. ప్రిస్క్రిప్షన్లు మరియు ల్యాబ్ నివేదికలను అప్‌లోడ్ చేసి తెలుగులోనే సులభంగా ఆడియో వివరణ వినండి."
  },

  mr: {
    taglineBadge: "आयुष्मान भारत व ABDM संलग्न • रुग्ण सुरक्षा प्रणाली",
    heroHeadline: "वैद्यकीय बुद्धिमत्ता.",
    heroHighlight: "प्रत्येक प्रिस्क्रिप्शन. प्रत्येक लॅब अहवाल.",
    heroSubtitle: "डॉक्टरांचे क्लिष्ट प्रिस्क्रिप्शन किंवा लॅब रिपोर्ट अपलोड करा. औषधांमधील संभाव्य धोकादायक परस्परसंवाद ओळखा आणि मराठीत स्पष्ट ऑडिओ ऐका.",
    ctaUpload: "प्रिस्क्रिप्शन किंवा लॅब रिपोर्ट जोडा",
    ctaGenericSearch: "स्वस्त जेनेरिक औषध शोधा",
    ctaVoiceDemo: "मराठीत ऑडिओ रिपोर्ट ऐका",
    trustedBy: "भारतभरातील ५०,०००+ कुटुंबे आणि ज्येष्ठ नागरिकांचे विश्वासू साथीदार",

    feature1Badge: "बायोमार्कर डिकोडर",
    feature1Title: "स्मार्ट लॅब रिपोर्ट विश्लेषक",
    feature1Desc: "HbA1c, लिव्हर, किडनी आणि सीबीसी चाचण्यांचे मराठीत सोपे स्पष्टीकरण आणि डॉक्टरांसाठी महत्त्वाचे प्रश्न.",
    feature1Cta: "लॅब रिपोर्ट उघडा →",
    feature1Tags: ["व्हिज्युअल रेंज", "३ वेळची प्रगती", "डॉक्टरांचे प्रश्न"],

    feature2Badge: "औषध सुरक्षा रडार",
    feature2Title: "मल्टी-डॉक्टर औषध सुरक्षा व संघर्ष",
    feature2Desc: "वेगवेगळ्या डॉक्टरांच्या औषधांमधील पॅरासिटामॉल ओव्हरडोज आणि अंतर्गत रक्तस्रावाचा धोका टाळा.",
    feature2Cta: "औषध सुरक्षा मॅट्रिक्स →",
    feature2Tags: ["डोस कॅल्क्युलेटर", "ब्लीडिंग अलर्ट", "डॉक्टर स्लिप"],

    caseBadge: "सत्य घटना • रुग्ण सुरक्षा विश्लेषण",
    caseTitle: "वैद्यवाणीने औषधांचा प्राणघातक ओव्हरडोज कसा रोखला",
    caseSubtitle: "केस स्टडी: ६४ वर्षीय रमेश कुमार यांनी ४ दिवसांत दोन वेगवेगळ्या तज्ज्ञ डॉक्टरांचा सल्ला घेतला.",
    caseProblemTitle: "नकळत झालेली प्राणघातक चूक",
    caseProblemDesc: "दोन्ही डॉक्टरांनी वेगवेगळ्या ब्रँड नावाने पॅरासिटामॉल आणि पेनकिलर लिहून दिले होते.",
    caseProblemItems: [
      "Crocin 650mg + Combiflam = दररोज ३,९५०mg पॅरासिटामॉल (लिव्हर खराब होण्याचा गंभीर धोका)",
      "Eco-Sprin 75mg + Combiflam = पोटात अल्सर आणि अंतर्गत रक्तस्रावाचा धोका"
    ],
    caseSolutionTitle: "वैद्यवाणी सुरक्षा रडारद्वारे तोडगा",
    caseSolutionDesc: "प्रिस्क्रिप्शन अपलोड करताच सिस्टीमने एकाच घटकाची औषधे ओळखून त्वरित इशारा दिला.",
    caseSolutionAlert: "तातडीचा इशारा: पॅरासिटामॉलचे दैनिक प्रमाण ३,०००mg पेक्षा जास्त आहे. ताबडतोब बदला.",
    caseSolutionItems: [
      "पहिला डोस घेण्यापूर्वीच डुप्लिकेट औषध शोधून काढले",
      "६ तासांच्या सुरक्षित अंतरासह २४ तासांचे वेळापत्रक दिले",
      "डॉक्टरांना दाखवण्यासाठी व्हॉट्सॲप स्लिप तयार केली"
    ],

    biomarkerBadge: "रक्त तपासणी निकाल",
    biomarkerTitle: "सोप्या मराठीत रक्त चाचणी अहवाल समजून घ्या",
    biomarkerSubtitle: "रंगीत निर्देशकांसह आपले आरोग्य कोणत्या स्थितीत आहे ते जाणून घ्या.",
    biomarkerNotice: "थेट नमुना: १४ ऑक्टोबर २०२४ • डॉ लाल पॅथलॅब्स",
    sampleHbA1c: "HbA1c (३ महिन्यांची सरासरी साखर)",
    sampleHbA1cDesc: "८.२% — अनियंत्रित (सामान्य < ७.०%). साखर नियंत्रणाची गरज.",
    sampleFBS: "फास्टिंग ब्लड शुगर (FBS)",
    sampleFBSDesc: "१६४ mg/dL — जास्त (सामान्य: ७०–१०० mg/dL).",
    sampleCreatinine: "सीरम क्रिएटिनिन (किडनी आरोग्य)",
    sampleCreatinineDesc: "१.०५ mg/dL — पूर्णपणे सामान्य आणि सुरक्षित (०.७०–१.२० mg/dL).",
    sampleCholesterol: "एकूण कोलेस्टेरॉल",
    sampleCholesterolDesc: "२३२ mg/dL — थोडे जास्त (इष्टतम < २०० mg/dL).",

    pillarsBadge: "सुरक्षा स्तंभ",
    pillarsTitle: "रुग्ण सुरक्षेचे चार मुख्य स्तंभ",
    pillarsSubtitle: "भारतीय रुग्णांसाठी विशेषत्वाने विकसित केलेले तंत्रज्ञान.",
    pillar1Title: "हस्ताक्षर व न्यूरल OCR",
    pillar1Desc: "डॉक्टरांचे हस्ताक्षर अचूक वाचण्यासाठी प्रशिक्षित.",
    pillar2Title: "औषध संघर्ष रडार",
    pillar2Desc: "एकाच घटकाची औषधे आणि अति डोस शोधून काढते.",
    pillar3Title: "योग्य वेळ अंतर",
    pillar3Desc: "सकाळ, दुपार, रात्रीच्या औषधांचे जेवणापूर्वी व जेवणानंतरचे वेळापत्रक.",
    pillar4Title: "मराठीत व्हॉईस ऑडिओ",
    pillar4Desc: "ज्येष्ठांसाठी संपूर्ण अहवाल मराठीत वाचून दाखवतो.",

    workflowBadge: "३ सोपे टप्पे",
    workflowTitle: "वैद्यवाणी आपल्या कुटुंबाचे रक्षण कसे करते",
    workflowSubtitle: "३० सेकंदात सहज सुरू करा.",
    step1Title: "१. फोटो काढा किंवा अपलोड करा",
    step1Desc: "प्रिस्क्रिप्शनचा फोटो काढून सहज अपलोड करा.",
    step2Title: "२. त्वरित AI विश्लेषण",
    step2Desc: "औषधांचा डोस तपासून अहवाल सोप्या भाषेत तयार करतो.",
    step3Title: "३. मराठीत ऐका आणि शेअर करा",
    step3Desc: "मराठीत ऐकून डॉक्टरांशी व्हॉट्सॲपवर शेअर करा.",

    testimonialsBadge: "रुग्णांचे अनुभव",
    testimonialsTitle: "भारतीय कुटुंबांचा विश्वास",
    testimonial1Text: "\"दोन वेगवेगळ्या डॉक्टरांनी एकाच घटकाची औषधे दिली होती, हे वैद्यवाणीने ओळखले आणि माझे लिव्हर वाचले.\"",
    testimonial1Author: "रमेश कुमार, ६४",
    testimonial1Role: "सेवानिवृत्त शासकीय अधिकारी",
    testimonial2Text: "\"माझ्या आईला इंग्रजी रिपोर्ट समजत नव्हते. वैद्यवाणीने मराठीत सर्व समजावून सांगितले, ज्यामुळे आम्हाला खूप दिलासा मिळाला.\"",
    testimonial2Author: "सुनीता देवी, ४२",
    testimonial2Role: "शिक्षिका",

    bottomCtaTitle: "आजच आपल्या कुटुंबाची औषध सुरक्षा सुनिश्चित करा",
    bottomCtaSubtitle: "औषधांचे दुष्परिणाम आणि ओव्हरडोजपासून आपल्या प्रियजनांना सुरक्षित ठेवा.",
    bottomCtaBtn: "विनामूल्य सुरू करा — दस्तऐवज अपलोड करा",
    bottomCtaSubtext: "१००% मोफत • ABDM तयार • सुरक्षित व खाजगी",
    voiceSummaryText: "नमस्कार! वैद्यवाणीमध्ये आपले स्वागत आहे. आपण प्रिस्क्रिप्शन आणि लॅब अहवाल अपलोड करू शकता. आम्ही औषधांच्या दुष्परिणामांची तपासणी करतो आणि मराठीत समजावून सांगतो."
  },

  gu: {
    taglineBadge: "આયુષ્માન ભારત અને ABDM સુસંગત • દર્દી સુરક્ષા",
    heroHeadline: "તબીબી બુદ્ધિમત્તા.",
    heroHighlight: "દરેક પ્રિસ્ક્રિપ્શન. દરેક લેબ રિપોર્ટ.",
    heroSubtitle: "ડોક્ટરના પ્રિસ્ક્રિપ્શન અથવા લેબ રિપોર્ટ અપલોડ કરો. દવાઓ વચ્ચેની હાનિકારક આડઅસરો શોધો અને ગુજરાતીમાં ઑડિયો માર્ગદર્શન મેળવો.",
    ctaUpload: "પ્રિસ્ક્રિપ્શન અથવા રિપોર્ટ ઉમેરો",
    ctaGenericSearch: "સસ્તી જેનેરિક દવાઓ શોધો",
    ctaVoiceDemo: "ગુજરાતીમાં ઑડિયો રિપોર્ટ સાંભળો",
    trustedBy: "સમગ્ર ભારતના 50,000+ પરિવારો અને વડીલોનો વિશ્વાસ",

    feature1Badge: "બાયોમાર્કર સમજૂતી",
    feature1Title: "સ્માર્ટ લેબ રિપોર્ટ ડીકોડર",
    feature1Desc: "HbA1c, લિવર, કિડની અને બ્લડ ટેસ્ટના રિપોર્ટ્સની સરળ ગુજરાતીમાં સમજૂતી અને ડોક્ટર માટે પ્રશ્નો.",
    feature1Cta: "લેબ રિપોર્ટ જુઓ →",
    feature1Tags: ["વિઝ્યુઅલ રેન્જ", "પ્રગતિ ચાર્ટ", "ડોક્ટરના પ્રશ્નો"],

    feature2Badge: "દવા સુરક્ષા રડાર",
    feature2Title: "મલ્ટી-ડોક્ટર દવા સુરક્ષા અને સંઘર્ષ",
    feature2Desc: "અલગ અલગ ડોક્ટરોની દવાઓ વચ્ચે પેરાસિટામોલ ઓવરડોઝ અને બ્લીડિંગનું જોખમ અટકાવો.",
    feature2Cta: "દવા સુરક્ષા મેટ્રિક્સ →",
    feature2Tags: ["ડોઝ કેલ્ક્યુલેટર", "બ્લીડિંગ એલર્ટ", "ડોક્ટર સ્લિપ"],

    caseBadge: "સાચો કિસ્સો • દર્દી સુરક્ષા વિશ્લેષણ",
    caseTitle: "વૈદ્યવાણીએ દવાનો ખતરનાક ઓવરડોઝ કેવી રીતે અટકાવ્યો",
    caseSubtitle: "કેસ સ્ટડી: 64 વર્ષીય રમેશ કુમારે 4 દિવસમાં બે અલગ અલગ નિષ્ણાત ડોક્ટરોની સલાહ લીધી.",
    caseProblemTitle: "અજાણતા થયેલી જીવલેણ ભૂલ",
    caseProblemDesc: "બંને ડોક્ટરોએ અલગ અલગ બ્રાન્ડના નામે પેરાસિટામોલ અને પેઇનકિલર્સ લખી આપી હતી.",
    caseProblemItems: [
      "Crocin 650mg + Combiflam = રોજના 3,950mg પેરાસિટામોલ (લિવર ફેલિયરનું જોખમ)",
      "Eco-Sprin 75mg + Combiflam = પેટમાં અલ્સર અને આંતરિક રક્તસ્રાવનું જોખમ"
    ],
    caseSolutionTitle: "વૈદ્યવાણી સુરક્ષા રડાર દ્વારા ઉકેલ",
    caseSolutionDesc: "પ્રિસ્ક્રિપ્શન અપલોડ કરતા જ સિસ્ટમે એક જ ઘટકની દવાઓ શોધીને ચેતવણી આપી.",
    caseSolutionAlert: "તાત્કાલિક ચેતવણી: પેરાસિટામોલનો દૈનિક ડોઝ 3,000mg કરતા વધુ છે. તરત જ સુધારો.",
    caseSolutionItems: [
      "પહેલો ડોઝ લેતા પહેલા જ ડુપ્લિકેટ દવા શોધી કાઢી",
      "6 કલાકના સુરક્ષિત અંતરાલ સાથે 24 કલાકનું સમયપત્રક આપ્યું",
      "ડોક્ટરને બતાવવા માટે વોટ્સએપ સ્લિપ બનાવી આપી"
    ],

    biomarkerBadge: "બ્લડ ટેસ્ટ પરિણામો",
    biomarkerTitle: "સરળ ગુજરાતીમાં લેબ રિપોર્ટ સમજો",
    biomarkerSubtitle: "કલર-કોડેડ સૂચકાંકો સાથે તમારું સ્વાસ્થ્ય કેવું છે તે જાણો.",
    biomarkerNotice: "સેમ્પલ રિપોર્ટ: 14 ઑક્ટોબર 2024 • ડૉ લાલ પેથલેબ્સ",
    sampleHbA1c: "HbA1c (3 મહિનાની સરેરાશ સુગર)",
    sampleHbA1cDesc: "8.2% — અનિયંત્રિત (સામાન્ય < 7.0%). સુગર નિયંત્રણ જરૂરી.",
    sampleFBS: "ફાસ્ટિંગ બ્લડ સુગર (FBS)",
    sampleFBSDesc: "164 mg/dL — વધારે (સામાન્ય: 70–100 mg/dL).",
    sampleCreatinine: "સીરમ ક્રિએટિનાઇન (કિડની હેલ્થ)",
    sampleCreatinineDesc: "1.05 mg/dL — સામાન્ય અને સુરક્ષિત (0.70–1.20 mg/dL).",
    sampleCholesterol: "કુલ કોલેસ્ટ્રોલ",
    sampleCholesterolDesc: "232 mg/dL — સહેજ વધારે (લક્ષ્ય < 200 mg/dL).",

    pillarsBadge: "સુરક્ષા સ્તંભો",
    pillarsTitle: "દર્દી સુરક્ષાના ચાર મજબૂત સ્તંભો",
    pillarsSubtitle: "ભારતીય દર્દીઓ માટે ખાસ વિકસાવવામાં આવેલી ટેકનોલોજી.",
    pillar1Title: "હસ્તાક્ષર અને OCR",
    pillar1Desc: "ડોક્ટરના લખાણને સચોટતાથી વાંચવા માટે સક્ષમ.",
    pillar2Title: "દવા સંઘર્ષ રડાર",
    pillar2Desc: "એક જ ઘટકની દવાઓ અને વધુ પડતો ડોઝ શોધી કાઢે છે.",
    pillar3Title: "યોગ્ય સમય અંતરાલ",
    pillar3Desc: "સવાર, બપોર, સાંજની દવાઓનું જમ્યા પહેલા અને પછીનું સમયપત્રક.",
    pillar4Title: "ગુજરાતીમાં વૉઇસ ઑડિયો",
    pillar4Desc: "વડીલો માટે સમગ્ર રિપોર્ટ ગુજરાતીમાં બોલીને સમજાવે છે.",

    workflowBadge: "3 સરળ તબક્કા",
    workflowTitle: "વૈદ્યવાણી તમારા પરિવારનું રક્ષણ કેવી રીતે કરે છે",
    workflowSubtitle: "30 સેકન્ડમાં સરળતાથી શરૂ કરો.",
    step1Title: "1. ફોટો પાડો અથવા અપલોડ કરો",
    step1Desc: "પ્રિસ્ક્રિप्શનનો ફોટો પાડીને સરળતાથી અપલોડ કરો.",
    step2Title: "2. ત્વરિત AI વિશ્લેષણ",
    step2Desc: "દવાઓનો ડોઝ ચકાસીને રિપોર્ટનું સરળ વિશ્લેષણ કરે છે.",
    step3Title: "3. ગુજરાતીમાં સાંભળો અને શેર કરો",
    step3Desc: "ગુજરાતીમાં સાંભળીને ડોક્ટર સાથે વોટ્સએપ પર શેર કરો.",

    testimonialsBadge: "દર્દીઓના અનુભવો",
    testimonialsTitle: "ભારતીય પરિવારોનો અટૂટ વિશ્વાસ",
    testimonial1Text: "\"બે અલગ ડોક્ટરોએ એક જ પેરાસિટામોલ અલગ નામે લખી આપી હતી તે વૈદ્યવાણીએ પકડી પાડ્યું અને મારું લિવર બચી ગયું.\"",
    testimonial1Author: "રમેશ કુમાર, 64",
    testimonial1Role: "નિવૃત્ત સરકારી અધિકારી",
    testimonial2Text: "\"મારી માતાને અંગ્રેજી રિપોર્ટ સમજાતો નહોતો. વૈદ્યવાણીએ ગુજરાતીમાં બધું સમજાવ્યું જેથી અમને ખૂબ રાહત થઈ.\"",
    testimonial2Author: "સુનીતા દેવી, 42",
    testimonial2Role: "શિક્ષિકા",

    bottomCtaTitle: "આજે જ તમારા પરિવારની દવા સુરક્ષા સુનિશ્ચિત કરો",
    bottomCtaSubtitle: "દવાઓની આડઅસર અને ઓવરડોઝથી તમારા સ્વજનોનું રક્ષણ કરો.",
    bottomCtaBtn: "મફતમાં શરૂ કરો — ફાઇલ અપલોડ કરો",
    bottomCtaSubtext: "100% મફત • ABDM સજ્જ • સુરક્ષિત અને ખાનગી",
    voiceSummaryText: "નમસ્તે! વૈદ્યવાણીમાં આપનું સ્વાગત છે. તમે પ્રિસ્ક્રિપ્શન અને લેબ રિપોર્ટ અપલોડ કરી શકો છો. અમે દવાઓની આડઅસર ચકાસીએ છીએ અને ગુજરાતીમાં બોલીને સમજાવીએ છીએ."
  }
};

export const getLandingContent = (langCode: string): LandingContent => {
  return LANDING_TRANSLATIONS[langCode] || LANDING_TRANSLATIONS.en;
};
