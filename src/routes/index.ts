import { Router } from 'express';
import { getAvailability } from '../controllers/availabilityController';
import { createBooking } from '../controllers/bookingController';
import { submitContact } from '../controllers/contactController';
import { apiLimiter, bookingLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply general rate limiting to all API routes
router.use(apiLimiter);

router.get('/availability', getAvailability);
router.post('/bookings', bookingLimiter, createBooking);
router.post('/contact', submitContact);

export default router;