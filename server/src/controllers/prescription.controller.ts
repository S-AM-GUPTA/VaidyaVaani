import { Request, Response } from 'express';
import Prescription from '../models/Prescription';
import { mockCloudinaryUpload } from '../services/upload.service';

export const uploadPrescription = async (req: Request, res: Response): Promise<void> => {
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

    // Mock Cloudinary upload
    const fileUrl = await mockCloudinaryUpload(file);

    let extractedText = '';
    let status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' = 'PROCESSING';
    let medicinesData: any[] = [];

    try {
      const { analyzePrescriptionOCR } = await import('../services/ocr.service');
      const { explainPrescription } = await import('../services/ai.service');
      
      const ocrResult = await analyzePrescriptionOCR(file.path);
      extractedText = ocrResult.raw_text || '';
      const ocrCandidates = ocrResult.prescription?.medicines || [];
      
      if (extractedText || ocrCandidates.length > 0) {
        const rawJson = await explainPrescription(extractedText, ocrCandidates);
        let cleanJson = rawJson.replace(/```json/gi, '').replace(/```/g, '');
        const firstBrace = cleanJson.indexOf('{');
        const lastBrace = cleanJson.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
        }
        
        let parsed: any = {};
        try {
          parsed = JSON.parse(cleanJson);
        } catch (e) {
          console.error("Failed to parse Gemini JSON:", cleanJson);
        }
        
        if (parsed.medicines && Array.isArray(parsed.medicines) && parsed.medicines.length > 0) {
          medicinesData = parsed.medicines;
        } else if (ocrCandidates.length > 0) {
          // Fallback to deterministic OCR normalization if LLM fails
          medicinesData = ocrCandidates.map(c => ({
            name: c.name,
            purpose: c.purpose || 'Prescribed therapy',
            dosage: `${c.strength || ''} ${c.dosage || ''}`.trim(),
            timing: c.timing || c.frequency || 'As prescribed',
            foodInstructions: c.timing || 'As directed',
            warnings: 'Verify with prescribing doctor',
            confidenceScore: Math.round((c.confidence || 0.8) * 100),
            requiresVerification: c.needs_verification || false
          }));
        }
      }
      
      status = 'COMPLETED';
    } catch (err) {
      console.error('Processing failed:', err);
      status = 'FAILED';
    }

    // Create prescription record
    const prescription = await Prescription.create({
      userId,
      fileUrl,
      extractedText,
      status
    });

    // Create Medicine records
    if (medicinesData.length > 0) {
      const Medicine = (await import('../models/Medicine')).default;
      const medicineDocs = medicinesData.map(med => ({
        prescriptionId: prescription._id,
        userId,
        name: med.name,
        purpose: med.purpose,
        dosage: med.dosage,
        timing: med.timing,
        foodInstructions: med.foodInstructions,
        warnings: med.warnings,
        confidenceScore: med.confidenceScore,
        requiresVerification: med.requiresVerification
      }));
      await Medicine.insertMany(medicineDocs);
    }

    res.status(201).json({ 
      message: 'Prescription uploaded successfully',
      prescription 
    });
  } catch (error) {
    console.error('Upload prescription error:', error);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
};

export const getPrescriptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const prescriptions = await Prescription.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ error: 'Internal server error fetching prescriptions' });
  }
};
