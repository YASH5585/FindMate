import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { validateBody } from '../middleware/validate';
import { loadSessionUser } from '../middleware/auth';import { RegisterSchema, LoginSchema } from '../services/validation';

const router = Router();

router.post('/register', validateBody(RegisterSchema), register);
router.post('/login', validateBody(LoginSchema), login);
router.post('/logout', logout);

router.use(loadSessionUser);

router.get('/me', getMe);

export default router;
