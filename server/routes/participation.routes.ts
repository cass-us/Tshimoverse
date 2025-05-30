import { Router } from 'express';
import { enrollBeneficiary, getParticipationHistory, removeParticipation } from "../controllers/participationContoller"
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/enroll', authenticate, enrollBeneficiary);
router.get('/history/:beneficiaryId', authenticate, getParticipationHistory);
router.delete('/:id', authenticate, removeParticipation);

export default router;
