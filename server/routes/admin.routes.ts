import express from 'express';
const router = express.Router();
import { uploadUsersController } from'../controllers/adminController';

router.post('/bulk-users', uploadUsersController);

export default router;
