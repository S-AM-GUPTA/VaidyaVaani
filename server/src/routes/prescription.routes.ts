import { Router } from 'express';
import { uploadPrescription, getPrescriptions } from '../controllers/prescription.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../services/upload.service';

const router = Router();

// All prescription routes are protected
router.use(authenticate);

router.post('/upload', upload.single('file'), uploadPrescription);
router.get('/', getPrescriptions);

export default router;
