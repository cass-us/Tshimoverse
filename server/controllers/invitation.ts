import { Request, Response } from 'express';
import { CreateInvitationSchema } from '../schemas/invitationSchema';
import Invitation from '../models/invitation';
import crypto from 'crypto';

export const createInvitation = async (req: Request, res: Response): Promise<void> => {
  const parsed = CreateInvitationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten() });
    return; // 🚨 Return early to avoid accessing `parsed.data`
  }

  const { email } = parsed.data;

  try {
    const existing = await Invitation.findOne({ email });
    if (existing && !existing.used && existing.expiresAt > new Date()) {
      res.status(409).json({ message: 'Active invitation already exists' });
      return; // 🚨 Return early
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    const invitation = await Invitation.create({ email, token, expiresAt });

    res.status(201).json({
      message: 'Invitation created',
      token: invitation.token,
      expiresAt: invitation.expiresAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyInvitation = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  try {
    const invitation = await Invitation.findOne({ token });

    if (!invitation || invitation.used || invitation.expiresAt < new Date()) {
      res.status(400).json({ message: 'Invalid or expired invitation' });
      return; // 🚨 Return early
    }

    res.status(200).json({ message: 'Valid invitation', email: invitation.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markInvitationAsUsed = async (token: string): Promise<void> => {
  try {
    await Invitation.findOneAndUpdate({ token }, { used: true });
  } catch (err) {
    console.error('Error marking invitation as used:', err);
    throw new Error('Failed to mark invitation as used');
  }
};
