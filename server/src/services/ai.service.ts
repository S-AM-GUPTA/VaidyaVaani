import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const summarizeReport = async (ocrText: string): Promise<string> => {
  if (!ocrText || ocrText.trim() === '') {
    return 'No text could be extracted from this report to analyze.';
  }

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
    
    return response.text || '{}';
  } catch (error) {
    console.error('Gemini API Error (Report):', error);
    throw new Error('Failed to generate report summary');
  }
};

export const explainPrescription = async (ocrText: string, candidates?: any[]): Promise<string> => {
  if (!ocrText || ocrText.trim() === '') {
    return '{"medicines": []}';
  }

  const candidatesContext = candidates && candidates.length > 0
    ? `\n\nIdentified Candidate OCR Matches (from Medical Normalization Engine):\n${JSON.stringify(candidates, null, 2)}`
    : '';

  const prompt = `
You are VaidyaVaani, a clinical verification assistant for prescription interpretation.
Below is text extracted from a doctor's prescription via OCR (PaddleOCR + TrOCR) along with normalization candidates.

CRITICAL MEDICAL SAFETY RULES:
1. NEVER invent medications, dosages, or durations that are not indicated in the OCR signals.
2. If handwriting is ambiguous or a medicine is uncertain, set "requiresVerification": true and "confidenceScore" < 80.
3. If an OCR candidate matches standard Indian pharmaceuticals (e.g. Dolo 650, Augmentin 625, Telma 40, Pantocid 40, Glycomet-GP, Atorva, Montair-LC, Azithral), normalize its official name and clinical indications.
4. Format output strictly as JSON with key "medicines".

JSON Schema:
{
  "medicines": [
    {
      "name": "Corrected Brand or Generic Name (e.g., Augmentin 625)",
      "purpose": "Plain-language therapy description (e.g., Bacterial respiratory & ENT infections)",
      "dosage": "e.g., 625 mg, 1 tablet",
      "timing": "e.g., Morning & Night / Before food / After food",
      "foodInstructions": "e.g., After meals / With plenty of water",
      "warnings": "e.g., Complete full 5-day course; avoid missing doses",
      "confidenceScore": 92,
      "requiresVerification": false
    }
  ]
}

OCR Text with Confidences:
${ocrText}
${candidatesContext}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text || '{"medicines": []}';
  } catch (error) {
    console.error('Gemini API Error (Prescription):', error);
    throw new Error('Failed to explain prescription');
  }
};
