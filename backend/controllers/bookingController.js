import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import { nanoid } from 'nanoid';

// Create booking
export const createBooking = async (req, res, next) => {
  try {
    const { scheduleId, seats } = req.body;

    if (!scheduleId || !seats || seats.length === 0) {
      return res.status(400).json({ message: 'Please provide schedule and seats' });
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check if seats are available
    const unavailableSeats = seats.filter((seat) => schedule.bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats ${unavailableSeats.join(', ')} are already booked`,
      });
    }

    const totalAmount = seats.length * schedule.price;
    const bookingReference = nanoid(10).toUpperCase();

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      schedule: scheduleId,
      seats,
      totalAmount,
      bookingReference,
    });

    // Update schedule
    schedule.bookedSeats.push(...seats);
    schedule.availableSeats -= seats.length;
    await schedule.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate({
        path: 'schedule',
        populate: { path: 'bus' },
      });

    res.status(201).json(populatedBooking);
  } catch (error) {
    next(error);
  }
};

// Get user bookings
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'schedule',
        populate: { path: 'bus' },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// Cancel booking
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Update schedule
    const schedule = await Schedule.findById(booking.schedule);
    if (schedule) {
      schedule.bookedSeats = schedule.bookedSeats.filter(
        (seat) => !booking.seats.includes(seat)
      );
      schedule.availableSeats += booking.seats.length;
      await schedule.save();
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    next(error);
  }
};

// Payment stub endpoint
export const processPayment = async (req, res, next) => {
  try {
    const { amount, bookingReference } = req.body;

    // Simulate payment processing
    const paymentSuccess = Math.random() > 0.1; // 90% success rate

    if (paymentSuccess) {
      res.json({
        success: true,
        message: 'Payment processed successfully',
        transactionId: `TXN${nanoid(12).toUpperCase()}`,
        amount,
        bookingReference,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again.',
      });
    }
  } catch (error) {
    next(error);
  }
};
