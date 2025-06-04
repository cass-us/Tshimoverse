// middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    // Add user to request if decoding is needed
    next();
  } catch (err) {
    res.status(403).json({ message: 'Forbidden' });
  }
}
