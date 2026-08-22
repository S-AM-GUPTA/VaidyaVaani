import axios from 'axios';

const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || 'http://localhost:8000';

export interface ExtractedOCRLine {
  text: string;
  confidence: number;
  engine?: string;
  box?: any;
}

export interface CandidateMedicine {
  name: string;
  generic_name?: string;
  strength?: string;
  form?: string;
  dosage?: string;
  frequency?: string;
  timing?: string;
  duration?: string;
  purpose?: string;
  confidence?: number;
  needs_verification?: boolean;
}

export interface PrescriptionOCRResult {
  success: boolean;
  extracted_lines: ExtractedOCRLine[];
  raw_text: string;
  prescription: {
    medicines: CandidateMedicine[];
    overall_confidence: number;
    needs_verification: boolean;
    confidence_tier?: string;
  };
  overall_confidence: number;
  needs_verification: boolean;
  timing_ms?: number;
}

export const analyzePrescriptionOCR = async (absoluteFilePath: string): Promise<PrescriptionOCRResult> => {
  try {
    const response = await axios.post(`${OCR_SERVICE_URL}/prescription/analyze`, {
      file_path: absoluteFilePath
    }, {
      timeout: 30000
    });
    
    return response.data;
  } catch (error: any) {
    // Fallback to /extract endpoint if /prescription/analyze is not reachable
    try {
      const fallbackRes = await axios.post(`${OCR_SERVICE_URL}/extract`, {
        file_path: absoluteFilePath
      }, {
        timeout: 30000
      });
      
      const lines = fallbackRes.data.extracted_lines || [];
      const rawText = lines.map((l: any) => `${l.text} [Confidence: ${Math.round((l.confidence || 0.8) * 100)}%]`).join('\n');
      
      return {
        success: true,
        extracted_lines: lines,
        raw_text: rawText,
        prescription: fallbackRes.data.prescription || {
          medicines: [],
          overall_confidence: fallbackRes.data.overall_confidence || 0.8,
          needs_verification: fallbackRes.data.needs_verification || false
        },
        overall_confidence: fallbackRes.data.overall_confidence || 0.8,
        needs_verification: fallbackRes.data.needs_verification || false
      };
    } catch (fallbackError: any) {
      console.error('Error calling OCR microservice:', fallbackError.response?.data || fallbackError.message);
      throw new Error('Failed to extract text using OCR service');
    }
  }
};

export const extractTextFromImage = async (absoluteFilePath: string): Promise<string> => {
  try {
    const result = await analyzePrescriptionOCR(absoluteFilePath);
    if (result.extracted_lines && result.extracted_lines.length > 0) {
      return result.extracted_lines.map((line: any) => {
        const confPercent = Math.round((line.confidence || 0.8) * 100);
        return `${line.text} [Confidence: ${confPercent}%]`;
      }).join('\n');
    }
    return result.raw_text || '';
  } catch (error: any) {
    console.error('Error in extractTextFromImage:', error.message);
    throw new Error('Failed to extract text using OCR service');
  }
};
