import { Router } from 'express';
import { uploadReport, getReports } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../services/upload.service';

const router = Router();

// All report routes are protected
router.use(authenticate);

router.post('/upload', upload.single('file'), uploadReport);
router.get('/', getReports);

export default router;
