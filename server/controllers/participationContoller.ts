import { Request, Response } from 'express';
import Participation from '../models/Participation';
import { EnrollSchema } from '../schemas/participationSchema';

export const enrollBeneficiary = async (req: Request, res: Response) => {
  const parsed = EnrollSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const { beneficiaryId, programId, role = 'participant', startDate, endDate } = parsed.data;

  try {
    const existing = await Participation.findOne({ beneficiaryId, programId });
    if (existing) return res.status(409).json({ message: 'Already enrolled in this program' });

    const participation = await Participation.create({ beneficiaryId, programId, role, startDate, endDate });
    return res.status(201).json({ message: 'Enrollment successful', data: participation });
  } catch (err) {
    return res.status(500).json({ message: 'Error enrolling beneficiary', error: err });
  }
};

export const getParticipationHistory = async (req: Request, res: Response) => {
  const { beneficiaryId } = req.params;

  try {
    const history = await Participation.find({ beneficiaryId }).populate('programId');
    return res.status(200).json({ data: history });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching participation history', error: err });
  }
};

export const removeParticipation = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Participation.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Participation removed' });
  } catch (err) {
    return res.status(500).json({ message: 'Error removing participation', error: err });
  }
};
