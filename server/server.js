import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectMongoDB from "./config/mongodb.js";
import { authRouter } from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectMongoDB();

// Configure CORS options
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(express.json({ limit: "10kb" })); // Limit JSON body size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is working",
    documentation: process.env.DOCS_URL || "Coming soon",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// 404 handler - Commented out temporarily to debug server startup
// app.all("*", (req, res) => {
//   res.status(404).json({
//     status: "fail",
//     message: "Route not found",
//   });
// });

// Error handling middleware (should be last)
app.use(errorHandler);

// Server setup
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

export default app;

