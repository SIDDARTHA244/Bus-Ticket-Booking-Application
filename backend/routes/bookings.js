import express from 'express';
import {
  createBooking,
  getUserBookings,
  cancelBooking,
  processPayment,
} from '../controllers/bookingController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.post('/payment', protect, processPayment);

export default router;
