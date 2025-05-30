import { Request, Response } from 'express';
import { CreateInvitationSchema } from '../schemas/invitationSchema';
import Invitation from '../models/invitation';
import crypto from 'crypto';

export const createInvitation = async (req: Request, res: Response) => {
  const parsed = CreateInvitationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const { email } = parsed.data;

  try {
    const existing = await Invitation.findOne({ email });
    if (existing && !existing.used && existing.expiresAt > new Date()) {
      return res.status(409).json({ message: 'Active invitation already exists' });
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    const invitation = await Invitation.create({ email, token, expiresAt });

    return res.status(201).json({
      message: 'Invitation created',
      token: invitation.token,
      expiresAt: invitation.expiresAt,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

export const verifyInvitation = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const invitation = await Invitation.findOne({ token });

    if (!invitation || invitation.used || invitation.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired invitation' });
    }

    return res.status(200).json({ message: 'Valid invitation', email: invitation.email });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

export const markInvitationAsUsed = async (token: string) => {
  await Invitation.findOneAndUpdate({ token }, { used: true });
};
