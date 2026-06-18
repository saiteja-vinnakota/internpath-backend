import "./config/env.js";

import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./sockets/notificationSocket.js";
import { closeExpiredJobs } from "./services/jobService.js";

const PORT = process.env.PORT || 5000;

// ─── Server Bootstrap ────────────────────────────────────────────────────────

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*", // avoid wildcard in production
      methods: ["GET", "POST"],
    },
  });

  initializeSocket(io);

  await closeExpiredJobs();
  scheduleExpiredJobClose();

  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n⚠️  ${signal} received — shutting down gracefully`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log("🔌 MongoDB connection closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM")); // Render/cloud sends this
  process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C in dev
};

// ─── Mongoose Events ─────────────────────────────────────────────────────────

mongoose.connection.on("connected", () => console.log("🟢 MongoDB connected"));
mongoose.connection.on("disconnected", () =>
  console.log("🔴 MongoDB disconnected"),
);
mongoose.connection.on("reconnected", () =>
  console.log("🔄 MongoDB reconnected"),
);
mongoose.connection.on("error", (err) =>
  console.error("❌ MongoDB error:", err.message),
);

const scheduleExpiredJobClose = () => {
  const interval = 5 * 60 * 1000; // every 5 minutes

  setInterval(async () => {
    try {
      const result = await closeExpiredJobs();

      if (result.modifiedCount) {
        console.log(`🔒 Closed ${result.modifiedCount} expired internship(s)`);
      }
    } catch (err) {
      console.error("❌ Error closing expired jobs:", err);
    }
  }, interval);
};

// ─── Global Error Handlers ───────────────────────────────────────────────────

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
  process.exit(1); // fail fast — let the process manager restart
});

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

// ─── Start ───────────────────────────────────────────────────────────────────

startServer();
