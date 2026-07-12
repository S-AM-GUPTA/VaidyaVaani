import { Request, Response } from 'express';
import Medicine from '../models/Medicine';

export const getMedicines = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prescriptionId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const medicines = await Medicine.find({ prescriptionId, userId });
    res.status(200).json(medicines);
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
