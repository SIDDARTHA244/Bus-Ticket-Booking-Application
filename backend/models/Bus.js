import mongoose from 'mongoose';

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
    },
    busName: {
      type: String,
      required: true,
    },
    busType: {
      type: String,
      enum: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'],
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      default: 40,
    },
    amenities: [String],
    operator: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Bus = mongoose.model('Bus', busSchema);

export default Bus;
