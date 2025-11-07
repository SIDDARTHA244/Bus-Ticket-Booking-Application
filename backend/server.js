import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import busRoutes from "./routes/buses.js";
import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// ====== Middleware ======
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // allow frontend
  credentials: true,
}));
app.use(express.json());

// ====== Health Check Routes ======
app.get("/", (req, res) => {
  res.send("✅ Bus Booking API is running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Bus Booking API is healthy 🚀",
  });
});

// ====== Main Routes ======
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// ====== Error Handler ======
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// ====== Start Server ======
const startServer = async () => {
  try {
    await connectDB();

    // Use 0.0.0.0 to ensure visibility from localhost, 127.0.0.1, and Vite proxy
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running and listening on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
