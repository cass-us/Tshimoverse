import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { STATUS_CODES } from "../constants/http.codes";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} from "../services/authService";
import { registerSchema } from "../schemas/registerSchema";
import generateToken from "../utils/generateToken";
import { clearAuthCookies } from "../utils/authCookies";
import { IUserDocument } from "../types";

interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}

export const registerUserController = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);
  const user = await registerUser(validatedData);

  const { accessToken, refreshToken } = generateToken(user, res);

  res.status(STATUS_CODES.CREATED).json({
    message: "User registered successfully",
    accessToken,
    refreshToken,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      position: user.position,
      ...(user.position === "Beneficiary" && {
        gender: user.gender,
        programme: user.programme,
        cohortStartDate: user.cohortStartDate,
        cohortEndDate: user.cohortEndDate,
      }),
    },
  });
});

export const loginUserController = asyncHandler(async (req: Request, res: Response) => {
  const user = await loginUser(req.body);
  const { accessToken, refreshToken } = generateToken(user, res);

  res.status(STATUS_CODES.OK).json({
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      position: user.position,
      ...(user.position === "Beneficiary" && {
        gender: user.gender,
        programme: user.programme,
        cohortStartDate: user.cohortStartDate,
        cohortEndDate: user.cohortEndDate,
      }),
    },
  });
});

/**
 * @desc Get current user profile
 * @route GET /api/auth/profile
 */
export const getProfileController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new Error("User not authenticated");

  const user = await getProfile(req.user._id.toString());

  res.status(STATUS_CODES.OK).json({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    position: user.position,
    ...(user.position === "Beneficiary" && {
      gender: user.gender,
      programme: user.programme,
      cohortStartDate: user.cohortStartDate,
      cohortEndDate: user.cohortEndDate,
    }),
  });
});

/**
 * @desc Update user profile
 * @route PUT /api/auth/profile
 */
export const updateProfileController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) throw new Error("User not authenticated");

  const updatedUser = await updateProfile(req.user._id.toString(), req.body);

  res.status(STATUS_CODES.OK).json({
    message: "Profile updated successfully",
    user: {
      id: updatedUser._id.toString(),
      username: updatedUser.username,
      email: updatedUser.email,
      position: updatedUser.position,
      ...(updatedUser.position === "Beneficiary" && {
        gender: updatedUser.gender,
        programme: updatedUser.programme,
        cohortStartDate: updatedUser.cohortStartDate,
        cohortEndDate: updatedUser.cohortEndDate,
      }),
    },
  });
});

/**
 * @desc Logout user
 * @route POST /api/auth/logout
 */
export const logoutUserController = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookies(res);
  res.status(STATUS_CODES.OK).json({ message: "Logout successful" });
});
