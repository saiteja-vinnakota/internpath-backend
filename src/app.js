import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import routes from "./routes/index.js";
import apiLimiter from "./middleware/rateLimiter.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

// 1. Security headers
app.use(helmet());

// 2. CORS
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    credentials: true,
  })
);

// 3. Request logging
app.use(morgan("dev"));

// 4. Compression
app.use(compression());

// 5. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Health check 
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "InternPath API Running Successfully",
  });
});

// 7. Rate limiting 
app.use("/api", apiLimiter);

// 8. API routes
app.use("/api", routes);

// 9. 404 handler
app.use(notFoundMiddleware);

// 10. Global error handler 
app.use(errorMiddleware);

export default app;