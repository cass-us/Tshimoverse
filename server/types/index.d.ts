// src/types/express/index.d.ts

import { IUserDocument } from '../../models/User';
// ../types/index.ts
export type { IUserDocument } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

// Add an empty export to convert this file into a module
export {};
