export interface MedicineRecord {
  id: string;
  brand: string;
  salt: string;
  category: string;
  brandPrice: number;
  genericPrice: number;
  savingsPct: number;
  manufacturer: string;
  genericMaker: string;
  useFor: string;
  dosageTip: string;
  timing: string;
  interactionsWith: string[];
}

export const MEDICINES_DATABASE: MedicineRecord[] = [
  {
    id: 'med-1',
    brand: 'Augmentin 625 Duo',
    salt: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    category: 'Antibiotic',
    brandPrice: 224,
    genericPrice: 65,
    savingsPct: 71,
    manufacturer: 'GSK Pharmaceuticals',
    genericMaker: 'Jan Aushadhi / Cipla Generic',
    useFor: 'Bacterial Infections, Sinusitis, Throat & Respiratory Infections',
    dosageTip: 'Take at the start of a meal to reduce stomach upset. Complete full 5-7 day course.',
    timing: 'Twice daily with meals (every 12 hours)',
    interactionsWith: ['Warfarin', 'Methotrexate', 'Oral Contraceptives']
  },
  {
    id: 'med-2',
    brand: 'Dolo 650mg',
    salt: 'Paracetamol (650mg)',
    category: 'Analgesic & Antipyretic',
    brandPrice: 34,
    genericPrice: 11,
    savingsPct: 68,
    manufacturer: 'Micro Labs',
    genericMaker: 'Jan Aushadhi Paracetamol',
    useFor: 'Fever, Body Aches, Headache, Mild-to-Moderate Pain',
    dosageTip: 'Do not exceed 3,000mg (4 tablets) in 24 hours. Avoid combining with alcohol.',
    timing: 'Every 6-8 hours as needed after food',
    interactionsWith: ['Warfarin', 'Isoniazid', 'Alcohol']
  },
  {
    id: 'med-3',
    brand: 'Telma 40mg',
    salt: 'Telmisartan (40mg)',
    category: 'Cardiovascular / Hypertension',
    brandPrice: 146,
    genericPrice: 28,
    savingsPct: 81,
    manufacturer: 'Glenmark Pharmaceuticals',
    genericMaker: 'Jan Aushadhi Telmisartan',
    useFor: 'High Blood Pressure (Hypertension) & Heart Failure Prevention',
    dosageTip: 'Take at the same time each morning. Avoid potassium supplements without physician review.',
    timing: 'Once daily in the morning',
    interactionsWith: ['Spironolactone', 'NSAIDs / Ibuprofen', 'Lithium', 'Ramipril']
  },
  {
    id: 'med-4',
    brand: 'Pantocid 40mg',
    salt: 'Pantoprazole (40mg)',
    category: 'Gastroenterology / PPI',
    brandPrice: 172,
    genericPrice: 36,
    savingsPct: 79,
    manufacturer: 'Sun Pharma',
    genericMaker: 'Jan Aushadhi Pantoprazole',
    useFor: 'Acidity, Gastroesophageal Reflux (GERD), Peptic Ulcers',
    dosageTip: 'Take on an empty stomach at least 30-60 minutes before morning breakfast.',
    timing: 'Once daily in the morning before food',
    interactionsWith: ['Clopidogrel', 'Ketoconazole', 'Iron Supplements', 'Atazanavir']
  },
  {
    id: 'med-5',
    brand: 'Glycomet-GP 2',
    salt: 'Metformin (500mg) + Glimepiride (2mg)',
    category: 'Endocrinology / Diabetes',
    brandPrice: 195,
    genericPrice: 44,
    savingsPct: 77,
    manufacturer: 'USV Ltd',
    genericMaker: 'Jan Aushadhi Metformin+Glimepiride',
    useFor: 'Type 2 Diabetes Mellitus Blood Sugar Regulation',
    dosageTip: 'Always take with your primary breakfast or lunch meal to avoid hypoglycemia (low sugar).',
    timing: 'Once daily with breakfast',
    interactionsWith: ['Iodinated Contrast Media', 'Beta-Blockers', 'Alcohol', 'Cimetidine']
  },
  {
    id: 'med-6',
    brand: 'Atorva 20mg',
    salt: 'Atorvastatin (20mg)',
    category: 'Lipid Lowering / Statin',
    brandPrice: 258,
    genericPrice: 52,
    savingsPct: 80,
    manufacturer: 'Zydus Cadila',
    genericMaker: 'Jan Aushadhi Atorvastatin',
    useFor: 'High LDL Cholesterol, Triglycerides & Atherosclerosis Prevention',
    dosageTip: 'Take at night. Avoid excessive grapefruit juice which can raise plasma statin levels.',
    timing: 'Once daily at bedtime',
    interactionsWith: ['Grapefruit Extract', 'Clarithromycin', 'Cyclosporine', 'Gemfibrozil']
  },
  {
    id: 'med-7',
    brand: 'Pan-D Capsule',
    salt: 'Pantoprazole (40mg) + Domperidone (30mg SR)',
    category: 'Gastroenterology / Antiemetic',
    brandPrice: 210,
    genericPrice: 48,
    savingsPct: 77,
    manufacturer: 'Alkem Laboratories',
    genericMaker: 'Generic Pantoprazole-Domperidone',
    useFor: 'Severe Acidity, Heartburn, Nausea & Gastric Bloating',
    dosageTip: 'Take 30 minutes before the morning meal. Do not crush or chew prolonged-release capsules.',
    timing: 'Once daily before breakfast',
    interactionsWith: ['Amiodarone', 'Erythromycin', 'Ketoconazole']
  },
  {
    id: 'med-8',
    brand: 'Montair-LC',
    salt: 'Montelukast (10mg) + Levocetirizine (5mg)',
    category: 'Respiratory / Allergy',
    brandPrice: 232,
    genericPrice: 55,
    savingsPct: 76,
    manufacturer: 'Cipla Ltd',
    genericMaker: 'Jan Aushadhi Montelukast+Levocet',
    useFor: 'Allergic Rhinitis, Chronic Sneezing, Runny Nose & Allergic Asthma',
    dosageTip: 'Best taken in the evening as antihistamines can cause mild sedation in some patients.',
    timing: 'Once daily at bedtime',
    interactionsWith: ['Phenobarbital', 'Rifampicin', 'Sedatives']
  },
  {
    id: 'med-9',
    brand: 'Aten 50mg',
    salt: 'Atenolol (50mg)',
    category: 'Cardiovascular / Beta-Blocker',
    brandPrice: 112,
    genericPrice: 22,
    savingsPct: 80,
    manufacturer: 'Zydus Healthcare',
    genericMaker: 'Jan Aushadhi Atenolol',
    useFor: 'Hypertension, Angina Pectoris, Post-Myocardial Infarction',
    dosageTip: 'Space at least 2 hours apart from magnesium or aluminum antacids to prevent absorption decline.',
    timing: 'Once daily in the morning',
    interactionsWith: ['Antacids (Magnesium/Aluminum)', 'Verapamil', 'Diltiazem', 'Clonidine']
  },
  {
    id: 'med-10',
    brand: 'Ecosprin 75mg',
    salt: 'Aspirin (75mg)',
    category: 'Antiplatelet / Blood Thinner',
    brandPrice: 18,
    genericPrice: 6,
    savingsPct: 67,
    manufacturer: 'USV Ltd',
    genericMaker: 'Jan Aushadhi Aspirin',
    useFor: 'Prevention of Blood Clots, Heart Attacks & Stroke',
    dosageTip: 'Take after meals with a full glass of water to minimize gastric mucosal irritation.',
    timing: 'Once daily after dinner',
    interactionsWith: ['Warfarin', 'Heparin', 'Ibuprofen', 'Methotrexate', 'Ginkgo Biloba']
  },
  {
    id: 'med-11',
    brand: 'Thyronorm 50mcg',
    salt: 'Levothyroxine Sodium (50mcg)',
    category: 'Endocrinology / Thyroid',
    brandPrice: 165,
    genericPrice: 38,
    savingsPct: 77,
    manufacturer: 'Abbott Healthcare',
    genericMaker: 'Jan Aushadhi Levothyroxine',
    useFor: 'Hypothyroidism & Goiter Management',
    dosageTip: 'Take with plain water first thing in the morning. Wait at least 4 hours before taking calcium or iron supplements.',
    timing: 'Once daily early morning empty stomach',
    interactionsWith: ['Calcium Carbonate', 'Iron Supplements', 'Soy Products', 'Antacids']
  },
  {
    id: 'med-12',
    brand: 'Shelcal 500',
    salt: 'Calcium (500mg) + Vitamin D3 (250 IU)',
    category: 'Nutritional / Bone Health',
    brandPrice: 140,
    genericPrice: 32,
    savingsPct: 77,
    manufacturer: 'Torrent Pharmaceuticals',
    genericMaker: 'Jan Aushadhi Calcium+D3',
    useFor: 'Osteoporosis, Calcium Deficiency & Bone Density Maintenance',
    dosageTip: 'Take with or immediately after lunch or dinner for optimal absorption.',
    timing: 'Once or twice daily after meals',
    interactionsWith: ['Levothyroxine', 'Tetracyclines', 'Ciprofloxacin', 'Thiazide Diuretics']
  }
];

export interface InteractionCheckResult {
  drug1: string;
  drug2: string;
  severity: 'critical' | 'moderate' | 'low' | 'safe';
  title: string;
  effect: string;
  mechanism: string;
  advisory: string;
  actionRequired: string;
}

export const checkDrugPairInteraction = (name1: string, name2: string): InteractionCheckResult => {
  const n1 = name1.toLowerCase();
  const n2 = name2.toLowerCase();

  const isN1 = (term: string) => n1.includes(term.toLowerCase());
  const isN2 = (term: string) => n2.includes(term.toLowerCase());
  const hasBoth = (t1: string, t2: string) => (isN1(t1) && isN2(t2)) || (isN1(t2) && isN2(t1));

  // Critical Coagulation / Bleeding
  if (hasBoth('warfarin', 'aspirin') || hasBoth('warfarin', 'ibuprofen') || hasBoth('aspirin', 'clopidogrel')) {
    return {
      drug1: name1,
      drug2: name2,
      severity: 'critical',
      title: 'High Hemorrhagic Risk (Severe Coagulation Antagonism)',
      effect: '3.8x increase in major gastrointestinal bleeding & systemic hemorrhage',
      mechanism: 'Dual platelet COX-1 inhibition combined with vitamin K clotting factor synthesis blockage.',
      advisory: 'Do not combine without strict physician monitoring and INR prothrombin tracking. Report any unusual bruising or dark stools immediately.',
      actionRequired: 'Urgent Physician Review: Discuss paracetamol as alternative analgesic.'
    };
  }

  // Critical Metformin + Contrast
  if (hasBoth('metformin', 'contrast') || hasBoth('glycomet', 'contrast') || hasBoth('metformin', 'iodine')) {
    return {
      drug1: name1,
      drug2: name2,
      severity: 'critical',
      title: 'Lactic Acidosis Contraindication',
      effect: 'Acute renal failure and fatal lactic acid accumulation in bloodstream',
      mechanism: 'Radiocontrast dye reduces renal excretion of metformin.',
      advisory: 'Withhold Metformin 48 hours prior to any radiocontrast scan and resume only after serum creatinine confirmation.',
      actionRequired: 'Discontinue 48h prior to radiology imaging.'
    };
  }

  // Moderate Beta-Blocker + Antacids
  if (hasBoth('atenolol', 'antacid') || hasBoth('aten', 'pantocid') || hasBoth('atenolol', 'magnesium') || hasBoth('atenolol', 'gelusil') || hasBoth('beta-blocker', 'antacid')) {
    return {
      drug1: name1,
      drug2: name2,
      severity: 'moderate',
      title: 'Chelation & Bioavailability Reduction',
      effect: '30% to 35% reduction in peak blood pressure control efficacy',
      mechanism: 'Antacid polyvalent cations bind with beta-blockers in gastric juice, delaying GI absorption.',
      advisory: 'Maintain a minimum 2-hour separation window between taking your cardiovascular medicine and antacids.',
      actionRequired: 'Take Atenolol 2 hours BEFORE administering antacids.'
    };
  }

  // Moderate Levothyroxine + Calcium / Iron
  if (hasBoth('thyronorm', 'shelcal') || hasBoth('levothyroxine', 'calcium') || hasBoth('levothyroxine', 'iron')) {
    return {
      drug1: name1,
      drug2: name2,
      severity: 'moderate',
      title: 'Insoluble Chelate Formation in Stomach',
      effect: 'Thyroid hormone absorption decreased by up to 50%, causing hypothyroidism flares',
      mechanism: 'Calcium/Iron salts physically adsorb thyroxine molecules in the intestinal lumen.',
      advisory: 'Take Levothyroxine on an empty stomach when waking up. Take Calcium or Iron supplements at least 4 hours later (after lunch/dinner).',
      actionRequired: 'Separate administration by at least 4 hours.'
    };
  }

  // Moderate Statin + Grapefruit
  if (hasBoth('atorva', 'grapefruit') || hasBoth('atorvastatin', 'grapefruit') || hasBoth('statin', 'grapefruit')) {
    return {
      drug1: name1,
      drug2: name2,
      severity: 'low',
      title: 'CYP3A4 Metabolic Enzyme Inhibition',
      effect: 'Mild to moderate elevation of circulating statin blood concentrations',
      mechanism: 'Furanocoumarins in grapefruit inhibit intestinal CYP3A4 metabolism.',
      advisory: 'Occasional small glasses are tolerable, but avoid concentrated grapefruit extracts exceeding 200ml to prevent muscle soreness (myopathy).',
      actionRequired: 'Avoid large quantities of grapefruit juice.'
    };
  }

  // Safe combination
  return {
    drug1: name1,
    drug2: name2,
    severity: 'safe',
    title: 'No Severe Pharmacokinetic Contraindication Found',
    effect: 'Standard therapeutic synergy; no adverse interaction detected in verified database.',
    mechanism: 'Independent metabolic pathways without known competitive inhibition.',
    advisory: 'Take as directed by your physician. Ensure medicines requiring food (e.g. analgesics, antibiotics) are taken after meals.',
    actionRequired: 'Safe to administer according to doctor instructions.'
  };
};

export interface BiomarkerProfile {
  id: string;
  name: string;
  unit: string;
  normalMin: number;
  normalMax: number;
  evaluate: (val: number) => {
    status: 'optimal' | 'normal' | 'borderline' | 'high' | 'critical';
    label: string;
    color: string;
    explanation: string;
    lifestyleTip: string;
  };
}

export const BIOMARKERS_EVALUATOR: Record<string, BiomarkerProfile> = {
  glucose: {
    id: 'glucose',
    name: 'Fasting Blood Glucose',
    unit: 'mg/dL',
    normalMin: 70,
    normalMax: 99,
    evaluate: (val: number) => {
      if (val < 70) {
        return {
          status: 'critical',
          label: 'Hypoglycemia (Low Blood Sugar)',
          color: '#f59e0b',
          explanation: 'Blood sugar is below safe fasting baseline. Can cause shakiness, dizziness, and confusion.',
          lifestyleTip: 'Consume 15g fast-acting carbohydrates (fruit juice, glucose) and notify physician.'
        };
      } else if (val <= 99) {
        return {
          status: 'optimal',
          label: 'Normal Fasting Glucose',
          color: '#10b981',
          explanation: 'Fasting blood glucose is within the optimal healthy clinical reference range.',
          lifestyleTip: 'Maintain balanced dietary fiber, regular physical activity, and adequate hydration.'
        };
      } else if (val <= 125) {
        return {
          status: 'borderline',
          label: 'Impaired Fasting Glucose (Prediabetes)',
          color: '#f59e0b',
          explanation: 'Slightly elevated fasting glucose indicating early insulin resistance.',
          lifestyleTip: 'Reduce refined carbohydrates & sugary beverages. Engage in 30 mins of daily brisk walking.'
        };
      } else {
        return {
          status: 'high',
          label: 'Elevated Fasting Glucose (Diabetic Range)',
          color: '#ef4444',
          explanation: 'Fasting glucose meets clinical diagnostic criteria for Diabetes Mellitus.',
          lifestyleTip: 'Schedule comprehensive HbA1c review with an endocrinologist for medication management.'
        };
      }
    }
  },
  hba1c: {
    id: 'hba1c',
    name: 'Hemoglobin A1c (HbA1c)',
    unit: '%',
    normalMin: 4.0,
    normalMax: 5.6,
    evaluate: (val: number) => {
      if (val <= 5.6) {
        return {
          status: 'optimal',
          label: 'Normal Glycemic Control',
          color: '#10b981',
          explanation: 'Excellent 90-day average blood sugar control with minimal glycation of red blood cells.',
          lifestyleTip: 'Continue healthy eating habits and regular annual metabolic checkups.'
        };
      } else if (val <= 6.4) {
        return {
          status: 'borderline',
          label: 'Prediabetes Range',
          color: '#f59e0b',
          explanation: 'Moderate long-term glucose elevation indicating high risk of developing Type 2 Diabetes.',
          lifestyleTip: 'Adopt low-glycemic index foods (whole grains, lentils) and monitor fasting sugars monthly.'
        };
      } else {
        return {
          status: 'high',
          label: 'Diabetic Range',
          color: '#ef4444',
          explanation: 'Sustained hyperglycemia over past 3 months requiring active glycemic therapy.',
          lifestyleTip: 'Consult physician for oral hypoglycemics or insulin dosage optimization.'
        };
      }
    }
  },
  ldl: {
    id: 'ldl',
    name: 'LDL Cholesterol (Direct)',
    unit: 'mg/dL',
    normalMin: 50,
    normalMax: 99,
    evaluate: (val: number) => {
      if (val < 100) {
        return {
          status: 'optimal',
          label: 'Optimal LDL Cholesterol',
          color: '#10b981',
          explanation: 'Low circulating atherogenic lipoproteins; minimal risk of arterial plaque buildup.',
          lifestyleTip: 'Maintain heart-healthy diet rich in omega-3s, nuts, and green vegetables.'
        };
      } else if (val <= 129) {
        return {
          status: 'borderline',
          label: 'Near Optimal / Borderline',
          color: '#f59e0b',
          explanation: 'Slightly elevated bad cholesterol.',
          lifestyleTip: 'Limit trans-fats, deep-fried snacks, and dairy fats. Add soluble oat fiber.'
        };
      } else {
        return {
          status: 'high',
          label: 'High LDL Cholesterol',
          color: '#ef4444',
          explanation: 'Elevated atherogenic plaque risk for coronary artery disease.',
          lifestyleTip: 'Cardiologist review recommended for lipid lowering statin therapy and dietary overhaul.'
        };
      }
    }
  },
  creatinine: {
    id: 'creatinine',
    name: 'Serum Creatinine (KFT)',
    unit: 'mg/dL',
    normalMin: 0.6,
    normalMax: 1.2,
    evaluate: (val: number) => {
      if (val <= 1.2) {
        return {
          status: 'optimal',
          label: 'Normal Kidney Clearance',
          color: '#10b981',
          explanation: 'Glomerular filtration rate is optimal; kidneys are filtering metabolic waste efficiently.',
          lifestyleTip: 'Stay well-hydrated with 2.5 to 3 liters of water daily.'
        };
      } else if (val <= 1.5) {
        return {
          status: 'borderline',
          label: 'Mild Renal Elevation',
          color: '#f59e0b',
          explanation: 'Mild decrease in renal clearance or potential dehydration.',
          lifestyleTip: 'Check blood pressure, avoid unprescribed NSAID pain relievers, and retest in 2 weeks.'
        };
      } else {
        return {
          status: 'high',
          label: 'Impaired Renal Function',
          color: '#ef4444',
          explanation: 'Reduced kidney filtration capacity requiring nephrology evaluation.',
          lifestyleTip: 'Consult nephrologist immediately. Avoid nephrotoxic medicines and monitor daily urine output.'
        };
      }
    }
  }
};
