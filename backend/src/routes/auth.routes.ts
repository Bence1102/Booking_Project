import { Router } from 'express';
import { register, login, updateProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/me', authenticate, updateProfile);

export default router;
