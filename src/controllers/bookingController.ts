import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sendBookingConfirmation } from '../services/emailService';
import { prisma } from '../lib/prisma';

const bookingSchema = z.object({
  patientName: z.string().min(2, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(100, 'Email is too long'),
  phone: z.string().min(10, 'Valid phone number is required').max(20, 'Phone number is too long'),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD.')
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid calendar date')
    .refine((val) => {
      const selectedDate = new Date(val + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Cannot book appointments in the past'),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format. Use HH:MM.').max(5),
  reason: z.string().max(500, 'Reason is too long').optional()
});

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = bookingSchema.parse(req.body);

    // The DB unique constraint on [date, timeSlot] will throw P2002 if double booked
    const booking = await prisma.booking.create({
      data
    });

    // Fire and forget email notification
    sendBookingConfirmation(booking.email, booking.patientName, booking.date, booking.timeSlot).catch(err => {
      console.error('Failed to send confirmation email:', err);
    });

    res.status(201).json({
      status: 'success',
      bookingId: booking.id,
      message: 'Appointment confirmed.'
    });
  } catch (error) {
    next(error);
  }
};
