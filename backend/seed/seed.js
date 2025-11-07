import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Bus from '../models/Bus.js';
import Schedule from '../models/Schedule.js';
import Booking from '../models/Booking.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Bus.deleteMany({});
    await Schedule.deleteMany({});
    await Booking.deleteMany({});

    console.log('Data cleared');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@busbooking.com',
      password: 'admin123',
      isAdmin: true,
    });

    // Create sample users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
    });

    console.log('Users created');

    // Create buses
    const buses = await Bus.insertMany([
      {
        busNumber: 'KA01AB1234',
        busName: 'Volvo Express',
        busType: 'AC',
        totalSeats: 40,
        amenities: ['WiFi', 'Charging Port', 'Water Bottle', 'Blanket'],
        operator: 'Express Travels',
      },
      {
        busNumber: 'KA02CD5678',
        busName: 'Sleeper Deluxe',
        busType: 'Sleeper',
        totalSeats: 36,
        amenities: ['WiFi', 'Charging Port', 'Pillow', 'Blanket'],
        operator: 'Luxury Tours',
      },
      {
        busNumber: 'TN03EF9012',
        busName: 'Semi Sleeper Pro',
        busType: 'Semi-Sleeper',
        totalSeats: 44,
        amenities: ['Charging Port', 'Water Bottle'],
        operator: 'Safe Travels',
      },
      {
        busNumber: 'MH04GH3456',
        busName: 'Non-AC Standard',
        busType: 'Non-AC',
        totalSeats: 50,
        amenities: ['Water Bottle'],
        operator: 'Budget Bus',
      },
    ]);

    console.log('Buses created');

    // Create schedules for next 7 days
    const schedules = [];
    const routes = [
      { origin: 'Mumbai', destination: 'Pune', duration: 3 },
      { origin: 'Bangalore', destination: 'Chennai', duration: 6 },
      { origin: 'Delhi', destination: 'Jaipur', duration: 5 },
      { origin: 'Hyderabad', destination: 'Vijayawada', duration: 4 },
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);

      routes.forEach((route, index) => {
        const bus = buses[index % buses.length];
        const departureHour = 8 + index * 2;
        const arrivalHour = departureHour + route.duration;

        schedules.push({
          bus: bus._id,
          origin: route.origin,
          destination: route.destination,
          departureTime: `${departureHour.toString().padStart(2, '0')}:00`,
          arrivalTime: `${arrivalHour.toString().padStart(2, '0')}:00`,
          date: date,
          price: 500 + index * 100,
          availableSeats: bus.totalSeats,
          bookedSeats: [],
        });
      });
    }

    await Schedule.insertMany(schedules);
    console.log('Schedules created');

    console.log('Seed data created successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@busbooking.com');
    console.log('Password: admin123');
    console.log('\nUser credentials:');
    console.log('Email: john@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
