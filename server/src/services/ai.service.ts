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
    
    // We expect the LLM to return JSON. Let's return it as a stringified JSON for the controller to parse, or just the raw text.
    return response.text || '{}';
  } catch (error) {
    console.error('Gemini API Error (Report):', error);
    throw new Error('Failed to generate report summary');
  }
};

export const explainPrescription = async (ocrText: string): Promise<string> => {
  if (!ocrText || ocrText.trim() === '') {
    return 'No text could be extracted from this prescription.';
  }

  const prompt = `
You are VaidyaVaani, a highly intelligent medical assistant.
Below is raw text extracted from a doctor's prescription via OCR. 
Please extract the medicines and provide a structured explanation.
Format your output EXACTLY as a JSON object with a single key "medicines", which is an array of objects. Each object should have:
- "name": The name of the medicine.
- "purpose": A simple explanation of what it is for.
- "dosage": How much to take.
- "timing": When to take it (e.g., Morning/Night).
- "foodInstructions": e.g., "After food".
- "warnings": Any common warnings (e.g., "Avoid alcohol").

OCR Text:
${ocrText}
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
