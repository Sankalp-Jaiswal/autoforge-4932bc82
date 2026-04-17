import { z } from 'zod';

export const bookingFormSchema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address').max(100, 'Email is too long'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(20, 'Phone number is too long'),
  date: z.string().min(1, 'Please select a date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  reason: z.string().max(500, 'Reason is too long').optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
