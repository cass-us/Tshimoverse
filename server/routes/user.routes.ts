import express from 'express';
import { registerUser } from '../controllers/auth.controller';

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

export default router;
