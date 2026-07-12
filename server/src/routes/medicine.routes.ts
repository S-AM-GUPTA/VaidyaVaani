import { Router } from 'express';
import { getMedicines } from '../controllers/medicine.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/:prescriptionId', getMedicines);

export default router;
