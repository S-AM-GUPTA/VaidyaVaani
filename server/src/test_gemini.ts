import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const test = async () => {
    const ocrText = `
Snha
AEE
i 
. S (E)
A
o30
TEST REPORT
Collection Centre:
MEDCIS
REPORT.NO
>006
Patient's Name
lessing for ialthy liing
> SAKUNTALA
Age/Sex>50Y/F
Referred By Dr.
> SELF
Date.
>09/07/2026
Test Required
> CBC.
HEMATOLOGY REPORT
TEST
RESULT
NORMAL VALUE
HB
10.1
gm/dl(M-13.5-18.0)(F-11.5-16.00)
PLATLATE COUNT
1.17
lack/cmm(1.5-4.5lack/cmm)
(TOTAL LEUKOCYTE COUNT)
TLC
6,500
Per cmm (4000-11000)
(DIFFERENTIAL LEUKOCYTE COUNT)
Neutrophill
41
(40-75%)
Lymphocytes
50
(20-45%)
Eosinophills
07
(01-06%)
Monocytes
02
(02-10%)
Basophills
00
(00-01%).
ESR (Erythrocyte sedimentation rate
20
mm.fal at first hourby wintrobe (men0-9)(women0-20
PATHOLAGIST
`;
  const prompt = `
You are VaidyaVaani, a highly intelligent medical assistant. 
Below is raw text extracted from a medical lab report via OCR. It might contain errors or noise.
Please analyze this text and provide a simple, easy-to-understand summary.
Format your output EXACTLY as a JSON object (without markdown blocks like \`\`\`json) with the following keys:
- "keyFindings": An array of short strings describing the main findings.
- "abnormalValues": An array of strings describing any values out of normal range.
- "explanation": A brief, plain-language paragraph explaining what this report means for the patient (in English and Hindi).
- "recommendations": An array of actionable advice (e.g., "Visit a physician", "Avoid high sugar foods").

OCR Text:
${ocrText}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    console.log("SUCCESS:", response.text);
  } catch (err) {
    console.error("FAIL:", err);
  }
};

test();
