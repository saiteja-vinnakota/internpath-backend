import express from "express";

import cors from "cors";

import helmet from "helmet";

import compression from "compression";

import morgan from "morgan";

import routes from "./routes/index.js";

import notFoundMiddleware from "./middleware/notFoundMiddleware.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

import apiLimiter from "./middleware/rateLimiter.js";

const app = express();

// Security Headers
app.use(helmet());

// Rate Limiting
app.use(apiLimiter);

// Compression
app.use(compression());

// Logging
app.use(morgan("dev"));

// CORS
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],

    credentials: true,
  }),
);

// Body Parser
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Health Check
app.get(
  "/",

  (req, res) => {
    res.status(200).json({
      success: true,

      message: "InternPath API Running Successfully",
    });
  },
);

// API Routes
app.use("/api", routes);

// Not Found Middleware
app.use(notFoundMiddleware);

// Global Error Middleware
app.use(errorMiddleware);

export default app;
