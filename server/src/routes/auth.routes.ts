import { Router } from 'express';
import { login, verifyOTP } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/verify', verifyOTP);

export default router;
