import asyncHandler from 'express-async-handler';
import User, { Position } from '../models/User';
import { STATUS_CODES } from '../constants/statusCodes';


export const adminController = asyncHandler(async (req, res) => {
  const users = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    res.status(STATUS_CODES.BAD_REQUEST);
    throw new Error('No users provided');
  }

  const validPositions = Object.values(Position);

  const mappedUsers = users.map((user) => {
    if (!user.fullName || !user.email) {
      throw new Error('Each user must have a fullName and email');
    }

    const username = user.fullName.toLowerCase().replace(/\s+/g, '');
    const defaultPassword = 'DefaultPass123!';

    const position =
      validPositions.includes(user.role) && user.role
        ? user.role
        : 'Developer'; 

    return {
      username,
      email: user.email.toLowerCase(),
      password: defaultPassword,
      position,
    };
  });

  const savedUsers = await User.insertMany(mappedUsers);

  res.status(STATUS_CODES.CREATED).json({
    message: 'Users uploaded successfully',
    users: savedUsers,
  });
});
