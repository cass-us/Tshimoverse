import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../constants/statusCodes';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(STATUS_CODES.NOT_FOUND);
  next(error);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode =
    res.statusCode === 200 ? STATUS_CODES.INTERNAL_SERVER_ERROR : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
