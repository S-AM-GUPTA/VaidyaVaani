import { Request, Response } from 'express';
import Report from '../models/Report';
import { mockCloudinaryUpload } from '../services/upload.service';

export const uploadReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const file = req.file;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Mock Cloudinary upload to get URL
    const fileUrl = await mockCloudinaryUpload(file);

    // Run OCR asynchronously
    let extractedText = '';
    let summary = '';
    let status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' = 'PROCESSING';
    
    try {
      const { extractTextFromImage } = await import('../services/ocr.service');
      const { summarizeReport } = await import('../services/ai.service');
      
      extractedText = await extractTextFromImage(file.path);
      
      // Pass OCR text to Gemini
      if (extractedText) {
        const rawJson = await summarizeReport(extractedText);
        // Clean markdown backticks if Gemini adds them despite instructions
        const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '');
        summary = cleanJson;
      }
      
      status = 'COMPLETED';
    } catch (err) {
      console.error('Processing failed:', err);
      status = 'FAILED';
    }

    // Create report record
    const report = await Report.create({
      userId,
      fileUrl,
      fileType: file.mimetype,
      originalName: file.originalname,
      extractedText,
      summary,
      status
    });

    res.status(201).json({ 
      message: 'Report uploaded successfully',
      report 
    });
  } catch (error) {
    console.error('Upload report error:', error);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
};

export const getReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const reports = await Report.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error fetching reports' });
  }
};
