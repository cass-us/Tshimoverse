import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUserDocument } from "../models/User";

const generateToken = (
  user: IUserDocument,
  res: Response
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(
    { id: user._id.toString() }, 
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { accessToken, refreshToken };
}; 

export default generateToken;
