// src/types/express/index.d.ts

import { IUserDocument } from '../../models/User';
import { JwtPayload } from 'jsonwebtoken';
// ../types/index.ts
export type { IUserDocument } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
      user?: string | JwtPayload;
    }
  }
}

// Add an empty export to convert this file into a module
export {};
