import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { createMultipleUsers } from '../services/adminService';
import HttpError from '../utils/httpError';

// POST /api/admin/users
export const uploadUsersController = asyncHandler(async (req: Request, res: Response) => {
    
    console.log(req.body);
    
    const users = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    throw new HttpError('No users provided', 400);
  }

  try {
    const savedUsers = await createMultipleUsers(users);

    res.status(201).json({
      message: 'Users uploaded successfully',
      users: savedUsers,
    });
  } catch (error: any) {
    throw new HttpError(error.message || 'Error uploading users', error.statusCode || 500);
  }
});
