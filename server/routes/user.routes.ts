import express from 'express';
import { registerUserController,logoutUserController, loginUserController,getProfileController ,updateProfileController} from '../controllers/auth.controller';
import { protect } from '../middleware/errorMiddleware';

const router = express.Router();

router.post('/register', registerUserController);
router.post('/login',loginUserController);
router.get('/profile', protect, getProfileController);
router.put('/profile', protect, updateProfileController);
router.post('/logout',logoutUserController)
export default router;
