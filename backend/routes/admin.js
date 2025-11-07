import express from 'express';
import {
  createBus,
  updateBus,
  deleteBus,
  getAllBuses,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAllSchedules,
  getAllBookings,
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/auth.js';

const router = express.Router();

// Bus routes
router.post('/buses', protect, admin, createBus);
router.put('/buses/:id', protect, admin, updateBus);
router.delete('/buses/:id', protect, admin, deleteBus);
router.get('/buses', protect, admin, getAllBuses);

// Schedule routes
router.post('/schedules', protect, admin, createSchedule);
router.put('/schedules/:id', protect, admin, updateSchedule);
router.delete('/schedules/:id', protect, admin, deleteSchedule);
router.get('/schedules', protect, admin, getAllSchedules);

// Booking routes
router.get('/bookings', protect, admin, getAllBookings);

export default router;
