import asyncHandler from 'express-async-handler';
import { STATUS_CODES } from '../constants/statusCodes';
import { registerSchema } from '../zod/user.schema';
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
