import { Response } from "express";

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("jwt_token"); 
  res.clearCookie("refreshToken"); 
};