import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const querySchema = z.object({
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD.')
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid calendar date')
});

// Clinic hours: 09:00 to 16:00, 1 hour slots
const generateDailySlots = () => {
  return ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
};

export const getAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = querySchema.parse(req.query);

    const bookings = await prisma.booking.findMany({
      where: { date },
      select: { timeSlot: true }
    });

    const bookedSlots = bookings.map(b => b.timeSlot);
    const allSlots = generateDailySlots();
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({
      date,
      availableSlots
    });
  } catch (error) {
    next(error);
  }
};
