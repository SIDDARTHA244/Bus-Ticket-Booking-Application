import Bus from '../models/Bus.js';
import Schedule from '../models/Schedule.js';

// Search buses
export const searchBuses = async (req, res, next) => {
  try {
    const { origin, destination, date } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({ message: 'Please provide origin, destination, and date' });
    }

    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const schedules = await Schedule.find({
      origin: { $regex: origin, $options: 'i' },
      destination: { $regex: destination, $options: 'i' },
      date: { $gte: searchDate, $lt: nextDay },
    }).populate('bus');

    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

// Get bus details
export const getBusDetails = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (bus) {
      res.json(bus);
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    next(error);
  }
};

// Get schedule details
export const getScheduleDetails = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('bus');
    if (schedule) {
      res.json(schedule);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    next(error);
  }
};
