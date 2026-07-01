import "./config/env.js";

import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./sockets/notificationSocket.js";
import { closeExpiredJobs } from "./services/jobService.js";

const PORT = process.env.PORT || 5000;
const JOB_CLOSE_INTERVAL = 5 * 60 * 1000;

// ─────────────────────────────────────────────────────────────
// Mongoose Events
// ─────────────────────────────────────────────────────────────

mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("🔴 MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err.message);
});

// ─────────────────────────────────────────────────────────────
// Background Jobs
// ─────────────────────────────────────────────────────────────

const scheduleExpiredJobClose = () => {
  setInterval(async () => {
    try {
      const result = await closeExpiredJobs();

      if (result.modifiedCount > 0) {
        console.log(
          `🔒 Closed ${result.modifiedCount} expired internship(s)`
        );
      }
    } catch (err) {
      console.error("❌ Error closing expired jobs:", err);
    }
  }, JOB_CLOSE_INTERVAL);
};

// ─────────────────────────────────────────────────────────────
// Server Bootstrap
// ─────────────────────────────────────────────────────────────

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    initializeSocket(io);

    // Run immediately
    await closeExpiredJobs();

    // Schedule background task
    scheduleExpiredJobClose();

    server.listen(PORT, () => {
      console.log(
        `✅ Server running on port ${PORT} [${process.env.NODE_ENV}]`
      );
    });

    const shutdown = (signal) => {
      console.log(`\n⚠️ ${signal} received. Shutting down...`);

      server.close(async () => {
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

// ─────────────────────────────────────────────────────────────
// Global Error Handlers
// ─────────────────────────────────────────────────────────────

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

// ─────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────

startServer();