import Bus from '../models/Bus.js';
import Schedule from '../models/Schedule.js';
import Booking from '../models/Booking.js';

// Create bus
export const createBus = async (req, res, next) => {
  try {
    const { busNumber, busName, busType, totalSeats, amenities, operator } = req.body;

    const busExists = await Bus.findOne({ busNumber });
    if (busExists) {
      return res.status(400).json({ message: 'Bus number already exists' });
    }

    const bus = await Bus.create({
      busNumber,
      busName,
      busType,
      totalSeats,
      amenities,
      operator,
    });

    res.status(201).json(bus);
  } catch (error) {
    next(error);
  }
};

// Update bus
export const updateBus = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    Object.assign(bus, req.body);
    const updatedBus = await bus.save();

    res.json(updatedBus);
  } catch (error) {
    next(error);
  }
};

// Delete bus
export const deleteBus = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    await bus.deleteOne();
    res.json({ message: 'Bus removed' });
  } catch (error) {
    next(error);
  }
};

// Get all buses
export const getAllBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find({});
    res.json(buses);
  } catch (error) {
    next(error);
  }
};

// Create schedule
export const createSchedule = async (req, res, next) => {
  try {
    const { busId, origin, destination, departureTime, arrivalTime, date, price } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const schedule = await Schedule.create({
      bus: busId,
      origin,
      destination,
      departureTime,
      arrivalTime,
      date,
      price,
      availableSeats: bus.totalSeats,
      bookedSeats: [],
    });

    const populatedSchedule = await Schedule.findById(schedule._id).populate('bus');
    res.status(201).json(populatedSchedule);
  } catch (error) {
    next(error);
  }
};

// Update schedule
export const updateSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    Object.assign(schedule, req.body);
    const updatedSchedule = await schedule.save();

    res.json(updatedSchedule);
  } catch (error) {
    next(error);
  }
};

// Delete schedule
export const deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await schedule.deleteOne();
    res.json({ message: 'Schedule removed' });
  } catch (error) {
    next(error);
  }
};

// Get all schedules
export const getAllSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.find({}).populate('bus').sort({ date: 1 });
    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

// Get all bookings
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
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
