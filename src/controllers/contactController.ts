import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(100, 'Email is too long'),
  message: z.string().min(10, 'Message is too short').max(1000, 'Message is too long')
});

export const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = contactSchema.parse(req.body);

    await prisma.contactInquiry.create({
      data
    });

    res.status(200).json({
      status: 'success',
      message: 'Message sent successfully.'
    });
  } catch (error) {
    next(error);
  }
};
