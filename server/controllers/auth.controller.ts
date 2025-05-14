import asyncHandler from 'express-async-handler';
import { STATUS_CODES } from '../constants/statusCodes';
import { registerSchema,loginSchema } from '../zod/user.schema';
import  jwt from "jsonwebtoken"

import User from '../models/User';

export const registerUser = asyncHandler(async (req, res) => {
  const validatedData = registerSchema.parse(req.body);

  const userExists = await User.findOne({ email: validatedData.email });
  if (userExists) {
    res.status(STATUS_CODES.BAD_REQUEST);
    throw new Error('User already exists');
  }

  const user = await User.create(validatedData);

  res.status(STATUS_CODES.CREATED).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      position: user.position,
    },
  });
});
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    res.status(STATUS_CODES.UNAUTHORIZED);
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  res.status(STATUS_CODES.OK).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      position: user.position,
    },
  });
});
