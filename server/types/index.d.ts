import {userDocument} from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
