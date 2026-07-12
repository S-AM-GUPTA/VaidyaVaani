import axios from 'axios';

const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || 'http://localhost:8000';

export const extractTextFromImage = async (absoluteFilePath: string): Promise<string> => {
  try {
    const response = await axios.post(`${OCR_SERVICE_URL}/extract`, {
      file_path: absoluteFilePath
    });
    
    return response.data.extracted_text;
  } catch (error: any) {
    console.error('Error calling OCR microservice:', error.response?.data || error.message);
    throw new Error('Failed to extract text using OCR service');
  }
};
