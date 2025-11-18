import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  console.error('Error:', error);

  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};
