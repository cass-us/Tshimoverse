import { Router } from 'express';
import { createInvitation,verifyInvitation } from '../controllers/invitation';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/create', authenticate, createInvitation); // Only logged in users (admin) can create
router.get('/verify/:token', verifyInvitation); // Public route for checking a token

export default router;
