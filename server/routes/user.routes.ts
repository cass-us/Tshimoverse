import express from 'express';
import { registerUserController, loginUserController } from '../controllers/auth.controller';
//import { protect } from '../middleware/errorMiddleware';

const router = express.Router();

router.post('/register', registerUserController);
router.post('/login',loginUserController);
//router.get('/profile', protect, getProfile);
//router.put('/profile', protect, updateProfile);

export default router;
