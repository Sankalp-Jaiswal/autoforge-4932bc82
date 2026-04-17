import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors
    });
  }

  const error = err as { code?: string; status?: number; message?: string };

  if (error.code === 'P2002') {
    return res.status(409).json({
      status: 'error',
      message: 'This time slot is already booked. Please choose another.'
    });
  }

  res.status(error.status || 500).json({
    status: 'error',
    message: error.message || 'Internal Server Error'
  });
};
